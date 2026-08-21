// Shared mock data helpers for frontend development and component previews

export type WaterPoint = { date: string; liters: number };
export type Alert = { id: string; message: string; timestamp: string; status: string };

export const mockWaterUsage = (): WaterPoint[] => {
  const now = new Date();
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    return { date: d.toISOString().slice(0, 10), liters: Math.round(400 + Math.random() * 1600) };
  });
};

export const mockAlerts = (): Alert[] => {
  const now = Date.now();
  return [
    { id: "1", message: "Irrigation recommended for Farm A.", timestamp: new Date(now - 3600_000).toISOString(), status: "delivered" },
    { id: "2", message: "Low tank level detected on Farm B.", timestamp: new Date(now - 6 * 3600_000).toISOString(), status: "pending" },
    { id: "3", message: "SMS to +2547xxxxx failed to deliver.", timestamp: new Date(now - 26 * 3600_000).toISOString(), status: "failed" },
  ];
};
