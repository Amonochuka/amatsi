/*
 * ============================================================================
 * app/dashboard/planner/page.tsx — CROP PLANNER
 * Component: Person E (Frontend Developer)
 *
 * Helps farmers plan ahead using weather forecasts and crop advice.
 *
 * WHAT NEEDS TO BE DONE (Feature 5.x — Crop Planner):
 * 5.1 7-Day Weather Forecast    — Daily forecast with temp, rain, humidity
 * 5.2  30-Day Weather Forecast  — Extended forecast + trends
 * 5.3  Crop Recommendations     — Based on forecast: what to plant next
 * 5.4  Planting Calendar        — Suggested planting dates
 * 5.5  Expected Yields         — Yield estimates per crop (e.g. kg/ha)
 * 5.6  Water Requirements       — Estimated water needed per crop
 * 5.7  Risk Alerts              — Drought / flood / pest outbreak warnings
 * 5.8  Historical Comparisons   — Compare with previous seasons
 *
 * Implementation notes:
 * - Forecast source: KijaniBox (via Go API /api/weather). May reuse WeatherCard.
 * - Crop recommendations reference the crop list: maize, beans, tomatoes,
 *   onions, cabbage, potatoes, rice (Feature 6.9).
 * - Use the WaterUsageChart pattern (Recharts) for forecast/trend charts.
 *
 * Feature references: 5.1–5.8, 7.6 (risk alerts via SMS/dashboard), 15.8.
 * ============================================================================
 */