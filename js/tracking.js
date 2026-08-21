/* =========================================================
   GymCoach — Suivi, gamification & thèmes
   - Bascule de thème Épuré / Gamifié (mémorisée)
   - Tableau de bord : stats, XP/niveau, badges, PR + graphes
   - Mes séances : liste/tableau, recherche, éditer/dupliquer
   - Calendrier mensuel + objectif hebdo vérifié + streak
   - Export / import JSON, suivi du poids de corps
   Tout est CALCULÉ à partir de l'historique : une seule
   source de vérité, aucune stat stockée en double.
   ========================================================= */

STORAGE_KEYS.weeklyGoal = "gymcoach.weeklyGoal";
STORAGE_KEYS.weights = "gymcoach.weights";
STORAGE_KEYS.schema = "gymcoach.schema";

/* Versionnage du schéma : v2 = ajout rpe/notes/statut sur les séances.
   Les anciennes séances restent valides (champs simplement absents). */
if (!localStorage.getItem(STORAGE_KEYS.schema)) {
  localStorage.setItem(STORAGE_KEYS.schema, "2");
}

/* ---------- Thème ---------- */
const THEME_KEY = "gymcoach.theme";

function currentTheme() { return localStorage.getItem(THEME_KEY) || "gamifie"; }

function applyTheme(theme) {
  document.documentElement.className = "theme-" + theme;
  localStorage.setItem(THEME_KEY, theme);
  document.getElementById("theme-toggle-label").textContent =
    theme === "gamifie" ? "Clair" : "Sombre"; // le bouton propose l'AUTRE thème
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "gamifie" ? "#141210" : "#f6f1e7";
}

document.getElementById("theme-toggle").addEventListener("click", () =>
  applyTheme(currentTheme() === "gamifie" ? "epure" : "gamifie"));
applyTheme(currentTheme());

/* ---------- Accès aux données ---------- */
function getHistory() { return loadJSON(STORAGE_KEYS.history, []); }
function setHistory(h) { saveJSON(STORAGE_KEYS.history, h); }

function getWeeklyGoal() {
  const saved = loadJSON(STORAGE_KEYS.weeklyGoal, null);
  if (saved) return saved;
  const program = loadJSON(STORAGE_KEYS.program, null);
  return program ? program.jours : 3;
}

/* ---------- Semaines ISO (objectif hebdo) ---------- */
function mondayOf(ts) {
  const d = new Date(ts); d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}
function weekKey(ts) { return mondayOf(ts).getTime(); }

function sessionsPerWeek() {
  const map = new Map();
  for (const r of getHistory()) {
    const k = weekKey(r.date);
    map.set(k, (map.get(k) || 0) + 1);
  }
  return map;
}

/* État de l'objectif : semaine courante, streak de semaines validées */
function goalStatus() {
  const goal = getWeeklyGoal();
  const perWeek = sessionsPerWeek();
  const thisWeek = weekKey(Date.now());
  const doneThisWeek = perWeek.get(thisWeek) || 0;

  // streak : semaines consécutives validées en remontant depuis la semaine
  // précédente ; la semaine en cours compte si elle est déjà validée
  let streak = 0;
  let cursor = thisWeek;
  if (doneThisWeek >= goal) { streak = 1; }
  cursor -= 7 * 86400000;
  while ((perWeek.get(cursor) || 0) >= goal) { streak++; cursor -= 7 * 86400000; }

  /* PLUS LONGUE SÉRIE et TOTAL : on ne les recalcule qu'une fois ici,
     pas à chaque affichage de carte — les deux lisent la même carte
     perWeek que le streak courant, donc la même notion de « semaine
     validée » partout.
     ATTENTION : perWeek ne contient QUE les semaines où une séance a
     eu lieu — une semaine blanche en est absente, elle n'y vaut pas 0.
     Parcourir seulement les clés existantes ferait passer deux
     semaines validées séparées par une semaine blanche pour
     consécutives. On balaie donc semaine par semaine, à intervalle
     fixe de 7 jours, du plus ancien au plus récent. */
  let longest = 0, courante = 0, totalAtteintes = 0;
  const clefs = [...perWeek.keys()];
  if (clefs.length) {
    const debut = Math.min(...clefs);
    for (let wk = debut; wk <= thisWeek; wk += 7 * 86400000) {
      if ((perWeek.get(wk) || 0) >= goal) {
        courante++; totalAtteintes++;
        longest = Math.max(longest, courante);
      } else courante = 0;
    }
  }
  longest = Math.max(longest, streak);   // la série en cours peut être la plus longue

  return { goal, doneThisWeek, achievedThisWeek: doneThisWeek >= goal, streak, longest, totalAtteintes, perWeek };
}

