/*
 * ============================================================================
 * internal/repository/weather_repository.go — WEATHER DATA REPOSITORY
 * Component: Person B + <Database / Repos / Clients>
 *
 * Persists and queries environmental data (temperature, rainfall, soil
 * moisture, rain probability, humidity, wind, vegetation index) against the
 * TimescaleDB environmental_data hypertable (003).
 *
 * WHAT NEEDS TO BE DONE:
 * - InsertEnvironmentalReading(ctx, row) — append time-series rows (used to
 *   keep history + charts fed).
 * - GetEnvironmentalData(ctx, farmID, from, to) — time-range query so
 *   water-usage charts and history can pull stored readings.
 * - Match 003_create_environmental_data.sql columns/hypertable keys and the
 *   weather model tags.
 * - Scope reads by farm ownership for RLS parity (Feature 19.11).
 *
 * Feature references: 3.x, 19.11.
 * ============================================================================
 */
package repository
