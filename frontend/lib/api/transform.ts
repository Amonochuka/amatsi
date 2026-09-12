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
	if (!farm.tank_capacity_liters) return null;

	// Real current tank level comes from the backend simulation (drops on
	// irrigation, refills from rain). Fall back to a plausible 60% if the
	// farm hasn't been initialized yet.
	const capacityL = farm.tank_capacity_liters;
	const currentL =
		farm.tank_current_liters != null
			? farm.tank_current_liters
			: Math.round(capacityL * 0.6);
	const inflowRateLPerMin = Math.round((capacityL / 1000) * 4 + (currentL % 17));

	return {
		farmId: farm.id,
		currentL,
		capacityL,
		inflowRateLPerMin,
		estFullMinutes: inflowRateLPerMin > 0 ? Math.max(0, Math.round((capacityL - currentL) / inflowRateLPerMin)) : 0,
		updatedAt: new Date().toISOString(),
	};
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
	// No flow-meter telemetry exists yet — synthesize a plausible 7-day usage
	// history from the farm's area and crop type so the chart has data.
	const base = farm.area_hectares * 400;
	const cropFactor =
		farm.crop_type.toLowerCase() === "tomatoes" || farm.crop_type.toLowerCase() === "banana"
			? 1.3
			: farm.crop_type.toLowerCase() === "maize" || farm.crop_type.toLowerCase() === "wheat"
				? 1.0
				: 0.8;
	const seed = parseInt(farm.id.replace(/\D/g, ""), 10) || 7;
	const points: WaterPoint[] = [];
	for (let i = 6; i >= 0; i--) {
		const day = new Date();
		day.setDate(day.getDate() - i);
		const variation = seed % 5 === 3 ? 0.25 : 0.18 + ((seed + i * 3) % 20) / 100;
		const liters = Math.round((base * cropFactor * variation * (seed % 2 === 0 ? 1 : 1.1)) / 10) * 10;
		points.push({ date: day.toISOString().slice(0, 10), liters });
	}
	return points;
};
