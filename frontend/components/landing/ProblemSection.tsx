/**
 * ProblemSection - Landing page problem statistics section
 * 
 * PURPOSE:
 * - Shows three key statistics that justify why KijaniFarmer is needed
 * - Each statistic is a card showing the problem farmers face
 * - Designed with no dropdowns, no budgets, following simplicity first
 * 
 * STATISTICS (3 cards in grid):
 * 
 * Card 1: 40% Water Wasted
 * - Text: "40%" - text-4xl font-bold text-red-600
 * - Label: "Water Wasted" - text-uppercase text-sm text-gray-600
 * - Description: "Excessive irrigation without data"
 * - Styling: p-6 rounded-lg bg-red-50 hover:bg-red-100 transition-colors
 *   - Red color scheme indicates warning/danger
 *   - Hover effect for interactivity
 * 
 * Card 2: 70% No Weather Data
 * - Text: "70%" - text-4xl font-bold text-blue-600
 * - Label: "No Weather Data" - text-uppercase text-sm text-gray-600
 * - Description: "Smallholders lack forecast access"
 * - Styling: p-6 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors
 *   - Blue color scheme indicates information/knowledge gap
 * 
 * Card 3: 60% Crop Losses
 * - Text: "60%" - text-4xl font-bold text-orange-600
 * - Label: "Crop Losses" - text-uppercase text-sm text-gray-600
 * - Description: "Poor planning reduces yields"
 * - Styling: p-6 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors
 *   - Orange color scheme indicates financial impact/loss
 * 
 * PROBLEM DESCRIPTION BELOW CARDS:
 * - h3 "The Problem" - text-2xl font-bold text-gray-800 mb-4
 * - p text-gray-600 text-lg: Explanation of the problem
 * - Smallholder farmers lack access to affordable irrigation management
 - Without data on soil moisture, weather, and tank levels, farmers either
 - over-water (wasting 40%+ of water) or under-water (reducing yields by 60%).
 * 
 * DESIGN PHILOSOPHY:
 * - Three columns grid (grid-cols-1 md:grid-cols-3 gap-8)
 * - md: makes it 3 columns on tablet+, 1 column on mobile
 * - Each card has distinct color for quick visual scanning
 * - Hover effects add interactivity without complexity
 * - Rounded corners and subtle shadows follow modern design
 * - No dropdowns, no complex forms - just information display
 * 
 * RESPONSIVE:
 * - On mobile: 1 column, cards stack vertically
 * - On tablet+/desktop: 3 columns side by side
 * - Text sizes scale appropriately
 * 
 * CONNECTIONS:
 * - Purely presentational - no API calls
 * - Statistics justify the three-tier solution presented later
 * - Numbers referenced in SolutionSection and CTASection
 * - Can be updated later with real data from backend
 */

import Link from "next/link";

export default function ProblemSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Three problem statistic cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* 40% Water Wasted card */}
          <div className="p-6 rounded-lg bg-red-50 hover:bg-red-100 transition-colors">
            <div className="text-4xl font-bold text-red-600">40%</div>
            <div className="text-uppercase text-sm text-gray-600">Water Wasted</div>
            <p className="mt-2 text-sm">Excessive irrigation without data</p>
          </div>
          {/* 70% No Weather Data card */}
          <div className="p-6 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
            <div className="text-4xl font-bold text-blue-600">70%</div>
            <div className="text-uppercase text-sm text-gray-600">No Weather Data</div>
            <p className="mt-2 text-sm">Smallholders lack forecast access</p>
          </div>
          {/* 60% Crop Losses card */}
          <div className="p-6 rounded-lg bg-orange-50 hover:bg-orange-100 transition-colors">
            <div className="text-4xl font-bold text-orange-600">60%</div>
            <div className="text-uppercase text-sm text-gray-600">Crop Losses</div>
            <p className="mt-2 text-sm">Poor planning reduces yields</p>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">The Problem</h3>
          <p className="text-gray-600 text-lg">
            Smallholder farmers lack access to affordable irrigation management.
            Without data on soil moisture, weather, and tank levels, farmers either
            over-water (wasting 40%+ of water) or under-water (reducing yields by 60%).
          </p>
        </div>
      </div>
    </section>
  );
}