/*
 * ============================================================================
 * migrations/003_create_environmental_data.sql — TIME-SERIES MIGRATION
 * Component: Person B + <Database / Repos / Migrations>
 *
 * Creates the "environmental_data" table for weather/soil time series and
 * converts it into a TimescaleDB hypertable.
 *
 * WHAT NEEDS TO BE DONE:
 * - Ensure timescaledb extension is available (CREATE EXTENSION IF NOT
 *   EXISTS timescaledb).
 * - CREATE TABLE environmental_data: id (uuid pk), farm_id (uuid FK →
 *   farms), ts timestamptz NOT NULL, temperature, rainfall, soil_moisture,
 *   rain_probability, humidity, wind_speed, vegetation_index.
 * - SELECT create_hypertable('environmental_data', 'ts', ...) so time-range
 *   queries for charts stay fast.
 * - ENABLE RLS + policies scoping access to the farm's owner
 *   (Feature 19.11).
 * - Keep column names/types in sync with weather_repository.go.
 *
 * Feature references: 3.x, 19.11.
 * ============================================================================
 */