'use client';

import { useAuth } from '@/hooks/useAuth';
import { Sidebar } from '@/components/ui/Sidebar';
import { Header } from '@/components/ui/Header';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth(true);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-brand-bg">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-brand-bg overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header user={user} onLogout={logout} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
