package repository

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/taheeram04/amatsi/backend/internal/models"
)

type FarmRepository struct {
	db *pgxpool.Pool
}

func NewFarmRepository(db *pgxpool.Pool) *FarmRepository {
	return &FarmRepository{db: db}
}

func (r *FarmRepository) CreateFarm(ctx context.Context, farm *models.Farm) error {
	query := `
		INSERT INTO farms (user_id, name, latitude, longitude, area_hectares, crop_type, soil_type, irrigation_method, tank_capacity_liters, planting_date)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query,
		farm.UserID,
		farm.Name,
		farm.Latitude,
		farm.Longitude,
		farm.AreaHectares,
		farm.CropType,
		farm.SoilType,
		farm.IrrigationMethod,
		farm.TankCapacityLiters,
		farm.PlantingDate,
	).Scan(&farm.ID, &farm.CreatedAt, &farm.UpdatedAt)

	return err
}

func (r *FarmRepository) GetFarmByID(ctx context.Context, id string) (*models.Farm, error) {
	query := `
		SELECT id, user_id, name, latitude, longitude, area_hectares, crop_type, soil_type, irrigation_method, tank_capacity_liters, planting_date, created_at, updated_at
		FROM farms
		WHERE id = $1
	`
	farm := &models.Farm{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&farm.ID,
		&farm.UserID,
		&farm.Name,
		&farm.Latitude,
		&farm.Longitude,
		&farm.AreaHectares,
		&farm.CropType,
		&farm.SoilType,
		&farm.IrrigationMethod,
		&farm.TankCapacityLiters,
		&farm.PlantingDate,
		&farm.CreatedAt,
		&farm.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return farm, nil
}

func (r *FarmRepository) GetFarmsByFarmer(ctx context.Context, userID string) ([]*models.Farm, error) {
	query := `
		SELECT id, user_id, name, latitude, longitude, area_hectares, crop_type, soil_type, irrigation_method, tank_capacity_liters, planting_date, created_at, updated_at
		FROM farms
		WHERE user_id = $1
	`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var farms []*models.Farm
	for rows.Next() {
		farm := &models.Farm{}
		err := rows.Scan(
			&farm.ID,
			&farm.UserID,
			&farm.Name,
			&farm.Latitude,
			&farm.Longitude,
			&farm.AreaHectares,
			&farm.CropType,
			&farm.SoilType,
			&farm.IrrigationMethod,
			&farm.TankCapacityLiters,
			&farm.PlantingDate,
			&farm.CreatedAt,
			&farm.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		farms = append(farms, farm)
	}
	return farms, nil
}

func (r *FarmRepository) UpdateFarm(ctx context.Context, farm *models.Farm) error {
	query := `
		UPDATE farms
		SET name = $1, latitude = $2, longitude = $3, area_hectares = $4, crop_type = $5, soil_type = $6, irrigation_method = $7, tank_capacity_liters = $8, planting_date = $9, updated_at = timezone('utc'::text, now())
		WHERE id = $10
		RETURNING updated_at
	`
	err := r.db.QueryRow(ctx, query,
		farm.Name,
		farm.Latitude,
		farm.Longitude,
		farm.AreaHectares,
		farm.CropType,
		farm.SoilType,
		farm.IrrigationMethod,
		farm.TankCapacityLiters,
		farm.PlantingDate,
		farm.ID,
	).Scan(&farm.UpdatedAt)
	return err
}

func (r *FarmRepository) DeleteFarm(ctx context.Context, id string) error {
	query := `DELETE FROM farms WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}
