/* Sirb_Ai — مؤثرات الواجهة (6.21.0)
 * 1) كرة التفكير المنقطة أثناء تحميل الموديل (مستوحاة من AI Thinking Orb على 21st.dev، مكتوبة من جديد بدون React).
 * 2) خانات كود التحقق المنفصلة (مستوحاة من OTP Input على 21st.dev).
 * لا تغيّر أي منطق: الخانة الأصلية تبقى هي التي تُرسل، والكرة تتبع ظهور شريط التحميل فقط.
 */
(function () {
  'use strict';
  const RM = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

  /* ───────── كرة التفكير ───────── */
  function orb(host) {
    const SIZE = 64, N = 220;
    const cv = document.createElement('canvas');
    cv.className = 'fx-orb'; cv.setAttribute('aria-hidden', 'true');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = SIZE * dpr; cv.height = SIZE * dpr;
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr);
    // نقاط موزعة بالتساوي على كرة (Fibonacci sphere)
    const pts = [];
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = ga * i;
      pts.push([Math.cos(t) * r, y, Math.sin(t) * r, Math.random() * 6.28]);
    }
    let raf = 0, t0 = 0, color = '#00E5FF';
    function frame(now) {
      if (!t0) t0 = now;
      const t = (now - t0) / 1000;
      const ry = t * 0.9, rx = Math.sin(t * 0.5) * 0.45;
      const breathe = 1 + Math.sin(t * 2.2) * 0.05;
      const R = SIZE * 0.4 * breathe, c = SIZE / 2;
      ctx.clearRect(0, 0, SIZE, SIZE);
      const g = ctx.createRadialGradient(c, c, 0, c, c, R * 1.25);
      g.addColorStop(0, color + '33'); g.addColorStop(1, color + '00');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c, c, R * 1.25, 0, 6.283); ctx.fill();
      ctx.fillStyle = color;
      const cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      for (const p of pts) {
        let x = p[0] * cy - p[2] * sy, z = p[0] * sy + p[2] * cy, y = p[1];
        const y2 = y * cx - z * sx; z = y * sx + z * cx; y = y2;
        const wave = 1 + Math.sin(t * 3 + p[3]) * 0.04;
        const depth = (z + 1) / 2;
        ctx.globalAlpha = 0.15 + depth * 0.85;
        ctx.beginPath(); ctx.arc(c + x * R * wave, c + y * R * wave, 0.5 + depth * 1.1, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    return {
      el: cv,
      start() { color = (css('--primary') || '#00E5FF').slice(0, 7); if (!raf) { t0 = 0; raf = requestAnimationFrame(frame); } if (RM) { cancelAnimationFrame(raf); raf = 0; frame(performance.now()); cancelAnimationFrame(raf); raf = 0; } },
      stop() { cancelAnimationFrame(raf); raf = 0; }
    };
  }

  function initOrb() {
    const bar = document.getElementById('loading');
    if (!bar || bar.querySelector('.fx-orb')) return;
    const o = orb(bar);
    bar.classList.add('has-orb');
    bar.insertBefore(o.el, document.getElementById('loadText') || null);
    const sync = () => (bar.hidden ? o.stop() : o.start());
    new MutationObserver(sync).observe(bar, { attributes: true, attributeFilter: ['hidden'] });
    document.addEventListener('visibilitychange', () => (document.hidden ? o.stop() : sync()));
    sync();
  }

  /* ───────── خانات كود التحقق ───────── */
  function initOtp() {
    document.querySelectorAll('input.code-input').forEach(inp => {
      if (inp.dataset.otp) return;
      inp.dataset.otp = '1';
      const len = Number(inp.maxLength) > 0 ? Number(inp.maxLength) : 6;
      const wrap = document.createElement('div'); wrap.className = 'otp'; wrap.dir = 'ltr';
      const boxes = [];
      for (let i = 0; i < len; i++) { const b = document.createElement('span'); b.className = 'otp-box'; b.setAttribute('aria-hidden', 'true'); boxes.push(b); wrap.append(b); }
      inp.parentNode.insertBefore(wrap, inp);
      wrap.append(inp);
      inp.classList.add('otp-real');
      inp.removeAttribute('placeholder');
      const paint = () => {
        const v = inp.value, f = document.activeElement === inp;
        boxes.forEach((b, i) => {
          const had = b.textContent;
          b.textContent = v[i] || '';
          b.classList.toggle('filled', !!v[i]);
          b.classList.toggle('active', f && i === Math.min(v.length, len - 1) && v.length < len);
          if (v[i] && had !== v[i] && !RM) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
        });
        wrap.classList.toggle('done', v.length === len);
      };
      ['input', 'focus', 'blur', 'keyup', 'change'].forEach(e => inp.addEventListener(e, () => setTimeout(paint)));
      // أي تغيير برمجي للقيمة (مسح الحقل مثلاً) يظهر أيضاً
      setInterval(() => { if (inp.value !== inp._last) { inp._last = inp.value; paint(); } }, 300);
      paint();
    });
  }

  function init() { initOrb(); initOtp(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
