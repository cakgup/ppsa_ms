const PORTAL_CONFIG = window.PPSA_CONFIG || {};
const API_BASE = PORTAL_CONFIG.API_BASE_URL || "";
const DOA_URL = PORTAL_CONFIG.DOA_APP_URL || "https://ppsajombang.vercel.app";

const fallback = {
  settings: {
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
  },
  programs: [
    { title: "Madrasah Diniyah", description: "Program unggulan pembentukan karakter melalui pengajian, ibadah berjama'ah, dan pembelajaran diniyah." },
    { title: "Tahfidz Al-Qur'an Gratis", description: "Setoran Al-Qur'an, muroqobah 5 juz, imtihan syafawi, dan target 30 juz bersanad." },
    { title: "Sekolah Formal Terintegrasi", description: "Santri memperoleh ijazah sekolah formal dan syahadah tahfidz dalam satu jalur pembinaan." }
  ],
  news: [
    { title: "PSB Pondok Pesantren Sunan Ampel dibuka", date: "2026-02-01", summary: "Pendaftaran santri baru dibuka mulai 1 Februari sampai 31 Juli 2026." },
    { title: "Program tahfidz gratis PPSA", date: "2026-02-01", summary: "Program tahfidz gratis menjadi salah satu unggulan PPSA dengan pembinaan yang terintegrasi bersama sekolah formal." }
  ],
  announcements: [
    { title: "Batas akhir pendaftaran", date: "2026-07-31", summary: "Pendaftaran santri baru ditutup pada 31 Juli 2026." },
    { title: "Masuk pondok mulai Agustus 2026", date: "2026-08-01", summary: "Santri baru mulai masuk pondok pada Agustus 2026 sesuai agenda penerimaan." }
  ],
  donations: [
    { title: "Beasiswa Santri", summary: "Dukungan biaya pendidikan untuk santri yang membutuhkan." },
    { title: "Wakaf Al-Qur'an", summary: "Program pengadaan mushaf dan bahan belajar Al-Qur'an untuk santri." },
    { title: "Operasional Pondok", summary: "Dukungan kegiatan pendidikan, madrasah diniyah, dan layanan pondok." }
  ],
  schedule: [
    { time_slot: "03.00 - 04.30", activity: "Shalat malam." },
    { time_slot: "04.30 - 05.00", activity: "Shalat subuh berjama'ah." },
    { time_slot: "05.00 - 06.00", activity: "Pengajian Al-Qur'an dan majelis shalawat pada Jumat pagi." },
    { time_slot: "06.00 - 15.00", activity: "Kegiatan di sekolah untuk santri formal." },
    { time_slot: "08.30 - 09.30", activity: "Pengajian bandongan pada Ahad pagi." },
    { time_slot: "15.00 - 15.30", activity: "Persiapan shalat Ashar." },
    { time_slot: "15.30 - 16.00", activity: "Shalat Ashar berjama'ah." },
    { time_slot: "16.00 - 17.00", activity: "Pengajian bandongan sore." },
    { time_slot: "17.45 - 18.00", activity: "Shalat Maghrib berjama'ah." },
    { time_slot: "18.15 - 19.00", activity: "Pengajian Tafsir Jalalain." },
    { time_slot: "19.00 - 19.30", activity: "Shalat Isya' berjama'ah." },
    { time_slot: "19.45 - 21.00", activity: "Madrasah diniyah." },
    { time_slot: "21.00 - 22.00", activity: "Jam belajar." },
    { time_slot: "22.00 - 03.00", activity: "Tidur malam." }
  ]
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

async function getPublic(path, fallbackData) {
  if (!API_BASE) return fallbackData;
  try {
    const res = await fetch(API_BASE + path);
    if (!res.ok) throw new Error("API tidak tersedia");
    const data = await res.json();
    return data.data || data || fallbackData;
  } catch {
    return fallbackData;
  }
}

async function postPublic(path, payload) {
  if (!API_BASE) {
    const key = "ppsa_portal_offline_submissions";
    const current = JSON.parse(localStorage.getItem(key) || "[]");
    current.push({ path, payload, created_at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(current));
    return { ok: true, offline: true };
  }

  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Pengiriman belum berhasil");
  return res.json().catch(() => ({ ok: true }));
}

function renderCards(targetId, rows) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = rows.map((item) => `
    <article class="feature-card">
      <h3>${escapeHtml(item.title || item.name)}</h3>
      <p>${escapeHtml(item.description || item.summary || item.body || "")}</p>
    </article>
  `).join("");
}

function renderStack(targetId, rows) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = rows.map((item) => `
    <article class="stack-item">
      <h3>${escapeHtml(item.title || item.name)}</h3>
      <span class="stack-rule" aria-hidden="true"></span>
      <p>${escapeHtml(item.summary || item.description || item.body || "")}</p>
    </article>
  `).join("");
}

function splitPoints(value) {
  return String(value || "").split("|").map((item) => item.trim()).filter(Boolean);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value != null) el.textContent = value;
}

