/*
 * ============================================================================
 * internal/config/config.go — ENVIRONMENT CONFIG LOADER
 * Component: Person A + <Go API / Team Lead>
 *
 * Single source of truth for all environment variables. Every package reads
 * configuration fields from this struct instead of touching os.Getenv.
 *
 * WHAT NEEDS TO BE DONE:
 * - Define an AppConfig struct with fields for: SUPABASE_DB_URL,
 *   JWT_SECRET, PORT, KIJANIBOX_API_KEY, KIJANIBOX_BASE_URL,
 *   AFRICA_TALKING_API_KEY, AFRICA_TALKING_USERNAME,
 *   AFRICA_TALKING_SENDER_ID, AFRICA_TALKING_CALLBACK_URL,
 *   REDIS_URL, AI_SERVICE_URL (see docs/to-do-list.md Railway env vars).
 * - Implement Load() that reads .env (via godotenv if present) and then
 *   os.Getenv, applying sane defaults (e.g. PORT=8080).
 * - Return a descriptive error naming any REQUIRED missing variable so
 *   startup fails loudly instead of crashing mid-request.
 * - Add derived helpers where useful, e.g. JWT token TTL / signing method
 *   constants (Feature 19.10).
 *
 * Feature references: 19.10, 19.7.
 * ============================================================================
 */