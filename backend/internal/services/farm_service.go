/*
 * ============================================================================
 * internal/services/farm_service.go — FARM BUSINESS LOGIC
 * Component: Person B + <Database / Repos / Clients>
 *
 * Intermediary between farm HTTP handlers and the farm repository; holds
 * any farm-related rules validations and ownership checks.
 *
 * WHAT NEEDS TO BE DONE:
 * - ListFarms(farmerID) → repository GetFarmsByFarmer (used by
 *   GET /api/farms).
 * - GetFarm(farmerID, farmID): fetch + enforce ownership so a farmer can
 *   never read another's farm (returns not-found if not owned —
 *   RLS parity, Feature 19.11).
 * - CreateFarm / UpdateFarm / DeleteFarm with validation (area > 0, valid
 *   crop/soil/irrigation enums) and clear domain errors for the handler to
 *   map to 400/404/409 (Feature 19.7).
 * - Own the "does this farmer own this farmId?" helper used by weather and
 *   recommendation services too.
 *
 * Feature references: 19.11, 19.7.
 * ============================================================================
 */
package services
