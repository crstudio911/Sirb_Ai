(function () {
  'use strict';

  const NAME = 'sirb-ai';
  let dbp = null;

  function open() {
    if (dbp) return dbp;
    dbp = new Promise((resolve, reject) => {
      const r = indexedDB.open(NAME, 1);
      r.onupgradeneeded = () => {
        const db = r.result;
        if (!db.objectStoreNames.contains('chats')) db.createObjectStore('chats', { keyPath: 'id' }).createIndex('updated', 'updated');
        if (!db.objectStoreNames.contains('images')) {
          const s = db.createObjectStore('images', { keyPath: 'id' });
          s.createIndex('chatId', 'chatId');
          s.createIndex('t', 't');
        }
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

  const Store = {
    uid,
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
      const item = { id: uid(), chatId, blob: dataToBlob(dataUrl), prompt: meta.prompt, style: meta.style || '', styleName: meta.styleName || '', steps: meta.steps, seed: meta.seed, t: Date.now() };
      await tx('images', 'readwrite', s => req(s.put(item)));
      return item;
    },
    deleteImage: id => tx('images', 'readwrite', s => req(s.delete(id)))
  };

  window.SirbStore = Object.freeze(Store);
})();
