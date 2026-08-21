package services

import (
	"context"
	"github.com/kijanifarmer/backend/internal/models"
	"github.com/kijanifarmer/backend/internal/repository"
)

type FarmService struct {
	repo *repository.FarmRepository
}

func NewFarmService(repo *repository.FarmRepository) *FarmService {
	return &FarmService{repo: repo}
}

func (s *FarmService) CreateFarm(ctx context.Context, farm *models.Farm) error {
	return s.repo.CreateFarm(ctx, farm)
}

func (s *FarmService) GetFarm(ctx context.Context, id string) (*models.Farm, error) {
	return s.repo.GetFarmByID(ctx, id)
}

func (s *FarmService) GetFarmerFarms(ctx context.Context, userID string) ([]*models.Farm, error) {
	return s.repo.GetFarmsByFarmer(ctx, userID)
}

func (s *FarmService) UpdateFarm(ctx context.Context, farm *models.Farm) error {
	return s.repo.UpdateFarm(ctx, farm)
}

func (s *FarmService) DeleteFarm(ctx context.Context, id string) error {
	return s.repo.DeleteFarm(ctx, id)
}
