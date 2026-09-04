"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Loader2, Sprout, Tractor, CheckCircle2 } from "lucide-react";
import { farmAPI, recommendationAPI } from "@/lib/api/client";
import type { Farm, Recommendation } from "@/types";

const ACTION_CLS: Record<Recommendation["action"], string> = {
  IRRIGATE: "bg-rose-50 text-rose-700 border-rose-200/60",
  WAIT: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  MONITOR: "bg-amber-50 text-amber-700 border-amber-200/60",
  CONSERVE: "bg-sky-50 text-sky-700 border-sky-200/60",
};

const fmt = (iso: string) => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

export default function PlannerPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [farmId, setFarmId] = useState("");
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await farmAPI.list();
        setFarms(data ?? []);
        if (data && data.length > 0) setFarmId(data[0].id);
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
        const data = await recommendationAPI.history(farmId);
        setRecs(data ?? []);
      } catch (err: any) {
        setError(err?.response?.data?.error || err?.message || "Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    })();
  }, [farmId]);

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
          Register a farm to start planning your irrigation schedule.
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
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Planner</h1>
        <p className="text-xs text-stone-500 mt-1">
          Review irrigation recommendations and plan your watering schedule.
        </p>
      </div>

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

      {!loading && recs.length === 0 && (
        <div className="bg-brand-card border border-stone-200/60 rounded-2xl p-10 text-center">
          <CalendarDays className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="font-serif text-lg font-bold text-stone-700 mb-2">No recommendations yet</p>
          <p className="text-sm text-stone-500 max-w-sm mx-auto">
            Irrigation recommendations will appear here as the system analyzes weather and
            soil conditions for your farm.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {recs.map((r) => (
          <div
            key={r.id}
            className="bg-brand-card border border-stone-200/60 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-start gap-4"
          >
            <span className={`shrink-0 self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${ACTION_CLS[r.action]}`}>
              <Sprout className="w-3.5 h-3.5" />
              {r.action}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-stone-900">{r.reason}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                <span>Suggested {fmt(r.created_at)}</span>
                {r.water_saved_estimate != null && (
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Est. {Math.round(r.water_saved_estimate)}L saved
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
