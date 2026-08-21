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

export type ValidationResult = {
	valid: boolean;
	errors: Record<string, string>;
};

const ok = (): ValidationResult => ({ valid: true, errors: {} });
const fail = (errors: Record<string, string>): ValidationResult => ({
	valid: Object.keys(errors).length === 0,
	errors,
});

/** East African phone formats: +2547XXXXXXXX, 07XXXXXXXX, +2541XXXXXXXX, 01XXXXXXXX. */
export const isValidPhone = (phone: string): boolean => {
	const normalized = phone.replace(/[\s-]/g, "");
	return /^(?:\+?254|0)[17]\d{8}$/.test(normalized);
};

export const isValidEmail = (email: string): boolean =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/** Feature 2.4 — minimum length 6 with at least one letter and one digit. */
export const isStrongPassword = (pw: string): boolean =>
	typeof pw === "string" && pw.length >= 6 && /[a-zA-Z]/.test(pw) && /\d/.test(pw);

export interface FarmFormData {
	name: string;
	areaHa: number | string;
	tankCapacityL: number | string;
	cropType?: string;
}

/** Feature 6.5–6.15 — required name, area > 0, tank capacity > 0. */
export const validateFarmForm = (data: FarmFormData): ValidationResult => {
	const errors: Record<string, string> = {};

	if (!data.name || !data.name.trim()) {
		errors.name = "Farm name is required";
	}

	const area = Number(data.areaHa);
	if (!data.areaHa || Number.isNaN(area) || area <= 0) {
		errors.areaHa = "Field size must be greater than 0";
	}

	const tank = Number(data.tankCapacityL);
	if (!data.tankCapacityL || Number.isNaN(tank) || tank <= 0) {
		errors.tankCapacityL = "Tank capacity must be greater than 0";
	}

	return fail(errors);
};

export interface SignupFormData {
	name: string;
	phone: string;
	email?: string;
	password: string;
	confirmPassword?: string;
}

/** Feature 2.4 — real-time signup validation rules. */
export const validateSignupForm = (data: SignupFormData): ValidationResult => {
	const errors: Record<string, string> = {};

	if (!data.name || !data.name.trim()) {
		errors.name = "Name is required";
	}
	if (!isValidPhone(data.phone)) {
		errors.phone = "Enter a valid phone e.g. +254712345678 or 0712345678";
	}
	if (data.email && data.email.trim() && !isValidEmail(data.email)) {
		errors.email = "Enter a valid email address";
	}
	if (!isStrongPassword(data.password)) {
		errors.password = "Password must be at least 6 characters with a letter and a number";
	}
	if (data.confirmPassword !== undefined && data.confirmPassword !== data.password) {
		errors.confirmPassword = "Passwords do not match";
	}

	return fail(errors);
};

export interface LoginFormData {
	identifier: string;
	password: string;
}

/** Feature 2.4 — login accepts either a phone number or an email address. */
export const validateLoginForm = (data: LoginFormData): ValidationResult => {
	const errors: Record<string, string> = {};

	const identifier = data.identifier?.trim() ?? "";
	if (!identifier) {
		errors.identifier = "Phone or email is required";
	} else if (!isValidPhone(identifier) && !isValidEmail(identifier)) {
		errors.identifier = "Enter a valid phone number or email";
	}
	if (!data.password) {
		errors.password = "Password is required";
	}

	return fail(errors);
};
