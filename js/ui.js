/* =========================================================
   GymCoach — Socle d'interface partagé
   - Disclosure progressive : résumé court visible + « Détails »
     qui explique ce que c'est ET à quoi ça sert. État mémorisé.
   - Favoris d'exercices (remontés en tête des sélecteurs)
   - Statistiques par exercice + graphique d'évolution
   - Typage des séances (code couleur du calendrier)
   - Configuration de l'accueil (cartes affichées + ordre)
   Chargé après app.js : loadJSON/saveJSON/esc sont disponibles.
   ========================================================= */

STORAGE_KEYS.disclosure = "gymcoach.disclosure";   // { cléBloc: true/false }
STORAGE_KEYS.favorites = "gymcoach.favorites";     // [exId]
STORAGE_KEYS.homeCards = "gymcoach.homeCards";     // [{ key, on }]
STORAGE_KEYS.liveHeaderMin = "gymcoach.liveHeaderMin";

/* ==================== DISCLOSURE PROGRESSIVE ==================== */
function discState() { return loadJSON(STORAGE_KEYS.disclosure, {}); }
function discOpen(key, dflt = false) {
  const v = discState()[key];
  return v === undefined ? dflt : v;
}
function discSet(key, open) {
  const m = discState();
  m[key] = open;
  saveJSON(STORAGE_KEYS.disclosure, m);
}

/* ==================== MESSAGE ÉPHÉMÈRE ====================
   Pour ce que l'app doit dire sans interrompre : une séance close
   toute seule, un import terminé. `role="status"` le fait annoncer
   par les lecteurs d'écran sans voler le focus. */
let toastTimer = null;
function toast(msg, ms = 6000) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("on"), ms);
}

/* ==================== BADGE DE VARIATION ====================
   Un triangle de sens et un pourcentage : hausse, baisse, ou stable.

   DEUX CHOSES QUE CE BADGE NE CONFOND PAS.

   1. Le SENS et le JUGEMENT. Le triangle dit ce qui s'est passé, la
      couleur dit si c'est bien — et « plus » n'est pas toujours
      « mieux ». Prendre du poids est un progrès en prise de masse et
      un recul en sèche. L'appelant le sait, le badge non : d'où
      l'option `bon`, qui peut valoir "haut", "bas" ou "neutre". En
      neutre, le triangle indique toujours la direction mais la
      couleur reste cendre : un fait sans verdict.

   2. Le ZÉRO et l'ABSENCE. Sans point de comparaison, ou quand le
      précédent vaut zéro, la variation en pourcentage n'existe pas
      — une division par zéro donnerait « +Infini % ». Le badge ne
      s'affiche alors PAS. Un premier mois n'a pas de mois précédent,
      et le dire par un blanc est plus honnête qu'un faux chiffre. */
const DELTA_TRIANGLES = {
  up: '<path d="M6 3.5 L10 8.5 L2 8.5 Z"/>',
  down: '<path d="M6 8.5 L2 3.5 L10 3.5 Z"/>',
  flat: '<path d="M9 6 L4 9.5 L4 2.5 Z"/>'
};

function deltaBadge(actuel, precedent, opts = {}) {
  const { bon = "haut", seuil = 2, contexte = "" } = opts;
  const a = Number(actuel), p = Number(precedent);
  if (!Number.isFinite(a) || !Number.isFinite(p) || p === 0) return "";

  const pct = ((a - p) / Math.abs(p)) * 100;
  const abs = Math.abs(pct);
  const stable = abs < seuil;
  const hausse = pct > 0;

  /* Sous le seuil, on ne colore pas : une variation de 1 % sur un
     volume mensuel est du bruit, pas une tendance. */
  let ton = "neutre";
  if (!stable && bon !== "neutre") ton = (hausse === (bon === "haut")) ? "bon" : "mauvais";

  const sens = stable ? "flat" : (hausse ? "up" : "down");
  const chiffre = abs.toLocaleString("fr-FR", { maximumFractionDigits: 1 });
  const mot = stable ? "stable" : (hausse ? "en hausse de" : "en baisse de");
  const lu = stable
    ? `Stable${contexte ? " " + contexte : ""}`
    : `${mot} ${chiffre} %${contexte ? " " + contexte : ""}`;

  return `<span class="delta delta-${ton}" role="img" aria-label="${esc(lu)}">
    <svg class="delta-tri" viewBox="0 0 12 12" aria-hidden="true" focusable="false">${DELTA_TRIANGLES[sens]}</svg>
    <span class="delta-n">${chiffre} %</span>
  </span>`;
}

