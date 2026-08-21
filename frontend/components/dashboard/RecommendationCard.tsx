/*
 * ============================================================================
 * components/dashboard/RecommendationCard.tsx — MAIN RECOMMENDATION CARD
 * Component: Person C (Frontend Developer) — core
 *            Person D (AI) — recommendation payload shape
 *
 * The single most important element of the product. Shows the farmer
 * what to do TODAY.
 *
 * WHAT NEEDS TO BE DONE (Feature 3.x + 13.x + 4.x):
 * 3.6  Recommendation Card      — Main display
 * 3.7  Recommendation Action    — IRRIGATE / WAIT / MONITOR / CONSERVE
 *                               - Color coding: e.g. WAIT = green, IRRIGATE = red,
 *                                 MONITOR = amber, CONSERVE = blue
 * 3.8  Recommendation Reason    — WHY (e.g., "78% chance of rain in 24h")
 * 3.9  Water Saved by Action    — Liters saved by following (e.g. "450L")
 * 3.10 Confidence Level         — High / Medium / Low badge
 * 3.11 Send SMS Button          — Triggers POST /api/alerts/send (Feature 13.1)
 * 3.12 SMS Recipients Count     — How many phones will receive the SMS
 *
 * SMS details:
 * 13.2–13.5 Templates           — Message per language (English/Kiswahili/Luo)
 * 13.6  Multi-Phone Support     — Send to ALL registered phones
 * 13.10 SMS Recipient List      — Optionally show who receives it (expandable)
 * 13.15 SMS Credit Balance      — Show remaining Africa's Talking credits
 *
 * Implementation notes:
 * - Fetch latest recommendation via lib/api/client.ts getRecommendations().
 * - When offline, fall back to cached recommendation (Feature 11.4).
 * - Toast/success feedback after sending SMS (Feature 12.3).
 *
 * Feature references: 3.6–3.12, 13.1–13.6, 13.10, 13.15, 11.4.
 * ============================================================================
 */

"use client";

/*
 * components/dashboard/RecommendationCard.tsx — MAIN RECOMMENDATION CARD
 * Feature 3.6-3.12 + 13.1-13.6, 13.10, 13.15.
 * Color coding: WAIT = green, IRRIGATE = red/urgent, MONITOR = amber,
 * CONSERVE = blue. Reference design uses a dark "Action Required" treatment
 * for the urgent IRRIGATE state specifically.
 */
import React, { useState } from "react";
import type { Recommendation } from "../../types";
import { formatLiters } from "../../lib/utils/formatNumber";

interface RecommendationCardProps {
	recommendation: Recommendation;
	recipientCount?: number;
	smsCreditsRemaining?: number;
	onSendSMS?: () => void;
}

const ACTION_STYLES: Record<Recommendation["action"], { badge: string; cta: string }> = {
	IRRIGATE: { badge: "bg-white/15 text-white", cta: "bg-orange-500 hover:bg-orange-600" },
	WAIT: { badge: "bg-optimal-bg text-optimal-text", cta: "bg-primary hover:bg-primary-dark" },
	MONITOR: { badge: "bg-caution-bg text-caution-text", cta: "bg-caution-text hover:opacity-90" },
	CONSERVE: { badge: "bg-blue-100 text-blue-700", cta: "bg-blue-600 hover:bg-blue-700" },
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
		<div className="rounded-2xl p-6 h-full flex flex-col bg-primary-dark text-white">
			<div className="flex items-center gap-2 mb-3">
				<span className={`label-mono px-3 py-1 rounded-full ${styles.badge}`}>
					{recommendation.action}
				</span>
			</div>
			<h3 className="font-serif text-xl font-bold mb-2">
				{recommendation.action === "IRRIGATE" ? "Action Required" : "Recommendation"}
			</h3>
			<p className="text-sm text-white/80 flex-1">{recommendation.reason}</p>

			<div className="mt-6 grid grid-cols-2 gap-3">
				<div className="bg-white/10 rounded-lg p-3">
					<p className="label-mono text-white/60">Target Volume</p>
					<p className="text-2xl font-bold font-serif">{recommendation.volumeL.toLocaleString()} L</p>
				</div>
				<div className="bg-white/10 rounded-lg p-3">
					<p className="label-mono text-white/60">Water Saved</p>
					<p className="text-2xl font-bold font-serif">{formatLiters(recommendation.waterSavedL)}</p>
				</div>
			</div>

			<p className="mt-3 text-xs font-mono text-white/60">
				Confidence: {recommendation.confidence}
			</p>

			<button
				onClick={handleSend}
				disabled={sent}
				className="mt-4 w-full rounded-lg py-3 text-sm font-mono uppercase tracking-wide text-white transition-colors disabled:opacity-60"
				style={{ backgroundColor: sent ? "#4E3A2E" : "#E08D3C" }}
			>
				{sent ? "SMS Sent" : "Irrigate Now — Send SMS"}
			</button>

			<button
				onClick={() => setShowRecipients((s) => !s)}
				className="mt-2 text-xs font-mono text-white/60 hover:text-white underline text-left"
			>
				{recipientCount} phone{recipientCount !== 1 ? "s" : ""} will receive this alert
			</button>
			{showRecipients && (
				<p className="mt-1 text-xs text-white/50">
					Sends to all registered phones for this farm (Primary + Worker/Spouse labels).
				</p>
			)}
			{smsCreditsRemaining != null && (
				<p className="mt-2 text-[11px] font-mono text-white/40">
					SMS credits remaining: {smsCreditsRemaining}
				</p>
			)}
		</div>
	);
};

export default RecommendationCard;
