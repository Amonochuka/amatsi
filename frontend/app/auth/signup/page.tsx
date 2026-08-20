/*
 * ============================================================================
 * app/auth/signup/page.tsx — SIGNUP PAGE
 * Component: Person C (Frontend Developer)
 *
 * Public route that hosts the <SignupForm/> component.
 *
 * WHAT NEEDS TO BE DONE (Feature 2.x — Authentication):
 * 2.2 Signup Page        — Name, phone, password, language preference
 * 2.4 Form Validation    — Real-time validation with error messages
 * 2.5 Loading States     — Spinner while creating the account
 * 2.6 Error Handling     — User-friendly error messages
 * 2.7 Language Selection — Choose English, Kiswahili, or Luo on signup
 *
 * Behavior:
 * - On success, redirect to /dashboard (or a "check your phone to verify" step).
 * - Use Supabase Auth signUp().
 *
 * Feature references: 2.2, 2.4, 2.5, 2.6, 2.7, 14.6 (signup language).
 * ============================================================================
 */