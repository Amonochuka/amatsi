'use client';

import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Leaf } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('farmer.joe@coop.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        // 2. Persist access token locally if needed
        localStorage.setItem('supabase_token', data.session.access_token);

        // 3. Navigate to main dashboard
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center text-center text-white">
      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1b3127]/60 border border-[#2d5241]/80 text-[10px] font-semibold text-[#6ee7b7] uppercase tracking-wider mb-5 backdrop-blur-sm">
        <Leaf className="w-3 h-3 text-[#34d399]" />
        <span>Welcome Back to Growfold</span>
      </div>

      {/* Header */}
      <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight mb-3">
        Hey! <span className="text-[#f59e0b] font-serif">Farmers</span>
      </h1>

      <p className="text-[11px] text-stone-200/90 max-w-xs mb-6 leading-relaxed font-normal">
        Sign in to check your soil reports, update crop records, or coordinate your next seasonal harvest.
      </p>

      {/* Error Alert Display */}
      {error && (
        <div className="w-full mb-4 p-2.5 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-200 text-center backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleLogin} className="w-full space-y-3.5 text-left">
        {/* Email Field */}
        <div>
          <label className="block text-[11px] font-medium text-stone-200 mb-1">
            Email or Username
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 w-4 h-4 text-stone-300 pointer-events-none z-10" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer.joe@coop.com"
              required
              className="w-full bg-[#2a241e]/40 border border-[#524337]/60 focus:border-[#f59e0b] rounded-lg py-2.5 pl-10 pr-4 text-xs text-white outline-none backdrop-blur-sm transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
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

        {/* Checkbox and Link */}
        <div className="flex items-center justify-between text-[11px] pt-0.5">
          <label className="flex items-center gap-1.5 text-stone-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-stone-600 bg-stone-800 text-emerald-600 focus:ring-0"
            />
            <span>Remember my station</span>
          </label>
          <button
            type="button"
            className="text-[#d97706] hover:text-[#f59e0b] font-semibold transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-white hover:bg-stone-100 text-[#1b3127] font-bold py-2.5 rounded-lg text-xs transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative w-full my-5 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-stone-400/30" />
        </div>
        <span className="relative z-10 px-3 bg-transparent text-[10px] text-stone-300 font-medium">
          New to the Coop?
        </span>
      </div>

      {/* Switch Button */}
      <button
        type="button"
        onClick={onSwitchToSignup}
        className="w-full bg-[#2a241e]/30 hover:bg-[#2a241e]/50 border border-[#524337]/50 text-white font-semibold py-2.5 rounded-lg text-xs backdrop-blur-sm transition-all"
      >
        Sign Up
      </button>

      {/* Terms */}
      <p className="text-[9px] text-stone-300/80 mt-6 leading-relaxed max-w-xs">
        By logging in, you agree to our friendly Farmer Code of Conduct & Cooperative terms.
      </p>
    </div>
  );
}