// SIZE PAGES (original /product/ URLs, no ecommerce), catalog, product-line and offer pages.
import { esc, icon, img, imageUrl, join, money } from '../lib.mjs';
import { SITE } from '../site.mjs';
import { PRODUCTS, PRICE_NOTE, AR500_PRICES, priceText, SUPPORT_CHANNELS } from '../data/products.mjs';
import { BUNDLES, LARGE_ORDER, BUNDLE_BENEFITS } from '../data/offers.mjs';
import { FIT_TABLE, NOT_SHORING } from '../content/shared.mjs';
import * as catalogO from '../content/original/catalog.mjs';
import * as bbO from '../content/original/bedding-boxes.mjs';
import * as arO from '../content/original/ar500.mjs';
import * as fabO from '../content/original/fabrication.mjs';
import * as bunO from '../content/original/bundles.mjs';
import {
  accent, bundleTeaser, button, buttonRow, callButton, chips, ctaBand, featureList, flagBand, leadForm, pageTitle, phonePair,
  productGrid, quoteSection, sectionHead, skipTheCart, specTable, startHere, youtube,
} from '../components.mjs';

const SHOP = { label: 'Bedding Boxes', href: '/all-bedding-boxes-for-sale/' };
const fitTable = () => `<div class="table-wrap"><table class="spec-table" style="min-width:0"><thead><tr><th>Box Volume</th><th>Machine Weight Range</th><th>Machine Horsepower</th></tr></thead><tbody>${FIT_TABLE.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const strip = (html) => html.replace(/^\s*<h[23]>.*?<\/h[23]>/, '');

// ---------------------------------------------------------------- size page template
function sizePage(p) {
  const s = p.spec;
  const others = PRODUCTS.filter((x) => x.size !== p.size);
  const near = others.sort((a, b) => Math.abs(a.size - p.size) - Math.abs(b.size - p.size)).slice(0, 3).sort((a, b) => a.size - b.size);
  const thumbs = p.gallery.map(([n, alt], i) => `<button type="button" aria-current="${i === 0}" data-src="${imageUrl(n)}" data-srcset="${imageUrl(n, '-800')} 800w, ${imageUrl(n)} 1600w" data-alt="${esc(alt)}" aria-label="Show photo ${i + 1}">${img(n, '', { sizes: '80px' })}</button>`).join('');
  return {
    path: p.path, label: `${p.size} Yard Bedding Box`, h1: p.h1, title: p.title, description: p.description,
    crumbs: [SHOP], image: p.image, ogImage: p.image, summary: p.summary,
    track: '', productSize: p.size,
    render: (c) => join([
      `<section class="section section--tight"><div class="box product-hero">
        <div class="gallery">
          <div class="gallery__main">${img(p.gallery[0][0], p.gallery[0][1], { eager: true, sizes: '(max-width: 899px) 100vw, 540px' })}</div>
          <div class="gallery__thumbs">${thumbs}</div>
        </div>
        <div>
          ${c.crumbs.length ? `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${c.crumbs.map((b, i) => (i === c.crumbs.length - 1 ? `<li aria-current="page">${esc(b.label)}</li>` : `<li><a href="${b.href}">${esc(b.label)}</a></li>`)).join('')}</ol></nav>` : ''}
          <h1 style="font-size:clamp(32px,4.4vw,48px)">${esc(p.h1)}</h1>
          ${p.inStock ? '<p class="badge" style="margin:0 0 6px">Usually in stock · ships fast</p>' : ''}
          <p class="price">${priceText(p)}</p>
          <p class="price-note">${esc(PRICE_NOTE)}</p>
          <div class="prose">${p.content.short}</div>
          <dl class="quick-specs">
            <div><dt>Capacity</dt><dd>${p.size} cubic yards (${p.size} yd³)</dd></div>
            <div><dt>Shipping weight</dt><dd>${s.weight.toLocaleString('en-US')} lbs</dd></div>
            <div><dt>Overall L × W × H</dt><dd>${s.A}″ × ${s.G}″ × ${s.D}″</dd></div>
            <div><dt>Suggested machine*</dt><dd>${esc(s.machine)} · ${esc(s.hp)}</dd></div>
          </dl>
          <div class="btn-row btn-row--left" style="margin-top:12px">${button({ text: 'Request a Quote', href: `#quote` })}${callButton('sales', { text: 'Call for Pricing', style: 'dark' })}</div>
          <p class="small" style="margin-top:14px">${icon('truck')} ${esc(SITE.shipsTo)} Buying 10+ boxes? <a href="/fleet-bedding-box-bundles/" data-track="bundle_inquiry">Ask about volume discounts</a>.</p>
        </div>
      </div></section>`,

      `<section class="section section--gray"><div class="box layout-aside">
        <div class="prose">${p.content.description}</div>
        <aside class="card card--white">
          <div class="prose">${p.content.features.replace(/<h3>Key Features:<\/h3>/, '<h2 style="font-size:28px">Key Features</h2>')}</div>
          ${p.sidewallOptions ? `<h3 style="font-size:20px;margin-top:18px">Sidewall Thickness Options</h3><ul>${p.sidewallOptions.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}
          <p class="small">AR500 abrasion-resistant steel is an available upgrade. <a href="/ar500-bedding-boxes-for-sale/">See AR500 options</a>.</p>
        </aside>
      </div></section>`,

      `<section class="section"><div class="box grid-2 grid-2--top">
        <div>
          <p class="kicker">Typical applications</p>
          <h2>Where the ${p.size} Yard Box Fits Best</h2>
          <ul class="checks">${p.bestFor.map((b) => `<li>${icon('check')}${esc(b)}</li>`).join('')}</ul>
          <h3 style="font-size:20px;margin-top:24px">Industries that use this size</h3>
          ${chips(p.industries.map((h) => ({ href: h, label: c.page(h).label || c.page(h).h1 })))}
        </div>
        <div>
          <p class="kicker">Verified specifications</p>
          <h2>${p.size} Yard Bedding Box Specs</h2>
          <div class="table-wrap"><table class="spec-table" style="min-width:0"><tbody>
            ${[['Box volume', `${p.size} yd³`], ['Shipping weight', `${s.weight.toLocaleString('en-US')} lbs`], ['A – Overall length', `${s.A} in`], ['B – Body length', `${s.B} in`], ['C – Wall height', `${s.C} in`], ['D – Overall height', `${s.D} in`], ['E – Ground contact length', `${s.E} in`], ['F – Inside width', `${s.F} in`], ['G – Overall width', `${s.G} in`], ['Side thickness', `${s.side} in`], ['Front/back thickness', `${s.ends} in`], ['Bottom thickness', `${s.bottom} in`], ['Recommended machine weight*', s.machine], ['Recommended machine HP*', s.hp]].map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}
          </tbody></table></div>
          <p class="small" style="margin-top:8px">*Suggested machine ranges are not guaranteed. Always consult the machine manufacturer regarding machine capabilities. Source: Bedding Boxes Direct specification sheet, Rev. 9/23/2025. <a href="/all-bedding-boxes-for-sale/#compare">Compare all sizes</a>.</p>
        </div>
      </div></section>`,

      `<section class="section section--gray"><div class="box">
        ${sectionHead({ kicker: 'Need other sizes?', title: 'Related [Bedding Boxes]' })}
        ${productGrid(near)}
        <div class="btn-row">${button({ text: 'View All Sizes', href: '/all-bedding-boxes-for-sale/', style: 'outline' })}${button({ text: 'What Size Do I Need?', href: '/what-size-bedding-box-do-i-need/', style: 'outline' })}</div>
      </div></section>`,

      bundleTeaser(BUNDLES),
      quoteSection({ title: `Request a Quote: [${p.size} Yard Bedding Box]`, form: { id: 'quote-form', sizes: [`${p.size} yd`], inquiry: `size_${p.size}`, title: '' }, gray: false }),
    ]),
  };
}

