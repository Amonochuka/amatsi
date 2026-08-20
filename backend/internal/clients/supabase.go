package clients

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

// NewSupabasePool creates and validates a pgxpool connection to the Supabase PostgreSQL database.
// The databaseURL should be the full connection string, e.g.:
// postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
func NewSupabasePool(ctx context.Context, databaseURL string) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to create database connection pool: %w", err)
	}

	// Validate the connection is live
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return pool, nil
}
