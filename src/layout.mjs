// The page shell: <head> with all SEO tags, top bar, header + menu, footer, mobile call/quote bar.
import { esc, icon, img, imageUrl } from './lib.mjs';
import { SITE, mainPhone, phone as phoneFor } from './site.mjs';
import { NAV, FOOTER, LEGAL, DIRECTORY } from './content/navigation.mjs';
import { TRACKING, TURNSTILE_SITE_KEY, clientConfig } from './tracking.mjs';
import { BUNDLES, LARGE_ORDER } from './data/offers.mjs';
import { PRODUCTS } from './data/products.mjs';

const cur = (href, path) => (href === path ? ' aria-current="page"' : '');

// Desktop: each dropdown is a full-width mega panel (420px) that slides down from behind the header.
// Phones: the same group becomes a simple expandable list (.submenu) in the hamburger menu.
function megaPanel(g, path) {
  const m = g.mega;
  const links = (cls = 'mega__links') => `<ul class="${cls}">${g.items.map((x) => `<li${/^All /.test(x.label) ? ' class="mega__all"' : ''}><a href="${x.href}"${cur(x.href, path)}>${esc(x.label)}</a></li>`).join('')}</ul>`;
  if (m.type === 'image' && m.layout === 'custom') {
    // 4 columns: custom-box callout | links in two columns | photo to the right edge
    return `<div class="mega__grid mega__grid--custom">
      <div class="mega__intro"><p class="kicker">Custom bedding boxes</p><h2>Need a <span class="accent">Custom Box?</span></h2><p>Custom fabrication from 2.25 to 18+ cubic yards. Competitively priced, fast lead times, made here in America with American steel.</p><a class="btn btn--sm" href="/bedding-box-fabrication-company/">Build a Custom Box</a></div>
      <div class="mega__body mega__body--plain"><a class="mega__title" href="${g.href}">${esc(m.title)} <span aria-hidden="true">›</span></a>${links('mega__links mega__links--2col')}</div>
      <div class="mega__media">${img(m.image, m.alt, { sizes: '25vw' })}</div>
    </div>`;
  }
  if (m.type === 'image') {
    return `<div class="mega__grid mega__grid--image${m.layout === 'third' ? ' mega__grid--third' : ''}">
      <div class="mega__media">${img(m.image, m.alt, { sizes: '66vw' })}</div>
      <div class="mega__body"><a class="mega__title" href="${g.href}">${esc(m.title)} <span aria-hidden="true">›</span></a>${links(g.items.length > 9 || m.layout === 'third' ? 'mega__links mega__links--2col' : 'mega__links')}</div>
    </div>`;
  }
  if (m.type === 'deals') {
    const deal = (off, name, text, href, label, featured) => `<div class="mega-deal${featured ? ' mega-deal--featured' : ''}"><div class="mega-deal__off">${off}</div><p class="mega-deal__name">${name}</p><p>${esc(text)}</p><a class="btn btn--sm" href="${href}" data-track="bundle_inquiry">${esc(label)}</a></div>`;
    return `<div class="mega__grid mega__grid--deals box">
      <div class="mega__intro"><p class="kicker">Multi-box deals</p><h2>Buy More. <span class="accent">Save More.</span></h2><p>Mix and match any sizes. Bundle pricing for rental fleets and utility contractors standardizing their equipment.</p><a class="mega__title" href="${g.href}">All volume deals <span aria-hidden="true">›</span></a></div>
      ${BUNDLES.map((b, i) => deal(`${b.discount}% OFF`, `${esc(b.name)}<br>${esc(b.savings)}`, b.audience, `/fleet-bedding-box-bundles/#${b.anchor}`, `${b.short} Quote`, i === 0)).join('')}
      ${deal('20+', 'Large Fleet Orders<br>Best terms by phone', 'Multi-location and multistage orders with individual or multi-location delivery.', `/fleet-bedding-box-bundles/#${LARGE_ORDER.anchor}`, 'Discuss Your Fleet')}
    </div>`;
  }
  if (m.type === 'resources') {
    return `<div class="mega__grid mega__grid--resources box">
      <div class="mega__intro"><p class="kicker">Resources</p><h2>Know Your <span class="accent">Box</span></h2><p>Every size, dimension, steel thickness and recommended machine range on one sheet.</p><a class="btn btn--sm" href="${m.pdf}" target="_blank" rel="noopener" data-track="spec_sheet_download">Download Spec Sheet (PDF)</a></div>
      <form class="mega-calc" data-calc>
        <h3>Rent vs. Buy: Quick Check</h3>
        <label>Box size<select name="purchasePrice">${PRODUCTS.map((p) => `<option value="${p.price}"${p.size === 9 ? ' selected' : ''}>${p.size} yd · $${p.price.toLocaleString('en-US')}</option>`).join('')}</select></label>
        <div class="mega-calc__row"><label>Days per job<input name="daysPerJob" type="number" inputmode="decimal" min="0" value="5"></label><label>Jobs per year<input name="jobsPerYear" type="number" inputmode="decimal" min="0" value="12"></label></div>
        <input type="hidden" name="lifespan" value="10"><input type="hidden" name="resaleValue" value="2500"><input type="hidden" name="rentalRate" value="225">
        <button class="btn btn--sm" type="submit">Calculate</button>
        <div class="mega-calc__result" data-calc-result role="status" aria-live="polite"></div>
      </form>
      <div class="mega__body mega__body--plain">${links()}</div>
    </div>`;
  }
  return `<div class="mega__grid mega__grid--states box">
    <div class="mega__intro"><p class="kicker">Nationwide shipping</p><h2>Bedding Boxes <span class="accent">by State</span></h2><p>We ship to all 48 continental states. Pick yours for local conditions, sizes and your sales line.</p><a class="btn btn--sm" href="${g.href}">All States</a></div>
    <ul class="mega__states">${g.items.filter((x) => !/^All /.test(x.label)).map((x) => `<li><a href="${x.href}"${cur(x.href, path)}>${esc(x.label)}</a></li>`).join('')}</ul>
  </div>`;
}

function menu(path) {
  return NAV.map((g, i) => {
    if (!g.items) return `<li class="menu__item--${g.label.toLowerCase()}${g.href === path ? ' is-current' : ''}"><a class="menu__link" href="${g.href}"${cur(g.href, path)}>${esc(g.label)}</a></li>`;
    const inGroup = g.href === path || g.items.some((x) => x.href === path);
    const id = `sub-${i}`;
    return `<li class="has-mega${inGroup ? ' is-current' : ''}">
      <a class="menu__link" href="${g.href}"${cur(g.href, path)}>${esc(g.label)}</a>
      <button class="menu__sub-toggle" type="button" aria-expanded="false" aria-controls="${id}" aria-label="Show ${esc(g.label)} pages">${icon('caret')}</button>
      <ul class="submenu" id="${id}">${g.items.map((x) => `<li${/^All /.test(x.label) ? ' class="submenu__all"' : ''}><a href="${x.href}"${cur(x.href, path)}>${esc(x.label)}</a></li>`).join('')}</ul>
      ${g.mega ? `<div class="mega" id="${id}-mega">${megaPanel(g, path)}</div>` : ''}
    </li>`;
  }).join('');
}

function footer(path) {
  return `<footer class="footer">
  <div class="footer__wide footer__grid">
    <div>
      <a class="footer__logo" href="/">${img('bedding-boxes-direct-logo-2424px-blue', SITE.name, { sizes: '190px' })}</a>
      <p>${esc(SITE.summary)}</p>
      <ul class="footer__phones">
        ${SITE.phones.map((p) => `<li>${esc(p.label)}: <a href="${p.href}" data-track="phone_click">${esc(p.number)}</a></li>`).join('')}
        <li><a href="mailto:${SITE.email}">${SITE.email}</a></li>
      </ul>
      <div class="footer__social"><a href="${SITE.sameAs[0]}" aria-label="Bedding Boxes Direct on Facebook" rel="noopener" target="_blank">${icon('facebook')}</a><a href="mailto:${SITE.email}" aria-label="Email us">${icon('envelope')}</a></div>
    </div>
    ${FOOTER.map((c) => `<nav aria-label="${esc(c.title)}"><h2>${esc(c.title)}</h2><ul>${c.links.map(([l, h]) => `<li><a href="${h}"${cur(h, path)}>${esc(l)}</a></li>`).join('')}</ul></nav>`).join('')}
    <div><h2>Office Hours</h2><p>${esc(SITE.phones[0].hours)}<br>${esc(SITE.phones[1].hours)}</p><p>${esc(SITE.address.city)}, ${esc(SITE.address.region)}<br>Nationwide shipping (continental US)</p></div>
  </div>
</footer>
<section class="sitemap-band" aria-label="Sitemap">
  <div class="footer__wide">
    <h2 class="sitemap-band__title">Sitemap</h2>
    <div class="sitemap-band__groups">${DIRECTORY.map((g) => `<nav class="sitemap-band__group${g.states ? ' sitemap-band__group--states' : ''}" aria-label="${esc(g.title)}"><h3>${esc(g.title)}</h3><ul>${g.links.map(([l, h]) => `<li><a href="${h}"${cur(h, path)}>${esc(l)}</a></li>`).join('')}</ul></nav>`).join('')}</div>
  </div>
</section>
<div class="copyright-bar"><span>©${new Date().getFullYear()} ${esc(SITE.parentCompany)}</span><span>${LEGAL.map(([l, h]) => `<a href="${h}">${esc(l)}</a>`).join(' · ')}</span></div>`;
}

// page: { path, title, description, noindex, canonical, ogImage, minimal (ad pages), phoneKey }
export function layout({ page, body, assets, jsonLd = [] }) {
  const canonical = page.canonical === false ? '' : (page.canonical || SITE.url + page.path);
  const robots = page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const ogImage = `${SITE.url}${imageUrl(page.ogImage || 'bedding-boxes-direct-featured-image')}`;
  const p = phoneFor(page.phoneKey || 'mountain');
  const t = TRACKING;
  const minimal = page.minimal;
  return `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="${robots}">
${canonical ? `<link rel="canonical" href="${canonical}">` : ''}
<meta property="og:locale" content="en_US">
<meta property="og:type" content="${page.ogType || 'website'}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(page.ogTitle || page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${SITE.url + page.path}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon-32.png" sizes="32x32">
<link rel="icon" href="/favicon-192.png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#d42a35">
<link rel="preload" href="/fonts/oswald-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
${page.preload || ''}
<link rel="stylesheet" href="${assets.css}">
${jsonLd.map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, '\\u003c')}</script>`).join('\n')}
<script id="site-config" type="application/json">${JSON.stringify({ ...clientConfig(), page: page.track || '' })}</script>
</head>
<body${page.bodyClass ? ` class="${page.bodyClass}"` : ''}>
${t.gtm ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${t.gtm}" height="0" width="0" style="display:none;visibility:hidden" title="GTM"></iframe></noscript>` : ''}
<a class="skip-link" href="#main">Skip to content</a>
${minimal ? '' : `<div class="topbar"><ul>
  <li class="topbar__hide-sm">${icon('truck')}Nationwide Delivery</li>
  <li>${icon('flag')}American Made With American Steel</li>
  <li class="topbar__phone">${icon('phone')}<a href="${p.href}" data-track="phone_click">${esc(p.display)}</a></li>
</ul></div>`}
<header class="header${minimal ? ' lp-header' : ''}">
  <div class="header__inner">
    <a class="logo" href="${minimal ? '#main' : '/'}" aria-label="${esc(SITE.name)}${minimal ? '' : ' home'}">${img('bedding-boxes-direct-logo-2424px-blue', SITE.name, { eager: true, sizes: '(max-width: 1099px) 150px, 190px' })}</a>
    ${minimal ? `<a class="btn header__cta" style="display:inline-flex" href="${p.href}" data-track="phone_click">${icon('phone')}${esc(p.number)}</a>` : `<nav class="nav" aria-label="Main">
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="nav-panel" aria-label="Menu">${icon('menu', 'icon icon--open')}${icon('close', 'icon icon--close')}</button>
      <div class="nav__panel" id="nav-panel"><ul class="menu">${menu(page.path)}</ul></div>
      <a class="btn header__cta" href="/request-a-quote/" data-track="quote_request_click">Request a Quote</a>
    </nav>`}
  </div>
