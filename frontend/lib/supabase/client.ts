/*
 * ============================================================================
 * lib/supabase/client.ts — SUPABASE BROWSER CLIENT
 * Component: Person C
 *
 * Client-side Supabase instance used by auth flows (login/signup/reset),
 * realtime subscriptions and any direct table reads.
 * Feature references: 2.x (auth), 12.1 (realtime), 19.10 (JWT session).
 * ============================================================================
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Browser client — safe to reuse as a singleton across components. */
export const createBrowserClient = () =>
	createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: true,
			autoRefreshToken: true,
		},
	});

let cachedClient: ReturnType<typeof createBrowserClient> | null = null;

export const getSupabaseClient = () => {
	if (!cachedClient) {
		cachedClient = createBrowserClient();
	}
	return cachedClient;
};

export default getSupabaseClient;
