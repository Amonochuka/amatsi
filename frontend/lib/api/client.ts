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

import axios, { AxiosError } from "axios";
import type {
	Farm,
	Recommendation,
	WeatherData,
	SoilMoisture,
	SMSLog,
	Farmer,
} from "../../types";

export const TOKEN_KEY = "kijani:token";

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1",
	timeout: 15000, // Feature 19.9 — timeouts on every call
	headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = window.localStorage.getItem(TOKEN_KEY);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401 && typeof window !== "undefined") {
			window.localStorage.removeItem(TOKEN_KEY);
			if (!window.location.pathname.startsWith("/auth/login")) {
				window.location.href = "/auth/login";
			}
		}
		return Promise.reject(error);
	}
);

/** Feature 19.7 — one friendly message out of any axios failure. */
export const getApiErrorMessage = (error: unknown): string => {
	if (axios.isAxiosError(error)) {
		if (!error.response) return "You appear to be offline. Changes will sync when reconnected.";
		const detail = (error.response.data as { detail?: string; error?: string } | undefined)?.detail
			?? (error.response.data as { error?: string } | undefined)?.error;
		return detail ?? `Request failed (${error.response.status})`;
	}
	return "Something went wrong. Please try again.";
};

// ---------------------------------------------------------------------------
// Farms — Feature 6.x
// ---------------------------------------------------------------------------

export const getFarms = async (): Promise<Farm[]> => {
	const { data } = await api.get<Farm[]>("/farms");
	return data;
};

export const createFarm = async (farmData: Partial<Farm>): Promise<Farm> => {
	const { data } = await api.post<Farm>("/farms", farmData);
	return data;
};

export const updateFarm = async (id: string, farmData: Partial<Farm>): Promise<Farm> => {
	const { data } = await api.put<Farm>(`/farms/${id}`, farmData);
	return data;
};

export const deleteFarm = async (id: string): Promise<void> => {
	await api.delete(`/farms/${id}`);
};

// ---------------------------------------------------------------------------
// Weather & soil — Features 3.13/3.16, source KijaniBox via Go API
// ---------------------------------------------------------------------------

export const getWeather = async (farmId: string): Promise<WeatherData> => {
	const { data } = await api.get<WeatherData>(`/weather/${farmId}`);
	return data;
};

export const getSoilMoisture = async (farmId: string): Promise<SoilMoisture> => {
	const { data } = await api.get<SoilMoisture>(`/soil-moisture/${farmId}`);
	return data;
};

// ---------------------------------------------------------------------------
// Recommendations — Features 4.x
// ---------------------------------------------------------------------------

export const getRecommendations = async (farmId?: string): Promise<Recommendation[]> => {
	const { data } = await api.get<Recommendation[]>("/recommendations", {
		params: farmId ? { farm_id: farmId } : undefined,
	});
	return data;
};

/** Feature 4.1 — ask the AI service (via Go) for a fresh recommendation. */
export const generateRecommendation = async (farmId: string): Promise<Recommendation> => {
	const { data } = await api.post<Recommendation>("/recommendations/generate", { farm_id: farmId });
	return data;
};

// ---------------------------------------------------------------------------
// SMS alerts — Features 13.x / 7.x
// ---------------------------------------------------------------------------

/** Feature 13.1 / 3.11 — send the current recommendation as SMS. */
export const sendSMS = async (farmId: string): Promise<{ recipients: number }> => {
	const { data } = await api.post<{ recipients: number }>("/alerts/send", { farm_id: farmId });
	return data;
};

export const sendAlert = async (farmId: string, message?: string): Promise<void> => {
	await api.post("/alerts/send", { farm_id: farmId, message });
};

/** Feature 7.1 / 3.21 — full alert history. */
export const getAlertHistory = async (): Promise<SMSLog[]> => {
	const { data } = await api.get<SMSLog[]>("/alerts/history");
	return data;
};

/** Feature 13.15 — remaining Africa's Talking credits. */
export const getSmsCredits = async (): Promise<number> => {
	const { data } = await api.get<{ credits: number }>("/sms/credits");
	return data.credits;
};

// ---------------------------------------------------------------------------
// Profile & settings — Features 8.x / 17.x
// ---------------------------------------------------------------------------

export const updateProfile = async (profile: Partial<Farmer>): Promise<Farmer> => {
	const { data } = await api.put<Farmer>("/profile", profile);
	return data;
};

export const changePassword = async (
	currentPassword: string,
	newPassword: string
): Promise<void> => {
	await api.post("/profile/password", {
		current_password: currentPassword,
		new_password: newPassword,
	});
};

export const addPhoneNumber = async (phone: string, label: string): Promise<void> => {
	await api.post("/profile/phones", { phone, label });
};

export const removePhoneNumber = async (phone: string): Promise<void> => {
	await api.delete(`/profile/phones/${encodeURIComponent(phone)}`);
};

/** Feature 17.x — switch plan (free ↔ premium). */
export const updateSubscription = async (plan: "free" | "pro"): Promise<Farmer> => {
	const { data } = await api.post<Farmer>("/subscription", { plan });
	return data;
};

export default api;
