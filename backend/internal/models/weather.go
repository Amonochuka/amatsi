package models

import (
	"time"
)

type Weather struct {
	ID                  string    `json:"id" db:"id"`
	FarmID              string    `json:"farm_id" db:"farm_id"`
	Temperature         float64   `json:"temperature" db:"temperature"`
	RainfallProbability float64   `json:"rainfall_probability" db:"rainfall_probability"`
	SoilMoisture        float64   `json:"soil_moisture" db:"soil_moisture"`
	ForecastDate        time.Time `json:"forecast_date" db:"forecast_date"`
	CreatedAt           time.Time `json:"created_at" db:"created_at"`
}
