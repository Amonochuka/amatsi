export function TankLevelCard({ levelPercentage }: { levelPercentage: number }) {
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <span className="text-xs font-semibold text-gray-500 uppercase">Tank Level</span>
      <div className="mt-2 text-2xl font-bold">{levelPercentage}%</div>
      <div className="w-full bg-gray-200 h-2 rounded-full mt-3 overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-300"
          style={{ width: `${levelPercentage}%` }}
        />
      </div>
    </div>
  );
}
