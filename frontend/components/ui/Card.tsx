/*
 * ============================================================================
 * components/ui/Card.tsx — CARD PRIMITIVE
 * Component: Person C + Person E
 *
 * Used to wrap dashboard widgets (means consistent styling everywhere).
 * WHAT NEEDS TO BE DONE:
 * - Card container with optional padding, border, shadow, rounded corners
 * - Sub-parts: CardHeader (title), CardContent, CardFooter
 * - Variant: default, interactive (hover), accent
 * - Optional "data source" footer line for attribution (Features 3.14, 8.15)
 * Feature references: 3.14, 8.15.
 * ============================================================================
 */

import React from "react";

type CardVariant = "default" | "accent";

interface CardProps {
	children: React.ReactNode;
	variant?: CardVariant;
	className?: string;
	dataSource?: string;
}

export const Card: React.FC<CardProps> = ({
	children,
	variant = "default",
	className = "",
	dataSource,
}) => {
	const base = "rounded-2xl border p-6";
	const variants: Record<CardVariant, string> = {
		default: "bg-white border-border",
		accent: "bg-primary-dark border-primary-dark text-white",
	};

	return (
		<div className={`${base} ${variants[variant]} ${className}`}>
			{children}
			{dataSource && (
				<p className="mt-4 text-[11px] font-mono text-secondary/70">
					Data from {dataSource}
				</p>
			)}
		</div>
	);
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
	children,
	className = "",
}) => <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>;

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
	children,
	className = "",
}) => (
	<h3 className={`font-serif text-xl font-bold ${className}`}>{children}</h3>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
	children,
	className = "",
}) => <div className={className}>{children}</div>;

export default Card;
