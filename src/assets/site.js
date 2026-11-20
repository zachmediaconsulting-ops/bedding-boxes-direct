// Bedding Boxes Direct: all site behaviour (plain JavaScript, no libraries).
document.documentElement.classList.add('js');
const CFG = JSON.parse(document.getElementById('site-config')?.textContent || '{}');
const store = {
  get(k, s = localStorage) { try { return JSON.parse(s.getItem(k) || 'null'); } catch { return null; } },
  set(k, v, s = localStorage) { try { s.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
};

// ---------------------------------------------------------------- menu
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});
// The caret button opens the phone submenu, or the desktop mega panel (keyboard / touch-screen laptops).
const closeMegas = (except) => document.querySelectorAll('.mega.is-open').forEach((m) => { if (m !== except) { m.classList.remove('is-open'); m.parentElement.querySelector('.menu__sub-toggle')?.setAttribute('aria-expanded', 'false'); } });
document.querySelectorAll('.menu__sub-toggle').forEach((b) => b.addEventListener('click', () => {
  const sub = document.getElementById(b.getAttribute('aria-controls'));
  const mega = b.parentElement.querySelector('.mega');
  const open = b.getAttribute('aria-expanded') !== 'true';
  b.setAttribute('aria-expanded', String(open));
  sub.classList.toggle('is-open', open);
  if (mega) { closeMegas(mega); mega.classList.toggle('is-open', open); }
}));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMegas(); });
document.addEventListener('click', (e) => { if (!e.target.closest('.has-mega')) closeMegas(); });

