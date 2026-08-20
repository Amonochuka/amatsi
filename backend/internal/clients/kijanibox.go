/*
 * ============================================================================
 * internal/clients/kijanibox.go — KIJANIBOX EXTERNAL API CLIENT
 * Component: Person B + <Database / Repos / Clients>
 *
 * HTTP client for the KijaniBox weather/soil/rainfall APIs. Feeds the
 * weather + soil handlers and the recommendation service.
 *
 * WHAT NEEDS TO BE DONE:
 * - Define KijaniBoxClient struct holding apiKey, baseURL and an
 *   *http.Client with a 10s timeout per request (docs/to-do-list.md).
 * - Implement NewKijaniBoxClient(apiKey, baseURL).
 * - Implement GetWeatherForecast(ctx, lat, lon).
 * - Implement GetSoilMoisture(ctx, lat, lon).
 * - Implement GetRainfallProbability(ctx, lat, lon).
 * - Add error handling + logging for every API call (Feature 19.7):
 *   non-2xx responses, timeouts, rate limits (Feature 19.9 upstream).
 * - Return typed structs ready for handlers to cache in Redis.
 *
 * Feature references: 3.x, 19.7.
 * ============================================================================
 */
package clients
