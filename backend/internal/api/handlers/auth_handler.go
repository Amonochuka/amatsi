package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

func SignupHandler(c *gin.Context) {
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

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}

	user := &models.User{
		ID:           uuid.NewString(),
		FullName:     strings.TrimSpace(input.FullName),
		PhoneNumber:  strings.TrimSpace(input.PhoneNumber),
		Email:        strings.TrimSpace(input.Email),
		PasswordHash: string(hash),
		Language:     lang,
		SMSEnabled:   smsEnabled,
	}

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	repo := repository.NewUserRepository(db)
	if existing, err := repo.GetUserByPhone(c.Request.Context(), user.PhoneNumber); err == nil && existing != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "phone number already registered"})
		return
	} else if err != nil && err != pgx.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "lookup failed"})
		return
	}

	if err := repo.CreateUser(c.Request.Context(), user); err != nil {
		if strings.Contains(strings.ToLower(err.Error()), "duplicate") || strings.Contains(err.Error(), "unique") {
			c.JSON(http.StatusConflict, gin.H{"error": "phone number already registered"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		return
	}

	token, err := issueJWT(c, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to issue token"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"token": token, "user": user})
}

func LoginHandler(c *gin.Context) {
	var input struct {
		PhoneNumber string `json:"phone_number" binding:"required"`
		Password    string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	repo := repository.NewUserRepository(db)
	user, err := repo.GetUserByPhone(c.Request.Context(), strings.TrimSpace(input.PhoneNumber))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	token, err := issueJWT(c, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to issue token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}

func LogoutHandler(c *gin.Context) {
	if err := middleware.RevokeToken(c); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "logout service unavailable"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "logged_out"})
}

func UpdateProfileHandler(c *gin.Context) {
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

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	repo := repository.NewUserRepository(db)
	user, err := repo.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	if input.FullName != nil {
		user.FullName = strings.TrimSpace(*input.FullName)
	}
	if input.PhoneNumber != nil {
		newPhone := strings.TrimSpace(*input.PhoneNumber)
		if newPhone != user.PhoneNumber {
			if existing, err := repo.GetUserByPhone(c.Request.Context(), newPhone); err == nil && existing != nil {
				c.JSON(http.StatusConflict, gin.H{"error": "phone number already in use"})
				return
			} else if err != nil && err != pgx.ErrNoRows {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "phone lookup failed"})
				return
			}
			user.PhoneNumber = newPhone
		}
	}
	if input.Email != nil {
		user.Email = strings.TrimSpace(*input.Email)
	}
	if input.Language != nil {
		user.Language = *input.Language
	}
	if input.SMSEnabled != nil {
		user.SMSEnabled = *input.SMSEnabled
	}

	if err := repo.UpdateUserProfile(c.Request.Context(), user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"user": user})
}

func ChangePasswordHandler(c *gin.Context) {
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

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	repo := repository.NewUserRepository(db)
	user, err := repo.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.CurrentPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "current password is incorrect"})
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash new password"})
		return
	}

	if err := repo.UpdatePasswordHash(c.Request.Context(), userID, string(hash)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "password_updated"})
}

func issueJWT(c *gin.Context, userID string) (string, error) {
	secret := c.MustGet("jwt_secret").(string)
	ttl := c.MustGet("jwt_ttl").(time.Duration)
	claims := jwt.MapClaims{
		"sub": userID,
		"jti": uuid.NewString(),
		"exp": time.Now().Add(ttl).Unix(),
		"iat": time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
