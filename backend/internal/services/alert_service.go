package services

import (
	"context"
	"strings"

	"github.com/hibiken/asynq"
	"github.com/amatsi/backend/internal/models"
	"github.com/amatsi/backend/internal/queue"
	"github.com/amatsi/backend/internal/repository"
)

type AlertService struct {
	repo        *repository.AlertRepository
	phoneRepo   *repository.PhoneRepository
	queueClient *asynq.Client
}

func NewAlertService(repo *repository.AlertRepository, phoneRepo *repository.PhoneRepository, queueClient *asynq.Client) *AlertService {
	return &AlertService{
		repo:        repo,
		phoneRepo:   phoneRepo,
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

// SendAlertToRecipients sends the message to every recipient registered to a
// user: the primary account phone plus any additional user_phones entries.
func (s *AlertService) SendAlertToRecipients(ctx context.Context, farmID, userID, primaryPhone, message string) error {
	seen := make(map[string]bool)
	var phones []string

	if p := strings.TrimSpace(primaryPhone); p != "" {
		phones = append(phones, p)
		seen[p] = true
	}

	extras, err := s.phoneRepo.GetPhonesByUser(ctx, userID)
	if err != nil {
		return err
	}
	for _, ph := range extras {
		p := strings.TrimSpace(ph.PhoneNumber)
		if p == "" || seen[p] {
			continue
		}
		phones = append(phones, p)
		seen[p] = true
	}

	for _, phone := range phones {
		if err := s.SendAlert(ctx, farmID, phone, message); err != nil {
			return err
		}
	}
	return nil
}
