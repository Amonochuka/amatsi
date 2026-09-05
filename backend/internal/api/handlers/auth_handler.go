/*
 * ============================================================================
 * internal/api/handlers/auth_handler.go — AUTH HTTP HANDLER
 * Component: Person A + <Go API / Team Lead>
 *
 * Thin HTTP layer over AuthService: binds requests, maps service errors to
 * status codes, renders responses. All business logic lives in the service.
 * ============================================================================
 */

package handlers

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/services"
)

// AuthHandler serves the /api/auth/* routes.
type AuthHandler struct {
	svc *services.AuthService
}

func NewAuthHandler(svc *services.AuthService) *AuthHandler {
	return &AuthHandler{svc: svc}
}

func (h *AuthHandler) Signup(c *gin.Context) {
	var input struct {
		FullName    string `json:"full_name" binding:"required"`
		PhoneNumber string `json:"phone_number" binding:"required"`
		Email       string `json:"email"`
		Password    string `json:"password" binding:"required,min=8"`
		Language    string `json:"language"`
		SMSEnabled  *bool  `json:"sms_enabled"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	lang := input.Language
	if lang == "" {
		lang = "en"
	}
	smsEnabled := true
	if input.SMSEnabled != nil {
		smsEnabled = *input.SMSEnabled
	}

	user, pair, err := h.svc.Signup(c.Request.Context(), services.SignupProfile{
		FullName:    strings.TrimSpace(input.FullName),
		PhoneNumber: strings.TrimSpace(input.PhoneNumber),
		Email:       strings.TrimSpace(input.Email),
		Language:    lang,
		SMSEnabled:  smsEnabled,
	}, input.Password)
	if err != nil {
		if errors.Is(err, services.ErrPhoneInUse) {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"token":         pair.AccessToken,
		"refresh_token": pair.RefreshToken,
		"user":          user,
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input struct {
		PhoneNumber string `json:"phone_number" binding:"required"`
		Password    string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, pair, err := h.svc.Login(c.Request.Context(), strings.TrimSpace(input.PhoneNumber), input.Password)
	if err != nil {
		if errors.Is(err, services.ErrInvalidCredentials) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to issue token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"token":         pair.AccessToken,
		"refresh_token": pair.RefreshToken,
		"user":          user,
	})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var input struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "refresh_token is required"})
		return
	}

	pair, err := h.svc.Refresh(c.Request.Context(), strings.TrimSpace(input.RefreshToken))
	if err != nil {
		if errors.Is(err, services.ErrRevokedToken) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has been revoked"})
			return
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"token":         pair.AccessToken,
		"refresh_token": pair.RefreshToken,
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	accessJTI, _ := c.Get(middleware.ContextJWTIDKey)
	accessExp, _ := c.Get(middleware.ContextJWTExpiryKey)

	var input struct {
		RefreshToken string `json:"refresh_token"`
	}
	_ = c.ShouldBindJSON(&input)

	jti, _ := accessJTI.(string)
	exp, _ := accessExp.(time.Time)

	if err := h.svc.Logout(c.Request.Context(), jti, exp, input.RefreshToken); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "logout service unavailable"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "logged_out"})
}

func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var input struct {
		FullName    *string `json:"full_name"`
		PhoneNumber *string `json:"phone_number"`
		Email       *string `json:"email"`
		Language    *string `json:"language"`
		SMSEnabled  *bool   `json:"sms_enabled"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.svc.UpdateProfile(c.Request.Context(), userID, services.ProfileChanges{
		FullName:    input.FullName,
		PhoneNumber: input.PhoneNumber,
		Email:       input.Email,
		Language:    input.Language,
		SMSEnabled:  input.SMSEnabled,
	})
	if err != nil {
		switch {
		case errors.Is(err, services.ErrAccountNotFound):
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		case errors.Is(err, services.ErrPhoneInUse):
			c.JSON(http.StatusConflict, gin.H{"error": "phone number already in use"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update profile"})
		}
		return
	}
	c.JSON(http.StatusOK, gin.H{"user": user})
}

func (h *AuthHandler) ChangePassword(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var input struct {
		CurrentPassword string `json:"current_password" binding:"required"`
		NewPassword     string `json:"new_password" binding:"required,min=8"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.svc.ChangePassword(c.Request.Context(), userID, input.CurrentPassword, input.NewPassword)
	if err != nil {
		switch {
		case errors.Is(err, services.ErrCurrentPasswordWrong):
			c.JSON(http.StatusUnauthorized, gin.H{"error": "current password is incorrect"})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update password"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "password_updated"})
}