/* Bloc dépliable standard.
   summary : ce qu'on voit toujours (court, l'essentiel)
   detail  : ce qui se déplie — DOIT expliquer quoi/pourquoi (`what`)
   what    : phrase d'explication ajoutée en tête du détail */
function disclosure(key, { summary, detail, what = "", label = "Détails", dflt = false }) {
  const open = discOpen(key, dflt);
  return `<div class="disc${open ? " disc-open" : ""}" data-disc="${esc(key)}">
    <button type="button" class="disc-toggle" aria-expanded="${open}">
      <span class="disc-sum">${summary}</span>
      <span class="disc-more">${esc(label)}<span class="disc-chev" aria-hidden="true">⌄</span></span>
    </button>
    <div class="disc-body">
      ${what ? `<p class="disc-what">${what}</p>` : ""}
      ${detail}
    </div>
  </div>`;
}

/* Un seul écouteur délégué : les re-rendus ne perdent jamais le binding */
document.addEventListener("click", e => {
  const btn = e.target.closest(".disc-toggle");
  if (!btn) return;
  const box = btn.closest(".disc");
  const open = !box.classList.contains("disc-open");
  box.classList.toggle("disc-open", open);
  btn.setAttribute("aria-expanded", String(open));
  if (box.dataset.disc) discSet(box.dataset.disc, open);
});

/* ==================== SOUS-FENÊTRE (bottom sheet / panneau) ==========
   Mobile : feuille qui monte sur ~70 % de l'écran, glissable (haut =
   agrandir, bas = réduire puis fermer). Desktop : panneau latéral.
   Dans les deux cas elle ne bloque rien : pas de fond opaque, pas de
   verrou de scroll, la séance et le chrono continuent derrière.
   ==================================================================== */
const SHEET_SNAPS = { peek: 0.44, default: 0.7, full: 0.94 }; // fraction de la hauteur d'écran
let sheetSnap = "default";

function sheetEl() { return document.getElementById("modal"); }
function sheetIsMobile() { return window.matchMedia("(max-width: 760px)").matches; }

function applySheetSnap(snap) {
  sheetSnap = snap;
  const box = document.getElementById("sheet-box");
  if (!box) return;
  box.style.transition = "";                    // reprend la transition CSS
  if (sheetIsMobile()) box.style.height = Math.round(SHEET_SNAPS[snap] * 100) + "vh";
  else box.style.height = "";                   // desktop : hauteur pilotée par le CSS
  box.style.transform = "";
}

function openSheet() {
  const el = sheetEl();
  if (!el) return;
  el.classList.remove("hidden");
  applySheetSnap("default");
  requestAnimationFrame(() => el.classList.add("sheet-in"));
  const scroll = el.querySelector(".sheet-scroll");
  if (scroll) scroll.scrollTop = 0;
}

function closeSheet() {
  const el = sheetEl();
  if (!el) return;
  el.classList.remove("sheet-in");
  const box = document.getElementById("sheet-box");
  if (box) { box.style.transition = ""; box.style.transform = ""; }
  // laisse l'animation de sortie se jouer avant de masquer
  setTimeout(() => { if (!el.classList.contains("sheet-in")) el.classList.add("hidden"); }, 240);
}

/* Glissement : la poignée (et l'en-tête) déplacent la feuille en direct,
   puis on aimante vers le palier le plus proche — ou on ferme. */
