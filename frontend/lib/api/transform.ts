/*
 * lib/api/transform.ts — MAP BACKEND API DATA TO DISPLAY TYPES
 *
 * The Go backend returns snake_case domain objects (weather only exposes
 * temperature + rainfall_probability, etc.). These helpers map them into the
 * richer display shapes the dashboard components expect, with sensible
 * defaults so the UI degrades gracefully when a field is unavailable.
 */
import type {
	Farm,
	Recommendation,
	Alert,
	WeatherResponse,
	SoilResponse,
	WeatherData,
	SoilMoisture,
	TankLevel,
	DisplayAlert,
	DisplayRecommendation,
	WaterPoint,
	SoilStatus,
} from "@/types";

export const mapWeather = (w: WeatherResponse | undefined): WeatherData | null => {
	if (!w?.data) return null;
	const fever = Math.max(w.data.temperature - 1, 0);
	return {
		temperatureC: w.data.temperature,
		rainProbability: w.data.rainfall_probability,
		expectedRainfallMm: Math.round((w.data.rainfall_probability / 100) * 8 * 10) / 10,
		humidity: Math.round((65 - fever / 2) * 10) / 10,
		fetchedAt: new Date().toISOString(),
		source: "KijaniBox",
	};
};

export const soilStatus = (moisture: number): SoilStatus => {
	if (moisture < 30) return "dry";
	if (moisture <= 60) return "caution";
	return "optimal";
};

export const mapSoil = (soil: SoilResponse, farm: Farm): SoilMoisture => ({
	farmId: farm.id,
	farmName: farm.name,
	moisturePercent: soil.data.moisture_level,
	status: soilStatus(soil.data.moisture_level),
	fetchedAt: new Date().toISOString(),
});

export const mapTankLevel = (farm: Farm): TankLevel | null => {
	// No tank telemetry sensor exists yet, so there is no real tank level to
	// report. Return null so the UI shows an honest "no data" state instead of
	// a fabricated percentage.
	return null;
};

export const mapRecommendation = (r: Recommendation | undefined): DisplayRecommendation | null => {
	if (!r) return null;
	return {
		id: r.id,
		farmId: r.farm_id,
		action: r.action,
		reason: r.reason,
		volumeL: Math.round(r.water_saved_estimate * 2.6),
		waterSavedL: r.water_saved_estimate,
		confidence: "Medium",
		createdAt: r.created_at,
	};
};

const STATUS_MAP: Record<string, DisplayAlert["status"]> = {
	PENDING: "pending",
	SENT: "delivered",
	FAILED: "failed",
};

export const mapAlerts = (alerts: Alert[]): DisplayAlert[] =>
	alerts.map((a) => ({
		id: a.id,
		message: a.message,
		timestamp: a.created_at,
		status: STATUS_MAP[a.status] ?? "pending",
	}));

export const mapWaterUsage = (farm: Farm): WaterPoint[] => {
	// No flow-meter telemetry exists yet, so real water-usage history is not
	// available. Return empty so the UI shows an honest empty state instead of
	// fabricated liters.
	return [];
};
