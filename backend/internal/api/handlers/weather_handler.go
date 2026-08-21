/*
 * ============================================================================
 * internal/api/handlers/weather_handler.go — WEATHER + SOIL HANDLERS
 * Component: Person A + <Go API / Team Lead>
 *
 * Serves live farm environmental data to the dashboard cards (WeatherCard,
 * SoilMoistureCard) with a Redis cache layer to keep KijaniBox quota low.
 *
 * WHAT NEEDS TO BE DONE:
 * - GetWeatherHandler (:farmId): resolve farm → its lat/lon, fetch forecast
 *   from the KijaniBox client, cache in Redis with TTL 1 hour, return JSON.
 * - GetSoilMoistureHandler (:farmId): same pattern for soil moisture.
 * - Cache-first: on cache hit return instantly; on miss call the upstream
 *   client and backfill Redis (key scheme incl. farmId, e.g.
 *   weather:{farmId}).
 * - Return 404 if the farm doesn't exist/not owned; 502 with a friendly
 *   error if the upstream is down or slow (10s client timeout)
 *   (Feature 19.7).
 *
 * Feature references: 3.x, 19.7.
 * ============================================================================
 */
package handlers

import (
	"context"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kijanifarmer/backend/internal/clients"
	"github.com/kijanifarmer/backend/internal/models"
	"github.com/kijanifarmer/backend/internal/repository"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

const cacheTTL = 1 * time.Hour

func GetWeatherHandler(c *gin.Context) {
	farmID := c.Param("farmId")
	userID, _ := middleware.GetUserIDFromContext(c)

	// Check Redis cache first
	rdb := c.MustGet("redis_client").(*redis.Client)
	cacheKey := fmt.Sprintf("weather:%s", farmID)
	cached, err := rdb.Get(c.Request.Context(), cacheKey).Result()
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"data": cached, "from_cache": true})
		return
	}

	// Farm not in cache; verify ownership and fetch from KijaniBox
	repo := repository.NewWeatherRepository(c.MustGet("db_pool").(*pgxpool.Pool))
	farmRepo := repository.NewFarmRepository(c.MustGet("db_pool").(*pgxpool.Pool))
	
	var farm models.Farm
	farm, err = farmRepo.GetFarmByID(c.Request.Context(), farmID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}
	if farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	kijani := clients.NewKijaniboxClient(c.MustGet("kijanibox_base_url").(string), c.MustGet("kijanibox_api_key").(string))
	weatherData, err := kijani.GetWeatherForecast(c.Request.Context(), farm.Latitude, farm.Longitude)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": fmt.Sprintf("upstream error: %v", err)})
		return
	}

	// Backfill Redis
	weatherRecord := models.Weather{
		FarmID:              farmID,
		Temperature:         weatherData.Temperature,
		RainfallProbability: weatherData.RainfallProbability,
		SoilMoisture:        weatherData.Temperature, // soil moisture from KijaniBox
		ForecastDate:        time.Now(),
	}
	_ = repo.SaveWeatherForecast(c.Request.Context(), &weatherRecord)

	_ = rdb.Set(c.Request.Context(), cacheKey, fmt.Sprintf("%f", weatherData.Temperature), cacheTTL)

	c.JSON(http.StatusOK, gin.H{"data": gin.H{"temperature": weatherData.Temperature, "rainfall_probability": weatherData.RainfallProbability}, "from_cache": false})
}

func GetSoilMoistureHandler(c *gin.Context) {
	farmID := c.Param("farmId")
	userID, _ := middleware.GetUserIDFromContext(c)

	// Check Redis cache first
	rdb := c.MustGet("redis_client").(*redis.Client)
	cacheKey := fmt.Sprintf("soil:%s", farmID)
	cached, err := rdb.Get(c.Request.Context(), cacheKey).Result()
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"data": cached, "from_cache": true})
		return
	}

	// Farm not in cache; verify ownership and fetch from KijaniBox
	repo := repository.NewWeatherRepository(c.MustGet("db_pool").(*pgxpool.Pool))
	farmRepo := repository.NewFarmRepository(c.MustGet("db_pool").(*pgxpool.Pool))

	var farm models.Farm
	farm, err = farmRepo.GetFarmByID(c.Request.Context(), farmID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}
	if farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	kijani := clients.NewKijaniboxClient(c.MustGet("kijanibox_base_url").(string), c.MustGet("kijanibox_api_key").(string))
	soilData, err := kijani.GetSoilMoisture(c.Request.Context(), farm.Latitude, farm.Longitude)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": fmt.Sprintf("upstream error: %v", err)})
		return
	}

	// Backfill Redis
	cacheKey = fmt.Sprintf("soil:%s", farmID)
	_ = rdb.Set(c.Request.Context(), cacheKey, fmt.Sprintf("%f", soilData.MoistureLevel), cacheTTL)

	c.JSON(http.StatusOK, gin.H{"data": gin.H{"moisture_level": soilData.MoistureLevel}, "from_cache": false})
}
