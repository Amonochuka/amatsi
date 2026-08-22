"use client";

/*
 * components/dashboard/TankLevelCard.tsx — TANK LEVEL CARD (Feature 3.18-3.19)
 * Current L / capacity L, progress bar, inflow rate, est. full/empty time.
 * Below 500L the AI recommends CONSERVE — surfaced via warning.
 */
import React from "react";
import { Droplet } from "lucide-react";
import type { TankLevel } from "@/types";
import { formatLiters } from "@/lib/utils/formatNumber";

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
		<div className="bg-brand-card rounded-2xl border border-stone-200/60 p-6">
			<div className="flex items-center justify-between mb-1">
				<div className="flex items-center gap-2">
					<Droplet className="w-4 h-4 text-emerald-800" />
					<h3 className="font-serif text-xl font-bold text-stone-900">Main Reservoir</h3>
				</div>
				{isFilling && (
					<span className="text-[11px] font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
						Filling
					</span>
				)}
			</div>
			<p className="text-xs text-stone-500 mb-6">{farmName}</p>

			<div className="flex items-end gap-6">
				<div className="flex-1">
					<div className="h-40 w-full rounded-xl bg-stone-200/60 border border-stone-200/60 overflow-hidden flex items-end">
						<div
							className="w-full bg-emerald-200 border-t-2 border-emerald-400"
							style={{ height: `${pct}%` }}
						/>
					</div>
				</div>
				<div className="pb-2">
					<p className="text-4xl font-bold font-serif text-stone-900">{pct}%</p>
					<p className="text-sm text-stone-500 mt-1">
						{tank.currentL.toLocaleString()} / {tank.capacityL.toLocaleString()} L
					</p>
					<dl className="mt-4 space-y-1 text-sm font-mono">
						{tank.inflowRateLPerMin != null && (
							<div className="flex justify-between gap-6">
								<dt className="text-stone-500">Inflow Rate</dt>
								<dd className="font-semibold text-stone-900">{tank.inflowRateLPerMin} L/min</dd>
							</div>
						)}
						{tank.estFullMinutes != null && (
							<div className="flex justify-between gap-6">
								<dt className="text-stone-500">Est. Full</dt>
								<dd className="font-semibold text-stone-900">
									{Math.floor(tank.estFullMinutes / 60)}h {tank.estFullMinutes % 60}m
								</dd>
							</div>
						)}
					</dl>
				</div>
			</div>

			{isLow && (
				<p className="mt-4 text-sm text-rose-600 font-medium">
					Tank level below {formatLiters(CONSERVE_THRESHOLD_L)} — CONSERVE recommended.
				</p>
			)}
		</div>
	);
};

export default TankLevelCard;
