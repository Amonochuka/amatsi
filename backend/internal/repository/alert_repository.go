package repository

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/amatsi/backend/internal/models"
)

type AlertRepository struct {
	db *pgxpool.Pool
}

func NewAlertRepository(db *pgxpool.Pool) *AlertRepository {
	return &AlertRepository{db: db}
}

func (r *AlertRepository) CreateSMSLog(ctx context.Context, alert *models.Alert) error {
	query := `
		INSERT INTO alerts (farm_id, message, status)
		VALUES ($1, $2, $3)
		RETURNING id, created_at
	`
	err := r.db.QueryRow(ctx, query,
		alert.FarmID,
		alert.Message,
		alert.Status,
	).Scan(&alert.ID, &alert.CreatedAt)

	return err
}

func (r *AlertRepository) UpdateSMSStatus(ctx context.Context, id, status string) error {
	query := `
		UPDATE alerts
		SET status = $1, sent_at = CASE WHEN $1 = 'SENT' THEN timezone('utc'::text, now()) ELSE sent_at END
		WHERE id = $2
	`
	_, err := r.db.Exec(ctx, query, status, id)
	return err
}

func (r *AlertRepository) GetSMSLogs(ctx context.Context, farmID string) ([]*models.Alert, error) {
	query := `
		SELECT id, farm_id, message, status, sent_at, created_at
		FROM alerts
		WHERE farm_id = $1
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(ctx, query, farmID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var alerts []*models.Alert
	for rows.Next() {
		alert := &models.Alert{}
		err := rows.Scan(
			&alert.ID,
			&alert.FarmID,
			&alert.Message,
			&alert.Status,
			&alert.SentAt,
			&alert.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		alerts = append(alerts, alert)
	}
	return alerts, nil
}
