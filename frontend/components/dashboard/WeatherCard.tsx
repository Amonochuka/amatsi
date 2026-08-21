/*
 * ============================================================================
 * components/dashboard/WeatherCard.tsx — WEATHER CARD
 * Component: Person C (Frontend Developer)
 *
 * Displays current live weather data for the farm location.
 *
 * WHAT NEEDS TO BE DONE (Feature 3.13–3.15 + 5.1):
 * 3.13 Weather Card         — Temperature (°C), rain probability (%),
 *                             expected rainfall (mm), humidity
 * 3.14 Data Source Attribution — "Data from KijaniBox" (builds trust)
 * 3.15 Data Timestamp       — When weather data was last updated
 *
 * Optional (Crop Planner support):
 * 5.1  7-Day Forecast       — Daily forecast with temp, rain, humidity
 *
 * Implementation notes:
 * - Fetch from GET /api/weather/:farmId (lib/api/client.ts getWeather()).
 * - Cache last payload in localStorage for offline display (Feature 11.5).
 * - Show a small loading state while fetching (Feature 19.8).
 *
 * Feature references: 3.13–3.15, 5.1, 11.5, 19.8.
 * ============================================================================
 */