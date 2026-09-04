package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hibiken/asynq"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/clients"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/repository"
	"github.com/amatsi/backend/internal/services"
)

func GetRecommendationsHandler(c *gin.Context) {
	farmID := c.Param("farmId")
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	farmRepo := repository.NewFarmRepository(db)
	farm, err := farmRepo.GetFarmByID(c.Request.Context(), farmID)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	recRepo := repository.NewRecommendationRepository(db)
	recs, err := recRepo.GetRecommendationsByFarm(c.Request.Context(), farmID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if recs == nil {
		recs = []*models.Recommendation{}
	}
	c.JSON(http.StatusOK, recs)
}

func GenerateRecommendationHandler(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var input struct {
		FarmID string `json:"farm_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	farmRepo := repository.NewFarmRepository(db)
	farm, err := farmRepo.GetFarmByID(c.Request.Context(), input.FarmID)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	var mqttClient *clients.MQTTClient
	if v, exists := c.Get("mqtt_client"); exists {
		mqttClient, _ = v.(*clients.MQTTClient)
	}

	svc := services.NewRecommendationService(
		repository.NewRecommendationRepository(db),
		repository.NewWeatherRepository(db),
		farmRepo,
		repository.NewUserRepository(db),
		clients.NewKijaniboxClient(
			c.MustGet("kijanibox_base_url").(string),
			c.MustGet("kijanibox_api_key").(string),
		),
		clients.NewPythonAIClient(c.MustGet("ai_service_url").(string)),
		mqttClient,
		services.NewAlertService(
			repository.NewAlertRepository(db),
			repository.NewPhoneRepository(db),
			c.MustGet("asynq_client").(*asynq.Client),
		),
	)

	rec, err := svc.GenerateRecommendation(c.Request.Context(), input.FarmID)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "recommendation upstream unavailable"})
		return
	}
	c.JSON(http.StatusOK, rec)
}
