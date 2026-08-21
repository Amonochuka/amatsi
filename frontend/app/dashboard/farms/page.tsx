/*
 * ============================================================================
 * app/dashboard/farms/page.tsx — MY FARMS
 * Component: Person E (Frontend Developer)
 *
 * Full CRUD for the farmer's fields/plots.
 *
 * WHAT NEEDS TO BE DONE (Feature 6.x — My Farms):
 * 6.1  Farm List         — Cards for all farms
 * 6.2  Farm Card         — Name, crop, area, status indicator
 * 6.3  Farm Status       — Show the latest recommendation status per farm
 * 6.4  Add Farm Button   — Opens the add-farm form
 * 6.5  Add Farm Form     — Full form for a new farm
 * 6.6  Farm Name Field   — Input for farm name
 * 6.7  Farm Location     — <FarmMap/> location picker OR GPS coordinates
 * 6.8  Field Size Field  — Area in hectares
 * 6.9  Crop Type Dropdown— Maize, Beans, Tomatoes, Onions, Cabbage,
 *                          Potatoes, Rice
 * 6.10 Planting Date     — Date picker
 * 6.11 Soil Type Dropdown— Loam, Clay, Sandy, Silt, Other
 * 6.12 Irrigation Method — Drip, Sprinkler, Furrow, Manual
 * 6.13 Tank Capacity     — Water tank capacity in liters
 * 6.14 Edit Farm Form    — Edit existing farm details (pre-filled)
 * 6.15 Delete Farm       — Delete with confirmation dialog
 *
 * Implementation notes:
 * - API: createFarm/updateFarm/deleteFarm/getFarms (lib/api/client.ts).
 * - Reuse <FarmMap/> for the location field.
 * - Form validation + loading states (Feature 2.4/2.5 patterns).
 *
 * Feature references: 6.1–6.15, 15.11 (activity log).
 * ============================================================================
 */

"use client";

