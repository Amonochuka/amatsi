/*
 * ============================================================================
 * components/dashboard/RecentAlerts.tsx — RECENT ALERTS
 * Component: Person E (Frontend Developer)
 *
 * Prop-driven Recent Alerts list with a mock-data fallback so the component
 * can be developed independently of the backend client. Install and wire
 * `lib/api/client.ts#getAlertHistory` later for real data.
 * ============================================================================
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

const statusIcon = (s: AlertStatus) => {
	switch (s) {
		case "delivered":
			return "✓";
		case "pending":
			return "⏳";
		case "failed":
			return "✕";
	}
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
		<div className="w-full">
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-sm font-medium text-gray-900">Recent Alerts</h3>
				<Link href="/dashboard/alerts" className="text-xs text-blue-600">
					View all
				</Link>
			</div>
			<ul className="space-y-2">
				{list.map((a) => (
					<li key={a.id} className="flex items-start gap-3 p-2 bg-white rounded shadow-sm">
						<div className="text-lg leading-6">{statusIcon(a.status)}</div>
						<div className="flex-1">
							<div className="text-sm text-gray-800">{a.message}</div>
							<div className="text-xs text-gray-500">{timeAgo(a.timestamp)}</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default RecentAlerts;