"use client";

/*
 * hooks/useDashboard.ts — LOAD REAL DASHBOARD DATA
 *
 * Fetches the farms for the logged-in user, then loads weather, soil,
 * recommendations and alerts for the selected farm (defaults to the first
 * one). Returns honest empty states when there is no farm or data is
 * unavailable — no mock fallbacks. Also resolves the number of SMS recipients
 * so UI copy reflects the real phone count, not a hardcoded guess.
 */
import { useEffect, useState } from "react";
import {
	farmAPI,
	weatherAPI,
	soilAPI,
	recommendationAPI,
	alertAPI,
	phoneAPI,
} from "@/lib/api/client";
import {
	mapWeather,
	mapRecommendation,
	mapAlerts,
	mapWaterUsage,
	mapSoil,
	mapTankLevel,
} from "@/lib/api/transform";
import type { Farm } from "@/types";

export interface DashboardData {
	loading: boolean;
	error: string | null;
	farmId: string | null;
	hasFarm: boolean;
	farms: Farm[];
	weather: ReturnType<typeof mapWeather>;
	soil: ReturnType<typeof mapSoil>[];
	recommendation: ReturnType<typeof mapRecommendation>;
	alerts: ReturnType<typeof mapAlerts>;
	waterUsage: ReturnType<typeof mapWaterUsage>;
	tank: ReturnType<typeof mapTankLevel> | null;
	recipientCount: number;
	onSendSMS: (() => void) | null;
}

interface FarmData {
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

const EMPTY_FARM_DATA: FarmData = {
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

export function useDashboard(farmId?: string | null): DashboardData {
	const [farms, setFarms] = useState<Farm[]>([]);
	const [recipientCount, setRecipientCount] = useState(1);
	const [farmData, setFarmData] = useState<FarmData>(EMPTY_FARM_DATA);

	// Load the farm list + SMS recipients once. The recipient count is the
	// account's primary phone plus every registered (non-opted-out) extra.
	useEffect(() => {
		let cancelled = false;
		const run = async () => {
			try {
				const [farmRes, phoneRes] = await Promise.allSettled([
					farmAPI.list(),
					phoneAPI.list(),
				]);
				if (cancelled) return;
				const farmList = farmRes.status === "fulfilled" ? (farmRes.value ?? []) : [];
				const extras = phoneRes.status === "fulfilled" ? (phoneRes.value ?? []) : [];
				setFarms(farmList);
				setRecipientCount(extras.length + 1);
				if (farmList.length === 0) {
					setFarmData({ ...EMPTY_FARM_DATA, loading: false, hasFarm: false });
				}
			} catch {
				if (!cancelled) {
					setFarms([]);
					setFarmData({ ...EMPTY_FARM_DATA, loading: false, error: "Could not load dashboard data right now." });
				}
			}
		};
		run();
		return () => {
			cancelled = true;
		};
	}, []);

	const selectedFarmId =
		farmId && farms.some((f) => f.id === farmId)
			? farmId
			: farms.length > 0
				? farms[0].id
				: null;

	// Load per-farm data whenever the selected farm changes.
	useEffect(() => {
		let cancelled = false;
		const farm = farms.find((f) => f.id === selectedFarmId);
		if (!farm) {
			if (farms.length === 0) {
				setFarmData({ ...EMPTY_FARM_DATA, loading: false, hasFarm: false });
			}
			return;
		}

		const run = async () => {
			setFarmData((d) => ({ ...d, loading: true, error: null, farmId: farm.id, hasFarm: true }));

			try {
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
					soilRes.status === "fulfilled" && soilRes.value?.data
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

				setFarmData({
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
										.send(farm.id, `${recAction} recommended for ${farm.name}.`)
										.catch(() => {});
							  }
							: null,
				});
			} catch {
				if (!cancelled) {
					setFarmData({
						...EMPTY_FARM_DATA,
						loading: false,
						error: "Could not load dashboard data right now.",
						hasFarm: true,
						farmId: farm.id,
					});
				}
			}
		};
		run();
		return () => {
			cancelled = true;
		};
	}, [selectedFarmId, farms]);

	return {
		...farmData,
		farms,
		recipientCount,
	};
}
