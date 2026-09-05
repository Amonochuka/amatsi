package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"

	"github.com/amatsi/backend/internal/api/handlers"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/clients"
	"github.com/amatsi/backend/internal/config"
	"github.com/amatsi/backend/internal/repository"
	"github.com/amatsi/backend/internal/services"
)

// RegisterRoutes builds the dependency graph once (composition root) and binds
// the HTTP routes. Handlers receive their dependencies through constructors
// rather than pulling them from the Gin context.
func RegisterRoutes(
	router *gin.Engine,
	cfg *config.AppConfig,
	db *pgxpool.Pool,
	rdb *redis.Client,
	asynqClient *asynq.Client,
	mqttClient *clients.MQTTClient,
	atClient *clients.AfricasTalkingClient,
) {
	// --- Services ---------------------------------------------------------
	authSvc := services.NewAuthService(
		repository.NewUserRepository(db),
		rdb,
		cfg.JWTSecret,
		cfg.JWTTokenTTL,
		cfg.JWTRefreshTokenTTL,
	)

	// --- Handlers ---------------------------------------------------------
	authHandler := handlers.NewAuthHandler(authSvc)

	// Public SMS webhook for inbound replies (STOP/START opt-out). Africa's
	// Talking calls this without a JWT, so it is registered outside the
	// authenticated /api group.
	router.GET("/api/sms/inbound", handlers.SMSInboundHandler)
	router.POST("/api/sms/inbound", handlers.SMSInboundHandler)

	auth := router.Group("/api/auth")
	auth.Use(middleware.RateLimitFromEnv(rdb))
	{
		auth.POST("/signup", authHandler.Signup)
		auth.POST("/login", authHandler.Login)
		auth.POST("/refresh", authHandler.Refresh)
		auth.POST("/logout", middleware.JWTAuthMiddleware(cfg.JWTSecret, rdb), authHandler.Logout)
	}

	api := router.Group("/api")
	api.Use(middleware.JWTAuthMiddleware(cfg.JWTSecret, rdb))
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

		api.GET("/phones", handlers.GetUserPhonesHandler)
		api.POST("/phones", middleware.StrictRateLimitFromEnv(rdb), handlers.AddUserPhoneHandler)
		api.DELETE("/phones/:id", handlers.DeleteUserPhoneHandler)

		api.GET("/usage", handlers.GetUsageHandler)

		api.PUT("/auth/profile", authHandler.UpdateProfile)
		api.POST("/auth/change-password", middleware.StrictRateLimitFromEnv(rdb), authHandler.ChangePassword)
	}
}