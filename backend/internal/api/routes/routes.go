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
	// --- Repositories -----------------------------------------------------
	userRepo := repository.NewUserRepository(db)
	farmRepo := repository.NewFarmRepository(db)
	phoneRepo := repository.NewPhoneRepository(db)
	alertRepo := repository.NewAlertRepository(db)
	recRepo := repository.NewRecommendationRepository(db)
	weatherRepo := repository.NewWeatherRepository(db)

	// --- Clients ----------------------------------------------------------
	kijani := clients.NewKijaniboxClient(cfg.KijaniBoxBaseURL, cfg.KijaniBoxAPIKey)
	ai := clients.NewPythonAIClient(cfg.AIServiceURL)

	// --- Services ---------------------------------------------------------
	authSvc := services.NewAuthService(
		userRepo,
		rdb,
		cfg.JWTSecret,
		cfg.JWTTokenTTL,
		cfg.JWTRefreshTokenTTL,
	)
	farmSvc := services.NewFarmService(farmRepo)
	phoneSvc := services.NewPhoneService(phoneRepo)
	weatherSvc := services.NewWeatherService(farmRepo, weatherRepo, kijani, rdb)
	alertSvc := services.NewAlertService(alertRepo, phoneRepo, asynqClient)
	recSvc := services.NewRecommendationService(
		recRepo,
		weatherRepo,
		farmRepo,
		userRepo,
		kijani,
		ai,
		mqttClient,
		alertSvc,
	)
	usageSvc := services.NewUsageService(recRepo, atClient, cfg.RecommendationsDailyLimit)
	optoutSvc := services.NewOptOutService(userRepo, phoneRepo)

	// --- Handlers ---------------------------------------------------------
	authHandler := handlers.NewAuthHandler(authSvc)
	farmHandler := handlers.NewFarmHandler(farmSvc)
	phoneHandler := handlers.NewPhoneHandler(phoneSvc)
	weatherHandler := handlers.NewWeatherHandler(weatherSvc)
	usageHandler := handlers.NewUsageHandler(usageSvc)
	alertHandler := handlers.NewAlertHandler(farmRepo, userRepo, alertSvc)
	recommendationHandler := handlers.NewRecommendationHandler(farmRepo, recRepo, recSvc)
	smsInboundHandler := handlers.NewSMSInboundHandler(optoutSvc)

	// Public SMS webhook for inbound replies (STOP/START opt-out). Africa's
	// Talking calls this without a JWT, so it is registered outside the
	// authenticated /api group.
	router.GET("/api/sms/inbound", smsInboundHandler.Inbound)
	router.POST("/api/sms/inbound", smsInboundHandler.Inbound)

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
		api.GET("/farms", farmHandler.GetFarms)
		api.POST("/farms", farmHandler.CreateFarm)
		api.GET("/farms/:id", farmHandler.GetFarm)
		api.PUT("/farms/:id", farmHandler.UpdateFarm)
		api.DELETE("/farms/:id", farmHandler.DeleteFarm)

		api.GET("/weather/:farmId", weatherHandler.GetWeather)
		api.GET("/soil/:farmId", weatherHandler.GetSoilMoisture)

		api.GET("/recommendations/:farmId", recommendationHandler.GetRecommendations)
		api.POST("/recommendations/generate", middleware.StrictRateLimitFromEnv(rdb), recommendationHandler.Generate)

		api.POST("/alerts/send", middleware.StrictRateLimitFromEnv(rdb), alertHandler.SendAlert)
		api.GET("/alerts/history", alertHandler.GetAlertHistory)

		api.GET("/phones", phoneHandler.GetPhones)
		api.POST("/phones", middleware.StrictRateLimitFromEnv(rdb), phoneHandler.AddPhone)
		api.DELETE("/phones/:id", phoneHandler.DeletePhone)

		api.GET("/usage", usageHandler.Get)

		api.PUT("/auth/profile", authHandler.UpdateProfile)
		api.POST("/auth/change-password", middleware.StrictRateLimitFromEnv(rdb), authHandler.ChangePassword)
	}
}