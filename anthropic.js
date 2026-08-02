/* ==========================================================================
   SEPUTARMODELAI — anthropic.js
   Konfigurasi halaman komparasi Anthropic (tanpa kolom parameter, dengan
   status lifecycle Claude). Engine-nya ada di shared.js.
   ========================================================================== */

window.SMAI.initComparePage({
  getModels: () => window.ANTHROPIC_MODELS || [],
  columns: ["context", "inputPrice", "outputPrice"],
  statusMeta: {
    active: { label: "Active", badgeClass: "badge-ga", legacy: false },
    limited: { label: "Limited", badgeClass: "badge-limited", legacy: false },
    deprecated: { label: "Deprecated", badgeClass: "badge-dep", legacy: true },
    retired: { label: "Retired", badgeClass: "badge-retired", legacy: true }
  },
  legacyRowClass: "legacy",
  showOpenWeightIcon: false,
  showStatusInModal: true,
  accentColor: "#d97757",
  legacyLabels: {
    show: "Tampilkan model legacy",
    hide: "Sembunyikan model legacy"
  }
});
