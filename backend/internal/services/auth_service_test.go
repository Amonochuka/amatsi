package services

import (
	"context"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/redis/go-redis/v9"

	"github.com/amatsi/backend/internal/auth"
	"github.com/amatsi/backend/internal/repository"
)

// newAuthServiceHarness builds an AuthService whose Redis is an in-memory
// miniredis. The user repository is never queried by the flows under test
// (refresh, validation, logout), so a nil-backed repo is safe here.
func newAuthServiceHarness(t *testing.T) (*AuthService, *miniredis.Miniredis) {
	t.Helper()
	mr := miniredis.RunT(t)
	rdb := redis.NewClient(&redis.Options{Addr: mr.Addr()})
	t.Cleanup(func() { rdb.Close() })

	svc := NewAuthService(
		repository.NewUserRepository(nil),
		rdb,
		"test-secret",
		15*time.Minute,
		30*24*time.Hour,
	)
	return svc, mr
}

// signToken reproduces the production claim layout so the service can be fed
// externally-issued tokens exactly as the HTTP layer would see them.
func signToken(t *testing.T, secret, userID, tokenType string, ttl time.Duration) (string, string, time.Time) {
	t.Helper()
	now := time.Now()
	jti := "jti-" + time.Now().Format("150405.000000000")
	exp := now.Add(ttl)
	claims := jwt.MapClaims{
		"sub": userID,
		"jti": jti,
		"typ": tokenType,
		"exp": exp.Unix(),
		"iat": now.Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(secret))
	if err != nil {
		t.Fatalf("signToken() error = %v", err)
	}
	return signed, jti, exp
}

func TestIssueSignedClaims(t *testing.T) {
	svc, _ := newAuthServiceHarness(t)

	token, err := svc.issueAccessToken("user-1")
	if err != nil {
		t.Fatalf("issueAccessToken() error = %v", err)
	}

	claims, err := auth.Parse(token, "test-secret")
	if err != nil {
		t.Fatalf("auth.Parse() error = %v", err)
	}

	if claims["sub"] != "user-1" {
		t.Errorf("sub = %v, want user-1", claims["sub"])
	}
	if jti, ok := claims["jti"].(string); !ok || jti == "" {
		t.Errorf("jti = %v, want non-empty unique id", claims["jti"])
	}
	if claims["typ"] != auth.TokenTypeAccess {
		t.Errorf("typ = %v, want %q", claims["typ"], auth.TokenTypeAccess)
	}

	// exp must be ~15m ahead of iat (the configured access TTL).
	iat := time.Unix(int64(claims["iat"].(float64)), 0)
	exp := time.Unix(int64(claims["exp"].(float64)), 0)
	if got := exp.Sub(iat); got != 15*time.Minute {
		t.Errorf("token lifetime = %v, want 15m", got)
	}
}

func TestIssueTokenPairSeparateTypes(t *testing.T) {
	svc, _ := newAuthServiceHarness(t)

	pair, err := svc.issueTokenPair("user-1")
	if err != nil {
		t.Fatalf("issueTokenPair() error = %v", err)
	}
	if pair.AccessToken == pair.RefreshToken {
		t.Fatal("access and refresh tokens are identical")
	}

	accessClaims, err := auth.Parse(pair.AccessToken, "test-secret")
	if err != nil {
		t.Fatalf("parse access token: %v", err)
	}
	refreshClaims, err := auth.Parse(pair.RefreshToken, "test-secret")
	if err != nil {
		t.Fatalf("parse refresh token: %v", err)
	}
	if accessClaims["typ"] != auth.TokenTypeAccess {
		t.Errorf("access typ = %v, want %q", accessClaims["typ"], auth.TokenTypeAccess)
	}
	if refreshClaims["typ"] != auth.TokenTypeRefresh {
		t.Errorf("refresh typ = %v, want %q", refreshClaims["typ"], auth.TokenTypeRefresh)
	}
}

