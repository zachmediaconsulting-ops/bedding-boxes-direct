// Company, contact, resources (guides + calculator), policies, quote and thank-you pages.
import { esc, icon, img, join } from '../lib.mjs';
import { SITE, addressLine } from '../site.mjs';
import { PRODUCTS } from '../data/products.mjs';
import { BUNDLES } from '../data/offers.mjs';
import * as aboutO from '../content/original/about.mjs';
import * as contactO from '../content/original/contact.mjs';
import * as shipO from '../content/original/shipping.mjs';
import * as retO from '../content/original/returns.mjs';
import * as privO from '../content/original/privacy.mjs';
import * as whatO from '../content/original/what-is-a-bedding-box.mjs';
import * as sizeO from '../content/original/what-size.mjs';
import * as calcO from '../content/original/calculator.mjs';
import { NOT_SHORING } from '../content/shared.mjs';
import {
  accent, bundleTeaser, button, callButton, chips, ctaBand, leadForm, linkCards, pageTitle, phonePair, productGrid, productSection, quoteSection, sectionHead, skipTheCart,
} from '../components.mjs';

const RES = { label: 'Resources', href: '/blog/' };
const ABOUT = { label: 'About', href: '/about-bedding-boxes-direct/' };
const RESOURCE_PAGES = ['/what-is-a-bedding-box-used-for/', '/what-size-bedding-box-do-i-need/', '/bedding-box-rent-vs-buy-calculator/', '/shipping-details/', '/bedding-boxes-for-sale/'];
const infoLinks = (c, path) => `<div class="card"><h2 style="font-size:24px">Information Pages</h2>${chips(RESOURCE_PAGES.filter((p) => p !== path).map((h) => ({ href: h, label: c.page(h).label })))}</div>`;

// Common footer of the original informational pages: Skip the cart + Heavy Duty Bedding Boxes for Sale.
const infoTail = () => [skipTheCart(), productSection({ kicker: '', gray: true })];

// ---------------------------------------------------------------- about
export const about = {
  path: '/about-bedding-boxes-direct/', label: 'About', h1: 'About Bedding Boxes Direct',
  summary: 'American steel. American made. Meet the company behind the boxes.', image: 'stacy-swingley-bedding-boxes-direct', ogImage: 'stacy-swingley-bedding-boxes-direct',
  pageType: 'AboutPage',
  render: (c) => join([
    pageTitle({ h1: 'About Bedding Boxes Direct', crumbs: c.crumbs }),
    `<section class="section"><div class="box grid-2 grid-2--top">
      <figure style="margin:0"><div class="rounded">${img('stacy-swingley-bedding-boxes-direct', 'Owner Stacy Swingley', { sizes: '(max-width: 767px) 100vw, 540px' })}</div><figcaption class="caption">${aboutO.caption.replace(/<\/?p>/g, '')}</figcaption></figure>
      <div class="prose">${aboutO.headline.replace('<h2>', '<h2><span class="accent">').replace('</h2>', '</span></h2>')}${aboutO.body}</div>
    </div></section>`,
    `<section class="section section--gray"><div class="box grid-2">
      <div class="rounded">${img('bedding-boxes-direct-welding', 'Welding a bedding box with American steel', { sizes: '(max-width: 767px) 100vw, 540px' })}</div>
      <div class="rounded">${img('welder-fabricating-bedding-box', 'Welder fabricating a bedding box', { sizes: '(max-width: 767px) 100vw, 540px' })}</div>
    </div></section>`,
    `<section class="section"><div class="box grid-3">
      <div class="card"><h3>Who we serve</h3><p>Utility contractors first, equipment rental fleets second, and the excavation, pipeline and municipal crews who keep the country moving.</p><a href="/industries/">Industries we serve ›</a></div>
      <div class="card"><h3>How we sell</h3><p>Direct. No cart and no middleman: call or send a quote request and talk with our team about sizes, freight and volume pricing.</p><a href="/request-a-quote/">Request a quote ›</a></div>
      <div class="card"><h3>Where we ship</h3><p>${esc(SITE.shipsTo)} Customers may also arrange their own freight pickup.</p><a href="/shipping-details/">Shipping details ›</a></div>
    </div></section>`,
    ctaBand(),
  ]),
};

