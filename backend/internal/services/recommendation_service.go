package services

import (
	"context"
	"github.com/amatsi/backend/internal/clients"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/repository"
	"math"
	"time"
)

type RecommendationService struct {
	recRepo     *repository.RecommendationRepository
	weatherRepo *repository.WeatherRepository
	farmRepo    *repository.FarmRepository
	userRepo    *repository.UserRepository
	kijani      *clients.KijaniboxClient
	ai          *clients.PythonAIClient
	mqtt        *clients.MQTTClient
	alertSvc    *AlertService
}

func NewRecommendationService(
	recRepo *repository.RecommendationRepository,
	weatherRepo *repository.WeatherRepository,
	farmRepo *repository.FarmRepository,
	userRepo *repository.UserRepository,
	kijani *clients.KijaniboxClient,
	ai *clients.PythonAIClient,
	mqtt *clients.MQTTClient,
	alertSvc *AlertService,
) *RecommendationService {
	return &RecommendationService{
		recRepo:     recRepo,
		weatherRepo: weatherRepo,
		farmRepo:    farmRepo,
		userRepo:    userRepo,
		kijani:      kijani,
		ai:          ai,
		mqtt:        mqtt,
		alertSvc:    alertSvc,
	}
}

func (s *RecommendationService) GenerateRecommendation(ctx context.Context, farmID string) (*models.Recommendation, error) {
	farm, err := s.farmRepo.GetFarmByID(ctx, farmID)
	if err != nil {
		return nil, err
	}

	weatherData, soilData, err := s.kijani.GetLandForecast(ctx, farm.Latitude, farm.Longitude)
	if err != nil {
		return nil, err
	}

	weatherRecord := &models.Weather{
		FarmID:              farmID,
		Temperature:         weatherData.Temperature,
		RainfallProbability: weatherData.RainfallProbability,
		SoilMoisture:        soilData.MoistureLevel,
		ForecastDate:        time.Now(),
	}
	_ = s.weatherRepo.SaveWeatherForecast(ctx, weatherRecord)

	// ── Tank simulation: update level based on today's weather ──
	s.updateTankFromWeather(ctx, farm, weatherRecord)

	// The AI's CONSERVE/confidence logic keys off the tank's *current* water,
	// not its capacity. Rainfed farms (no tank) fall back to the capacity value.
	tankLevel := farm.TankCapacityLiters
	if farm.TankCurrentLiters != nil {
		tankLevel = *farm.TankCurrentLiters
	}
	aiReq := &clients.RecommendationRequest{
		CropType:            farm.CropType,
		SoilType:            farm.SoilType,
		Temperature:         weatherRecord.Temperature,
		RainfallProbability: weatherRecord.RainfallProbability,
		SoilMoisture:        weatherRecord.SoilMoisture,
		TankLevel:           math.Round(tankLevel*10) / 10,
		FieldSizeSquareM:    farm.AreaHectares * 10_000,
	}

	aiRes, err := s.ai.GetRecommendation(ctx, aiReq)
	if err != nil {
		return nil, err
	}

	rec := &models.Recommendation{
		FarmID:             farmID,
		Action:             aiRes.Action,
		Reason:             aiRes.Reason,
		WaterSavedEstimate: aiRes.WaterSavedEstimate,
	}

	if err := s.recRepo.CreateRecommendation(ctx, rec); err != nil {
		return nil, err
	}

	if rec.Action == "IRRIGATE" {
		// ── Tank simulation: deduct the real irrigated volume, not the "saved" estimate ──
		s.deductIrrigation(ctx, farm, aiRes.WaterVolumeLiters)

		user, err := s.userRepo.GetUserByID(ctx, farm.UserID)
		if err == nil {
			if user.IsPremium && farm.DeviceID != nil && *farm.DeviceID != "" && s.mqtt != nil {
				durationMinutes := 45.0
				_ = s.mqtt.TriggerIrrigation(*farm.DeviceID, durationMinutes)
			} else if user.SMSEnabled {
				msg := "AMATSI Advisor: " + rec.Reason + " Action: " + rec.Action
				_ = s.alertSvc.SendAlertToRecipients(ctx, farmID, user.ID, user.PhoneNumber, msg)
			}
		}
	}

	return rec, nil
}

// updateTankFromWeather adjusts the tank level based on weather conditions:
// rain refills the tank, hot temperatures cause evaporation.
func (s *RecommendationService) updateTankFromWeather(ctx context.Context, farm *models.Farm, weather *models.Weather) {
	if farm.TankCapacityLiters <= 0 || farm.TankCurrentLiters == nil {
		return
	}
	capacity := farm.TankCapacityLiters
	current := *farm.TankCurrentLiters

	// Rain refill: proportional to rainfall probability
	if weather.RainfallProbability > 0 {
		rainFactor := weather.RainfallProbability / 100.0
		refill := capacity * rainFactor * 0.12 // up to 12% of capacity at 100% rain
		current = math.Min(capacity, current+refill)
	}

	// Evaporation: above 25°C, loses 0.2–2.5% per degree above
	if weather.Temperature > 25 {
		evapRate := (weather.Temperature - 25) / 100.0
		evap := capacity * evapRate
		current = math.Max(0, current-evap)
	}

	current = math.Round(current*10) / 10
	farm.TankCurrentLiters = &current
	_ = s.farmRepo.UpdateTankLevel(ctx, farm.ID, current)
}

// deductIrrigation removes the irrigated volume from the tank (floored at 0).
func (s *RecommendationService) deductIrrigation(ctx context.Context, farm *models.Farm, waterLiters float64) {
	if farm.TankCapacityLiters <= 0 || farm.TankCurrentLiters == nil {
		return
	}
	newLevel := math.Max(0, *farm.TankCurrentLiters-waterLiters)
	newLevel = math.Round(newLevel*10) / 10
	farm.TankCurrentLiters = &newLevel
	_ = s.farmRepo.UpdateTankLevel(ctx, farm.ID, newLevel)
}
