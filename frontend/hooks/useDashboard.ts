"use client";

/*
 * hooks/useDashboard.ts — LOAD REAL DASHBOARD DATA
 *
 * Fetches the first farm for the logged-in user, then loads weather, soil,
 * recommendations and alerts. Returns honest empty states when there is no
 * farm or data is unavailable — no mock fallbacks.
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

			try {
				const farms = (await farmAPI.list()) ?? [];
				if (cancelled) return;
				if (!farms || farms.length === 0) {
					// No farm registered yet — show an honest empty state rather than
					// fake metrics. Water usage is safe to show as zeros.
					setData({
						loading: false,
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
					});
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
					weatherRes.status === "fulfilled" ? mapWeather(weatherRes.value) : null;
				const soil =
					soilRes.status === "fulfilled" && soilRes.value.data
						? [mapSoil(soilRes.value, farm)]
						: [];
				const recommendation =
					recs.status === "fulfilled" && recs.value && recs.value.length > 0
						? mapRecommendation(recs.value[0])
						: null;
				const alertsData =
					alerts.status === "fulfilled" && alerts.value
						? mapAlerts(alerts.value)
						: [];

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
				if (!cancelled) {
					setData({
						loading: false,
						error: "Could not load dashboard data right now.",
						farmId: null,
						hasFarm: false,
						weather: null,
						soil: [],
						recommendation: null,
						alerts: [],
						waterUsage: [],
						tank: null,
						onSendSMS: null,
					});
				}
			}
		};

		run();
		return () => {
			cancelled = true;
		};
	}, []);

	return data;
}
