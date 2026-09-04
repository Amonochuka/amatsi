package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/amatsi/backend/internal/api/handlers"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/config"
)

func RegisterAlertRoutes(router *gin.Engine, cfg *config.AppConfig) {
	alerts := router.Group("/api/alerts")
	alerts.Use(middleware.JWTAuthMiddleware(cfg.JWTSecret))
	{
		alerts.POST("/send", handlers.SendAlertHandler)
		alerts.GET("/history", handlers.GetAlertHistoryHandler)
	}
}
