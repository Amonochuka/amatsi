/*
 * ============================================================================
 * app/dashboard/page.tsx — DASHBOARD OVERVIEW
 * Component: Person C (Frontend Developer) — core overview
 *            Person E (Frontend) — charts and cards support
 *
 * The main page a farmer sees after login. Orchestra of dashboard cards.
 *
 * WHAT NEEDS TO BE DONE (Feature 3.x — Dashboard Overview):
 * 3.1  Welcome Greeting        — "Welcome back, [Farmer Name] 👋"
 * 3.2  Total Water Saved       — Cumulative liters saved (all-time)
 * 3.3  Total Cost Saved        — Monetary value of saved water (KES)
 * 3.4  Weekly Water Saved      — Water saved this week
 * 3.5  Savings Progress Bar    — Visual progress toward a monthly goal
 * 3.6  Recommendation Card     — Main recommendation display
 * 3.7  Recommendation Action   — IRRIGATE / WAIT / MONITOR / CONSERVE (color-coded)
 * 3.8  Recommendation Reason   — Show WHY (e.g. "78% chance of rain")
 * 3.9  Water Saved by Action   — Liters saved by following the recommendation
 * 3.10 Recommendation Confidence — High / Medium / Low level
 * 3.11 Send SMS Button         — Sends recommendation to all registered phones
 * 3.12 SMS Recipients Count    — Number of phones that will receive SMS
 * 3.13 Weather Card            — Temperature, rain probability, expected rainfall
 * 3.14 Data Source Attribution — "Data from KijaniBox" (builds trust)
 * 3.15 Data Timestamp          — When weather data was last updated
 * 3.16 Soil Moisture Card      — Moisture % with visual indicator
 * 3.17 Soil Status Indicator   — 🟢 Optimal / 🟡 Caution / 🔴 Dry
 * 3.18 Tank Level Card         — Water level with progress bar
 * 3.19 Tank Level Details      — Current L / Capacity L + days remaining
 * 3.20 Water Usage Chart       — 7-day usage bar chart (Recharts)
 * 3.21 Recent Alerts           — Latest SMS alerts with delivery status
 * 3.22 Offline Indicator       — Show when app is offline (useOffline)
 * 3.23 Last Synced Time        — When data was last synced
 *
 * Layout suggestion:
 *   Top: greeting + metric cards row (3.2–3.5)
 *   Middle grid: RecommendationCard (3.6–3.12) | WeatherCard (3.13–3.15)
 *   Second grid: SoilMoistureCard (3.16–3.17) | TankLevelCard (3.18–3.19)
 *   Bottom: WaterUsageChart (3.20) + RecentAlerts (3.21)
 *   Persist state between renders using react-query/SWR or useRealtime hook.
 *
 * Feature references: 3.1–3.23, 12.2 (live updates), 15.1–15.4, 15.6, 15.9-15.10.
 * ============================================================================
 */