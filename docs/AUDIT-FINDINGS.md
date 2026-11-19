# Bedding Boxes Direct — Phase 1 Discovery & SEO Migration Audit

Crawled: 2026-11-19 · Source: https://www.beddingboxesdirect.com/

## Deliverables in this folder

| File | What it is |
|---|---|
| `seo-migration-audit.csv` | One row per discovered URL (42), 33 columns: URL, status, title tag, meta, canonical, robots, H1–H3, images + alt, links, forms, schema, OG/Twitter, purpose, intent, recommended action, target URL, notes, full visible content |
| `seo-migration-audit.json` | Same as the CSV plus raw JSON-LD, full link/image objects, sitewide header/footer/popup content, and full product data (prices, attributes, descriptions, gallery images) |
| `redirect-map.csv` | 15 301 redirects the new site must implement |
| `media-inventory.csv` | All 215 WordPress media-library items, with alt text and whether each is used on a live page |
| `crawl/` | Raw HTML of every page, the sitemaps, REST API exports, and the Elementor CSS (brand tokens) |
| `tools/` | Re-runnable crawl → extract → audit scripts |

## How URLs were discovered

1. **Yoast sitemap index**: 3 sitemaps (page 23, product 8, product_cat 2) = 32 unique URLs.
2. **Crawl of all internal links** (header, footer, body): found 4 more URLs: 2 legacy redirects, 1 404, 1 account sub-page.
3. **Public WP REST API**, which returns only *published* items:
   - 24 pages and 7 products.
   - **0 blog posts**.
   - 4 product categories and 3 post categories. Found here and not in the sitemap: `/cart/`, 2 empty product categories, and 3 empty post categories.

No drafts or private content were accessible or included. Every URL in the audit is publicly reachable.

## Inventory summary

| Group | Count | Action |
|---|---|---|
| Core pages to migrate 1:1 (same URL) | 21 | Homepage, about, catalog, 7 products, 3 industry pages, 2 guides, calculator, custom fabrication, AR500, bundles, `/bedding-boxes/`, contact, blog hub |
| Policy pages | 3 | Privacy, returns, shipping: migrate and update wording |
| Campaign / Ads pages | 2 | Keep URLs for ads and set `noindex` (pending GSC check) |
| Mini-excavator category | 1 | Rebuild as a real landing page at the same URL |
| WooCommerce functional pages | 4 | Retire with 301s (cart, checkout, my-account, lost-password) |
| Empty or duplicate archives | 6 | 301 to catalog or blog |
| Legacy redirects / broken links | 3 | Keep the 2 existing 301s; add a 301 for the 404 |
| Internal-only page | 1 | `/style-guide/`: do not migrate, 301 to `/` |

## Current catalog (WooCommerce Store API)

| Product | Price | Notes |
|---|---|---|
| 3 yd | $6,250 | Only product in "mini excavator" category |
| 5 yd | $7,834 | |
| 7 yd | $9,834 | |
| 9 yd | $11,137 | |
| 12 yd | $13,200 | |
| 14 yd | $16,750 | Sidewall option: 1/4", 3/8", 1/2" |
| 18 yd | $18,500 | Sidewall option: 1/4", 3/8", 1/2" |

Bundles: 10-box = 5% off, 20-box = 7% off.

## Issues found on the live site (fixed in the rebuild)

### SEO / technical
1. **Product pages have no `Product` schema.** All 7 product pages emit only WebPage, Breadcrumb, and Organization schema, so they can't get price or stock rich results. This is the biggest quick win.
2. **Sitewide broken link.** The footer link "All Bedding Boxes" points to `/shop-all-bedding-boxes-for-sale/`, which returns 404.
3. **Sitewide links to redirects.** The header links to `/product/14-yard-bedding-box/` (301) and `/bedding-box-fabrication-company` (no trailing slash, so it redirects). The footer links to `/about/` (301).
4. **Thin or irrelevant indexable URLs:**
   - `/style-guide/` is indexed and listed in the sitemap.
   - Two empty product-category archives and three empty post-category archives return 200 and are indexable.
   - `/blog/` is indexed with 0 posts.
   - The special-offer-001 page has 6 words of text.