(function initSheetDrag() {
  const grip = document.getElementById("sheet-grip");
  const box = document.getElementById("sheet-box");
  if (!grip || !box) return;

  let startY = 0, startH = 0, dragging = false, moved = 0;

  const onDown = e => {
    if (!sheetIsMobile()) return;
    dragging = true; moved = 0;
    startY = (e.touches ? e.touches[0].clientY : e.clientY);
    startH = box.getBoundingClientRect().height;
    box.style.transition = "none";
    grip.setPointerCapture && e.pointerId != null && grip.setPointerCapture(e.pointerId);
  };
  const onMove = e => {
    if (!dragging) return;
    const y = (e.touches ? e.touches[0].clientY : e.clientY);
    moved = y - startY;
    const h = Math.max(80, Math.min(window.innerHeight * SHEET_SNAPS.full, startH - moved));
    box.style.height = h + "px";
    if (e.cancelable) e.preventDefault();
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    box.style.transition = "";
    const frac = box.getBoundingClientRect().height / window.innerHeight;
    // glissé vers le bas sous le palier bas : on ferme
    if (frac < SHEET_SNAPS.peek * 0.8) { closeSheet(); return; }
    // sinon on aimante au palier le plus proche
    const nearest = Object.keys(SHEET_SNAPS)
      .reduce((a, b) => Math.abs(SHEET_SNAPS[a] - frac) < Math.abs(SHEET_SNAPS[b] - frac) ? a : b);
    applySheetSnap(nearest);
  };

  grip.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove, { passive: false });
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  // clavier : ↑ agrandit, ↓ réduit puis ferme
  grip.addEventListener("keydown", e => {
    const order = ["peek", "default", "full"];
    const i = order.indexOf(sheetSnap);
    if (e.key === "ArrowUp" && i < 2) { applySheetSnap(order[i + 1]); e.preventDefault(); }
    if (e.key === "ArrowDown") { i > 0 ? applySheetSnap(order[i - 1]) : closeSheet(); e.preventDefault(); }
  });
  // un tap sur la poignée fait le tour des paliers
  grip.addEventListener("click", () => {
    if (Math.abs(moved) > 6) return;             // c'était un glissement, pas un tap
    applySheetSnap(sheetSnap === "full" ? "default" : "full");
  });
  window.addEventListener("resize", () => {
    if (!sheetEl().classList.contains("hidden")) applySheetSnap(sheetSnap);
  });
})();

/* ==================== FAVORIS ==================== */
function getFavorites() { return loadJSON(STORAGE_KEYS.favorites, []); }
function isFavorite(exId) { return getFavorites().includes(exId); }
function toggleFavorite(exId) {
  const list = getFavorites();
  const i = list.indexOf(exId);
  if (i >= 0) list.splice(i, 1); else list.push(exId);
  saveJSON(STORAGE_KEYS.favorites, list);
  return i < 0;
}
/* Tri stable qui remonte les favoris sans changer l'ordre relatif du reste */
function favoritesFirst(list) {
  const fav = new Set(getFavorites());
  return list.slice().sort((a, b) => (fav.has(b.id) ? 1 : 0) - (fav.has(a.id) ? 1 : 0));
}
function favButton(exId, cls = "") {
  const on = isFavorite(exId);
  return `<button type="button" class="fav-btn ${cls} ${on ? "fav-on" : ""}" data-fav="${esc(exId)}"
    aria-pressed="${on}" title="${on ? "Retirer des favoris" : "Ajouter aux favoris"}"
    aria-label="${on ? "Retirer des favoris" : "Ajouter aux favoris"}">${on ? "★" : "☆"}</button>`;
}

/* Écouteur délégué : marche partout (bibliothèque, fiche, sélecteur) */
document.addEventListener("click", e => {
  const btn = e.target.closest(".fav-btn");
  if (!btn) return;
  e.stopPropagation();          // ne pas ouvrir la fiche en cliquant l'étoile
  const on = toggleFavorite(btn.dataset.fav);
  btn.classList.toggle("fav-on", on);
  btn.textContent = on ? "★" : "☆";
  btn.setAttribute("aria-pressed", String(on));
  btn.title = on ? "Retirer des favoris" : "Ajouter aux favoris";
  if (typeof renderLibrary === "function" && libState.favOnly) renderLibrary();
});

/* ==================== STATISTIQUES PAR EXERCICE ==================== */
/* Tout est recalculé depuis l'historique : aucune stat stockée en double. */
function exerciseStats(exId) {
  const h = (typeof getHistory === "function" ? getHistory() : [])
    .slice().sort((a, b) => a.date - b.date);
  const out = { seances: 0, series: 0, reps: 0, volume: 0, best: null, points: [], parPoids: [] };
  const byWeight = new Map();   // poids -> { reps, sets, repsMax }
  for (const r of h) {
    let dayMax = null, seen = false;
    for (const ex of r.exercises || []) {
      if (ex.exId !== exId) continue;
      seen = true;
      for (const s of ex.sets) {
        out.series++;
        out.reps += s.reps;
        out.volume += (s.poids || 0) * s.reps;
        if (s.poids != null) {
          if (dayMax === null || s.poids > dayMax) dayMax = s.poids;
          if (!out.best || s.poids > out.best.poids ||
              (s.poids === out.best.poids && s.reps > out.best.reps))
            out.best = { poids: s.poids, reps: s.reps, date: r.date };
          // répartition des répétitions par palier de charge
          const w = byWeight.get(s.poids) || { poids: s.poids, reps: 0, sets: 0, repsMax: 0 };
          w.reps += s.reps; w.sets++; w.repsMax = Math.max(w.repsMax, s.reps);
          byWeight.set(s.poids, w);
        }
      }
    }
    if (seen) out.seances++;
    if (dayMax !== null) out.points.push({ date: r.date, poids: dayMax });
  }
  out.parPoids = [...byWeight.values()].sort((a, b) => b.poids - a.poids);
  // 1RM estimé (Epley) à partir du meilleur set : charge × (1 + reps/30)
  out.rm = out.best ? Math.round(out.best.poids * (1 + out.best.reps / 30)) : null;
  return out;
}

