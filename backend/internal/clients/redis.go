/*
 * ============================================================================
 * internal/clients/redis.go — REDIS CLIENT
 * Component: Person B + <Database / Repos / Clients>
 *
 * Wraps go-redis for two jobs: caching weather/soil API responses
 * (TTL 1h) and serving as the Asynq task-queue broker.
 * ============================================================================
 */

package clients

import (
	"context"
	"fmt"

	"github.com/redis/go-redis/v9"
)

// NewRedisClient creates a Redis client from an Upstash-style redis:// URL.
// It verifies connectivity with a Ping before returning.
func NewRedisClient(ctx context.Context, redisURL string) (*redis.Client, error) {
	opts, err := redis.ParseURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse Redis URL: %w", err)
	}

	client := redis.NewClient(opts)

	// Verify connectivity
	if err := client.Ping(ctx).Err(); err != nil {
		_ = client.Close()
		return nil, fmt.Errorf("failed to ping Redis: %w", err)
	}

	return client, nil
}