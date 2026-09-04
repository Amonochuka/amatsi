"use client";

/*
 * components/dashboard/WaterUsageChart.tsx — WATER USAGE BAR CHART
 * Shows real per-day water usage. Displays an honest empty state when no
 * telemetry is available yet (no flow meter).
 */
import React from "react";
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	Tooltip,
	Cell,
} from "recharts";
import { Droplets } from "lucide-react";

type DataPoint = { date: string; liters: number };

interface WaterUsageChartProps {
	data?: DataPoint[];
	height?: number;
}

const WaterUsageChart: React.FC<WaterUsageChartProps> = ({ data, height = 140 }) => {
	const chartData = data ?? [];

	if (chartData.length === 0) {
		return (
			<div className="bg-brand-card rounded-2xl border border-stone-200/60 p-6 h-full">
				<h3 className="font-serif text-xl font-bold text-stone-900 mb-2">Usage (7d)</h3>
				<div className="flex flex-col items-center justify-center text-stone-400 h-32 text-center">
					<Droplets className="w-8 h-8 text-stone-300 mb-2" />
					<p className="text-sm">No usage data yet.</p>
					<p className="text-xs mt-1">Connecting a flow meter will show daily water usage here.</p>
				</div>
			</div>
		);
	}

	const maxIdx = chartData.reduce(
		(best, d, i) => (d.liters > chartData[best].liters ? i : best),
		0
	);

	return (
		<div className="bg-brand-card rounded-2xl border border-stone-200/60 p-6 h-full">
			<h3 className="font-serif text-xl font-bold text-stone-900 mb-4">Usage (7d)</h3>
			<div style={{ width: "100%", height }}>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
						<XAxis dataKey="date" hide />
						<Tooltip
							formatter={((value: number) => `${value} L`) as never}
							labelFormatter={(d) => String(d)}
						/>
						<Bar dataKey="liters" radius={[4, 4, 0, 0]}>
							{chartData.map((_, i) => (
								<Cell key={i} fill={i === maxIdx ? "#F0A24A" : "#6EE7B7"} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default WaterUsageChart;
