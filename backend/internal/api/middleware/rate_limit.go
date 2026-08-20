/*
 * ============================================================================
 * internal/api/middleware/rate_limit.go — API RATE LIMITING
 * Component: Person A + <Go API / Team Lead>
 *
 * Protects endpoints (weather/soil/recommendations/SMS) from abuse and from
 * hammering paid upstream providers (KijaniBox, Africa's Talking).
 *
 * WHAT NEEDS TO BE DONE:
 * - Implement per-IP (and ideally per-user) rate limiting, backed by Redis
 *   so limits survive restarts / multiple replicas.
 * - Define sensible limits per endpoint group: e.g. stricter on
 *   POST /api/recommendations/generate and POST /api/alerts/send, looser on
 *   GET reads.
 * - On limit exceeded return 429 with Retry-After header + unified error
 *   body (Feature 19.7).
 * - Make limits configurable via env where useful.
 *
 * Feature references: 19.9, 19.7.
 * ============================================================================
 */
package middleware
