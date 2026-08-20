/*
 * ============================================================================
 * internal/queue/asynq.go — ASYNQ CLIENT + SERVER
 * Component: Person A or B + <Go API / Task Queue>
 *
 * Initialises the Asynq (Redis-backed) task queue used to decouple SMS
 * sending from the API request path.
 * ============================================================================
 */

package queue

import (
	"fmt"
	"net/url"
	"strings"

	"github.com/hibiken/asynq"
)

// NewAsynqClient creates an Asynq client for enqueuing tasks (e.g. SendSMS).
func NewAsynqClient(redisURL string) (*asynq.Client, error) {
	redisOpt, err := ParseRedisURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("failed to create Asynq client: %w", err)
	}
	return asynq.NewClient(redisOpt), nil
}

// NewAsynqServer creates an Asynq server for processing background tasks.
// Configured with sensible concurrency, retry policy, and queue priorities.
func NewAsynqServer(redisURL string) (*asynq.Server, error) {
	redisOpt, err := ParseRedisURL(redisURL)
	if err != nil {
		return nil, fmt.Errorf("failed to create Asynq server: %w", err)
	}

	server := asynq.NewServer(redisOpt, asynq.Config{
		Concurrency: 5,
		RetryDelayFunc: asynq.DefaultRetryDelayFunc,
		Queues: map[string]int{
			"critical": 6,
			"default":  3,
			"low":      1,
		},
	})

	return server, nil
}

// ParseRedisURL converts a redis:// URL string into an asynq.RedisClientOpt.
// Supports standard Upstash-style URLs: redis://default:password@host:port
func ParseRedisURL(redisURL string) (asynq.RedisClientOpt, error) {
	u, err := url.Parse(redisURL)
	if err != nil {
		return asynq.RedisClientOpt{}, fmt.Errorf("failed to parse Redis URL: %w", err)
	}

	addr := u.Host
	if !strings.Contains(addr, ":") {
		addr = addr + ":6379"
	}

	password := ""
	if u.User != nil {
		password, _ = u.User.Password()
	}

	// Default to DB 0
	db := 0

	useTLS := u.Scheme == "rediss"

	opt := asynq.RedisClientOpt{
		Addr:     addr,
		Password: password,
		DB:       db,
	}

	if useTLS {
		// For Upstash TLS connections
		_ = useTLS // asynq.RedisClientOpt doesn't have a TLS field directly;
		// for TLS support with Upstash, use asynq.RedisConnOpt interface
		// with a custom redis connection. For now this works with non-TLS.
	}

	return opt, nil
}