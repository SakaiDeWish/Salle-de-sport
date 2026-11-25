/* =========================================================
   GymCoach — Créateur & gestionnaire de programmes
   - Plusieurs programmes enregistrés (générés, persos,
     modèles, créés depuis une séance passée)
   - Un programme ACTIF : c'est lui qui alimente l'accueil,
     l'écran Séance et les ajustements de fin de séance
     (il vit dans gymcoach.program, comme avant -> zéro
     casse pour le code existant)
   - Éditeur : jours, exercices, séries/reps/repos, notes,
     supersets, glisser-déposer + flèches, suggestions,
     remplacement par alternative
   - Modèles prêts à l'emploi, partage/import JSON,
     projection sur 8 semaines (progression + deload)
   ========================================================= */

STORAGE_KEYS.programs = "gymcoach.programs";
STORAGE_KEYS.activeProgram = "gymcoach.activeProgramId";
STORAGE_KEYS.cues = "gymcoach.cues";
localStorage.setItem(STORAGE_KEYS.schema, "3"); // v3 : multi-programmes + cues

/* ---------- Accès ---------- */
function getPrograms() { return loadJSON(STORAGE_KEYS.programs, []); }
function savePrograms(l) { saveJSON(STORAGE_KEYS.programs, l); }
function getActiveId() { return loadJSON(STORAGE_KEYS.activeProgram, null); }

/* Upsert d'un programme dans la liste */
function upsertProgram(p) {
  const list = getPrograms();
  const i = list.findIndex(x => x.id === p.id);
  if (i >= 0) list[i] = p; else list.push(p);
  savePrograms(list);
}

/* Rendre un programme ACTIF = l'écrire dans gymcoach.program
   (tout le code existant lit cette clé) */
function setActiveProgram(p) {
  saveJSON(STORAGE_KEYS.program, p);
  saveJSON(STORAGE_KEYS.activeProgram, p.id);
  upsertProgram(p);
}

/* Le programme actif a pu être modifié ailleurs (ajustements de fin
   de séance) : on resynchronise la liste avant chaque affichage. */
function syncActive() {
  const p = loadJSON(STORAGE_KEYS.program, null);
  if (!p) return;
  if (!p.id) { // programme écrit sans passer par le gestionnaire : on le rattrape
    p.id = "prog-" + Date.now();
    p.source = p.source || "genere";
    p.nom = p.nom || ("Programme " + (p.objectifLabel || "généré"));
    saveJSON(STORAGE_KEYS.program, p);
    saveJSON(STORAGE_KEYS.activeProgram, p.id);
  }
  upsertProgram(p);
}

/* Migration v3 : l'ancien programme unique devient une entrée de liste */
(function migratePrograms() {
  const p = loadJSON(STORAGE_KEYS.program, null);
  if (p && !p.id) {
    p.id = "prog-" + Date.now();
    p.source = "genere";
    p.nom = p.nom || ("Programme " + (p.objectifLabel || "généré"));
    setActiveProgram(p);
  } else if (p && p.id && !getPrograms().some(x => x.id === p.id)) {
    upsertProgram(p);
    saveJSON(STORAGE_KEYS.activeProgram, p.id);
  }
})();

/* Chaque programme généré par le questionnaire rejoint la liste
   (appelé par app.js après generateProgram) */
function registerGeneratedProgram(program) {
  program.id = "prog-" + Date.now();
  program.source = "genere";
  program.nom = "Programme " + (program.objectifLabel || "généré");
  setActiveProgram(program);
  if (typeof renderProgramsPanel === "function") renderProgramsPanel();
}

/* ---------- Panneaux Générer / Mes programmes ---------- */
const PP_NOMS = { generer: "Générer", importer: "Importer", programmes: "Mes programmes" };
function ppMenu(ouvert) {
  const m = document.getElementById("pp-menu"), pl = document.getElementById("pp-plus");
  if (!m || !pl) return;
  m.classList.toggle("hidden", !ouvert);
  pl.setAttribute("aria-expanded", String(ouvert));
  pl.classList.toggle("on", ouvert);
}
document.getElementById("pp-plus")?.addEventListener("click", e => {
  e.stopPropagation();
  ppMenu(document.getElementById("pp-menu").classList.contains("hidden"));
});
document.addEventListener("click", e => { if (!e.target.closest(".pp-bar")) ppMenu(false); });
document.querySelectorAll("[data-ppanel]").forEach(seg =>
  seg.addEventListener("click", () => {
    const k = seg.dataset.ppanel;
    ["actuel", "generer", "programmes", "importer"].forEach(n =>
      document.getElementById("panel-" + n).classList.toggle("hidden", n !== k));
    const autre = document.getElementById("pp-autre");
    const actuel = document.querySelector('.seg[data-ppanel="actuel"]');
    actuel.classList.toggle("active", k === "actuel");
    autre.classList.toggle("hidden", k === "actuel");
    autre.classList.toggle("active", k !== "actuel");
    autre.textContent = PP_NOMS[k] || "";
    ppMenu(false);
    if (k === "programmes") renderProgramsPanel();
  }));