// ---------------------------------------------------------------- media
// YouTube loads only when the visitor presses play.
document.querySelectorAll('[data-yt]').forEach((b) => b.addEventListener('click', () => {
  const f = document.createElement('iframe');
  f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0&playsinline=1`;
  f.title = b.getAttribute('aria-label'); f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
  b.parentElement.replaceChildren(f);
}));
// Background images (flag band etc.) load when near the screen.
const bgObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.style.backgroundImage = `url(${e.target.dataset.bg})`; bgObserver.unobserve(e.target);
}), { rootMargin: '400px' }) : null;
document.querySelectorAll('[data-bg]').forEach((el) => (bgObserver ? bgObserver.observe(el) : (el.style.backgroundImage = `url(${el.dataset.bg})`)));
// Autoplay muted hero videos only when visible and motion is allowed.
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('video[data-autoplay]').forEach((v) => { if (!calm) { v.preload = 'metadata'; v.play().catch(() => {}); } });
// "Turn on sound" button on the homepage video (videos autoplay muted).
document.querySelectorAll('[data-sound]').forEach((b) => b.addEventListener('click', () => {
  const v = b.parentElement.querySelector('video');
  if (!v) return;
  v.muted = false; v.controls = true; v.play().catch(() => {}); b.hidden = true;
}));
// Product photo gallery.
document.querySelectorAll('.gallery').forEach((g) => {
  const main = g.querySelector('.gallery__main img');
  g.querySelectorAll('.gallery__thumbs button').forEach((b) => b.addEventListener('click', () => {
    main.src = b.dataset.src; main.srcset = b.dataset.srcset || ''; main.alt = b.dataset.alt;
    g.querySelectorAll('.gallery__thumbs button').forEach((x) => x.setAttribute('aria-current', String(x === b)));
  }));
});

// ---------------------------------------------------------------- attribution
// First touch is stored once (90 days) and never overwritten; the latest visit that carries campaign
// parameters is kept separately as "last touch". Both are sent with every lead.
const KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'li_fat_id'];
const params = new URLSearchParams(location.search);
const hasCampaign = KEYS.some((k) => params.get(k));
const platformFrom = (t) => {
  if (t.page_platform) return t.page_platform;
  const s = (t.utm_source || '').toLowerCase();
  if (t.gclid || t.gbraid || t.wbraid || /google|adwords/.test(s)) return t.utm_medium && !/cpc|paid|ppc/.test(t.utm_medium) ? 'google' : 'google_ads';
  if (t.fbclid || /facebook|meta|instagram|fb|ig/.test(s)) return 'meta';
  if (t.li_fat_id || /linkedin/.test(s)) return 'linkedin';
  if (s) return s;
  if (!t.referrer) return 'direct';
  if (/google\.|bing\.|duckduckgo\.|yahoo\./.test(t.referrer)) return 'organic_search';
  return 'referral';
};
const touch = () => {
  const t = { landing_page_url: location.href, landing_page_path: location.pathname, referrer: document.referrer && !document.referrer.includes(location.host) ? document.referrer : '', at: Date.now() };
  KEYS.forEach((k) => { if (params.get(k)) t[k] = params.get(k).slice(0, 200); });
  if (CFG.page) { const [platform, audience] = CFG.page.split('|'); t.page_platform = platform; t.campaign_audience = audience; }
  t.platform = platformFrom(t);
  return t;
};
const FT_DAYS = 90;
let first = store.get('bbd_first_touch');
if (!first || Date.now() - first.at > FT_DAYS * 864e5) { first = touch(); store.set('bbd_first_touch', first); }
if (hasCampaign || CFG.page) store.set('bbd_last_touch', touch());
const last = store.get('bbd_last_touch') || first;

// ---------------------------------------------------------------- analytics
// Tags load after the first interaction (or 3.5s) so they never slow the first paint.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); } // eslint-disable-line prefer-rest-params
const inject = (src, attrs = {}) => { const s = document.createElement('script'); s.src = src; s.async = true; Object.assign(s, attrs); document.head.append(s); };
let tagsLoaded = false;
function loadTags() {
  if (tagsLoaded) return; tagsLoaded = true;
  if (CFG.gtm) { dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' }); inject(`https://www.googletagmanager.com/gtm.js?id=${CFG.gtm}`); return; }
  if (CFG.ga4 || CFG.ads) {
    inject(`https://www.googletagmanager.com/gtag/js?id=${CFG.ga4 || CFG.ads}`);
    gtag('js', new Date());
    if (CFG.ga4) gtag('config', CFG.ga4, { platform: last.platform, campaign_audience: last.campaign_audience || '' });
    if (CFG.ads) gtag('config', CFG.ads);
  }
  if (CFG.meta) {
    /* eslint-disable */ !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]}(window,document); /* eslint-enable */
    inject('https://connect.facebook.net/en_US/fbevents.js'); fbq('init', CFG.meta); fbq('track', 'PageView');
  }
  if (CFG.li) {
    window._linkedin_partner_id = CFG.li; window._linkedin_data_partner_ids = [CFG.li];
    window.lintrk = window.lintrk || function (a, b) { (window.lintrk.q = window.lintrk.q || []).push([a, b]); };
    inject('https://snap.licdn.com/li.lms-analytics/insight.min.js');
  }
}
['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((e) => addEventListener(e, loadTags, { once: true, passive: true }));
setTimeout(loadTags, 3500);

// One function for every event: dataLayer (GTM) or gtag (GA4) plus Meta/LinkedIn where relevant.
function track(event, data = {}) {
  const payload = { platform: last.platform, campaign_audience: last.campaign_audience || '', page_path: location.pathname, ...data };
  if (CFG.gtm) dataLayer.push({ event, ...payload });
  else if (CFG.ga4) gtag('event', event, payload);
}
window.bbdTrack = track;
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-track]');
  if (a) track(a.dataset.track, { link_url: a.getAttribute('href'), link_text: a.textContent.trim().slice(0, 60) });
});
if (/^\/product\//.test(location.pathname)) track('size_page_view', { box_size: (location.pathname.match(/(\d+)-yard/) || [])[1] });
if (CFG.page) track('campaign_landing_page_view', { platform: CFG.page.split('|')[0], campaign_audience: CFG.page.split('|')[1] });

// ---------------------------------------------------------------- lead forms
// Buttons with data-bundle (deal cards) pick that bundle in the form they link to.
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-bundle]');
  if (!b) return;
  const target = document.querySelector(b.getAttribute('href'));
  const form = target?.matches('form') ? target : target?.querySelector('form[data-lead-form]');
  if (form?.selectBundle) form.selectBundle(b.dataset.bundle);
});
// Fill hidden attribution fields, send to /api/lead, and only report success when the server confirms it.
const qs = new URLSearchParams(location.search);
document.querySelectorAll('form[data-lead-form]').forEach((form) => {
  const set = (name, value) => { const el = form.elements[name]; if (el && value != null && !el.value) el.value = value; };
  // ---- order type (bundle) + per-size quantities + live summary ----
  const qty = form.elements.quantity;
  const summary = form.querySelector('[data-summary]');
  const BUNDLE_MIN = { 10: 10, 20: 20, '20+': 21 };
  const bundleLabel = (v) => form.querySelector(`input[name="bundle"][value="${v}"] + span`)?.textContent || '';
  const sizeRows = [...form.querySelectorAll('.size-check')];
  function refresh(changedBundle) {
    let total = 0; const parts = [];
    sizeRows.forEach((row) => {
      const cb = row.querySelector('input[type=checkbox]'); const q = row.querySelector('.size-qty');
      if (q) { q.hidden = !cb.checked; q.disabled = !cb.checked; if (cb.checked && !q.value) q.value = 1; if (!cb.checked) q.value = ''; }
      if (!cb.checked) return;
      const n = q ? parseInt(q.value, 10) || 0 : 0;
      total += n;
      parts.push(q ? `${n || '?'} × ${cb.dataset.label}` : cb.dataset.label);
    });
    const bundle = form.querySelector('input[name="bundle"]:checked')?.value || '';
    if (total > 0) { qty.value = total; qty.readOnly = true; }
    else { qty.readOnly = false; if (changedBundle && bundle && (parseInt(qty.value, 10) || 0) < BUNDLE_MIN[bundle]) qty.value = BUNDLE_MIN[bundle]; }
    const count = parseInt(qty.value, 10) || 0;
    const bits = [];
    if (parts.length) bits.push(parts.join(', '));
    if (count) bits.push(`<strong>${count} box${count === 1 ? '' : 'es'}</strong>`);
    if (bundle) bits.push(bundleLabel(bundle));
    let hint = '';
    if (bundle && count && count < BUNDLE_MIN[bundle]) hint = `Add ${BUNDLE_MIN[bundle] - count} more box${BUNDLE_MIN[bundle] - count === 1 ? '' : 'es'} to reach the ${bundle === '20+' ? 'large fleet' : `${bundle}-box bundle`}.`;
    else if (!bundle && count >= 20) hint = '20+ boxes qualifies for the 20-box bundle (save 7%) or large fleet pricing. Pick it above.';
    else if (!bundle && count >= 10) hint = '10+ boxes qualifies for the 10-box bundle (save 5%). Pick it above.';
    if (summary) { summary.hidden = !bits.length; summary.innerHTML = bits.length ? `<span class="form-summary__title">Your request</span> ${bits.join(' · ')}${hint ? `<span class="form-summary__hint">${hint}</span>` : ''}` : ''; }
    if (form.elements.inquiry_type && bundle) form.elements.inquiry_type.value = `bundle_${bundle}`;
  }
  form.addEventListener('change', (e) => { if (e.target.matches('input[name="sizes"], input[name="bundle"]')) refresh(e.target.name === 'bundle'); });
  form.addEventListener('input', (e) => { if (e.target.matches('.size-qty, [name="quantity"]')) refresh(false); });
  form.selectBundle = (v) => { const r = form.querySelector(`input[name="bundle"][value="${v}"]`); if (r) { r.checked = true; refresh(true); } };
  // Links like /request-a-quote/?size=9 or ?bundle=10 pre-select the form.
  if (qs.get('size')) form.querySelectorAll(`input[name="sizes"][value="${qs.get('size')} yd"]`).forEach((c) => { c.checked = true; });
  if (qs.get('size') && qs.get('bundle') && BUNDLE_MIN[qs.get('bundle')]) { const q = form.querySelector(`.size-check:has(input[value="${qs.get('size')} yd"]) .size-qty`); if (q) q.value = BUNDLE_MIN[qs.get('bundle')]; }
  if (qs.get('bundle')) form.selectBundle(qs.get('bundle'));
  refresh(Boolean(form.querySelector('input[name="bundle"]:checked')?.value) && !qty.value);
  let started = false;
  form.addEventListener('focusin', () => { if (!started) { started = true; track('form_start', { form_id: form.id }); } });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const status = form.querySelector('.form__status');
    const btn = form.querySelector('.form__submit');
    status.className = 'form__status'; status.textContent = '';
    if (!form.checkValidity()) { form.reportValidity(); status.classList.add('is-error'); status.textContent = 'Please complete the required fields.'; return; }
    // Attribution: original landing page + the page the form was sent from. Campaign pages set platform/audience.
    form.elements.landing_page_url.value = first.landing_page_url;
    form.elements.landing_page_path.value = first.landing_page_path;
    form.elements.form_page_url.value = location.href;
    form.elements.form_page_path.value = location.pathname;
    form.elements.referrer.value = first.referrer || '';
    KEYS.forEach((k) => { form.elements[k].value = first[k] || last[k] || ''; });
    if (!form.elements.platform.value) form.elements.platform.value = last.platform || first.platform;
    if (!form.elements.campaign_audience.value) form.elements.campaign_audience.value = last.campaign_audience || first.campaign_audience || '';
    form.elements.submitted_at.value = new Date().toISOString();
    const data = new FormData(form);
    data.append('first_touch', JSON.stringify(first));
    data.append('last_touch', JSON.stringify(last));
    btn.disabled = true; btn.dataset.text = btn.textContent; btn.textContent = 'Sending…';
    try {
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { accept: 'application/json' } });
      const out = await res.json().catch(() => ({}));
      if (!res.ok || !out.ok) throw new Error(out.error || 'Your request could not be sent.');
      const sizes = data.getAll('sizes').join(', ');
      track('form_submit_success', { form_id: form.id, lead_id: out.id, box_sizes: sizes, quantity: data.get('quantity'), state: data.get('state'), customer_type: data.get('customer_type') });
      if (/bundle/.test(data.get('inquiry_type')) || Number(data.get('quantity')) >= 10) track('bundle_inquiry', { form_id: form.id, quantity: data.get('quantity') });
      store.set('bbd_lead_pending', { id: out.id, platform: data.get('platform'), audience: data.get('campaign_audience'), quantity: data.get('quantity'), sizes, state: data.get('state'), customer_type: data.get('customer_type'), email: data.get('email'), phone: data.get('phone') }, sessionStorage);
      location.href = `/thank-you/?lead=${encodeURIComponent(out.id)}`;
    } catch (err) {
      status.classList.add('is-error');
      status.textContent = `${err.message} You can also call us at ${form.querySelector('.form__privacy a[href^="tel:"]')?.textContent || ''}.`;
      btn.disabled = false; btn.textContent = btn.dataset.text;
    }
  });
});

