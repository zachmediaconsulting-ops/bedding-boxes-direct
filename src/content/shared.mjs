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
