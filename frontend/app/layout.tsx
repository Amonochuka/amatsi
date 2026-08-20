/*
 * ============================================================================
 * app/layout.tsx — ROOT LAYOUT
 * Component: Person C (Frontend Developer)
 *
 * This is the root layout for the entire Next.js app. It wraps every route.
 *
 * WHAT NEEDS TO BE DONE:
 * 1. Import global styles (globals.css / styles/tailwind.css).
 * 2. Set <html lang="en"> and metadata (title "KijaniFarmer", description,
 *    viewport, theme-color, icons/logo from /public/images/logo.png).
 * 3. Load fonts (Inter via next/font/google) with the override below.
 * 4. Wrap children in app-wide providers:
 *    - Supabase Auth Provider (context so all pages can access user/auth state)
 *    - Toast/Notification provider (Feature 12.3 — "New recommendation received")
 *    - Language provider (Features 14.1–14.6 — English | Kiswahili | Luo)
 * 5. Register service worker for PWA / offline support (Features 11.10, 19.3, 19.4).
 *
 * Feature references: 19.3 (PWA), 19.4 (Service Worker), 12.3 (Toasts),
 * 14.1-14.6 (Language), 11.10 (Service Worker), 11.11 (PWA install prompt).
 * ============================================================================
 */

// TODO(Person C):
// - Add metadata export for SEO
// - Add <Providers> wrapper (supabase auth, i18n language context, toaster)
// - Register service worker (public/sw.js) for offline caching
// - Keep the Caveat + Inter font overrides to match the current UI

import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}