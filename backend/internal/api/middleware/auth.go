/*
 * ============================================================================
 * internal/api/middleware/auth.go — JWT AUTH MIDDLEWARE
 *
 * Validates the Bearer JWT on protected routes and injects the caller's
 * farmer/user ID into the Gin context so handlers can scope data by user.
 * Token parsing and Redis revocation live in the shared internal/auth package
 * so the auth service can reuse the exact same rules.
 * ============================================================================
 */

package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"

	"github.com/amatsi/backend/internal/auth"
)

const (
	// ContextUserIDKey is the Gin context key used to store the authenticated user's ID.
	ContextUserIDKey = "userID"
	// ContextJWTIDKey identifies the token being used, so logout can revoke it.
	ContextJWTIDKey = "jwtID"
	// ContextJWTExpiryKey stores the authenticated token's expiry time.
	ContextJWTExpiryKey = "jwtExpiry"
)

// JWTAuthMiddleware returns a Gin middleware that validates Bearer JWT access
// tokens. On success it places the user ID (from the "sub" claim), JWT ID, and
// expiry into the Gin context. On failure it responds with 401 and aborts.
func JWTAuthMiddleware(jwtSecret string, rdb *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header must start with 'Bearer '"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := auth.Parse(tokenString, jwtSecret)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Only access tokens may hit protected routes — a refresh token is
		// rejected here even though it is cryptographically valid.
		if tokType, ok := claims["typ"].(string); !ok || tokType != auth.TokenTypeAccess {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		userID, ok := claims["sub"].(string)
		if !ok || userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token missing 'sub' claim"})
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

		revoked, err := auth.IsRevoked(c.Request.Context(), rdb, jwtID)
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

		c.Set(ContextUserIDKey, userID)
		c.Set(ContextJWTIDKey, jwtID)
		c.Set(ContextJWTExpiryKey, expiresAt)
		c.Next()
	}
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