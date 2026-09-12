package repository

import (
	"context"
	"github.com/amatsi/backend/internal/models"
	"github.com/jackc/pgx/v5/pgxpool"
	"math"
)

type FarmRepository struct {
	db *pgxpool.Pool
}

func NewFarmRepository(db *pgxpool.Pool) *FarmRepository {
	return &FarmRepository{db: db}
}

func (r *FarmRepository) CreateFarm(ctx context.Context, farm *models.Farm) error {
	query := `
		INSERT INTO farms (user_id, name, device_id, latitude, longitude, area_hectares, crop_type, soil_type, irrigation_method, tank_capacity_liters, planting_date)
		VALUES ($1, $2, NULLIF($3, ''), $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query,
		farm.UserID,
		farm.Name,
		farm.DeviceID,
		farm.Latitude,
		farm.Longitude,
		farm.AreaHectares,
		farm.CropType,
		farm.SoilType,
		farm.IrrigationMethod,
		farm.TankCapacityLiters,
		farm.PlantingDate,
	).Scan(&farm.ID, &farm.CreatedAt, &farm.UpdatedAt)

	if err == nil && farm.TankCapacityLiters > 0 && farm.TankCurrentLiters == nil {
		init := farm.TankCapacityLiters * 0.6
		farm.TankCurrentLiters = &init
		_, _ = r.db.Exec(ctx, `UPDATE farms SET tank_current_liters = $1 WHERE id = $2`, init, farm.ID)
	}

	return err
}

func (r *FarmRepository) GetFarmByID(ctx context.Context, id string) (*models.Farm, error) {
	query := `
		SELECT id, user_id, name, device_id, latitude, longitude, area_hectares, crop_type, soil_type, irrigation_method, COALESCE(tank_capacity_liters, 0), tank_current_liters, planting_date, created_at, updated_at
		FROM farms
		WHERE id = $1
	`
	farm := &models.Farm{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&farm.ID,
		&farm.UserID,
		&farm.Name,
		&farm.DeviceID,
		&farm.Latitude,
		&farm.Longitude,
		&farm.AreaHectares,
		&farm.CropType,
		&farm.SoilType,
		&farm.IrrigationMethod,
		&farm.TankCapacityLiters,
		&farm.TankCurrentLiters,
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
		SELECT id, user_id, name, device_id, latitude, longitude, area_hectares, crop_type, soil_type, irrigation_method, COALESCE(tank_capacity_liters, 0), tank_current_liters, planting_date, created_at, updated_at
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
			&farm.DeviceID,
			&farm.Latitude,
			&farm.Longitude,
			&farm.AreaHectares,
			&farm.CropType,
			&farm.SoilType,
			&farm.IrrigationMethod,
			&farm.TankCapacityLiters,
			&farm.TankCurrentLiters,
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

// ListAllFarms returns every farm across all users. Used by background
// scheduled tasks (e.g. daily recommendation generation) that iterate over the
// whole farm population without a user context.
func (r *FarmRepository) ListAllFarms(ctx context.Context) ([]*models.Farm, error) {
	query := `
		SELECT id, user_id, name, device_id, latitude, longitude, area_hectares, crop_type, soil_type, irrigation_method, COALESCE(tank_capacity_liters, 0), tank_current_liters, planting_date, created_at, updated_at
		FROM farms
		ORDER BY created_at ASC
	`
	rows, err := r.db.Query(ctx, query)
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
			&farm.DeviceID,
			&farm.Latitude,
			&farm.Longitude,
			&farm.AreaHectares,
			&farm.CropType,
			&farm.SoilType,
			&farm.IrrigationMethod,
			&farm.TankCapacityLiters,
			&farm.TankCurrentLiters,
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
	var oldCapacity *float64
	var oldCurrent *float64
	_ = r.db.QueryRow(ctx,
		`SELECT tank_capacity_liters, tank_current_liters FROM farms WHERE id = $1`,
		farm.ID,
	).Scan(&oldCapacity, &oldCurrent)

	query := `
		UPDATE farms
		SET name = $1, device_id = NULLIF($2, ''), latitude = $3, longitude = $4, area_hectares = $5, crop_type = $6, soil_type = $7, irrigation_method = $8, tank_capacity_liters = $9, planting_date = $10, updated_at = timezone('utc'::text, now())
		WHERE id = $11
		RETURNING updated_at
	`
	err := r.db.QueryRow(ctx, query,
		farm.Name,
		farm.DeviceID,
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
	if err != nil {
		return err
	}

	// Reconcile the current tank level after a capacity change:
	//  - tank removed (capacity <= 0)  -> clear the level (rainfed farm)
	//  - tank just added (was none)    -> start ~60% full
	//  - capacity resized              -> keep the same fill percentage
	switch {
	case farm.TankCapacityLiters <= 0:
		farm.TankCurrentLiters = nil
		_, _ = r.db.Exec(ctx, `UPDATE farms SET tank_current_liters = NULL WHERE id = $1`, farm.ID)
	case oldCapacity == nil || *oldCapacity <= 0:
		init := farm.TankCapacityLiters * 0.6
		farm.TankCurrentLiters = &init
		_, _ = r.db.Exec(ctx, `UPDATE farms SET tank_current_liters = $1 WHERE id = $2`, init, farm.ID)
	case oldCurrent != nil && oldCapacity != nil && *oldCapacity > 0:
		scaled := *oldCurrent * (farm.TankCapacityLiters / *oldCapacity)
		scaled = math.Round(scaled*10) / 10
		farm.TankCurrentLiters = &scaled
		_, _ = r.db.Exec(ctx, `UPDATE farms SET tank_current_liters = $1 WHERE id = $2`, scaled, farm.ID)
	}

	return nil
}

func (r *FarmRepository) DeleteFarm(ctx context.Context, id string) error {
	query := `DELETE FROM farms WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *FarmRepository) UpdateTankLevel(ctx context.Context, farmID string, currentLiters float64) error {
	query := `UPDATE farms SET tank_current_liters = $1, updated_at = timezone('utc'::text, now()) WHERE id = $2`
	_, err := r.db.Exec(ctx, query, currentLiters, farmID)
	return err
}
