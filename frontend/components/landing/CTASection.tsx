/**
 * CTASection - Call to action section at bottom of landing page
 * 
 * PURPOSE:
 * - Primary conversion point for the landing page
 * - Two primary actions: Create Free Account or Launch Demo Mode
 * - Follows simplicity-first design - no complex forms in hero area
 * 
 * HEADING:
 * - "Ready to Save Water?" - text-3xl md:text-4xl font-bold text-gray-800 mb-6
 * - Large, prominent, centers the main value proposition
 * 
 * SUBHEADING:
 * - "Join thousands of smallholder farmers using AI to optimize irrigation and reduce water bills by 40-60%."
 * - text-lg text-gray-600 mb-8 max-w-2xl mx-auto
 * - Explains the tangible benefit (water bill reduction)
 * - max-w-2xl centers the text, prevents it from stretching too wide
 * 
 * CTA BUTTONS ROW:
 * - Two buttons in flex container, centered on screen
 * - justify-center class ensures they're centered
 * 
 * Button 1: "Create Free Account"
 - bg-green-600 text-white rounded-full px-8 py-3 text-lg font-medium
 - hover:bg-green-700 transition-colors (smooth color change on hover)
 - On click: navigates to /auth/signup page
 - Primary action - most prominent (green background)
 * 
 * Button 2: "Launch Demo Mode"
 - bg-transparent border-2 border-green-600 rounded-full px-8 py-3 text-lg font-medium
 - hover:bg-green-100 transition-colors (green border, subtle background on hover)
 - On click: navigates to /dashboard or shows demo modal
 - Secondary action - outlined button for users who want to try first
 * 
 * DESIGN PHILOSOPHY:
 * - Two clear options: sign up or try demo
 - Green color scheme reinforces KijaniFarmer brand
 - Contrast between filled button (primary) and outlined button (secondary)
 - Transition colors provide feedback on hover
 - Text "40-60% water savings" in subheading reinforces value proposition
 - No complex features or pricing tiers displayed - keep it simple
 * 
 * RESPONSIVE:
 * - On mobile: buttons stack vertically (flex-col), centered
 * - On tablet+/desktop: buttons side by side (flex-row), centered
 - Gap-4 between buttons ensures touch-friendly spacing
 - Max width constraints prevent buttons from being too wide
 * 
 * CONNECTIONS:
 * - "Create Free Account" links to /auth/signup
 * - "Launch Demo Mode" links to overview section or /demo page
 * - Statistics (40-60% water savings) reference ProblemSection numbers
 * - Three-tier explanation connects to SolutionSection above
 * - Footer Demo Mode link also serves same purpose
 * 
 * ACCESSIBILITY NOTES:
 * - Both buttons have descriptive text ("Create Free Account", "Launch Demo Mode")
 * - Sufficient color contrast (green on white, green border on white)
 * - Focus states would be added in production (not shown in this prototype)
 * - ARIA labels could be added for screen readers
 */

export default function CTASection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          Ready to Save Water?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of smallholder farmers using AI to optimize irrigation and
          reduce water bills by 40-60%.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signup" className="bg-green-600 text-white rounded-full px-8 py-3 text-lg font-medium hover:bg-green-700 transition-colors">
            Create Free Account
          </Link>
          <Link href="#overview" className="bg-transparent border-2 border-green-600 rounded-full px-8 py-3 text-lg font-medium hover:bg-green-100 transition-colors">
            Launch Demo Mode
          </Link>
        </div>
      </div>
    </section>
  );
}