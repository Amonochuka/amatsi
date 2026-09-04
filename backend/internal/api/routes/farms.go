package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/amatsi/backend/internal/api/handlers"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/config"
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
