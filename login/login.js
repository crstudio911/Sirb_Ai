const TERMS_URL = "#";

const PHRASES = [
"نصنع من *الأفكار* واقعًا ذكيًا",
"كل يوم ~خطوة~ أقرب إلى المستقبل",
"ذكاء اصطناعي يعمل *من أجلك*",
"ابتكر بلا حدود وابدأ ~الآن~",
"معًا نكون *أذكى* وأسرع",
"بياناتك في ^أمان^ وثقتك *أولويتنا*",
"حوّل التعقيد إلى ~بساطة~",
"اسأل وجرّب و*اكتشف* المزيد",
"أفكارك تستحق ^ذكاءً^ يليق بها",
"مستقبلك يبدأ من ~هنا~"
];

const ENTER = ["rise", "drop", "blur", "zoom", "left", "right", "flip", "skew"];
const EXIT = ["up", "down", "blur", "zoom", "left", "right", "flip", "fade"];
const STYLES = { "*": "s-a", "~": "s-h", "^": "s-d" };
const TIMING = { enter: 850, stepIn: 110, exit: 600, stepOut: 70, hold: 2600, perWord: 320 };

const stage = document.getElementById("stage");
const pick = (list) => list[Math.floor(Math.random() * list.length)];

const parse = (text) => {
const out = [];
const re = /([*~^])(.+?)\1|\S+/g;
let m;
while ((m = re.exec(text))) {
if (m[1]) {
m[2].split(/\s+/).forEach((w) => out.push({ t: w, c: STYLES[m[1]] }));
} else {
out.push({ t: m[0], c: "" });
}
}
return out;
};

const build = (text) => {
const frag = document.createDocumentFragment();
const words = parse(text);
words.forEach((w, i) => {
const el = document.createElement("span");
el.className = "w" + (w.c ? " " + w.c : "");
el.style.setProperty("--i", i);
el.textContent = w.t;
frag.appendChild(el);
frag.appendChild(document.createTextNode(" "));
});
return { frag, count: words.length };
};

let last = -1;

const next = () => {
if (!stage || !PHRASES.length) return;
let i;
do {
i = Math.floor(Math.random() * PHRASES.length);
} while (PHRASES.length > 1 && i === last);
last = i;
const { frag, count } = build(PHRASES[i]);
stage.innerHTML = "";
stage.className = "stage enter-" + pick(ENTER);
stage.appendChild(frag);
const visible = TIMING.enter + count * TIMING.stepIn + TIMING.hold + count * TIMING.perWord;
setTimeout(() => {
stage.className = "stage exit-" + pick(EXIT);
setTimeout(next, TIMING.exit + count * TIMING.stepOut + 80);
}, visible);
};

const termsLink = document.getElementById("termsLink");
if (termsLink) termsLink.setAttribute("href", TERMS_URL);

const tabs = document.getElementById("tabs");
const tabButtons = document.querySelectorAll("[data-tab]");
const forms = document.querySelectorAll("[data-form]");

const show = (name) => {
tabs.setAttribute("data-active", name);
tabButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.tab === name));
forms.forEach((f) => f.classList.toggle("is-active", f.dataset.form === name));
};

tabButtons.forEach((b) => b.addEventListener("click", () => show(b.dataset.tab)));
document.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => show(b.dataset.go)));

document.querySelectorAll("[data-eye]").forEach((b) => {
b.addEventListener("click", () => {
const input = b.parentElement.querySelector("input");
const visible = input.type === "text";
input.type = visible ? "password" : "text";
b.classList.toggle("is-on", !visible);
});
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const setError = (field, message) => {
field.classList.toggle("has-error", Boolean(message));
const msg = field.querySelector(".msg");
if (msg) msg.textContent = message || "";
};

const validators = {
name: (v) => (v.trim() ? "" : "اكتب اسمك من فضلك"),
email: (v) => (!v.trim() ? "البريد الإلكتروني مطلوب" : EMAIL_RE.test(v.trim()) ? "" : "أدخل بريدًا إلكترونيًا صحيحًا"),
password: (v, form) => (!v ? "كلمة المرور مطلوبة" : form.dataset.form === "signup" && v.length < 8 ? "كلمة المرور يجب ألا تقل عن 8 أحرف" : ""),
terms: (v, form, input) => (input.checked ? "" : "يجب الموافقة على الشروط للمتابعة")
};

const checkField = (form, field) => {
const key = field.dataset.field;
const input = field.querySelector("input");
const rule = validators[key];
if (!input || !rule) return true;
const message = rule(input.value, form, input);
setError(field, message);
return !message;
};

forms.forEach((form) => {
const fields = form.querySelectorAll("[data-field]");
fields.forEach((field) => {
const input = field.querySelector("input");
input.addEventListener("input", () => {
if (field.classList.contains("has-error")) checkField(form, field);
});
input.addEventListener("change", () => {
if (field.classList.contains("has-error")) checkField(form, field);
});
});
form.addEventListener("submit", (e) => {
e.preventDefault();
let first = null;
fields.forEach((field) => {
if (!checkField(form, field) && !first) first = field;
});
if (first) first.querySelector("input").focus();
});
});

next();
