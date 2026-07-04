/* ==========================================================================
   SEPUTARMODELAI — app.js
   Hero stats global + tabel komparasi Mistral (filter, sort, search, modal).
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- State ---------- */
  let activeFilter = "all";
  let showLegacy = false;
  let currentSort = { key: null, asc: true };
  let searchQuery = "";

  /* ---------- Helpers ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* Parse price string to number (e.g. "$2.00" → 2) */
  function parsePrice(str) {
    if (!str || str === "—") return Infinity;
    return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
  }

  /* Parse context (e.g. "131K tokens" → 131000) */
  function parseContext(str) {
    if (!str || str === "—") return 0;
    const m = str.match(/([\d.]+)\s*(K|M)?/i);
    if (!m) return 0;
    const n = parseFloat(m[1]);
    if (m[2] && m[2].toUpperCase() === "K") return n * 1000;
    if (m[2] && m[2].toUpperCase() === "M") return n * 1000000;
    return n;
  }

  /* Parse params to rough number for sorting */
  function parseParams(str) {
    if (!str || str === "Proprietary" || str === "—") return 0;
    const m = str.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : 0;
  }

  /* ---------- Filter & Sort ---------- */
  function getFilteredModels() {
    let list = [...window.MISTRAL_MODELS];

    /* Category filter */
    if (activeFilter !== "all") {
      list = list.filter((m) => m.category === activeFilter);
    }

    /* Legacy toggle */
    if (!showLegacy) {
      list = list.filter((m) => m.status !== "deprecated");
    }

    /* Search */
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.family.toLowerCase().includes(q) ||
          m.categoryLabel.toLowerCase().includes(q) ||
          m.apiName.toLowerCase().includes(q) ||
          m.tagline.toLowerCase().includes(q)
      );
    }

    /* Sort */
    if (currentSort.key) {
      const k = currentSort.key;
      const asc = currentSort.asc;
      list.sort((a, b) => {
        let va, vb;
        switch (k) {
          case "name":
            va = a.name.toLowerCase();
            vb = b.name.toLowerCase();
            return asc ? va.localeCompare(vb) : vb.localeCompare(va);
          case "params":
            va = parseParams(a.params);
            vb = parseParams(b.params);
            break;
          case "context":
            va = parseContext(a.context);
            vb = parseContext(b.context);
            break;
          case "inputPrice":
            va = parsePrice(a.inputPrice);
            vb = parsePrice(b.inputPrice);
            break;
          case "outputPrice":
            va = parsePrice(a.outputPrice);
            vb = parsePrice(b.outputPrice);
            break;
          default:
            return 0;
        }
        return asc ? va - vb : vb - va;
      });
    }

    return list;
  }

  /* ---------- Render Table ---------- */
  function renderTable() {
    const tbody = $("#compareBody");
    const list = getFilteredModels();

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="8">
          <div class="empty-state">
            <div class="icon">🔍</div>
            <p>Tidak ada model ditemukan. Coba ubah filter atau kata kunci.</p>
          </div>
        </td></tr>`;
      return;
    }

    tbody.innerHTML = list
      .map((m) => {
        const isDep = m.status === "deprecated";
        const ow = m.openWeight ? '<span class="open-weight" title="Open-Weight">🔓</span>' : "";
        const statusBadge = isDep
          ? '<span class="badge badge-dep">Deprecated</span>'
          : '<span class="badge badge-ga">GA</span>';
        const modalities = m.modalities
          .map((mod) => `<span class="badge badge-modality">${mod}</span>`)
          .join(" ");

        return `
          <tr class="${isDep ? "deprecated" : ""} fade-in">
            <td>
              <div class="model-name">${m.name}${ow}</div>
              <div class="model-api">${m.apiName}</div>
            </td>
            <td style="font-family:var(--mono);font-size:.8rem;">${m.params}</td>
            <td style="font-family:var(--mono);font-size:.8rem;">${m.context}</td>
            <td style="font-family:var(--mono);font-size:.8rem;">${m.inputPrice}</td>
            <td style="font-family:var(--mono);font-size:.8rem;">${m.outputPrice}</td>
            <td>${modalities}</td>
            <td>${statusBadge}</td>
            <td><button class="btn-detail" onclick="openModal('${m.id}')">Detail</button></td>
          </tr>`;
      })
      .join("");
  }

  /* ---------- Render Hero Stats (Global) ---------- */
  function renderHeroStats() {
    const el = $("#heroStats");
    const all = window.MISTRAL_MODELS;
    const ga = all.filter((m) => m.status === "general-availability").length;
    const ow = all.filter((m) => m.openWeight).length;
    const cats = new Set(all.map((m) => m.category)).size;

    el.innerHTML = `
      <div class="hero-stat"><div class="num">${all.length}</div><div class="label">Model AI</div></div>
      <div class="hero-stat"><div class="num">${ga}</div><div class="label">Aktif (GA)</div></div>
      <div class="hero-stat"><div class="num">${ow}</div><div class="label">Open-Weight</div></div>
      <div class="hero-stat"><div class="num">${cats}</div><div class="label">Kategori</div></div>
    `;
  }

  /* ---------- Modal ---------- */
  window.openModal = function (id) {
    const m = window.MISTRAL_MODELS.find((x) => x.id === id);
    if (!m) return;

    const ow = m.openWeight ? "🔓 Open-Weight" : "🔒 Proprietary";
    const modalities = m.modalities.join(", ");
    const strengths = m.strengths.map((s) => `<li>${s}</li>`).join("");

    $("#modalContent").innerHTML = `
      <h2>${m.name}</h2>
      <div class="modal-tagline">${m.tagline}</div>
      <div class="modal-meta">
        <div class="meta-item"><div class="meta-label">API Name</div><div class="meta-value">${m.apiName}</div></div>
        <div class="meta-item"><div class="meta-label">Parameter</div><div class="meta-value">${m.params}</div></div>
        <div class="meta-item"><div class="meta-label">Konteks</div><div class="meta-value">${m.context}</div></div>
        <div class="meta-item"><div class="meta-label">Harga Input</div><div class="meta-value">${m.inputPrice}</div></div>
        <div class="meta-item"><div class="meta-label">Harga Output</div><div class="meta-value">${m.outputPrice}</div></div>
        <div class="meta-item"><div class="meta-label">Modalitas</div><div class="meta-value">${modalities}</div></div>
        <div class="meta-item"><div class="meta-label">Lisensi</div><div class="meta-value">${ow}</div></div>
        <div class="meta-item"><div class="meta-label">Rilis</div><div class="meta-value">${m.release}</div></div>
      </div>
      <h3>Keunggulan</h3>
      <ul class="strength-list">${strengths}</ul>
      <h3>Cocok Untuk</h3>
      <p class="best-for">${m.bestFor}</p>
      <h3>Cerita Model</h3>
      <div class="story-text">${m.story}</div>
    `;

    $("#modalOverlay").classList.add("show");
    document.body.style.overflow = "hidden";
  };

  function closeModal() {
    $("#modalOverlay").classList.remove("show");
    document.body.style.overflow = "";
  }

  /* ---------- Navbar scroll effect ---------- */
  function initNavbarScroll() {
    const navbar = $("#navbar");
    const onScroll = () => {
      if (window.scrollY > 30) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Event Listeners ---------- */
  function init() {
    renderHeroStats();
    renderTable();
    initNavbarScroll();

    /* Filter buttons */
    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.filter;
        renderTable();
      });
    });

    /* Search */
    $("#searchInput").addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderTable();
    });

    /* Legacy toggle */
    const legacyBtn = $("#toggleLegacy");
    legacyBtn.addEventListener("click", () => {
      showLegacy = !showLegacy;
      legacyBtn.classList.toggle("active", showLegacy);
      legacyBtn.textContent = showLegacy ? "Sembunyikan Legacy" : "Tampilkan Legacy";
      renderTable();
    });

    /* Sortable headers */
    $$(".sortable").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.dataset.sort;
        if (currentSort.key === key) {
          currentSort.asc = !currentSort.asc;
        } else {
          currentSort.key = key;
          currentSort.asc = true;
        }
        $$(".sortable").forEach((t) => t.classList.remove("sort-active"));
        th.classList.add("sort-active");
        renderTable();
      });
    });

    /* Modal close */
    $("#modalClose").addEventListener("click", closeModal);
    $("#modalOverlay").addEventListener("click", (e) => {
      if (e.target === $("#modalOverlay")) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });

    /* Navbar mobile toggle */
    $("#navToggle").addEventListener("click", () => {
      $(".nav-links").classList.toggle("open");
    });
    $$(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        $(".nav-links").classList.remove("open");
      });
    });
  }

  /* ---------- Boot ---------- */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
