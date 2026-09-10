package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/services"
)

// AdminHandler serves admin-only routes. Authorization is enforced by the
// AdminService against the ADMIN_PHONE_NUMBERS allow-list, so these routes
// still go through the normal JWT middleware first.
type AdminHandler struct {
	svc *services.AdminService
}

func NewAdminHandler(svc *services.AdminService) *AdminHandler {
	return &AdminHandler{svc: svc}
}

// SetPremium grants (is_premium=true) or revokes (is_premium=false) the
// premium tier for another user.
func (h *AdminHandler) SetPremium(c *gin.Context) {
	callerID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var input struct {
		UserID    string `json:"user_id" binding:"required"`
		IsPremium *bool  `json:"is_premium" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.svc.SetPremium(c.Request.Context(), callerID, input.UserID, *input.IsPremium); err != nil {
		switch {
		case errors.Is(err, services.ErrAdminRequired):
			c.JSON(http.StatusForbidden, gin.H{"error": "admin privileges required"})
		case errors.Is(err, services.ErrAccountNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update premium status"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":     "ok",
		"user_id":    input.UserID,
		"is_premium": *input.IsPremium,
	})
}

// Reseed re-runs the full demo seed SQL (6 Peter Pana farms, 5 secondary
// farmers, weather, recommendations, alerts). Only admins may call this.
func (h *AdminHandler) Reseed(c *gin.Context) {
	callerID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if err := h.svc.Reseed(c.Request.Context(), callerID); err != nil {
		switch {
		case errors.Is(err, services.ErrAdminRequired):
			c.JSON(http.StatusForbidden, gin.H{"error": "admin privileges required"})
		case errors.Is(err, services.ErrAccountNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "reseed failed: " + err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "demo data reseeded"})
}
