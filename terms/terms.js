// صفحة الشروط (6.9.0): زر اللغة الموحد (35 لغة) بدل زر English القديم.
// الإنجليزية لها نسخة مكتوبة يدوياً، وباقي اللغات بتترجم تلقائياً من النسخة العربية.
(function () {
  'use strict';
  var d = document.documentElement;
  var t = null, lang = 'ar';
  try { t = localStorage.getItem('sirb-theme'); lang = localStorage.getItem('sirb-lang') || 'ar'; } catch (e) {}
  d.dataset.theme = t === 'light' ? 'light' : 'dark';
  var q = new URLSearchParams(location.search);
  if (q.get('lang') === 'en') lang = 'en';
  var BACK = { home: '../index.html', one: '../log/one.html', main: '../main/main.html' };
  var from = q.get('from');
  var target = Object.prototype.hasOwnProperty.call(BACK, from) ? BACK[from] : '../log/one.html';
  ['gesturestart', 'gesturechange'].forEach(function (n) { document.addEventListener(n, function (e) { e.preventDefault(); }, { passive: false }); });
  document.addEventListener('DOMContentLoaded', function () {
    var en = lang === 'en';
    document.getElementById('doc-ar').hidden = en;
    document.getElementById('doc-en').hidden = !en;
    document.getElementById('sub').textContent = 'تاريخ السريان: 22 أكتوبر 2026 — الإصدار 1.0';
    var p = en ? 'en' : 'ar';
    document.getElementById('tocTerms').href = '#' + p + '-p1';
    document.getElementById('tocPrivacy').href = '#' + p + '-p2';
    // اختيار الإنجليزية أو الرجوع منها: نعيد التحميل لعرض النسخة الإنجليزية الأصلية
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.lang-list [data-code]');
      if (!b) return;
      var c = b.dataset.code;
      if ((c === 'en') !== en) setTimeout(function () { location.reload(); }, 60);
    });
    document.getElementById('backBtn').addEventListener('click', function () { location.replace(target); });
    document.getElementById('themeToggle').addEventListener('click', function () {
      var n = d.dataset.theme === 'dark' ? 'light' : 'dark';
      d.dataset.theme = n;
      try { localStorage.setItem('sirb-theme', n); } catch (e) {}
    });
  });
})();
