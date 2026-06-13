# PPSA Management System

<p align="center">
  <img src="https://github.com/cakgup/ppsa/blob/main/assets/logo.png" alt="Logo PPSA" width="140">
</p>

<p align="center">
  <strong>Sistem informasi pesantren yang menggabungkan portal publik PPSA dan dashboard administrasi internal.</strong><br>
  Siap dipakai sebagai frontend statis, terhubung ke API backend, dan mudah dijadikan dasar untuk project lembaga lain.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/GitHub-Pages-brightgreen" alt="GitHub Pages">
  <img src="https://img.shields.io/badge/Cloudflare-Workers-orange" alt="Cloudflare Workers">
  <img src="https://img.shields.io/badge/Cloudflare-D1-orange" alt="Cloudflare D1">
  <img src="https://img.shields.io/badge/PWA-Ready-2E7D32" alt="PWA Ready">
  <img src="https://img.shields.io/badge/Portal%20%2B%20Dashboard-Integrated-166534" alt="Portal and Dashboard Integrated">
</p>

---

## Bismillahirrahmanirrahim

Repository ini adalah ikhtiar untuk membuat pengelolaan pesantren menjadi lebih tertib, mudah dipantau, dan lebih siap diteruskan oleh tim berikutnya.

README ini diperbarui agar:

- fitur yang tertulis mengikuti kondisi repo saat ini;
- alur portal publik dan dashboard internal lebih mudah dipahami;
- orang lain lebih mudah menduplikasi project untuk lembaga lain;
- endpoint, akun, rekening, dan nilai sensitif tidak tertulis mentah di dokumentasi.

---

## Tentang Aplikasi

**PPSA Management System** terdiri dari dua sisi utama:

- **portal publik** untuk profil lembaga, program, pendaftaran, berita, donasi, dan kontak;
- **dashboard internal** untuk CRUD data utama pesantren, analitik ringkas, dan pengelolaan konten portal.

Frontend dapat di-hosting secara statis. Mode produksinya mengandalkan API backend terpisah, sementara kode frontend juga masih menyediakan jalur demo/fallback sesuai konfigurasi.

---

## Fitur Terkini

| Area | Keterangan |
|---|---|
| Portal publik | Profil lembaga, program, pendaftaran santri, jadwal kegiatan, berita, pengumuman, donasi, dan kontak |
| Pengaturan konten portal | Hero, ringkasan, fokus pendidikan, biaya, jadwal, tautan aplikasi doa, dan kontak bisa diatur dari dashboard |
| Leads publik | Form pendaftaran, pesan kontak, dan konfirmasi donasi masuk ke modul tindak lanjut |
| Data santri | Biodata santri, wali, status pendidikan, dan catatan |
| Data pengajar | Data ustadz/pengajar, spesialisasi, dan status aktif |
| Akademik | Kelas, mapel, jadwal, nilai/rapor, absensi, dan monitoring tahfidz |
| Keuangan | Buku kas, SPP/iuran, dan data donatur/infaq |
| Administrasi | Surat menyurat, asrama/kamar, inventaris, dan user role |
| Dashboard eksekutif | Metrik ringkas, arus kas, pembayaran, absensi, distribusi santri, dan capaian tahfidz |
| Utilitas dashboard | Sorting tabel, pencarian, dynamic reference field, dan export CSV |
| Demo/fallback | Frontend dapat memakai data demo jika diizinkan oleh konfigurasi |

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
| `index.html` | Portal publik PPSA |
| `dashboard.html` | Dashboard internal/admin |
| `assets/app.js` | CRUD dashboard, analitik, export CSV, sorting, dan form builder |
| `assets/portal.js` | Renderer portal publik, fetch konten publik, dan submit form publik |
| `assets/config.js` | Konfigurasi endpoint API, mode demo, dan URL aplikasi terkait |
| `assets/portal.css` | Styling portal publik |
| `assets/styles.css` | Styling dashboard internal |
| `sw.js` | Service worker cache dasar |

---

## Menjalankan Secara Lokal

Gunakan local server agar perilaku frontend mendekati hosting statis sesungguhnya.

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

## Konfigurasi API

Konfigurasi frontend berada di:

```text
assets/config.js
```

Contoh aman untuk duplikasi:

```js
window.PPSA_CONFIG = {
  API_BASE_URL: "https://api-anda.workers.dev",
  APP_NAME: "Nama Aplikasi Anda",
  DOA_APP_URL: "https://domain-doa-anda.example",
  DEMO_MODE: false,
  FALLBACK_TO_DEMO: false
};
```

Yang perlu diperhatikan:

- jangan commit endpoint internal atau staging yang tidak perlu dibuka publik;
- jangan tulis email admin, password, atau token di README;
- nilai `DEMO_MODE` dan `FALLBACK_TO_DEMO` harus dipahami sebelum deploy;
- sesuaikan `DOA_APP_URL` jika hasil fork tidak lagi terhubung ke aplikasi doa PPSA.

