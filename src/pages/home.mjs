// HOMEPAGE — primary keyword "Bedding Boxes for Sale" (title + meta description unchanged from WordPress).
// Messaging repositioned (Phase 4): utility contractors are the principal customer, rental fleets second.
// Original sections are kept: Start Here video, key features, why buy from us, sizes, AR500, use cases,
// American Industries Matters. Original text lives in src/content/original/home.mjs.
import { esc, icon, img, join } from '../lib.mjs';
import { SITE } from '../site.mjs';
import { PRODUCTS } from '../data/products.mjs';
import { BUNDLES } from '../data/offers.mjs';
import * as o from '../content/original/home.mjs';
import { HOME_CASES } from '../content/shared.mjs';
import {
  accent, bundleTeaser, button, callButton, cases, ctaBand, featureList, flagBand, phonePair, productGrid, quoteSection, sectionHead, skipTheCart, startHere,
} from '../components.mjs';

const UTILITY_BENEFITS = [
  ['Fewer loader trips', 'Stage a full box of clean bedding stone right at the trench instead of running a loader back to the stockpile for every few feet of pipe.'],
  ['Less wasted stone', 'Material stays in the box, not scattered along the trench line or lost in the spoil pile.'],
  ['Faster crew production', 'Keep the excavator placing bedding and pipe instead of waiting on material.'],
  ['Matched to your excavator', 'Sizes from 3 to 18 yards with published machine-weight and horsepower ranges for every box.'],
  ['Heavy-duty construction', 'Thicker gauge American steel, reinforced corners, skid plates and a rotating handle built for daily pulls.'],
  ['Multi-box projects', 'Stage several boxes along long runs and save with 10- and 20-box bundle pricing.'],
];
const FLEET_BENEFITS = [
  ['Fleet durability', 'Built to survive high-utilization rental cycles with thicker steel and welded skid plates.'],
  ['Easy handling', 'Grab/push bars and a rotating handle make placement and loading simple for any renter.'],
  ['Volume purchasing', `${BUNDLES.map((b) => `${b.boxes}-box bundles save ${b.discount}%`).join(', ')}. Mix any sizes.`],
  ['Custom colors', 'Custom paint colors available upon request to match your fleet branding.'],
];

