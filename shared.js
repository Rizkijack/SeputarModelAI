/* ==========================================================================
   SEPUTARMODELAI — shared.js
   Utilitas bersama untuk seluruh halaman: helper DOM, parser nilai model,
   navbar, dan engine halaman komparasi (filter, search, sort, modal).
   Halaman provider cukup memanggil SMAI.initComparePage({ ... }).
   ========================================================================== */

(function (global) {
  "use strict";

  /* ---------- DOM helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => (root || document).querySelectorAll(sel);

  /* ---------- Parser nilai model ---------- */
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

  const NUMERIC_PARSERS = {
    params: parseParams,
    context: parseContext,
    inputPrice: parsePrice,
    outputPrice: parsePrice
  };

  const SEARCH_FIELDS = ["name", "family", "categoryLabel", "apiName", "tagline"];

  const DEFAULT_STATUS_META = {
    deprecated: { label: "Deprecated", badgeClass: "badge-dep", legacy: true }
  };
  const FALLBACK_STATUS_META = { label: "GA", badgeClass: "badge-ga", legacy: false };

  const MONO_CELL = "font-family:var(--mono);font-size:.8rem;";

  /* ---------- Navbar ---------- */
  function initNavbar() {
    const navbar = $("#navbar");
    if (navbar) {
      const onScroll = () => {
        navbar.classList.toggle("scrolled", global.scrollY > 30);
      };
      global.addEventListener("scroll", onScroll, { passive: true });
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

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /* ---------- Engine halaman komparasi ---------- */
  function initComparePage(options) {
    const config = Object.assign(
      {
        getModels: () => global.PROVIDER_MODELS || [],
        /* Kolom monospace di antara kolom Model dan Modalitas. */
        columns: ["params", "context", "inputPrice", "outputPrice"],
        statusMeta: DEFAULT_STATUS_META,
        legacyRowClass: "deprecated",
        showOpenWeightIcon: true,
        showStatusInModal: false,
        accentColor: null,
        legacyLabels: { show: "Tampilkan Legacy", hide: "Sembunyikan Legacy" }
      },
      options
    );

    const state = {
      activeFilter: "all",
      showLegacy: false,
      searchQuery: "",
      sort: { key: null, asc: true }
    };

    const statusMetaOf = (model) =>
      config.statusMeta[model.status] || FALLBACK_STATUS_META;

    function getFilteredModels() {
      let list = [...config.getModels()];

      if (state.activeFilter !== "all") {
        list = list.filter((m) => m.category === state.activeFilter);
      }
      if (!state.showLegacy) {
        list = list.filter((m) => !statusMetaOf(m).legacy);
      }
      if (state.searchQuery) {
        const q = state.searchQuery.toLowerCase();
        list = list.filter((m) =>
          SEARCH_FIELDS.some((f) => (m[f] || "").toLowerCase().includes(q))
        );
      }

      const { key, asc } = state.sort;
      if (key) {
        list.sort((a, b) => {
          if (key === "name") {
            const va = a.name.toLowerCase();
            const vb = b.name.toLowerCase();
            return asc ? va.localeCompare(vb) : vb.localeCompare(va);
          }
          const parse = NUMERIC_PARSERS[key];
          if (!parse) return 0;
          const va = parse(a[key]);
          const vb = parse(b[key]);
          return asc ? va - vb : vb - va;
        });
      }
      return list;
    }

    function renderRow(m) {
      const status = statusMetaOf(m);
      const ow =
        config.showOpenWeightIcon && m.openWeight
          ? '<span class="open-weight" title="Open-Weight">🔓</span>'
          : "";
      const modalities = m.modalities
        .map((mod) => `<span class="badge badge-modality">${mod}</span>`)
        .join(" ");
      const cells = config.columns
        .map((key) => `<td style="${MONO_CELL}">${m[key]}</td>`)
        .join("");

      return `
        <tr class="${status.legacy ? config.legacyRowClass : ""} fade-in">
          <td>
            <div class="model-name">${m.name}${ow}</div>
            <div class="model-api">${m.apiName}</div>
          </td>
          ${cells}
          <td>${modalities}</td>
          <td><span class="badge ${status.badgeClass}">${status.label}</span></td>
          <td><button class="btn-detail" data-id="${m.id}">Detail</button></td>
        </tr>`;
    }

    function renderTable() {
      const tbody = $("#compareBody");
      if (!tbody) return;
      const list = getFilteredModels();

      if (list.length === 0) {
        tbody.innerHTML = `
          <tr><td colspan="${config.columns.length + 4}">
            <div class="empty-state">
              <div class="icon">🔍</div>
              <p>Tidak ada model ditemukan. Coba ubah filter atau kata kunci.</p>
            </div>
          </td></tr>`;
        return;
      }

      tbody.innerHTML = list.map(renderRow).join("");
      tbody.querySelectorAll(".btn-detail").forEach((btn) => {
        btn.addEventListener("click", () => openModal(btn.dataset.id));
      });
    }

    /* ---------- Modal ---------- */
    const META_LABELS = {
      params: "Parameter",
      context: "Konteks",
      inputPrice: "Harga Input",
      outputPrice: "Harga Output"
    };

    function metaItem(label, value) {
      return `<div class="meta-item"><div class="meta-label">${label}</div><div class="meta-value">${value}</div></div>`;
    }

    function openModal(id) {
      const m = config.getModels().find((x) => x.id === id);
      if (!m) return;

      const accent = config.accentColor ? ` style="color: ${config.accentColor};"` : "";
      const items = [metaItem("API Name", m.apiName)]
        .concat(config.columns.map((key) => metaItem(META_LABELS[key] || key, m[key])))
        .concat([
          metaItem("Modalitas", m.modalities.join(", ")),
          metaItem("Lisensi", m.openWeight ? "🔓 Open-Weight" : "🔒 Proprietary")
        ]);
      if (config.showStatusInModal) items.push(metaItem("Status", statusMetaOf(m).label));
      items.push(metaItem("Rilis", m.release));

      $("#modalContent").innerHTML = `
        <h2${accent}>${m.name}</h2>
        <div class="modal-tagline">${m.tagline}</div>
        <div class="modal-meta">${items.join("")}</div>
        <h3${accent}>Keunggulan</h3>
        <ul class="strength-list">${m.strengths.map((s) => `<li>${s}</li>`).join("")}</ul>
        <h3${accent}>Cocok Untuk</h3>
        <p class="best-for">${m.bestFor}</p>
        <h3${accent}>Cerita Model</h3>
        <div class="story-text">${m.story}</div>
      `;

      $("#modalOverlay").classList.add("show");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      const overlay = $("#modalOverlay");
      if (overlay) overlay.classList.remove("show");
      document.body.style.overflow = "";
    }

    /* ---------- Kontrol ---------- */
    function initControls() {
      $$(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          $$(".filter-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          state.activeFilter = btn.dataset.filter;
          renderTable();
        });
      });

      const searchInput = $("#searchInput");
      if (searchInput) {
        searchInput.addEventListener("input", (e) => {
          state.searchQuery = e.target.value.trim();
          renderTable();
        });
      }

      const legacyBtn = $("#toggleLegacy");
      if (legacyBtn) {
        legacyBtn.addEventListener("click", () => {
          state.showLegacy = !state.showLegacy;
          legacyBtn.classList.toggle("active", state.showLegacy);
          legacyBtn.textContent = state.showLegacy
            ? config.legacyLabels.hide
            : config.legacyLabels.show;
          renderTable();
        });
      }

      $$(".sortable").forEach((th) => {
        th.addEventListener("click", () => {
          const key = th.dataset.sort;
          if (state.sort.key === key) state.sort.asc = !state.sort.asc;
          else state.sort = { key, asc: true };
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

    onReady(() => {
      initNavbar();
      renderTable();
      initControls();
    });

    /* Expose untuk pemanggilan manual/debug */
    global.openModal = openModal;
  }

  global.SMAI = {
    $,
    $$,
    parsePrice,
    parseContext,
    parseParams,
    initNavbar,
    onReady,
    initComparePage,
    DEFAULT_STATUS_META
  };
})(window);
