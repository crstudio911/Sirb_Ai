(function() {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const RE_EMAIL = /^[a-z0-9][a-z0-9._%+\-]*@[a-z0-9.\-]+\.[a-z]{2,}$/;
  const ERR = {
    email_domain: "استخدم بريداً حقيقياً (Gmail, Outlook, Yahoo, iCloud ...)",
    email_invalid: "البريد الإلكتروني غير صالح",
    otp_wait: "انتظر دقيقة قبل طلب رمز جديد",
    rate_limited: "محاولات كثيرة، حاول مرة أخرى بعد ساعة",
    password_weak: "كلمة المرور ضعيفة: 8 أحرف على الأقل وتتضمن حروفاً وأرقاماً",
    mail_failed: "تعذّر إرسال رمز التحقق، حاول مرة أخرى بعد قليل",
    busy: "الخدمة مشغولة، حاول مرة أخرى",
    lockdown: "الموقع قيد التحديث الآن",
    default: "حدث خطأ، حاول مرة أخرى"
  };
  const LEADS = [
    "",
    "أدخل البريد الإلكتروني المسجّل في حسابك.",
    "أجب عن الأسئلة التالية لنتأكد أن الحساب يخصك.",
    "أرسلنا رمز تحقق إلى بريدك الإلكتروني. أدخله هنا (راجع الرسائل غير المرغوبة أيضاً).",
    "أنشئ كلمة مرور جديدة لحسابك."
  ];
  let flow = "";
  const say = (t, type) => {
    const m = $("msg");
    m.textContent = t || "";
    m.className = "note" + (type ? " " + type : "");
  };
  const api = (p, b) => window.SirbApi.api(p, b);
  function show(n) {
    [1, 2, 3, 4].forEach((i) => {
      $("s" + i).hidden = i !== n;
    });
    document.querySelectorAll(".steps li").forEach((li, i) => {
      li.className = i < n - 1 ? "done" : i === n - 1 ? "on" : "";
    });
    $("lead").textContent = LEADS[n];
    say("");
    const first = $("s" + n).querySelector("input");
    if (first) first.focus();
  }
  function lockForms(on) {
    document.querySelectorAll("form button").forEach((b) => {
      b.disabled = on;
    });
  }
  function kick() {
    flow = "";
    document.querySelectorAll("form").forEach((f) => {
      f.hidden = true;
      f.reset();
    });
    say("تعذّر التحقق من هويتك. لحماية الحساب أُنهيت المحاولة، وسيتم نقلك إلى صفحة تسجيل الدخول.", "err");
    setTimeout(() => location.replace("../log/one.html"), 3e3);
  }
  async function step(path, body, onOk) {
    lockForms(true);
    say("جارٍ التحقق...");
    try {
      const r = await api(path, body);
      const d = r.data || {};
      if (d.ok) {
        onOk(d);
        return;
      }
      if (d.error === "reset_failed") {
        kick();
        return;
      }
      say(ERR[d.error] || ERR.default, "err");
    } catch (e) {
      say("تعذّر الاتصال، تأكد من الإنترنت وحاول مرة أخرى", "err");
    } finally {
      lockForms(false);
    }
  }
  document.addEventListener("DOMContentLoaded", function() {
    $("s1").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("em").value.trim().toLowerCase();
      if (!RE_EMAIL.test(email)) {
        say(ERR.email_invalid, "err");
        return;
      }
      step("/reset-start", { email }, (d) => {
        flow = d.f;
        show(2);
      });
    });
    $("s2").addEventListener("submit", (e) => {
      e.preventDefault();
      const ans = { name: $("qn").value.trim(), credits: $("qc").value.trim(), created: $("qd").value, last: $("ql").value, password: $("qp").value };
      const filled = ["name", "credits", "created", "last", "password"].filter((k) => ans[k]).length;
      if (filled < 3) {
        say("أجب عن 3 أسئلة على الأقل", "err");
        return;
      }
      step("/reset-verify", { f: flow, ans }, () => {
        $("qp").value = "";
        show(3);
      });
    });
    $("cd").addEventListener("input", () => {
      $("cd").value = $("cd").value.replace(/\D/g, "").slice(0, 6);
    });
    $("s3").addEventListener("submit", (e) => {
      e.preventDefault();
      const code = $("cd").value;
      if (code.length !== 6) {
        say("أدخل الرمز المكوّن من 6 أرقام", "err");
        return;
      }
      step("/reset-code", { f: flow, code }, () => show(4));
    });
    $("s4").addEventListener("submit", (e) => {
      e.preventDefault();
      const password = $("np").value;
      if (!(password.length >= 8 && /[A-Za-z\u0600-\u06FF]/.test(password) && /\d/.test(password))) {
        say(ERR.password_weak, "err");
        return;
      }
      if (password !== $("np2").value) {
        say("كلمتا المرور غير متطابقتين", "err");
        return;
      }
      step("/reset-pass", { f: flow, password }, () => {
        document.querySelectorAll("form").forEach((f) => {
          f.hidden = true;
          f.reset();
        });
        document.querySelectorAll(".steps li").forEach((li) => {
          li.className = "done";
        });
        $("title").textContent = "أهلاً بك من جديد";
        $("lead").textContent = "تم إنشاء كلمة المرور الجديدة وحُذفت القديمة نهائياً، وسُجّل خروجك من جميع الأجهزة.";
        say("سيتم نقلك إلى صفحة تسجيل الدخول...", "ok");
        setTimeout(() => location.replace("../log/one.html"), 3e3);
      });
    });
  });
})();
