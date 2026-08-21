/*
 * ============================================================================
 * components/dashboard/WaterUsageChart.tsx — WATER USAGE BAR CHART
 * Component: Person E (Frontend Developer)
 *
 * Visualizes water usage over time.
 *
 * WHAT NEEDS TO BE DONE (Feature 3.20 + 15.x):
 * 3.20 Water Usage Chart — 7-day water usage bar chart (Recharts)
 * 15.10 Usage Trends      — Weekly / monthly usage trends
 * 15.11 Farm Activity Log — Optional activity feed
 *
 * Implementation notes:
 * - Dependencies: recharts (install if missing).
 * - Data: water_usage_logs from the Go API / Supabase.
 * - Include weekly total and comparison to the previous week.
 * - Re-renders live when new data arrives (useRealtime, Feature 12.2).
 *
 * Feature references: 3.20, 15.10, 15.11, 12.2, 19.8 (loading state).
 * ============================================================================
 */