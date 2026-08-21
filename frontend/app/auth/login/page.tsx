/*
 * ============================================================================
 * app/auth/login/page.tsx — LOGIN PAGE
 * Component: Person C (Frontend Developer)
 *
 * Public route that hosts the <LoginForm/> component.
 *
 * WHAT NEEDS TO BE DONE (Feature 2.x — Authentication):
 * 2.1 Login Page              — Phone/email + password login
 * 2.3 Password Reset          — "Forgot Password?" link → reset via phone/email
 * 2.5 Loading States          — Spinner while authenticating
 * 2.6 Error Handling          — User-friendly error messages
 * 2.7 Language Selection      — Quick language switcher (English/Kiswahili/Luo)
 *
 * Behavior:
 * - On success, redirect to /dashboard.
 * - If already authenticated, redirect away from this page.
 * - Use Supabase Auth (lib/supabase/client.ts) for signInWithPassword.
 *
 * Feature references: 2.1, 2.3, 2.5, 2.6, 2.7.
 * ============================================================================
 */

import React from "react";
import Link from "next/link";
import LoginForm from "../../../components/auth/LoginForm";

export const metadata = {
	title: "Log In — KijaniFarmer",
};

export default function LoginPage() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-canvas px-4">
			<div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-sm">
				<div className="mb-6 text-center">
					<Link href="/" className="inline-block">
						<h1 className="font-serif text-3xl font-bold text-primary">KijaniFarmer</h1>
					</Link>
					<p className="text-sm text-secondary mt-1">
						Welcome back — sign in to see your farm&apos;s advice.
					</p>
				</div>

				<LoginForm />
			</div>
		</main>
	);
}
