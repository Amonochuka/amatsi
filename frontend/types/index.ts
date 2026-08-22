/*
 * types/index.ts — SHARED TYPES
 * Mirrors DB schema (migrations 001-005) and API response shapes.
 * Keep in sync with backend/internal/models/* and ai-service models.
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
