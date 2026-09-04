package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/repository"
)

// GetUserPhonesHandler lists all SMS recipient numbers for the logged-in user.
func GetUserPhonesHandler(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	phones, err := repository.NewPhoneRepository(db).GetPhonesByUser(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if phones == nil {
		phones = []*models.UserPhone{}
	}
	c.JSON(http.StatusOK, phones)
}

// AddUserPhoneHandler registers an additional SMS recipient. The account's
// primary phone number is treated as the first recipient on signup; any extra
// numbers added here receive the same irrigation alerts.
func AddUserPhoneHandler(c *gin.Context) {
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

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	repo := repository.NewPhoneRepository(db)
	if err := repo.CreatePhone(c.Request.Context(), phone); err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "phone number already added for this account"})
		return
	}

	c.JSON(http.StatusCreated, phone)
}

// DeleteUserPhoneHandler removes an additional SMS recipient. Primary numbers
// cannot be removed here — change the account phone in profile instead.
func DeleteUserPhoneHandler(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	if err := repository.NewPhoneRepository(db).DeletePhone(c.Request.Context(), c.Param("id"), userID); err != nil {
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