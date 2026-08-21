'use client';

import { useState, useEffect } from 'react';

export function useOffline<T>(key: string, initialData: T) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [data, setData] = useState<T>(() => {
    if (typeof window === 'undefined') return initialData;
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : initialData;
  });

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateData = (newData: T) => {
    setData(newData);
    localStorage.setItem(key, JSON.stringify(newData));
  };

  return { isOnline, data, updateData };
}