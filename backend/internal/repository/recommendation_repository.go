/*
 * ============================================================================
 * internal/repository/recommendation_repository.go — RECOMMENDATION REPO
 * Component: Person B + <Database / Repos / Clients>
 *
 * SQL persistence for generated irrigation recommendations (004 table),
 * scoped by farm ownership for RLS parity.
 *
 * WHAT NEEDS TO BE DONE:
 * - GetRecommendationsByFarm(ctx, farmID) — newest first, and mark listed
 *   rows read (per MarkAsRead contract) so the frontend can show fresh
 *   "new recommendation" badges.
 * - CreateRecommendation(ctx, rec) — INSERT a generated recommendation
 *   (action, volume, reason, water_saved, read=false).
 * - MarkAsRead(ctx, id) — flip read status so the UI stops highlighting.
 * - Match 004_create_recommendations.sql columns/types and model tags.
 * - Map not-found vs DB errors clearly (Feature 19.7).
 *
 * Feature references: 3.x, 19.11, 19.7.
 * ============================================================================
 */
package repository
