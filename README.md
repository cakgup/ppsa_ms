# PPSA Management System

<p align="center">
  <img src="https://github.com/cakgup/ppsa/blob/main/assets/logo.png" alt="Logo PPSA" width="140">
</p>

<p align="center">
  <strong>Sistem Informasi Manajemen Pesantren dan PPSA</strong><br>
  Membantu pengelolaan santri, akademik, keuangan, tahfidz, kegiatan, dan administrasi pesantren dalam satu platform terintegrasi.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub-Pages-brightgreen" alt="GitHub Pages">
  <img src="https://img.shields.io/badge/Cloudflare-Workers-orange" alt="Cloudflare Workers">
  <img src="https://img.shields.io/badge/Cloudflare-D1-orange" alt="Cloudflare D1">
  <img src="https://img.shields.io/badge/PWA-Ready-2E7D32" alt="PWA Ready">
  <img src="https://img.shields.io/badge/Demo-Fallback-blue" alt="Demo Fallback">
</p>

---

## Bismillahirrahmanirrahim

Repository ini merupakan ikhtiar digital untuk membantu pengelolaan pesantren yang lebih tertib, transparan, dan mudah diakses oleh pengurus, ustadz, santri, maupun wali santri.

> _Khairunnas anfa'uhum linnas._

---

## Tentang Aplikasi

**PPSA Management System** adalah prototype aplikasi manajemen pesantren berbasis web statis. Frontend dapat berjalan di GitHub Pages, sementara backend produksi dapat diarahkan ke Cloudflare Workers dan Cloudflare D1.

Aplikasi ini sudah mendukung:

- login demo;
- dashboard eksekutif;
- modul CRUD untuk data utama pesantren;
- pencarian data per modul;
- export data ke CSV;
- penyimpanan data demo di `localStorage`;
- fallback otomatis ke data demo jika API belum tersedia;
- PWA cache dasar melalui service worker.

---

## Fitur Utama

| Modul | Keterangan |
|---|---|
| Dashboard | Ringkasan santri, pengajar, kelas, saldo kas, kehadiran, dan pembayaran |
| Manajemen Santri | Biodata santri, wali, kelas, kontak, status, dan catatan |
| Pengajar | Data ustadz/pengajar, spesialisasi, dan status aktif |
| Akademik | Kelas, mata pelajaran, jadwal, dan roadmap nilai/rapor |
| Tahfidz | Monitoring hafalan, murajaah, skor, dan catatan pengajar |
| Absensi | Data kehadiran kegiatan atau pembelajaran berbasis QR/manual |
| Keuangan | Buku kas, SPP/iuran, donatur, infaq, dan histori pembayaran |
| Administrasi | Surat menyurat, arsip, inventaris, asrama, dan perpustakaan |
| Media Dakwah | Pengumuman, artikel, galeri, dan dokumentasi kegiatan |
| Sistem | User role, audit log, pengaturan, dan roadmap backup |

---

## Struktur Repository

```text
ppsa_ms/
├── index.html
├── assets/
│   ├── app.js
│   ├── config.js
│   └── styles.css
├── manifest.webmanifest
├── sw.js
├── LICENSE
└── README.md
```

Keterangan singkat:

| File | Fungsi |
|---|---|
| `index.html` | Struktur halaman login dan dashboard |
| `assets/app.js` | Logika aplikasi, data demo, routing menu, CRUD, pencarian, dan export CSV |
| `assets/config.js` | Konfigurasi API, mode demo, dan fallback |
| `assets/styles.css` | Tampilan aplikasi dan responsive layout |
| `manifest.webmanifest` | Konfigurasi PWA |
| `sw.js` | Service worker untuk cache asset statis |

---

## Menjalankan Secara Lokal

Disarankan menjalankan aplikasi dengan local server.

### Python

```bash
python -m http.server 8000
```

Buka:

```text
http://localhost:8000
```

### Node.js

```bash
npx -y serve .
```

Buka:

```text
http://localhost:3000
```

---

## Akun Demo

```text
Email    : admin@ppsa.local
Password : Admin12345!
```

Catatan:

- Jika `DEMO_MODE` bernilai `true`, semua request memakai data demo.
- Jika `DEMO_MODE` bernilai `false` tetapi API belum tersedia, aplikasi akan fallback ke data demo selama `FALLBACK_TO_DEMO` bernilai `true`.
- Data demo yang ditambah/edit/hapus disimpan sementara di browser melalui `localStorage`.

---

## Konfigurasi API

Edit file:

```text
assets/config.js
```

Contoh:

```js
window.PPSA_CONFIG = {
  API_BASE_URL: "https://example.workers.dev",
  APP_NAME: "PPSA Management System",
  DEMO_MODE: false,
  FALLBACK_TO_DEMO: true
};
```

Untuk produksi:

- arahkan `API_BASE_URL` ke Cloudflare Worker aktif;
- set `DEMO_MODE` ke `false`;
- matikan `FALLBACK_TO_DEMO` jika ingin error API terlihat tegas.

---

## Roadmap Pengembangan

### Versi 1

- Dashboard eksekutif
- CRUD data santri, guru, kelas, dan kegiatan
- Buku kas dan SPP/iuran
- Export CSV

### Versi 2

- Tahfidz lebih detail per juz/surah
- Absensi QR sungguhan
- Multi cabang/unit
- Surat menyurat dengan template cetak

### Versi 3

- Perpustakaan dan asrama lebih lengkap
- WhatsApp Gateway
- Backup terjadwal
- Role permission granular

### Versi 4

- LMS Pesantren
- Mobile App Android/TWA
- AI Assistant
- Knowledge Base lembaga

---

## Checklist Sebelum Publish

- [ ] Login demo berjalan normal
- [ ] Dashboard tampil setelah login
- [ ] Tambah, edit, hapus data berjalan di mode demo
- [ ] Pencarian tabel berjalan di beberapa modul
- [ ] Export CSV menghasilkan file
- [ ] Tampilan mobile tidak memotong menu dan tabel
- [ ] `assets/config.js` sudah sesuai target deploy
- [ ] Service worker tidak menahan cache lama
- [ ] Tidak ada error penting di browser console

---

## Teknologi

| Teknologi | Fungsi |
|---|---|
| HTML | Struktur aplikasi |
| CSS | Layout dashboard dan tampilan responsive |
| JavaScript | Logika aplikasi, CRUD, demo API, dan export CSV |
| localStorage | Penyimpanan session dan data demo |
| Service Worker | Cache asset statis |
| Cloudflare Workers | Target backend API produksi |
| Cloudflare D1 | Target database produksi |

---

## Lisensi

Repository ini menggunakan lisensi **GNU General Public License v3.0 (GPL-3.0)**.<br>
Lihat detail pada file [LICENSE](LICENSE).

---

<p align="center">
  <strong>Dibuat sebagai ikhtiar tertib administrasi pesantren, dirawat dengan amanah, dan dikembangkan bertahap sesuai kebutuhan lembaga.</strong>
</p>
