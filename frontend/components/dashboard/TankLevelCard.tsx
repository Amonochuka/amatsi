/*
 * ============================================================================
 * components/dashboard/TankLevelCard.tsx — TANK LEVEL CARD
 * Component: Person C (Frontend Developer)
 *
 * Displays farm water tank level.
 *
 * WHAT NEEDS TO BE DONE (Feature 3.18–3.19):
 * 3.18 Tank Level Card    — Water level with visual progress bar
 * 3.19 Tank Level Details — Current L / Capacity L + estimated days remaining
 *      - e.g. "320L / 1000L" + "~3 days left at current usage"
 *
 * Implementation notes:
 * - Source: manual input or sensor via KijaniBox; farm record holds capacity.
 * - Below 500L the AI recommends CONSERVE (rule engine) — surface that warning.
 * - Allow the farmer to quickly update current level if sensor-less.
 *
 * Feature references: 3.18–3.19, 6.13 (tank capacity input), 12.2 (live update).
 * ============================================================================
 */

/*
 * components/dashboard/TankLevelCard.tsx — TANK LEVEL CARD (Feature 3.18-3.19)
 * Current L / capacity L, progress bar, inflow rate, est. full/empty time.
 * Below 500L the AI recommends CONSERVE — surfaced via `warning`.
 */
import React from "react";
import type { TankLevel } from "../../types";
import { formatLiters } from "../../lib/utils/formatNumber";

interface TankLevelCardProps {
	tank: TankLevel;
	farmName?: string;
}

const CONSERVE_THRESHOLD_L = 500;

export const TankLevelCard: React.FC<TankLevelCardProps> = ({ tank, farmName = "Central Water Storage" }) => {
	const pct = Math.min(100, Math.round((tank.currentL / tank.capacityL) * 100));
	const isLow = tank.currentL < CONSERVE_THRESHOLD_L;
	const isFilling = (tank.inflowRateLPerMin ?? 0) > 0;

	return (
		<div className="bg-white rounded-2xl border border-border p-6">
			<div className="flex items-center justify-between mb-1">
				<h3 className="font-serif text-xl font-bold">Main Reservoir</h3>
				{isFilling && (
					<span className="label-mono px-3 py-1 rounded-full bg-optimal-bg text-optimal-text">
						Filling
					</span>
				)}
			</div>
			<p className="text-sm text-secondary mb-6">{farmName}</p>

			<div className="flex items-end gap-6">
				<div className="flex-1">
					<div className="h-40 w-full rounded-lg bg-canvas border border-border overflow-hidden flex items-end">
						<div
							className="w-full bg-optimal-bg/80"
							style={{ height: `${pct}%`, backgroundColor: "#B7C7A8" }}
						/>
					</div>
				</div>
				<div className="pb-2">
					<p className="text-4xl font-bold font-serif">{pct}%</p>
					<p className="text-sm text-secondary mt-1">
						{tank.currentL.toLocaleString()} / {tank.capacityL.toLocaleString()} L
					</p>
					<dl className="mt-4 space-y-1 text-sm font-mono">
						{tank.inflowRateLPerMin != null && (
							<div className="flex justify-between gap-6">
								<dt className="text-secondary">Inflow Rate</dt>
								<dd className="font-semibold">{tank.inflowRateLPerMin} L/min</dd>
							</div>
						)}
						{tank.estFullMinutes != null && (
							<div className="flex justify-between gap-6">
								<dt className="text-secondary">Est. Full</dt>
								<dd className="font-semibold">
									{Math.floor(tank.estFullMinutes / 60)}h {tank.estFullMinutes % 60}m
								</dd>
							</div>
						)}
					</dl>
				</div>
			</div>

			{isLow && (
				<p className="mt-4 text-sm text-dry-text font-medium">
					Tank level below {formatLiters(CONSERVE_THRESHOLD_L)} — CONSERVE recommended.
				</p>
			)}
		</div>
	);
};

export default TankLevelCard;
