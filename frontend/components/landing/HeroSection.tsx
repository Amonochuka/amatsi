/**
 * HeroSection - Landing page hero section
 * 
 * VISUAL ELEMENTS:
 * - Background image: /images/hero-bg.jpg (hero image showing farmland)
 * - Gradient overlay to make text readable on image
 * - Three-tier system overview at bottom
 * 
 * HEADING:
 * - "AI-Powered Farming for Water Security" - h1, text-5xl md:text-6xl
 * - Font: font-bold, text-white
 * - Margin: mb-6
 * 
 * SUBHEADING:
 * - "Smart irrigation advice for smallholder farmers. Save water, increase yields, plan for climate change."
 * - text-2xl text-white/80 mb-8 max-w-2xl mx-auto
 * - Responsively centered with max width
 * 
 * CTA BUTTONS:
 * - "Get Started Free" - primary action
 *   - bg-white text-green-600 rounded-full px-8 py-3
 *   - text-lg font-medium hover:bg-gray-100 transition-colors
 *   - On click: redirects to /auth/signup or /auth/login
 * - "Learn More" - secondary action
 *   - bg-transparent border-2 border-white rounded-full px-8 py-3
 *   - text-lg font-medium hover:bg-white/10 transition-colors
 *   - On click: scrolls to three-tier explanation or shows overview
 * 
 * THREE-TIER OVERLAY (bottom of hero):
 * - Absolute positioned at bottom-0 left-1/2 -translate-x-1/2
 * - bg-black/60 semitransparent background for readability
 * - text-white text center
 * - px-8 py-12 max-w-2xl
 * - h3 text-2xl font-bold mb-2: "Three Tiers of Irrigation Management"
 * - p text-sm text-white/60: "Start free with AI advisory > Add sensors for monitoring > Automate when hardware is available"
 * 
 * DESIGN PHILOSOPHY:
 * - Full-width hero with background image establishes visual brand
 * - Minimal overlay keeps focus on message
 * - Three-tier summary immediately communicates the value proposition
 * - CTA buttons follow "simplicity first" - no complex animations
 * - Color scheme: green/white/blue matching KijaniFarmer brand
 * 
 * RESPONSIVE:
 * - Text sizes scale from mobile to desktop via md:text-6xl
 * - Buttons stack on mobile (flex-col) side-by-side on desktop (flex-row)
 * - Three-tier overlay max-w-2xl ensures it doesn't stretch too wide
 * - Background image covers properly with bg-cover bg-center
 * 
 * CONNECTIONS:
 * - No direct API calls - purely presentational
 * - CTA button onClick handlers called by parent page
 * - Demo mode mention in three-tier text drives users to footer demo link
 */

export default function HeroSection() {
  return (
    <section className="relative py-24 md:py-32 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          AI-Powered Farming for Water Security
        </h1>
        <p className="text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
          Smart irrigation advice for smallholder farmers. Save water, increase yields, plan for climate change.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-green-600 rounded-full px-8 py-3 text-lg font-medium hover:bg-gray-100 transition-colors">
            Get Started Free
          </button>
          <button className="bg-transparent border-2 border-white rounded-full px-8 py-3 text-lg font-medium hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </div>
      </div>
      {/* Three-tier features overlay */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-black/60 text-white text-center px-8 py-12 max-w-2xl">
        <h3 className="text-2xl font-bold mb-2">Three Tiers of Irrigation Management</h3>
        <p className="text-sm text-white/60">
          Start free with AI advisory {'>'} Add sensors for monitoring {'>'} Automate when hardware is available
        </p>
      </div>
    </section>
  );
}