/*
 * ============================================================================
 * test/api_test.go — API INTEGRATION TESTS
 * Component: Person A + <Go API / Team Lead>
 *
 * End-to-end tests against a live (or Dockerised) backend using testify,
 * covering every endpoint from docs/to-do-list.md.
 *
 * WHAT NEEDS TO BE DONE:
 * - Spin up the app (or hit a test instance) with test env vars and a real
 *   or seeded DB (scripts/seed_data.sql).
 * - Auth flow (Feature 19.10):
 *   - POST /api/auth/signup → 201 + returns JWT.
 *   - POST /api/auth/login (wrong password → 401; correct → 200 + JWT).
 *   - POST /api/auth/logout → 200.
 * - Farm CRUD: GET/POST /api/farms, GET/PUT/DELETE /api/farms/:id, incl.
 *   404 for a farm you don't own (Feature 19.11).
 * - Weather/soil/test with stubbed kijanibox + Redis: GET
 *   /api/weather/:farmId, GET /api/soil/:farmId — assert 200 and cached
 *   second-call behavior.
 * - Recommendations: GET /api/recommendations/:farmId (empty → 200),
 *   POST /api/recommendations/generate (with mocked python_ai) → 200.
 * - Alerts: POST /api/alerts/send → 202 queued; GET /api/alerts/history →
 *   200 with logs (mock the queue to avoid real SMS — Features 13.1, 13.8).
 * - Assert statuses, JSON shapes, and that protected routes return 401
 *   without a token (Feature 19.10).
 *
 * Feature references: 19.10, 19.11, 13.1, 13.8, 3.x.
 * ============================================================================
 */
package test
