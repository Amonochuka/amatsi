package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/amatsi/backend/internal/api/handlers"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/config"
)

func RegisterAuthRoutes(router *gin.Engine, cfg *config.AppConfig) {
	_ = cfg
	auth := router.Group("/api/auth")
	{
		auth.POST("/signup", handlers.SignupHandler)
		auth.POST("/login", handlers.LoginHandler)
		auth.POST("/logout", middleware.JWTAuthMiddleware(cfg.JWTSecret), handlers.LogoutHandler)
	}
}
