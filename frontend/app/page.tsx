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

export default function HomePage() {
	return (
		<main className="p-6">
			<h1 className="text-2xl font-bold">AMATSI — Smart Irrigation</h1>
			<p className="mt-2">Frontend placeholder landing page.</p>
			<p className="mt-4">
				<a href="/dashboard" className="text-blue-600 underline">
					Open Dashboard
				</a>
			</p>
		</main>
	);
}