export const sizePages = PRODUCTS.map(sizePage);

// ---------------------------------------------------------------- catalog (original WooCommerce shop page)
export const catalog = {
  path: '/all-bedding-boxes-for-sale/', label: 'All Bedding Boxes', h1: 'All Bedding Boxes For Sale',
  summary: 'Every size from 3 to 18 cubic yards, with prices and specs.', image: '12-yard-bedding-box-for-sale-7', ogImage: '12-yard-bedding-box-for-sale-7',
  render: (c) => join([
    pageTitle({ h1: 'All Bedding Boxes For Sale', crumbs: c.crumbs, text: 'Seven standard sizes from 3 to 18 cubic yards. American made with American steel and shipped nationwide. Request a quote or call to order.' }),
    `<section class="section" id="sizes"><div class="box">${productGrid(PRODUCTS)}
      <div class="btn-row">${callButton('sales', { text: 'Call to Order' })}${button({ text: 'Request a Quote', href: '/request-a-quote/', style: 'outline' })}</div></div></section>`,
    `<section class="section section--gray" id="compare"><div class="box">
      ${sectionHead({ kicker: 'Verified specifications', title: 'Compare [Bedding Box Sizes]', text: 'Every configuration we build, including 2.25 yd and the 7 yd and 12 yd wide boxes. Scroll the table sideways on a phone.' })}
      ${specTable()}
      <p class="small">${esc(SUPPORT_CHANNELS)}.</p>
    </div></section>`,
    startHere({ id: 'Start-Here' }),
    `<section class="section"><div class="box">
      ${sectionHead({ kicker: 'Bedding boxes for sale....', title: 'Bedding Box [Highlights]' })}
      <div class="grid-2"><div class="rounded">${img('12-yard-bedding-box-for-sale-7', 'Bedding boxes from Bedding Boxes Direct located on the manufacturing lot.', { sizes: '(max-width: 767px) 100vw, 540px' })}</div>
      <div><h3 class="center" style="font-size:clamp(28px,3.4vw,40px)">Key Features</h3><div class="features-wrap prose">${catalogO.features.replace(/<ul>/g, '<ul class="features">')}</div></div></div>
    </div></section>`,
    bundleTeaser(BUNDLES),
    skipTheCart(),
  ]),
};