/* ---------- Statistiques globales ---------- */
function globalStats() {
  const h = getHistory();
  const stats = {
    total: h.length,
    tempsMs: h.reduce((s, r) => s + (r.dureeMs || 0), 0),
    volume: h.reduce((s, r) => s + (r.volume || 0), 0),
    series: h.reduce((s, r) => s + (r.nbSeries || 0), 0),
    reps: 0,
    parGroupe: {}
  };
  for (const r of h)
    for (const ex of r.exercises) {
      stats.parGroupe[ex.groupe] = (stats.parGroupe[ex.groupe] || 0) + ex.sets.length;
      /* Répétitions totales : elles n'étaient pas comptées. Le volume seul
         ne les donne pas — 10 000 kg peuvent venir de 100 reps à 100 kg
         comme de 400 reps à 25 kg. */
      for (const st of ex.sets) stats.reps += (st.reps || 0);
    }
  // régularité : moyenne de séances/semaine depuis la première séance
  if (h.length) {
    const first = Math.min(...h.map(r => r.date));
    const weeks = Math.max(1, (Date.now() - first) / (7 * 86400000));
    stats.regularite = (h.length / weeks).toFixed(1);
  } else stats.regularite = "0";
  return stats;
}

/* ---------- Records personnels (PR) ---------- */
function computePRs() {
  const byEx = new Map(); // exId -> { nom, points:[{date, poids}], best }
  const h = getHistory().slice().sort((a, b) => a.date - b.date);
  for (const r of h) {
    for (const ex of r.exercises) {
      let max = null;
      for (const s of ex.sets)
        if (s.poids != null && (!max || s.poids > max.poids)) max = { poids: s.poids, reps: s.reps };
      if (!max) continue;
      if (!byEx.has(ex.exId)) byEx.set(ex.exId, { nom: ex.nom, points: [], best: null });
      const e = byEx.get(ex.exId);
      e.points.push({ date: r.date, poids: max.poids });
      if (!e.best || max.poids > e.best.poids) e.best = { ...max, date: r.date };
    }
  }
  return [...byEx.values()].sort((a, b) => b.best.poids - a.best.poids);
}

