// The page shell: <head> with all SEO tags, top bar, header + menu, footer, mobile call/quote bar.
import { esc, icon, img, imageUrl } from './lib.mjs';
import { SITE, mainPhone, phone as phoneFor } from './site.mjs';
import { NAV, FOOTER, LEGAL } from './content/navigation.mjs';
import { TRACKING, TURNSTILE_SITE_KEY, clientConfig } from './tracking.mjs';

const cur = (href, path) => (href === path ? ' aria-current="page"' : '');

function menu(path) {
  return NAV.map((g, i) => {
    if (!g.items) return `<li${g.href === path ? ' class="is-current"' : ''}><a class="menu__link" href="${g.href}"${cur(g.href, path)}>${esc(g.label)}</a></li>`;
    const inGroup = g.href === path || g.items.some((x) => x.href === path);
    const id = `sub-${i}`;
    return `<li${inGroup ? ' class="is-current"' : ''}>
      <a class="menu__link" href="${g.href}"${cur(g.href, path)}>${esc(g.label)}</a>
      <button class="menu__sub-toggle" type="button" aria-expanded="false" aria-controls="${id}" aria-label="Show ${esc(g.label)} pages">${icon('caret')}</button>
      <ul class="submenu" id="${id}">${g.items.map((x) => `<li${/^All /.test(x.label) ? ' class="submenu__all"' : ''}><a href="${x.href}"${cur(x.href, path)}>${esc(x.label)}</a></li>`).join('')}</ul>
    </li>`;
  }).join('');
}

function footer(path) {
  return `<footer class="footer">
  <div class="box footer__grid">
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
  <div class="box"><div class="footer__bottom"><span>©${new Date().getFullYear()} ${esc(SITE.parentCompany)}</span><span>${LEGAL.map(([l, h]) => `<a href="${h}">${esc(l)}</a>`).join(' · ')}</span></div></div>
</footer>`;
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
  <li>${icon('phone')}<a href="${p.href}" data-track="phone_click">${esc(p.display)}</a></li>
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
