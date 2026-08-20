/*
 * ============================================================================
 * internal/queue/workers/sms_worker.go — SMS TASK WORKER
 * Component: Person B + <Database / Repos / Clients / SMS logic>
 *
 * The background consumer that actually sends SMS via Africa's Talking and
 * keeps delivery status in sync (Feature 13.8).
 *
 * WHAT NEEDS TO BE DONE:
 * - Implement SendSMSWorker(ctx, task) registered with the Asynq server.
 * - Deserialise SendSMSTask; skip silently if the farmer has opted out
 *   (sms_enabled=false, Feature 13.9); normalise phones (Feature 13.6).
 * - Build the message from the farmer's language template (English /
 *   Kiswahili / Luo — 13.2–13.5) if not pre-rendered.
 * - Call africastalking.SendSMS per recipient; on success mark the
 *   sms_log row "delivered", on failure return a retryable error so Asynq
 *   retries with exponential backoff (up to ~3 tries — Features 13.8,
 *   19.7) then mark "failed".
 * - Log every attempt (Feature 19.12).
 *
 * Feature references: 13.1, 13.2–13.5, 13.6, 13.8, 13.9, 19.7, 19.12.
 * ============================================================================
 */