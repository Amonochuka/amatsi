/**
 * Login Page - Wrapper for the login form
 *
 * LAYOUT:
 * - KijaniFarmer branding at top
 * - Welcome back message
 * - Login form (phone + password)
 * - "Forgot Password?" link below form
 * - "Don't have an account? Sign Up" link
 * - "Continue with SMS OTP" option as alternative
 *
 * DEMO MODE LINK:
 * - Footer section at bottom with: "Launch Demo Mode"
 * - Links to dashboard with simulated data
 * - Allows potential users to try the system without signing up
 * - Shows simulated live dashboard with AI recommendations
 *
 * CONNECTIONS:
 * - Imports LoginForm component
 * - On successful login, redirects to /dashboard/overview
 * - On signup link click, redirects to /auth/signup
 * - Demo mode button triggers local state to show demo dashboard
 * - Connects to backend auth API at /api/auth/login
 */

import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Branding and login form */}
			<LoginForm />
			{/* Demo mode link in footer area */}
		</div>
	);
}
