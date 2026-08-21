/*
 * ============================================================================
 * internal/clients/supabase.go — PGX CONNECTION POOL
 * Component: Person B + <Database / Repos / Clients>
 *
 * Owns the *pgxpool.Pool used by every repository to talk to Supabase
 * (managed PostgreSQL + TimescaleDB).
 * ============================================================================
 */

package clients

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// NewSupabasePool creates a pgx connection pool configured for Supabase.
// It verifies connectivity by pinging the database before returning.
func NewSupabasePool(ctx context.Context, connString string) (*pgxpool.Pool, error) {
	config, err := pgxpool.ParseConfig(connString)
	if err != nil {
		return nil, fmt.Errorf("failed to parse database connection string: %w", err)
	}

	// Configure pool limits to stay within Supabase connection budget
	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnLifetime = 1 * time.Hour
	config.MaxConnIdleTime = 30 * time.Minute

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		return nil, fmt.Errorf("failed to create database connection pool: %w", err)
	}

	// Verify connectivity
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return pool, nil
}
