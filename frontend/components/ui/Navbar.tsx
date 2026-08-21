/*
 * ============================================================================
 * components/ui/Navbar.tsx — NAVBAR
 * Component: Person C / Person E (Frontend)
 *
 * The public/marketing navbar (for the landing page) OR an alternative
 * top navigation for the dashboard. Decide a role with Person C.
 *
 * WHAT NEEDS TO BE DONE:
 * - Logo (public/images/logo.png) linking to "/"
 * - Nav links: How it works, Solution, Tech Stack, FAQ
 * - CTA: "Login" / "Get Started" (→ /auth/login, /auth/signup)
 * - Mobile hamburger menu (collapsible, Feature 9.10 style)
 *
 * Feature references: 1.7 (links), 9.10 (collapsible mobile menu).
 * ============================================================================
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";

const LINKS = [
	{ label: "How it works", href: "/#how-it-works" },
	{ label: "Solution", href: "/#solution" },
	{ label: "Tech Stack", href: "/#tech-stack" },
	{ label: "FAQ", href: "/#faq" },
];

export const Navbar: React.FC = () => {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 bg-canvas/90 backdrop-blur border-b border-border">
			<nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
				<Link href="/" className="flex items-center gap-2">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src="/images/logo.png" alt="KijaniFarmer logo" className="h-8 w-8 rounded" />
					<span className="font-serif text-xl font-bold text-primary">KijaniFarmer</span>
				</Link>

				<div className="hidden md:flex items-center gap-6">
					{LINKS.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="text-sm font-mono text-secondary hover:text-primary transition-colors"
						>
							{link.label}
						</a>
					))}
				</div>

				<div className="hidden md:flex items-center gap-3">
					<Link
						href="/auth/login"
						className="text-sm font-mono text-ink hover:text-primary transition-colors"
					>
						Login
					</Link>
					<Link
						href="/auth/signup"
						className="rounded-lg bg-primary px-4 py-2 text-sm font-mono uppercase tracking-wide text-white hover:bg-primary-dark transition-colors"
					>
						Get Started
					</Link>
				</div>

				{/* Feature 9.10-style collapsible mobile menu */}
				<button
					type="button"
					aria-label="Toggle menu"
					aria-expanded={open}
					onClick={() => setOpen((o) => !o)}
					className="md:hidden p-2 rounded-lg hover:bg-white"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						{open ? (
							<path d="M18 6 6 18M6 6l12 12" />
						) : (
							<path d="M3 6h18M3 12h18M3 18h18" />
						)}
					</svg>
				</button>
			</nav>

			{open && (
				<div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-2">
					{LINKS.map((link) => (
						<a
							key={link.href}
							href={link.href}
							onClick={() => setOpen(false)}
							className="block py-2 text-sm font-mono text-secondary hover:text-primary"
						>
							{link.label}
						</a>
					))}
					<div className="pt-2 flex gap-3">
						<Link
							href="/auth/login"
							className="flex-1 text-center rounded-lg border border-border px-4 py-2 text-sm font-mono"
						>
							Login
						</Link>
						<Link
							href="/auth/signup"
							className="flex-1 text-center rounded-lg bg-primary px-4 py-2 text-sm font-mono uppercase tracking-wide text-white"
						>
							Get Started
						</Link>
					</div>
				</div>
			)}
		</header>
	);
};

export default Navbar;
