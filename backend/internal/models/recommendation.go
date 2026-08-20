/*
 * ============================================================================
 * internal/models/recommendation.go — RECOMMENDATION MODEL
 * Component: Person B + <Database / Repos / Clients>
 *
 * Domain model mirroring migrations/004_create_recommendations.sql.
 *
 * WHAT NEEDS TO BE DONE:
 * - Define Recommendation struct matching the table: farm_id, action
 *   (IRRIGATE / WAIT / MONITOR), volume (litres), reason, water_saved
 *   estimate, read status, generated_at.
 * - Include id (UUID) + created_at.
 * - Mirror the column names/types in 004_create_recommendations.sql so RLS
 *   policies by farm owner work (Feature 19.11).
 * - Shape the JSON so the frontend RecommendationCard can render action,
 *   reason, and water saved without transformation.
 *
 * Feature references: 3.x, 19.11.
 * ============================================================================
 */
package models
