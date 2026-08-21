/*
 * ============================================================================
 * lib/utils/validators.ts — FORM VALIDATION HELPERS
 * Component: Person C (auth) + Person E (farm/settings forms)
 *
 * Reusable validation rules used by login, signup, farm and settings forms.
 * WHAT NEEDS TO BE DONE:
 * - isValidPhone(number) — East African format (+254/07XX...)
 * - isValidEmail(email)
 * - isStrongPassword(pw) — min length 6 (used for Feature 2.4)
 * - validateFarmForm(data) — required name, area > 0, tank capacity > 0
 * Return { valid: boolean, errors: Record<string,string> }.
 * Feature references: 2.4, 6.5–6.15, 8.2.
 * ============================================================================
 */