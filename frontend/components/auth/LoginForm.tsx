/*
 * ============================================================================
 * components/auth/LoginForm.tsx — LOGIN FORM
 * Component: Person C (Frontend Developer)
 *
 * Client component containing the login form UI and logic.
 *
 * WHAT NEEDS TO BE DONE (Feature 2.x — Authentication):
 * 2.1 Login Page           — Phone/email + password fields
 * 2.3 Password Reset       — "Forgot Password?" link/modal (reset via Supabase)
 * 2.4 Form Validation      — Real-time validation (email/phone format, password
 *                            not empty) with inline error messages
 * 2.5 Loading States       — Disable button + show spinner while submitting
 * 2.6 Error Handling       — Show friendly error (e.g., "Invalid credentials")
 *
 * Implementation notes:
 * - Use useAuth hook (hooks/useAuth.ts) or Supabase client directly.
 * - Use lib/utils/validators.ts for validation, lib/api/client.ts for the API.
 * - On success call router.push('/dashboard').
 * - i18n: labels and errors must come from the language provider (14.1–14.6).
 *
 * Feature references: 2.1, 2.3, 2.4, 2.5, 2.6, 2.7.
 * ============================================================================
 */