export const page = {
  path: '/', label: 'Home', h1: 'American Made Bedding Boxes for Sale, Available Fast Nationwide.',
  ogImage: 'bedding-boxes-direct-featured-image',
  preload: '<link rel="preload" as="image" href="/images/bedding-boxes-direct-vertical-poster.webp">',
  render: () => join([
    `<section class="hero">
      <div class="hero__text">
        <p class="pill">Bedding Boxes for Sale (Stone/Gravel Boxes)</p>
        <h1 class="hero__headline">American Made<br> <span class="accent nowrap">Bedding Boxes for Sale</span> Available Fast Nationwide.</h1>
        <p class="lead">Heavy-duty stone and gravel bedding boxes that help <strong>utility contractors</strong> keep clean bedding material at the trench, cut loader trips and reduce material waste. ${o.heroText.replace(/<\/?p>/g, '')}</p>
        <div class="btn-row btn-row--left">${button({ text: 'Find Your Size', href: '#sizes' })}${button({ text: 'Request a Quote', href: '/request-a-quote/', style: 'outline' })}</div>
        ${o.heroNote.replace('<p>', '<p class="hero__note">')}
      </div>
      <div class="hero__media">
        <video src="${SITE.heroVideo}" poster="/images/bedding-boxes-direct-vertical-poster.webp" muted loop playsinline preload="none" data-autoplay aria-label="Bedding boxes ready to ship"></video>
        <button class="sound-toggle" type="button" data-sound aria-label="Turn on sound">Turn on<br>sound 🔊</button>
      </div>
    </section>`,

    startHere(),

    `<section class="section" id="utility-contractors"><div class="box">
      ${sectionHead({ kicker: 'Our primary customers', title: 'Built for [Utility Contractors]', text: 'Water main, sewer, storm, gas, electrical, telecom and fiber crews use our bedding boxes to manage material movement on trenching projects. Here is what changes on the jobsite.' })}
      <div class="grid-3">${UTILITY_BENEFITS.map(([h, p]) => `<div class="card"><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
      <div class="btn-row">${button({ text: 'Utility Contractor Bedding Boxes', href: '/bedding-boxes-for-utility-companies/' })}${button({ text: 'Request a Quote', href: '/request-a-quote/', style: 'outline' })}</div>
    </div></section>`,

    `<section class="section section--gray" id="highlights"><div class="box">
      ${sectionHead({ kicker: 'Bedding boxes for sale....', title: 'Bedding Box [Highlights]' })}
      <div class="grid-2">
        <div class="rounded">${img('12-yard-bedding-box-for-sale-7', 'Bedding boxes from Bedding Boxes Direct located on the manufacturing lot.', { sizes: '(max-width: 767px) 100vw, 540px' })}</div>
        <div><h3 class="center" style="font-size:clamp(28px,3.4vw,40px)">Key Features</h3>${featureList()}</div>
      </div>
      <div class="btn-row">${button({ text: 'Find Your Size', href: '#sizes' })}</div>
    </div></section>`,

    flagBand({ title: 'Discover what makes us [different.] Proudly built in America with American steel.', text: o.whyUs.match(/<p>.*<\/p>/)[0].replace(/<\/?p>/g, '') }),

    skipTheCart(),

    `<section class="section" id="sizes"><div class="box">
      ${sectionHead({ kicker: 'Sizes available for delivery (3yd to 18yd)', title: '[Heavy Duty] Bedding Boxes For Sale' })}
      <div class="prose center" style="max-width:860px;margin:0 auto 40px">${o.sizesIntro.replace(/<p class="kicker">.*?<\/p>|<h2>.*?<\/h2>/g, '')}</div>
      ${productGrid(PRODUCTS)}
      <div class="btn-row">${button({ text: 'Compare All Sizes', href: '/all-bedding-boxes-for-sale/', style: 'outline' })}${button({ text: 'What Size Do I Need?', href: '/what-size-bedding-box-do-i-need/', style: 'outline' })}</div>
    </div></section>`,

    bundleTeaser(BUNDLES),

    `<section class="section" id="rental-fleets"><div class="box grid-2">
      <div class="rounded">${img('bedding-boxes-on-flatbed-truck', 'Orange fleet bedding boxes loaded on a flatbed for delivery', { sizes: '(max-width: 767px) 100vw, 540px' })}</div>
      <div>
        <p class="kicker">For equipment rental fleets</p>
        <h2>Bedding Boxes Built for <span class="accent">Rental Fleets</span></h2>
        <p>Rental companies need boxes that survive constant turnover, rough handling and every kind of operator. Ours are built to stay in service and on rent.</p>
        <ul class="checks">${FLEET_BENEFITS.map(([h, p]) => `<li>${icon('check')}<strong>${esc(h)}:</strong> ${esc(p)}</li>`).join('')}</ul>
        <div class="btn-row btn-row--left">${button({ text: 'Rental Fleet Bedding Boxes', href: '/industries/equipment-rental-fleets/' })}${button({ text: 'Discuss Your Fleet Requirements', href: '/fleet-bedding-box-bundles/', style: 'outline', track: 'bundle_inquiry' })}</div>
      </div>
    </div></section>`,

    `<section class="section section--gray"><div class="box">
      <div class="rounded" style="max-width:var(--box);margin:0 auto">${img('ar500-boxes-for-sale-meteor', 'AR500 bedding box with a meteor impact in the background', { sizes: '(max-width: 1140px) 100vw, 1100px' })}</div>
      <div class="card--red center" style="border-radius:0 0 16px 16px;padding:22px"><h2 style="margin:0;color:#fff">Custom AR500 Boxes Available</h2>${o.ar500Note.replace('<p>', '<p class="disclaimer" style="color:#fff;margin:8px 0 0">')}</div>
      <div class="card card--white center" style="max-width:820px;margin:28px auto 0">${o.ar500.replace(/<h2>.*?<\/h2>/, '')}
        <div class="btn-row">${button({ text: 'AR500 Boxes Here', href: '/ar500-bedding-boxes-for-sale/' })}${callButton('sales', { text: 'Call to Order', style: 'dark' })}</div></div>
    </div></section>`,

    `<section class="section" id="use-cases"><div class="box">
      ${sectionHead({ kicker: 'Use cases', title: 'From Bedding Box [Customers]' })}
      <div class="card">${cases(HOME_CASES)}</div>
      <div class="btn-row">${callButton('sales', { text: 'Call to Order' })}</div>
    </div></section>`,

    quoteSection({ title: 'Get Pricing on [One Box or a Fleet]', form: { id: 'home-quote', inquiry: 'homepage' } }),

    `<section class="section section--red"><div class="box">
      <div class="center" style="max-width:900px;margin:0 auto 32px">${o.americanIndustries}</div>
      <div class="card card--white grid-3 resources" style="color:var(--text)">${[o.suppliers, o.osha, o.welding].map((h) => `<div class="prose">${h.replace(/<a /g, '<a rel="noopener" target="_blank" ').replace(/<h3>/, '<h3 style="font-size:24px">')}</div>`).join('')}</div>
    </div></section>`,
  ]),
};
