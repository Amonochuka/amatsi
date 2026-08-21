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