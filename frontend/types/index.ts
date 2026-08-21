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
/*
 * ============================================================================
 * types/index.ts — SHARED TYPES
 * Mirrors DB schema (migrations 001-005) and API response shapes.
 * ============================================================================
 */

export type Language = "en" | "sw" | "luo";
export type Theme = "light" | "dark" | "auto";
export type Plan = "free" | "pro";

export interface Farmer {
	id: string;
	name: string;
	phone: string;
	email: string;
	language: Language;
	sms_enabled: boolean;
	theme: Theme;
	plan: Plan;
	created_at: string;
}

export type CropType =
	| "Maize"
	| "Beans"
	| "Tomatoes"
	| "Onions"
	| "Cabbage"
	| "Potatoes"
	| "Rice";

export type SoilType = "Loam" | "Clay" | "Sandy" | "Silt" | "Other";
export type IrrigationMethod = "Drip" | "Sprinkler" | "Furrow" | "Manual";

export interface Farm {
	id: string;
	farmerId: string;
	name: string;
	lat: number;
	lon: number;
	areaHa: number;
	cropType: CropType;
	plantingDate: string;
	soilType: SoilType;
	irrigationMethod: IrrigationMethod;
	tankCapacityL: number;
	createdAt: string;
}

export type RecommendationAction = "IRRIGATE" | "WAIT" | "MONITOR" | "CONSERVE";
export type ConfidenceLevel = "High" | "Medium" | "Low";

export interface Recommendation {
	id: string;
	farmId: string;
	action: RecommendationAction;
	reason: string;
	volumeL: number;
	waterSavedL: number;
	confidence: ConfidenceLevel;
	createdAt: string;
	read: boolean;
}

export interface WeatherData {
	temperatureC: number;
	rainProbability: number;
	expectedRainfallMm: number;
	humidity: number;
	fetchedAt: string;
	source: "KijaniBox";
}

export type SoilStatus = "optimal" | "caution" | "dry";

export interface SoilMoisture {
	farmId: string;
	farmName: string;
	moisturePercent: number;
	status: SoilStatus;
	fetchedAt: string;
}

export interface TankLevel {
	farmId: string;
	currentL: number;
	capacityL: number;
	inflowRateLPerMin?: number;
	estFullMinutes?: number;
	updatedAt: string;
}

export type SMSStatus = "delivered" | "pending" | "failed";

export interface SMSLog {
	id: string;
	farmerId: string;
	farmName: string;
	recipientPhone: string;
	message: string;
	language: Language;
	status: SMSStatus;
	createdAt: string;
}

export interface PhoneLabel {
	phone: string;
	label: string;
	isPrimary: boolean;
}

export interface Notification {
	id: string;
	type: string;
	message: string;
	read: boolean;
	createdAt: string;
}

// NOTE: types/supabase.ts is still Person B's empty stub (no `Database`
// export yet). Re-add `export type { Database } from "./supabase";` once
// `supabase gen types typescript` output has been pasted in there.