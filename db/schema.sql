-- Optional lead storage in Cloudflare D1 (binding name: LEADS_DB). See docs/launch.md.
--   npx wrangler d1 create bbd-leads
--   npx wrangler d1 execute bbd-leads --remote --file=db/schema.sql
-- Then Pages project → Settings → Bindings → D1 database → variable name LEADS_DB.
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,          -- unix ms
  subject TEXT,
  full_name TEXT, company TEXT, email TEXT, phone TEXT, state TEXT, customer_type TEXT,
  sizes TEXT, quantity TEXT, timeline TEXT, message TEXT,
  platform TEXT, campaign_audience TEXT, inquiry_type TEXT, form_id TEXT,
  landing_page_url TEXT, landing_page_path TEXT, form_page_url TEXT, form_page_path TEXT, referrer TEXT,
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_content TEXT, utm_term TEXT,
  gclid TEXT, gbraid TEXT, wbraid TEXT, fbclid TEXT, li_fat_id TEXT, submitted_at TEXT,
  first_touch TEXT, last_touch TEXT,
  ip_hash TEXT, fingerprint TEXT
);
CREATE INDEX IF NOT EXISTS leads_created ON leads (created_at);
CREATE INDEX IF NOT EXISTS leads_ip ON leads (ip_hash, created_at);
CREATE INDEX IF NOT EXISTS leads_fp ON leads (fingerprint, created_at);
CREATE INDEX IF NOT EXISTS leads_platform ON leads (platform, campaign_audience);

-- Reporting examples (Phase 12):
--   Leads by platform/audience:   SELECT platform, campaign_audience, COUNT(*) FROM leads GROUP BY 1,2;
--   Organic leads by landing page: SELECT landing_page_path, COUNT(*) FROM leads WHERE platform='organic_search' GROUP BY 1 ORDER BY 2 DESC;
--   Leads by state / size / type: SELECT state, COUNT(*) FROM leads GROUP BY 1;  SELECT quantity, COUNT(*) FROM leads GROUP BY 1;