func TestRefreshRotatesAndBlacklistsOldToken(t *testing.T) {
	svc, _ := newAuthServiceHarness(t)
	ctx := context.Background()

	oldRefresh, oldJTI, _ := signToken(t, "test-secret", "user-1", auth.TokenTypeRefresh, 30*24*time.Hour)

	pair, err := svc.Refresh(ctx, oldRefresh)
	if err != nil {
		t.Fatalf("Refresh() error = %v", err)
	}
	if pair.RefreshToken == oldRefresh {
		t.Fatal("Refresh() returned the same refresh token; rotation did not happen")
	}

	// The old refresh token must be dead on the second attempt.
	if _, _, _, err := svc.ValidateRefreshToken(ctx, oldRefresh); err != ErrRevokedToken {
		t.Errorf("ValidateRefreshToken(old) error = %v, want ErrRevokedToken", err)
	}
	revoked, _ := auth.IsRevoked(ctx, svc.rdb, oldJTI)
	if !revoked {
		t.Fatal("old refresh jti was never blacklisted")
	}

	// The replacement is itself valid for another rotation.
	if _, _, _, err := svc.ValidateRefreshToken(ctx, pair.RefreshToken); err != nil {
		t.Errorf("ValidateRefreshToken(new) error = %v, want nil", err)
	}
}

func TestRefreshRejectsAccessToken(t *testing.T) {
	svc, _ := newAuthServiceHarness(t)
	ctx := context.Background()

	access, _, _ := signToken(t, "test-secret", "user-1", auth.TokenTypeAccess, 15*time.Minute)
	if _, err := svc.Refresh(ctx, access); err != ErrInvalidToken {
		t.Errorf("Refresh(access token) error = %v, want ErrInvalidToken", err)
	}
}

func TestRefreshRejectsBadSignature(t *testing.T) {
	svc, _ := newAuthServiceHarness(t)
	ctx := context.Background()

	forged, _, _ := signToken(t, "wrong-secret", "user-1", auth.TokenTypeRefresh, 30*24*time.Hour)
	if _, err := svc.Refresh(ctx, forged); err != ErrInvalidToken {
		t.Errorf("Refresh(forged) error = %v, want ErrInvalidToken", err)
	}
}

func TestRefreshRejectsMissingJTI(t *testing.T) {
	svc, _ := newAuthServiceHarness(t)
	ctx := context.Background()

	claims := jwt.MapClaims{
		"sub": "user-1",
		"typ": auth.TokenTypeRefresh,
		"exp": time.Now().Add(24 * time.Hour).Unix(),
		"iat": time.Now().Unix(),
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	noJti, err := tok.SignedString([]byte("test-secret"))
	if err != nil {
		t.Fatalf("sign no-jti token: %v", err)
	}

	if _, err := svc.Refresh(ctx, noJti); err != ErrInvalidToken {
		t.Errorf("Refresh(no jti) error = %v, want ErrInvalidToken", err)
	}
}

func TestRefreshRejectsEmptyToken(t *testing.T) {
	svc, _ := newAuthServiceHarness(t)
	ctx := context.Background()

	if _, err := svc.Refresh(ctx, "  "); err != ErrRefreshTokenRequired {
		t.Errorf("Refresh(blank) error = %v, want ErrRefreshTokenRequired", err)
	}
}

func TestLogoutRevokesAccessTokenOnly(t *testing.T) {
	svc, _ := newAuthServiceHarness(t)
	ctx := context.Background()

	access, accessJTI, accessExp := signToken(t, "test-secret", "user-1", auth.TokenTypeAccess, 15*time.Minute)

	if err := svc.Logout(ctx, accessJTI, accessExp, ""); err != nil {
		t.Fatalf("Logout() error = %v", err)
	}

	revoked, _ := auth.IsRevoked(ctx, svc.rdb, accessJTI)
	if !revoked {
		t.Fatal("access token was not revoked on logout")
	}
	// The middleware test (api/middleware) asserts a revoked access token is
	// rejected with 401; here the blacklist entry is the source of truth.
	_ = access
}

func TestLogoutRevokesRefreshTokenToo(t *testing.T) {
	svc, _ := newAuthServiceHarness(t)
	ctx := context.Background()

	refresh, refreshJTI, _ := signToken(t, "test-secret", "user-1", auth.TokenTypeRefresh, 30*24*time.Hour)

	// No valid access token in hand (mimics a client that only kept the
	// refresh) — access revocation is skipped, refresh must still die.
	if err := svc.Logout(ctx, "", time.Time{}, refresh); err != nil {
		t.Fatalf("Logout() error = %v", err)
	}

	revoked, _ := auth.IsRevoked(ctx, svc.rdb, refreshJTI)
	if !revoked {
		t.Fatal("refresh token was not revoked on logout")
	}
	if _, err := svc.Refresh(ctx, refresh); err != ErrRevokedToken {
		t.Errorf("Refresh(revoked) error = %v, want ErrRevokedToken", err)
	}
}