const CONFIG = window.PPSA_CONFIG || {};
const API = CONFIG.API_BASE_URL || "";
const DEMO_MODE = CONFIG.DEMO_MODE === true;
const FALLBACK_TO_DEMO = CONFIG.FALLBACK_TO_DEMO !== false;
const STORAGE_KEY = "ppsa_ms_demo_data";

const state = {
  token: localStorage.getItem("ppsa_ms_token"),
  user: JSON.parse(localStorage.getItem("ppsa_ms_user") || "null"),
  page: "dashboard",
  filters: {},
  sorts: {}
};

const groups = [
  ["Utama", [["dashboard", "Dashboard", "Ready"], ["branches", "Cabang/Unit", "Ready"]]],
  ["Administrasi Web Portal", [["portal_settings", "Pengaturan Portal", "Ready"], ["programs", "Program Portal", "Ready"], ["portal_schedule", "Jadwal Santri", "Ready"], ["donation_programs", "Program Donasi", "Ready"], ["activities", "Kegiatan & Publikasi", "Ready"], ["admissions", "Leads Pendaftaran", "Ready"], ["contact_messages", "Pesan Masuk", "Ready"], ["donation_confirmations", "Konfirmasi Donasi", "Ready"]]],
  ["Akademik & Santri", [["students", "Santri", "Ready"], ["guardians", "Wali Santri", "Ready"], ["teachers", "Pengajar/Ustadz", "Ready"], ["classes", "Kelas", "Ready"], ["subjects", "Mata Pelajaran", "Ready"], ["grades", "Nilai/Rapor", "Ready"], ["schedules", "Jadwal Pelajaran", "Ready"], ["attendance", "Absensi QR", "Ready"], ["tahfidz", "Tahfidz Monitoring", "Ready"]]],
  ["Keuangan Pondok", [["cash", "Buku Kas", "Ready"], ["payments", "SPP/Iuran", "Ready"], ["donors", "Donatur/Infaq", "Ready"]]],
  ["Administrasi & Sarana", [["letters", "Surat Menyurat", "Ready"], ["library", "Perpustakaan", "Ready"], ["dormitories", "Asrama/Kamar", "Ready"], ["inventory", "Inventaris", "Ready"]]],
  ["Sistem", [["users", "User & Role", "Ready"]]]
];

