package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/amatsi/backend/internal/api/middleware"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/services"
)

// FarmHandler serves the /api/farms routes.
type FarmHandler struct {
	svc *services.FarmService
}

func NewFarmHandler(svc *services.FarmService) *FarmHandler {
	return &FarmHandler{svc: svc}
}

func (h *FarmHandler) GetFarms(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	farms, err := h.svc.GetFarmerFarms(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if farms == nil {
		farms = []*models.Farm{}
	}
	c.JSON(http.StatusOK, farms)
}

func (h *FarmHandler) GetFarm(c *gin.Context) {
	id := c.Param("id")
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	farm, err := h.svc.GetFarm(c.Request.Context(), id)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}
	c.JSON(http.StatusOK, farm)
}

func (h *FarmHandler) CreateFarm(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	var input struct {
		Name               string  `json:"name" binding:"required"`
		DeviceID           *string `json:"device_id"`
		AreaHectares       float64 `json:"area_hectares" binding:"required"`
		CropType           string  `json:"crop_type" binding:"required"`
		SoilType           string  `json:"soil_type" binding:"required"`
		IrrigationMethod   string  `json:"irrigation_method" binding:"required"`
		TankCapacityLiters float64 `json:"tank_capacity_liters" binding:"required"`
		PlantingDate       string  `json:"planting_date" binding:"required"`
		Latitude           float64 `json:"latitude" binding:"required"`
		Longitude          float64 `json:"longitude" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	plantingDate, err := time.Parse("2006-01-02", input.PlantingDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "planting_date must be YYYY-MM-DD"})
		return
	}

	farm := &models.Farm{
		UserID:             userID,
		Name:               input.Name,
		DeviceID:           normalizedDeviceID(input.DeviceID),
		AreaHectares:       input.AreaHectares,
		CropType:           input.CropType,
		SoilType:           input.SoilType,
		IrrigationMethod:   input.IrrigationMethod,
		TankCapacityLiters: input.TankCapacityLiters,
		PlantingDate:       plantingDate,
		Latitude:           input.Latitude,
		Longitude:          input.Longitude,
	}

	if err := h.svc.CreateFarm(c.Request.Context(), farm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, farm)
}

func (h *FarmHandler) UpdateFarm(c *gin.Context) {
	id := c.Param("id")
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	var input struct {
		Name               string   `json:"name"`
		DeviceID           *string  `json:"device_id"`
		AreaHectares       *float64 `json:"area_hectares"`
		CropType           string   `json:"crop_type"`
		SoilType           string   `json:"soil_type"`
		IrrigationMethod   string   `json:"irrigation_method"`
		TankCapacityLiters *float64 `json:"tank_capacity_liters"`
		PlantingDate       string   `json:"planting_date"`
		Latitude           *float64 `json:"latitude"`
		Longitude          *float64 `json:"longitude"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	farm, err := h.svc.GetFarm(c.Request.Context(), id)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}

	if input.Name != "" {
		farm.Name = input.Name
	}
	if input.DeviceID != nil {
		farm.DeviceID = normalizedDeviceID(input.DeviceID)
	}
	if input.AreaHectares != nil {
		farm.AreaHectares = *input.AreaHectares
	}
	if input.CropType != "" {
		farm.CropType = input.CropType
	}
	if input.SoilType != "" {
		farm.SoilType = input.SoilType
	}
	if input.IrrigationMethod != "" {
		farm.IrrigationMethod = input.IrrigationMethod
	}
	if input.TankCapacityLiters != nil {
		farm.TankCapacityLiters = *input.TankCapacityLiters
	}
	if input.PlantingDate != "" {
		pd, err := time.Parse("2006-01-02", input.PlantingDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "planting_date must be YYYY-MM-DD"})
			return
		}
		farm.PlantingDate = pd
	}
	if input.Latitude != nil {
		farm.Latitude = *input.Latitude
	}
	if input.Longitude != nil {
		farm.Longitude = *input.Longitude
	}

	if err := h.svc.UpdateFarm(c.Request.Context(), farm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, farm)
}

func (h *FarmHandler) DeleteFarm(c *gin.Context) {
	id := c.Param("id")
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	farm, err := h.svc.GetFarm(c.Request.Context(), id)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}
	if err := h.svc.DeleteFarm(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}

func normalizedDeviceID(deviceID *string) *string {
	if deviceID == nil {
		return nil
	}

	value := strings.TrimSpace(*deviceID)
	if value == "" {
		return nil
	}

	return &value
}