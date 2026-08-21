package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kijanifarmer/backend/internal/models"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	query := `
		SELECT id, full_name, phone_number, COALESCE(email, ''), COALESCE(password_hash, ''),
		       COALESCE(language, 'en'), COALESCE(sms_enabled, true), is_premium, created_at, updated_at
		FROM users
		WHERE id = $1
	`
	user := &models.User{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.FullName,
		&user.PhoneNumber,
		&user.Email,
		&user.PasswordHash,
		&user.Language,
		&user.SMSEnabled,
		&user.IsPremium,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) GetUserByPhone(ctx context.Context, phone string) (*models.User, error) {
	query := `
		SELECT id, full_name, phone_number, COALESCE(email, ''), COALESCE(password_hash, ''),
		       COALESCE(language, 'en'), COALESCE(sms_enabled, true), is_premium, created_at, updated_at
		FROM users
		WHERE phone_number = $1
	`
	user := &models.User{}
	err := r.db.QueryRow(ctx, query, phone).Scan(
		&user.ID,
		&user.FullName,
		&user.PhoneNumber,
		&user.Email,
		&user.PasswordHash,
		&user.Language,
		&user.SMSEnabled,
		&user.IsPremium,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *UserRepository) CreateUser(ctx context.Context, user *models.User) error {
	// Ensure auth.users row exists for FK (local/demo Supabase schema).
	_, _ = r.db.Exec(ctx, `INSERT INTO auth.users (id, email) VALUES ($1, $2) ON CONFLICT DO NOTHING`, user.ID, user.Email)

	query := `
		INSERT INTO users (id, full_name, phone_number, email, password_hash, language, sms_enabled)
		VALUES ($1, $2, $3, NULLIF($4, ''), $5, $6, $7)
		RETURNING created_at, updated_at, is_premium
	`
	return r.db.QueryRow(ctx, query,
		user.ID,
		user.FullName,
		user.PhoneNumber,
		user.Email,
		user.PasswordHash,
		user.Language,
		user.SMSEnabled,
	).Scan(&user.CreatedAt, &user.UpdatedAt, &user.IsPremium)
}
