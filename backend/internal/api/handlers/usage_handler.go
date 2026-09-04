package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/clients"
	"github.com/amatsi/backend/internal/repository"
)

// GetUsageHandler reports the user's real usage against plan limits:
// recommendations generated today across their farms (vs. the daily limit) and
// the Africa's Talking SMS credit balance. The balance call is best-effort; when
// the upstream is unreachable the field is returned as null so the UI can render
// "unavailable" instead of failing.
func GetUsageHandler(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	used, err := repository.NewRecommendationRepository(db).
		CountRecommendationsByUserToday(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	limit, _ := c.Get("recommendations_daily_limit")
	dailyLimit, _ := limit.(int)

	resp := gin.H{
		"recommendations_used_today": used,
		"recommendations_limit":      dailyLimit,
		"sms_balance":                nil,
	}

	if atClient, exists := c.Get("at_client"); exists {
		if at, ok := atClient.(*clients.AfricasTalkingClient); ok {
			if balance, err := at.GetBalance(c.Request.Context()); err == nil {
				resp["sms_balance"] = balance
			}
		}
	}

	c.JSON(http.StatusOK, resp)
}