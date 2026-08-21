/*
 * ============================================================================
 * internal/api/middleware/cors.go — CORS MIDDLEWARE
 * Component: Person A + <Go API / Team Lead>
 *
 * Allows the Vercel-hosted Next.js frontend to call the Go API from the
 * browser (and handles preflight OPTIONS).
 * ============================================================================
 */

package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORSMiddleware returns a Gin middleware that configures CORS for the
// provided frontend origin(s). In dev this includes localhost; in prod
// it should be restricted to the deployed Vercel URL(s).
func CORSMiddleware(allowedOrigins []string) gin.HandlerFunc {
	config := cors.Config{
		AllowOrigins: allowedOrigins,
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Accept",
			"Authorization",
			"X-Requested-With",
		},
		ExposeHeaders:    []string{"Content-Length", "Content-Type"},
		AllowCredentials: false, // JWT-based auth, not cookies
		MaxAge:           12 * time.Hour,
	}

	return cors.New(config)
}