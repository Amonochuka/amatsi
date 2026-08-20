/*
 * ============================================================================
 * migrations/002_create_farms.sql — FARMS TABLE MIGRATION
 * Component: Person B + <Database / Repos / Migrations>
 *
 * Creates the "farms" table (per README) with ownership FK + RLS
 * (Feature 19.11). Run in the Supabase SQL Editor.
 *
 * WHAT NEEDS TO BE DONE:
 * - CREATE TABLE farms: id (uuid pk), farmer_id (uuid FK → farmers, not
 *   null), name, area (numeric ha), crop_type, planting_date (date),
 *   soil_type, irrigation_method, tank_capacity (numeric liters),
 *   location (lat + lon columns), created_at/updated_at timestamptz.
 * - CREATE INDEX on farmer_id so per-farmer listing is fast.
 * - ENABLE RLS; policy: a farmer can SELECT/INSERT/UPDATE/DELETE only rows
 *   where farmer_id = their own id (Feature 19.11).
 * - Keep column names/types in sync with internal/models/farm.go and
 *   farm_repository.go.
 *
 * Feature references: 19.11.
 * ============================================================================
 */