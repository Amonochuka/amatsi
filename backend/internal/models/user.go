package models

import (
	"time"
)

type User struct {
	ID          string    `json:"id" db:"id"`
	FullName    string    `json:"full_name" db:"full_name"`
	PhoneNumber string    `json:"phone_number" db:"phone_number"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}
