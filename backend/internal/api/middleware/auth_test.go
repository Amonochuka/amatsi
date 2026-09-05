package middleware

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"

	"github.com/amatsi/backend/internal/auth"
)

const testJWTSecret = "middleware-test-secret"

func setupRouter(t *testing.T) (*gin.Engine, *redis.Client) {
	t.Helper()
	gin.SetMode(gin.TestMode)

	mr := miniredis.RunT(t)
	rdb := redis.NewClient(&redis.Options{Addr: mr.Addr()})
	t.Cleanup(func() { rdb.Close() })

	r := gin.New()
	r.Use(JWTAuthMiddleware(testJWTSecret, rdb))
	r.GET("/protected", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"userID": c.GetString(ContextUserIDKey),
			"jwtID":  c.GetString(ContextJWTIDKey),
		})
	})
	return r, rdb
}

func signJWT(t *testing.T, secret, userID, tokenType string) string {
	t.Helper()
	now := time.Now()
	claims := jwt.MapClaims{
		"sub": userID,
		"jti": time.Now().Format("150405.000000000"),
		"typ": tokenType,
		"exp": now.Add(15 * time.Minute).Unix(),
		"iat": now.Unix(),
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := tok.SignedString([]byte(secret))
	if err != nil {
		t.Fatalf("signJWT() error = %v", err)
	}
	return signed
}

func doRequest(r *gin.Engine, header string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodGet, "/protected", nil)
	if header != "" {
		req.Header.Set("Authorization", header)
	}
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

func TestAuthMiddlewareAcceptsValidAccessToken(t *testing.T) {
	r, _ := setupRouter(t)

	token := signJWT(t, testJWTSecret, "user-42", auth.TokenTypeAccess)
	w := doRequest(r, "Bearer "+token)

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200 (body: %s)", w.Code, w.Body.String())
	}
	if got := w.Body.String(); !strings.Contains(got, "user-42") {
		t.Errorf("response does not carry the user id: %s", got)
	}
}

func TestAuthMiddlewareRequiresBearerHeader(t *testing.T) {
	r, _ := setupRouter(t)

	if w := doRequest(r, ""); w.Code != http.StatusUnauthorized {
		t.Errorf("no header: status = %d, want 401", w.Code)
	}
	if w := doRequest(r, "token-without-bearer"); w.Code != http.StatusUnauthorized {
		t.Errorf("non-Bearer header: status = %d, want 401", w.Code)
	}
}

func TestAuthMiddlewareRejectsBadSignature(t *testing.T) {
	r, _ := setupRouter(t)

	forged := signJWT(t, "someone-elses-secret", "user-42", auth.TokenTypeAccess)
	if w := doRequest(r, "Bearer "+forged); w.Code != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", w.Code)
	}
}

func TestAuthMiddlewareRejectsRefreshToken(t *testing.T) {
	r, _ := setupRouter(t)

	refresh := signJWT(t, testJWTSecret, "user-42", auth.TokenTypeRefresh)
	if w := doRequest(r, "Bearer "+refresh); w.Code != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", w.Code)
	}
}

func TestAuthMiddlewareRejectsRevokedToken(t *testing.T) {
	r, rdb := setupRouter(t)

	token := signJWT(t, testJWTSecret, "user-42", auth.TokenTypeAccess)
	claims, err := auth.Parse(token, testJWTSecret)
	if err != nil {
		t.Fatalf("auth.Parse() error = %v", err)
	}
	jti := claims["jti"].(string)
	exp := time.Unix(int64(claims["exp"].(float64)), 0)

	if err := auth.Revoke(t.Context(), rdb, jti, auth.TokenTypeAccess, exp); err != nil {
		t.Fatalf("auth.Revoke() error = %v", err)
	}

	w := doRequest(r, "Bearer "+token)
	if w.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want 401", w.Code)
	}
	if got := w.Body.String(); !strings.Contains(got, "revoked") {
		t.Errorf("expected revoked-token message, got: %s", got)
	}
}