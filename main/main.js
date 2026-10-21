(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', async function () {
    const { session, logout } = window.SirbApi;
    const user = await session();
    if (!user) { location.replace('../log/one.html'); return; }

    document.getElementById('userName').textContent = user.name;
    document.getElementById('inviteCode').textContent = user.inviteCode;
    document.getElementById('mainCard').hidden = false;

    const msg = document.getElementById('mainMsg');
    document.getElementById('copyLink').addEventListener('click', async function () {
      const url = new URL('../log/one.html', location.href);
      url.search = '?invite=' + encodeURIComponent(user.inviteCode);
      try {
        await navigator.clipboard.writeText(url.toString());
        msg.textContent = 'تم نسخ رابط الدعوة';
        msg.className = 'msg success';
      } catch (e) {
        msg.textContent = url.toString();
        msg.className = 'msg info';
      }
    });

    document.getElementById('logoutBtn').addEventListener('click', async function () {
      await logout();
      location.replace('../log/one.html');
    });
  });
})();
