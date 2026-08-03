# Rencana Implementasi Katalog Model xAI dan Provider Lainnya

- Date: 2026-08-01
- POC/TL: AdaL
- TL;DR: Katalog xAI berisi 36 record dengan pola data-per-file dan engine komparasi provider yang sudah ada; halaman xAI, kartu beranda, dan tema sudah terintegrasi. Placeholder “Provider Lainnya” sudah diperbarui menjadi `Xiaomi MiMo, Moonshot AI Kimi, dan model lainnya`. Validasi implementasi lulus sebelum delivery ke `origin/adal/tugas-1`.

## Kondisi repository

- Aplikasi berupa Vanilla HTML/CSS/JavaScript statis.
- Dataset provider dimuat dari `data/*.js` ke `window.PROVIDER_MODELS`.
- `compare.js` menangani filter, pencarian, sorting, status, dan modal detail secara generik.
- Semua halaman saat ini memiliki link navbar `xai.html`; halaman dan dataset xAI sudah tersedia pada branch ini.
- `index.html` memiliki kartu xAI Live dan kartu placeholder “Provider Lainnya” yang hanya menyebut provider/model yang belum memiliki katalog.

## Rencana perubahan

### 1. Dataset xAI — `data/xai-models.js`

Implementasi final memuat 36 record `XAI_MODELS` dengan kontrak field yang sama seperti katalog provider lain:

`id`, `family`, `name`, `apiName`, `version`, `category`, `categoryLabel`, `params`, `context`, `inputPrice`, `outputPrice`, `modalities`, `openWeight`, `status`, `release`, `tagline`, `strengths`, `bestFor`, dan `story`.

Komposisinya:

- 19 model historis/legacy berstatus `deprecated`, mencakup Grok-1, Grok-1.5/1.5V, Grok-Beta, Grok-2, Grok-3, Grok-4, Grok-4 Fast, Grok-4.1 Fast, Grok Code Fast, serta slug Imagine lama.
- 17 model aktif berstatus `general-availability`, mencakup Grok 4.20, Grok 4.3, Grok Build 0.1, Grok 4.5, alias Grok Latest, Imagine Image/Video, Voice Think Fast, Speech-to-Text, Text-to-Speech, dan Grok Embedding Small.
- Kategori yang tersedia: `generalist` (12), `vision` (3), `image` (4), `reasoning` (7), `coding` (2), `video` (2), `voice` (5), dan `embedding` (1).

Data memakai dokumentasi xAI sebagai sumber utama, dengan OpenRouter sebagai pemeriksaan silang untuk model/alias yang memang tercantum di sana. Alias seperti `grok-latest` dan `grok-voice-latest` dipertahankan sebagai record karena keduanya merupakan endpoint katalog yang berbeda dari model targetnya, tetapi tidak semua alias historis diduplikasi.

Harga, parameter, dan context mengikuti sumber yang tersedia. Nilai yang tidak dipublikasikan memakai `—` atau `Proprietary`; satuan media/voice resmi (`/gambar`, `/detik`, `/menit`, `/jam`, atau `/1M karakter`) dipertahankan agar tidak disalahartikan sebagai harga token.

Dataset mengekspor:

```js
window.XAI_MODELS = XAI_MODELS;
window.PROVIDER_MODELS = XAI_MODELS;
```

Header dataset mencantumkan sumber model, pricing, release/migration, media, dan voice xAI.

### 2. Halaman katalog — `xai.html`

Halaman final mengikuti struktur katalog provider lain:

- Navbar dengan link `xAI (Grok)` berstatus `active`.
- Hero dan deskripsi xAI.
- Toolbar filter untuk `generalist`, `reasoning`, `coding`, `vision`, `image`, `video`, `voice`, dan `embedding`.
- Tabel model dengan kolom yang sama.
- Search, toggle legacy, sorting, modal detail, referensi, dan footer.
- Memuat `data/xai-models.js` sebelum `compare.js`.
- Menyediakan referensi resmi xAI Docs, Console, News, GitHub `xai-org`, dan OpenRouter.
- Status dataset aktual adalah `general-availability` dan `deprecated`; tombol legacy menyembunyikan record deprecated secara default.

### 3. Tema xAI — `styles.css`

Tambahkan hanya override `body.provider-xai` untuk aksen visual xAI/Grok. Layout, variabel global, dan tema provider lain tidak diubah.

### 4. Integrasi beranda — `index.html`

