/*
 * ============================================================================
 * internal/api/middleware/auth.go — JWT AUTH MIDDLEWARE
 * Component: Person A + <Go API / Team Lead>
 *
 * Validates the Bearer JWT on protected routes and injects the caller's
 * farmer/user ID into the Gin context so handlers can scope data by user.
 *
 * WHAT NEEDS TO BE DONE:
 * - Implement NAMED middleware func to attach to protected route groups.
 * - Parse Authorization: Bearer <token> with github.com/golang-jwt/jwt/v5
 *   using JWT_SECRET (Feature 19.10).
 * - On invalid/expired/malformed token respond 401 with a unified error
 *   body and abort the request (Feature 19.7).
 * - On success, place the user ID (and any roles) in context under a
 *   well-known key; provide a ContextGetUserID(ctx) helper for handlers.
 * - Cooperate with RLS: Supabase uses its own auth, so scope SQL queries
 *   server-side by this user ID rather than relying on anon keys
 *   (Feature 19.11).
 *
 * Feature references: 19.10, 19.7, 19.11.
 * ============================================================================
 */