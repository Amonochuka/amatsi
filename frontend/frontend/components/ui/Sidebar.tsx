'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, Calendar, Settings, HelpCircle, User, Plus } from 'lucide-react';

const mainNav = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'History', href: '/dashboard/history', icon: History },
  { label: 'Schedule', href: '/dashboard/schedule', icon: Calendar },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-brand-sidebar text-amber-50/80 flex flex-col justify-between h-screen p-4 select-none shrink-0">
      <div>
        {/* Brand Header */}
        <div className="mb-8 px-2">
          <h1 className="font-serif text-2xl font-bold text-amber-50">AgriFlow Smart</h1>
          <p className="text-[11px] text-amber-200/60 font-mono uppercase tracking-wider">Modern Management</p>
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

      {/* Bottom Actions */}
      <div className="space-y-4">
        <button className="w-full bg-brand-brightGreen hover:bg-emerald-600 text-slate-950 font-bold text-xs py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
          <Plus className="w-4 h-4 stroke-[3]" />
          New Field Report
        </button>

        <div className="pt-2 border-t border-amber-900/40 space-y-1 text-xs">
          <Link href="/dashboard/support" className="flex items-center gap-3 px-3 py-2 text-amber-200/70 hover:text-white">
            <HelpCircle className="w-4 h-4" />
            Support
          </Link>
          <Link href="/dashboard/account" className="flex items-center gap-3 px-3 py-2 text-amber-200/70 hover:text-white">
            <User className="w-4 h-4" />
            Account
          </Link>
        </div>
      </div>
    </aside>
  );
}