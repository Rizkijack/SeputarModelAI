# Rencana Implementasi Katalog Model Meta

- Date: 2026-08-01
- POC/TL: AdaL
- TL;DR: Tambahkan halaman katalog Meta yang memuat Llama 4 Scout, Llama 4 Maverick, Llama 4 Behemoth (preview/belum dirilis), Muse Spark, dan Muse Spark 1.1; integrasikan navbar/provider card, tampilkan status preview dengan benar, validasi semua halaman, lalu commit dan push ke `origin/adal/tugas-1`.

## Status implementasi

- Branch aktif: `adal/tugas-1`.
- Implementasi katalog Meta selesai pada branch ini.
- Proyek adalah situs statis Vanilla HTML/CSS/JS; engine komparasi bersama berada di `compare.js`.
- Katalog baru terdiri dari `data/meta-models.js` dan `meta.html`, dengan integrasi navbar, kartu provider, tema Meta, serta badge status.
- Tidak ada runner test/lint otomatis; validasi dilakukan melalui parsing JavaScript, pemeriksaan kontrak data, pemeriksaan struktur HTML/navbar, dan `git diff --check`.

## Model dan urutan katalog

Urutan data akan mengikuti kelas yang semakin tinggi dalam masing-masing keluarga. Urutan lintas keluarga adalah urutan produk yang paling masuk akal dari efisiensi ke reasoning/agentic terbaru, bukan klaim bahwa benchmark antar-keluarga dapat dibandingkan secara langsung.

| Urutan | Model | Status katalog | Fakta resmi yang dipakai |
| --- | --- | --- | --- |
| 1 | Llama 4 Scout | General availability, open-weight | 17B aktif, 109B total, 16 experts, native multimodal, konteks 10M token, efisien untuk satu H100 |
| 2 | Llama 4 Maverick | General availability, open-weight | 17B aktif, 400B total, 128 routed experts plus shared expert, native multimodal; Meta mencantumkan estimasi biaya blended $0.19/Mtok untuk distributed inference |
| 3 | Llama 4 Behemoth | Preview/belum dirilis | Teacher model multimodal; 288B aktif, 16 experts, hampir 2T total; sumber resmi menyatakan masih training dan belum dirilis |
| 4 | Muse Spark | Private API preview | Model reasoning native multimodal pertama dari keluarga Muse; mendukung tool use, visual chain-of-thought, dan orkestrasi multi-agent |
| 5 | Muse Spark 1.1 | Public preview melalui Meta Model API | Reasoning multimodal agentic; computer use, coding, tool use, dan konteks 1M token |

### Kebijakan data yang tidak tersedia

- Field `inputPrice` dan `outputPrice` akan diisi `—` jika Meta tidak menerbitkan harga input/output resmi pada sumber yang dipakai.
- Estimasi blended Maverick akan dijelaskan di `story`, bukan dipasang sebagai harga input/output API agar tidak menyesatkan.
- Parameter/konteks Muse Spark yang tidak disebutkan di halaman resmi akan diisi `Proprietary` atau `—`, bukan ditebak.
- Behemoth akan terlihat jelas sebagai `Belum dirilis`; ia tidak akan diperlakukan sebagai model GA atau open-weight yang dapat diunduh.

## Perubahan yang direncanakan

### 1. `data/meta-models.js` — file baru

- Buat array `META_MODELS` mengikuti kontrak yang digunakan `compare.js`:
  `id`, `family`, `name`, `apiName`, `version`, `category`, `categoryLabel`, `params`, `context`, `inputPrice`, `outputPrice`, `modalities`, `openWeight`, `status`, `release`, `tagline`, `strengths`, `bestFor`, dan `story`.
- Set `window.META_MODELS` dan `window.PROVIDER_MODELS`.
- Gunakan status `general-availability`, `preview`, dan `unreleased` sesuai keterangan resmi.
- Semua klaim teknis akan ditautkan di komentar header ke halaman resmi Meta.

### 2. `meta.html` — file baru

- Ikuti struktur halaman provider generik seperti `deepseek.html`/`zhipu.html`.
- Gunakan `body class="sub-page provider-meta"` dan link data `data/meta-models.js` sebelum `compare.js`.
- Tambahkan hero, filter kategori, pencarian, tabel komparasi, modal detail, footer, serta daftar referensi resmi.
- Referensi yang ditampilkan:
  - Llama 4 overview dan blog pengumuman resmi Meta.
  - Muse Spark overview dan pengumuman resmi Muse Spark.
  - Pengumuman Muse Spark 1.1 dan Meta Model API.
  - Halaman download/model docs resmi bila relevan.
- Link Meta pada halaman ini akan diberi `class="active"`; halaman lain tidak.

### 3. `compare.js` — perubahan kecil dan terisolasi

