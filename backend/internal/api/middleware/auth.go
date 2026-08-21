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

		// Parse and validate the JWT
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Ensure the signing method is HMAC
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(jwtSecret), nil
		})

		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
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

			revoked, err := rdb.Exists(c.Request.Context(), revokedTokenKeyPrefix+jwtID).Result()
			if err != nil {
				c.JSON(http.StatusServiceUnavailable, gin.H{"error": "authentication service unavailable"})
				c.Abort()
				return
			}
			if revoked > 0 {
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

// RevokeToken records a JWT ID in Redis until its normal expiration time.
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

	ttl := time.Until(expiry)
	if ttl <= 0 {
		return fmt.Errorf("token is already expired")
	}

	redisClient, exists := c.Get("redis_client")
	if !exists {
		return fmt.Errorf("redis client is unavailable")
	}
	rdb, ok := redisClient.(*redis.Client)
	if !ok {
		return fmt.Errorf("redis client is invalid")
	}

	return rdb.Set(c.Request.Context(), revokedTokenKeyPrefix+id, "1", ttl).Err()
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
