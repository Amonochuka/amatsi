export function WeatherCard({ temp, rainProbability, condition }: { temp: number; rainProbability: number; condition: string }) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <span className="text-xs font-semibold text-gray-500 uppercase">Weather Forecast</span>
      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-bold">{temp}°C</div>
        <div className="text-xs font-semibold text-blue-600">{rainProbability}% Rain Chance</div>
      </div>
      <p className="mt-1 text-xs text-gray-600 capitalize">{condition}</p>
    </div>
  );
}