'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useRealtime<T>(
  table: string,
  onPayload: (payload: T) => void
) {
  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          onPayload(payload.new as T);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onPayload]);
}