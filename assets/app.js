const CONFIG = window.PPSA_CONFIG || {};
const API = CONFIG.API_BASE_URL || "";
const DEMO_MODE = CONFIG.DEMO_MODE === true;
const FALLBACK_TO_DEMO = CONFIG.FALLBACK_TO_DEMO !== false;
const STORAGE_KEY = "ppsa_ms_demo_data";

const state = {
  token: localStorage.getItem("ppsa_ms_token"),
  user: JSON.parse(localStorage.getItem("ppsa_ms_user") || "null"),
  page: "dashboard",
  filters: {}
};

const groups = [
  ["Beranda", [["dashboard", "Dashboard", "Ready"], ["profile", "Profil Lembaga", "Demo"], ["branches", "Cabang/Unit", "Ready"]]],
  ["Akademik", [["students", "Santri", "Ready"], ["guardians", "Wali Santri", "Ready"], ["teachers", "Pengajar/Ustadz", "Ready"], ["classes", "Kelas", "Ready"], ["subjects", "Mata Pelajaran", "Ready"], ["schedules", "Jadwal Pelajaran", "Ready"], ["grades", "Nilai/Rapor", "Demo"]]],
  ["Kehadiran & Tahfidz", [["attendance", "Absensi QR", "Ready"], ["tahfidz", "Tahfidz Monitoring", "Ready"]]],
  ["Keuangan", [["cash", "Buku Kas", "Ready"], ["payments", "SPP/Iuran", "Ready"], ["donors", "Donatur/Infaq", "Ready"]]],
  ["Operasional", [["activities", "Kegiatan", "Ready"], ["letters", "Surat Menyurat", "Ready"], ["library", "Perpustakaan", "Ready"], ["dormitories", "Asrama/Kamar", "Ready"], ["inventory", "Inventaris", "Ready"]]],
  ["Media & Dakwah", [["contents", "Pengumuman/Artikel", "Ready"], ["gallery", "Galeri", "Demo"]]],
  ["Portal Publik", [["portal_settings", "Pengaturan Portal", "Ready"], ["programs", "Program Portal", "Ready"], ["portal_schedule", "Jadwal Portal", "Ready"], ["donation_programs", "Program Donasi", "Ready"]]],
  ["Inbox Publik", [["admissions", "Leads Pendaftaran", "Ready"], ["contact_messages", "Pesan Masuk", "Ready"], ["donation_confirmations", "Konfirmasi Donasi", "Ready"]]],
  ["Pengembangan V4", [["lms", "LMS Pembelajaran", "Soon"]]],
  ["Sistem", [["users", "User & Role", "Ready"], ["audit", "Audit Log", "Ready"], ["settings", "Pengaturan", "Demo"], ["backup", "Backup", "Soon"]]]
];