/* Sans programme, on arrive directement sur « Générer » */
if (!loadJSON(STORAGE_KEYS.program, null)) document.querySelector('#pp-menu [data-ppanel="generer"]')?.click();

/* ---------- Modèles prêts à l'emploi ---------- */
const PROGRAM_TEMPLATES = [
  { key: "fbdeb", nom: "Full body débutant · 3 j", params: { prenom: "", objectif: "forme", niveau: "debutant", jours: 3, materiel: "salle", priorite: null, split: "fullbody" } },
  { key: "hautbas", nom: "Haut / Bas · 4 j", params: { prenom: "", objectif: "masse", niveau: "intermediaire", jours: 4, materiel: "salle", priorite: null, split: "split" } },
  { key: "ppl", nom: "Push Pull Legs · 3 j", params: { prenom: "", objectif: "masse", niveau: "intermediaire", jours: 3, materiel: "salle", priorite: null, split: "split" } }
];

function instantiateTemplate(t) {
  const profil = loadJSON(STORAGE_KEYS.profil, null) || {};
  const p = generateProgram({ ...t.params, prenom: profil.prenom || "Toi" });
  p.id = "prog-" + Date.now();
  p.source = "modele";
  p.nom = t.nom;
  upsertProgram(p);
  renderProgramsPanel();
}

/* ---------- Liste des programmes ---------- */
function programStats(p) {
  const exos = p.days.reduce((n, d) => n + d.exercices.length, 0);
  return `${p.days.length} séance${p.days.length > 1 ? "s" : ""}/sem. · ${exos} exercices`;
}

