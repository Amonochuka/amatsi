/*
 * ============================================================================
 * internal/api/handlers/weather_handler.go — WEATHER + SOIL HANDLERS
 * Component: Person A + <Go API / Team Lead>
 *
 * Serves live farm environmental data to the dashboard cards (WeatherCard,
 * SoilMoistureCard) with a Redis cache layer to keep KijaniBox quota low.
 *
 * WHAT NEEDS TO BE DONE:
 * - GetWeatherHandler (:farmId): resolve farm → its lat/lon, fetch forecast
 *   from the KijaniBox client, cache in Redis with TTL 1 hour, return JSON.
 * - GetSoilMoistureHandler (:farmId): same pattern for soil moisture.
 * - Cache-first: on cache hit return instantly; on miss call the upstream
 *   client and backfill Redis (key scheme incl. farmId, e.g.
 *   weather:{farmId}).
 * - Return 404 if the farm doesn't exist/not owned; 502 with a friendly
 *   error if the upstream is down or slow (10s client timeout)
 *   (Feature 19.7).
 *
 * Feature references: 3.x, 19.7.
 * ============================================================================
 */
package handlers
