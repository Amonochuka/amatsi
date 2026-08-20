/*
 * ============================================================================
 * cmd/server/main.go — API SERVER ENTRYPOINT
 * Component: Person A + <Go API / Team Lead>
 *
 * The Gin HTTP server entrypoint. Bootstraps every dependency (config,
 * database pool, Redis, clients, task queue, routes) and starts the API.
 *
 * WHAT NEEDS TO BE DONE:
 * - Load environment variables with github.com/joho/godotenv; fail fast with
 *   a clear message if the config is incomplete.
 * - Build the AppConfig via internal/config and open the Supabase pgx pool
 *   + Redis client; verify both connections on startup and exit on failure.
 * - Initialize the Gin router (ReleaseMode in prod).
 * - Register middleware in order: CORS (for Vercel frontend), request logger
 *   (Feature 19.12), recovery (panic handling, Feature 19.7), rate limiting
 *   (Feature 19.9), JWT auth (Feature 19.10) on protected route groups.
 * - Register all route groups via internal/api/routes (auth / farms / weather
 *   / recommendations / alerts — see docs/to-do-list.md endpoint list).
 * - Add health check endpoint GET /health returning 200 + JSON status
 *   (also ping DB to verify liveness).
 * - Start the Asynq server so SMS worker tasks are processed (Feature 13.x).
 * - Listen on :8080; graceful shutdown on SIGINT/SIGTERM.
 *
 * Feature references: 19.7, 19.9, 19.10, 19.12, 13.1.
 * ============================================================================
 */