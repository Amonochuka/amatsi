/*
 * ============================================================================
 * frontend/types/supabase.ts — SUPABASE DATABASE TYPES
 * Component: Person B (database schema) + Person C (frontend)
 *
 * Generated type definitions mirroring the Supabase schema so queries are
 * type-safe (Feature 19.11 RLS-aware client calls).
 *
 * WHAT NEEDS TO BE DONE:
 * - Run `supabase gen types typescript --project-id <PROJECT_ID> --schema public`
 *   and paste output here.
 * - Tables: farmers, farms, environmental_data, recommendations, sms_logs,
 *   water_usage_logs (migrations 001–005).
 * - Keep in sync with backend/internal/models/* and types/index.ts.
 *
 * Feature references: 19.11 (RLS), 12.1 (realtime subscriptions).
 * ============================================================================
 */