// ---------------------------------------------------------------- mini excavator (original category URL, rebuilt as a landing page)
const p3 = PRODUCTS.find((p) => p.size === 3);
const p5 = PRODUCTS.find((p) => p.size === 5);
export const miniExcavator = {
  path: '/product-category/mini-excavator-bedding-box-for-sale/', label: 'Mini Excavator Bedding Box', h1: 'Mini Excavator Bedding Box for Sale',
  crumbs: [SHOP], image: '3-yard-bedding-box-for-sale-3', ogImage: '3-yard-bedding-box-for-sale-3',
  summary: 'The 3 yard box for compact and mini excavators on tight utility jobs.',
  seoChange: 'WordPress served an auto-generated archive title ("Mini Excavator Bedding Box Archives | …") with the generic site description. Replaced with a page-specific title and description for the mini excavator search intent (2026-11).',
  title: 'Mini Excavator Bedding Box for Sale | Bedding Boxes Direct',
  description: 'Bedding box for mini and compact excavators. Our 3 yard box (5T–15T machines) is American made with American steel and ships nationwide. Request a quote.',
  render: (c) => join([
    pageTitle({ h1: 'Mini Excavator Bedding Box for Sale', crumbs: c.crumbs, text: 'Compact excavators work the tightest utility jobs: residential services, sidewalks, back lots and narrow conduit runs. Our 3 yard bedding box is sized for them.' }),
    `<section class="section"><div class="box grid-2">
      <div class="rounded">${img(p3.image, '3 yard bedding box for mini excavators', { sizes: '(max-width: 767px) 100vw, 540px' })}</div>
      <div>
        <h2>The 3 Yard Box: Built for <span class="accent">Compact Machines</span></h2>
        <p>The 3 yard bedding box is our smallest standard size. Its recommended machine range is <strong>${esc(p3.spec.machine)} and ${esc(p3.spec.hp)}</strong>, the class most contractors call mini and compact excavators. At ${p3.spec.weight.toLocaleString('en-US')} lbs shipping weight and ${p3.spec.G}″ overall width, it fits between homes, along sidewalks and in right-of-way where larger boxes can’t operate.</p>
        <p>For machines under 10 tons we also build a <strong>2.25 yard</strong> box (recommended for machines under 10T / under 70HP). Ask our team about it.</p>
        <p class="price">${priceText(p3)} <span class="small">3 yard box</span></p>
        <div class="btn-row btn-row--left">${button({ text: 'View the 3 Yard Box', href: p3.path })}${button({ text: 'Request a Quote', href: '/request-a-quote/?size=3', style: 'outline' })}</div>
      </div>
    </div></section>`,
    `<section class="section section--gray"><div class="box">
      ${sectionHead({ title: 'Compact Sizes [Compared]', text: 'Machine ranges are suggestions from our specification sheet. Always consult your machine manufacturer.' })}
      ${specTable({ only: ['2.25', '3', '5'], highlight: '3' })}
      <div style="margin-top:32px">${productGrid([p3, p5])}</div>
    </div></section>`,
    `<section class="section"><div class="box box--narrow prose">
      <h2>Why Use a Bedding Box With a Mini Excavator?</h2>
      <p>Small machines have small buckets, so every trip back to the stone pile costs more time per foot of trench. Staging a box of bedding material beside the trench lets the operator place stone without leaving the work, keeps the material clean and stops it scattering on lawns, driveways and pavement.</p>
      <p>Typical compact-excavator jobs include residential water and sewer services, gas and electrical service lines, telecom and fiber drops, and municipal repairs in confined streets.</p>
      <p>${esc(NOT_SHORING)}</p>
    </div></section>`,
    quoteSection({ title: 'Quote a [Mini Excavator Box]', form: { id: 'quote-form', sizes: ['3 yd'], inquiry: 'mini_excavator' } }),
  ]),
};

