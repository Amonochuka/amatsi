/*
 * ============================================================================
 * internal/clients/supabase.go — PGX CONNECTION POOL
 * Component: Person B + <Database / Repos / Clients>
 *
 * Owns the *pgxpool.Pool used by every repository to talk to Supabase
 * (managed PostgreSQL + TimescaleDB).
 *
 * WHAT NEEDS TO BE DONE:
 * - Implement NewSupabasePool(ctx, connString) creating a pgx/v5 pool.
 * - Configure the pool: max ~10 connections, sensible idle timeouts so the
 *   API never exhausts Supabase's connection budget.
 * - Ping the database at startup and return an error if unreachable.
 * - Provide Close() for graceful shutdown.
 *
 * Feature references: 19.7.
 * ============================================================================
 */