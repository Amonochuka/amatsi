/*
 * ============================================================================
 * internal/services/recommendation_service.go — RECOMMENDATION BUSINESS LOGIC
 * Component: Person B + <Database / Repos / Clients>
 *
 * Orchestrates the recommendation flow: gathers soil + weather inputs and
 * wires the Python AI rule engine result into a stored, readable domain
 * object (with any Go-side water calculations).
 *
 * WHAT NEEDS TO BE DONE:
 * - GatherRecommendationInputs(farm): fetch/live weather + soil via
 *   kijanibox client (with Redis-cache reuse from handlers).
 * - GenerateNewRecommendation(ctx, farm): call python_ai.GetRecommendation,
 *   persist via recommendation_repository, return the recommendation to the
 *   handler (used by POST /api/recommendations/generate).
 * - Apply the water-calculation rules that live server-side for SMS text
 *   (e.g. volume / litres saved) consistent with the Python engine
 *   (maize 30L/m², beans 20L/m², tomatoes 35L/m², default 25L/m²).
 * - Handle upstream failure gracefully: timeouts→502, offer a fallback
 *   recommendation (Feature 19.7).
 *
 * Feature references: 3.x, 19.7.
 * ============================================================================
 */
package services
