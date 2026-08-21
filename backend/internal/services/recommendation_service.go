package services

import (
	"context"
	"github.com/kijanifarmer/backend/internal/clients"
	"github.com/kijanifarmer/backend/internal/models"
	"github.com/kijanifarmer/backend/internal/repository"
	"time"
)

type RecommendationService struct {
	recRepo     *repository.RecommendationRepository
	weatherRepo *repository.WeatherRepository
	farmRepo    *repository.FarmRepository
	kijani      *clients.KijaniboxClient
	ai          *clients.PythonAIClient
}

func NewRecommendationService(
	recRepo *repository.RecommendationRepository,
	weatherRepo *repository.WeatherRepository,
	farmRepo *repository.FarmRepository,
	kijani *clients.KijaniboxClient,
	ai *clients.PythonAIClient,
) *RecommendationService {
	return &RecommendationService{
		recRepo:     recRepo,
		weatherRepo: weatherRepo,
		farmRepo:    farmRepo,
		kijani:      kijani,
		ai:          ai,
	}
}

func (s *RecommendationService) GenerateRecommendation(ctx context.Context, farmID string) (*models.Recommendation, error) {
	farm, err := s.farmRepo.GetFarmByID(ctx, farmID)
	if err != nil {
		return nil, err
	}

	weatherData, err := s.kijani.GetWeatherForecast(ctx, farm.Latitude, farm.Longitude)
	if err != nil {
		return nil, err
	}

	soilData, err := s.kijani.GetSoilMoisture(ctx, farm.Latitude, farm.Longitude)
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

	aiReq := &clients.RecommendationRequest{
		CropType:            farm.CropType,
		SoilType:            farm.SoilType,
		Temperature:         weatherRecord.Temperature,
		RainfallProbability: weatherRecord.RainfallProbability,
		SoilMoisture:        weatherRecord.SoilMoisture,
		TankCapacityLiters:  farm.TankCapacityLiters,
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

	return rec, nil
}