</header>
<main id="main">
${body}
</main>
${minimal ? `<footer class="footer" style="padding:30px 0 110px"><div class="box footer__bottom" style="margin:0;border:0"><span>©${new Date().getFullYear()} ${esc(SITE.name)} · ${esc(SITE.parentCompany)}</span><span><a href="/privacy-policy/">Privacy Policy</a></span></div></footer>` : footer(page.path)}
<a class="call-float" href="${p.href}" data-track="phone_click" aria-label="Call now: ${esc(p.number)}">${img('call-now-button', 'Call now', { sizes: '300px' })}</a>
<div class="mobile-cta"><a class="btn btn--dark" href="${p.href}" data-track="phone_click">${icon('phone')}Call</a><a class="btn" href="${page.quoteHref || '/request-a-quote/'}" data-track="quote_request_click">Get a Quote</a></div>
<script src="${assets.js}" defer></script>
${TURNSTILE_SITE_KEY && body.includes('data-lead-form') ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : ''}
</body>
</html>
`;
}

// ---------- structured data (facts from the published site only) ----------
export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: `${SITE.url}/`,
    logo: { '@type': 'ImageObject', url: `${SITE.url}/images/bedding-boxes-direct-logo-2424px-blue.webp`, width: 1600, height: 535 },
    email: SITE.email,
    description: SITE.summary,
    address: { '@type': 'PostalAddress', streetAddress: SITE.address.street, addressLocality: SITE.address.city, addressRegion: SITE.address.region, postalCode: SITE.address.postal, addressCountry: SITE.address.country },
    contactPoint: SITE.phones.map((p) => ({ '@type': 'ContactPoint', telephone: p.e164, contactType: 'sales', areaServed: 'US', availableLanguage: 'English', description: `${p.label} sales line, ${p.hours}` })),
    sameAs: SITE.sameAs,
  };
}

export const websiteLd = () => ({
  '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: `${SITE.url}/`,
  name: SITE.name, alternateName: 'Bedding Boxes For Sale', publisher: { '@id': `${SITE.url}/#organization` }, inLanguage: 'en-US',
});

export const webPageLd = (page) => ({
  '@context': 'https://schema.org', '@type': page.pageType || 'WebPage', '@id': `${SITE.url}${page.path}#webpage`,
  url: SITE.url + page.path, name: page.title, description: page.description, isPartOf: { '@id': `${SITE.url}/#website` },
  about: { '@id': `${SITE.url}/#organization` }, inLanguage: 'en-US',
  primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE.url}${imageUrl(page.ogImage || 'bedding-boxes-direct-featured-image')}` },
});

export const breadcrumbLd = (crumbs) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: SITE.url + c.href })),
});

export { mainPhone };
