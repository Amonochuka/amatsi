'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Theme } from '@/types';

interface ThemeContextValue {
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

/** Ensure this stays in sync with the bootstrap script in app/layout.tsx. */
const STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';
const CYCLE: Theme[] = ['light', 'dark', 'auto'];

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'auto';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* localStorage unavailable — fall through to auto */
  }
  return 'auto';
}

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(DARK_QUERY).matches;
}

function effective(theme: Theme): 'light' | 'dark' {
  return theme === 'auto' ? (systemPrefersDark() ? 'dark' : 'light') : theme;
}

function applyDocument(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);
  root.classList.toggle('dark', resolved === 'dark');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // SSR and first hydration render agree (both "auto") so there is no
  // hydration mismatch; the persisted preference is adopted in a layout
  // effect right after hydration, before paint. The inline script already
  // applied it for first paint, so nothing flashes.
  const [theme, setThemeState] = useState<Theme>('auto');
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');
  const mounted = useRef(false);

  // Adopt the persisted preference (and apply it) once hydrated.
  useLayoutEffect(() => {
    setThemeState(readStoredTheme());
    mounted.current = true;
  }, []);

  // Keep <html> in sync whenever the chosen theme changes.
  useLayoutEffect(() => {
    if (!mounted.current) return;
    const next = effective(theme);
    applyDocument(next);
    setResolved(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore write failures */
    }
  }, [theme]);

  // While in auto mode, follow live system preference changes.
  useLayoutEffect(() => {
    if (theme !== 'auto' || typeof window === 'undefined') return;
    const mq = window.matchMedia(DARK_QUERY);
    const onChange = () => {
      const next = effective('auto');
      applyDocument(next);
      setResolved(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const cycleTheme = useCallback(() => {
    const current = readStoredTheme();
    const idx = CYCLE.indexOf(current);
    setThemeState(CYCLE[(idx + 1) % CYCLE.length]);
  }, []);

  const value = useMemo(
    () => ({ theme, resolved, setTheme, cycleTheme }),
    [theme, resolved, setTheme, cycleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}