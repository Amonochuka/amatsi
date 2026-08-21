package queue

import (
	"encoding/json"
	"github.com/hibiken/asynq"
)

const (
	TypeSendSMS = "sms:send"
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