- Pertahankan filter, sort, pencarian, dan modal yang ada.
- Ubah pembuatan badge status agar `general-availability` menjadi `GA`, `preview` menjadi `Preview`, `unreleased` menjadi `Belum dirilis`, dan `deprecated` tetap `Deprecated`.
- Gunakan kelas badge yang sudah tersedia atau kelas paling kecil yang diperlukan; tidak mengubah perilaku provider yang sudah ada.
- Perubahan ini diperlukan agar status resmi Muse Spark dan Behemoth tidak salah tampil sebagai GA.

### 4. `styles.css` — perubahan kecil

- Tambahkan override `body.provider-meta` dengan aksen biru Meta, termasuk `--accent`, `--accent-dim`, dan `--accent-glow`.
- Jika badge `unreleased` memerlukan pembeda visual, gunakan styling terbatas dan konsisten dengan badge status yang telah ada.

### 5. Navbar seluruh halaman

Tambahkan `<a href="meta.html">Meta</a>` ke navbar pada semua halaman provider dan beranda yang sudah ditemukan:

- `index.html`
- `mistral.html`
- `openai.html`
- `anthropic.html`
- `qwen.html`
- `zhipu.html`
- `deepseek.html`

`meta.html` akan memiliki link Meta aktif. Link aktif provider lain akan dipertahankan.

### 6. `index.html`

- Tambahkan kartu provider Meta berstatus Live menuju `meta.html`.
- Tampilkan jumlah dan cakupan katalog Meta secara jujur, termasuk Llama 4 dan Muse Spark.
- Hapus penyebutan Meta Llama dari teks placeholder `Provider Lainnya` agar tidak ada duplikasi atau informasi kedaluwarsa.
- Perbarui deskripsi beranda secukupnya untuk mencantumkan Meta; tidak mengubah kartu provider lain.

## Alternatif yang dipertimbangkan

1. **Hanya memasukkan model yang sudah dapat diunduh/diakses publik.** Ditolak sebagai default karena permintaan mencakup semua model dari kelas terendah hingga tertinggi dan sumber resmi Meta secara eksplisit menyebut Behemoth. Behemoth tetap dimasukkan dengan status `Belum dirilis`; bila scope yang dimaksud hanya model tersedia, record tersebut dapat dikeluarkan sebelum implementasi.
2. **Mengarang harga input/output dari estimasi hosting atau provider pihak ketiga.** Ditolak karena bertentangan dengan permintaan sumber resmi Meta dan berisiko mencampur biaya inference dengan harga API.
3. **Membuat engine komparasi khusus Meta.** Ditolak; `compare.js` sudah menjadi alur standar dan cukup diperluas pada pemetaan badge status.
4. **Menyalin halaman provider lama lalu membiarkan navbar berbeda-beda.** Ditolak; semua navbar yang ditemukan akan mendapat link Meta agar navigasi konsisten.

## Risiko dan mitigasi

- **Behemoth belum tersedia:** status dan copy akan menyatakan belum dirilis; tidak diberi label open-weight.
- **Konteks/harga beberapa model tidak dipublikasikan:** tampilkan `—` dan jelaskan batas data di detail model, bukan mengisi angka spekulatif.
- **Perubahan `compare.js` berdampak ke semua provider:** perubahan dibatasi pada fungsi badge status, kemudian dilakukan smoke check untuk halaman provider yang ada.
- **Navbar statis mudah terlewat:** lakukan pencarian akhir untuk memastikan setiap file HTML memiliki link `meta.html` tepat satu kali dan hanya halaman Meta yang memakai `active`.
- **Tidak ada test runner:** jalankan validasi sintaks JS, cek seluruh file yang direferensikan, inspeksi diff, dan bila memungkinkan buka server statis lokal untuk memeriksa tabel, filter, modal, dan link.

## Validasi setelah implementasi

1. Pastikan semua file baru dan referensi script/style ada.
2. Parse `data/meta-models.js` dan `compare.js` dengan runtime JavaScript yang tersedia.
3. Verifikasi setiap record memiliki field wajib, `id` unik, kategori yang memiliki tombol filter, dan status yang dipetakan.
4. Cek navbar/meta card dengan grep serta cek link resmi.
5. Jalankan smoke test lokal pada `meta.html` dan minimal satu halaman lama.
6. Periksa `git diff`, status worktree, dan lakukan pemindaian dasar agar tidak ada secret atau file sementara.
7. Stage hanya perubahan tugas Meta, commit dengan pesan `feat: add Meta model catalog`, lalu push ke `origin adal/tugas-1` tanpa force push.

## Sumber resmi Meta

- https://ai.meta.com/blog/llama-4-multimodal-intelligence/
- https://developer.meta.com/ai/models/llama-4/
- https://developer.meta.com/ai/docs/model-cards-and-prompt-formats/llama4/
- https://ai.meta.com/blog/introducing-muse-spark-msl/
- https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/
- https://developer.meta.com/ai/models/muse-spark/
- https://developer.meta.com/ai/products/meta-model-api/
