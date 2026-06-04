const PORTAL_CONFIG = window.PPSA_CONFIG || {};
const API_BASE = PORTAL_CONFIG.API_BASE_URL || "";
const DOA_URL = PORTAL_CONFIG.DOA_APP_URL || "https://cakgup.github.io/ppsa/";

const fallback = {
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
      ${item.date || item.created_at ? `<time>${escapeHtml(item.date || item.created_at)}</time>` : ""}
      <p>${escapeHtml(item.summary || item.description || item.body || "")}</p>
    </article>
  `).join("");
}

async function loadPortalContent() {
  const [programs, news, announcements, donations] = await Promise.all([
    getPublic("/public/programs", fallback.programs),
    getPublic("/public/contents?type=article", fallback.news),
    getPublic("/public/contents?type=announcement", fallback.announcements),
    getPublic("/public/donations", fallback.donations)
  ]);

  renderCards("programList", programs);
  renderStack("newsList", news);
  renderStack("announcementList", announcements);
  renderStack("donationList", donations);
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
