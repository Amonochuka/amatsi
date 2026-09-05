package auth

import (
	"context"
	"testing"
	"time"

	"github.com/alicebob/miniredis/v2"
	"github.com/redis/go-redis/v9"
)

func newTestRedis(t *testing.T) *redis.Client {
	t.Helper()
	mr := miniredis.RunT(t)
	client := redis.NewClient(&redis.Options{Addr: mr.Addr()})
	t.Cleanup(func() { client.Close() })
	return client
}

func TestRevokeAndIsRevoked(t *testing.T) {
	ctx := context.Background()
	rdb := newTestRedis(t)

	exp := time.Now().Add(10 * time.Minute)
	if err := Revoke(ctx, rdb, "abc-123", TokenTypeRefresh, exp); err != nil {
		t.Fatalf("Revoke() error = %v", err)
	}

	revoked, err := IsRevoked(ctx, rdb, "abc-123")
	if err != nil {
		t.Fatalf("IsRevoked() error = %v", err)
	}
	if !revoked {
		t.Fatal("IsRevoked() = false, want true after Revoke")
	}

	revoked, err = IsRevoked(ctx, rdb, "never-revoked")
	if err != nil {
		t.Fatalf("IsRevoked() error = %v", err)
	}
	if revoked {
		t.Fatal("IsRevoked() = true for a never-revoked jti")
	}
}

func TestRevokeRefusesAlreadyExpiredToken(t *testing.T) {
	ctx := context.Background()
	rdb := newTestRedis(t)

	err := Revoke(ctx, rdb, "stale", TokenTypeAccess, time.Now().Add(-time.Minute))
	if err == nil {
		t.Fatal("Revoke() accepted an already-expired token, want error")
	}
}

func TestRevokeSetsTTLTiedToTokenExpiry(t *testing.T) {
	mr := miniredis.RunT(t)
	rdb := redis.NewClient(&redis.Options{Addr: mr.Addr()})
	defer rdb.Close()

	// 30s until the token expires -> blacklist entry must die in ~30s too.
	exp := time.Now().Add(30 * time.Second)
	if err := Revoke(context.Background(), rdb, "short-lived", TokenTypeAccess, exp); err != nil {
		t.Fatalf("Revoke() error = %v", err)
	}

	// Advance the fake clock past expiry: the key should be gone.
	mr.FastForward(31 * time.Second)
	revoked, err := IsRevoked(context.Background(), rdb, "short-lived")
	if err != nil {
		t.Fatalf("IsRevoked() error = %v", err)
	}
	if revoked {
		t.Fatal("blacklist entry still present after token expiry, want auto-expired")
	}
}