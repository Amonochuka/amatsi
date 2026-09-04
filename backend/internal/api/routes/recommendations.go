package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/amatsi/backend/internal/api/handlers"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/config"
)

func RegisterRecommendationRoutes(router *gin.Engine, cfg *config.AppConfig) {
	rec := router.Group("/api/recommendations")
	rec.Use(middleware.JWTAuthMiddleware(cfg.JWTSecret))
	{
		rec.GET("/:farmId", handlers.GetRecommendationsHandler)
		rec.POST("/generate", handlers.GenerateRecommendationHandler)
	}
}
