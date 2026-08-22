"use client";

/*
 * components/dashboard/WaterUsageChart.tsx — WATER USAGE BAR CHART
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
