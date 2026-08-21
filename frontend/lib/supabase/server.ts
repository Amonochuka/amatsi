/*
 * ============================================================================
 * lib/supabase/server.ts — SUPABASE SSR SERVER CLIENT
 * Component: Person C
 *
 * Server-side client for Next.js server components / route handlers
 * (cookies-based auth session, per Supabase SSO docs).
 * Needed if we do server-side auth checks in layouts/server components.
 * Feature references: 2.x (auth), 19.10 (JWT session).
 * ============================================================================
 */

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Server client bound to the Next.js cookie store so RLS-authenticated
 * queries run as the signed-in farmer (Feature 19.11).
 */
export const createServerSupabaseClient = () => {
	const cookieStore = cookies();

	return createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => {
						cookieStore.set(name, value, options);
					});
				} catch {
					// Called from a Server Component — safe to ignore because the
					// middleware refreshes sessions before they expire.
				}
			},
		},
	});
};

export default createServerSupabaseClient;
