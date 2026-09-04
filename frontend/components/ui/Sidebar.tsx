'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bell, Map, Droplets, CalendarDays, Settings } from 'lucide-react';

const mainNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Alerts', href: '/dashboard/alerts', icon: Bell },
  { label: 'Farms', href: '/dashboard/farms', icon: Map },
  { label: 'Irrigation', href: '/dashboard/irrigation', icon: Droplets },
  { label: 'Planner', href: '/dashboard/planner', icon: CalendarDays },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-brand-sidebar text-amber-50/80 flex flex-col justify-between h-screen p-4 select-none shrink-0">
      <div>
        {/* Brand Header */}
        <div className="mb-8 px-2">
          <Link href="/dashboard" className="block group">
            <h1 className="font-serif text-3xl font-semibold text-amber-50 group-hover:text-white transition-colors">
              Amatsi
            </h1>
            <p className="text-[10px] text-amber-200/60 font-mono uppercase tracking-[0.15em] mt-1">
              Smart Irrigation
            </p>
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1.5">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-sidebarActive text-brand-sidebar font-semibold shadow-sm'
                    : 'text-amber-100/70 hover:bg-white/10 hover:text-amber-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}