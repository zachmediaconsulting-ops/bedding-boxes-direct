# Launch: Cloudflare Pages

## 1. Create the Pages project
Cloudflare → Workers & Pages → Create → Pages → Connect to Git → this repository.
- Framework preset: **None**
- Build command: `npm run build`
- Build output directory: `dist`

## 2. Variables (Settings → Variables and Secrets, Production)
| Name | Type | Value |
| --- | --- | --- |
| `NODE_VERSION` | Text | `22` |
| `LEAD_TO` | Text | inbox that receives leads (e.g. sales@beddingboxesdirect.com) |
| `LEAD_FROM` | Text | `Bedding Boxes Direct Leads <leads@beddingboxesdirect.com>` (domain verified in Resend) |
| `RESEND_API_KEY` | Secret | from resend.com → API Keys |
| `GOOGLE_ADS_ID` | Text | `AW-17649808923` (tag already on the WordPress site) |
| `GOOGLE_ADS_LEAD_LABEL` | Text | conversion label of the Lead action in Google Ads |
| `GA4_ID` / `GTM_ID` / `META_PIXEL_ID` / `LINKEDIN_PARTNER_ID` / `LINKEDIN_LEAD_CONVERSION_ID` | Text | optional, when available |
| `TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Text / Secret | optional spam check |

Without `RESEND_API_KEY`, `LEAD_TO` and `LEAD_FROM`, forms tell visitors to call (they never fake success).
Redeploy after changing variables.

## 3. Test on the *.pages.dev address before touching DNS
Submit a real quote request and confirm the email arrives with the "NEW LEAD | …" subject.

## 4. Go live (only with owner authorization)
Pages project → Custom domains → add `www.beddingboxesdirect.com` and `beddingboxesdirect.com`
(redirect the bare domain to www). Keep WordPress hosting running until the new site is verified.
Then submit `https://www.beddingboxesdirect.com/sitemap.xml` in Google Search Console.
