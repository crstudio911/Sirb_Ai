(function () {
  'use strict';

  const API = String(window.SIRB_CONFIG && window.SIRB_CONFIG.WORKER_URL || '').replace(/\/+$/, '');
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
    setTimeout(close, type === 'err' ? 5000 : 3200);
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

  async function api(path, body) {
    if (!API || !/^https:\/\//.test(API) || /YOUR-WORKER/i.test(API)) { log('WORKER_URL is missing or invalid in core/config.js'); throw new Error('config'); }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), (path === '/generate' || path === '/video') ? 150000 : path === '/video-status' ? 60000 : 25000);
    try {
      const res = await fetch(API + path, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        headers: { 'Content-Type': 'application/json', 'X-Sirb': '1' },
        body: JSON.stringify(body || {}),
        signal: ctrl.signal
      });
      let data = {};
      try { data = await res.json(); } catch (e) {}
      if (res.status >= 500 || (data && /config/.test(String(data.error || '')))) log(path + ' -> ' + res.status + ' ' + String(data && data.error || '') + (data && data.reason ? ' | ' + data.reason : ''));
      return { status: res.status, data };
    } catch (e) {
      log(path + ' -> ' + (e && e.name === 'AbortError' ? 'timeout' : 'network error'));
      throw e;
    } finally {
      clearTimeout(timer);
    }
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

  window.SirbApi = Object.freeze({ api, initTheme, session, logout, cached, configured: () => !!API && !/YOUR-WORKER/i.test(API) });

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    const c = cached();
    if (c) document.documentElement.dataset.auth = 'in';
    session().then(applyAuth);
  });
})();
