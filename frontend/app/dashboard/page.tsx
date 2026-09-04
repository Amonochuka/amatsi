"use client";

/*
 * app/dashboard/page.tsx — DASHBOARD OVERVIEW
 *
 * Loads real data from the Go backend via useDashboard(), showing honest
 * empty states when there is no farm or data is unavailable.
 */

import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import WeatherCard from "@/components/dashboard/WeatherCard";
import SoilMoistureCard from "@/components/dashboard/SoilMoistureCard";
import TankLevelCard from "@/components/dashboard/TankLevelCard";
import WaterUsageChart from "@/components/dashboard/WaterUsageChart";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import RecommendationCard from "@/components/dashboard/RecommendationCard";
import Link from "next/link";
import { Tractor } from "lucide-react";

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

	if (dashboard.error) {
		return (
			<div className="space-y-6">
				<div className="bg-rose-50 border border-rose-200/60 rounded-2xl p-6 text-sm text-rose-700">
					{dashboard.error}
				</div>
			</div>
		);
	}

	if (!dashboard.hasFarm) {
	return (
		<div className="bg-brand-card border border-stone-200/60 rounded-2xl p-10 text-center">
			<Tractor className="w-12 h-12 text-stone-300 mx-auto mb-4" />
			<h1 className="font-serif text-2xl font-bold text-stone-900 mb-2">
				No farms yet
			</h1>
				<p className="text-stone-500 mb-6 max-w-md mx-auto">
					Register your first farm to start receiving irrigation recommendations,
					weather updates and tank monitoring.
				</p>
				<div className="flex gap-3 justify-center">
					<Link
						href="/dashboard/farms"
						className="inline-flex items-center gap-2 rounded-lg bg-brand-accent text-white font-semibold px-4 py-2.5 text-sm hover:bg-emerald-950 transition-colors"
					>
						Add your first farm
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
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
