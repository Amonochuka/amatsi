package models

import (
	"time"
)

type User struct {
	ID           string    `json:"id" db:"id"`
	FullName     string    `json:"full_name" db:"full_name"`
	PhoneNumber  string    `json:"phone_number" db:"phone_number"`
	Email        string    `json:"email,omitempty" db:"email"`
	PasswordHash string    `json:"-" db:"password_hash"`
	Language     string    `json:"language" db:"language"`
	SMSEnabled   bool      `json:"sms_enabled" db:"sms_enabled"`
	IsPremium    bool      `json:"is_premium" db:"is_premium"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}
