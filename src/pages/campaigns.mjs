// ADVERTISING LANDING PAGES — template. Copy/settings in src/content/campaigns.mjs.
// noindex,follow · excluded from sitemap · self-canonical · minimal header (no menu) · source-specific form.
import { esc, icon, img, join } from '../lib.mjs';
import { PRODUCTS, priceText } from '../data/products.mjs';
import { BUNDLES } from '../data/offers.mjs';
import { CAMPAIGNS } from '../content/campaigns.mjs';
import { caseByLabel, rentalExamples, RENTAL_NOTE } from '../content/shared.mjs';
import { bundleTeaser, button, cases, featureList, leadForm, phonePair, productGrid, sectionHead, youtube } from '../components.mjs';

// Rental fleet pages: each deal card shows the deal, then the matching rental math, then the button.
function dealsWithMath() {
  const [one, ten, twenty] = rentalExamples();
  const [b10, b20] = BUNDLES;
  const cards = [
    { off: `${b10.discount}% OFF`, name: b10.name, savings: b10.savings, math: ten, btn: `${b10.short} Quote`, featured: true, bundle: String(b10.boxes) },
    { off: `${b20.discount}% OFF`, name: b20.name, savings: b20.savings, math: twenty, btn: `${b20.short} Quote`, bundle: String(b20.boxes) },
    { off: '20+', name: 'Large Fleet Orders', savings: 'Best terms by phone', math: { ...one, label: 'Every box: one 9-yard box' }, btn: 'Discuss Your Fleet', bundle: '20+' },
  ];
  const mathBlock = (x) => `<div class="deal-math"><p class="deal-math__label">${esc(x.label)}</p><p class="roi-card__stat">${esc(x.stat)}</p><p class="roi-card__stat-label">${esc(x.statLabel)}</p><dl>${x.lines.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl><p class="roi-card__text">${esc(x.text)}</p></div>`;
  return `<section class="section section--gray" id="volume-deals"><div class="box">
    ${sectionHead({ kicker: 'Multi-box deals', title: 'Buy More. [Save More.]', text: 'Mix and match any sizes. Each deal below shows how the boxes pay for themselves in a rental fleet, worked out from our list prices and published market rental rates.' })}
    <div class="grid-3 deal-cards">${cards.map((c) => `<div class="bundle deal-card${c.featured ? ' bundle--featured' : ''}"><div class="bundle__off">${c.off}</div><p class="bundle__savings">${esc(c.name)}<br>${esc(c.savings)}</p>${mathBlock(c.math)}${button({ text: c.btn, href: '#get-quote', style: 'sm', track: 'bundle_inquiry', attrs: `data-bundle="${c.bundle}"` })}</div>`).join('')}</div>
    <p class="disclaimer" style="margin-top:20px;text-align:center;max-width:900px;margin-inline:auto">${esc(RENTAL_NOTE)}</p>
  </div></section>`;
}

function campaignPage(d) {
  const formId = `lp-${d.platform}-${d.audience}`.replace(/_/g, '-');
  const ex = caseByLabel(d.caseLabel);
  const label = `${d.platformLabel}: ${d.audience === 'rental_fleet' ? 'Rental Fleet' : 'Utility Contractors'}`;
  return {
    path: d.path, label, h1: d.h1, title: d.title, description: d.description, image: d.image, ogImage: d.image,
    noindex: true, campaign: true, minimal: true, track: `${d.platform}|${d.audience}`, quoteHref: '#get-quote',
    render: () => join([
      `<section class="lp-hero" data-bg="/images/${d.image}-800.webp" style="background-size:cover;background-position:center"><div class="box">
        <div>
          <p class="pill">${esc(d.pill)}</p>
          <h1>${esc(d.h1)}</h1>
          <div class="lp-video">${youtube()}</div>
          <p class="lead">${esc(d.lead)}</p>
          <ul class="checks">${d.bullets.map((b) => `<li>${icon('check')}${esc(b)}</li>`).join('')}</ul>
          <div class="btn-row btn-row--left">${button({ text: d.formTitle, href: '#get-quote' })}</div>
        </div>
        <div id="get-quote">${leadForm({ id: formId, title: d.formTitle, platform: d.platform, audience: d.audience, inquiry: `campaign_${d.platform}_${d.audience}`, customerType: d.customerType, quantity: d.quantity, bundle: d.quantity === '10' ? '10' : d.quantity === '20' ? '20' : '', submit: d.formTitle, compact: true })}</div>
      </div></section>`,
      // Same "Buy More. Save More." section as the rest of the site; buttons stay on this page (jump to the form).
      d.audience === 'rental_fleet' ? dealsWithMath() : bundleTeaser(BUNDLES).replace(/href="[^"]*request-a-quote\/\?bundle=(\d+)"/g, 'href="#get-quote" data-bundle="$1"').replace(/href="[^"]*fleet-bedding-box-bundles[^"]*"/g, 'href="#get-quote" data-bundle="20+"'),
      // All sizes: photo, name and price only (no buttons/badges) — on every ad page, right below the multi-box deals.
      `<section class="section"><div class="box">${sectionHead({ title: 'Sizes & [Prices]' })}<div class="products">${PRODUCTS.map((p) => `<div class="product-card product-card--simple">${img(p.image, `${p.size} yard bedding box`, { sizes: '(max-width: 767px) 100vw, 300px' })}<div class="product-card__body"><h3>${p.size} Yard Bedding Box</h3><p class="product-card__price">${priceText(p)}</p></div></div>`).join('')}</div></div></section>`,
      `<section class="section"><div class="box">
        ${sectionHead({ title: d.benefitsTitle })}
        <div class="grid-3">${d.benefits.map(([h, p]) => `<div class="card"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
      </div></section>`,
      `<section class="section section--gray"><div class="box grid-2">
        <div class="rounded">${img('welder-welding-bedding-box', 'Welder building a bedding box with American steel', { sizes: '(max-width: 767px) 100vw, 540px' })}</div>
        <div><p class="kicker">American made with American steel</p><h2>Built Heavy. Built Here.</h2>${featureList()}</div>
      </div></section>`,
      !(d.audience === 'rental_fleet') && ex ? `<section class="section"><div class="box box--narrow">${sectionHead({ kicker: 'Customer use case', title: ex.label })}${cases([ex])}</div></section>` : '',
      `<section class="cta-band cta-band--red"><h2>Talk to Our Sales Team Today</h2><p>Mon–Fri. A real person answers.</p>${phonePair('btn--dark')}<div class="btn-row">${button({ text: d.formTitle, href: '#get-quote', style: 'white' })}</div></section>`,
    ]),
  };
}

export const campaignPages = CAMPAIGNS.map(campaignPage);
