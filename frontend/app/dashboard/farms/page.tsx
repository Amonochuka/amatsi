"use client";

import { useEffect, useState } from "react";
import {
  Tractor,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Droplets,
  Sprout,
  Waves,
  Package,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { farmAPI } from "@/lib/api/client";
import type { CreateFarmPayload, Farm } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type FarmDraft = CreateFarmPayload;

const DAY_MS = 24 * 60 * 60 * 1000;

const toDateInputValue = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const prettyDate = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const blankDraft = (): FarmDraft => ({
  name: "",
  area_hectares: 1,
  crop_type: "",
  soil_type: "",
  irrigation_method: "",
  tank_capacity_liters: 1000,
  planting_date: new Date().toISOString().slice(0, 10),
  latitude: 0,
  longitude: 0,
});

interface FarmFormProps {
  initial: FarmDraft;
  submitLabel: string;
  onSubmit: (draft: FarmDraft) => Promise<void>;
  onCancel: () => void;
}

function FarmForm({ initial, submitLabel, onSubmit, onCancel }: FarmFormProps) {
  const [draft, setDraft] = useState<FarmDraft>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FarmDraft>(key: K, value: FarmDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(draft);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to save farm.");
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-brand-card border border-stone-200/60 rounded-2xl p-6 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Tractor className="w-4 h-4 text-emerald-800" />
        <h2 className="font-serif text-xl font-bold text-stone-900">{submitLabel}</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label="Farm Name"
            id="farm-name"
            required
            placeholder="e.g. Riverside Plot"
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>
        <Input
          label="Crop Type"
          id="crop-type"
          required
          placeholder="e.g. Maize"
          value={draft.crop_type}
          onChange={(e) => set("crop_type", e.target.value)}
        />
        <Input
          label="Soil Type"
          id="soil-type"
          required
          placeholder="e.g. Loamy"
          value={draft.soil_type}
          onChange={(e) => set("soil_type", e.target.value)}
        />
        <Input
          label="Irrigation Method"
          id="irrigation-method"
          required
          placeholder="e.g. Drip"
          value={draft.irrigation_method}
          onChange={(e) => set("irrigation_method", e.target.value)}
        />
        <Input
          label="Area (hectares)"
          id="area-hectares"
          required
          type="number"
          min="0.01"
          step="0.01"
          value={draft.area_hectares}
          onChange={(e) => set("area_hectares", Number(e.target.value))}
        />
        <Input
          label="Tank Capacity (L)"
          id="tank-capacity"
          required
          type="number"
          min="0"
          step="100"
          value={draft.tank_capacity_liters}
          onChange={(e) => set("tank_capacity_liters", Number(e.target.value))}
        />
        <Input
          label="Planting Date"
          id="planting-date"
          required
          type="date"
          value={draft.planting_date}
          onChange={(e) => set("planting_date", e.target.value)}
        />
        <Input
          label="Latitude"
          id="latitude"
          required
          type="number"
          step="any"
          value={draft.latitude}
          onChange={(e) => set("latitude", Number(e.target.value))}
        />
        <Input
          label="Longitude"
          id="longitude"
          required
          type="number"
          step="any"
          value={draft.longitude}
          onChange={(e) => set("longitude", Number(e.target.value))}
        />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex justify-end gap-3 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Farm | null>(null);

  const load = async () => {
    try {
      const data = await farmAPI.list();
      setFarms(data);
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to load farms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toDraft = (farm: Farm): FarmDraft => ({
    name: farm.name,
    area_hectares: farm.area_hectares,
    crop_type: farm.crop_type,
    soil_type: farm.soil_type,
    irrigation_method: farm.irrigation_method,
    tank_capacity_liters: farm.tank_capacity_liters,
    planting_date: toDateInputValue(farm.planting_date),
    latitude: farm.latitude,
    longitude: farm.longitude,
    device_id: farm.device_id ?? undefined,
  });

  const handleCreate = async (draft: FarmDraft) => {
    await farmAPI.create(draft);
    setShowForm(false);
    await load();
  };

  const handleUpdate = async (draft: FarmDraft) => {
    if (!editing) return;
    await farmAPI.update(editing.id, draft);
    setEditing(null);
    await load();
  };

  const handleDelete = async (farm: Farm) => {
    if (!window.confirm(`Delete farm "${farm.name}"? This cannot be undone.`)) return;
    try {
      await farmAPI.remove(farm.id);
      setFarms((prev) => prev.filter((f) => f.id !== farm.id));
    } catch (err: any) {
      alert(err?.response?.data?.error || err?.message || "Failed to delete farm.");
    }
  };

  const daysSincePlanting = (plantingDate: string): number => {
    const d = new Date(plantingDate);
    if (Number.isNaN(d.getTime())) return 0;
    return Math.max(0, Math.floor((Date.now() - d.getTime()) / DAY_MS));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">My Farms</h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your registered plots and their irrigation setups.
          </p>
        </div>
        {!showForm && !editing && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Farm
          </Button>
        )}
      </div>

      {(showForm || editing) && (
        <FarmForm
          key={editing?.id ?? "new"}
          initial={editing ? toDraft(editing) : blankDraft()}
          submitLabel={editing ? "Save Changes" : "Add Farm"}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      {loading && (
        <div className="flex items-center justify-center py-16 text-stone-500">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading farms…
        </div>
      )}

      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200/60 rounded-2xl p-6 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && farms.length === 0 && (
        <div className="bg-brand-card border border-stone-200/60 rounded-2xl p-10 text-center text-stone-500">
          <Tractor className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="font-serif text-lg font-bold text-stone-700">No farms yet</p>
          <p className="text-sm mt-1">Register your first farm to enable irrigation recommendations.</p>
        </div>
      )}

      {!loading && farms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="bg-brand-card border border-stone-200/60 rounded-2xl p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="font-serif text-xl font-bold text-stone-900">{farm.name}</h2>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditing(farm)}
                    className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-700"
                    aria-label="Edit farm"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(farm)}
                    className="p-1.5 rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600"
                    aria-label="Delete farm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm flex-1">
                <Stat icon={<Sprout className="w-4 h-4" />} label="Crop" value={farm.crop_type} />
                <Stat icon={<Package className="w-4 h-4" />} label="Soil" value={farm.soil_type} />
                <Stat icon={<Waves className="w-4 h-4" />} label="Irrigation" value={farm.irrigation_method} />
                <Stat icon={<Tractor className="w-4 h-4" />} label="Area" value={`${farm.area_hectares} ha`} />
                <Stat icon={<Droplets className="w-4 h-4" />} label="Tank" value={`${farm.tank_capacity_liters.toLocaleString()} L`} />
                <Stat icon={<CalendarDays className="w-4 h-4" />} label="Planted" value={prettyDate(farm.planting_date)} />
              </div>

              <div className="mt-4 pt-4 border-t border-stone-200/60 text-[11px] font-mono text-stone-400 flex justify-between">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {farm.latitude.toFixed(4)}, {farm.longitude.toFixed(4)}
                </span>
                <span>{daysSincePlanting(farm.planting_date)} days ago</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-emerald-800 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] font-mono uppercase tracking-wider text-stone-400">{label}</div>
        <div className="font-semibold text-stone-800 truncate">{value}</div>
      </div>
    </div>
  );
}
