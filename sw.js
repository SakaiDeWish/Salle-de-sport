/* GymCoach — service worker : cache-first pour un usage hors-ligne en salle.
   Incrémenter CACHE à chaque déploiement pour invalider l'ancien shell. */
const CACHE = "gymcoach-v1";
const ASSETS = [
  "./",
  "index.html",
  "css/style.css",
  "js/data.js",
  "js/data-extra.js",
  "js/program.js",
  "js/app.js",
  "js/workout.js",
  "js/tracking.js",
  "manifest.webmanifest",
  "icon.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Cache d'abord (l'app doit marcher sans réseau), réseau en secours,
   et mise en cache au fil de l'eau des ressources même origine. */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // YouTube, fonts : réseau direct
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit ||
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match("index.html"))
    )
  );
});
