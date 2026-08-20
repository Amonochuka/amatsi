/*
 * ============================================================================
 * internal/repository/alert_repository.go — SMS LOG / ALERT REPOSITORY
 * Component: Person B + <Database / Repos / Clients>
 *
 * SQL for the sms_logs table (005): every queued/sent SMS and its delivery
 * status, scoped by farmer for the Alerts History page.
 *
 * WHAT NEEDS TO BE DONE:
 * - CreateSMSLog(ctx, log) — INSERT a log row when an SMS job is queued
 *   (status "pending" — Feature 13.8).
 * - GetSMSLogsByFarmer(ctx, farmerID) — history for one farmer with status,
 *   timestamp, message preview (Features 13.7, 13.8).
 * - UpdateSMSLogStatus(ctx, logID, status) — worker/callback sets delivered /
 *   failed on Africa's Talking delivery reports (Feature 13.8).
 * - Record/report opt-out when a farmer replies STOP (Feature 13.9).
 * - Match 005_create_sms_logs.sql columns/types (Feature 19.11 RLS parity).
 *
 * Feature references: 13.6, 13.7, 13.8, 13.9, 19.11.
 * ============================================================================
 */