// ---------------------------------------------------------------- contact
export const contact = {
  path: '/contact-us/', label: 'Contact', h1: 'Contact Us', summary: 'Phone, email, office hours and our contact form.', pageType: 'ContactPage',
  image: 'monkey-selling-bedding-boxes',
  render: (c) => join([
    pageTitle({ h1: 'Contact Us', crumbs: c.crumbs, text: `Office Hours: ${esc(SITE.officeHours)}` }),
    `<section class="section"><div class="box grid-2 grid-2--top">
      <div>
        <ul class="contact-list" style="font-size:18px">
          ${SITE.phones.map((p) => `<li>${icon('phone')}<span><b>Phone · ${esc(p.label)}</b><a href="${p.href}" data-track="phone_click">+${esc(p.display)}</a><br><span class="small">${esc(p.hours)}</span></span></li>`).join('')}
          <li>${icon('envelope')}<span><b>Email Address</b><a href="mailto:${SITE.email}">${SITE.email}</a></span></li>
          <li>${icon('pin')}<span><b>Our Location</b>${esc(addressLine)}</span></li>
        </ul>
        <p class="kicker">Have a question?</p>
        <p>${esc(SITE.responseTime)}</p>
        <iframe class="map" src="https://maps.google.com/maps?q=${encodeURIComponent(addressLine)}&amp;t=m&amp;z=10&amp;output=embed" title="Map: ${esc(addressLine)}" loading="lazy"></iframe>
      </div>
      <div>${leadForm({ id: 'contact-form', title: 'Send Us a Message', inquiry: 'contact', submit: 'Send Message' })}</div>
    </div></section>`,
  ]),
};

// ---------------------------------------------------------------- shipping
export const shipping = {
  path: '/shipping-details/', label: 'Shipping Details', h1: 'Shipping Details', crumbs: [RES],
  summary: 'Nationwide freight to the continental US, or arrange your own pickup.', image: 'bedding-boxes-on-flatbed-truck', ogImage: 'bedding-boxes-on-flatbed-truck',
  render: (c) => join([
    pageTitle({ h1: 'Shipping Details', crumbs: c.crumbs, text: `Office Hours: ${esc(SITE.officeHours)}` }),
    `<section class="section"><div class="box grid-2 grid-2--top">
      <div class="prose">${shipO.body.replace('<p>+1 (307) 263-5020</p>', '')}${phonePair()}
        <h2>Multi-Box and Multi-Location Orders</h2>
        <p>Fleet and bundle orders can ship to one location or be split across several job sites or branch yards. Tell us the delivery addresses and we will quote freight with your order. See <a href="/fleet-bedding-box-bundles/">fleet bundles</a>.</p>
        <h2>Shipping by State</h2>
        <p>We ship to every state in the continental US. Find information for your state in our <a href="/bedding-boxes-for-sale/">state shipping directory</a>.</p>
      </div>
      <div class="rounded">${img('monkey-selling-bedding-boxes', 'Funny Bedding Boxes Direct image of a monkey holding a phone to describe we are ready for your call.', { sizes: '(max-width: 767px) 100vw, 540px' })}</div>
    </div></section>`,
    ...infoTail(),
  ]),
};

// ---------------------------------------------------------------- policies
export const returns = {
  path: '/return-refund-policy/', label: 'Return & Refund Policy', h1: 'Return & Refund Policy', crumbs: [ABOUT],
  render: (c) => join([
    pageTitle({ h1: 'Return & Refund Policy', crumbs: c.crumbs, text: `Office Hours: ${esc(SITE.officeHours)}` }),
    `<section class="section"><div class="box box--narrow prose">${retO.body.replace(/<h2>Return &amp; Refund Policy<\/h2>/, '')}</div></section>`,
  ]),
};
export const privacy = {
  path: '/privacy-policy/', label: 'Privacy Policy', h1: 'Privacy Policy', crumbs: [ABOUT],
  render: (c) => join([
    pageTitle({ h1: 'Privacy Policy', crumbs: c.crumbs }),
    `<section class="section"><div class="box box--narrow prose">${privO.body}
      <h2>Quote Requests and Campaign Attribution</h2>
      <p><em>Added November 2026 with the new website.</em> When you send a quote or contact form we collect the details you enter (name, company, email, phone, state, customer type, sizes, quantity and message) and use them only to respond to your inquiry and provide quotes. To understand which pages and advertising campaigns bring inquiries, our website stores the page you first arrived on and any campaign tags in the link (such as utm parameters or ad click identifiers from Google, Meta or LinkedIn) in your browser’s local storage for up to 90 days and includes them with your form submission. Our advertising partners (Google Ads, Meta and LinkedIn) may receive conversion signals when a quote request is completed. You can clear this information at any time by clearing your browser’s site data.</p>
    </div></section>`,
  ]),
};

