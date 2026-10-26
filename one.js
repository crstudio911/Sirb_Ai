(function() {
  "use strict";
  document.addEventListener("DOMContentLoaded", function() {
    const y = document.getElementById("year");
    if (y) y.textContent = String((/* @__PURE__ */ new Date()).getFullYear());
    const nav = document.getElementById("nav");
    const onScroll = function() {
      nav.classList.toggle("scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    demo();
    const items = Array.from(document.querySelectorAll(".reveal"));
    if (!("IntersectionObserver" in window)) {
      items.forEach(function(el) {
        el.classList.add("in");
      });
      return;
    }
    const io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function(el) {
      io.observe(el);
    });
  });
})();
document.addEventListener("sirb:session", function(ev) {
  if (!ev.detail) return;
  document.querySelectorAll('a[href^="log/one.html"]').forEach(function(a) {
    a.setAttribute("href", "main/main.html");
    if (a.classList.contains("small")) a.textContent = "حسابي";
  });
});
function demo() {
  const img = document.getElementById("demoImg"), txt = document.getElementById("demoText"), bar = document.getElementById("demoBar"), tag = document.getElementById("demoTag");
  if (!img || !txt) return;
  const shots = [
    ["img/show1.jpg", "مدينة عربية مستقبلية تطفو فوق السحاب وقت الغروب"],
    ["img/show2.jpg", "حصان عربي أبيض يركض في الصحراء وقت الغروب"],
    ["img/show3.jpg", "زجاجة عطر فاخرة على رخام داكن بإضاءة زرقاء"],
    ["img/show4.jpg", "رائدة فضاء تنعكس على خوذتها سديم ملوّن"]
  ];
  shots.forEach((s) => {
    const i = new Image();
    i.src = s[0];
  });
  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let n = 0;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  (async function loop() {
    for (; ; ) {
      const [src, text] = shots[n % shots.length];
      txt.textContent = "";
      bar.style.width = "0%";
      tag.textContent = "جارٍ الكتابة…";
      img.parentNode.classList.add("busy");
      if (reduce) txt.textContent = text;
      else for (let i = 1; i <= text.length; i++) {
        txt.textContent = text.slice(0, i);
        await wait(45);
      }
      tag.textContent = "جارٍ الرسم…";
      for (let p = 0; p <= 100; p += 4) {
        bar.style.width = p + "%";
        await wait(reduce ? 5 : 40);
      }
      img.src = src;
      img.parentNode.classList.remove("busy");
      tag.textContent = "جاهزة";
      await wait(3200);
      n++;
    }
  })();
}
