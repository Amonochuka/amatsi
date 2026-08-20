/*
 * ============================================================================
 * internal/models/alert.go — SMS LOG / ALERT MODEL
 * Component: Person B + <Database / Repos / Clients>
 *
 * Domain model mirroring migrations/005_create_sms_logs.sql, used by the
 * alert service, worker, handlers, and the Alerts History page.
 *
 * WHAT NEEDS TO BE DONE:
 * - Define SMSLog struct matching the table: farmer_id, farm_id, phone
 *   recipient(s), message, language/template used, delivery status
 *   (delivered / pending / failed — Feature 13.8), timestamps.
 * - Include enough fields for Multi-Phone sends (per-recipient rows or a
 *   phone list — Feature 13.6).
 * - Include opt-out bookkeeping (sms_enabled toggling, Feature 13.9).
 * - Mirror column names/types in 005_create_sms_logs.sql for RLS parity
 *   (Feature 19.11).
 *
 * Feature references: 13.6, 13.7, 13.8, 13.9, 19.11.
 * ============================================================================
 */