"use client";

/*
 * app/dashboard/page.tsx — DASHBOARD OVERVIEW
 *
 * LAYOUT:
 * - Welcome greeting with farmer name from auth session
 * - Daily Recommendation Card (primary focus)
 * - Weather Card / Soil Moisture / Tank Level
 * - Water Usage Chart (7 days)
 * - Recent Alerts list
 *
 * CONNECTIONS:
 * - useAuth / useOffline / useRealtime for session + live updates
 * - Falls back to lib/mock/data.ts until API payloads are wired
 */

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOffline } from "@/hooks/useOffline";
import { useRealtime } from "@/hooks/useRealtime";
import WeatherCard from "@/components/dashboard/WeatherCard";
import SoilMoistureCard from "@/components/dashboard/SoilMoistureCard";
import TankLevelCard from "@/components/dashboard/TankLevelCard";
import WaterUsageChart from "@/components/dashboard/WaterUsageChart";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import RecommendationCard from "@/components/dashboard/RecommendationCard";
import {
	mockAlerts,
	mockRecommendation,
	mockSoilMoisture,
	mockTankLevel,
	mockWaterUsage,
	mockWeather,
} from "@/lib/mock/data";

export default function DashboardPage() {
	const { user, loading } = useAuth();
	const { isOnline } = useOffline("dashboard", null);
	const [toast, setToast] = useState<string | null>(null);

	useRealtime<Record<string, unknown>>("recommendations", () => {
		setToast("New recommendation received");
		setTimeout(() => setToast(null), 4000);
	});

	if (loading) {
		return (
			<div className="h-96 flex items-center justify-center text-stone-500">Loading...</div>
		);
	}

	if (!user) {
		return <p className="text-rose-600">Please login to view dashboard</p>;
	}

	const farmerName =
		(user.user_metadata?.full_name as string | undefined) ??
		(user.user_metadata?.name as string | undefined) ??
		"Farmer";

	const recommendation = mockRecommendation();
	const weather = mockWeather();
	const soilMoisture = mockSoilMoisture();
	const tankLevel = mockTankLevel();
	const waterUsage = mockWaterUsage();
	const recentAlerts = mockAlerts();

	return (
		<div className="space-y-6">
			<div className="bg-brand-card shadow-sm p-6 mb-2 rounded-t-2xl border border-stone-200/60">
				<div className="flex items-center gap-4">
					<span className="text-2xl font-bold font-serif text-stone-900">
						Karibu, {farmerName}!
					</span>
					<span
						className={`text-[11px] font-mono uppercase tracking-wider px-3 py-1 rounded-full ${
							isOnline ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-700"
						}`}
					>
						{isOnline ? "Online" : "Offline Mode"}
					</span>
				</div>
				{toast && <p className="text-xs text-emerald-700 mt-1">{toast}</p>}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
				<RecommendationCard recommendation={recommendation} />
				<WeatherCard weather={weather} />
				<TankLevelCard tank={tankLevel} />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<SoilMoistureCard readings={soilMoisture} />
				<WaterUsageChart data={waterUsage} />
				<RecentAlerts alerts={recentAlerts} />
			</div>
		</div>
	);
}
