/*
 * ============================================================================
 * internal/api/routes/weather.go — WEATHER / SOIL ROUTES
 * Component: Person A + <Go API / Team Lead>
 *
 * Registers live environmental-data endpoints (protected).
 *
 * WHAT NEEDS TO BE DONE:
 * - Wire handlers from weather_handler.go to:
 *   GET /api/weather/:farmId
 *   GET /api/soil/:farmId
 * - JWT-protect the group (Feature 19.10) and pass the request on to the
 *   handlers, which cache in Redis (TTL 1h) to save KijaniBox quota.
 * - Apply rate limiting here since these hit an upstream paid API
 *   (Feature 19.9).
 *
 * Feature references: 3.x, 19.10, 19.9.
 * ============================================================================
 */
package routes
