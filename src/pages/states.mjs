// STATE LANDING PAGES (Phase 9): /bedding-boxes-for-sale/<state>/ for the 48 continental states,
// plus the state directory at /bedding-boxes-for-sale/. One template + src/content/states.mjs profiles.
// We ship TO each state; we do not claim a location there.
import { esc, icon, img, join } from '../lib.mjs';
import { SITE, TIMEZONE_LINE, phone } from '../site.mjs';
import { PRODUCTS, productBySize, priceText } from '../data/products.mjs';
import { BUNDLES } from '../data/offers.mjs';
import { US_STATES, statePath } from '../data/states.mjs';
import { PROFILES } from '../content/states.mjs';
import { caseByLabel, NOT_SHORING } from '../content/shared.mjs';
import {
  accent, bundleTeaser, button, callButton, cases, featureList, pageTitle, productCard, quoteSection, sectionHead,
} from '../components.mjs';

const HUB = { label: 'Bedding Boxes by State', href: '/bedding-boxes-for-sale/' };
const list = (a) => (a.length > 1 ? `${a.slice(0, -1).join(', ')} and ${a.at(-1)}` : a[0]);

for (const s of US_STATES) if (!PROFILES[s.slug]) throw new Error(`Missing state profile: ${s.slug}`);

function statePage(s) {
  const p = PROFILES[s.slug];
  const line = phone(TIMEZONE_LINE[s.tz]);
  const neighbors = US_STATES.filter((x) => x.region === s.region && x.slug !== s.slug);
  const sizes = p.sizes.map(productBySize);
  const title = `Bedding Boxes for Sale in ${s.name} | Bedding Boxes Direct`;
  return {
    path: statePath(s), label: s.name, h1: `Bedding Boxes for Sale in ${s.name}`, crumbs: [HUB],
    title,
    description: `Bedding boxes for sale in ${s.name}: American-made 3–18 yd boxes shipped to ${p.metros[0]} and statewide. Volume deals for ${s.abbr} utility contractors & rental fleets.`,
    summary: `Shipping to ${list(p.metros.slice(0, 3))} and all of ${s.name}.`, image: sizes[1].image, ogImage: sizes[1].image,
    phoneKey: line.key, state: s,
    render: (c) => join([
      pageTitle({ h1: `Bedding Boxes for Sale in ${s.name}`, crumbs: c.crumbs, text: `Heavy-duty, American-made bedding boxes shipped to job sites across ${s.name}. Talk directly with our sales team: <a href="${line.href}" data-track="phone_click">${esc(line.number)}</a>.` }),
      `<section class="section"><div class="box grid-2 grid-2--top">
        <div class="prose">
          <h2>Bedding Boxes for ${esc(s.name)} Contractors</h2>
          <p>Bedding Boxes Direct ships stone and gravel bedding boxes to utility contractors, excavation crews, municipalities and rental fleets throughout ${esc(s.name)}, including ${esc(list(p.metros))}. We ship to your job site or yard; we do not have a branch in ${esc(s.name)}, so you deal directly with the team that builds the boxes.</p>
          <h3>Ground Conditions</h3><p>${esc(p.ground)}${p.ar500 ? ' On abrasive ground, our <a href="/ar500-bedding-boxes-for-sale/">AR500 steel upgrade</a> adds wear resistance on any size.' : ''}</p>
          <h3>Construction Season</h3><p>${esc(p.season)}</p>
          <h3>Utility and Infrastructure Work in ${esc(s.name)}</h3><p>${esc(p.work)}</p>
          ${p.note ? `<p><strong>Note:</strong> ${p.note}</p>` : ''}
        </div>
        <aside class="card">
          <h2 style="font-size:26px">Order for ${esc(s.name)}</h2>
          <ul class="checks">
            <li>${icon('check')}Freight to any ${esc(s.name)} job site or yard, quoted with your order</li>
            <li>${icon('check')}Built with American steel at our manufacturing location in Indiana</li>
            <li>${icon('check')}${BUNDLES.map((b) => `${b.boxes}-box bundles save ${b.discount}%`).join(' · ')}</li>
            <li>${icon('check')}Split shipments to multiple ${esc(s.abbr)} job sites</li>
          </ul>
          <p style="margin-bottom:6px"><strong>Call our sales team directly:</strong></p>
          <div class="btn-row btn-row--left" style="margin-top:6px">${callButton(line.key)}${button({ text: 'Request a Quote', href: '#quote', style: 'outline' })}</div>
          <p class="small" style="margin-top:12px">${esc(line.hours)}. ${esc(SITE.responseTime)}</p>
        </aside>
      </div></section>`,
      `<section class="section section--gray"><div class="box">
        ${sectionHead({ kicker: `Popular sizes for ${s.name} work`, title: `Recommended Sizes for [${s.name}]`, text: 'Featured here based on the work common in the state. Every size ships to every state.' })}
        <div class="products">${sizes.map((x) => productCard(x)).join('')}</div>
        <p class="center small" style="margin-top:16px">All sizes: ${PRODUCTS.map((x) => `<a href="${x.path}">${x.size} yd (${priceText(x)})</a>`).join(' · ')}</p>
      </div></section>`,
      `<section class="section"><div class="box grid-2 grid-2--top">
        <div><p class="kicker">For utility contractors</p><h2>Buying for a ${esc(s.name)} Utility Crew</h2>
          <p>Stage clean bedding stone at the trench, cut loader trips and reduce material waste on water, sewer, storm, gas, electric and fiber work. Tell us your excavator size and we will match the box.</p>
          ${featureList()}</div>
        <div><p class="kicker">For rental fleets</p><h2>Stocking a ${esc(s.name)} Rental Fleet</h2>
          <p>Mix any sizes in a 10- or 20-box bundle, choose custom paint colors and ship to one yard or several ${esc(s.abbr)} branches. Larger fleet orders are quoted directly.</p>
          <div class="btn-row btn-row--left">${button({ text: 'Fleet Bundles', href: '/fleet-bedding-box-bundles/', track: 'bundle_inquiry' })}${button({ text: 'Rental Fleet Boxes', href: '/industries/equipment-rental-fleets/', style: 'outline' })}</div>
          <h3 style="margin-top:24px;font-size:20px">Shipping</h3><p>${esc(SITE.shipsTo)} See <a href="/shipping-details/">shipping details</a>.</p>
          <p class="small">${esc(NOT_SHORING)}</p></div>
      </div></section>`,
      bundleTeaser(BUNDLES),
      quoteSection({ title: `Get a ${s.name} [Bedding Box Quote]`, form: { id: 'quote-form', inquiry: `state_${s.slug}`, state: s.name }, gray: false }),
      `<section class="section section--gray"><div class="box center"><h2 style="font-size:24px">Also Shipping to the ${esc(s.region)}</h2>
        <ul class="chips chips--center">${neighbors.map((n) => `<li><a href="${statePath(n)}">${esc(n.name)}</a></li>`).join('')}<li><a href="/bedding-boxes-for-sale/">All states</a></li></ul></div></section>`,
    ]),
  };
}

