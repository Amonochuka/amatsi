"use client";

/*
 * components/dashboard/RecommendationCard.tsx — MAIN RECOMMENDATION CARD
 * Feature 3.6-3.12 + 13.1-13.6, 13.10, 13.15.
 * Color coding: WAIT = green, IRRIGATE = urgent (dark accent + orange CTA),
 * MONITOR = amber, CONSERVE = blue.
 */
import React, { useState } from "react";
import { Droplet } from "lucide-react";
import type { Recommendation } from "@/types";
import { formatLiters } from "@/lib/utils/formatNumber";

interface RecommendationCardProps {
	recommendation: Recommendation;
	recipientCount?: number;
	smsCreditsRemaining?: number;
	onSendSMS?: () => void;
}

const ACTION_STYLES: Record<Recommendation["action"], { badge: string; cta: string }> = {
	IRRIGATE: { badge: "bg-white/15 text-white", cta: "bg-brand-orange hover:bg-orange-500" },
	WAIT: { badge: "bg-emerald-100 text-emerald-800", cta: "bg-emerald-900 hover:bg-emerald-800" },
	MONITOR: { badge: "bg-amber-100 text-amber-700", cta: "bg-amber-600 hover:bg-amber-700" },
	CONSERVE: { badge: "bg-sky-100 text-sky-700", cta: "bg-sky-600 hover:bg-sky-700" },
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
	recommendation,
	recipientCount = 2,
	smsCreditsRemaining,
	onSendSMS,
}) => {
	const [sent, setSent] = useState(false);
	const [showRecipients, setShowRecipients] = useState(false);
	const styles = ACTION_STYLES[recommendation.action];

	const handleSend = () => {
		onSendSMS?.();
		setSent(true);
	};

	return (
		<div className="rounded-2xl p-6 h-full flex flex-col bg-brand-accent text-white">
			<div className="flex items-center gap-2 mb-3">
				<span className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider ${styles.badge}`}>
					{recommendation.action}
				</span>
			</div>
			<h3 className="font-serif text-xl font-bold mb-2">
				{recommendation.action === "IRRIGATE" ? "Action Required" : "Recommendation"}
			</h3>
			<p className="text-sm text-emerald-100/80 flex-1">{recommendation.reason}</p>

			<div className="mt-6 grid grid-cols-2 gap-3">
				<div className="bg-emerald-900/60 border border-emerald-700/50 rounded-xl p-3">
					<p className="text-[11px] text-emerald-200 uppercase font-mono tracking-wider">Target Volume</p>
					<p className="text-2xl font-bold font-serif">{recommendation.volumeL.toLocaleString()} L</p>
				</div>
				<div className="bg-emerald-900/60 border border-emerald-700/50 rounded-xl p-3">
					<p className="text-[11px] text-emerald-200 uppercase font-mono tracking-wider">Water Saved</p>
					<p className="text-2xl font-bold font-serif">{formatLiters(recommendation.waterSavedL)}</p>
				</div>
			</div>

			<p className="mt-3 text-xs font-mono text-emerald-200/70">
				Confidence: {recommendation.confidence}
			</p>

			<button
				onClick={handleSend}
				disabled={sent}
				className={`mt-4 w-full rounded-xl py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2 ${styles.cta}`}
			>
				<Droplet className="w-4 h-4 fill-current" />
				{sent ? "SMS Sent" : "Irrigate Now — Send SMS"}
			</button>

			<button
				onClick={() => setShowRecipients((s) => !s)}
				className="mt-2 text-xs font-mono text-emerald-200/60 hover:text-white underline text-left"
			>
				{recipientCount} phone{recipientCount !== 1 ? "s" : ""} will receive this alert
			</button>
			{showRecipients && (
				<p className="mt-1 text-xs text-emerald-100/50">
					Sends to all registered phones for this farm (Primary + Worker/Spouse labels).
				</p>
			)}
			{smsCreditsRemaining != null && (
				<p className="mt-2 text-[11px] font-mono text-emerald-100/40">
					SMS credits remaining: {smsCreditsRemaining}
				</p>
			)}
		</div>
	);
};

export default RecommendationCard;