const meta = {
  branches: { title: "Cabang/Unit", subtitle: "Struktur multi cabang PPSA", cols: ["id", "name", "code", "leader", "phone", "status"], fields: ["name", "code", "address", "leader", "phone", "status"] },
  students: { title: "Santri", subtitle: "Data induk santri dan status pendidikan", cols: ["id", "student_no", "name", "gender", "class_name", "status"], fields: ["student_no", "name", "gender", "birth_place", "birth_date", "class_name", "guardian_name", "phone", "address", "status", "notes"] },
  guardians: { title: "Wali Santri", subtitle: "Kontak orang tua/wali santri", cols: ["id", "name", "student_name", "relation", "phone", "occupation"], fields: ["name", "student_name", "relation", "phone", "occupation", "address"] },
  teachers: { title: "Pengajar/Ustadz", subtitle: "Data pengajar, kompetensi, dan status aktif", cols: ["id", "teacher_no", "name", "specialization", "phone", "status"], fields: ["teacher_no", "name", "gender", "specialization", "phone", "address", "status"] },
  classes: { title: "Kelas", subtitle: "Kelas formal, tahsin, tahfidz, dan madrasah diniyah", cols: ["id", "name", "level", "homeroom_teacher", "capacity", "status"], fields: ["name", "level", "homeroom_teacher", "capacity", "status"] },
  subjects: { title: "Mata Pelajaran", subtitle: "Kurikulum dan mata pelajaran pesantren", cols: ["id", "name", "category", "teacher_name", "status"], fields: ["name", "category", "teacher_name", "description", "status"] },
  schedules: { title: "Jadwal Pelajaran", subtitle: "Jadwal belajar mingguan", cols: ["id", "day_name", "time_range", "class_name", "subject_name", "teacher_name"], fields: ["day_name", "time_range", "class_name", "subject_name", "teacher_name", "room"] },
  attendance: { title: "Absensi QR", subtitle: "Absensi kegiatan dan pembelajaran", cols: ["id", "attendance_date", "student_name", "class_name", "status", "method"], fields: ["attendance_date", "student_name", "class_name", "status", "method", "notes"] },
  tahfidz: { title: "Tahfidz Monitoring", subtitle: "Monitoring hafalan, murajaah, dan capaian santri", cols: ["id", "student_name", "surah", "ayah_range", "memorization_status", "score"], fields: ["student_name", "surah", "ayah_range", "memorization_status", "score", "review_date", "teacher_name", "notes"] },
  cash: { title: "Buku Kas", subtitle: "Pemasukan dan pengeluaran operasional", cols: ["id", "trx_date", "type", "category", "description", "amount"], fields: ["trx_date", "type", "category", "description", "amount"] },
  payments: { title: "SPP/Iuran", subtitle: "Tagihan, pembayaran, dan status iuran santri", cols: ["id", "student_name", "period", "amount", "paid_amount", "status"], fields: ["student_name", "period", "amount", "paid_amount", "due_date", "status", "notes"] },
  donors: { title: "Donatur/Infaq", subtitle: "Data donatur dan histori kontribusi", cols: ["id", "name", "donor_type", "phone", "last_donation", "total_donation"], fields: ["name", "donor_type", "phone", "address", "last_donation", "total_donation", "notes"] },
  activities: { title: "Kegiatan", subtitle: "Kajian, rapat, event santri, dan dakwah", cols: ["id", "title", "activity_date", "location", "status"], fields: ["title", "activity_date", "location", "description", "status"] },
  contents: { title: "Pengumuman/Artikel", subtitle: "Konten publik, pengumuman, dan materi dakwah", cols: ["id", "title", "type", "summary", "is_published"], fields: ["title", "type", "summary", "body", "is_published"] },
  programs: { title: "Program Portal", subtitle: "Program unggulan yang tampil di portal publik", cols: ["id", "title", "sort_order", "is_published"], fields: ["title", "description", "sort_order", "is_published"] },
  donation_programs: { title: "Program Donasi", subtitle: "Daftar program donasi, infaq, dan wakaf di portal", cols: ["id", "title", "target_amount", "is_active"], fields: ["title", "summary", "target_amount", "is_active"] },
  portal_schedule: { title: "Jadwal Portal", subtitle: "Ritme harian santri yang tampil di portal publik", cols: ["id", "sort_order", "time_slot", "activity"], fields: ["time_slot", "activity", "sort_order"] },
  portal_settings: { title: "Pengaturan Portal", subtitle: "Konten utama portal publik PPSA", cols: ["id", "site_name", "hero_title", "registration_title", "contact_title"], fields: ["site_name", "site_tagline", "hero_eyebrow", "hero_title", "hero_lead", "hero_primary_label", "hero_primary_href", "hero_secondary_label", "hero_secondary_href", "summary_title", "summary_lead", "profile_title", "profile_body_1", "profile_body_2", "focus_title", "focus_points", "program_section_title", "program_section_lead", "required_title", "required_points", "extra_title", "extra_points", "registration_title", "registration_lead", "psb_card_title", "psb_registration_text", "psb_entry_text", "requirements_title", "requirements_points", "pricing_title", "pricing_putra", "pricing_putri", "pricing_spp", "pricing_note", "schedule_title", "schedule_lead", "donation_title", "donation_lead", "doa_title", "doa_lead", "doa_url", "contact_title", "contact_address", "instagram_label", "instagram_url", "youtube_label", "youtube_url", "whatsapp_1_label", "whatsapp_1_number", "whatsapp_2_label", "whatsapp_2_number"], singleton: true },
  letters: { title: "Surat Menyurat", subtitle: "Surat masuk, surat keluar, dan arsip digital", cols: ["id", "letter_no", "letter_date", "type", "subject", "status"], fields: ["letter_no", "letter_date", "type", "sender_receiver", "subject", "summary", "status"] },
  library: { title: "Perpustakaan", subtitle: "Buku, peminjaman, dan pengembalian", cols: ["id", "book_code", "title", "author", "stock", "available"], fields: ["book_code", "title", "author", "category", "stock", "available", "location"] },
  dormitories: { title: "Asrama/Kamar", subtitle: "Penempatan santri dan kapasitas kamar", cols: ["id", "room_name", "building", "capacity", "occupied", "supervisor"], fields: ["room_name", "building", "capacity", "occupied", "supervisor", "notes"] },
  inventory: { title: "Inventaris", subtitle: "Aset barang, kondisi, dan lokasi", cols: ["id", "asset_code", "name", "category", "location", "condition_status"], fields: ["asset_code", "name", "category", "location", "condition_status", "purchase_year", "notes"] },
  admissions: { title: "Leads Pendaftaran", subtitle: "Form minat santri baru dari portal publik", cols: ["id", "created_at", "student_name", "guardian_name", "phone", "program", "follow_up_status"], fields: ["student_name", "gender", "birth_date", "guardian_name", "phone", "program", "address", "notes", "follow_up_status", "follow_up_notes", "handled_by", "handled_at"] },
  contact_messages: { title: "Pesan Masuk", subtitle: "Pesan publik dari halaman kontak portal", cols: ["id", "created_at", "name", "contact", "subject", "follow_up_status"], fields: ["name", "contact", "subject", "message", "follow_up_status", "follow_up_notes", "handled_by", "handled_at"] },
  donation_confirmations: { title: "Konfirmasi Donasi", subtitle: "Konfirmasi transfer dan donasi dari portal publik", cols: ["id", "created_at", "donor_name", "phone", "amount", "follow_up_status"], fields: ["donor_name", "phone", "amount", "method", "notes", "follow_up_status", "follow_up_notes", "handled_by", "handled_at"] },
  users: { title: "User & Role", subtitle: "Akun pengguna dan hak akses sistem", cols: ["id", "name", "email", "role", "status"], fields: ["name", "email", "role", "status"] },
  audit: { title: "Audit Log", subtitle: "Jejak aktivitas pengguna", cols: ["id", "created_at", "user_name", "action", "module", "description"], fields: ["created_at", "user_name", "action", "module", "description"] }
};

