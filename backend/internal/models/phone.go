package models

import (
	"time"
)

// UserPhone is an additional SMS recipient registered against a user account.
type UserPhone struct {
	ID          string    `json:"id" db:"id"`
	UserID      string    `json:"user_id" db:"user_id"`
	PhoneNumber string    `json:"phone_number" db:"phone_number"`
	Label       string    `json:"label" db:"label"`
	IsPrimary   bool      `json:"is_primary" db:"is_primary"`
	OptedOut    bool      `json:"opted_out" db:"opted_out"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
}
