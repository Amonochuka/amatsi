/*
 * ============================================================================
 * components/dashboard/SoilMoistureCard.tsx — SOIL MOISTURE CARD
 * Component: Person C (Frontend Developer)
 *
 * Displays live soil moisture level for the farm.
 *
 * WHAT NEEDS TO BE DONE (Feature 3.16–3.17):
 * 3.16 Soil Moisture Card      — Moisture percentage with progress bar
 *      - Target range ~55–75% optimal
 * 3.17 Soil Status Indicator   — 🟢 Optimal / 🟡 Caution / 🔴 Dry
 *      - <30% = dry (IRRIGATE signal), 30–60% = caution, >60% = optimal
 *
 * Implementation notes:
 * - Fetch from GET /api/soil/:farmId (lib/api/client.ts getSoilMoisture()).
 * - Cache in localStorage for offline display (Feature 11.6).
 * - This drives the IRRIGATE recommendation, so keep it eye-catching.
 *
 * Feature references: 3.16–3.17, 11.6, 15.9 (soil moisture trends).
 * ============================================================================
 */

/*
 * components/dashboard/SoilMoistureCard.tsx — SOIL MOISTURE CARD
 * Feature 3.16-3.17. <30% dry (IRRIGATE signal), 30-60% caution, >60% optimal.
 * Reference design shows one tile per farm/field side by side.
 */
import React from "react";
import type { SoilMoisture, SoilStatus } from "../../types";

interface SoilMoistureCardProps {
	readings: SoilMoisture[];
}

const STATUS_LABEL: Record<SoilStatus, string> = {
	optimal: "OPTIMAL",
	caution: "CAUTION",
	dry: "LOW",
};

const STATUS_CLASSES: Record<SoilStatus, { tile: string; badge: string; value: string }> = {
	optimal: { tile: "bg-optimal-bg", badge: "bg-white text-optimal-text", value: "text-ink" },
	caution: { tile: "bg-caution-bg", badge: "bg-white text-caution-text", value: "text-ink" },
	dry: { tile: "bg-dry-bg", badge: "bg-white text-dry-text", value: "text-dry-text" },
};

export const SoilMoistureCard: React.FC<SoilMoistureCardProps> = ({ readings }) => {
	return (
		<div className="bg-white rounded-2xl border border-border p-6 h-full">
			<h3 className="font-serif text-xl font-bold mb-4">Soil Moisture</h3>
			<div className="grid grid-cols-2 gap-3">
				{readings.map((r) => {
					const c = STATUS_CLASSES[r.status];
					return (
						<div key={r.farmId} className={`rounded-xl p-4 ${c.tile}`}>
							<p className={`text-sm font-medium mb-1 ${r.status === "dry" ? "text-dry-text" : "text-ink"}`}>
								{r.farmName}
							</p>
							<p className={`text-3xl font-bold font-serif ${c.value}`}>{r.moisturePercent}%</p>
							<span className={`label-mono inline-block mt-2 px-2 py-0.5 rounded-full ${c.badge}`}>
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
