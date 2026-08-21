/*
 * ============================================================================
 * app/auth/signup/page.tsx — SIGNUP PAGE
 * Component: Person C (Frontend Developer)
 *
 * Public route that hosts the <SignupForm/> component.
 *
 * WHAT NEEDS TO BE DONE (Feature 2.x — Authentication):
 * 2.2 Signup Page        — Name, phone, password, language preference
 * 2.4 Form Validation    — Real-time validation with error messages
 * 2.5 Loading States     — Spinner while creating the account
 * 2.6 Error Handling     — User-friendly error messages
 * 2.7 Language Selection — Choose English, Kiswahili, or Luo on signup
 *
 * Behavior:
 * - On success, redirect to /dashboard (or a "check your phone to verify" step).
 * - Use Supabase Auth signUp().
 *
 * Feature references: 2.2, 2.4, 2.5, 2.6, 2.7, 14.6 (signup language).
 * ============================================================================
 */

import React from "react";
import Link from "next/link";
import SignupForm from "../../../components/auth/SignupForm";

export const metadata = {
	title: "Sign Up — KijaniFarmer",
};

export default function SignupPage() {
	return (
		<main className="min-h-screen flex items-center justify-center bg-canvas px-4 py-10">
			<div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-sm">
				<div className="mb-6 text-center">
					<Link href="/" className="inline-block">
						<h1 className="font-serif text-3xl font-bold text-primary">KijaniFarmer</h1>
					</Link>
					<p className="text-sm text-secondary mt-1">
						Create your free account and start saving water today.
					</p>
				</div>

				<SignupForm />
			</div>
		</main>
	);
}