const labels = {
  id: "ID", name: "Nama", code: "Kode", address: "Alamat", leader: "Pimpinan", phone: "Telepon", status: "Status",
  student_no: "NIS", gender: "L/P", birth_place: "Tempat Lahir", birth_date: "Tanggal Lahir", class_name: "Kelas",
  guardian_name: "Wali", notes: "Catatan", teacher_no: "NIP/No Ustadz", specialization: "Keahlian", level: "Level",
  homeroom_teacher: "Wali Kelas", capacity: "Kapasitas", category: "Kategori", teacher_name: "Pengajar",
  description: "Deskripsi", day_name: "Hari", time_range: "Jam", subject_name: "Mapel", room: "Ruang",
  attendance_date: "Tanggal", student_name: "Santri", method: "Metode", surah: "Surah", ayah_range: "Ayat",
  memorization_status: "Status Hafalan", score: "Nilai", review_date: "Tanggal Setor", trx_date: "Tanggal",
  type: "Jenis", amount: "Nominal", paid_amount: "Dibayar", period: "Periode", due_date: "Jatuh Tempo",
  donor_type: "Jenis Donatur", last_donation: "Donasi Terakhir", total_donation: "Total Donasi", title: "Judul",
  activity_date: "Tanggal", location: "Lokasi", body: "Isi", is_published: "Publikasi", letter_no: "No Surat",
  letter_date: "Tanggal Surat", sender_receiver: "Pengirim/Penerima", subject: "Perihal", summary: "Ringkasan",
  book_code: "Kode Buku", author: "Penulis", stock: "Stok", available: "Tersedia", room_name: "Kamar",
  building: "Gedung", occupied: "Terisi", supervisor: "Pembina", asset_code: "Kode Aset", condition_status: "Kondisi",
  purchase_year: "Tahun Beli", email: "Email", role: "Role", created_at: "Waktu", user_name: "User", action: "Aksi", module: "Modul",
  relation: "Relasi", occupation: "Pekerjaan", program: "Program", contact: "Kontak", message: "Pesan",
  donor_name: "Donatur", method: "Metode", follow_up_status: "Status Follow Up", follow_up_notes: "Catatan Follow Up",
  handled_by: "Ditangani Oleh", handled_at: "Ditangani Pada", type: "Tipe", summary: "Ringkasan", sort_order: "Urutan", time_slot: "Jam",
  target_amount: "Target", is_active: "Aktif", site_name: "Nama Situs", site_tagline: "Tagline Situs", hero_eyebrow: "Label Hero",
  hero_title: "Judul Hero", hero_lead: "Deskripsi Hero", hero_primary_label: "Label Tombol Utama", hero_primary_href: "Link Tombol Utama",
  hero_secondary_label: "Label Tombol Kedua", hero_secondary_href: "Link Tombol Kedua", summary_title: "Judul Ringkasan", summary_lead: "Deskripsi Ringkasan",
  profile_title: "Judul Profil", profile_body_1: "Profil Paragraf 1", profile_body_2: "Profil Paragraf 2", focus_title: "Judul Fokus",
  focus_points: "Poin Fokus", program_section_title: "Judul Program", program_section_lead: "Deskripsi Program", required_title: "Judul Kegiatan Wajib",
  required_points: "Poin Kegiatan Wajib", extra_title: "Judul Kegiatan Tambahan", extra_points: "Poin Kegiatan Tambahan", registration_title: "Judul Pendaftaran",
  registration_lead: "Deskripsi Pendaftaran", psb_card_title: "Judul Kartu Jadwal PSB", psb_registration_text: "Teks Pendaftaran", psb_entry_text: "Teks Masuk Pondok",
  requirements_title: "Judul Persyaratan", requirements_points: "Poin Persyaratan", pricing_title: "Judul Pembiayaan", pricing_putra: "Biaya Putra",
  pricing_putri: "Biaya Putri", pricing_spp: "SPP Bulanan", pricing_note: "Catatan Pembiayaan", schedule_title: "Judul Jadwal",
  schedule_lead: "Deskripsi Jadwal", donation_title: "Judul Donasi", donation_lead: "Deskripsi Donasi", doa_title: "Judul Aplikasi Doa",
  doa_lead: "Deskripsi Aplikasi Doa", doa_url: "URL Aplikasi Doa", contact_title: "Judul Kontak", contact_address: "Alamat Kontak",
  instagram_label: "Label Instagram", instagram_url: "URL Instagram", youtube_label: "Label YouTube", youtube_url: "URL YouTube",
  whatsapp_1_label: "Label WhatsApp 1", whatsapp_1_number: "Nomor WhatsApp 1", whatsapp_2_label: "Label WhatsApp 2", whatsapp_2_number: "Nomor WhatsApp 2"
};

