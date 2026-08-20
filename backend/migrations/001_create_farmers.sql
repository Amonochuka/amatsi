/*
 * ============================================================================
 * migrations/001_create_farmers.sql — FARMERS TABLE MIGRATION
 * Component: Person B + <Database / Repos / Migrations>
 *
 * Creates the "farmers" user table and its Row-Level Security policies
 * (Feature 19.11). Run in the Supabase SQL Editor.
 *
 * WHAT NEEDS TO BE DONE:
 * - CREATE TABLE farmers with: id (uuid pk, default gen_random_uuid()),
 *   name (text), phone (text unique), email (text, nullable),
 *   language (text default 'en' — English/Kiswahili/Luo, 13.2–13.5),
 *   sms_enabled (boolean default true, Feature 13.9), created_at timestamptz.
 * - Also store password_hash for Go API bcrypt auth (Feature 19.10).
 * - ENABLE Row Level Security on the table (Feature 19.11).
 * - Create RLS policies: a farmer may SELECT/UPDATE their own row only
 *   (match Supabase auth.uid() / the Go API's service role pattern).
 * - Add supporting indexes on phone (unique login key) and any lookup cols.
 *
 * Feature references: 13.2–13.5, 13.9, 19.10, 19.11.
 * ============================================================================
 */