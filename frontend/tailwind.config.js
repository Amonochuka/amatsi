/*
 * ============================================================================
 * tailwind.config.js — TAILWIND THEME
 * Component: Person C + Person E
 *
 * Custom theme per docs/to-do-list.md Phase 3 UI Setup.
 * WHAT NEEDS TO BE DONE:
 * - Content globs for app + components.
 * - Theme colors: primary Green (#16a34a), secondary Earth (#8B7355)
 * - Font family: Inter (plus Caveat override used in the demo UI)
 * - Extend spacing/borderRadius as needed by components
 * Feature references: 9.9 (collapse sidebar), 17.5 (theme selector 8.5).
 * ============================================================================
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#16a34a",
					dark: "#14532d",
				},
				secondary: "#8B7355",
				sidebar: "#3E2A21",
				"sidebar-active": "#4E3A2E",
				canvas: "#F7F4EC",
				ink: "#221A15",
				border: "#E7E1D3",
				caution: {
					bg: "#FDECD8",
					text: "#B45309",
				},
				optimal: {
					bg: "#E4F1E0",
					text: "#166534",
				},
				dry: {
					bg: "#FBE9E9",
					text: "#B91C1C",
				},
			},
			fontFamily: {
				serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
				mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
				sans: ["Inter", "system-ui", "sans-serif"],
			},
			borderRadius: {
				xl: "0.75rem",
				"2xl": "1rem",
			},
		},
	},
	plugins: [],
};
