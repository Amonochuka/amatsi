'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export function useAuth(requireAuth = true) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        localStorage.setItem('supabase_token', session.access_token);
      } else if (requireAuth) {
        router.push('/auth/login');
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        localStorage.setItem('supabase_token', session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem('supabase_token');
        if (requireAuth) router.push('/auth/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [requireAuth, router]);

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('supabase_token');
    router.push('/auth/login');
  };

  return { user, loading, logout };
}