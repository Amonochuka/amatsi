"use client";

/*
 * hooks/useRealtime.ts — POLL A BACKEND ENDPOINT ON AN INTERVAL
 *
 * Lightweight realtime-ish polling against the Go backend. Runs a fetcher on
 * an interval and invokes onPayload when fresh data arrives. Used in place of
 * Supabase postgres_changes subscriptions since the app now authenticates
 * through the backend's own API.
 */
import { useEffect, useRef } from "react";

export function useRealtime<T>(
	_fetch: () => Promise<T>,
	onPayload: (payload: T) => void,
	intervalMs = 30000
) {
	const onPayloadRef = useRef(onPayload);
	onPayloadRef.current = onPayload;

	useEffect(() => {
		let active = true;
		let timer: ReturnType<typeof setInterval>;

		const poll = async () => {
			try {
				const data = await _fetch();
				if (active) onPayloadRef.current(data);
			} catch {
				// ignore transient polling errors
			}
		};

		poll();
		timer = setInterval(poll, intervalMs);

		return () => {
			active = false;
			clearInterval(timer);
		};
	}, [_fetch, intervalMs]);
}
