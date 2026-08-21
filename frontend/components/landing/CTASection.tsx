/*
 * ============================================================================
 * components/landing/CTASection.tsx — LANDING CALL TO ACTION (Feature 1.6)
 * Component: Person C (Frontend Developer)
 *
 * WHAT NEEDS TO BE DONE:
 * 1.6 Call to Action — "Get Started Free" button.
 *   - Headline ("Ready to save water and money?")
 *   - Primary CTA → /auth/signup
 *   - Secondary CTA → /auth/login
 *   - (Feature 1.8 FAQ Section might be rendered here or in page.tsx —
 *      build accordion of common Q&As when time allows.)
 *
 * Feature references: 1.6, 1.8.
 * ============================================================================
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";

const FAQS = [
	{
		question: "Do I need a smartphone?",
		answer:
			"No. Every recommendation is also delivered by SMS in your language (English, Kiswahili or Luo), so a basic phone is enough.",
	},
	{
		question: "Where does the data come from?",
		answer:
			"We combine KijaniBox satellite weather and soil moisture data with your farm profile. You can also connect a soil sensor for live readings.",
	},
	{
		question: "What does it cost?",
		answer:
			"The core irrigation advisor is free. Premium adds multi-farm support, longer history and priority SMS delivery.",
	},
	{
		question: "Does it work offline?",
		answer:
			"Yes. The app caches your latest advice and syncs automatically when you reconnect — designed for rural connectivity.",
	},
];

export const CTASection: React.FC = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section id="faq" className="scroll-mt-16">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
				{/* Feature 1.6 — call to action */}
				<div className="rounded-2xl bg-primary-dark text-white p-10 md:p-14 text-center">
					<h2 className="font-serif text-3xl md:text-4xl font-bold">
						Ready to save water and money?
					</h2>
					<p className="mt-3 text-white/70 max-w-xl mx-auto">
						Join farmers cutting irrigation costs with one clear instruction per day.
					</p>
					<div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link
							href="/auth/signup"
							className="w-full sm:w-auto rounded-lg bg-primary px-8 py-3 text-sm font-mono uppercase tracking-wide text-white hover:bg-primary-dark transition-colors border border-primary"
						>
							Get Started Free
						</Link>
						<Link
							href="/auth/login"
							className="w-full sm:w-auto rounded-lg border border-white/40 px-8 py-3 text-sm font-mono uppercase tracking-wide text-white hover:bg-white/10 transition-colors"
						>
							Log In
						</Link>
					</div>
				</div>

				{/* Feature 1.8 — FAQ accordion */}
				<div className="mt-16 max-w-3xl mx-auto">
					<h3 className="font-serif text-2xl font-bold text-center mb-6">
						Frequently asked questions
					</h3>
					<div className="space-y-3">
						{FAQS.map((faq, index) => {
							const open = openIndex === index;
							return (
								<div key={faq.question} className="rounded-xl border border-border bg-white">
									<button
										type="button"
										onClick={() => setOpenIndex(open ? null : index)}
										className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
										aria-expanded={open}
									>
										<span className="font-medium">{faq.question}</span>
										<span className={`font-mono text-secondary transition-transform ${open ? "rotate-45" : ""}`}>
											+
										</span>
									</button>
									{open && (
										<p className="px-5 pb-4 text-sm text-secondary">{faq.answer}</p>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
};

export default CTASection;
