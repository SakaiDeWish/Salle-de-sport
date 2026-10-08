/* GymCoach — service worker : RÉSEAU D'ABORD, cache en secours.
   En ligne : le site est toujours à jour (chaque réponse rafraîchit le cache).
   Hors ligne : tout est servi depuis le cache (usage en salle).

   >>> CE NUMÉRO VA PAR PAIRE AVEC APP_VERSION, dans js/shell.js <<<
   L'un vit dans le service worker, l'autre dans la page. Les tenir
   ensemble n'est pas qu'une discipline d'écriture : leur ÉCART est ce
   qui permet à l'app de détecter qu'une page tourne encore sur l'ancien
   code pendant qu'un service worker plus récent a déjà pris la main. */
const CACHE = "gymcoach-v44";
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
  "js/stats-info.js",
  "js/workout.js",
  "js/tracking.js",
  "js/home.js",
  "js/shell.js",
  "js/exercice-nouveau.js",
  "js/import-programme.js",
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

/* Deux questions que la page peut poser :
   — « quelle version es-tu ? », pour la comparer à la sienne ;
   — « passe devant tout de suite », quand l'utilisateur demande la mise
     à jour depuis les Réglages et qu'une version attend son tour. */
self.addEventListener("message", e => {
  const t = e.data && e.data.type;
  if (t === "version" && e.ports && e.ports[0]) e.ports[0].postMessage(CACHE.replace("gymcoach-", ""));
  if (t === "skip") self.skipWaiting();
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
