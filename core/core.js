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
    if (!API || !/^https:\/\//.test(API)) throw new Error('config');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch(API + path, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        headers: { 'Content-Type': 'application/json' },
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

  window.SirbApi = Object.freeze({ api, initTheme });

  document.addEventListener('DOMContentLoaded', initTheme);
})();
