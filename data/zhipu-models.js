/* ==========================================================================
   DATA: Model Zhipu AI / Z.ai
   Sumber: dokumentasi dan pricing resmi Z.AI, Hugging Face zai-org,
   serta OpenRouter model metadata. Snapshot: 1 Agustus 2026.
   Harga API dalam USD per 1 juta token; model generatif memakai satuan resmi.
   ========================================================================== */

const ZHIPU_MODELS = [
  {
    id: "glm-5-2", family: "GLM-5", name: "GLM-5.2", apiName: "glm-5.2", version: "5.2",
    category: "reasoning", categoryLabel: "Hosted / Frontier Reasoning", params: "~754B", context: "1M tokens",
    inputPrice: "$1.40", outputPrice: "$4.40", modalities: ["Teks", "Kode"], openWeight: true,
    status: "general-availability", release: "2026-06", tagline: "Model reasoning dan coding flagship Z.ai dengan konteks hingga satu juta token.",
    strengths: ["Konteks 1M token", "Reasoning agentic", "Coding skala proyek", "Tool calling"],
    bestFor: "Software engineering, agen jangka panjang, analisis dokumen besar, dan workflow enterprise.",
    story: "GLM-5.2 adalah model flagship terbaru Z.ai. Dokumentasi resmi menyebut dukungan konteks hingga 1M token; checkpoint open-weight tersedia melalui organisasi zai-org di Hugging Face."
  },
  {
    id: "glm-5-1", family: "GLM-5", name: "GLM-5.1", apiName: "glm-5.1", version: "5.1",
    category: "coding", categoryLabel: "Hosted / Agentic Coding", params: "~754B", context: "200K tokens",
    inputPrice: "$1.40", outputPrice: "$4.40", modalities: ["Teks", "Kode"], openWeight: true,
    status: "general-availability", release: "2026-04", tagline: "Model coding agentic untuk tugas panjang dan eksekusi mandiri.",
    strengths: ["Long-horizon coding", "Reasoning kuat", "Tool use", "Open-weight"],
    bestFor: "Coding agent, refactoring repositori, debugging, dan otomasi engineering.",
    story: "GLM-5.1 dirancang Z.ai untuk pekerjaan coding yang berjalan kontinu pada tugas multi-langkah dan tersedia sebagai checkpoint open-weight."
  },
  {
    id: "glm-5", family: "GLM-5", name: "GLM-5", apiName: "glm-5", version: "5.0",
    category: "reasoning", categoryLabel: "Open-Weight / Frontier", params: "~754B", context: "200K tokens",
    inputPrice: "$1.00", outputPrice: "$3.20", modalities: ["Teks", "Kode"], openWeight: true,
    status: "general-availability", release: "2026-02", tagline: "Foundation model open-weight untuk sistem kompleks dan agen jangka panjang.",
    strengths: ["Reasoning frontier", "Coding produksi", "Tool calling", "Open-weight"],
    bestFor: "Desain sistem, coding profesional, riset, dan agen otonom.",
    story: "GLM-5 merupakan foundation model open-source Z.ai dengan fokus pada desain sistem, programming skala besar, dan workflow agen."
  },
  {
    id: "glm-5-turbo", family: "GLM-5", name: "GLM-5 Turbo", apiName: "glm-5-turbo", version: "5.0",
    category: "coding", categoryLabel: "Hosted / Fast Agent", params: "Proprietary", context: "200K tokens",
    inputPrice: "$1.20", outputPrice: "$4.00", modalities: ["Teks", "Kode"], openWeight: false,
    status: "general-availability", release: "2026-03", tagline: "Varian cepat GLM-5 untuk agen dan throughput tinggi.",
    strengths: ["Latensi rendah", "Agent workflow", "Coding", "Tool use"],
    bestFor: "Agen real-time, coding assistant, dan workload produksi bervolume tinggi.",
    story: "GLM-5 Turbo adalah endpoint hosted yang dioptimalkan untuk inference cepat pada skenario agen dunia nyata."
  },
  {
    id: "glm-5v-turbo", family: "GLM-V", name: "GLM-5V Turbo", apiName: "glm-5v-turbo", version: "5V",
    category: "vision", categoryLabel: "Hosted / Multimodal Agent", params: "Proprietary", context: "200K tokens",
    inputPrice: "$1.20", outputPrice: "$4.00", modalities: ["Teks", "Vision", "Video"], openWeight: false,
    status: "general-availability", release: "2026-04", tagline: "Model multimodal native untuk visual coding dan agen berbasis gambar/video.",
    strengths: ["Image dan video input", "Visual coding", "Long-horizon planning", "Tool use"],
    bestFor: "Visual agent, GUI automation, coding berbasis screenshot, dan analisis video.",
    story: "GLM-5V Turbo disebut Z.ai sebagai model multimodal agent foundation yang menangani teks, gambar, dan video."
  },
  {
    id: "glm-4-7", family: "GLM-4", name: "GLM-4.7", apiName: "glm-4.7", version: "4.7",
    category: "coding", categoryLabel: "Open-Weight / Agentic Coding", params: "~358B", context: "200K tokens",
    inputPrice: "$0.60", outputPrice: "$2.20", modalities: ["Teks", "Kode"], openWeight: true,
    status: "general-availability", release: "2025-12", tagline: "Flagship coding dan reasoning GLM generasi 4.7.",
    strengths: ["Agentic coding", "Multi-step reasoning", "Tool calling", "Open-weight"],
    bestFor: "Software engineering, code review, terminal agent, dan pengembangan aplikasi.",
    story: "GLM-4.7 adalah model open-weight Z.ai dengan peningkatan besar pada programming dan eksekusi tugas agen yang kompleks."
  },
  {
    id: "glm-4-7-flash", family: "GLM-4", name: "GLM-4.7 Flash", apiName: "glm-4.7-flash", version: "4.7",
    category: "coding", categoryLabel: "Open-Weight / Efficient", params: "30B class", context: "200K tokens",
    inputPrice: "$0.07", outputPrice: "$0.40", modalities: ["Teks", "Kode"], openWeight: true,
    status: "general-availability", release: "2026-01", tagline: "Model GLM efisien untuk coding agent dengan biaya sangat rendah.",
    strengths: ["Harga rendah", "Latensi cepat", "Coding agent", "Open-weight"],
    bestFor: "Autocomplete, coding assistant, klasifikasi, dan agen volume tinggi.",
    story: "GLM-4.7 Flash merupakan model 30B-class yang dioptimalkan untuk efisiensi dan tersedia dalam checkpoint open-weight."
  },
  {
    id: "glm-4-6", family: "GLM-4", name: "GLM-4.6", apiName: "glm-4.6", version: "4.6",
    category: "generalist", categoryLabel: "Open-Weight / Generalist", params: "~357B", context: "200K tokens",
    inputPrice: "$0.60", outputPrice: "$2.20", modalities: ["Teks", "Kode"], openWeight: true,
    status: "general-availability", release: "2025-09", tagline: "Model generalist MoE dengan konteks panjang dan kemampuan coding kuat.",
    strengths: ["Konteks 200K", "Reasoning", "Coding", "Open-weight"],
    bestFor: "Chatbot, RAG, coding, analisis panjang, dan deployment mandiri.",
    story: "GLM-4.6 memperluas konteks dari generasi sebelumnya hingga 200K token dan dirilis sebagai model open-weight."
  },
  {
    id: "glm-4-6v", family: "GLM-V", name: "GLM-4.6V", apiName: "glm-4.6v", version: "4.6",
    category: "vision", categoryLabel: "Open-Weight / Vision", params: "~108B", context: "128K tokens",
    inputPrice: "$0.30", outputPrice: "$0.90", modalities: ["Teks", "Vision", "Video"], openWeight: true,
    status: "general-availability", release: "2025-12", tagline: "Model vision-language untuk dokumen, video, dan reasoning visual panjang.",
    strengths: ["Visual understanding", "Dokumen dan layout", "Video", "Open-weight"],
    bestFor: "OCR, document AI, visual question answering, dan visual agent.",
    story: "GLM-4.6V tersedia sebagai model open-weight Z.ai dengan input teks, gambar, dan video serta konteks 128K."
  },
  {
    id: "glm-4-5", family: "GLM-4", name: "GLM-4.5", apiName: "glm-4.5", version: "4.5",
    category: "reasoning", categoryLabel: "Open-Weight / MoE", params: "~355B total / 32B aktif", context: "128K tokens",
    inputPrice: "$0.60", outputPrice: "$2.20", modalities: ["Teks", "Kode"], openWeight: true,
    status: "general-availability", release: "2025-07", tagline: "Foundation model agentic, reasoning, dan coding dari Z.ai.",
    strengths: ["MoE", "Reasoning", "Agentic tool use", "Open-weight"],
    bestFor: "Agen umum, coding, matematika, riset, dan deployment open-weight.",
    story: "GLM-4.5 diperkenalkan sebagai ARC (Agentic, Reasoning, and Coding) foundation model dan dirilis di Hugging Face."
  },
  {
    id: "glm-4-5-air", family: "GLM-4", name: "GLM-4.5 Air", apiName: "glm-4.5-air", version: "4.5",
    category: "generalist", categoryLabel: "Open-Weight / Efficient MoE", params: "~106B total / 12B aktif", context: "128K tokens",
    inputPrice: "$0.20", outputPrice: "$1.10", modalities: ["Teks", "Kode"], openWeight: true,
    status: "general-availability", release: "2025-07", tagline: "GLM-4.5 yang lebih ringan untuk keseimbangan kualitas dan biaya.",
    strengths: ["MoE efisien", "Reasoning", "Coding", "Open-weight"],
    bestFor: "Aplikasi produksi, coding assistant, RAG, dan inference dengan resource menengah.",
    story: "GLM-4.5 Air menyediakan kemampuan agentic GLM-4.5 dengan arsitektur yang lebih hemat untuk deployment dan inference."
  },
  {
    id: "glm-4-5v", family: "GLM-V", name: "GLM-4.5V", apiName: "glm-4.5v", version: "4.5",
    category: "vision", categoryLabel: "Open-Weight / Vision MoE", params: "106B total / 12B aktif", context: "64K tokens",
    inputPrice: "$0.60", outputPrice: "$1.80", modalities: ["Teks", "Vision"], openWeight: true,
    status: "general-availability", release: "2025-08", tagline: "Vision-language MoE untuk aplikasi multimodal agent.",
    strengths: ["Image understanding", "Video understanding", "Visual agent", "Open-weight"],
    bestFor: "Dokumen, gambar, video, visual reasoning, dan GUI agent.",
    story: "GLM-4.5V adalah model vision-language open-weight dengan 106B parameter total dan 12B aktif menurut model card Z.ai."
  },
  {
    id: "glm-ocr", family: "GLM-OCR", name: "GLM-OCR", apiName: "glm-ocr", version: "1.0",
    category: "vision", categoryLabel: "Hosted / OCR", params: "1.3B", context: "—",
    inputPrice: "$0.03", outputPrice: "$0.03", modalities: ["Vision", "Teks", "Dokumen"], openWeight: true,
    status: "general-availability", release: "2026-05", tagline: "Model OCR ringan Z.ai untuk parsing dokumen dan struktur halaman.",
    strengths: ["OCR", "Document parsing", "Layout understanding", "Ringan"],
    bestFor: "Ekstraksi dokumen, invoice, tabel, formulir, dan pipeline OCR.",
    story: "GLM-OCR tercantum dalam dokumentasi vision Z.AI dan checkpoint open-weight-nya tersedia melalui zai-org di Hugging Face."
  },
  {
    id: "glm-4-32b-0414", family: "GLM-4", name: "GLM-4-32B-0414", apiName: "glm-4-32b-0414", version: "4.0",
    category: "generalist", categoryLabel: "Open-Weight / Legacy", params: "32B", context: "128K tokens",
    inputPrice: "$0.10", outputPrice: "$0.10", modalities: ["Teks"], openWeight: true,
    status: "general-availability", release: "2025-04", tagline: "Model open-weight 32B dengan konteks 128K untuk deployment mandiri.",
    strengths: ["32B dense", "Konteks 128K", "Biaya rendah", "Open-weight"],
    bestFor: "Chatbot, RAG, coding, dan inference lokal kelas menengah.",
    story: "GLM-4-32B-0414 merupakan checkpoint open-weight yang tercantum dalam katalog model Z.AI dengan konteks 128K."
  },
  {
    id: "glm-z1-32b-0414", family: "GLM-Z1", name: "GLM-Z1-32B-0414", apiName: "GLM-Z1-32B-0414", version: "1.0",
    category: "reasoning", categoryLabel: "Open-Weight / Reasoning", params: "32B", context: "32K tokens",
    inputPrice: "—", outputPrice: "—", modalities: ["Teks"], openWeight: true,
    status: "general-availability", release: "2025-04", tagline: "Model reasoning open-weight berbasis GLM-4 untuk tugas matematika dan logika.",
    strengths: ["Reasoning", "Math", "Chain-of-thought", "Open-weight"],
    bestFor: "Matematika, logika, STEM, dan eksperimen reasoning lokal.",
    story: "GLM-Z1-32B-0414 adalah model reasoning open-weight Z.ai yang dirilis bersama GLM-4-32B-0414."
  },
  {
    id: "codegeex4-all-9b", family: "CodeGeeX", name: "CodeGeeX4-All-9B", apiName: "codegeex4-all-9b", version: "4",
    category: "coding", categoryLabel: "Open-Weight / Coding", params: "9B", context: "128K tokens",
    inputPrice: "—", outputPrice: "—", modalities: ["Teks", "Kode"], openWeight: true,
    status: "general-availability", release: "2024-07", tagline: "Model coding multilingual open-weight untuk generasi, completion, dan review kode.",
    strengths: ["Multibahasa", "Code completion", "Code generation", "Open-weight"],
    bestFor: "IDE assistant, code review, debugging, dan pembelajaran pemrograman.",
    story: "CodeGeeX4-All-9B adalah model generasi kode multilingual Z.ai dengan checkpoint resmi di Hugging Face."
  },
  {
    id: "cogview4-6b", family: "CogView", name: "CogView4-6B", apiName: "cogview-4", version: "4",
    category: "image", categoryLabel: "Open-Weight / Image Generation", params: "6B", context: "—",
    inputPrice: "$0.01/img", outputPrice: "—", modalities: ["Teks", "Image"], openWeight: true,
    status: "general-availability", release: "2025-03", tagline: "Model text-to-image open-weight untuk gambar detail dan prompt kompleks.",
    strengths: ["Text-to-image", "Detail tinggi", "Prompt multibahasa", "Open-weight"],
    bestFor: "Ilustrasi, desain konsep, poster, dan generasi gambar dari teks.",
    story: "CogView4-6B adalah model gambar open-weight Z.ai. Harga $0.01 per gambar mengacu pada pricing API resmi CogView-4."
  },
  {
    id: "cogvideox-3", family: "CogVideoX", name: "CogVideoX-3", apiName: "cogvideox-3", version: "3",
    category: "video", categoryLabel: "Hosted / Video Generation", params: "Proprietary", context: "—",
    inputPrice: "$0.20/video", outputPrice: "—", modalities: ["Teks", "Image", "Video"], openWeight: false,
    status: "general-availability", release: "2026", tagline: "Model generasi video Z.ai dengan stabilitas frame dan kejernihan yang ditingkatkan.",
    strengths: ["Text-to-video", "Image-to-video", "Frame stabil", "Video generation"],
    bestFor: "Konten video kreatif, storyboard, iklan pendek, dan prototyping visual.",
    story: "CogVideoX-3 tercantum pada dokumentasi video generation resmi Z.AI dengan harga $0.20 per video."
  },
  {
    id: "glm-asr-2512", family: "GLM-ASR", name: "GLM-ASR-2512", apiName: "glm-asr-2512", version: "1.0",
    category: "audio", categoryLabel: "Hosted / Speech Recognition", params: "2.3B", context: "—",
    inputPrice: "$0.03/MTok", outputPrice: "—", modalities: ["Audio", "Teks"], openWeight: true,
    status: "general-availability", release: "2025-12", tagline: "Model speech recognition Z.ai untuk transkripsi audio multibahasa.",
    strengths: ["Automatic speech recognition", "Streaming", "Transkripsi", "Open-weight"],
    bestFor: "Subtitle, meeting transcription, voice analytics, dan aksesibilitas.",
    story: "GLM-ASR-2512 tercantum pada dokumentasi audio Z.AI; pricing resmi adalah $0.03 per satu juta token audio, sekitar $0.0024 per menit."
  }
];

if (typeof window !== "undefined") {
  window.ZHIPU_MODELS = ZHIPU_MODELS;
  window.PROVIDER_MODELS = ZHIPU_MODELS;
}
