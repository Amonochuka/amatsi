/*
 * ============================================================================
 * components/landing/TechStackSection.tsx — LANDING TECH STACK (Feature 1.5)
 * Component: Person C (Frontend Developer)
 *
 * WHAT NEEDS TO BE DONE:
 * 1.5 Tech Stack Badges — Display the technologies powering the platform:
 *   - Golang (backend API)
 *   - Next.js (frontend)
 *   - Supabase (database + auth + realtime)
 *   - KijaniBox (satellite weather/soil data)
 *   - Africa's Talking (SMS)
 *   - (Optional: Python AI service, Redis/Asynq, TimescaleDB, Recharts, Leaflet)
 *
 * Feature references: 1.5.
 * ============================================================================
 */

import React from "react";

const CORE_STACK = [
	{ name: "Golang", role: "Backend API" },
	{ name: "Next.js", role: "Web frontend" },
	{ name: "Supabase", role: "Database · Auth · Realtime" },
	{ name: "KijaniBox", role: "Satellite weather & soil data" },
	{ name: "Africa's Talking", role: "SMS delivery" },
];

const SUPPORTING_STACK = [
	"Python AI service",
	"Redis / Asynq",
	"TimescaleDB",
	"Recharts",
	"Leaflet",
];

export const TechStackSection: React.FC = () => {
	return (
		<section id="tech-stack" className="scroll-mt-16 bg-white border-y border-border">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
				<h2 className="font-serif text-3xl md:text-4xl font-bold text-center">
					Built on proven infrastructure
				</h2>
				<p className="text-secondary text-center mt-3 max-w-xl mx-auto">
					Reliable enough for the field, simple enough for a feature phone.
				</p>

				<div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
					{CORE_STACK.map((tech) => (
						<div
							key={tech.name}
							className="rounded-xl border border-border bg-canvas p-5 text-center"
						>
							<p className="font-serif font-bold">{tech.name}</p>
							<p className="mt-1 text-xs font-mono text-secondary">{tech.role}</p>
						</div>
					))}
				</div>

				<div className="mt-8 flex flex-wrap items-center justify-center gap-2">
					<span className="label-mono mr-2">Also powered by</span>
					{SUPPORTING_STACK.map((tech) => (
						<span
							key={tech}
							className="rounded-full border border-border bg-white px-3 py-1 text-xs font-mono text-secondary"
						>
							{tech}
						</span>
					))}
				</div>
			</div>
		</section>
	);
};

export default TechStackSection;
