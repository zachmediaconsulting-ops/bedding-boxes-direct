// MULTI-BOX / FLEET OFFERS — change discounts here and every page, form and ad page updates.
// Wording and savings ranges are from the published /fleet-bedding-box-bundles/ page.
export const BUNDLES = [
  {
    key: '10-box', boxes: 10, discount: 5, anchor: '10-bedding-box-bundle',
    name: '10 Bedding Box Bundle', short: '10 Box Bundle',
    savings: 'Average Savings $4,900–9,250',
    audience: 'For companies that need to stock, expand, or refresh their bedding box inventory while lowering their cost per unit.',
  },
  {
    key: '20-box', boxes: 20, discount: 7, anchor: '20-bedding-box-bundle',
    name: '20 Bedding Box Bundle', short: '20 Box Bundle',
    savings: 'Average Savings $12,000–25,900',
    audience: 'For companies that need to stock multiple locations, or work on multiple large scale projects.',
  },
];

export const LARGE_ORDER = {
  anchor: 'large-fleet-orders', name: 'Large Fleet Orders (20+ Boxes)', short: 'Large Fleet Orders',
  text: 'For larger multistage or multi-location orders please call directly for best terms. We ship nationwide with individual or multi-location delivery.',
};

// Benefits promoted on the bundle page, ad pages and fleet pages (Phase 8 list).
export const BUNDLE_BENEFITS = [
  ['Volume savings', 'Bundle pricing lowers your cost per box on every size.'],
  ['Mixed-size orders', 'Select any mix of bedding box sizes to fit your operation.'],
  ['Rental fleet expansion', 'Stock, expand, or refresh rental inventory at a lower cost per unit.'],
  ['Fleet standardization', 'Give every utility crew the same proven box and the same parts.'],
  ['Custom paint colors', 'Custom colors available upon request to match your fleet.'],
  ['Coordinated shipping', 'One order, one point of contact, delivery planned around your schedule.'],
  ['Multiple delivery locations', 'Ship to one location or split shipments across job sites and branches.'],
  ['Large-order quotations', 'Orders over 20 boxes are quoted directly by our sales team.'],
];

// Quantity choices shown on every lead form ("Estimated Quantity").
export const QUANTITY_OPTIONS = ['1 box', '2–4 boxes', '5–9 boxes', '10–19 boxes (10-box bundle)', '20 boxes (20-box bundle)', 'More than 20 boxes'];

export const discountText = (b) => `Save ${b.discount}%`;
