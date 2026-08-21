package repository

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kijanifarmer/backend/internal/models"
)

type WeatherRepository struct {
	db *pgxpool.Pool
}

func NewWeatherRepository(db *pgxpool.Pool) *WeatherRepository {
	return &WeatherRepository{db: db}
}

func (r *WeatherRepository) SaveWeatherForecast(ctx context.Context, weather *models.Weather) error {
	query := `
		INSERT INTO weather (farm_id, temperature, rainfall_probability, soil_moisture, forecast_date)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at
	`
	err := r.db.QueryRow(ctx, query,
		weather.FarmID,
		weather.Temperature,
		weather.RainfallProbability,
		weather.SoilMoisture,
		weather.ForecastDate,
	).Scan(&weather.ID, &weather.CreatedAt)

	return err
}

func (r *WeatherRepository) GetLatestWeatherForecast(ctx context.Context, farmID string) (*models.Weather, error) {
	query := `
		SELECT id, farm_id, temperature, rainfall_probability, soil_moisture, forecast_date, created_at
		FROM weather
		WHERE farm_id = $1
		ORDER BY forecast_date DESC
		LIMIT 1
	`
	w := &models.Weather{}
	err := r.db.QueryRow(ctx, query, farmID).Scan(
		&w.ID,
		&w.FarmID,
		&w.Temperature,
		&w.RainfallProbability,
		&w.SoilMoisture,
		&w.ForecastDate,
		&w.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return w, nil
}
