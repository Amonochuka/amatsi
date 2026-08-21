/*
 * ============================================================================
 * app/page.tsx — LANDING PAGE (Public)
 * Component: Person C (Frontend Developer)
 *
 * This is the public-facing marketing/landing page at the root URL.
 * It should be fully server-rendered (no auth required).
 *
 * Minimal placeholder page added so the app can run during local frontend
 * development. Person C can replace with the full landing page later.
 * ============================================================================
 */

import React from "react";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";
import HeroSection from "../components/landing/HeroSection";
import ProblemSection from "../components/landing/ProblemSection";
import SolutionSection from "../components/landing/SolutionSection";
import TechStackSection from "../components/landing/TechStackSection";
import CTASection from "../components/landing/CTASection";

export default function HomePage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<main className="flex-1">
				<HeroSection />
				<ProblemSection />
				<SolutionSection />
				<TechStackSection />
				<CTASection />
			</main>
			<Footer />
		</div>
	);
}
