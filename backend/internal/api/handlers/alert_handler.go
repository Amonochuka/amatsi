package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/repository"
	"github.com/amatsi/backend/internal/services"
)

// AlertHandler serves the /api/alerts routes.
type AlertHandler struct {
	farmRepo *repository.FarmRepository
	userRepo *repository.UserRepository
	alertSvc *services.AlertService
}

func NewAlertHandler(
	farmRepo *repository.FarmRepository,
	userRepo *repository.UserRepository,
	alertSvc *services.AlertService,
) *AlertHandler {
	return &AlertHandler{
		farmRepo: farmRepo,
		userRepo: userRepo,
		alertSvc: alertSvc,
	}
}

func (h *AlertHandler) SendAlert(c *gin.Context) {
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

	farm, err := h.farmRepo.GetFarmByID(c.Request.Context(), input.FarmID)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	user, err := h.userRepo.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user lookup failed"})
		return
	}
	if !user.SMSEnabled {
		c.JSON(http.StatusForbidden, gin.H{"error": "sms alerts disabled for this account"})
		return
	}

	msg := localizeAlert(user.Language, input.Message)
	if err := h.alertSvc.SendAlertToRecipients(c.Request.Context(), input.FarmID, userID, user.PhoneNumber, msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusAccepted, gin.H{"status": "queued"})
}

func (h *AlertHandler) GetAlertHistory(c *gin.Context) {
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

	farm, err := h.farmRepo.GetFarmByID(c.Request.Context(), farmID)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	alerts, err := h.alertSvc.GetFarmAlerts(c.Request.Context(), farmID)
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