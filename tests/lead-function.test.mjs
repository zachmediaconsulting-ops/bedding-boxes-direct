// Tests for functions/api/lead.js (no network: fetch is replaced with a fake Resend).
//   node --test tests/lead-function.test.mjs
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { onRequestPost, subjectFor } from '../functions/api/lead.js';

let sent;
beforeEach(() => {
  sent = [];
  globalThis.fetch = async (url, init) => {
    sent.push({ url: String(url), body: init.body, headers: init.headers });
    if (String(url).includes('turnstile')) return new Response(JSON.stringify({ success: true }));
    return new Response(JSON.stringify({ id: 'email_1' }), { status: 200 });
  };
});

const ENV = { RESEND_API_KEY: 'k', LEAD_TO: 'sales@example.com', LEAD_FROM: 'Leads <leads@example.com>' };
let ip = 0;
function req(fields, { sizes = ['9 yd'], ipAddr } = {}) {
  const fd = new FormData();
  const base = { full_name: 'Pat Smith', company: 'Acme Utility', email: `pat${Math.random()}@acme.com`, phone: '(555) 123-4567', state: 'Ohio', customer_type: 'Utility Contractor', quantity: '10', dropoff_address: '123 Main St, Columbus, OH 43215', message: 'Need boxes', platform: 'meta', campaign_audience: 'utility_contractors', landing_page_path: '/meta/utility-contractors/', utm_source: 'facebook', fbclid: 'abc', ...fields };
  for (const [k, v] of Object.entries(base)) fd.append(k, v);
  sizes.forEach((s) => fd.append('sizes', s));
  return new Request('https://x/api/lead', { method: 'POST', body: fd, headers: { 'cf-connecting-ip': ipAddr || `10.0.0.${++ip}` } });
}

test('subject line follows NEW LEAD | PLATFORM | AUDIENCE | QTY INQUIRY', () => {
  assert.equal(subjectFor({ platform: 'meta', campaign_audience: 'utility_contractors', quantity: '10' }), 'NEW LEAD | META | UTILITY CONTRACTORS | 10 BOX INQUIRY');
  assert.equal(subjectFor({ platform: 'google_ads', campaign_audience: 'rental_fleet', quantity: '20' }), 'NEW LEAD | GOOGLE ADS | RENTAL FLEET | 20 BOX INQUIRY');
  assert.equal(subjectFor({ platform: 'organic_search', customer_type: 'Municipality / Public Works', quantity: '1' }), 'NEW LEAD | ORGANIC SEARCH | MUNICIPALITY / PUBLIC WORKS | 1 BOX INQUIRY');
});

test('valid lead is emailed with attribution and returns an id', async () => {
  const res = await onRequestPost({ request: req({}), env: ENV });
  const out = await res.json();
  assert.equal(res.status, 200); assert.equal(out.ok, true); assert.match(out.id, /^BBD-\d{8}-[0-9A-F]{6}$/);
  const email = JSON.parse(sent.at(-1).body);
  assert.equal(email.subject, 'NEW LEAD | META | UTILITY CONTRACTORS | 10 BOX INQUIRY');
  assert.match(email.html, /fbclid/); assert.match(email.html, /\/meta\/utility-contractors\//); assert.match(email.text, /Sizes & quantities: 9 yd/);
});

test('never claims success when not configured', async () => {
  const res = await onRequestPost({ request: req({}), env: {} });
  assert.equal(res.status, 503); assert.equal((await res.json()).ok, false); assert.equal(sent.length, 0);
});

test('never claims success when the email provider fails', async () => {
  globalThis.fetch = async () => new Response('nope', { status: 500 });
  const res = await onRequestPost({ request: req({}), env: ENV });
  assert.equal(res.status, 502); assert.equal((await res.json()).ok, false);
});

test('requires a drop-off address and a whole-number quantity', async () => {
  let res = await onRequestPost({ request: req({ dropoff_address: '' }), env: ENV });
  assert.equal(res.status, 400); assert.match((await res.json()).error, /Drop-off address/);
  res = await onRequestPost({ request: req({ quantity: 'ten' }), env: ENV });
  assert.equal(res.status, 400); assert.match((await res.json()).error, /number of boxes/);
  res = await onRequestPost({ request: req({ quantity: '37' }), env: ENV });
  assert.equal(res.status, 200);
  assert.match(JSON.parse(sent.at(-1).body).subject, /37 BOX INQUIRY$/);
  assert.match(JSON.parse(sent.at(-1).body).text, /Drop-off address: 123 Main St, Columbus, OH 43215/);
});

test('per-size quantities and order type reach the email; total follows the sizes', async () => {
  const fd = { quantity: '1', bundle: '10' };
  const r = req(fd, { sizes: ['12 yd', '9 yd'] });
  const body = await r.formData(); body.append('qty_12yd', '4'); body.append('qty_9yd', '6');
  const res = await onRequestPost({ request: new Request('https://x/api/lead', { method: 'POST', body, headers: { 'cf-connecting-ip': '10.9.9.9' } }), env: ENV });
  assert.equal(res.status, 200);
  const email = JSON.parse(sent.at(-1).body);
  assert.match(email.text, /Sizes & quantities: 4 × 12 yd, 6 × 9 yd/);
  assert.match(email.text, /Total boxes: 10/);
  assert.match(email.text, /Order type: 10-box bundle/);
  assert.match(email.subject, /10 BOX INQUIRY$/);
});

test('rejects missing required fields and bad email', async () => {
  let res = await onRequestPost({ request: req({ company: '' }), env: ENV });
  assert.equal(res.status, 400); assert.match((await res.json()).error, /Company/);
  res = await onRequestPost({ request: req({ email: 'not-an-email' }), env: ENV });
  assert.equal(res.status, 400);
});

test('honeypot submissions are dropped silently', async () => {
  const res = await onRequestPost({ request: req({ website: 'spam.example' }), env: ENV });
  assert.equal((await res.json()).ok, true); assert.equal(sent.length, 0);
});

test('duplicate submissions return the original id without a second email', async () => {
  const fields = { email: 'dup@acme.com', message: 'same message' };
  const a = await (await onRequestPost({ request: req(fields), env: ENV })).json();
  const b = await (await onRequestPost({ request: req(fields), env: ENV })).json();
  assert.equal(b.id, a.id); assert.equal(b.duplicate, true); assert.equal(sent.length, 1);
});

test('rate limits repeated submissions from one IP', async () => {
  let last;
  for (let i = 0; i < 7; i++) last = await onRequestPost({ request: req({}, { ipAddr: '9.9.9.9' }), env: ENV });
  assert.equal(last.status, 429);
});

test('Turnstile is enforced when configured', async () => {
  globalThis.fetch = async (url) => new Response(JSON.stringify(String(url).includes('turnstile') ? { success: false } : {}));
  const res = await onRequestPost({ request: req({}), env: { ...ENV, TURNSTILE_SECRET_KEY: 's' } });
  assert.equal(res.status, 400);
});
