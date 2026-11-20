// Reusable page sections. Every page is assembled from these, so the whole site shares one design.
import { esc, icon, img, join, money } from './lib.mjs';
import { SITE, mainPhone, phone as phoneFor } from './site.mjs';
import { PRODUCTS, SPECS, SPEC_ROWS, SPEC_SOURCE, FEATURES, priceText } from './data/products.mjs';
import { QUANTITY_OPTIONS } from './data/offers.mjs';
import { TURNSTILE_SITE_KEY } from './tracking.mjs';
import { US_STATES } from './data/states.mjs';

// ---------- buttons ----------
// data-track adds an analytics event on click (see src/assets/site.js).
export function button({ text, href, style = '', track = '', attrs = '' }) {
  const cls = ['btn', ...style.split(' ').filter(Boolean).map((s) => `btn--${s}`)].join(' ');
  const t = track || (href.startsWith('tel:') ? 'phone_click' : /request-a-quote|#quote/.test(href) ? 'quote_request_click' : '');
  return `<a class="${cls}" href="${esc(href)}"${t ? ` data-track="${t}"` : ''}${attrs ? ` ${attrs}` : ''}>${href.startsWith('tel:') ? icon('phone') : ''}${esc(text)}</a>`;
}
export const buttonRow = (buttons, cls = '') => `<div class="btn-row ${cls}">${buttons.map(button).join('')}</div>`;

export const callButton = (key, { text, style = '' } = {}) => {
  const p = phoneFor(key);
  return button({ text: text || `Call ${p.number}`, href: p.href, style });
};
export const quoteButton = (text = 'Request a Quote', style = '', href = '/request-a-quote/') => button({ text, href, style });

// Both sales lines, labelled by time zone.
// Each phone button shows only the number; the time zone and hours sit in text underneath.
export const phonePair = (style = '') => `<div class="phone-pair">${SITE.phones.map((p) => `<div class="phone-pair__item"><a class="btn ${style}" href="${p.href}" data-track="phone_click">${icon('phone')}${esc(p.number)}</a><p class="phone-pair__note">${esc(p.label)} · ${esc(p.hours)}</p></div>`).join('')}</div>`;

// ---------- headings ----------
// "Heavy Duty [Bedding Boxes] For Sale": text in [brackets] is shown in red, as on the original site.
export const accent = (s) => esc(s).replace(/\[(.+?)\]/g, '<span class="accent">$1</span>');
export const sectionHead = ({ kicker, title, text, tag = 'h2' }) => `<div class="section-head">
  ${kicker ? `<p class="kicker">${esc(kicker)}</p>` : ''}<${tag}>${accent(title)}</${tag}>${text ? [].concat(text).map((t) => `<p>${t}</p>`).join('') : ''}
</div>`;

export function breadcrumbs(crumbs) {
  if (!crumbs.length) return '';
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${crumbs.map((b, i) => (i === crumbs.length - 1
    ? `<li aria-current="page">${esc(b.label)}</li>` : `<li><a href="${b.href}">${esc(b.label)}</a></li>`)).join('')}</ol></nav>`;
}

// Grey title band used on the original info/industry pages.
export const pageTitle = ({ h1, crumbs = [], text }) => `<section class="page-title"><div class="box">${breadcrumbs(crumbs)}<h1>${esc(h1)}</h1>${text ? `<p>${text}</p>` : ''}</div></section>`;

// ---------- media ----------
// YouTube video that loads only when clicked (keeps pages fast). Poster comes from YouTube.
// Thumbnail: YouTube's full-HD frame (maxresdefault), falling back to the standard one if missing.
export const youtube = (id = SITE.youtube, title = 'Why choose Bedding Boxes Direct? (90 seconds)') => `<div class="yt">
  <img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" alt="" width="1280" height="720" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='https://i.ytimg.com/vi/${id}/hqdefault.jpg'">
  <button class="yt__btn" type="button" data-yt="${id}" aria-label="Play video: ${esc(title)}">${icon('play')}</button>
</div>`;

export const verticalVideo = (src = SITE.heroVideo, poster = 'bedding-boxes-direct-vertical-poster') => `<div class="vertical-video"><video src="${src}" poster="/images/${poster}-800.webp" muted loop playsinline controls preload="none" aria-label="Bedding boxes in the yard"></video></div>`;

export const startHere = ({ id = 'Start-Here', industries = true } = {}) => `<section class="section section--dark" id="${id}">
  <div class="box center">
    <h2 style="font-size:clamp(40px,6vw,64px);font-weight:700;margin:0">Start Here</h2>
    <p class="kicker" style="font-size:15px">Why choose Bedding Boxes Direct? (90 seconds)</p>
    <div style="margin-top:28px">${youtube()}</div>
    ${industries ? industriesStrip() : ''}
    <div class="btn-row">${button({ text: 'Find Your Size', href: '/all-bedding-boxes-for-sale/' })}</div>
  </div>
</section>`;

// "Industries Served" strip (Utilities, Excavation, Pipeline, Construction, Municipal, Telecom) — now linked.
export const INDUSTRY_STRIP = [
  ['Utilities', '/bedding-boxes-for-utility-companies/'], ['Excavation', '/industries/excavation-contractors/'],
  ['Pipeline', '/industries/pipeline-contractors/'], ['Construction', '/industries/civil-construction-contractors/'],
  ['Municipal', '/bedding-boxes-for-municipalities/'], ['Telecom', '/industries/telecommunications-fiber-contractors/'],
  ['Rental Fleets', '/industries/equipment-rental-fleets/'],
];
export const industriesStrip = (light = false) => `<h3 style="margin:44px 0 0;font:500 20px/1.2 var(--body);text-transform:uppercase;${light ? '' : 'color:#fff'}">Industries Served</h3>
<ul class="strip${light ? ' strip--light' : ''}">${INDUSTRY_STRIP.map(([l, h]) => `<li><a href="${h}">${esc(l)}</a></li>`).join('')}</ul>`;

// ---------- products ----------
export function productCard(p, { cta = true } = {}) {
  return `<article class="product-card">
  ${img(p.image, `${p.size} yard bedding box`, { sizes: '(max-width: 767px) 100vw, 360px' })}
  <div class="product-card__body">
    ${p.inStock ? '<span class="badge">Usually in stock</span>' : ''}
    <h3><a href="${p.path}">${p.size} Yard Bedding Box</a></h3>
    <p class="product-card__price">${priceText(p)}</p>
    <p class="product-card__meta">${esc(p.spec.machine)} machines · ${p.spec.weight.toLocaleString('en-US')} lbs</p>
    ${cta ? button({ text: 'Request a Quote', href: `/request-a-quote/?size=${p.size}`, style: 'sm' }) : ''}
  </div>
</article>`;
}
export const productGrid = (list = PRODUCTS, opts) => `<div class="products">${list.map((p) => productCard(p, opts)).join('')}</div>`;

export const productSection = ({ kicker = 'Sizes available for delivery (3yd to 18yd)', title = 'Heavy Duty [Bedding Boxes] For Sale', text, list, id = 'sizes', gray = false } = {}) => `<section class="section${gray ? ' section--gray' : ''}" id="${id}">
  <div class="box">${sectionHead({ kicker, title, text })}${productGrid(list)}
  <div class="btn-row">${button({ text: 'View All Sizes', href: '/all-bedding-boxes-for-sale/', style: 'outline' })}${callButton('mountain', { text: 'Call to Order' })}</div></div>
</section>`;

export const featureList = (items = FEATURES) => `<ul class="features">${items.map(([h, p]) => `<li><strong>${esc(h)}</strong> – ${esc(p)}</li>`).join('')}</ul>`;

export function specTable({ only, highlight } = {}) {
  const cols = SPECS.filter((s) => !only || only.includes(s.key));
  return `<div class="table-wrap"><table class="spec-table">
  <thead><tr><th scope="col">Box Volume</th>${cols.map((c) => `<th scope="col"${c.key === highlight ? ' class="is-current"' : ''}>${esc(c.label)}</th>`).join('')}</tr></thead>
  <tbody>${SPEC_ROWS.map(([k, label]) => `<tr><th scope="row">${esc(label)}</th>${cols.map((c) => `<td${c.key === highlight ? ' class="is-current"' : ''}>${esc(typeof c[k] === 'number' && k === 'weight' ? c[k].toLocaleString('en-US') : c[k])}</td>`).join('')}</tr>`).join('')}</tbody>
</table></div><p class="small" style="margin-top:10px">${esc(SPEC_SOURCE)}</p>`;
}

// ---------- calls to action ----------
export const skipTheCart = ({ title = 'Skip the [Cart].', text } = {}) => `<section class="cta-band">
  <h2>${accent(title)}</h2>
  <p>${text || 'Want to order over the phone or inquire regarding pricing discounts ordering multiple bedding boxes? <b><i>Skip the cart, call us direct!</i></b>'}</p>
  ${phonePair()}
</section>`;

export const ctaBand = ({ title = 'Ready to Order? [Talk to Our Team.]', text = 'Get pricing, lead times and freight for one box or a full fleet. Our team answers directly.', red = false, quoteHref = '/request-a-quote/' } = {}) => `<section class="cta-band${red ? ' cta-band--red' : ''}">
  <h2>${accent(title)}</h2><p>${text}</p>
  <div class="btn-row">${button({ text: 'Request a Quote', href: quoteHref, style: red ? 'white' : '' })}${button({ text: 'Ask About Volume Discounts', href: '/fleet-bedding-box-bundles/', style: red ? 'dark' : 'outline', track: 'bundle_inquiry' })}</div>
  ${phonePair(red ? 'btn--dark' : 'btn--dark')}
</section>`;

export const flagBand = ({ kicker = 'Why buy from us?', title, text, image = 'welder-welding-bedding-box', alt = 'Welder at Bedding Boxes Direct welding a box inside our facility.' }) => `<section class="flag-band" data-bg="/images/american-flag-background-image-800.webp" style="background-color:var(--red)">
  <div class="flag-band__card">
    <div><p class="kicker">${esc(kicker)}</p><h2>${accent(title)}</h2>${[].concat(text).map((t) => `<p>${t}</p>`).join('')}</div>
    <div>${img(image, alt, { sizes: '(max-width: 767px) 100vw, 520px' })}</div>
  </div>
</section>`;

// Case studies / use cases from the original site. Kept word-for-word; labelled as customer examples.
export const cases = (items, { note = true } = {}) => `<div class="cases">${items.map((c) => `<figure class="case${c.highlight ? ' case--highlight' : ''}"><blockquote style="margin:0"><p>${c.text}</p></blockquote><figcaption class="case__label">${esc(c.label)}</figcaption></figure>`).join('')}</div>
${note ? '<p class="disclaimer" style="margin-top:16px">Customer use cases as reported to Bedding Boxes Direct. Results depend on the project, crew and equipment and are not independently verified.</p>' : ''}`;

export function linkCards({ pages, heading, kicker, text, gray = true, id }) {
  return `<section class="section${gray ? ' section--gray' : ''}"${id ? ` id="${id}"` : ''}><div class="box">
  ${heading ? sectionHead({ kicker, title: heading, text }) : ''}
  <div class="link-cards">${pages.map((p) => `<a class="link-card" href="${p.href}"><span class="link-card__body"><span class="link-card__title">${esc(p.label)}</span>${p.summary ? `<span>${esc(p.summary)}</span>` : ''}<br><span class="link-card__more">Learn more ›</span></span></a>`).join('')}</div>
</div></section>`;
}

export const chips = (links, center = false) => `<ul class="chips${center ? ' chips--center' : ''}">${links.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul>`;

// ---------- lead form ----------
// One form for the whole site. Posts to functions/api/lead.js. Every field required by the brief is here,
// plus hidden attribution fields that src/assets/site.js fills in (first-touch + this page).
export const CUSTOMER_TYPES = ['Utility Contractor', 'Equipment Rental Fleet', 'Excavation Contractor', 'Pipeline Contractor', 'Water & Sewer Contractor', 'Municipality / Public Works', 'Civil / Site Development Contractor', 'Telecom / Fiber / Electrical Contractor', 'Trench Safety / Shoring Rental', 'Other'];
export const HIDDEN_FIELDS = ['landing_page_url', 'landing_page_path', 'form_page_url', 'form_page_path', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'li_fat_id', 'platform', 'campaign_audience', 'submitted_at', 'form_id', 'inquiry_type'];

export function leadForm({ id = 'quote-form', title = 'Request a Quote', platform = '', audience = '', inquiry = 'quote', customerType = '', sizes = [], quantity = '', submit = 'Send My Quote Request', compact = false, state = '' } = {}) {
  const f = (name) => `${id}-${name}`;
  const sizeOptions = [...PRODUCTS.map((p) => [`${p.size} yd`, `${p.size} Yard`]), ['Custom', 'Custom size'], ['AR500', 'AR500 upgrade'], ['Not sure', 'Not sure yet']];
  return `<form class="form" id="${id}" data-lead-form action="/api/lead" method="post" novalidate>
  ${title ? `<h2 class="form__title">${esc(title)}</h2>` : ''}
  <div class="form__trap" aria-hidden="true"><label for="${f('website')}">Website</label><input id="${f('website')}" name="website" tabindex="-1" autocomplete="off"></div>
  <div class="field field--half"><label class="req" for="${f('name')}">Full Name</label><input id="${f('name')}" name="full_name" autocomplete="name" required maxlength="120"></div>
  <div class="field field--half"><label class="req" for="${f('company')}">Company Name</label><input id="${f('company')}" name="company" autocomplete="organization" required maxlength="160"></div>
  <div class="field field--half"><label class="req" for="${f('email')}">Email Address</label><input id="${f('email')}" name="email" type="email" autocomplete="email" required maxlength="160"></div>
  <div class="field field--half"><label class="req" for="${f('phone')}">Phone Number</label><input id="${f('phone')}" name="phone" type="tel" autocomplete="tel" required pattern="[0-9()+\\-. ]{7,25}" title="Numbers and phone characters only"></div>
  <div class="field field--half"><label class="req" for="${f('state')}">State</label><select id="${f('state')}" name="state" required autocomplete="address-level1"><option value="">Select…</option>${US_STATES.map((s) => `<option${s.name === state ? ' selected' : ''}>${esc(s.name)}</option>`).join('')}<option>Alaska</option><option>Hawaii</option><option>Outside the US</option></select></div>
  <div class="field field--half"><label class="req" for="${f('type')}">Customer Type</label><select id="${f('type')}" name="customer_type" required><option value="">Select…</option>${CUSTOMER_TYPES.map((t) => `<option${t === customerType ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></div>
  <fieldset class="field"><legend>Interested Bedding Box Sizes</legend><div class="size-checks">${sizeOptions.map(([v, l]) => `<label><input type="checkbox" name="sizes" value="${esc(v)}"${sizes.includes(v) ? ' checked' : ''}>${esc(l)}</label>`).join('')}</div></fieldset>
  <div class="field field--half"><label class="req" for="${f('qty')}">Estimated Quantity</label><select id="${f('qty')}" name="quantity" required><option value="">Select…</option>${QUANTITY_OPTIONS.map((q) => `<option${q === quantity ? ' selected' : ''}>${esc(q)}</option>`).join('')}</select></div>
  <div class="field field--half"><label for="${f('timeline')}">Timeline</label><select id="${f('timeline')}" name="timeline"><option value="">Select…</option><option>As soon as possible</option><option>Within 30 days</option><option>1–3 months</option><option>Planning / budgeting</option></select></div>
  <div class="field"><label for="${f('msg')}">Message or Project Details</label><textarea id="${f('msg')}" name="message" rows="${compact ? 3 : 4}" maxlength="4000" placeholder="Sizes and quantities, delivery location(s), custom colors, project timing…"></textarea></div>
  ${HIDDEN_FIELDS.map((n) => `<input type="hidden" name="${n}" value="${esc(n === 'platform' ? platform : n === 'campaign_audience' ? audience : n === 'form_id' ? id : n === 'inquiry_type' ? inquiry : '')}">`).join('')}
  ${TURNSTILE_SITE_KEY ? `<div class="field cf-turnstile" data-sitekey="${TURNSTILE_SITE_KEY}"></div>` : ''}
  <button class="btn form__submit" type="submit">${esc(submit)}</button>
  <p class="form__status" role="status" aria-live="polite"></p>
  <p class="form__privacy">We use your details only to answer your inquiry. See our <a href="/privacy-policy/">Privacy Policy</a>. Prefer to talk? Call <a href="${mainPhone.href}" data-track="phone_click">${esc(mainPhone.number)}</a>.</p>
</form>`;
}

export const quoteSection = ({ id = 'quote', title = 'Get a Quote From Our Team', text, form = {}, gray = true } = {}) => `<section class="section${gray ? ' section--gray' : ''}" id="${id}">
  <div class="box grid-2 grid-2--top">
    <div>
      <p class="kicker">Talk directly with our sales team</p>
      <h2>${accent(title)}</h2>
      ${[].concat(text || ['Tell us what sizes and how many boxes you need, and where they are going. We will confirm pricing, availability, freight and lead time.', `${SITE.responseTime}`]).map((t) => `<p>${t}</p>`).join('')}
      <ul class="contact-list">
        ${SITE.phones.map((p) => `<li>${icon('phone')}<span><b>${esc(p.label)}</b><a href="${p.href}" data-track="phone_click">${esc(p.number)}</a> · ${esc(p.hours)}</span></li>`).join('')}
        <li>${icon('envelope')}<span><b>Email</b><a href="mailto:${SITE.email}">${SITE.email}</a></span></li>
      </ul>
    </div>
    <div>${leadForm({ title: '', ...form })}</div>
  </div>
</section>`;

export const bundleTeaser = (BUNDLES) => `<section class="section section--gray" id="volume-deals"><div class="box">
  ${sectionHead({ kicker: 'Multi-box deals', title: 'Buy More. [Save More.]', text: 'Mix and match any sizes. Bundle pricing for rental fleets and utility contractors standardizing their equipment.' })}
  <div class="grid-3">
    ${BUNDLES.map((b) => `<div class="bundle${b.boxes === 10 ? ' bundle--featured' : ''}"><div class="bundle__off">${b.discount}% OFF</div><p class="bundle__savings">${esc(b.name)}<br>${esc(b.savings)}</p><p>${esc(b.audience)}</p>${button({ text: `${b.short} Quote`, href: `/request-a-quote/?bundle=${b.boxes}`, style: 'sm', track: 'bundle_inquiry' })}</div>`).join('')}
    <div class="bundle"><div class="bundle__off">20+</div><p class="bundle__savings">Large Fleet Orders<br>Best terms by phone</p><p>Multi-location and multistage orders with individual or multi-location delivery.</p>${button({ text: 'Discuss Your Fleet', href: '/fleet-bedding-box-bundles/#large-fleet-orders', style: 'sm', track: 'bundle_inquiry' })}</div>
  </div>
</div></section>`;

export { money };
