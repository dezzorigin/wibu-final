# PRD — WibuFinal

## 1. Informasi Proyek

| Field | Nilai |
|---|---|
| Nama Proyek | WibuFinal |
| Tech Stack | Next.js |
| Status | Dalam pengembangan |
| Penanggung Jawab | Nabil Aulia Dika |
| Live Demo | - |
| Versi Dokumen | 1.0 |
| Tanggal | 2026 |

## 2. Latar Belakang

Streaming anime full episode langsung. Fitur: genre, jadwal, favorit, pencarian.

## 3. Tujuan

Menyediakan solusi digital yang efisien, terukur, dan mudah dipelihara.

## 4. Ruang Lingkup

- Fitur inti aplikasi sesuai struktur repo.
- Setup & konfigurasi pengembangan lokal.
- Dokumentasi (README + PRD).

## 5. Fitur & Persyaratan Fungsional

Struktur proyek:
- app/
- components/
- hooks/
- lib/
- LICENSE
- PRD.md
- README.md
- eslint.config.mjs
- metadata.json
- next-env.d.ts
- next.config.ts
- package-lock.json
- package.json
- postcss.config.mjs
- tsconfig.json
- tsconfig.tsbuildinfo

## 6. Persyaratan Non-Fungsional

- **Performa:** responsif untuk penggunaan normal.
- **Keamanan:** rahasia (`.env`) tidak boleh ter-commit.
- **Maintainability:** kode terstruktur, terdokumentasi.

## 7. Arsitektur & Tech Stack

Next.js

## 8. Milestone

| Fase | Status |
|---|---|
| Inisialisasi & scaffolding | ✅ |
| Pengembangan fitur inti | 🔄 |
| Testing & QA | ⏳ |
| Deployment | ⏳ |
| Dokumentasi | ✅ |

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Konfigurasi env bocor | `.gitignore` + `.env.example` |
| Dependency usang | Audit berkala |

## 10. Kriteria Keberhasilan

- Aplikasi berjalan tanpa error di lingkungan dev.
- README & PRD lengkap dan up-to-date.

## 11. Lisensi

MIT (LICENSE)
