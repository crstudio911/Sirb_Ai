(function() {
  "use strict";
  const api = window.SirbApi.api;
  const RE_NAME = /^[\p{L}\p{N}][\p{L}\p{N} _.\-]{1,49}$/u;
  const RE_EMAIL = /^[a-z0-9][a-z0-9._%+\-]*@[a-z0-9.\-]+\.[a-z]{2,}$/;
  const RE_CODE = /^\d{6}$/;
  const ALLOWED_DOMAINS = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com", "live.com", "msn.com", "proton.me", "protonmail.com", "zoho.com", "gmx.com", "mail.com", "yandex.com", "fastmail.com", "tuta.com", "tutanota.com", "aol.com", "hey.com"];
  const allowedEmail = (e) => RE_EMAIL.test(e) && ALLOWED_DOMAINS.includes(e.split("@")[1]);
  const RE_INVITE = /^[A-HJ-NP-Z2-9]{8}$/;
  const ERRORS = {
    bad_credentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    locked: "تم إيقاف المحاولة مؤقتاً بسبب إدخال كلمة مرور خاطئة أكثر من مرة",
    rate_limited: "محاولات كثيرة، حاول لاحقاً",
    email_taken: "هذا البريد مسجل بالفعل",
    email_invalid: "البريد الإلكتروني غير صالح",
    name_invalid: "الاسم غير صالح",
    password_weak: "كلمة المرور ضعيفة",
    invite_invalid: "كود الدعوة غير صحيح",
    terms_required: "يجب الموافقة على شروط الاستخدام وسياسة الخصوصية",
    email_domain: "استخدم بريداً حقيقياً (Gmail, Outlook, Yahoo, iCloud ...)",
    code_invalid: "كود التحقق غير صحيح",
    code_expired: "انتهت صلاحية الكود، اطلب كوداً جديداً",
    otp_wait: "انتظر قليلاً قبل طلب كود جديد",
    mail_failed: "تعذر إرسال الكود، حاول مرة أخرى",
    mail_config: "تعذر إرسال الكود الآن، حاول بعد قليل",
    busy: "الخدمة مشغولة، حاول مرة أخرى",
    network: "تعذر الاتصال، تأكد من الإنترنت وحاول مرة أخرى",
    config: "الخدمة غير متاحة الآن، حاول بعد قليل",
    default: "حدث خطأ، حاول مرة أخرى"
  };
  const PHRASES = [
    "كل شيء يبدأ بـ*خطوة*",
    "فقط قم ب^تسجيل الدخول^",
    "أهلاً بك في *عالمك* الخاص",
    "ابدأ ~الإبداع~ الآن و*مجاناً*",
    "نحن هنا ^لأجلك^",
    "ابدأ *الآن*",
    "نحن *نقدّر* مجهودك",
    "قاوم هواك تبلغ ~عُلاك~"
  ];
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  function renderPhrase(el, text) {
    el.textContent = "";
    const re = /([*~^])([^*~^]+)\1/g;
    let last = 0, m;
    while (m = re.exec(text)) {
      if (m.index > last) el.appendChild(document.createTextNode(text.slice(last, m.index)));
      const span = document.createElement("span");
      span.className = m[1] === "*" ? "grad" : m[1] === "~" ? "split" : "faint";
      span.textContent = m[2];
      el.appendChild(span);
      last = re.lastIndex;
    }
    if (last < text.length) el.appendChild(document.createTextNode(text.slice(last)));
  }
  function initPhrases() {
    const el = $("#phrase");
    if (!el) return;
    let idx = -1;
    const rand = (n) => Math.floor(Math.random() * n);
    function show() {
      let n;
      do {
        n = rand(PHRASES.length);
      } while (n === idx && PHRASES.length > 1);
      idx = n;
      renderPhrase(el, PHRASES[idx]);
      el.className = "phrase e" + (rand(8) + 1);
      setTimeout(function() {
        el.className = "phrase x" + (rand(8) + 1);
        setTimeout(show, 600);
      }, 3800);
    }
    show();
  }
  function initTabs() {
    const tabs = $(".tabs");
    $$(".tab").forEach(function(btn) {
      btn.addEventListener("click", function() {
        setTab(btn.dataset.tab);
      });
    });
    function setTab(name) {
      $$(".tab").forEach((b) => {
        const on = b.dataset.tab === name;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", on);
      });
      tabs.classList.toggle("signup", name === "signup");
      $("#loginForm").classList.toggle("active", name === "login");
      $("#signupForm").classList.toggle("active", name === "signup");
    }
    const q = new URLSearchParams(location.search);
    if (q.get("tab") === "signup") setTab("signup");
    const invite = q.get("invite");
    if (invite && RE_INVITE.test(invite.toUpperCase())) {
      $("#signupForm [name=invite]").value = invite.toUpperCase();
      setTab("signup");
    }
  }
  function initEyes() {
    $$(".eye").forEach(function(b) {
      b.addEventListener("click", function() {
        const i = b.previousElementSibling;
        const show = i.type === "password";
        i.type = show ? "text" : "password";
        b.classList.toggle("on", show);
        b.setAttribute("aria-label", show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور");
      });
    });
  }
  function strength(p) {
    let s = 0;
    if (p.length >= 8) s++;
    if (p.length >= 12) s++;
    if (/[a-z\u0600-\u06FF]/.test(p) && /[A-Z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9\u0600-\u06FF]/.test(p)) s++;
    return s;
  }
  function initMeter() {
    const input = $("#signupForm [name=password]");
    const bar = $("#meterBar");
    const colors = ["var(--error)", "var(--error)", "var(--warning)", "var(--warning)", "var(--success)", "var(--success)"];
    input.addEventListener("input", function() {
      const s = strength(input.value);
      bar.style.width = s / 5 * 100 + "%";
      bar.style.background = colors[s];
    });
    const inv = $("#signupForm [name=invite]");
    inv.addEventListener("input", function() {
      inv.value = inv.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    });
  }
  function setErr(form, name, msg) {
    const input = form.elements[name];
    const field = input.closest(".field");
    field.classList.toggle("invalid", !!msg);
    $(".err", field).textContent = msg || "";
    return !msg;
  }
  function setMsg(form, text, type) {
    window.SirbUI.msg($(".msg", form), text, type);
  }
  function lock(form, on) {
    $$("input, button", form).forEach((el) => {
      el.disabled = on;
    });
  }
  function initLogin() {
    const form = $("#loginForm");
    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      setMsg(form, "");
      const email = form.elements.email.value.trim().toLowerCase();
      const password = form.elements.password.value;
      let ok = setErr(form, "email", RE_EMAIL.test(email) ? "" : ERRORS.email_invalid);
      ok = setErr(form, "password", password ? "" : "أدخل كلمة المرور") && ok;
      if (!ok) return;
      lock(form, true);
      setMsg(form, "جارٍ التحقق...", "info");
      try {
        const r = await api("/login", { email, password });
        if (r.data.ok) {
          form.elements.password.value = "";
          setMsg(form, "تم تسجيل الدخول بنجاح", "success");
          location.replace("../main/main.html");
          return;
        }
        const d = r.data || {};
        if (d.error === "locked") {
          penalty(form, d);
          return;
        }
        const extra = d.error === "bad_credentials" && d.left === 1 ? ". تبقّت لك محاولة واحدة قبل الانتظار" : "";
        setMsg(form, (ERRORS[d.error] || ERRORS.default) + extra, "error");
      } catch (err) {
        setMsg(form, err && err.message === "config" ? ERRORS.config : ERRORS.network, "error");
      }
      lock(form, false);
    });
    const saved = Number((function() {
      try {
        return localStorage.getItem("sirb-login-until");
      } catch (e) {
        return 0;
      }
    })() || 0);
    if (saved > Date.now()) penalty(form, { wait: Math.ceil((saved - Date.now()) / 1e3) });
  }
  function penalty(form, d) {
    const wait = Math.max(5, Math.floor(Number(d.wait) || 300));
    try {
      localStorage.setItem("sirb-login-until", String(Date.now() + wait * 1e3));
    } catch (e) {
    }
    if (d.severe && window.SirbGuard && window.SirbGuard.punish) {
      window.SirbGuard.punish("login", wait);
      return;
    }
    lock(form, true);
    const fmt = (s) => {
      const m = Math.floor(s / 60), x = s % 60;
      return m ? m + ":" + String(x).padStart(2, "0") : x + " ث";
    };
    const t = setInterval(function() {
      const left = Math.ceil((Number(localStorage.getItem("sirb-login-until")) - Date.now()) / 1e3);
      if (left <= 0) {
        clearInterval(t);
        try {
          localStorage.removeItem("sirb-login-until");
        } catch (e) {
        }
        lock(form, false);
        setMsg(form, "يمكنك المحاولة الآن", "info");
        return;
      }
      setMsg(form, ERRORS.locked + ". يمكنك المحاولة بعد " + fmt(left), "error");
    }, 1e3);
    setMsg(form, ERRORS.locked + ". يمكنك المحاولة بعد " + fmt(wait), "error");
  }
  let resendLeft = 0;
  function initSendCode() {
    const form = $("#signupForm");
    const btn = $("#sendCode");
    const codeIn = form.elements.code;
    codeIn.addEventListener("input", function() {
      codeIn.value = codeIn.value.replace(/\D/g, "").slice(0, 6);
    });
    function countdown(sec) {
      resendLeft = sec;
      btn.disabled = true;
      const t = setInterval(function() {
        resendLeft--;
        btn.textContent = resendLeft > 0 ? "إعادة بعد " + resendLeft : "إعادة الإرسال";
        if (resendLeft <= 0) {
          clearInterval(t);
          btn.disabled = false;
        }
      }, 1e3);
      btn.textContent = "إعادة بعد " + sec;
    }
    btn.addEventListener("click", async function() {
      setMsg(form, "");
      const email = form.elements.email.value.trim().toLowerCase();
      const name = form.elements.name.value.trim().replace(/\s+/g, " ");
      if (!setErr(form, "email", !RE_EMAIL.test(email) ? ERRORS.email_invalid : allowedEmail(email) ? "" : ERRORS.email_domain)) return;
      btn.disabled = true;
      btn.textContent = "جارٍ الإرسال...";
      try {
        const r = await api("/send-code", { email, name: RE_NAME.test(name) ? name : "" });
        if (r.data.ok) {
          setMsg(form, "تم الإرسال. لو البريد غير مسجّل هيوصلك كود التحقق (راجع الرسائل غير المرغوبة أيضاً)", "success");
          codeIn.focus();
          countdown(60);
          return;
        }
        const key = r.data.error;
        if (key === "email_taken" || key === "email_domain") setErr(form, "email", ERRORS[key]);
        setMsg(form, ERRORS[key] || ERRORS.default, "error");
        if (key === "otp_wait") {
          countdown(60);
          return;
        }
      } catch (err) {
        setMsg(form, err && err.message === "config" ? ERRORS.config : ERRORS.network, "error");
      }
      btn.disabled = false;
      btn.textContent = "إرسال الكود";
    });
  }
  function initSignup() {
    const form = $("#signupForm");
    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      setMsg(form, "");
      const name = form.elements.name.value.trim().replace(/\s+/g, " ");
      const email = form.elements.email.value.trim().toLowerCase();
      const password = form.elements.password.value;
      const invite = form.elements.invite.value.trim().toUpperCase();
      let ok = setErr(form, "name", RE_NAME.test(name) ? "" : "الاسم من 2 إلى 50 حرفاً بدون رموز خاصة");
      ok = setErr(form, "email", !RE_EMAIL.test(email) ? ERRORS.email_invalid : allowedEmail(email) ? "" : ERRORS.email_domain) && ok;
      const code = form.elements.code.value.trim();
      ok = setErr(form, "code", RE_CODE.test(code) ? "" : "أدخل كود التحقق المكون من 6 أرقام") && ok;
      ok = setErr(form, "password", password.length >= 8 && password.length <= 128 && /[A-Za-z\u0600-\u06FF]/.test(password) && /\d/.test(password) ? "" : "8 أحرف على الأقل وتحتوي على حروف وأرقام") && ok;
      ok = setErr(form, "invite", !invite || RE_INVITE.test(invite) ? "" : ERRORS.invite_invalid) && ok;
      const terms = form.elements.terms.checked;
      $(".agree-err", form).textContent = terms ? "" : ERRORS.terms_required;
      ok = terms && ok;
      if (!ok) return;
      lock(form, true);
      setMsg(form, "جارٍ إنشاء الحساب...", "info");
      try {
        const r = await api("/signup", { name, email, password, invite, terms: true, code });
        if (r.data.ok) {
          form.elements.password.value = "";
          setMsg(form, "تم إنشاء الحساب بنجاح", "success");
          location.replace("../main/main.html");
          return;
        }
        const key = r.data.error;
        if (key === "invite_invalid") setErr(form, "invite", ERRORS.invite_invalid);
        if (key === "email_taken" || key === "email_domain") setErr(form, "email", ERRORS[key]);
        if (key === "code_invalid" || key === "code_expired") setErr(form, "code", ERRORS[key]);
        setMsg(form, ERRORS[key] || ERRORS.default, "error");
      } catch (err) {
        setMsg(form, err && err.message === "config" ? ERRORS.config : ERRORS.network, "error");
      }
      lock(form, false);
      if (resendLeft > 0) $("#sendCode").disabled = true;
    });
  }
  async function redirectIfLogged() {
    try {
      if (await window.SirbApi.session()) location.replace("../main/main.html");
    } catch (e) {
    }
  }
  document.addEventListener("DOMContentLoaded", function() {
    if (!$("#loginForm")) return;
    initPhrases();
    initTabs();
    initEyes();
    initMeter();
    initLogin();
    initSignup();
    initSendCode();
    redirectIfLogged();
  });
})();
