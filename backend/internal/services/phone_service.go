package services

import (
	"context"

	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/repository"
)

// PhoneService manages the additional SMS recipient numbers (user_phones)
// attached to an account.
type PhoneService struct {
	repo *repository.PhoneRepository
}

func NewPhoneService(repo *repository.PhoneRepository) *PhoneService {
	return &PhoneService{repo: repo}
}

func (s *PhoneService) GetPhones(ctx context.Context, userID string) ([]*models.UserPhone, error) {
	return s.repo.GetPhonesByUser(ctx, userID)
}

// AddPhone registers a new recipient. A duplicate for the account maps to
// ErrPhoneAlreadyAdded.
func (s *PhoneService) AddPhone(ctx context.Context, phone *models.UserPhone) error {
	return s.repo.CreatePhone(ctx, phone)
}

func (s *PhoneService) DeletePhone(ctx context.Context, id, userID string) error {
	return s.repo.DeletePhone(ctx, id, userID)
}