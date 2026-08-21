/*
 * ============================================================================
 * lib/api/client.ts — API CLIENT (Axios)
 * Component: Person C + Person E (Frontend)
 *
 * Single place for all Go API calls + auth header handling.
 *
 * WHAT NEEDS TO BE DONE:
 * - Create an Axios instance with baseURL = NEXT_PUBLIC_API_URL
 *   (the deployed Go API on Railway).
 * - Request interceptor: attach JWT/Bearer token from localStorage.
 * - Response interceptor: unified error handling (Feature 19.7),
 *   e.g., 401 → redirect to /auth/login, network error → mark offline.
 *
 * Functions needed by pages (map to endpoints in docs/to-do-list.md):
 * - getFarms() / createFarm(data) / updateFarm(id,data) / deleteFarm(id)
 * - getWeather(farmId) / getSoilMoisture(farmId)
 * - getRecommendations(farmId)
 * - generateRecommendation(farmId)          → Feature 4.1
 * - sendSMS(farmId) / sendAlert(farmId)     → Feature 13.1 / 3.11
 * - getAlertHistory()                       → Feature 7.1 / 3.21
 * - getSmsCredits()                         → Feature 13.15
 * - updateProfile(...) / changePassword(...) → Feature 8.1–8.2
 * - updateSubscription(...)                  → Feature 17.x
 *
 * Feature references: 19.7 (error handling), 19.9 (rate limiting/timeouts),
 * 19.10 (JWT), 19.12 (logging/observability).
 * ============================================================================
 */