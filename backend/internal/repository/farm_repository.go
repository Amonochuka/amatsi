/*
 * ============================================================================
 * internal/repository/farm_repository.go — FARM REPOSITORY
 * Component: Person B + <Database / Repos / Clients>
 *
 * All SQL for farm CRUD, scoped to the owning farmer so it matches RLS
 * policies (Feature 19.11).
 *
 * WHAT NEEDS TO BE DONE:
 * - GetFarmByID(ctx, id) — single farm (used by handlers, join to owner
 *   check).
 * - GetFarmsByFarmer(ctx, farmerID) — all farms for one farmer.
 * - CreateFarm(ctx, farm) — INSERT returning the created row.
 * - UpdateFarm(ctx, farm) — UPDATE owned farm, return updated row.
 * - DeleteFarm(ctx, id) — DELETE owned farm (also consider cascade to
 *   environmental_data/recommendations/sms_logs).
 * - Use pgx/v5 with named/cannonical queries matching 002_create_farms.sql
 *   and model tags; wrap errors so callers can map not-found vs DB failure
 *   (Feature 19.7).
 * - Always filter by farmer_id so no cross-tenant reads leak
 *   (Feature 19.11).
 *
 * Feature references: 19.11, 19.7.
 * ============================================================================
 */
package repository