// ---------------------------------------------------------------- guides
export const whatIs = {
  path: '/what-is-a-bedding-box-used-for/', label: 'What is a bedding box used for?', h1: 'What is a bedding box used for?', crumbs: [RES],
  summary: 'Uses and applications: how gravel and stone boxes work on excavation, trenching and utility projects.', image: 'what-are-bedding-boxes-used-for', ogImage: 'what-are-bedding-boxes-used-for',
  pageType: 'Article',
  render: (c) => join([
    pageTitle({ h1: 'What is a bedding box used for?', crumbs: c.crumbs }),
    `<section class="section"><div class="box layout-aside">
      <article class="prose">${whatO.headline}
        <figure style="margin:0 0 1.2em">${img('what-are-bedding-boxes-used-for', 'Excavator returning from a gravel pile to place bedding material', { sizes: '(max-width: 959px) 100vw, 680px' })}<figcaption class="caption">${whatO.caption.replace(/<\/?p>/g, '')}</figcaption></figure>
        ${whatO.body}
        <p><strong>Safety note:</strong> ${esc(NOT_SHORING)}</p>
      </article>
      <aside>
        <div class="card card--line prose">${whatO.caseStudy}<p class="disclaimer">Customer example as published; results vary by project.</p></div>
        <div style="margin-top:20px">${infoLinks(c, '/what-is-a-bedding-box-used-for/')}</div>
      </aside>
    </div></section>`,
    ...infoTail(),
  ]),
};

export const whatSize = {
  path: '/what-size-bedding-box-do-i-need/', label: 'What size bedding box do I need?', h1: 'What Size Bedding Box Do I Need?', crumbs: [RES],
  summary: 'Size selection guide: match the box to your excavator and project.', image: 'what-are-bedding-boxes-used-for', ogImage: 'what-are-bedding-boxes-used-for',
  pageType: 'Article',
  render: (c) => join([
    pageTitle({ h1: 'What Size Bedding Box Do I Need?', crumbs: c.crumbs }),
    `<section class="section"><div class="box layout-aside">
      <article class="prose">${sizeO.headline}
        <figure style="margin:0 0 1.2em">${img('what-are-bedding-boxes-used-for', 'Bedding box beside a trench with an excavator', { sizes: '(max-width: 959px) 100vw, 680px' })}<figcaption class="caption">${sizeO.caption.replace(/<\/?p>/g, '')}</figcaption></figure>
        ${sizeO.body}
      </article>
      <aside>
        <div class="card"><h2 style="font-size:24px">Size by Machine (Spec Sheet)</h2>
          <div class="table-wrap"><table class="spec-table" style="min-width:0"><thead><tr><th>Box</th><th>Machine*</th></tr></thead><tbody>${PRODUCTS.map((p) => `<tr><td><a href="${p.path}">${p.size} yd</a></td><td>${esc(p.spec.machine)} · ${esc(p.spec.hp)}</td></tr>`).join('')}</tbody></table></div>
          <p class="small" style="margin-top:8px">*Suggested ranges from our specification sheet (Rev. 9/23/2025). Always consult your machine manufacturer. <a href="/all-bedding-boxes-for-sale/#compare">Full specs</a>.</p></div>
        <div style="margin-top:20px">${infoLinks(c, '/what-size-bedding-box-do-i-need/')}</div>
      </aside>
    </div></section>`,
    `<section class="section section--gray"><div class="box">${sectionHead({ kicker: 'Still deciding?', title: 'Talk Through Your [Machine and Job]', text: 'Tell us your excavator weight and the work you do. We will recommend a size and quote it.' })}<div class="btn-row">${button({ text: 'Request a Quote', href: '/request-a-quote/' })}${callButton('mountain', { text: 'Call Us', style: 'dark' })}</div></div></section>`,
    ...infoTail(),
  ]),
};

