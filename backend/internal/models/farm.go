/*
 * ============================================================================
 * internal/models/farm.go — FARM MODEL
 * Component: Person B + <Database / Repos / Clients>
 *
 * Domain model mirroring migrations/002_create_farms.sql ("farms").
 *
 * WHAT NEEDS TO BE DONE:
 * - Define Farm struct with JSON + DB tags matching README fields: name,
 *   area (ha), crop type, planting date, soil type, irrigation method, tank
 *   capacity, location (lat/lon), farmer_id (owner FK).
 * - Include id (UUID) and created_at/updated_at timestamps.
 * - Match column names exactly to 002_create_farms.sql so repository
 *   queries and RLS scoping by farmer_id stay correct (Feature 19.11).
 *
 * Feature references: 19.11.
 * ============================================================================
 */