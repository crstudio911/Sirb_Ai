(function () {
  'use strict';

  const NAME = 'sirb-ai';
  let dbp = null;

  function open() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      const r = indexedDB.open(NAME, 2);
      r.onupgradeneeded = () => {
        const db = r.result;
        if (!db.objectStoreNames.contains('chats')) db.createObjectStore('chats', { keyPath: 'id' }).createIndex('updated', 'updated');
        if (!db.objectStoreNames.contains('images')) {
          const s = db.createObjectStore('images', { keyPath: 'id' });
          s.createIndex('chatId', 'chatId');
          s.createIndex('t', 't');
        }
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv', { keyPath: 'k' });
        if (!db.objectStoreNames.contains('ledger')) db.createObjectStore('ledger', { keyPath: 'id' }).createIndex('t', 't');
      };
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    return dbp;
  }

  function req(r) { return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
  async function tx(store, mode, fn) {
    const db = await open();
    const t = db.transaction(store, mode);
    const out = await fn(t.objectStore(store));
    await new Promise((res, rej) => { t.oncomplete = res; t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); });
    return out;
  }

  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));

  function dataToBlob(dataUrl) {
    const m = /^data:(image\/[a-z]+);base64,(.+)$/.exec(dataUrl);
    if (!m) throw new Error('bad_image');
    const bin = atob(m[2]);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return new Blob([out], { type: m[1] });
  }

  // Small settings live in IndexedDB (not localStorage), so clearing localStorage does not remove them.
  const KV = new Map();
  const ready = (async () => {
    try {
      const all = await tx('kv', 'readonly', s => req(s.getAll()));
      all.forEach(x => KV.set(x.k, x.v));
      // one-time move of old localStorage values
      [['sirb-view', 'view'], ['sirb-jobs', 'jobs'], ['sirb-theme', 'theme']].forEach(([lk, k]) => {
        if (KV.has(k)) return;
        let v = null; try { v = localStorage.getItem(lk); } catch (e) {}
        if (v == null) return;
        try { v = k === 'theme' ? v : JSON.parse(v); } catch (e) { return; }
        KV.set(k, v); tx('kv', 'readwrite', s => req(s.put({ k, v }))).catch(() => {});
      });
      ['sirb-view', 'sirb-jobs'].forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
    } catch (e) {}
  })();

  const Store = {
    uid,
    ready,
    get: k => KV.get(k),
    set(k, v) { KV.set(k, v); return tx('kv', 'readwrite', s => req(s.put({ k, v }))).catch(() => {}); },
    // Credit history is downloaded from the server and kept here; the server keeps it only a few minutes.
    async ledgerPut(items, owner) {
      const ok = (items || []).filter(x => x && typeof x.id === 'string' && x.id).map(x => ({ id: x.id, t: String(x.t || ''), action: String(x.action || ''), credits: Number(x.credits) || 0, balance: Number(x.balance) || 0, status: String(x.status || ''), o: String(owner || '') }));
      if (!ok.length) return;
      await tx('ledger', 'readwrite', s => Promise.all(ok.map(x => req(s.put(x)))));
    },
    async ledgerAll(limit, owner) {
      const all = (await tx('ledger', 'readonly', s => req(s.getAll()))).filter(x => (x.o || '') === String(owner || ''));
      all.sort((a, b) => (a.t < b.t ? 1 : -1));
      if (all.length > 500) {
        const old = all.slice(500);
        await tx('ledger', 'readwrite', s => Promise.all(old.map(x => req(s.delete(x.id)))));
      }
      return all.slice(0, limit || 100);
    },
    ledgerClear: () => tx('ledger', 'readwrite', s => req(s.clear())),
    async chats() {
      const all = await tx('chats', 'readonly', s => req(s.getAll()));
      return all.sort((a, b) => b.updated - a.updated);
    },
    chat: id => tx('chats', 'readonly', s => req(s.get(id))),
    async createChat(title) {
      const c = { id: uid(), title: String(title || 'محادثة جديدة').slice(0, 60), created: Date.now(), updated: Date.now() };
      await tx('chats', 'readwrite', s => req(s.put(c)));
      return c;
    },
    async touchChat(id, title) {
      const c = await Store.chat(id);
      if (!c) return;
      c.updated = Date.now();
      if (title) c.title = String(title).slice(0, 60);
      await tx('chats', 'readwrite', s => req(s.put(c)));
    },
    async deleteChat(id) {
      const imgs = await Store.imagesOf(id);
      await tx('images', 'readwrite', s => Promise.all(imgs.map(i => req(s.delete(i.id)))));
      await tx('chats', 'readwrite', s => req(s.delete(id)));
    },
    async imagesOf(chatId) {
      const all = await tx('images', 'readonly', s => req(s.index('chatId').getAll(chatId)));
      return all.sort((a, b) => a.t - b.t);
    },
    async allImages() {
      const all = await tx('images', 'readonly', s => req(s.getAll()));
      return all.sort((a, b) => b.t - a.t);
    },
    async addImage(chatId, dataUrl, meta) {
      const item = { id: uid(), chatId, blob: dataToBlob(dataUrl), prompt: meta.prompt, style: meta.style || '', styleName: meta.styleName || '', model: meta.model || '', seed: meta.seed, refs: meta.refs || [], mode: meta.mode || 'normal', t: Date.now() };
      await tx('images', 'readwrite', s => req(s.put(item)));
      return item;
    },
    async addVideo(chatId, blob, url, meta) {
      const item = { id: uid(), chatId, kind: 'video', blob: blob || null, url: url || '', prompt: meta.prompt, style: meta.style || '', styleName: meta.styleName || '', model: meta.model || '', seed: meta.seed || Date.now() % 1000000, seconds: meta.seconds || 0, refs: meta.refs || [], t: Date.now() };
      await tx('images', 'readwrite', s => req(s.put(item)));
      return item;
    },
    deleteImage: id => tx('images', 'readwrite', s => req(s.delete(id)))
  };

  window.SirbStore = Object.freeze(Store);
})();