/* Répartition des répétitions par palier de charge.
   Barres HORIZONTALES : l'étiquette est du texte ("72,5 kg") qui se lit
   de gauche à droite, et la longueur est le canal le plus précis pour
   comparer des quantités. Chaque barre porte sa valeur en clair. */
function repsPerWeightChart(parPoids, { max = 8 } = {}) {
  if (!parPoids.length) return "";
  const rows = parPoids.slice(0, max);
  const maxReps = Math.max(...rows.map(r => r.reps));
  return `<figure class="rpw" role="img"
      aria-label="Répétitions par charge : ${rows.map(r => `${r.poids} kg, ${r.reps} répétitions en ${r.sets} série(s)`).join(" ; ")}">
    ${rows.map(r => `
      <div class="rpw-row">
        <span class="rpw-lab">${r.poids} kg</span>
        <span class="rpw-track"><span class="rpw-bar" style="width:${Math.max(4, Math.round(r.reps / maxReps * 100))}%"></span></span>
        <span class="rpw-val"><strong>${r.reps}</strong> reps<span class="rpw-sets"> · ${r.sets} série${r.sets > 1 ? "s" : ""}</span></span>
      </div>`).join("")}
    ${parPoids.length > max ? `<p class="video-hint">+ ${parPoids.length - max} autre(s) palier(s) plus léger(s).</p>` : ""}
  </figure>`;
}

/* Graphique d'évolution : une seule série (le poids max par séance).
   Série unique = pas de légende, le titre nomme la donnée. Trait 2 px,
   dernier point marqué (≥ 8 px) avec anneau de fond, valeur étiquetée
   uniquement au dernier point, grille discrète, info-bulle par point. */
function evolutionChart(points, { w = 320, h = 132, unit = "kg" } = {}) {
  if (points.length < 2) return "";
  const padL = 32, padR = 58, padT = 14, padB = 22;   // padR : place pour l'étiquette de valeur
  const xs = points.map(p => p.date), ys = points.map(p => p.poids);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  let minY = Math.min(...ys), maxY = Math.max(...ys);
  if (minY === maxY) { minY -= 1; maxY += 1; }          // série plate : on aère
  const px = x => maxX === minX ? padL : padL + (x - minX) / (maxX - minX) * (w - padL - padR);
  const py = y => h - padB - (y - minY) / (maxY - minY) * (h - padT - padB);
  const last = points[points.length - 1];
  const fmtD = d => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

  return `<figure class="evo">
    <svg viewBox="0 0 ${w} ${h}" role="img"
         aria-label="Évolution du poids maximum : de ${ys[0]} ${unit} le ${fmtD(minX)} à ${last.poids} ${unit} le ${fmtD(last.date)}">
      <line class="evo-axis" x1="${padL}" y1="${h - padB}" x2="${w - padR}" y2="${h - padB}"/>
      <line class="evo-grid" x1="${padL}" y1="${padT}" x2="${w - padR}" y2="${padT}"/>
      <text class="evo-tick" x="${padL - 6}" y="${padT + 4}" text-anchor="end">${maxY}</text>
      <text class="evo-tick" x="${padL - 6}" y="${h - padB + 4}" text-anchor="end">${minY}</text>
      <text class="evo-tick" x="${padL}" y="${h - 6}">${fmtD(minX)}</text>
      <text class="evo-tick" x="${w - padR}" y="${h - 6}" text-anchor="end">${fmtD(last.date)}</text>
      <polyline class="evo-line" points="${points.map(p => `${px(p.date).toFixed(1)},${py(p.poids).toFixed(1)}`).join(" ")}"/>
      ${points.map(p => `<circle class="evo-dot" cx="${px(p.date).toFixed(1)}" cy="${py(p.poids).toFixed(1)}" r="6">
        <title>${fmtD(p.date)} — ${p.poids} ${unit}</title></circle>`).join("")}
      <circle class="evo-last-ring" cx="${px(last.date).toFixed(1)}" cy="${py(last.poids).toFixed(1)}" r="6"/>
      <circle class="evo-last" cx="${px(last.date).toFixed(1)}" cy="${py(last.poids).toFixed(1)}" r="4"/>
      <text class="evo-val" x="${(px(last.date) + 9).toFixed(1)}" y="${(py(last.poids) + 4).toFixed(1)}">${last.poids} ${unit}</text>
    </svg>
  </figure>`;
}

