package services

import (
	"context"
	"errors"
	"fmt"
	"io/fs"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/amatsi/backend/internal/repository"
)

// ErrAdminRequired is returned when a caller who is not an admin tries to use
// an admin-only endpoint.
var ErrAdminRequired = errors.New("admin privileges required")

// AdminService exposes operator-only actions (currently: manually granting or
// revoking the premium tier, and re-seeding demo data). Authorization is
// checked against the caller's is_admin flag on the users table.
type AdminService struct {
	userRepo *repository.UserRepository
	db       *pgxpool.Pool
	sqlFS    fs.FS
}

func NewAdminService(userRepo *repository.UserRepository, db *pgxpool.Pool, sqlFS fs.FS) *AdminService {
	return &AdminService{userRepo: userRepo, db: db, sqlFS: sqlFS}
}

// SetPremium sets a user's premium flag (grant or revoke). The caller must be
// an admin and the target user must exist.
func (s *AdminService) SetPremium(ctx context.Context, callerID, targetUserID string, premium bool) error {
	caller, err := s.userRepo.GetUserByID(ctx, callerID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrAccountNotFound
		}
		return err
	}

	if !caller.IsAdmin {
		return ErrAdminRequired
	}

	if _, err := s.userRepo.GetUserByID(ctx, targetUserID); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrAccountNotFound
		}
		return err
	}

	return s.userRepo.SetPremium(ctx, targetUserID, premium)
}

// Reseed executes the full demo seed SQL against the database. Only admins
// may call this. The seed file is read from the embedded migration FS and
// executed in a single transaction via pgconn simple-protocol (same pattern
// as the migration runner).
func (s *AdminService) Reseed(ctx context.Context, callerID string) error {
	caller, err := s.userRepo.GetUserByID(ctx, callerID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrAccountNotFound
		}
		return err
	}
	if !caller.IsAdmin {
		return ErrAdminRequired
	}

	body, err := fs.ReadFile(s.sqlFS, "migrations/006_seed_data.sql")
	if err != nil {
		return fmt.Errorf("failed to read seed file: %w", err)
	}
	if strings.TrimSpace(string(body)) == "" {
		return fmt.Errorf("seed file is empty")
	}

	conn, err := s.db.Acquire(ctx)
	if err != nil {
		return fmt.Errorf("failed to acquire connection: %w", err)
	}
	defer conn.Release()

	pgConn := conn.Conn().PgConn()

	if _, err := pgConn.Exec(ctx, "BEGIN").ReadAll(); err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer func() { _, _ = pgConn.Exec(ctx, "ROLLBACK").ReadAll() }()

	mrr := pgConn.Exec(ctx, string(body))
	if _, err := mrr.ReadAll(); err != nil {
		return fmt.Errorf("seed execution failed: %w", err)
	}

	if _, err := pgConn.Exec(ctx, "COMMIT").ReadAll(); err != nil {
		return fmt.Errorf("failed to commit seed transaction: %w", err)
	}

	return nil
}