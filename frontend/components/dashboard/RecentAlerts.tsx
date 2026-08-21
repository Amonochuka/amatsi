/*
 * ============================================================================
 * components/dashboard/RecentAlerts.tsx — RECENT ALERTS
 * Component: Person E (Frontend Developer)
 *
 * Shows the newest SMS alerts on the dashboard overview.
 *
 * WHAT NEEDS TO BE DONE (Feature 3.21):
 * 3.21 Recent Alerts — Latest 3–5 SMS alerts with delivery status
 *      - Message preview, timestamp, delivered/pending/failed icon
 *
 * Implementation notes:
 * - Fetch via lib/api/client.ts getAlertHistory() (Feature 7.1).
 * - Link to /dashboard/alerts for the full history page.
 * - Status icons: ✓ Delivered, ⏳ Pending, ✕ Failed (Feature 7.2).
 *
 * Feature references: 3.21, 7.1, 7.2.
 * ============================================================================
 */