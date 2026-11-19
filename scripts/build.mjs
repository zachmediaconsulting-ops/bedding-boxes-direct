// Builds the whole site into dist/ and checks it.
//   npm run build
// Steps: render every page, copy public/, fingerprint CSS/JS, write sitemap.xml, robots.txt, _redirects,
// _headers and reports/, then FAIL the build on any SEO-protection or quality problem:
//   • a published WordPress URL that is neither rebuilt nor 301-redirected (src/data/legacy-seo.json)
//   • a migrated page whose title/description differs from WordPress without a documented `seoChange`
//   • broken internal links/anchors, missing images, duplicate titles/descriptions/H1s, not exactly one H1
//   • missing/incorrect canonical, indexable campaign pages, noindexed SEO pages, WordPress leftovers
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SITE } from '../src/site.mjs';
import { layout, organizationLd, websiteLd, webPageLd, breadcrumbLd } from '../src/layout.mjs';
import { PAGE_REDIRECTS, imageRedirects } from '../src/redirects.mjs';
import { ALL_PAGES } from '../src/pages/index.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const LEGACY = JSON.parse(readFileSync(join(root, 'src/data/legacy-seo.json'), 'utf8'));
rmSync(dist, { recursive: true, force: true });
cpSync(join(root, 'public'), dist, { recursive: true });

// ---- assets: one CSS file (fonts + site) and one JS file, named by content hash for long caching ----
const fingerprint = (name, ext, content) => {
  const file = `/assets/${name}.${createHash('sha256').update(content).digest('hex').slice(0, 10)}.${ext}`;
  mkdirSync(join(dist, 'assets'), { recursive: true });
  writeFileSync(join(dist, file), content);
  return file;
};
const minifyCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
const assets = {
  css: fingerprint('site', 'css', minifyCss(readFileSync(join(root, 'src/assets/fonts.css'), 'utf8') + readFileSync(join(root, 'src/assets/site.css'), 'utf8'))),
  js: fingerprint('site', 'js', readFileSync(join(root, 'src/assets/site.js'), 'utf8')),
};

// ---- page registry ----
const byPath = new Map();
for (const p of ALL_PAGES) {
  if (byPath.has(p.path)) throw new Error(`Duplicate route ${p.path}`);
  if (!/^\/([a-z0-9]+(-[a-z0-9]+)*\/)*$/.test(p.path)) throw new Error(`Route is not a clean URL: ${p.path}`);
  byPath.set(p.path, p);
}
const ctx = (page) => ({
  crumbs: page.path === '/' ? [] : [{ label: 'Home', href: '/' }, ...(page.crumbs || []), { label: page.label || page.h1, href: page.path }],
  page: (path) => byPath.get(path) || (() => { throw new Error(`${page.path}: link to unknown page ${path}`); })(),
  card: (path) => { const p = byPath.get(path); if (!p) throw new Error(`${page.path}: card for unknown page ${path}`); return { href: p.path, label: p.label || p.h1, summary: p.summary, image: p.image }; },
});

// ---- render ----
const report = [];
for (const page of ALL_PAGES) {
  const c = ctx(page);
  const body = page.render(c);
  const jsonLd = [];
  if (page.path === '/') jsonLd.push(organizationLd(), websiteLd());
  else jsonLd.push({ ...organizationLd(), '@context': 'https://schema.org' });
  if (!page.minimal) jsonLd.push(webPageLd(page));
  if (c.crumbs.length && !page.minimal) jsonLd.push(breadcrumbLd(c.crumbs));
  for (const extra of [].concat(page.schema ? page.schema(c) : [])) jsonLd.push(extra);
  const html = layout({ page, body, assets, jsonLd });
  const out = page.file ? join(dist, page.file) : join(dist, page.path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  report.push({ page, html });
}

// ---- sitemap, robots, redirects, headers ----
const indexable = report.filter(({ page }) => !page.noindex && !page.file);
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map(({ page }) => `  <url><loc>${SITE.url}${page.path}</loc></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nDisallow: /api/\nDisallow: /thank-you/\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
const imgRedirects = imageRedirects();
writeFileSync(join(dist, '_redirects'), [
  '# Old WordPress pages -> new pages (301). Source: src/redirects.mjs',
  ...Object.entries(PAGE_REDIRECTS).map(([from, to]) => `${from} ${to} 301`),
  '# Old WordPress image URLs -> new optimized images (301)',
  ...imgRedirects.map(([from, to]) => `${from} ${to} 301`),
  '/wp-content/uploads/2025/08/Bedding-Vertical-Final.mp4 /media/bedding-boxes-direct-vertical.mp4 301',
  '/wp-content/uploads/2025/08/Bedding-Box-Intro.mp4 /media/bedding-box-intro.mp4 301',
  '/feed/ / 301', '/wp-login.php / 301', '/wp-admin/* / 301',
].join('\n') + '\n');
writeFileSync(join(dist, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: SAMEORIGIN
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/fonts/*
  Cache-Control: public, max-age=31536000, immutable
/images/*
  Cache-Control: public, max-age=2592000
/media/*
  Cache-Control: public, max-age=2592000
/thank-you/*
  X-Robots-Tag: noindex
`);

// ---- checks ----
const errors = [];
const warn = [];
const ids = new Map(report.map(({ page, html }) => [page.path, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))]));
const unique = (label, pick) => {
  const seen = new Map();
  for (const { page, html } of report) {
    if (page.file) continue;
    const v = pick(page, html);
    if (!v) { errors.push(`${page.path}: missing ${label}`); continue; }
    if (seen.has(v)) errors.push(`Duplicate ${label} on ${seen.get(v)} and ${page.path}: "${v}"`);
    seen.set(v, page.path);
  }
};
unique('title', (p) => p.title);
unique('meta description', (p) => p.description);
unique('H1', (p, html) => (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]?.replace(/<[^>]+>/g, '').trim());

