/**
 * Landing Page - Main entry point for the KijaniFarmer website
 * 
 * SHOWCASES THE THREE-TIER SYSTEM:
 * Tier 1: Advisory (Free - No Hardware Required)
 *   - AI-powered daily recommendations
 *   - Automated SMS alerts
 *   - Crop planning and water advice
 *   - Extension Officer AI for method selection
 *   - No hardware required
 * Tier 2: Monitoring (With Sensors)
 *   - Tank level sensors
 *   - Soil moisture sensors
 *   - Water usage monitoring
 *   - Real-time data collection
 *   - Automated alerts based on sensor data
 * Tier 3: Automation (Full System)
 *   - Full automated irrigation
 *   - AI-controlled water release
 *   - Sensors trigger irrigation automatically
 *   - SMS notifications of actions taken
 *
 * KEY DESIGN PHILOSOPHIES:
 * - Simplicity First: No dropdowns, no budgets, no soil type selection
 * - AI infers everything from satellite data
 * - Farmers type their needs in plain text
 * - Progressive Complexity: Start simple, add sensors, then automate
 * - Demo Mode: Accessible from footer, shows full system without commitment
 * - AI as Extension Officer: Uses satellite data, not farmer guesses
 */

import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/ui/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Hero section with tagline, problem stats, solution overview, and CTA */}
      <HeroSection />
      {/* Shows key stats: 40% water wasted, 70% no weather data, 60% crop losses */}
      <ProblemSection />
      {/* Explains three tiers: Advisory -> Monitoring -> Automation */}
      <SolutionSection />
      {/* CTA: Get Started Free or Launch Demo Mode */}
      <CTASection />
      {/* Footer with Demo Mode link, privacy, terms, contact info */}
      <Footer />
    </div>
  );
}