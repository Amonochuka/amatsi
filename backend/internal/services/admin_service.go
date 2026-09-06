package services

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"

	"github.com/amatsi/backend/internal/repository"
)

// ErrAdminRequired is returned when a caller who is not an admin tries to use
// an admin-only endpoint.
var ErrAdminRequired = errors.New("admin privileges required")

// AdminService exposes operator-only actions (currently: manually granting or
// revoking the premium tier). Authorization is checked against the caller's
// is_admin flag on the users table.
type AdminService struct {
	userRepo *repository.UserRepository
}

func NewAdminService(userRepo *repository.UserRepository) *AdminService {
	return &AdminService{userRepo: userRepo}
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