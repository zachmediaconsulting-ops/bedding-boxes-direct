// ADVERTISING LANDING PAGES — template. Copy/settings in src/content/campaigns.mjs.
// noindex,follow · excluded from sitemap · self-canonical · minimal header (no menu) · source-specific form.
import { esc, icon, img, join } from '../lib.mjs';
import { PRODUCTS, priceText } from '../data/products.mjs';
import { BUNDLES } from '../data/offers.mjs';
import { CAMPAIGNS } from '../content/campaigns.mjs';
import { caseByLabel } from '../content/shared.mjs';
import { button, cases, featureList, leadForm, phonePair, productGrid, sectionHead } from '../components.mjs';

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
          <p class="lead">${esc(d.lead)}</p>
          <ul class="checks">${d.bullets.map((b) => `<li>${icon('check')}${esc(b)}</li>`).join('')}</ul>
          <div class="btn-row btn-row--left">${button({ text: d.formTitle, href: '#get-quote' })}</div>
        </div>
        <div id="get-quote">${leadForm({ id: formId, title: d.formTitle, platform: d.platform, audience: d.audience, inquiry: `campaign_${d.platform}_${d.audience}`, customerType: d.customerType, quantity: d.quantity, submit: d.formTitle, compact: true })}</div>
      </div></section>`,
      `<section class="section section--gray section--tight"><div class="box"><div class="stats">${d.stats.map(([b, s]) => `<div><b>${esc(b)}</b>${esc(s)}</div>`).join('')}</div></div></section>`,
      `<section class="section"><div class="box">
        ${sectionHead({ title: d.benefitsTitle })}
        <div class="grid-3">${d.benefits.map(([h, p]) => `<div class="card"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
      </div></section>`,
      `<section class="section section--gray"><div class="box grid-2">
        <div class="rounded">${img('welder-welding-bedding-box', 'Welder building a bedding box with American steel', { sizes: '(max-width: 767px) 100vw, 540px' })}</div>
        <div><p class="kicker">American made with American steel</p><h2>Built Heavy. Built Here.</h2>${featureList()}</div>
      </div></section>`,
      `<section class="section"><div class="box">
        ${sectionHead({ kicker: 'Multi-box deals', title: 'Buy More. [Save More.]' })}
        <div class="grid-3">${BUNDLES.map((b) => `<div class="bundle${b.boxes === 10 ? ' bundle--featured' : ''}"><div class="bundle__off">${b.discount}% OFF</div><p class="bundle__savings">${esc(b.name)}</p><p>${esc(b.audience)}</p>${button({ text: 'Get Bundle Pricing', href: '#get-quote', style: 'sm', track: 'bundle_inquiry' })}</div>`).join('')}
          <div class="bundle"><div class="bundle__off">20+</div><p class="bundle__savings">Large Fleet Orders</p><p>Multi-location and multistage orders quoted directly with the best terms.</p>${button({ text: 'Request Fleet Pricing', href: '#get-quote', style: 'sm', track: 'bundle_inquiry' })}</div></div>
      </div></section>`,
      d.showPrices ? `<section class="section section--gray"><div class="box">${sectionHead({ title: 'Sizes & [List Prices]' })}${productGrid(PRODUCTS, { cta: false }).replace(/<a href="\/product\/[^"]+">/g, '<a href="#get-quote">')}</div></section>` : '',
      ex ? `<section class="section"><div class="box box--narrow">${sectionHead({ kicker: 'Customer use case', title: ex.label })}${cases([ex])}</div></section>` : '',
      `<section class="cta-band cta-band--red"><h2>Talk to Our Sales Team Today</h2><p>Mon–Fri. A real person answers.</p>${phonePair('btn--dark')}<div class="btn-row">${button({ text: d.formTitle, href: '#get-quote', style: 'white' })}</div></section>`,
    ]),
  };
}

export const campaignPages = CAMPAIGNS.map(campaignPage);