for (const { page, html } of report) {
  const where = page.file || page.path;
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${where}: must have exactly one H1`);
  if (!page.file && page.canonical !== false && !html.includes(`<link rel="canonical" href="${page.canonical || SITE.url + page.path}">`)) errors.push(`${where}: canonical missing`);
  if (/wp-content|wp-includes|elementor|woocommerce|add-to-cart/i.test(html)) errors.push(`${where}: contains WordPress/Elementor/WooCommerce code`);
  if (page.campaign && !page.noindex) errors.push(`${where}: campaign pages must be noindex`);
  if (page.title.length > 70) warn.push(`${where}: title is ${page.title.length} characters`);
  if (page.description.length > 175) warn.push(`${where}: description is ${page.description.length} characters`);
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|tel:|mailto:)/.test(href)) continue;
    const [pathq, hash] = href.split('#');
    const path = pathq.split('?')[0];
    const target = path === '' ? page.path : path;
    if (/\.\w+$/.test(target)) { if (!existsSync(join(dist, target))) errors.push(`${where}: missing file ${href}`); continue; }
    if (!byPath.has(target)) { errors.push(`${where}: broken link ${href}`); continue; }
    if (hash && !ids.get(target).has(hash)) errors.push(`${where}: broken anchor ${href}`);
  }
  for (const [, src] of html.matchAll(/(?:src|srcset|poster|data-bg)="([^"]+)"/g)) {
    for (const part of src.split(',')) {
      const url = part.trim().split(' ')[0];
      if (url.startsWith('/') && !existsSync(join(dist, url))) errors.push(`${where}: missing file ${url}`);
    }
  }
}

// SEO URL protection: every published WordPress URL is either rebuilt (same URL) or redirected.
const legacyReport = [];
for (const [path, old] of Object.entries(LEGACY)) {
  const page = byPath.get(path);
  const redirect = PAGE_REDIRECTS[path];
  if (page && redirect) errors.push(`${path}: both a page and a redirect`);
  if (!page && !redirect) { errors.push(`${path}: published on WordPress but neither rebuilt nor redirected`); continue; }
  if (redirect) {
    const target = redirect.split('#')[0];
    if (!byPath.has(target)) errors.push(`${path}: redirects to missing page ${redirect}`);
    legacyReport.push({ path, status: 301, to: redirect, old });
    continue;
  }
  const titleSame = page.title === old.title; const descSame = page.description === old.description;
  if ((!titleSame || !descSame) && !page.seoChange) errors.push(`${path}: title/description changed from WordPress without a documented seoChange`);
  if (page.noindex && !/noindex/.test(old.action || '')) warn.push(`${path}: was indexable on WordPress, now noindex`);
  legacyReport.push({ path, status: 200, titleSame, descSame, seoChange: page.seoChange || '', old, now: { title: page.title, description: page.description } });
}
for (const [from, to] of Object.entries(PAGE_REDIRECTS)) {
  if (byPath.has(from)) errors.push(`${from}: redirect source is also a page`);
  if (!byPath.has(to.split('#')[0])) errors.push(`${from}: redirect target ${to} does not exist`);
}

// Reports for the migration docs.
mkdirSync(join(root, 'reports'), { recursive: true });
const oldSitemap = Object.keys(LEGACY).filter((p) => LEGACY[p].inSitemap !== false);
writeFileSync(join(root, 'reports/route-report.json'), JSON.stringify({
  built: report.map(({ page }) => ({ path: page.file || page.path, title: page.title, noindex: !!page.noindex, campaign: !!page.campaign, inSitemap: !page.noindex && !page.file })),
  legacy: legacyReport, redirects: PAGE_REDIRECTS, warnings: warn,
}, null, 1));

if (warn.length) console.warn(`Warnings (${warn.length}):\n  ${warn.join('\n  ')}`);
if (errors.length) {
  console.error(`Build checks failed (${errors.length}):\n  ${[...new Set(errors)].join('\n  ')}`);
  process.exit(1);
}
console.log(`Built ${report.length} pages (${indexable.length} in sitemap.xml, ${report.filter((r) => r.page.noindex).length} noindex). ${Object.keys(PAGE_REDIRECTS).length} page + ${imgRedirects.length} image redirects. ${Object.keys(LEGACY).length} WordPress URLs protected. Links, anchors, images, titles, descriptions, H1s and canonicals checked.`);
