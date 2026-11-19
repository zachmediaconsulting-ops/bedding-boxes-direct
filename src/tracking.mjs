// Analytics and advertising tags. IDs come from Cloudflare Pages build variables so no ID is
// hard-coded in the source: a tag is only added to the pages when its variable is set.
//
//   GTM_ID                         e.g. GTM-XXXXXXX   (if set, configure GA4/Ads/Meta/LinkedIn inside GTM instead)
//   GA4_ID                         e.g. G-XXXXXXXXXX
//   GOOGLE_ADS_ID                  e.g. AW-17649808923 (the tag already on the WordPress site)
//   GOOGLE_ADS_LEAD_LABEL          conversion label of the "Lead" conversion action in Google Ads
//   META_PIXEL_ID                  Meta (Facebook) pixel ID
//   LINKEDIN_PARTNER_ID            LinkedIn Insight Tag partner ID
//   LINKEDIN_LEAD_CONVERSION_ID    LinkedIn conversion ID for leads
//
// Events sent by src/assets/site.js (see docs/analytics.md):
//   form_start, generate_lead (one per confirmed lead), form_submit_success, phone_click,
//   quote_request_click, bundle_inquiry, size_page_view, campaign_landing_page_view
const env = process.env;

export const TRACKING = {
  gtm: env.GTM_ID || '',
  ga4: env.GA4_ID || '',
  googleAds: env.GOOGLE_ADS_ID || '',
  googleAdsLeadLabel: env.GOOGLE_ADS_LEAD_LABEL || '',
  metaPixel: env.META_PIXEL_ID || '',
  linkedinPartner: env.LINKEDIN_PARTNER_ID || '',
  linkedinLeadConversion: env.LINKEDIN_LEAD_CONVERSION_ID || '',
};

// Cloudflare Turnstile (spam check on forms). The secret half goes in TURNSTILE_SECRET_KEY (functions).
export const TURNSTILE_SITE_KEY = env.TURNSTILE_SITE_KEY || '';

// Settings the browser script needs, written into each page as JSON.
export const clientConfig = () => ({
  ga4: TRACKING.ga4, ads: TRACKING.googleAds, adsLabel: TRACKING.googleAdsLeadLabel,
  meta: TRACKING.metaPixel, li: TRACKING.linkedinPartner, liConv: TRACKING.linkedinLeadConversion, gtm: TRACKING.gtm,
});

// Tags load after the page is interactive (first interaction or 3.5s), so they never slow down the first paint.
export function tagLoader() {
  const t = TRACKING;
  if (!t.gtm && !t.ga4 && !t.googleAds && !t.metaPixel && !t.linkedinPartner) return '';
  return `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});gtag('js',new Date());</script>`;
}
