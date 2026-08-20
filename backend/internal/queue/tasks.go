/*
 * ============================================================================
 * internal/queue/tasks.go — SMS TASK DEFINITION
 * Component: Person B + <Database / Repos / Clients / SMS logic>
 *
 * Defines the unit of work the queue transports: one queued SMS request.
 * ============================================================================
 */

package queue

import (
	"encoding/json"
	"fmt"

	"github.com/hibiken/asynq"
)

// TypeSendSMS is the Asynq task type for sending SMS messages.
const TypeSendSMS = "sms:send"

// SendSMSPayload contains all data needed by the SMS worker to deliver a message.
type SendSMSPayload struct {
	FarmerID   string   `json:"farmer_id"`
	FarmID     string   `json:"farm_id"`
	Recipients []string `json:"recipients"`
	Message    string   `json:"message"`
	Language   string   `json:"language"`
	SMSLogID   string   `json:"sms_log_id"`
}

// NewSendSMSTask creates an Asynq task for sending an SMS.
// The task is configured with max 3 retries and placed in the "default" queue.
func NewSendSMSTask(payload SendSMSPayload) (*asynq.Task, error) {
	data, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal SMS task payload: %w", err)
	}

	return asynq.NewTask(
		TypeSendSMS,
		data,
		asynq.MaxRetry(3),
		asynq.Queue("default"),
	), nil
}