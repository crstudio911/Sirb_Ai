(function () {
  'use strict';

  const VIEWS = ['studio', 'library', 'wallet', 'profile'];
  const VKEY = 'sirb-view';
  const $ = id => document.getElementById(id);
  const ERR = {
    unauthorized: 'انتهت الجلسة، سجل الدخول مرة أخرى',
    prompt_short: 'اكتب وصف أطول شوية',
    gen_rate: 'وصلت لحد الصور في الدقيقة، استنى شوية وجرب تاني',
    day_limit: 'خلصت صور النهارده في خطتك، رقّي لـ Pro أو استنى لبكرة',
    server: 'الخادم مشغول، جرب تاني',
    ai_failed: 'حصلت مشكلة في الإنشاء، جرب تاني',
    ai_quota: 'خدمة الرسم وصلت لحدها اليومي، جرب تاني بعد شوية. الصورة دي مش محسوبة عليك',
    ai_config: 'خدمة الإنشاء لسه مش متظبطة',
    config: 'رابط الخادم لم يُضبط بعد',
    storage: 'المتصفح منع حفظ الصورة على الجهاز'
  };
  const S = window.SirbStore;
  const urls = new Map();
  const urlOf = img => { if (!urls.has(img.id)) urls.set(img.id, URL.createObjectURL(img.blob)); return urls.get(img.id); };
  const fmt = t => new Date(t).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });

  let toastT;
  function toast(t) {
    const el = $('toast');
    el.textContent = t;
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('show'), 2400);
  }

  function svg(name, raw) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', 'ic');
    const u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    u.setAttribute('href', '#' + (raw ? name : 'i-' + name));
    s.append(u);
    return s;
  }
  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function download(img) {
    const a = document.createElement('a');
    a.href = urlOf(img); a.download = 'sirb-' + img.seed + '.jpg';
    document.body.append(a); a.click(); a.remove();
  }

  function parseHash() {
    const [v, id] = location.hash.slice(1).split('/');
    if (VIEWS.includes(v)) return { view: v, chat: v === 'studio' ? id || null : null };
    try {
      const s = JSON.parse(localStorage.getItem(VKEY) || 'null');
      if (s && VIEWS.includes(s.view)) return s;
    } catch (e) {}
    return { view: 'studio', chat: null };
  }

  document.addEventListener('DOMContentLoaded', async function () {
    const { session, logout, api } = window.SirbApi;
    const user = await session();
    if (!user) { location.replace('../log/one.html'); return; }

    $('uName').textContent = user.name;
    $('uEmail').textContent = user.email || '';
    $('pEmail').textContent = user.email || '';
    $('uCode').textContent = user.inviteCode;
    $('pCode').textContent = user.inviteCode;
    document.querySelectorAll('[data-user-name]').forEach(e => { e.textContent = user.name; });
    document.querySelectorAll('[data-plan-name]').forEach(e => { e.textContent = user.planName || 'Free'; e.classList.toggle('pro', (user.plan || 'free') !== 'free'); });
    function usage() {
      const used = Number(user.usedToday) || 0, max = Number(user.perDay) || 0;
      $('useVal').textContent = max ? used + ' / ' + max : String(used);
      $('useBar').style.width = max ? Math.min(100, used / max * 100) + '%' : '0%';
      $('useNote').textContent = max ? 'باقي ' + Math.max(0, max - used) + ' صورة النهارده، والعداد بيتجدد كل يوم.' : 'بدون حد يومي.';
      $('quota').textContent = max ? 'باقي ' + Math.max(0, max - used) + ' اليوم' : '';
    }
    usage();
    api('/plans', {}).then(r => {
      const box = $('plans');
      if (!r.data || !r.data.ok || !Array.isArray(r.data.plans)) return;
      box.textContent = '';
      r.data.plans.forEach(p => {
        const cur = p.id === (user.plan || 'free');
        const card = el('article', 'plan-box' + (p.highlight ? ' hot' : '') + (cur ? ' current' : ''));
        const head = el('div', 'plan-top');
        head.append(svg(p.id === 'free' ? 'spark' : 'crown'), el('h3', 'en', p.name));
        if (p.highlight) head.append(el('span', 'tag', 'الأفضل'));
        const price = el('p', 'price');
        price.append(el('strong', 'en', p.price ? String(p.price) : '0'), el('span', 'en', ' ' + p.currency), el('em', '', p.period ? ' / ' + p.period : ''));
        const ul = el('ul', 'checks');
        p.features.forEach(t => { const li = el('li'); li.append(svg('check'), el('span', '', t)); ul.append(li); });
        const btn = el('button', 'btn' + (cur ? ' ghost' : ''), cur ? 'خطتك الحالية' : 'الترقية قريباً');
        btn.type = 'button'; btn.disabled = true;
        card.append(head, price, ul, btn);
        box.append(card);
      });
    }).catch(() => {});
    $('shell').hidden = false;

    let chatId = null;

    const ago = t => {
      const d = Math.floor((Date.now() - t) / 60000);
      if (d < 1) return 'الآن';
      if (d < 60) return 'منذ ' + d + ' د';
      if (d < 1440) return 'منذ ' + Math.floor(d / 60) + ' س';
      if (d < 2880) return 'أمس';
      return new Date(t).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
    };
    let filter = '';
    async function renderChats() {
      const list = $('chatList');
      const [chats, imgs] = await Promise.all([S.chats(), S.allImages()]);
      const count = new Map();
      imgs.forEach(i => count.set(i.chatId, (count.get(i.chatId) || 0) + 1));
      const q = filter.trim().toLowerCase();
      const shown = q ? chats.filter(c => c.title.toLowerCase().includes(q) || imgs.some(i => i.chatId === c.id && String(i.prompt).toLowerCase().includes(q))) : chats;
      list.textContent = '';
      if (!shown.length) list.append(el('span', 'chat-none', chats.length ? 'مفيش نتايج' : 'السجل فاضي'));
      shown.forEach(c => {
        const b = el('a', 'chat-item' + (c.id === chatId ? ' active' : ''));
        b.href = '#studio/' + c.id;
        const txt = el('span', 'chat-txt');
        txt.append(el('b', '', c.title), el('small', '', (count.get(c.id) || 0) + ' صورة · ' + ago(c.updated)));
        b.append(svg('history'), txt);
        const r = el('button', 'chat-act');
        r.type = 'button'; r.setAttribute('aria-label', 'إعادة تسمية'); r.append(svg('prompt'));
        r.addEventListener('click', async e => {
          e.preventDefault(); e.stopPropagation();
          const n = (window.prompt('اسم المحادثة', c.title) || '').trim();
          if (!n || n === c.title) return;
          await S.touchChat(c.id, n);
          renderChats();
          if (c.id === chatId) $('chatTitle').textContent = n.slice(0, 60);
        });
        const x = el('button', 'chat-act del');
        x.type = 'button'; x.setAttribute('aria-label', 'حذف المحادثة'); x.append(svg('trash'));
        x.addEventListener('click', async e => {
          e.preventDefault(); e.stopPropagation();
          if (!confirm('حذف المحادثة "' + c.title + '" وكل صورها؟')) return;
          await S.deleteChat(c.id);
          if (chatId === c.id) location.hash = '#studio';
          else renderChats();
        });
        b.append(r, x);
        list.append(b);
      });
      return chats;
    }

    async function renderThread() {
      const th = $('thread');
      th.querySelectorAll('.turn').forEach(n => n.remove());
      const chat = chatId ? await S.chat(chatId) : null;
      $('chatTitle').textContent = chat ? chat.title : '';
      const imgs = chat ? await S.imagesOf(chatId) : [];
      $('emptyState').hidden = imgs.length > 0;
      imgs.forEach(i => th.append(turn(i)));
      th.scrollTop = th.scrollHeight;
    }

    function turn(i) {
      const t = el('article', 'turn');
      const q = el('p', 'turn-prompt', i.prompt);
      const meta = el('span', 'turn-meta', (i.styleName ? i.styleName + ' · ' : '') + fmt(i.t));
      const im = el('img'); im.src = urlOf(i); im.alt = i.prompt; im.loading = 'lazy';
      const acts = el('div', 'turn-acts');
      const d = el('button', 'icon-btn'); d.type = 'button'; d.setAttribute('aria-label', 'تحميل'); d.append(svg('download'));
      d.addEventListener('click', () => download(i));
      const e = el('button', 'icon-btn'); e.type = 'button'; e.setAttribute('aria-label', 'تعديل الوصف'); e.append(svg('prompt'));
      e.addEventListener('click', () => { $('prompt').value = i.prompt; $('prompt').dispatchEvent(new Event('input')); $('prompt').focus(); });
      acts.append(d, e);
      t.append(q, meta, im, acts);
      return t;
    }

    async function renderLibrary() {
      const grid = $('grid');
      const [imgs, chats] = await Promise.all([S.allImages(), S.chats()]);
      const names = new Map(chats.map(c => [c.id, c.title]));
      grid.textContent = '';
      $('libraryEmpty').hidden = imgs.length > 0;
      $('libCount').textContent = imgs.length ? imgs.length + ' صورة' : '';
      imgs.forEach(i => {
        const fig = el('figure');
        const im = el('img'); im.src = urlOf(i); im.alt = i.prompt; im.loading = 'lazy';
        const cap = el('figcaption');
        cap.append(el('p', 'cap-prompt', i.prompt));
        const go = el('a', 'cap-chat'); go.href = '#studio/' + i.chatId;
        go.append(svg('history'), el('span', '', names.get(i.chatId) || 'محادثة'));
        cap.append(go);
        const d = el('button', 'icon-btn dl'); d.type = 'button'; d.setAttribute('aria-label', 'تحميل'); d.append(svg('download'));
        d.addEventListener('click', () => download(i));
        fig.append(im, cap, d);
        grid.append(fig);
      });
    }

    async function show() {
      let { view, chat } = parseHash();
      if (view === 'studio') {
        if (chat && !(await S.chat(chat))) chat = null;
        if (!chat && !location.hash.startsWith('#studio')) { const c = (await S.chats())[0]; chat = c ? c.id : null; }
        chatId = chat;
      }
      document.querySelectorAll('.view').forEach(v => { v.hidden = v.dataset.view !== view; });
      document.querySelectorAll('.tabs-bar a').forEach(a => {
        const on = a.dataset.view === view;
        a.classList.toggle('active', on);
        a.setAttribute('aria-selected', on ? 'true' : 'false');
        if (a.dataset.view === 'studio') a.href = chatId ? '#studio/' + chatId : '#studio';
      });
      try { localStorage.setItem(VKEY, JSON.stringify({ view, chat: view === 'studio' ? chatId : null })); } catch (e) {}
      if (view === 'studio') { await renderChats(); await renderThread(); }
      if (view === 'library') await renderLibrary();
    }

    try { await show(); } catch (e) { toast(ERR.storage); }
    window.addEventListener('hashchange', () => show().catch(() => toast(ERR.storage)));

    const inviteUrl = () => { const u = new URL('../log/one.html', location.href); u.search = '?invite=' + encodeURIComponent(user.inviteCode); return u.toString(); };
    const copy = async (text, ok) => { try { await navigator.clipboard.writeText(text); toast(ok); } catch (e) { toast(text); } };
    $('copyCode').addEventListener('click', () => copy(user.inviteCode, 'تم نسخ كود الدعوة'));
    $('copyLink').addEventListener('click', () => copy(inviteUrl(), 'تم نسخ رابط الدعوة'));
    $('shareBtn').addEventListener('click', async () => {
      if (navigator.share) { try { await navigator.share({ title: 'Sirb_Ai', text: 'انضم لـ Sirb Ai', url: inviteUrl() }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
      copy(inviteUrl(), 'تم نسخ رابط الدعوة');
    });
    $('logoutBtn').addEventListener('click', async () => { await logout(); location.replace('../log/one.html'); });
    $('newChat').addEventListener('click', () => { chatId = null; location.hash = '#studio'; show(); $('prompt').focus(); });

    const prompt = $('prompt');
    prompt.addEventListener('input', () => { $('count').textContent = prompt.value.length + ' / 1000'; });
    const P = window.SirbPresets;
    let CATS = P.CATS;
    let cat = CATS[0];
    const picked = new Map();
    function renderOpts() {
      const box = $('opts');
      box.textContent = '';
      cat.groups.forEach((g, gi) => {
        const f = el('div', 'field');
        f.append(el('span', 'opt-name', g.name));
        const row = el('div', 'styles');
        g.opts.forEach(([label, en], oi) => {
          const key = gi + ':' + oi;
          const b = el('button', 'pill' + (picked.get(gi) === key ? ' active' : ''), label);
          b.type = 'button';
          b.addEventListener('click', () => {
            if (picked.get(gi) === key) picked.delete(gi); else picked.set(gi, key);
            renderOpts();
          });
          row.append(b);
        });
        f.append(row);
        box.append(f);
      });
    }
    function renderCats() {
      const box = $('cats');
      box.textContent = '';
      CATS.forEach(c => {
        const b = el('button', 'cat' + (c === cat ? ' active' : ''));
        b.type = 'button';
        const ic = svg(document.getElementById('c-' + c.icon) ? 'c-' + c.icon : 'c-free', true);
        b.append(ic, el('span', '', c.name));
        b.addEventListener('click', () => { cat = c; picked.clear(); renderCats(); renderOpts(); });
        box.append(b);
      });
    }
    renderCats(); renderOpts();
    api('/presets', {}).then(r => {
      if (!r.data || !r.data.ok || !Array.isArray(r.data.cats) || !r.data.cats.length) return;
      CATS = r.data.cats.filter(c => c && Array.isArray(c.groups));
      if (!CATS.length) { CATS = P.CATS; return; }
      cat = CATS.find(c => c.id === cat.id) || CATS[0];
      picked.clear(); renderCats(); renderOpts();
    }).catch(() => {});
    function extra() {
      const parts = cat.base ? [cat.base] : [];
      const names = [];
      picked.forEach(key => { const [gi, oi] = key.split(':').map(Number); const o = cat.groups[gi].opts[oi]; parts.push(o[1]); names.push(o[0]); });
      if (parts.length) parts.push(P.NOTE);
      return { text: parts.join(', '), names: [cat.id !== 'free' ? cat.name : ''].concat(names).filter(Boolean).join(' · ') };
    }
    $('chatSearch').addEventListener('input', e => { filter = e.target.value; renderChats(); });

    const STAGES = [[0, 'جاري الإعداد...'], [1500, 'جاري ترجمة وفهم الوصف...'], [4500, 'جاري رسم الصورة...'], [10000, 'جاري العمل على التفاصيل...'], [18000, 'جاري إضافة اللمسات الأخيرة...'], [30000, 'قربنا نخلص، ثواني...']];
    let stageT = [];
    function stages(on) {
      stageT.forEach(clearTimeout); stageT = [];
      const dots = $('loadSteps').children;
      const set = (i, t) => {
        const lt = $('loadText');
        lt.textContent = t; lt.style.animation = 'none'; void lt.offsetWidth; lt.style.animation = '';
        [...dots].forEach((d, k) => d.classList.toggle('on', k <= Math.min(i, dots.length - 1)));
        $('loadFill').style.width = Math.min(92, 8 + i * 17) + '%';
      };
      if (!on) { $('loadFill').style.width = '100%'; return; }
      STAGES.forEach(([ms, t], i) => stageT.push(setTimeout(() => set(i, t), ms)));
    }

    let busy = false;
    $('genForm').addEventListener('submit', async e => {
      e.preventDefault();
      if (busy) return;
      const text = prompt.value.trim();
      const msg = $('genMsg');
      if (text.length < 3) { msg.textContent = ERR.prompt_short; msg.className = 'msg error'; prompt.focus(); return; }
      busy = true;
      msg.textContent = ''; msg.className = 'msg';
      $('genBtn').disabled = true; $('loading').hidden = false; stages(true);
      const ex = extra();
      const style = ex.text, styleName = ex.names;
      try {
        const r = await api('/generate', { prompt: text, extra: style });
        if (r.status === 401) { location.replace('../log/one.html'); return; }
        if (!r.data || !r.data.ok || typeof r.data.image !== 'string' || !r.data.image.startsWith('data:image/')) { if (r.data && r.data.reason) console.error('Sirb generate:', r.data.reason); throw new Error((r.data && r.data.error) || 'ai_failed'); }
        let id = chatId;
        try {
          if (!id || !(await S.chat(id))) id = (await S.createChat(text)).id;
          await S.addImage(id, r.data.image, { prompt: text, style, styleName, model: r.data.model, seed: r.data.seed });
          await S.touchChat(id);
        } catch (err) { throw new Error('storage'); }
        $('costVal').textContent = String(r.data.cost || 0);
        if (typeof r.data.usedToday === 'number') { user.usedToday = r.data.usedToday; usage(); }
        if (id !== chatId) { chatId = id; location.hash = '#studio/' + id; }
        else { await renderChats(); await renderThread(); }
      } catch (err) {
        const k = err && err.name === 'AbortError' ? 'ai_failed' : err && err.message;
        msg.textContent = ERR[k] || 'تعذر الاتصال بالخادم';
        msg.className = 'msg error';
      } finally {
        busy = false;
        stages(false); $('genBtn').disabled = false; $('loading').hidden = true;
      }
    });
  });
})();