- Tambahkan kartu provider xAI berstatus `Live` menuju `xai.html`.
- Setelah dataset final dihitung, tulis jumlah dan cakupan model secara akurat.
- Tambahkan xAI pada meta description bila diperlukan.
- Ganti isi kartu placeholder “Provider Lainnya” yang sekarang menyebut Gemini, Meta, xAI, dan Cohere—semuanya sudah tersedia—menjadi kandidat yang belum memiliki katalog, misalnya:
  `Xiaomi MiMo, Moonshot AI Kimi, dan model lainnya`.
- Kartu tetap bertanda “Segera”; tahap ini hanya memperbaiki keterangan, bukan membuat halaman katalog Xiaomi/Moonshot.

### 5. File yang sengaja tidak diubah

- Navbar halaman lama sudah memiliki link `xai.html`, jadi tidak perlu mengubah sembilan halaman tersebut.
- `compare.js` dipertahankan karena engine sudah generik dan mendukung kategori/status yang dibutuhkan.
- Tidak membuat halaman baru Xiaomi atau Moonshot pada tahap ini; permintaan nomor (2) diarahkan pada koreksi keterangan placeholder setelah katalog xAI selesai.

## Alternatif dan trade-off

1. **Hanya memasukkan model chat Grok:** ditolak karena sumber resmi xAI juga mencantumkan image, video, dan voice API.
2. **Menduplikasi setiap alias sebagai model:** ditolak agar tabel tidak redundan dan tidak memberi kesan alias adalah model terpisah.
3. **Mengarang parameter/context/tanggal yang tidak dipublikasikan:** ditolak; gunakan `Proprietary` atau `—`.
4. **Menggunakan harga OpenRouter sebagai harga xAI:** ditolak sebagai default; harga first-party xAI diprioritaskan, OpenRouter hanya menjadi pemeriksaan silang.
5. **Membuat katalog Xiaomi/Moonshot sekaligus:** ditunda karena urutan tugas meminta xAI lebih dahulu dan langkah kedua berbicara tentang perbaikan keterangan Provider Lainnya.

## Risiko dan mitigasi

- **Satuan harga media/voice tidak sebanding dengan kolom token:** satuan resmi dipertahankan dan diterangkan pada detail.
- **Model beta/alias berubah:** dataset diberi snapshot tanggal dan alias penting dicatat di `story`.
- **Voice API tidak memiliki metadata model lengkap:** ditampilkan sebagai API entry dengan field yang tidak tersedia bernilai `—`.
- **Jumlah model pada kartu beranda mudah salah:** hitung/validasi jumlah record sebelum memperbarui copy.
- **Navbar statis mudah tidak konsisten:** pastikan setiap halaman memiliki tepat satu link xAI dan hanya halaman xAI yang memakai `active`.
- **Tidak ada test runner:** gunakan `node --check`, validasi kontrak data, pemeriksaan link/script/filter/status, `git diff --check`, dan smoke test melalui server statis bila tersedia.

## Validasi dan delivery

1. Dataset xAI, halaman katalog, tema, kartu xAI, dan keterangan Provider Lainnya sudah tersedia.
2. `node --check` lulus untuk JavaScript yang relevan.
3. Kontrak data lulus: 36 record, `id` unik, field wajib lengkap, serta array modalitas dan strengths valid.
4. Kategori dataset memiliki tombol filter yang sesuai; dataset dimuat sebelum `compare.js`.
5. Navbar xAI, kartu Live, angka 36 model, dan placeholder Provider Lainnya sudah diverifikasi.
6. `git diff --check` lulus; diff, status worktree, dan file yang akan dikirim diperiksa.
7. Commit perubahan beranda dan dokumen rencana dengan pesan `feat: add xAI model catalog` dan trailer `Co-Authored-By: AdaL <adal@sylph.ai>`, lalu push ke `origin adal/tugas-1` tanpa force push.

## Sumber rujukan

- https://docs.x.ai/developers/models
- https://docs.x.ai/developers/pricing
- https://docs.x.ai/developers/models/grok-4.5
- https://docs.x.ai/developers/models/grok-4.3
- https://docs.x.ai/developers/models/grok-4.20-multi-agent-0309
- https://docs.x.ai/developers/models/grok-4.20-0309-reasoning
- https://docs.x.ai/developers/models/grok-4.20-0309-non-reasoning
- https://docs.x.ai/developers/models/grok-build-0.1
- https://docs.x.ai/developers/models/speech-to-text
- https://docs.x.ai/developers/models/text-to-speech
- https://docs.x.ai/developers/models/speech-to-speech
- https://openrouter.ai/xiaomi/mimo-v2.5
- https://openrouter.ai/xiaomi/mimo-v2.5-pro
- https://openrouter.ai/moonshotai/kimi-k3
- https://openrouter.ai/moonshotai/kimi-k2.6