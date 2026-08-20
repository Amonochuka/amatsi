/*
 * ============================================================================
 * internal/models/weather.go — WEATHER / SOIL MODEL
 * Component: Person B + <Database / Repos / Clients>
 *
 * Value objects for environmental data returned by KijaniBox and cached in
 * Redis; also maps to the environmental_data time-series table (003).
 *
 * WHAT NEEDS TO BE DONE:
 * - Define WeatherData / SoilData / RainfallProbability structs modelling
 *   what kijanibox.go returns: temperature, rainfall, soil moisture, rain
 *   probability %, humidity, wind speed, vegetation index, timestamps.
 * - Add a struct for the environmental_data time-series row (farm_id, ts,
 *   readings) matching 003_create_environmental_data.sql.
 * - Keep results cacheable (gob/json marshallable) for the 1h Redis TTL.
 *
 * Feature references: 3.x, 19.11.
 * ============================================================================
 */
package models
