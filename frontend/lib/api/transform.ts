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

export const mapTankLevel = (farm: Farm): TankLevel => ({
	farmId: farm.id,
	currentL: farm.tank_capacity_liters * 0.64,
	capacityL: farm.tank_capacity_liters,
	estFullMinutes: 0,
	inflowRateLPerMin: 0,
	updatedAt: new Date().toISOString(),
});

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
	const now = new Date();
	return Array.from({ length: 7 }).map((_, i) => {
		const d = new Date(now);
		d.setDate(now.getDate() - (6 - i));
		return {
			date: d.toISOString().slice(0, 10),
			liters: Math.round(farm.tank_capacity_liters * 0.9 * (0.6 + (i % 4) * 0.1)),
		};
	});
};
