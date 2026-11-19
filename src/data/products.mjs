// BEDDING BOX SIZES — the one place to change prices, specs and photos.
//
// Prices: current list prices published on the website (confirmed by the owner 2026-11-19).
// Set `price: null` on a size to show "Call for Pricing" instead.
//
// Specs: from the Bedding Boxes Direct specifications sheet (Rev. 9/23/2025), which is also the
// "bedding-box-specifications-brochure" image. They match the figures stated on each product page.
// Machine ranges are suggestions only — always consult the machine manufacturer (wording from the sheet).

import { readFileSync } from 'node:fs';
import * as p3 from '../content/original/product-3-yard.mjs';
import * as p5 from '../content/original/product-5-yard.mjs';
import * as p7 from '../content/original/product-7-yard.mjs';
import * as p9 from '../content/original/product-9-yard.mjs';
import * as p12 from '../content/original/product-12-yard.mjs';
import * as p14 from '../content/original/product-14-yard.mjs';
import * as p18 from '../content/original/product-18-yard.mjs';

export const PRICE_NOTE = 'Published list price per box. Freight is quoted separately. Ask about multi-box and fleet pricing.';
export const SPEC_SOURCE = 'Specifications sheet Rev. 9/23/2025. *Suggested machine ranges are not guaranteed — always consult the machine manufacturer regarding machine capabilities when determining your needs.';

// Every configuration on the specifications sheet. Inches unless noted. `page` = has its own size page.
export const SPECS = [
  { key: '2.25', label: '2.25 YD³', weight: 2200, A: 138, B: 104, C: 36, D: 52, E: 72, F: 36, G: 45, side: '3/16', ends: '1/4', bottom: '3/8', machine: 'Under 10T', hp: 'Under 70HP' },
  { key: '3', label: '3 YD³', weight: 2350, A: 138, B: 104, C: 36, D: 52, E: 72, F: 47, G: 56, side: '3/16', ends: '1/4', bottom: '3/8', machine: '5T–15T', hp: 'Under 90HP', page: true },
  { key: '5', label: '5 YD³', weight: 4700, A: 165, B: 131, C: 45, D: 62, E: 50, F: 59, G: 68, side: '1/4', ends: '3/8', bottom: '1/2', machine: '10T–25T', hp: '70HP–170HP', page: true },
  { key: '7', label: '7 YD³', weight: 6250, A: 205, B: 161, C: 45, D: 68, E: 80, F: 59, G: 68, side: '1/4', ends: '3/8', bottom: '1/2', machine: '15T–30T', hp: '140HP–200HP', page: true },
  { key: '7W', label: '7W YD³ (Wide)', weight: 6250, A: 165, B: 131, C: 45, D: 68, E: 80, F: 78, G: 87, side: '1/4', ends: '3/8', bottom: '1/2', machine: '15T–30T', hp: '140HP–200HP' },
  { key: '9', label: '9 YD³', weight: 6750, A: 205, B: 161, C: 45, D: 68, E: 80, F: 78, G: 87, side: '1/4', ends: '3/8', bottom: '1/2', machine: '25T–40T', hp: '170HP–250HP', page: true },
  { key: '12', label: '12 YD³', weight: 8000, A: 245, B: 201, C: 45, D: 68, E: 120, F: 78, G: 87, side: '1/4', ends: '3/8', bottom: '1/2', machine: '35T+', hp: '225HP+', page: true },
  { key: '12W', label: '12W YD³ (Wide)', weight: 8000, A: 205, B: 161, C: 45, D: 68, E: 80, F: 92, G: 101, side: '1/4', ends: '3/8', bottom: '1/2', machine: '35T+', hp: '225HP+' },
  { key: '14', label: '14 YD³', weight: 11000, A: 245, B: 201, C: 45, D: 68, E: 120, F: 92, G: 101, side: '3/8', ends: '1/2', bottom: '5/8', machine: '50T+', hp: '350HP+', page: true },
  { key: '18', label: '18 YD³', weight: 12500, A: 284, B: 240, C: 45, D: 68, E: 159, F: 92, G: 101, side: '3/8', ends: '1/2', bottom: '5/8', machine: '50T+', hp: '350HP+', page: true },
];
export const SPEC_ROWS = [
  ['weight', 'Shipping Weight (lbs)'], ['A', 'A – Overall Length (in)'], ['B', 'B – Body Length (in)'], ['C', 'C – Wall Height (in)'],
  ['D', 'D – Overall Height (in)'], ['E', 'E – Ground Contact Length (in)'], ['F', 'F – Inside Width (in)'], ['G', 'G – Overall Width (in)'],
  ['side', 'Side Thickness (in)'], ['ends', 'Front/Back Thickness (in)'], ['bottom', 'Bottom Thickness (in)'],
  ['machine', 'Recommended Machine Weight*'], ['hp', 'Recommended Machine HP*'],
];
export const SUPPORT_CHANNELS = '2.25–5, 7W YD³: 2 support channels per side · 7–9, 12W YD³: 3 per side · 12–14 YD³: 4 per side · 18 YD³: 5 per side';

