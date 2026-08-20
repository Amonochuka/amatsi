/*
 * ============================================================================
 * internal/models/user.go — FARMER (USER) MODEL
 * Component: Person B + <Database / Repos / Clients>
 *
 * Domain model mirroring migrations/001_create_farmers.sql ("farmers").
 *
 * WHAT NEEDS TO BE DONE:
 * - Define Farmer/User struct with JSON + DB tags matching the table:
 *   id (UUID), name, phone, email (nullable), language, sms_enabled (bool),
 *   created_at.
 * - Match the exact column names/types in 001_create_farmers.sql and the
 *   camelCase JSON keys the frontend expects.
 * - Add validation tags where useful (phone format, language enum).
 * - Do not store passwords on this struct the frontend ever sees; keep any
 *   hashed password field separate or tagged `json:"-"` (Feature 19.10).
 *
 * Feature references: 13.2–13.5, 13.9, 19.11.
 * ============================================================================
 */