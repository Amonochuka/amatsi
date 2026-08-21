export function WaterUsageChart({ data = [] as number[] }: { data?: number[] }) {
  const max = Math.max(1, ...data);
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <span className="text-xs font-semibold text-gray-500 uppercase">Water Usage</span>
      <div className="mt-4 flex items-end gap-2 h-24">
        {data.map((v, i) => (
          <div
            key={i}
            className="flex-1 bg-emerald-400 rounded-t-sm"
            style={{ height: `${(v / max) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
