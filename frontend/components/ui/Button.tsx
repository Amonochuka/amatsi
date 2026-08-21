/*
 * ============================================================================
 * components/ui/Button.tsx — BUTTON PRIMITIVE
 * Component: Person C + Person E
 *
 * Reusable button used by every page/component.
 * WHAT NEEDS TO BE DONE:
 * - Variants: primary (green #16a34a), secondary, outline, ghost, danger
 * - Sizes: sm, md, lg, icon
 * - Loading state with <LoadingSpinner/> (Feature 2.5 / 19.8)
 * - Support asChild/link usage so it can render <Link>
 * - Disabled state, fullWidth option
 * Feature references: 2.5, 19.8.
 * ============================================================================
 */

import React from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	size?: Size;
	loading?: boolean;
	fullWidth?: boolean;
	href?: string;
}

const variantClasses: Record<Variant, string> = {
	primary: "bg-primary text-white hover:bg-primary-dark",
	secondary: "bg-secondary text-white hover:opacity-90",
	outline: "border border-border bg-white text-ink hover:bg-canvas",
	ghost: "text-ink hover:bg-canvas",
	danger: "bg-dry-text text-white hover:opacity-90",
};

const sizeClasses: Record<Size, string> = {
	sm: "text-xs px-3 py-1.5",
	md: "text-sm px-4 py-2",
	lg: "text-base px-6 py-3",
	icon: "p-2",
};

export const Button: React.FC<ButtonProps> = ({
	variant = "primary",
	size = "md",
	loading = false,
	fullWidth = false,
	href,
	disabled,
	className = "",
	children,
	...rest
}) => {
	const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-medium font-mono uppercase tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`;

	const content = loading ? (
		<>
			<span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
			{children}
		</>
	) : (
		children
	);

	if (href) {
		return (
			<Link href={href} className={classes}>
				{content}
			</Link>
		);
	}

	return (
		<button className={classes} disabled={disabled || loading} {...rest}>
			{content}
		</button>
	);
};

export default Button;
