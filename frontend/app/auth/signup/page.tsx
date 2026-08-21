/**
 * Signup Page - Wrapper for the signup form
 *
 * LAYOUT:
 * - KijaniFarmer branding at top
 * - "CREATE YOUR ACCOUNT" headline
 * - Signup form fields
 * - Terms of service link at bottom
 *
 * CONNECTIONS:
 * - Imports SignupForm component
 * - On successful signup, stores farmer in Supabase
 * - Redirects to /dashboard with onboarding completion status
 */

import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Signup form with three-tier onboarding */}
			<SignupForm />
		</div>
	);
}
