// ADVERTISING LANDING PAGES — template. Copy/settings in src/content/campaigns.mjs.
// noindex,follow · excluded from sitemap · self-canonical · minimal header (no menu) · source-specific form.
import { esc, icon, img, join } from '../lib.mjs';
import { PRODUCTS, priceText } from '../data/products.mjs';
import { BUNDLES } from '../data/offers.mjs';
import { CAMPAIGNS } from '../content/campaigns.mjs';
import { caseByLabel } from '../content/shared.mjs';
import { bundleTeaser, button, cases, featureList, leadForm, phonePair, productGrid, sectionHead, youtube } from '../components.mjs';

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
        <div id="get-quote">${leadForm({ id: formId, title: d.formTitle, platform: d.platform, audience: d.audience, inquiry: `campaign_${d.platform}_${d.audience}`, customerType: d.customerType, quantity: d.quantity, submit: d.formTitle, compact: true })}</div>
      </div></section>`,
      // Same "Buy More. Save More." section as the rest of the site; buttons stay on this page (jump to the form).
      bundleTeaser(BUNDLES).replace(/href="[^"]*(?:request-a-quote|fleet-bedding-box-bundles)[^"]*"/g, 'href="#get-quote"'),
      `<section class="section"><div class="box">
        ${sectionHead({ title: d.benefitsTitle })}
        <div class="grid-3">${d.benefits.map(([h, p]) => `<div class="card"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
      </div></section>`,
      `<section class="section section--gray"><div class="box grid-2">
        <div class="rounded">${img('welder-welding-bedding-box', 'Welder building a bedding box with American steel', { sizes: '(max-width: 767px) 100vw, 540px' })}</div>
        <div><p class="kicker">American made with American steel</p><h2>Built Heavy. Built Here.</h2>${featureList()}</div>
      </div></section>`,
      d.showPrices ? `<section class="section section--gray"><div class="box">${sectionHead({ title: 'Sizes & [List Prices]' })}${productGrid(PRODUCTS, { cta: false }).replace(/<a href="\/product\/[^"]+">/g, '<a href="#get-quote">')}</div></section>` : '',
      ex ? `<section class="section"><div class="box box--narrow">${sectionHead({ kicker: 'Customer use case', title: ex.label })}${cases([ex])}</div></section>` : '',
      `<section class="cta-band cta-band--red"><h2>Talk to Our Sales Team Today</h2><p>Mon–Fri. A real person answers.</p>${phonePair('btn--dark')}<div class="btn-row">${button({ text: d.formTitle, href: '#get-quote', style: 'white' })}</div></section>`,
    ]),
  };
}

export const campaignPages = CAMPAIGNS.map(campaignPage);
