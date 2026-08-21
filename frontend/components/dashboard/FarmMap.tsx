/*
 * ============================================================================
 * components/dashboard/FarmMap.tsx — FARM MAP / LOCATION PICKER
 * Component: Person E (Frontend Developer)
 *
 * Leaflet map used in farm management to pick/set farm location.
 *
 * WHAT NEEDS TO BE DONE (Feature 6.7):
 * 6.7 Farm Location Field — Map picker OR GPS coordinates input
 *      - Let farmer click a point on the map to set lat/lon
 *      - Fallback: manual lat/lng coordinate inputs
 *      - Store coordinates on the Farm record
 *
 * Optional:
 * - Show all farm markers on the overview (map of farms)
 * - Weather overlay (rain forecast) or soil moisture heatmap
 *
 * Implementation notes:
 * - Dependencies: react-leaflet + leaflet (install if missing).
 * - Center default on Lake Victoria basin (e.g., Kisumu 0.0917° N, 34.7680° E).
 *
 * Feature references: 6.7, 6.14 (edit location).
 * ============================================================================
 */