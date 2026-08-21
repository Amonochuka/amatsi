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
	"github.com/kijanifarmer/backend/internal/api/middleware"
	"github.com/kijanifarmer/backend/internal/models"
	"github.com/kijanifarmer/backend/internal/repository"
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
