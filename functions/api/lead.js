// Cloudflare Pages Function: POST /api/lead
// Receives every quote/contact/bundle/campaign form, validates it, and emails a lead notification through
// Resend with a clear subject, e.g. "NEW LEAD | META | UTILITY CONTRACTORS | 10 BOX INQUIRY".
// Optionally stores each lead in Cloudflare D1 and/or forwards it to a CRM webhook.
//
// Settings (Cloudflare Pages → Settings → Variables and Secrets; see docs/launch.md):
//   RESEND_API_KEY        secret   Resend API key                                         (required)
//   LEAD_TO               text     inbox(es) that receive leads, comma-separated           (required)
//   LEAD_FROM             text     sender on a Resend-verified domain, e.g.
//                                  "Bedding Boxes Direct Leads <leads@beddingboxesdirect.com>"  (required)
//   LEAD_BCC              text     optional hidden copy
//   TURNSTILE_SECRET_KEY  secret   optional; when set every submission must pass Cloudflare Turnstile
//   LEAD_WEBHOOK_URL      secret   optional; JSON copy of each lead POSTed here (CRM, Zapier, Make…)
//   LEADS_DB              D1 binding  optional; stores every lead + powers rate limiting and duplicate checks
// Without the required settings the form tells visitors to call — it never pretends to succeed.

export const PHONE = '(307) 263-5020';
export const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 }; // per IP
export const DUPLICATE_WINDOW_MS = 30 * 60 * 1000;

export const FIELDS = {
  full_name: 'Full name', company: 'Company', email: 'Email', phone: 'Phone', state: 'State shipped to', dropoff_address: 'Drop-off address',
  customer_type: 'Customer type', sizes: 'Interested sizes', quantity: 'Estimated quantity', timeline: 'Timeline', message: 'Message / project details',
};
export const ATTRIBUTION = [
  'platform', 'campaign_audience', 'inquiry_type', 'form_id', 'landing_page_url', 'landing_page_path', 'form_page_url', 'form_page_path', 'referrer',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'li_fat_id', 'submitted_at',
];
const REQUIRED = ['full_name', 'company', 'email', 'phone', 'state', 'dropoff_address', 'customer_type', 'quantity'];

