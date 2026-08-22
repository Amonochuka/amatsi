"use client";

/*
 * components/dashboard/RecentAlerts.tsx — RECENT ALERTS
 * Prop-driven Recent Alerts list with a mock-data fallback so the component
 * can be developed independently of the backend client.
 */
import React from "react";
import Link from "next/link";

type AlertStatus = "delivered" | "pending" | "failed";

type Alert = {
	id: string;
	message: string;
	timestamp: string; // ISO date
	status: AlertStatus;
};

interface RecentAlertsProps {
	alerts?: Alert[];
	limit?: number;
}

const mockAlerts = (): Alert[] => {
	const now = Date.now();
	return [
		{
			id: "a1",
			message: "Irrigation recommended for Farm A — expect rain tomorrow.",
			timestamp: new Date(now - 1000 * 60 * 60).toISOString(),
			status: "delivered",
		},
		{
			id: "a2",
			message: "Low tank level detected on Farm B.",
			timestamp: new Date(now - 1000 * 60 * 60 * 6).toISOString(),
			status: "pending",
		},
		{
			id: "a3",
			message: "SMS to +2547xxxxxxx failed to deliver.",
			timestamp: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
			status: "failed",
		},
	];
};

const STATUS_CLASSES: Record<AlertStatus, string> = {
	delivered: "text-emerald-700",
	pending: "text-amber-600",
	failed: "text-rose-600",
};

const timeAgo = (iso: string) => {
	const diff = Date.now() - new Date(iso).getTime();
	const hrs = Math.floor(diff / (1000 * 60 * 60));
	if (hrs < 1) return "just now";
	if (hrs < 24) return `${hrs}h`;
	return `${Math.floor(hrs / 24)}d`;
};

const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts, limit = 3 }) => {
	const list = (alerts ?? mockAlerts()).slice(0, limit);

	return (
		<div className="bg-brand-card rounded-2xl border border-stone-200/60 p-6 h-full">
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-serif text-xl font-bold text-stone-900">Recent Alerts</h3>
				<Link href="/dashboard/alerts" className="text-xs font-mono text-emerald-800 hover:underline">
					View all
				</Link>
			</div>
			<ul className="space-y-3">
				{list.map((a) => (
					<li key={a.id} className="flex items-start gap-3">
						<span className={`text-xs font-mono mt-0.5 ${STATUS_CLASSES[a.status]}`}>
							{a.status === "delivered" ? "OK" : a.status === "pending" ? "..." : "X"}
						</span>
						<div className="flex-1 min-w-0">
							<p className="text-sm text-stone-900">{a.message}</p>
							<p className="text-xs text-stone-500 mt-0.5">{timeAgo(a.timestamp)}</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default RecentAlerts;
