package services

import (
	"context"
	"github.com/hibiken/asynq"
	"github.com/taheeram04/amatsi/backend/internal/models"
	"github.com/taheeram04/amatsi/backend/internal/queue"
	"github.com/taheeram04/amatsi/backend/internal/repository"
)

type AlertService struct {
	repo       *repository.AlertRepository
	queueClient *asynq.Client
}

func NewAlertService(repo *repository.AlertRepository, queueClient *asynq.Client) *AlertService {
	return &AlertService{
		repo:        repo,
		queueClient: queueClient,
	}
}

func (s *AlertService) SendAlert(ctx context.Context, farmID, phoneNumber, message string) error {
	alert := &models.Alert{
		FarmID:  farmID,
		Message: message,
		Status:  "PENDING",
	}

	if err := s.repo.CreateSMSLog(ctx, alert); err != nil {
		return err
	}

	task, err := queue.NewSendSMSTask(phoneNumber, message, alert.ID)
	if err != nil {
		_ = s.repo.UpdateSMSStatus(ctx, alert.ID, "FAILED")
		return err
	}

	_, err = s.queueClient.EnqueueContext(ctx, task, asynq.Queue("default"))
	if err != nil {
		_ = s.repo.UpdateSMSStatus(ctx, alert.ID, "FAILED")
		return err
	}

	return nil
}

func (s *AlertService) GetFarmAlerts(ctx context.Context, farmID string) ([]*models.Alert, error) {
	return s.repo.GetSMSLogs(ctx, farmID)
}
