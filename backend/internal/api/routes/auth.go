/*
 * ============================================================================
 * internal/api/routes/auth.go — AUTH ROUTES
 * Component: Person A + <Go API / Team Lead>
 *
 * Registers the public authentication endpoints onto the router.
 *
 * WHAT NEEDS TO BE DONE:
 * - Wire handlers from auth_handler.go to:
 *   POST /api/auth/login
 *   POST /api/auth/signup
 *   POST /api/auth/logout
 * - Keep this group public (no JWT middleware) — the handler layer issues
 *   tokens (Feature 19.10).
 * - Consider per-IP rate limiting on login/signup to slow brute force
 *   (Feature 19.9).
 *
 * Feature references: 19.10, 19.9.
 * ============================================================================
 */
package routes

import (
	"github.com/kijanifarmer/backend/internal/api/handlers"
	"github.com/kijanifarmer/backend/internal/config"
)

func RegisterAuthRoutes(router *gin.Engine, cfg *config.AppConfig) {
	auth := router.Group("/api/auth")
	{
		auth.POST("/signup", handlers.SignupHandler)
		auth.POST("/login", handlers.LoginHandler)
		auth.POST("/logout", handlers.LogoutHandler)
	}
}
