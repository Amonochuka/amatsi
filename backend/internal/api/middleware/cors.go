/*
 * ============================================================================
 * internal/api/middleware/cors.go — CORS MIDDLEWARE
 * Component: Person A + <Go API / Team Lead>
 *
 * Allows the Vercel-hosted Next.js frontend to call the Go API from the
 * browser (and handles preflight OPTIONS).
 *
 * WHAT NEEDS TO BE DONE:
 * - Configure CORS for the frontend origin(s). In dev allow localhost; in
 *   prod restrict to the deployed Vercel URL(s).
 * - Allow the methods + headers the frontend sends (Authorization for JWT,
 *   Content-Type, etc.).
 * - Expose any custom response headers the frontend reads.
 * - Keep credentials handling explicit and correct (auth is JWT, not
 *   cookies, so Accept-Credentials can stay off unless logout needs it).
 *
 * Feature references: 19.10.
 * ============================================================================
 */