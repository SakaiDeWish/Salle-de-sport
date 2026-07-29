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
  const out = { seances: 0, series: 0, reps: 0, volume: 0, best: null, points: [] };
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
        }
      }
    }
    if (seen) out.seances++;
    if (dayMax !== null) out.points.push({ date: r.date, poids: dayMax });
  }
  return out;
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
    ${evolutionChart(s.points)}
    <div class="exs-grid">
      <div class="exs-item"><span class="exs-val">${s.best ? s.best.poids + " kg × " + s.best.reps : "—"}</span>
        <span class="exs-lab">Meilleur set</span>
        <span class="exs-help">Ta série la plus lourde${s.best ? ", le " + new Date(s.best.date).toLocaleDateString("fr-FR") : ""} — le repère à battre.</span></div>
      <div class="exs-item"><span class="exs-val">${s.seances}</span>
        <span class="exs-lab">Séances</span>
        <span class="exs-help">Nombre de séances où tu as fait ce mouvement. Une fréquence de 1 à 2 fois par semaine par muscle marche bien.</span></div>
      <div class="exs-item"><span class="exs-val">${s.reps}</span>
        <span class="exs-lab">Répétitions</span>
        <span class="exs-help">Total de reps accumulées sur cet exercice, toutes séances confondues.</span></div>
      <div class="exs-item"><span class="exs-val">${Math.round(s.volume).toLocaleString("fr-FR")} kg</span>
        <span class="exs-lab">Volume cumulé</span>
        <span class="exs-help">Poids × reps additionnés. C'est le meilleur indicateur du travail total fourni : le faire grimper mois après mois, c'est progresser.</span></div>
    </div>`;
  return disclosure("exstats." + ex.id, {
    summary, detail, label: "Détails",
    what: `Le graphique montre ton <strong>poids maximum par séance</strong> sur cet exercice, dans le temps :
      une courbe qui monte = surcharge progressive réussie. Un plateau de 3 séances signale qu'il faut changer
      quelque chose (reps, repos, variante).`
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
