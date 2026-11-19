// The 48 continental states (Alaska and Hawaii are excluded: we don't ship there).
// tz = the time zone covering most of the state; it picks which sales line the state page shows (src/site.mjs).
// Each state's page content lives in src/content/states/profiles.mjs, keyed by slug.
const S = (name, abbr, tz, region) => ({ name, abbr, tz, region, slug: name.toLowerCase().replace(/\s+/g, '-') });

export const US_STATES = [
  S('Alabama', 'AL', 'Central', 'Southeast'), S('Arizona', 'AZ', 'Mountain', 'Southwest'), S('Arkansas', 'AR', 'Central', 'South Central'),
  S('California', 'CA', 'Pacific', 'West Coast'), S('Colorado', 'CO', 'Mountain', 'Mountain West'), S('Connecticut', 'CT', 'Eastern', 'New England'),
  S('Delaware', 'DE', 'Eastern', 'Mid-Atlantic'), S('Florida', 'FL', 'Eastern', 'Southeast'), S('Georgia', 'GA', 'Eastern', 'Southeast'),
  S('Idaho', 'ID', 'Mountain', 'Mountain West'), S('Illinois', 'IL', 'Central', 'Midwest'), S('Indiana', 'IN', 'Eastern', 'Midwest'),
  S('Iowa', 'IA', 'Central', 'Midwest'), S('Kansas', 'KS', 'Central', 'Great Plains'), S('Kentucky', 'KY', 'Eastern', 'South Central'),
  S('Louisiana', 'LA', 'Central', 'Gulf Coast'), S('Maine', 'ME', 'Eastern', 'New England'), S('Maryland', 'MD', 'Eastern', 'Mid-Atlantic'),
  S('Massachusetts', 'MA', 'Eastern', 'New England'), S('Michigan', 'MI', 'Eastern', 'Great Lakes'), S('Minnesota', 'MN', 'Central', 'Upper Midwest'),
  S('Mississippi', 'MS', 'Central', 'Gulf Coast'), S('Missouri', 'MO', 'Central', 'Midwest'), S('Montana', 'MT', 'Mountain', 'Mountain West'),
  S('Nebraska', 'NE', 'Central', 'Great Plains'), S('Nevada', 'NV', 'Pacific', 'Southwest'), S('New Hampshire', 'NH', 'Eastern', 'New England'),
  S('New Jersey', 'NJ', 'Eastern', 'Mid-Atlantic'), S('New Mexico', 'NM', 'Mountain', 'Southwest'), S('New York', 'NY', 'Eastern', 'Northeast'),
  S('North Carolina', 'NC', 'Eastern', 'Southeast'), S('North Dakota', 'ND', 'Central', 'Great Plains'), S('Ohio', 'OH', 'Eastern', 'Great Lakes'),
  S('Oklahoma', 'OK', 'Central', 'South Central'), S('Oregon', 'OR', 'Pacific', 'Pacific Northwest'), S('Pennsylvania', 'PA', 'Eastern', 'Mid-Atlantic'),
  S('Rhode Island', 'RI', 'Eastern', 'New England'), S('South Carolina', 'SC', 'Eastern', 'Southeast'), S('South Dakota', 'SD', 'Central', 'Great Plains'),
  S('Tennessee', 'TN', 'Central', 'South Central'), S('Texas', 'TX', 'Central', 'South Central'), S('Utah', 'UT', 'Mountain', 'Mountain West'),
  S('Vermont', 'VT', 'Eastern', 'New England'), S('Virginia', 'VA', 'Eastern', 'Mid-Atlantic'), S('Washington', 'WA', 'Pacific', 'Pacific Northwest'),
  S('West Virginia', 'WV', 'Eastern', 'Mid-Atlantic'), S('Wisconsin', 'WI', 'Central', 'Upper Midwest'), S('Wyoming', 'WY', 'Mountain', 'Mountain West'),
];

export const stateBySlug = (slug) => US_STATES.find((s) => s.slug === slug);
export const statePath = (s) => `/bedding-boxes-for-sale/${s.slug}/`;