// ---------------------------------------------------------------- conversion (thank-you page only)
// Fires generate_lead + ad conversions exactly once per lead: refreshing or revisiting the page does not count again.
if (location.pathname === '/thank-you/') {
  const lead = store.get('bbd_lead_pending', sessionStorage);
  const counted = store.get('bbd_counted') || [];
  if (lead && lead.id && !counted.includes(lead.id)) {
    store.set('bbd_counted', [...counted, lead.id].slice(-20));
    sessionStorage.removeItem('bbd_lead_pending');
    loadTags();
    const d = { lead_id: lead.id, platform: lead.platform, campaign_audience: lead.audience, quantity: lead.quantity, box_sizes: lead.sizes, state: lead.state, customer_type: lead.customer_type };
    track('generate_lead', d);
    if (!CFG.gtm) {
      if (CFG.ads && CFG.adsLabel) {
        gtag('set', 'user_data', { email: lead.email, phone_number: lead.phone }); // enhanced conversions (hashed by Google)
        gtag('event', 'conversion', { send_to: `${CFG.ads}/${CFG.adsLabel}`, transaction_id: lead.id });
      }
      if (CFG.meta) fbq('track', 'Lead', { content_name: lead.quantity }, { eventID: lead.id });
      if (CFG.li && CFG.liConv) window.lintrk('track', { conversion_id: Number(CFG.liConv) });
    }
  }
}

