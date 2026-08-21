/*
 * ============================================================================
 * internal/api/routes/farms.go — FARM CRUD ROUTES
 * Component: Person A + <Go API / Team Lead>
 *
 * Registers the farm management routes (protected).
 *
 * WHAT NEEDS TO BE DONE:
 * - Wire handlers from farm_handler.go to:
 *   GET  /api/farms          → list caller's farms
 *   POST /api/farms          → create farm
 *   GET  /api/farms/:id      → single farm
 *   PUT  /api/farms/:id      → update farm
 *   DELETE /api/farms/:id    → delete farm
 * - Group under the JWT-protected middleware (Feature 19.10) and ensure
 *   every handler only returns farms owned by the authenticated user
 *   (Feature 19.11 RLS parity server-side).
 *
 * Feature references: 19.10, 19.11.
 * ============================================================================
 */
package routes

import (
	"github.com/kijanifarmer/backend/internal/api/handlers"
	"github.com/kijanifarmer/backend/internal/api/middleware"
	"github.com/kijanifarmer/backend/internal/config"
)

func RegisterFarmRoutes(router *gin.Engine, cfg *config.AppConfig) {
	farms := router.Group("/api/farms")
	farms.Use(middleware.JWTAuthMiddleware(cfg.JWTSecret))
	{
		farms.GET("", handlers.GetFarmsHandler)
		farms.POST("", handlers.CreateFarmHandler)
		farms.GET("/:id", handlers.GetFarmHandler)
		farms.PUT("/:id", handlers.UpdateFarmHandler)
		farms.DELETE("/:id", handlers.DeleteFarmHandler)
	}
}
