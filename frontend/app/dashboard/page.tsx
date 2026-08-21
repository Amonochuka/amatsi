/**
 * Dashboard Page - Overview page showing farmer's daily dashboard
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

"use client";

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
	const { lastSynced } = useOffline();
	const { toast } = useRealtime();

	if (loading) {
		return <div className="h-96 flex items-center justify-center">Loading...</div>;
	}

	if (!user) {
		return <p className="text-red-600">Please login to view dashboard</p>;
	}

	const recommendation = mockRecommendation();
	const weather = mockWeather();
	const soilMoisture = mockSoilMoisture();
	const tankLevel = mockTankLevel();
	const waterUsage = mockWaterUsage();
	const recentAlerts = mockAlerts();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow-sm p-6 mb-6 rounded-t-lg">
				<div className="flex items-center gap-4">
					<span className="text-2xl font-bold">Welcome, {user.name || "Farmer"}!</span>
					<span className="text-sm text-gray-500">{user.language || "English"}</span>
				</div>
				{lastSynced && (
					<p className="text-xs text-gray-500 mt-1">Last synced: {lastSynced}</p>
				)}
				{toast && <p className="text-xs text-green-700 mt-1">{toast}</p>}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
				<RecommendationCard recommendation={recommendation} />
				<WeatherCard weather={weather} />
				<SoilMoistureCard readings={soilMoisture} />
				<TankLevelCard tank={tankLevel} />
			</div>

			<WaterUsageChart data={waterUsage} />
			<RecentAlerts alerts={recentAlerts} />
		</div>
	);
}
