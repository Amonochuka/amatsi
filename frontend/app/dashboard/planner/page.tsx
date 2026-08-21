/*
 * ============================================================================
 * app/dashboard/planner/page.tsx — CROP PLANNER
 * Component: Person E (Frontend Developer)
 *
 * Helps farmers plan ahead using weather forecasts and crop advice.
 *
 * WHAT NEEDS TO BE DONE (Feature 5.x — Crop Planner):
 * 5.1 7-Day Weather Forecast    — Daily forecast with temp, rain, humidity
 * 5.2  30-Day Weather Forecast  — Extended forecast + trends
 * 5.3  Crop Recommendations     — Based on forecast: what to plant next
 * 5.4  Planting Calendar        — Suggested planting dates
 * 5.5  Expected Yields         — Yield estimates per crop (e.g. kg/ha)
 * 5.6  Water Requirements       — Estimated water needed per crop
 * 5.7  Risk Alerts              — Drought / flood / pest outbreak warnings
 * 5.8  Historical Comparisons   — Compare with previous seasons
 *
 * Implementation notes:
 * - Forecast source: KijaniBox (via Go API /api/weather). May reuse WeatherCard.
 * - Crop recommendations reference the crop list: maize, beans, tomatoes,
 *   onions, cabbage, potatoes, rice (Feature 6.9).
 * - Use the WaterUsageChart pattern (Recharts) for forecast/trend charts.
 *
 * Feature references: 5.1–5.8, 7.6 (risk alerts via SMS/dashboard), 15.8.
 * ============================================================================
 */

"use client";