import React, { useMemo, useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import FarmMap from "../../../components/dashboard/FarmMap";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { validateFarmForm } from "../../../lib/utils/validators";
import { formatHa, formatLiters } from "../../../lib/utils/formatNumber";
import type { CropType, Farm, IrrigationMethod, RecommendationAction, SoilType } from "../../../types";

const CROPS: CropType[] = ["Maize", "Beans", "Tomatoes", "Onions", "Cabbage", "Potatoes", "Rice"];
const SOILS: SoilType[] = ["Loam", "Clay", "Sandy", "Silt", "Other"];
const METHODS: IrrigationMethod[] = ["Drip", "Sprinkler", "Furrow", "Manual"];

const STATUS_STYLES: Record<RecommendationAction, string> = {
	IRRIGATE: "bg-dry-bg text-dry-text",
	WAIT: "bg-optimal-bg text-optimal-text",
	MONITOR: "bg-caution-bg text-caution-text",
	CONSERVE: "bg-blue-100 text-blue-700",
};

const toOptions = <T extends string>(values: T[]) =>
	values.map((v) => ({ value: v, label: v }));

interface FormState {
	name: string;
	areaHa: string;
	tankCapacityL: string;
	cropType: CropType;
	plantingDate: string;
	soilType: SoilType;
	irrigationMethod: IrrigationMethod;
}

const EMPTY_FORM: FormState = {
	name: "",
	areaHa: "",
	tankCapacityL: "",
	cropType: "Maize",
	plantingDate: "",
	soilType: "Loam",
	irrigationMethod: "Drip",
};

/** Mock store until the Go API is wired up (swap for lib/api/client.ts). */
const seedFarms = (): Farm[] => [
	{
		id: "farm-1",
		farmerId: "demo-farmer",
		name: "Field A",
		lat: -0.42,
		lon: 36.95,
		areaHa: 2.5,
		cropType: "Maize",
		plantingDate: "2026-03-15",
		soilType: "Loam",
		irrigationMethod: "Drip",
		tankCapacityL: 50000,
		createdAt: new Date().toISOString(),
	},
	{
		id: "farm-2",
		farmerId: "demo-farmer",
		name: "Field B",
		lat: -0.38,
		lon: 37.02,
		areaHa: 1,
		cropType: "Tomatoes",
		plantingDate: "2026-04-02",
		soilType: "Clay",
		irrigationMethod: "Sprinkler",
		tankCapacityL: 20000,
		createdAt: new Date().toISOString(),
	},
];

export default function FarmsPage() {
	const [farms, setFarms] = useState<Farm[]>(seedFarms);
	const [formOpen, setFormOpen] = useState(false); // 6.4
	const [editingId, setEditingId] = useState<string | null>(null); // 6.14
	const [form, setForm] = useState<FormState>(EMPTY_FORM);
	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [saving, setSaving] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null); // 6.15

	const latestStatus = useMemo<Record<string, RecommendationAction>>(
		() => ({
			"farm-1": "IRRIGATE",
			"farm-2": "WAIT",
		}),
		[]
	);

	const openAddForm = () => {
		setEditingId(null);
		setForm(EMPTY_FORM);
		setCoords(null);
		setErrors({});
		setFormOpen(true);
	};

	const openEditForm = (farm: Farm) => {
		setEditingId(farm.id);
		setForm({
			name: farm.name,
			areaHa: String(farm.areaHa),
			tankCapacityL: String(farm.tankCapacityL),
			cropType: farm.cropType,
			plantingDate: farm.plantingDate,
			soilType: farm.soilType,
			irrigationMethod: farm.irrigationMethod,
		});
		setCoords({ lat: farm.lat, lng: farm.lon });
		setErrors({});
		setFormOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const validation = validateFarmForm(form);
		if (!validation.valid) {
			setErrors(validation.errors);
			return;
		}
		setSaving(true);

		const selected = coords ?? { lat: -0.42, lng: 36.95 };
		if (editingId) {
			setFarms((prev) =>
				prev.map((f) =>
					f.id === editingId
						? {
								...f,
								name: form.name.trim(),
								areaHa: Number(form.areaHa),
								tankCapacityL: Number(form.tankCapacityL),
								cropType: form.cropType,
								plantingDate: form.plantingDate,
								soilType: form.soilType,
								irrigationMethod: form.irrigationMethod,
								lat: selected.lat,
								lon: selected.lng,
							}
						: f
				)
			);
		} else {
			setFarms((prev) => [
				...prev,
				{
					id: `farm-${Date.now()}`,
					farmerId: "demo-farmer",
					name: form.name.trim(),
					areaHa: Number(form.areaHa),
					tankCapacityL: Number(form.tankCapacityL),
					cropType: form.cropType,
					plantingDate: form.plantingDate,
					soilType: form.soilType,
					irrigationMethod: form.irrigationMethod,
					lat: selected.lat,
					lon: selected.lng,
					createdAt: new Date().toISOString(),
				},
			]);
		}

		setSaving(false);
		setFormOpen(false);
	};

	const confirmDelete = (id: string) => {
		setFarms((prev) => prev.filter((f) => f.id !== id));
		setDeletingId(null);
	};

	return (
		<div>
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="font-serif text-4xl font-bold">My Farms</h1>
					<p className="text-secondary mt-2">
						{farms.length} farm{farms.length !== 1 ? "s" : ""} registered
					</p>
				</div>
				<Button onClick={openAddForm}>+ Add Farm</Button>
			</div>

			{/* 6.1 / 6.2 / 6.3 — farm cards with live status */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{farms.map((farm) => (
					<div key={farm.id} className="rounded-2xl border border-border bg-white p-6">
						<div className="flex items-start justify-between">
							<h3 className="font-serif text-xl font-bold">{farm.name}</h3>
							<span
								className={`label-mono px-2 py-1 rounded-full ${STATUS_STYLES[latestStatus[farm.id] ?? "MONITOR"]}`}
							>
								{latestStatus[farm.id] ?? "MONITOR"}
							</span>
						</div>
						<p className="text-sm text-secondary mt-1">{farm.cropType}</p>

						<dl className="mt-4 space-y-1.5 text-sm">
							<div className="flex justify-between">
								<dt className="text-secondary">Area</dt>
								<dd>{formatHa(farm.areaHa)}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-secondary">Tank</dt>
								<dd>{formatLiters(farm.tankCapacityL)}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-secondary">Irrigation</dt>
								<dd>{farm.irrigationMethod}</dd>
							</div>
							<div className="flex justify-between">
								<dt className="text-secondary">Location</dt>
								<dd className="font-mono text-xs">
									{farm.lat.toFixed(3)}, {farm.lon.toFixed(3)}
								</dd>
							</div>
						</dl>

						<div className="mt-5 flex gap-2">
							<Button variant="outline" size="sm" onClick={() => openEditForm(farm)}>
								Edit
							</Button>
							<Button variant="danger" size="sm" onClick={() => setDeletingId(farm.id)}>
								Delete
							</Button>
						</div>

						{/* 6.15 — delete confirmation */}
						{deletingId === farm.id && (
							<div className="mt-4 rounded-lg bg-dry-bg p-3">
								<p className="text-sm text-dry-text">
									Delete “{farm.name}”? This cannot be undone.
								</p>
								<div className="mt-2 flex gap-2">
									<Button variant="danger" size="sm" onClick={() => confirmDelete(farm.id)}>
										Yes, delete
									</Button>
									<Button variant="ghost" size="sm" onClick={() => setDeletingId(null)}>
										Cancel
									</Button>
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{/* 6.5–6.13 — add/edit form */}
			{formOpen && (
				<div className="fixed inset-0 z-50 bg-black/40 flex items-start md:items-center justify-center overflow-y-auto p-4">
					<form
						onSubmit={handleSubmit}
						noValidate
						className="w-full max-w-lg bg-white rounded-2xl border border-border p-6 space-y-4 my-8"
					>
						<h2 className="font-serif text-2xl font-bold">
							{editingId ? "Edit farm" : "Add a farm"}
						</h2>

						<Input
							label="Farm name"
							name="name"
							placeholder="e.g. Field A"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							error={errors.name}
							disabled={saving}
						/>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Input
								label="Field size (ha)"
								name="areaHa"
								type="number"
								step="0.1"
								min="0"
								placeholder="2.5"
								value={form.areaHa}
								onChange={(e) => setForm({ ...form, areaHa: e.target.value })}
								error={errors.areaHa}
								disabled={saving}
							/>
							<Input
								label="Tank capacity (L)"
								name="tankCapacityL"
								type="number"
								min="0"
								placeholder="50000"
								value={form.tankCapacityL}
								onChange={(e) => setForm({ ...form, tankCapacityL: e.target.value })}
								error={errors.tankCapacityL}
								disabled={saving}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Input
								label="Crop type"
								name="cropType"
								type="select"
								options={toOptions(CROPS)}
								value={form.cropType}
								onChange={(e) => setForm({ ...form, cropType: e.target.value as CropType })}
								disabled={saving}
							/>
							<Input
								label="Planting date"
								name="plantingDate"
								type="date"
								value={form.plantingDate}
								onChange={(e) => setForm({ ...form, plantingDate: e.target.value })}
								disabled={saving}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Input
								label="Soil type"
								name="soilType"
								type="select"
								options={toOptions(SOILS)}
								value={form.soilType}
								onChange={(e) => setForm({ ...form, soilType: e.target.value as SoilType })}
								disabled={saving}
							/>
							<Input
								label="Irrigation method"
								name="irrigationMethod"
								type="select"
								options={toOptions(METHODS)}
								value={form.irrigationMethod}
								onChange={(e) =>
									setForm({ ...form, irrigationMethod: e.target.value as IrrigationMethod })
								}
								disabled={saving}
							/>
						</div>

						{/* 6.7 — location picker */}
						<div>
							<p className="block mb-1.5 text-sm font-medium text-ink">Farm location</p>
							<FarmMap initial={coords ?? undefined} onChange={setCoords} height={180} />
						</div>

						<div className="flex gap-3 pt-2">
							<Button type="submit" fullWidth loading={saving}>
								{editingId ? "Save changes" : "Create farm"}
							</Button>
							<Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>
								Cancel
							</Button>
						</div>
					</form>
				</div>
			)}

			{farms.length === 0 && !formOpen && (
				<div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
					<p className="text-secondary">No farms yet.</p>
					<Button className="mt-4" onClick={openAddForm}>
						Add your first farm
					</Button>
				</div>
			)}

			{saving && <LoadingSpinner absolute />}
		</div>
	);
}
