/* ==========================================================================
   DATA: Model Meta — Llama 4 dan Muse Spark
   Sumber resmi dan metadata platform:
   - https://ai.meta.com/blog/llama-4-multimodal-intelligence/
   - https://developer.meta.com/ai/models/llama-4/
   - https://ai.meta.com/blog/introducing-muse-spark-msl/
   - https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/
   - https://developer.meta.com/ai/models/muse-spark/
   - https://openrouter.ai/meta-llama/llama-4-scout
   - https://openrouter.ai/meta-llama/llama-4-maverick
   - https://openrouter.ai/meta/muse-spark-1.1
   - https://huggingface.co/meta-llama/Llama-4-Maverick-17B-128E-Instruct
   - https://artificialanalysis.ai/articles/muse-spark-1-1-everything-you-need-to-know
   - https://www.datacamp.com/blog/muse-spark
   Snapshot: 1 Agustus 2026.
   Harga OpenRouter dicantumkan sebagai harga hosted/API per 1 juta token.
   Nilai Muse Spark 1.0 dari sumber pihak ketiga ditandai di penjelasan model.
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
    inputPrice: "$0.10",
    outputPrice: "$0.30",
    modalities: ["Teks", "Vision"],
    openWeight: true,
    status: "general-availability",
    release: "2025-04",
    tagline: "Model multimodal efisien dengan konteks 10 juta token.",
    strengths: ["10M token context", "Native multimodality", "17B aktif / 109B total", "16 experts", "Dapat berjalan pada satu H100 dengan Int4"],
    bestFor: "Analisis dokumen sangat panjang, codebase besar, personalisasi, dan deployment open-weight yang efisien.",
    story: "Llama 4 Scout adalah model open-weight native multimodal dengan 17B parameter aktif, 109B total, dan 16 experts. Meta menyebut konteks hingga 10 juta token serta efisiensi yang memungkinkan model berjalan pada satu NVIDIA H100 dengan kuantisasi Int4. Harga hosted OpenRouter pada snapshot ini adalah $0.10 per 1 juta input token dan $0.30 per 1 juta output token."
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
    context: "1M tokens",
    inputPrice: "$0.20",
    outputPrice: "$0.80",
    modalities: ["Teks", "Vision"],
    openWeight: true,
    status: "general-availability",
    release: "2025-04",
    tagline: "Model multimodal frontier dengan rasio performa terhadap biaya yang tinggi.",
    strengths: ["400B total / 17B aktif", "128 routed experts + shared expert", "Native multimodality", "Image understanding", "Open-weight"],
    bestFor: "Asisten umum, pemahaman gambar, creative writing, reasoning, coding, dan inference terdistribusi.",
    story: "Llama 4 Maverick adalah model open-weight native multimodal dengan 17B parameter aktif, 400B total, serta 128 experts. Meta, Hugging Face, Fireworks, dan OpenRouter mencantumkan context window 1 juta token. Harga hosted OpenRouter pada snapshot ini adalah $0.20 per 1 juta input token dan $0.80 per 1 juta output token; estimasi Meta sebesar $0.19 per juta token tetap merupakan biaya serving distributed inference, bukan harga API."
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
    story: "Llama 4 Behemoth diperkenalkan Meta sebagai teacher model multimodal dengan 288B parameter aktif, 16 experts, dan hampir dua triliun parameter total. Sumber resmi menyatakan model ini masih training dan belum dirilis; context window, endpoint hosted, dan harga publik tidak tersedia dari sumber platform yang ditemukan, sehingga masing-masing ditampilkan sebagai —. Model ini juga tidak diklaim sebagai open-weight atau model yang tersedia untuk diunduh."
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
    context: "262K tokens",
    inputPrice: "—",
    outputPrice: "—",
    modalities: ["Teks", "Vision", "Audio", "Video"],
    openWeight: false,
    status: "preview",
    release: "2026-04",
    tagline: "Model reasoning native multimodal pertama dari keluarga Muse untuk workflow agentic.",
    strengths: ["Native multimodal perception", "Tool use", "Visual chain-of-thought", "Multi-agent orchestration", "Contemplating mode"],
    bestFor: "Agen personal, reasoning multimodal, orkestrasi multi-agent, dan workflow yang membutuhkan tool use.",
    story: "Muse Spark adalah model reasoning native multimodal pertama dari keluarga Muse yang dikembangkan Meta Superintelligence Labs. Meta menyebut dukungan tool use, visual chain-of-thought, dan multi-agent orchestration. Parameter model tidak dipublikasikan. Artificial Analysis (10 Juli 2026) dan DataCamp melaporkan context window sekitar 262K token, tetapi Meta belum menerbitkan model card yang mengonfirmasi angka tersebut. Model ini tersedia di Meta AI dengan private API preview untuk pengguna terpilih; tidak ada harga input/output publik yang dapat diverifikasi dan OpenRouter tidak memiliki listing terpisah untuk Muse Spark 1.0, sehingga harga tetap —."
  },
  {
    id: "muse-spark-1-1",
    family: "Muse Spark",
    name: "Muse Spark 1.1",
    apiName: "muse-spark-1.1",
    version: "1.1",
    category: "agentic",
    categoryLabel: "Public Preview / Agentic Reasoning",
    params: "Proprietary",
    context: "1,048,576 tokens",
    inputPrice: "$1.25",
    outputPrice: "$4.25",
    modalities: ["Teks", "Vision", "Audio", "Video", "PDF"],
    openWeight: false,
    status: "preview",
    release: "2026-07",
    tagline: "Pembaruan reasoning multimodal untuk coding, computer use, dan agen jangka panjang.",
    strengths: ["Konteks 1,048,576 token", "Computer use", "Coding agentic", "Multi-agent delegation", "Tool use multimodal"],
    bestFor: "Coding agent, otomasi komputer, workflow lintas aplikasi, dan tugas agentic dengan konteks panjang.",
    story: "Muse Spark 1.1 adalah model reasoning multimodal agentic dengan peningkatan pada tool use, computer use, coding, dan pemahaman multimodal. Meta Model API dan OpenRouter mencantumkan context window 1,048,576 token serta harga hosted/API $1.25 per 1 juta input token dan $4.25 per 1 juta output token. Prompt cache dikenai $0.15 per 1 juta token; parameter model tidak dipublikasikan, sehingga tetap ditandai Proprietary."
  }
];

if (typeof window !== "undefined") {
  window.META_MODELS = META_MODELS;
  window.PROVIDER_MODELS = META_MODELS;
}
