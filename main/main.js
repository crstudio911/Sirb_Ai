(function () {
  'use strict';

  const VIEWS = ['studio', 'library', 'wallet', 'profile'];
  const VKEY = 'sirb-view';
  const $ = id => document.getElementById(id);
  const ERR = {
    unauthorized: 'انتهت الجلسة، سجل الدخول مرة أخرى',
    prompt_short: 'اكتب وصف أطول شوية',
    gen_rate: 'وصلت لحد الصور في الدقيقة، استنى شوية وجرب تاني',
    no_credits: 'رصيدك من الكريديت مش كفاية للطلب ده',
    pro_required: 'وضع Pro متاح لمشتركي خطة Pro بس',
    refs_limit: 'عدد الصور المرجعية أكتر من المسموح أو الصورة مش مدعومة',
    video_len: 'مدة الفيديو مش مسموحة',
    fal_config: 'الخدمة مش متاحة دلوقتي، جرب تاني بعد شوية',
    size: 'الصور المرجعية حجمها كبير، جرب صور أقل',
    server: 'الخدمة مشغولة دلوقتي، جرب تاني',
    ai_failed: 'حصلت مشكلة في الإنشاء، جرب تاني',
    ai_quota: 'الخدمة عليها ضغط كبير دلوقتي، جرب تاني بعد شوية',
    ai_config: 'الخدمة مش متاحة دلوقتي، جرب تاني بعد شوية',
    config: 'الخدمة مش متاحة دلوقتي، جرب تاني بعد شوية',
    storage: 'المتصفح منع الحفظ على جهازك، اتأكد إنك مش في وضع التصفح الخفي',
    need_start: 'صورة النهاية لوحدها محتاجة فيديو 10 ثواني أو أكتر، أو ضيف صورة بداية',
    busy: 'الخدمة مشغولة دلوقتي، جرب تاني بعد ثواني',
    plan_invalid: 'الباقة دي مش متاحة دلوقتي',
    credits_invalid: 'عدد الكريديت مش مسموح',
    code_invalid: 'الكود ده مش صحيح',
    code_expired: 'الكود ده انتهت صلاحيته',
    code_used_up: 'الكود ده خلص عدد استخداماته',
    code_not_applicable: 'الكود ده مش شغال على الطلب ده',
    too_many_pending: 'عندك طلبات لسه مستنية الموافقة، استنى لما تتراجع',
    shop_closed: 'الشراء متوقف مؤقتاً',
    gift_invalid: 'كود الهدية مش صحيح',
    gift_used: 'إنت استخدمت الكود ده قبل كده'
  };
  const S = window.SirbStore;
  const urls = new Map();
  const urlOf = img => { if (!img.blob) return img.url || ''; if (!urls.has(img.id)) urls.set(img.id, URL.createObjectURL(img.blob)); return urls.get(img.id); };
  const fmt = t => new Date(t).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' });
  const usd = n => '$' + (Number(n) || 0).toFixed(2);
  const frame = () => new Promise(r => requestAnimationFrame(() => r()));
  async function stream(items, make, put, alive) {
    for (let k = 0; k < items.length; k += 6) {
      if (alive && !alive()) return;
      const f = document.createDocumentFragment();
      items.slice(k, k + 6).forEach((x, j) => { const n = make(x); if (!n) return; n.classList.add('rise'); n.style.setProperty('--d', Math.min(k + j, 14) * 45 + 'ms'); f.append(n); });
      put(f);
      if (k + 6 < items.length) await frame();
    }
  }
  function fadeMedia(m) {
    m.classList.add('fade');
    const on = () => m.classList.add('in');
    if (m.tagName === 'IMG') { if (m.complete && m.naturalWidth) on(); else { m.addEventListener('load', on, { once: true }); m.addEventListener('error', on, { once: true }); } }
    else { m.addEventListener('loadeddata', on, { once: true }); m.addEventListener('error', on, { once: true }); setTimeout(on, 1500); }
    return m;
  }

  function toast(t, type) { window.SirbUI.toast(t, type || 'info'); }
  const LOG = window.SirbUI.log;

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
    a.href = urlOf(img); a.download = 'sirb-' + img.seed + (img.kind === 'video' ? '.mp4' : '.jpg');
    if (!img.blob) { a.target = '_blank'; a.rel = 'noopener'; }
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
    const { session, logout, api, cached } = window.SirbApi;
    document.body.classList.add('booting');
    $('shell').hidden = false;
    const early = cached();
    const user = early && early.wallet ? early : await session();
    if (!user) { location.replace('../log/one.html'); return; }
    function fillUser() {
      $('uName').textContent = user.name;
      $('uEmail').textContent = user.email || '';
      $('pEmail').textContent = user.email || '';
      $('uCode').textContent = user.inviteCode;
      $('pCode').textContent = user.inviteCode;
      document.querySelectorAll('[data-user-name]').forEach(e => { e.textContent = user.name; });
      document.querySelectorAll('[data-plan-name]').forEach(e => { e.textContent = user.planName || 'Free'; e.classList.toggle('pro', (user.plan || 'free') !== 'free'); });
      const pu = $('pUntil'); if (pu) pu.textContent = user.planUntil ? new Date(user.planUntil).toLocaleDateString('ar-EG', { dateStyle: 'medium' }) : '-';
    }
    fillUser();
    const num = n => Number(n || 0).toLocaleString('en-US');
    function usage() {
      const w = user.wallet || { total: 0, credits: 0, bonus: 0, grant: 0 };
      $('uCredits').textContent = num(w.total);
      $('useVal').textContent = num(w.total);
      const renew = w.renew || 0;
      $('useBar').style.width = renew ? Math.min(100, w.credits / renew * 100) + '%' : '0%';
      const next = w.nextAt ? new Date(w.nextAt).toLocaleString('ar-EG', { weekday: 'long', hour: 'numeric', minute: '2-digit' }) : '';
      $('useNote').textContent = 'رصيد متجدد ' + num(w.credits) + ' من ' + num(renew) + ' · رصيد ثابت ' + num(w.bonus) + (next ? '. التجديد الجاي ' + next + ' (كل ' + (w.renewHours || 12) + ' ساعة بيرجع ' + num(renew) + ')، والرصيد الثابت مبيخلصش.' : '');
      $('quota').textContent = 'رصيدك ' + num(w.total);
      try { updateCost(); } catch (e) {}
    }
    function setTotal(t) { if (typeof t === 'number' && user.wallet) { const diff = t - user.wallet.total; user.wallet.total = t; user.wallet.credits = Math.max(0, user.wallet.credits + diff); usage(); } }
    let PR = {};
    function renderPrices() {
      PR = Object.assign({ image: 2, image_pro: 6, ref: 1, video_sec: 8, invite_bonus: 0 }, user.pricing || {});
      const pl = $('priceList'); pl.textContent = '';
      [['صورة عادية', PR.image], ['صورة Pro', PR.image_pro], ['كل صورة مرجعية', PR.ref], ['كل ثانية فيديو', PR.video_sec], ['مكافأة كل دعوة', PR.invite_bonus]].forEach(([k, v]) => {
        if (!v) return;
        const d = el('div'); d.append(el('span', '', k), el('b', '', String(v))); pl.append(d);
      });
    }
    renderPrices();
    const ACT = { image: 'صورة عادية', image_pro: 'صورة Pro', video: 'فيديو', refund: 'استرجاع', invite: 'مكافأة دعوة', signup: 'هدية الحساب الجديد', renew: 'تجديد الرصيد', renew_plan: 'رصيد الباقة الجديدة', renew_first: 'بداية التجديد', buy_credits: 'شراء كريديت', buy_plan: 'تفعيل باقة', plan_credits: 'كريديت الباقة', gift: 'كود هدية', gift_plan: 'باقة هدية', admin_adjust: 'تعديل من الإدارة', admin_create: 'رصيد من الإدارة' };
    async function loadLedger() {
      try {
        const r = await api('/ledger', {});
        if (!r.data || !r.data.ok || !Array.isArray(r.data.items)) return;
        const box = $('ledger'); box.textContent = '';
        if (!r.data.items.length) { box.append(el('span', 'hint', 'مفيش حركات لسه')); return; }
        await stream(r.data.items, it => {
          const row = el('div');
          const name = ACT[it.action] || it.action;
          const left = el('span', '', name + (it.status === 'refunded' ? ' · اترجع' : it.status === 'held' ? ' · جاري' : ''));
          row.append(left, el('small', '', fmt(it.t)), el('span', it.credits >= 0 ? 'plus' : 'minus', (it.credits > 0 ? '+' : '') + it.credits));
          return row;
        }, f => box.append(f));
      } catch (e) {}
    }
    usage();
    let SHOP = null;
    function renderPlans(list) {
      const box = $('plans');
      box.textContent = '';
      stream(list, p => {
        const cur = p.id === (user.plan || 'free');
        const card = el('article', 'plan-box' + (p.highlight ? ' hot' : '') + (cur ? ' current' : ''));
        const head = el('div', 'plan-top');
        head.append(svg(p.id === 'free' ? 'spark' : 'crown'), el('h3', 'en', p.name));
        if (p.highlight) head.append(el('span', 'tag', 'الأفضل'));
        const price = el('p', 'price');
        price.append(el('strong', 'en', '$' + (p.price ? String(p.price) : '0')), el('em', '', p.period ? ' / ' + p.period : ''));
        const ul = el('ul', 'checks');
        p.features.forEach(t => { const li = el('li'); li.append(svg('check'), el('span', '', t)); ul.append(li); });
        const paid = p.id !== 'free' && p.price > 0;
        const btn = el('button', 'btn' + (cur || !paid ? ' ghost' : ''), !paid ? (cur ? 'خطتك الحالية' : 'مجانية') : cur ? 'جدد اشتراكك' : 'اشترك بـ $' + p.price);
        btn.type = 'button'; btn.disabled = !paid;
        if (paid) btn.addEventListener('click', () => openBuy('plan', p.id));
        card.append(head, price, ul, btn);
        return card;
      }, f => box.append(f));
    }
    function loadPlans() { return api('/plans', {}).then(r => { if (r.data && r.data.ok && Array.isArray(r.data.plans)) renderPlans(r.data.plans); }).catch(() => {}); }
    loadPlans();

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
      const tok = ++chatsTok;
      const [chats, imgs] = await Promise.all([S.chats(), S.allImages()]);
      if (tok !== chatsTok) return chats;
      const count = new Map();
      imgs.forEach(i => count.set(i.chatId, (count.get(i.chatId) || 0) + 1));
      const q = filter.trim().toLowerCase();
      const shown = q ? chats.filter(c => c.title.toLowerCase().includes(q) || imgs.some(i => i.chatId === c.id && String(i.prompt).toLowerCase().includes(q))) : chats;
      list.textContent = '';
      if (!shown.length) list.append(el('span', 'chat-none', chats.length ? 'مفيش نتايج' : 'السجل فاضي'));
      const items = [];
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
        items.push(b);
      });
      await stream(items, n => n, f => list.append(f), () => tok === chatsTok);
      return chats;
    }

    let threadTok = 0, chatsTok = 0, libTok = 0;
    async function renderThread() {
      const tok = ++threadTok;
      const th = $('thread');
      const chat = chatId ? await S.chat(chatId) : null;
      if (tok !== threadTok) return;
      th.querySelectorAll('.turn').forEach(n => n.remove());
      $('chatTitle').textContent = chat ? chat.title : '';
      const imgs = chat ? await S.imagesOf(chatId) : [];
      if (tok !== threadTok) return;
      $('emptyState').hidden = imgs.length > 0;
      const mine = jobs().filter(j => j.chatId === chatId);
      if (mine.length) $('emptyState').hidden = true;
      mine.forEach(j => th.append(pendingTurn(j)));
      for (let end = imgs.length, k = 0; end > 0; end -= 6, k++) {
        if (tok !== threadTok) return;
        const f = document.createDocumentFragment();
        imgs.slice(Math.max(0, end - 6), end).forEach((x, j) => { const n = turn(x); n.classList.add('rise'); n.style.setProperty('--d', (k ? 0 : j * 45) + 'ms'); f.append(n); });
        const keep = th.scrollHeight - th.scrollTop;
        th.insertBefore(f, th.querySelector('.turn'));
        th.scrollTop = k ? th.scrollHeight - keep : th.scrollHeight;
        await frame();
      }
    }

    function media(i) {
      if (i.kind === 'video') {
        const v = el('video'); v.src = urlOf(i); v.controls = true; v.playsInline = true; v.preload = 'metadata'; v.loop = true;
        return fadeMedia(v);
      }
      const im = el('img'); im.src = urlOf(i); im.alt = i.prompt; im.loading = 'lazy'; im.decoding = 'async';
      return fadeMedia(im);
    }
    function turn(i) {
      const t = el('article', 'turn');
      const q = el('p', 'turn-prompt', i.prompt);
      const meta = el('span', 'turn-meta', (i.styleName ? i.styleName + ' · ' : '') + fmt(i.t));
      if (i.mode === 'pro' || i.kind === 'video') meta.append(el('span', 'turn-badge', i.kind === 'video' ? 'VIDEO ' + (i.seconds || '') + 's' : 'PRO'));
      t.append(q, meta);
      if (i.refs && i.refs.length) {
        const rr = el('div', 'turn-refs');
        i.refs.forEach(src => { const m = el('img'); m.src = src; m.alt = ''; rr.append(m); });
        t.append(rr);
      }
      const acts = el('div', 'turn-acts');
      const d = el('button', 'icon-btn'); d.type = 'button'; d.setAttribute('aria-label', 'تحميل'); d.append(svg('download'));
      d.addEventListener('click', () => download(i));
      const e = el('button', 'icon-btn'); e.type = 'button'; e.setAttribute('aria-label', 'تعديل الوصف'); e.append(svg('prompt'));
      e.addEventListener('click', () => { $('prompt').value = i.prompt; $('prompt').dispatchEvent(new Event('input')); $('prompt').focus(); });
      acts.append(d, e);
      if (i.kind !== 'video' && i.blob) {
        const rf = el('button', 'icon-btn'); rf.type = 'button'; rf.setAttribute('aria-label', 'استخدمها كمرجع'); rf.title = 'عدّل على الصورة دي'; rf.append(svg('ref'));
        rf.addEventListener('click', () => addRefBlob(i.blob).then(ok => { if (ok) toast(kind === 'video' ? 'الصورة اتضافت كصورة للفيديو' : 'الصورة اتضافت كمرجع، اكتب التعديل اللي عايزه', 'ok'); $('prompt').focus(); }));
        acts.append(rf);
      }
      t.append(media(i), acts);
      return t;
    }
    function pendingTurn(j) {
      const t = el('article', 'turn pending');
      t.dataset.job = j.id;
      t.append(el('p', 'turn-prompt', j.prompt));
      const meta = el('span', 'turn-meta', (j.styleName ? j.styleName + ' · ' : '') + fmt(j.t));
      meta.append(el('span', 'turn-badge', 'VIDEO ' + j.seconds + 's'));
      const w = el('div', 'wait'); w.append(el('i'), el('span', '', j.note || jobNote(j, {})));
      t.append(meta, w);
      return t;
    }

    async function renderLibrary() {
      const grid = $('grid');
      const tok = ++libTok;
      const [imgs, chats] = await Promise.all([S.allImages(), S.chats()]);
      if (tok !== libTok) return;
      const names = new Map(chats.map(c => [c.id, c.title]));
      grid.textContent = '';
      $('libraryEmpty').hidden = imgs.length > 0;
      $('libCount').textContent = imgs.length ? imgs.length + ' عمل' : '';
      await stream(imgs, i => {
        const fig = el('figure');
        const im = media(i); if (i.kind === 'video') { im.controls = false; im.muted = true; im.addEventListener('mouseenter', () => im.play().catch(() => {})); im.addEventListener('mouseleave', () => im.pause()); }
        const cap = el('figcaption');
        cap.append(el('p', 'cap-prompt', i.prompt));
        const go = el('a', 'cap-chat'); go.href = '#studio/' + i.chatId;
        go.append(svg('history'), el('span', '', names.get(i.chatId) || 'محادثة'));
        cap.append(go);
        const d = el('button', 'icon-btn dl'); d.type = 'button'; d.setAttribute('aria-label', 'تحميل'); d.append(svg('download'));
        d.addEventListener('click', () => download(i));
        fig.append(im, cap, d);
        return fig;
      }, f => grid.append(f), () => tok === libTok);
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
      if (view === 'wallet') { loadLedger(); loadOrders(); }
    }

    try { await show(); } catch (e) { toast(ERR.storage, 'err'); LOG('IndexedDB unavailable'); }
    window.addEventListener('hashchange', () => show().catch(e => { toast(ERR.storage, 'err'); LOG('render failed', e); }));

    const inviteUrl = () => { const u = new URL('../log/one.html', location.href); u.search = '?invite=' + encodeURIComponent(user.inviteCode); return u.toString(); };
    const copy = async (text, ok) => { try { await navigator.clipboard.writeText(text); toast(ok, 'ok'); } catch (e) { toast(text, 'info'); } };
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

    function jobs() { try { const a = JSON.parse(localStorage.getItem('sirb-jobs') || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
    function saveJobs(a) { try { localStorage.setItem('sirb-jobs', JSON.stringify(a.slice(-10))); } catch (e) {} }

    let mode = 'normal', kind = 'image', seconds = 5, aspect = '16:9';
    let refs = [];
    const frames = { start: null, end: null };
    const canPro = () => user.proMode === true;
    const maxRefs = () => mode === 'pro' ? Math.max(1, Math.min(4, Number(user.maxRefs) || 4)) : 1;
    const refSide = () => mode === 'pro' && kind === 'image' ? 512 : 1024;
    const frameCount = () => (frames.start ? 1 : 0) + (frames.end ? 1 : 0);

    function updateCost() {
      const c = kind === 'video' ? seconds * PR.video_sec + frameCount() * PR.ref : (mode === 'pro' ? PR.image_pro : PR.image) + refs.length * PR.ref;
      $('costVal').textContent = String(c);
      const w = user.wallet ? user.wallet.total : 0;
      $('genBtn').classList.toggle('short', w < c);
      return c;
    }

    function renderRefs() {
      const row = $('refs');
      row.querySelectorAll('.ref').forEach(n => n.remove());
      refs.forEach((r, k) => {
        const box = el('div', 'ref rise');
        const im = el('img'); im.src = r.thumb; im.alt = 'صورة مرجعية ' + (k + 1);
        const x = el('button'); x.type = 'button'; x.setAttribute('aria-label', 'إزالة'); x.append(svg('x'));
        x.addEventListener('click', () => { refs.splice(k, 1); renderRefs(); });
        box.append(im, el('span', 'n', String(k + 1)), x);
        row.insertBefore(box, $('refAdd'));
      });
      $('refAdd').classList.toggle('full', refs.length >= maxRefs());
      $('refsHint').textContent = refs.length + ' / ' + maxRefs() + (refs.length ? (refs.length > 1 ? ' · اكتب مثلاً: حط الشخص من صورة 1 في مكان صورة 2' : ' · اكتب التعديل اللي عايزه أو "زي الصورة دي"') : '');
      updateCost();
    }

    function renderFrames() {
      document.querySelectorAll('.frame-slot').forEach(slot => {
        const k = slot.dataset.slot, f = frames[k];
        slot.querySelectorAll('.fs-img').forEach(n => n.remove());
        slot.classList.toggle('filled', !!f);
        if (f) {
          const w = el('span', 'fs-img');
          const im = el('img'); im.src = f.thumb; im.alt = k === 'start' ? 'صورة البداية' : 'صورة النهاية';
          const x = el('button'); x.type = 'button'; x.setAttribute('aria-label', 'إزالة'); x.append(svg('x'));
          x.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); frames[k] = null; renderFrames(); });
          w.append(im, el('small', '', k === 'start' ? 'البداية' : 'النهاية'), x);
          slot.append(w);
        }
      });
      const n = frameCount();
      $('framesHint').textContent = n ? n + ' صورة · ' + n * PR.ref + ' كريديت' : 'اختياري · كل صورة ' + PR.ref + ' كريديت';
      updateCost();
    }

    async function shrink(blob, side, q) {
      let src;
      try { src = await createImageBitmap(blob); }
      catch (e) {
        src = await new Promise((res, rej) => { const u = URL.createObjectURL(blob); const im = new Image(); im.onload = () => { URL.revokeObjectURL(u); res(im); }; im.onerror = () => { URL.revokeObjectURL(u); rej(e); }; im.src = u; });
      }
      const w = src.width, h = src.height;
      const k = Math.min(1, side / Math.max(w, h));
      const cv = document.createElement('canvas');
      cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
      cv.getContext('2d').drawImage(src, 0, 0, cv.width, cv.height);
      return cv.toDataURL('image/jpeg', q);
    }

    function okBlob(blob) {
      if (!blob || !/^image\/(png|jpeg|webp)$/.test(blob.type)) { toast('الصورة لازم تكون PNG أو JPG أو WEBP', 'warn'); return false; }
      if (blob.size > 15 * 1024 * 1024) { toast('الصورة أكبر من 15 ميجا', 'warn'); return false; }
      return true;
    }
    async function setFrame(k, blob) {
      if (!okBlob(blob)) return false;
      try { frames[k] = { blob, data: await shrink(blob, 1024, .88), thumb: await shrink(blob, 200, .75) }; renderFrames(); return true; }
      catch (e) { toast('مقدرتش أقرا الصورة دي', 'err'); return false; }
    }
    async function addRefBlob(blob) {
      if (kind === 'video') return setFrame(!frames.start ? 'start' : 'end', blob);
      if (!okBlob(blob)) return false;
      if (refs.length >= maxRefs()) { if (maxRefs() === 1) refs = []; else { toast('أقصى عدد ' + maxRefs() + ' صور', 'warn'); return false; } }
      try {
        refs.push({ blob, data: await shrink(blob, refSide(), .9), thumb: await shrink(blob, 120, .7) });
        renderRefs();
        return true;
      } catch (e) { toast('مقدرتش أقرا الصورة دي', 'err'); return false; }
    }

    async function rebuildRefs() {
      refs = refs.slice(0, maxRefs());
      for (const r of refs) { try { r.data = await shrink(r.blob, refSide(), .9); } catch (e) {} }
      renderRefs();
    }

    $('refFile').addEventListener('change', async e => {
      for (const f of [...e.target.files]) await addRefBlob(f);
      e.target.value = '';
    });
    document.querySelectorAll('.frame-slot').forEach(slot => {
      const inp = slot.querySelector('input');
      inp.addEventListener('change', async () => { if (inp.files[0]) await setFrame(slot.dataset.slot, inp.files[0]); inp.value = ''; });
      ['dragenter', 'dragover'].forEach(t => slot.addEventListener(t, e => { e.preventDefault(); slot.classList.add('drag'); }));
      ['dragleave', 'drop'].forEach(t => slot.addEventListener(t, () => slot.classList.remove('drag')));
      slot.addEventListener('drop', async e => { e.preventDefault(); const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) await setFrame(slot.dataset.slot, f); });
    });
    const rb = $('refsBox');
    ['dragenter', 'dragover'].forEach(t => rb.addEventListener(t, e => { e.preventDefault(); rb.classList.add('drag'); }));
    ['dragleave', 'drop'].forEach(t => rb.addEventListener(t, () => rb.classList.remove('drag')));
    rb.addEventListener('drop', async e => { e.preventDefault(); for (const f of [...(e.dataTransfer && e.dataTransfer.files || [])]) await addRefBlob(f); });
    prompt.addEventListener('paste', async e => {
      const f = [...(e.clipboardData && e.clipboardData.files || [])].find(x => /^image\//.test(x.type));
      if (f) { e.preventDefault(); await addRefBlob(f); }
    });

    function renderDurs() {
      const durs = $('durs');
      durs.textContent = '';
      const maxSec = Math.max(5, Math.min(30, Math.floor((Number(user.videoMaxSec) || 30) / 5) * 5));
      if (seconds > maxSec) seconds = maxSec;
      for (let d = 5; d <= maxSec; d += 5) {
        const b = el('button', 'pill en' + (d === seconds ? ' active' : ''), d + 's'); b.type = 'button';
        b.addEventListener('click', () => { seconds = d; durs.querySelectorAll('.pill').forEach(x => x.classList.toggle('active', x === b)); $('durNote').textContent = durNote(); updateCost(); });
        durs.append(b);
      }
      $('durNote').textContent = durNote();
    }
    const durNote = () => seconds > 5 ? 'هيتعمل على ' + seconds / 5 + ' أجزاء كل جزء 5 ثواني، وكل جزء بيكمل من آخر لقطة في اللي قبله، وبعدين بندمجهم في فيديو واحد' : 'فيديو واحد 5 ثواني';

    function syncUi() {
      if (mode === 'pro' && !canPro()) { mode = 'normal'; kind = 'image'; }
      document.querySelectorAll('.mode').forEach(b => {
        const on = b.dataset.mode === mode;
        b.classList.toggle('active', on); b.setAttribute('aria-checked', on ? 'true' : 'false');
        if (b.dataset.mode === 'pro') b.classList.toggle('locked', !canPro());
      });
      $('kinds').hidden = mode !== 'pro';
      document.querySelectorAll('#kinds .pill').forEach(b => b.classList.toggle('active', b.dataset.kind === kind));
      $('vidOpts').hidden = kind !== 'video';
      $('framesBox').hidden = kind !== 'video';
      $('refsBox').hidden = kind === 'video';
      $('promptLabel').textContent = kind === 'video' ? 'وصف الفيديو' : 'وصف الصورة';
      $('genLabel').textContent = kind === 'video' ? 'إنشاء الفيديو' : 'إنشاء الصورة';
      prompt.placeholder = kind === 'video' ? 'مثال: كاميرا بتلف حوالين قلعة فوق جبل وقت الغروب، سحاب بيتحرك' : 'مثال: مدينة مستقبلية فوق السحاب وقت الغروب، إضاءة سينمائية';
      renderFrames();
      rebuildRefs();
    }
    document.querySelectorAll('.mode').forEach(b => b.addEventListener('click', () => {
      if (b.dataset.mode === 'pro' && !canPro()) { toast(ERR.pro_required, 'warn'); location.hash = '#wallet'; return; }
      mode = b.dataset.mode;
      if (mode === 'normal') kind = 'image';
      syncUi();
    }));
    document.querySelectorAll('#kinds .pill').forEach(b => b.addEventListener('click', () => { kind = b.dataset.kind; syncUi(); }));
    document.querySelectorAll('#aspects .pill').forEach(b => b.addEventListener('click', () => { aspect = b.dataset.a; document.querySelectorAll('#aspects .pill').forEach(x => x.classList.toggle('active', x === b)); }));
    renderDurs();
    syncUi();

    async function refreshUser() {
      const u = await session(true);
      if (!u) { location.replace('../log/one.html'); return; }
      Object.assign(user, u);
      fillUser(); renderPrices(); usage(); renderDurs(); syncUi();
      document.body.classList.remove('booting');
    }
    if (user === early) refreshUser().then(() => loadPlans()).catch(() => document.body.classList.remove('booting'));
    else document.body.classList.remove('booting');

    async function historyOf(id) {
      if (!id) return [];
      try { return (await S.imagesOf(id)).slice(-4).map(i => i.prompt); } catch (e) { return []; }
    }

    function jobNote(j, d) {
      if (typeof d.position === 'number' && d.position > 0) return 'في الطابور، قبلك ' + d.position + '...';
      if (d.phase === 'merge') return 'خلصنا كل الأجزاء، بندمجهم في فيديو واحد دلوقتي...';
      const parts = d.parts || j.parts || 1;
      if (parts > 1) return 'بنعمل الجزء ' + (d.part || 1) + ' من ' + parts + '... ممكن ياخد كام دقيقة. تقدر تقفل الصفحة وترجع';
      return 'الفيديو بيتعمل دلوقتي، ممكن ياخد كام دقيقة. تقدر تقفل الصفحة وترجع';
    }

    let polling = false;
    async function pollJobs() {
      if (polling) return;
      polling = true;
      try {
        while (jobs().length) {
          for (const j of jobs()) {
            let r;
            try { r = await api('/video-status', j.end ? { job: j.job, end: j.end } : { job: j.job }); } catch (e) { continue; }
            if (r.status === 401) return;
            const d = r.data || {};
            if (!d.ok) { if (r.status === 400) saveJobs(jobs().filter(x => x.id !== j.id)); continue; }
            if (d.state === 'running') {
              if (typeof d.job === 'string') saveJobs(jobs().map(x => x.id === j.id ? Object.assign(x, { job: d.job, part: d.part, phase: d.phase }) : x));
              const n = document.querySelector('.turn[data-job="' + j.id + '"] .wait span');
              if (n) n.textContent = jobNote(j, d);
              continue;
            }
            saveJobs(jobs().filter(x => x.id !== j.id));
            if (d.state === 'failed') {
              if (typeof d.total === 'number') setTotal(d.total);
              toast('الفيديو منجحش، والكريديت رجعلك', 'err'); LOG('video job failed', d.reason || '');
            } else if (d.state === 'done' && typeof d.url === 'string') {
              let blob = null;
              try { const v = await fetch(d.url, { mode: 'cors', credentials: 'omit', referrerPolicy: 'no-referrer' }); if (v.ok) blob = await v.blob(); } catch (e) {}
              let cid = j.chatId;
              try {
                if (!cid || !(await S.chat(cid))) cid = (await S.createChat(j.prompt)).id;
                await S.addVideo(cid, blob, d.url, { prompt: j.prompt, style: j.style, styleName: j.styleName, model: 'wan-2.2', seconds: j.seconds, refs: j.refs });
                await S.touchChat(cid);
              } catch (e) { toast(ERR.storage, 'err'); LOG('save video failed', e); }
              toast('الفيديو جاهز ومتسجل على جهازك', 'ok');
            }
            const v = parseHash();
            if (v.view === 'studio') { await renderChats(); await renderThread(); }
            if (v.view === 'library') await renderLibrary();
          }
          await new Promise(r => setTimeout(r, 6000));
        }
      } finally { polling = false; }
    }
    pollJobs();

    let busy = false;
    $('genForm').addEventListener('submit', async e => {
      e.preventDefault();
      if (busy) return;
      const text = prompt.value.trim();
      const msg = $('genMsg');
      if (text.length < 3) { SirbUI.msg(msg, ERR.prompt_short, 'error'); prompt.focus(); return; }
      if (kind === 'video' && frames.end && !frames.start && seconds === 5) { SirbUI.msg(msg, ERR.need_start, 'error'); return; }
      const cost = updateCost();
      if (user.wallet && user.wallet.total < cost) { SirbUI.msg(msg, ERR.no_credits + ' (محتاج ' + cost + '، معاك ' + user.wallet.total + ')', 'error'); return; }
      busy = true;
      SirbUI.msg(msg, '');
      $('genBtn').disabled = true; $('loading').hidden = false; stages(true);
      const ex = extra();
      const style = ex.text, styleName = ex.names;
      const history = await historyOf(chatId);
      try {
        if (kind === 'video') {
          const thumbs = [frames.start, frames.end].filter(Boolean).map(f => f.thumb);
          const r = await api('/video', { prompt: text, extra: style, start: frames.start ? frames.start.data : '', end: frames.end ? frames.end.data : '', seconds, aspect, history });
          if (r.status === 401) { location.replace('../log/one.html'); return; }
          if (!r.data || !r.data.ok || typeof r.data.job !== 'string') {
            if (r.data && r.data.reason) LOG('/video ' + (r.data.error || '') + ' | ' + r.data.reason);
            if (r.data && typeof r.data.total === 'number') setTotal(r.data.total);
            if (r.data && r.data.wallet) { user.wallet = r.data.wallet; usage(); }
            throw new Error(r.status === 413 ? 'size' : (r.data && r.data.error) || 'ai_failed');
          }
          let id = chatId;
          try { if (!id || !(await S.chat(id))) id = (await S.createChat(text)).id; await S.touchChat(id); } catch (err) { throw new Error('storage'); }
          let endKeep = '';
          if (frames.end && seconds > 5) { try { endKeep = await shrink(frames.end.blob, 768, .85); } catch (err) { endKeep = frames.end.data; } }
          saveJobs(jobs().concat([{ id: S.uid(), job: r.data.job, chatId: id, prompt: text, style, styleName, seconds, parts: r.data.parts || seconds / 5, end: endKeep, refs: thumbs, t: Date.now() }]));
          if (r.data.wallet) { user.wallet = r.data.wallet; usage(); }
          SirbUI.msg(msg, 'بدأنا نعمل الفيديو، هيظهر هنا أول ما يخلص', 'success');
          frames.start = null; frames.end = null; renderFrames();
          if (id !== chatId) { chatId = id; location.hash = '#studio/' + id; } else { await renderChats(); await renderThread(); }
          pollJobs();
          return;
        }
        const sentRefs = refs.map(r => r.data);
        const thumbs = refs.map(r => r.thumb);
        const r = await api('/generate', { prompt: text, extra: style, mode, refs: sentRefs, history });
        if (r.status === 401) { location.replace('../log/one.html'); return; }
        if (!r.data || !r.data.ok || typeof r.data.image !== 'string' || !r.data.image.startsWith('data:image/')) {
          if (r.data && r.data.reason) LOG('/generate ' + (r.data.error || '') + ' | ' + r.data.reason);
          if (r.data && typeof r.data.total === 'number') setTotal(r.data.total);
          if (r.data && r.data.wallet) { user.wallet = r.data.wallet; usage(); }
          throw new Error(r.status === 413 ? 'size' : (r.data && r.data.error) || 'ai_failed');
        }
        let id = chatId;
        try {
          if (!id || !(await S.chat(id))) id = (await S.createChat(text)).id;
          await S.addImage(id, r.data.image, { prompt: text, style, styleName, model: r.data.model, seed: r.data.seed, refs: thumbs, mode });
          await S.touchChat(id);
        } catch (err) { throw new Error('storage'); }
        if (r.data.wallet) { user.wallet = r.data.wallet; usage(); }
        SirbUI.msg(msg, 'الصورة اتعملت واتحفظت على جهازك', 'success');
        refs = []; renderRefs();
        if (id !== chatId) { chatId = id; location.hash = '#studio/' + id; }
        else { await renderChats(); await renderThread(); }
      } catch (err) {
        const k = err && err.name === 'AbortError' ? 'ai_failed' : err && err.message;
        if (!ERR[k]) LOG('generate failed', err);
        SirbUI.msg(msg, (ERR[k] || 'تعذر الاتصال، اتأكد من الإنترنت وجرب تاني') + (k === 'ai_failed' || k === 'ai_quota' || k === 'fal_config' || k === 'ai_config' ? '. الكريديت رجعلك' : ''), 'error');
      } finally {
        busy = false;
        stages(false); $('genBtn').disabled = false; $('loading').hidden = true;
      }
    });

    // ---------- shop ----------
    const dlg = $('buyDlg');
    const buy = { kind: 'plan', plan: '', credits: 0, code: '', quote: null };
    function step(name) { dlg.querySelectorAll('.step').forEach(s => { s.hidden = s.dataset.step !== name; }); }
    async function loadShop() {
      if (SHOP) return SHOP;
      const r = await api('/shop', {});
      if (!r.data || !r.data.ok) throw new Error((r.data && r.data.error) || 'server');
      SHOP = r.data;
      ['egName', 'egName2', 'egName3'].forEach(i => { $(i).textContent = SHOP.egypt.name || 'MC_Ai'; });
      $('egLink').href = SHOP.egypt.url || '#';
      return SHOP;
    }
    function subtotal() {
      if (!SHOP) return 0;
      if (buy.kind === 'plan') { const p = SHOP.plans.find(x => x.id === buy.plan); return p ? p.price : 0; }
      const c = SHOP.credit;
      return buy.credits >= c.min && buy.credits % c.step === 0 && buy.credits <= c.max ? Math.round(buy.credits / c.min * c.minPrice * 100) / 100 : 0;
    }
    function renderSum() {
      const sub = subtotal();
      const disc = buy.quote ? Math.min(buy.quote.discount, sub) : 0;
      $('sumSub').textContent = usd(sub);
      $('sumDisc').textContent = '-' + usd(disc);
      $('sumDisc').parentElement.hidden = !disc;
      $('sumTot').textContent = usd(Math.max(0, sub - disc));
      $('buyConfirm').disabled = !sub;
    }
    function renderBuy() {
      dlg.querySelectorAll('[data-buy]').forEach(b => b.classList.toggle('active', b.dataset.buy === buy.kind));
      $('buyPlanBox').hidden = buy.kind !== 'plan';
      $('buyCreditsBox').hidden = buy.kind !== 'credits';
      const box = $('buyPlanBox'); box.textContent = '';
      if (!SHOP.plans.length) box.append(el('p', 'hint', 'مفيش باقات متاحة للشراء دلوقتي'));
      SHOP.plans.forEach(p => {
        const b = el('button', 'buy-opt' + (p.id === buy.plan ? ' active' : ''));
        b.type = 'button';
        const t = el('span', 'buy-opt-t'); t.append(el('b', 'en', p.name), el('small', '', (p.days ? p.days + ' يوم' : p.period) + ' · ' + p.join + ' كريديت مع الاشتراك + ' + p.renew + ' كل ' + p.renewHours + ' ساعة'));
        b.append(svg('crown'), t, el('strong', 'en', usd(p.price)));
        b.addEventListener('click', () => { buy.plan = p.id; requote(); renderBuy(); });
        box.append(b);
      });
      const c = SHOP.credit;
      $('creditHint').textContent = 'أقل حاجة ' + c.min + ' كريديت بـ ' + usd(c.minPrice) + '، والشراء بمضاعفات ' + c.step;
      renderSum();
    }
    async function requote() {
      buy.quote = null;
      if (!buy.code) { renderSum(); return; }
      SirbUI.msg($('discMsg'), 'بنراجع الكود...', 'info');
      try {
        const r = await api('/quote', { kind: buy.kind, plan: buy.plan, credits: buy.credits, code: buy.code });
        if (r.data && r.data.ok) { buy.quote = r.data; SirbUI.msg($('discMsg'), 'الكود اتطبق: خصم ' + usd(r.data.discount), 'success'); }
        else { SirbUI.msg($('discMsg'), ERR[r.data && r.data.error] || ERR.code_invalid, 'error'); buy.code = ''; }
      } catch (e) { SirbUI.msg($('discMsg'), 'تعذر الاتصال، جرب تاني', 'error'); }
      renderSum();
    }
    async function openBuy(k, planId) {
      try { await loadShop(); } catch (e) { toast(ERR.server, 'err'); return; }
      if (!SHOP.open) { toast(ERR.shop_closed, 'warn'); return; }
      buy.kind = k || 'plan';
      buy.plan = planId || (SHOP.plans.find(p => p.highlight) || SHOP.plans[0] || {}).id || '';
      buy.credits = buy.credits || SHOP.credit.min;
      buy.code = ''; buy.quote = null;
      $('discCode').value = ''; SirbUI.msg($('discMsg'), ''); SirbUI.msg($('buyMsg'), '');
      const q = $('creditQty'); q.min = SHOP.credit.min; q.step = SHOP.credit.step; q.max = SHOP.credit.max; q.value = buy.credits;
      const chips = $('creditChips'); chips.textContent = '';
      [1, 2, 5, 10, 20].map(m => SHOP.credit.min * m).filter(n => n <= SHOP.credit.max).forEach(n => {
        const b = el('button', 'pill en', n + ''); b.type = 'button';
        b.addEventListener('click', () => { q.value = n; q.dispatchEvent(new Event('input')); });
        chips.append(b);
      });
      renderBuy();
      step('region');
      if (!dlg.open) dlg.showModal();
    }
    $('buyCredits').addEventListener('click', () => openBuy('credits'));
    $('buyPlan').addEventListener('click', () => openBuy('plan', 'pro'));
    dlg.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => dlg.close()));
    dlg.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => step('region')));
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    $('regEg').addEventListener('click', () => {
      step('egypt');
      toast('ادخل على موقع ' + (SHOP.egypt.name || 'MC_Ai') + ' عشان تشحن من خلالهم', 'info');
      if (SHOP.egypt.url) window.open(SHOP.egypt.url, '_blank', 'noopener,noreferrer');
    });
    $('regWorld').addEventListener('click', () => { step('world'); renderBuy(); });
    dlg.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => { buy.kind = b.dataset.buy; requote(); renderBuy(); }));
    let qT;
    $('creditQty').addEventListener('input', e => {
      buy.credits = Math.floor(Number(e.target.value) || 0);
      $('creditChips').querySelectorAll('.pill').forEach(p => p.classList.toggle('active', Number(p.textContent) === buy.credits));
      renderSum();
      clearTimeout(qT); if (buy.code) qT = setTimeout(requote, 500);
    });
    $('discApply').addEventListener('click', () => { buy.code = $('discCode').value.trim().toUpperCase(); requote(); });
    $('discCode').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('discApply').click(); } });
    $('buyConfirm').addEventListener('click', async () => {
      const bm = $('buyMsg');
      if (buy.kind === 'credits' && !subtotal()) { SirbUI.msg(bm, ERR.credits_invalid + ' (' + $('creditHint').textContent + ')', 'error'); return; }
      $('buyConfirm').disabled = true;
      SirbUI.msg(bm, 'بنسجل طلبك...', 'info');
      try {
        const r = await api('/order', { kind: buy.kind, plan: buy.plan, credits: buy.credits, code: buy.quote ? buy.code : '' });
        if (!r.data || !r.data.ok || !r.data.order) { SirbUI.msg(bm, ERR[r.data && r.data.error] || ERR.server, 'error'); return; }
        const o = r.data.order;
        $('doneInfo').textContent = o.name + ' · ' + usd(o.total);
        step('done');
        loadOrders();
      } catch (e) { SirbUI.msg(bm, 'تعذر الاتصال، جرب تاني', 'error'); }
      finally { $('buyConfirm').disabled = false; }
    });

    const STATUS = { pending: ['مستني الموافقة', 'warn'], approved: ['اتوافق عليه', 'ok'], rejected: ['مرفوض', 'err'] };
    let knownOrders = null, ordersT = null;
    async function loadOrders() {
      let r;
      try { r = await api('/orders', {}); } catch (e) { return; }
      if (!r.data || !r.data.ok || !Array.isArray(r.data.orders)) return;
      const list = r.data.orders;
      if (knownOrders) {
        const done = list.filter(o => o.status === 'approved' && knownOrders[o.id] === 'pending');
        if (done.length) { toast('طلبك "' + done[0].name + '" اتوافق عليه واتضاف لحسابك، والفاتورة جاهزة', 'ok'); refreshUser().then(loadPlans).catch(() => {}); loadLedger(); }
        list.filter(o => o.status === 'rejected' && knownOrders[o.id] === 'pending').forEach(o => toast('طلبك "' + o.name + '" اترفض' + (o.note ? ': ' + o.note : ''), 'err'));
      }
      knownOrders = {}; list.forEach(o => { knownOrders[o.id] = o.status; });
      const box = $('orders'); box.textContent = '';
      if (!list.length) box.append(el('span', 'hint', 'مفيش طلبات لسه'));
      await stream(list, o => {
        const row = el('div', 'order-row');
        const t = el('span', 'order-t'); t.append(el('b', '', o.name), el('small', '', fmt(o.time) + (o.code ? ' · كود ' + o.code : '')));
        const st = STATUS[o.status] || [o.status, 'info'];
        row.append(t, el('strong', 'en', usd(o.total)), el('span', 'chip ' + st[1], st[0]));
        if (o.status === 'approved') {
          const b = el('button', 'btn sm ghost'); b.type = 'button'; b.append(svg('receipt'), el('span', '', 'الفاتورة'));
          b.addEventListener('click', () => showInvoice(o));
          row.append(b);
        }
        return row;
      }, f => box.append(f));
      clearTimeout(ordersT);
      if (list.some(o => o.status === 'pending')) ordersT = setTimeout(() => { if (!document.hidden) loadOrders(); else ordersT = setTimeout(loadOrders, 30000); }, 30000);
    }
    loadOrders();

    function showInvoice(o) {
      const v = $('invoice'); v.textContent = '';
      const head = el('div', 'inv-head');
      const brand = el('div', 'inv-brand'); const lg = el('img'); lg.src = '../img/fav.png'; lg.alt = ''; brand.append(lg, el('b', 'en', 'SIRB Ai'));
      const meta = el('div', 'inv-meta'); meta.append(el('b', 'en', o.invoice), el('small', '', fmt(o.decidedAt || o.time)), el('span', 'chip ok', 'مدفوعة'));
      head.append(brand, meta);
      const to = el('dl', 'info');
      [['العميل', user.name], ['البريد', user.email || ''], ['رقم الطلب', o.id.slice(0, 8).toUpperCase()]].forEach(([k, x]) => { const d = el('div'); d.append(el('dt', '', k), el('dd', k === 'البريد' || k === 'رقم الطلب' ? 'en' : '', x)); to.append(d); });
      const tb = el('table', 'inv-table');
      const tr1 = el('tr'); ['البند', 'الكمية', 'السعر'].forEach(x => tr1.append(el('th', '', x)));
      const tr2 = el('tr'); tr2.append(el('td', '', o.name), el('td', 'en', o.kind === 'credits' ? String(o.credits) : '1'), el('td', 'en', usd(o.subtotal)));
      tb.append(tr1, tr2);
      const sum = el('dl', 'sum');
      [['السعر', usd(o.subtotal)], o.discount ? ['الخصم' + (o.code ? ' (' + o.code + ')' : ''), '-' + usd(o.discount)] : null, ['الإجمالي', usd(o.total)]].filter(Boolean).forEach(([k, x], i, a) => { const d = el('div', i === a.length - 1 ? 'tot' : ''); d.append(el('dt', '', k), el('dd', 'en', x)); sum.append(d); });
      v.append(head, to, tb, sum, el('p', 'hint', 'العملة: دولار أمريكي USD. اللي في الطلب اتضاف لحسابك تلقائي.'));
      const d = $('invDlg'); if (!d.open) d.showModal();
    }
    $('invDlg').querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => $('invDlg').close()));
    $('invPrint').addEventListener('click', () => { document.body.classList.add('printing'); window.print(); setTimeout(() => document.body.classList.remove('printing'), 500); });

    $('giftForm').addEventListener('submit', async e => {
      e.preventDefault();
      const code = $('giftCode').value.trim().toUpperCase();
      const gm = $('giftMsg');
      if (code.length < 3) { SirbUI.msg(gm, ERR.gift_invalid, 'error'); return; }
      $('giftBtn').disabled = true;
      try {
        const r = await api('/redeem', { code });
        if (!r.data || !r.data.ok) { SirbUI.msg(gm, ERR[r.data && r.data.error] || ERR.server, 'error'); return; }
        const parts = [];
        if (r.data.plan) parts.push('باقة ' + r.data.plan + ' لمدة ' + r.data.days + ' يوم');
        if (r.data.credits) parts.push(r.data.credits + ' كريديت');
        SirbUI.msg(gm, 'مبروك! اتضافلك ' + parts.join(' و '), 'success');
        $('giftCode').value = '';
        await refreshUser(); loadPlans(); loadLedger();
      } catch (err) { SirbUI.msg(gm, 'تعذر الاتصال، جرب تاني', 'error'); }
      finally { $('giftBtn').disabled = false; }
    });
  });
})();
