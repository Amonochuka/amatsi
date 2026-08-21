/*
 * ============================================================================
 * components/ui/Sidebar.tsx — SIDEBAR NAVIGATION
 * Component: Person C (Frontend Developer)
 *
 * Persistent left navigation for all authenticated dashboard pages.
 *
 * WHAT NEEDS TO BE DONE (Feature 9.x — Sidebar Navigation):
 * 9.1  Dashboard Icon    — 🌾 Overview link         (/dashboard)
 * 9.2  Irrigation Icon   — 💧 Irrigation Advisor    (/dashboard/irrigation)
 * 9.3  Planner Icon      — 🌱 Crop Planner          (/dashboard/planner)
 * 9.4  Farms Icon        — 📊 My Farms              (/dashboard/farms)
 * 9.5  Alerts Icon       — 🔔 Alerts History        (/dashboard/alerts)
 * 9.6  Settings Icon     — ⚙️ Settings              (/dashboard/settings)
 * 9.7  User Avatar       — Profile picture or initials (from useAuth)
 * 9.8  User Name         — Display farmer name
 * 9.9  Logout Button     — Sign out (clears session, redirect to /auth/login)
 * 9.10 Collapsible       — Mobile-friendly collapsible/hamburger menu
 * 9.11 Offline Indicator — Show offline status when offline (useOffline)
 *
 * Active link highlighting: usePathname() to set active styles.
 *
 * Feature references: 9.1–9.11.
 * ============================================================================
 */

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
	{ href: "/dashboard", label: "Overview" },
	{ href: "/dashboard/irrigation", label: "Irrigation Advisor" },
	{ href: "/dashboard/planner", label: "Crop Planner" },
	{ href: "/dashboard/farms", label: "My Farms" },
	{ href: "/dashboard/alerts", label: "Alerts History" },
	{ href: "/dashboard/settings", label: "Settings" },
];

interface SidebarProps {
	userName?: string;
	isOffline?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ userName = "Farmer", isOffline = false }) => {
	const pathname = usePathname();

	return (
		<aside className="w-64 shrink-0 bg-sidebar text-white flex flex-col min-h-screen">
			<div className="px-6 py-6 border-b border-white/10">
				<h1 className="font-serif text-2xl font-bold leading-tight">KijaniFarmer</h1>
				<p className="label-mono text-white/50 mt-1">Smart Irrigation</p>
			</div>

			<nav className="flex-1 px-3 py-4 space-y-1">
				{NAV_LINKS.map((link) => {
					const active = pathname === link.href;
					return (
						<Link
							key={link.href}
							href={link.href}
							className={`block px-3 py-2 rounded-lg text-sm font-mono ${
								active
									? "bg-sidebar-active text-white border-l-2 border-primary"
									: "text-white/70 hover:bg-sidebar-active/60 hover:text-white"
							}`}
						>
							{link.label}
						</Link>
					);
				})}
			</nav>

			{isOffline && (
				<div className="mx-3 mb-3 px-3 py-2 rounded-lg bg-dry-text/20 text-dry-bg text-xs font-mono flex items-center gap-2">
					<span className="h-2 w-2 rounded-full bg-red-400" />
					Offline
				</div>
			)}

			<div className="px-6 py-4 border-t border-white/10 flex items-center gap-3">
				<div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-sm font-semibold">
					{userName.charAt(0).toUpperCase()}
				</div>
				<div className="min-w-0">
					<p className="text-sm truncate">{userName}</p>
					<button className="text-xs text-white/50 hover:text-white font-mono">Sign out</button>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
