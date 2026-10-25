// 6.27.0: the way back opens only after the waiting time ends AND developer tools are closed.
// If they are still open, the waiting time is extended.
(function () {
  'use strict';
  var G = window.SirbGuard;
  var wait = document.getElementById('wait'), back = document.getElementById('back');
  var why = document.getElementById('why');
  if (why && G && G.why() === 'login') why.textContent = 'تم إدخال كلمة مرور خاطئة عدة مرات. لحماية الحساب أوقفنا محاولات الدخول من هذا الجهاز لبعض الوقت.';
  if (!G) { back.hidden = false; back.onclick = function () { location.replace('../index.html'); }; return; }
  function fmt(s) { var m = Math.floor(s / 60), x = s % 60; return m ? m + ' دقيقة و' + x + ' ثانية' : x + ' ثانية'; }
  function tick() {
    var left = Math.ceil((G.until() - Date.now()) / 1000);
    if (G.isOpen()) {
      try { localStorage.setItem('sirb-guard-until', String(Math.max(G.until(), Date.now() + 20000))); } catch (e) {}
      back.hidden = true;
      wait.textContent = 'أغلق أدوات المطوّر أولاً، ثم انتظر حتى ينتهي الوقت.';
      return;
    }
    if (left > 0) { back.hidden = true; wait.textContent = 'يمكنك المتابعة بعد ' + fmt(left); return; }
    wait.textContent = 'يمكنك المتابعة الآن.';
    back.hidden = false;
  }
  back.addEventListener('click', function () { if (!G.isOpen() && G.until() <= Date.now()) location.replace(G.home); });
  tick();
  setInterval(tick, 1000);
})();
