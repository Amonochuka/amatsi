/*
 * ============================================================================
 * components/auth/LoginForm.tsx — LOGIN FORM
 * Component: Person C (Frontend Developer)
 *
 * Client component containing the login form UI and logic.
 *
 * WHAT NEEDS TO BE DONE (Feature 2.x — Authentication):
 * 2.1 Login Page           — Phone/email + password fields
 * 2.3 Password Reset       — "Forgot Password?" link/modal (reset via Supabase)
 * 2.4 Form Validation      — Real-time validation (email/phone format, password
 *                            not empty) with inline error messages
 * 2.5 Loading States       — Disable button + show spinner while submitting
 * 2.6 Error Handling       — Show friendly error (e.g., "Invalid credentials")
 *
 * Implementation notes:
 * - Use useAuth hook (hooks/useAuth.ts) or Supabase client directly.
 * - Use lib/utils/validators.ts for validation, lib/api/client.ts for the API.
 * - On success call router.push('/dashboard').
 * - i18n: labels and errors must come from the language provider (14.1–14.6).
 *
 * Feature references: 2.1, 2.3, 2.4, 2.5, 2.6, 2.7.
 * ============================================================================
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { validateLoginForm } from "../../lib/utils/validators";

type Language = "en" | "sw" | "luo";

const LANGUAGE_LABELS: Record<Language, string> = {
	en: "English",
	sw: "Kiswahili",
	luo: "Luo",
};

const LoginForm: React.FC = () => {
	const router = useRouter();
	const { signIn, resetPassword } = useAuth();

	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [language, setLanguage] = useState<Language>("en");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [resetNotice, setResetNotice] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(null);
		setResetNotice(null);

		const validation = validateLoginForm({ identifier, password });
		if (!validation.valid) {
			setErrors(validation.errors);
			return;
		}
		setErrors({});
		setSubmitting(true);

		try {
			await signIn({ identifier, password });
			router.push("/dashboard");
		} catch (err) {
			setFormError(err instanceof Error ? err.message : "Invalid credentials");
		} finally {
			setSubmitting(false);
		}
	};

	// Feature 2.3 — password reset via phone/email.
	const handleForgotPassword = async () => {
		setFormError(null);
		if (!identifier.includes("@")) {
			setResetNotice("Enter your email above first, then tap Forgot Password.");
			return;
		}
		try {
			await resetPassword(identifier);
			setResetNotice("Password reset link sent. Check your email.");
		} catch (err) {
			setFormError(err instanceof Error ? err.message : "Could not send reset link");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4" noValidate>
			{/* Feature 2.7 — quick language switcher */}
			<div className="flex items-center gap-2 justify-end">
				{(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
					<button
						key={lang}
						type="button"
						onClick={() => setLanguage(lang)}
						className={`text-xs font-mono px-2 py-1 rounded-full transition-colors ${
							language === lang
								? "bg-primary text-white"
								: "text-secondary hover:bg-canvas"
						}`}
					>
						{LANGUAGE_LABELS[lang]}
					</button>
				))}
			</div>

			<Input
				label="Phone or email"
				name="identifier"
				type="text"
				placeholder="+254712345678 or you@example.com"
				value={identifier}
				onChange={(e) => setIdentifier(e.target.value)}
				error={errors.identifier}
				disabled={submitting}
				autoComplete="username"
			/>

			<Input
				label="Password"
				name="password"
				type="password"
				placeholder="Your password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				error={errors.password}
				disabled={submitting}
				autoComplete="current-password"
			/>

			{formError && (
				<p className="rounded-lg bg-dry-bg text-dry-text text-sm px-3 py-2" role="alert">
					{formError}
				</p>
			)}
			{resetNotice && (
				<p className="rounded-lg bg-optimal-bg text-optimal-text text-sm px-3 py-2">
					{resetNotice}
				</p>
			)}

			<Button type="submit" fullWidth size="lg" loading={submitting}>
				{submitting ? "Signing in..." : "Log In"}
			</Button>

			<div className="flex items-center justify-between text-sm">
				<button
					type="button"
					onClick={handleForgotPassword}
					className="font-mono text-xs text-primary hover:underline"
				>
					Forgot password?
				</button>
				<Link href="/auth/signup" className="font-mono text-xs text-secondary hover:text-primary">
					Create account
				</Link>
			</div>
		</form>
	);
};

export default LoginForm;
