/*
 * ============================================================================
 * types/index.ts — SHARED TYPES
 * Component: Person C (shared) + Person B (database schema source of truth)
 *
 * TypeScript interfaces mirroring the DB schema (migrations 001–005) and the
 * API response shapes. Keep in sync with backend/internal/models/* and
 * ai-service models.
 *
 * WHAT NEEDS TO BE DONE — define interfaces for:
 * Farmer         — id, name, phone, email, language ('en'|'sw'|'luo'),
 *                  sms_enabled, theme ('light'|'dark'|'auto'), plan, created_at
 * Farm           — id, farmerId, name, lat, lon, areaHa, cropType, plantingDate,
 *                  soilType, irrigationMethod, tankCapacityL, createdAt
 * Recommendation — id, farmId, action ('IRRIGATE'|'WAIT'|'MONITOR'|'CONSERVE'),
 *                  reason, volumeL, waterSavedL, confidence, createdAt, read
 * WeatherData    — temperatureC, rainProbability, expectedRainfallMm, humidity,
 *                  windSpeed, fetchedAt (source: KijaniBox)
 * SoilMoisture   — moisturePercent, status ('optimal'|'caution'|'dry'), fetchedAt
 * SMSLog         — id, farmerId, farmName, recipientPhone, message, language,
 *                  status ('delivered'|'pending'|'failed'), createdAt
 * PhoneLabel     — phone, label ('Worker','Spouse',...), isPrimary
 * Notification   — id, type, message, read, createdAt
 *
 * Also infer/alias types from generated Supabase types in types/supabase.ts.
 *
 * Feature references: 19.11 (RLS/data isolation via user-id scoping).
 * ============================================================================
 */