/* Bloc « mes stats » d'un exercice : replié par défaut, chiffres expliqués */
function exerciseStatsBlock(ex) {
  const s = exerciseStats(ex.id);
  if (s.seances === 0) {
    return `<div class="disc-flat">
      <p class="disc-what">Tes statistiques personnelles sur ce mouvement apparaîtront ici
      dès ta première série validée en séance : évolution de la charge, meilleur set, volume cumulé.</p>
    </div>`;
  }
  const summary = `<span class="disc-title">Mes stats</span>
    <span class="disc-meta">${s.best ? `record ${s.best.poids} kg × ${s.best.reps}` : s.series + " séries"}
    · ${s.seances} séance${s.seances > 1 ? "s" : ""}</span>`;
  const detail = `
    ${s.points.length >= 2 ? `<p class="exs-cap">Poids maximum par séance</p>${evolutionChart(s.points)}` : ""}
    ${s.parPoids.length ? `<p class="exs-cap">Répétitions par charge</p>${repsPerWeightChart(s.parPoids)}` : ""}
    <div class="exs-grid">
      <div class="exs-item"><span class="exs-val">${s.best ? s.best.poids + " kg × " + s.best.reps : "—"}</span>
        <span class="exs-lab">Meilleur set</span>
        <span class="exs-help">Ta série la plus lourde${s.best ? ", le " + new Date(s.best.date).toLocaleDateString("fr-FR") : ""} — le repère à battre.</span></div>
      <div class="exs-item"><span class="exs-val">${s.rm ? s.rm + " kg" : "—"}</span>
        <span class="exs-lab">1RM estimé</span>
        <span class="exs-help">La charge que tu lèverais une seule fois (formule d'Epley, à partir de ton meilleur set). C'est une <em>estimation</em> : ne la teste pas à froid.</span></div>
      <div class="exs-item"><span class="exs-val">${s.reps}</span>
        <span class="exs-lab">Répétitions</span>
        <span class="exs-help">Total de reps accumulées sur cet exercice, en ${s.series} série${s.series > 1 ? "s" : ""} et ${s.seances} séance${s.seances > 1 ? "s" : ""}.</span></div>
      <div class="exs-item"><span class="exs-val">${Math.round(s.volume).toLocaleString("fr-FR")} kg</span>
        <span class="exs-lab">Volume cumulé</span>
        <span class="exs-help">Poids × reps additionnés. C'est le meilleur indicateur du travail total fourni : le faire grimper mois après mois, c'est progresser.</span></div>
    </div>`;
  return disclosure("exstats." + ex.id, {
    summary, detail, label: "Détails",
    what: `Deux lectures complémentaires. La <strong>courbe</strong> suit ton poids maximum par séance :
      elle monte = surcharge progressive réussie, un plateau de 3 séances dit qu'il faut changer quelque chose.
      Les <strong>barres</strong> montrent combien de répétitions tu as faites à chaque charge : c'est là qu'on
      voit si tu passes ton temps trop léger, ou si une charge lourde ne tient que 3 reps.`
  });
}

/* ==================== TYPE DE SÉANCE (calendrier) ==================== */
/* 7 types, chacun avec une couleur ET une initiale : la couleur ne porte
   jamais l'information seule (l'initiale + la légende la doublent). */
const SESSION_TYPES = {
  push:   { nom: "Push",   court: "PS", desc: "Poussée : pectoraux, épaules, triceps" },
  pull:   { nom: "Pull",   court: "PL", desc: "Tirage : dos, biceps" },
  jambes: { nom: "Jambes", court: "J",  desc: "Quadriceps, ischios, fessiers, mollets" },
  haut:   { nom: "Haut",   court: "H",  desc: "Haut du corps complet" },
  bas:    { nom: "Bas",    court: "B",  desc: "Bas du corps complet" },
  full:   { nom: "Full",   court: "F",  desc: "Full body : haut et bas dans la même séance" },
  libre:  { nom: "Libre",  court: "L",  desc: "Séance libre, hors modèle de split" }
};

