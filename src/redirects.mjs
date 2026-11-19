// PERMANENT (301) REDIRECTS from old WordPress URLs. Written to dist/_redirects (Cloudflare Pages format).
// Every published WordPress URL that is not rebuilt at the same address must be listed here,
// or the build fails. Never point unrelated pages at the homepage. See docs/redirects.csv.
import { readFileSync } from 'node:fs';

export const PAGE_REDIRECTS = {
  // Replaced advertising landing pages (owner decision 2026-11-19)
  '/stone-boxes-for-sale-adwords/': '/stone-boxes-for-sale/',
  '/utility-contractor-bedding-box-special-offer-001/': '/fleet-bedding-box-bundles/',
  // Old URLs that already redirected on WordPress, and a broken footer link
  '/about/': '/about-bedding-boxes-direct/',
  '/product/14-yard-bedding-box/': '/product/14-yard-bedding-box-for-sale/',
  '/shop-all-bedding-boxes-for-sale/': '/all-bedding-boxes-for-sale/',
  // WooCommerce store pages (online checkout removed — owner decision 2026-11-19)
  '/cart/': '/request-a-quote/',
  '/checkout/': '/request-a-quote/',
  '/my-account/': '/contact-us/',
  '/my-account/lost-password/': '/contact-us/',
  // Product category archives: duplicate or empty
  '/product-category/bedding-boxes-for-sale/': '/all-bedding-boxes-for-sale/',
  '/product-category/gravel-boxes-for-sale/': '/gravel-boxes-for-sale/',
  '/product-category/stone-boxes-for-sale/': '/stone-boxes-for-sale/',
  // Empty blog categories (0 posts)
  '/category/faqs/': '/blog/',
  '/category/industries/': '/blog/',
  '/category/uncategorized/': '/blog/',
  // Internal Elementor design page that was indexed by mistake
  '/style-guide/': '/',
};

// Old /wp-content/uploads/... image URLs (every size WordPress generated) -> the new optimized image.
// Keeps image-search rankings and any backlinks to photos working.
export function imageRedirects() {
  const map = JSON.parse(readFileSync(new URL('./data/legacy-images.json', import.meta.url), 'utf8'));
  const images = JSON.parse(readFileSync(new URL('./images.json', import.meta.url), 'utf8'));
  return Object.entries(map)
    .filter(([, name]) => images[name])
    .map(([old, name]) => [`/wp-content/uploads/${old}`, `/images/${name}.webp`]);
}
