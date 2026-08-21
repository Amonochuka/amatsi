/*
 * ============================================================================
 * lib/utils/formatNumber.ts — NUMBER FORMATTING HELPERS
 * Component: Person C + Person E
 *
 * WHAT NEEDS TO BE DONE:
 * - formatLiters(n)     — "2,450 L" (water saved 3.2/3.4/3.9, 4.4, 4.10)
 * - formatKsh(n)        — "KES 1,250" (cost saved 3.3, 15.2)
 * - formatPercent(n)    — "78%" (rain probability 3.13, soil 3.16)
 * - formatHa(n)         — "2.5 ha" (field size 6.8)
 * Feature references: 3.2–3.4, 3.9, 3.13, 3.16, 4.4, 4.10, 15.2.
 * ============================================================================
 */

export const formatLiters = (n: number): string => `${n.toLocaleString("en-US")} L`;

export const formatKsh = (n: number): string => `KES ${n.toLocaleString("en-US")}`;

export const formatPercent = (n: number): string => `${Math.round(n)}%`;

export const formatHa = (n: number): string => `${n} ha`;