export const calculator = {
  path: '/bedding-box-rent-vs-buy-calculator/', label: 'Rent vs. Buy Calculator', h1: 'Bedding Box Rent vs. Buy Calculator', crumbs: [RES],
  summary: 'Compare annual rental cost with ownership cost and see your payback period.', image: '9-yard-bedding-box-for-sale-2', ogImage: '9-yard-bedding-box-for-sale-2',
  render: (c) => join([
    pageTitle({ h1: 'Bedding Box Rent vs. Buy Calculator', crumbs: c.crumbs }),
    `<section class="section"><div class="box box--narrow prose">${calcO.headline}<p class="lead"><em>${calcO.caption.replace(/<\/?p>/g, '')}</em></p>${calcO.body}</div></section>`,
    `<section class="section section--gray"><div class="box grid-2 grid-2--top"><div class="card card--white prose">${calcO.renting}</div><div class="card card--line prose">${calcO.buying}</div></div></section>`,
    `<section class="section" id="calculator"><div class="box"><div class="calc">
      <h2 class="center">Bedding Box Rent vs. Buy Calculator</h2>
      <p class="center">Enter your project details, and the calculator will automatically compare your annual rental costs against long-term ownership costs to reveal your breakeven point and estimated savings.</p>
      <form class="form" id="calc-form">
        <div class="field field--half"><label for="purchasePrice">Purchase Price ($)</label><input id="purchasePrice" type="number" inputmode="decimal" min="0" placeholder="e.g. ${PRODUCTS.find((p) => p.size === 9).price}"></div>
        <div class="field field--half"><label for="lifespan">Estimated Lifespan (years)</label><input id="lifespan" type="number" inputmode="decimal" min="1" value="10"></div>
        <div class="field field--half"><label for="resaleValue">Expected Resale Value ($)</label><input id="resaleValue" type="number" inputmode="decimal" min="0" value="2500"></div>
        <div class="field field--half"><label for="rentalRate">Rental Rate per Day ($)</label><input id="rentalRate" type="number" inputmode="decimal" min="0" value="225"></div>
        <div class="field field--half"><label for="daysPerJob">Days Used per Job</label><input id="daysPerJob" type="number" inputmode="decimal" min="0" placeholder="e.g. 5"></div>
        <div class="field field--half"><label for="jobsPerYear">Jobs per Year</label><input id="jobsPerYear" type="number" inputmode="decimal" min="0" placeholder="e.g. 12"></div>
        <button class="btn form__submit" type="submit">Calculate</button>
      </form>
      <div class="calc__result" id="calc-result" role="status" aria-live="polite" hidden></div>
      <p class="small" style="margin-top:14px">Current list prices: ${PRODUCTS.map((p) => `${p.size} yd $${p.price.toLocaleString('en-US')}`).join(' · ')}.</p>
    </div></div></section>`,
    `<section class="section section--gray"><div class="box box--narrow prose">${calcO.summary}</div></section>`,
    ...infoTail(),
  ]),
};

// ---------------------------------------------------------------- resources hub (original /blog/ URL)
export const blog = {
  path: '/blog/', label: 'Resources', h1: 'Bedding Box Resources & Use Cases',
  summary: 'Guides, calculators and use cases for buying and using bedding boxes.',
  seoChange: 'The WordPress /blog/ page had no posts and the generic description; the page is now the resources hub listing all guides (2026-11).',
  title: 'Bedding Box Resources & Guides | Bedding Boxes Direct',
  description: 'Bedding box guides and use cases: what bedding boxes are used for, size selection, rent vs. buy calculator, shipping, and buying guides by industry and state.',
  render: (c) => join([
    pageTitle({ h1: 'Bedding Box Resources & Use Cases', crumbs: c.crumbs, text: 'Learn awesome things: how bedding boxes work, how to choose a size, and when owning beats renting.' }),
    linkCards({ heading: 'Guides & Tools', pages: RESOURCE_PAGES.map(c.card), gray: false }),
    linkCards({ heading: 'Buying Guides by [Equipment Name]', text: 'Bedding boxes go by many names on the jobsite. These guides explain each term.', pages: ['/gravel-boxes-for-sale/', '/stone-boxes-for-sale/', '/excavator-bedding-boxes/', '/pipe-bedding-boxes/', '/stone-mizer-alternative/', '/bedding-boxes-for-trenching/'].map(c.card) }),
    linkCards({ heading: 'Use Cases by [Industry]', pages: ['/bedding-boxes-for-utility-companies/', '/industries/equipment-rental-fleets/', '/bedding-boxes-for-municipalities/', '/industries/water-sewer-contractors/', '/industries/pipeline-contractors/', '/industries/excavation-contractors/'].map(c.card), gray: false }),
    `<section class="cta-band"><h2>See What Is Available <span class="accent">Immediately!</span></h2><p>7 yd and 9 yd boxes are usually in stock for fast shipping.</p><div class="btn-row">${button({ text: 'Visit Store', href: '/all-bedding-boxes-for-sale/' })}</div></section>`,
  ]),
};

