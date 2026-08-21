/*
 * ============================================================================
 * components/ui/Header.tsx — GLOBAL HEADER
 * Component: Person C (Frontend Developer)
 *
 * Top bar shown on dashboard pages.
 *
 * WHAT NEEDS TO BE DONE (Feature 10.x — Header / Global Elements):
 * 10.1 Offline Indicator     — Red dot / banner when app is offline (useOffline)
 * 10.2 Last Synced Time      — "Last synced: 2 min ago"
 * 10.3 Language Selector     — Quick switch English | Kiswahili | Luo (14.1)
 * 10.4 Notifications Bell    — Shows a bell icon (Feature 12.4 badge updates)
 * 10.5 Notification Count    — Badge with number of unread recommendations
 * 10.6 User Avatar           — Profile picture or initials
 * 10.7 User Name             — Farmer name from useAuth
 * 10.8 Sync Button           — Manual sync button (triggers API re-fetch)
 *
 * Feature references: 10.1–10.8, 11.3 (last synced), 11.7 (manual sync), 14.1.
 * ============================================================================
 */

"use client";

import React from "react";

interface HeaderProps {
	title?: string;
	subtitle?: string;
	isOffline?: boolean;
	lastSynced?: string;
	unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
	title = "Dashboard",
	isOffline = false,
	lastSynced,
	unreadCount = 0,
}) => {
	return (
		<header className="h-16 bg-canvas border-b border-border flex items-center justify-between px-8">
			<div className="flex-1 max-w-md">
				<input
					type="text"
					placeholder="Search fields, reports..."
					className="w-full rounded-full border border-border bg-white px-4 py-2 text-sm font-mono placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
				/>
			</div>

			<div className="flex items-center gap-4">
				<span
					className={`label-mono px-3 py-1.5 rounded-full border ${
						isOffline
							? "border-dry-text/30 text-dry-text bg-dry-bg"
							: "border-border text-secondary bg-white"
					}`}
				>
					{isOffline ? "Offline Mode" : lastSynced ? `Synced ${lastSynced}` : "Online"}
				</span>

				<button className="relative h-9 w-9 rounded-full border border-border bg-white flex items-center justify-center">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
						<path d="M13.73 21a2 2 0 0 1-3.46 0" />
					</svg>
					{unreadCount > 0 && (
						<span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-dry-text text-white text-[10px] flex items-center justify-center">
							{unreadCount}
						</span>
					)}
				</button>

				<div className="h-9 w-9 rounded-full bg-secondary/30" />
			</div>
		</header>
	);
};

export default Header;
