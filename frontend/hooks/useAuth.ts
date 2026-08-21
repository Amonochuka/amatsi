/*
 * ============================================================================
 * hooks/useAuth.ts — AUTHENTICATION STATE HOOK
 * Component: Person C (Frontend Developer)
 *
 * Central place for auth state so components can read the current user.
 *
 * WHAT NEEDS TO BE DONE:
 * - Subscribe to Supabase Auth changes (onAuthStateChange).
 * - Expose: { user, loading, signIn, signUp, signOut, resetPassword }.
 * - Store session/JWT in localStorage (Persisted auth in Feature 19.10).
 * - Protect routes: rename this to a hook + helper `requireAuth()`.
 *
 * User object model (types/index.ts): id, name, phone, email, language,
 * sms_enabled, theme, plan, created_at.
 *
 * Also powers:
 * - Header/Sidebar user avatar + name (Features 9.7, 9.8, 10.6, 10.7)
 * - Greeting on dashboard (Feature 3.1)
 * - Logout button (Feature 9.9)
 *
 * Feature references: 2.x (auth), 19.10 (JWT), 9.7–9.9, 10.6–10.7, 3.1.
 * ============================================================================
 */

"use client";

import { useCallback, useEffect, useState } from "react";
import type { Farmer, Language } from "../types";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase/client";
import { TOKEN_KEY } from "../lib/api/client";

const DEMO_USER_KEY = "kijani:demo-user";

const demoUser = (): Farmer => ({
	id: "demo-farmer",
	name: "Demo Farmer",
	phone: "+254712345678",
	email: "demo@kijanifarmer.app",
	language: "en" as Language,
	sms_enabled: true,
	theme: "auto" as Farmer["theme"],
	plan: "free",
	created_at: new Date().toISOString(),
});

export interface SignUpInput {
	name: string;
	phone: string;
	email?: string;
	password: string;
	language?: Language;
}

export interface SignInInput {
	identifier: string; // phone or email
	password: string;
}

export function useAuth() {
	const [user, setUser] = useState<Farmer | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;

		if (isSupabaseConfigured) {
			const supabase = getSupabaseClient();

			supabase.auth.getSession().then(({ data }) => {
				if (!active) return;
				setUser(data.session?.user ? demoUser() : null);
				setLoading(false);
			});

			const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
				if (!active) return;
				setUser(session?.user ? demoUser() : null);
				setLoading(false);
			});

			return () => {
				active = false;
				sub.subscription.unsubscribe();
			};
		}

		// Fallback demo session so the UI is usable before Supabase keys exist.
		try {
			const raw = window.localStorage.getItem(DEMO_USER_KEY);
			setUser(raw ? JSON.parse(raw) : null);
		} catch {
			setUser(null);
		}
		setLoading(false);

		return () => {
			active = false;
		};
	}, []);

	const signIn = useCallback(async ({ identifier }: SignInInput): Promise<Farmer> => {
		if (isSupabaseConfigured) {
			const supabase = getSupabaseClient();
			const email = identifier.includes("@") ? identifier : `${identifier}@phone.kijanifarmer.app`;
			const { data, error } = await supabase.auth.signInWithPassword({ email, password: "" });
			if (error || !data.user) throw new Error("Invalid credentials");
			const farmer = { ...demoUser(), id: data.user.id };
			window.localStorage.setItem(TOKEN_KEY, data.session?.access_token ?? "");
			setUser(farmer);
			return farmer;
		}
		const farmer = { ...demoUser(), phone: identifier.includes("@") ? demoUser().phone : identifier };
		window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(farmer));
		setUser(farmer);
		return farmer;
	}, []);

	const signUp = useCallback(async (input: SignUpInput): Promise<Farmer> => {
		const farmer: Farmer = {
			...demoUser(),
			name: input.name,
			phone: input.phone,
			email: input.email ?? "",
			language: input.language ?? "en",
		};
		if (isSupabaseConfigured) {
			const supabase = getSupabaseClient();
			const email = input.email || `${input.phone}@phone.kijanifarmer.app`;
			const { data, error } = await supabase.auth.signUp({ email, password: input.password });
			if (error) throw new Error(error.message);
			farmer.id = data.user?.id ?? farmer.id;
			window.localStorage.setItem(TOKEN_KEY, data.session?.access_token ?? "");
		} else {
			window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(farmer));
		}
		setUser(farmer);
		return farmer;
	}, []);

	const signOut = useCallback(async (): Promise<void> => {
		if (isSupabaseConfigured) {
			await getSupabaseClient().auth.signOut();
			window.localStorage.removeItem(TOKEN_KEY);
		}
		window.localStorage.removeItem(DEMO_USER_KEY);
		setUser(null);
	}, []);

	const resetPassword = useCallback(async (email: string): Promise<void> => {
		if (isSupabaseConfigured) {
			const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email);
			if (error) throw new Error(error.message);
			return;
		}
		// Demo mode — pretend a reset link was sent.
		await new Promise((resolve) => setTimeout(resolve, 400));
	}, []);

	return { user, loading, signIn, signUp, signOut, resetPassword };
}

/** Route guard helper for dashboard pages (Feature 19.10). */
export async function requireAuth(): Promise<Farmer> {
	if (typeof window === "undefined") {
		throw new Error("requireAuth must run in the browser");
	}
	try {
		const raw = window.localStorage.getItem(DEMO_USER_KEY);
		if (raw) return JSON.parse(raw) as Farmer;
	} catch {
		// fall through to redirect
	}
	if (typeof window !== "undefined") {
		window.location.href = "/auth/login";
	}
	throw new Error("Not authenticated");
}

export default useAuth;
