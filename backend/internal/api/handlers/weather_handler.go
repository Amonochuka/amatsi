package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/services"
)

// WeatherHandler serves the /api/weather/:farmId and /api/soil/:farmId routes.
type WeatherHandler struct {
	svc *services.WeatherService
}

func NewWeatherHandler(svc *services.WeatherService) *WeatherHandler {
	return &WeatherHandler{svc: svc}
}

func (h *WeatherHandler) GetWeather(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	data, fromCache, err := h.svc.GetWeather(c.Request.Context(), c.Param("farmId"), userID)
	if err != nil {
		if errors.Is(err, services.ErrFarmNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
			return
		}
		c.JSON(http.StatusBadGateway, gin.H{"error": "weather upstream unavailable"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": data, "from_cache": fromCache})
}

func (h *WeatherHandler) GetSoilMoisture(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	moisture, fromCache, err := h.svc.GetSoilMoisture(c.Request.Context(), c.Param("farmId"), userID)
	if err != nil {
		if errors.Is(err, services.ErrFarmNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
			return
		}
		c.JSON(http.StatusBadGateway, gin.H{"error": "soil upstream unavailable"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":       gin.H{"moisture_level": moisture},
		"from_cache": fromCache,
	})
}