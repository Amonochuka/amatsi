/*
 * ============================================================================
 * app/dashboard/farms/page.tsx — MY FARMS
 * Component: Person E (Frontend Developer)
 *
 * Full CRUD for the farmer's fields/plots.
 *
 * WHAT NEEDS TO BE DONE (Feature 6.x — My Farms):
 * 6.1  Farm List         — Cards for all farms
 * 6.2  Farm Card         — Name, crop, area, status indicator
 * 6.3  Farm Status       — Show the latest recommendation status per farm
 * 6.4  Add Farm Button   — Opens the add-farm form
 * 6.5  Add Farm Form     — Full form for a new farm
 * 6.6  Farm Name Field   — Input for farm name
 * 6.7  Farm Location     — <FarmMap/> location picker OR GPS coordinates
 * 6.8  Field Size Field  — Area in hectares
 * 6.9  Crop Type Dropdown— Maize, Beans, Tomatoes, Onions, Cabbage,
 *                          Potatoes, Rice
 * 6.10 Planting Date     — Date picker
 * 6.11 Soil Type Dropdown— Loam, Clay, Sandy, Silt, Other
 * 6.12 Irrigation Method — Drip, Sprinkler, Furrow, Manual
 * 6.13 Tank Capacity     — Water tank capacity in liters
 * 6.14 Edit Farm Form    — Edit existing farm details (pre-filled)
 * 6.15 Delete Farm       — Delete with confirmation dialog
 *
 * Implementation notes:
 * - API: createFarm/updateFarm/deleteFarm/getFarms (lib/api/client.ts).
 * - Reuse <FarmMap/> for the location field.
 * - Form validation + loading states (Feature 2.4/2.5 patterns).
 *
 * Feature references: 6.1–6.15, 15.11 (activity log).
 * ============================================================================
 */