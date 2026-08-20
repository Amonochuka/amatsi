/*
 * ============================================================================
 * internal/api/handlers/farm_handler.go — FARM CRUD HANDLERS
 * Component: Person A + <Go API / Team Lead>
 *
 * HTTP layer for farm management. Parses requests, calls the farm service /
 * repository, and returns farm JSON for the frontend farm pages.
 *
 * WHAT NEEDS TO BE DONE:
 * - GetFarmsHandler: list all farms for the authenticated farmer.
 * - GetFarmHandler: fetch single farm by :id (404 if not found OR not owned
 *   by the caller — RLS parity, Feature 19.11).
 * - CreateFarmHandler: validate payload (name, area, crop type, planting
 *   date, soil type, irrigation method, tank capacity, location) (400 on
 *   invalid), create, return 201 + farm.
 * - UpdateFarmHandler: update owned farm by :id, return updated entity.
 * - DeleteFarmHandler: delete owned farm by :id.
 * - Use farmer ID from JWT context (middleware/auth.go) in every query.
 * - Consistent error envelope everywhere (Feature 19.7).
 *
 * Feature references: 19.10, 19.11, 19.7.
 * ============================================================================
 */