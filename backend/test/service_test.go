/*
 * ============================================================================
 * test/service_test.go — SERVICE LAYER UNIT TESTS
 * Component: Person B + <Database / Repos / Clients>
 *
 * Unit tests for the Go business logic (services) using testify + mocks for
 * clients/repositories so no external services are touched.
 *
 * WHAT NEEDS TO BE DONE:
 * - recommendation_service_test: given a farm + mocked KijaniBox/PythonAI,
 *   assert the generated recommendation (action, reason, water_saved), the
 *   fallback on upstream failure (Feature 19.7), and the water-calculation
 *   rules (maize 30L/m², beans 20L/m², tomatoes 35L/m², default 25L/m²).
 * - alert_service_test: template rendering per language (13.2–13.5), Multi-
 *   Phone recipients (13.6), opt-out skip when sms_enabled=false (13.9),
 *   Primary Phone default (13.14), and that Sending enqueues a task via the
 *   Asynq mock (13.1) with a pending sms_log (13.8).
 * - farm_service_test: validation + ownership checks (404 when not owned,
 *   Feature 19.11).
 * - Keep tests hermetic (no live Redis/Supabase/Africa's Talking).
 *
 * Feature references: 3.x, 13.1, 13.2–13.5, 13.6, 13.8, 13.9, 13.14, 19.7.
 * ============================================================================
 */