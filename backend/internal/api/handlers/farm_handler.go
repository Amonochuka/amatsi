package handlers

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kijanifarmer/backend/internal/api/middleware"
	"github.com/kijanifarmer/backend/internal/models"
	"github.com/kijanifarmer/backend/internal/repository"
	"github.com/kijanifarmer/backend/internal/services"
)

func GetFarmsHandler(c *gin.Context) {
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	db := c.MustGet("db_pool").(*pgxpool.Pool)
	farmSvc := services.NewFarmService(repository.NewFarmRepository(db))
	farms, err := farmSvc.GetFarmerFarms(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, farms)
}

func GetFarmHandler(c *gin.Context) {
	id := c.Param("id")
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	db := c.MustGet("db_pool").(*pgxpool.Pool)
	farmSvc := services.NewFarmService(repository.NewFarmRepository(db))
	farm, err := farmSvc.GetFarm(c.Request.Context(), id)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}
	c.JSON(http.StatusOK, farm)
}

func CreateFarmHandler(c *gin.Context) {
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

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	svc := services.NewFarmService(repository.NewFarmRepository(db))
	if err := svc.CreateFarm(c.Request.Context(), farm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, farm)
}

func UpdateFarmHandler(c *gin.Context) {
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

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	svc := services.NewFarmService(repository.NewFarmRepository(db))
	farm, err := svc.GetFarm(c.Request.Context(), id)
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

	if err := svc.UpdateFarm(c.Request.Context(), farm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, farm)
}

func DeleteFarmHandler(c *gin.Context) {
	id := c.Param("id")
	userID, ok := middleware.GetUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	db := c.MustGet("db_pool").(*pgxpool.Pool)
	repo := repository.NewFarmRepository(db)
	farm, err := repo.GetFarmByID(c.Request.Context(), id)
	if err != nil || farm.UserID != userID {
		c.JSON(http.StatusNotFound, gin.H{"error": "farm not found"})
		return
	}
	if err := repo.DeleteFarm(c.Request.Context(), id); err != nil {
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
