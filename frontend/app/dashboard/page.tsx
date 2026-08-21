/**
 * Dashboard Page - Overview page showing farmer's daily dashboard
 * 
 * LAYOUT:
 * - Welcome greeting with farmer name from auth session
 * - Daily Recommendation Card (primary focus)
 * - Weather Card
 * - Soil Moisture Card
 * - Tank Level Card
 * - Water Usage Chart (7 days)
 * - Recent Alerts list
 * 
 * DAILY RECOMMENDATION CARD:
 * - Shows generated time (e.g., "Generated at 06:00 AM today")
 * - SMS sent status with recipient count
 * - Action display: "WAIT" (blue) or "IRRIGATE" (green) with reason
 * - Water saved metric (e.g., "Water saved by waiting: 450L")
 - [Resend SMS] [View History] [Settings] buttons
 * 
 * WEATHER CARD:
 * - Temperature display (e.g., "28°C")
 * - Rain probability (e.g., "78% Rain")
 * - Today/This week indicator
 * 
 * SOIL MOISTURE CARD:
 * - Percentage display (e.g., "64%")
 * - Status label (e.g., "Optimal", "Low", "Critical")
 * - Color coded: Green=Optimal, Yellow=Low, Red=Critical
 * 
 * TANK LEVEL CARD:
 * - Percentage and liters remaining (e.g., "72% (3,600L remaining)")
 * - Tank capacity and current level
 * - Liters remaining calculation
 * 
 * WATER USAGE CHART:
 * - 7-day bar chart showing water usage
 * - Mon-Sun days with liter amounts
 * - Visual bar representation
 * 
 * RECENT ALERTS:
 * - List of recent SMS alerts sent
 * - Each with: timestamp, farm name, action type, status
 * - [Search] [Filter] [Export] controls at bottom
 * 
 * RESPONSIVE:
 * - Desktop: All cards in row, maybe 2-row on smaller desktop
 * - Tablet: Cards may wrap or be in 2 rows
 * - Mobile: Cards stack vertically, full width
 * 
 * CONNECTIONS:
 * - Fetches data from backend API endpoints
 *   - GET /api/dashboard/overview
 *   - GET /api/recommendations/today
 *   - GET /api/weather/current
 *   - GET /api/sensors/tank-level
 *   - GET /api/water-usage/7days
 *   - GET /api/alerts/recent
 * - Connects to useRealtime hook for live updates
 * - Data refetched when user comes online (offline-first)
 * 
 * COLOR CODING (from design spec):
 * - IRRIGATE: Green - action needed
 * - WAIT: Blue - no action needed
 * - MONITOR: Yellow - caution
 * - CONSERVE: Red - critical
 */

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useOffline } from "@/hooks/useOffline";
import { useRealtime } from "@/hooks/useRealtime";
import WeatherCard from "@/components/dashboard/WeatherCard";
import SoilMoistureCard from "@/components/dashboard/SoilMoistureCard";
import TankLevelCard from "@/components/dashboard/TankLevelCard";
import WaterUsageChart from "@/components/dashboard/WaterUsageChart";
import RecentAlerts from "@/components/dashboard/RecentAlerts";
import RecommendationCard from "@/components/dashboard/RecommendationCard";

export default function DashboardPage() {
  const { user } = useAuth();
  const { isOnline, lastSync } = useOffline();
  const { data, isLoading, refetch } = useRealtime("/api/dashboard/overview");
  
  useEffect(() => {
    // Set up realtime subscription for dashboard updates
    // TODO: implement Supabase realtime subscription
    return () => {
      // cleanup subscription
    };
  }, []);
  
  if (isLoading) {
    return <div className="h-96 flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <p className="text-red-600">Please login to view dashboard</p>;
  }
  
  const recommendation = data?.todayRecommendation;
  const weather = data?.weather;
  const soilMoisture = data?.soilMoisture;
  const tankLevel = data?.tankLevel;
  const waterUsage = data?.waterUsage;
  const recentAlerts = data?.recentAlerts;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome greeting with user name and offline indicator */}
      <div className="bg-white shadow-sm p-6 mb-6 rounded-t-lg">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold">Welcome, {user.name || "Farmer"}!</span>
          {/* Language selector */}
          <span className="text-sm text-gray-500">{user.language || "English"}</span>
        </div>
        {/* Offline indicator */}
        {lastSync && (
          <p className="text-xs text-gray-500 mt-1">
            Last synced: {lastSync} ago
          </p>
        )}
      </div>
      
      {/* Row of key cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Daily Recommendation Card */}
        <RecommendationCard recommendation={recommendation} />
        
        {/* Weather Card */}
        <WeatherCard weather={weather} />
        
        {/* Soil Moisture Card */}
        <SoilMoistureCard soilMoisture={soilMoisture} />
        
        {/* Tank Level Card */}
        <TankLevelCard tankLevel={tankLevel} />
      </div>
      
      {/* Water Usage Chart */}
      <WaterUsageChart waterUsage={waterUsage} />
      
      {/* Recent Alerts */}
      <RecentAlerts recentAlerts={recentAlerts} />
    </div>
  );
}