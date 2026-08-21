/*
 * ============================================================================
 * app/dashboard/irrigation/page.tsx — IRRIGATION ADVISOR
 * Component: Person E (Frontend Developer)
 *
 * Dedicated page for generating and reviewing irrigation recommendations.
 *
 * WHAT NEEDS TO BE DONE (Feature 4.x — Irrigation Advisor):
 * 4.1  Generate Recommendation Button — POST /api/recommendations/generate
 *                                       (updates current recommendation)
 * 4.2  Current Recommendation Display — Show current recommendation w/ details
 * 4.3  Recommendation Reason          — Full explanation with data points
 * 4.4  Water Saved Estimate           — Liters saved by following advice
 * 4.5  Send SMS Button                — Send to all registered phones
 * 4.6  SMS Recipients List            — Expandable list of who gets the SMS
 * 4.7  Recommendation History         — List of all past recommendations
 * 4.8  History Filters                — Filter by date, action type, farm
 * 4.9  Recommendation Details         — Expand each history item for full detail
 * 4.10 Total Water Saved              — Cumulative saved (all recommendations)
 * 4.11 Success Rate                   — % of recommendations marked as followed
 *
 * Implementation notes:
 * - Reuse <RecommendationCard/> for the "current" recommendation.
 * - Calling generate also triggers realtime/refresh of dashboard (Feature 12.x).
 * - Loading spinner while generating (Feature 19.8), toast on success/error.
 *
 * Feature references: 4.1–4.11, 13.x (SMS), 15.1, 15.6, 19.8.
 * ============================================================================
 */

"use client";

import React, { useMemo, useState } from "react";
import RecommendationCard from "../../../components/dashboard/RecommendationCard";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { formatLiters } from "../../../lib/utils/formatNumber";
import { formatDate } from "../../../lib/utils/formatDate";
import { mockRecommendation } from "../../../lib/mock/data";
import type { Farm, Recommendation, RecommendationAction } from "../../../types";

const ACTIONS: Array<{ value: string; label: string }> = [
	{ value: "", label: "All actions" },
	{ value: "IRRIGATE", label: "IRRIGATE" },
	{ value: "WAIT", label: "WAIT" },
	{ value: "MONITOR", label: "MONITOR" },
	{ value: "CONSERVE", label: "CONSERVE" },
];

const FARMS: Array<{ value: string; label: string }> = [
	{ value: "", label: "All farms" },
	{ value: "farm-1", label: "Field A" },
	{ value: "farm-2", label: "Field B" },
];

/** Mock history until lib/api/client.ts is wired to the Go API. */
const seedHistory = (): Recommendation[] => {
	const base = new Date();
	return [
		mockRecommendation(),
		{
			id: "rec-2",
			farmId: "farm-1",
			action: "WAIT",
			reason: "78% chance of rain in the next 24 hours. Delaying irrigation saves pumped water.",
			volumeL: 0,
			waterSavedL: 1250,
			confidence: "High",
			createdAt: new Date(base.getTime() - 26 * 3600_000).toISOString(),
			read: true,
		},
		{
			id: "rec-3",
			farmId: "farm-2",
			action: "MONITOR",
			reason: "Soil moisture at 47% is within the healthy band. Re-check tomorrow morning.",
			volumeL: 0,
			waterSavedL: 0,
			confidence: "Medium",
			createdAt: new Date(base.getTime() - 50 * 3600_000).toISOString(),
			read: true,
		},
	];
};

