/*
 * ============================================================================
 * components/landing/ProblemSection.tsx — LANDING PROBLEM (Feature 1.2)
 * Component: Person C (Frontend Developer)
 *
 * WHAT NEEDS TO BE DONE:
 * 1.2 Problem Section — Statistics that motivate using the platform:
 *   - "Farmers lose up to 40% of water through inefficient irrigation"
 *   - "70% of smallholders lack access to weather data"
 *   - "60% of crop losses driven by water mismanagement"
 *   - Layout: 3 stat cards with numbers + short descriptions.
 *
 * Feature references: 1.2.
 * ============================================================================
 */

import React from "react";

const STATS = [
	{
		value: "40%",
		description: "of water is lost through inefficient irrigation",
	},
	{
		value: "70%",
		description: "of smallholder farmers lack access to weather data",
	},
	{
		value: "60%",
		description: "of crop losses are driven by water mismanagement",
	},
];

export const ProblemSection: React.FC = () => {
	return (
		<section className="bg-white border-y border-border">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
				<h2 className="font-serif text-3xl md:text-4xl font-bold text-center max-w-2xl mx-auto">
					Smallholder farmers are farming blind
				</h2>
				<p className="text-secondary text-center mt-3 max-w-xl mx-auto">
					Without reliable data, every irrigation decision is a guess — and guesses waste
					water, money, and harvests.
				</p>

				<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
					{STATS.map((stat) => (
						<div
							key={stat.value}
							className="rounded-2xl border border-border bg-canvas p-8 text-center"
						>
							<p className="font-serif text-5xl font-bold text-dry-text">{stat.value}</p>
							<p className="mt-3 text-sm text-ink">{stat.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default ProblemSection;
