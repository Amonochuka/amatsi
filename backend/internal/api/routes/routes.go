/*
 * ============================================================================
 * internal/api/routes/routes.go — ROUTE REGISTRATION (TOP LEVEL)
 * Component: Person A + <Go API / Team Lead>
 *
 * Central place that assembles the Gin router: mounts middleware, groups
 * routes, and delegates each group to the per-feature route files.
 *
 * WHAT NEEDS TO BE DONE:
 * - Create the router (done via main.go) and set up the route groups below.
 * - Group 1 — Public:
 *   POST /api/auth/login, POST /api/auth/signup, POST /api/auth/logout.
 * - Group 2 — Protected (JWT middleware, Feature 19.10):
 *   GET/POST /api/farms, GET/PUT/DELETE /api/farms/:id,
 *   GET /api/weather/:farmId, GET /api/soil/:farmId,
 *   GET /api/recommendations/:farmId, POST /api/recommendations/generate,
 *   POST /api/alerts/send, GET /api/alerts/history.
 * - Apply rate limiting (Feature 19.9) to the write/heavy endpoints.
 * - Wire each handler from internal/api/handlers into the router.
 * - Keep /health registered without auth (see docs/to-do-list.md).
 *
 * Feature references: 19.10, 19.9, 13.1.
 * ============================================================================
 */
package routes

import (
	"github.com/kijanifarmer/backend/internal/api/handlers"
	"github.com/kijanifarmer/backend/internal/api/middleware"
	"github.com/kijanifarmer/backend/internal/config"
)

func RegisterRoutes(router *gin.Engine, cfg *config.AppConfig) {
	// Public auth routes
	auth := router.Group("/api/auth")
	{
		auth.POST("/signup", handlers.SignupHandler)
		auth.POST("/login", handlers.LoginHandler)
		auth.POST("/logout", handlers.LogoutHandler)
	}

	// Protected route group
	api := router.Group("/api")
	api.Use(middleware.JWTAuthMiddleware(cfg.JWTSecret))
	{
		// Farms
		api.GET("/farms", handlers.GetFarmsHandler)
		api.POST("/farms", handlers.CreateFarmHandler)
		api.GET("/farms/:id", handlers.GetFarmHandler)
		api.PUT("/farms/:id", handlers.UpdateFarmHandler)
		api.DELETE("/farms/:id", handlers.DeleteFarmHandler)

		// Weather & Soil
		api.GET("/weather/:farmId", handlers.GetWeatherHandler)
		api.GET("/soil/:farmId", handlers.GetSoilMoistureHandler)

		// Recommendations
		api.GET("/recommendations/:farmId", handlers.GetRecommendationsHandler)
		api.POST("/recommendations/generate", handlers.GenerateRecommendationHandler)

		// Alerts / SMS
		api.POST("/alerts/send", handlers.SendAlertHandler)
		api.GET("/alerts/history", handlers.GetAlertHistoryHandler)
	}
}
