package services

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"

	"github.com/amatsi/backend/internal/clients"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/repository"
)

const weatherCacheTTL = time.Hour

// ForecastData is the payload reported to the client for a farm's weather.
type ForecastData struct {
	Temperature         float64 `json:"temperature"`
	RainfallProbability float64 `json:"rainfall_probability"`
}

// WeatherService fetches weather and soil-moisture data from the KijaniBox
// upstream, scoped to the farm owner, and caches the result in Redis.
type WeatherService struct {
	farmRepo    *repository.FarmRepository
	weatherRepo *repository.WeatherRepository
	kijani      *clients.KijaniboxClient
	rdb         *redis.Client
}

func NewWeatherService(
	farmRepo *repository.FarmRepository,
	weatherRepo *repository.WeatherRepository,
	kijani *clients.KijaniboxClient,
	rdb *redis.Client,
) *WeatherService {
	return &WeatherService{
		farmRepo:    farmRepo,
		weatherRepo: weatherRepo,
		kijani:      kijani,
		rdb:         rdb,
	}
}

// GetWeather returns the farm's current weather forecast. A missing farm (or
// one belonging to a different user) maps to ErrFarmNotFound; upstream failures
// map to ErrUpstreamUnavailable.
func (s *WeatherService) GetWeather(ctx context.Context, farmID, userID string) (ForecastData, bool, error) {
	cacheKey := "weather:" + farmID
	if cached, err := s.rdb.Get(ctx, cacheKey).Bytes(); err == nil {
		var data ForecastData
		if json.Unmarshal(cached, &data) == nil {
			return data, true, nil
		}
	}

	farm, err := s.farmRepo.GetFarmByID(ctx, farmID)
	if err != nil || farm.UserID != userID {
		return ForecastData{}, false, ErrFarmNotFound
	}

	weatherData, err := s.kijani.GetWeatherForecast(ctx, farm.Latitude, farm.Longitude)
	if err != nil {
		return ForecastData{}, false, ErrUpstreamUnavailable
	}

	data := ForecastData{
		Temperature:         weatherData.Temperature,
		RainfallProbability: weatherData.RainfallProbability,
	}
	if b, err := json.Marshal(data); err == nil {
		_ = s.rdb.Set(ctx, cacheKey, b, weatherCacheTTL).Err()
	}

	_ = s.weatherRepo.SaveWeatherForecast(ctx, &models.Weather{
		FarmID:              farmID,
		Temperature:         data.Temperature,
		RainfallProbability: data.RainfallProbability,
		SoilMoisture:        0,
		ForecastDate:        time.Now(),
	})

	return data, false, nil
}

// GetSoilMoisture returns the farm's current soil-moisture level.
func (s *WeatherService) GetSoilMoisture(ctx context.Context, farmID, userID string) (float64, bool, error) {
	cacheKey := "soil:" + farmID
	if cached, err := s.rdb.Get(ctx, cacheKey).Bytes(); err == nil {
		var data struct {
			MoistureLevel float64 `json:"moisture_level"`
		}
		if json.Unmarshal(cached, &data) == nil {
			return data.MoistureLevel, true, nil
		}
	}

	farm, err := s.farmRepo.GetFarmByID(ctx, farmID)
	if err != nil || farm.UserID != userID {
		return 0, false, ErrFarmNotFound
	}

	soilData, err := s.kijani.GetSoilMoisture(ctx, farm.Latitude, farm.Longitude)
	if err != nil {
		return 0, false, ErrUpstreamUnavailable
	}

	payload := fmt.Sprintf(`{"moisture_level": %f}`, soilData.MoistureLevel)
	_ = s.rdb.Set(ctx, cacheKey, payload, weatherCacheTTL).Err()

	return soilData.MoistureLevel, false, nil
}