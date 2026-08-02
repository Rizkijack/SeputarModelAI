/* ==========================================================================
   SEPUTARMODELAI — app.js
   Logika HANYA untuk beranda (navbar, scroll effect, mobile menu).
   ========================================================================== */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const LOG_PREFIX = "[app]";

  function logError(context, err) {
    console.error(`${LOG_PREFIX} ${context}:`, err);
  }

  function requireEl(sel) {
    const el = $(sel);
    if (!el) throw new Error(`Elemen ${sel} tidak ditemukan di halaman`);
    return el;
  }

  /** Jalankan langkah inisialisasi; kegagalan satu langkah tidak membatalkan sisanya. */
  function wire(label, fn) {
    try {
      fn();
    } catch (err) {
      logError(`init ${label}`, err);
    }
  }

  function initNavbarScroll() {
    const navbar = requireEl("#navbar");
    const onScroll = () => {
      if (window.scrollY > 30) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initMobileMenu() {
    const toggle = requireEl("#navToggle");
    const links = requireEl(".nav-links");

    toggle.addEventListener("click", () => links.classList.toggle("open"));
    $$(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => links.classList.remove("open"));
    });
  }

  function init() {
    wire("navbar scroll", initNavbarScroll);
    wire("menu mobile", initMobileMenu);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
