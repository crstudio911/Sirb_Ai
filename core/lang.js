(function() {
  "use strict";
  const LANGS = [
    ["ar", "العربية"],
    ["en", "English"],
    ["fr", "Français"],
    ["es", "Español"],
    ["it", "Italiano"],
    ["de", "Deutsch"],
    ["pt", "Português"],
    ["ru", "Русский"],
    ["tr", "Türkçe"],
    ["fa", "فارسی"],
    ["ur", "اردو"],
    ["hi", "हिन्दी"],
    ["bn", "বাংলা"],
    ["id", "Bahasa Indonesia"],
    ["ms", "Bahasa Melayu"],
    ["zh-CN", "中文 (简体)"],
    ["zh-TW", "中文 (繁體)"],
    ["ja", "日本語"],
    ["ko", "한국어"],
    ["nl", "Nederlands"],
    ["pl", "Polski"],
    ["uk", "Українська"],
    ["sv", "Svenska"],
    ["el", "Ελληνικά"],
    ["he", "עברית"],
    ["th", "ไทย"],
    ["vi", "Tiếng Việt"],
    ["sw", "Kiswahili"],
    ["ro", "Română"],
    ["cs", "Čeština"],
    ["hu", "Magyar"],
    ["da", "Dansk"],
    ["fi", "Suomi"],
    ["no", "Norsk"],
    ["tl", "Filipino"]
  ];
  const RTL = { ar: 1, fa: 1, ur: 1, he: 1 };
  const KEY = "sirb-lang";
  const NAME = {};
  LANGS.forEach((l) => {
    NAME[l[0]] = l[1];
  });
  let current = "ar";
  try {
    const s = localStorage.getItem(KEY);
    if (s && NAME[s]) current = s;
  } catch (e) {
  }
  function setCookie(v) {
    const exp = v ? "" : "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    const val = v ? "/ar/" + v : "";
    document.cookie = "googtrans=" + val + "; path=/" + exp;
    const host = location.hostname.split(".");
    for (let i = 0; i < host.length - 1; i++) document.cookie = "googtrans=" + val + "; path=/; domain=." + host.slice(i).join(".") + exp;
  }
  function applyDir(code) {
    const d = document.documentElement;
    d.dir = RTL[code] ? "rtl" : "ltr";
    d.dataset.lang = code;
  }
  if (current !== "ar") {
    setCookie(current);
    applyDir(current);
  } else setCookie("");
  let loading = null;
  function loadEngine() {
    if (loading) return loading;
    loading = new Promise((resolve, reject) => {
      const box = document.createElement("div");
      box.id = "gt_el";
      box.className = "gt-hidden";
      document.body.append(box);
      window.__sirbGT = function() {
        try {
          new window.google.translate.TranslateElement({ pageLanguage: "ar", autoDisplay: false }, "gt_el");
          resolve();
        } catch (e) {
          reject(e);
        }
      };
      const s = document.createElement("script");
      s.src = "https://translate.google.com/translate_a/element.js?cb=__sirbGT";
      s.async = true;
      s.onerror = () => {
        loading = null;
        reject(new Error("lang_load"));
      };
      document.head.append(s);
    });
    return loading;
  }
  function combo() {
    return document.querySelector("#gt_el select.goog-te-combo");
  }
  async function waitCombo() {
    for (let i = 0; i < 60; i++) {
      const c = combo();
      if (c && c.options.length > 1) return c;
      await new Promise((r) => setTimeout(r, 100));
    }
    return combo();
  }
  async function choose(code) {
    if (!NAME[code]) return;
    const prev = current;
    current = code;
    try {
      localStorage.setItem(KEY, code);
    } catch (e) {
    }
    renderBtn();
    if (code === "ar") {
      setCookie("");
      applyDir("ar");
      if (prev !== "ar") location.reload();
      return;
    }
    setCookie(code);
    applyDir(code);
    try {
      await loadEngine();
      const c = await waitCombo();
      if (!c) throw new Error("lang_combo");
      c.value = code;
      c.dispatchEvent(new Event("change"));
    } catch (e) {
      if (window.SirbUI && window.SirbUI.toast) window.SirbUI.toast("تعذر تغيير اللغة حالياً، تحقق من اتصال الإنترنت وحاول مرة أخرى", "err");
    }
  }
  let btn, menu;
  function renderBtn() {
    if (!btn) return;
    btn.querySelector(".lang-code").textContent = current === "zh-CN" || current === "zh-TW" ? "ZH" : current.toUpperCase();
    btn.setAttribute("aria-label", "اللغة: " + NAME[current]);
    if (menu) menu.querySelectorAll("[data-code]").forEach((b) => b.setAttribute("aria-checked", b.dataset.code === current ? "true" : "false"));
  }
  const svg = '<svg viewBox="0 0 24 24" aria-hidden="true" class="lang-ic"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/></svg>';
  function build() {
    const wrap = document.createElement("div");
    wrap.className = "lang-pick notranslate";
    wrap.setAttribute("translate", "no");
    btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-btn";
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = svg + '<span class="lang-code"></span>';
    menu = document.createElement("div");
    menu.className = "lang-menu";
    menu.hidden = true;
    menu.setAttribute("role", "menu");
    const search = document.createElement("input");
    search.type = "search";
    search.className = "lang-search";
    search.placeholder = "ابحث عن لغة / Search";
    search.setAttribute("aria-label", "ابحث عن لغة");
    const list = document.createElement("div");
    list.className = "lang-list";
    LANGS.forEach(([code, name]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.code = code;
      b.setAttribute("role", "menuitemradio");
      b.dir = "auto";
      b.innerHTML = '<span class="lang-name"></span><span class="lang-tag"></span>';
      b.querySelector(".lang-name").textContent = name;
      b.querySelector(".lang-tag").textContent = code.slice(0, 2).toUpperCase();
      b.addEventListener("click", () => {
        close();
        choose(code);
      });
      list.append(b);
    });
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      list.querySelectorAll("[data-code]").forEach((b) => {
        b.hidden = q && !(b.textContent.toLowerCase().includes(q) || b.dataset.code.toLowerCase().includes(q));
      });
    });
    menu.append(search, list);
    wrap.append(btn, menu);
    menu.classList.add("notranslate");
    menu.setAttribute("translate", "no");
    document.body.append(menu);
    function placeMenu() {
      const r = btn.getBoundingClientRect(), vw = innerWidth, vh = innerHeight, gap = 8, pad = 12;
      const w = Math.min(260, vw - pad * 2);
      let left = r.left + r.width / 2 - w / 2;
      left = Math.max(pad, Math.min(left, vw - w - pad));
      const below = vh - r.bottom - gap - pad, above = r.top - gap - pad;
      const up = below < 220 && above > below;
      const h = Math.max(160, Math.min(380, up ? above : below));
      menu.style.width = w + "px";
      menu.style.left = left + "px";
      menu.style.maxHeight = h + "px";
      menu.style.top = up ? Math.max(pad, r.top - gap - h) + "px" : r.bottom + gap + "px";
    }
    function open() {
      placeMenu();
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
      search.value = "";
      search.dispatchEvent(new Event("input"));
      setTimeout(() => search.focus({ preventScroll: true }), 30);
    }
    function close() {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.hidden ? open() : close();
    });
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target) && !menu.contains(e.target)) close();
    });
    addEventListener("resize", () => {
      if (!menu.hidden) placeMenu();
    });
    addEventListener("scroll", () => {
      if (!menu.hidden) placeMenu();
    }, { passive: true });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !menu.hidden) {
        close();
        btn.focus();
      }
    });
    const theme = document.getElementById("themeToggle");
    const fixed = theme && getComputedStyle(theme).position === "fixed";
    if (theme && theme.parentNode && !fixed) theme.parentNode.insertBefore(wrap, theme);
    else {
      wrap.classList.add("floating");
      document.body.append(wrap);
      const place = () => {
        if (!fixed) return;
        const r = theme.getBoundingClientRect();
        if (!r.width) return;
        wrap.style.top = r.top + (r.height - 40) / 2 + "px";
        wrap.style.insetInlineStart = "auto";
        wrap.style.left = r.right + 10 + "px";
      };
      place();
      addEventListener("resize", place);
    }
    renderBtn();
  }
  document.addEventListener("DOMContentLoaded", () => {
    build();
    if (current !== "ar") loadEngine().catch(() => {
    });
  });
  window.SirbLang = Object.freeze({ current: () => current, set: choose });
})();
