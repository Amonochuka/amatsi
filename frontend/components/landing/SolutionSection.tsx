/**
 * SolutionSection - Landing page three-tier solution explanation
 * 
 * PURPOSE:
 * - Explains the three-tier KijaniFarmer irrigation management system
 * - Shows how farmers can progress from simple advisory to full automation
 * - No dropdowns, no budgets, no soil type selection - AI infers from satellite data
 * 
 * THREE TIER CARDS (grid of 3):
 * 
 * Tier 1: Advisory (Free - No Hardware Required) - bg-green-100
 * - Icon: "1" - text-4xl font-bold text-green-600 mb-2
 - h3 "Advisory" - text-xl font-bold text-gray-800
 - p: "AI-powered daily recommendations, SMS alerts, crop planning. No hardware required."
 - Key features listed:
   - Daily AI recommendations
   - Automated SMS alerts
   - Multi-phone SMS support
   - English, Kiswahili, Luo languages
   - Offline-first functionality
   - Realtime dashboard updates
   - Water usage advice in SMS
   - Recommendation history
   - Water saved tracking
   - Weather display
   - Soil moisture display
   - Tank level display
   - Water usage chart
   - Recent alerts
   - Crop planning
 * 
 * Tier 2: Monitoring (With Sensors) - bg-blue-100
 - Icon: "2" - text-4xl font-bold text-blue-600 mb-2
 - h3 "Monitoring" - text-xl font-bold text-gray-800
 - p: "Tank level sensors, soil moisture sensors, water usage monitoring. Hardware enabled."
 - Key features listed:
   - Tank capacity tracking
   - Tank level tracking
   - Multiple tank support
   - Tank level sensor option
   - Soil moisture sensor option
   - Flow meter option
   - Water usage monitoring
   - Real-time sensor data display
 * 
 * Tier 3: Automation (Full System) - bg-purple-100
 - Icon: "3" - text-4xl font-bold text-purple-600 mb-2
 - h3 "Automation" - text-xl font-bold text-gray-800
 - p: "Full automated irrigation, AI-controlled water release, SMS notifications of actions."
 - Key features listed:
   - Automated irrigation control
   - AI-triggered watering
   - Hardware integration
   - Action notifications via SMS
   - Water savings tracking
   - Yield impact tracking
 * 
 * HOW IT WORKS SECTION BELOW CARDS:
 - h3 "How It Works" - text-2xl font-bold text-gray-800 mb-4
 - ol list-decimal list-inside space-y-2 text-gray-600 text-sm
   - li: Farmer provides simple text inputs (crop, field size, water source)
   - li: AI analyzes satellite data (soil type, topography, rainfall history)
   - li: System recommends irrigation method and sends SMS alerts
   - li: When sensors are added, automation triggers automatically
 * 
 * DESIGN PHILOSOPHY:
 * - Three columns grid (grid-cols-1 md:grid-cols-3 gap-8)
 * - md: 3 columns on tablet+, 1 column on mobile
 * - Each tier has distinct background color for visual distinction
 * - Number icons (1, 2, 3) in larger size for emphasis
 * - Text colors coordinated with background (gray-800 for readability)
 - Hover effects not on tier cards (they're informational, not interactive links)
 *  - How it works list has hover-friendly links
 * - Follows "simplicity first" - no complex configuration screens
 * - AI as Extension Officer concept: satellite data, not farmer guesses
 * 
 * RESPONSIVE:
 * - Mobile: 1 column, tiers stack vertically
 * - Tablet+/desktop: 3 columns side by side
 * - Text and numbers scale appropriately
 * 
 * CONNECTIONS:
 * - Purely presentational - no API calls
 * - References the 41 total features from the design specification
 * - Statistics from ProblemSection (40%, 70%, 60%) connect to this explanation
 * - CTASection "Get Started Free" button connects to here
 * - Three-tier concept flows into dashboard pages
 */

export default function SolutionSection() {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Three-tier explanation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Tier 1: Advisory */}
          <div className="p-6 rounded-lg bg-green-100">
            <div className="text-4xl font-bold text-green-600 mb-2">1</div>
            <h3 className="text-xl font-bold text-gray-800">Advisory (Free)</h3>
            <p className="text-gray-600 text-sm">
              AI-powered daily recommendations, SMS alerts, crop planning. No hardware required.
            </p>
          </div>
          {/* Tier 2: Monitoring */}
          <div className="p-6 rounded-lg bg-blue-100">
            <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
            <h3 className="text-xl font-bold text-gray-800">Monitoring</h3>
            <p className="text-gray-600 text-sm">
              Tank level sensors, soil moisture sensors, water usage monitoring. Hardware enabled.
            </p>
          </div>
          {/* Tier 3: Automation */}
          <div className="p-6 rounded-lg bg-purple-100">
            <div className="text-4xl font-bold text-purple-600 mb-2">3</div>
            <h3 className="text-xl font-bold text-gray-800">Automation</h3>
            <p className="text-gray-600 text-sm">
              Full automated irrigation, AI-controlled water release, SMS notifications of actions.
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
            <li>
              Farmer provides simple text inputs (crop, field size, water source)
            </li>
            <li>
              AI analyzes satellite data (soil type, topography, rainfall history)
            </li>
            <li>
              System recommends irrigation method and sends SMS alerts
            </li>
            <li>
              When sensors are added, automation triggers automatically
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}