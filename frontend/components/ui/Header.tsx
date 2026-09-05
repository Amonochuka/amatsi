'use client';

import Link from 'next/link';
import { Bell, LogOut, Monitor, Moon, Sun } from 'lucide-react';
import type { AuthUser } from '@/types';
import { useTheme } from '@/components/theme/ThemeProvider';

interface HeaderProps {
  user: AuthUser | null;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const { theme, cycleTheme } = useTheme();

  const ThemeIcon = theme === 'auto' ? Monitor : theme === 'dark' ? Sun : Moon;
  const themeLabel =
    theme === 'auto' ? 'Theme: auto (system)' : theme === 'dark' ? 'Theme: dark' : 'Theme: light';
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-brand-bg border-b border-stone-200/60">
      <span className="font-serif text-xl font-semibold text-stone-900">
        {user?.full_name ? `Karibu, ${user.full_name}` : 'Dashboard'}
      </span>

      <div className="flex items-center gap-4 text-xs">
        <button
          onClick={cycleTheme}
          className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors"
          title={themeLabel}
          aria-label={themeLabel}
        >
          <ThemeIcon className="w-4 h-4" />
        </button>
        <Link
          href="/dashboard/alerts"
          className="p-1.5 text-stone-600 hover:text-stone-900"
          aria-label="View alerts"
        >
          <Bell className="w-4 h-4" />
        </Link>
        {user && (
          <span className="text-stone-600 max-w-[140px] truncate hidden sm:inline">
            {user.phone_number}
          </span>
        )}
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Log out"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Log out</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-emerald-800 overflow-hidden border border-emerald-900 grid place-items-center text-white font-bold">
          {user?.full_name?.charAt(0)?.toUpperCase() || user?.phone_number?.charAt(0) || 'A'}
        </div>
      </div>
    </header>
  );
}
