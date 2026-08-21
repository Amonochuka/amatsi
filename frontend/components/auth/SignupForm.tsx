/*
 * ============================================================================
 * components/auth/SignupForm.tsx — SIGNUP FORM
 * Component: Person C (Frontend Developer)
 *
 * Client component containing the signup form UI and logic.
 *
 * WHAT NEEDS TO BE DONE (Feature 2.x — Authentication):
 * 2.2 Signup Page        — Name, phone, email (optional), password, language
 *                          preference fields
 * 2.4 Form Validation    — Real-time validation:
 *                          - name required
 *                          - phone valid East-African format (validators.ts)
 *                          - password min length + confirm password match
 * 2.5 Loading States     — Spinner + disabled button while submitting
 * 2.6 Error Handling     — Friendly errors (e.g., "Phone already registered")
 * 2.7 Language Selection — Dropdown: English | Kiswahili | Luo (default)
 *
 * Implementation notes:
 * - Store language preference on the farmer profile (used for SMS language 14.5).
 * - On success redirect to /dashboard.
 *
 * Feature references: 2.2, 2.4, 2.5, 2.6, 2.7, 14.5, 14.6.
 * ============================================================================
 */