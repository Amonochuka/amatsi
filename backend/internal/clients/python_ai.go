/*
 * ============================================================================
 * internal/clients/python_ai.go — PYTHON AI SERVICE CLIENT
 * Component: Person B + <Database / Repos / Clients>
 *
 * HTTP client for the FastAPI recommendation service (ai-service). The rule
 * engine (Rule 1/2/3 and water calcs) lives in Python; this file calls it.
 *
 * WHAT NEEDS TO BE DONE:
 * - Define PythonAIClient struct with baseURL (AI_SERVICE_URL) and an
 *   *http.Client with a 5s timeout per request (docs/to-do-list.md).
 * - Implement NewPythonAIClient(baseURL).
 * - Implement GetRecommendation(ctx, farmData) that serialises the farm's
 *   soil + weather + crop payload to the Python POST /predict contract and
 *   returns the recommendation action (IRRIGATE / WAIT / MONITOR) with
 *   reason + water estimates.
 * - Add error handling + logging (Feature 19.7): treat timeouts/5xx as
 *   retryable, 4xx as a client bug worth surfacing in logs.
 * - Keep this contract synced with ai-service/app/routes/predict.py.
 *
 * Feature references: 3.x, 19.7.
 * ============================================================================
 */
package clients
