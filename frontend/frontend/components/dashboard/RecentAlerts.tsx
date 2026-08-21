export function RecentAlerts({ alerts = [] as string[] }: { alerts?: string[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Recent Alerts</h3>
      {alerts.length === 0 ? (
        <p className="text-sm text-stone-400">No alerts right now.</p>
      ) : (
        <ul className="space-y-2 text-sm text-stone-700">
          {alerts.map((alert, i) => (
            <li key={i}>{alert}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
