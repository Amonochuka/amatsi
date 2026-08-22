-- Local-dev shim for the Supabase auth layer so migrations run on plain Postgres.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
