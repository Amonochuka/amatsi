"use client";

import React, { useState } from "react";

type FarmMapProps = {
	initial?: { lat: number; lng: number };
	onChange?: (coords: { lat: number; lng: number }) => void;
	height?: number | string;
};

/**
 * Lightweight map placeholder for picking coordinates. This avoids
 * heavyweight map deps while allowing UI and integration work to proceed.
 * Replace with `react-leaflet` later if desired.
 */
const FarmMap: React.FC<FarmMapProps> = ({ initial, onChange, height = 260 }) => {
	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
		initial ?? null
	);

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const rect = (e.target as HTMLElement).getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		// Map to lat/lng mock range for demo purposes
		const lng = 34.5 + (x / rect.width) * 1.5; // 34.5 -> 36.0
		const lat = -1.5 + (y / rect.height) * 2.5; // -1.5 -> 1.0
		const c = { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)) };
		setCoords(c);
		onChange?.(c);
	};

	return (
		<div>
			<div
				onClick={handleClick}
				role="button"
				aria-label="Pick farm location"
				className="w-full bg-slate-100 rounded border border-slate-200"
				style={{ height }}
			>
				<div className="flex items-center justify-center h-full text-sm text-slate-500">
					Click to pick farm location (placeholder map)
				</div>
			</div>
			<div className="mt-2 text-xs text-slate-600">
				{coords ? (
					<div>Selected: {coords.lat}, {coords.lng}</div>
				) : (
					<div>No location selected</div>
				)}
			</div>
		</div>
	);
};

export default FarmMap;