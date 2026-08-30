/*
 * types/index.ts — SHARED TYPES
 *
 * Frontend-facing domain types used by components, plus the raw API types that
 * mirror the Go backend's JSON responses (see backend/internal/models/*).
 * Keep in sync with backend/internal/models/* and the API handlers.
 */

// ---------------------------------------------------------------------------
// Auth / user (mirrors backend/internal/models/user.go)
// ---------------------------------------------------------------------------
export type Language = "en" | "sw" | "luo";
export type Theme = "light" | "dark" | "auto";
export type Plan = "free" | "pro";

export interface AuthUser {
	id: string;
	full_name: string;
	phone_number: string;
	email?: string;
	language: Language;
	sms_enabled: boolean;
	is_premium: boolean;
	created_at: string;
	updated_at: string;
}

export interface AuthResponse {
	token: string;
	user: AuthUser;
}

export interface LoginPayload {
	phone_number: string;
	password: string;
}

export interface SignupPayload {
	full_name: string;
	phone_number: string;
	email?: string;
	password: string;
	language?: string;
	sms_enabled?: boolean;
}

// ---------------------------------------------------------------------------
// Farm (mirrors backend/internal/models/farm.go)
// ---------------------------------------------------------------------------
export interface Farm {
	id: string;
	user_id: string;
	name: string;
	device_id: string | null;
	latitude: number;
	longitude: number;
	area_hectares: number;
	crop_type: string;
	soil_type: string;
	irrigation_method: string;
	tank_capacity_liters: number;
	planting_date: string;
	created_at: string;
	updated_at: string;
}

export interface CreateFarmPayload {
	name: string;
	device_id?: string;
	area_hectares: number;
	crop_type: string;
	soil_type: string;
	irrigation_method: string;
	tank_capacity_liters: number;
	planting_date: string; // YYYY-MM-DD
	latitude: number;
	longitude: number;
}

export interface WeatherPayload {
	temperature: number;
	rainfall_probability: number;
}

export interface WeatherResponse {
	data: WeatherPayload;
	from_cache: boolean;
}

export interface SoilPayload {
	moisture_level: number;
}

export interface SoilResponse {
	data: SoilPayload;
	from_cache: boolean;
}

// ---------------------------------------------------------------------------
// Recommendations (mirrors backend/internal/models/recommendation.go)
// ---------------------------------------------------------------------------
export type RecommendationAction = "IRRIGATE" | "WAIT" | "MONITOR" | "CONSERVE";

export interface Recommendation {
	id: string;
	farm_id: string;
	action: RecommendationAction;
	reason: string;
	water_saved_estimate: number;
	created_at: string;
}

// ---------------------------------------------------------------------------
// Alerts (mirrors backend/internal/models/alert.go)
// ---------------------------------------------------------------------------
export interface Alert {
	id: string;
	farm_id: string;
	message: string;
	status: "PENDING" | "SENT" | "FAILED";
	sent_at: string | null;
	created_at: string;
}

// ---------------------------------------------------------------------------
// Display types used by dashboard components
// ---------------------------------------------------------------------------
export type WaterPoint = { date: string; liters: number };

export type ConfidenceLevel = "High" | "Medium" | "Low";

export interface DisplayRecommendation {
	id: string;
	farmId: string;
	action: RecommendationAction;
	reason: string;
	volumeL: number;
	waterSavedL: number;
	confidence: ConfidenceLevel;
	createdAt: string;
}

export type AlertStatus = "delivered" | "pending" | "failed";

export interface PhoneLabel {
	phone: string;
	label: string;
	isPrimary: boolean;
}

export interface DisplayAlert {
	id: string;
	message: string;
	timestamp: string; // ISO date
	status: AlertStatus;
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

export interface WeatherData {
	temperatureC: number;
	rainProbability: number;
	expectedRainfallMm: number;
	humidity: number;
	fetchedAt: string;
	source: "KijaniBox";
}
