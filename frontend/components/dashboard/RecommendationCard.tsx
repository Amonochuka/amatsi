/*
 * ============================================================================
 * components/dashboard/RecommendationCard.tsx — MAIN RECOMMENDATION CARD
 * Component: Person C (Frontend Developer) — core
 *            Person D (AI) — recommendation payload shape
 *
 * The single most important element of the product. Shows the farmer
 * what to do TODAY.
 *
 * WHAT NEEDS TO BE DONE (Feature 3.x + 13.x + 4.x):
 * 3.6  Recommendation Card      — Main display
 * 3.7  Recommendation Action    — IRRIGATE / WAIT / MONITOR / CONSERVE
 *                               - Color coding: e.g. WAIT = green, IRRIGATE = red,
 *                                 MONITOR = amber, CONSERVE = blue
 * 3.8  Recommendation Reason    — WHY (e.g., "78% chance of rain in 24h")
 * 3.9  Water Saved by Action    — Liters saved by following (e.g. "450L")
 * 3.10 Confidence Level         — High / Medium / Low badge
 * 3.11 Send SMS Button          — Triggers POST /api/alerts/send (Feature 13.1)
 * 3.12 SMS Recipients Count     — How many phones will receive the SMS
 *
 * SMS details:
 * 13.2–13.5 Templates           — Message per language (English/Kiswahili/Luo)
 * 13.6  Multi-Phone Support     — Send to ALL registered phones
 * 13.10 SMS Recipient List      — Optionally show who receives it (expandable)
 * 13.15 SMS Credit Balance      — Show remaining Africa's Talking credits
 *
 * Implementation notes:
 * - Fetch latest recommendation via lib/api/client.ts getRecommendations().
 * - When offline, fall back to cached recommendation (Feature 11.4).
 * - Toast/success feedback after sending SMS (Feature 12.3).
 *
 * Feature references: 3.6–3.12, 13.1–13.6, 13.10, 13.15, 11.4.
 * ============================================================================
 */