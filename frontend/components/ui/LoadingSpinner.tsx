/*
 * ============================================================================
 * components/ui/LoadingSpinner.tsx — SPINNER
 * Component: Person C + Person E
 *
 * Loading indicator used across pages.
 * WHAT NEEDS TO BE DONE:
 * - Size variants (sm/md/lg), center/absolute wrapper options
 * - Used for auth loading states (Feature 2.5), data fetching (19.8)
 * - Optional skeleton variant for card placeholders
 * Feature references: 2.5, 19.8.
 * ============================================================================
 */

import React from "react";

type SpinnerSize = "sm" | "md" | "lg";

interface LoadingSpinnerProps {
	size?: SpinnerSize;
	center?: boolean;
	absolute?: boolean;
	label?: string;
	className?: string;
}

const SIZES: Record<SpinnerSize, { box: string; border: string }> = {
	sm: { box: "h-4 w-4", border: "border-2" },
	md: { box: "h-8 w-8", border: "border-[3px]" },
	lg: { box: "h-12 w-12", border: "border-4" },
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
	size = "md",
	center = false,
	absolute = false,
	label,
	className = "",
}) => {
	const s = SIZES[size];

	const spinner = (
		<span className="inline-flex items-center gap-2" role="status" aria-live="polite">
			<span
				className={`${s.box} ${s.border} rounded-full border-primary border-t-transparent animate-spin ${className}`}
			/>
			{label && <span className="text-sm font-mono text-secondary">{label}</span>}
			<span className="sr-only">{label ?? "Loading"}</span>
		</span>
	);

	if (absolute) {
		return (
			<div className="absolute inset-0 flex items-center justify-center bg-white/60 z-10">
				{spinner}
			</div>
		);
	}
	if (center) {
		return <div className="flex items-center justify-center py-8">{spinner}</div>;
	}
	return spinner;
};

/** Card-shaped placeholder for loading lists/grids (Feature 19.8). */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = "" }) => (
	<div className={`animate-pulse rounded-2xl bg-white border border-border p-6 ${className}`}>
		<div className="h-4 w-1/3 rounded bg-canvas mb-3" />
		<div className="h-8 w-1/2 rounded bg-canvas mb-4" />
		<div className="h-3 w-full rounded bg-canvas mb-2" />
		<div className="h-3 w-4/5 rounded bg-canvas" />
	</div>
);

export default LoadingSpinner;