const meta = {
  branches: { title: "Cabang/Unit", subtitle: "Struktur multi cabang PPSA", cols: ["id", "name", "code", "leader", "phone", "status"], fields: ["name", "code", "address", "leader", "phone", "status"] },
  students: { title: "Santri", subtitle: "Data induk santri dan status pendidikan", cols: ["id", "student_no", "name", "gender", "class_name", "status"], fields: ["student_no", "name", "gender", "birth_place", "birth_date", "class_name", "guardian_name", "phone", "address", "status", "notes"] },
  guardians: { title: "Wali Santri", subtitle: "Kontak orang tua/wali santri", cols: ["id", "name", "student_name", "relation", "phone", "occupation"], fields: ["name", "student_name", "relation", "phone", "occupation", "address"] },
  teachers: { title: "Pengajar/Ustadz", subtitle: "Data pengajar, kompetensi, dan status aktif", cols: ["id", "teacher_no", "name", "specialization", "phone", "status"], fields: ["teacher_no", "name", "gender", "specialization", "phone", "address", "status"] },
  classes: { title: "Kelas", subtitle: "Kelas formal, tahsin, tahfidz, dan madrasah diniyah", cols: ["id", "name", "level", "homeroom_teacher", "capacity", "status"], fields: ["name", "level", "homeroom_teacher", "capacity", "status"] },
  subjects: { title: "Mata Pelajaran", subtitle: "Kurikulum dan mata pelajaran pesantren", cols: ["id", "name", "category", "teacher_name", "status"], fields: ["name", "category", "teacher_name", "description", "status"] },
  grades: { title: "Nilai/Rapor", subtitle: "Input nilai santri per mapel, semester, dan tahun ajaran", cols: ["id", "student_name", "class_name", "subject_name", "academic_year", "semester", "final_score", "status"], fields: ["student_name", "class_name", "subject_name", "teacher_name", "academic_year", "semester", "assignment_score", "midterm_score", "final_exam_score", "final_score", "predicate", "teacher_notes", "status"] },
  schedules: { title: "Jadwal Pelajaran", subtitle: "Jadwal belajar mingguan", cols: ["id", "day_name", "time_range", "class_name", "subject_name", "teacher_name"], fields: ["day_name", "time_range", "class_name", "subject_name", "teacher_name", "room"] },
  attendance: { title: "Absensi QR", subtitle: "Absensi kegiatan dan pembelajaran", cols: ["id", "attendance_date", "student_name", "class_name", "status", "method"], fields: ["attendance_date", "student_name", "class_name", "status", "method", "notes"] },
  tahfidz: { title: "Tahfidz Monitoring", subtitle: "Monitoring hafalan, murajaah, dan capaian santri", cols: ["id", "student_name", "surah", "ayah_range", "memorization_status", "score"], fields: ["student_name", "surah", "ayah_range", "memorization_status", "score", "review_date", "teacher_name", "notes"] },
  cash: { title: "Buku Kas", subtitle: "Pemasukan dan pengeluaran operasional", cols: ["id", "trx_date", "type", "category", "description", "amount"], fields: ["trx_date", "type", "category", "description", "amount"] },
  payments: { title: "SPP/Iuran", subtitle: "Tagihan, pembayaran, dan status iuran santri", cols: ["id", "student_name", "period", "amount", "paid_amount", "status"], fields: ["student_name", "period", "amount", "paid_amount", "due_date", "status", "notes"] },
  donors: { title: "Donatur/Infaq", subtitle: "Data donatur dan histori kontribusi", cols: ["id", "name", "donor_type", "phone", "last_donation", "total_donation"], fields: ["name", "donor_type", "phone", "address", "last_donation", "total_donation", "notes"] },
  activities: { title: "Kegiatan & Publikasi", subtitle: "Sumber tunggal untuk agenda pondok sekaligus publikasi portal", cols: ["id", "title", "activity_date", "content_type", "is_published", "status"], fields: ["title", "activity_date", "location", "summary", "description", "content_type", "is_published", "status"] },
  contents: { title: "Pengumuman/Artikel", subtitle: "Konten publik, pengumuman, dan materi dakwah", cols: ["id", "title", "type", "summary", "is_published"], fields: ["title", "type", "summary", "body", "is_published"] },
  programs: { title: "Program Portal", subtitle: "Program unggulan yang tampil di portal publik", cols: ["id", "title", "sort_order", "is_published"], fields: ["title", "description", "sort_order", "is_published"] },
  donation_programs: { title: "Program Donasi", subtitle: "Daftar program donasi, infaq, dan wakaf di portal", cols: ["id", "title", "target_amount", "is_active"], fields: ["title", "summary", "target_amount", "is_active"] },
  portal_schedule: { title: "Jadwal Portal", subtitle: "Ritme harian santri yang tampil di portal publik", cols: ["id", "sort_order", "time_slot", "activity"], fields: ["time_slot", "activity", "sort_order"] },
  portal_settings: {
    title: "Pengaturan Portal",
    subtitle: "Konten utama portal publik PPSA",
    cols: ["id", "site_name", "hero_title", "summary_title", "contact_title"],
    fields: ["site_name", "site_tagline", "hero_eyebrow", "hero_title", "hero_lead", "hero_primary_label", "hero_primary_href", "hero_secondary_label", "hero_secondary_href", "summary_logo_url", "summary_title", "summary_lead", "summary_stat_1_value", "summary_stat_1_label", "summary_stat_2_value", "summary_stat_2_label", "summary_stat_3_value", "summary_stat_3_label", "summary_stat_4_value", "summary_stat_4_label", "profile_title", "profile_body_1", "profile_body_2", "focus_title", "focus_points", "program_section_title", "program_section_lead", "required_title", "required_points", "extra_title", "extra_points", "registration_title", "registration_lead", "psb_card_title", "psb_registration_text", "psb_entry_text", "requirements_title", "requirements_points", "pricing_title", "pricing_putra", "pricing_putri", "pricing_spp", "pricing_note", "schedule_title", "schedule_lead", "donation_title", "donation_lead", "doa_title", "doa_lead", "doa_url", "contact_title", "contact_address", "instagram_label", "instagram_url", "youtube_label", "youtube_url", "whatsapp_1_label", "whatsapp_1_number", "whatsapp_2_label", "whatsapp_2_number"],
    singleton: true,
    allowDelete: false,
    sections: [
      { title: "Header Portal", fields: ["site_name", "site_tagline"] },
      { title: "Hero Utama", fields: ["hero_eyebrow", "hero_title", "hero_lead", "hero_primary_label", "hero_primary_href", "hero_secondary_label", "hero_secondary_href"] },
      { title: "Kartu Ringkasan Hero", fields: ["summary_logo_url", "summary_title", "summary_lead", "summary_stat_1_value", "summary_stat_1_label", "summary_stat_2_value", "summary_stat_2_label", "summary_stat_3_value", "summary_stat_3_label", "summary_stat_4_value", "summary_stat_4_label"] },
      { title: "Profil Lembaga", fields: ["profile_title", "profile_body_1", "profile_body_2", "focus_title", "focus_points"] },
      { title: "Program Unggulan", fields: ["program_section_title", "program_section_lead", "required_title", "required_points", "extra_title", "extra_points"] },
      { title: "Pendaftaran Santri Baru", fields: ["registration_title", "registration_lead", "psb_card_title", "psb_registration_text", "psb_entry_text", "requirements_title", "requirements_points", "pricing_title", "pricing_putra", "pricing_putri", "pricing_spp", "pricing_note"] },
      { title: "Jadwal Kegiatan Formal", fields: ["schedule_title", "schedule_lead"] },
      { title: "Donasi, Infaq, Wakaf, dan Aplikasi Doa", fields: ["donation_title", "donation_lead", "doa_title", "doa_lead", "doa_url"] },
      { title: "Kontak Resmi", fields: ["contact_title", "contact_address", "instagram_label", "instagram_url", "youtube_label", "youtube_url", "whatsapp_1_label", "whatsapp_1_number", "whatsapp_2_label", "whatsapp_2_number"] }
    ]
  },
  letters: { title: "Surat Menyurat", subtitle: "Surat masuk, surat keluar, dan arsip digital", cols: ["id", "letter_no", "letter_date", "type", "subject", "status"], fields: ["letter_no", "letter_date", "type", "sender_receiver", "subject", "summary", "status"] },
  library: { title: "Perpustakaan", subtitle: "Buku, peminjaman, dan pengembalian", cols: ["id", "book_code", "title", "author", "stock", "available"], fields: ["book_code", "title", "author", "category", "stock", "available", "location"] },
  dormitories: { title: "Asrama/Kamar", subtitle: "Penempatan santri dan kapasitas kamar", cols: ["id", "room_name", "building", "capacity", "occupied", "supervisor"], fields: ["room_name", "building", "capacity", "occupied", "supervisor", "notes"] },
  inventory: { title: "Inventaris", subtitle: "Aset barang, kondisi, dan lokasi", cols: ["id", "asset_code", "name", "category", "location", "condition_status"], fields: ["asset_code", "name", "category", "location", "condition_status", "purchase_year", "notes"] },
  admissions: { title: "Leads Pendaftaran", subtitle: "Form minat santri baru dari portal publik", cols: ["id", "created_at", "student_name", "guardian_name", "phone", "program", "follow_up_status"], fields: ["student_name", "gender", "birth_date", "guardian_name", "phone", "program", "address", "notes", "follow_up_status", "follow_up_notes", "handled_by", "handled_at"], readOnlyFields: ["student_name", "gender", "birth_date", "guardian_name", "phone", "program", "address", "notes", "created_at"], editFields: ["follow_up_status", "follow_up_notes", "handled_by", "handled_at"], allowCreate: false, allowDelete: false, actionLabel: "Tindak Lanjut" },
  contact_messages: { title: "Pesan Masuk", subtitle: "Pesan publik dari halaman kontak portal", cols: ["id", "created_at", "name", "contact", "subject", "follow_up_status"], fields: ["name", "contact", "subject", "message", "follow_up_status", "follow_up_notes", "handled_by", "handled_at"], readOnlyFields: ["name", "contact", "subject", "message", "created_at"], editFields: ["follow_up_status", "follow_up_notes", "handled_by", "handled_at"], allowCreate: false, allowDelete: false, actionLabel: "Tindak Lanjut" },
  donation_confirmations: { title: "Konfirmasi Donasi", subtitle: "Konfirmasi transfer dan donasi dari portal publik", cols: ["id", "created_at", "donor_name", "phone", "amount", "follow_up_status"], fields: ["donor_name", "phone", "amount", "method", "notes", "follow_up_status", "follow_up_notes", "handled_by", "handled_at"], readOnlyFields: ["donor_name", "phone", "amount", "method", "notes", "created_at"], editFields: ["follow_up_status", "follow_up_notes", "handled_by", "handled_at"], allowCreate: false, allowDelete: false, actionLabel: "Tindak Lanjut" },
  users: { title: "User & Role", subtitle: "Akun pengguna dan hak akses sistem", cols: ["id", "name", "email", "role", "status"], fields: ["name", "email", "role", "status", "password"] },
  audit: { title: "Audit Log", subtitle: "Jejak aktivitas pengguna", cols: ["id", "created_at", "user_name", "action", "module", "description"], fields: ["created_at", "user_name", "action", "module", "description"] }
};

