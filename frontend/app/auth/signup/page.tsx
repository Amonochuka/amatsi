'use client';

import { useRouter } from 'next/navigation';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-xl font-bold mb-1 text-center">Create Account</h1>
        <p className="text-xs text-muted-foreground mb-6 text-center">
          Start optimizing your farm&apos;s water usage
        </p>
        <SignupForm onSwitchToLogin={() => router.push('/auth/login')} />
      </div>
    </div>
  );
}