5. **Ads landing page is indexed.** `/stone-boxes-for-sale-adwords/` is indexable and in the sitemap, and its slug contains "adwords".
6. **Noindex pages are in the sitemap:** `/my-account/` and `/checkout/`.
7. **Heading problems:**
   - Every product page has 2 H1s.
   - `/return-refund-policy/` has 4 H1s, one of them empty.
   - `/fleet-bedding-box-bundles/` and `/bedding-box-fabrication-company/` each have 2 H1s.
   - The product pages' first H1 is lowercase ("18 yard bedding box").
8. **Keyword cannibalization risk.** `/`, `/bedding-boxes/`, `/all-bedding-boxes-for-sale/`, and `/product-category/bedding-boxes-for-sale/` all target "bedding boxes for sale". The category archive duplicates the shop page.
9. **Missing alt text** on 205 of 215 media items, including the logo.
10. **Unused site-search markup.** The WebSite schema declares a `SearchAction` for `/?s=`, which the new static site won't have, so it should be dropped.

### Brand / NAP consistency (needs owner decision)
- **Two phone numbers.** The header and the footer's visible number are **(307) 263-5020**. A footer icon links to `tel:14065449053` **(406) 544-9053**.
- **Two sets of hours:**
  - The popup says *Mon–Fri 5AM–5PM MST / 7AM–7PM EST*.
  - `/bedding-boxes/` says *9am–5pm (EST)* with a 24-hour response time.
- Footer: "©2026 A Merica Metal Works Company". Confirm the legal entity name and whether it should appear in Organization schema (`parentOrganization`).

### Performance baseline (current WordPress stack)
- **Stack:**
  - Hello Elementor theme and Elementor Pro.
  - WooCommerce and WooCommerce Payments.
  - Jetpack, Google Site Kit, Google Listings & Ads, WP Consent API.
- **Homepage weight:** 31 external scripts, 35 stylesheets, 8 inline style blocks, and 153 KB of HTML.
- **Server response:**
  - TTFB 0.36–0.63 s on cached pages.
  - **1.59 s TTFB on product pages**, which are uncached because of WooCommerce.
- **Tracking:** Google Ads tag `AW-17649808923` is present and must be carried over to keep conversion tracking.

## Brand tokens (from the Elementor global kit)

| Token | Value |
|---|---|
| Primary (near-black) | `#262626` |
| Secondary | `#0A0A0A` |
| Accent (red) | `#D42A35` |
| Accent dark | `#942028` |
| Body text | `#525252` |
| Light grays | `#F5F5F5`, `#E5E5E5`, `#D4D4D4` |
| Headings | **Oswald** 500, UPPERCASE |
| Body / UI | **Inter** (Rubik appears in a few places) |
| Logo | `wp-content/uploads/2025/08/Bedding-Boxes-Direct-Logo-2424px-Blue.png` (2424×810) |

## Forms that must be rebuilt (Elementor Forms → static form + serverless handler)
- **`/contact-us/` and `/bedding-box-fabrication-company/`:** name, email, two custom fields (phone and message/subject).
- **`/bedding-boxes/`:** full name, email, phone, subject, message.
- **`/stone-boxes-for-sale-adwords/`:** name, phone, email, company, inquiry details. Keep this form's conversion tracking for Ads.

## Open items: need owner input / data access

1. **Organic performance data.** I can't reach Search Console or GA4 from here. Please export:
   - **GSC → Performance → Pages and Queries**, last 16 months (CSV).
   - **GSC → Indexing → Pages** (CSV).
   - **GA4 → Landing pages**, last 12 months.
   - Any **backlink export** (Ahrefs or Semrush), if you have one.

   Without this data I can't confirm the "pending GSC" decisions: the Ads page, the mini-excavator category, and the `/bedding-boxes/` cannibalization.
2. **Online checkout.** Confirm whether it's going away entirely (quote and phone only) or whether you want a lightweight payment option such as Stripe Payment Links.
3. **Canonical phone number and business hours.**
4. **Campaigns.** Are `/utility-contractor-bedding-box-special-offer-001/` and `/stone-boxes-for-sale-adwords/` still live ad destinations?
5. **Hosting.** Where will the new site be hosted (Cloudflare Pages, Netlify, Vercel)? This determines the redirect-file format and the form handler.
