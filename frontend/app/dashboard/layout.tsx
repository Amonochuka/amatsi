/*
 * ============================================================================
 * app/dashboard/layout.tsx — DASHBOARD LAYOUT (Authenticated areas)
 * Component: Person C (Frontend Developer)
 *
 * Wraps all /dashboard/* routes. This is the app shell.
 *
 * WHAT NEEDS TO BE DONE:
 * 1. Protect the route: redirect to /auth/login if user is not authenticated
 *    (use hooks/useAuth.ts).
 * 2. Render the persistent <Sidebar/> (Feature 9.1–9.11).
 * 3. Render the <Header/> with user info, offline indicator, sync, bells
 *    (Feature 10.1–10.8).
 * 4. Provide the <main> children outlet for the routed page.
 * 5. Make it responsive: collapsible sidebar on mobile (Feature 9.10).
 *
 * Feature references: 9.1–9.11, 10.1–10.8, 12.1 (realtime), 11.x (offline).
 * ============================================================================
 */