const labels = {
  id: "ID", name: "Nama", code: "Kode", address: "Alamat", leader: "Pimpinan", phone: "Telepon", status: "Status",
  student_no: "NIS", gender: "L/P", birth_place: "Tempat Lahir", birth_date: "Tanggal Lahir", class_name: "Kelas",
  guardian_name: "Wali", notes: "Catatan", teacher_no: "NIP/No Ustadz", specialization: "Keahlian", level: "Level",
  homeroom_teacher: "Wali Kelas", capacity: "Kapasitas", category: "Kategori", teacher_name: "Pengajar",
  description: "Deskripsi", day_name: "Hari", time_range: "Jam", subject_name: "Mapel", room: "Ruang",
  academic_year: "Tahun Ajaran", semester: "Semester", assignment_score: "Nilai Tugas", midterm_score: "Nilai UTS", final_exam_score: "Nilai UAS", final_score: "Nilai Akhir", predicate: "Predikat", teacher_notes: "Catatan Guru",
  attendance_date: "Tanggal", student_name: "Santri", method: "Metode", surah: "Surah", ayah_range: "Ayat",
  memorization_status: "Status Hafalan", score: "Nilai", review_date: "Tanggal Setor", trx_date: "Tanggal",
  type: "Jenis", amount: "Nominal", paid_amount: "Dibayar", period: "Periode", due_date: "Jatuh Tempo",
  donor_type: "Jenis Donatur", last_donation: "Donasi Terakhir", total_donation: "Total Donasi", title: "Judul",
  activity_date: "Tanggal", location: "Lokasi", body: "Isi", is_published: "Publikasi", content_type: "Tipe Konten", letter_no: "No Surat",
  letter_date: "Tanggal Surat", sender_receiver: "Pengirim/Penerima", subject: "Perihal", summary: "Ringkasan",
  book_code: "Kode Buku", author: "Penulis", stock: "Stok", available: "Tersedia", room_name: "Kamar",
  building: "Gedung", occupied: "Terisi", supervisor: "Pembina", asset_code: "Kode Aset", condition_status: "Kondisi",
  purchase_year: "Tahun Beli", email: "Email", role: "Role", password: "Password", created_at: "Waktu", user_name: "User", action: "Aksi", module: "Modul",
  relation: "Relasi", occupation: "Pekerjaan", program: "Program", contact: "Kontak", message: "Pesan",
  donor_name: "Donatur", method: "Metode", follow_up_status: "Status Follow Up", follow_up_notes: "Catatan Follow Up",
  handled_by: "Ditangani Oleh", handled_at: "Ditangani Pada", type: "Tipe", summary: "Ringkasan", sort_order: "Urutan", time_slot: "Jam",
  target_amount: "Target", is_active: "Aktif", site_name: "Nama Situs", site_tagline: "Tagline Situs", hero_eyebrow: "Label Hero",
  hero_title: "Judul Hero", hero_lead: "Deskripsi Hero", hero_primary_label: "Label Tombol Utama", hero_primary_href: "Link Tombol Utama",
  hero_secondary_label: "Label Tombol Kedua", hero_secondary_href: "Link Tombol Kedua", summary_logo_url: "URL Logo Ringkasan", summary_title: "Judul Ringkasan", summary_lead: "Deskripsi Ringkasan",
  summary_stat_1_value: "Nilai Ringkasan 1", summary_stat_1_label: "Label Ringkasan 1", summary_stat_2_value: "Nilai Ringkasan 2", summary_stat_2_label: "Label Ringkasan 2",
  summary_stat_3_value: "Nilai Ringkasan 3", summary_stat_3_label: "Label Ringkasan 3", summary_stat_4_value: "Nilai Ringkasan 4", summary_stat_4_label: "Label Ringkasan 4",
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
  grades: [{ id: 1, student_name: "Ahmad Rizqi", class_name: "Tahfidz A", subject_name: "Tahfidz", teacher_name: "Ust. Abdul Malik", academic_year: "2026/2027", semester: "Ganjil", assignment_score: 86, midterm_score: 88, final_exam_score: 90, final_score: 88, predicate: "A", teacher_notes: "Hafalan lancar dan murajaah baik.", status: "terbit" }],
  schedules: [{ id: 1, day_name: "Senin", time_range: "05.30-06.30", class_name: "Tahfidz A", subject_name: "Tahfidz", teacher_name: "Ust. Abdul Malik" }],
  attendance: [{ id: 1, attendance_date: "2026-06-02", student_name: "Ahmad Rizqi", class_name: "Tahfidz A", status: "hadir", method: "QR" }],
  tahfidz: [{ id: 1, student_name: "Ahmad Rizqi", surah: "Al-Mulk", ayah_range: "1-10", memorization_status: "lancar", score: 88, teacher_name: "Ust. Abdul Malik" }],
  cash: [
    { id: 1, trx_date: "2026-06-01", type: "masuk", category: "Infaq", description: "Infaq wali santri", amount: 3500000 },
    { id: 2, trx_date: "2026-06-02", type: "keluar", category: "Konsumsi", description: "Konsumsi kajian", amount: 750000 }
  ],
  payments: [{ id: 1, student_name: "Ahmad Rizqi", period: "Juni 2026", amount: 300000, paid_amount: 300000, status: "lunas" }],
  donors: [{ id: 1, name: "Hamba Allah", donor_type: "Tetap", phone: "-", last_donation: 1000000, total_donation: 12000000 }],
  activities: [
    { id: 1, title: "Kajian Ahad Pagi", activity_date: "2026-06-07", location: "Aula PPSA", summary: "Kajian rutin terbuka untuk wali santri dan masyarakat.", description: "Kajian Ahad pagi dibuka untuk umum di Aula PPSA.", content_type: "article", is_published: 1, status: "terjadwal" },
    { id: 2, title: "Informasi pendaftaran santri baru", activity_date: "2026-06-05", location: "", summary: "Calon wali santri dapat mengisi formulir minat pada halaman pendaftaran.", description: "Panitia akan menghubungi wali santri setelah formulir diterima.", content_type: "announcement", is_published: 1, status: "publikasi" }
  ],
  contents: [{ id: 1, title: "Arsip Konten Lama", category: "Pengumuman", is_published: 1, body: "Konten lama disatukan ke modul kegiatan.", type: "announcement", summary: "Konten lama disatukan ke kegiatan." }],
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
      summary_logo_url: "https://raw.githubusercontent.com/cakgup/ppsa/main/assets/logo.png",
      summary_title: "Ringkasan PSB 2026",
      summary_lead: "Pondok pesantren berbasis madrasah diniyah, pembentukan karakter, pengajian, dan program tahfidz terintegrasi.",
      summary_stat_1_value: "1985",
      summary_stat_1_label: "Berdiri",
      summary_stat_2_value: "2",
      summary_stat_2_label: "Program Utama",
      summary_stat_3_value: "430K",
      summary_stat_3_label: "SPP Bulanan",
      summary_stat_4_value: "30 Juz",
      summary_stat_4_label: "Target Tahfidz",
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

function refreshDashboard() {
  showNotice("Data dashboard dimuat ulang dari database.");
  renderPage("dashboard");
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
    created_at: formatLongDate(new Date()),
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
  const studentsByGender = summarizeGender(demo.students);
  const teachersByGender = summarizeGender(demo.teachers);
  const classDistribution = groupCount(demo.students, "class_name");
  const paymentStatus = groupByLabel(demo.payments.map((item) => ({ label: paymentStatusLabel(item.status), total: 1 })));
  const attendanceStatus = groupByLabel(demo.attendance.map((item) => ({ label: attendanceStatusLabel(item.status), total: 1 })));
  const tahfidzByClass = groupAverageByClass(demo.tahfidz, demo.students);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cashFlow = demo.cash
    .filter((item) => {
      const date = new Date(normalizeDateInput(item.trx_date));
      return !Number.isNaN(date.getTime()) && date >= cutoff;
    })
    .reduce((map, item) => {
      const key = item.trx_date || "-";
      const bucket = map.get(key) || { label: key, incoming: 0, outgoing: 0 };
      if (String(item.type).toLowerCase() === "masuk") bucket.incoming += Number(item.amount || 0);
      else bucket.outgoing += Number(item.amount || 0);
      map.set(key, bucket);
      return map;
    }, new Map());

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
    chart: [72, 80, 88, 79, 92, 86],
    composition: {
      students: studentsByGender,
      teachers: teachersByGender
    },
    analytics: {
      class_distribution: classDistribution,
      payment_status: paymentStatus,
      cash_flow: Array.from(cashFlow.values()).sort((a, b) => String(a.label).localeCompare(String(b.label))).slice(-6),
      attendance_status: attendanceStatus,
      tahfidz_by_class: tahfidzByClass
    }
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
    ${items.map(([key, label]) => `
      <button class="${state.page === key ? "active" : ""}" data-page="${key}">
        <span>${label}</span>
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
  const composition = {
    students: { male: 0, female: 0, other: 0, ...(data.composition?.students || {}) },
    teachers: { male: 0, female: 0, other: 0, ...(data.composition?.teachers || {}) }
  };
  const analytics = {
    class_distribution: [],
    payment_status: [],
    cash_flow: [],
    attendance_status: [],
    tahfidz_by_class: [],
    ...(data.analytics || {})
  };
  setTitle("Dashboard Eksekutif", "Ringkasan operasional, akademik, keuangan, dan dakwah PPSA");

  document.getElementById("content").innerHTML = `
    <section class="dashboard-metric-row spaced">
      ${summaryActionCard("Saldo Kas", rupiah(totals.cash_balance ?? 0), DEMO_MODE ? "Reset Data Lokal" : "Muat Ulang Data")}
    </section>
    <section class="spaced">
      ${cashFlowCard("Kas Masuk vs Kas Keluar", "Perbandingan arus kas selama 1 bulan terakhir.", analytics.cash_flow)}
    </section>
    <section class="dashboard-pie-row spaced">
      ${pieCard("Sebaran Santri", composition.students)}
      ${pieCard("Sebaran Pengajar", composition.teachers)}
      ${statusDonutCard("Status Pembayaran SPP", "Status pembayaran tagihan santri.", analytics.payment_status, "total", {
        Lunas: "var(--green)",
        Cicil: "var(--gold)",
        Belum: "#dc2626"
      })}
      ${statusDonutCard("Status Absensi", "Ringkasan kehadiran santri.", analytics.attendance_status, "total", {
        Hadir: "var(--green)",
        Izin: "var(--gold)",
        Sakit: "#60a5fa",
        Alpha: "#dc2626"
      })}
    </section>
    <section class="grid-2 spaced">
      ${horizontalBarCard("Santri per Kelas", "Sebaran santri aktif per kelas yang tercatat.", analytics.class_distribution, "total", (value) => `${value} santri`)}
      ${horizontalBarCard("Capaian Tahfidz", "Rata-rata nilai tahfidz per kelas untuk memudahkan pembacaan capaian pembinaan.", analytics.tahfidz_by_class, "score", (value) => `${value}`)}
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

  document.getElementById("refreshDashboardBtn").onclick = DEMO_MODE ? resetDemo : refreshDashboard;
  document.querySelector("[data-jump='activities']").onclick = () => renderPage("activities");
}

async function renderCrud(key) {
  const module = meta[key];
  setTitle(module.title, module.subtitle);
  const response = await callApi(`/api/${key}`);
  const query = state.filters[key] || "";
  const rows = sortRows(filterRows(response.data, query), key, module.cols);
  const canCreate = module.allowCreate !== false;

  document.getElementById("content").innerHTML = `
    <div class="toolbar">
      <div>
        <b>${rows.length}</b> dari ${response.data.length} data
        <span class="muted">${query ? `sesuai pencarian "${esc(query)}"` : "tersedia"}</span>
      </div>
      <div class="toolbar-actions">
        <input id="searchInput" class="search-input" value="${esc(query)}" placeholder="Cari data..." />
        <button id="exportBtn" class="btn-secondary">Export CSV</button>
        ${canCreate ? `<button id="addBtn" class="btn-primary">${module.singleton ? (rows.length ? "Edit Pengaturan" : "Buat Pengaturan") : "Tambah Data"}</button>` : ""}
      </div>
    </div>
    <div class="card">${table(module.cols, rows, key)}</div>`;

  const addBtn = document.getElementById("addBtn");
  if (addBtn) addBtn.onclick = () => openForm(key, module.singleton ? (rows[0] || {}) : {});
  document.getElementById("exportBtn").onclick = () => exportCsv(key, module.cols, rows);
  document.getElementById("searchInput").oninput = debounce((event) => {
    state.filters[key] = event.target.value.trim();
    renderCrud(key);
  }, 220);
  document.querySelectorAll("[data-sort]").forEach((button) => {
    button.onclick = () => {
      const col = button.dataset.sort;
      const current = state.sorts[key] || {};
      const direction = current.col === col && current.direction === "asc" ? "desc" : "asc";
      state.sorts[key] = { col, direction };
      renderCrud(key);
    };
  });

  document.querySelectorAll("[data-edit]").forEach((button) => {
    button.onclick = () => openForm(key, JSON.parse(decodeURIComponent(button.dataset.edit)));
  });
  document.querySelectorAll("[data-del]").forEach((button) => {
    button.onclick = () => deleteRow(key, button.dataset.del);
  });
}

function table(cols, rows, key) {
  const module = key ? meta[key] : null;
  const dataCols = cols.filter((col) => col !== "id");
  const emptyColspan = dataCols.length + 1 + (key ? 1 : 0);
  const currentSort = state.sorts[key] || { col: "id", direction: "asc" };
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>
              <button type="button" class="sort-head" data-sort="id">
                <span>No.</span>
                <span class="sort-mark">${currentSort.col === "id" ? (currentSort.direction === "asc" ? "↑" : "↓") : "↕"}</span>
              </button>
            </th>
            ${dataCols.map((col) => `
              <th>
                <button type="button" class="sort-head" data-sort="${col}">
                  <span>${labels[col] || col}</span>
                  <span class="sort-mark">${currentSort.col === col ? (currentSort.direction === "asc" ? "↑" : "↓") : "↕"}</span>
                </button>
              </th>`).join("")}
            ${key ? "<th>Aksi</th>" : ""}
          </tr>
        </thead>
        <tbody>
          ${rows.length ? rows.map((row, index) => `
            <tr>
              <td>${index + 1}</td>
              ${dataCols.map((col) => `<td>${fmt(col, row[col])}</td>`).join("")}
              ${key ? `<td class="actions"><button class="btn-secondary" data-edit="${encodeURIComponent(JSON.stringify(row))}">${module?.actionLabel || "Edit"}</button>${module?.allowDelete === false ? "" : `<button class="btn-danger" data-del="${row.id}">Hapus</button>`}</td>` : ""}
            </tr>`).join("") : `<tr><td colspan="${emptyColspan}" class="empty">Belum ada data.</td></tr>`}
        </tbody>
      </table>
    </div>`;
}

async function openForm(key, row = {}) {
  const module = meta[key];
  const refs = await loadFormRefs();
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  const followUpMode = Array.isArray(module.readOnlyFields) && Array.isArray(module.editFields);
  modal.innerHTML = `
    <div class="modal-card">
      <div class="card-head">
        <div>
          <h2>${row.id ? (followUpMode ? "Tindak Lanjut" : "Edit") : "Tambah"} ${module.title}</h2>
          <p class="muted">${followUpMode ? "Data asli pengunjung ditampilkan sebagai referensi, lalu admin hanya mengisi bagian tindak lanjut." : "Lengkapi data sesuai kebutuhan administrasi."}</p>
        </div>
        <button id="closeModal" type="button" class="btn-secondary">Tutup</button>
      </div>
      <form id="form" class="form-grid">
        ${renderFormFields(key, module, row, refs)}
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
    if (key === "users" && !String(body.password || "").trim()) delete body.password;
    await callApi(`/api/${key}${row.id ? `/${row.id}` : ""}`, { method: row.id ? "PUT" : "POST", body: JSON.stringify(body) });
    closeModal();
    renderCrud(key);
  };
}

async function loadFormRefs() {
  const [teachersResponse, studentsResponse] = await Promise.all([
    callApi("/api/teachers").catch(() => ({ data: [] })),
    callApi("/api/students").catch(() => ({ data: [] }))
  ]);
  return {
    teachers: (teachersResponse.data || [])
      .filter((item) => String(item.status || "").toLowerCase() !== "nonaktif")
      .map((item) => item.name)
      .filter(Boolean)
      .sort((left, right) => String(left).localeCompare(String(right), "id")),
    students: (studentsResponse.data || [])
      .filter((item) => String(item.status || "").toLowerCase() !== "nonaktif")
      .map((item) => item.name)
      .filter(Boolean)
      .sort((left, right) => String(left).localeCompare(String(right), "id"))
  };
}

function renderFormFields(key, module, row, refs = {}) {
  if (module.readOnlyFields && module.editFields) {
    return `
      <div class="full form-section">
        <h3>Data Masuk</h3>
        <div class="detail-grid">
          ${module.readOnlyFields.map((fieldName) => readonlyField(fieldName, row[fieldName])).join("")}
        </div>
      </div>
      <div class="full form-section">
        <h3>Tindak Lanjut Admin</h3>
        <div class="form-grid">
          ${module.editFields.map((fieldName) => field(key, fieldName, row[fieldName], refs)).join("")}
        </div>
      </div>`;
  }

  if (module.sections?.length) {
    return module.sections.map((section) => `
      <div class="full form-section">
        <h3>${section.title}</h3>
        <div class="form-grid">
          ${section.fields.map((fieldName) => field(key, fieldName, row[fieldName], refs)).join("")}
        </div>
      </div>
    `).join("");
  }

  return module.fields.map((fieldName) => field(key, fieldName, row[fieldName], refs)).join("");
}

function readonlyField(name, value) {
  return `
    <div class="readonly-field ${["address", "notes", "message"].includes(name) ? "full" : ""}">
      <label>${labels[name] || name}</label>
      <div class="readonly-value">${fmt(name, value)}</div>
    </div>`;
}

function field(key, name, value = "", refs = {}) {
  if (["description", "body", "address", "notes", "summary", "focus_points", "required_points", "extra_points", "requirements_points", "profile_body_1", "profile_body_2", "hero_lead", "summary_lead", "program_section_lead", "registration_lead", "pricing_note", "schedule_lead", "donation_lead", "doa_lead", "activity"].includes(name)) {
    return `<div class="full"><label>${labels[name] || name}</label><textarea name="${name}">${esc(value)}</textarea></div>`;
  }
  if (name === "gender") return select(name, value, ["L", "P", "-"]);
  if (name === "student_name") return datalistField(name, value, buildDynamicOptions(refs.students || [], value), "Ketik atau pilih santri");
  if (["teacher_name", "homeroom_teacher"].includes(name)) return datalistField(name, value, buildDynamicOptions(refs.teachers || [], value), "Ketik atau pilih pengajar");
  if (name === "role") return select(name, value || "operator", ["admin", "operator", "akademik", "keuangan", "pengasuh", "portal_admin"]);
  if (name === "type" && key === "cash") return select(name, value, [{ value: "masuk", label: "Masuk" }, { value: "keluar", label: "Keluar" }]);
  if (name === "category" && key === "cash") return select(name, value, ["SPP", "Infaq", "Donasi", "Wakaf", "Operasional", "Konsumsi", "Listrik", "Air", "Perawatan", "Kegiatan", "ATK", "Transportasi", "Lainnya"]);
  if (name === "method" && key === "attendance") return select(name, value, [{ value: "QR", label: "QR" }, { value: "Manual", label: "Manual" }]);
  if (name === "donor_type" && key === "donors") return select(name, value, ["Tetap", "Insidental", "Infaq", "Donatur", "Wakaf", "Alumni", "Wali Santri", "Lembaga", "Komunitas", "Lainnya"]);
  if (name === "type" && key === "contents") return select(name, value, ["article", "announcement"]);
  if (name === "content_type" && key === "activities") return select(name, value, ["activity", "article", "announcement"]);
  if (name === "semester") return select(name, value, ["Ganjil", "Genap"]);
  if (name === "memorization_status" && key === "tahfidz") return select(name, value, ["lancar", "cukup", "mengulang"]);
  if (name === "status" && key === "payments") return select(name, value, [{ value: "lunas", label: "Lunas" }, { value: "cicil", label: "Cicil" }, { value: "belum_lunas", label: "Belum Lunas" }]);
  if (name === "status") return select(name, value, ["aktif", "nonaktif", "terjadwal", "selesai", "publikasi", "terbit", "hadir", "izin", "sakit", "alpa", "lunas", "belum_lunas", "terkirim", "draft", "baik", "rusak"]);
  if (name === "follow_up_status") return select(name, value, ["baru", "diproses", "selesai", "ditutup"]);
  if (name === "is_published") return select(name, value, [1, 0]);
  if (name === "is_active") return select(name, value, [1, 0]);

  const numberFields = ["amount", "paid_amount", "total_donation", "last_donation", "stock", "available", "capacity", "occupied", "score", "purchase_year", "sort_order", "target_amount", "assignment_score", "midterm_score", "final_exam_score", "final_score"];
  const type = name === "password" ? "password" : (name.includes("date") ? "date" : (numberFields.includes(name) ? "number" : "text"));
  const placeholder = key === "users" && name === "password" ? ' placeholder="Kosongkan jika tidak diubah"' : "";
  return `<div><label>${labels[name] || name}</label><input name="${name}" type="${type}" value="${esc(value)}"${placeholder}></div>`;
}

function select(name, value, options) {
  return `
    <div>
      <label>${labels[name] || name}</label>
      <select name="${name}">
        ${options.map((option) => {
          const optionValue = typeof option === "object" ? option.value : option;
          const optionLabel = typeof option === "object" ? option.label : option;
          return `<option value="${esc(optionValue)}" ${String(value) === String(optionValue) ? "selected" : ""}>${esc(optionLabel)}</option>`;
        }).join("")}
      </select>
    </div>`;
}

function datalistField(name, value, options, placeholder = "") {
  const listId = `list-${name}`;
  return `
    <div>
      <label>${labels[name] || name}</label>
      <input name="${name}" value="${esc(value)}" list="${listId}" placeholder="${esc(placeholder)}" autocomplete="off">
      <datalist id="${listId}">
        ${options.map((option) => {
          const optionValue = typeof option === "object" ? option.value : option;
          return `<option value="${esc(optionValue)}"></option>`;
        }).join("")}
      </datalist>
    </div>`;
}

function buildDynamicOptions(items, currentValue, placeholder) {
  const normalized = [...new Set(items.map((item) => String(item).trim()).filter(Boolean))];
  if (currentValue && !normalized.includes(String(currentValue))) normalized.unshift(String(currentValue));
  const options = normalized.map((item) => ({ value: item, label: item }));
  return options;
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

function summaryActionCard(label, value, actionLabel) {
  return `
    <div class="card metric-card">
      <div class="card-head compact-head">
        <div class="muted">${label}</div>
        <button class="btn-secondary" id="refreshDashboardBtn">${actionLabel}</button>
      </div>
      <div class="metric">${value}</div>
    </div>`;
}

function pieCard(title, data) {
  const male = Number(data?.male || 0);
  const female = Number(data?.female || 0);
  const other = Number(data?.other || 0);
  const total = male + female + other;
  const maleDeg = total ? (male / total) * 360 : 0;
  const femaleDeg = total ? ((male + female) / total) * 360 : maleDeg;
  const chartStyle = `background: conic-gradient(var(--green) 0deg ${maleDeg}deg, #d6b97b ${maleDeg}deg ${femaleDeg}deg, #d1d5db ${femaleDeg}deg 360deg);`;
  return `
    <div class="card pie-card pie-card-compact">
      <div>
        <h3>${title}</h3>
        <p class="muted">Sebaran berdasarkan jenis kelamin.</p>
      </div>
      <div class="pie-wrap">
        <div class="pie-chart" style="${chartStyle}"><span>${total}</span></div>
        <div class="pie-legend">
          <div><i class="swatch male"></i><span>Laki-laki</span><b>${male}</b></div>
          <div><i class="swatch female"></i><span>Perempuan</span><b>${female}</b></div>
          ${other ? `<div><i class="swatch other"></i><span>Lainnya</span><b>${other}</b></div>` : ""}
        </div>
      </div>
    </div>`;
}

function horizontalBarCard(title, description, items, valueKey, formatter = (value) => value) {
  const rows = Array.isArray(items) ? items : [];
  const max = Math.max(1, ...rows.map((item) => Number(item?.[valueKey] || 0)));
  return `
    <div class="card analytic-card pie-card-compact">
      <div>
        <h3>${title}</h3>
        <p class="muted">${description}</p>
      </div>
      ${rows.length ? `
        <div class="hbar-list">
          ${rows.map((item) => {
            const value = Number(item?.[valueKey] || 0);
            const width = Math.max(10, Math.round((value / max) * 100));
            return `
              <div class="hbar-row">
                <div class="hbar-meta">
                  <span>${esc(item.label || "-")}</span>
                  <b>${formatter(value)}</b>
                </div>
                <div class="hbar-track"><i class="hbar-fill" style="width:${width}%"></i></div>
              </div>`;
          }).join("")}
        </div>` : `<div class="empty-state">Belum ada data untuk divisualkan.</div>`}
    </div>`;
}

function statusDonutCard(title, description, items, valueKey, palette = {}) {
  const rows = Array.isArray(items) ? items.filter((item) => Number(item?.[valueKey] || 0) > 0) : [];
  const total = rows.reduce((sum, item) => sum + Number(item?.[valueKey] || 0), 0);
  const colors = rows.map((item, index) => palette[item.label] || ["var(--green)", "var(--gold)", "#60a5fa", "#dc2626", "#9ca3af"][index % 5]);
  let cursor = 0;
  const segments = rows.map((item, index) => {
    const value = Number(item?.[valueKey] || 0);
    const end = total ? cursor + (value / total) * 360 : cursor;
    const segment = `${colors[index]} ${cursor}deg ${end}deg`;
    cursor = end;
    return segment;
  });
  const chartStyle = rows.length
    ? `background: conic-gradient(${segments.join(", ")});`
    : "background: conic-gradient(#e5e7eb 0deg 360deg);";
  return `
    <div class="card analytic-card pie-card-compact">
      <div>
        <h3>${title}</h3>
        <p class="muted">${description}</p>
      </div>
      <div class="pie-wrap">
        <div class="pie-chart" style="${chartStyle}"><span>${total || 0}</span></div>
        <div class="pie-legend">
          ${rows.length ? rows.map((item, index) => `
            <div>
              <i class="swatch" style="background:${colors[index]}"></i>
              <span>${esc(item.label || "-")}</span>
              <b>${Number(item?.[valueKey] || 0)}</b>
            </div>`).join("") : `<div><span class="muted">Belum ada data untuk divisualkan.</span></div>`}
        </div>
      </div>
    </div>`;
}

function cashFlowCard(title, description, items) {
  const rows = Array.isArray(items) ? items : [];
  const max = Math.max(1, ...rows.flatMap((item) => [Number(item?.incoming || 0), Number(item?.outgoing || 0)]));
  return `
    <div class="card analytic-card">
      <div>
        <h3>${title}</h3>
        <p class="muted">${description}</p>
      </div>
      ${rows.length ? `
        <div class="dual-chart">
          ${rows.map((item) => {
            const incoming = Number(item?.incoming || 0);
            const outgoing = Number(item?.outgoing || 0);
            const inHeight = Math.max(8, Math.round((incoming / max) * 100));
            const outHeight = Math.max(8, Math.round((outgoing / max) * 100));
            return `
              <div class="dual-group">
                <div class="dual-bars">
                <div class="dual-bar incoming" style="height:${inHeight}%"><b>${shortRupiah(incoming)}</b></div>
                <div class="dual-bar outgoing" style="height:${outHeight}%"><b>${shortRupiah(outgoing)}</b></div>
              </div>
                <span>${esc(formatLongDate(item.label))}</span>
              </div>`;
          }).join("")}
        </div>
        <div class="mini-legend">
          <div><i class="swatch" style="background:var(--green)"></i><span>Kas masuk</span></div>
          <div><i class="swatch" style="background:#dc2626"></i><span>Kas keluar</span></div>
        </div>` : `<div class="empty-state">Belum ada data untuk divisualkan.</div>`}
    </div>`;
}

function filterRows(rows, query) {
  if (!query) return rows;
  const needle = query.toLowerCase();
  return rows.filter((row) => Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(needle)));
}

function sortRows(rows, key, cols = []) {
  const explicit = state.sorts[key];
  const fallbackCol = cols.includes("id") ? "id" : cols[0];
  const sort = explicit || (fallbackCol ? { col: fallbackCol, direction: "asc" } : null);
  if (!sort?.col) return rows;
  return [...rows].sort((left, right) => compareValues(left?.[sort.col], right?.[sort.col], sort.direction));
}

function compareValues(left, right, direction = "asc") {
  const a = left ?? "";
  const b = right ?? "";
  const numericA = Number(a);
  const numericB = Number(b);
  const bothNumeric = a !== "" && b !== "" && Number.isFinite(numericA) && Number.isFinite(numericB);
  const result = bothNumeric
    ? numericA - numericB
    : String(a).localeCompare(String(b), "id", { numeric: true, sensitivity: "base" });
  return direction === "desc" ? result * -1 : result;
}

function shortRupiah(value) {
  const amount = Number(value || 0);
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(amount % 1000000 === 0 ? 0 : 1)} jt`;
  if (amount >= 1000) return `${Math.round(amount / 1000)} rb`;
  return `${amount}`;
}

function formatLongDate(value) {
  if (!value) return "-";
  const normalized = value instanceof Date ? value : normalizeDateInput(value);
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}

function normalizeDateInput(value) {
  const text = String(value ?? "").trim();
  if (!text) return text;
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return `${text}T00:00:00`;
  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}(:\d{2})?$/.test(text)) return text.replace(" ", "T");
  return text;
}

function summarizeGender(rows) {
  return rows.reduce((acc, row) => {
    const gender = String(row?.gender || "").toUpperCase();
    if (gender === "L") acc.male += 1;
    else if (gender === "P") acc.female += 1;
    else acc.other += 1;
    return acc;
  }, { male: 0, female: 0, other: 0 });
}

function groupCount(rows, field) {
  const map = new Map();
  rows.forEach((row) => {
    const label = String(row?.[field] || "-");
    map.set(label, (map.get(label) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label));
}

function groupByLabel(rows) {
  const map = new Map();
  rows.forEach((row) => {
    const label = String(row?.label || "-");
    map.set(label, (map.get(label) || 0) + Number(row?.total || 0));
  });
  return Array.from(map.entries())
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label));
}

function paymentStatusLabel(status) {
  const value = String(status || "").toLowerCase();
  if (value === "lunas") return "Lunas";
  if (value === "cicil") return "Cicil";
  return "Belum";
}

function attendanceStatusLabel(status) {
  const value = String(status || "").toLowerCase();
  if (value === "hadir") return "Hadir";
  if (value === "izin") return "Izin";
  if (value === "sakit") return "Sakit";
  return "Alpha";
}

function groupAverageByClass(tahfidzRows, studentRows) {
  const studentClass = new Map(studentRows.map((row) => [row.name, row.class_name || "-"]));
  const totals = new Map();
  tahfidzRows.forEach((row) => {
    const label = studentClass.get(row.student_name) || "-";
    const bucket = totals.get(label) || { label, score: 0, count: 0 };
    bucket.score += Number(row.score || 0);
    bucket.count += 1;
    totals.set(label, bucket);
  });
  return Array.from(totals.values())
    .map((item) => ({ label: item.label, score: Math.round(item.score / Math.max(1, item.count)) }))
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
}

function exportCsv(key, cols, rows) {
  const csvCols = cols.filter((col) => col !== "id");
  const csv = [
    ["No.", ...csvCols.map((col) => labels[col] || col)].join(","),
    ...rows.map((row, index) => [`"${index + 1}"`, ...csvCols.map((col) => `"${String(row[col] ?? "").replace(/"/g, '""')}"`)].join(","))
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
  if (["birth_date", "attendance_date", "review_date", "trx_date", "due_date", "activity_date", "letter_date", "created_at", "handled_at"].includes(col)) return esc(formatLongDate(value));
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