// ---------------------------------------------------------------- /bedding-boxes/ (product-line overview with inquiry form)
export const beddingBoxes = {
  path: '/bedding-boxes/', label: 'Bedding Boxes', h1: 'Bedding Boxes',
  summary: 'Heavy-duty, American-made bedding boxes: sizes, custom options and how they improve productivity.', image: 'what-are-bedding-boxes-used-for', ogImage: 'what-are-bedding-boxes-used-for',
  render: (c) => join([
    `<section class="page-title" data-bg="/images/what-are-bedding-boxes-used-for-800.webp" style="background-size:cover;background-position:center;position:relative"><div class="box" style="background:rgba(245,245,245,.92);border-radius:16px;padding:28px">${c.crumbs.length ? `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${c.crumbs.map((b, i) => (i === c.crumbs.length - 1 ? `<li aria-current="page">${esc(b.label)}</li>` : `<li><a href="${b.href}">${esc(b.label)}</a></li>`)).join('')}</ol></nav>` : ''}<h1>Bedding Boxes</h1><p>Heavy-duty, American-made bedding boxes for utility contractors, excavation crews and rental fleets. Sizes 3yd–18yd plus custom builds.</p></div></section>`,
    `<section class="section"><div class="box grid-2 grid-2--top">
      <div><h2>Learn About Our Bedding Boxes</h2><p class="kicker">(90 Seconds)</p>${startHereVideo()}
        <div class="prose" style="margin-top:28px">${bbO.sizes}</div></div>
      <div>${leadForm({ id: 'bedding-boxes-form', title: 'Send Us a Message', inquiry: 'bedding_boxes_page' })}<p class="small" style="margin-top:10px">${esc(SITE.responseTime)} Office hours: ${esc(SITE.officeHours)}.</p></div>
    </div></section>`,
    `<section class="section section--gray"><div class="box grid-2 grid-2--top">
      <div class="prose">${bbO.overview}<div class="btn-row btn-row--left">${button({ text: 'Shop All Boxes', href: '/all-bedding-boxes-for-sale/' })}</div></div>
      <div class="prose">${bbO.fitTable.replace(/<table>[\s\S]*?<\/table>/, fitTable())}<div class="btn-row btn-row--left">${button({ text: 'View Specifications', href: '/all-bedding-boxes-for-sale/#compare', style: 'outline' })}</div></div>
    </div></section>`,
    `<section class="section"><div class="box box--narrow prose">${bbO.useCases}</div></section>`,
    `<section class="section section--gray" id="all-products"><div class="box">${sectionHead({ kicker: 'All products', title: 'Shop All [Bedding Boxes]' })}${productGrid(PRODUCTS)}</div></section>`,
    bundleTeaser(BUNDLES),
  ]),
};
function startHereVideo() { return `<div style="margin-top:16px">${youtube()}</div>`; }

