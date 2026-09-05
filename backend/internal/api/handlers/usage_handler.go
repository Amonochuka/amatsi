package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/services"
)

// UsageHandler serves the /api/usage route.
type UsageHandler struct {
	svc *services.UsageService
}

func NewUsageHandler(svc *services.UsageService) *UsageHandler {
	return &UsageHandler{svc: svc}
}

// Get reports the user's real usage against plan limits. The SMS balance call
// is best-effort; when the upstream is unreachable it is returned as null so
// the UI can render "unavailable" instead of failing.
func (h *UsageHandler) Get(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	used, limit, balance, err := h.svc.GetUsage(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"recommendations_used_today": used,
		"recommendations_limit":      limit,
		"sms_balance":                balance,
	})
}