const seedDemo = {
  branches: [{ id: 1, name: "PPSA Pusat", code: "PST", leader: "KH Ahmad Fauzi", phone: "0812-1111-2222", status: "aktif", address: "Komplek Pesantren Utama" }],
  students: [
    { id: 1, student_no: "S-2026-001", name: "Ahmad Rizqi", gender: "L", class_name: "Tahfidz A", guardian_name: "Bapak Fauzan", phone: "0812-3344-5566", status: "aktif" },
    { id: 2, student_no: "S-2026-002", name: "Fatimah Azzahra", gender: "P", class_name: "Tahsin B", guardian_name: "Ibu Aminah", phone: "0813-7788-9900", status: "aktif" }
  ],
  guardians: [{ id: 1, name: "Fauzan Hakim", student_name: "Ahmad Rizqi", relation: "Ayah", phone: "0812-3344-5566", occupation: "Wiraswasta" }],
  teachers: [{ id: 1, teacher_no: "U-001", name: "Ust. Abdul Malik", specialization: "Tahfidz Al-Qur'an", phone: "0812-4444-9999", status: "aktif" }],
  classes: [{ id: 1, name: "Tahfidz A", level: "Menengah", homeroom_teacher: "Ust. Abdul Malik", capacity: 25, status: "aktif" }],
  subjects: [{ id: 1, name: "Tahfidz", category: "Keagamaan", teacher_name: "Ust. Abdul Malik", status: "aktif" }],
  schedules: [{ id: 1, day_name: "Senin", time_range: "05.30-06.30", class_name: "Tahfidz A", subject_name: "Tahfidz", teacher_name: "Ust. Abdul Malik" }],
  attendance: [{ id: 1, attendance_date: "2026-06-02", student_name: "Ahmad Rizqi", class_name: "Tahfidz A", status: "hadir", method: "QR" }],
  tahfidz: [{ id: 1, student_name: "Ahmad Rizqi", surah: "Al-Mulk", ayah_range: "1-10", memorization_status: "lancar", score: 88, teacher_name: "Ust. Abdul Malik" }],
  cash: [
    { id: 1, trx_date: "2026-06-01", type: "masuk", category: "Infaq", description: "Infaq wali santri", amount: 3500000 },
    { id: 2, trx_date: "2026-06-02", type: "keluar", category: "Konsumsi", description: "Konsumsi kajian", amount: 750000 }
  ],
  payments: [{ id: 1, student_name: "Ahmad Rizqi", period: "Juni 2026", amount: 300000, paid_amount: 300000, status: "lunas" }],
  donors: [{ id: 1, name: "Hamba Allah", donor_type: "Tetap", phone: "-", last_donation: 1000000, total_donation: 12000000 }],
  activities: [{ id: 1, title: "Kajian Ahad Pagi", activity_date: "2026-06-07", location: "Aula PPSA", status: "terjadwal" }],
  contents: [{ id: 1, title: "Pengumuman Kajian Ahad", category: "Pengumuman", is_published: 1, body: "Kajian Ahad pagi dibuka untuk umum." }],
  programs: [
    { id: 1, title: "Madrasah Diniyah", description: "Pembelajaran dasar agama, kitab, pengajian, dan pembentukan karakter santri dalam ritme keseharian pondok.", sort_order: 1, is_published: 1 },
    { id: 2, title: "Tahfidz Al-Qur'an Gratis", description: "Setoran Al-Qur'an, muroqobah 5 juz, imtihan syafawi, ujian juz, dan target hafalan 30 juz bersanad.", sort_order: 2, is_published: 1 },
    { id: 3, title: "Sekolah Formal Terintegrasi", description: "Santri tetap mendapatkan ijazah sekolah formal dan syahadah tahfidz dalam pembinaan yang terhubung dengan MA Terpadu Sunan Ampel.", sort_order: 3, is_published: 1 }
  ],
  donation_programs: [
    { id: 1, title: "Beasiswa Santri", summary: "Dukungan biaya pendidikan untuk santri yang membutuhkan.", target_amount: 0, is_active: 1 },
    { id: 2, title: "Wakaf Al-Qur'an", summary: "Program pengadaan mushaf dan bahan belajar Al-Qur'an untuk santri.", target_amount: 0, is_active: 1 },
    { id: 3, title: "Operasional Pondok", summary: "Dukungan kegiatan pendidikan, madrasah diniyah, dan layanan pondok.", target_amount: 0, is_active: 1 }
  ],
  portal_schedule: [
    { id: 1, time_slot: "03.00 - 04.30", activity: "Shalat malam.", sort_order: 1 },
    { id: 2, time_slot: "04.30 - 05.00", activity: "Shalat subuh berjama'ah.", sort_order: 2 },
    { id: 3, time_slot: "05.00 - 06.00", activity: "Pengajian Al-Qur'an dan majelis shalawat pada Jumat pagi.", sort_order: 3 }
  ],
  portal_settings: [
    {
      id: 1,
      site_name: "Pondok Pesantren Sunan Ampel",
      site_tagline: "Jl. Jaksa Agung Suprapto No.14, Jombang, Jawa Timur",
      hero_eyebrow: "PSB 2026 Resmi Dibuka",
      hero_title: "Penerimaan santri baru Pondok Pesantren Sunan Ampel Jombang.",
      hero_lead: "Pendaftaran dibuka mulai 1 Februari sampai 31 Juli 2026. Program unggulan meliputi Madrasah Diniyah dan Tahfidz Al-Qur'an gratis, dengan masuk pondok mulai Agustus 2026.",
      hero_primary_label: "Daftar Santri Baru",
      hero_primary_href: "#pendaftaran",
      hero_secondary_label: "Lihat Program",
      hero_secondary_href: "#program",
      summary_title: "Ringkasan PSB 2026",
      summary_lead: "Pondok pesantren berbasis madrasah diniyah, pembentukan karakter, pengajian, dan program tahfidz terintegrasi.",
      profile_title: "Pondok Pesantren Sunan Ampel",
      profile_body_1: "Pondok Pesantren Sunan Ampel adalah pondok pesantren yang berada di jantung kota Jombang dan telah berdiri sejak tahun 1985 oleh KH. Mahfudz Anwar.",
      profile_body_2: "Saat ini Pondok Pesantren Sunan Ampel berada di bawah naungan pengasuh KH. Taufiqurrahman Muchit, dengan fokus pembentukan karakter melalui shalat berjamaah, pengajian, dan madrasah diniyah.",
      focus_title: "Fokus Pendidikan",
      focus_points: "Madrasah diniyah dan pengajian Al-Qur'an.|Hafalan Juz Amma dan tahfidz Al-Qur'an.|Shalat jama'ah, tahajud, dan majelis shalawat.|Pembinaan akhlak, disiplin, dan kemandirian santri.",
      program_section_title: "Madrasah diniyah dan tahfidz gratis",
      program_section_lead: "Program unggulan PPSA menekankan pendidikan diniyah, pembiasaan ibadah, dan jalur tahfidz yang terintegrasi dengan sekolah formal.",
      required_title: "Kegiatan Wajib",
      required_points: "Madrasah diniyah.|Hafalan Juz Amma.|Shalat tahajud dan shalat jama'ah.|Pengajian Al-Qur'an dan kitab kuning.|Majelis shalawat.",
      extra_title: "Kegiatan Tambahan",
      extra_points: "Tahfidz Al-Qur'an.|Pelatihan baca Qur'an metode Yanbu'a.|Pelatihan bilal dan imam shalat.|Khitobah.|Mengurus jenazah.",
      registration_title: "Pendaftaran dibuka sampai 31 Juli 2026",
      registration_lead: "Calon wali santri dapat mengisi formulir pendaftaran awal untuk memulai proses PSB. Panitia akan meninjau data yang masuk dan menghubungi wali santri untuk tahapan berikutnya.",
      psb_card_title: "Jadwal PSB",
      psb_registration_text: "1 Februari - 31 Juli 2026",
      psb_entry_text: "mulai Agustus 2026",
      requirements_title: "Berkas Persyaratan",
      requirements_points: "Fotocopy KTP orang tua.|FC ijazah sekolah formal terakhir.|FC kartu keluarga.",
      pricing_title: "Rincian Pembiayaan",
      pricing_putra: "Rp. 1.875.000",
      pricing_putri: "Rp. 1.925.000",
      pricing_spp: "430K",
      pricing_note: "Sudah termasuk SPP, makan 1 bulan, kitab madrasah diniyah, seragam, dan kegiatan selama 1 tahun.",
      schedule_title: "Ritme harian santri PPSA",
      schedule_lead: "Ritme harian ini memberi gambaran kegiatan santri dari malam hingga malam berikutnya, mencakup ibadah, sekolah formal, pengajian, madrasah diniyah, dan waktu belajar.",
      donation_title: "Dukung pendidikan dan dakwah pesantren",
      donation_lead: "Salurkan dukungan terbaik untuk pendidikan, pembinaan santri, pengadaan sarana belajar, dan kegiatan dakwah melalui program donasi resmi Pondok Pesantren Sunan Ampel.",
      doa_title: "Aplikasi doa dan wirid digital PPSA",
      doa_lead: "Aplikasi doa PPSA menghadirkan kumpulan doa dan wirid harian yang mudah diakses untuk santri, wali santri, dan jamaah, lengkap dengan dukungan jadwal shalat dan tasbih digital.",
      doa_url: "https://ppsajombang.vercel.app",
      contact_title: "Hubungi Pondok Pesantren Sunan Ampel",
      contact_address: "Jl. Jaksa Agung Suprapto No.14, Jombang, Jawa Timur",
      instagram_label: "@ppsa.jombang",
      instagram_url: "https://www.instagram.com/ppsa.jombang/",
      youtube_label: "Sunan Ampel Official",
      youtube_url: "https://www.youtube.com/@ppsajombang9936",
      whatsapp_1_label: "WhatsApp Gus Fattah",
      whatsapp_1_number: "628999039882",
      whatsapp_2_label: "WhatsApp Ning Faiq",
      whatsapp_2_number: "6282223422532"
    }
  ],
  letters: [{ id: 1, letter_no: "001/PPSA/VI/2026", letter_date: "2026-06-01", type: "Keluar", subject: "Undangan Rapat Wali Santri", status: "terkirim" }],
  library: [{ id: 1, book_code: "BK-001", title: "Adab Penuntut Ilmu", author: "Tim PPSA", stock: 10, available: 8 }],
  dormitories: [{ id: 1, room_name: "Kamar Umar", building: "Asrama Putra", capacity: 12, occupied: 10, supervisor: "Ust. Hasan" }],
  inventory: [{ id: 1, asset_code: "INV-001", name: "Proyektor Aula", category: "Elektronik", location: "Aula", condition_status: "baik" }],
  users: [{ id: 1, name: "Administrator PPSA", email: "", role: "admin", status: "aktif" }],
  audit: [{ id: 1, created_at: "2026-06-02 08:00", user_name: "Administrator PPSA", action: "LOGIN", module: "Auth", description: "Login demo" }]
};

