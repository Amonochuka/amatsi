/*
 * ============================================================================
 * migrations/005_create_sms_logs.sql — SMS LOGS MIGRATION
 * Component: Person B + <Database / Repos / Migrations>
 *
 * Creates the "sms_logs" table tracking every SMS request, delivery status,
 * and opt-out state (Features 13.6–13.9) with RLS (Feature 19.11).
 *
 * WHAT NEEDS TO BE DONE:
 * - CREATE TABLE sms_logs: id (uuid pk), farmer_id (uuid FK → farmers),
 *   farm_id (uuid FK → farms), phone text (recipient — store per-phone rows
 *   to support Multi-Phone, Feature 13.6), message text, template/language
 *   (en/sw/luo — 13.2–13.5), status text default 'pending' with values
 *   pending / delivered / failed (Feature 13.8), created_at timestamptz.
 * - CREATE INDEX on (farmer_id, created_at desc) for the Alerts History page.
 * - ENABLE RLS; policy: a farmer can SELECT/INSERT/UPDATE rows for their
 *   own farmer_id only (Feature 19.11).
 * - Keep columns/types in sync with alert.go and alert_repository.go.
 *
 * Feature references: 13.1, 13.2–13.5, 13.6, 13.7, 13.8, 13.9, 19.11.
 * ============================================================================
 */