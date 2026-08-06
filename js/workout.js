/* =========================================================
   GymCoach — Séance en direct (style Nike Training Club)
   Chronomètre global, chrono par exercice, minuteur de repos
   avec anneau de progression, journal exact et historique.
   Tous les temps sont basés sur des horodatages réels
   (Date.now) : la précision ne dérive jamais.
   ========================================================= */

STORAGE_KEYS.live = "gymcoach.liveSession";
STORAGE_KEYS.history = "gymcoach.history";
STORAGE_KEYS.restDefault = "gymcoach.restDefault";
STORAGE_KEYS.restSound = "gymcoach.restSound";
STORAGE_KEYS.restVibrate = "gymcoach.restVibrate";
STORAGE_KEYS.lastWeights = "gymcoach.lastWeights"; // { exId: [{poids, reps} par numéro de série] }

let live = null;          // séance en cours
let liveTimer = null;     // interval d'affichage
let rest = null;          // { setRef, exName, startAt, targetSec, beeped }
let restMinimized = false; // repos réduit dans la mini-barre
let editingSet = null;     // { i, j } : série validée en cours de modification
let expandedIndex = null;  // accordéon : seul cet exercice est déplié

/* Mémoire des charges : ce que tu as mis la dernière fois pour la
   même combinaison (exercice, numéro de série) — pré-rempli ensuite. */
function getLastWeights() { return loadJSON(STORAGE_KEYS.lastWeights, {}); }
function rememberSet(exId, setIndex, poids, reps) {
  const mem = getLastWeights();
  (mem[exId] = mem[exId] || [])[setIndex] = { poids, reps };
  saveJSON(STORAGE_KEYS.lastWeights, mem);
}
function recallSet(exId, setIndex) {
  return (getLastWeights()[exId] || [])[setIndex] || null;
}

/* Référence temporelle : figée pendant une pause */
function nowRef() { return (live && live.pausedAt) ? live.pausedAt : Date.now(); }

/* circonférence de l'anneau SVG (r = 88) */
const RING_CIRC = 2 * Math.PI * 88;

/* ---------- Utilitaires temps ---------- */
function fmtClock(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const mm = String(m).padStart(2, "0"), ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
function fmtSec(sec) { return fmtClock(sec * 1000); }

/* Convertit un repos de programme ("90 s", "3 min", "60-75 s") en secondes */
function parseRestToSeconds(str) {
  if (!str) return getDefaultRest();
  const m = String(str).match(/(\d+)/);
  if (!m) return getDefaultRest();
  const n = parseInt(m[1], 10);
  return /min/i.test(str) ? n * 60 : n;
}

function getDefaultRest() {
  return loadJSON(STORAGE_KEYS.restDefault, 90);
}

/* Repos auto-adapté : type de mouvement (poly/iso) x objectif x niveau
   de l'exercice. Force = long, sèche = court ; les gros mouvements
   avancés gagnent +30 s. Toujours modifiable pendant le repos (±15 s). */
const SMART_REST = {
  force: { poly: 180, iso: 90 },
  masse: { poly: 120, iso: 75 },
  seche: { poly: 75,  iso: 45 },
  forme: { poly: 90,  iso: 60 }
};

function smartRest(ex) {
  const objectif = (loadJSON(STORAGE_KEYS.profil, null) || {}).objectif || "masse";
  const table = SMART_REST[objectif] || SMART_REST.masse;
  let s = table[ex.type === "poly" ? "poly" : "iso"];
  if (ex.niveau === "avance" && ex.type === "poly") s += 30;
  if (ex.niveau === "debutant" && ex.type !== "poly") s = Math.max(30, s - 15);
  return s;
}

/* Signal de fin de repos (WebAudio, aucun fichier à charger).

   UN SEUL coup, puis silence. La version précédente envoyait DEUX
   impulsions de 880 Hz espacées de 250 ms et une vibration en trois
   temps (200-100-200) : en salle, entre deux séries, c'était une
   alarme. Ici : une sinusoïde de 1000 Hz pendant 260 ms, avec une
   attaque de 15 ms et une extinction exponentielle — assez net pour
   percer le bruit ambiant, assez court pour ne pas déranger le voisin.

   L'attaque douce n'est pas cosmétique : un oscillateur démarré à plein
   volume produit un claquement (discontinuité du signal) bien plus
   agressif que le son lui-même.

   Les deux canaux sont indépendamment désactivables dans les Réglages.
   `force` sert au bouton « Tester le signal », qui doit sonner même
   quand le son est coupé. */
const REST_BEEP_HZ = 1000;
const REST_BEEP_MS = 260;

function beep(force) {
  const sonOn = force || localStorage.getItem(STORAGE_KEYS.restSound) !== "0";
  const vibOn = force || localStorage.getItem(STORAGE_KEYS.restVibrate) !== "0";
  if (sonOn) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const t0 = ctx.currentTime, d = REST_BEEP_MS / 1000;
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(REST_BEEP_HZ, t0);
      osc.connect(gain); gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.015);   // attaque 15 ms
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + d);     // extinction
      osc.start(t0);
      osc.stop(t0 + d + 0.02);
      osc.onended = () => { try { ctx.close(); } catch { /* déjà fermé */ } };
    } catch { /* audio indisponible : silencieux, jamais bloquant */ }
  }
  if (vibOn) {
    try { navigator.vibrate && navigator.vibrate(180); } catch { /* non supporté */ }
  }
}

/* ---------- Éléments ---------- */
const elSetup = document.getElementById("seance-setup");
const elLive = document.getElementById("seance-live");
const elSummary = document.getElementById("seance-summary");
const elLiveExercises = document.getElementById("live-exercises");
const elRestOverlay = document.getElementById("rest-overlay");
const elPicker = document.getElementById("picker");
const defaultRestInput = document.getElementById("default-rest");

/* ---------- Persistance de la séance en cours ---------- */
function saveLive() { saveJSON(STORAGE_KEYS.live, live); }
function clearLive() { localStorage.removeItem(STORAGE_KEYS.live); live = null; }

/* ---------- Démarrage ---------- */
function newLiveExercise(ex, target, restSec) {
  return {
    exId: ex.id,
    nom: ex.nom,
    groupe: ex.groupe,
    target: target || null,        // ex : "4 × 8-12"
    restSec: restSec || (ex.type ? smartRest(ex) : getDefaultRest()),
    restAuto: !restSec,
    sets: [],                      // { poids, reps, doneAt, restAfter }
    startedAt: null,
    endedAt: null
  };
}

function startSession(nom, exercises) {
  live = {
    nom,
    startedAt: Date.now(),
    endedAt: null,
    pausedAt: null,   // séance en pause ?
    pauseMs: 0,       // temps total passé en pause (exclu du chrono)
    exercises,
    currentIndex: exercises.length ? 0 : -1
  };
  ssApplyRemembered();
  saveLive();
  showLive();
}

document.getElementById("start-free").addEventListener("click", () => {
  saveJSON(STORAGE_KEYS.restDefault, parseInt(defaultRestInput.value, 10) || 90);
  startSession("Séance libre", []);
  openPicker();
});

function renderProgramDayButtons() {
  const container = document.getElementById("program-day-buttons");
  const program = loadJSON(STORAGE_KEYS.program, null);
  if (!program) {
    container.innerHTML = `<p class="video-hint">💡 Génère un programme dans l'onglet « Programme » pour lancer directement une de tes séances ici.</p>`;
    return;
  }
  container.innerHTML = program.days.map((d, i) => `
    <button class="btn btn-ghost start-day" data-day="${i}">
      ${objIcon(program.objectif)} Lancer : Séance ${d.numero} — ${esc(d.titre)}
    </button>`).join("");
  container.querySelectorAll(".start-day").forEach(btn => {
    btn.addEventListener("click", () => {
      saveJSON(STORAGE_KEYS.restDefault, parseInt(defaultRestInput.value, 10) || 90);
      const day = program.days[parseInt(btn.dataset.day, 10)];
      const exercises = day.exercices.map(l =>
        newLiveExercise(l.exercice, `${l.series} × ${l.reps}`, null) // repos auto (smartRest)
      );
      startSession(`Séance ${day.numero} — ${day.titre}`, exercises);
    });
  });
}

