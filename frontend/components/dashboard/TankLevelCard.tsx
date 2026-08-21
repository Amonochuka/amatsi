/*
 * ============================================================================
 * components/dashboard/TankLevelCard.tsx — TANK LEVEL CARD
 * Component: Person C (Frontend Developer)
 *
 * Displays farm water tank level.
 *
 * WHAT NEEDS TO BE DONE (Feature 3.18–3.19):
 * 3.18 Tank Level Card    — Water level with visual progress bar
 * 3.19 Tank Level Details — Current L / Capacity L + estimated days remaining
 *      - e.g. "320L / 1000L" + "~3 days left at current usage"
 *
 * Implementation notes:
 * - Source: manual input or sensor via KijaniBox; farm record holds capacity.
 * - Below 500L the AI recommends CONSERVE (rule engine) — surface that warning.
 * - Allow the farmer to quickly update current level if sensor-less.
 *
 * Feature references: 3.18–3.19, 6.13 (tank capacity input), 12.2 (live update).
 * ============================================================================
 */