(function() {
  "use strict";
  var me = document.currentScript;
  var page = me && me.getAttribute("data-page") || "";
  var base = me && me.src ? me.src : location.href;
  var at = function(p) {
    return new URL(p, base).href;
  };
  var UPD = at("../sec/upd.html"), ERR = at("../sec/error.html"), HOME = at("../index.html");
  var KEY_UNTIL = "sirb-guard-until", KEY_N = "sirb-guard-n";
  var cfg = window.SIRB_CONFIG || {};
  var origLog = console.log;
  if (cfg.DEBUG !== true) {
    ["log", "info", "warn", "error", "debug", "trace", "table", "dir", "dirxml"].forEach(function(m) {
      try {
        console[m] = function() {
        };
      } catch (e) {
      }
    });
    window.addEventListener("error", function(e) {
      e.preventDefault();
    }, true);
    window.addEventListener("unhandledrejection", function(e) {
      e.preventDefault();
    });
  }
  var servers = (Array.isArray(cfg.WORKER_URLS) ? cfg.WORKER_URLS : [cfg.WORKER_URL]).map(function(u) {
    return String(u || "").replace(/\/+$/, "");
  }).filter(function(u) {
    return /^https:\/\//.test(u) && !/YOUR-WORKER/i.test(u);
  });
  function store(k, v) {
    try {
      if (v === void 0) return localStorage.getItem(k);
      localStorage.setItem(k, v);
    } catch (e) {
      return null;
    }
  }
  function go(u) {
    if (location.href.split("#")[0] !== u) location.replace(u);
  }
  async function post(path, body) {
    for (var i = 0; i < servers.length; i++) {
      try {
        var ctrl = new AbortController();
        var t = setTimeout(function() {
          ctrl.abort();
        }, 8e3);
        var r = await fetch(servers[i] + path, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          cache: "no-store",
          referrerPolicy: "no-referrer",
          headers: { "Content-Type": "application/json", "X-Sirb": "1" },
          body: JSON.stringify(body || {}),
          signal: ctrl.signal
        });
        clearTimeout(t);
        var d = await r.json().catch(function() {
          return null;
        });
        if (d) return d;
      } catch (e) {
      }
    }
    return null;
  }
  async function checkLock() {
    if (!servers.length || document.hidden && page !== "upd") return;
    var d = await post("/status", {});
    if (!d || d.ok !== true) return;
    if (d.lock === true) {
      if (page !== "upd") go(UPD);
    } else if (page === "upd") go(HOME);
  }
  checkLock();
  setInterval(checkLock, 6e3);
  document.addEventListener("visibilitychange", function() {
    if (!document.hidden) checkLock();
  });
  var mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform || "");
  var dpr0 = window.devicePixelRatio || 1;
  var hBase = null;
  var consoleHit = false;
  function bySize() {
    if (mobile || (window.devicePixelRatio || 1) !== dpr0) return false;
    if (!window.outerWidth || !window.outerHeight) return false;
    var w = window.outerWidth - window.innerWidth, h = window.outerHeight - window.innerHeight;
    if (hBase === null) hBase = Math.min(h, 160);
    return w > 170 || h - hBase > 170;
  }
  function byPause() {
    var t = performance.now();
    (function() {
      debugger;
    })();
    return performance.now() - t > 120;
  }
  function byConsole() {
    consoleHit = false;
    var probe = new Image();
    Object.defineProperty(probe, "id", { get: function() {
      consoleHit = true;
      return "";
    } });
    try {
      origLog.call(console, "%c", probe);
    } catch (e) {
    }
    return consoleHit;
  }
  function byBot() {
    return navigator.webdriver === true;
  }
  function isOpen() {
    return byBot() || bySize() || byConsole() || byPause();
  }
  var STEPS = [30, 120, 600, 1800, 7200];
  function trip(reason) {
    if (page === "error" || page === "upd") return;
    var n = Math.min(STEPS.length - 1, Number(store(KEY_N) || 0));
    store(KEY_N, String(n + 1));
    store(KEY_UNTIL, String(Date.now() + STEPS[n] * 1e3));
    store("sirb-guard-why", "tools");
    if (servers.length) post("/report", { reason, page: location.pathname.slice(-60) });
    go(ERR);
  }
  function punish(reason, secs) {
    var n = Number(store(KEY_N) || 0);
    store(KEY_N, String(n + 1));
    store(KEY_UNTIL, String(Math.max(Number(store(KEY_UNTIL) || 0), Date.now() + Math.max(30, Number(secs) || 300) * 1e3)));
    store("sirb-guard-why", String(reason || ""));
    if (servers.length) post("/report", { reason: String(reason || "punish"), page: location.pathname.slice(-60) });
    go(ERR);
  }
  window.SirbGuard = Object.freeze({ punish, why: function() {
    return store("sirb-guard-why") || "";
  }, isOpen, until: function() {
    return Number(store(KEY_UNTIL) || 0);
  }, home: HOME });
  if (page === "upd" || page === "error") return;
  if (Number(store(KEY_UNTIL) || 0) > Date.now()) {
    go(ERR);
    return;
  }
  document.addEventListener("keydown", function(e) {
    var k = String(e.key || "").toLowerCase();
    var mod = e.ctrlKey || e.metaKey;
    var bad = e.key === "F12" || mod && e.shiftKey && ["i", "j", "c", "k", "e", "m"].indexOf(k) >= 0 || e.metaKey && e.altKey && ["i", "j", "c", "u"].indexOf(k) >= 0 || mod && !e.shiftKey && k === "u";
    if (bad) {
      e.preventDefault();
      e.stopPropagation();
      trip("keys");
    }
  }, true);
  function scan() {
    if (byBot()) return trip("automation");
    if (bySize()) return trip("size");
    if (byConsole()) return trip("console");
    if (byPause()) return trip("pause");
  }
  setTimeout(scan, 400);
  setInterval(scan, 1500);
  window.addEventListener("resize", function() {
    setTimeout(scan, 300);
  });
})();
