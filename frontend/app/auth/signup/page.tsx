/**
 * Signup Page - Wrapper for the signup form
 * 
 * LAYOUT:
 * - KijaniFarmer branding at top
 * - "CREATE YOUR ACCOUNT" headline
 * - Signup form fields:
 *   - Full Name (free text)
 *   - Phone Number (Kenya format +2547XXXXXXXX)
 *   - Password (minimum 8 chars)
 *   - Confirm Password (must match)
 *   - Language (free text: English, Kiswahili, or Luo)
 *     - No dropdown - farmer types language preference
 * - Terms of service link at bottom
 * 
 * ONBOARDING AFTER SIGNUP:
 * - Welcome message with three-tier explanation
 * - Step 1: Add farm details (text inputs only)
 * - Step 2: Set up tank and sensors (optional)
 * - Step 3: Get first AI recommendation
 * - Each step progress saved to Supabase
 * 
 * VALIDATION:
 * - Phone must be valid Kenya number starting with +254
 * - Password minimum 8 characters
 * - Language must be: English, Kiswahili, or Luo
 * - Farm name required for onboarding
 * - At least one field must be filled
 * 
 * CONNECTIONS:
 * - Imports SignupForm component
 * - On successful signup, stores farmer in Supabase
 * - Redirects to /dashboard with onboarding completion status
 * - API call to /api/auth/signup
 * - Farmer record created with: name, phone, language, created_at
 */

import SignupForm from "@/components/auth/SignupForm";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Signup form with three-tier onboarding */}
      <SignupForm />
    </div>
  );
}