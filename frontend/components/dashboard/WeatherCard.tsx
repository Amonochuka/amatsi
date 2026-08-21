/*
 * ============================================================================
 * components/dashboard/WeatherCard.tsx — WEATHER CARD
 * Component: Person C (Frontend Developer)
 *
 * Displays current live weather data for the farm location.
 *
 * WHAT NEEDS TO BE DONE (Feature 3.13–3.15 + 5.1):
 * 3.13 Weather Card         — Temperature (°C), rain probability (%),
 *                             expected rainfall (mm), humidity
 * 3.14 Data Source Attribution — "Data from KijaniBox" (builds trust)
 * 3.15 Data Timestamp       — When weather data was last updated
 *
 * Optional (Crop Planner support):
 * 5.1  7-Day Forecast       — Daily forecast with temp, rain, humidity
 *
 * Implementation notes:
 * - Fetch from GET /api/weather/:farmId (lib/api/client.ts getWeather()).
 * - Cache last payload in localStorage for offline display (Feature 11.5).
 * - Show a small loading state while fetching (Feature 19.8).
 *
 * Feature references: 3.13–3.15, 5.1, 11.5, 19.8.
 * ============================================================================
 */

/*
 * components/dashboard/WeatherCard.tsx — WEATHER / MICROCLIMATE CARD
 * Feature 3.13-3.15. Attribution to KijaniBox builds trust with farmers.
 */
import React from "react";
import type { WeatherData } from "../../types";
import { fromNow } from "../../lib/utils/formatDate";

interface WeatherCardProps {
	weather: WeatherData;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
	return (
		<div className="bg-white rounded-2xl border border-border p-6 h-full flex flex-col">
			<h3 className="font-serif text-xl font-bold mb-1">Microclimate</h3>
			<p className="label-mono mb-4">Last 24h · {weather.temperatureC}&deg;C</p>

			<div className="space-y-3 flex-1">
				<div>
					<div className="flex justify-between text-sm mb-1">
						<span className="text-secondary">Rain Prob.</span>
						<span className="font-semibold">{weather.rainProbability}%</span>
					</div>
					<div className="h-1.5 rounded-full bg-canvas overflow-hidden">
						<div
							className="h-full bg-dry-text"
							style={{ width: `${weather.rainProbability}%` }}
						/>
					</div>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-secondary">Expected</span>
					<span className="font-semibold">{weather.expectedRainfallMm}mm</span>
				</div>
				<div className="flex justify-between text-sm">
					<span className="text-secondary">Humidity</span>
					<span className="font-semibold">{weather.humidity}%</span>
				</div>
			</div>

			<p className="mt-4 text-[11px] font-mono text-secondary/70">
				Data from {weather.source} · updated {fromNow(weather.fetchedAt)}
			</p>
		</div>
	);
};

export default WeatherCard;
