'use client';

import { useState } from 'react';
import { Phone, Lock, User, Eye, EyeOff, Leaf } from 'lucide-react';
import { authAPI, setSession } from '@/lib/api/client';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authAPI.signup({
        full_name: fullName.trim(),
        phone_number: phone.trim(),
        password,
        language: 'en',
        sms_enabled: true,
      });
      setSession(res.token, res.refresh_token, res.user);
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Signup error:', err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to create account. Please check your details.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full flex flex-col items-center text-center text-white px-4">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-[11px] font-semibold text-emerald-300 uppercase tracking-wider mb-6 backdrop-blur-sm">
        <Leaf className="w-3 h-3 text-emerald-400" />
        <span>Join Amatsi</span>
      </div>

      <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight mb-3">
        Join <span className="text-amber-500 font-serif">Amatsi</span>
      </h1>

      <p className="text-xs text-stone-200/80 max-w-sm mb-8 leading-relaxed font-light">
        Create your account to get irrigation advice for your farm, weather
        updates, and SMS alerts when it is time to water.
      </p>

      {error && (
        <div className="w-full mb-4 p-2.5 rounded-lg bg-red-900/80 border border-red-500/50 text-xs text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="w-full space-y-4 text-left">
        <div>
          <label className="block text-xs font-semibold text-stone-200 mb-1.5">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-3.5 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Joseph Mwangi"
              required
              className="w-full bg-stone-900/50 border border-stone-600/60 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-400 outline-none backdrop-blur-md transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-200 mb-1.5">
            Phone Number
          </label>
          <div className="relative flex items-center">
            <Phone className="absolute left-3.5 w-4 h-4 text-stone-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0712345678"
              required
              className="w-full bg-stone-900/50 border border-stone-600/60 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-400 outline-none backdrop-blur-md transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-200 mb-1.5">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-stone-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="w-full bg-stone-900/50 border border-stone-600/60 focus:border-emerald-500 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-stone-400 outline-none backdrop-blur-md transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-stone-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-white hover:bg-stone-100 text-stone-900 font-bold py-3 rounded-xl text-sm transition-all shadow-lg active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="relative w-full my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="border-t border-stone-600/40 w-full" />
        </div>
      </div>

      <button
        type="button"
        onClick={onSwitchToLogin}
        className="w-full bg-stone-900/40 hover:bg-stone-800/60 border border-stone-600/50 text-white font-bold py-3 rounded-xl text-sm backdrop-blur-md transition-all text-center"
      >
        Sign In Instead
      </button>

      <p className="text-[10px] text-stone-400/80 mt-8 leading-relaxed max-w-xs">
        By signing up, you agree to Amatsi's terms of service.
      </p>
    </div>
  );
}
