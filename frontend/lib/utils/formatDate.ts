/*
 * ============================================================================
 * lib/utils/formatDate.ts — DATE FORMATTING HELPERS
 * Component: Person C + Person E
 *
 * WHAT NEEDS TO BE DONE:
 * - formatDate(ts) — readable local date ("12 Jun 2026")
 * - fromNow(ts)    — "2 min ago", "3 days ago" (Features 10.2, 11.3, 7.3)
 * - formatRange(from, to) — for date filters (Feature 7.6)
 * Feature references: 10.2, 11.3, 7.3, 7.6.
 * ============================================================================
 */

export const formatDate = (ts: string): string =>
	new Date(ts).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const fromNow = (ts: string): string => {
	const diffMs = Date.now() - new Date(ts).getTime();
	const mins = Math.floor(diffMs / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	return `${Math.floor(hrs / 24)}d ago`;
};

export const formatRange = (from: string, to: string): string =>
	`${formatDate(from)} – ${formatDate(to)}`;
