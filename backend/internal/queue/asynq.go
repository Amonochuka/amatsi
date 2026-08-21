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
	"crypto/tls"
	"fmt"
	"net/url"
	"strconv"
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

// ParseRedisURL converts redis:// and rediss:// URLs into an Asynq connection
// option. rediss:// enables TLS, which is required by hosted Redis providers
// such as Upstash.
func ParseRedisURL(redisURL string) (asynq.RedisClientOpt, error) {
	u, err := url.Parse(redisURL)
	if err != nil {
		return asynq.RedisClientOpt{}, fmt.Errorf("failed to parse Redis URL: %w", err)
	}
	if u.Scheme != "redis" && u.Scheme != "rediss" {
		return asynq.RedisClientOpt{}, fmt.Errorf("unsupported Redis URL scheme: %q", u.Scheme)
	}
	if u.Hostname() == "" {
		return asynq.RedisClientOpt{}, fmt.Errorf("Redis URL must include a host")
	}

	addr := u.Host
	if !strings.Contains(addr, ":") {
		addr = addr + ":6379"
	}

	username := ""
	password := ""
	if u.User != nil {
		username = u.User.Username()
		password, _ = u.User.Password()
	}

	db := 0
	if path := strings.TrimPrefix(u.EscapedPath(), "/"); path != "" {
		parsedDB, err := strconv.Atoi(path)
		if err != nil || parsedDB < 0 {
			return asynq.RedisClientOpt{}, fmt.Errorf("invalid Redis database in URL: %q", u.Path)
		}
		db = parsedDB
	}

	opt := asynq.RedisClientOpt{
		Addr:     addr,
		Username: username,
		Password: password,
		DB:       db,
	}

	if u.Scheme == "rediss" {
		opt.TLSConfig = &tls.Config{
			MinVersion: tls.VersionTLS12,
			ServerName: u.Hostname(),
		}
	}

	return opt, nil
}
