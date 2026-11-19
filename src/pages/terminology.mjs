// EQUIPMENT-TERMINOLOGY PAGES (Phase 6). One page per distinct search intent; overlapping terms are
// handled inside existing pages instead of near-duplicate pages (see docs/seo-opportunity-report.md):
//   bedding boxes for sale -> homepage · trench bedding boxes -> /bedding-boxes-for-trenching/
//   heavy-duty bedding boxes -> /bedding-boxes/ · custom -> /bedding-box-fabrication-company/ · AR500 -> /ar500-…/
//   aggregate bedding boxes + rock box -> sections on /gravel-boxes-for-sale/ and /stone-boxes-for-sale/
// Stone Mizer® is a trademark of Efficiency Production, Inc. We publish an accurate *alternative* page and
// never imply affiliation or that our boxes are Stone Mizer products.
import { esc, icon, img, join } from '../lib.mjs';
import { PRODUCTS, productBySize, priceText } from '../data/products.mjs';
import { BUNDLES } from '../data/offers.mjs';
import { FIT_TABLE, NOT_SHORING, caseByLabel } from '../content/shared.mjs';
import * as stO from '../content/original/stone-boxes-adwords.mjs';
import {
  accent, bundleTeaser, button, callButton, cases, chips, featureList, pageTitle, phonePair, productGrid, quoteSection, sectionHead, specTable, startHere,
} from '../components.mjs';

