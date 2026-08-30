/*
 * ============================================================================
 * internal/migrations/migrations.go — SCHEMA MIGRATION RUNNER
 *
 * Applies SQL migration files (embedded into the binary) against the database
 * at startup. Migrations are applied in ascending filename order, tracked in a
 * `schema_migrations` table so each file runs exactly once.
 *
 * This lets the same binary bootstrap a fresh hosted Postgres (Render, etc.)
 * and stay in sync with existing databases. Previously schema setup only ran
 * through the Docker Compose postgres initdb mounts, so a hosted deployment
 * would have started against an empty database.
 * ============================================================================
 */

package migrations

import (
	"context"
	"embed"
	"fmt"
	"sort"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

//go:embed ../migrations/*.sql
var migrationFS embed.FS

// skipSeedFiles are demo/seed migrations that should only be applied explicitly,
// never automatically in a hosted deployment.
var skipSeedFiles = map[string]bool{
	"006_seed_data.sql": true,
}

// Run applies all pending migrations. It is idempotent: applied migrations are
// tracked and skipped on subsequent runs, and each migration executes inside a
// transaction so a failure rolls back cleanly.
func Run(ctx context.Context, pool *pgxpool.Pool) error {
	if err := ensureTrackingTable(ctx, pool); err != nil {
		return err
	}

	applyOrder, err := collectMigrations()
	if err != nil {
		return err
	}

	applied, err := listApplied(ctx, pool)
	if err != nil {
		return err
	}

	// Migrations may contain many statements (including dollar-quoted function
	// bodies). We use a dedicated pgx connection in simple-protocol mode so the
	// entire file is executed atomically within one transaction.
	conn, err := pool.Acquire(ctx)
	if err != nil {
		return fmt.Errorf("failed to acquire connection for migrations: %w", err)
	}
	defer conn.Release()

	for _, name := range applyOrder {
		if applied[name] {
			continue
		}
		if skipSeedFiles[name] {
			continue
		}

		body, err := migrationFS.ReadFile("migrations/" + name)
		if err != nil {
			return fmt.Errorf("failed to read migration %s: %w", name, err)
		}

		// Empty/placeholder files have nothing to run.
		if strings.TrimSpace(string(body)) == "" {
			continue
		}

		if err := applyMigration(ctx, conn, name, string(body)); err != nil {
			return err
		}
	}

	return nil
}

// applyMigration runs the whole file via pgconn simple-protocol Exec inside an
// explicit transaction on the acquired connection, then records it as applied.
func applyMigration(ctx context.Context, conn *pgxpool.Conn, name, body string) error {
	pgConn := conn.Conn().PgConn()

	if _, err := pgConn.Exec(ctx, "BEGIN").ReadAll(); err != nil {
		return fmt.Errorf("failed to begin transaction for migration %s: %w", name, err)
	}
	defer func() { _, _ = pgConn.Exec(ctx, "ROLLBACK").ReadAll() }()

	mrr := pgConn.Exec(ctx, body)
	// Consume results; errors from simple-protocol multi-statement execution
	// (including server-side fatal errors) are surfaced when the reader closes.
	if _, err := mrr.ReadAll(); err != nil {
		return fmt.Errorf("migration %s failed: %w", name, err)
	}

	// pgconn simple-protocol Exec does not support bind parameters, so the
	// migration name is safely quoted and inlined.
	quoted := "'" + strings.ReplaceAll(name, "'", "''") + "'"
	if _, err := pgConn.Exec(ctx,
		"INSERT INTO schema_migrations (name) VALUES ("+quoted+")").ReadAll(); err != nil {
		return fmt.Errorf("failed to record migration %s: %w", name, err)
	}

	if _, err := pgConn.Exec(ctx, "COMMIT").ReadAll(); err != nil {
		return fmt.Errorf("failed to commit migration %s: %w", name, err)
	}

	return nil
}

func ensureTrackingTable(ctx context.Context, pool *pgxpool.Pool) error {
	_, err := pool.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			name        TEXT PRIMARY KEY,
			applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
		)`)
	return err
}

func listApplied(ctx context.Context, pool *pgxpool.Pool) (map[string]bool, error) {
	rows, err := pool.Query(ctx, "SELECT name FROM schema_migrations")
	if err != nil {
		return nil, fmt.Errorf("failed to query schema_migrations: %w", err)
	}
	defer rows.Close()

	applied := make(map[string]bool)
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, err
		}
		applied[name] = true
	}
	return applied, rows.Err()
}

func collectMigrations() ([]string, error) {
	entries, err := migrationFS.ReadDir("migrations")
	if err != nil {
		return nil, fmt.Errorf("failed to read embedded migrations: %w", err)
	}

	var names []string
	for _, e := range entries {
		if e.IsDir() {
			continue
		}
		if !strings.HasSuffix(e.Name(), ".sql") {
			continue
		}
		names = append(names, e.Name())
	}
	sort.Strings(names)
	return names, nil
}
