/*
 * ============================================================================
 * components/ui/Footer.tsx — FOOTER
 * Component: Person C (Frontend Developer)
 *
 * Public landing page footer.
 *
 * WHAT NEEDS TO BE DONE (Feature 1.7 — Footer):
 * - Copyright line (e.g., "© 2026 KijaniFarmer")
 * - Link columns: Product, Resources, Legal
 * - Contact / support link (Feature 8.12 support contact)
 * - Attribution to data sources: KijaniBox, Africa's Talking (Feature 8.15)
 *
 * Feature references: 1.7, 8.12, 8.15.
 * ============================================================================
 */

import React from "react";
import Link from "next/link";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
	{
		title: "Product",
		links: [
			{ label: "How it works", href: "/#how-it-works" },
			{ label: "Solution", href: "/#solution" },
			{ label: "Pricing", href: "/#pricing" },
			{ label: "Get started", href: "/auth/signup" },
		],
	},
	{
		title: "Resources",
		links: [
			{ label: "FAQ", href: "/#faq" },
			{ label: "Crop planner", href: "/dashboard/planner" },
			{ label: "Support", href: "mailto:support@kijanifarmer.app" },
		],
	},
	{
		title: "Legal",
		links: [
			{ label: "Privacy policy", href: "/#privacy" },
			{ label: "Terms of service", href: "/#terms" },
		],
	},
];

export const Footer: React.FC = () => {
	return (
		<footer className="bg-sidebar text-white mt-auto">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
				<div className="col-span-2 md:col-span-1">
					<p className="font-serif text-xl font-bold">KijaniFarmer</p>
					<p className="mt-2 text-sm text-white/60">
						AI-powered farming for water security.
					</p>
				</div>

				{COLUMNS.map((column) => (
					<div key={column.title}>
						<p className="label-mono !text-white/50 mb-3">{column.title}</p>
						<ul className="space-y-2">
							{column.links.map((link) => (
								<li key={link.label}>
									{link.href.startsWith("/") ? (
										<Link
											href={link.href}
											className="text-sm text-white/70 hover:text-white transition-colors"
										>
											{link.label}
										</Link>
									) : (
										<a
											href={link.href}
											className="text-sm text-white/70 hover:text-white transition-colors"
										>
											{link.label}
										</a>
									)}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>

			<div className="border-t border-white/10">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
					<p className="text-xs font-mono text-white/50">
						© {new Date().getFullYear()} KijaniFarmer. All rights reserved.
					</p>
					{/* Feature 8.15 — data source attribution */}
					<p className="text-xs font-mono text-white/40">
						Data: KijaniBox satellite weather &amp; soil · SMS by Africa&apos;s Talking
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