export const stateHub = {
  path: '/bedding-boxes-for-sale/', label: 'Bedding Boxes by State', h1: 'Bedding Boxes Shipped to All 48 Continental States',
  title: 'Bedding Boxes for Sale by State | Nationwide Shipping',
  description: 'We ship American-made bedding boxes to all 48 continental states. Find your state for sizes, shipping, the right sales line and volume deals for contractors and rental fleets.',
  summary: 'Find shipping, sizes and the right sales line for your state.', image: 'bedding-boxes-on-flatbed-truck',
  render: (c) => {
    const regions = [...new Set(US_STATES.map((s) => s.region))].sort();
    return join([
      pageTitle({ h1: 'Bedding Boxes Shipped to All 48 Continental States', crumbs: c.crumbs, text: `${esc(SITE.shipsTo)} Pick your state for local conditions, recommended sizes and the sales line for your time zone.` }),
      `<section class="section"><div class="box"><div class="grid-4">${regions.map((r) => `<div><h2 style="font-size:20px">${esc(r)}</h2><ul class="state-list" style="columns:1">${US_STATES.filter((s) => s.region === r).map((s) => `<li><a href="${statePath(s)}">${esc(s.name)}</a></li>`).join('')}</ul></div>`).join('')}</div></div></section>`,
      `<section class="section section--gray"><div class="box grid-2">
        ${SITE.phones.map((p) => `<div class="card card--white"><h2 style="font-size:24px">Call Our Sales Team</h2><p><a class="btn" href="${p.href}" data-track="phone_click">${icon('phone')}${esc(p.number)}</a></p><p>${esc(p.hours)}</p></div>`).join('')}
      </div></section>`,
      bundleTeaser(BUNDLES),
    ]);
  },
};

export const statePages = [stateHub, ...US_STATES.map(statePage)];
