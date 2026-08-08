/* GymCoach — service worker : RÉSEAU D'ABORD, cache en secours.
   En ligne : le site est toujours à jour (chaque réponse rafraîchit le cache).
   Hors ligne : tout est servi depuis le cache (usage en salle). */
const CACHE = "gymcoach-v15";
const ASSETS = [
  "./",
  "index.html",
  "css/style.css",
  "js/data.js",
  "js/data-extra.js",
  "js/icons.js",
  "js/motion.js",
  "js/motion-ex.js",
  "js/program.js",
  "js/app.js",
  "js/ui.js",
  "js/workout.js",
  "js/tracking.js",
  "js/home.js",
  "js/shell.js",
  "js/programs.js",
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

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // YouTube, fonts : réseau direct
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() =>
        caches.match(e.request).then(hit => hit || caches.match("index.html"))
      )
  );
});
