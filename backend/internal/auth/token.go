/*
 * ============================================================================
 * internal/auth/token.go — SHARED JWT HELPERS
 *
 * Lives outside the api layer so both the HTTP middleware (per-request
 * validation) and the auth service (issue/rotate/revoke) use the same parsing,
 * revocation and token-type rules without one depending on the other.
 * ============================================================================
 */

package auth

import (
	"context"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"
)

const (
	// TokenTypeAccess marks a short-lived token valid for the protected API.
	TokenTypeAccess = "access"
	// TokenTypeRefresh marks a long-lived token only usable on /auth/refresh.
	TokenTypeRefresh = "refresh"
)

const revokedTokenKeyPrefix = "auth:revoked:"

// Parse validates a signed JWT, enforces the HMAC signing method and returns
// its claims.
func Parse(tokenString, jwtSecret string) (jwt.MapClaims, error) {
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

// IsRevoked reports whether a token's ID has been blacklisted (e.g. via logout
// or refresh-token rotation).
func IsRevoked(ctx context.Context, rdb *redis.Client, jti string) (bool, error) {
	revoked, err := rdb.Exists(ctx, revokedTokenKeyPrefix+jti).Result()
	if err != nil {
		return false, err
	}
	return revoked > 0, nil
}

// Revoke blacklists a token ID (recording its type) until its natural
// expiration so it can no longer be presented.
func Revoke(ctx context.Context, rdb *redis.Client, jti, tokenType string, expiresAt time.Time) error {
	ttl := time.Until(expiresAt)
	if ttl <= 0 {
		return fmt.Errorf("token is already expired")
	}
	return rdb.Set(ctx, revokedTokenKeyPrefix+jti, tokenType, ttl).Err()
}