// ---------------------------------------------------------------- request a quote (replaces cart/checkout)
export const requestQuote = {
  path: '/request-a-quote/', label: 'Request a Quote', h1: 'Request a Bedding Box Quote',
  title: 'Request a Bedding Box Quote | Bedding Boxes Direct',
  description: 'Request a quote for one bedding box or a full fleet. Pick sizes and quantities, tell us where they ship, and our sales team will reply within 24 hours.',
  summary: 'Pick sizes and quantities and our team will quote price, freight and lead time.',
  render: (c) => join([
    pageTitle({ h1: 'Request a Bedding Box Quote', crumbs: c.crumbs, text: 'One box or a full fleet: tell us what you need and where it ships. No cart, no checkout, just a direct answer from our team.' }),
    `<section class="section"><div class="box grid-2 grid-2--top">
      <div>${leadForm({ id: 'quote-form', title: '', inquiry: 'quote' })}</div>
      <div>
        <h2>What Happens Next</h2>
        <ol class="prose"><li>We review your sizes, quantities and delivery location(s).</li><li>We confirm price, availability, freight and lead time, including any bundle discount.</li><li>You get a direct quote by email or phone. ${esc(SITE.responseTime)}</li></ol>
        <div class="card" style="margin-top:20px"><h3>Volume Discounts</h3><ul class="checks">${BUNDLES.map((b) => `<li>${icon('check')}<strong>${esc(b.short)}:</strong> save ${b.discount}% on any mix of sizes</li>`).join('')}<li>${icon('check')}<strong>20+ boxes:</strong> large fleet and multi-location pricing</li></ul><a href="/fleet-bedding-box-bundles/">Bundle details ›</a></div>
        <h3 style="margin-top:24px">Prefer to Talk?</h3>${phonePair()}
      </div>
    </div></section>`,
    `<section class="section section--gray"><div class="box">${sectionHead({ title: 'Current [Bedding Box Prices]' })}${productGrid(PRODUCTS, { cta: false })}</div></section>`,
  ]),
};

export const thankYou = {
  path: '/thank-you/', label: 'Thank You', h1: 'Thank You. Your Request Was Received.', noindex: true,
  title: 'Thank You | Bedding Boxes Direct', description: 'Your bedding box inquiry was received. Our sales team will contact you shortly.',
  render: () => `<section class="section"><div class="box thanks-box">
    <p class="kicker">Request received</p><h1>Thank You. Your Request Was Received.</h1>
    <p class="lead">Our sales team has your details and will reply shortly. ${esc(SITE.responseTime)}</p>
    <p>Need an answer now? Call us directly:</p>${phonePair()}
    <div class="btn-row">${button({ text: 'Back to Bedding Boxes', href: '/all-bedding-boxes-for-sale/', style: 'outline' })}</div>
  </div></section>`,
};

export const notFound = {
  path: '/404/', file: '404.html', label: 'Page Not Found', h1: 'Page Not Found', noindex: true, canonical: false,
  title: 'Page Not Found | Bedding Boxes Direct', description: 'The page you were looking for doesn’t exist or has moved.',
  render: (c) => join([
    pageTitle({ h1: 'Page Not Found', text: 'That page doesn’t exist or has moved. Try one of these:' }),
    `<section class="section"><div class="box">${productGrid(PRODUCTS)}<div class="btn-row">${button({ text: 'Go to Home', href: '/' })}${button({ text: 'Request a Quote', href: '/request-a-quote/', style: 'outline' })}</div></div></section>`,
  ]),
};

export const infoPages = [about, contact, shipping, returns, privacy, whatIs, whatSize, calculator, blog, requestQuote, thankYou, notFound];
