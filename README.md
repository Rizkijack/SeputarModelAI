# ◆ Seputar Model AI

**Website komparasi seluruh model AI** — tayang live di Vercel.

## 📋 Tentang

 Seputar Model AI adalah website statis yang menampilkan komparasi komprehensif seluruh model AI, meliputi:

| Kategori | Model |
|----------|-------|
| 🧠 Generalist | Mistral Large 3, Medium 3.5, Small 4 |
| 💻 Coding | Devstral 2, Codestral 25.01 |
| ⚡ Reasoning | Magistral Medium, Magistral Small 24B |
| 🎙️ Audio | Voxtral Mini 4B, Voxtral TTS |
| 👁️ Vision / OCR | Mistral OCR |
| 📊 Embedding | Mistral Embed v3 |
| 🏛️ Legacy | Large 2, Pixtral Large, Nemo, Mixtral 8x22B, Mixtral 8x7B |

### Fitur

- **Tabel interaktif** — filter per kategori, pencarian real-time, sorting kolom
- **Modal detail** — spesifikasi lengkap + cerita setiap model
- **Section narasi** — cerita evolusi ekosistem Mistral AI
- **Section legacy** — museum model-model bersejarah
- **Responsif** — tampil bagus di mobile & desktop
- **Tema gelap** — dengan aksen amber khas Mistral

## 🧪 Menjalankan Test

Unit test memakai [Vitest](https://vitest.dev) + jsdom (hanya untuk pengembangan; situs tetap statis tanpa build step).

```bash
npm install
npm test           # jalankan semua test
npm run coverage   # test + laporan coverage
```

## 🚀 Deploy ke Vercel

### Opsi 1: CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Masuk ke folder proyek
cd mistral-comparison

# Deploy
vercel
```

### Opsi 2: Dashboard (GUI)

1. Push folder `mistral-comparison` ke repository GitHub
2. Buka [vercel.com/new](https://vercel.com/new)
3. Import repository tersebut
4. Framework Preset: **Other**
5. Klik **Deploy**

### Opsi 3: Tanpa Git (Drag & Drop)

1. Buka [vercel.com/new](https://vercel.com/new)
2. Pilih **Upload** atau drag folder `mistral-comparison`
3. Klik **Deploy**

## 📁 Struktur Proyek

```
mistral-comparison/
├── index.html          ← Halaman utama
├── styles.css          ← Gaya (tema gelap + amber)
├── app.js              ← Interaksi (filter, sort, modal)
├── data/
│   └── models.js       ← Data terstruktur seluruh model
├── vercel.json          ← Konfigurasi Vercel
└── README.md            ← File ini
```

## 📡 Sumber Data

- [Models Overview — Mistral Docs](https://docs.mistral.ai/models/overview)
- [Pricing — Mistral AI](https://mistral.ai/pricing)
- [Mistral AI — Hugging Face](https://huggingface.co/mistralai)
- [Benchmarks — BenchLM](https://benchlm.ai/best/mistral-models)

---

*Dibuat Juli 2026. Bukan situs resmi Mistral AI.*
