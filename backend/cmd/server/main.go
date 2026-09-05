/*
 * ============================================================================
 * cmd/server/main.go — API SERVER ENTRYPOINT
 * Component: Person A + <Go API / Team Lead>
 * ============================================================================
 */

package main

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"

	backend "github.com/amatsi/backend"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/api/routes"
	"github.com/amatsi/backend/internal/clients"
	"github.com/amatsi/backend/internal/config"
	"github.com/amatsi/backend/internal/migrations"
	"github.com/amatsi/backend/internal/queue"
	"github.com/amatsi/backend/internal/queue/workers"
	"github.com/amatsi/backend/internal/repository"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)

	cfg, err := config.Load()
	if err != nil {
		slog.Error("Failed to load configuration", slog.String("error", err.Error()))
		os.Exit(1)
	}
	slog.Info("Configuration loaded", slog.String("port", cfg.Port))

	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	ctx := context.Background()

	dbPool, err := clients.NewSupabasePool(ctx, cfg.SupabaseDBURL)
	if err != nil {
		slog.Error("Failed to connect to database", slog.String("error", err.Error()))
		os.Exit(1)
	}
	defer dbPool.Close()
	slog.Info("Database connected")

	if err := migrations.Run(ctx, dbPool, backend.MigrationFS); err != nil {
		slog.Error("Failed to apply database migrations", slog.String("error", err.Error()))
		os.Exit(1)
	}
	slog.Info("Database migrations applied")

	redisClient, err := clients.NewRedisClient(ctx, cfg.RedisURL)
	if err != nil {
		slog.Error("Failed to connect to Redis", slog.String("error", err.Error()))
		os.Exit(1)
	}
	defer redisClient.Close()
	slog.Info("Redis connected")

	asynqClient, err := queue.NewAsynqClient(cfg.RedisURL)
	if err != nil {
		slog.Error("Failed to create Asynq client", slog.String("error", err.Error()))
		os.Exit(1)
	}
	defer asynqClient.Close()
	slog.Info("Asynq client initialized")

	var asynqServer *asynq.Server
	asynqServer, err = queue.NewAsynqServer(cfg.RedisURL)
	if err != nil {
		slog.Warn("Failed to create Asynq server — SMS worker will not run",
			slog.String("error", err.Error()))
	} else {
		slog.Info("Asynq server initialized")
	}

	var mqttClient *clients.MQTTClient
	if broker := os.Getenv("MQTT_BROKER_URL"); broker != "" {
		mqttClient, err = clients.NewMQTTClient(broker, "amatsi-api")
		if err != nil {
			slog.Warn("MQTT unavailable", slog.String("error", err.Error()))
			mqttClient = nil
		}
	}

	router := gin.New()
	router.Use(middleware.RequestLogger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware(cfg.AllowedOrigins))

	atClient := clients.NewAfricasTalkingClient(cfg.AfricaTalkingUsername, cfg.AfricaTalkingAPIKey, true)

	router.GET("/health", func(c *gin.Context) {
		if err := dbPool.Ping(c.Request.Context()); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"status": "unhealthy",
				"error":  fmt.Sprintf("database ping failed: %v", err),
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"status":    "ok",
			"service":   "kijanifarmer-api",
			"timestamp": time.Now().UTC().Format(time.RFC3339),
		})
	})

	routes.RegisterRoutes(router, cfg, dbPool, redisClient, asynqClient, mqttClient, atClient)

	if asynqServer != nil {
		smsProcessor := workers.NewSMSProcessor(atClient, repository.NewAlertRepository(dbPool))
		recProcessor := workers.NewRecommendationProcessorFromConfig(
			dbPool,
			cfg,
			asynqClient,
			mqttClient,
		)
		mux := asynq.NewServeMux()
		mux.HandleFunc(queue.TypeSendSMS, smsProcessor.ProcessTask)
		mux.HandleFunc(queue.TypeGenerateRecommendations, recProcessor.ProcessTask)

		go func() {
			slog.Info("Asynq worker starting")
			if err := asynqServer.Start(mux); err != nil {
				slog.Error("Asynq worker failed to start", slog.String("error", err.Error()))
			}
		}()

		go func() {
			slog.Info("Periodic recommendation scheduler starting",
				slog.String("cron", cfg.RecommendationCron))
			redisOpt, err := queue.ParseRedisURL(cfg.RedisURL)
			if err != nil {
				slog.Error("Failed to parse Redis URL for periodic scheduler",
					slog.String("error", err.Error()))
				return
			}
			periodicMgr, err := asynq.NewPeriodicTaskManager(
				asynq.PeriodicTaskManagerOpts{
					RedisConnOpt:               redisOpt,
					PeriodicTaskConfigProvider: queue.NewDailyRecommendationsProvider(cfg.RecommendationCron),
					SyncInterval:               10 * time.Minute,
				},
			)
			if err != nil {
				slog.Error("Failed to create periodic recommendation scheduler",
					slog.String("error", err.Error()))
				return
			}
			if err := periodicMgr.Start(); err != nil {
				slog.Error("Periodic recommendation scheduler failed",
					slog.String("error", err.Error()))
			}
		}()
	}

	if mqttClient == nil {
		slog.Warn("MQTT broker not configured — automatic irrigation triggers disabled; SMS alerts still work")
	}

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		slog.Info("Server starting", slog.String("addr", srv.Addr))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("Server failed", slog.String("error", err.Error()))
			os.Exit(1)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit
	slog.Info("Shutdown signal received", slog.String("signal", sig.String()))

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		slog.Error("Server shutdown error", slog.String("error", err.Error()))
	}
	if asynqServer != nil {
		asynqServer.Shutdown()
	}
	slog.Info("Server shutdown complete")
}
