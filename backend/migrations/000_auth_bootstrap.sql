-- Auth schema bootstrap for plain PostgreSQL hosting (Render, Docker, etc.).
--
-- Supabase deployments provide the `auth` schema, `auth.users`, and
-- auth.uid() natively. Standalone PostgreSQL instances do not, so we create
-- compatible shims here. All statements are idempotent.
-- NOTE: Skipped on Supabase via skipSeedFiles in migrations.go.
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE,
    phone TEXT,
    encrypted_password TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Stub for Supabase's auth.uid(): reads the JWT sub claim if present.
CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
    SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::UUID;
$$ LANGUAGE sql STABLE;

-- gen_random_uuid() is provided by pgcrypto in Supabase. Ensure it exists on
-- plain PostgreSQL so the migrations that rely on it succeed.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
