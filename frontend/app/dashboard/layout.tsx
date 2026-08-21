/**
 * Dashboard Layout - Main layout for all authenticated dashboard pages
 * 
 * STRUCTURE:
 * - Top Navbar: KijaniFarmer logo, navigation links, language selector, demo mode button
 * - Sidebar: Vertical navigation with links to all dashboard pages
 *     Links include:
 *     - Overview (default landing page)
 *     - Irrigation Advisor
 *     - AI Extension Officer
 *     - Tank & Sensor Setup
 *     - My Farms
 *     - Alerts History
 *     - Settings
 *     - Demo Mode (at bottom of sidebar)
 * - Main Content Area: Central panel displaying the active page
 * - Footer: Footer component with links and copyright
 * 
 * OFFLINE FIRST:
 * - useOffline hook integration for offline mode
 * - Shows "You are offline. Last synced: X minutes ago" banner
 * - "Sync Now" button to manually sync when back online
 * - Recommendations cached locally for offline viewing
 * 
 * RESPONSIVE BEHAVIOR:
 * - Desktop (>1024px): Full sidebar visible, multi-column layout
 * - Tablet (768-1024px): Sidebar collapsible, 2-column content
 * - Mobile (<768px): Hamburger menu, single-column layout
 *   - Sidebar hidden by default, accessible via menu button
 *   - Bottom navigation for key pages on very small screens
 * 
 * USER STATE:
 * - Welcomes farmer by name from auth session
 * - Shows current language preference
 * - Notification bell with new alerts count
 * - Language selector (text input, not dropdown - farmer types language)
 * 
 * NAVIGATION FLOW:
 * Landing -> Login/Signup -> Dashboard (Overview by default)
 * Dashboard pages navigable via sidebar or top navbar
 * Footer Demo Mode link always accessible from any page
 * 
 * CONNECTIONS:
 * - Uses useAuth hook for user session and name
 * - Uses useOffline hook for offline status
 * - Uses useRealtime hook for live data updates
 * - Navbar links connect to dashboard page components
 * - Sidebar onClick events route to appropriate page components
 */

import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOffline } from "@/hooks/useOffline";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { isOnline, lastSync } = useOffline();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Handle online/offline status changes
  useEffect(() => {
    const handleOnline = () => {
      // Sync recommendations when back online
      // TODO: implement sync logic with useRealtime hook
    };
    const handleOffline = () => {
      // Show offline banner
    };
    
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <Navbar user={user} isOnline={isOnline} lastSync={lastSync} />
      <div className="flex min-h-screen">
        {/* Sidebar navigation - collapsible on mobile */}
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} user={user} />
        <div className="flex-1 flex flex-col">
          {/* Header with welcome message and user controls */}
          <Header user={user} />
          <main className="flex-1 p-6 overflow-y-auto">
            {/* Main content - page-specific content injected here */}
            {children}
          </main>
        </div>
      </div>
      {/* Footer with demo mode link and company info */}
      <Footer />
    </div>
  );
}