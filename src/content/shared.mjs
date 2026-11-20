// Content blocks used on several pages. Text is from the original website (homepage "Use Cases").
// These are customer examples as published by Bedding Boxes Direct; they are shown with a
// "not independently verified" note (see components.cases). Do not change the numbers.
export const HOME_CASES = [
  { label: 'Storm Sewer Installation', text: 'On a highway storm sewer installation, the crew used a 12 yard bedding box to stage stone directly alongside 400 feet of open trench; instead of making 20 loader trips with smaller boxes, they only needed 11, cutting machine cycles by 45% and finishing bedding placement a full day ahead of schedule.' },
  { label: 'Municipal Water Main Replacement', text: 'On a large municipal water main replacement, the contractor deployed three 12 yard bedding boxes along an 800-foot trench. By strategically placing the boxes every 250 feet, operators cut down from 36 loader trips to just 20. The crew was able to keep material staged exactly where it was needed, reducing handling by 44% and shaving two full days off the project timeline.' },
  { label: 'Electrical Conduit Installation', text: 'On a commercial electrical conduit installation, the crew positioned a 7 yard bedding box beside a 150-foot trench. Instead of hauling gravel 14 times with smaller containers, they completed the job with just 8 trips, a 43% reduction. Keeping bedding material close to the trench sped up conduit placement and allowed the project to wrap up half a day earlier than planned.' },
  { label: '10 Mile Pipeline', text: 'On a 10-mile water transmission pipeline installation, the contractor deployed 10 12-yard bedding boxes, staged every half-mile along the trench. Without bedding boxes, the crew would have needed around 600 loader trips to keep stone bedding moving along the line. With the boxes strategically placed, that number dropped to 340 trips, eliminating 260 loader runs in total. At $85/hour per loader, averaging 20 minutes per trip, the savings in machine time alone topped $7,350. Add in labor costs of roughly 20 crew days saved at $1,200/day, and the project realized over $24,000 in direct cost reductions in just one phase of construction. Beyond the dollars, the streamlined setup kept the project weeks ahead of schedule, critical on a job of that size.' },
  { label: 'Municipal Use', text: 'Over the course of a year, a municipality used a 9 yard bedding box on more than a dozen sewer and water line projects. By cutting loader trips from 18 to 10 on each trench section, they saved 8 cycles per job. At an average of $85/hour for loader time (20 minutes per cycle) that equaled about $227 saved per project in machine costs. Spread across 12 projects, that’s $2,724 in equipment savings. Add in the labor savings of roughly one full day per project at $1,200/day, and the municipality saved over $16,000 in direct costs in just one year.' },
  { label: 'Contractor Bills for Use', highlight: true, text: 'A regional contractor working on municipal water projects purchased three 9-yard bedding boxes at $11,600 each. They began charging $200/day per box on city invoices (the same way they bill trench shields). In the first six months, those boxes were billed on 18 separate projects, generating over $32,000 in revenue while simultaneously saving the company an estimated $18,000 in labor/equipment costs.' },
];

export const caseByLabel = (label) => HOME_CASES.find((c) => c.label === label);

// The "Designed to Fit Your Operation" table used on several original pages.
export const FIT_TABLE = [
  ['2.25–3 YD³', 'Under 10–15T', 'Under 70–90 HP'],
  ['5–7 YD³', '10–30T', '70–200 HP'],
  ['9–12 YD³', '25–40T+', '170–225 HP+'],
  ['14–18 YD³', '35–50T+', '350 HP+'],
];

// Statement used everywhere bedding boxes are compared to trench protection (Phase 16 safeguard).
export const NOT_SHORING = 'A bedding box is a steel container for handling and staging bedding material. It is not trench protection and is not a substitute for a trench shield, trench box or shoring system. Follow OSHA excavation standards (29 CFR 1926 Subpart P) and keep the box a safe distance from the trench edge.';

// RENTAL FLEET PROFITABILITY EXAMPLES — illustrative calculations, NOT customer stories.
// Inputs: our list prices + bundle discounts (src/data), a published regional rental rate sheet
// (rock box ≈ $900 per 4 weeks for 7–7.5 yd, ≈ $1,200 per 4 weeks for 9 yd), 13 four-week periods
// per year, and 65% time utilization (common industry target of 65–75%). Edit RATES/UTIL to update.
import { productBySize } from '../data/products.mjs';
import { BUNDLES } from '../data/offers.mjs';
export const RENTAL_ASSUMPTIONS = { rate4wk: { 7: 900, 9: 1200 }, periods: 13, util: 0.65 };
const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
export function rentalExamples() {
  const { rate4wk: R, periods: P, util: U } = RENTAL_ASSUMPTIONS;
  const p7 = productBySize(7).price, p9 = productBySize(9).price;
  const [b10, b20] = BUNDLES;
  // 1) one 9-yard box
  const rev9 = R[9] * P * U, months9 = (p9 / (R[9] * U)) * 12 / 13;
  // 2) 10-box mixed bundle: five 7 yd + five 9 yd
  const list10 = 5 * p7 + 5 * p9, save10 = list10 * b10.discount / 100, cost10 = list10 - save10;
  const rev10 = (5 * R[7] + 5 * R[9]) * P * U, months10 = (cost10 / ((5 * R[7] + 5 * R[9]) * U)) * 12 / 13;
  // 3) 20 x 9-yard across branches: value of +10 points of utilization
  const list20 = 20 * p9, save20 = list20 * b20.discount / 100, cost20 = list20 - save20;
  const rev20 = 20 * R[9] * P * U, lift = 20 * R[9] * P * 0.10;
  return [
    { label: 'One 9-Yard Box: Payback Math', text: `A 9-yard box lists at ${usd(p9)}. At a rental rate of ${usd(R[9])} per 4 weeks and ${Math.round(U * 100)}% time utilization, it brings in about ${usd(R[9] * U)} per 4-week period, or roughly ${usd(rev9)} a year. That pays back the purchase price in about ${months9.toFixed(0)} months, and every rental after that is margin for the life of the box.` },
    { label: '10-Box Mixed Bundle: Stocking a Branch', text: `Five 7-yard and five 9-yard boxes list at ${usd(list10)}. The ${b10.boxes}-box bundle takes ${b10.discount}% off, saving ${usd(save10)} up front for a total of ${usd(cost10)}. At ${usd(R[7])} and ${usd(R[9])} per 4 weeks and ${Math.round(U * 100)}% utilization, the ten boxes can generate about ${usd(rev10)} a year, paying back in roughly ${months10.toFixed(0)} months.` },
    { label: '20 Boxes Across Branches: Why Durability Pays', text: `Twenty 9-yard boxes list at ${usd(list20)}; the ${b20.boxes}-box bundle saves ${b20.discount}% (${usd(save20)}), for ${usd(cost20)}. At ${Math.round(U * 100)}% utilization they can earn about ${usd(rev20)} a year. Every 10 points of utilization you add, by keeping boxes out of the repair bay and back on rent, is worth about ${usd(lift)} more per year across the fleet. That is why thicker steel, reinforced corners and welded skid plates matter.`, highlight: true },
  ];
}
export const RENTAL_NOTE = 'Illustrative examples, not customer results. Based on Bedding Boxes Direct list prices and bundle discounts, a published regional rental rate sheet (about $900 per 4 weeks for 7–7.5 yd and $1,200 per 4 weeks for 9 yd rock boxes), 13 four-week periods per year and 65% time utilization (a common rental-industry target is 65–75%). Freight, taxes, maintenance and your local rates are not included and will change the results.';
