(function () {
  'use strict';

  const API = String(window.SIRB_CONFIG && window.SIRB_CONFIG.WORKER_URL || '').replace(/\/+$/, '');
  const $ = (s, r) => (r || document).querySelector(s);

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
    if (!API || !/^https:\/\//.test(API) || /YOUR-WORKER/i.test(API)) throw new Error('config');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), path === '/generate' ? 90000 : 20000);
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
      return { status: res.status, data };
    } finally {
      clearTimeout(timer);
    }
  }

  const KEY = 'sirb-user';
  function cached() {
    try { const u = JSON.parse(sessionStorage.getItem(KEY) || 'null'); return u && typeof u.name === 'string' ? u : null; } catch (e) { return null; }
  }
  function store(u) {
    try { u ? sessionStorage.setItem(KEY, JSON.stringify({ name: u.name, email: u.email || '', inviteCode: u.inviteCode, plan: u.plan || 'free' })) : sessionStorage.removeItem(KEY); } catch (e) {}
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