// ---------------------------------------------------------------- rent vs. buy calculator (formulas from the original page)
// Used by the calculator page (#calc-form) and the quick calculator in the Resources menu ([data-calc]).
document.querySelectorAll('#calc-form, form[data-calc]').forEach((calc) => calc.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = (id) => parseFloat(calc.elements[id].value);
  const purchasePrice = v('purchasePrice') || 0;
  const lifespan = v('lifespan') || 1;
  const resaleValue = v('resaleValue') || 0;
  const rentalRate = v('rentalRate') || 0;
  const daysPerJob = v('daysPerJob') || 0;
  const jobsPerYear = v('jobsPerYear') || 0;
  const ownershipCost = (purchasePrice - resaleValue) / lifespan;
  const rentalCost = rentalRate * daysPerJob * jobsPerYear;
  const usd = (n, d = 2) => `$${n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })}`;
  let html = `<p><strong>Annual Ownership Cost:</strong> ${usd(ownershipCost)}<br><strong>Annual Rental Cost:</strong> ${usd(rentalCost)}</p>`;
  if (rentalCost > ownershipCost) {
    const savings = rentalCost - ownershipCost;
    const paybackMonths = (purchasePrice / savings) * 12;
    html += `<p>💡 <strong>Buying is more cost-effective.</strong><br>Estimated savings per year: <strong>${usd(savings, 0)}</strong><br>Estimated payback period: <strong>${paybackMonths.toFixed(1)} months</strong>.</p>`;
  } else if (ownershipCost > rentalCost) {
    html += '<p>💡 <strong>Renting is more cost-effective</strong> at your current usage level.<br>You would need to use the box more frequently to justify a purchase.</p>';
  } else {
    html += '<p>Your annual costs are roughly equal—either option could work.</p>';
  }
  const out = calc.querySelector('[data-calc-result]') || document.getElementById('calc-result');
  out.innerHTML = calc.matches('[data-calc]') ? html : `${html}<p><a class="btn btn--sm" href="/request-a-quote/" data-track="quote_request_click">Get a Quote on a Box</a></p>`;
  out.hidden = false;
  track('calculator_used', { decision: rentalCost > ownershipCost ? 'buy' : 'rent' });
}));
