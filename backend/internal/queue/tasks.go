package queue

import (
	"encoding/json"
	"github.com/hibiken/asynq"
)

const (
	TypeSendSMS = "sms:send"

	// TypeGenerateRecommendations enqueues a background run that generates a
	// recommendation for every farm. Scheduled periodically; the processor
	// iterates the full farm list itself, so it carries no payload.
	TypeGenerateRecommendations = "recommendations:generate-all"
)

type SendSMSPayload struct {
	PhoneNumber string
	Message     string
	AlertID     string
}

func NewSendSMSTask(phoneNumber, message, alertID string) (*asynq.Task, error) {
	payload, err := json.Marshal(SendSMSPayload{
		PhoneNumber: phoneNumber,
		Message:     message,
		AlertID:     alertID,
	})
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(TypeSendSMS, payload), nil
}

// NewGenerateRecommendationsTask returns the periodic task that triggers a
// background recommendation run for all farms. It has an empty payload; the
// processor iterates the farm list itself.
func NewGenerateRecommendationsTask() *asynq.Task {
	// Empty JSON payload keeps the task deterministic for periodic scheduling.
	return asynq.NewTask(TypeGenerateRecommendations, []byte(`{}`), asynq.Queue("low"))
}
