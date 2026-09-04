"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, Droplet, Loader2, Send, CheckCircle2, Clock, XCircle, Tractor } from "lucide-react";
import { farmAPI, alertAPI } from "@/lib/api/client";
import type { Farm, Alert } from "@/types";
import { Button } from "@/components/ui/Button";

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
  const [farms, setFarms] = useState<Farm[]>([]);
  const [farmId, setFarmId] = useState<string>("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

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

  const loadAlerts = useCallback(async (id: string) => {
    if (!id) {
      setAlerts([]);
      return;
    }
    try {
      const data = await alertAPI.history(id);
      setAlerts(data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to load alerts.");
    }
  }, []);

  useEffect(() => {
    if (farmId) loadAlerts(farmId);
  }, [farmId, loadAlerts]);

  const handleSend = async () => {
    if (!farmId || !message.trim()) return;
    setSending(true);
    setError(null);
    try {
      await alertAPI.send(farmId, message.trim());
      setMessage("");
      await loadAlerts(farmId);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to send alert.");
    } finally {
      setSending(false);
    }
  };

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
          Register a farm to manage its SMS alerts and notifications.
        </p>
        <div className="mt-6">
          <Button onClick={() => (window.location.href = "/dashboard/farms")}>
            <Tractor className="w-4 h-4 mr-1.5" />
            Add a farm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Alerts</h1>
        <p className="text-xs text-stone-500 mt-1">
          Send SMS alerts and review your notification history.
        </p>
      </div>

      {/* Farm selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-card border border-stone-200/60 rounded-2xl p-6">
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-4">Send an alert</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Farm</label>
              <select
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                className="w-full border border-stone-300 rounded-lg py-2 px-3 text-sm bg-white outline-none focus:border-emerald-600"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="e.g. Soil moisture is low — water your crops today."
                className="w-full border border-stone-300 rounded-lg py-2 px-3 text-sm outline-none focus:border-emerald-600"
              />
            </div>
            <Button onClick={handleSend} disabled={sending || !message.trim()}>
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1.5" />
                  Send SMS alert
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Alert history */}
        <div className="bg-brand-card border border-stone-200/60 rounded-2xl p-6 h-full">
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-4">Alert history</h2>
          {error && <p className="text-sm text-rose-600 mb-3">{error}</p>}
          {alerts.length === 0 ? (
            <div className="text-center py-10 text-stone-400">
              <Bell className="w-10 h-10 mx-auto mb-3 text-stone-300" />
              <p className="text-sm">No alerts sent yet for this farm.</p>
            </div>
          ) : (
            <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
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

      <div className="bg-brand-card border border-stone-200/60 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Droplet className="w-4 h-4 text-emerald-800" />
          <span className="text-sm font-semibold text-stone-900">Notifications</span>
        </div>
        <p className="text-sm text-stone-500">
          Alerts are sent via SMS to the phone numbers registered for your account. You can
          manage SMS recipients and preferences in Settings.
        </p>
      </div>
    </div>
  );
}
