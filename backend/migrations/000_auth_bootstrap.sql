-- Auth schema bootstrap for plain PostgreSQL hosting (Render, Docker, etc.).
--
-- Supabase deployments provide the `auth` schema, `auth.users`, and
-- auth.uid() natively. Standalone PostgreSQL instances do not, so we create
-- compatible shims here. All statements are idempotent.
-- Skip entirely if the auth schema already exists (Supabase).

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_namespace WHERE nspname = 'auth'
    ) THEN
        CREATE SCHEMA auth;

        CREATE TABLE auth.users (
            id UUID PRIMARY KEY,
            email TEXT UNIQUE,
            phone TEXT,
            encrypted_password TEXT,
            created_at TIMESTAMPTZ DEFAULT now()
        );

        CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
            SELECT NULLIF(current_setting('request.jwt.claim.sub', true), '')::UUID;
        $$ LANGUAGE sql STABLE;
    END IF;
END $$;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
