const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const base = 'http://127.0.0.1:8788';
  const rep = JSON.parse(fs.readFileSync('/home/user/bbd-migration/site/reports/route-report.json'));
  const pages = rep.built.map((p) => p.path).filter((p) => !p.endsWith('.html'));
  const problems = [];
  // HTTP: routes, redirects, legacy WordPress URLs, headers
  for (const p of pages) { const r = await fetch(base + p, { redirect: 'manual' }); if (r.status !== 200) problems.push(`HTTP ${r.status} ${p}`); }
  for (const [from, to] of Object.entries(rep.redirects)) { const r = await fetch(base + from, { redirect: 'manual' }); const loc = r.headers.get('location') || ''; if (![301, 308].includes(r.status) || !loc.replace(base, '').startsWith(to.split('#')[0])) problems.push(`REDIRECT ${from} -> ${r.status} ${loc}`); }
  const legacy = rep.legacy.map((l) => l.path);
  for (const p of legacy) { const r = await fetch(base + p, { redirect: 'manual' }); if (![200, 301, 308].includes(r.status)) problems.push(`LEGACY ${p} ${r.status}`); }
  const nf = await fetch(base + '/no-such-page/'); if (nf.status !== 404) problems.push(`404 page returns ${nf.status}`);
  const h = await fetch(base + '/'); if (h.headers.get('x-content-type-options') !== 'nosniff') problems.push('security headers missing');
  console.log(`HTTP: ${pages.length} pages, ${Object.keys(rep.redirects).length} redirects, ${legacy.length} legacy URLs checked`);
  // Browser sweep
  const b = await chromium.launch();
  for (const [w, hgt, tag] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: hgt } });
    await ctx.route(/i\.ytimg\.com|maps\.google|googletagmanager|facebook|licdn|challenges\.cloudflare/, (r) => r.abort());
    const p = await ctx.newPage();
    let errs = [];
    p.on('pageerror', (e) => errs.push(String(e)));
    p.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|ERR_BLOCKED|net::/.test(m.text())) errs.push(m.text()); });
    for (const u of pages) {
      errs = [];
      await p.goto(base + u, { waitUntil: 'load', timeout: 30000 });
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 900) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 15)); } });
      await p.waitForTimeout(150);
      const r = await p.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && !/ytimg/.test(i.src)).map((i) => i.src),
        h1: document.querySelectorAll('h1').length,
        menuOk: !!document.querySelector('.header'),
      }));
      if (r.overflow > 1) problems.push(`${tag} OVERFLOW ${r.overflow}px ${u}`);
      if (r.broken.length) problems.push(`${tag} BROKEN IMG ${u} ${r.broken.slice(0, 2).join(' ')}`);
      if (r.h1 !== 1) problems.push(`${tag} H1 x${r.h1} ${u}`);
      if (errs.length) problems.push(`${tag} JS ERROR ${u}: ${errs[0].slice(0, 160)}`);
    }
    // Mobile menu + dropdown, gallery, calculator, video facade
    if (tag === 'mobile') {
      await p.goto(base + '/'); await p.click('.menu-toggle'); if (!(await p.isVisible('#nav-panel'))) problems.push('mobile menu does not open');
      await p.click('.menu__sub-toggle >> nth=0'); if (!(await p.isVisible('#sub-1'))) problems.push('mobile submenu does not open');
    }
    if (tag === 'desktop') {
      await p.goto(base + '/product/9-yard-bedding-box-for-sale/'); const before = await p.getAttribute('.gallery__main img', 'src');
      await p.click('.gallery__thumbs button >> nth=2'); if (before === await p.getAttribute('.gallery__main img', 'src')) problems.push('gallery thumbnails do not switch photo');
      await p.goto(base + '/bedding-box-rent-vs-buy-calculator/');
      await p.fill('#purchasePrice', '11137'); await p.fill('#daysPerJob', '5'); await p.fill('#jobsPerYear', '12'); await p.click('#calc-form button');
      const txt = await p.textContent('#calc-result'); if (!/Annual Ownership Cost:\s*\$863\.70/.test(txt) || !/Annual Rental Cost:\s*\$13,500\.00/.test(txt)) problems.push('calculator result wrong: ' + txt.slice(0, 120));
      await p.goto(base + '/'); await p.click('[data-yt]'); if (!(await p.$('.yt iframe'))) problems.push('video facade does not load player');
    }
    await ctx.close();
  }
  await b.close();
  console.log(problems.length ? `PROBLEMS (${problems.length}):\n` + problems.join('\n') : 'ALL CHECKS PASSED');
})();
