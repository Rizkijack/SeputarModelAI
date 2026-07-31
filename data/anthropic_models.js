/* ==========================================================================
   DATA: Seluruh model Anthropic (Claude 5 series & Legacy)
   Sumber resmi: Anthropic & OpenRouter
   Diperbarui per Juli 2026.
   ========================================================================== */

const ANTHROPIC_MODELS = [
  /* =========================== CLAUDE 5 SERIES (AKTIF) =========================== */
  {
    id: "claude-5-opus",
    family: "Claude",
    name: "Claude 5 Opus",
    apiName: "claude-5-opus-latest",
    version: "202605",
    category: "generalist",
    categoryLabel: "Generalist / Flagship",
    params: "Proprietary",
    context: "1M tokens",
    inputPrice: "$5.00",
    outputPrice: "$25.00",
    modalities: ["Teks", "Vision", "Dokumen"],
    openWeight: false,
    status: "general-availability",
    release: "2026-05",
    tagline: "Model flagship dengan kecerdasan tertinggi dan pemahaman instruksi kompleks.",
    strengths: ["Reasoning tingkat lanjut", "Kapasitas konteks 1 juta token", "Akurasi faktual sangat tinggi", "Koding & Matematika frontier"],
    bestFor: "Analisis kompleks, tugas agen otonom, riset tingkat tinggi, penulisan mendalam.",
    story: "Claude 5 Opus adalah puncak dari seri Claude terbaru, mengungguli pendahulunya dalam pemecahan masalah rumit dengan jendela konteks masif 1 juta token."
  },
  {
    id: "claude-5-opus-fast",
    family: "Claude",
    name: "Claude 5 Opus (Fast)",
    apiName: "claude-5-opus-fast-latest",
    version: "202605",
    category: "generalist",
    categoryLabel: "Generalist / Flagship",
    params: "Proprietary",
    context: "1M tokens",
    inputPrice: "$10.00",
    outputPrice: "$50.00",
    modalities: ["Teks", "Vision", "Dokumen"],
    openWeight: false,
    status: "general-availability",
    release: "2026-05",
    tagline: "Varian Opus yang dioptimalkan untuk latensi sangat rendah.",
    strengths: ["Kecerdasan Opus penuh", "Kecepatan inferensi tinggi", "Latensi sangat rendah"],
    bestFor: "Sistem agen real-time, trading otomatis, alur kerja di mana kecepatan adalah kritis namun butuh kecerdasan maksimal.",
    story: "Versi premium dari Opus yang menggunakan infrastruktur terdedikasi untuk memberikan respons nyaris real-time."
  },
  {
    id: "claude-5-sonnet",
    family: "Claude",
    name: "Claude 5 Sonnet",
    apiName: "claude-5-sonnet-latest",
    version: "202604",
    category: "coding",
    categoryLabel: "Coding / Generalist",
    params: "Proprietary",
    context: "1M tokens",
    inputPrice: "$2.00",
    outputPrice: "$10.00",
    modalities: ["Teks", "Vision", "Dokumen"],
    openWeight: false,
    status: "general-availability",
    release: "2026-04",
    tagline: "Keseimbangan sempurna antara kecepatan dan kecerdasan, spesialis coding.",
    strengths: ["Koding luar biasa", "Keseimbangan biaya/performa", "Cepat", "Konteks 1M token"],
    bestFor: "Claude Code, asisten coding IDE, generasi konten massal, dan aplikasi web skala besar.",
    story: "Melanjutkan tradisi 3.5 Sonnet, seri 5 Sonnet adalah kuda beban utama untuk para developer dengan kecerdasan koding yang melampaui Opus di beberapa benchmark."
  },
  {
    id: "claude-5-fable",
    family: "Claude",
    name: "Claude 5 Fable",
    apiName: "claude-5-fable-latest",
    version: "202606",
    category: "reasoning",
    categoryLabel: "Reasoning / Agent",
    params: "Proprietary",
    context: "1M tokens",
    inputPrice: "$3.00",
    outputPrice: "$15.00",
    modalities: ["Teks", "Vision"],
    openWeight: false,
    status: "general-availability",
    release: "2026-06",
    tagline: "Model khusus untuk alur kerja agen (autonomous knowledge work) dan penalaran mendalam.",
    strengths: ["Extended thinking", "Perencanaan multi-langkah", "Penggunaan alat otonom (tool-use)"],
    bestFor: "Agen AI otonom, riset mandiri, analisis hukum dan finansial mendalam.",
    story: "Fable adalah keluarga baru dalam seri 5, dirancang secara khusus untuk bekerja secara otonom dalam durasi panjang dengan kemampuan 'berpikir' (extended thinking) sebelum merespons."
  },

  /* =========================== CLAUDE 3.5 SERIES =========================== */
  {
    id: "claude-3-5-sonnet",
    family: "Claude",
    name: "Claude 3.5 Sonnet",
    apiName: "claude-3-5-sonnet-20241022",
    version: "20241022",
    category: "coding",
    categoryLabel: "Coding / Generalist",
    params: "Proprietary",
    context: "200K tokens",
    inputPrice: "$3.00",
    outputPrice: "$15.00",
    modalities: ["Teks", "Vision"],
    openWeight: false,
    status: "deprecated",
    release: "2024-10",
    tagline: "Sang legenda coding asisten 2024 yang menetapkan standar baru.",
    strengths: ["Kemampuan koding legendaris", "Analisis dokumen presisi tinggi", "Cepat"],
    bestFor: "Tugas pengembangan perangkat lunak (legacy). Direkomendasikan migrasi ke Claude 5 Sonnet.",
    story: "Model yang sempat mendominasi leaderboard koding di dunia AI sepanjang akhir 2024 hingga 2025."
  },
  {
    id: "claude-3-5-haiku",
    family: "Claude",
    name: "Claude 3.5 Haiku",
    apiName: "claude-3-5-haiku-20241022",
    version: "20241022",
    category: "generalist",
    categoryLabel: "Speed / Efficiency",
    params: "Proprietary",
    context: "200K tokens",
    inputPrice: "$0.25",
    outputPrice: "$1.25",
    modalities: ["Teks"],
    openWeight: false,
    status: "deprecated",
    release: "2024-10",
    tagline: "Model paling cepat dan murah dari seri 3.5.",
    strengths: ["Latensi sub-detik", "Harga sangat murah", "Pemahaman teks instan"],
    bestFor: "Tugas moderasi on-the-fly, transkripsi, klasifikasi data massal.",
    story: "Haiku menawarkan kecerdasan Sonnet generasi sebelumnya namun dengan harga dan kecepatan yang cocok untuk tugas volume tinggi."
  },

  /* =========================== CLAUDE 3 SERIES (LEGACY) =========================== */
  {
    id: "claude-3-opus",
    family: "Claude",
    name: "Claude 3 Opus",
    apiName: "claude-3-opus-20240229",
    version: "20240229",
    category: "generalist",
    categoryLabel: "Generalist (Legacy)",
    params: "Proprietary",
    context: "200K tokens",
    inputPrice: "$15.00",
    outputPrice: "$75.00",
    modalities: ["Teks", "Vision"],
    openWeight: false,
    status: "deprecated",
    release: "2024-02",
    tagline: "Model andalan awal 2024 yang melampaui batas kecerdasan.",
    strengths: ["Gaya penulisan natural", "Kreativitas tingkat tinggi"],
    bestFor: "Tugas legacy yang bergantung pada 'rasa' tulisan Opus lama.",
    story: "Mantan juara flagship. Claude 3 Opus diingat karena cara komunikasinya yang sangat manusiawi dan elok."
  }
];

if (typeof window !== 'undefined') {
  window.ANTHROPIC_MODELS = ANTHROPIC_MODELS;
}
