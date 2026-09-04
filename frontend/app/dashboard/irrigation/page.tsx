"use client";

import { useEffect, useState } from "react";
import { Droplets, Loader2, RefreshCw, Tractor, Gauge } from "lucide-react";
import { farmAPI, soilAPI, weatherAPI } from "@/lib/api/client";
import type { Farm, SoilResponse, WeatherResponse } from "@/types";
import { mapSoil, mapWeather, mapTankLevel } from "@/lib/api/transform";

export default function IrrigationPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [farmId, setFarmId] = useState("");
  const [soil, setSoil] = useState<SoilResponse | null>(null);
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await farmAPI.list();
        setFarms(data);
        if (data.length > 0) setFarmId(data[0].id);
        setError(null);
      } catch (err: any) {
        setError(err?.response?.data?.error || err?.message || "Failed to load farms.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!farmId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [s, w] = await Promise.allSettled([
          soilAPI.current(farmId),
          weatherAPI.current(farmId),
        ]);
        setSoil(s.status === "fulfilled" ? s.value : null);
        setWeather(w.status === "fulfilled" ? w.value : null);
      } catch (err: any) {
        setError(err?.message || "Failed to load irrigation data.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    })();
  }, [farmId]);

  const farm = farms.find((f) => f.id === farmId);

  const moisturePct = soil?.data?.moisture_level ?? null;
  const moistureStatus =
    moisturePct == null ? "unknown" : moisturePct < 30 ? "low" : moisturePct <= 60 ? "optimum" : "high";
  const statusMeta: Record<string, { label: string; cls: string }> = {
    low: { label: "Needs irrigation", cls: "text-rose-700 bg-rose-50 border-rose-200/60" },
    optimum: { label: "Optimum", cls: "text-emerald-700 bg-emerald-50 border-emerald-200/60" },
    high: { label: "Well watered", cls: "text-sky-700 bg-sky-50 border-sky-200/60" },
    unknown: { label: "No data", cls: "text-stone-500 bg-stone-50 border-stone-200/60" },
  };

  const tank = farm ? mapTankLevel(farm) : null;
  const tankPct = tank && tank.capacityL > 0 ? Math.min(100, Math.round((tank.currentL / tank.capacityL) * 100)) : 0;

  if (loading && farms.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-stone-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading…
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div className="bg-brand-card border border-stone-200/60 rounded-2xl p-10 text-center">
        <Tractor className="w-12 h-12 text-stone-300 mx-auto mb-4" />
        <p className="font-serif text-lg font-bold text-stone-700 mb-2">No farms yet</p>
        <p className="text-sm text-stone-500">
          Register a farm to monitor soil moisture and manage irrigation.
        </p>
        <button
          onClick={() => (window.location.href = "/dashboard/farms")}
          className="mt-6 rounded-lg bg-brand-accent text-white font-semibold px-4 py-2.5 text-sm hover:bg-emerald-950 transition-colors"
        >
          Add a farm
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Irrigation</h1>
          <p className="text-xs text-stone-500 mt-1">
            Monitor soil moisture and manage your watering.
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true);
            setLoading(true);
            setFarmId((id) => id);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 text-stone-700 px-3 py-2 text-sm hover:bg-stone-100 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Farm selector */}
      <div>
        <label className="block text-xs font-semibold text-stone-600 mb-1.5">Farm</label>
        <select
          value={farmId}
          onChange={(e) => setFarmId(e.target.value)}
          className="w-full max-w-xs border border-stone-300 rounded-lg py-2 px-3 text-sm bg-white outline-none focus:border-emerald-600"
        >
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200/60 rounded-2xl p-4 text-sm text-rose-700">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Soil moisture */}
        <div className="bg-brand-card border border-stone-200/60 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-4 h-4 text-emerald-800" />
            <h2 className="font-serif text-xl font-bold text-stone-900">Soil Moisture</h2>
          </div>
          {moisturePct == null ? (
            <div className="text-sm text-stone-400 py-6 text-center">No moisture data available for this farm.</div>
          ) : (
            <>
              <div className="flex items-end gap-4">
                <span className="font-serif text-5xl font-bold text-stone-900">{moisturePct}%</span>
                <span className={`mb-2 text-[11px] font-medium px-2.5 py-1 rounded-full border ${statusMeta[moistureStatus].cls}`}>
                  {statusMeta[moistureStatus].label}
                </span>
              </div>
              <div className="mt-4 h-2 rounded-full bg-stone-200/60 overflow-hidden">
                <div
                  className={`h-full ${moisturePct < 30 ? "bg-rose-500" : moisturePct <= 60 ? "bg-emerald-500" : "bg-sky-500"}`}
                  style={{ width: `${moisturePct}%` }}
                />
              </div>
            </>
          )}
        </div>

        {/* Tank level */}
        <div className="bg-brand-card border border-stone-200/60 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-4 h-4 text-emerald-800" />
            <h2 className="font-serif text-xl font-bold text-stone-900">Tank Level</h2>
          </div>
          {tank ? (
            <>
              <p className="font-serif text-5xl font-bold text-stone-900">{tankPct}%</p>
              <p className="text-sm text-stone-500 mt-1">
                {tank.currentL.toLocaleString()} / {tank.capacityL.toLocaleString()} L
              </p>
              <div className="mt-4 h-2 rounded-full bg-stone-200/60 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${tankPct}%` }} />
              </div>
            </>
          ) : (
            <div className="text-sm text-stone-400 py-6 text-center">No tank data available.</div>
          )}
        </div>

        {/* Weather */}
        <div className="bg-brand-card border border-stone-200/60 rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-4">Weather Outlook</h2>
          {weather?.data ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Temperature</span>
                <span className="font-semibold text-stone-900">{weather.data.temperature}°C</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Rain probability</span>
                <span className="font-semibold text-stone-900">{weather.data.rainfall_probability}%</span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-stone-400 py-6 text-center">No weather data available.</div>
          )}
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl p-6 text-sm text-emerald-800">
        {moistureStatus === "low" ? (
          <p><strong>Action needed:</strong> Soil moisture is low. Consider irrigating this farm soon to prevent yield loss.</p>
        ) : moistureStatus === "optimum" ? (
          <p><strong>Good to go:</strong> Soil moisture is at a healthy level for this farm. Check back after watering.</p>
        ) : (
          <p><strong>Note:</strong> Irrigation guidance updates as soon as live farm data is available.</p>
        )}
      </div>
    </div>
  );
}
