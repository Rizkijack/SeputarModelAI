/* ==========================================================================
   SEPUTARMODELAI — app.js
   Logika HANYA untuk beranda (navbar, scroll effect, mobile menu).
   ========================================================================== */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function initNavbarScroll() {
    const navbar = $("#navbar");
    if (!navbar) return;
    const onScroll = () => {
      if (window.scrollY > 30) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initMobileMenu() {
    const toggle = $("#navToggle");
    const links = $(".nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", () => links.classList.toggle("open"));
    $$(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => links.classList.remove("open"));
    });
  }

  function init() {
    initNavbarScroll();
    initMobileMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
