"use client";

/*
 * hooks/useDashboard.ts — LOAD REAL DASHBOARD DATA WITH MOCK FALLBACK
 *
 * Fetches the first farm for the logged-in user, then loads weather, soil,
 * recommendations and alerts. Falls back to deterministic mock data whenever
 * the backend is unreachable or the user has no farm yet, so the dashboard
 * always renders.
 */
import { useEffect, useState } from "react";
import { farmAPI, weatherAPI, soilAPI, recommendationAPI, alertAPI } from "@/lib/api/client";
import {
	mapWeather,
	mapRecommendation,
	mapAlerts,
	mapWaterUsage,
	mapSoil,
	mapTankLevel,
} from "@/lib/api/transform";
import {
	mockRecommendation,
	mockSoilMoisture,
	mockTankLevel,
	mockWaterUsage,
	mockAlerts,
	mockWeather,
} from "@/lib/mock/data";

export interface DashboardData {
	loading: boolean;
	error: string | null;
	farmId: string | null;
	hasFarm: boolean;
	weather: ReturnType<typeof mapWeather>;
	soil: ReturnType<typeof mapSoil>[];
	recommendation: ReturnType<typeof mapRecommendation>;
	alerts: ReturnType<typeof mapAlerts>;
	waterUsage: ReturnType<typeof mapWaterUsage>;
	tank: ReturnType<typeof mapTankLevel> | null;
	onSendSMS: (() => void) | null;
}

const EMPTY: DashboardData = {
	loading: true,
	error: null,
	farmId: null,
	hasFarm: false,
	weather: null,
	soil: [],
	recommendation: null,
	alerts: [],
	waterUsage: [],
	tank: null,
	onSendSMS: null,
};

export function useDashboard(): DashboardData {
	const [data, setData] = useState<DashboardData>(EMPTY);

	useEffect(() => {
		let cancelled = false;
		const run = async () => {
			setData((d) => ({ ...d, loading: true, error: null }));

			// Deterministic mock fallback values.
			const fallback: DashboardData = {
				loading: false,
				error: null,
				farmId: null,
				hasFarm: false,
				weather: mockWeather(),
				soil: mockSoilMoisture(),
				recommendation: mockRecommendation(),
				alerts: mockAlerts(),
				waterUsage: mockWaterUsage(),
				tank: mockTankLevel(),
				onSendSMS: null,
			};

			try {
				const farms = await farmAPI.list();
				if (cancelled) return;
				if (!farms || farms.length === 0) {
					setData(fallback);
					return;
				}

				const farm = farms[0];
				const [weatherRes, soilRes, recs, alerts] = await Promise.allSettled([
					weatherAPI.current(farm.id),
					soilAPI.current(farm.id),
					recommendationAPI.history(farm.id),
					alertAPI.history(farm.id),
				]);

				if (cancelled) return;

				const weather =
					weatherRes.status === "fulfilled" ? mapWeather(weatherRes.value) : mockWeather();
				const soil =
					soilRes.status === "fulfilled" && soilRes.value.data
						? [mapSoil(soilRes.value, farm)]
						: mockSoilMoisture();
				const recommendation =
					recs.status === "fulfilled" && recs.value.length > 0
						? mapRecommendation(recs.value[0])
						: mockRecommendation();
				const alertsData =
					alerts.status === "fulfilled" && alerts.value.length > 0
						? mapAlerts(alerts.value)
						: mockAlerts();

				const recAction = recommendation?.action;

				setData({
					loading: false,
					error: null,
					farmId: farm.id,
					hasFarm: true,
					weather,
					soil,
					recommendation,
					alerts: alertsData,
					waterUsage: mapWaterUsage(farm),
					tank: mapTankLevel(farm),
					onSendSMS:
						typeof recAction === "string"
							? () => {
									alertAPI
										.send(
											farm.id,
											`${recAction} recommended for ${farm.name}.`
										)
										.catch(() => {});
							  }
							: null,
				});
			} catch {
				if (!cancelled) setData(fallback);
			}
		};

		run();
		return () => {
			cancelled = true;
		};
	}, []);

	return data;
}