/* Mini-graphique SVG (pas de librairie : une polyline suffit) */
function sparkline(points, w = 220, h = 48) {
  if (points.length < 2) return "";
  const xs = points.map(p => p.date), ys = points.map(p => p.poids);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const px = x => maxX === minX ? w / 2 : 4 + (x - minX) / (maxX - minX) * (w - 8);
  const py = y => maxY === minY ? h / 2 : h - 4 - (y - minY) / (maxY - minY) * (h - 8);
  const pts = points.map(p => `${px(p.date).toFixed(1)},${py(p.poids).toFixed(1)}`).join(" ");
  const last = points[points.length - 1];
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <polyline points="${pts}"></polyline>
    <circle cx="${px(last.date).toFixed(1)}" cy="${py(last.poids).toFixed(1)}" r="3"></circle>
  </svg>`;
}

/* ---------- XP, niveau, badges ---------- */
function computeXP() {
  const h = getHistory();
  let xp = 0;
  for (const r of h) xp += 50 + 2 * (r.nbSeries || 0) + (r.rpe ? 5 : 0);
  // +100 par semaine où l'objectif a été atteint
  const goal = getWeeklyGoal();
  for (const count of sessionsPerWeek().values()) if (count >= goal) xp += 100;
  return xp;
}

function levelFromXP(xp) {
  let lvl = 1, need = 150, rest = xp;
  while (rest >= need) { rest -= need; lvl++; need = 150 * lvl; }
  return { lvl, into: rest, need };
}

function computeBadges() {
  const h = getHistory();
  const stats = globalStats();
  const gs = goalStatus();
  const weeksOK = [...gs.perWeek.values()].filter(c => c >= gs.goal).length;
  const prs = computePRs();
  const hasProgress = prs.some(p => p.points.length >= 2 && p.best.poids > p.points[0].poids);
  /* Chaque badge porte désormais SA MESURE et SA CIBLE, pas seulement
     un booléen. Un badge verrouillé qui ne dit pas où tu en es ne
     motive personne : « 7 séances sur 10 » vaut mieux qu'une tuile
     grisée.

     `binaire: true` marque les badges qui n'ont PAS d'état
     intermédiaire — on progresse sur sa charge ou non. Leur afficher
     un anneau à 0 % serait inventer une progression qui n'existe
     pas ; ils gardent donc la simple tuile verrouillée. */
  const B = (ico, nom, desc, val, cible, opts = {}) =>
    ({ ico, nom, desc, val, cible, ok: val >= cible, ...opts });

  return [
    B("party", "Première séance", "Terminer ta première séance", h.length, 1, { binaire: true }),
    B("flame", "Lancé", "5 séances terminées", h.length, 5),
    B("medal", "Habitué", "10 séances terminées", h.length, 10),
    B("trophy", "Machine", "25 séances terminées", h.length, 25),
    B("crown", "Légende", "50 séances terminées", h.length, 50),
    B("check", "Semaine parfaite", "Objectif hebdo atteint une fois", weeksOK, 1, { binaire: true }),
    B("calendar", "Régulier", "Objectif hebdo atteint 3 fois", weeksOK, 3),
    B("bolt", "Inarrêtable", "Streak de 4 semaines validées", gs.streak, 4),
    B("trend", "Premier PR", "Progresser sur la charge d'un exercice", hasProgress ? 1 : 0, 1, { binaire: true }),
    B("dumbbell", "10 tonnes", "10 000 kg de volume cumulé", stats.volume, 10000),
    B("stack", "100 tonnes", "100 000 kg de volume cumulé", stats.volume, 100000),
    B("clock", "Marathonien", "10 h d'entraînement cumulées", stats.tempsMs, 10 * 3600000)
  ];
}

/* Formate l'avancement d'un badge dans son unité d'origine.
   Un badge de volume se lit en kg, un badge de temps en heures : dire
   « 36000000 / 36000000 » n'aiderait personne. */
function badgeAvance(b) {
  if (b.ico === "clock") {
    const h = v => (v / 3600000).toLocaleString("fr-FR", { maximumFractionDigits: 1 });
    return `${h(b.val)} h sur ${h(b.cible)} h`;
  }
  if (b.ico === "dumbbell" || b.ico === "stack") {
    const k = v => Math.round(v).toLocaleString("fr-FR");
    return `${k(b.val)} kg sur ${k(b.cible)} kg`;
  }
  return `${Math.round(b.val)} sur ${b.cible}`;
}

/* Anneau de progression. Le pourcentage est BORNÉ à [0, 1] : un
   volume de 120 000 kg sur une cible de 100 000 donnerait un
   dasharray négatif, et l'anneau se dessinerait à l'envers. */
function badgeRing(b) {
  const r = 15, circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, b.cible > 0 ? b.val / b.cible : 0));
  return `<svg class="badge-ring" viewBox="0 0 36 36" aria-hidden="true" focusable="false">
    <circle class="br-fond" cx="18" cy="18" r="${r}"/>
    <circle class="br-arc" cx="18" cy="18" r="${r}"
      stroke-dasharray="${(circ * pct).toFixed(2)} ${circ.toFixed(2)}"/>
    <text class="br-txt" x="18" y="18" text-anchor="middle" dominant-baseline="central">${Math.round(pct * 100)}</text>
  </svg>`;
}

/* ---------- Panneaux du suivi ---------- */
document.querySelectorAll('.seg[data-panel]').forEach(seg =>
  seg.addEventListener("click", () => {
    document.querySelectorAll('.seg[data-panel]').forEach(s => s.classList.remove("active"));
    seg.classList.add("active");
    document.querySelectorAll(".suivi-panel").forEach(p => p.classList.add("hidden"));
    document.getElementById("panel-" + seg.dataset.panel).classList.remove("hidden");
    renderSuivi();
  }));

document.querySelectorAll('.tab[data-view="suivi"]').forEach(tab =>
  tab.addEventListener("click", renderSuivi));

function renderSuivi() {
  if (!document.getElementById("panel-dashboard").classList.contains("hidden")) renderDashboard();
  if (!document.getElementById("panel-seances").classList.contains("hidden")) renderSessionsPanel();
  if (!document.getElementById("panel-calendrier").classList.contains("hidden")) renderCalendar();
}

/* ==================== TABLEAU DE BORD ==================== */
function renderDashboard() {
  const stats = globalStats();
  const gs = goalStatus();
  const xp = computeXP();
  const level = levelFromXP(xp);
  const badges = computeBadges();
  const prs = computePRs();
  const weights = loadJSON(STORAGE_KEYS.weights, []);
  const maxGroupe = Math.max(1, ...Object.values(stats.parGroupe));

  const badgesOK = badges.filter(b => b.ok).length;
  const lastW = weights.length ? weights[weights.length - 1] : null;

  /* Tableau de bord dense : chaque bloc montre une ligne de résumé et
     déplie ses détails + leur explication (A2/A3/A4). */
  document.getElementById("panel-dashboard").innerHTML = `
    <!-- Objectif de la semaine + streak : le seul bloc ouvert d'office -->
    <div class="card goal-card">
      ${disclosure("dash.goal", {
        summary: `<span class="goal-big">${gs.doneThisWeek}<span class="goal-sep">/</span>${gs.goal}</span>${statInfo("objectif")}
          <span class="disc-meta">cette semaine · streak ${gs.streak} sem.${statInfo("streak")}
          ${gs.achievedThisWeek ? '<span class="goal-ok">✓ atteint</span>' : ""}</span>`,
        label: "Régler",
        detail: `<label class="goal-adjust">Séances / semaine
            <input type="number" id="weekly-goal-input" min="1" max="14" value="${gs.goal}">
          </label>
          <p class="video-hint">Par défaut c'est le nombre de séances de ton programme actif.</p>`
      })}
      <div class="progress-track"><div class="progress-bar" style="width:${Math.min(100, gs.doneThisWeek / gs.goal * 100)}%"></div></div>
    </div>

    <!-- Niveau / XP -->
    <div class="card xp-card">
      ${disclosure("dash.xp", {
        summary: `<span class="xp-level">NIV. ${level.lvl}${statInfo("xp")}</span>
          <span class="disc-meta">${xp} XP · ${level.need - level.into} avant le niveau ${level.lvl + 1}</span>`,
        detail: `${(() => {
          /* Le badge le plus proche, nommé en tête. L'ordre de la
             grille reste FIXE — le trier par avancement ferait sauter
             les tuiles d'une visite à l'autre, et on ne retrouverait
             plus rien. La motivation passe par cette ligne, pas par
             un classement mouvant. */
          const proches = badges.filter(b => !b.ok && !b.binaire && b.cible > 0)
            .sort((x, y) => (y.val / y.cible) - (x.val / x.cible));
          const p = proches[0];
          return p ? `<p class="badge-next">Le plus proche : <strong>${esc(p.nom)}</strong>
            <span class="badge-next-n">${esc(badgeAvance(p))}</span></p>` : "";
        })()}
        <div class="badge-grid">
          ${badges.map(b => `
            <div class="badge-tile ${b.ok ? "badge-ok" : ""}">
              <span class="badge-ico">${icon(b.ico)}</span>
              <span class="badge-nom">${esc(b.nom)}</span>
              <span class="badge-desc">${esc(b.desc)}</span>
              ${b.ok ? '<span class="badge-check">✓</span>'
                     : (b.binaire ? "" : `<span class="badge-prog" role="img"
                          aria-label="Avancement : ${esc(badgeAvance(b))}">${badgeRing(b)}</span>`)}
              ${b.ok || b.binaire ? "" : `<span class="badge-compte">${esc(badgeAvance(b))}</span>`}
            </div>`).join("")}
        </div>
        <p class="video-hint">${badgesOK} badge${badgesOK > 1 ? "s" : ""} sur ${badges.length} débloqué${badgesOK > 1 ? "s" : ""}.</p>`,
        label: `Badges ${badgesOK}/${badges.length}`
      })}
      <div class="progress-track"><div class="progress-bar" style="width:${Math.round(level.into / level.need * 100)}%"></div></div>
    </div>

    <!-- Statistiques : 4 chiffres, toujours visibles (c'est déjà l'essentiel) -->
    <div class="stat-tiles">
      ${[["seances", stats.total, "Séances"],
         ["temps", fmtClock(stats.tempsMs), "Temps total"],
         ["volume", Math.round(stats.volume).toLocaleString("fr-FR") + " kg", "Volume"],
         ["regularite", stats.regularite, "Séances / sem."],
         ["reps", stats.reps.toLocaleString("fr-FR"), "Répétitions"],
         ["series", stats.series.toLocaleString("fr-FR"), "Séries"]
        ].map(([k, v, lab]) => `
        <div class="card stat-tile">
          <span class="chrono-value">${v}</span>
          <span class="chrono-label">${lab}${statInfo(k)}</span>
          ${statLigne(k)}
        </div>`).join("")}
    </div>

    ${Object.keys(stats.parGroupe).length ? `
    <div class="card">
      ${disclosure("dash.muscles", {
        summary: `<span class="disc-title">Répartition par muscle${statInfo("muscles")}</span>
          <span class="disc-meta">${Object.keys(stats.parGroupe).length} groupes travaillés</span>`,
        detail: `<div class="muscle-bars">
          ${Object.entries(stats.parGroupe).sort((a, b) => b[1] - a[1]).map(([g, n]) => `
            <div class="muscle-bar-row">
              <span class="muscle-bar-label">${LABELS.groupes[g] || g}</span>
              <div class="muscle-bar-track"><div class="muscle-bar" style="width:${Math.round(n / maxGroupe * 100)}%"></div></div>
              <span class="muscle-bar-n">${n}</span>
            </div>`).join("")}
        </div>`
      })}
    </div>` : ""}

    ${prs.length ? `
    <div class="card">
      ${disclosure("dash.prs", {
        summary: `<span class="disc-title">Records personnels${statInfo("pr")}</span>
          <span class="disc-meta">${prs.length} exercice${prs.length > 1 ? "s" : ""} · top ${prs[0].best.poids} kg</span>`,
        detail: `<div class="pr-list">
          ${prs.slice(0, 10).map(p => `
            <div class="pr-row">
              <div class="pr-info">
                <strong>${esc(p.nom)}</strong>
                <span class="pr-best">${p.best.poids} kg × ${p.best.reps} · ${new Date(p.best.date).toLocaleDateString("fr-FR")}</span>
              </div>
              ${sparkline(p.points)}
            </div>`).join("")}
        </div>`
      })}
    </div>` : ""}

    <!-- Poids de corps -->
    <div class="card">
      ${disclosure("dash.weight", {
        summary: `<span class="disc-title">Poids de corps${statInfo("poidsCorps")}</span>
          <span class="disc-meta">${lastW ? lastW.kg + " kg le " + new Date(lastW.date).toLocaleDateString("fr-FR") : "aucun relevé"}</span>`,
        label: "Relever",
        detail: `<div class="weight-row">
            <input type="number" id="weight-input" min="20" max="300" step="0.1" placeholder="Ex : 74.5">
            <button class="btn btn-ghost" id="weight-add">Enregistrer</button>
          </div>
          ${weights.length >= 2 ? evolutionChart(weights.map(w => ({ date: w.date, poids: w.kg })), { w: 340, unit: "kg" }) : ""}
          ${weights.length ? `<p class="video-hint">${weights.length} relevé${weights.length > 1 ? "s" : ""} enregistré${weights.length > 1 ? "s" : ""}.</p>` : ""}`
      })}
    </div>

    <!-- Sauvegarde -->
    <div class="card">
      ${disclosure("dash.backup", {
        summary: `<span class="disc-title">Sauvegarde</span>
          <span class="disc-meta">export / import JSON</span>`,
        what: `Tes données vivent <strong>uniquement dans ce navigateur</strong> : vider le cache
          ou changer de téléphone les efface. L'export produit un fichier unique qui contient tout
          (séances, programmes, favoris, réglages) et que l'import restaure à l'identique.`,
        detail: `<div class="program-actions">
          <button class="btn btn-primary" id="export-data">Exporter (JSON)</button>
          <button class="btn btn-ghost" id="import-data">Importer une sauvegarde</button>
        </div>`
      })}
    </div>
  `;

  // objectif hebdo ajustable
  document.getElementById("weekly-goal-input").addEventListener("change", e => {
    const v = Math.max(1, Math.min(14, parseInt(e.target.value, 10) || 3));
    saveJSON(STORAGE_KEYS.weeklyGoal, v);
    renderDashboard();
  });

  // poids de corps
  document.getElementById("weight-add").addEventListener("click", () => {
    const kg = parseFloat(document.getElementById("weight-input").value);
    if (!kg || kg < 20 || kg > 300) return;
    const weights = loadJSON(STORAGE_KEYS.weights, []);
    weights.push({ date: Date.now(), kg });
    weights.sort((a, b) => a.date - b.date);
    saveJSON(STORAGE_KEYS.weights, weights);
    renderDashboard();
  });

  // export / import
  document.getElementById("export-data").addEventListener("click", exportData);
  document.getElementById("import-data").addEventListener("click", () =>
    document.getElementById("import-file").click());
}

/* ---------- Export / import JSON ---------- */
function exportData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith("gymcoach.")) data[k] = localStorage.getItem(k);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gymcoach-sauvegarde-" + new Date().toISOString().slice(0, 10) + ".json";
  a.click();
  URL.revokeObjectURL(a.href);
}

document.getElementById("import-file").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const keys = Object.keys(data).filter(k => k.startsWith("gymcoach."));
      if (!keys.length) { alert("Fichier invalide : aucune donnée GymCoach trouvée."); return; }
      if (!confirm(`Restaurer ${keys.length} clé(s) de données ? Les données actuelles seront remplacées.`)) return;
      keys.forEach(k => localStorage.setItem(k, data[k]));
      location.reload();
    } catch { alert("Fichier illisible : ce n'est pas un JSON valide."); }
  };
  reader.readAsText(file);
  e.target.value = "";
});

/* ==================== MES SÉANCES ==================== */
const sessionsState = { q: "", period: "all", mode: "cartes", sortBy: "date", sortDir: -1 };

function filteredSessions() {
  const q = normalize(sessionsState.q.trim());
  const now = Date.now();
  const periods = { "7": 7 * 86400000, "30": 30 * 86400000, "90": 90 * 86400000 };
  return getHistory().filter(r => {
    if (sessionsState.period !== "all" && now - r.date > periods[sessionsState.period]) return false;
    if (q) {
      const hay = normalize(r.nom + " " + r.exercises.map(e => e.nom).join(" "));
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderSessionsPanel() {
  const panel = document.getElementById("panel-seances");
  const list = filteredSessions();

  // tri (utilisé par la vue tableau)
  const sorted = list.slice().sort((a, b) => {
    const k = sessionsState.sortBy;
    const va = k === "date" ? a.date : k === "duree" ? a.dureeMs : k === "volume" ? a.volume : a.nbSeries;
    const vb = k === "date" ? b.date : k === "duree" ? b.dureeMs : k === "volume" ? b.volume : b.nbSeries;
    return (va - vb) * sessionsState.sortDir;
  });

  const arrow = k => sessionsState.sortBy === k ? (sessionsState.sortDir === 1 ? " ↑" : " ↓") : "";

  panel.innerHTML = `
    <div class="sessions-controls">
      <input type="search" id="sessions-q" placeholder="Rechercher (séance ou exercice)…" value="${esc(sessionsState.q)}">
      <select id="sessions-period" aria-label="Période">
        <option value="all" ${sessionsState.period === "all" ? "selected" : ""}>Toute la période</option>
        <option value="7" ${sessionsState.period === "7" ? "selected" : ""}>7 derniers jours</option>
        <option value="30" ${sessionsState.period === "30" ? "selected" : ""}>30 derniers jours</option>
        <option value="90" ${sessionsState.period === "90" ? "selected" : ""}>3 derniers mois</option>
      </select>
      <div class="segmented segmented-sm">
        <button class="seg ${sessionsState.mode === "cartes" ? "active" : ""}" data-mode="cartes">Cartes</button>
        <button class="seg ${sessionsState.mode === "tableau" ? "active" : ""}" data-mode="tableau">Tableau</button>
      </div>
    </div>

    ${list.length === 0 ? `<div class="card empty-live"><p>Aucune séance sur cette période. Va transpirer, je t'attends ici.
    </p></div>` : ""}

    ${sessionsState.mode === "cartes" ? `
      <div class="sessions-list">
        ${sorted.map(r => `
          <div class="card history-item session-open" data-id="${esc(r.id)}" tabindex="0" role="button">
            <div class="history-head">
              <div>
                <h3>${typeChip(sessionType(r))} ${esc(r.nom)}</h3>
                <p class="day-focus">${new Date(r.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                  · ${fmtClock(r.dureeMs)} · ${r.nbSeries} séries · ${Math.round(r.volume)} kg${r.rpe ? ` · RPE ${r.rpe}` : ""}</p>
              </div>
            </div>
          </div>`).join("")}
      </div>` : `
      <!-- Colonnes prioritaires : les secondaires disparaissent sur petit
           écran (classe col-lo) — aucun défilement latéral, le détail
           complet s'ouvre d'un tap sur la ligne (F1). -->
      <div class="card">
        <table class="day-table sessions-table">
          <thead><tr>
            <th class="sortable" data-sort="date">Date${arrow("date")}</th>
            <th>Type</th>
            <th class="sortable col-lo" data-sort="duree">Durée${arrow("duree")}</th>
            <th class="sortable col-lo" data-sort="series">Séries${arrow("series")}</th>
            <th class="sortable" data-sort="volume">Volume${arrow("volume")}</th>
            <th class="col-lo">RPE</th>
          </tr></thead>
          <tbody>
            ${sorted.map(r => `
              <tr class="session-open" data-id="${esc(r.id)}" tabindex="0" role="button">
                <td>${new Date(r.date).toLocaleDateString("fr-FR")}</td>
                <td>${typeChip(sessionType(r))} <span class="sess-nom">${esc(r.nom)}</span></td>
                <td class="num col-lo">${fmtClock(r.dureeMs)}</td>
                <td class="num col-lo">${r.exercises.length} / ${r.nbSeries}</td>
                <td class="num">${Math.round(r.volume)} kg</td>
                <td class="num col-lo">${r.rpe ? r.rpe + "/10" : "—"}</td>
              </tr>`).join("")}
          </tbody>
        </table>
        <p class="video-hint">Touche une ligne pour le détail complet (durée, repos, RPE, séries).</p>
      </div>`}
  `;

  document.getElementById("sessions-q").addEventListener("input", e => {
    sessionsState.q = e.target.value; renderSessionsPanel();
    const input = document.getElementById("sessions-q");
    input.focus(); input.setSelectionRange(input.value.length, input.value.length);
  });
  document.getElementById("sessions-period").addEventListener("change", e => {
    sessionsState.period = e.target.value; renderSessionsPanel();
  });
  panel.querySelectorAll(".seg[data-mode]").forEach(b =>
    b.addEventListener("click", () => { sessionsState.mode = b.dataset.mode; renderSessionsPanel(); }));
  panel.querySelectorAll(".sortable").forEach(th =>
    th.addEventListener("click", () => {
      const k = th.dataset.sort;
      if (sessionsState.sortBy === k) sessionsState.sortDir *= -1;
      else { sessionsState.sortBy = k; sessionsState.sortDir = -1; }
      renderSessionsPanel();
    }));
  panel.querySelectorAll(".session-open").forEach(el => {
    el.addEventListener("click", () => openSessionModal(el.dataset.id));
    el.addEventListener("keydown", e => {
      if (e.key === "Enter") openSessionModal(el.dataset.id);
    });
  });
}

/* ---------- Modale détail / édition / duplication ---------- */
const sessionModal = document.getElementById("session-modal");
const sessionModalContent = document.getElementById("session-modal-content");

function closeSessionModal() {
  sessionModal.classList.add("hidden");
  document.body.style.overflow = "";
}
sessionModal.querySelector(".modal-close").addEventListener("click", closeSessionModal);
sessionModal.querySelector(".modal-backdrop").addEventListener("click", closeSessionModal);

function openSessionModal(id, edit = false) {
  const r = getHistory().find(s => s.id === id);
  if (!r) return;

  if (!edit) {
    sessionModalContent.innerHTML = `
      <h2 class="display-sm">${esc(r.nom)}</h2>
      <p class="program-meta">${new Date(r.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        à ${new Date(r.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
        · ${fmtClock(r.dureeMs)}${r.echauffementMs ? ` (dont ${fmtClock(r.echauffementMs)} d'échauffement)` : ""}
        · repos ${fmtClock(r.reposMs)} · ${Math.round(r.volume)} kg
        ${r.objectifLabel ? " · Programme : " + esc(r.objectifLabel) : ""}</p>
      ${r.rpe ? `<p class="program-meta">Ressenti : <strong>RPE ${r.rpe}/10</strong></p>` : ""}
      ${r.notes ? `<p class="session-notes">« ${esc(r.notes)} »</p>` : ""}
      ${/* Le récap d'abord, les chiffres ensuite : on relit une séance
            pour se rappeler comment elle s'est passée, pas pour
            recompter les kilos. Non modifiable ici. */
        typeof recapHtml === "function" ? recapHtml(r, false) : ""}
      ${renderSessionDetail(r)}
      <div class="program-actions">
        <button class="btn btn-ghost" id="sm-edit">Modifier</button>
        <button class="btn btn-primary" id="sm-dup">Dupliquer (rejouer)</button>
        <button class="btn btn-ghost" id="sm-to-program">Créer un programme</button>
        <button class="btn btn-danger-ghost" id="sm-del">Supprimer</button>
      </div>`;
    document.getElementById("sm-edit").addEventListener("click", () => openSessionModal(id, true));
    document.getElementById("sm-dup").addEventListener("click", () => duplicateSession(id));
    document.getElementById("sm-to-program").addEventListener("click", () => {
      closeSessionModal();
      activateView("programme");
      document.querySelector('[data-ppanel="programmes"]').click();
      createProgramFromRecord(r);
    });
    document.getElementById("sm-del").addEventListener("click", () => {
      if (!confirm("Supprimer définitivement cette séance ?")) return;
      setHistory(getHistory().filter(s => s.id !== id));
      closeSessionModal();
      renderSuivi();
    });
  } else {
    /* Mode édition : nom, RPE, notes, et chaque série (poids/reps) */
    sessionModalContent.innerHTML = `
      <h2 class="display-sm">Modifier la séance</h2>
      <div class="edit-grid">
        <label class="edit-label">Nom
          <input type="text" id="sm-nom" value="${esc(r.nom)}">
        </label>
        <label class="edit-label">Ressenti (RPE 1-10)
          <div class="rpe-row" id="sm-rpe">
            ${Array.from({ length: 10 }, (_, i) => i + 1).map(n =>
              `<button type="button" class="rpe-chip ${r.rpe === n ? "active" : ""}" data-rpe="${n}">${n}</button>`).join("")}
          </div>
        </label>
        <label class="edit-label">Notes
          <textarea id="sm-notes" rows="2" placeholder="Sensations, douleurs, contexte…">${esc(r.notes || "")}</textarea>
        </label>
      </div>
      ${r.exercises.map((ex, i) => `
        <div class="edit-ex">
          <h4>${esc(ex.nom)}</h4>
          ${ex.sets.map((s, j) => `
            <div class="edit-set">
              <span class="edit-set-n">Série ${j + 1}</span>
              <input type="number" step="0.5" min="0" value="${s.poids ?? ""}" placeholder="kg" data-e="${i}" data-s="${j}" data-f="poids">
              <input type="number" step="1" min="1" value="${s.reps}" placeholder="reps" data-e="${i}" data-s="${j}" data-f="reps">
            </div>`).join("")}
        </div>`).join("")}
      <div class="program-actions">
        <button class="btn btn-primary" id="sm-save">Enregistrer</button>
        <button class="btn btn-ghost" id="sm-cancel">Annuler</button>
      </div>`;

    let rpe = r.rpe || null;
    sessionModalContent.querySelectorAll(".rpe-chip").forEach(c =>
      c.addEventListener("click", () => {
        const v = parseInt(c.dataset.rpe, 10);
        rpe = (rpe === v) ? null : v;
        sessionModalContent.querySelectorAll(".rpe-chip").forEach(x =>
          x.classList.toggle("active", parseInt(x.dataset.rpe, 10) === rpe));
      }));

    document.getElementById("sm-cancel").addEventListener("click", () => openSessionModal(id));
    document.getElementById("sm-save").addEventListener("click", () => {
      const h = getHistory();
      const rec = h.find(s => s.id === id);
      rec.nom = document.getElementById("sm-nom").value.trim() || rec.nom;
      rec.rpe = rpe;
      rec.notes = document.getElementById("sm-notes").value.trim();
      sessionModalContent.querySelectorAll("input[data-f]").forEach(inp => {
        const set = rec.exercises[+inp.dataset.e].sets[+inp.dataset.s];
        if (inp.dataset.f === "poids") set.poids = inp.value === "" ? null : parseFloat(inp.value);
        else set.reps = Math.max(1, parseInt(inp.value, 10) || set.reps);
      });
      // recalcul des agrégats après édition
      rec.nbSeries = rec.exercises.reduce((n, e) => n + e.sets.length, 0);
      rec.volume = rec.exercises.reduce((v, e) => v + e.sets.reduce((s, x) => s + (x.poids || 0) * x.reps, 0), 0);
      setHistory(h);
      openSessionModal(id);
      renderSuivi();
    });
  }

  sessionModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

/* Dupliquer : relance une séance en direct avec les mêmes exercices */
function duplicateSession(id) {
  const r = getHistory().find(s => s.id === id);
  if (!r) return;
  if (live && !confirm("Une séance est déjà en cours. La remplacer ?")) return;
  const exercises = r.exercises.map(ex => {
    const ref = allExercisesForUI().find(e => e.id === ex.exId) || { id: ex.exId, nom: ex.nom, groupe: ex.groupe };
    const reps = ex.sets.map(s => s.reps);
    return newLiveExercise(ref, `${ex.sets.length} × ${Math.min(...reps)}-${Math.max(...reps)}`, null); // repos auto
  });
  closeSessionModal();
  startSession(r.nom.replace(/ \(bis\)$/, "") + " (bis)", exercises);
  activateView("seance");
}

/* ==================== CALENDRIER ==================== */
const calState = (() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; })();
let calSelectedDay = null;

function renderCalendar() {
  const panel = document.getElementById("panel-calendrier");
  const gs = goalStatus();
  const first = new Date(calState.y, calState.m, 1);
  const monthName = first.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  // séances par jour du mois affiché
  const byDay = new Map();
  for (const r of getHistory()) {
    const d = new Date(r.date);
    if (d.getFullYear() === calState.y && d.getMonth() === calState.m) {
      const k = d.getDate();
      if (!byDay.has(k)) byDay.set(k, []);
      byDay.get(k).push(r);
    }
  }

  // grille : semaines du mois (lundi → dimanche) + statut d'objectif par semaine
  const start = mondayOf(first.getTime());
  const weeks = [];
  let cursor = new Date(start);
  while (cursor <= new Date(calState.y, calState.m + 1, 0)) {
    const week = { days: [], key: weekKey(cursor.getTime()) };
    for (let i = 0; i < 7; i++) {
      week.days.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const monthOK = weeks.filter(w => (gs.perWeek.get(w.key) || 0) >= gs.goal).length;

  panel.innerHTML = `
    <div class="card cal-card">
      <div class="cal-nav">
        <button class="btn btn-ghost btn-sm" id="cal-prev" aria-label="Mois précédent">←</button>
        <h3 class="panel-title cal-title">${monthName.charAt(0).toUpperCase() + monthName.slice(1)}</h3>
        <button class="btn btn-ghost btn-sm" id="cal-next" aria-label="Mois suivant">→</button>
      </div>
      <div class="cal-grid cal-head">
        ${["L", "M", "M", "J", "V", "S", "D"].map(d => `<span class="cal-dow">${d}</span>`).join("")}
        <span class="cal-dow">Obj.</span>
      </div>
      ${weeks.map(w => `
        <div class="cal-grid">
          ${w.days.map(d => {
            const inMonth = d.getMonth() === calState.m;
            const list = inMonth ? (byDay.get(d.getDate()) || []) : [];
            const n = list.length;
            const isToday = d.getTime() === today.getTime();
            // type de la séance du jour : couleur + initiale, lisible sans ouvrir
            const t = n ? sessionType(list[0]) : null;
            const tn = t ? SESSION_TYPES[t] : null;
            return `<button class="cal-day ${inMonth ? "" : "cal-out"} ${isToday ? "cal-today" : ""} ${n ? "cal-has" : ""}"
              ${inMonth && n ? `data-day="${d.getDate()}"` : "disabled"}
              aria-label="${d.toLocaleDateString("fr-FR")}${n ? `, ${n} séance(s), type ${tn.nom}` : ""}">
              <span class="cal-num">${inMonth ? d.getDate() : ""}</span>
              ${n ? `<span class="cal-type t-${t}">${tn.court}${n > 1 ? `<span class="cal-plus">+${n - 1}</span>` : ""}</span>` : ""}
            </button>`;
          }).join("")}
          <span class="cal-week-status ${(gs.perWeek.get(w.key) || 0) >= gs.goal ? "goal-ok" : ""}">
            ${(gs.perWeek.get(w.key) || 0) >= gs.goal ? "✓" : `${gs.perWeek.get(w.key) || 0}/${gs.goal}`}
          </span>
        </div>`).join("")}

      ${typeLegend()}
      ${disclosure("cal.legend", {
        summary: `<span class="disc-title">Ce mois</span>
          <span class="disc-meta">objectif atteint ${monthOK}/${weeks.length} semaines · streak ${gs.streak}</span>`,
        what: `Chaque jour travaillé porte la <strong>couleur et l'initiale de son type de séance</strong> :
          la couleur donne la vue d'ensemble, l'initiale reste lisible même si tu distingues mal
          les couleurs. La colonne « Obj. » à droite indique si l'objectif de la semaine est atteint.`,
        detail: `<ul class="conseils">
          ${Object.entries(SESSION_TYPES).map(([k, v]) =>
            `<li>${typeChip(k)} <strong>${v.nom}</strong> — ${esc(v.desc)}</li>`).join("")}
        </ul>
        <p class="video-hint">Le type est déduit de l'intitulé de la séance, ou à défaut des muscles réellement
          travaillés. Les jours vides sont tes jours de récupération : ils comptent aussi.</p>`
      })}
    </div>
    <div id="cal-day-detail"></div>
  `;

  document.getElementById("cal-prev").addEventListener("click", () => {
    calState.m--; if (calState.m < 0) { calState.m = 11; calState.y--; }
    calSelectedDay = null; renderCalendar();
  });
  document.getElementById("cal-next").addEventListener("click", () => {
    calState.m++; if (calState.m > 11) { calState.m = 0; calState.y++; }
    calSelectedDay = null; renderCalendar();
  });
  panel.querySelectorAll(".cal-day[data-day]").forEach(btn =>
    btn.addEventListener("click", () => {
      calSelectedDay = parseInt(btn.dataset.day, 10);
      renderCalDayDetail(byDay.get(calSelectedDay) || []);
    }));

  if (calSelectedDay && byDay.has(calSelectedDay)) renderCalDayDetail(byDay.get(calSelectedDay));
}

function renderCalDayDetail(sessions) {
  document.getElementById("cal-day-detail").innerHTML = `
    <div class="card">
      <h3 class="panel-title">${new Date(sessions[0].date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</h3>
      ${sessions.map(r => `
        <div class="history-head cal-session">
          <div>
            <strong>${typeChip(sessionType(r))} ${esc(r.nom)}</strong>
            <p class="day-focus">${fmtClock(r.dureeMs)} · ${r.nbSeries} séries · ${Math.round(r.volume)} kg${r.rpe ? " · RPE " + r.rpe : ""}</p>
          </div>
          <button class="btn btn-ghost btn-sm session-open" data-id="${esc(r.id)}">Voir</button>
        </div>`).join("")}
    </div>`;
  document.querySelectorAll("#cal-day-detail .session-open").forEach(b =>
    b.addEventListener("click", () => openSessionModal(b.dataset.id)));
}

/* ---------- Service worker (PWA hors-ligne) ---------- */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").catch(() => { /* hors ligne / non supporté */ });
}
