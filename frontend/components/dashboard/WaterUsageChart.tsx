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

import React from "react";
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	CartesianGrid,
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

const WaterUsageChart: React.FC<WaterUsageChartProps> = ({ data, height = 220 }) => {
	const chartData = data ?? generateMock();

	return (
		<div className="w-full">
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-sm font-medium text-gray-900">Water Usage (7d)</h3>
			</div>
			<div style={{ width: "100%", height }}>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" tickFormatter={(d) => String(d).slice(5)} />
						<YAxis />
						<Tooltip formatter={(value: number) => `${value} L`} />
						<Bar dataKey="liters" fill="#3b82f6" radius={[6, 6, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default WaterUsageChart;