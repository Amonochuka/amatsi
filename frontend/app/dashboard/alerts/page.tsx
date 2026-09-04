"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, Loader2, CheckCircle2, Clock, XCircle, Tractor, ShieldCheck, MessageSquareText } from "lucide-react";
import { farmAPI, alertAPI } from "@/lib/api/client";
import type { Farm, Alert } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

const STATUS_META: Record<Alert["status"], { label: string; icon: React.ReactNode; cls: string }> = {
  SENT: { label: "Delivered", icon: <CheckCircle2 className="w-4 h-4" />, cls: "text-emerald-700 bg-emerald-50 border-emerald-200/60" },
  PENDING: { label: "Pending", icon: <Clock className="w-4 h-4" />, cls: "text-amber-700 bg-amber-50 border-amber-200/60" },
  FAILED: { label: "Failed", icon: <XCircle className="w-4 h-4" />, cls: "text-rose-700 bg-rose-50 border-rose-200/60" },
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / (1000 * 60 * 60));
  if (hrs < 1) return "just now";
  if (hrs < 24) return `${hrs}h ago`;
  if (hrs < 168) return `${Math.floor(hrs / 24)}d ago`;
  return new Date(iso).toLocaleDateString();
};

export default function AlertsPage() {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [farmId, setFarmId] = useState<string>("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = (await farmAPI.list()) ?? [];
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

  const loadAlerts = useCallback(async (id: string) => {
    if (!id) {
      setAlerts([]);
      return;
    }
    try {
      const data = (await alertAPI.history(id)) ?? [];
      setAlerts(data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to load alerts.");
    }
  }, []);

  useEffect(() => {
    if (farmId) loadAlerts(farmId);
  }, [farmId, loadAlerts]);

  const delivered = alerts.filter((a) => a.status === "SENT").length;
  const pending = alerts.filter((a) => a.status === "PENDING").length;
  const smsEnabled = user?.sms_enabled ?? false;

  if (loading) {
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
        <Bell className="w-12 h-12 text-stone-300 mx-auto mb-4" />
        <p className="font-serif text-lg font-bold text-stone-700 mb-2">No farms yet</p>
        <p className="text-sm text-stone-500">
          Register a farm to start receiving automated SMS alerts when irrigation is needed.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard/farms"
            className="inline-flex items-center rounded-lg bg-brand-accent text-white font-semibold px-4 py-2.5 text-sm hover:bg-emerald-950 transition-colors"
          >
            <Tractor className="w-4 h-4 mr-1.5" />
            Add a farm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Alerts</h1>
        <p className="text-xs text-stone-500 mt-1">
          Amatsi monitors your farms and sends you an SMS when irrigation action is recommended.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SMS subscription status */}
        <div className={`rounded-2xl border p-6 flex flex-col justify-between ${smsEnabled ? "border-emerald-200/60 bg-emerald-50/50" : "border-stone-200/60 bg-brand-card"}`}>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-4 h-4 ${smsEnabled ? "text-emerald-700" : "text-stone-400"}`} />
              <h2 className="font-serif text-xl font-bold text-stone-900">SMS alerts</h2>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <p className="text-stone-600">
                Status:{" "}
                <span className={`font-semibold ${smsEnabled ? "text-emerald-700" : "text-stone-500"}`}>
                  {smsEnabled ? "Subscribed" : "Off"}
                </span>
              </p>
              <p className="text-stone-600">
                Delivered to:{" "}
                <span className="font-mono font-semibold text-stone-900">
                  {user?.phone_number ?? "—"}
                </span>
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            className="mt-4 inline-flex items-center text-xs font-semibold text-emerald-800 hover:underline"
          >
            Manage SMS preferences →
          </Link>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-stone-200/60 bg-brand-card p-6 lg:col-span-2">
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">What Amatsi has sent you</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-brand-bg p-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-stone-500">Delivered</p>
              <p className="font-serif text-2xl font-bold text-emerald-700 mt-1">{delivered}</p>
            </div>
            <div className="rounded-lg bg-brand-bg p-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-stone-500">Pending</p>
              <p className="font-serif text-2xl font-bold text-amber-700 mt-1">{pending}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-stone-500 leading-relaxed">
            Amatsi automatically sends an SMS whenever irrigation is recommended for
            one of your farms.
          </p>
        </div>
      </div>

      {/* Filter by farm */}
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

      {/* Alert history */}
      <div className="bg-brand-card border border-stone-200/60 rounded-2xl p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquareText className="w-4 h-4 text-emerald-800" />
          <h2 className="font-serif text-xl font-bold text-stone-900">Alert history</h2>
        </div>
        {alerts.length === 0 ? (
          <div className="text-center py-10 text-stone-400">
            <Bell className="w-10 h-10 mx-auto mb-3 text-stone-300" />
            <p className="text-sm">
              No alerts sent for this farm yet. Amatsi will message you automatically when
              irrigation is recommended.
            </p>
          </div>
        ) : (
          <ul className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {alerts.map((a) => {
              const meta = STATUS_META[a.status];
              return (
                <li key={a.id} className="flex items-start gap-3 rounded-xl border border-stone-200/60 p-3">
                  <span className={`mt-0.5 grid place-items-center w-8 h-8 rounded-lg border ${meta.cls}`}>
                    {meta.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-900">{a.message}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{timeAgo(a.created_at)}</p>
                  </div>
                  <span className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${meta.cls}`}>
                    {meta.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}