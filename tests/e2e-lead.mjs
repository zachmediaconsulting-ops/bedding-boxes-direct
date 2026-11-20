// End-to-end lead + attribution test against the real Cloudflare function (wrangler pages dev),
// with a local mock of the Resend API that records every email.
//   npm run build && node tests/e2e-lead.mjs
// Checks: first-touch attribution survives navigation, the form page is recorded, the email subject
// matches the brief, the thank-you page fires generate_lead exactly once (not again on refresh).
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const MOCK_PORT = 8799; const SITE_PORT = 8788;
const emails = [];
const mock = createServer((req, res) => {
  let body = ''; req.on('data', (c) => { body += c; });
  req.on('end', () => { emails.push(JSON.parse(body)); res.writeHead(200, { 'content-type': 'application/json' }); res.end('{"id":"mock"}'); });
}).listen(MOCK_PORT);

const env = { ...process.env, NO_PROXY: 'localhost,127.0.0.1', no_proxy: 'localhost,127.0.0.1' };
const wr = process.env.E2E_BASE ? { kill() {}, stdout: { on() {} }, stderr: { on() {} } } : spawn('npx', ['wrangler', 'pages', 'dev', 'dist', '--port', String(SITE_PORT), '--ip', '127.0.0.1',
  '--binding', 'RESEND_API_KEY=test', '--binding', 'LEAD_TO=sales@example.com', '--binding', 'LEAD_FROM=Leads <leads@example.com>',
  '--binding', `RESEND_API_URL=http://127.0.0.1:${MOCK_PORT}/emails`], { env, stdio: ['ignore', 'pipe', 'pipe'] });
let log = ''; wr.stdout.on('data', (d) => { log += d; }); wr.stderr.on('data', (d) => { log += d; });
const base = process.env.E2E_BASE || `http://127.0.0.1:${SITE_PORT}`;
for (let i = 0; i < 60; i++) { try { if ((await fetch(base + '/')).ok) break; } catch { /* starting */ } await new Promise((r) => setTimeout(r, 1000)); }

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
page.setDefaultTimeout(20000);
try {
  // 1. Arrive from a Meta ad, then browse to another page and submit there.
  await page.goto(`${base}/meta/utility-contractors/?utm_source=facebook&utm_medium=paid_social&utm_campaign=utility_contractors&fbclid=FB123`);
  await page.goto(`${base}/product/9-yard-bedding-box-for-sale/`);
  await page.goto(`${base}/request-a-quote/?size=12`);
  const f = page.locator('#quote-form');
  await f.locator('[name=full_name]').fill('Pat Tester');
  await f.locator('[name=company]').fill('Test Utility Co');
  await f.locator('[name=email]').fill('pat@example.com');
  await f.locator('[name=phone]').fill('(555) 010-2000');
  await f.locator('[name=state]').selectOption('Ohio');
  await f.locator('[name=customer_type]').selectOption('Utility Contractor');
  await f.locator('[name=quantity]').fill('10'); await f.locator('[name=dropoff_address]').fill('123 Main St, Columbus, OH 43215');
  assert.equal(await f.locator('input[value="12 yd"]').isChecked(), true, 'size preselected from ?size=12');
  await f.locator('[name=message]').fill('E2E test lead');
  await Promise.all([page.waitForURL(/\/thank-you\//), f.locator('button[type=submit]').click()]);

  assert.equal(emails.length, 1, 'one email sent');
  const e = emails[0];
  assert.equal(e.subject, 'NEW LEAD | META | UTILITY CONTRACTORS | 10 BOX INQUIRY');
  for (const s of ['landing_page_path', '/meta/utility-contractors/', 'form_page_path', '/request-a-quote/', 'FB123', 'utility_contractors', 'Interested sizes', '12 yd']) assert.ok(e.html.includes(s), `email contains ${s}`);
  console.log('✓ lead delivered:', e.subject);

  // 2. Conversion fires once on the thank-you page, never again on refresh.
  const conversions = async () => page.evaluate(() => (window.dataLayer || []).filter((x) => (x && (x.event === 'generate_lead' || x[1] === 'generate_lead'))).length);
  const counted = await page.evaluate(() => JSON.parse(localStorage.getItem('bbd_counted') || '[]'));
  assert.equal(counted.length, 1, 'lead id recorded as counted');
  await page.reload();
  const countedAfter = await page.evaluate(() => JSON.parse(localStorage.getItem('bbd_counted') || '[]'));
  assert.equal(countedAfter.length, 1, 'refresh does not count again');
  assert.equal(await page.evaluate(() => sessionStorage.getItem('bbd_lead_pending')), null);
  console.log('✓ conversion counted once; refresh did not re-count', await conversions());

  // 3. Same details again within 30 minutes: duplicate protection, no second email.
  await page.goto(`${base}/request-a-quote/?size=12`);
  for (const [n, v] of [['full_name', 'Pat Tester'], ['company', 'Test Utility Co'], ['email', 'pat@example.com'], ['phone', '(555) 010-2000'], ['message', 'E2E test lead']]) await f.locator(`[name=${n}]`).fill(v);
  await f.locator('[name=state]').selectOption('Ohio'); await f.locator('[name=customer_type]').selectOption('Utility Contractor'); await f.locator('[name=quantity]').fill('10'); await f.locator('[name=dropoff_address]').fill('123 Main St, Columbus, OH 43215');
  await Promise.all([page.waitForURL(/\/thank-you\//), f.locator('button[type=submit]').click()]);
  assert.equal(emails.length, 1, 'duplicate not emailed twice');
  console.log('✓ duplicate submission suppressed');

  // 4. Missing required fields: no request sent, error shown.
  await page.goto(`${base}/contact-us/`);
  await page.locator('#contact-form button[type=submit]').click();
  assert.match(await page.locator('#contact-form .form__status').textContent(), /required/);
  console.log('✓ client-side validation blocks incomplete forms');
  console.log('E2E PASSED');
} catch (err) {
  console.error('E2E FAILED:', err.message, '\n--- wrangler log ---\n', log.slice(-3000));
  process.exitCode = 1;
} finally {
  await browser.close(); mock.close(); wr.kill();
}
