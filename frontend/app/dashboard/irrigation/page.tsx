/*
 * ============================================================================
 * app/dashboard/irrigation/page.tsx — IRRIGATION ADVISOR
 * Component: Person E (Frontend Developer)
 *
 * Dedicated page for generating and reviewing irrigation recommendations.
 *
 * WHAT NEEDS TO BE DONE (Feature 4.x — Irrigation Advisor):
 * 4.1  Generate Recommendation Button — POST /api/recommendations/generate
 *                                       (updates current recommendation)
 * 4.2  Current Recommendation Display — Show current recommendation w/ details
 * 4.3  Recommendation Reason          — Full explanation with data points
 * 4.4  Water Saved Estimate           — Liters saved by following advice
 * 4.5  Send SMS Button                — Send to all registered phones
 * 4.6  SMS Recipients List            — Expandable list of who gets the SMS
 * 4.7  Recommendation History         — List of all past recommendations
 * 4.8  History Filters                — Filter by date, action type, farm
 * 4.9  Recommendation Details         — Expand each history item for full detail
 * 4.10 Total Water Saved              — Cumulative saved (all recommendations)
 * 4.11 Success Rate                   — % of recommendations marked as followed
 *
 * Implementation notes:
 * - Reuse <RecommendationCard/> for the "current" recommendation.
 * - Calling generate also triggers realtime/refresh of dashboard (Feature 12.x).
 * - Loading spinner while generating (Feature 19.8), toast on success/error.
 *
 * Feature references: 4.1–4.11, 13.x (SMS), 15.1, 15.6, 19.8.
 * ============================================================================
 */