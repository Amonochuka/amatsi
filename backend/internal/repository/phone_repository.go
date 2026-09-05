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
		SELECT id, user_id, phone_number, label, is_primary, opted_out, created_at
		FROM user_phones
		WHERE user_id = $1 AND opted_out = false
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
			&phone.OptedOut,
			&phone.CreatedAt,
		); err != nil {
			return nil, err
		}
		phones = append(phones, phone)
	}
	return phones, rows.Err()
}

// FindByDialPhone returns every user_phones row whose number matches after
// stripping non-digit characters. It does not filter opted_out so that a reply
// can re-enable a previously opted-out recipient.
func (r *PhoneRepository) FindByDialPhone(ctx context.Context, dialDigits string) ([]*models.UserPhone, error) {
	query := `
		SELECT id, user_id, phone_number, label, is_primary, opted_out, created_at
		FROM user_phones
		WHERE regexp_replace(phone_number, '[^0-9]', '', 'g') = $1
		ORDER BY created_at ASC
	`
	rows, err := r.db.Query(ctx, query, dialDigits)
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
			&phone.OptedOut,
			&phone.CreatedAt,
		); err != nil {
			return nil, err
		}
		phones = append(phones, phone)
	}
	return phones, rows.Err()
}

// SetOptedOut flags a user_phones row as opted out (true) or re-enabled (false).
func (r *PhoneRepository) SetOptedOut(ctx context.Context, id string, optedOut bool) error {
	query := `
		UPDATE user_phones
		SET opted_out = $2
		WHERE id = $1
	`
	_, err := r.db.Exec(ctx, query, id, optedOut)
	return err
}

func (r *PhoneRepository) DeletePhone(ctx context.Context, id, userID string) error {
	query := `
		DELETE FROM user_phones
		WHERE id = $1 AND user_id = $2 AND is_primary = false
	`
	_, err := r.db.Exec(ctx, query, id, userID)
	return err
}