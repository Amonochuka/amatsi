import React from "react";
import TankLevelCard from "../../components/dashboard/TankLevelCard";
import RecommendationCard from "../../components/dashboard/RecommendationCard";
import SoilMoistureCard from "../../components/dashboard/SoilMoistureCard";
import WeatherCard from "../../components/dashboard/WeatherCard";
import WaterUsageChart from "../../components/dashboard/WaterUsageChart";
import RecentAlerts from "../../components/dashboard/RecentAlerts";
import {
	mockWaterUsage,
	mockAlerts,
	mockTankLevel,
	mockSoilMoisture,
	mockWeather,
	mockRecommendation,
} from "../../lib/mock/data";

export default function DashboardPage() {
	const usage = mockWaterUsage();
	const alerts = mockAlerts();
	const tank = mockTankLevel();
	const soil = mockSoilMoisture();
	const weather = mockWeather();
	const recommendation = mockRecommendation();

	return (
		<div>
			<h1 className="font-serif text-4xl font-bold">Field Overview</h1>
			<p className="text-secondary mt-2 mb-8">Monitor and manage your vital resources.</p>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2">
					<TankLevelCard tank={tank} />
				</div>
				<div className="lg:col-span-1">
					<RecommendationCard recommendation={recommendation} recipientCount={2} smsCreditsRemaining={38} />
				</div>

				<div className="lg:col-span-1">
					<SoilMoistureCard readings={soil} />
				</div>
				<div className="lg:col-span-1">
					<WeatherCard weather={weather} />
				</div>
				<div className="lg:col-span-1">
					<WaterUsageChart data={usage} />
				</div>

				<div className="lg:col-span-3">
					<RecentAlerts alerts={alerts} />
				</div>
			</div>
		</div>
	);
}
