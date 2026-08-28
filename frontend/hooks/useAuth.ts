'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@/types';
import { authAPI, getToken, getStoredUser, clearSession } from '@/lib/api/client';

export function useAuth(requireAuth = true) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // If a token exists but no user is cached, we are still authenticated —
    // the dashboard pages will load user-related data from the API directly.
    const authenticated = !!getToken();
    if (authenticated && !getStoredUser()) {
      // Token present, no cached profile. Keep them on the page; profile can
      // be refreshed later. For now just mark loading complete.
    }
    setLoading(false);

    if (!authenticated && requireAuth) {
      router.push('/auth/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requireAuth]);

  const refreshProfile = (next: AuthUser) => setUser(next);

  const logout = async () => {
    try {
      if (getToken()) {
        await authAPI.logout();
      }
    } catch {
      // ignore network errors on logout
    } finally {
      clearSession();
      setUser(null);
      router.push('/auth/login');
    }
  };

  return { user, loading, logout, refreshProfile };
}