const UPPER_GROUPS = ["pectoraux", "dos", "epaules", "biceps", "triceps"];
const LOWER_GROUPS = ["quadriceps", "ischios-fessiers", "mollets"];
const PUSH_GROUPS = ["pectoraux", "epaules", "triceps"];
const PULL_GROUPS = ["dos", "biceps"];

/* Type d'une séance enregistrée : d'abord son intitulé (issu du
   programme), sinon déduit des muscles réellement travaillés. */
function sessionType(r) {
  const n = normalize(r.nom || "");
  if (n.includes("push") || n.includes("poussee")) return "push";
  if (n.includes("pull") || n.includes("tirage")) return "pull";
  if (n.includes("haut du corps") || n.includes("upper")) return "haut";
  if (n.includes("bas du corps") || n.includes("lower")) return "bas";
  if (n.includes("jambe") || n.includes("legs")) return "jambes";
  if (n.includes("full")) return "full";

  const groups = [...new Set((r.exercises || []).map(e => e.groupe))]
    .filter(g => g !== "abdos" && g !== "lombaires");
  if (groups.length === 0) return "libre";
  const up = groups.filter(g => UPPER_GROUPS.includes(g));
  const low = groups.filter(g => LOWER_GROUPS.includes(g));
  if (up.length && low.length) return "full";
  if (low.length) return low.length === 1 && low[0] === "mollets" ? "libre" : "jambes";
  if (up.every(g => PUSH_GROUPS.includes(g))) return "push";
  if (up.every(g => PULL_GROUPS.includes(g))) return "pull";
  return "haut";
}

/* Pastille de type : couleur de fond + initiale en encre contrastée */
function typeChip(type, extraCls = "") {
  const t = SESSION_TYPES[type] || SESSION_TYPES.libre;
  return `<span class="type-chip t-${type} ${extraCls}" title="${esc(t.nom)} — ${esc(t.desc)}">${t.court}</span>`;
}

function typeLegend() {
  return `<div class="type-legend">
    ${Object.keys(SESSION_TYPES).map(k =>
      `<span class="tl-item">${typeChip(k)}<span class="tl-nom">${SESSION_TYPES[k].nom}</span></span>`).join("")}
  </div>`;
}

/* ==================== CONFIGURATION DE L'ACCUEIL ==================== */
/* Ordre ET visibilité choisis par l'utilisateur, mémorisés. */
const HOME_CARDS_DEFAULT = [
  { key: "next", on: true },
  { key: "acces", on: true },
  { key: "objectif", on: true },
  { key: "pr", on: true },
  { key: "mois", on: true },
  { key: "streak", on: true },
  { key: "serieCard", on: true },
  { key: "poids", on: false },
  { key: "liens", on: true }
];

const HOME_CARD_LABELS = {
  next: "Prochaine séance",
  acces: "Accès Programme & Nutrition",
  objectif: "Objectif de la semaine",
  pr: "Dernier record",
  mois: "Résumé du mois",
  streak: "Streak (semaines d'affilée)",
  serieCard: "Carte série (calendrier + records)",
  poids: "Poids de corps",
  liens: "Liens rapides"
};

function getHomeCards() {
  const saved = loadJSON(STORAGE_KEYS.homeCards, null);
  if (!Array.isArray(saved)) return HOME_CARDS_DEFAULT.slice();
  // fusion : les cartes ajoutées par une mise à jour apparaissent à la fin
  const known = new Set(saved.map(c => c.key));
  const merged = saved.filter(c => HOME_CARD_LABELS[c.key]);
  for (const d of HOME_CARDS_DEFAULT) if (!known.has(d.key)) merged.push({ ...d });
  return merged;
}
function saveHomeCards(list) { saveJSON(STORAGE_KEYS.homeCards, list); }
function homeCardOn(key) {
  const c = getHomeCards().find(x => x.key === key);
  return c ? c.on : false;
}

/* Repaint initial : app.js a rendu la bibliothèque avant que les
   favoris ne soient disponibles. */
if (typeof renderLibrary === "function") renderLibrary();
