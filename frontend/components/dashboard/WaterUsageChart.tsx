"use client";

/*
 * ============================================================================
 * components/dashboard/WaterUsageChart.tsx — WATER USAGE BAR CHART
 * Component: Person E (Frontend Developer)
 *
 * Simple, prop-driven implementation of the 7-day water usage bar chart.
 * Falls back to mock data when `data` prop is not supplied so it can be
 * developed and reviewed independently of backend/providers.
 *
 * Notes:
 * - Uses `recharts` for rendering. Install with `npm install recharts`.
 * - Accepts `data` prop of shape [{ date: string, liters: number }].
 * - Exported as default for easy import into dashboard pages.
 * ============================================================================
 */

"use client";

/*
 * components/dashboard/WaterUsageChart.tsx — WATER USAGE BAR CHART
 * Component: Person E (Frontend Developer)
 * Prop-driven 7-day water usage bar chart with mock-data fallback.
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

type DataPoint = { date: string; liters: number };

interface WaterUsageChartProps {
	data?: DataPoint[];
	height?: number;
}

const generateMock = (): DataPoint[] => {
	const now = new Date();
	return Array.from({ length: 7 }).map((_, i) => {
		const d = new Date(now);
		d.setDate(now.getDate() - (6 - i));
		const date = d.toISOString().slice(0, 10);
		return { date, liters: Math.round(500 + Math.random() * 1500) };
	});
};

const WaterUsageChart: React.FC<WaterUsageChartProps> = ({ data, height = 140 }) => {
	const chartData = data ?? generateMock();
	const maxIdx = chartData.reduce(
		(best, d, i) => (d.liters > chartData[best].liters ? i : best),
		0
	);

	return (
		<div className="bg-white rounded-2xl border border-border p-6 h-full">
			<h3 className="font-serif text-xl font-bold mb-4">Usage (7d)</h3>
			<div style={{ width: "100%", height }}>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
						<XAxis dataKey="date" hide />
						<Tooltip
							formatter={((value: number) => `${value} L`) as any}
							labelFormatter={(d) => String(d)}
						/>
						<Bar dataKey="liters" radius={[4, 4, 0, 0]}>
							{chartData.map((_, i) => (
								<Cell key={i} fill={i === maxIdx ? "#E08D3C" : "#C9D6C1"} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default WaterUsageChart;