const PLATFORM_LABEL = {
  meta: 'META', google_ads: 'GOOGLE ADS', google: 'GOOGLE', linkedin: 'LINKEDIN', organic_search: 'ORGANIC SEARCH',
  direct: 'DIRECT', referral: 'REFERRAL',
};
// Quantity is an exact number of boxes; the subject shows it, e.g. "12 BOX INQUIRY".
const QTY_LABEL = (q) => { const n = parseInt(q, 10); return n > 0 ? `${n} BOX` : 'QUOTE'; };

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const fail = (status, error) => json(status, { ok: false, error });
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const list = (v) => String(v || '').split(',').map((s) => s.trim()).filter(Boolean);
export const clean = (v, max = 500) => String(v ?? '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].map((b) => b.toString(16).padStart(2, '0')).join('');

export function subjectFor(lead) {
  const platform = PLATFORM_LABEL[lead.platform] || (lead.platform ? lead.platform.replace(/_/g, ' ').toUpperCase() : 'WEBSITE');
  const audience = (lead.campaign_audience ? lead.campaign_audience.replace(/_/g, ' ') : lead.customer_type || 'GENERAL').toUpperCase();
  return `NEW LEAD | ${platform} | ${audience} | ${QTY_LABEL(lead.quantity)} INQUIRY`;
}

export const newLeadId = () => {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `BBD-${d}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
};

// Best-effort memory for rate limiting / duplicates when no D1 database is bound (per worker instance).
const memory = { hits: new Map(), recent: new Map() };

async function rateLimited(env, ipHash, now) {
  if (env.LEADS_DB) {
    const row = await env.LEADS_DB.prepare('SELECT COUNT(*) AS n FROM leads WHERE ip_hash = ?1 AND created_at > ?2').bind(ipHash, now - RATE_LIMIT.windowMs).first().catch(() => null);
    return (row?.n || 0) >= RATE_LIMIT.max;
  }
  const hits = (memory.hits.get(ipHash) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  hits.push(now); memory.hits.set(ipHash, hits);
  return hits.length > RATE_LIMIT.max;
}

async function findDuplicate(env, fingerprint, now) {
  if (env.LEADS_DB) {
    const row = await env.LEADS_DB.prepare('SELECT id FROM leads WHERE fingerprint = ?1 AND created_at > ?2 ORDER BY created_at DESC LIMIT 1').bind(fingerprint, now - DUPLICATE_WINDOW_MS).first().catch(() => null);
    return row?.id || null;
  }
  const hit = memory.recent.get(fingerprint);
  return hit && now - hit.at < DUPLICATE_WINDOW_MS ? hit.id : null;
}

export async function onRequestPost({ request, env }) {
  const to = list(env.LEAD_TO);
  if (!env.RESEND_API_KEY || !to.length || !env.LEAD_FROM) {
    return fail(503, `Online quote requests aren’t available right now. Please call us at ${PHONE}.`);
  }
  let form;
  try { form = await request.formData(); } catch { return fail(400, 'We couldn’t read the form. Please try again.'); }

  // Bots fill the hidden "website" field; people never see it. Pretend success and drop it.
  if (clean(form.get('website'))) return json(200, { ok: true, id: 'BBD-IGNORED' });

  if (env.TURNSTILE_SECRET_KEY) {
    const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: clean(form.get('cf-turnstile-response'), 4000), remoteip: request.headers.get('cf-connecting-ip') || '' }),
    }).then((r) => r.json()).catch(() => ({ success: false }));
    if (!check.success) return fail(400, 'Please complete the spam check and send again.');
  }

  // ---- validate ----
  const lead = {};
  for (const k of Object.keys(FIELDS)) lead[k] = k === 'sizes' ? form.getAll('sizes').map((s) => clean(s, 30)).filter(Boolean).slice(0, 12).join(', ') : clean(form.get(k), k === 'message' ? 4000 : k === 'dropoff_address' ? 300 : 200);
  for (const k of ATTRIBUTION) lead[k] = clean(form.get(k), /url|referrer/.test(k) ? 1000 : 300);
  const missing = REQUIRED.filter((k) => !lead[k]).map((k) => FIELDS[k]);
  if (missing.length) return fail(400, `Please fill in: ${missing.join(', ')}.`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) return fail(400, 'Please enter a valid email address.');
  if (!/^[0-9()+\-. ]{7,25}$/.test(lead.phone) || (lead.phone.match(/\d/g) || []).length < 7) return fail(400, 'Please enter a valid phone number.');
  if (!/^\d{1,4}$/.test(lead.quantity) || Number(lead.quantity) < 1) return fail(400, 'Please enter the number of boxes as a whole number (1 or more).');
  if (/https?:\/\/\S+/.test(lead.full_name + lead.company)) return fail(400, 'Please remove links from your name and company.');
  let firstTouch = {}; let lastTouch = {};
  try { firstTouch = JSON.parse(clean(form.get('first_touch'), 4000) || '{}'); } catch { /* ignore */ }
  try { lastTouch = JSON.parse(clean(form.get('last_touch'), 4000) || '{}'); } catch { /* ignore */ }

  // ---- rate limit + duplicates ----
  const now = Date.now();
  const ipHash = (await sha(`${request.headers.get('cf-connecting-ip') || 'unknown'}|bbd`)).slice(0, 32);
  if (await rateLimited(env, ipHash, now)) return fail(429, `Too many requests. Please wait a few minutes or call us at ${PHONE}.`);
  const fingerprint = (await sha([lead.email.toLowerCase(), lead.phone.replace(/\D/g, ''), lead.sizes, lead.quantity, lead.message].join('|'))).slice(0, 40);
  const dupe = await findDuplicate(env, fingerprint, now);
  if (dupe) return json(200, { ok: true, id: dupe, duplicate: true });

  // ---- notify ----
  const id = newLeadId();
  const subject = subjectFor(lead);
  const section = (title, rows) => `<h3 style="font-family:Arial,sans-serif;color:#262626;margin:22px 0 6px">${esc(title)}</h3><table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows.filter(([, v]) => v).map(([l, v]) => `<tr><td style="padding:5px 14px 5px 0;color:#666;vertical-align:top;white-space:nowrap">${esc(l)}</td><td style="padding:5px 0;white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}</table>`;
  const contactRows = Object.entries(FIELDS).map(([k, l]) => [l, lead[k]]);
  const attrRows = ATTRIBUTION.map((k) => [k, lead[k]]);
  const touchRows = (t) => Object.entries(t || {}).filter(([k]) => k !== 'at').map(([k, v]) => [k, clean(v, 1000)]);
  const html = `<h2 style="font-family:Arial,sans-serif;color:#d42a35;margin:0 0 4px">${esc(subject)}</h2>
<p style="font-family:Arial,sans-serif;color:#666;margin:0">Lead ID ${esc(id)} · ${esc(new Date(now).toUTCString())}</p>
${section('Contact & request', contactRows)}
${section('Attribution (this submission)', attrRows)}
${section('First touch (original landing)', touchRows(firstTouch))}
${section('Last campaign touch', touchRows(lastTouch))}
<p style="font-family:Arial,sans-serif;font-size:13px;color:#888">Reply to this email to answer ${esc(lead.full_name)} directly.</p>`;
  const text = [subject, `Lead ID: ${id}`, '', ...contactRows.filter(([, v]) => v).map(([l, v]) => `${l}: ${v}`), '', 'ATTRIBUTION', ...attrRows.filter(([, v]) => v).map(([l, v]) => `${l}: ${v}`)].join('\n');

  const res = await fetch(env.RESEND_API_URL || 'https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json', 'idempotency-key': id },
    body: JSON.stringify({ from: env.LEAD_FROM, to, bcc: list(env.LEAD_BCC), reply_to: lead.email, subject, html, text, tags: [{ name: 'platform', value: (lead.platform || 'website').replace(/[^a-z0-9_-]/gi, '_') }] }),
  }).catch(() => null);
  if (!res || !res.ok) {
    console.log('Resend error', res && res.status, res && (await res.text()).slice(0, 500));
    return fail(502, `Your request couldn’t be sent. Please call us at ${PHONE} or try again.`);
  }

  // ---- store + forward (after a confirmed notification; failures here are logged, not shown) ----
  const record = { id, created_at: now, subject, ...lead, first_touch: JSON.stringify(firstTouch), last_touch: JSON.stringify(lastTouch), ip_hash: ipHash, fingerprint };
  memory.recent.set(fingerprint, { id, at: now });
  if (env.LEADS_DB) {
    const cols = Object.keys(record);
    await env.LEADS_DB.prepare(`INSERT INTO leads (${cols.join(',')}) VALUES (${cols.map((_, i) => `?${i + 1}`).join(',')})`).bind(...cols.map((c) => record[c])).run()
      .catch((e) => console.log('D1 insert failed', String(e).slice(0, 300)));
  }
  if (env.LEAD_WEBHOOK_URL) {
    await fetch(env.LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...record, ip_hash: undefined, fingerprint: undefined }) })
      .catch((e) => console.log('Webhook failed', String(e).slice(0, 300)));
  }
  return json(200, { ok: true, id });
}

export const onRequest = () => fail(405, 'Use POST.');
