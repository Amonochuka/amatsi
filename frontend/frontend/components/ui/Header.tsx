'use client';

import { Search, Bell, WifiOff, LogOut } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-brand-bg border-b border-stone-200/60">
      <div className="relative w-80">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Search fields..."
          className="w-full bg-stone-200/50 border-none pl-9 pr-4 py-1.5 rounded-full text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
        />
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="bg-stone-200/60 text-stone-700 font-mono px-3 py-1 rounded-md">
          Offline Mode
        </span>
        <button className="p-1.5 text-stone-600 hover:text-stone-900">
          <Bell className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-stone-600 hover:text-stone-900">
          <WifiOff className="w-4 h-4" />
        </button>
        {user && (
          <span className="text-stone-600 max-w-[140px] truncate hidden sm:inline">
            {user.email}
          </span>
        )}
        <button
          onClick={onLogout}
          className="p-1.5 text-stone-600 hover:text-stone-900"
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 rounded-full bg-stone-300 overflow-hidden border border-stone-300">
          <img src="/images/logo.png" alt="User avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
}
