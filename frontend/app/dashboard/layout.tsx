/*
 * ============================================================================
 * app/dashboard/layout.tsx — DASHBOARD LAYOUT (Authenticated areas)
 * Component: Person C (Frontend Developer)
 *
 * Wraps all /dashboard/* routes. This is the app shell.
 *
 * WHAT NEEDS TO BE DONE:
 * 1. Protect the route: redirect to /auth/login if user is not authenticated
 *    (use hooks/useAuth.ts).
 * 2. Render the persistent <Sidebar/> (Feature 9.1–9.11).
 * 3. Render the <Header/> with user info, offline indicator, sync, bells
 *    (Feature 10.1–10.8).
 * 4. Provide the <main> children outlet for the routed page.
 * 5. Make it responsive: collapsible sidebar on mobile (Feature 9.10).
 *
 * Feature references: 9.1–9.11, 10.1–10.8, 12.1 (realtime), 11.x (offline).
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

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* TEMP placeholder sidebar — Person C owns the real Sidebar.tsx (Feature 9.x) */}
			<aside className="w-60 shrink-0 bg-white border-r border-gray-200 flex flex-col">
				<div className="px-4 py-5 border-b border-gray-200">
					<span className="text-lg font-bold text-primary">KijaniFarmer</span>
				</div>
				<nav className="flex-1 px-2 py-4 space-y-1">
					{NAV_LINKS.map((link) => {
						const active = pathname === link.href;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={`block px-3 py-2 rounded text-sm font-medium ${
									active
										? "bg-green-100 text-primary"
										: "text-gray-600 hover:bg-gray-100"
								}`}
							>
								{link.label}
							</Link>
						);
					})}
				</nav>
			</aside>

			<div className="flex-1 flex flex-col min-w-0">
				{/* TEMP placeholder header — Person C owns the real Header.tsx (Feature 10.x) */}
				<header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
					<span className="text-sm font-medium text-gray-700">Dashboard</span>
					<span className="text-xs text-gray-400">Offline indicator / bell / avatar go here</span>
				</header>

				<main className="flex-1">{children}</main>
			</div>
		</div>
	);
}