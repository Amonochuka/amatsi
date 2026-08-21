/*
 * ============================================================================
 * components/ui/Input.tsx — FORM INPUT PRIMITIVE
 * Component: Person C + Person E
 *
 * Shared input used by login, signup, farm form, settings.
 * WHAT NEEDS TO BE DONE:
 * - Variants: text, email, phone, password, number, select/date support
 * - Error state styling + inline <p> error message (Feature 2.4)
 * - Label + optional hint text, disabled state
 * - Integrate with react-hook-form (register/errors spread props)
 * Feature references: 2.4, 6.5–6.15 (farm form), 8.x (settings forms).
 * ============================================================================
 */

import React from "react";

type InputType =
	| "text"
	| "email"
	| "phone"
	| "tel"
	| "password"
	| "number"
	| "date"
	| "select";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
	type?: InputType;
	label?: string;
	hint?: string;
	error?: string;
	fullWidth?: boolean;
	/** For type="select": the option list. */
	options?: Array<{ value: string; label: string }>;
}

const baseClasses =
	"w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink font-sans placeholder:text-secondary/50 focus:outline-none focus:ring-2 transition-colors disabled:bg-canvas disabled:cursor-not-allowed";
const normalClasses = "border-border focus:border-primary focus:ring-primary/30";
const errorClasses = "border-dry-text focus:border-dry-text focus:ring-dry-text/30";

export const Input: React.FC<InputProps> = ({
	type = "text",
	label,
	hint,
	error,
	fullWidth = true,
	options,
	className = "",
	id,
	disabled,
	...rest
}) => {
	const inputId = id ?? rest.name ?? `input-${label?.toLowerCase().replace(/\s+/g, "-")}`;
	const stateClasses = error ? errorClasses : normalClasses;

	return (
		<div className={`${fullWidth ? "w-full" : ""} ${className}`}>
			{label && (
				<label htmlFor={inputId} className="block mb-1.5 text-sm font-medium text-ink">
					{label}
				</label>
			)}

			{type === "select" ? (
				<select
					id={inputId}
					disabled={disabled}
					className={`${baseClasses} ${stateClasses}`}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? `${inputId}-error` : undefined}
					{...(rest as unknown as React.SelectHTMLAttributes<HTMLSelectElement>)}
				>
					{options?.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			) : (
				<input
					id={inputId}
					type={type === "phone" ? "tel" : type}
					disabled={disabled}
					className={baseClasses + " " + stateClasses}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? `${inputId}-error` : undefined}
					{...rest}
				/>
			)}

			{hint && !error && <p className="mt-1 text-xs text-secondary">{hint}</p>}
			{error && (
				<p id={`${inputId}-error`} className="mt-1 text-xs text-dry-text" role="alert">
					{error}
				</p>
			)}
		</div>
	);
};

export default Input;
