"use client";

/*
 * components/dashboard/WeatherCard.tsx — WEATHER / MICROCLIMATE CARD
 * Feature 3.13-3.15. Attribution to KijaniBox builds trust with farmers.
 */
import React from "react";
import { CloudRain } from "lucide-react";
import type { WeatherData } from "@/types";
import { fromNow } from "@/lib/utils/formatDate";

interface WeatherCardProps {
	weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
	return (
		<div className="bg-brand-card rounded-2xl border border-stone-200/60 p-6 h-full flex flex-col">
			<div className="flex items-start justify-between mb-4">
				<h3 className="font-serif text-xl font-bold text-stone-900">Microclimate</h3>
				<CloudRain className="w-4 h-4 text-stone-500" />
			</div>
			<p className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-4">
				Last 24h &middot; {weather.temperatureC}&deg;C
			</p>

			<div className="space-y-3 flex-1">
				<div>
					<div className="flex justify-between text-sm mb-1">
						<span className="text-stone-500">Rain Prob.</span>
						<span className="font-semibold text-stone-900">{weather.rainProbability}%</span>
					</div>
					<div className="h-1.5 rounded-full bg-stone-200/60 overflow-hidden">
						<div
							className="h-full bg-sky-500"
							style={{ width: `${weather.rainProbability}%` }}
						/>
					</div>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-stone-500">Expected</span>
					<span className="font-semibold text-stone-900">{weather.expectedRainfallMm}mm</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-stone-500">Humidity</span>
					<span className="font-semibold text-stone-900">{weather.humidity}%</span>
				</div>
			</div>

			<p className="mt-4 text-[11px] font-mono text-stone-400">
				Data from {weather.source} &middot; updated {fromNow(weather.fetchedAt)}
			</p>
		</div>
	);
};

export default WeatherCard;
