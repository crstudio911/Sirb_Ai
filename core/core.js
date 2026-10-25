(function () {
  'use strict';

  // 6.9.0: block pinch / double-tap zoom on phones (iOS ignores user-scalable=no)
  (function () {
    const stop = e => e.preventDefault();
    ['gesturestart', 'gesturechange', 'gestureend'].forEach(t => document.addEventListener(t, stop, { passive: false }));
    document.addEventListener('touchmove', e => { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
    let last = 0;
    document.addEventListener('touchend', e => { const n = Date.now(); if (n - last < 300 && !e.target.closest('input,textarea,select')) e.preventDefault(); last = n; }, { passive: false });
  })();

  const $ = (s, r) => (r || document).querySelector(s);

  const NS = 'http://www.w3.org/2000/svg';
  const PATHS = {
    ok: ['M20 6 9 17l-5-5'],
    err: ['M18 6 6 18', 'M6 6l12 12'],
    warn: ['M12 9v4', 'M12 17h.01', 'M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'],
    info: ['M12 16v-4', 'M12 8h.01']
  };
  function icon(type) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', 'note-ic');
    PATHS[type].forEach(d => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); s.append(p); });
    const w = document.createElement('span'); w.className = 'note-mark ' + type; w.append(s);
    return w;
  }
  const norm = t => t === 'success' ? 'ok' : t === 'error' ? 'err' : PATHS[t] ? t : 'info';
  function log(message, detail) {
    if (detail !== undefined) console.error('[ SIRB_Ai ] ERROR : ' + message, detail);
    else console.error('[ SIRB_Ai ] ERROR : ' + message);
  }
  function msg(el, text, type) {
    if (!el) return;
    el.textContent = '';
    el.className = 'msg' + (type ? ' ' + type : '');
    if (!text) return;
    if (type) el.append(icon(norm(type)));
    el.append(document.createTextNode(text));
    if (type === 'error' || type === 'err' || type === 'warn') {
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > innerHeight) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
  let stack;
  function toast(text, type) {
    type = norm(type);
    if (!stack) { stack = document.createElement('div'); stack.className = 'notes'; stack.setAttribute('aria-live', 'polite'); document.body.append(stack); }
    const n = document.createElement('div');
    n.className = 'note ' + type;
    n.setAttribute('role', type === 'err' ? 'alert' : 'status');
    const t = document.createElement('span'); t.textContent = text;
    const x = document.createElement('button'); x.type = 'button'; x.className = 'note-x'; x.setAttribute('aria-label', 'إغلاق'); x.textContent = '\u00d7';
    n.append(icon(type), t, x);
    const close = () => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); };
    x.addEventListener('click', close);
    stack.append(n);
    while (stack.children.length > 3) stack.firstChild.remove();
    requestAnimationFrame(() => n.classList.add('show'));
    setTimeout(close, Math.min(9000, (type === 'err' ? 4500 : 3000) + String(text).length * 40));
  }
  window.SirbUI = Object.freeze({ toast, msg, log, icon });

  function initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('sirb-theme'); } catch (e) {}
    document.documentElement.dataset.theme = saved === 'light' ? 'light' : 'dark';
    const t = $('#themeToggle');
    if (!t) return;
    t.addEventListener('click', function () {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('sirb-theme', next); } catch (e) {}
    });
  }

  // ===== تعدد السيرفرات (6.6.0) =====
  // كل طلب بيتبعت كامل لسيرفر واحد بس. لو السيرفر وقع أو خلصت حدود الذكاء الاصطناعي اليومية بتاعته،
  // بنعلّم عليه ونجرب اللي بعده. الطلبات اللي بتصرف كريديت مبتتعادش إلا لو اتأكدنا إنها متنفذتش.
  const SERVERS = (function () {
    const c = window.SIRB_CONFIG || {};
    const list = Array.isArray(c.WORKER_URLS) && c.WORKER_URLS.length ? c.WORKER_URLS : [c.WORKER_URL];
    return list.map(u => String(u || '').replace(/\/+$/, '')).filter(u => /^https:\/\//.test(u) && !/YOUR-WORKER/i.test(u));
  })();
  const API = SERVERS[0] || '';
  const HKEY = 'sirb-nodes';
  const MEDIA = { '/generate': 1, '/video': 1 };
  const SESSION_OK = { '/login': 1, '/signup': 1, '/me': 1, '/admin-login': 1 };
  const LOGOUT = { '/logout': 1, '/admin-logout': 1 };
  function health() { try { return JSON.parse(localStorage.getItem(HKEY) || '{}') || {}; } catch (e) { return {}; } }
  function mark(srv, ms, why) {
    const h = health(); h[srv] = { until: Date.now() + ms, why }; 
    try { localStorage.setItem(HKEY, JSON.stringify(h)); } catch (e) {}
    log('server ' + (SERVERS.indexOf(srv) + 1) + ' paused: ' + why);
  }
  function clear(srv) { const h = health(); if (h[srv]) { delete h[srv]; try { localStorage.setItem(HKEY, JSON.stringify(h)); } catch (e) {} } }
  function untilUtcMidnight() { const d = new Date(); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1) - Date.now() + 60000; }
  function order(pin) {
    const h = health(), now = Date.now();
    const ready = SERVERS.filter(s => !(h[s] && h[s].until > now));
    const paused = SERVERS.filter(s => h[s] && h[s].until > now).sort((a, b) => h[a].until - h[b].until);
    let list = ready.concat(paused);
    if (pin && SERVERS.indexOf(pin) >= 0) list = [pin].concat(list.filter(s => s !== pin));
    return list;
  }
  async function hit(srv, path, body, ms) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
      const res = await fetch(srv + path, {
        method: 'POST', mode: 'cors', credentials: 'include', cache: 'no-store', referrerPolicy: 'no-referrer',
        headers: { 'Content-Type': 'application/json', 'X-Sirb': '1' },
        body: JSON.stringify(body || {}), signal: ctrl.signal
      });
      let data = null;
      try { data = await res.json(); } catch (e) {}
      return { status: res.status, data, srv };
    } finally { clearTimeout(timer); }
  }
  // نسخ تسجيل الدخول لباقي السيرفرات، علشان لو حصل تبديل المستخدم يفضل داخل.
  let syncing = null;
  function mirror(from) {
    if (SERVERS.length < 2 || syncing) return;
    syncing = (async () => {
      try {
        const r = await hit(from, '/handoff', {}, 15000);
        const passes = r.data && r.data.ok && Array.isArray(r.data.passes) ? r.data.passes : [];
        if (!passes.length) return;
        await Promise.all(SERVERS.filter(s => s !== from).map(s => hit(s, '/adopt', { passes }, 15000).catch(() => null)));
      } catch (e) {} finally { syncing = null; }
    })();
  }
  async function api(path, body, opt) {
    if (!SERVERS.length) { log('WORKER_URLS is missing or invalid in config.js'); throw new Error('config'); }
    const ms = MEDIA[path] ? 150000 : path === '/video-status' ? 60000 : 25000;
    if (LOGOUT[path]) {
      const all = await Promise.all(SERVERS.map(s => hit(s, path, body, ms).catch(() => null)));
      const r = all.find(Boolean);
      if (!r) throw new Error('network');
      return { status: r.status, data: r.data || {}, srv: r.srv };
    }
    let lastErr = null, last = null;
    for (const srv of order(opt && opt.srv)) {
      let r;
      try { r = await hit(srv, path, body, ms); }
      catch (e) {
        const timeout = e && e.name === 'AbortError';
        log(path + ' -> ' + (timeout ? 'timeout' : 'network error') + ' @' + (SERVERS.indexOf(srv) + 1));
        lastErr = e;
        // الطلب اتبعت ومستنينه؟ ممكن يكون اتنفذ، فمش هنبعته تاني لسيرفر تاني علشان الكريديت ميتخصمش مرتين.
        if (timeout && MEDIA[path]) throw e;
        mark(srv, timeout ? 30000 : 60000, timeout ? 'timeout' : 'down');
        continue;
      }
      const d = r.data;
      // رد من Cloudflare نفسها (مش من الخادم بتاعنا) = السيرفر واقع، والطلب موصلش.
      if (!d && (r.status >= 500 || r.status === 429)) { mark(srv, 60000, 'down ' + r.status); last = r; continue; }
      // حدود الذكاء الاصطناعي اليومية خلصت على السيرفر ده، والكريديت رجع، فنجرب اللي بعده.
      if (d && d.error === 'ai_quota') { mark(srv, untilUtcMidnight(), 'ai_quota'); last = r; continue; }
      if (d && d.error === 'config' && r.status >= 500) { mark(srv, 300000, 'config'); last = r; continue; }
      clear(srv);
      if (r.status >= 500) log(path + ' -> ' + r.status + ' ' + String(d && d.error || '') + (d && d.reason ? ' | ' + d.reason : ''));
      if (SESSION_OK[path] && d && d.ok) mirror(srv);
      else if (path === '/admin' && body && body.op === 'whoami' && d && d.ok) mirror(srv);
      return { status: r.status, data: d || {}, srv };
    }
    if (last) return { status: last.status, data: last.data || {}, srv: last.srv };
    throw lastErr || new Error('network');
  }

  // تحميل ملف (فيديو) من خادمنا بتصريح موقّع؛ أي سيرفر يقبل التصريح لأن السر واحد.
  async function file(path, body, opt) {
    for (const srv of order(opt && opt.srv)) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 120000);
      try {
        const res = await fetch(srv + path, {
          method: 'POST', mode: 'cors', credentials: 'include', cache: 'no-store', referrerPolicy: 'no-referrer',
          headers: { 'Content-Type': 'application/json', 'X-Sirb': '1' }, body: JSON.stringify(body || {}), signal: ctrl.signal
        });
        if (res.ok && !/json/.test(res.headers.get('content-type') || '')) return await res.blob();
        if (res.status === 401 || res.status === 400 || res.status === 410) return null;
      } catch (e) { log(path + ' -> network error'); } finally { clearTimeout(timer); }
    }
    return null;
  }

  const KEY = 'sirb-user';
  function cached() {
    try { const u = JSON.parse(sessionStorage.getItem(KEY) || 'null'); return u && typeof u.name === 'string' ? u : null; } catch (e) { return null; }
  }
  function store(u) {
    try { u ? sessionStorage.setItem(KEY, JSON.stringify(u)) : sessionStorage.removeItem(KEY); } catch (e) {}
  }
  let pending = null;
  function session(force) {
    if (pending && !force) return pending;
    pending = (async () => {
      try {
        const r = await api('/me', {});
        const u = r.data && r.data.ok ? r.data.user : null;
        store(u);
        return u;
      } catch (e) {
        return e && e.message === 'config' ? null : cached();
      }
    })();
    return pending;
  }
  async function logout() {
    try { await api('/logout', {}); } catch (e) {}
    store(null);
  }
  function applyAuth(u) {
    document.documentElement.dataset.auth = u ? 'in' : 'out';
    document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = u ? u.name : ''; });
    document.dispatchEvent(new CustomEvent('sirb:session', { detail: u }));
  }

  window.SirbApi = Object.freeze({ api, file, initTheme, session, logout, cached, configured: () => SERVERS.length > 0, servers: () => SERVERS.slice() });

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    const c = cached();
    if (c) document.documentElement.dataset.auth = 'in';
    session().then(applyAuth);
  });
})();
