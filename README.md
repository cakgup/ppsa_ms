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
  <img src="https://img.shields.io/badge/Mode-Production-166534" alt="Production Mode">
</p>

---

## Bismillahirrahmanirrahim

Repository ini merupakan ikhtiar digital untuk membantu pengelolaan pesantren yang lebih tertib, transparan, dan mudah diakses oleh pengurus, ustadz, santri, maupun wali santri.

> _Khairunnas anfa'uhum linnas._

---

## Tentang Aplikasi

**PPSA Management System** adalah aplikasi manajemen pesantren berbasis web yang terdiri dari portal publik dan dashboard internal. Frontend dapat berjalan pada hosting statis, sementara backend produksi berjalan melalui Cloudflare Workers dan Cloudflare D1.

Aplikasi ini sudah mendukung:

- login dashboard internal;
- portal publik PPSA;
- dashboard eksekutif;
- modul CRUD untuk data utama pesantren;
- form publik untuk pendaftaran, pesan, dan konfirmasi donasi;
- pencarian data per modul;
- sorting kolom tabel;
- export data ke CSV;
- referensi dinamis dari data induk santri, pengajar, kelas, dan mata pelajaran;
- grafik eksekutif berbasis data database;
- PWA cache dasar melalui service worker.

---

## Fitur Utama

| Modul | Keterangan |
|---|---|
| Dashboard | Ringkasan santri, pengajar, kelas, saldo kas, kehadiran, dan pembayaran |
| Manajemen Santri | Biodata santri, wali, kelas, kontak, status, dan catatan |
| Pengajar | Data ustadz/pengajar, spesialisasi, dan status aktif |
| Akademik | Kelas, mata pelajaran, jadwal, nilai/rapor, dan absensi |
| Tahfidz | Monitoring hafalan, murajaah, skor, dan catatan pengajar |
| Absensi | Data kehadiran kegiatan atau pembelajaran dengan metode QR/manual |
| Keuangan | Buku kas, SPP/iuran, donatur, infaq, dan histori pembayaran |
| Administrasi | Surat menyurat, arsip, inventaris, asrama, dan perpustakaan |
| Portal Publik | Pengaturan portal, program, jadwal santri, donasi, dan konten publikasi |
| Sistem | User role dan pengelolaan akses dashboard |

---

## Struktur Repository

```text
ppsa_ms/
|-- index.html
|-- dashboard.html
|-- assets/
|   |-- app.js
|   |-- config.js
|   |-- portal.js
|   |-- portal.css
|   `-- styles.css
|-- manifest.webmanifest
|-- sw.js
|-- LICENSE
`-- README.md
```

Keterangan singkat:

| File | Fungsi |
|---|---|
| `index.html` | Halaman portal publik PPSA |
| `dashboard.html` | Halaman dashboard internal/admin |
| `assets/app.js` | Logika dashboard admin, CRUD, referensi dinamis, analitik, pencarian, sorting, dan export CSV |
| `assets/config.js` | Konfigurasi API dan URL aplikasi terkait |
| `assets/portal.js` | Logika portal publik, form publik, dan sinkronisasi konten dari API |
| `assets/portal.css` | Tampilan portal publik |
| `assets/styles.css` | Tampilan dashboard admin dan responsive layout |
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

## Akun Admin

```text
Email    : ********
Password : ********
```

Catatan:

- Kredensial admin disimpan terpisah dari repository dan tidak dituliskan terbuka di README.
- Untuk lingkungan produksi, `DEMO_MODE` bernilai `false`.
- Untuk lingkungan produksi, `FALLBACK_TO_DEMO` bernilai `false`.

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
  DOA_APP_URL: "https://example-doa.app",
  DEMO_MODE: false,
  FALLBACK_TO_DEMO: false
};
```

Untuk produksi:

- arahkan `API_BASE_URL` ke Cloudflare Worker aktif;
- set `DEMO_MODE` ke `false`;
- set `FALLBACK_TO_DEMO` ke `false`;
- simpan kredensial dan secret backend di luar repository.

---

## Roadmap Pengembangan

### Versi 1

- Portal publik dan dashboard internal
- CRUD data santri, guru, kelas, kegiatan, keuangan, dan administrasi
- Buku kas, SPP/iuran, dan donatur/infaq
- Export CSV dan sorting tabel
- Grafik eksekutif berbasis data database

### Versi 2

- Tahfidz lebih detail per juz/surah
- Absensi QR sungguhan berbasis scanner
- Role permission granular
- Surat menyurat dengan template cetak

### Versi 3

- Perpustakaan dan asrama lebih lengkap
- WhatsApp Gateway
- Backup terjadwal
- Dashboard lintas cabang/unit

### Versi 4

- LMS Pesantren
- Mobile App Android/TWA
- AI Assistant
- Knowledge Base lembaga

---

## Checklist Sebelum Publish

- [ ] Login dashboard berjalan normal
- [ ] Dashboard tampil setelah login
- [ ] Tambah, edit, hapus data berjalan melalui API produksi
- [ ] Pencarian tabel berjalan di beberapa modul
- [ ] Sorting tabel berjalan di beberapa modul
- [ ] Export CSV menghasilkan file
- [ ] Form publik portal masuk ke database
- [ ] Tampilan mobile tidak memotong menu dan tabel
- [ ] `assets/config.js` sudah sesuai target deploy
- [ ] Service worker tidak menahan cache lama
- [ ] Tidak ada error penting di browser console

---

## Teknologi

| Teknologi | Fungsi |
|---|---|
| HTML | Struktur portal publik dan dashboard admin |
| CSS | Layout dashboard, portal, dan tampilan responsive |
| JavaScript | Logika aplikasi, CRUD, analitik, referensi dinamis, dan export CSV |
| localStorage | Penyimpanan session dashboard |
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
