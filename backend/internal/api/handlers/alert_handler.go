/*
 * ============================================================================
 * internal/api/handlers/alert_handler.go — ALERT / SMS HANDLERS
 * Component: Person A + <Go API / Team Lead>
 *
 * Front door for the SMS feature: queues SMS jobs through Asynq (so the API
 * responds fast) and serves the farmer's SMS history.
 *
 * WHAT NEEDS TO BE DONE:
 * - SendAlertHandler: validate farm ownership + farmer sms_enabled (Feature
 *   13.9), select message via the language template (13.2–13.5,
 *   English/Kiswahili/Luo), enqueue a SendSMSTask with all recipient phones
 *   (Feature 13.6), and return 202 queued.
 * - GetAlertHistoryHandler: return the farmer's SMS logs with delivery
 *   status (delivered/pending/failed) via alert_repository (Features 13.7,
 *   13.8).
 * - Map worker/delivery callbacks: when the worker reports a status change,
 *   update the log row (Feature 13.8).
 * - Unify error responses (Feature 19.7).
 *
 * Feature references: 13.1, 13.2–13.5, 13.6, 13.7, 13.8, 13.9, 19.7.
 * ============================================================================
 */