/* ---------- Affichage de la séance en cours ---------- */
function showLive() {
  elSetup.classList.add("hidden");
  elSummary.classList.add("hidden");
  elLive.classList.remove("hidden");
  elLive.classList.toggle("live-compact", localStorage.getItem("gymcoach.liveCompact") === "1");
  // au retour sur la séance on repart en grand : le scroll pilotera ensuite
  applyHeaderMin(false);
  resetHdrScroll();
  renderPauseState();
  document.getElementById("live-title").textContent = live.nom;
  renderLiveExercises();
  if (liveTimer) clearInterval(liveTimer);
  liveTimer = setInterval(tick, 250);
  tick();
}

function totalRestMs() {
  let total = 0;
  for (const ex of live.exercises)
    for (const s of ex.sets)
      if (s.restAfter) total += s.restAfter * 1000;
  if (rest) total += nowRef() - rest.startAt;
  return total;
}

function setCount() {
  return live.exercises.reduce((n, ex) => n + ex.sets.length, 0);
}

function exerciseElapsed(ex) {
  if (!ex.startedAt) return 0;
  return (ex.endedAt || nowRef()) - ex.startedAt;
}

/* ---------- Pause / reprise ---------- */
function pauseSession() {
  if (!live || live.pausedAt) return;
  live.pausedAt = Date.now();
  saveLive();
  renderPauseState();
}

function resumeSession() {
  if (!live || !live.pausedAt) return;
  const d = Date.now() - live.pausedAt;
  live.pauseMs = (live.pauseMs || 0) + d;
  const cur = live.exercises[live.currentIndex];
  if (cur && cur.startedAt && !cur.endedAt) cur.startedAt += d; // le chrono d'exo ignore la pause
  if (rest) rest.startAt += d;                                   // le repos aussi
  live.pausedAt = null;
  saveLive();
  renderPauseState();
}

function renderPauseState() {
  const banner = document.getElementById("pause-banner");
  const btn = document.getElementById("live-pause");
  if (banner) banner.classList.toggle("hidden", !live || !live.pausedAt);
  if (btn) btn.classList.toggle("hidden", !live || !!live.pausedAt);
  tick();
}

/* Nombre de séries prescrites pour un exercice ("4 × 8-12" -> 4).
   Retourne null pour une séance libre (aucune prescription). */
