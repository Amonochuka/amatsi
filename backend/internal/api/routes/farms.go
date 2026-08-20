/*
 * ============================================================================
 * internal/api/routes/farms.go — FARM CRUD ROUTES
 * Component: Person A + <Go API / Team Lead>
 *
 * Registers the farm management routes (protected).
 *
 * WHAT NEEDS TO BE DONE:
 * - Wire handlers from farm_handler.go to:
 *   GET  /api/farms          → list caller's farms
 *   POST /api/farms          → create farm
 *   GET  /api/farms/:id      → single farm
 *   PUT  /api/farms/:id      → update farm
 *   DELETE /api/farms/:id    → delete farm
 * - Group under the JWT-protected middleware (Feature 19.10) and ensure
 *   every handler only returns farms owned by the authenticated user
 *   (Feature 19.11 RLS parity server-side).
 *
 * Feature references: 19.10, 19.11.
 * ============================================================================
 */