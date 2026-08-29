/*
 * lib/api/client.ts — BACKEND API CLIENT
 *
 * Single axios client for the Go backend. Attaches the JWT from localStorage
 * to every request. All methods map 1:1 to the backend routes defined in
 * backend/internal/api/routes/routes.go.
 */
import axios from "axios";
import type {
	AuthResponse,
	LoginPayload,
	SignupPayload,
	AuthUser,
	Farm,
	WeatherResponse,
	SoilResponse,
	Recommendation,
	Alert,
} from "@/types";

export const TOKEN_KEY = "amatsi_token";
export const USER_KEY = "amatsi_user";

export const apiClient = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem(TOKEN_KEY);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

// On 401, clear the stored session so the app redirects to login.
apiClient.interceptors.response.use(
	(res) => res,
	(err) => {
		if (err?.response?.status === 401 && typeof window !== "undefined") {
			localStorage.removeItem(TOKEN_KEY);
			localStorage.removeItem(USER_KEY);
		}
		return Promise.reject(err);
	}
);

// ---------------------------------------------------------------------------
// Session helpers
// ---------------------------------------------------------------------------
export const getToken = (): string | null => {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = (): AuthUser | null => {
	if (typeof window === "undefined") return null;
	const raw = localStorage.getItem(USER_KEY);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as AuthUser;
	} catch {
		return null;
	}
};

export const setSession = (token: string, user: AuthUser) => {
	localStorage.setItem(TOKEN_KEY, token);
	localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearSession = () => {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
};

// ---------------------------------------------------------------------------
// Auth endpoints (routes/auth.go)
// ---------------------------------------------------------------------------
export const authAPI = {
	login: (payload: LoginPayload) =>
		apiClient.post<AuthResponse>("/auth/login", payload).then((r) => r.data),
	signup: (payload: SignupPayload) =>
		apiClient.post<AuthResponse>("/auth/signup", payload).then((r) => r.data),
	logout: () => apiClient.post("/auth/logout").then((r) => r.data),
};

// ---------------------------------------------------------------------------
// Farm Management endpoints (routes/farms.go)
// ---------------------------------------------------------------------------
export const farmAPI = {
	list: () => apiClient.get<Farm[]>("/farms").then((r) => r.data),
};

// ---------------------------------------------------------------------------
// Weather & soil (routes.go: /weather/:farmId, /soil/:farmId)
// ---------------------------------------------------------------------------
export const weatherAPI = {
	current: (farmId: string) =>
		apiClient.get<WeatherResponse>(`/weather/${farmId}`).then((r) => r.data),
};

export const soilAPI = {
	current: (farmId: string) =>
		apiClient.get<SoilResponse>(`/soil/${farmId}`).then((r) => r.data),
};

// ---------------------------------------------------------------------------
// Recommendations (routes/recommendations.go)
// ---------------------------------------------------------------------------
export const recommendationAPI = {
	history: (farmId: string) =>
		apiClient.get<Recommendation[]>(`/recommendations/${farmId}`).then((r) => r.data),
};

// ---------------------------------------------------------------------------
// Alerts & SMS (routes/alerts.go)
// ---------------------------------------------------------------------------
export const alertAPI = {
	history: (farmId: string) =>
		apiClient
			.get<Alert[]>("/alerts/history", { params: { farm_id: farmId } })
			.then((r) => r.data),
};
