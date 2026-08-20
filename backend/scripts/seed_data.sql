/*
 * ============================================================================
 * scripts/seed_data.sql — DEMO/DEV SEED DATA
 * Component: Person B + <Database / Repos / Migrations>
 *
 * Populates the database with a believable demo farmer + farms +
 * environmental readings so a fresh deploy has live-looking dashboard data.
 *
 * WHAT NEEDS TO BE DONE:
 * - Insert one demo farmer (name, phone, email, language, sms_enabled=true)
 *   with a known bcrypt password_hash for login testing (Feature 19.10).
 * - Insert 1–3 farms (name, area, crop type — maize/beans/tomatoes, planting
 *   date, soil type, irrigation method, tank capacity, lat/lon).
 * - Insert a few days of environmental_data rows (temperature, rainfall,
 *   soil moisture, rain probability daily values) so charts + history render.
 * - Optionally insert one sample recommendation (IRRIGATE/WAIT/MONITOR).
 * - Use deterministic UUIDs or RETURNING so test/api_test.go can reference
 *   the seeded farmer/farms.
 *
 * Feature references: 3.x, 19.10.
 * ============================================================================
 */