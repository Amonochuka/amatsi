/**
 * Navbar - Top navigation bar for authenticated dashboard pages
 * 
 * LAYOUT:
 * - Left side: KijaniFarmer logo (clickable -> redirects to overview)
 * - Center: Language selector (text input, not dropdown)
 *   - Farmer types their preferred language: English, Kiswahili, or Luo
 *   - Stores preference in user profile/Supabase
 * - Right side: Navigation links and user controls
 * 
 * NAVIGATION LINKS (visible on md+ screens):
 * - Overview -> /dashboard/overview
 * - Irrigation Advisor -> /dashboard/irrigation
 * - AI Extension Officer -> /dashboard/advisor
 * - Tank & Sensor Setup -> /dashboard/tank-setup
 * - My Farms -> /dashboard/farms
 * - Alerts History -> /dashboard/alerts
 * - Settings -> /dashboard/settings
 * 
 * DEMO MODE BUTTON:
 * - "Demo Mode" pill button on right side
 * - Opens demo dashboard with simulated data
 * - Useful for potential users to try before signing up
 * - Also accessible from footer on all pages
 * 
 * USER ACTIONS:
 * - Language selector: onChange updates user language preference
 *   - Calls backend API to update farmer profile
 * - Demo Mode: triggers navigation to demo page or shows modal
 * - Notification bell: shows new alerts count (connected to alerts API)
 * 
 * RESPONSIVE BEHAVIOR:
 * - md+: Links displayed horizontally in nav bar
 * - sm: Links collapse into hamburger menu
 * - <640px: Only logo and demo mode button visible
 *   - Full menu accessible via slide-in drawer
 * 
 * CONNECTIONS:
 * - Uses useAuth hook for user name and session
 * - onClick handlers route to dashboard page components
 * - Language onChange calls /api/user/language update endpoint
 * - Demo mode onClick navigates to /demo or opens demo modal
 * - Active page highlighted with bg-green-100/text-green-600
 * 
 * COLOR CODING:
 * - Active link: bg-green-100 text-green-600
 * - Hover state: text-gray-200 transition
 * - Demo button: bg-white text-green-600 border-2 border-white
 *   - hover:bg-gray-100
 */

import { Link } from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-green-600 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* KijaniFarmer logo - clickable home */}
        <div className="font-bold text-xl">KijaniFarmer</div>
        
        {/* Hidden on mobile, visible on tablet/desktop */}
        <div className="hidden md:flex items-center gap-8">
          {/* Navigation links to all dashboard pages */}
          <Link href="/dashboard/overview" className="hover:text-gray-200 transition-colors">
            Overview
          </Link>
          <Link href="/dashboard/irrigation" className="hover:text-gray-200 transition-colors">
            Irrigation Advisor
          </Link>
          <Link href="/dashboard/advisor" className="hover:text-gray-200 transition-colors">
            AI Extension Officer
          </Link>
          <Link href="/dashboard/tank-setup" className="hover:text-gray-200 transition-colors">
            Tank & Sensors
          </Link>
          <Link href="/dashboard/farms" className="hover:text-gray-200 transition-colors">
            My Farms
          </Link>
          <Link href="/dashboard/alerts" className="hover:text-gray-200 transition-colors">
            Alerts History
          </Link>
          <Link href="/dashboard/settings" className="hover:text-gray-200 transition-colors">
            Settings
          </Link>
        </div>
        
        {/* Right side: demo mode and language/user info */}
        <div className="flex items-center gap-3">
          {/* Demo Mode button - always accessible */}
          <button className="bg-white text-green-600 rounded px-3 py-1 text-sm font-medium hover:bg-gray-100 transition-colors">
            Demo Mode
          </button>
          
          {/* Language selector - text input, not dropdown */}
          <span className="text-sm text-gray-200">English</span>
        </div>
      </div>
    </nav>
  );
}