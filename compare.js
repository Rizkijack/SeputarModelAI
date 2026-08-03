/* ==========================================================================
   SEPUTARMODELAI — compare.js
   Engine komparasi GENERIK untuk semua halaman provider.
   Membaca data dari window.PROVIDER_MODELS (di-set oleh file data provider).
   Fitur: filter kategori, search real-time, sort kolom, modal detail.
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

  function parsePrice(str) {
    if (!str || str === "—") return Infinity;
    return parseFloat(str.replace(/[^0-9.]/g, "")) || 0;
  }

  function parseContext(str) {
    if (!str || str === "—") return 0;
    const m = str.match(/([\d.]+)\s*(K|M)?/i);
    if (!m) return 0;
    const n = parseFloat(m[1]);
    if (m[2] && m[2].toUpperCase() === "K") return n * 1000;
    if (m[2] && m[2].toUpperCase() === "M") return n * 1000000;
    return n;
  }

  function parseParams(str) {
    if (!str || str === "Proprietary" || str === "—") return 0;
    const m = str.match(/([\d.]+)/);
    return m ? parseFloat(m[1]) : 0;
  }

  /* ---------- Filter & Sort ---------- */
  function getFilteredModels() {
    let list = [...(window.PROVIDER_MODELS || [])];
    if (activeFilter !== "all") {
      const filterButton = document.querySelector(`.filter-btn[data-filter="${activeFilter}"]`);
      const filterProperty = filterButton && filterButton.dataset.filterProperty;
      list = filterProperty
        ? list.filter((m) => Boolean(m[filterProperty]))
        : list.filter((m) => m.category === activeFilter);
    }
    if (!showLegacy) {
      list = list.filter((m) => m.status !== "deprecated");
    }
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
    if (currentSort.key) {
      const k = currentSort.key;
      const asc = currentSort.asc;
      list.sort((a, b) => {
        let va, vb;
        switch (k) {
          case "name":
            va = a.name.toLowerCase(); vb = b.name.toLowerCase();
            return asc ? va.localeCompare(vb) : vb.localeCompare(va);
          case "params":
            va = parseParams(a.params); vb = parseParams(b.params); break;
          case "context":
            va = parseContext(a.context); vb = parseContext(b.context); break;
          case "inputPrice":
            va = parsePrice(a.inputPrice); vb = parsePrice(b.inputPrice); break;
          case "outputPrice":
            va = parsePrice(a.outputPrice); vb = parsePrice(b.outputPrice); break;
          default: return 0;
        }
        return asc ? va - vb : vb - va;
      });
    }
    return list;
  }

  /* ---------- Render Table ---------- */
  function renderTable() {
    const tbody = $("#compareBody");
    if (!tbody) return;
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
        const statusBadge = {
          "general-availability": '<span class="badge badge-ga">GA</span>',
          preview: '<span class="badge badge-limited">Preview</span>',
          unreleased: '<span class="badge badge-unreleased">Belum dirilis</span>',
          deprecated: '<span class="badge badge-dep">Deprecated</span>'
        }[m.status] || '<span class="badge badge-ga">GA</span>';
        const modalities = m.modalities
          .map((mod) => `<span class="badge badge-modality">${mod}</span>`).join(" ");

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
            <td><button class="btn-detail" data-id="${m.id}">Detail</button></td>
          </tr>`;
      }).join("");

    tbody.querySelectorAll(".btn-detail").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.id));
    });
  }

  /* ---------- Modal ---------- */
  function openModal(id) {
    const models = window.PROVIDER_MODELS || [];
    const m = models.find((x) => x.id === id);
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
        ${m.cachePrice ? `<div class="meta-item"><div class="meta-label">Harga Cache Hit</div><div class="meta-value">${m.cachePrice}</div></div>` : ""}
        ${m.sourceUrl ? `<div class="meta-item"><div class="meta-label">Sumber</div><div class="meta-value"><a href="${m.sourceUrl}" target="_blank" rel="noopener">${m.source || "Dokumentasi"}</a></div></div>` : ""}
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
  }

  function closeModal() {
    $("#modalOverlay").classList.remove("show");
    document.body.style.overflow = "";
  }

  /* ---------- Navbar (shared simple logic) ---------- */
  function initNavbar() {
    const navbar = $("#navbar");
    if (navbar) {
      const onScroll = () => {
        navbar.classList.toggle("scrolled", window.scrollY > 30);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    const toggle = $("#navToggle");
    const links = $(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", () => links.classList.toggle("open"));
      $$(".nav-links a").forEach((link) =>
        link.addEventListener("click", () => links.classList.remove("open"))
      );
    }
  }

  /* ---------- Init ---------- */
  function init() {
    initNavbar();
    renderTable();

    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.dataset.filter;
        renderTable();
      });
    });

    const searchInput = $("#searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim();
        renderTable();
      });
    }

    const legacyBtn = $("#toggleLegacy");
    if (legacyBtn) {
      legacyBtn.addEventListener("click", () => {
        showLegacy = !showLegacy;
        legacyBtn.classList.toggle("active", showLegacy);
        legacyBtn.textContent = showLegacy ? "Sembunyikan Legacy" : "Tampilkan Legacy";
        renderTable();
      });
    }

    $$(".sortable").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.dataset.sort;
        if (currentSort.key === key) currentSort.asc = !currentSort.asc;
        else { currentSort.key = key; currentSort.asc = true; }
        $$(".sortable").forEach((t) => t.classList.remove("sort-active"));
        th.classList.add("sort-active");
        renderTable();
      });
    });

    const modalClose = $("#modalClose");
    const modalOverlay = $("#modalOverlay");
    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Expose for safety */
  window.openModal = openModal;
})();