function renderProgramsPanel() {
  syncActive();
  /* Les dossiers de l'onglet « Ton programme » suivent la liste. */
  setTimeout(() => { const a = loadJSON(STORAGE_KEYS.program, null); if (a && typeof renderProgram === "function") renderProgram(a); }, 0);
  const panel = document.getElementById("panel-programmes");
  if (!panel) return;
  const list = getPrograms();
  const activeId = getActiveId();
  const sourceLabels = { genere: "Généré", perso: "Personnalisé", modele: "Modèle", seance: "Depuis une séance" };

  panel.innerHTML = `
    <div class="program-actions">
      <button class="btn btn-primary" id="new-program">${icon("plus")} Nouveau programme</button>
      <button class="btn btn-ghost" id="from-sessions">${icon("stack")} Depuis mes séances</button>
      <button class="btn btn-ghost" id="import-program">${icon("upload")} Importer</button>
    </div>

    <div class="card">
      <h3 class="panel-title">Modèles prêts à l'emploi</h3>
      <div class="start-buttons">
        ${PROGRAM_TEMPLATES.map(t => `
          <button class="btn btn-ghost tpl-btn" data-tpl="${t.key}">${icon("copy")} ${esc(t.nom)}</button>`).join("")}
      </div>
    </div>

    ${list.length === 0 ? `<div class="card empty-live"><p>Aucun programme enregistré. Génère-en un, pars d'un modèle, ou crée le tien de A à Z.</p></div>` : `
    <div class="programs-list">
      ${list.map(p => `
        <div class="card prog-card ${p.id === activeId ? "prog-active" : ""}">
          <div class="history-head">
            <div>
              <h3 class="prog-name">${esc(p.nom)} ${p.id === activeId ? '<span class="tag tag-custom">ACTIF</span>' : ""}</h3>
              <p class="day-focus">${sourceLabels[p.source] || ""} · ${programStats(p)}${p.objectifLabel ? " · " + esc(p.objectifLabel) : ""}</p>
            </div>
            <div class="history-actions prog-actions">
              ${p.id !== activeId ? `<button class="btn btn-primary btn-sm p-act" data-id="${p.id}">Activer</button>` : ""}
              <button class="btn btn-ghost btn-sm p-edit" data-id="${p.id}" title="Modifier">${icon("edit")}</button>
              <button class="btn btn-ghost btn-sm p-dup" data-id="${p.id}" title="Dupliquer">${icon("copy")}</button>
              <button class="btn btn-ghost btn-sm p-share" data-id="${p.id}" title="Partager (JSON)">${icon("download")}</button>
              <button class="btn btn-danger-ghost btn-sm p-del" data-id="${p.id}" title="Supprimer">${icon("trash")}</button>
            </div>
          </div>
        </div>`).join("")}
    </div>`}

    ${activeId && list.some(p => p.id === activeId) ? renderProjection(list.find(p => p.id === activeId)) : ""}
  `;

  document.getElementById("new-program").addEventListener("click", () => openBuilder(null));
  document.getElementById("import-program").addEventListener("click", () =>
    document.getElementById("import-program-file").click());
  panel.querySelectorAll(".tpl-btn").forEach(b =>
    b.addEventListener("click", () => instantiateTemplate(PROGRAM_TEMPLATES.find(t => t.key === b.dataset.tpl))));
  panel.querySelectorAll(".p-act").forEach(b =>
    b.addEventListener("click", () => {
      const p = getPrograms().find(x => x.id === b.dataset.id);
      if (p) { setActiveProgram(p); renderProgram(p); renderProgramsPanel(); }
    }));
  panel.querySelectorAll(".p-edit").forEach(b =>
    b.addEventListener("click", () => openBuilder(b.dataset.id)));
  panel.querySelectorAll(".p-dup").forEach(b =>
    b.addEventListener("click", () => {
      const p = JSON.parse(JSON.stringify(getPrograms().find(x => x.id === b.dataset.id)));
      p.id = "prog-" + Date.now();
      p.nom += " (copie)";
      p.source = "perso";
      upsertProgram(p);
      renderProgramsPanel();
    }));
  panel.querySelectorAll(".p-share").forEach(b =>
    b.addEventListener("click", () => {
      const p = getPrograms().find(x => x.id === b.dataset.id);
      const blob = new Blob([JSON.stringify({ gymcoachProgram: 1, program: p }, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "programme-" + p.nom.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".json";
      a.click();
      URL.revokeObjectURL(a.href);
    }));
  panel.querySelectorAll(".p-del").forEach(b =>
    b.addEventListener("click", () => supprimerProgramme(b.dataset.id)));
}

/* Supprime un programme (après confirmation). Si c'était l'actif, le suivant de la liste prend sa place ;
   s'il n'en reste aucun, on revient au générateur. */
function supprimerProgramme(id) {
  syncActive();
  const p = getPrograms().find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Supprimer le programme « ${p.nom} » ? Tes séances déjà faites sont conservées.`)) return;
  savePrograms(getPrograms().filter(x => x.id !== id));
  if (getActiveId() === id) {
    const reste = getPrograms();
    if (reste.length) setActiveProgram(reste[0]);
    else {
      localStorage.removeItem(STORAGE_KEYS.activeProgram);
      localStorage.removeItem(STORAGE_KEYS.program);
      const out = document.getElementById("program-output");
      if (out) out.innerHTML = "";
      document.querySelector('#pp-menu [data-ppanel="generer"]')?.click();
    }
  }
  renderProgramsPanel();
  if (typeof renderHome === "function") renderHome();
  if (typeof toast === "function") toast("Programme supprimé.", 2500);
}

/* Import d'un programme partagé */
document.getElementById("import-program-file").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      const p = data.gymcoachProgram ? data.program : data;
      if (!p || !p.nom || !Array.isArray(p.days)) { alert("Fichier invalide : ce n'est pas un programme GymCoach."); return; }
      p.id = "prog-" + Date.now();
      p.source = p.source || "perso";
      upsertProgram(p);
      renderProgramsPanel();
      alert(`Programme « ${p.nom} » importé !`);
    } catch { alert("Fichier illisible."); }
  };
  reader.readAsText(file);
  e.target.value = "";
});

/* Plateau : pour chaque exercice du programme, on regarde ses dernières
   apparitions dans l'historique. Si la meilleure charge de série n'a pas
   progressé sur au moins 3 séances consécutives, l'exercice stagne. */
function detectPlateaus(p) {
  const history = loadJSON(STORAGE_KEYS.history, []);
  const ids = new Set();
  (p.days || []).forEach(d => (d.exercices || []).forEach(l => l.exercice && ids.add(l.exercice.id)));

  const parEx = {};   // exId -> [{ date, best }] du plus ancien au plus récent
  for (let k = history.length - 1; k >= 0; k--) {
    for (const ex of history[k].exercises || []) {
      if (!ids.has(ex.exId)) continue;
      const best = Math.max(0, ...(ex.sets || []).map(s => (s.poids || 0)));
      (parEx[ex.exId] = parEx[ex.exId] || []).push({ nom: ex.nom, best });
    }
  }

  const plateaux = [];
  for (const exId of Object.keys(parEx)) {
    const serie = parEx[exId].slice(-4);
    if (serie.length < 3) continue;
    const recent = serie.slice(-3);
    const ref = recent[0].best;
    // aucune progression (voire régression) sur les 3 dernières séances
    if (ref > 0 && recent.every(x => x.best <= ref)) plateaux.push(recent[0].nom || exId);
  }
  return plateaux;
}

/* ---------- Projection : repères pour les prochaines semaines ---------- */
function renderProjection(p) {
  const weeks = [
    { n: 1, t: "Charges de repère" },
    { n: 2, t: "+2,5 kg ou +1 rep" },
    { n: 3, t: "+1 série sur les gros muscles" },
    { n: 4, t: "+2,5 kg ou +1 rep" },
    { n: 5, t: "+1 série sur les gros muscles" },
    { n: 6, t: "Décharge −40 % de volume", deload: true },
    { n: 7, t: "Reprise, charges de S4" },
    { n: 8, t: "+2,5 kg ou +1 rep" }
  ];
  const plateaux = detectPlateaus(p);
  return `
    <div class="card">
      <h3 class="panel-title">${icon("trend")} Repères pour les prochaines semaines — ${esc(p.nom)}</h3>
      <p class="video-hint">Modèle indicatif, pas un plan figé. Deux leviers en parallèle : la <strong>charge</strong>
        (quand toutes les séries passent au RIR cible, +2,5 kg ou +1 rep) et le <strong>volume</strong> (une série
        de plus toutes les deux semaines sur le dos et les jambes, qui exploitent le plus le volume supplémentaire).
        Après ~5 semaines, une décharge à −40 % de volume, ou plus tôt si une charge stagne 2 à 3 séances de suite.</p>
      ${plateaux.length ? `<p class="proj-plateau">${icon("trend")} Charge stable depuis plusieurs séances sur :
        <strong>${plateaux.map(esc).join(", ")}</strong>. Une semaine de décharge peut aider à repartir.</p>` : ""}
      <div class="proj-track">
        ${weeks.map(w => `
          <div class="proj-week ${w.deload ? "proj-deload" : ""}">
            <span class="proj-n">S${w.n}</span>
            <span class="proj-t">${w.t}</span>
          </div>`).join("")}
      </div>
    </div>`;
}

/* ==================== ÉDITEUR DE PROGRAMME ==================== */
const builderModal = document.getElementById("builder");
let builderState = null; // copie de travail du programme

function newEmptyProgram() {
  const profil = loadJSON(STORAGE_KEYS.profil, null) || {};
  return {
    id: "prog-" + Date.now(),
    nom: "Mon programme",
    source: "perso",
    objectif: profil.objectif || "masse",
    objectifLabel: null,
    jours: 1,
    genereLe: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    conseils: [],
    days: [{ numero: 1, titre: "Séance 1", focus: "", exercices: [] }]
  };
}

/* Glisser-déposer au POINTEUR (souris, doigt, stylet) dans une liste d'éléments frères.
   `grip` est la poignée ; pendant le glisser l'élément suit le doigt, les autres s'écartent,
   et le conteneur défile tout seul près de ses bords. Au lâcher : onDrop(depuis, vers). */
function dragPointeur(racine, itemSel, gripSel, parentDe, onDrop, replier = null) {
  racine.querySelectorAll(gripSel).forEach(grip => {
    if (grip.__dp) return;
    grip.__dp = true;
    grip.style.touchAction = "none";
    grip.addEventListener("pointerdown", e => {
      if (e.button > 0) return;
      const item = grip.closest(itemSel); if (!item) return;
      e.preventDefault(); e.stopPropagation();
      const parent = parentDe(item);
      const items = [...parent.children].filter(n => n.matches(itemSel));
      const from = items.indexOf(item);
      if (items.length < 2 || from < 0) return;
      const defil = item.closest(".modal-box") || document.scrollingElement;
      /* Les séances sont longues : pour en faire glisser une sur trois autres il faut les replier,
         sinon on défile sur des milliers de pixels. La poignée reste sous le doigt. */
      if (replier) {
        const avant = grip.getBoundingClientRect().top;
        replier.ajoute();
        defil.scrollTop += grip.getBoundingClientRect().top - avant;
      }
      const rects = items.map(i => i.getBoundingClientRect());
      const mids = rects.map(r => r.top + r.height / 2);
      const espace = rects.length > 1 ? Math.max(0, from < rects.length - 1 ? rects[from + 1].top - rects[from].bottom : rects[from].top - rects[from - 1].bottom) : 8;
      const H = rects[from].height + espace;
      const y0 = e.clientY, s0 = defil.scrollTop;
      let yNow = y0, to = from, raf = 0;
      items.forEach(i => { i.style.transition = "transform 0.2s ease"; });
      item.style.transition = "none"; item.classList.add("b-glisse");
      try { grip.setPointerCapture(e.pointerId); } catch { /* sans capture */ }
      const place = () => {
        const d = (yNow - y0) + (defil.scrollTop - s0);
        item.style.transform = `translateY(${d}px)`;
        const centre = mids[from] + d;
        let t = 0; mids.forEach((m, k) => { if (k !== from && m < centre) t++; });
        to = t;
        items.forEach((it, k) => {
          if (k === from) return;
          const m = k < from ? k : k - 1;
          it.style.transform = k < from && m >= t ? `translateY(${H}px)` : k > from && m < t ? `translateY(${-H}px)` : "";
        });
      };
      const boucle = () => {
        const r = defil === document.scrollingElement ? { top: 0, bottom: window.innerHeight } : defil.getBoundingClientRect();
        if (yNow < r.top + 60) defil.scrollTop -= Math.ceil((r.top + 60 - yNow) / 5);
        else if (yNow > r.bottom - 60) defil.scrollTop += Math.ceil((yNow - (r.bottom - 60)) / 5);
        place(); raf = requestAnimationFrame(boucle);
      };
      raf = requestAnimationFrame(boucle);
      const bouge = ev => { if (ev.pointerId === e.pointerId) yNow = ev.clientY; };
      const fin = ev => {
        if (ev.pointerId !== e.pointerId) return;
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", bouge);
        window.removeEventListener("pointerup", fin);
        window.removeEventListener("pointercancel", fin);
        items.forEach(i => { i.style.transition = ""; i.style.transform = ""; });
        item.classList.remove("b-glisse");
        const topAvant = item.getBoundingClientRect().top;
        if (replier) replier.retire();
        const ordre = ev.type !== "pointercancel" && to !== from;
        if (ordre) onDrop(from, to);
        if (replier) {                                       // la séance déposée reste là où le doigt l'a lâchée
          const apres = [...parent.children].filter(n => n.matches(itemSel))[ordre ? to : from];
          if (apres) defil.scrollTop += apres.getBoundingClientRect().top - topAvant;
        }
      };
      window.addEventListener("pointermove", bouge);
      window.addEventListener("pointerup", fin);
      window.addEventListener("pointercancel", fin);
    });
  });
}

function openBuilder(programId, prefill = null) {
  builderState = prefill
    ? prefill
    : programId
      ? JSON.parse(JSON.stringify(getPrograms().find(p => p.id === programId)))
      : newEmptyProgram();
  renderBuilder();
  builderModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeBuilder() {
  builderModal.classList.add("hidden");
  document.body.style.overflow = "";
}
document.getElementById("builder-close").addEventListener("click", closeBuilder);
builderModal.querySelector(".modal-backdrop").addEventListener("click", closeBuilder);

/* Suggestion pour un jour : complète les muscles du jour (isolation si les
   polys sont là), ou propose un polyarticulaire équilibrant (push/pull). */
function suggestForDay(day) {
  const profil = loadJSON(STORAGE_KEYS.profil, null) || {};
  const levels = { debutant: ["debutant"], intermediaire: ["debutant", "intermediaire"],
                   avance: ["debutant", "intermediaire", "avance"] }[profil.niveau] || null;
  const inDay = new Set(day.exercices.map(l => l.exercice.id));
  const pool = allExercisesForUI().filter(e => (!levels || levels.includes(e.niveau)) && !inDay.has(e.id));
  const groups = [...new Set(day.exercices.map(l => l.exercice.groupe))];
  if (groups.length === 0) return pool.find(e => e.type === "poly");
  // isolation manquante sur un muscle déjà travaillé ?
  for (const g of groups) {
    const hasIso = day.exercices.some(l => l.exercice.groupe === g && l.exercice.type === "iso");
    if (!hasIso) { const e = pool.find(x => x.groupe === g && x.type === "iso"); if (e) return e; }
  }
  // sinon : équilibre push/pull (pectoraux <-> dos)
  const balance = { pectoraux: "dos", dos: "pectoraux", quadriceps: "ischios-fessiers", "ischios-fessiers": "quadriceps" };
  for (const g of groups) {
    const opp = balance[g];
    if (opp && !groups.includes(opp)) { const e = pool.find(x => x.groupe === opp && x.type === "poly"); if (e) return e; }
  }
  return pool.find(e => e.groupe === groups[0]);
}

function builderLine(ex) {
  return {
    exercice: { id: ex.id, nom: ex.nom, groupe: ex.groupe, materiel: ex.materiel, niveau: ex.niveau, type: ex.type, videoQuery: ex.videoQuery },
    series: 3, reps: "8-12",
    repos: (typeof smartRest === "function" ? smartRest(ex) : 90) + " s",
    note: "", superset: false, prioritaire: false
  };
}

function renderBuilder() {
  const b = builderState;
  document.getElementById("builder-content").innerHTML = `
    <p class="kicker">Créateur de programme</p>
    <label class="edit-label">Nom du programme
      <input type="text" id="b-nom" value="${esc(b.nom)}" maxlength="60">
    </label>

    ${b.days.map((day, d) => `
      <div class="card b-day" data-d="${d}">
        <div class="b-day-head">
          ${b.days.length > 1 ? `<span class="b-day-grip" title="Glisser pour réordonner les séances" aria-label="Poignée : glisser pour réordonner">⠿</span>` : ""}
          <span class="day-num">${String(d + 1).padStart(2, "0")}</span>
          <input type="text" class="b-day-titre" data-d="${d}" value="${esc(day.titre)}" aria-label="Nom de la séance">
          ${b.days.length > 1 ? `<span class="b-day-mv">
            <button class="btn-ic b-day-up" data-d="${d}" title="Monter la séance" aria-label="Monter la séance" ${d === 0 ? "disabled" : ""}>▲</button>
            <button class="btn-ic b-day-down" data-d="${d}" title="Descendre la séance" aria-label="Descendre la séance" ${d === b.days.length - 1 ? "disabled" : ""}>▼</button></span>` : ""}
          ${b.days.length > 1 ? `<button class="btn btn-danger-ghost btn-sm b-day-del" data-d="${d}" title="Supprimer la séance">${icon("trash")}</button>` : ""}
        </div>

        ${day.exercices.length === 0 ? `<p class="video-hint">Séance vide — ajoute des exercices.</p>` : ""}
        ${day.exercices.map((l, i) => `
          <div class="b-row ${l.superset ? "b-superset" : ""}" data-d="${d}" data-i="${i}">
            <span class="b-grip" title="Glisser pour réordonner">⠿</span>
            <div class="b-row-main">
              <div class="b-row-name">
                <button class="linklike b-fiche" data-exid="${esc(l.exercice.id)}">${esc(l.exercice.nom)}</button>
                ${l.superset ? `<span class="tag tag-custom">${icon("link")} superset avec la suivante</span>` : ""}
              </div>
              <div class="b-row-fields">
                <label>Séries <input type="number" min="1" max="10" value="${l.series}" data-f="series" data-d="${d}" data-i="${i}"></label>
                <label>Reps <input type="text" value="${esc(l.reps)}" data-f="reps" data-d="${d}" data-i="${i}" size="6"></label>
                <label>Repos <input type="text" value="${esc(l.repos)}" data-f="repos" data-d="${d}" data-i="${i}" size="9"></label>
                <label class="b-note-label">Note <input type="text" value="${esc(l.note || "")}" placeholder="cue, tempo…" data-f="note" data-d="${d}" data-i="${i}"></label>
              </div>
              <div class="b-alts">
                <span class="b-alts-lab">${icon("swap")} Alternatives</span>
                ${(l.alternatives || []).map((a, k) => `<span class="b-alt">${esc(a.nom)}<button type="button" class="b-alt-del" data-d="${d}" data-i="${i}" data-k="${k}" aria-label="Retirer l'alternative ${esc(a.nom)}">×</button></span>`).join("")}
                <button type="button" class="btn btn-ghost btn-sm b-alt-add" data-d="${d}" data-i="${i}" aria-label="Ajouter une alternative">${icon("plus")}</button>
              </div>
            </div>
            <div class="b-row-actions">
              <button class="btn-ic b-up" data-d="${d}" data-i="${i}" title="Monter" ${i === 0 ? "disabled" : ""}>▲</button>
              <button class="btn-ic b-down" data-d="${d}" data-i="${i}" title="Descendre" ${i === day.exercices.length - 1 ? "disabled" : ""}>▼</button>
              ${b.days.length > 1 ? `<select class="b-mv-day" data-d="${d}" data-i="${i}" title="Déplacer vers une autre séance" aria-label="Déplacer vers une autre séance">
                <option value="">⇄</option>${b.days.map((x, k) => k === d ? "" : `<option value="${k}">→ ${k + 1}</option>`).join("")}</select>` : ""}
              <button class="btn-ic b-ss" data-d="${d}" data-i="${i}" title="Superset avec le suivant">${icon("link")}</button>
              <button class="btn-ic b-swap" data-d="${d}" data-i="${i}" title="Remplacer par une alternative">${icon("swap")}</button>
              <button class="btn-ic b-del" data-d="${d}" data-i="${i}" title="Retirer">${icon("trash")}</button>
            </div>
          </div>`).join("")}

        <div class="program-actions">
          <button class="btn btn-ghost btn-sm b-add-ex" data-d="${d}">${icon("plus")} Exercice</button>
          <button class="btn btn-ghost btn-sm b-suggest" data-d="${d}">${icon("bolt")} Suggestion</button>
        </div>
      </div>`).join("")}

    <button class="btn btn-ghost" id="b-add-day">${icon("plus")} Ajouter une séance</button>

    <div class="program-actions b-footer">
      <button class="btn btn-primary" id="b-save-activate">Enregistrer et activer</button>
      <button class="btn btn-ghost" id="b-save">Enregistrer</button>
      <button class="btn btn-danger-ghost" id="b-cancel">Annuler</button>
    </div>
  `;

  const box = document.getElementById("builder-content");
  const rerender = () => renderBuilder();

  box.querySelector("#b-nom").addEventListener("input", e => { b.nom = e.target.value; });
  box.querySelectorAll(".b-day-titre").forEach(inp =>
    inp.addEventListener("input", e => { b.days[+inp.dataset.d].titre = e.target.value; }));
  box.querySelectorAll(".b-day-del").forEach(btn =>
    btn.addEventListener("click", () => {
      if (!confirm("Supprimer cette séance du programme ?")) return;
      b.days.splice(+btn.dataset.d, 1);
      b.days.forEach((day, i) => { day.numero = i + 1; });
      rerender();
    }));
  box.querySelectorAll("input[data-f]").forEach(inp =>
    inp.addEventListener("change", () => {
      const l = b.days[+inp.dataset.d].exercices[+inp.dataset.i];
      if (inp.dataset.f === "series") l.series = Math.max(1, Math.min(10, parseInt(inp.value, 10) || 3));
      else l[inp.dataset.f] = inp.value;
    }));
  box.querySelectorAll(".b-fiche").forEach(btn =>
    btn.addEventListener("click", () => openExercise(btn.dataset.exid)));
  box.querySelectorAll(".b-del").forEach(btn =>
    btn.addEventListener("click", () => { b.days[+btn.dataset.d].exercices.splice(+btn.dataset.i, 1); rerender(); }));
  box.querySelectorAll(".b-up").forEach(btn =>
    btn.addEventListener("click", () => {
      const arr = b.days[+btn.dataset.d].exercices, i = +btn.dataset.i;
      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; rerender();
    }));
  box.querySelectorAll(".b-down").forEach(btn =>
    btn.addEventListener("click", () => {
      const arr = b.days[+btn.dataset.d].exercices, i = +btn.dataset.i;
      [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; rerender();
    }));
  /* Déplacer un exercice vers une autre séance (ce que le glisser HTML5 permettait à la souris). */
  box.querySelectorAll(".b-mv-day").forEach(sel =>
    sel.addEventListener("change", () => {
      if (sel.value === "") return;
      const de = b.days[+sel.dataset.d].exercices;
      const [m] = de.splice(+sel.dataset.i, 1);
      m.superset = false;
      b.days[+sel.value].exercices.push(m);
      rerender();
    }));
  box.querySelectorAll(".b-ss").forEach(btn =>
    btn.addEventListener("click", () => {
      const l = b.days[+btn.dataset.d].exercices[+btn.dataset.i];
      l.superset = !l.superset; rerender();
    }));
  /* Remplacer un exercice : on choisit soi-même dans la bibliothèque (plus de choix automatique). */
  box.querySelectorAll(".b-swap").forEach(btn =>
    btn.addEventListener("click", () => {
      const arr = b.days[+btn.dataset.d].exercices;
      const l = arr[+btn.dataset.i];
      openPicker(alt => {
        arr[+btn.dataset.i] = { ...l, exercice: builderLine(alt).exercice, repos: builderLine(alt).repos };
        rerender();
      });
    }));
  /* Alternatives choisies : l'exercice de secours quand le matériel n'est pas libre. */
  box.querySelectorAll(".b-alt-add").forEach(btn =>
    btn.addEventListener("click", () => {
      const l = b.days[+btn.dataset.d].exercices[+btn.dataset.i];
      openPicker(alt => {
        if (alt.id === l.exercice.id || (l.alternatives || []).some(a => a.id === alt.id)) return;
        l.alternatives = [...(l.alternatives || []), builderLine(alt).exercice];
        rerender();
      });
    }));
  box.querySelectorAll(".b-alt-del").forEach(btn =>
    btn.addEventListener("click", () => {
      const l = b.days[+btn.dataset.d].exercices[+btn.dataset.i];
      l.alternatives = (l.alternatives || []).filter((_, k) => k !== +btn.dataset.k);
      rerender();
    }));
  box.querySelectorAll(".b-add-ex").forEach(btn =>
    btn.addEventListener("click", () => {
      const d = +btn.dataset.d;
      openPicker(ex => { b.days[d].exercices.push(builderLine(ex)); rerender(); });
    }));
  box.querySelectorAll(".b-suggest").forEach(btn =>
    btn.addEventListener("click", () => {
      const day = b.days[+btn.dataset.d];
      const ex = suggestForDay(day);
      if (!ex) { alert("Rien à suggérer de plus pour cette séance."); return; }
      day.exercices.push(builderLine(ex));
      rerender();
    }));
  document.getElementById("b-add-day").addEventListener("click", () => {
    b.days.push({ numero: b.days.length + 1, titre: "Séance " + (b.days.length + 1), focus: "", exercices: [] });
    rerender();
  });

  /* Réordonner les SÉANCES : flèches, ou poignée au doigt / à la souris. */
  const deplaceSeance = (de, vers) => {
    if (vers < 0 || vers >= b.days.length || de === vers) return;
    const [m] = b.days.splice(de, 1);
    b.days.splice(vers, 0, m);
    b.days.forEach((day, i) => { day.numero = i + 1; });
    rerender();
  };
  box.querySelectorAll(".b-day-up").forEach(btn => btn.addEventListener("click", () => deplaceSeance(+btn.dataset.d, +btn.dataset.d - 1)));
  box.querySelectorAll(".b-day-down").forEach(btn => btn.addEventListener("click", () => deplaceSeance(+btn.dataset.d, +btn.dataset.d + 1)));
  dragPointeur(box, ".b-day", ".b-day-grip", () => box, deplaceSeance,
    { ajoute: () => box.classList.add("b-jours-replies"), retire: () => box.classList.remove("b-jours-replies") });
  /* Réordonner les EXERCICES d'une séance : même poignée (marche au doigt, ce que le glisser HTML5 ne faisait pas). */
  box.querySelectorAll(".b-day").forEach(jour => {
    const d = +jour.dataset.d;
    dragPointeur(jour, ".b-row", ".b-grip", () => jour, (de, vers) => {
      const arr = b.days[d].exercices;
      if (vers < 0 || vers >= arr.length || de === vers) return;
      const [m] = arr.splice(de, 1); arr.splice(vers, 0, m); rerender();
    });
  });

  const save = activate => {
    b.nom = b.nom.trim() || "Mon programme";
    b.jours = b.days.length;
    b.days.forEach((day, i) => {
      day.numero = i + 1;
      day.focus = day.focus || [...new Set(day.exercices.map(l => LABELS.groupes[l.exercice.groupe]))].slice(0, 4).join(" · ");
    });
    if (b.days.every(d => d.exercices.length === 0)) { alert("Ajoute au moins un exercice avant d'enregistrer."); return; }
    upsertProgram(b);
    if (activate || b.id === getActiveId()) { setActiveProgram(b); renderProgram(b); }
    closeBuilder();
    renderProgramsPanel();
  };
  document.getElementById("b-save").addEventListener("click", () => save(false));
  document.getElementById("b-save-activate").addEventListener("click", () => save(true));
  document.getElementById("b-cancel").addEventListener("click", closeBuilder);
}

/* ---------- « Refaire ça » : programme depuis une séance passée ---------- */
function createProgramFromRecord(record) {
  const p = newEmptyProgram();
  p.nom = record.nom.replace(/ \(bis\)$/, "") + " — programme";
  p.source = "seance";
  p.days[0].titre = record.nom;
  p.days[0].exercices = record.exercises.map(ex => {
    const ref = allExercisesForUI().find(e => e.id === ex.exId) ||
      { id: ex.exId, nom: ex.nom, groupe: ex.groupe, materiel: "halteres", niveau: "intermediaire", type: "iso" };
    const line = builderLine(ref);
    const reps = ex.sets.map(s => s.reps);
    line.series = ex.sets.length;
    line.reps = Math.min(...reps) === Math.max(...reps) ? String(reps[0]) : `${Math.min(...reps)}-${Math.max(...reps)}`;
    return line;
  });
  openBuilder(null, p);
}

/* Au chargement, app.js a dessiné le programme actif avant que la liste des programmes existe :
   on redessine maintenant que les dossiers peuvent être construits. */
(function () { const a = loadJSON(STORAGE_KEYS.program, null); if (a && typeof renderProgram === "function") renderProgram(a); })();
