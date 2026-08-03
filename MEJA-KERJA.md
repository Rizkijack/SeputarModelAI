# 🪑 MEJA KERJA — WAJIB BACA DI AWAL SESI

> Dokumen ini adalah kontrak kerja lo di workspace ini. Baca ini duluan sebelum lakukan apapun. Kalau ada pertanyaan soal boundary, balik lagi ke file ini.

---

## 1. Identitas Workspace

| Item | Nilai |
|------|-------|
| **Worktree path** | `G:/PROJECT/SeputarModelAI/PekerjaanAgents/Opencode` |
| **Sub-branch lokal** | `opencode/tugas-1` |
| **Sub-branch origin** | `origin/opencode/tugas-1` |
| **Base branch (main)** | `preview` |
| **Root repo (kolam bareng)** | `G:/PROJECT/SeputarModelAI` |

---

## 2. Aturan Emas (Jangan Dilanggar)

### ✔ DO
1. **Selalu kerja di folder ini dan branch sub-branch lo sendiri.** Kalo nyasar ke preview, `cd` balik + checkout branch yang benar.
2. **Selalu pull/fetch sebelum mulai kerja** — biar tau state terbaru.
3. **Commit + push ke sub-branch origin** (`origin/opencode/tugas-1`).
4. **Selesai kerja: kasih ringkasan + file yang diubah.** Finalizer yang urus push ke preview.
5. **Conflict handling**: kalo perlu sync dengan base, koordinasi dengan Finalizer.

### ✖ DON'T
1. **Jangan pernah `git checkout preview`, merge ke preview, push ke preview.** Preview = Finalizer territory. Lo dilarang masuk.
2. **Jangan pernah `cd` atau edit file di worktree agent lain.** Itu meja orang lain, jangan disentuh.
3. **Jangan fork base branch baru (`git checkout -b` dari preview).** Sub-branch lo sudah fixed.
4. **Jangan `git push --force` ke origin/preview.** Force-push hanya boleh ke origin sub-branch sendiri, itu juga kalo ada alasan kuat.
5. **Jangan commit ke sub-branch agent lain** — itu bukan meja lo.

---

## 3. Alur Kerja Standard

```
START SESI
    ↓
Baca file ini (bukan cuma ingat dari memory!)
    ↓
git fetch origin
    ↓
git status (cek clean/dirty)
    ↓
Kerjakan tugas → modify files → test kalo perlu
    ↓
git add + commit (format: type(scope): message)
    ↓
git push origin opencode/tugas-1
    ↓
Kasih ringkasan ke Finalizer
    ↓
STOP — jangan sentuh apa-apa lagi
```

---

## 4. Kalo Lo Nyasar (Accident Recovery)

| Nyasar ke | Solusi |
|-----------|--------|
| Branch preview | `git checkout opencode/tugas-1` |
| Worktree agent lain | `cd ../Opencode` + `git status` |
| Udah edit di branch salah | `git stash` → checkout branch benar → `git stash pop` |

---

## 5. Kontak

- **Finalizer push/PR/merge**: Minta izin terus terusin ke Finalizer (Hermes). Jangan langsung action sendiri.
- **Sinkronisasi conflict**: Finalizer akan sync semua worktree setelah ada merge ke preview.

---

> **Reminder:** File ini hidup di setiap worktree tapi tidak ikut di-commit. Kalau rules berubah, bilang ke Finalizer — jangan edit sendiri.
