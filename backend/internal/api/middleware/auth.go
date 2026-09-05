/*
 * ============================================================================
 * internal/api/middleware/auth.go — JWT AUTH MIDDLEWARE
 * Component: Person A + <Go API / Team Lead>
 *
 * Validates the Bearer JWT on protected routes and injects the caller's
 * farmer/user ID into the Gin context so handlers can scope data by user.
 * ============================================================================
 */

package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
)

const (
	// ContextUserIDKey is the Gin context key used to store the authenticated user's ID.
	ContextUserIDKey = "userID"
	// ContextJWTIDKey identifies the token being used, so logout can revoke it.
	ContextJWTIDKey = "jwtID"
	// ContextJWTExpiryKey stores the authenticated token's expiry time.
	ContextJWTExpiryKey = "jwtExpiry"

	// AccessTokenType and RefreshTokenType distinguish the two kinds of JWT we
	// issue so a refresh token can never be used on a protected API route.
	AccessTokenType  = "access"
	RefreshTokenType = "refresh"

	revokedTokenKeyPrefix = "auth:revoked:"
)

// JWTAuthMiddleware returns a Gin middleware that validates Bearer JWT tokens.
// On success it places the user ID (from the "sub" claim) into the Gin context.
// On failure it responds with 401 and aborts the request.
func JWTAuthMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Validate Bearer prefix
		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header must start with 'Bearer '"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := ParseJWT(tokenString, jwtSecret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		if tokType, ok := claims["typ"].(string); !ok || tokType != AccessTokenType {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Extract user ID from "sub" claim
		sub, ok := claims["sub"]
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token missing 'sub' claim"})
			c.Abort()
			return
		}

		userID, ok := sub.(string)
		if !ok || userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid 'sub' claim in token"})
			c.Abort()
			return
		}

		jwtID, ok := claims["jti"].(string)
		if !ok || jwtID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token missing 'jti' claim"})
			c.Abort()
			return
		}

		expiresAtUnix, ok := claims["exp"].(float64)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token missing expiry"})
			c.Abort()
			return
		}
		expiresAt := time.Unix(int64(expiresAtUnix), 0)

		if redisClient, exists := c.Get("redis_client"); exists {
			rdb, ok := redisClient.(*redis.Client)
			if !ok {
				c.JSON(http.StatusServiceUnavailable, gin.H{"error": "authentication service unavailable"})
				c.Abort()
				return
			}

			revoked, err := IsRevoked(c.Request.Context(), rdb, jwtID)
			if err != nil {
				c.JSON(http.StatusServiceUnavailable, gin.H{"error": "authentication service unavailable"})
				c.Abort()
				return
			}
			if revoked {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has been revoked"})
				c.Abort()
				return
			}
		}

		// Set user ID in context for downstream handlers
		c.Set(ContextUserIDKey, userID)
		c.Set(ContextJWTIDKey, jwtID)
		c.Set(ContextJWTExpiryKey, expiresAt)
		c.Next()
	}
}

// ParseJWT validates a signed JWT and returns its claims. It enforces the
// HMAC signing method so a token signed with anything else is rejected.
func ParseJWT(tokenString string, jwtSecret string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token claims")
	}
	return claims, nil
}

// IsRevoked reports whether a token's ID has been revoked (e.g. via logout).
func IsRevoked(ctx context.Context, rdb *redis.Client, jti string) (bool, error) {
	revoked, err := rdb.Exists(ctx, revokedTokenKeyPrefix+jti).Result()
	if err != nil {
		return false, err
	}
	return revoked > 0, nil
}

// revokeJWT records a token ID (and its type) in Redis until its natural
// expiration so it can no longer be used.
func revokeJWT(ctx context.Context, rdb *redis.Client, jti, tokenType string, expiresAt time.Time) error {
	ttl := time.Until(expiresAt)
	if ttl <= 0 {
		return fmt.Errorf("token is already expired")
	}
	return rdb.Set(ctx, revokedTokenKeyPrefix+jti, tokenType, ttl).Err()
}

// RevokeToken records the authenticated access token's ID in Redis until its
// normal expiration time, invalidating it for subsequent requests.
func RevokeToken(c *gin.Context) error {
	jwtID, ok := c.Get(ContextJWTIDKey)
	if !ok {
		return fmt.Errorf("authenticated token ID is missing")
	}
	expiresAt, ok := c.Get(ContextJWTExpiryKey)
	if !ok {
		return fmt.Errorf("authenticated token expiry is missing")
	}

	id, ok := jwtID.(string)
	if !ok || id == "" {
		return fmt.Errorf("authenticated token ID is invalid")
	}
	expiry, ok := expiresAt.(time.Time)
	if !ok {
		return fmt.Errorf("authenticated token expiry is invalid")
	}

	redisClient, exists := c.Get("redis_client")
	if !exists {
		return fmt.Errorf("redis client is unavailable")
	}
	rdb, ok := redisClient.(*redis.Client)
	if !ok {
		return fmt.Errorf("redis client is invalid")
	}

	return revokeJWT(c.Request.Context(), rdb, id, AccessTokenType, expiry)
}

// RevokeRefreshToken invalidates a refresh token by its ID until its natural
// expiration. It returns an error if the token is already expired.
func RevokeRefreshToken(c *gin.Context, jti string, expiresAt time.Time) error {
	redisClient, exists := c.Get("redis_client")
	if !exists {
		return fmt.Errorf("redis client is unavailable")
	}
	rdb, ok := redisClient.(*redis.Client)
	if !ok {
		return fmt.Errorf("redis client is invalid")
	}
	return revokeJWT(c.Request.Context(), rdb, jti, RefreshTokenType, expiresAt)
}

// GetUserIDFromContext retrieves the authenticated user's ID from the Gin context.
// Returns the user ID and true if found, or empty string and false if not.
func GetUserIDFromContext(c *gin.Context) (string, bool) {
	userID, exists := c.Get(ContextUserIDKey)
	if !exists {
		return "", false
	}
	id, ok := userID.(string)
	return id, ok
}
