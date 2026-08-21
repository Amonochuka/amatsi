/*
 * ============================================================================
 * hooks/useAuth.ts — AUTHENTICATION STATE HOOK
 * Component: Person C (Frontend Developer)
 *
 * Central place for auth state so components can read the current user.
 *
 * WHAT NEEDS TO BE DONE:
 * - Subscribe to Supabase Auth changes (onAuthStateChange).
 * - Expose: { user, loading, signIn, signUp, signOut, resetPassword }.
 * - Store session/JWT in localStorage (Persisted auth in Feature 19.10).
 * - Protect routes: rename this to a hook + helper `requireAuth()`.
 *
 * User object model (types/index.ts): id, name, phone, email, language,
 * sms_enabled, theme, plan, created_at.
 *
 * Also powers:
 * - Header/Sidebar user avatar + name (Features 9.7, 9.8, 10.6, 10.7)
 * - Greeting on dashboard (Feature 3.1)
 * - Logout button (Feature 9.9)
 *
 * Feature references: 2.x (auth), 19.10 (JWT), 9.7–9.9, 10.6–10.7, 3.1.
 * ============================================================================
 */