let demo = loadDemo();

function loadDemo() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(seedDemo);
  } catch {
    return structuredClone(seedDemo);
  }
}

function saveDemo() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
}

function resetDemo() {
  if (!confirm("Reset seluruh data demo ke contoh awal?")) return;
  demo = structuredClone(seedDemo);
  saveDemo();
  renderPage(state.page);
}

async function callApi(path, opt = {}) {
  if (DEMO_MODE || !API) return demoApi(path, opt);

  const headers = { "Content-Type": "application/json", ...(opt.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;

  try {
    const response = await fetch(API + path, { ...opt, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "API error");
    return data;
  } catch (error) {
    if (FALLBACK_TO_DEMO) {
      showNotice(`API belum tersedia, sementara memakai data demo. (${error.message})`);
      return demoApi(path, opt);
    }
    throw error;
  }
}

async function demoApi(path, opt = {}) {
  const parts = path.split("/").filter(Boolean);
  const method = opt.method || "GET";

  if (path.includes("/auth/login")) {
    return { token: "demo-token", user: { id: 1, name: "Administrator PPSA", email: "admin@ppsa.local", role: "admin" } };
  }

  if (path.includes("/dashboard")) return dashboardData();

  const key = parts[1];
  if (!demo[key]) return { data: [] };
  if (method === "GET") return { data: demo[key] };

  const body = opt.body ? JSON.parse(opt.body) : {};
  if (method === "POST") {
    body.id = Math.max(0, ...demo[key].map((item) => Number(item.id || 0))) + 1;
    demo[key].unshift(body);
    addAudit("CREATE", key, `Menambah data ${meta[key]?.title || key}`);
    saveDemo();
    return { ok: true, id: body.id };
  }

  if (method === "PUT") {
    const id = Number(parts[2]);
    demo[key] = demo[key].map((item) => item.id === id ? { ...item, ...body } : item);
    addAudit("UPDATE", key, `Memperbarui data ${meta[key]?.title || key} #${id}`);
    saveDemo();
    return { ok: true };
  }

  if (method === "DELETE") {
    const id = Number(parts[2]);
    demo[key] = demo[key].filter((item) => item.id !== id);
    addAudit("DELETE", key, `Menghapus data ${meta[key]?.title || key} #${id}`);
    saveDemo();
    return { ok: true };
  }
}

function addAudit(action, module, description) {
  const nextId = Math.max(0, ...demo.audit.map((item) => Number(item.id || 0))) + 1;
  demo.audit.unshift({
    id: nextId,
    created_at: new Date().toLocaleString("id-ID"),
    user_name: state.user?.name || "Administrator PPSA",
    action,
    module,
    description
  });
}

function dashboardData() {
  const cashIn = demo.cash.filter((item) => item.type === "masuk").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const cashOut = demo.cash.filter((item) => item.type === "keluar").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const paid = demo.payments.reduce((sum, item) => sum + Number(item.paid_amount || 0), 0);
  const billed = demo.payments.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return {
    totals: {
      students: demo.students.length,
      teachers: demo.teachers.length,
      classes: demo.classes.length,
      cash_balance: cashIn - cashOut,
      attendance_present: 92,
      tahfidz_score: 86,
      unpaid: demo.payments.filter((item) => item.status !== "lunas").length,
      payment_ratio: billed ? Math.round((paid / billed) * 100) : 0
    },
    latestActivities: demo.activities.slice(0, 5),
    chart: [72, 80, 88, 79, 92, 86]
  };
}

function showApp() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("appPage").classList.remove("hidden");
  document.getElementById("userInfo").textContent = `${state.user?.name || "Demo"} (${state.user?.role || "admin"})`;
  renderNav();
  renderPage(state.page);
}

function renderNav() {
  const nav = document.getElementById("nav");
  nav.innerHTML = groups.map(([group, items]) => `
    <h4>${group}</h4>
    ${items.map(([key, label, status]) => `
      <button class="${state.page === key ? "active" : ""}" data-page="${key}">
        <span>${label}</span><small>${status}</small>
      </button>`).join("")}
  `).join("");

  nav.querySelectorAll("button").forEach((button) => {
    button.onclick = () => {
      closeSidebarOnMobile();
      renderPage(button.dataset.page);
    };
  });
}

async function renderPage(page) {
  state.page = page;
  renderNav();
  if (page === "dashboard") return renderDashboard();
  if (["lms", "whatsapp", "ai", "mobile", "backup", "settings", "gallery", "grades", "profile"].includes(page)) return renderComing(page);
  return renderCrud(page);
}

async function renderDashboard() {
  const data = await callApi("/api/dashboard");
  const totals = {
    students: 0,
    teachers: 0,
    classes: 0,
    cash_balance: 0,
    attendance_present: 0,
    tahfidz_score: 0,
    unpaid: 0,
    payment_ratio: 0,
    ...(data.totals || {})
  };
  setTitle("Dashboard Eksekutif", "Ringkasan operasional, akademik, keuangan, dan dakwah PPSA");

  document.getElementById("content").innerHTML = `
    <section class="grid">
      ${metricCard("Santri Aktif", totals.students ?? 0)}
      ${metricCard("Pengajar", totals.teachers ?? 0)}
      ${metricCard("Kelas", totals.classes ?? 0)}
      ${metricCard("Saldo Kas", rupiah(totals.cash_balance ?? 0))}
    </section>
    <section class="grid-2 spaced">
      <div class="card">
        <div class="card-head">
          <div>
            <h3>Tren Kehadiran 6 Pekan</h3>
            <p class="muted">Simulasi ringkasan absensi kegiatan dan kelas.</p>
          </div>
        </div>
        <div class="chart">${data.chart.map((value, index) => `<div class="bar" style="height:${value}%"><b>${value}%</b><span>P${index + 1}</span></div>`).join("")}</div>
      </div>
      <div class="card">
        <h3>Indikator Utama</h3>
        <div class="stat-list">
          <div><span>Kehadiran rata-rata</span><b>${totals.attendance_present ?? 0}%</b></div>
          <div><span>Skor tahfidz rata-rata</span><b>${totals.tahfidz_score ?? 0}</b></div>
          <div><span>Rasio pembayaran</span><b>${totals.payment_ratio ?? 0}%</b></div>
          <div><span>Tagihan belum lunas</span><b>${totals.unpaid ?? 0}</b></div>
        </div>
        <button class="btn-secondary wide" id="resetDemoBtn">Reset Data Demo</button>
      </div>
    </section>
    <section class="card spaced">
      <div class="card-head">
        <div>
          <h3>Kegiatan Mendatang</h3>
          <p class="muted">Agenda terdekat yang tercatat di modul kegiatan.</p>
        </div>
        <button class="btn-secondary" data-jump="activities">Buka Modul</button>
      </div>
      ${table(["activity_date", "title", "location", "status"], data.latestActivities)}
    </section>`;

  document.getElementById("resetDemoBtn").onclick = resetDemo;
  document.querySelector("[data-jump='activities']").onclick = () => renderPage("activities");
}

async function renderCrud(key) {
  const module = meta[key];
  setTitle(module.title, module.subtitle);
  const response = await callApi(`/api/${key}`);
  const query = state.filters[key] || "";
  const rows = filterRows(response.data, query);

  document.getElementById("content").innerHTML = `
    <div class="toolbar">
      <div>
        <b>${rows.length}</b> dari ${response.data.length} data
        <span class="muted">${query ? `sesuai pencarian "${esc(query)}"` : "tersedia"}</span>
      </div>
      <div class="toolbar-actions">
        <input id="searchInput" class="search-input" value="${esc(query)}" placeholder="Cari data..." />
        <button id="exportBtn" class="btn-secondary">Export CSV</button>
        <button id="addBtn" class="btn-primary">${module.singleton ? (rows.length ? "Edit Pengaturan" : "Buat Pengaturan") : "Tambah Data"}</button>
      </div>
    </div>
    <div class="card">${table(module.cols, rows, key)}</div>`;

  document.getElementById("addBtn").onclick = () => openForm(key, module.singleton ? (rows[0] || {}) : {});
  document.getElementById("exportBtn").onclick = () => exportCsv(key, module.cols, rows);
  document.getElementById("searchInput").oninput = debounce((event) => {
    state.filters[key] = event.target.value.trim();
    renderCrud(key);
  }, 220);

  document.querySelectorAll("[data-edit]").forEach((button) => {
    button.onclick = () => openForm(key, JSON.parse(decodeURIComponent(button.dataset.edit)));
  });
  document.querySelectorAll("[data-del]").forEach((button) => {
    button.onclick = () => deleteRow(key, button.dataset.del);
  });
}

function renderComing(key) {
  const names = {
    lms: "LMS Pembelajaran",
    whatsapp: "WhatsApp Gateway",
    ai: "AI Chatbot",
    mobile: "Mobile App Android/TWA",
    backup: "Backup Terjadwal",
    settings: "Pengaturan Lembaga",
    gallery: "Galeri Media",
    grades: "Nilai/Rapor",
    profile: "Profil Lembaga"
  };
  setTitle(names[key] || "Roadmap", "Modul disiapkan untuk pengembangan tahap lanjut");
  document.getElementById("content").innerHTML = `
    <div class="card coming">
      <div class="icon">MS</div>
      <div>
        <h2>${names[key]}</h2>
        <p class="muted">Modul ini sudah masuk struktur navigasi agar arah pengembangan sistem terlihat utuh saat demo dan presentasi.</p>
        <div class="feature-list">
          <div><b>Siap UI</b><br><span class="muted">Layout dasar sudah mengikuti pola modul lain.</span></div>
          <div><b>Siap API</b><br><span class="muted">Endpoint dapat ditambahkan secara modular.</span></div>
          <div><b>Siap Database</b><br><span class="muted">Skema tabel bisa diperluas dari metadata modul.</span></div>
        </div>
      </div>
    </div>`;
}

function table(cols, rows, key) {
  const emptyColspan = cols.length + (key ? 1 : 0);
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>${cols.map((col) => `<th>${labels[col] || col}</th>`).join("")}${key ? "<th>Aksi</th>" : ""}</tr>
        </thead>
        <tbody>
          ${rows.length ? rows.map((row) => `
            <tr>
              ${cols.map((col) => `<td>${fmt(col, row[col])}</td>`).join("")}
              ${key ? `<td class="actions"><button class="btn-secondary" data-edit="${encodeURIComponent(JSON.stringify(row))}">Edit</button><button class="btn-danger" data-del="${row.id}">Hapus</button></td>` : ""}
            </tr>`).join("") : `<tr><td colspan="${emptyColspan}" class="empty">Belum ada data.</td></tr>`}
        </tbody>
      </table>
    </div>`;
}

function openForm(key, row = {}) {
  const module = meta[key];
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  modal.innerHTML = `
    <div class="modal-card">
      <div class="card-head">
        <div>
          <h2>${row.id ? "Edit" : "Tambah"} ${module.title}</h2>
          <p class="muted">Lengkapi data sesuai kebutuhan administrasi.</p>
        </div>
        <button id="closeModal" type="button" class="btn-secondary">Tutup</button>
      </div>
      <form id="form" class="form-grid">
        ${module.fields.map((fieldName) => field(key, fieldName, row[fieldName])).join("")}
        <div class="full actions">
          <button class="btn-primary">Simpan</button>
          <button type="button" id="cancel" class="btn-secondary">Batal</button>
        </div>
      </form>
    </div>`;

  document.getElementById("cancel").onclick = closeModal;
  document.getElementById("closeModal").onclick = closeModal;
  document.getElementById("form").onsubmit = async (event) => {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.target).entries());
    ["amount", "paid_amount", "total_donation", "last_donation", "stock", "available", "capacity", "occupied", "score", "purchase_year"].forEach((name) => {
      if (body[name] != null) body[name] = Number(body[name] || 0);
    });
    if (body.is_published != null) body.is_published = Number(body.is_published);
    if (body.is_active != null) body.is_active = Number(body.is_active);
    await callApi(`/api/${key}${row.id ? `/${row.id}` : ""}`, { method: row.id ? "PUT" : "POST", body: JSON.stringify(body) });
    closeModal();
    renderCrud(key);
  };
}

function field(key, name, value = "") {
  if (["description", "body", "address", "notes", "summary", "focus_points", "required_points", "extra_points", "requirements_points", "profile_body_1", "profile_body_2", "hero_lead", "summary_lead", "program_section_lead", "registration_lead", "pricing_note", "schedule_lead", "donation_lead", "doa_lead", "activity"].includes(name)) {
    return `<div class="full"><label>${labels[name] || name}</label><textarea name="${name}">${esc(value)}</textarea></div>`;
  }
  if (name === "gender") return select(name, value, ["L", "P", "-"]);
  if (name === "type" && key === "cash") return select(name, value, ["masuk", "keluar", "Masuk", "Keluar"]);
  if (name === "type" && key === "contents") return select(name, value, ["article", "announcement"]);
  if (name === "status") return select(name, value, ["aktif", "nonaktif", "terjadwal", "selesai", "hadir", "izin", "sakit", "alpa", "lunas", "belum_lunas", "terkirim", "draft", "baik", "rusak"]);
  if (name === "follow_up_status") return select(name, value, ["baru", "diproses", "selesai", "ditutup"]);
  if (name === "is_published") return select(name, value, [1, 0]);
  if (name === "is_active") return select(name, value, [1, 0]);

  const numberFields = ["amount", "paid_amount", "total_donation", "last_donation", "stock", "available", "capacity", "occupied", "score", "purchase_year", "sort_order", "target_amount"];
  const type = name.includes("date") ? "date" : (numberFields.includes(name) ? "number" : "text");
  return `<div><label>${labels[name] || name}</label><input name="${name}" type="${type}" value="${esc(value)}"></div>`;
}

function select(name, value, options) {
  return `
    <div>
      <label>${labels[name] || name}</label>
      <select name="${name}">
        ${options.map((option) => `<option value="${esc(option)}" ${String(value) === String(option) ? "selected" : ""}>${esc(option)}</option>`).join("")}
      </select>
    </div>`;
}

async function deleteRow(key, id) {
  if (!confirm("Hapus data ini?")) return;
  await callApi(`/api/${key}/${id}`, { method: "DELETE" });
  renderCrud(key);
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("modal").innerHTML = "";
}

function setTitle(title, subtitle) {
  document.getElementById("pageTitle").textContent = title;
  document.getElementById("pageSubtitle").textContent = subtitle;
}

function metricCard(label, value) {
  return `<div class="card metric-card"><div class="muted">${label}</div><div class="metric">${value}</div></div>`;
}

function filterRows(rows, query) {
  if (!query) return rows;
  const needle = query.toLowerCase();
  return rows.filter((row) => Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(needle)));
}

function exportCsv(key, cols, rows) {
  const csv = [
    cols.map((col) => labels[col] || col).join(","),
    ...rows.map((row) => cols.map((col) => `"${String(row[col] ?? "").replace(/"/g, '""')}"`).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `ppsa-${key}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function fmt(col, value) {
  if (["amount", "paid_amount", "total_donation", "last_donation"].includes(col)) return rupiah(value);
  if (col === "is_published") return Number(value) ? '<span class="badge">Publik</span>' : '<span class="badge gray">Draft</span>';
  if (col === "is_active") return Number(value) ? '<span class="badge">Aktif</span>' : '<span class="badge gray">Nonaktif</span>';
  if (col === "follow_up_status") return `<span class="badge ${String(value).includes("baru") ? "gold" : ""}">${esc(value ?? "-")}</span>`;
  if (col === "status") return `<span class="badge ${String(value).includes("belum") ? "gold" : ""}">${esc(value ?? "-")}</span>`;
  return esc(value ?? "-");
}

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(value || 0));
}

function esc(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

function showNotice(message) {
  const notice = document.getElementById("notice");
  if (!notice) return;
  notice.textContent = message;
  notice.classList.remove("hidden");
  clearTimeout(showNotice.timer);
  showNotice.timer = setTimeout(() => notice.classList.add("hidden"), 4200);
}

function closeSidebarOnMobile() {
  document.getElementById("appPage").classList.remove("sidebar-open");
}

document.getElementById("loginForm").onsubmit = async (event) => {
  event.preventDefault();
  try {
    const data = await callApi("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(new FormData(event.target).entries())),
      headers: {}
    });
    state.token = data.token;
    state.user = data.user;
    localStorage.setItem("ppsa_ms_token", state.token);
    localStorage.setItem("ppsa_ms_user", JSON.stringify(state.user));
    showApp();
  } catch (error) {
    document.getElementById("loginError").textContent = error.message;
  }
};

document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("ppsa_ms_token");
  localStorage.removeItem("ppsa_ms_user");
  location.reload();
};

document.getElementById("menuBtn").onclick = () => {
  document.getElementById("appPage").classList.toggle("sidebar-open");
};

document.getElementById("modal").addEventListener("click", (event) => {
  if (event.target.id === "modal") closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
if (state.token && state.user) showApp();
