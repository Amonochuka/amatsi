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
	"github.com/redis/go-redis/v9"
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

	token, refreshToken, err := issueTokenPair(c, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to issue token"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"token": token, "refresh_token": refreshToken, "user": user})
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

	token, refreshToken, err := issueTokenPair(c, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to issue token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token, "refresh_token": refreshToken, "user": user})
}

// RefreshTokenHandler exchanges a valid refresh token for a new token pair,
// rotating the refresh token: the presented refresh token is revoked and a
// fresh one is returned, so an old (possibly stolen) refresh token cannot be
// replayed.
func RefreshTokenHandler(c *gin.Context) {
	var input struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "refresh_token is required"})
		return
	}

	secret := c.MustGet("jwt_secret").(string)
	claims, err := middleware.ParseJWT(strings.TrimSpace(input.RefreshToken), secret)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	if tokType, ok := claims["typ"].(string); !ok || tokType != middleware.RefreshTokenType {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
		return
	}

	sub, ok := claims["sub"].(string)
	if !ok || sub == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}
	jti, ok := claims["jti"].(string)
	if !ok || jti == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}
	expiresAtUnix, ok := claims["exp"].(float64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}
	expiresAt := time.Unix(int64(expiresAtUnix), 0)

	redisClient, exists := c.Get("redis_client")
	if !exists {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "authentication service unavailable"})
		return
	}
	rdb, ok := redisClient.(*redis.Client)
	if !ok {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "authentication service unavailable"})
		return
	}

	revoked, err := middleware.IsRevoked(c.Request.Context(), rdb, jti)
	if err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "authentication service unavailable"})
		return
	}
	if revoked {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has been revoked"})
		return
	}

	// Rotate: revoke the presented refresh token, issue a fresh pair.
	if err := middleware.RevokeRefreshToken(c, jti, expiresAt); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "session refresh unavailable"})
		return
	}

	token, refreshToken, err := issueTokenPair(c, sub)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to issue token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token, "refresh_token": refreshToken})
}

func LogoutHandler(c *gin.Context) {
	if err := middleware.RevokeToken(c); err != nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "logout service unavailable"})
		return
	}

	// If the client still holds a refresh token, revoke it too so the whole
	// session dies rather than just the (short-lived) access token.
	var input struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := c.ShouldBindJSON(&input); err == nil && strings.TrimSpace(input.RefreshToken) != "" {
		secret := c.MustGet("jwt_secret").(string)
		if claims, err := middleware.ParseJWT(strings.TrimSpace(input.RefreshToken), secret); err == nil {
			if jti, ok := claims["jti"].(string); ok && jti != "" {
				if expiresAtUnix, ok := claims["exp"].(float64); ok {
					_ = middleware.RevokeRefreshToken(c, jti, time.Unix(int64(expiresAtUnix), 0))
				}
			}
		}
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

func issueJWT(c *gin.Context, tokenType string, userID string, ttl time.Duration) (string, error) {
	secret := c.MustGet("jwt_secret").(string)
	now := time.Now()
	claims := jwt.MapClaims{
		"sub": userID,
		"jti": uuid.NewString(),
		"typ": tokenType,
		"exp": now.Add(ttl).Unix(),
		"iat": now.Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// issueTokenPair mints a short-lived access token plus a long-lived refresh
// token for a user.
func issueTokenPair(c *gin.Context, userID string) (accessToken, refreshToken string, err error) {
	accessTTL := c.MustGet("jwt_ttl").(time.Duration)
	refreshTTL := c.MustGet("jwt_refresh_ttl").(time.Duration)

	accessToken, err = issueJWT(c, middleware.AccessTokenType, userID, accessTTL)
	if err != nil {
		return "", "", err
	}
	refreshToken, err = issueJWT(c, middleware.RefreshTokenType, userID, refreshTTL)
	if err != nil {
		return "", "", err
	}
	return accessToken, refreshToken, nil
}
