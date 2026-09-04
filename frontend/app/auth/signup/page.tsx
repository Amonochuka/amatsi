'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* 1. Full-screen Full-bleed Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url('/images/hero-bg.jpeg')` }}
      />

      {/* 2. Soft Full-screen Overlay to blend text into image */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* 3. Fully Transparent Card Container */}
      <div className="relative z-10 w-full max-w-sm bg-transparent">
        {isSignUp ? (
          <SignupForm onSwitchToLogin={() => setIsSignUp(false)} />
        ) : (
          <LoginForm onSwitchToSignup={() => setIsSignUp(true)} />
        )}
      </div>
    </main>
  );
}
