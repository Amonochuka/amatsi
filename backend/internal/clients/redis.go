package clients

import (
	"fmt"

	"github.com/redis/go-redis/v9"
)

// NewRedisClient creates a Redis client using the provided address (e.g., "localhost:6379").
// For production, use Upstash Redis TLS URL.
func NewRedisClient(addr string) (*redis.Client, error) {
	opts, err := redis.ParseURL(addr)
	if err != nil {
		// addr might be a plain host:port rather than a full URL — fall back to Options
		opts = &redis.Options{
			Addr: addr,
		}
	}

	client := redis.NewClient(opts)

	// Asynq manages its own Redis connection via the address string,
	// but we expose this client for any direct caching needs.
	if client == nil {
		return nil, fmt.Errorf("failed to create redis client")
	}

	return client, nil
}