export default function IrrigationPage() {
	const [current, setCurrent] = useState<Recommendation>(mockRecommendation); // 4.2
	const [history, setHistory] = useState<Recommendation[]>(seedHistory); // 4.7
	const [generating, setGenerating] = useState(false);
	const [smsSent, setSmsSent] = useState(false);
	const [showRecipients, setShowRecipients] = useState(false); // 4.6
	const [expandedId, setExpandedId] = useState<string | null>(null); // 4.9

	// 4.8 — filters
	const [actionFilter, setActionFilter] = useState("");
	const [farmFilter, setFarmFilter] = useState("");
	const [dateFilter, setDateFilter] = useState("");

	const filteredHistory = useMemo(
		() =>
			history.filter((rec) => {
				if (actionFilter && rec.action !== actionFilter) return false;
				if (farmFilter && rec.farmId !== farmFilter) return false;
				if (dateFilter && !rec.createdAt.startsWith(dateFilter)) return false;
				return true;
			}),
		[history, actionFilter, farmFilter, dateFilter]
	);

	// 4.10 / 4.11 — cumulative stats
	const totalWaterSaved = history.reduce((sum, rec) => sum + rec.waterSavedL, 0);
	const followedCount = history.filter((rec) => rec.read).length;
	const successRate = history.length ? Math.round((followedCount / history.length) * 100) : 0;

	// 4.1 — generate a fresh recommendation.
	const handleGenerate = async () => {
		setGenerating(true);
		try {
			// TODO(Person E): swap for generateRecommendation(farm.id) from lib/api/client.ts
			await new Promise((resolve) => setTimeout(resolve, 900));
			const fresh = mockRecommendation();
			setCurrent(fresh);
			setHistory((prev) => [fresh, ...prev]);
			setSmsSent(false);
		} finally {
			setGenerating(false);
		}
	};

	// 4.5 — send current advice as SMS to all registered phones.
	const handleSendSMS = async () => {
		// TODO(Person E): swap for sendSMS(farm.id) from lib/api/client.ts
		await new Promise((resolve) => setTimeout(resolve, 500));
	};

	return (
		<div>
			<h1 className="font-serif text-4xl font-bold">Irrigation Advisor</h1>
			<p className="text-secondary mt-2 mb-8">
				Today&apos;s AI recommendation, plus every recommendation we&apos;ve made.
			</p>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* 4.2–4.6 — current recommendation */}
				<div className="lg:col-span-1">
					<RecommendationCard
						recommendation={current}
						recipientCount={2}
						smsCreditsRemaining={38}
						onSendSMS={handleSendSMS}
					/>
					<button
						onClick={() => setShowRecipients((s) => !s)}
						className="mt-2 text-xs font-mono text-secondary hover:text-primary underline text-left"
					>
						{showRecipients ? "Hide recipients" : "Who receives this SMS?"}
					</button>
					{showRecipients && (
						<ul className="mt-2 space-y-1 text-xs font-mono text-secondary">
							<li>+254712****78 — Primary (you)</li>
							<li>+254733****10 — Worker</li>
						</ul>
					)}
					{smsSent && (
						<p className="mt-2 rounded-lg bg-optimal-bg text-optimal-text text-sm px-3 py-2">
							SMS sent to all registered phones.
						</p>
					)}
				</div>

				<div className="lg:col-span-2 space-y-6">
					{/* 4.1 — generate */}
					<div className="rounded-2xl border border-border bg-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
						<div>
							<h3 className="font-serif text-xl font-bold">Need fresh advice?</h3>
							<p className="text-sm text-secondary mt-1">
								Re-run the AI on the latest weather and soil data.
							</p>
						</div>
						<Button onClick={handleGenerate} loading={generating}>
							{generating ? "Analyzing..." : "Generate Recommendation"}
						</Button>
					</div>

					{/* 4.10 / 4.11 — season stats */}
					<div className="grid grid-cols-2 gap-6">
						<div className="rounded-2xl border border-border bg-white p-6">
							<p className="label-mono">Total water saved</p>
							<p className="font-serif text-3xl font-bold mt-2 text-primary">
								{formatLiters(totalWaterSaved)}
							</p>
						</div>
						<div className="rounded-2xl border border-border bg-white p-6">
							<p className="label-mono">Advice followed</p>
							<p className="font-serif text-3xl font-bold mt-2">{successRate}%</p>
						</div>
					</div>

					{/* 4.7 / 4.8 — history + filters */}
					<div className="rounded-2xl border border-border bg-white p-6">
						<h3 className="font-serif text-xl font-bold mb-4">Recommendation history</h3>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
							<Input
								label="Action"
								type="select"
								options={ACTIONS}
								value={actionFilter}
								onChange={(e) => setActionFilter(e.target.value)}
							/>
							<Input
								label="Farm"
								type="select"
								options={FARMS}
								value={farmFilter}
								onChange={(e) => setFarmFilter(e.target.value)}
							/>
							<Input
								label="Date"
								type="date"
								value={dateFilter}
								onChange={(e) => setDateFilter(e.target.value)}
							/>
						</div>

						{generating && <LoadingSpinner center size="sm" />}

						<ul className="divide-y divide-border">
							{filteredHistory.map((rec) => {
								const expanded = expandedId === rec.id;
								return (
									<li key={rec.id} className="py-3">
										<button
											onClick={() => setExpandedId(expanded ? null : rec.id)}
											className="w-full flex items-center justify-between gap-3 text-left"
											aria-expanded={expanded}
										>
											<div className="flex items-center gap-3 min-w-0">
												<span
													className={`label-mono px-2 py-1 rounded-full shrink-0 ${
														rec.action === ("IRRIGATE" as RecommendationAction)
															? "bg-dry-bg text-dry-text"
															: rec.action === "WAIT"
																? "bg-optimal-bg text-optimal-text"
																: "bg-caution-bg text-caution-text"
													}`}
												>
													{rec.action}
												</span>
												<span className="text-sm truncate">{rec.reason}</span>
											</div>
											<span className="text-xs font-mono text-secondary shrink-0">
												{formatDate(rec.createdAt)}
											</span>
										</button>

										{/* 4.9 — expandable details */}
										{expanded && (
											<dl className="mt-3 ml-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
												<div>
													<dt className="label-mono">Target volume</dt>
													<dd>{formatLiters(rec.volumeL)}</dd>
												</div>
												<div>
													<dt className="label-mono">Water saved</dt>
													<dd>{formatLiters(rec.waterSavedL)}</dd>
												</div>
												<div>
													<dt className="label-mono">Confidence</dt>
													<dd>{rec.confidence}</dd>
												</div>
												<div>
													<dt className="label-mono">Farm</dt>
													<dd>{FARMS.find((f) => f.value === rec.farmId)?.label ?? rec.farmId}</dd>
												</div>
											</dl>
										)}
									</li>
								);
							})}
						</ul>

						{filteredHistory.length === 0 && (
							<p className="py-6 text-center text-sm text-secondary">
								No recommendations match these filters.
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
