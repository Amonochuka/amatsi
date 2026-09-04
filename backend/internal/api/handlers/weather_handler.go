package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/clients"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/repository"
	"github.com/redis/go-redis/v9"
)

const cacheTTL = time.Hour

func GetWeatherHandler(c *gin.Context) {
	farmID := c.Param("farmId")
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	rdb := c.MustGet("redis_client").(*redis.Client)
	cacheKey := fmt.Sprintf("weather:%s", farmID)
	if cached, err := rdb.Get(c.Request.Context(), cacheKey).Bytes(); err == nil {
		var data gin.H
		if json.Unmarshal(cached, &data) == nil {
			c.JSON(http.StatusOK, gin.H{"data": data, "from_cache": true})
			return
		}
	}

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	farmRepo := repository.NewFarmRepository(db)
	farm, err := farmRepo.GetFarmByID(c.Request.Context(), farmID)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	kijani := clients.NewKijaniboxClient(
		c.MustGet("kijanibox_base_url").(string),
		c.MustGet("kijanibox_api_key").(string),
	)
	weatherData, err := kijani.GetWeatherForecast(c.Request.Context(), farm.Latitude, farm.Longitude)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "weather upstream unavailable"})
		return
	}

	payload := gin.H{
		"temperature":          weatherData.Temperature,
		"rainfall_probability": weatherData.RainfallProbability,
	}
	if b, err := json.Marshal(payload); err == nil {
		_ = rdb.Set(c.Request.Context(), cacheKey, b, cacheTTL).Err()
	}

	weatherRepo := repository.NewWeatherRepository(db)
	_ = weatherRepo.SaveWeatherForecast(c.Request.Context(), &models.Weather{
		FarmID:              farmID,
		Temperature:         weatherData.Temperature,
		RainfallProbability: weatherData.RainfallProbability,
		SoilMoisture:        0,
		ForecastDate:        time.Now(),
	})

	c.JSON(http.StatusOK, gin.H{"data": payload, "from_cache": false})
}

func GetSoilMoistureHandler(c *gin.Context) {
	farmID := c.Param("farmId")
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	rdb := c.MustGet("redis_client").(*redis.Client)
	cacheKey := fmt.Sprintf("soil:%s", farmID)
	if cached, err := rdb.Get(c.Request.Context(), cacheKey).Bytes(); err == nil {
		var data gin.H
		if json.Unmarshal(cached, &data) == nil {
			c.JSON(http.StatusOK, gin.H{"data": data, "from_cache": true})
			return
		}
	}

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	farmRepo := repository.NewFarmRepository(db)
	farm, err := farmRepo.GetFarmByID(c.Request.Context(), farmID)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	kijani := clients.NewKijaniboxClient(
		c.MustGet("kijanibox_base_url").(string),
		c.MustGet("kijanibox_api_key").(string),
	)
	soilData, err := kijani.GetSoilMoisture(c.Request.Context(), farm.Latitude, farm.Longitude)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "soil upstream unavailable"})
		return
	}

	payload := gin.H{"moisture_level": soilData.MoistureLevel}
	if b, err := json.Marshal(payload); err == nil {
		_ = rdb.Set(c.Request.Context(), cacheKey, b, cacheTTL).Err()
	}

	c.JSON(http.StatusOK, gin.H{"data": payload, "from_cache": false})
}