// ---------------------------------------------------------------- AR500
export const ar500 = {
  path: '/ar500-bedding-boxes-for-sale/', label: 'AR500 Bedding Boxes', h1: 'AR500 Bedding Boxes For Sale',
  crumbs: [SHOP], summary: 'Our heaviest steel: AR500 abrasion-resistant upgrade for every box size.', image: 'ar500-boxes-for-sale-meteor', ogImage: 'ar500-boxes-for-sale-meteor',
  render: (c) => join([
    `<section class="section section--dark" data-bg="/images/ar500-boxes-for-sale-meteor-800.webp" style="background-size:cover;background-position:center"><div class="box center" style="padding:60px 20px">${c.crumbs.length ? `<nav class="breadcrumbs" aria-label="Breadcrumb" style="display:flex;justify-content:center"><ol>${c.crumbs.map((b, i) => (i === c.crumbs.length - 1 ? `<li aria-current="page" style="color:#fff">${esc(b.label)}</li>` : `<li><a href="${b.href}" style="color:#fff">${esc(b.label)}</a></li>`)).join('')}</ol></nav>` : ''}
      <p class="kicker" style="color:#fff;font-size:15px">Meteor tested. Contractor approved.</p><h1 style="color:#fff;text-shadow:0 2px 14px rgba(0,0,0,.6)">AR500 Bedding Boxes For Sale</h1>${arO.disclaimer.replace('<p>', '<p class="disclaimer" style="color:#eee">')}</div></section>`,
    `<section class="section"><div class="box layout-aside">
      <div class="prose">${arO.intro}</div>
      <aside class="card"><h2 style="font-size:28px">Current AR500 Upgrade Prices</h2>
        <div class="table-wrap"><table class="spec-table" style="min-width:0"><thead><tr><th>Box</th><th>AR500 Price</th></tr></thead><tbody>${AR500_PRICES.map(([k, v]) => `<tr><td>${esc(k)}</td><td>$${v.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td></tr>`).join('')}</tbody></table></div>
        <p class="small" style="margin-top:8px">Prices as published. Freight quoted separately. Call to confirm current pricing and lead time.</p>
        <div class="btn-row">${button({ text: 'Custom Order AR500', href: '/request-a-quote/?size=AR500' })}${callButton('sales', { text: 'Call to Order', style: 'dark' })}</div>
      </aside>
    </div></section>`,
    quoteSection({ title: 'Custom Order [AR500]', form: { id: 'quote-form', sizes: ['AR500'], inquiry: 'ar500' } }),
  ]),
};

// ---------------------------------------------------------------- custom fabrication
export const fabrication = {
  path: '/bedding-box-fabrication-company/', label: 'Custom Bedding Boxes', h1: 'Bedding Box Fabrication Company',
  crumbs: [SHOP], summary: 'Custom fabrication from 2.25 to 18+ cubic yards, built to your specifications.', image: 'custom-bedding-boxes', ogImage: 'custom-bedding-boxes',
  render: (c) => join([
    `<section class="page-title" data-bg="/images/12-yard-bedding-box-for-sale-7-800.webp" style="background-size:cover;background-position:center"><div class="box" style="background:rgba(245,245,245,.93);border-radius:16px;padding:28px">${c.crumbs.length ? `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${c.crumbs.map((b, i) => (i === c.crumbs.length - 1 ? `<li aria-current="page">${esc(b.label)}</li>` : `<li><a href="${b.href}">${esc(b.label)}</a></li>`)).join('')}</ol></nav>` : ''}
      <p class="kicker">Need custom bedding boxes?</p><h1>Bedding Box Fabrication Company</h1><p><strong>Competitively Priced. Fast Lead Times. Made Here in America with American Steel.</strong></p></div></section>`,
    `<section class="section"><div class="box layout-aside">
      <div class="prose">${fabO.why}<div class="btn-row btn-row--left">${button({ text: 'Request a Custom Quote', href: '#quote' })}</div></div>
      <aside class="card">${img('custom-bedding-boxes', 'Custom green bedding box rendering', { sizes: '(max-width: 959px) 100vw, 420px' })}<div class="prose" style="margin-top:16px">${fabO.provenInField}</div></aside>
    </div></section>`,
    `<section class="section section--gray"><div class="box grid-2 grid-2--top">
      <div class="prose">${fabO.sizeTable.replace(/<table>[\s\S]*?<\/table>/, fitTable())}</div>
      <div class="prose">${fabO.strength}</div>
    </div></section>`,
    `<section class="section"><div class="box">${img('bedding-box-specifications-brochure', 'Bedding box specifications drawing and size table', { sizes: '(max-width: 1140px) 100vw, 1100px' })}</div></section>`,
    quoteSection({ title: 'Send Us a [Message]', text: [`${SITE.responseTime} Office hours: ${SITE.officeHours}.`, 'Tell us the capacity, machine, wall/bottom thickness, colors and quantities you need. Include drawings or photos by email if you have them.'], form: { id: 'quote-form', sizes: ['Custom'], inquiry: 'custom_fabrication' } }),
    `<section class="cta-band cta-band--red"><h2>Still reading this? You’ve found us, make the call.</h2><p>Competitively priced and made here in America with thicker gauge American steel!</p>${phonePair('btn--dark')}</section>`,
  ]),
};

// ---------------------------------------------------------------- fleet bundles (Phase 8)
export const bundles = {
  path: '/fleet-bedding-box-bundles/', label: 'Fleet Bundles', h1: 'Rental Fleet & Contractor Bedding Box Bundles',
  summary: 'Mix-and-match 10 and 20 box bundles, plus large fleet and multi-location orders.', image: 'bedding-boxes-on-flatbed-truck', ogImage: 'bedding-boxes-on-flatbed-truck',
  render: (c) => join([
    `<section class="section section--dark" data-bg="/images/bedding-boxes-on-flatbed-truck-800.webp" style="background-size:cover;background-position:center;position:relative"><div class="box center" style="position:relative;background:rgba(10,10,10,.72);border-radius:16px;padding:40px 24px;max-width:900px">
      ${c.crumbs.length ? `<nav class="breadcrumbs" aria-label="Breadcrumb" style="display:flex;justify-content:center"><ol>${c.crumbs.map((b, i) => (i === c.crumbs.length - 1 ? `<li aria-current="page" style="color:#fff">${esc(b.label)}</li>` : `<li><a href="${b.href}" style="color:#fff">${esc(b.label)}</a></li>`)).join('')}</ol></nav>` : ''}
      <h1 style="color:#fff">Rental Fleet &amp; Contractor <span class="accent">Bundles</span></h1>
      <p style="color:#eee"><em>Mix and Match bundles that suit your need. Bundle quantities 10x, 20x, and larger. Learn more below.</em></p>
      <div class="btn-row">${BUNDLES.map((b) => button({ text: `${b.short} (Save ${b.discount}%)`, href: `#${b.anchor}`, track: 'bundle_inquiry' })).join('')}${button({ text: 'Larger Order Inquiry', href: `#${LARGE_ORDER.anchor}`, style: 'white', track: 'bundle_inquiry' })}</div>
    </div></section>`,
    `<section class="section"><div class="box">${sectionHead({ kicker: 'View bundles below', title: 'Video: [Why Choose Bedding Boxes Direct]' })}${youtube()}</div></section>`,
    ...BUNDLES.map((b, i) => `<section class="section${i % 2 ? '' : ' section--gray'}" id="${b.anchor}"><div class="box grid-2 grid-2--top">
      <div><p class="kicker">Rental fleet &amp; contractor bundle</p><h2>${esc(b.name)}</h2><p class="bundle__off">${b.discount}% OFF</p>
        <div class="prose">${(i === 0 ? bunO.bundle10 : bunO.bundle20).replace(/<h2>(.*?)<\/h2>/, '<h3>$1</h3>')}</div>
        <div class="btn-row btn-row--left">${button({ text: `Request ${b.short} Pricing`, href: `#bundle-form`, track: 'bundle_inquiry' })}${callButton('sales', { text: 'Call to Order', style: 'dark' })}</div></div>
      <div class="card card--white"><h3>How the ${b.boxes}-box bundle works</h3><ol><li>Choose any mix of sizes (3, 5, 7, 9, 12, 14 and 18 yard).</li><li>Tell us where they ship: one yard or several job sites/branches.</li><li>We quote the bundle with ${b.discount}% off the total order plus freight.</li><li>Custom paint colors available upon request.</li></ol></div>
    </div></section>`),
    `<section class="section section--red" id="${LARGE_ORDER.anchor}"><div class="box center box--narrow">
      <h2>Need More? Or Multi-Location Drop-Offs?</h2>
      <p>${esc(LARGE_ORDER.text)}</p><p><em>Call today. Office hours: ${esc(SITE.officeHours)}.</em></p>
      ${phonePair('btn--dark')}
    </div></section>`,
    `<section class="section section--gray"><div class="box">
      ${sectionHead({ kicker: 'Why buy in volume', title: 'Fleet Purchasing [Benefits]' })}
      <div class="grid-4">${BUNDLE_BENEFITS.map(([h, p]) => `<div class="card card--white"><h3 style="font-size:20px">${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
    </div></section>`,
    `<section class="section" id="bundle-form"><div class="box grid-2 grid-2--top">
      <div><p class="kicker">Custom combinations welcome</p><h2>Build Your <span class="accent">Bundle Quote</span></h2>
        <p>Tick the sizes you want, choose an estimated quantity and tell us how many of each size in the details box. Orders of 20+ boxes and multi-location deliveries are quoted directly by our sales team.</p>
        <ul class="checks">${['Mixed sizes in one order', 'One or multiple delivery locations', 'Custom paint colors on request', 'No cart or checkout: a real person quotes every order'].map((t) => `<li>${icon('check')}${esc(t)}</li>`).join('')}</ul>
        ${phonePair('btn--dark')}</div>
      <div>${leadForm({ id: 'bundle-form-el', title: 'Fleet / Bundle Inquiry', inquiry: 'bundle', quantity: '10–19 boxes (10-box bundle)', submit: 'Request Bundle Pricing' })}</div>
    </div></section>`,
    productSectionLite(),
  ]),
};
function productSectionLite() { return `<section class="section section--gray"><div class="box">${sectionHead({ title: 'Sizes Available for [Your Bundle]' })}${productGrid(PRODUCTS, { cta: false })}</div></section>`; }

export const productPages = [catalog, ...sizePages, miniExcavator, beddingBoxes, ar500, fabrication, bundles];
