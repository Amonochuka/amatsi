package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/kijanifarmer/backend/internal/api/handlers"
	"github.com/kijanifarmer/backend/internal/api/middleware"
	"github.com/kijanifarmer/backend/internal/config"
	"github.com/redis/go-redis/v9"
)

func RegisterRoutes(router *gin.Engine, cfg *config.AppConfig, rdb *redis.Client) {
	auth := router.Group("/api/auth")
	auth.Use(middleware.RateLimitFromEnv(rdb))
	{
		auth.POST("/signup", handlers.SignupHandler)
		auth.POST("/login", handlers.LoginHandler)
		auth.POST("/logout", middleware.JWTAuthMiddleware(cfg.JWTSecret), handlers.LogoutHandler)
	}

	api := router.Group("/api")
	api.Use(middleware.JWTAuthMiddleware(cfg.JWTSecret))
	api.Use(middleware.RateLimitFromEnv(rdb))
	{
		api.GET("/farms", handlers.GetFarmsHandler)
		api.POST("/farms", handlers.CreateFarmHandler)
		api.GET("/farms/:id", handlers.GetFarmHandler)
		api.PUT("/farms/:id", handlers.UpdateFarmHandler)
		api.DELETE("/farms/:id", handlers.DeleteFarmHandler)

		api.GET("/weather/:farmId", handlers.GetWeatherHandler)
		api.GET("/soil/:farmId", handlers.GetSoilMoistureHandler)

		api.GET("/recommendations/:farmId", handlers.GetRecommendationsHandler)
		api.POST("/recommendations/generate", middleware.StrictRateLimitFromEnv(rdb), handlers.GenerateRecommendationHandler)

		api.POST("/alerts/send", middleware.StrictRateLimitFromEnv(rdb), handlers.SendAlertHandler)
		api.GET("/alerts/history", handlers.GetAlertHistoryHandler)
	}
}
