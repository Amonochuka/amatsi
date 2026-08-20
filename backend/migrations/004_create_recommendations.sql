/*
 * ============================================================================
 * migrations/004_create_recommendations.sql — RECOMMENDATIONS MIGRATION
 * Component: Person B + <Database / Repos / Migrations>
 *
 * Creates the "recommendations" table storing AI-generated irrigation advice
 * plus its RLS policies (Feature 19.11).
 *
 * WHAT NEEDS TO BE DONE:
 * - CREATE TABLE recommendations: id (uuid pk), farm_id (uuid FK → farms),
 *   action (text: IRRIGATE / WAIT / MONITOR), volume numeric (litres),
 *   reason text, water_saved numeric (litres estimate), read boolean default
 *   false, created_at timestamptz.
 * - CREATE INDEX on (farm_id, created_at desc) for newest-first history.
 * - ENABLE RLS; policy: a farmer can SELECT/INSERT/UPDATE rows joined to
 *   farms they own (Feature 19.11).
 * - Keep columns/types in sync with recommendation.go and
 *   recommendation_repository.go.
 *
 * Feature references: 3.x, 19.11.
 * ============================================================================
 */