const CACHE = "ppsa-portal-cache-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./dashboard.html",
  "./assets/portal.css?v=20260604a",
  "./assets/portal.js?v=20260604a",
  "./assets/styles.css?v=20260604a",
  "./assets/app.js?v=20260603",
  "./assets/config.js?v=20260604a",
  "./manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.includes("/api/") || url.pathname.includes("/public/")) return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
