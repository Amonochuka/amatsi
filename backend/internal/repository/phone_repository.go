package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/amatsi/backend/internal/models"
)

type PhoneRepository struct {
	db *pgxpool.Pool
}

func NewPhoneRepository(db *pgxpool.Pool) *PhoneRepository {
	return &PhoneRepository{db: db}
}

func (r *PhoneRepository) CreatePhone(ctx context.Context, phone *models.UserPhone) error {
	query := `
		INSERT INTO user_phones (user_id, phone_number, label, is_primary)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at
	`
	err := r.db.QueryRow(ctx, query,
		phone.UserID,
		phone.PhoneNumber,
		phone.Label,
		phone.IsPrimary,
	).Scan(&phone.ID, &phone.CreatedAt)

	return err
}

func (r *PhoneRepository) GetPhonesByUser(ctx context.Context, userID string) ([]*models.UserPhone, error) {
	query := `
		SELECT id, user_id, phone_number, label, is_primary, created_at
		FROM user_phones
		WHERE user_id = $1
		ORDER BY is_primary DESC, created_at ASC
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var phones []*models.UserPhone
	for rows.Next() {
		phone := &models.UserPhone{}
		if err := rows.Scan(
			&phone.ID,
			&phone.UserID,
			&phone.PhoneNumber,
			&phone.Label,
			&phone.IsPrimary,
			&phone.CreatedAt,
		); err != nil {
			return nil, err
		}
		phones = append(phones, phone)
	}
	return phones, rows.Err()
}

func (r *PhoneRepository) DeletePhone(ctx context.Context, id, userID string) error {
	query := `
		DELETE FROM user_phones
		WHERE id = $1 AND user_id = $2 AND is_primary = false
	`
	_, err := r.db.Exec(ctx, query, id, userID)
	return err
}