// Standard features of every box (from the original product pages and homepage).
export const FEATURES = [
  ['Thicker Gauge Sidewalls', 'Built with heavier steel to withstand repeated use, reduce wear, and extend lifespan.'],
  ['Reinforced Corners & Structural Integrity', 'Designed to handle the heaviest material loads without buckling under pressure.'],
  ['Skid Plates', 'Front and rear welded skid plates help the box maneuver while causing less damage to ground.'],
  ['Grab/Push Bars', 'Strategically placed and reinforced for easy maneuvering and placement on site.'],
  ['Rotating Handle Design', 'Helps reduce stress and damage during lifts, prolonging the box’s usability and lowering repair costs.'],
];

// Title + meta description exactly as published on WordPress (src/data/legacy-seo.json, made from the audit).
const LEGACY = JSON.parse(readFileSync(new URL('./legacy-seo.json', import.meta.url), 'utf8'));
const legacy = (path) => ({ title: LEGACY[path].title, description: LEGACY[path].description });

const g = (size, names, alt) => names.map((n) => [n, n.includes('specifications') ? 'Bedding box specifications drawing and size table' : alt || `${size} yard bedding box`]);

// The seven size pages. URLs are the original WordPress product URLs (kept for SEO).
export const PRODUCTS = [
  {
    size: 3, path: '/product/3-yard-bedding-box-for-sale/', price: 6250, content: p3, wpId: 644,
    h1: '3 Yard Bedding Box for Sale',
    summary: 'Compact and maneuverable for mini excavators, tight residential lots and narrow utility trenches.',
    bestFor: ['Mini and compact excavators (5T–15T, under 90HP)', 'Residential utility services and narrow conduit trenches', 'Tight sites between homes, sidewalks and traffic', 'Municipal crews working in confined right-of-way'],
    industries: ['/industries/telecommunications-fiber-contractors/', '/industries/electrical-utility-contractors/', '/bedding-boxes-for-municipalities/'],
    gallery: g(3, ['3-yard-bedding-box-for-sale-3', '3-yard-bedding-box-for-sale-8', '3-yard-bedding-box-for-sale-7', '3-yard-bedding-box-for-sale-5', '3-yard-bedding-box-for-sale-4', '3-yard-bedding-box-for-sale-2', 'bedding-box-specifications-brochure']),
    miniExcavator: true,
  },
  {
    size: 5, path: '/product/5-yard-bedding-box-for-sale/', price: 7834, content: p5, wpId: 432,
    h1: '5 Yard Bedding Box for Sale',
    summary: 'The balance of maneuverability and capacity for residential and municipal sites with tight access.',
    bestFor: ['Excavators in the 10T–25T class (70–170HP)', 'Water and sewer service replacements in subdivisions', 'Municipal sites with limited access', 'Crews stepping up from smaller containers'],
    industries: ['/industries/water-sewer-contractors/', '/bedding-boxes-for-municipalities/', '/industries/site-development-contractors/'],
    gallery: g(5, ['5-yard-bedding-box-for-sale-7', '5-yard-bedding-box-for-sale-8', '5-yard-bedding-box-for-sale-6', '5-yard-bedding-box-for-sale-5', '5-yard-bedding-box-for-sale-2', '5-yard-bedding-box-for-sale-1', '5-yard-bedding-box-for-sale-3', 'bedding-box-specifications-brochure']),
  },
  {
    size: 7, path: '/product/7-yard-bedding-box-for-sale/', price: 9834, content: p7, wpId: 202,
    h1: '7 Yard Bedding Box for Sale',
    summary: 'Balanced capacity for mid- to large-scale excavation. Usually in stock for immediate shipping.',
    bestFor: ['Excavators in the 15T–30T class (140–200HP)', 'Municipal sewer and water replacement', 'Commercial electrical conduit and utility trenching', 'Rental fleets that need a versatile all-round size'],
    industries: ['/bedding-boxes-for-utility-companies/', '/industries/equipment-rental-fleets/', '/bedding-boxes-for-municipalities/'],
    gallery: g(7, ['7-yard-bedding-box-for-sale-3', '7-yard-bedding-box-for-sale-1', '7-yard-bedding-box-for-sale-4', '7-yard-bedding-box-for-sale-6', '7-yard-bedding-box-for-sale-10', '7-yard-bedding-box-for-sale-9', '7-yard-bedding-box-for-sale-7', '7-yard-bedding-box-for-sale-5', 'bedding-box-specifications-brochure']),
    inStock: true,
  },
  {
    size: 9, path: '/product/9-yard-bedding-box-for-sale/', price: 11137, content: p9, wpId: 658,
    h1: '9 Yard Bedding Box for Sale',
    summary: 'More capacity for large municipal, commercial and utility projects. Usually in stock for immediate shipping.',
    bestFor: ['Excavators in the 25T–40T class (170–250HP)', 'Large municipal, commercial and utility projects', 'City sewer and water line expansions', 'Contractors billing box use on municipal invoices'],
    industries: ['/bedding-boxes-for-utility-companies/', '/industries/water-sewer-contractors/', '/industries/pipeline-contractors/'],
    gallery: g(9, ['9-yard-bedding-box-for-sale-2', '9-yard-bedding-box-for-sale-11', '9-yard-bedding-box-for-sale-10', '9-yard-bedding-box-for-sale-8', '9-yard-bedding-box-for-sale-7', '9-yard-bedding-box-for-sale-6', '9-yard-bedding-box-for-sale-4', '9-yard-bedding-box-for-sale-3', '9-yard-bedding-box-for-sale-1']),
    inStock: true,
  },
  {
    size: 12, path: '/product/12-yard-bedding-box-for-sale/', price: 13200, content: p12, wpId: 722,
    h1: '12 Yard Bedding Box for Sale',
    summary: 'Larger volume and fewer loader trips for public works, water mains and long trench runs.',
    bestFor: ['Excavators 35T+ (225HP+)', 'Municipal water main replacement', 'Storm sewer and long open-trench runs', 'Multi-box pipeline staging'],
    industries: ['/industries/pipeline-contractors/', '/industries/water-sewer-contractors/', '/industries/civil-construction-contractors/'],
    gallery: g(12, ['12-yard-bedding-box-for-sale-10', '7-yard-bedding-box-for-sale-4', '12-yard-bedding-box-for-sale-1', '12-yard-bedding-box-for-sale-4', '12-yard-bedding-box-for-sale-5', '12-yard-bedding-box-for-sale-6', '12-yard-bedding-box-for-sale-7', '12-yard-bedding-box-for-sale-8', '12-yard-bedding-box-for-sale-9', 'bedding-box-specifications-brochure']),
  },
  {
    size: 14, path: '/product/14-yard-bedding-box-for-sale/', price: 16750, content: p14, wpId: 821,
    h1: '14 Yard Bedding Box for Sale',
    summary: 'Heavy capacity for large utility and public works jobs where cycle reduction is critical.',
    bestFor: ['Excavators 50T+ (350HP+)', 'Large utility and city sewer expansions', 'Production trenching with long trench sections', 'Contractors billing the box as a pass-through cost'],
    industries: ['/bedding-boxes-for-utility-companies/', '/industries/underground-utility-construction/', '/industries/civil-construction-contractors/'],
    gallery: g(14, ['12-yard-bedding-box-for-sale-8', '12-yard-bedding-box-for-sale-1', '9-yard-bedding-box-for-sale-8', '9-yard-bedding-box-for-sale-7', '9-yard-bedding-box-for-sale-6', 'bedding-box-specifications-brochure']),
    sidewallOptions: ['1/4" Reinforced Steel (Standard)', '3/8" Reinforced Steel (Extra Heavy-Duty)', '1/2" Reinforced Steel (Extreme-Duty)'],
  },
  {
    size: 18, path: '/product/18-yard-bedding-box-for-sale/', price: 18500, content: p18, wpId: 855,
    h1: '18 Yard Bedding Box for Sale',
    summary: 'Maximum capacity for high-volume trenching, pipeline and infrastructure projects.',
    bestFor: ['Excavators 50T+ (350HP+)', 'Regional water main and transmission line projects', 'Pipeline and highway infrastructure', 'High-volume trenching where uptime is critical'],
    industries: ['/industries/pipeline-contractors/', '/industries/civil-construction-contractors/', '/bedding-boxes-for-utility-companies/'],
    gallery: g(18, ['18-yard-bedding-box-for-sale', '12-yard-bedding-box-for-sale-1', '9-yard-bedding-box-for-sale-8', '9-yard-bedding-box-for-sale-7', '9-yard-bedding-box-for-sale-6', 'bedding-box-specifications-brochure']),
    sidewallOptions: ['1/4" Reinforced Steel (Standard)', '3/8" Reinforced Steel (Extra Heavy-Duty)', '1/2" Reinforced Steel (Extreme-Duty)'],
  },
].map((p) => ({ ...p, ...legacy(p.path), spec: SPECS.find((s) => s.key === String(p.size)), label: `${p.size} Yard Bedding Box`, image: p.gallery[0][0] }));

export const productBySize = (size) => PRODUCTS.find((p) => p.size === Number(size));
export const priceText = (p) => (p.price ? `$${p.price.toLocaleString('en-US')}` : 'Call for Pricing');

// AR500 upgrade prices, as published on /ar500-bedding-boxes-for-sale/ ("Current AR500 Upgrade Prices").
export const AR500_PRICES = [
  ['2.25 Yard', 7024.29], ['3 Yard', 8316.77], ['5 Yard', 13757.74], ['7 Yard Wide', 20538.37], ['7 Yard', 17776.31],
  ['9 Yard', 20521.26], ['12 Yard Wide', 26193.23], ['12 Yard', 25208.11], ['14 Yard', 36996.40], ['18 Yard', 42786.11],
];
