/*
 * ============================================================================
 * components/landing/SolutionSection.tsx — LANDING SOLUTION (Feature 1.3)
 * Component: Person C (Frontend Developer)
 *
 * WHAT NEEDS TO BE DONE:
 * 1.3 Solution Section — 3-step flow:
 *   1. Add Farm        → Farmer registers their farm + details
 *   2. AI Analyzes     → System combines satellite weather + soil moisture
 *   3. Get Advice      → Personalized IRRIGATE/WAIT/MONITOR/CONSERVE advice
 *   - Add a visual dashboard mockup/screenshot to illustrate the product.
 *
 * (Feature 1.4 "How It Works" = detailed explanation of this platform —
 *   can be a deeper section placed here or rendered in page.tsx.)
 *
 * Feature references: 1.3, 1.4.
 * ============================================================================
 */

import React from "react";

const STEPS = [
	{
		number: "01",
		title: "Add your farm",
		description:
			"Register your plot in under two minutes: crop, size, soil type and tank capacity.",
	},
	{
		number: "02",
		title: "AI analyzes conditions",
		description:
			"We combine KijaniBox satellite weather with live soil moisture from your farm.",
	},
	{
		number: "03",
		title: "Get clear advice",
		description:
			"A simple IRRIGATE / WAIT / MONITOR / CONSERVE recommendation — by app and SMS.",
	},
];

export const SolutionSection: React.FC = () => {
	return (
		<section id="solution" className="scroll-mt-16">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
				<h2 className="font-serif text-3xl md:text-4xl font-bold text-center">
					From data to decisions in three steps
				</h2>
				<p className="text-secondary text-center mt-3 max-w-xl mx-auto">
					No agronomy degree required. KijaniFarmer turns complex data into one clear
					instruction per day.
				</p>

				<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
					{STEPS.map((step) => (
						<div
							key={step.number}
							className="rounded-2xl border border-border bg-white p-8"
						>
							<span className="label-mono !text-primary">{step.number}</span>
							<h3 className="font-serif text-xl font-bold mt-3">{step.title}</h3>
							<p className="mt-2 text-sm text-secondary">{step.description}</p>
						</div>
					))}
				</div>

				{/* Visual dashboard mockup (CSS-only, no screenshot dependency) */}
				<div className="mt-14 rounded-2xl border border-border bg-sidebar p-6 md:p-10 overflow-hidden">
					<div className="rounded-xl bg-canvas p-6 max-w-3xl mx-auto shadow-lg">
						<div className="flex items-center justify-between mb-4">
							<p className="label-mono">Today&apos;s advice — Field A (Maize)</p>
							<span className="rounded-full bg-dry-bg px-3 py-1 text-xs font-mono uppercase tracking-wide text-dry-text">
								IRRIGATE
							</span>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="rounded-lg bg-white border border-border p-4">
								<p className="label-mono">Soil moisture</p>
								<p className="font-serif text-2xl font-bold mt-1">24%</p>
							</div>
							<div className="rounded-lg bg-white border border-border p-4">
								<p className="label-mono">Rain chance</p>
								<p className="font-serif text-2xl font-bold mt-1">15%</p>
							</div>
						</div>
						<p className="mt-4 text-sm text-secondary">
							Soil moisture is below the critical threshold for maize. Apply ~1,200 L today;
							rain is unlikely within 24 hours.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default SolutionSection;
