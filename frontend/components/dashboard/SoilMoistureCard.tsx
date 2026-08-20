/*
 * ============================================================================
 * components/dashboard/SoilMoistureCard.tsx — SOIL MOISTURE CARD
 * Component: Person C (Frontend Developer)
 *
 * Displays live soil moisture level for the farm.
 *
 * WHAT NEEDS TO BE DONE (Feature 3.16–3.17):
 * 3.16 Soil Moisture Card      — Moisture percentage with progress bar
 *      - Target range ~55–75% optimal
 * 3.17 Soil Status Indicator   — 🟢 Optimal / 🟡 Caution / 🔴 Dry
 *      - <30% = dry (IRRIGATE signal), 30–60% = caution, >60% = optimal
 *
 * Implementation notes:
 * - Fetch from GET /api/soil/:farmId (lib/api/client.ts getSoilMoisture()).
 * - Cache in localStorage for offline display (Feature 11.6).
 * - This drives the IRRIGATE recommendation, so keep it eye-catching.
 *
 * Feature references: 3.16–3.17, 11.6, 15.9 (soil moisture trends).
 * ============================================================================
 */