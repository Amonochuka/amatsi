/*
 * ============================================================================
 * internal/queue/tasks.go — SMS TASK DEFINITION
 * Component: Person B + <Database / Repos / Clients / SMS logic>
 *
 * Defines the unit of work the queue transports: one queued SMS request.
 *
 * WHAT NEEDS TO BE DONE:
 * - Define the task type constant, e.g. const TypeSendSMS = "send:sms".
 * - Define SendSMSTask struct with payload needed by the worker:
 *   farmer_id, farm_id, recipients ([]string for Multi-Phone, Feature
 *   13.6), message text, language/template id (13.2–13.5), sms_log_id to
 *   update status on (Feature 13.8).
 * - Implement NewSendSMSTask(...) helper that marshals the payload so
 *   handlers can enqueue with asynq.NewTask(TypeSendSMS, payload).
 * - Keep payload JSON stable — the worker deserialises it.
 *
 * Feature references: 13.1, 13.2–13.5, 13.6, 13.8.
 * ============================================================================
 */