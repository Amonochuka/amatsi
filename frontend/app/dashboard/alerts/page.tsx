/*
 * ============================================================================
 * app/dashboard/alerts/page.tsx — ALERTS HISTORY
 * Component: Person E (Frontend Developer)
 *
 * History of all SMS alerts sent to the farmer.
 *
 * WHAT NEEDS TO BE DONE (Feature 7.x + 16.x — Alerts & Export):
 * 7.1  SMS History List   — All sent SMS messages
 * 7.2  Delivery Status    — Delivered / Pending / Failed with icons
 * 7.3  Timestamp          — When each SMS was sent
 * 7.4  Recipient Phone    — Show which phone received the SMS
 * 7.5  Search by Farm     — Search field for filtering
 * 7.6  Filter by Date     — Date-range filter
 * 7.7  Filter by Status   — Dropdown for status filter
 * 7.8  Pagination         — Previous/Next navigation
 * 7.9  Export CSV         — Download history as CSV
 * 7.10 Export PDF         — Download history as PDF
 * 7.11 SMS Count          — Total SMS sent
 * 7.12 Delivery Rate      — % of SMS delivered
 *
 * Export extras (Feature 16.x):
 * 16.3 Monthly Report     — Generate monthly summary report
 * 16.4 Share Report       — Share the report (link/WhatsApp/email)
 *
 * Implementation notes:
 * - API: getAlertHistory() (lib/api/client.ts).
 * - CSV export can be built client-side (no extra dep); PDF via library.
 *
 * Feature references: 7.1–7.12, 13.7 (SMS history), 16.1–16.4.
 * ============================================================================
 */