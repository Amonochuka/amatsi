/*
 * ============================================================================
 * components/auth/SignupForm.tsx — SIGNUP FORM
 * Component: Person C (Frontend Developer)
 *
 * Client component containing the signup form UI and logic.
 *
 * WHAT NEEDS TO BE DONE (Feature 2.x — Authentication):
 * 2.2 Signup Page        — Name, phone, email (optional), password, language
 *                          preference fields
 * 2.4 Form Validation    — Real-time validation:
 *                          - name required
 *                          - phone valid East-African format (validators.ts)
 *                          - password min length + confirm password match
 * 2.5 Loading States     — Spinner + disabled button while submitting
 * 2.6 Error Handling     — Friendly errors (e.g., "Phone already registered")
 * 2.7 Language Selection — Dropdown: English | Kiswahili | Luo (default)
 *
 * Implementation notes:
 * - Store language preference on the farmer profile (used for SMS language 14.5).
 * - On success redirect to /dashboard.
 *
 * Feature references: 2.2, 2.4, 2.5, 2.6, 2.7, 14.5, 14.6.
 * ============================================================================
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { validateSignupForm } from "../../lib/utils/validators";
import type { Language } from "../../types";

const LANGUAGE_OPTIONS: Array<{ value: Language; label: string }> = [
	{ value: "en", label: "English" },
	{ value: "sw", label: "Kiswahili" },
	{ value: "luo", label: "Luo" },
];

interface FormState {
	name: string;
	phone: string;
	email: string;
	password: string;
	confirmPassword: string;
	language: Language;
}

const INITIAL: FormState = {
	name: "",
	phone: "",
	email: "",
	password: "",
	confirmPassword: "",
	language: "en",
};

const SignupForm: React.FC = () => {
	const router = useRouter();
	const { signUp } = useAuth();

	const [form, setForm] = useState<FormState>(INITIAL);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitting, setSubmitting] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);

	const setField =
		(field: keyof FormState) =>
		(
			e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
		) => {
			setForm((prev) => ({ ...prev, [field]: e.target.value }));
			setErrors((prev) => ({ ...prev, [field]: "" }));
		};

	// Feature 2.4 — validate on blur for real-time feedback.
	const handleBlur = (field: keyof FormState) => () => {
		const validation = validateSignupForm(form);
		setErrors((prev) => ({ ...prev, [field]: validation.errors[field] ?? "" }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(null);

		const validation = validateSignupForm(form);
		if (!validation.valid) {
			setErrors(validation.errors);
			return;
		}
		setSubmitting(true);

		try {
			await signUp({
				name: form.name.trim(),
				phone: form.phone.trim(),
				email: form.email.trim() || undefined,
				password: form.password,
				language: form.language,
			});
			router.push("/dashboard");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Could not create your account";
			setFormError(
				message.toLowerCase().includes("already registered")
					? "Phone already registered. Try logging in instead."
					: message
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4" noValidate>
			<Input
				label="Full name"
				name="name"
				placeholder="e.g. Amina Okello"
				value={form.name}
				onChange={setField("name")}
				onBlur={handleBlur("name")}
				error={errors.name}
				disabled={submitting}
				autoComplete="name"
			/>

			<Input
				label="Phone number"
				name="phone"
				type="tel"
				placeholder="+254712345678"
				hint="Used for SMS alerts (SMS language follows your choice below)."
				value={form.phone}
				onChange={setField("phone")}
				onBlur={handleBlur("phone")}
				error={errors.phone}
				disabled={submitting}
				autoComplete="tel"
			/>

			<Input
				label="Email (optional)"
				name="email"
				type="email"
				placeholder="you@example.com"
				value={form.email}
				onChange={setField("email")}
				onBlur={handleBlur("email")}
				error={errors.email}
				disabled={submitting}
				autoComplete="email"
			/>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<Input
					label="Password"
					name="password"
					type="password"
					placeholder="Min 6 characters"
					value={form.password}
					onChange={setField("password")}
					onBlur={handleBlur("password")}
					error={errors.password}
					disabled={submitting}
					autoComplete="new-password"
				/>
				<Input
					label="Confirm password"
					name="confirmPassword"
					type="password"
					placeholder="Repeat password"
					value={form.confirmPassword}
					onChange={setField("confirmPassword")}
					onBlur={handleBlur("confirmPassword")}
					error={errors.confirmPassword}
					disabled={submitting}
					autoComplete="new-password"
				/>
			</div>

			{/* Feature 2.7 / 14.6 — language preference drives UI + SMS language */}
			<Input
				label="Preferred language"
				name="language"
				type="select"
				options={LANGUAGE_OPTIONS}
				value={form.language}
				onChange={setField("language")}
				hint="Alerts are sent in this language."
				disabled={submitting}
			/>

			{formError && (
				<p className="rounded-lg bg-dry-bg text-dry-text text-sm px-3 py-2" role="alert">
					{formError}
				</p>
			)}

			<Button type="submit" fullWidth size="lg" loading={submitting}>
				{submitting ? "Creating account..." : "Get Started Free"}
			</Button>

			<p className="text-center text-sm text-secondary">
				Already have an account?{" "}
				<Link href="/auth/login" className="font-mono text-primary hover:underline">
					Log in
				</Link>
			</p>
		</form>
	);
};

export default SignupForm;
