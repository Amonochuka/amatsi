/*
 * lib/mock/data.ts — DETERMINISTIC MOCK DATA FALLBACK
 * Used when the backend is unreachable or the user has no farm yet, so the
 * dashboard UI still renders useful content during development.
 */

import type {
	TankLevel,
	SoilMoisture,
	WeatherData,
	DisplayRecommendation,
	WaterPoint,
	DisplayAlert,
} from "@/types";

export const mockWaterUsage = (): WaterPoint[] => {
	const now = new Date();
	return Array.from({ length: 7 }).map((_, i) => {
		const d = new Date(now);
		d.setDate(now.getDate() - (6 - i));
		return { date: d.toISOString().slice(0, 10), liters: Math.round(400 + Math.random() * 1600) };
	});
};

export const mockAlerts = (): DisplayAlert[] => {
	const now = Date.now();
	return [
		{ id: "1", message: "Irrigation recommended for Farm A.", timestamp: new Date(now - 3600_000).toISOString(), status: "delivered" },
		{ id: "2", message: "Low tank level detected on Farm B.", timestamp: new Date(now - 6 * 3600_000).toISOString(), status: "pending" },
		{ id: "3", message: "SMS to +2547xxxxx failed to deliver.", timestamp: new Date(now - 26 * 3600_000).toISOString(), status: "failed" },
	];
};

export const mockTankLevel = (): TankLevel => ({
	farmId: "farm-1",
	currentL: 41000,
	capacityL: 50000,
	inflowRateLPerMin: 120,
	estFullMinutes: 75,
	updatedAt: new Date().toISOString(),
});

export const mockSoilMoisture = (): SoilMoisture[] => [
	{ farmId: "farm-1", farmName: "Field A", moisturePercent: 45, status: "dry", fetchedAt: new Date().toISOString() },
	{ farmId: "farm-2", farmName: "Field B", moisturePercent: 62, status: "optimal", fetchedAt: new Date().toISOString() },
];

export const mockWeather = (): WeatherData => ({
	temperatureC: 24,
	rainProbability: 20,
	expectedRainfallMm: 5,
	humidity: 58,
	fetchedAt: new Date().toISOString(),
	source: "KijaniBox",
});

export const mockRecommendation = (): DisplayRecommendation => ({
	id: "rec-1",
	farmId: "farm-1",
	action: "IRRIGATE",
	reason:
		"Soil moisture in Field A has dropped below the critical threshold. Immediate irrigation is recommended to prevent yield loss.",
	volumeL: 1200,
	waterSavedL: 450,
	confidence: "High",
	createdAt: new Date().toISOString(),
});
