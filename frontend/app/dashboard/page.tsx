import React from "react";
import WaterUsageChart from "../../../frontend/components/dashboard/WaterUsageChart";
import RecentAlerts from "../../../frontend/components/dashboard/RecentAlerts";
import FarmMap from "../../../frontend/components/dashboard/FarmMap";
import { mockWaterUsage, mockAlerts } from "../../../frontend/lib/mock/data";

export default function DashboardPage() {
	const usage = mockWaterUsage();
	const alerts = mockAlerts();

	return (
		<main className="p-6">
			<h1 className="text-xl font-semibold mb-4">Dashboard</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="md:col-span-2 space-y-4">
					<div className="bg-white p-4 rounded shadow">
						<WaterUsageChart data={usage} />
					</div>
					<div className="bg-white p-4 rounded shadow">
						<FarmMap />
					</div>
				</div>
				<div className="space-y-4">
					<div className="bg-white p-4 rounded shadow">
						<RecentAlerts alerts={alerts} />
					</div>
				</div>
			</div>
		</main>
	);
}