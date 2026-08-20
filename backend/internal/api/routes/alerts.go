/*
 * ============================================================================
 * internal/api/routes/alerts.go — ALERTS / SMS ROUTES
 * Component: Person A + <Go API / Team Lead>
 *
 * Registers SMS-sending and history endpoints (protected).
 *
 * WHAT NEEDS TO BE DONE:
 * - Wire handlers from alert_handler.go to:
 *   POST /api/alerts/send      → queue an SMS via Asynq (Feature 13.1)
 *   GET  /api/alerts/history   → SMS log list with delivery status
 * - JWT-protect the group (Feature 19.10).
 * - POST /api/alerts/send costs money per SMS — rate limit it strictly
 *   (Feature 19.9) and enforce opt-out server-side (Feature 13.9).
 *
 * Feature references: 13.1, 13.7, 13.8, 13.9, 19.10, 19.9.
 * ============================================================================
 */