const SHOP = { label: 'Bedding Boxes', href: '/all-bedding-boxes-for-sale/' };
const fit = () => `<div class="table-wrap"><table class="spec-table" style="min-width:0"><thead><tr><th>Box Volume</th><th>Machine Weight Range</th><th>Machine Horsepower</th></tr></thead><tbody>${FIT_TABLE.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const related = (c, paths) => `<section class="section section--gray"><div class="box"><h2 class="center" style="font-size:28px">Related Pages</h2>${chips(paths.map((h) => ({ href: h, label: c.page(h).label })), true)}</div></section>`;

function termPage(d) {
  return {
    path: d.path, label: d.label, h1: d.h1, title: d.title, description: d.description, crumbs: [SHOP],
    summary: d.summary, image: d.image, ogImage: d.image, seoChange: d.seoChange,
    render: (c) => join([
      `<section class="hero">
        <div class="hero__text">
          ${c.crumbs.length ? `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${c.crumbs.map((b, i) => (i === c.crumbs.length - 1 ? `<li aria-current="page">${esc(b.label)}</li>` : `<li><a href="${b.href}">${esc(b.label)}</a></li>`)).join('')}</ol></nav>` : ''}
          <p class="pill">${esc(d.pill)}</p>
          <h1 class="hero__headline" style="font-size:clamp(36px,5.4vw,64px)">${accent(d.heroTitle)}</h1>
          <p class="lead">${d.lead}</p>
          <div class="btn-row btn-row--left">${button({ text: 'Request a Quote', href: '#quote' })}${callButton('mountain', { text: 'Call for Pricing', style: 'dark' })}</div>
          ${d.note ? `<p class="hero__note">${esc(d.note)}</p>` : ''}
        </div>
        <div class="hero__media hero__media--photo">${img(d.image, d.imageAlt || d.label, { eager: true, sizes: '(max-width: 899px) 100vw, 40vw' })}</div>
      </section>`,
      ...d.sections.map((s) => s(c)),
      `<section class="section section--gray" id="sizes"><div class="box">${sectionHead({ kicker: 'Sizes available (3yd – 18yd) & custom order', title: d.sizesTitle })}${productGrid(PRODUCTS)}</div></section>`,
      bundleTeaser(BUNDLES),
      quoteSection({ title: d.formTitle, form: { id: 'quote-form', inquiry: `term_${d.slug}` }, gray: false }),
      related(c, d.related),
    ]),
  };
}

// ---------------------------------------------------------------- gravel boxes
const gravel = termPage({
  slug: 'gravel', path: '/gravel-boxes-for-sale/', label: 'Gravel Boxes for Sale', h1: 'Gravel Boxes for Sale',
  title: 'Gravel Boxes for Sale | American Made | Bedding Boxes Direct',
  description: 'Heavy-duty gravel boxes for sale in 3 to 18 yard sizes. Stage gravel and aggregate bedding at the trench. American made with American steel, shipped nationwide.',
  summary: 'Gravel boxes (aggregate bedding boxes) in 3 to 18 yard sizes.', image: '7-yard-bedding-box-for-sale-3',
  pill: 'Gravel boxes · Aggregate bedding boxes · Rock boxes', heroTitle: 'Gravel Boxes [for Sale]',
  lead: 'A gravel box is a heavy steel container that holds gravel or crushed aggregate beside the trench so the excavator can place bedding exactly where it is needed. Ours are American made with American steel in seven standard sizes.',
  note: '* 7yd & 9yd boxes always available for immediate shipping.',
  sizesTitle: 'Gravel Boxes [For Sale]', formTitle: 'Get a Quote on [Gravel Boxes]',
  related: ['/stone-boxes-for-sale/', '/pipe-bedding-boxes/', '/bedding-boxes-for-trenching/', '/what-size-bedding-box-do-i-need/'],
  sections: [
    () => `<section class="section"><div class="box grid-2 grid-2--top">
      <div class="prose"><h2>Gravel Box, Bedding Box, Rock Box: Same Job</h2>
        <p>Contractors call this equipment a <strong>gravel box</strong>, a <a href="/bedding-boxes/">bedding box</a>, a <a href="/stone-boxes-for-sale/">stone box</a> or a rock box (rental catalogs often list “bedding rock boxes”). The job is the same: hold bedding aggregate next to the open trench so the excavator can scoop and place it under and around pipe or conduit without a loader running back and forth to the pile.</p>
        <h3>Aggregate Bedding Boxes</h3>
        <p>Gravel boxes handle any free-flowing bedding aggregate: pea gravel, crushed stone, clean washed stone and sand. Abrasive aggregate wears steel; for the most abrasive material, AR500 steel is available as an upgrade on every size. <a href="/ar500-bedding-boxes-for-sale/">See AR500 boxes</a>.</p>
        <p><strong>Safety:</strong> ${esc(NOT_SHORING)}</p></div>
      <div><h2 style="font-size:28px">Key Features</h2>${featureList()}</div>
    </div></section>`,
    () => `<section class="section section--gray"><div class="box grid-2 grid-2--top">
      <div class="prose"><h2>Choosing a Gravel Box Size</h2><p>Match the box to your excavator. These ranges are from our published sizing table; the full specifications list every dimension and steel thickness.</p>${fit()}<p class="small" style="margin-top:8px"><a href="/all-bedding-boxes-for-sale/#compare">Full specifications</a> · <a href="/what-size-bedding-box-do-i-need/">Size guide</a></p></div>
      <div>${cases([caseByLabel('Storm Sewer Installation')])}</div>
    </div></section>`,
  ],
});

// ---------------------------------------------------------------- stone boxes (replaces /stone-boxes-for-sale-adwords/)
const stone = termPage({
  slug: 'stone', path: '/stone-boxes-for-sale/', label: 'Stone Boxes for Sale', h1: 'Stone Boxes for Sale',
  title: 'Stone Boxes for Sale | Bedding Boxes Direct',
  description: 'Bedding Boxes Direct provides direct pricing on Stone Boxes. American made with American steel, buy USA Made stone boxes at great prices.',
  seoChange: 'New organic page replacing /stone-boxes-for-sale-adwords/ (301). Title and description carried over from that page; "-adwords" removed from the URL (owner decision 2026-11-19).',
  summary: 'Heavy-duty stone bedding boxes with direct pricing, 3 to 18 yards.', image: '18-yard-bedding-box-for-sale',
  pill: 'Stone bedding boxes for sale', heroTitle: 'Stone Boxes for Sale [Available Fast Nationwide.]',
  lead: `${stO.heroText.replace(/<\/?p>/g, '')} Direct pricing from the people who build them.`,
  note: '* 7yd & 9yd boxes always available for immediate shipping.',
  sizesTitle: 'Stone Boxes [Sizes Available]', formTitle: 'Inquire [Here.]',
  related: ['/gravel-boxes-for-sale/', '/stone-mizer-alternative/', '/bedding-boxes-for-trenching/', '/bedding-boxes/'],
  sections: [
    () => startHere({ id: 'Start-Here' }),
    () => `<section class="section"><div class="box grid-2 grid-2--top">
      <div class="prose">${stO.fitTable.replace(/<table>[\s\S]*?<\/table>/, fit())}</div>
      <div><h2 style="font-size:28px">Key Features</h2>${featureList()}</div>
    </div></section>`,
    () => `<section class="section section--gray"><div class="box box--narrow prose">
      <h2>What Is a Stone Box?</h2>
      <p>A stone box (also called a stone bedding box, gravel box or rock box) is a steel container filled with bedding stone and staged next to the trench. The excavator takes stone from the box and places it under and around pipe, so the crew doesn’t wait for a loader. Need a quote for multiple boxes or larger quantities? Message us below or call directly. We are capable of servicing large orders.</p>
      <p><strong>Safety:</strong> ${esc(NOT_SHORING)}</p>
    </div></section>`,
    () => `<section class="cta-band cta-band--red"><h2>Still looking? You found us already, make the call 👍</h2><p>Competitively priced, made here in America with thicker gauge American steel, and available quickly.</p>${phonePair('btn--dark')}</section>`,
  ],
});

// ---------------------------------------------------------------- excavator bedding boxes
const excavator = termPage({
  slug: 'excavator', path: '/excavator-bedding-boxes/', label: 'Excavator Bedding Boxes', h1: 'Excavator Bedding Boxes',
  title: 'Excavator Bedding Boxes by Machine Size | Bedding Boxes Direct',
  description: 'Bedding boxes sized to your excavator: 3 yard for mini excavators up to 18 yard for 50-ton machines. Published machine weight and horsepower ranges for every box.',
  summary: 'Find the bedding box that matches your excavator’s weight and horsepower.', image: '12-yard-bedding-box-for-sale-10',
  pill: 'Bedding boxes matched to your machine', heroTitle: 'Excavator [Bedding Boxes]',
  lead: 'The right bedding box depends on the excavator pulling it. Every box we build has a recommended machine weight and horsepower range, from mini excavators to 50-ton machines.',
  sizesTitle: 'Bedding Boxes by [Excavator Class]', formTitle: 'Tell Us Your [Excavator]',
  related: ['/what-size-bedding-box-do-i-need/', '/product-category/mini-excavator-bedding-box-for-sale/', '/industries/excavation-contractors/', '/bedding-box-fabrication-company/'],
  sections: [
    () => `<section class="section"><div class="box">
      ${sectionHead({ title: 'Match the Box to [Your Machine]', text: 'Recommended ranges from our specification sheet (Rev. 9/23/2025). Suggested machine ranges are not guaranteed; always consult the machine manufacturer.' })}
      <div class="table-wrap"><table class="spec-table"><thead><tr><th>Excavator class</th><th>Recommended box</th><th>Machine weight*</th><th>Machine HP*</th><th>Box weight</th><th>Price</th></tr></thead><tbody>
        ${[['Mini / compact', 3], ['Compact – midsize', 5], ['Midsize', 7], ['Large', 9], ['Large (35T+)', 12], ['Heavy (50T+)', 14], ['Heavy (50T+), max capacity', 18]].map(([cls, s]) => { const p = productBySize(s); return `<tr><td>${esc(cls)}</td><td><a href="${p.path}">${s} Yard Bedding Box</a></td><td>${esc(p.spec.machine)}</td><td>${esc(p.spec.hp)}</td><td>${p.spec.weight.toLocaleString('en-US')} lbs</td><td>${priceText(p)}</td></tr>`; }).join('')}
      </tbody></table></div>
    </div></section>`,
    () => `<section class="section section--gray"><div class="box box--narrow prose">
      <h2>Why Machine Size Matters</h2>
      <p>A bedding box is pulled, pushed and lifted by the excavator. A box that is too large for the machine strains it when full; a box that is too small means more refills and more loader trips. Matching capacity to the machine keeps the crew productive without overloading equipment.</p>
      <p>Width matters too: the inside width of the box (from 47 inches on the 3 yard to 92 inches on the 14 and 18 yard) should suit the bucket your operator uses to take material from the box. See every dimension in our <a href="/all-bedding-boxes-for-sale/#compare">specification table</a>, or ask about a <a href="/bedding-box-fabrication-company/">custom build</a>.</p>
    </div></section>`,
  ],
});

// ---------------------------------------------------------------- pipe bedding boxes
const pipe = termPage({
  slug: 'pipe', path: '/pipe-bedding-boxes/', label: 'Pipe Bedding Boxes', h1: 'Pipe Bedding Boxes',
  title: 'Pipe Bedding Boxes for Utility Trenching | Bedding Boxes Direct',
  description: 'Pipe bedding boxes keep bedding stone and sand at the trench for water, sewer, storm and gas pipe installation. Heavy-duty, American made, 3 to 18 yard sizes.',
  summary: 'Keep pipe bedding stone and sand at the trench for faster pipe laying.', image: '9-yard-bedding-box-for-sale-11',
  pill: 'For pipe laying crews', heroTitle: 'Pipe [Bedding Boxes]',
  lead: 'Pipe needs a consistent bed of stone or sand beneath it and around it. A pipe bedding box keeps that material clean and within the excavator’s reach as the pipe crew moves down the trench.',
  sizesTitle: 'Pipe Bedding Box [Sizes]', formTitle: 'Quote [Pipe Bedding Boxes]',
  related: ['/industries/water-sewer-contractors/', '/industries/pipeline-contractors/', '/gravel-boxes-for-sale/', '/bedding-boxes-for-trenching/'],
  sections: [
    () => `<section class="section"><div class="box grid-2 grid-2--top">
      <div class="prose"><h2>How a Pipe Bedding Box Fits the Pipe-Laying Rhythm</h2>
        <ol><li>The loader fills the box with the specified bedding material.</li><li>The excavator drags the box along the trench using the grab/push bars; welded skid plates protect the ground.</li><li>The operator scoops bedding from the box and places it under the pipe, sets the pipe, then places material around it.</li><li>The box moves forward with the work and is refilled only occasionally.</li></ol>
        <p>Because the material stays in a box rather than a pile, it stays clean and less of it is lost, an advantage when specifications call for particular bedding stone.</p>
        <p><strong>Safety:</strong> ${esc(NOT_SHORING)}</p></div>
      <div>${cases([caseByLabel('Municipal Water Main Replacement')])}</div>
    </div></section>`,
    () => `<section class="section section--gray"><div class="box">${sectionHead({ title: 'Pipe Work by [Box Size]' })}
      <div class="grid-3">${[[5, 'Water and sewer services in subdivisions'], [9, 'City sewer and water mains'], [12, 'Water mains, storm sewer and long runs']].map(([s, t]) => { const p = productBySize(s); return `<div class="card card--white"><h3><a href="${p.path}">${s} Yard Box</a></h3><p>${esc(t)}. Recommended for ${esc(p.spec.machine)} machines.</p></div>`; }).join('')}</div>
    </div></section>`,
  ],
});

// ---------------------------------------------------------------- Stone Mizer alternative
const mizer = termPage({
  slug: 'stone-mizer', path: '/stone-mizer-alternative/', label: 'Stone Mizer Alternative', h1: 'An American-Made Alternative to the Stone Mizer',
  title: 'Stone Mizer Alternative: American-Made Bedding Boxes',
  description: 'Shopping for a Stone Mizer? Compare an American-made alternative: Bedding Boxes Direct bedding boxes in 3 to 18 yard sizes with published specs and direct pricing.',
  summary: 'Comparing bedding box brands? What to check, and how our boxes are built.', image: '12-yard-bedding-box-for-sale-1',
  pill: 'Comparing bedding box brands', heroTitle: 'An American-Made [Alternative] to the Stone Mizer',
  lead: 'Many contractors use “Stone Mizer” as a generic name for a bedding box. If you are comparing options, here is how Bedding Boxes Direct boxes are built and priced, so you can decide what fits your crew.',
  sizesTitle: 'Bedding Boxes Direct [Sizes & Prices]', formTitle: 'Compare Us on [Your Next Order]',
  related: ['/stone-boxes-for-sale/', '/gravel-boxes-for-sale/', '/all-bedding-boxes-for-sale/', '/bedding-box-fabrication-company/'],
  sections: [
    () => `<section class="section"><div class="box box--narrow">
      <div class="card card--line"><p style="margin:0"><strong>Trademark notice:</strong> STONE MIZER is a trademark of Efficiency Production, Inc. Bedding Boxes Direct is not affiliated with, endorsed by, or sponsored by Efficiency Production, Inc. Our bedding boxes are not Stone Mizer products. We use the name only to describe what shoppers are comparing.</p></div>
    </div></section>`,
    () => `<section class="section section--gray"><div class="box grid-2 grid-2--top">
      <div class="prose"><h2>What to Compare When Buying a Bedding Box</h2>
        <ul><li><strong>Capacity and machine range:</strong> does the brand publish recommended machine weight and horsepower for each size?</li><li><strong>Steel thickness:</strong> side, front/back and bottom thickness, and wear plates.</li><li><strong>Construction details:</strong> reinforced corners, skid plates, grab/push bars and lift handles.</li><li><strong>Where it is built:</strong> American made with American steel, or imported?</li><li><strong>Price and freight:</strong> published pricing and delivered cost to your site.</li><li><strong>Volume terms:</strong> discounts for fleets and multi-box projects.</li></ul></div>
      <div class="prose"><h2>How Our Boxes Are Built</h2>
        <ul><li>Seven standard sizes from 3 to 18 cubic yards, custom builds from 2.25 to 18+ yards.</li><li>Published dimensions, weights, steel thickness and machine ranges for every size (<a href="/all-bedding-boxes-for-sale/#compare">spec table</a>).</li><li>Thicker gauge sidewalls, reinforced corners, front and rear welded skid plates, grab/push bars and a rotating handle design.</li><li>AR500 abrasion-resistant steel available on every size.</li><li>American made with American steel; shipped nationwide.</li><li>Published list prices from ${priceText(productBySize(3))} (3 yd) and 5–7% bundle savings.</li></ul></div>
    </div></section>`,
  ],
});

export const termPages = [gravel, stone, excavator, pipe, mizer];
