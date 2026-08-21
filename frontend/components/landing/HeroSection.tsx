/*
 * ============================================================================
 * components/landing/HeroSection.tsx — LANDING HERO (Feature 1.1)
 * Component: Person C (Frontend Developer)
 *
 * WHAT NEEDS TO BE DONE:
 * 1.1 Hero Section — Tagline: "AI-Powered Farming for Water Security"
 *   - Background image: /public/images/hero-bg.jpg
 *   - Headline + short subheadline
 *   - CTA button → "Get Started Free" (links to /auth/signup) (Feature 1.6)
 *   - Secondary CTA → "Learn More" (anchors to solution section)
 *   - Optional: quick stats strip (e.g., "2,450L saved").
 *
 * Feature references: 1.1, 1.6.
 * ============================================================================
 */

import React from "react";
import Link from "next/link";

const QUICK_STATS = [
	{ value: "2,450L", label: "water saved / farm / month" },
	{ value: "KES 3,100", label: "saved on pumping costs" },
	{ value: "< 30s", label: "from data to advice" },
];

export const HeroSection: React.FC = () => {
	return (
		<section className="relative overflow-hidden">
			{/* Background image with dark overlay for text contrast */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
				aria-hidden="true"
			/>
			<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70" aria-hidden="true" />

			<div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-28 md:py-36 text-center text-white">
				<p className="label-mono !text-white/70 mb-4">Smart irrigation · Built for East Africa</p>
				<h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight max-w-3xl mx-auto">
					AI-Powered Farming for Water Security
				</h1>
				<p className="mt-5 text-base md:text-lg text-white/80 max-w-xl mx-auto">
					KijaniFarmer combines satellite weather and soil moisture data to tell you exactly
					when to irrigate, when to wait — and how much water you save.
				</p>

				<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
					<Link
						href="/auth/signup"
						className="w-full sm:w-auto rounded-lg bg-primary px-8 py-3 text-sm font-mono uppercase tracking-wide text-white hover:bg-primary-dark transition-colors"
					>
						Get Started Free
					</Link>
					<a
						href="#solution"
						className="w-full sm:w-auto rounded-lg border border-white/40 px-8 py-3 text-sm font-mono uppercase tracking-wide text-white hover:bg-white/10 transition-colors"
					>
						Learn More
					</a>
				</div>

				{/* Quick stats strip */}
				<div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
					{QUICK_STATS.map((stat) => (
						<div key={stat.label} className="rounded-xl bg-white/10 backdrop-blur px-4 py-3">
							<p className="font-serif text-xl font-bold">{stat.value}</p>
							<p className="text-xs font-mono text-white/60 mt-0.5">{stat.label}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
