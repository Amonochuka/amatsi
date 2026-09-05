'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AuthUser } from '@/types';
import { authAPI, getToken, getRefreshToken, getStoredUser, clearSession } from '@/lib/api/client';

export function useAuth(requireAuth = true) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // A valid session is any stored token — an access token that has expired
    // is fine, the API client refreshes it silently on the next request.
    const authenticated = !!getToken() || !!getRefreshToken();
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
