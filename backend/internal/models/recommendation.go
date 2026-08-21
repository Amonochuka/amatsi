package models

import (
	"time"
)

type Recommendation struct {
	ID                 string    `json:"id" db:"id"`
	FarmID             string    `json:"farm_id" db:"farm_id"`
	Action             string    `json:"action" db:"action"` // IRRIGATE, WAIT, MONITOR, CONSERVE
	Reason             string    `json:"reason" db:"reason"`
	WaterSavedEstimate float64   `json:"water_saved_estimate" db:"water_saved_estimate"`
	CreatedAt          time.Time `json:"created_at" db:"created_at"`
}
