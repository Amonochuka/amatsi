package workers

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/hibiken/asynq"
	"github.com/taheeram04/amatsi/backend/internal/clients"
	"github.com/taheeram04/amatsi/backend/internal/queue"
	"github.com/taheeram04/amatsi/backend/internal/repository"
)

type SMSProcessor struct {
	atClient *clients.AfricasTalkingClient
	alertRepo *repository.AlertRepository
}

func NewSMSProcessor(atClient *clients.AfricasTalkingClient, alertRepo *repository.AlertRepository) *SMSProcessor {
	return &SMSProcessor{
		atClient:  atClient,
		alertRepo: alertRepo,
	}
}

func (p *SMSProcessor) ProcessTask(ctx context.Context, t *asynq.Task) error {
	var payload queue.SendSMSPayload
	if err := json.Unmarshal(t.Payload(), &payload); err != nil {
		return fmt.Errorf("json.Unmarshal failed: %v: %w", err, asynq.SkipRetry)
	}

	err := p.atClient.SendSMS(ctx, payload.PhoneNumber, payload.Message)
	
	status := "SENT"
	if err != nil {
		status = "FAILED"
	}

	if payload.AlertID != "" {
		_ = p.alertRepo.UpdateSMSStatus(ctx, payload.AlertID, status)
	}

	return err
}
