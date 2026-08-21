/**
 * Footer - Page footer appears at bottom of every page
 * 
 * LAYOUT:
 * - Four column grid on desktop (md+), single column on mobile
 * 
 * COLUMN 1: KijaniFarmer brand
 *   - Brand name "KijaniFarmer"
 *   - Brief description: "Smart irrigation management for smallholder farmers."
 *   - Save water, increase yields message
 * 
 * COLUMN 2: Product links
 *   - Overview
 *   - Three Tiers
 *   - Features
 * 
 * COLUMN 3: Resources links
 *   - Documentation
 *   - API (coming soon)
 * 
 * COLUMN 4: Company links
 *   - About
 *   - Contact
 * 
 * BOTTOM SECTION:
 * - Copyright line: "© 2026 KijaniFarmer. Built for Zone01 Kisumu GreenTech Hackathon."
 * - Social/utility links grid:
 *   - Demo Mode (links to demo or highlights demo section)
 *   - Privacy Policy
 *   - Terms of Service
 *   - Contact
 * 
 * RESPONSIVE:
 * - md:grid-cols-4 (4 columns on tablet+)
 * - grid-cols-1 (1 column on mobile)
 * - gap-8 between columns on desktop
 * - gap-4 between columns on mobile
 * - pt-8 pb-4 above bottom section
 * - border-t border-gray-700 separates top from bottom
 * - pt-4 pt-md-0 padding top for bottom section
 * - justify-between items-center align items and justify
 * 
 * DEMO MODE PROMINENCE:
 * - Demo Mode link is primary action in footer
 * - Large and prominent (text-sm with hover effect)
 * - Links to demo experience showing full system capability
 * - Always accessible from any page for potential users to try
 * 
 * CONTACT INFORMATION (consider adding in column 4):
 * - Phone: +2547XXXXXXXX (hardware inquiries)
 * - Email: hardware@kijanifarmer.com
 * 
 * CONNECTIONS:
 * - Footer links are static (no useState needed for most)
 * - Demo Mode onClick can navigate to /demo page or show modal
 * - Privacy/Terms links may open in new tabs
 * - Contact link may open mailto: or modal with contact info
 * 
 * BRANDING CONSISTENCY:
 * - Text color: text-gray-300 (light mode) / text-gray-200 (dark mode inferred)
 * - Hover: text-white transition
 * - Border: border-t border-gray-700 dark:border-gray-600
 * - Background: bg-gray-800 dark:bg-gray-900
 */

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1: Brand */}
        <div>
          <h4 className="font-bold mb-4">KijaniFarmer</h4>
          <p className="text-sm">
            Smart irrigation management for smallholder farmers. Save water, increase yields.
          </p>
        </div>
        
        {/* Column 2: Product */}
        <div>
          <h5 className="font-bold mb-4">Product</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#overview" className="hover:text-white transition-colors">Overview</a></li>
            <li><a href="#tiers" className="hover:text-white transition-colors">Three Tiers</a></li>
            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
          </ul>
        </div>
        
        {/* Column 3: Resources on theSD-- models a
 dataest className="font-bold mb-4">Resources</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#api" className="hover:text-white transition-colors">API</a></li>
          </ul>
        </div>
        
        {/* Column 4: Company */}
        <div>
          <h5 className="font-bold mb-4">Company</h5>
          <ul className="space-y-2 text-sm">
            <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>
      
      {/* Bottom copyright and utility links section */}
      <div className="border-t border-gray-700 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center pt-4">
        <p className="text-sm">© 2026 KijaniFarmer. Built for Zone01 Kisumu GreenTech Hackathon.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-gray-300 transition-colors text-sm">Demo Mode</a>
          <a href="#" className="hover:text-gray-300 transition-colors text-sm">Privacy</a>
          <a href="#" className="hover:text-gray-300 transition-colors text-sm">Terms</a>
          <a href="#" className="hover:text-gray-300 transition-colors text-sm">Contact</a>
        </div>
      </div>
    </footer>
  );
}