function setHtml(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

function renderCheckList(id, points) {
  const items = splitPoints(points).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  setHtml(id, items);
}

function renderSchedule(rows) {
  const target = document.getElementById("scheduleList");
  if (!target) return;
  target.innerHTML = rows.map((item) => `
    <article class="stack-item">
      <strong>${escapeHtml(item.time_slot || "")}</strong>
      <p>${escapeHtml(item.activity || "")}</p>
    </article>
  `).join("");
}

function normalizeWhatsApp(number) {
  return String(number || "").replace(/[^\d]/g, "");
}

function applyPortalSettings(settings) {
  setText("siteName", settings.site_name);
  setText("siteTagline", settings.site_tagline);
  setText("heroEyebrow", settings.hero_eyebrow);
  setText("heroTitle", settings.hero_title);
  setText("heroLead", settings.hero_lead);
  setText("heroPrimaryLabel", settings.hero_primary_label);
  setText("heroSecondaryLabel", settings.hero_secondary_label);
  const heroPrimary = document.getElementById("heroPrimaryLink");
  const heroSecondary = document.getElementById("heroSecondaryLink");
  if (heroPrimary && settings.hero_primary_href) heroPrimary.href = settings.hero_primary_href;
  if (heroSecondary && settings.hero_secondary_href) heroSecondary.href = settings.hero_secondary_href;
  setText("summaryTitle", settings.summary_title);
  setText("summaryLead", settings.summary_lead);
  setText("summaryStat1Value", settings.summary_stat_1_value);
  setText("summaryStat1Label", settings.summary_stat_1_label);
  setText("summaryStat2Value", settings.summary_stat_2_value);
  setText("summaryStat2Label", settings.summary_stat_2_label);
  setText("summaryStat3Value", settings.summary_stat_3_value);
  setText("summaryStat3Label", settings.summary_stat_3_label);
  setText("summaryStat4Value", settings.summary_stat_4_value);
  setText("summaryStat4Label", settings.summary_stat_4_label);
  const summaryLogo = document.getElementById("summaryLogo");
  if (summaryLogo && settings.summary_logo_url) summaryLogo.src = settings.summary_logo_url;
  setText("profileTitle", settings.profile_title);
  setText("profileBody1", settings.profile_body_1);
  setText("profileBody2", settings.profile_body_2);
  setText("focusTitle", settings.focus_title);
  renderCheckList("focusPoints", settings.focus_points);
  setText("programSectionTitle", settings.program_section_title);
  setText("programSectionLead", settings.program_section_lead);
  setText("requiredTitle", settings.required_title);
  renderCheckList("requiredPoints", settings.required_points);
  setText("extraTitle", settings.extra_title);
  renderCheckList("extraPoints", settings.extra_points);
  setText("registrationTitle", settings.registration_title);
  setText("registrationLead", settings.registration_lead);
  setText("psbCardTitle", settings.psb_card_title);
  setText("psbRegistrationText", settings.psb_registration_text);
  setText("psbEntryText", settings.psb_entry_text);
  setText("requirementsTitle", settings.requirements_title);
  renderCheckList("requirementsPoints", settings.requirements_points);
  setText("pricingTitle", settings.pricing_title);
  setText("pricingPutra", settings.pricing_putra);
  setText("pricingPutri", settings.pricing_putri);
  setText("pricingSpp", settings.pricing_spp);
  setText("pricingNote", settings.pricing_note);
  setText("scheduleTitle", settings.schedule_title);
  setText("scheduleLead", settings.schedule_lead);
  setText("donationTitle", settings.donation_title);
  setText("donationLead", settings.donation_lead);
  setText("doaTitle", settings.doa_title);
  setText("doaLead", settings.doa_lead);
  if (settings.doa_url) {
    document.querySelectorAll("[data-doa-link]").forEach((link) => { link.href = settings.doa_url; });
  }
  setText("contactTitle", settings.contact_title);
  setText("contactAddress", settings.contact_address);
  const ig = document.getElementById("instagramLink");
  const yt = document.getElementById("youtubeLink");
  const wa1 = document.getElementById("whatsappLink1");
  const wa2 = document.getElementById("whatsappLink2");
  setText("instagramLabel", settings.instagram_label);
  setText("youtubeLabel", settings.youtube_label);
  setText("whatsappLabel1", settings.whatsapp_1_label);
  setText("whatsappLabel2", settings.whatsapp_2_label);
  setText("whatsappNumber1", settings.whatsapp_1_number);
  setText("whatsappNumber2", settings.whatsapp_2_number);
  if (ig && settings.instagram_url) ig.href = settings.instagram_url;
  if (yt && settings.youtube_url) yt.href = settings.youtube_url;
  if (wa1 && settings.whatsapp_1_number) wa1.href = `https://wa.me/${normalizeWhatsApp(settings.whatsapp_1_number)}`;
  if (wa2 && settings.whatsapp_2_number) wa2.href = `https://wa.me/${normalizeWhatsApp(settings.whatsapp_2_number)}`;
}

async function loadPortalContent() {
  const [settings, programs, news, announcements, donations, schedule] = await Promise.all([
    getPublic("/public/portal-settings", fallback.settings),
    getPublic("/public/programs", fallback.programs),
    getPublic("/public/contents?type=article", fallback.news),
    getPublic("/public/contents?type=announcement", fallback.announcements),
    getPublic("/public/donations", fallback.donations),
    getPublic("/public/portal-schedule", fallback.schedule)
  ]);

  applyPortalSettings(settings);
  renderCards("programList", programs);
  renderStack("newsList", news);
  renderStack("announcementList", announcements);
  renderStack("donationList", donations);
  renderSchedule(schedule);
}

function initForms() {
  document.querySelectorAll("[data-api-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      const payload = Object.fromEntries(new FormData(form).entries());
      status.textContent = "Mengirim data...";
      try {
        const result = await postPublic(form.dataset.apiForm, payload);
        status.textContent = result.offline
          ? "Data berhasil diterima. Silakan simpan informasi yang telah diisi, panitia akan menindaklanjuti sesuai alur pendaftaran."
          : "Data berhasil dikirim. Panitia akan menindaklanjuti.";
        form.reset();
      } catch (error) {
        status.textContent = error.message || "Data belum berhasil dikirim.";
      }
    });
  });
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

function initDoaLinks() {
  document.querySelectorAll("[data-doa-link]").forEach((link) => {
    link.href = DOA_URL;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initDoaLinks();
  initForms();
  loadPortalContent();
});
