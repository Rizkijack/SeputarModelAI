/* ==========================================================================
   DATA: Model Meta — Llama 4 dan Muse Spark
   Sumber resmi:
   - https://ai.meta.com/blog/llama-4-multimodal-intelligence/
   - https://developer.meta.com/ai/models/llama-4/
   - https://ai.meta.com/blog/introducing-muse-spark-msl/
   - https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/
   - https://developer.meta.com/ai/models/muse-spark/
   Snapshot: 1 Agustus 2026.
   Harga API hanya dicantumkan jika dipublikasikan secara resmi oleh Meta.
   ========================================================================== */

const META_MODELS = [
  {
    id: "llama-4-scout",
    family: "Llama 4",
    name: "Llama 4 Scout",
    apiName: "meta-llama/Llama-4-Scout-17B-16E-Instruct",
    version: "4.0",
    category: "generalist",
    categoryLabel: "Open-Weight / Efficient Multimodal",
    params: "109B total / 17B aktif",
    context: "10M tokens",
    inputPrice: "—",
    outputPrice: "—",
    modalities: ["Teks", "Vision"],
    openWeight: true,
    status: "general-availability",
    release: "2025-04",
    tagline: "Model multimodal efisien dengan konteks 10 juta token.",
    strengths: ["10M token context", "Native multimodality", "17B aktif / 109B total", "16 experts", "Dapat berjalan pada satu H100 dengan Int4"],
    bestFor: "Analisis dokumen sangat panjang, codebase besar, personalisasi, dan deployment open-weight yang efisien.",
    story: "Llama 4 Scout adalah model open-weight native multimodal dengan 17B parameter aktif, 109B total, dan 16 experts. Meta menyebut konteks hingga 10 juta token serta efisiensi yang memungkinkan model berjalan pada satu NVIDIA H100 dengan kuantisasi Int4."
  },
  {
    id: "llama-4-maverick",
    family: "Llama 4",
    name: "Llama 4 Maverick",
    apiName: "meta-llama/Llama-4-Maverick-17B-128E-Instruct",
    version: "4.0",
    category: "generalist",
    categoryLabel: "Open-Weight / Frontier Multimodal",
    params: "400B total / 17B aktif",
    context: "—",
    inputPrice: "—",
    outputPrice: "—",
    modalities: ["Teks", "Vision"],
    openWeight: true,
    status: "general-availability",
    release: "2025-04",
    tagline: "Model multimodal frontier dengan rasio performa terhadap biaya yang tinggi.",
    strengths: ["400B total / 17B aktif", "128 routed experts + shared expert", "Native multimodality", "Image understanding", "Open-weight"],
    bestFor: "Asisten umum, pemahaman gambar, creative writing, reasoning, coding, dan inference terdistribusi.",
    story: "Llama 4 Maverick adalah model open-weight native multimodal dengan 17B parameter aktif, 400B total, serta 128 routed experts dan satu shared expert. Halaman resmi Meta mencantumkan estimasi biaya blended $0.19 per juta token untuk distributed inference; angka tersebut adalah estimasi serving, bukan harga API input/output."
  },
  {
    id: "llama-4-behemoth",
    family: "Llama 4",
    name: "Llama 4 Behemoth",
    apiName: "Llama 4 Behemoth (preview)",
    version: "4.0",
    category: "reasoning",
    categoryLabel: "Preview / Multimodal Teacher",
    params: "~2T total / 288B aktif",
    context: "—",
    inputPrice: "—",
    outputPrice: "—",
    modalities: ["Teks", "Vision"],
    openWeight: false,
    status: "unreleased",
    release: "2025-04",
    tagline: "Teacher model multimodal berskala besar yang masih dalam tahap training.",
    strengths: ["Hampir 2T parameter total", "288B aktif", "16 experts", "Multimodal", "Teacher untuk model Llama 4"],
    bestFor: "Riset frontier dan distilasi model; belum tersedia untuk deployment publik.",
    story: "Llama 4 Behemoth diperkenalkan Meta sebagai teacher model multimodal dengan 288B parameter aktif, 16 experts, dan hampir dua triliun parameter total. Sumber resmi menyatakan model ini masih training dan belum dirilis, sehingga tidak diklaim sebagai open-weight atau model yang tersedia untuk diunduh."
  },
  {
    id: "muse-spark",
    family: "Muse Spark",
    name: "Muse Spark",
    apiName: "Muse Spark",
    version: "1.0",
    category: "agentic",
    categoryLabel: "Private Preview / Agentic Reasoning",
    params: "Proprietary",
    context: "—",
    inputPrice: "—",
    outputPrice: "—",
    modalities: ["Teks", "Vision", "Video"],
    openWeight: false,
    status: "preview",
    release: "2026-04",
    tagline: "Model reasoning native multimodal pertama dari keluarga Muse untuk workflow agentic.",
    strengths: ["Native multimodal perception", "Tool use", "Visual chain-of-thought", "Multi-agent orchestration", "Contemplating mode"],
    bestFor: "Agen personal, reasoning multimodal, orkestrasi multi-agent, dan workflow yang membutuhkan tool use.",
    story: "Muse Spark adalah model reasoning native multimodal pertama dari keluarga Muse yang dikembangkan Meta Superintelligence Labs. Meta menyebut dukungan tool use, visual chain-of-thought, dan multi-agent orchestration. Model ini tersedia di Meta AI dengan private API preview untuk pengguna terpilih; parameter, konteks, dan harga API resmi tidak dicantumkan pada sumber yang digunakan."
  },
  {
    id: "muse-spark-1-1",
    family: "Muse Spark",
    name: "Muse Spark 1.1",
    apiName: "Muse Spark 1.1",
    version: "1.1",
    category: "agentic",
    categoryLabel: "Public Preview / Agentic Reasoning",
    params: "Proprietary",
    context: "1M tokens",
    inputPrice: "—",
    outputPrice: "—",
    modalities: ["Teks", "Vision", "Audio", "Video"],
    openWeight: false,
    status: "preview",
    release: "2026-07",
    tagline: "Pembaruan reasoning multimodal untuk coding, computer use, dan agen jangka panjang.",
    strengths: ["Konteks 1M token", "Computer use", "Coding agentic", "Multi-agent delegation", "Tool use multimodal"],
    bestFor: "Coding agent, otomasi komputer, workflow lintas aplikasi, dan tugas agentic dengan konteks panjang.",
    story: "Muse Spark 1.1 adalah pembaruan Muse Spark dengan peningkatan pada tool use, computer use, coding, dan pemahaman multimodal. Meta menyatakan model ini tersedia dalam public preview melalui Meta Model API untuk developer AS dan memiliki konteks satu juta token. Harga input/output API resmi tidak dicantumkan pada pengumuman yang digunakan."
  }
];

if (typeof window !== "undefined") {
  window.META_MODELS = META_MODELS;
  window.PROVIDER_MODELS = META_MODELS;
}
