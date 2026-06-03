const PORTAL_CONFIG = window.PPSA_CONFIG || {};
const API_BASE = PORTAL_CONFIG.API_BASE_URL || "";
const DOA_URL = PORTAL_CONFIG.DOA_APP_URL || "https://cakgup.github.io/ppsa/";

const fallback = {
  programs: [
    { title: "Tahfidz Al-Qur'an", description: "Pembinaan hafalan, murajaah, setoran, dan evaluasi capaian santri." },
    { title: "Tahsin & Tilawah", description: "Pembelajaran bacaan Al-Qur'an yang benar, tartil, dan beradab." },
    { title: "Madrasah Diniyah", description: "Penguatan ilmu fikih, akidah, akhlak, bahasa Arab, dan kajian kitab." }
  ],
  news: [
    { title: "Portal resmi PPSA mulai disiapkan", date: "2026-06-04", summary: "Portal publik dikembangkan untuk menyatukan informasi pesantren, dashboard internal, dan aplikasi doa digital." },
    { title: "Ekosistem digital pesantren", date: "2026-06-04", summary: "Pengembangan diarahkan menggunakan GitHub Pages untuk front-end dan Cloudflare D1 untuk database." }
  ],
  announcements: [
    { title: "Informasi pendaftaran santri baru", date: "2026-06-04", summary: "Calon wali santri dapat mengisi formulir minat pada halaman pendaftaran." },
    { title: "Aplikasi doa digital PPSA", date: "2026-06-04", summary: "Aplikasi doa dan wirid dapat diakses melalui menu Doa & Wirid." }
  ],
  donations: [
    { title: "Beasiswa Santri", summary: "Dukungan untuk santri yang membutuhkan bantuan biaya pendidikan." },
    { title: "Wakaf Al-Qur'an", summary: "Program pengadaan mushaf dan bahan belajar Al-Qur'an." },
    { title: "Operasional Dakwah", summary: "Dukungan kegiatan pendidikan, kajian, dan layanan pesantren." }
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
          ? "Data tersimpan sementara di browser. Sambungkan API Cloudflare untuk penyimpanan D1."
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
