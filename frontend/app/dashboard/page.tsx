"use client";

/*
 * app/dashboard/page.tsx — DASHBOARD OVERVIEW
 *
 * Loads real data from the Go backend via useDashboard(), falling back to
 * deterministic mock data whenever the backend is unreachable or the user has
 * no farm yet.
 */

import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import WeatherCard from "@/components/dashboard/WeatherCard";
import SoilMoistureCard from "@/components/dashboard/SoilMoistureCard";
import TankLevelCard from "@/components/dashboard/TankLevelCard";
import WaterUsageChart from "@/components/dashboard/WaterUsageChart";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import RecommendationCard from "@/components/dashboard/RecommendationCard";

export default function DashboardPage() {
	const { user, loading } = useAuth();
	const dashboard = useDashboard();

	if (loading) {
		return (
			<div className="h-96 flex items-center justify-center text-stone-500">Loading...</div>
		);
	}

	if (!user) {
		return <p className="text-rose-600">Please login to view dashboard</p>;
	}

	const farmerName = user.full_name || "Farmer";

	return (
		<div className="space-y-6">
			<div className="bg-brand-card shadow-sm p-6 mb-2 rounded-t-2xl border border-stone-200/60">
				<div className="flex items-center gap-4">
					<span className="text-2xl font-bold font-serif text-stone-900">
						Karibu, {farmerName}!
					</span>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
				{dashboard.recommendation && (
					<RecommendationCard
						recommendation={dashboard.recommendation}
						onSendSMS={dashboard.onSendSMS ?? undefined}
					/>
				)}
				{dashboard.weather && <WeatherCard weather={dashboard.weather} />}
				{dashboard.tank && <TankLevelCard tank={dashboard.tank} />}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{dashboard.soil.length > 0 && <SoilMoistureCard readings={dashboard.soil} />}
				<WaterUsageChart data={dashboard.waterUsage} />
				<RecentAlerts alerts={dashboard.alerts} />
			</div>
		</div>
	);
}
