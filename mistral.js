/* ==========================================================================
   SEPUTARMODELAI — mistral.js
   Logika untuk halaman komparasi Mistral (filter, sort, search, modal).
   Membaca data dari window.MISTRAL_MODELS (di-set oleh data/models.js).
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

  const LOG_PREFIX = "[mistral]";

  function logError(context, err) {
    console.error(`${LOG_PREFIX} ${context}:`, err);
  }

  function logWarning(context, detail) {
    console.warn(`${LOG_PREFIX} ${context}: ${detail}`);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
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

  function showTableError(message) {
    const tbody = $("#compareBody");
    if (!tbody) return;
    tbody.innerHTML = `
      <tr><td colspan="8">
        <div class="empty-state">
          <div class="icon">⚠️</div>
          <p>${escapeHtml(message)}</p>
        </div>
      </td></tr>`;
  }

  /** Sumber data tunggal; melempar bila data model gagal dimuat. */
  function getModels() {
    const models = window.MISTRAL_MODELS;
    if (!Array.isArray(models)) {
      throw new Error(
        "window.MISTRAL_MODELS bukan array — data/models.js kemungkinan gagal dimuat"
      );
    }
    return models;
  }

  function textField(model, key) {
    const value = model[key];
    if (typeof value === "string") return value.toLowerCase();
    if (value !== undefined && value !== null) {
      logWarning("textField", `model "${model.id}" punya field "${key}" non-string`);
    }
    return "";
  }

  function listField(model, key) {
    const value = model[key];
    if (Array.isArray(value)) return value;
    logWarning("listField", `model "${model.id}" tidak punya array "${key}"`);
    return [];
  }

  function parsePrice(str) {
    if (str === undefined || str === null || str === "" || str === "—") return Infinity;
    const n = parseFloat(String(str).replace(/[^0-9.]/g, ""));
    if (Number.isNaN(n)) {
      logWarning("parsePrice", `harga tidak dapat diurai: "${str}"`);
      return Infinity;
    }
    return n;
  }

  function parseContext(str) {
    if (str === undefined || str === null || str === "" || str === "—") return 0;
    const m = String(str).match(/([\d.]+)\s*(K|M)?/i);
    if (!m) {
      logWarning("parseContext", `konteks tidak dapat diurai: "${str}"`);
      return 0;
    }
    const n = parseFloat(m[1]);
    if (Number.isNaN(n)) {
      logWarning("parseContext", `konteks tidak dapat diurai: "${str}"`);
      return 0;
    }
    if (m[2] && m[2].toUpperCase() === "K") return n * 1000;
    if (m[2] && m[2].toUpperCase() === "M") return n * 1000000;
    return n;
  }

  function parseParams(str) {
    if (str === undefined || str === null || str === "" || str === "Proprietary" || str === "—") {
      return 0;
    }
    const m = String(str).match(/([\d.]+)/);
    if (!m) {
      logWarning("parseParams", `parameter tidak dapat diurai: "${str}"`);
      return 0;
    }
    return parseFloat(m[1]);
  }

  /* ---------- Filter & Sort ---------- */
  function matchesQuery(model, q) {
    return (
      textField(model, "name").includes(q) ||
      textField(model, "family").includes(q) ||
      textField(model, "categoryLabel").includes(q) ||
      textField(model, "apiName").includes(q) ||
      textField(model, "tagline").includes(q)
    );
  }

  function getFilteredModels() {
    let list = getModels().filter((m) => {
      if (m && typeof m === "object") return true;
      logWarning("getFilteredModels", `entri data bukan objek model: ${JSON.stringify(m)}`);
      return false;
    });

    if (activeFilter !== "all") {
      list = list.filter((m) => m.category === activeFilter);
    }
    if (!showLegacy) {
      list = list.filter((m) => m.status !== "deprecated");
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((m) => matchesQuery(m, q));
    }
    if (currentSort.key) {
      const k = currentSort.key;
      const asc = currentSort.asc;
      list.sort((a, b) => {
        let va, vb;
        switch (k) {
          case "name":
            va = textField(a, "name"); vb = textField(b, "name");
            return asc ? va.localeCompare(vb) : vb.localeCompare(va);
          case "params":
            va = parseParams(a.params); vb = parseParams(b.params); break;
          case "context":
            va = parseContext(a.context); vb = parseContext(b.context); break;
          case "inputPrice":
            va = parsePrice(a.inputPrice); vb = parsePrice(b.inputPrice); break;
          case "outputPrice":
            va = parsePrice(a.outputPrice); vb = parsePrice(b.outputPrice); break;
          default:
            logWarning("getFilteredModels", `kolom sort tidak dikenal: "${k}"`);
            return 0;
        }
        return asc ? va - vb : vb - va;
      });
    }
    return list;
  }

  /* ---------- Render Table ---------- */
  function renderRow(m) {
    const isDep = m.status === "deprecated";
    const ow = m.openWeight ? '<span class="open-weight" title="Open-Weight">🔓</span>' : "";
    const statusBadge = isDep
      ? '<span class="badge badge-dep">Deprecated</span>'
      : '<span class="badge badge-ga">GA</span>';
    const modalities = listField(m, "modalities")
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
  }

  function renderTable() {
    const tbody = $("#compareBody");
    if (!tbody) {
      logError("renderTable", new Error("Elemen #compareBody tidak ditemukan di halaman"));
      return;
    }

    let list;
    try {
      list = getFilteredModels();
    } catch (err) {
      logError("renderTable", err);
      showTableError("Gagal memuat data model. Coba muat ulang halaman.");
      return;
    }

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

    const rows = [];
    list.forEach((m) => {
      try {
        rows.push(renderRow(m));
      } catch (err) {
        logError(`renderRow model "${m.id}"`, err);
      }
    });

    if (rows.length === 0) {
      showTableError("Data model tidak dapat ditampilkan karena formatnya tidak valid.");
      return;
    }

    tbody.innerHTML = rows.join("");

    tbody.querySelectorAll(".btn-detail").forEach((btn) => {
      btn.addEventListener("click", () => openModal(btn.dataset.id));
    });
  }

  /* ---------- Modal ---------- */
  function buildModalHtml(m) {
    const ow = m.openWeight ? "🔓 Open-Weight" : "🔒 Proprietary";
    const modalities = listField(m, "modalities").join(", ");
    const strengths = listField(m, "strengths").map((s) => `<li>${s}</li>`).join("");

    return `
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
  }

  /** @returns {boolean} true bila modal berhasil ditampilkan. */
  function openModal(id) {
    const content = $("#modalContent");
    const overlay = $("#modalOverlay");
    try {
      if (!content || !overlay) {
        throw new Error("Elemen #modalContent / #modalOverlay tidak ditemukan di halaman");
      }
      const m = getModels().find((x) => x && x.id === id);
      if (!m) throw new Error(`Model dengan id "${id}" tidak ditemukan pada data provider`);
      content.innerHTML = buildModalHtml(m);
      overlay.classList.add("show");
      document.body.style.overflow = "hidden";
      return true;
    } catch (err) {
      logError(`openModal("${id}")`, err);
      if (content && overlay) {
        content.innerHTML = `
          <h2>Detail tidak tersedia</h2>
          <p class="best-for">Detail model ini gagal ditampilkan. Coba muat ulang halaman.</p>`;
        overlay.classList.add("show");
        document.body.style.overflow = "hidden";
      }
      return false;
    }
  }

  function closeModal() {
    const overlay = $("#modalOverlay");
    if (!overlay) {
      logError("closeModal", new Error("Elemen #modalOverlay tidak ditemukan di halaman"));
      return;
    }
    overlay.classList.remove("show");
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
    wire("navbar", initNavbar);
    wire("render tabel", renderTable);

    wire("tombol filter", () => {
      $$(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          $$(".filter-btn").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          activeFilter = btn.dataset.filter;
          renderTable();
        });
      });
    });

    wire("input pencarian", () => {
      const searchInput = requireEl("#searchInput");
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim();
        renderTable();
      });
    });

    wire("toggle legacy", () => {
      const legacyBtn = requireEl("#toggleLegacy");
      legacyBtn.addEventListener("click", () => {
        showLegacy = !showLegacy;
        legacyBtn.classList.toggle("active", showLegacy);
        legacyBtn.textContent = showLegacy ? "Sembunyikan Legacy" : "Tampilkan Legacy";
        renderTable();
      });
    });

    wire("header sortable", () => {
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
    });

    wire("modal", () => {
      const modalClose = requireEl("#modalClose");
      const modalOverlay = requireEl("#modalOverlay");
      modalClose.addEventListener("click", closeModal);
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
      });
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
