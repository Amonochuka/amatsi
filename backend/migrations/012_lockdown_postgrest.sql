-- 012_lockdown_postgrest.sql
--
-- The Go backend is the ONLY legitimate client of this database. It connects
-- with the service-role connection string (SUPABASE_DB_URL), which bypasses RLS.
--
-- Supabase exposes a PostgREST API on <project>.supabase.co/rest/v1/* that maps
-- to the `public` schema. Requests without a JWT run as the `anon` role and with
-- a Supabase JWT as the `authenticated` role. Because this app manages its own
-- auth in Go and never uses that API, we revoke both roles from the `public`
-- schema so the tables cannot be reached through PostgREST even if the anon key
-- leaks. Supabase's project-level ALTER DEFAULT PRIVILEGES grants new tables to
-- anon/authenticated, so we ALSO revoke at the table/sequence/function level for
-- defense in depth. RLS policies kept per-table are a safety net for the future,
-- not the primary enforcement layer.
--
-- Reverse with:
--   GRANT USAGE ON SCHEMA public TO anon, authenticated;
--   GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
--   GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
--   GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
REVOKE ALL ON SCHEMA public FROM anon;
REVOKE ALL ON SCHEMA public FROM authenticated;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;

REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;

REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM anon;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM authenticated;