package models

import (
	"time"
)

type Farm struct {
	ID                 string    `json:"id" db:"id"`
	UserID             string    `json:"user_id" db:"user_id"`
	Name               string    `json:"name" db:"name"`
	DeviceID           *string   `json:"device_id" db:"device_id"`
	Latitude           float64   `json:"latitude" db:"latitude"`
	Longitude          float64   `json:"longitude" db:"longitude"`
	AreaHectares       float64   `json:"area_hectares" db:"area_hectares"`
	CropType           string    `json:"crop_type" db:"crop_type"`
	SoilType           string    `json:"soil_type" db:"soil_type"`
	IrrigationMethod   string    `json:"irrigation_method" db:"irrigation_method"`
	TankCapacityLiters float64   `json:"tank_capacity_liters" db:"tank_capacity_liters"`
	PlantingDate       time.Time `json:"planting_date" db:"planting_date"`
	CreatedAt          time.Time `json:"created_at" db:"created_at"`
	UpdatedAt          time.Time `json:"updated_at" db:"updated_at"`
}
