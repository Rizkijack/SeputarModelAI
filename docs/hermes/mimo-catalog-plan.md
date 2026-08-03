# Rencana Implementasi Katalog Model Xiaomi MiMo

- Date: 2026-08-02
- Agent/Branch: Hermes-1 (`hermes-1/tugas-1`)
- TL;DR: Katalog Xiaomi MiMo berisi 20 record dengan pola data-per-file dan engine
  komparasi provider (`compare.js`) yang sudah ada. Halaman `mimo.html`, tema
  `provider-mimo`, kartu beranda, dan navbar solid di semua sub-halaman sudah
  terintegrasi. Validasi lulus sebelum delivery ke `origin/hermes-1/tugas-1`.

## Kondisi repository

- Aplikasi berupa Vanilla HTML/CSS/JavaScript statis.
- Dataset provider dimuat dari `data/*.js` ke `window.PROVIDER_MODELS`.
- `compare.js` menangani filter, pencarian, sorting, status, dan modal detail
  secara generik (tidak perlu diubah).
- Sebelum tugas ini, navbar semua halaman berakhir di `xai.html`; kartu placeholder
  "Provider Lainnya" menyebut `Xiaomi MiMo, Moonshot AI Kimi, dan model lainnya`.
- Tidak ada test runner; validasi memakai `node --check`, kontrak data, dan smoke test.

## Sumber data

- https://mimo.xiaomi.com — halaman produk & blog resmi Xiaomi MiMo.
- https://openrouter.ai/models?q=xiaomi — katalog & harga hosted (API snapshot
  2 Agu 2026): `xiaomi/mimo-v2.5` ($0.14/$0.28) dan `xiaomi/mimo-v2.5-pro`
  ($0.435/$0.87), keduanya rilis 22 Apr 2026.
- https://huggingface.co/XiaomiMiMo — repo open-weight resmi (config.json untuk
  parameter & konteks).

## Rencana perubahan

### 1. Dataset — `data/mimo-models.js`
20 record `MIMO_MODELS` dengan kontrak field yang sama seperti katalog lain:
`id`, `family`, `name`, `apiName`, `version`, `category`, `categoryLabel`,
`params`, `context`, `inputPrice`, `outputPrice`, `modalities`, `openWeight`,
`status`, `release`, `tagline`, `strengths`, `bestFor`, `story`.

Komposisi:
- 6 model seri V2.5 (flagship 2026): V2.5-Pro (1.02T/42B aktif, 1M), V2.5
  (310B/15B, omnimodal, 1M), V2.5-Pro-UltraSpeed, V2.5-DFlash, V2.5-ASR,
  V2.5-TTS Series.
- 4 model seri V2: V2-Pro (1T+, 1M), V2-Omni (omnimodal, 256K), V2-Flash
  (309B/15B, 256K), V2-TTS.
- 2 model audio open-weight: MiMo-Audio-7B-Instruct & Base.
- 8 model open-weight 7B: MiMo-7B Base/SFT/RL/RL-Zero/MTPs, MiMo-VL-7B SFT/RL,
  MiMo-Embodied-7B.

Kategori: `generalist` (6), `reasoning` (3), `coding` (2), `vision` (3),
`audio` (2), `speech` (3), `embodied` (1).

Harga: hanya V2.5 dan V2.5-Pro memiliki harga OpenRouter; model open-weight
lainnya memakai `—` (self-host gratis via HF). Parameter/konteks tidak
dipublikasikan memakai `Proprietary` atau `—` mengikuti konvensi proyek.

Dataset mengekspor:
```js
window.MIMO_MODELS = MIMO_MODELS;
window.PROVIDER_MODELS = MIMO_MODELS;
```

### 2. Halaman katalog — `mimo.html`
Mengikuti struktur katalog lain (berbasis `xai.html`):
- Navbar dengan link `Xiaomi MiMo` berstatus `active`.
- Hero & deskripsi Xiaomi MiMo.
- Toolbar filter: generalist, reasoning, coding, vision, audio, speech, embodied.
- Tabel model, search, toggle legacy, sorting, modal detail, referensi, footer.
- Memuat `data/mimo-models.js` sebelum `compare.js`.
- Referensi resmi: mimo.xiaomi.com, OpenRouter (xiaomi), Hugging Face
  (XiaomiMiMo), GitHub, dan blog/miMo news.

### 3. Tema — `styles.css`
Menambahkan override `body.provider-mimo` (oranye Xiaomi, accent `#ff6900`).
Layout, variabel global, dan tema provider lain tidak diubah.

### 4. Integrasi beranda — `index.html`
- Meta description ditambah Xiaomi MiMo.
- Kartu provider Xiaomi MiMo `Live` menuju `mimo.html` (logo 🔶, 20 model).
- Keterangan placeholder "Provider Lainnya" dipangkas menjadi
  `Moonshot AI Kimi, dan model lainnya`.
- Link `Xiaomi MiMo` ditambahkan ke navbar beranda.

### 5. Navbar solid — semua sub-halaman
Menambahkan link `mimo.html` (Xiaomi MiMo) ke navbar **11 halaman**:
`index.html` + 10 halaman provider lama (mistral, openai, anthropic, qwen,
zhipu, deepseek, gemini, meta, cohere, xai). Setiap halaman memiliki tepat satu
link `mimo.html`; hanya `mimo.html` yang memakai class `active`. Ini memastikan
navbar Xiaomi MiMo solid (bukan partial).

## Alternatif & trade-off

1. **Hanya dua model OpenRouter (V2.5 & V2.5-Pro):** ditolak, karena keluarga
   MiMo resmi mencakup seri V2, audio, speech, dan open-weight 7B yang terdaftar
   di HF. Katalog dibuat komprehensif.
2. **Membuat semua varian kuantisasi (GGUF/FP4/2508) sebagai baris terpisah:**
   ditolak, agar tabel tidak redundan; varian minor dijelaskan di `story`.
3. **Mengarang parameter/konteks/tanggal yang tak dipublikasikan:** ditolak;
   memakai `Proprietary` atau `—`.

## Risiko & mitigasi

- **Data V2-Pro/V2-Omni bersifat produk (proprietary):** parameter/konteks
  diambil dari sumber resmi; nilai yang tak terpublikasi memakai `—`.
- **Model beta/versi baru berubah cepat:** dataset diberi snapshot tanggal
  (2 Agu 2026) dan sumber disebut di header.
- **Jumlah model pada kartu beranda:** divalidasi 20 record sebelum update copy.
- **Navbar statis mudah tidak konsisten:** diverifikasi setiap halaman punya
  tepat satu link `mimo.html`, dan hanya halaman MiMo yang ber-`active`.
- **Toolbar filter harus sesuai kategori:** kategori dataset → tombol filter
  sesuai.

## Validasi & delivery

1. `node --check data/mimo-models.js` lulus.
2. Kontrak data: 20 record, `id` unik, field wajib lengkap, modalitas/strengths valid.
3. Kategori dataset ↔ tombol filter sesuai; data dimuat sebelum `compare.js`.
4. Navbar: 12 halaman punya link `mimo.html`, hanya mimo.html yang `active`.
5. Kartu beranda Xiaomi Live, meta description, dan placeholder dipangkas.
6. Smoke test melalui server statis: tabel render, filter/search/sort/modal jalan.
7. `git diff --check` lulus; commit & push ke `origin hermes-1/tugas-1` (tanpa force).
