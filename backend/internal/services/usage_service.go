package services

import (
	"context"

	"github.com/amatsi/backend/internal/clients"
	"github.com/amatsi/backend/internal/repository"
)

// UsageService reports a user's actual usage against plan limits: how many
// recommendations were generated today across their farms, the daily limit,
// and the Africa's Talking SMS credit balance (best-effort).
type UsageService struct {
	recRepo    *repository.RecommendationRepository
	atClient   *clients.AfricasTalkingClient
	dailyLimit int
}

func NewUsageService(
	recRepo *repository.RecommendationRepository,
	atClient *clients.AfricasTalkingClient,
	dailyLimit int,
) *UsageService {
	return &UsageService{
		recRepo:    recRepo,
		atClient:   atClient,
		dailyLimit: dailyLimit,
	}
}

// GetUsage returns (usedToday, limit, balance). balance is nil when the
// upstream balance call fails, so the UI can show "unavailable".
func (s *UsageService) GetUsage(ctx context.Context, userID string) (int, int, *string, error) {
	used, err := s.recRepo.CountRecommendationsByUserToday(ctx, userID)
	if err != nil {
		return 0, 0, nil, err
	}

	var balance *string
	if current, err := s.atClient.GetBalance(ctx); err == nil {
		balance = &current
	}

	return used, s.dailyLimit, balance, nil
}