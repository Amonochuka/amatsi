/*
 * ============================================================================
 * hooks/useRealtime.ts — REALTIME SUBSCRIPTIONS HOOK
 * Component: Person C (Frontend Developer)
 *
 * Live updates: dashboard refreshes automatically when the AI pushes a
 * new recommendation (no page reload needed).
 *
 * WHAT NEEDS TO BE DONE (Feature 12.x — Real-time):
 * 12.1 Realtime Subscriptions — subscribe to 'recommendations' table
 *                               (also soil_moisture / weather opt.)
 * 12.2 Live Dashboard Updates  — re-fetch latest data on new events
 * 12.3 Toast Notifications     — "New recommendation received" toast
 * 12.4 Notification Badge      — bump the Header bell count (Feature 10.5)
 * 12.5 Auto-Refresh            — refresh data when events arrive
 *
 * Implementation notes:
 * - Supabase Realtime: supabase.channel('recommendations')
 *     .on('postgres_changes', { event: 'INSERT', schema: 'public',
 *          table: 'recommendations' }, handler)
 * - Hook into Header bell + RecentAlerts for badge/count.
 *
 * Feature references: 12.1–12.5, 19.1, 10.4–10.5, 3.21.
 * ============================================================================
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase/client";
import type { Recommendation } from "../types";

export interface RealtimeEvent {
	type: "INSERT" | "UPDATE";
	table: string;
	payload: Recommendation | null;
	receivedAt: string;
}

interface UseRealtimeOptions {
	farmId?: string;
	onInsert?: (payload: Recommendation) => void;
}

/**
 * Subscribes to new rows on the `recommendations` table. Falls back to a
 * silent no-op when Supabase env vars are not configured so pages still run.
 */
export function useRealtime({ farmId, onInsert }: UseRealtimeOptions = {}) {
	const [events, setEvents] = useState<RealtimeEvent[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [toast, setToast] = useState<string | null>(null);
	const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const showToast = useCallback((message: string) => {
		setToast(message); // 12.3
		if (toastTimer.current) clearTimeout(toastTimer.current);
		toastTimer.current = setTimeout(() => setToast(null), 4000);
	}, []);

	const markAllRead = useCallback(() => setUnreadCount(0), []); // 12.4

	useEffect(() => {
		if (!isSupabaseConfigured) return;

		const supabase = getSupabaseClient();
		const channel = supabase.channel("recommendations");

		channel.on(
			"postgres_changes",
			{
				event: "INSERT",
				schema: "public",
				table: "recommendations",
				...(farmId ? { filter: `farm_id=eq.${farmId}` } : {}),
			},
			(payload) => {
				const rec = payload.new as Recommendation | undefined;
				setEvents((prev) => [
					{
						type: "INSERT",
						table: "recommendations",
						payload: rec ?? null,
						receivedAt: new Date().toISOString(),
					},
					...prev,
				]);
				setUnreadCount((c) => c + 1); // 12.4
				showToast("New recommendation received"); // 12.3
				if (rec) onInsert?.(rec); // 12.2 / 12.5
			}
		);

		channel.subscribe();

		return () => {
			void supabase.removeChannel(channel);
			if (toastTimer.current) clearTimeout(toastTimer.current);
		};
	}, [farmId, onInsert, showToast]);

	return { events, unreadCount, toast, markAllRead };
}

export default useRealtime;
