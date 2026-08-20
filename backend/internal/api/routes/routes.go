/*
 * ============================================================================
 * internal/api/routes/routes.go — ROUTE REGISTRATION (TOP LEVEL)
 * Component: Person A + <Go API / Team Lead>
 *
 * Central place that assembles the Gin router: mounts middleware, groups
 * routes, and delegates each group to the per-feature route files.
 *
 * WHAT NEEDS TO BE DONE:
 * - Create the router (done via main.go) and set up the route groups below.
 * - Group 1 — Public:
 *   POST /api/auth/login, POST /api/auth/signup, POST /api/auth/logout.
 * - Group 2 — Protected (JWT middleware, Feature 19.10):
 *   GET/POST /api/farms, GET/PUT/DELETE /api/farms/:id,
 *   GET /api/weather/:farmId, GET /api/soil/:farmId,
 *   GET /api/recommendations/:farmId, POST /api/recommendations/generate,
 *   POST /api/alerts/send, GET /api/alerts/history.
 * - Apply rate limiting (Feature 19.9) to the write/heavy endpoints.
 * - Wire each handler from internal/api/handlers into the router.
 * - Keep /health registered without auth (see docs/to-do-list.md).
 *
 * Feature references: 19.10, 19.9, 13.1.
 * ============================================================================
 */
package routes
