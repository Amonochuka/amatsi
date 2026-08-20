package repository

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/taheeram04/amatsi/backend/internal/models"
)

type RecommendationRepository struct {
	db *pgxpool.Pool
}

func NewRecommendationRepository(db *pgxpool.Pool) *RecommendationRepository {
	return &RecommendationRepository{db: db}
}

func (r *RecommendationRepository) CreateRecommendation(ctx context.Context, rec *models.Recommendation) error {
	query := `
		INSERT INTO recommendations (farm_id, action, reason, water_saved_estimate)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at
	`
	err := r.db.QueryRow(ctx, query,
		rec.FarmID,
		rec.Action,
		rec.Reason,
		rec.WaterSavedEstimate,
	).Scan(&rec.ID, &rec.CreatedAt)

	return err
}

func (r *RecommendationRepository) GetLatestRecommendation(ctx context.Context, farmID string) (*models.Recommendation, error) {
	query := `
		SELECT id, farm_id, action, reason, water_saved_estimate, created_at
		FROM recommendations
		WHERE farm_id = $1
		ORDER BY created_at DESC
		LIMIT 1
	`
	rec := &models.Recommendation{}
	err := r.db.QueryRow(ctx, query, farmID).Scan(
		&rec.ID,
		&rec.FarmID,
		&rec.Action,
		&rec.Reason,
		&rec.WaterSavedEstimate,
		&rec.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return rec, nil
}
