package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

// RateLimitMiddleware enforces a per-IP sliding window limit using Redis.
// limit: max requests per window; window: duration of the window.
func RateLimitMiddleware(rdb *redis.Client, limit int, window time.Duration) gin.HandlerFunc {
	if limit <= 0 {
		limit = 60
	}
	if window <= 0 {
		window = time.Minute
	}
	return func(c *gin.Context) {
		ip := c.ClientIP()
		key := fmt.Sprintf("ratelimit:%s:%s", c.FullPath(), ip)

		ctx := c.Request.Context()
		count, err := rdb.Incr(ctx, key).Result()
		if err != nil {
			c.Next()
			return
		}
		if count == 1 {
			_ = rdb.Expire(ctx, key, window).Err()
		}
		if count > int64(limit) {
			ttl, _ := rdb.TTL(ctx, key).Result()
			secs := int(ttl.Seconds())
			if secs < 1 {
				secs = int(window.Seconds())
			}
			c.Header("Retry-After", strconv.Itoa(secs))
			c.JSON(http.StatusTooManyRequests, gin.H{"error": "rate limit exceeded"})
			c.Abort()
			return
		}
		c.Next()
	}
}

// RateLimitFromEnv builds a RateLimitMiddleware using RATE_LIMIT_PER_MINUTE (default 60).
func RateLimitFromEnv(rdb *redis.Client) gin.HandlerFunc {
	limit := 60
	if v := os.Getenv("RATE_LIMIT_PER_MINUTE"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			limit = n
		}
	}
	return RateLimitMiddleware(rdb, limit, time.Minute)
}

// StrictRateLimitFromEnv is for write/expensive endpoints (default 10/min).
func StrictRateLimitFromEnv(rdb *redis.Client) gin.HandlerFunc {
	limit := 10
	if v := os.Getenv("RATE_LIMIT_STRICT_PER_MINUTE"); v != "" {
		if n, err := strconv.Atoi(v); err == nil && n > 0 {
			limit = n
		}
	}
	return RateLimitMiddleware(rdb, limit, time.Minute)
}
