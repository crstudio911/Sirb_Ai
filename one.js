(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());

    const nav = document.getElementById('nav');
    const onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const items = Array.from(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  });
})();
document.addEventListener('sirb:session', function (ev) {
  if (!ev.detail) return;
  document.querySelectorAll('a[href^="log/one.html"]').forEach(function (a) {
    a.setAttribute('href', 'main/main.html');
    if (a.classList.contains('small')) a.textContent = 'حسابي';
  });
});
