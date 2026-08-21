/*
 * ============================================================================
 * cmd/server/main.go — API SERVER ENTRYPOINT
 * Component: Person A + <Go API / Team Lead>
 *
 * The Gin HTTP server entrypoint. Bootstraps every dependency (config,
 * database pool, Redis, clients, task queue, routes) and starts the API.
 *
 * Feature references: 19.7, 19.9, 19.10, 19.12, 13.1.
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

	"github.com/kijanifarmer/backend/internal/api/middleware"
	"github.com/kijanifarmer/backend/internal/clients"
	"github.com/kijanifarmer/backend/internal/config"
	"github.com/kijanifarmer/backend/internal/queue"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)

	// ── 1. Load configuration ────────────────────────────────────────────
	cfg, err := config.Load()
	if err != nil {
		slog.Error("Failed to load configuration", slog.String("error", err.Error()))
		os.Exit(1)
	}
	slog.Info("Configuration loaded", slog.String("port", cfg.Port))

	// ── 2. Set Gin mode ──────────────────────────────────────────────────
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	ctx := context.Background()

	// ── 3. Database connection pool ──────────────────────────────────────
	dbPool, err := clients.NewSupabasePool(ctx, cfg.SupabaseDBURL)
	if err != nil {
		slog.Error("Failed to connect to database", slog.String("error", err.Error()))
		os.Exit(1)
	}
	defer dbPool.Close()
	slog.Info("Database connected")

	// ── 4. Redis client ──────────────────────────────────────────────────
	redisClient, err := clients.NewRedisClient(ctx, cfg.RedisURL)
	if err != nil {
		slog.Error("Failed to connect to Redis", slog.String("error", err.Error()))
		os.Exit(1)
	}
	defer redisClient.Close()
	slog.Info("Redis connected")

	// ── 5. Asynq client (for enqueuing tasks) ────────────────────────────
	asynqClient, err := queue.NewAsynqClient(cfg.RedisURL)
	if err != nil {
		slog.Error("Failed to create Asynq client", slog.String("error", err.Error()))
		os.Exit(1)
	}
	defer asynqClient.Close()
	slog.Info("Asynq client initialized")

	// ── 6. Asynq server (for processing tasks) ──────────────────────────
	var asynqServer *asynq.Server
	asynqServer, err = queue.NewAsynqServer(cfg.RedisURL)
	if err != nil {
		slog.Warn("Failed to create Asynq server — SMS worker will not run",
			slog.String("error", err.Error()))
	} else {
		slog.Info("Asynq server initialized")
	}

	// ── 7. Create Gin router ─────────────────────────────────────────────
	router := gin.New()

	// ── 8. Register middleware ───────────────────────────────────────────
	router.Use(middleware.RequestLogger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORSMiddleware(cfg.AllowedOrigins))

	// ── 9. Health check endpoint (no auth required) ──────────────────────
	router.GET("/health", func(c *gin.Context) {
		// Ping the database to verify liveness
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

	// ── 10. Protected route group ────────────────────────────────────────
	api := router.Group("/api")
	api.Use(middleware.JWTAuthMiddleware(cfg.JWTSecret))
	{
		// Route registration will be added here by routes.go
		// Example:
		//   routes.RegisterFarmRoutes(api, farmHandler)
		//   routes.RegisterWeatherRoutes(api, weatherHandler)
		//   routes.RegisterRecommendationRoutes(api, recHandler)
		//   routes.RegisterAlertRoutes(api, alertHandler)
	}

	// Public auth routes (no JWT required)
	// auth := router.Group("/api/auth")
	// {
	//     routes.RegisterAuthRoutes(auth, authHandler)
	// }

	// Make dependencies available to handlers via context if needed
	_ = dbPool      // Used by repositories
	_ = redisClient // Used by cache layer
	_ = asynqClient // Used by SMS enqueue

	// ── 11. Start Asynq worker in background ─────────────────────────────
	if asynqServer != nil {
		mux := asynq.NewServeMux()
		// SMS worker handler will be registered here:
		// mux.HandleFunc(queue.TypeSendSMS, workers.HandleSendSMSTask)

		go func() {
			slog.Info("Asynq worker starting")
			if err := asynqServer.Start(mux); err != nil {
				slog.Error("Asynq worker failed to start", slog.String("error", err.Error()))
			}
		}()
	}

	// ── 12. Create HTTP server ───────────────────────────────────────────
	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// ── 13. Start server in goroutine ────────────────────────────────────
	go func() {
		slog.Info("Server starting", slog.String("addr", srv.Addr))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("Server failed", slog.String("error", err.Error()))
			os.Exit(1)
		}
	}()

	// ── 14. Graceful shutdown ────────────────────────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit
	slog.Info("Shutdown signal received", slog.String("signal", sig.String()))

	// Create timeout context for shutdown
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Shutdown HTTP server
	if err := srv.Shutdown(shutdownCtx); err != nil {
		slog.Error("Server shutdown error", slog.String("error", err.Error()))
	}

	// Shutdown Asynq server
	if asynqServer != nil {
		asynqServer.Shutdown()
	}

	// DB pool and Redis client are deferred above
	slog.Info("Server shutdown complete")
}