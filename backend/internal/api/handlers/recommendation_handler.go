/*
 * ============================================================================
 * internal/api/handlers/recommendation_handler.go — RECOMMENDATION HANDLERS
 * Component: Person A + <Go API / Team Lead>
 *
 * Serves and generates irrigation advice: read history, or build a fresh
 * recommendation by calling the Python AI service and storing the result.
 *
 * WHAT NEEDS TO BE DONE:
 * - GetRecommendationsHandler (:farmId): return stored recommendations for
 *   the farm via recommendation_repository (newest first).
 * - GenerateRecommendationHandler: assemble current farm + weather + soil
 *   data, call PythonAIClient.GetRecommendation (5s timeout), persist the
 *   result via recommendation_repository, and return the recommendation so
 *   the frontend can render + offer "Send SMS" (Feature 13.1).
 * - Mark returned recommendations read when listed, per repo's
 *   MarkAsRead/GetRecommendationsByFarm contract.
 * - Timeouts/upstream failures → 502, cloud fallback recommendation
 *   (Feature 19.7).
 * - Only allow generating for farms the caller owns (Feature 19.11).
 *
 * Feature references: 3.x, 13.1, 19.7, 19.11.
 * ============================================================================
 */
package handlers