---

## Panduan Duplikasi Project

### 1. Clone repository

```bash
git clone <url-repository-anda>
cd ppsa_ms
```

### 2. Ganti identitas lembaga

Periksa dan sesuaikan:

- judul halaman dan meta di `index.html` serta `dashboard.html`;
- nama lembaga, alamat, tagline, dan teks portal dari dashboard atau fallback data;
- logo yang sekarang masih mengarah ke aset PPSA;
- tautan aplikasi doa, media sosial, dan kontak.

### 3. Audit data fallback

Repo ini masih menyimpan data fallback/demo di frontend untuk beberapa modul. Saat menduplikasi, audit:

- teks hero dan ringkasan portal;
- program, berita, pengumuman, dan jadwal contoh;
- data demo dashboard;
- contoh role atau user demo.

Jika hasil fork akan dipakai untuk produksi, gantilah seluruh contoh tersebut dengan data Anda sendiri.

### 4. Siapkan backend sendiri

README ini sengaja tidak menyalin identifier produksi. Untuk environment baru:

- buat Worker/API Anda sendiri;
- buat database D1 Anda sendiri;
- atur origin, secret, dan binding di backend;
- arahkan `API_BASE_URL` ke endpoint baru.

### 5. Masking data sensitif

Saat membagikan hasil fork, jangan menulis mentah:

- akun admin;
- password;
- token;
- rekening donasi;
- nomor internal;
- URL private environment.

Gunakan placeholder seperti:

```text
admin@example.com
********
1234-5678-XXXX
https://api-anda.workers.dev
```

---

## Deploy

Frontend dapat dipublikasikan ke:

- GitHub Pages
- Cloudflare Pages
- Vercel
- hosting statis lain

Sebelum deploy:

- pastikan `assets/config.js` mengarah ke backend yang benar;
- pastikan konten fallback sudah tidak mengandung identitas lembaga lama;
- pastikan rekening, nomor kontak, dan tautan media sosial telah diganti;
- pastikan mode demo dimatikan jika targetnya produksi.

---

## Checklist Sebelum Publish

- [ ] Login dashboard berjalan normal
- [ ] Portal publik bisa memuat konten tanpa error
- [ ] Form pendaftaran, kontak, dan konfirmasi donasi mengarah ke endpoint yang benar
- [ ] CRUD dashboard berjalan pada modul utama yang dipakai
- [ ] Sorting, pencarian, dan export CSV berfungsi
- [ ] Teks, logo, rekening, dan kontak sudah sesuai lembaga baru
- [ ] Tidak ada endpoint, akun, atau kredensial lama yang tertulis di repo
- [ ] Tampilan mobile portal dan dashboard tetap rapi

---

## Troubleshooting

### Dashboard tidak bisa login

- cek `API_BASE_URL` di `assets/config.js`;
- cek backend auth aktif;
- cek apakah mode demo memang dimatikan.

### Portal publik tampil, tetapi form tidak masuk

- cek endpoint publik di backend;
- cek response di tab Network browser;
- cek apakah backend mengizinkan origin domain frontend.

### Data dashboard kosong

- cek apakah frontend sedang membaca API produksi atau fallback demo;
- cek modul yang dipilih memang memiliki data;
- reload ulang setelah login.

### Export CSV tidak menghasilkan file

- cek apakah browser memblokir download otomatis;
- cek apakah tabel aktif memiliki data.

---

## Catatan Keamanan

- Jangan menyimpan akun admin, password, token, atau secret backend di repository.
- Rekening donasi dan nomor kontak sebaiknya diaudit sebelum repository dipublikasikan.
- Mode demo hanya untuk kebutuhan preview atau fallback terbatas, bukan untuk data riil.
- Jika membuat fork untuk lembaga baru, ganti seluruh identitas organisasi pada fallback data dan pengaturan portal.

---

## Teknologi

| Teknologi | Fungsi |
|---|---|
| HTML | Struktur portal publik dan dashboard |
| CSS | Layout portal dan dashboard |
| JavaScript | Logika CRUD, analitik, form publik, dan export CSV |
| localStorage | Penyimpanan data demo/fallback tertentu |
| Service Worker | Cache asset statis |
| Cloudflare Workers | Target backend API produksi |
| Cloudflare D1 | Target database produksi |

---

## Lisensi

Repository ini menggunakan lisensi **GNU General Public License v3.0 (GPL-3.0)**.  
Lihat detail pada file [LICENSE](LICENSE).

---

<p align="center">
  <strong>Dibuat sebagai ikhtiar tertib administrasi pesantren, dirawat dengan amanah, dan dikembangkan bertahap sesuai kebutuhan lembaga.</strong>
</p>

<p align="center">
  <sub>developed with &#10084;&#65039; by <a href="https://cakgup.codeberg.page">cakgup</a></sub>
</p>
