package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/repository"
	"github.com/amatsi/backend/internal/services"
)

func SendAlertHandler(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var input struct {
		FarmID  string `json:"farm_id" binding:"required"`
		Message string `json:"message" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	farmRepo := repository.NewFarmRepository(db)
	farm, err := farmRepo.GetFarmByID(c.Request.Context(), input.FarmID)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	userRepo := repository.NewUserRepository(db)
	user, err := userRepo.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user lookup failed"})
		return
	}
	if !user.SMSEnabled {
		c.JSON(http.StatusForbidden, gin.H{"error": "sms alerts disabled for this account"})
		return
	}

	msg := localizeAlert(user.Language, input.Message)
	alertSvc := services.NewAlertService(
		repository.NewAlertRepository(db),
		repository.NewPhoneRepository(db),
		c.MustGet("asynq_client").(*asynq.Client),
	)
	if err := alertSvc.SendAlertToRecipients(c.Request.Context(), input.FarmID, userID, user.PhoneNumber, msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusAccepted, gin.H{"status": "queued"})
}

func GetAlertHistoryHandler(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	farmID := c.Query("farm_id")
	if farmID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "farm_id query parameter is required"})
		return
	}

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	farmRepo := repository.NewFarmRepository(db)
	farm, err := farmRepo.GetFarmByID(c.Request.Context(), farmID)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	alertSvc := services.NewAlertService(
		repository.NewAlertRepository(db),
		repository.NewPhoneRepository(db),
		c.MustGet("asynq_client").(*asynq.Client),
	)
	alerts, err := alertSvc.GetFarmAlerts(c.Request.Context(), farmID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if alerts == nil {
		alerts = []*models.Alert{}
	}
	c.JSON(http.StatusOK, alerts)
}

func localizeAlert(lang, message string) string {
	switch lang {
	case "sw":
		return "AMATSI: " + message
	case "luo":
		return "AMATSI: " + message
	default:
		return "AMATSI: " + message
	}
}
