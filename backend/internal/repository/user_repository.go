package repository

import (
	"context"
	"regexp"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/amatsi/backend/internal/models"
)

// digitsOnly matches anything that is not a digit; replacing with "" yields
// the bare phone digits used for comparisons.
var digitsOnly = regexp.MustCompile(`[^0-9]`)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) GetUserByID(ctx context.Context, id string) (*models.User, error) {
	query := `
		SELECT id, full_name, phone_number, COALESCE(email, ''), COALESCE(password_hash, ''),
		       COALESCE(language, 'en'), COALESCE(sms_enabled, true), is_premium, is_admin, created_at, updated_at
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
		&user.IsAdmin,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// GetUserByPhone looks up a user by phone number after stripping non-digit
// characters from both sides, so "0700000000", "254700000000" and
// "+254700000000" all resolve to the same account (mirrors how inbound SMS
// replies are resolved).
func (r *UserRepository) GetUserByPhone(ctx context.Context, phone string) (*models.User, error) {
	digits := digitsOnly.ReplaceAllString(phone, "")
	query := `
		SELECT id, full_name, phone_number, COALESCE(email, ''), COALESCE(password_hash, ''),
		       COALESCE(language, 'en'), COALESCE(sms_enabled, true), is_premium, is_admin, created_at, updated_at
		FROM users
		WHERE regexp_replace(phone_number, '[^0-9]', '', 'g') = $1
	`
	user := &models.User{}
	err := r.db.QueryRow(ctx, query, digits).Scan(
		&user.ID,
		&user.FullName,
		&user.PhoneNumber,
		&user.Email,
		&user.PasswordHash,
		&user.Language,
		&user.SMSEnabled,
		&user.IsPremium,
		&user.IsAdmin,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// FindUserByDialPhone looks up a user whose number matches after stripping
// non-digit characters, so replies from Africa's Talking (which may omit the
// leading plus or country code) still resolve to the account.
func (r *UserRepository) FindUserByDialPhone(ctx context.Context, dialDigits string) (*models.User, error) {
	query := `
		SELECT id, full_name, phone_number, COALESCE(email, ''), COALESCE(password_hash, ''),
		       COALESCE(language, 'en'), COALESCE(sms_enabled, true), is_premium, is_admin, created_at, updated_at
		FROM users
		WHERE regexp_replace(phone_number, '[^0-9]', '', 'g') = $1
	`
	user := &models.User{}
	err := r.db.QueryRow(ctx, query, dialDigits).Scan(
		&user.ID,
		&user.FullName,
		&user.PhoneNumber,
		&user.Email,
		&user.PasswordHash,
		&user.Language,
		&user.SMSEnabled,
		&user.IsPremium,
		&user.IsAdmin,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// SetSMSEnabled flips the account's SMS alert preference (used for inbound
// STOP / START replies).
func (r *UserRepository) SetSMSEnabled(ctx context.Context, userID string, smsEnabled bool) error {
	query := `
		UPDATE users
		SET sms_enabled = $2,
		    updated_at = timezone('utc'::text, now())
		WHERE id = $1
	`
	_, err := r.db.Exec(ctx, query, userID, smsEnabled)
	return err
}

// SetPremium grants or revokes the premium tier for a user (admin-only). It
// returns pgx.ErrNoRows when the user does not exist.
func (r *UserRepository) SetPremium(ctx context.Context, userID string, premium bool) error {
	query := `
		UPDATE users
		SET is_premium = $2,
		    updated_at = timezone('utc'::text, now())
		WHERE id = $1
	`
	tag, err := r.db.Exec(ctx, query, userID, premium)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *UserRepository) UpdateUserProfile(ctx context.Context, user *models.User) error {
	query := `
		UPDATE users
		SET full_name   = $2,
		    phone_number = $3,
		    email       = NULLIF($4, ''),
		    language    = $5,
		    sms_enabled = $6,
		    updated_at  = timezone('utc'::text, now())
		WHERE id = $1
		RETURNING updated_at
	`
	return r.db.QueryRow(ctx, query,
		user.ID,
		user.FullName,
		user.PhoneNumber,
		user.Email,
		user.Language,
		user.SMSEnabled,
	).Scan(&user.UpdatedAt)
}

func (r *UserRepository) UpdatePasswordHash(ctx context.Context, userID, passwordHash string) error {
	query := `
		UPDATE users
		SET password_hash = $2,
		    updated_at   = timezone('utc'::text, now())
		WHERE id = $1
	`
	tag, err := r.db.Exec(ctx, query, userID, passwordHash)
	if err != nil {
		return err
	}
	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (r *UserRepository) CreateUser(ctx context.Context, user *models.User) error {
	query := `
		INSERT INTO users (id, full_name, phone_number, email, password_hash, language, sms_enabled)
		VALUES ($1, $2, $3, NULLIF($4, ''), $5, $6, $7)
		RETURNING created_at, updated_at, is_premium, is_admin
	`
	return r.db.QueryRow(ctx, query,
		user.ID,
		user.FullName,
		user.PhoneNumber,
		user.Email,
		user.PasswordHash,
		user.Language,
		user.SMSEnabled,
	).Scan(&user.CreatedAt, &user.UpdatedAt, &user.IsPremium, &user.IsAdmin)
}

// DeleteAccount removes a user and every row that references them, in FK-safe
// order, inside a single transaction: weather/recommendations/alerts for the
// user's farms, then the farms, their extra SMS phones, the profile row, and
// finally the matching auth.users entry (users.id references auth.users.id).
func (r *UserRepository) DeleteAccount(ctx context.Context, userID string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	statements := []string{
		`DELETE FROM weather WHERE farm_id IN (SELECT id FROM farms WHERE user_id = $1)`,
		`DELETE FROM recommendations WHERE farm_id IN (SELECT id FROM farms WHERE user_id = $1)`,
		`DELETE FROM alerts WHERE farm_id IN (SELECT id FROM farms WHERE user_id = $1)`,
		`DELETE FROM farms WHERE user_id = $1`,
		`DELETE FROM user_phones WHERE user_id = $1`,
		`DELETE FROM users WHERE id = $1`,
		`DELETE FROM auth.users WHERE id = $1`,
	}
	for _, stmt := range statements {
		if _, err := tx.Exec(ctx, stmt, userID); err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}

// UpsertBootstrapAdmin ensures an admin account exists by phone. If a user
// with that phone already exists, their password, name, and is_admin flag are
// updated. Otherwise a new account is created. This runs unconditionally on
// every startup when ADMIN_BOOTSTRAP_PHONE + ADMIN_BOOTSTRAP_PASSWORD are set,
// so you can always log in as admin after a fresh deploy.
func (r *UserRepository) UpsertBootstrapAdmin(ctx context.Context, phone, name, passwordHash string) error {
	query := `
		INSERT INTO users (id, full_name, phone_number, email, password_hash, language, sms_enabled, is_premium, is_admin)
		VALUES (gen_random_uuid(), $1, $2, NULL, $3, 'en', true, true, true)
		ON CONFLICT (phone_number) WHERE phone_number IS NOT NULL
		DO UPDATE SET
		full_name    = EXCLUDED.full_name,
		password_hash = EXCLUDED.password_hash,
		is_admin      = true,
		is_premium    = true,
		updated_at    = timezone('utc'::text, now())
	`
	_, err := r.db.Exec(ctx, query, name, phone, passwordHash)
	return err
}
