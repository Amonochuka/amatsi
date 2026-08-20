/*
 * ============================================================================
 * components/ui/Sidebar.tsx — SIDEBAR NAVIGATION
 * Component: Person C (Frontend Developer)
 *
 * Persistent left navigation for all authenticated dashboard pages.
 *
 * WHAT NEEDS TO BE DONE (Feature 9.x — Sidebar Navigation):
 * 9.1  Dashboard Icon    — 🌾 Overview link         (/dashboard)
 * 9.2  Irrigation Icon   — 💧 Irrigation Advisor    (/dashboard/irrigation)
 * 9.3  Planner Icon      — 🌱 Crop Planner          (/dashboard/planner)
 * 9.4  Farms Icon        — 📊 My Farms              (/dashboard/farms)
 * 9.5  Alerts Icon       — 🔔 Alerts History        (/dashboard/alerts)
 * 9.6  Settings Icon     — ⚙️ Settings              (/dashboard/settings)
 * 9.7  User Avatar       — Profile picture or initials (from useAuth)
 * 9.8  User Name         — Display farmer name
 * 9.9  Logout Button     — Sign out (clears session, redirect to /auth/login)
 * 9.10 Collapsible       — Mobile-friendly collapsible/hamburger menu
 * 9.11 Offline Indicator — Show offline status when offline (useOffline)
 *
 * Active link highlighting: usePathname() to set active styles.
 *
 * Feature references: 9.1–9.11.
 * ============================================================================
 */