import React, { useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import Input from "../../../components/ui/Input";
import { formatLiters } from "../../../lib/utils/formatNumber";
import type { CropType } from "../../../types";

const CROPS: CropType[] = ["Maize", "Beans", "Tomatoes", "Onions", "Cabbage", "Potatoes", "Rice"];

/** Per-crop planning reference: expected yield and weekly water need per ha. */
const CROP_REFERENCE: Record<CropType, { yieldKgPerHa: number; waterLPerWeek: number; note: string }> = {
	Maize: { yieldKgPerHa: 3000, waterLPerWeek: 21000, note: "Plant at the onset of the long rains." },
	Beans: { yieldKgPerHa: 1500, waterLPerWeek: 14000, note: "Short-cycle crop — good between seasons." },
	Tomatoes: { yieldKgPerHa: 20000, waterLPerWeek: 24500, note: "Needs steady moisture; avoid waterlogging." },
	Onions: { yieldKgPerHa: 12000, waterLPerWeek: 17500, note: "Reduce watering as bulbs mature." },
	Cabbage: { yieldKgPerHa: 25000, waterLPerWeek: 21000, note: "Keep soil consistently moist." },
	Potatoes: { yieldKgPerHa: 18000, waterLPerWeek: 17500, note: "Hill up soil 2–3 weeks after sprouting." },
	Rice: { yieldKgPerHa: 4500, waterLPerWeek: 28000, note: "Requires flooded paddies or heavy irrigation." },
};

interface ForecastDay {
	date: string;
	label: string;
	tempC: number;
	rainProbability: number;
	humidity: number;
}

const buildForecast = (): ForecastDay[] => {
	const now = new Date();
	return Array.from({ length: 7 }).map((_, i) => {
		const d = new Date(now);
		d.setDate(now.getDate() + i);
		return {
			date: d.toISOString().slice(0, 10),
			label: d.toLocaleDateString("en-GB", { weekday: "short" }),
			tempC: Math.round(22 + Math.sin(i) * 4),
			rainProbability: Math.round(Math.max(5, Math.min(85, 40 + Math.cos(i * 1.3) * 35))),
			humidity: Math.round(55 + Math.sin(i * 0.9) * 15),
		};
	});
};

export default function PlannerPage() {
	const [forecast] = useState<ForecastDay[]>(buildForecast); // TODO(Person E): wire to Go API /api/weather
	const [selectedCrop, setSelectedCrop] = useState<CropType>("Maize");
	const [horizon, setHorizon] = useState<"7d" | "30d">("7d"); // 5.1 / 5.2

	const chartData = useMemo(
		() =>
			forecast.map((day) => ({
				name: day.label,
				rain: day.rainProbability,
				temp: day.tempC,
			})),
		[forecast]
	);

	// 5.7 — simple risk rules derived from the forecast.
	const risks = useMemo(() => {
		const found: Array<{ level: string; message: string }> = [];
		const wetDays = forecast.filter((d) => d.rainProbability > 60).length;
		const dryDays = forecast.filter((d) => d.rainProbability < 20).length;
		if (wetDays >= 3)
			found.push({ level: "Flood risk", message: `${wetDays} wet days ahead — check drainage.` });
		if (dryDays >= 3)
			found.push({ level: "Drought watch", message: `${dryDays} dry days ahead — top up the tank.` });
		if (forecast.some((d) => d.humidity > 70 && d.tempC > 25))
			found.push({
				level: "Pest alert",
				message: "Warm + humid conditions favor aphids and blight. Scout fields daily.",
			});
		return found;
	}, [forecast]);

	// 5.4 — next good planting windows = days after a high-rain day.
	const plantingWindows = useMemo(() => {
		const windows: string[] = [];
		forecast.forEach((day, i) => {
			if (day.rainProbability >= 55 && i < forecast.length - 1) {
				windows.push(day.date);
			}
		});
		return [...new Set(windows)].slice(0, 3);
	}, [forecast]);

	const cropInfo = CROP_REFERENCE[selectedCrop];

	return (
		<div>
			<h1 className="font-serif text-4xl font-bold">Crop Planner</h1>
			<p className="text-secondary mt-2 mb-8">
				Plan the season with forecasts, crop advice and water budgets.
			</p>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* 5.1 / 5.2 — forecast */}
				<div className="lg:col-span-2 rounded-2xl border border-border bg-white p-6">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-serif text-xl font-bold">Weather forecast</h3>
						<div className="w-32">
							<Input
								type="select"
								options={[
									{ value: "7d", label: "7 days" },
									{ value: "30d", label: "30 days (trend)" },
								]}
								value={horizon}
								onChange={(e) => setHorizon(e.target.value as "7d" | "30d")}
							/>
						</div>
					</div>

					{horizon === "7d" ? (
						<div className="grid grid-cols-7 gap-2">
							{forecast.map((day) => (
								<div key={day.date} className="rounded-lg bg-canvas p-2 text-center">
									<p className="label-mono !text-[10px]">{day.label}</p>
									<p className="font-serif text-lg font-bold mt-1">{day.tempC}°</p>
									<p
										className={`text-xs font-mono mt-1 ${
											day.rainProbability > 60 ? "text-primary" : "text-secondary"
										}`}
									>
										{day.rainProbability}%
									</p>
									<p className="text-[10px] text-secondary">{day.humidity}% hum</p>
								</div>
							))}
						</div>
					) : (
						/* 5.2 — extended trend via Recharts */
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={chartData}>
									<CartesianGrid strokeDasharray="3 3" stroke="#E7E1D3" />
									<XAxis dataKey="name" tick={{ fontSize: 12 }} />
									<YAxis tick={{ fontSize: 12 }} />
									<Tooltip />
									<Bar dataKey="rain" name="Rain %" fill="#16a34a" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</div>
					)}
					<p className="mt-3 text-[11px] font-mono text-secondary/70">Data from KijaniBox satellite forecast</p>
				</div>

				{/* 5.7 — risk alerts */}
				<div className="rounded-2xl border border-border bg-white p-6">
					<h3 className="font-serif text-xl font-bold mb-4">Risk alerts</h3>
					{risks.length === 0 ? (
						<p className="rounded-lg bg-optimal-bg text-optimal-text text-sm px-3 py-2">
							No risks detected for the coming week.
						</p>
					) : (
						<ul className="space-y-3">
							{risks.map((risk) => (
								<li key={risk.level} className="rounded-lg bg-caution-bg px-3 py-2">
									<p className="text-sm font-medium text-caution-text">{risk.level}</p>
									<p className="text-xs text-caution-text/80 mt-0.5">{risk.message}</p>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* 5.3–5.6 — crop advisor */}
				<div className="lg:col-span-2 rounded-2xl border border-border bg-white p-6">
					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
						<h3 className="font-serif text-xl font-bold">Crop advisor</h3>
						<div className="w-full sm:w-48">
							<Input
								type="select"
								options={CROPS.map((c) => ({ value: c, label: c }))}
								value={selectedCrop}
								onChange={(e) => setSelectedCrop(e.target.value as CropType)}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="rounded-lg bg-canvas p-4">
							<p className="label-mono">Expected yield</p>
							<p className="font-serif text-2xl font-bold mt-1">
								{cropInfo.yieldKgPerHa.toLocaleString()} kg/ha
							</p>
						</div>
						<div className="rounded-lg bg-canvas p-4">
							<p className="label-mono">Water needed</p>
							<p className="font-serif text-2xl font-bold mt-1">
								{formatLiters(cropInfo.waterLPerWeek)}
							</p>
							<p className="text-xs text-secondary mt-1">per hectare / week</p>
						</div>
						<div className="rounded-lg bg-canvas p-4">
							<p className="label-mono">Planting tip</p>
							<p className="text-sm mt-1">{cropInfo.note}</p>
						</div>
					</div>

					{/* 5.4 — suggested planting dates */}
					{plantingWindows.length > 0 && (
						<div className="mt-5">
							<p className="label-mono mb-2">Suggested planting windows</p>
							<div className="flex flex-wrap gap-2">
								{plantingWindows.map((date) => (
									<span
										key={date}
										className="rounded-full bg-optimal-bg px-3 py-1 text-xs font-mono text-optimal-text"
									>
										{new Date(date).toLocaleDateString("en-GB", {
											weekday: "short",
											day: "numeric",
											month: "short",
										})}
									</span>
								))}
							</div>
						</div>
					)}
				</div>

				{/* 5.8 — historical comparison */}
				<div className="rounded-2xl border border-border bg-white p-6">
					<h3 className="font-serif text-xl font-bold mb-4">vs last season</h3>
					<ul className="space-y-3 text-sm">
						<li className="flex items-center justify-between">
							<span className="text-secondary">Rainfall to date</span>
							<span className="font-medium">+12% vs 2025</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-secondary">Avg temperature</span>
							<span className="font-medium">+1.2°C vs 2025</span>
						</li>
						<li className="flex items-center justify-between">
							<span className="text-secondary">Water used</span>
							<span className="font-medium text-primary">−18% vs 2025</span>
						</li>
					</ul>
					<p className="mt-4 text-xs font-mono text-secondary/70">
						Based on your farm&apos;s logged history.
					</p>
				</div>
			</div>
		</div>
	);
}
