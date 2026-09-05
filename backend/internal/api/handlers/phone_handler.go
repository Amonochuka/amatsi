package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/services"
)

// PhoneHandler serves the /api/phones routes (additional SMS recipients).
type PhoneHandler struct {
	svc *services.PhoneService
}

func NewPhoneHandler(svc *services.PhoneService) *PhoneHandler {
	return &PhoneHandler{svc: svc}
}

// GetPhones lists all SMS recipient numbers for the logged-in user.
func (h *PhoneHandler) GetPhones(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	phones, err := h.svc.GetPhones(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if phones == nil {
		phones = []*models.UserPhone{}
	}
	c.JSON(http.StatusOK, phones)
}

// AddPhone registers an additional SMS recipient. The account's primary phone
// number is treated as the first recipient on signup; any extra numbers added
// here receive the same irrigation alerts.
func (h *PhoneHandler) AddPhone(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var input struct {
		PhoneNumber string `json:"phone_number" binding:"required"`
		Label       string `json:"label"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	phone := &models.UserPhone{
		UserID:      userID,
		PhoneNumber: input.PhoneNumber,
		Label:       defaultPhoneLabel(input.Label),
	}

	if err := h.svc.AddPhone(c.Request.Context(), phone); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "phone number already added for this account"})
		return
	}

	c.JSON(http.StatusCreated, phone)
}

// DeletePhone removes an additional SMS recipient. Primary numbers cannot be
// removed here — change the account phone in profile instead.
func (h *PhoneHandler) DeletePhone(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if err := h.svc.DeletePhone(c.Request.Context(), c.Param("id"), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}

func defaultPhoneLabel(label string) string {
	switch label {
	case "Worker", "Spouse", "Family":
		return label
	default:
		return "Worker"
	}
}