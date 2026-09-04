package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/amatsi/backend/internal/api/handlers"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/config"
)

func RegisterWeatherRoutes(router *gin.Engine, cfg *config.AppConfig) {
	env := router.Group("/api")
	env.Use(middleware.JWTAuthMiddleware(cfg.JWTSecret))
	{
		env.GET("/weather/:farmId", handlers.GetWeatherHandler)
		env.GET("/soil/:farmId", handlers.GetSoilMoistureHandler)
	}
}
