"use client";

/*
 * components/dashboard/SoilMoistureCard.tsx — SOIL MOISTURE CARD
 * Feature 3.16-3.17. <30% dry (IRRIGATE signal), 30-60% caution, >60% optimal.
 * One tile per farm/field side by side.
 */
import React from "react";
import type { SoilMoisture, SoilStatus } from "@/types";

interface SoilMoistureCardProps {
	readings: SoilMoisture[];
}

const STATUS_LABEL: Record<SoilStatus, string> = {
	optimal: "OPTIMAL",
	caution: "CAUTION",
	dry: "LOW",
};

const STATUS_CLASSES: Record<SoilStatus, { tile: string; badge: string; value: string }> = {
	optimal: { tile: "bg-emerald-50 border-emerald-200/60", badge: "bg-white text-emerald-700", value: "text-stone-900" },
	caution: { tile: "bg-amber-50 border-amber-200/60", badge: "bg-white text-amber-700", value: "text-stone-900" },
	dry: { tile: "bg-rose-50 border-rose-200/60", badge: "bg-white text-rose-600", value: "text-rose-600" },
};

export const SoilMoistureCard: React.FC<SoilMoistureCardProps> = ({ readings }) => {
	return (
		<div className="bg-brand-card rounded-2xl border border-stone-200/60 p-6 h-full">
			<h3 className="font-serif text-xl font-bold text-stone-900 mb-4">Soil Moisture</h3>
			<div className="grid grid-cols-2 gap-3">
				{readings.map((r) => {
					const c = STATUS_CLASSES[r.status];
					return (
						<div key={r.farmId} className={`rounded-xl p-4 border ${c.tile}`}>
							<p className={`text-sm font-medium mb-1 ${r.status === "dry" ? "text-rose-600" : "text-stone-900"}`}>
								{r.farmName}
							</p>
							<p className={`text-3xl font-bold font-serif ${c.value}`}>{r.moisturePercent}%</p>
							<span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${c.badge}`}>
								{STATUS_LABEL[r.status]}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SoilMoistureCard;
