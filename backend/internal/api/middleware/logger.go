/*
 * ============================================================================
 * internal/api/middleware/logger.go — REQUEST LOGGER MIDDLEWARE
 * Component: Person A + <Go API / Team Lead>
 *
 * Logs every HTTP request so the team can debug, audit SMS sends, and spot
 * failing upstream calls. Uses structured JSON logging via log/slog.
 * ============================================================================
 */

package middleware

import (
	"log/slog"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

// RequestLogger returns a Gin middleware that logs each request as a single
// structured JSON line: method, path, status, latency, client IP, user ID.
// Never logs request/response bodies to avoid leaking sensitive data.
func RequestLogger() gin.HandlerFunc {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))

	return func(c *gin.Context) {
		start := time.Now()

		// Process the request
		c.Next()

		// Determine user ID (from JWT context, or "anonymous")
		userID := "anonymous"
		if id, exists := c.Get(ContextUserIDKey); exists {
			if uid, ok := id.(string); ok && uid != "" {
				userID = uid
			}
		}

		latency := time.Since(start)

		logger.Info("request",
			slog.String("method", c.Request.Method),
			slog.String("path", c.Request.URL.Path),
			slog.Int("status", c.Writer.Status()),
			slog.String("latency", latency.String()),
			slog.Float64("latency_ms", float64(latency.Milliseconds())),
			slog.String("client_ip", c.ClientIP()),
			slog.String("user_id", userID),
		)
	}
}