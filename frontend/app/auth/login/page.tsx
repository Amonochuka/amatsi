/*
 * ============================================================================
 * app/auth/login/page.tsx — LOGIN PAGE
 * Component: Person C (Frontend Developer)
 *
 * Public route that hosts the <LoginForm/> component.
 *
 * WHAT NEEDS TO BE DONE (Feature 2.x — Authentication):
 * 2.1 Login Page              — Phone/email + password login
 * 2.3 Password Reset          — "Forgot Password?" link → reset via phone/email
 * 2.5 Loading States          — Spinner while authenticating
 * 2.6 Error Handling          — User-friendly error messages
 * 2.7 Language Selection      — Quick language switcher (English/Kiswahili/Luo)
 *
 * Behavior:
 * - On success, redirect to /dashboard.
 * - If already authenticated, redirect away from this page.
 * - Use Supabase Auth (lib/supabase/client.ts) for signInWithPassword.
 *
 * Feature references: 2.1, 2.3, 2.5, 2.6, 2.7.
 * ============================================================================
 */