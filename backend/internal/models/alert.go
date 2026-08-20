package models

import (
	"time"
)

type Alert struct {
	ID        string     `json:"id" db:"id"`
	FarmID    string     `json:"farm_id" db:"farm_id"`
	Message   string     `json:"message" db:"message"`
	Status    string     `json:"status" db:"status"` // PENDING, SENT, FAILED
	SentAt    *time.Time `json:"sent_at" db:"sent_at"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
}
