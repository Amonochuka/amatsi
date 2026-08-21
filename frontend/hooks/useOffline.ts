/*
 * ============================================================================
 * hooks/useOffline.ts — OFFLINE-FIRST HOOK
 * Component: Person C (Frontend Developer)
 *
 * Detection + caching + sync. The key differentiator of KijaniFarmer.
 *
 * WHAT NEEDS TO BE DONE (Feature 11.x — Offline-First):
 * 11.1 Offline Detection      — Listen to window 'online'/'offline' events
 * 11.2 Offline Indicator      — Run hook ks in header/sidebar (10.1/9.11/3.22)
 * 11.3 Last Synced Time       — Track and expose "Last synced: X min ago"
 * 11.4 Cached Recommendations — read/write recommendations to localStorage
 * 11.5 Cached Weather Data    — read/write weather to localStorage
 * 11.6 Cached Soil Data       — read/write soil moisture to localStorage
 * 11.7 Manual Sync Button     — expose a sync() function driven by Header 10.8
 * 11.8 Auto-Sync on Reconnect — when 'online' fires, re-fetch all dirty data
 * 11.9 Pending Actions        — queue offline actions, show pending count
 *
 * PWA support (Feature 19.3/19.4 + 11.10/11.11):
 * - Register public/sw.js from layout.tsx
 * - Show "Add to Home Screen" prompt where possible
 *
 * Implementation notes:
 * - Persist to localStorage under a key like 'kijani:cache:<farmId>'.
 * - Expose: { isOnline, lastSynced, sync, pendingActions, cacheData }.
 *
 * Feature references: 11.1–11.11, 19.3–19.6, 10.1–10.3, 10.8.
 * ============================================================================
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Recommendation, WeatherData, SoilMoisture } from "../types";

const LAST_SYNCED_KEY = "kijani:last-synced";
const PENDING_KEY = "kijani:pending-actions";

export type CachedData = {
	recommendations?: Recommendation[];
	weather?: WeatherData;
	soil?: SoilMoisture[];
};

export type PendingAction = {
	id: string;
	type: string;
	payload: unknown;
	queuedAt: string;
};

const readJSON = <T,>(key: string): T | null => {
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : null;
	} catch {
		return null;
	}
};

export function useOffline() {
	const [isOnline, setIsOnline] = useState(true);
	const [lastSynced, setLastSynced] = useState<string | null>(null);
	const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
	const [cacheData, setCacheData] = useState<CachedData>({});
	const syncingRef = useRef(false);

	useEffect(() => {
		setIsOnline(navigator.onLine);
		setLastSynced(readJSON<string>(LAST_SYNCED_KEY));
		setPendingActions(readJSON<PendingAction[]>(PENDING_KEY) ?? []);

		const goOnline = () => setIsOnline(true);
		const goOffline = () => setIsOnline(false);

		window.addEventListener("online", goOnline); // 11.1 / 11.8
		window.addEventListener("offline", goOffline);

		return () => {
			window.removeEventListener("online", goOnline);
			window.removeEventListener("offline", goOffline);
		};
	}, []);

	/** Features 11.4–11.6 — persist data for offline reads. */
	const cacheDataForFarm = useCallback((farmId: string, data: CachedData) => {
		window.localStorage.setItem(`kijani:cache:${farmId}`, JSON.stringify(data));
		setCacheData(data);
	}, []);

	const readCachedForFarm = useCallback(<T extends CachedData>(farmId: string): T | null =>
		readJSON<T>(`kijani:cache:${farmId}`), []);

	/** Feature 11.9 — queue actions made while offline. */
	const queueAction = useCallback((type: string, payload: unknown) => {
		setPendingActions((prev) => {
			const next = [
				...prev,
				{
					id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
					type,
					payload,
					queuedAt: new Date().toISOString(),
				},
			];
			window.localStorage.setItem(PENDING_KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	/** Features 11.7 / 11.8 — manual + auto sync; returns synced count. */
	const sync = useCallback(async (): Promise<number> => {
		if (syncingRef.current || !navigator.onLine) return 0;
		syncingRef.current = true;
		try {
			let processed = 0;
			const queued = readJSON<PendingAction[]>(PENDING_KEY) ?? [];
			for (const action of queued) {
				try {
					await fetch("/api/sync", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(action),
					});
					processed += 1;
				} catch {
					break; // still offline — keep the rest queued
				}
			}
			const remaining = queued.slice(processed);
			window.localStorage.setItem(PENDING_KEY, JSON.stringify(remaining));
			setPendingActions(remaining);

			const now = new Date().toISOString();
			window.localStorage.setItem(LAST_SYNCED_KEY, JSON.stringify(now));
			setLastSynced(now);
			return processed;
		} finally {
			syncingRef.current = false;
		}
	}, []);

	// 11.8 — auto-sync as soon as connectivity returns.
	useEffect(() => {
		if (isOnline && pendingActions.length > 0) {
			void sync();
		}
	}, [isOnline, pendingActions.length, sync]);

	return { isOnline, lastSynced, sync, pendingActions, cacheData, cacheDataForFarm, readCachedForFarm };
}

export default useOffline;
