// INDUSTRY PAGES: hub, the three original WordPress industry pages (same URLs + original text),
// and the new industry pages from src/content/industries.mjs.
import { esc, icon, img, join } from '../lib.mjs';
import { PRODUCTS, productBySize } from '../data/products.mjs';
import { BUNDLES } from '../data/offers.mjs';
import { INDUSTRIES, INDUSTRY_ORDER } from '../content/industries.mjs';
import { caseByLabel, NOT_SHORING } from '../content/shared.mjs';
import * as trO from '../content/original/trenching.mjs';
import * as utO from '../content/original/utility-companies.mjs';
import * as muO from '../content/original/municipalities.mjs';
import {
  accent, bundleTeaser, button, cases, chips, ctaBand, linkCards, pageTitle, productCard, productGrid, quoteSection, sectionHead, skipTheCart,
} from '../components.mjs';

const IND = { label: 'Industries', href: '/industries/' };
const sizeCards = (sizes) => `<div class="products">${sizes.map(([s]) => productCard(productBySize(s))).join('')}</div>`;

// ---------------------------------------------------------------- template for new industry pages
function industryPage(d) {
  const ex = d.caseLabel && caseByLabel(d.caseLabel);
  return {
    path: d.path, label: d.label, h1: d.h1, title: d.title, description: d.description, crumbs: [IND],
    summary: d.summary, image: d.image, ogImage: d.image, audience: d.audience,
    render: (c) => join([
      pageTitle({ h1: d.h1, crumbs: c.crumbs, text: `<span class="kicker">${esc(d.kicker)}</span>` }),
      `<section class="section"><div class="box grid-2 grid-2--top">
        <div class="prose">${d.intro.map((p) => `<p>${p}</p>`).join('')}
          <div class="btn-row btn-row--left">${button({ text: 'Request a Quote', href: '#quote' })}${button({ text: d.audience === 'rental' ? 'Discuss Your Fleet Requirements' : 'Ask About Volume Discounts', href: '/fleet-bedding-box-bundles/', style: 'outline', track: 'bundle_inquiry' })}</div></div>
        <div class="rounded">${img(d.image, `${d.label} bedding box`, { sizes: '(max-width: 767px) 100vw, 540px' })}</div>
      </div></section>`,
      `<section class="section section--gray"><div class="box">
        ${sectionHead({ kicker: 'What matters to buyers', title: `Built for [${d.label}]` })}
        <div class="grid-3">${d.concerns.map(([h, p]) => `<div class="card card--white"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
        ${d.revenue ? `<div class="card card--line" style="margin-top:24px"><h3>Rental Revenue Opportunity</h3><p>${esc(d.revenue)}</p></div>` : ''}
      </div></section>`,
      `<section class="section"><div class="box grid-2 grid-2--top">
        <div><h2>Common <span class="accent">Applications</span></h2><ul class="checks">${d.applications.map((a) => `<li>${icon('check')}${esc(a)}</li>`).join('')}</ul>
          <p class="small">${esc(NOT_SHORING)}</p></div>
        <div><h2>Recommended <span class="accent">Sizes</span></h2><ul class="checks">${d.sizes.map(([s, why]) => `<li>${icon('check')}<a href="${productBySize(s).path}"><strong>${s} Yard Bedding Box</strong></a>: ${esc(why)}</li>`).join('')}</ul>
          <p class="small">Machine ranges come from our specification sheet. <a href="/what-size-bedding-box-do-i-need/">Size selection guide</a>.</p></div>
      </div></section>`,
      `<section class="section section--gray"><div class="box">${sectionHead({ title: 'Sizes for [This Work]' })}${sizeCards(d.sizes)}</div></section>`,
      ex ? `<section class="section"><div class="box box--narrow">${sectionHead({ kicker: 'Customer use case', title: esc(ex.label) })}${cases([ex])}</div></section>` : '',
      d.faq.length ? `<section class="section"><div class="box box--narrow prose"><h2>Common Questions</h2>${d.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div></section>` : '',
      bundleTeaser(BUNDLES),
      quoteSection({ title: `Quote Bedding Boxes for [${d.label}]`, form: { id: 'quote-form', inquiry: `industry_${d.slug}`, customerType: d.audience === 'rental' ? (d.slug === 'trench-safety-shoring-rental' ? 'Trench Safety / Shoring Rental' : 'Equipment Rental Fleet') : '' }, gray: false }),
      `<section class="section section--gray"><div class="box"><h2 class="center" style="font-size:28px">Related Pages</h2>${chips(d.related.map((h) => ({ href: h, label: c.page(h).label })), true)}</div></section>`,
    ]),
  };
}

// ---------------------------------------------------------------- original industry pages
// Shared layout of the WordPress industry pages: title band, main text + side box, case example.
function originalIndustry({ path, label, h1, crumbs = [IND], image, summary, main, aside, caseStudy, extra = [], form }) {
  return {
    path, label, h1, crumbs, image, ogImage: image, summary,
    render: (c) => join([
      pageTitle({ h1, crumbs: c.crumbs }),
      `<section class="section"><div class="box layout-aside">
        <div class="prose">${main}</div>
        <aside>${aside ? `<div class="card card--line prose">${aside}</div>` : ''}${caseStudy ? `<div class="card card--red prose" style="margin-top:20px">${caseStudy}</div>` : ''}
          <div style="margin-top:20px" class="center">${button({ text: 'Shop Boxes', href: '/all-bedding-boxes-for-sale/' })}</div></aside>
      </div></section>`,
      ...extra.map((x) => x(c)),
      skipTheCart(),
      `<section class="section"><div class="box">${sectionHead({ title: '[Heavy Duty] Bedding Boxes For Sale' })}${productGrid(PRODUCTS)}</div></section>`,
      bundleTeaser(BUNDLES),
      quoteSection({ form: { id: 'quote-form', ...form } }),
    ]),
  };
}

const UTILITY_POINTS = [
  ['Reduce material handling cycles', 'Stage up to 18 cubic yards of bedding at the trench so loaders refill boxes occasionally instead of feeding every few feet of pipe.'],
  ['Keep clean bedding close to the trench', 'Specified stone stays in a steel box, not mixed into spoil or scattered on pavement.'],
  ['Improve crew production', 'The excavator keeps a steady rhythm of digging, bedding and laying pipe.'],
  ['Reduce gravel and stone loss', 'Contained material is not lost to spillage or over-loading.'],
  ['Faster trenching workflows', 'Grab/push bars and skid plates let the excavator move the box along with the work.'],
  ['Equipment compatibility', 'Seven standard sizes, each with a published machine-weight and horsepower range.'],
  ['Heavy-duty construction', 'Thicker gauge American steel, reinforced corners, rotating handle design.'],
  ['Multiple-box projects', '10- and 20-box bundles save 5% and 7%; mix any sizes.'],
  ['Nationwide delivery', 'Shipped to the continental US, to one site or several.'],
];

export const utilityCompanies = originalIndustry({
  path: '/bedding-boxes-for-utility-companies/', label: 'Utility Contractors', h1: 'Bedding Boxes for Utility Contractors & Utility Companies',
  image: 'what-are-bedding-boxes-used-for', summary: 'Our primary customers: crews installing water, sewer, storm, gas, electric and telecom lines.',
  main: `${utO.headline}${utO.intro}${utO.reasons}${utO.applications}`,
  aside: utO.aside, caseStudy: utO.caseStudy,
  form: { inquiry: 'industry_utility', customerType: 'Utility Contractor' },
  extra: [
    () => `<section class="section section--gray" id="utility-contractors"><div class="box">
      ${sectionHead({ kicker: 'Our primary customers', title: 'Why [Utility Contractors] Choose Bedding Boxes Direct' })}
      <div class="grid-3">${UTILITY_POINTS.map(([h, p]) => `<div class="card card--white"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
    </div></section>`,
    (c) => linkCards({ heading: 'Utility Work [We Support]', pages: ['/industries/underground-utility-construction/', '/industries/water-sewer-contractors/', '/industries/pipeline-contractors/', '/industries/electrical-utility-contractors/', '/industries/telecommunications-fiber-contractors/', '/bedding-boxes-for-trenching/'].map(c.card), gray: false }),
  ],
});

export const trenching = originalIndustry({
  path: '/bedding-boxes-for-trenching/', label: 'Trenching', h1: 'Bedding Boxes for Trenching',
  image: '12-yard-bedding-box-for-sale-8', summary: 'Trench bedding boxes engineered for high-volume trenching and productivity.',
  main: `${trO.headline}${trO.intro}${trO.reasons}`,
  aside: `${trO.asideTitle}${trO.aside}`, caseStudy: trO.caseStudy,
  form: { inquiry: 'industry_trenching' },
  extra: [
    () => `<section class="section section--gray"><div class="box box--narrow prose">
      <h2>Trench Bedding Box, Gravel Box or Stone Box?</h2>
      <p>On the jobsite the same equipment goes by several names: <strong>trench bedding box</strong>, <a href="/gravel-boxes-for-sale/">gravel box</a>, <a href="/stone-boxes-for-sale/">stone box</a>, rock box or <a href="/pipe-bedding-boxes/">pipe bedding box</a>. All describe a steel container that holds bedding material beside the trench so the excavator can place it under and around pipe or conduit.</p>
      <p><strong>Important:</strong> ${esc(NOT_SHORING)}</p>
    </div></section>`,
  ],
});

export const municipalities = originalIndustry({
  path: '/bedding-boxes-for-municipalities/', label: 'Municipalities', h1: 'Bedding Boxes for Municipalities',
  image: '9-yard-bedding-box-for-sale-11', summary: 'One investment that serves water, sewer, streets and storm departments.',
  main: `${muO.headline}${muO.intro}${muO.reasons}${muO.why}`,
  aside: muO.departments,
  form: { inquiry: 'industry_municipal', customerType: 'Municipality / Public Works' },
  extra: [
    () => `<section class="section section--gray"><div class="box">
      ${sectionHead({ kicker: 'Public works purchasing', title: 'Buying for a [City or County]' })}
      <div class="grid-3">
        <div class="card card--white"><h3>Written quotes</h3><p>Request a written quote with box sizes, quantities, freight and lead time for your purchasing process.</p></div>
        <div class="card card--white"><h3>Published specifications</h3><p>Every size has published dimensions, steel thicknesses and machine ranges for bid documents and comparisons. <a href="/all-bedding-boxes-for-sale/#compare">View specs</a>.</p></div>
        <div class="card card--white"><h3>One box, many departments</h3><p>Water, sewer, streets and storm crews can share boxes across projects.</p></div>
      </div>
      <div style="margin-top:28px">${cases([caseByLabel('Municipal Use')])}</div>
    </div></section>`,
  ],
});

// ---------------------------------------------------------------- hub
export const industriesHub = {
  path: '/industries/', label: 'Industries', h1: 'Industries We Serve',
  title: 'Bedding Boxes by Industry | Bedding Boxes Direct',
  description: 'Bedding boxes for utility contractors, equipment rental fleets, water and sewer, pipeline, excavation, municipal, telecom, electrical and site development work.',
  summary: 'Utility contractors, rental fleets and every crew that trenches for a living.', image: 'what-are-bedding-boxes-used-for',
  render: (c) => join([
    pageTitle({ h1: 'Industries We Serve', crumbs: c.crumbs, text: 'Utility contractors are our primary customers and equipment rental fleets our second. Find the page for your work.' }),
    linkCards({ pages: INDUSTRY_ORDER.map(c.card), gray: false }),
    ctaBand(),
  ]),
};

export const industryPages = [industriesHub, utilityCompanies, trenching, municipalities, ...INDUSTRIES.map(industryPage)];
