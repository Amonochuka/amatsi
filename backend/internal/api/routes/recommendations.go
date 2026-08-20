/*
 * ============================================================================
 * internal/api/routes/recommendations.go — RECOMMENDATION ROUTES
 * Component: Person A + <Go API / Team Lead>
 *
 * Registers recommendation read + generate endpoints (protected).
 *
 * WHAT NEEDS TO BE DONE:
 * - Wire handlers from recommendation_handler.go to:
 *   GET  /api/recommendations/:farmId
 *   POST /api/recommendations/generate  (calls Python AI)
 * - JWT-protect the group (Feature 19.10).
 * - Generate is expensive + hits the AI service, so apply strict rate
 *   limiting (Feature 19.9).
 *
 * Feature references: 3.x, 19.10, 19.9.
 * ============================================================================
 */
package routes
