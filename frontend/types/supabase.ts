/*
 * ============================================================================
 * frontend/types/supabase.ts — SUPABASE DATABASE TYPES
 * Component: Person B (database schema) + Person C (frontend)
 *
 * Generated type definitions mirroring the Supabase schema so queries are
 * type-safe (Feature 19.11 RLS-aware client calls).
 *
 * WHAT NEEDS TO BE DONE:
 * - Run `supabase gen types typescript --project-id <PROJECT_ID> --schema public`
 *   and paste output here.
 * - Tables: farmers, farms, environmental_data, recommendations, sms_logs,
 *   water_usage_logs (migrations 001–005).
 * - Keep in sync with backend/internal/models/* and types/index.ts.
 *
 * Feature references: 19.11 (RLS), 12.1 (realtime subscriptions).
 * ============================================================================
 */

/**
 * Hand-maintained mirror of migrations 001–005 until `supabase gen types`
 * output is pasted over this file. Shape follows the official generated
 * format (`Database["public"]["Tables"][name]["Row"]`).
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface FarmersRow {
	id: string;
	name: string;
	phone: string;
	email: string | null;
	language: "en" | "sw" | "luo";
	sms_enabled: boolean;
	theme: "light" | "dark" | "auto";
	plan: "free" | "pro";
	password_hash: string | null;
	created_at: string;
}

export interface FarmsRow {
	id: string;
	farmer_id: string;
	name: string;
	lat: number;
	lon: number;
	area_ha: number;
	crop_type: string;
	planting_date: string | null;
	soil_type: string;
	irrigation_method: string;
	tank_capacity_l: number;
	created_at: string;
}

export interface EnvironmentalDataRow {
	id: string;
	farm_id: string;
	temperature_c: number;
	rain_probability: number;
	expected_rainfall_mm: number;
	humidity: number;
	moisture_percent: number;
	source: string;
	fetched_at: string;
}

export interface RecommendationsRow {
	id: string;
	farm_id: string;
	action: "IRRIGATE" | "WAIT" | "MONITOR" | "CONSERVE";
	reason: string;
	volume_l: number;
	water_saved_l: number;
	confidence: "High" | "Medium" | "Low";
	read: boolean;
	created_at: string;
}

export interface SmsLogsRow {
	id: string;
	farmer_id: string;
	farm_id: string | null;
	recipient_phone: string;
	message: string;
	language: "en" | "sw" | "luo";
	status: "delivered" | "pending" | "failed";
	created_at: string;
}

export interface WaterUsageLogsRow {
	id: string;
	farm_id: string;
	liters: number;
	logged_at: string;
}

type RowOf<T> = { Row: T; Insert: Partial<T>; Update: Partial<T> };

export interface Database {
	public: {
		Tables: {
			farmers: RowOf<FarmersRow>;
			farms: RowOf<FarmsRow>;
			environmental_data: RowOf<EnvironmentalDataRow>;
			recommendations: RowOf<RecommendationsRow>;
			sms_logs: RowOf<SmsLogsRow>;
			water_usage_logs: RowOf<WaterUsageLogsRow>;
		};
		Views: Record<string, never>;
		Functions: Record<string, never>;
		Enums: Record<string, never>;
	};
}