function targetSetsOf(ex) {
  if (!ex.target) return null;
  const m = String(ex.target).match(/^\s*(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

/* Séries restantes POUR UN EXERCICE (point 2).
   Sur un programme préfabriqué on connaît la prescription ; en séance
   libre il n'y a pas de cible, on compte simplement ce qui est fait. */
function exerciseProgress(ex) {
  const target = targetSetsOf(ex);
  const done = ex.sets.length;
  if (target == null) {
    return { target: null, done, restant: null, fini: false,
             texte: done ? `${done} série${done > 1 ? "s" : ""}` : "à démarrer" };
  }
  const restant = Math.max(0, target - done);
  return {
    target, done, restant, fini: restant === 0,
    texte: restant === 0 ? "Terminé" : `${done}/${target} séries · ${restant} restante${restant > 1 ? "s" : ""}`
  };
}

/* Prochain exercice dont les séries prescrites ne sont pas toutes faites */
function nextUnfinished(from) {
  if (!live) return null;
  for (let k = 1; k <= live.exercises.length; k++) {
    const i = (from + k) % live.exercises.length;
    if (i === from) break;
    if (!exerciseProgress(live.exercises[i]).fini) return i;
  }
  return null;
}

/* Ce qu'affiche l'en-tête : l'exercice EN COURS et sa progression à lui
   (le total de séance a été remplacé par le détail par exercice).
   `court` met la progression en premier : sur la pilule étroite, c'est
   le nom de l'exercice qui doit être tronqué, pas le compteur. */
function currentProgressText(court = false) {
  if (!live || !live.exercises.length) return "";
  const cur = live.exercises[Math.max(0, live.currentIndex)];
  if (!cur) return "";
  const p = exerciseProgress(cur);
  const etat = p.target == null ? p.texte
             : p.fini ? "terminé"
             : `série ${p.done + 1}/${p.target}`;
  return court ? `${etat} · ${cur.nom}` : `${cur.nom} · ${etat}`;
}

/* Progression : exercice courant + barre d'avancement de la séance */
function updateProgress() {
  const label = document.getElementById("live-progress-label");
  const bar = document.getElementById("live-progress-bar");
  if (!label || !bar || !live) return;
  const total = live.exercises.length;
  if (total === 0) { label.textContent = ""; bar.style.width = "0%"; return; }
  const current = Math.min(Math.max(live.currentIndex, 0) + 1, total);
  // avancement = part des séries prescrites déjà validées
  let t = 0, d = 0;
  for (const ex of live.exercises) {
    const p = exerciseProgress(ex);
    d += Math.min(p.done, p.target ?? p.done);
    t += p.target ?? p.done;
  }
  label.innerHTML = `<strong class="prog-strong">${esc(currentProgressText())}</strong>
    <span class="prog-dim">Exercice ${current}/${total}</span>`;
  bar.style.width = (t ? Math.min(100, Math.round(d / t * 100)) : 0) + "%";

  const pillLeft = document.getElementById("hdr-pill-left");
  if (pillLeft) pillLeft.textContent = currentProgressText(true);
}

/* ---------- Point 1 · chrono collant qui se réduit au scroll ----------
   Descente = état compact (pilule, chrono seul), remontée = état complet.
   Seuil + anti-rebond pour ne pas clignoter sur un micro-scroll ; un tap
   bascule manuellement puis l'automatisme reprend la main. */
const HDR_SCROLL_THRESHOLD = 26;   // px parcourus dans un sens avant de réagir
const HDR_MIN_SCROLL_Y = 90;       // en haut de page, jamais compact
/* hdrRef = position de référence, remise à jour à chaque changement d'état
   et « tirée » par les extrêmes atteints. Comparer à un point de référence
   plutôt qu'à la frame précédente rend la bascule insensible aux
   micro-oscillations du scroll (élastique, inertie, reflow). */
let hdrRef = 0, hdrLastY = 0, hdrTicking = false, hdrManualUntil = 0, hdrLockUntil = 0;

function headerMinimized() { return elLive.classList.contains("hdr-min"); }

/* Vrai pendant qu'une bascule est en cours ou vient d'avoir lieu.
   Réduire l'en-tête change la HAUTEUR DE LA PAGE, ce que le navigateur
   compense en déplaçant le scroll : la frame suivante ressemble alors à
   un geste très rapide. Tout code qui réagit à la vitesse de défilement
   doit donc s'abstenir pendant ce verrou, sous peine de se déclencher
   sur son propre effet. */
function hdrBusy() {
  const t = Date.now();
  return t < hdrManualUntil || t < hdrLockUntil;
}

function applyHeaderMin(on) {
  localStorage.setItem(STORAGE_KEYS.liveHeaderMin, on ? "1" : "0");
  elLive.classList.toggle("hdr-min", on);
  const btn = document.getElementById("live-hdr-toggle");
  if (btn) {
    btn.textContent = on ? "⌄" : "⌃";
    btn.title = on ? "Agrandir le chrono" : "Réduire le chrono";
  }
  tick();
}

function resetHdrScroll() {
  hdrRef = hdrLastY = window.scrollY || document.documentElement.scrollTop || 0;
}

function onLiveScroll() {
  if (!live || elLive.classList.contains("hidden")) return;
  const y = window.scrollY || document.documentElement.scrollTop;
  const now = Date.now();

  // après une bascule manuelle, ou pendant que le layout s'anime,
  // on ne redéclenche pas (sinon la hauteur qui change se relance elle-même)
  if (now < hdrManualUntil || now < hdrLockUntil) { hdrLastY = y; hdrRef = y; return; }

  if (y <= HDR_MIN_SCROLL_Y) {                 // haut de page : toujours grand
    if (headerMinimized()) { applyHeaderMin(false); hdrLockUntil = now + 260; }
    hdrLastY = y; hdrRef = y;
    return;
  }
  /* Page à peine plus haute que l'écran : réduire ne libérerait rien et
     rendrait la page non scrollable, ce qui ferait osciller l'état. */
  const marge = document.documentElement.scrollHeight - window.innerHeight;
  if (!headerMinimized() && marge < 240) { hdrLastY = y; hdrRef = y; return; }

  const min = headerMinimized();
  // la référence suit l'extrême atteint dans l'état courant : en grand on
  // retient le point le plus haut, en compact le point le plus bas
  hdrRef = min ? Math.max(hdrRef, y) : Math.min(hdrRef, y);
  const delta = y - hdrRef;
  hdrLastY = y;

  if (!min && delta > HDR_SCROLL_THRESHOLD) {          // descente franche
    applyHeaderMin(true); hdrRef = y; hdrLockUntil = now + 260;
  } else if (min && delta < -HDR_SCROLL_THRESHOLD) {   // remontée franche
    applyHeaderMin(false); hdrRef = y; hdrLockUntil = now + 260;
  }
}

window.addEventListener("scroll", () => {
  if (hdrTicking) return;                       // une seule évaluation par frame
  hdrTicking = true;
  requestAnimationFrame(() => { hdrTicking = false; onLiveScroll(); });
}, { passive: true });

/* Bascule manuelle : on applique, puis l'automatique reprend après 1,2 s */
function toggleHeaderManual(on) {
  applyHeaderMin(on);
  hdrManualUntil = Date.now() + 1200;
  resetHdrScroll();
}

function tick() {
  if (!live) return;
  const clock = fmtClock(nowRef() - live.startedAt - (live.pauseMs || 0));
  document.getElementById("chrono-session").textContent = clock;
  const pillChrono = document.getElementById("hdr-pill-chrono");
  if (pillChrono) pillChrono.textContent = clock;
  document.getElementById("chrono-rest-total").textContent = fmtClock(totalRestMs());
  document.getElementById("live-set-count").textContent = setCount();

  // chrono de l'exercice actif
  live.exercises.forEach((ex, i) => {
    const el = document.getElementById("ex-chrono-" + i);
    if (el) el.textContent = fmtClock(exerciseElapsed(ex));
  });

  updateMinibar();

  // minuteur de repos + anneau de progression
  if (rest) {
    const elapsed = (nowRef() - rest.startAt) / 1000;
    const remaining = rest.targetSec - elapsed;
    const cd = document.getElementById("rest-countdown");
    const ring = document.getElementById("rest-ring");
    if (remaining > 0) {
      cd.textContent = fmtSec(Math.ceil(remaining));
      cd.classList.remove("overtime");
      if (ring) {
        ring.classList.remove("ring-over");
        // l'anneau se vide à mesure que le repos s'écoule
        ring.style.strokeDashoffset = RING_CIRC * (1 - remaining / rest.targetSec);
      }
    } else {
      if (!rest.beeped) { beep(); rest.beeped = true; }
      cd.textContent = "+" + fmtSec(Math.floor(-remaining));
      cd.classList.add("overtime");
      if (ring) {
        ring.classList.add("ring-over");
        ring.style.strokeDashoffset = 0; // anneau plein, en rouge : dépassement
      }
    }
  }
}

/* Mini-barre flottante : la séance te suit partout dans l'app
   (pause, repos réduit, ou navigation sur un autre onglet). */
function updateMinibar() {
  const bar = document.getElementById("live-minibar");
  if (!bar) return;
  const onSeance = document.getElementById("view-seance").classList.contains("active");
  const show = !!live && (!!live.pausedAt || !onSeance || (rest && restMinimized));
  bar.classList.toggle("hidden", !show);
  if (!show) return;
  const chrono = fmtClock(nowRef() - live.startedAt - (live.pauseMs || 0));
  let status = "Séance en cours";
  if (live.pausedAt) status = "En pause";
  else if (rest) {
    const remaining = rest.targetSec - (nowRef() - rest.startAt) / 1000;
    status = remaining > 0 ? "Repos " + fmtSec(Math.ceil(remaining)) : "Repos terminé !";
  }
  document.getElementById("mb-chrono").textContent = chrono;
  document.getElementById("mb-status").textContent = status;
}

document.getElementById("live-minibar").addEventListener("click", () => {
  activateView("seance");
  if (live) {
    showLive();
    if (rest && restMinimized) { restMinimized = false; elRestOverlay.classList.remove("hidden"); }
    if (live.pausedAt) resumeSession();
  }
});

/* Assemble les cartes en enveloppant les membres d'un même super set
   dans un bloc unique. Les membres sont adjacents par construction
   (ssCreate les rapproche), donc un simple parcours suffit. */
function ssAssemble(cartes) {
  const out = [];
  for (let i = 0; i < cartes.length; i++) {
    const gid = live.exercises[i].ss;
    if (!gid) { out.push(cartes[i]); continue; }
    const membres = ssMembers(gid);
    if (membres[0] !== i) continue;                  // déjà émis avec son groupe
    const noms = membres.map(k => esc(live.exercises[k].nom));
    const series = membres.map(k => {
      const p = exerciseProgress(live.exercises[k]);
      return p.target ? p.done + "/" + p.target : String(p.done);
    });
    const memo = ssIsRemembered(gid);
    out.push(`<div class="ss-group" data-ss="${gid}">
      <div class="ss-head">
        <span class="ss-badge">⚡ Super set</span>
        <span class="ss-flow">${noms.map((n, k) => n + " (" + series[k] + ")").join(" → ")}
          · repos ${ssRest(gid)} s après la paire</span>
        <span class="ss-actions">
          <button class="btn btn-ghost btn-sm ss-memo" data-ss="${gid}">${
            memo ? "★ Mémorisé" : "☆ Mémoriser"}</button>
          <button class="btn btn-danger-ghost btn-sm ss-break" data-ss="${gid}">Dissocier</button>
        </span>
      </div>
      ${membres.map((k, r) => cartes[k] + (r < membres.length - 1
        ? '<div class="ss-link">↓ enchaîne sans repos</div>' : "")).join("")}
    </div>`);
  }
  return out.join("");
}

function renderLiveExercises() {
  if (live.exercises.length === 0) {
    elLiveExercises.innerHTML = `<div class="card empty-live">
      <p>Ta séance est vide pour l'instant : ajoute ton premier exercice pour commencer. 💪</p>
    </div>`;
    updateProgress();
    return;
  }

  // accordéon : un seul exercice déplié — celui en cours par défaut
  if (expandedIndex == null || expandedIndex >= live.exercises.length)
    expandedIndex = live.currentIndex;

  const cartes = live.exercises.map((ex, i) => {
    const isCurrent = i === live.currentIndex;
    const open = i === expandedIndex;
    const p = exerciseProgress(ex);
    // ligne récapitulative de l'exercice replié : séries faites + charges
    const poidsUtilises = [...new Set(ex.sets.map(s => s.poids).filter(v => v != null))];
    const recap = ex.sets.length
      ? `${ex.sets.length} série${ex.sets.length > 1 ? "s" : ""}${poidsUtilises.length
          ? " · " + poidsUtilises.slice(0, 4).join(" / ") + " kg" : ""}`
      : "aucune série";
    return `
    <div class="card live-ex ${isCurrent ? "live-ex-current" : ""} ${open ? "live-ex-open" : "live-ex-collapsed"} ${p.fini ? "live-ex-done" : ""}" data-i="${i}">
      <button type="button" class="live-ex-head" data-toggle="${i}" aria-expanded="${open}">
        <div class="live-ex-id">
          <h3>${esc(ex.nom)}</h3>
          <p class="day-focus live-ex-sub">
            ${LABELS.groupes[ex.groupe] || ""}
            ${ex.target ? " · " + esc(ex.target) : ""}
            · Repos ${ex.restSec} s${ex.restAuto !== false ? " (auto)" : ""}
          </p>
          <p class="day-focus live-ex-recap">${esc(recap)}</p>
        </div>
        <div class="live-ex-right">
          <span class="ex-sets ${p.fini ? "ex-sets-done" : ""}">${p.fini ? "✓ Terminé" : esc(p.texte)}</span>
          <span class="ex-chrono" id="ex-chrono-${i}">${fmtClock(exerciseElapsed(ex))}</span>
          ${isCurrent ? '<span class="tag tag-custom">En cours</span>' : ""}
          <span class="live-ex-chev" aria-hidden="true">⌄</span>
        </div>
      </button>

      <div class="live-ex-body"><div class="live-ex-body-inner">
      <div class="live-ex-tools">
        <button class="btn btn-ghost btn-sm ex-fiche" data-exid="${esc(ex.exId)}">Voir la fiche</button>
        ${isCurrent ? "" : `<button class="btn btn-ghost btn-sm set-current" data-i="${i}">▶ Passer à cet exercice</button>`}
        ${isCurrent && p.fini && nextUnfinished(i) != null
          ? `<button class="btn btn-primary btn-sm go-next" data-i="${nextUnfinished(i)}">▶ Exercice suivant</button>` : ""}
      </div>

      ${ex.sets.length ? `
      <table class="sets-table">
        <thead><tr><th>Série</th><th>Poids (kg)</th><th>Reps</th><th>Repos</th></tr></thead>
        <tbody>
          ${ex.sets.map((s, j) => {
            const editing = editingSet && editingSet.i === i && editingSet.j === j;
            if (editing) return `
              <tr class="set-editing">
                <td colspan="4">
                  <div class="set-edit-row">
                    <span class="set-edit-n">Série ${j + 1}</span>
                    <input type="number" inputmode="decimal" min="0" step="0.5" id="ed-poids" value="${s.poids ?? ""}" placeholder="kg" aria-label="Poids en kilogrammes">
                    <input type="number" inputmode="numeric" min="1" step="1" id="ed-reps" value="${s.reps}" placeholder="reps" aria-label="Répétitions">
                    <button class="btn btn-primary btn-sm set-edit-save" data-i="${i}" data-j="${j}">Enregistrer</button>
                    <button class="btn btn-ghost btn-sm set-edit-cancel">Annuler</button>
                    <button class="btn btn-danger-ghost btn-sm set-unvalidate" data-i="${i}" data-j="${j}">Dé-valider</button>
                  </div>
                </td>
              </tr>`;
            return `
            <tr class="set-row" data-i="${i}" data-j="${j}" tabindex="0" role="button"
                title="Modifier cette série" aria-label="Modifier la série ${j + 1}">
              <td>✔ ${j + 1}</td>
              <td>${s.poids != null ? s.poids : "—"}</td>
              <td>${s.reps}</td>
              <td>${s.restAfter != null ? fmtSec(s.restAfter) : "…"}<span class="set-edit-hint">✎</span></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>` : ""}

      ${(() => {
        const mem = recallSet(ex.exId, ex.sets.length);
        return mem ? `<p class="last-hint">Dernière fois (série ${ex.sets.length + 1}) : <strong>${mem.poids != null ? mem.poids + " kg" : "—"} × ${mem.reps}</strong></p>` : "";
      })()}
      <div class="set-form">
        <input type="number" inputmode="decimal" min="0" step="0.5" placeholder="Poids (kg)" id="poids-${i}" class="set-input" aria-label="Poids en kilogrammes"
          value="${(recallSet(ex.exId, ex.sets.length) || {}).poids ?? ""}">
        <input type="number" inputmode="numeric" min="1" step="1" placeholder="Reps" id="reps-${i}" class="set-input" aria-label="Répétitions"
          value="${(recallSet(ex.exId, ex.sets.length) || {}).reps ?? ""}">
        <button class="btn btn-primary validate-set" data-i="${i}">✔ Valider la série</button>
        <button class="btn btn-ghost btn-sm swap-ex" data-i="${i}" title="Remplacer par une alternative">${icon("swap")}</button>
        <button class="btn btn-danger-ghost remove-ex" data-i="${i}" title="Retirer l'exercice" aria-label="Retirer l'exercice">${icon("trash")}</button>
      </div>
      </div></div><!-- /live-ex-body -->
    </div>`;
  });
  elLiveExercises.innerHTML = ssAssemble(cartes);

  /* Accordéon : ouvrir un exercice replie les autres (point 3) */
  elLiveExercises.querySelectorAll(".live-ex-head").forEach(head =>
    head.addEventListener("click", () => {
      const i = parseInt(head.dataset.toggle, 10);
      expandedIndex = (expandedIndex === i) ? -1 : i;   // re-tap = tout replier
      renderLiveExercises();
    }));

  elLiveExercises.querySelectorAll(".validate-set").forEach(btn =>
    btn.addEventListener("click", () => validateSet(parseInt(btn.dataset.i, 10))));
  elLiveExercises.querySelectorAll(".set-current, .go-next").forEach(btn =>
    btn.addEventListener("click", e => {
      e.stopPropagation();                       // ne pas replier via l'en-tête
      setCurrentExercise(parseInt(btn.dataset.i, 10));
    }));
  elLiveExercises.querySelectorAll(".remove-ex").forEach(btn =>
    btn.addEventListener("click", () => removeExercise(parseInt(btn.dataset.i, 10))));
  elLiveExercises.querySelectorAll(".swap-ex").forEach(btn =>
    btn.addEventListener("click", () => swapExercise(parseInt(btn.dataset.i, 10))));
  elLiveExercises.querySelectorAll(".ex-fiche").forEach(btn =>
    btn.addEventListener("click", () => openExercise(btn.dataset.exid)));
  elLiveExercises.querySelectorAll(".ss-break").forEach(btn =>
    btn.addEventListener("click", () => ssBreak(btn.dataset.ss)));
  elLiveExercises.querySelectorAll(".ss-memo").forEach(btn =>
    btn.addEventListener("click", () =>
      ssIsRemembered(btn.dataset.ss) ? ssForget(btn.dataset.ss) : ssRemember(btn.dataset.ss)));

  /* Mode appairage : les cartes deviennent des cibles de sélection.
     On capture le clic AVANT l'accordéon pour ne pas déplier au passage. */
  if (ssPicking) {
    elLiveExercises.classList.add("ss-picking");
    elLiveExercises.querySelectorAll(".live-ex").forEach(carte => {
      const i = parseInt(carte.dataset.i, 10);
      if (ssPickFirst === i) carte.classList.add("ss-sel");
      carte.addEventListener("click", e => {
        e.preventDefault(); e.stopPropagation();
        ssPickTap(i);
      }, true);
    });
  } else {
    elLiveExercises.classList.remove("ss-picking");
  }

  /* Série validée : un tap l'ouvre en édition (B2) */
  elLiveExercises.querySelectorAll(".set-row").forEach(tr => {
    const open = () => {
      editingSet = { i: +tr.dataset.i, j: +tr.dataset.j };
      renderLiveExercises();
      const f = document.getElementById("ed-poids");
      if (f) f.focus();
    };
    tr.addEventListener("click", open);
    tr.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); open(); } });
  });
  elLiveExercises.querySelectorAll(".set-edit-cancel").forEach(b =>
    b.addEventListener("click", () => { editingSet = null; renderLiveExercises(); }));
  elLiveExercises.querySelectorAll(".set-edit-save").forEach(b =>
    b.addEventListener("click", () => saveSetEdit(+b.dataset.i, +b.dataset.j)));
  elLiveExercises.querySelectorAll(".set-unvalidate").forEach(b =>
    b.addEventListener("click", () => unvalidateSet(+b.dataset.i, +b.dataset.j)));

  updateProgress();
}

/* Modifier une série déjà validée : poids et reps.
   Le volume, les stats et les records sont recalculés depuis l'historique,
   donc corriger la série suffit — rien n'est stocké en double. */
function saveSetEdit(i, j) {
  const ex = live.exercises[i];
  const set = ex && ex.sets[j];
  if (!set) return;
  const reps = parseInt(document.getElementById("ed-reps").value, 10);
  const poidsRaw = document.getElementById("ed-poids").value;
  if (!reps || reps < 1) { document.getElementById("ed-reps").focus(); return; }
  set.reps = reps;
  set.poids = poidsRaw === "" ? null : parseFloat(poidsRaw);
  set.editedAt = Date.now();
  rememberSet(ex.exId, j, set.poids, set.reps);   // la mémoire des charges suit
  editingSet = null;
  saveLive();
  renderLiveExercises();
  tick();
}

/* Dé-valider : la série disparaît (erreur de saisie, série non faite). */
function unvalidateSet(i, j) {
  const ex = live.exercises[i];
  if (!ex || !ex.sets[j]) return;
  if (!confirm(`Dé-valider la série ${j + 1} de « ${ex.nom} » ? Elle sera retirée de la séance.`)) return;
  ex.sets.splice(j, 1);
  // le repos en cours pointait peut-être sur cette série
  if (rest && rest.setRef.exIndex === i && rest.setRef.setIndex >= j) {
    rest = null;
    restMinimized = false;
    elRestOverlay.classList.add("hidden");
  }
  // la mémoire des charges se recale sur les séries restantes
  ex.sets.forEach((s, k) => rememberSet(ex.exId, k, s.poids, s.reps));
  editingSet = null;
  saveLive();
  renderLiveExercises();
  tick();
}

function setCurrentExercise(i) {
  const now = Date.now();
  const prev = live.exercises[live.currentIndex];
  if (prev && prev.startedAt && !prev.endedAt) prev.endedAt = now;
  live.currentIndex = i;
  const ex = live.exercises[i];
  if (!ex.startedAt) ex.startedAt = now;
  else ex.endedAt = null; // on y revient : le chrono repart
  expandedIndex = i;      // l'exercice précédent se replie tout seul (point 3)
  saveLive();
  renderLiveExercises();
}

function removeExercise(i) {
  const ex = live.exercises[i];
  if (ex.sets.length && !confirm(`Retirer « ${ex.nom} » et ses ${ex.sets.length} série(s) enregistrée(s) ?`)) return;
  live.exercises.splice(i, 1);
  if (live.currentIndex >= live.exercises.length) live.currentIndex = live.exercises.length - 1;
  expandedIndex = live.currentIndex;
  ssCleanup();
  saveLive();
  renderLiveExercises();
}

/* Remplacer un exercice par une alternative (même muscle, autre approche).
   Si des séries sont déjà validées, l'alternative est ajoutée à la suite
   pour ne pas fausser l'historique et les records. */
function swapExercise(i) {
  const cur = live.exercises[i];
  const ref = allExercisesForUI().find(e => e.id === cur.exId) || cur;
  const inSession = new Set(live.exercises.map(e => e.exId));
  const alt = findAlternatives(ref, 5).find(a => !inSession.has(a.id));
  if (!alt) { alert("Pas d'alternative disponible pour cet exercice."); return; }
  const fresh = newLiveExercise(alt, cur.target, null);
  if (cur.sets.length > 0) {
    if (!confirm(`Ajouter « ${alt.nom} » à la suite ? (les séries déjà validées de « ${cur.nom} » sont conservées)`)) return;
    live.exercises.splice(i + 1, 0, fresh);
  } else {
    live.exercises.splice(i, 1, fresh);
  }
  saveLive();
  renderLiveExercises();
}

/* ---------- Point 7 · SUPER SETS ----------
   Deux exercices exécutés en paire, sans repos entre eux : A série 1 →
   B série 1 → repos → A série 2 → B série 2 → repos…

   L'appartenance est portée par l'exercice lui-même (`ex.ss`, un
   identifiant de groupe) et NON par une liste d'indices. C'est
   volontaire : retirer, remplacer ou réordonner un exercice décale tous
   les indices, et une liste d'indices deviendrait fausse en silence.
   Une propriété portée par l'objet suit l'objet.

   Le repos du groupe est le PLUS LONG des deux : un super set ne se
   récupère pas plus vite que son exercice le plus exigeant. */
STORAGE_KEYS.supersets = "gymcoach.supersets";

function ssMembers(gid) {
  const out = [];
  if (!gid || !live) return out;
  live.exercises.forEach((e, i) => { if (e.ss === gid) out.push(i); });
  return out;
}

/* Repos partagé : le plus long des membres, pas leur moyenne. */
function ssRest(gid) {
  return ssMembers(gid).reduce((a, i) => Math.max(a, live.exercises[i].restSec || 0), 0);
}

/* Un groupe réduit à un seul membre n'est plus un super set. */
function ssCleanup() {
  const compte = {};
  live.exercises.forEach(e => { if (e.ss) compte[e.ss] = (compte[e.ss] || 0) + 1; });
  live.exercises.forEach(e => { if (e.ss && compte[e.ss] < 2) delete e.ss; });
}

/* Crée le groupe et rend les deux exercices ADJACENTS : « s'enchaînent
   immédiatement » doit être vrai dans la liste comme dans l'exécution. */
function ssCreate(i, j) {
  if (i === j) return;
  const gid = "ss" + Date.now().toString(36);
  const a = live.exercises[i], b = live.exercises[j];
  a.ss = b.ss = gid;
  if (j !== i + 1) {
    live.exercises.splice(j, 1);
    const pos = live.exercises.indexOf(a);
    live.exercises.splice(pos + 1, 0, b);
  }
  live.currentIndex = live.exercises.indexOf(a);
  expandedIndex = live.currentIndex;
  ssCleanup(); saveLive(); renderLiveExercises();
}

function ssBreak(gid) {
  live.exercises.forEach(e => { if (e.ss === gid) delete e.ss; });
  saveLive(); renderLiveExercises();
}

/* Mémorisation : la paire est retenue par identifiants d'exercice et
   réappliquée automatiquement aux séances suivantes. */
function ssRemembered() { return loadJSON(STORAGE_KEYS.supersets, []); }
function ssRemember(gid) {
  const ids = ssMembers(gid).map(i => live.exercises[i].exId);
  if (ids.length < 2) return;
  const all = ssRemembered().filter(p => !(p[0] === ids[0] && p[1] === ids[1]));
  all.push(ids);
  saveJSON(STORAGE_KEYS.supersets, all);
  renderLiveExercises();
}
function ssForget(gid) {
  const ids = ssMembers(gid).map(i => live.exercises[i].exId);
  saveJSON(STORAGE_KEYS.supersets, ssRemembered()
    .filter(p => !(p[0] === ids[0] && p[1] === ids[1])));
  renderLiveExercises();
}
function ssIsRemembered(gid) {
  const ids = ssMembers(gid).map(i => live.exercises[i].exId);
  return ids.length === 2 && ssRemembered().some(p => p[0] === ids[0] && p[1] === ids[1]);
}

/* Réapplique les paires mémorisées au démarrage d'une séance. */
function ssApplyRemembered() {
  if (!live) return;
  for (const [a, b] of ssRemembered()) {
    const i = live.exercises.findIndex(e => e.exId === a && !e.ss);
    if (i < 0) continue;
    const j = live.exercises.findIndex((e, k) => k !== i && e.exId === b && !e.ss);
    if (j < 0) continue;
    const gid = "ss" + Math.random().toString(36).slice(2, 8);
    live.exercises[i].ss = live.exercises[j].ss = gid;
    if (j !== i + 1) {
      const bx = live.exercises.splice(j, 1)[0];
      live.exercises.splice(live.exercises.indexOf(live.exercises[i]) + 1, 0, bx);
    }
  }
  ssCleanup();
}

/* ---------- Validation d'une série + repos ---------- */
function validateSet(i) {
  const ex = live.exercises[i];
  const reps = parseInt(document.getElementById("reps-" + i).value, 10);
  const poids = parseFloat(document.getElementById("poids-" + i).value);
  if (!reps || reps < 1) {
    document.getElementById("reps-" + i).focus();
    return;
  }
  const now = Date.now();

  // bascule d'exercice courant + chronos
  if (live.currentIndex !== i) {
    const prev = live.exercises[live.currentIndex];
    if (prev && prev.startedAt && !prev.endedAt) prev.endedAt = now;
    live.currentIndex = i;
  }
  expandedIndex = i;
  if (!ex.startedAt) ex.startedAt = now;
  ex.endedAt = null;

  const set = { poids: isNaN(poids) ? null : poids, reps, doneAt: now, restAfter: null };
  ex.sets.push(set);
  rememberSet(ex.exId, ex.sets.length - 1, set.poids, set.reps); // mémoire (exo, série N)
  saveLive();
  renderLiveExercises();

  /* SUPER SET : tant qu'on n'est pas sur le DERNIER exercice du groupe,
     aucun repos — on bascule directement sur le partenaire. Le repos ne
     s'ouvre qu'une fois la paire bouclée, et il dure le plus long des
     deux repos, pas celui de l'exercice qu'on vient de finir. */
  const membres = ex.ss ? ssMembers(ex.ss) : [];
  const rang = membres.indexOf(i);
  if (membres.length > 1 && rang > -1 && rang < membres.length - 1) {
    const suivant = membres[rang + 1];
    live.currentIndex = suivant;
    expandedIndex = suivant;
    const exSuiv = live.exercises[suivant];
    if (!exSuiv.startedAt) exSuiv.startedAt = now;
    exSuiv.endedAt = null;
    saveLive();
    renderLiveExercises();
    tick();
    return;                       // pas de minuteur : c'est tout l'intérêt
  }

  // lance le minuteur de repos
  const cible = ex.ss ? ssRest(ex.ss) : ex.restSec;
  rest = { setRef: { exIndex: i, setIndex: ex.sets.length - 1 }, exName: ex.nom, startAt: now, targetSec: cible, beeped: false };
  restMinimized = false;
  document.getElementById("rest-exercise-name").textContent = ex.ss
    ? "Super set bouclé — repos " + cible + " s"
    : ex.nom + " — série " + ex.sets.length + " terminée";
  elRestOverlay.classList.remove("hidden");
  /* Après un super set, la manche suivante repart sur le PREMIER membre. */
  if (membres.length > 1) { live.currentIndex = membres[0]; expandedIndex = membres[0]; renderLiveExercises(); }
  tick();
}

function endRest() {
  if (!rest) return;
  restMinimized = false;
  const actual = Math.round((nowRef() - rest.startAt) / 1000);
  const ex = live.exercises[rest.setRef.exIndex];
  if (ex && ex.sets[rest.setRef.setIndex]) ex.sets[rest.setRef.setIndex].restAfter = actual;
  rest = null;
  elRestOverlay.classList.add("hidden");
  saveLive();
  renderLiveExercises();
}

document.getElementById("rest-resume").addEventListener("click", endRest);
/* Réduire le repos : le compte continue dans la mini-barre, on peut
   naviguer librement (fiche, historique, nutrition…) sans le perdre. */
document.getElementById("rest-minimize").addEventListener("click", () => {
  restMinimized = true;
  elRestOverlay.classList.add("hidden");
  tick();
});
document.getElementById("rest-plus").addEventListener("click", () => { if (rest) { rest.targetSec += 15; rest.beeped = false; tick(); } });
document.getElementById("rest-minus").addEventListener("click", () => { if (rest) { rest.targetSec = Math.max(5, rest.targetSec - 15); tick(); } });

/* ---------- Sélecteur d'exercice ---------- */
let pickerCallback = null; // si défini, le picker renvoie l'exercice choisi

function openPicker(cb) {
  pickerCallback = (typeof cb === "function") ? cb : null;
  elPicker.classList.remove("hidden");
  // le guidage de séance libre n'a pas de sens en mode sélection simple
  document.querySelector(".picker-suggest").classList.toggle("hidden", !!pickerCallback);
  const input = document.getElementById("picker-search");
  input.value = "";
  renderPickerList("");
  if (!pickerCallback) renderSuggestions();
  input.focus();
}
function closePicker() { elPicker.classList.add("hidden"); }

function renderPickerList(query) {
  const q = normalize(query.trim());
  let list = allExercisesForUI().filter(ex => !q || exMatches(ex, q));
  // favoris en tête du sélecteur (G1)
  if (typeof favoritesFirst === "function") list = favoritesFirst(list);
  list = list.slice(0, 40);
  document.getElementById("picker-list").innerHTML = list.map(ex => `
    <button class="picker-item" data-exid="${esc(ex.id)}">
      <span>${typeof isFavorite === "function" && isFavorite(ex.id) ? '<span class="pick-fav">★</span> ' : ""}${esc(ex.nom)}</span>
      <span class="tag">${LABELS.groupes[ex.groupe]}</span>
    </button>`).join("") || `<p class="video-hint">Aucun exercice trouvé.</p>`;
  document.querySelectorAll(".picker-item").forEach(btn =>
    btn.addEventListener("click", () => {
      const ex = allExercisesForUI().find(e => e.id === btn.dataset.exid);
      if (!ex) return;
      if (pickerCallback) { const cb = pickerCallback; closePicker(); cb(ex); return; }
      if (!live) return;
      live.exercises.push(newLiveExercise(ex, null, getDefaultRest()));
      if (live.currentIndex === -1) live.currentIndex = 0;
      saveLive();
      renderLiveExercises();
      closePicker();
    }));
}

/* Séance libre guidée : à partir des muscles cochés, propose un
   enchaînement cohérent (polyarticulaires d'abord, isolation ensuite,
   gainage pour finir) adapté au niveau et au matériel du profil. */
const suggestState = new Set();

function buildSuggestions() {
  const profil = loadJSON(STORAGE_KEYS.profil, null) || {};
  const levels = { debutant: ["debutant"], intermediaire: ["debutant", "intermediaire"],
                   avance: ["debutant", "intermediaire", "avance"] }[profil.niveau] || null;
  const equip = { salle: null, halteres: ["halteres", "poids-du-corps"],
                  corps: ["poids-du-corps"] }[profil.materiel] ?? null;
  const ok = e => (!levels || levels.includes(e.niveau)) && (!equip || equip.includes(e.materiel));
  // favoris d'abord, puis les machines : dispo garantie, apprentissage sûr,
  // et ça varie des barres déjà faites
  const fav = (typeof getFavorites === "function") ? new Set(getFavorites()) : new Set();
  const rank = e => (fav.has(e.id) ? 2 : 0) + (e.materiel === "machine" ? 1 : 0);
  const pool = allExercisesForUI().filter(ok).sort((a, b) => rank(b) - rank(a));
  // la liste reste stable même après ajout : les items ajoutés s'affichent cochés
  const pick = (g, type, taken) =>
    pool.find(e => e.groupe === g && e.type === type && !taken.has(e.id));

  const taken = new Set();
  const out = [];
  for (const g of suggestState) {                     // 1. polyarticulaires
    const e = pick(g, "poly", taken);
    if (e) { taken.add(e.id); out.push(e); }
  }
  for (const g of suggestState) {                     // 2. isolation
    const e = pick(g, "iso", taken);
    if (e) { taken.add(e.id); out.push(e); }
  }
  if (suggestState.size && !suggestState.has("abdos")) {  // 3. gainage final
    const e = pick("abdos", "iso", taken) || pick("abdos", "poly", taken);
    if (e) out.push(e);
  }
  return out.slice(0, 8);
}

function renderSuggestions() {
  const zone = document.getElementById("suggest-list");
  if (suggestState.size === 0) { zone.innerHTML = ""; return; }
  const sugg = buildSuggestions();
  const inSession = new Set((live?.exercises || []).map(e => e.exId));
  zone.innerHTML = `
    <p class="video-hint">Enchaînement proposé (échauffe-toi 5-10 min avant) — chaque exercice s'ajoute d'un tap :</p>
    ${sugg.map((e, i) => `
      <button class="picker-item suggest-item ${inSession.has(e.id) ? "suggest-added" : ""}" data-exid="${esc(e.id)}">
        <span>${i + 1}. ${esc(e.nom)}</span>
        <span class="tag">${inSession.has(e.id) ? "✓ Ajouté" : e.type === "poly" ? "Polyarticulaire" : "Isolation"}</span>
      </button>`).join("")}`;
  zone.querySelectorAll(".suggest-item").forEach(b =>
    b.addEventListener("click", () => {
      const ex = allExercisesForUI().find(e => e.id === b.dataset.exid);
      if (!ex || !live) return;
      if (live.exercises.some(e => e.exId === ex.id)) {   // déjà là : on le retire
        live.exercises = live.exercises.filter(e => e.exId !== ex.id);
      } else {
        live.exercises.push(newLiveExercise(ex, null, null));
      }
      if (live.currentIndex === -1 && live.exercises.length) live.currentIndex = 0;
      if (live.currentIndex >= live.exercises.length) live.currentIndex = live.exercises.length - 1;
      saveLive();
      renderLiveExercises();
      renderSuggestions();
    }));
}

document.querySelectorAll("#suggest-groups .chip").forEach(chip =>
  chip.addEventListener("click", () => {
    const g = chip.dataset.g;
    if (suggestState.has(g)) { suggestState.delete(g); chip.classList.remove("active"); }
    else { suggestState.add(g); chip.classList.add("active"); }
    renderSuggestions();
  }));

document.getElementById("picker-search").addEventListener("input", e => renderPickerList(e.target.value));
document.getElementById("picker-close").addEventListener("click", closePicker);
document.getElementById("picker-backdrop").addEventListener("click", closePicker);
document.getElementById("live-add-ex").addEventListener("click", openPicker);

/* ---------- Point 7 · appairage du super set ---------- */
let ssPicking = false, ssPickFirst = null;

function ssPickStart() {
  if (!live || live.exercises.length < 2) {
    alert("Ajoute au moins deux exercices à ta séance pour créer un super set.");
    return;
  }
  ssPicking = true; ssPickFirst = null;
  ssPickBar(true, "Touche le <strong>premier</strong> exercice du super set.");
  renderLiveExercises();
}

function ssPickCancel() {
  ssPicking = false; ssPickFirst = null;
  ssPickBar(false);
  renderLiveExercises();
}

function ssPickBar(on, msg) {
  const bar = document.getElementById("ss-pick-bar");
  if (!bar) return;
  bar.classList.toggle("hidden", !on);
  if (msg) document.getElementById("ss-pick-msg").innerHTML = msg;
}

function ssPickTap(i) {
  if (!ssPicking) return;
  if (live.exercises[i].ss) {          // déjà dans un groupe : on refuse
    ssPickBar(true, "Cet exercice fait déjà partie d'un super set. Dissocie-le d'abord.");
    return;
  }
  if (ssPickFirst == null) {
    ssPickFirst = i;
    ssPickBar(true, "Premier : <strong>" + esc(live.exercises[i].nom)
      + "</strong>. Touche maintenant le <strong>second</strong>.");
    renderLiveExercises();
    return;
  }
  if (i === ssPickFirst) { ssPickFirst = null; ssPickStart(); return; }  // dé-sélection
  const a = ssPickFirst;
  ssPicking = false; ssPickFirst = null;
  ssPickBar(false);
  ssCreate(a, i);
}

document.getElementById("live-superset").addEventListener("click", () =>
  ssPicking ? ssPickCancel() : ssPickStart());
document.getElementById("ss-pick-cancel").addEventListener("click", ssPickCancel);

/* ---------- Fin de séance ---------- */
document.getElementById("live-pause").addEventListener("click", pauseSession);
document.getElementById("pause-resume").addEventListener("click", resumeSession);
/* Mode compact : chrono seul + cartes réduites à l'essentiel
   (série / reps / poids / repos). Mémorisé. */
document.getElementById("live-compact-toggle").addEventListener("click", () => {
  const on = !elLive.classList.contains("live-compact");
  elLive.classList.toggle("live-compact", on);
  localStorage.setItem("gymcoach.liveCompact", on ? "1" : "0");
});
/* Bascule manuelle grand/compact — l'automatique au scroll reprend ensuite */
document.getElementById("live-hdr-toggle").addEventListener("click", () => toggleHeaderManual(true));
document.getElementById("hdr-pill-open").addEventListener("click", () => toggleHeaderManual(false));
document.getElementById("hdr-pill-finish").addEventListener("click", () => finishSession());
document.getElementById("live-finish").addEventListener("click", finishSession);
document.getElementById("live-abort").addEventListener("click", () => {
  if (!confirm("Abandonner la séance ? Rien ne sera enregistré.")) return;
  if (rest) { rest = null; elRestOverlay.classList.add("hidden"); }
  if (liveTimer) clearInterval(liveTimer);
  clearLive();
  showSetup();
});

function finishSession() {
  if (live && live.pausedAt) resumeSession(); // solde la pause avant de figer les temps
  if (rest) endRest();
  const now = Date.now();
  const cur = live.exercises[live.currentIndex];
  if (cur && cur.startedAt && !cur.endedAt) cur.endedAt = now;
  live.endedAt = now;
  if (liveTimer) clearInterval(liveTimer);

  const program = loadJSON(STORAGE_KEYS.program, null);
  const record = {
    id: "seance-" + now,
    nom: live.nom,
    date: now,
    dureeMs: now - live.startedAt - (live.pauseMs || 0),
    reposMs: totalRestMs(),
    statut: "Terminée",
    /* Toute séance — y compris libre — est rattachée au programme actif :
       elle compte dans l'objectif hebdo, l'historique, le calendrier
       et les stats, et peut devenir une séance récurrente (D2). */
    programId: program ? (program.id || null) : null,
    programNom: program ? (program.nom || program.objectifLabel || null) : null,
    libre: !/^Séance \d+/.test(live.nom),
    objectifLabel: program ? program.objectifLabel : null,
    rpe: null,   // renseigné depuis l'écran de résumé
    notes: "",
    exercises: live.exercises
      .filter(ex => ex.sets.length > 0)
      .map(ex => ({
        exId: ex.exId, nom: ex.nom, groupe: ex.groupe,
        dureeMs: exerciseElapsed(ex),
        sets: ex.sets
      }))
  };
  record.nbSeries = record.exercises.reduce((n, e) => n + e.sets.length, 0);
  record.volume = record.exercises.reduce((v, e) =>
    v + e.sets.reduce((s, x) => s + (x.poids || 0) * x.reps, 0), 0);

  if (record.nbSeries === 0) {
    if (!confirm("Aucune série validée : terminer sans rien enregistrer ?")) {
      live.endedAt = null;
      if (cur) cur.endedAt = null;
      liveTimer = setInterval(tick, 250);
      return;
    }
    clearLive();
    showSetup();
    return;
  }

  const history = loadJSON(STORAGE_KEYS.history, []);
  history.unshift(record);
  saveJSON(STORAGE_KEYS.history, history);
  clearLive();
  showSummary(record);
}

function showSummary(r) {
  elLive.classList.add("hidden");
  elSetup.classList.add("hidden");
  elSummary.classList.remove("hidden");
  elSummary.innerHTML = `
    <div class="card summary-card">
      <p class="kicker">Séance terminée</p>
      <h2>Bien joué ${icon("party")}</h2>
      <p class="program-meta">${esc(r.nom)} · ${new Date(r.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
      <div class="live-chronos summary-stats">
        <div class="chrono-block"><span class="chrono-label">Durée totale</span><span class="chrono-value">${fmtClock(r.dureeMs)}</span></div>
        <div class="chrono-block"><span class="chrono-label">Repos cumulé</span><span class="chrono-value">${fmtClock(r.reposMs)}</span></div>
        <div class="chrono-block"><span class="chrono-label">Séries</span><span class="chrono-value">${r.nbSeries}</span></div>
        <div class="chrono-block"><span class="chrono-label">Volume total</span><span class="chrono-value">${Math.round(r.volume)} kg</span></div>
      </div>
      ${r.libre && r.programNom ? `
      <div class="adjust-card">
        <p>Cette séance libre est déjà comptée dans <strong>${esc(r.programNom)}</strong>
          (objectif de la semaine, calendrier, statistiques). Tu veux la refaire régulièrement ?</p>
        <button class="btn btn-primary btn-sm" id="add-to-program">+ L'ajouter comme séance du programme</button>
        <p class="feedback" id="add-to-program-feedback"></p>
      </div>` : ""}

      <!-- Bilan : difficulté -> proposition d'ajustement du programme -->
      <div class="rpe-block">
        <p class="chrono-label">La séance était…</p>
        <div class="diff-row" id="summary-diff">
          <button type="button" class="btn btn-ghost diff-btn" data-d="facile">Trop facile</button>
          <button type="button" class="btn btn-ghost diff-btn" data-d="correcte">Correcte</button>
          <button type="button" class="btn btn-ghost diff-btn" data-d="dure">Trop dure</button>
        </div>
        <div id="summary-adjust"></div>
        <p class="chrono-label">Ressenti de la séance (RPE)</p>
        <div class="rpe-row" id="summary-rpe">
          ${Array.from({ length: 10 }, (_, i) => i + 1).map(n =>
            `<button type="button" class="rpe-chip" data-rpe="${n}">${n}</button>`).join("")}
        </div>
        <textarea id="summary-notes" rows="2" placeholder="Notes libres (sensations, douleurs, contexte…)"></textarea>
        <p class="feedback" id="summary-feel-feedback"></p>
      </div>
      ${renderSessionDetail(r)}
      <button class="btn btn-primary btn-lg" id="summary-back">↩ Retour aux séances</button>
    </div>`;

  /* Séance libre -> séance récurrente du programme actif (D2) */
  const addBtn = document.getElementById("add-to-program");
  if (addBtn) addBtn.addEventListener("click", () => {
    const pr = loadJSON(STORAGE_KEYS.program, null);
    if (!pr) return;
    const day = {
      numero: pr.days.length + 1,
      titre: r.nom,
      focus: [...new Set(r.exercises.map(e => LABELS.groupes[e.groupe]))].slice(0, 4).join(" · "),
      exercices: r.exercises.map(ex => {
        const ref = allExercisesForUI().find(e => e.id === ex.exId) ||
          { id: ex.exId, nom: ex.nom, groupe: ex.groupe, materiel: "halteres", niveau: "intermediaire", type: "iso" };
        const reps = ex.sets.map(s => s.reps);
        const lo = Math.min(...reps), hi = Math.max(...reps);
        return {
          exercice: { id: ref.id, nom: ref.nom, groupe: ref.groupe, materiel: ref.materiel,
                      niveau: ref.niveau, type: ref.type, videoQuery: ref.videoQuery },
          series: ex.sets.length,
          reps: lo === hi ? String(lo) : `${lo}-${hi}`,
          repos: (ref.type ? smartRest(ref) : getDefaultRest()) + " s",
          note: "", superset: false, prioritaire: false
        };
      })
    };
    pr.days.push(day);
    pr.jours = pr.days.length;
    if (typeof setActiveProgram === "function") setActiveProgram(pr);
    else saveJSON(STORAGE_KEYS.program, pr);
    if (typeof renderProgram === "function") renderProgram(pr);
    if (typeof renderProgramsPanel === "function") renderProgramsPanel();
    addBtn.disabled = true;
    document.getElementById("add-to-program-feedback").textContent =
      `✓ Ajoutée à « ${pr.nom || "ton programme"} » comme séance ${day.numero}.`;
  });

  let summaryRpe = null;
  let summaryDiff = null;
  const saveFeel = () => {
    const history = loadJSON(STORAGE_KEYS.history, []);
    const rec = history.find(s => s.id === r.id);
    if (!rec) return;
    rec.rpe = summaryRpe;
    rec.difficulte = summaryDiff;
    rec.notes = document.getElementById("summary-notes").value.trim();
    saveJSON(STORAGE_KEYS.history, history);
  };

  /* Difficulté -> proposition d'ajustement appliquée aux prochaines séances */
  elSummary.querySelectorAll(".diff-btn").forEach(b =>
    b.addEventListener("click", () => {
      summaryDiff = b.dataset.d;
      elSummary.querySelectorAll(".diff-btn").forEach(x =>
        x.classList.toggle("btn-primary", x === b));
      saveFeel();
      const zone = document.getElementById("summary-adjust");
      const program = loadJSON(STORAGE_KEYS.program, null);
      if (!program || summaryDiff === "correcte") {
        zone.innerHTML = summaryDiff === "correcte"
          ? '<p class="video-hint">Parfait, on ne change rien : la difficulté est bien calibrée. 👌</p>' : "";
        return;
      }
      const dure = summaryDiff === "dure";
      zone.innerHTML = `
        <div class="adjust-card">
          <p>${dure
            ? "Séance trop dure ? Je te propose de <strong>retirer 1 série</strong> sur les exercices polyarticulaires du programme, et de baisser tes charges d'environ 5 % la prochaine fois."
            : "Trop facile ? Surcharge progressive : je te propose d'<strong>ajouter 1 série</strong> sur les polyarticulaires — et pense à monter les charges de ~2,5 kg quand toutes les reps passent proprement."}</p>
          <button class="btn btn-primary btn-sm" id="apply-adjust">Appliquer au programme</button>
          <p class="feedback" id="adjust-feedback"></p>
        </div>`;
      document.getElementById("apply-adjust").addEventListener("click", () => {
        const pr = loadJSON(STORAGE_KEYS.program, null);
        if (!pr) return;
        let touched = 0;
        for (const day of pr.days)
          for (const l of day.exercices)
            if (l.exercice.type === "poly") {
              const next = l.series + (dure ? -1 : 1);
              if (next >= 2 && next <= 5) { l.series = next; touched++; }
            }
        saveJSON(STORAGE_KEYS.program, pr);
        document.getElementById("adjust-feedback").textContent =
          `✓ Programme ajusté : ${touched} exercice(s) ${dure ? "allégé(s)" : "renforcé(s)"} d'une série.`;
        if (typeof renderProgram === "function") renderProgram(pr);
      });
    }));
  elSummary.querySelectorAll(".rpe-chip").forEach(c =>
    c.addEventListener("click", () => {
      const v = parseInt(c.dataset.rpe, 10);
      summaryRpe = (summaryRpe === v) ? null : v;
      elSummary.querySelectorAll(".rpe-chip").forEach(x =>
        x.classList.toggle("active", parseInt(x.dataset.rpe, 10) === summaryRpe));
      saveFeel();
      document.getElementById("summary-feel-feedback").textContent = summaryRpe ? "Ressenti enregistré ✓" : "";
    }));
  document.getElementById("summary-notes").addEventListener("change", () => {
    saveFeel();
    document.getElementById("summary-feel-feedback").textContent = "Notes enregistrées ✓";
  });
  document.getElementById("summary-back").addEventListener("click", showSetup);
}

function renderSessionDetail(r) {
  return `<div class="session-detail">${r.exercises.map(ex => `
    <div class="session-ex">
      <h4><span class="ico">${GROUP_ICONS[ex.groupe] || "🏋️"} </span>${esc(ex.nom)} <span class="ex-chrono">${fmtClock(ex.dureeMs)}</span></h4>
      <table class="sets-table">
        <thead><tr><th>Série</th><th>Poids</th><th>Reps</th><th>Repos pris</th></tr></thead>
        <tbody>${ex.sets.map((s, j) => `
          <tr><td>${j + 1}</td><td>${s.poids != null ? s.poids + " kg" : "—"}</td><td>${s.reps}</td>
          <td>${s.restAfter != null ? fmtSec(s.restAfter) : "—"}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>`).join("")}</div>`;
}

/* ---------- Historique ---------- */
function renderHistory() {
  const container = document.getElementById("seance-history");
  const history = loadJSON(STORAGE_KEYS.history, []);
  if (history.length === 0) { container.innerHTML = ""; return; }
  /* Aperçu des 3 dernières séances ; la gestion complète vit dans « Suivi » */
  container.innerHTML = `
    <h2>${icon("book")} Dernières séances</h2>
    ${history.slice(0, 3).map(r => `
      <div class="card history-item" data-id="${esc(r.id)}">
        <div class="history-head">
          <div>
            <h3>${esc(r.nom)}</h3>
            <p class="day-focus">${new Date(r.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              · ${fmtClock(r.dureeMs)} · ${r.nbSeries} séries · ${Math.round(r.volume)} kg de volume · repos ${fmtClock(r.reposMs)}</p>
          </div>
          <div class="history-actions">
            <button class="btn btn-ghost btn-sm toggle-detail">Détails</button>
            <button class="btn btn-danger-ghost btn-sm delete-session" title="Supprimer" aria-label="Supprimer la séance">${icon("trash")}</button>
          </div>
        </div>
        <div class="history-detail hidden">${renderSessionDetail(r)}</div>
      </div>`).join("")}
    <button class="btn btn-ghost" id="history-see-all">Tout voir dans « Suivi » (${history.length})</button>`;

  document.getElementById("history-see-all").addEventListener("click", () => {
    activateView("suivi");
    document.querySelector('.seg[data-panel="seances"]').click();
  });

  container.querySelectorAll(".toggle-detail").forEach(btn =>
    btn.addEventListener("click", () => {
      const d = btn.closest(".history-item").querySelector(".history-detail");
      d.classList.toggle("hidden");
      btn.textContent = d.classList.contains("hidden") ? "Détails" : "Masquer";
    }));
  container.querySelectorAll(".delete-session").forEach(btn =>
    btn.addEventListener("click", () => {
      const id = btn.closest(".history-item").dataset.id;
      if (!confirm("Supprimer cette séance de l'historique ?")) return;
      saveJSON(STORAGE_KEYS.history, loadJSON(STORAGE_KEYS.history, []).filter(r => r.id !== id));
      renderHistory();
    }));
}

/* ---------- Écran d'accueil séance ---------- */
function showSetup() {
  elLive.classList.add("hidden");
  elSummary.classList.add("hidden");
  elSetup.classList.remove("hidden");
  defaultRestInput.value = getDefaultRest();
  renderProgramDayButtons();
  renderHistory();
}

/* Rafraîchit l'écran séance à chaque visite de l'onglet
   (le programme a pu être généré ou modifié entre-temps) */
document.querySelectorAll('.tab[data-view="seance"]').forEach(tab =>
  tab.addEventListener("click", () => {
    if (live) showLive();
    else showSetup();
  }));

/* ---------- Initialisation ---------- */
(function initWorkout() {
  // dashoffset initial de l'anneau
  const ring = document.getElementById("rest-ring");
  if (ring) ring.style.strokeDasharray = RING_CIRC;

  const saved = loadJSON(STORAGE_KEYS.live, null);
  if (saved && saved.startedAt && !saved.endedAt) {
    live = saved;
    // reprendre la séance interrompue (rafraîchissement de page)
    activateView("seance");
    showLive();
  } else {
    showSetup();
  }
})();
