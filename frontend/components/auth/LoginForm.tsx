'use client';

import { useState } from 'react';
import { Phone, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import { authAPI, setSession } from '@/lib/api/client';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const SESSION_MESSAGES: Record<string, string> = {
  expired: 'Your session has expired. Please log in again to continue.',
  revoked: 'Your session has been closed. Please log in again to continue.',
};

function getBannerReason(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('reason');
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [phone, setPhone] = useState('0712345678');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionNotice] = useState<string | null>(() => {
    const reason = getBannerReason();
    return reason ? (SESSION_MESSAGES[reason] ?? SESSION_MESSAGES.expired) : null;
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authAPI.login({ phone_number: phone.trim(), password });
      setSession(res.token, res.refresh_token, res.user);
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Login error:', err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Failed to authenticate. Please check your credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center text-white">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b3127]/60 border border-[#2d5241]/80 text-[10px] font-semibold text-[#6ee7b7] uppercase tracking-wider mb-5 backdrop-blur-sm">
        <Leaf className="w-3 h-3 text-[#34d399]" />
        <span>Welcome back</span>
      </div>

      <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight mb-3">
        Karibu <span className="text-[#f59e0b] font-serif">mkulima!</span>
      </h1>

      <p className="text-[11px] text-stone-200/90 max-w-xs mb-6 leading-relaxed font-normal">
        Sign in to view your soil and weather updates, check your irrigation
        advice, and review your SMS alerts.
      </p>

      {sessionNotice && (
        <div className="w-full mb-4 p-2.5 rounded-lg bg-amber-950/80 border border-amber-500/50 text-xs text-amber-200 text-center backdrop-blur-sm">
          {sessionNotice}
        </div>
      )}

      {error && (
        <div className="w-full mb-4 p-2.5 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-200 text-center backdrop-blur-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="w-full space-y-3.5 text-left">
        <div>
          <label className="block text-[11px] font-medium text-stone-200 mb-1">
            Phone Number
          </label>
          <div className="relative flex items-center">
            <Phone className="absolute left-3.5 w-4 h-4 text-stone-300 pointer-events-none z-10" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0712345678"
              required
              className="w-full bg-[#2a241e]/40 border border-[#524337]/60 focus:border-[#f59e0b] rounded-lg py-2.5 pl-10 pr-4 text-xs text-white outline-none backdrop-blur-sm transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-stone-200 mb-1">
            Password
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-4 h-4 text-stone-300 pointer-events-none z-10" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#2a241e]/40 border border-[#524337]/60 focus:border-[#f59e0b] rounded-lg py-2.5 pl-10 pr-10 text-xs text-white outline-none backdrop-blur-sm transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-stone-300 hover:text-white transition-colors z-10"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-white hover:bg-stone-100 text-[#1b3127] font-bold py-2.5 rounded-lg text-xs transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>

      <div className="relative w-full my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-400/30" />
        </div>
        <span className="relative z-10 px-3 bg-transparent text-[10px] text-stone-300 font-medium">
          New to Amatsi?
        </span>
      </div>

      <button
        type="button"
        onClick={onSwitchToSignup}
        className="w-full bg-[#2a241e]/30 hover:bg-[#2a241e]/50 border border-[#524337]/50 text-white font-semibold py-2.5 rounded-lg text-xs backdrop-blur-sm transition-all"
      >
        Sign Up
      </button>

      <p className="text-[9px] text-stone-300/80 mt-6 leading-relaxed max-w-xs">
        By logging in, you agree to Amatsi's terms of service.
      </p>
    </div>
  );
}
