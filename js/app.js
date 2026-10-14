/* =========================================================
   GymCoach — Logique de l'interface
   (design NTC : chips, cartes-posters, collections)
   ========================================================= */

/* ---------- Stockage local (structure inchangée) ---------- */
const STORAGE_KEYS = {
  custom: "gymcoach.customExercises",
  videos: "gymcoach.videoOverrides",
  program: "gymcoach.program",
  profil: "gymcoach.profil"
};

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCustomExercises() { return loadJSON(STORAGE_KEYS.custom, []); }
function getVideoOverrides() { return loadJSON(STORAGE_KEYS.videos, {}); }

/* ---------- Vidéos ---------- */
function parseYouTubeId(url) {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

function getVideoIdFor(ex) {
  const overrides = getVideoOverrides();
  if (overrides[ex.id]) return overrides[ex.id];
  if (ex.videoUrl) return parseYouTubeId(ex.videoUrl);
  return null;
}

function youtubeSearchUrl(ex) {
  return "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(ex.videoQuery || (ex.nom + " technique musculation"));
}

/* ---------- Utilitaires ---------- */
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function allExercisesForUI() {
  return EXERCISES.concat(getCustomExercises());
}

function normalize(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/* Durée estimée d'une séance. On réutilise l'estimateur de program.js
   (échauffement + effort + repos + installation) pour que le chiffre
   affiché corresponde à celui contre lequel le générateur a calé. */
function estimateDayMinutes(day) {
  if (typeof dureeSeanceMinutes === "function") return dureeSeanceMinutes(day.exercices);
  let sec = 8 * 60;
  for (const l of day.exercices) {
    const m = String(l.repos || "").match(/(\d+)/);
    const rest = m ? (/min/i.test(l.repos) ? +m[1] * 60 : +m[1]) : 90;
    sec += (Number(l.series) || 0) * (40 + rest) + 45;
  }
  return Math.max(10, Math.round(sec / 60));
}

/* ---------- Navigation (nav desktop + barre mobile synchronisées) ---------- */
function activateView(view) {
  document.querySelectorAll(".tab").forEach(t =>
    t.classList.toggle("active", t.dataset.view === view));
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById("view-" + view).classList.add("active");
  window.scrollTo({ top: 0 });
}

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => activateView(tab.dataset.view));
});

/* ---------- Filtres : chips → selects cachés ---------- */
document.querySelectorAll(".chip-row").forEach(row => {
  row.addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip || !row.dataset.for) return; // rangées sans filtre associé (suggestions)
    row.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    document.getElementById(row.dataset.for).value = chip.dataset.value;
    renderLibrary();
  });
});

/* ---------- Bibliothèque ---------- */
const grid = document.getElementById("exercise-grid");
const searchInput = document.getElementById("search");
const filterGroupe = document.getElementById("filter-groupe");
const filterMateriel = document.getElementById("filter-materiel");
const filterNiveau = document.getElementById("filter-niveau");
const resultCount = document.getElementById("result-count");

/* Carte-poster : dégradé par groupe, pictogramme géant en filigrane,
   badge de niveau en overlay, titre display en bas */
function exerciseCardHTML(ex) {
  return `
    <article class="ex-card grad-${esc(ex.groupe)}" data-id="${esc(ex.id)}" tabindex="0"
             role="button" aria-label="${esc(ex.nom)}">
      <span class="ex-card-bg" aria-hidden="true">${GROUP_ICONS[ex.groupe] || "🏋️"}</span>
      <div class="ex-card-top">
        <span class="badge badge-${esc(ex.niveau)}">${LABELS.niveaux[ex.niveau]}</span>
        ${ex.custom ? '<span class="tag tag-custom">Perso</span>' : ""}
        ${typeof favButton === "function" ? favButton(ex.id, "fav-card") : ""}
      </div>
      <div class="ex-card-info">
        <p class="ex-card-group">${LABELS.groupes[ex.groupe]} · ${LABELS.materiel[ex.materiel]}</p>
        <h3>${esc(ex.nom)}</h3>
      </div>
    </article>`;
}

function bindCardClicks(container) {
  container.querySelectorAll(".ex-card").forEach(card => {
    // l'étoile favori vit dans la carte : elle ne doit pas ouvrir la fiche
    card.addEventListener("click", e => {
      if (e.target.closest(".fav-btn")) return;
      openExercise(card.dataset.id);
    });
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openExercise(card.dataset.id); }
    });
  });
}

/* État local de la bibliothèque (filtre favoris) */
const libState = { favOnly: false };

function renderLibrary() {
  const kicker = document.getElementById("biblio-kicker");
  if (kicker) kicker.textContent = "Bibliothèque · " + allExercisesForUI().length + " mouvements";
  const q = normalize(searchInput.value.trim());
  const g = filterGroupe.value, m = filterMateriel.value, n = filterNiveau.value;

  let list = allExercisesForUI().filter(ex => {
    if (g && ex.groupe !== g) return false;
    if (m && ex.materiel !== m) return false;
    if (n && ex.niveau !== n) return false;
    if (q && !exMatches(ex, q)) return false;
    if (libState.favOnly && typeof isFavorite === "function" && !isFavorite(ex.id)) return false;
    return true;
  });
  // les favoris passent devant (G1)
  if (typeof favoritesFirst === "function") list = favoritesFirst(list);

  resultCount.textContent = list.length + " exercice" + (list.length > 1 ? "s" : "") + " trouvé" + (list.length > 1 ? "s" : "");
  grid.innerHTML = list.length
    ? list.map(exerciseCardHTML).join("")
    : `<p class="video-hint">Aucun exercice ne correspond${libState.favOnly ? " parmi tes favoris" : ""}.</p>`;
  bindCardClicks(grid);

  // résumé des filtres secondaires, visible même repliés
  const state = document.getElementById("lib-filter-state");
  if (state) {
    const parts = [];
    if (m) parts.push(LABELS.materiel[m]);
    if (n) parts.push(LABELS.niveaux[n]);
    state.textContent = parts.length ? parts.join(" · ") : "tout";
  }
}

document.getElementById("goto-ajouter").addEventListener("click", () => activateView("ajouter"));

document.getElementById("fav-filter").addEventListener("click", e => {
  libState.favOnly = !libState.favOnly;
  e.currentTarget.classList.toggle("btn-primary", libState.favOnly);
  e.currentTarget.setAttribute("aria-pressed", String(libState.favOnly));
  e.currentTarget.textContent = (libState.favOnly ? "★" : "☆") + " Favoris";
  renderLibrary();
});

/* Revenir sur l'onglet rafraîchit la grille : les favoris ajoutés depuis
   une fiche remontent alors en tête (sans faire sauter les cartes au tap). */
document.querySelectorAll('.tab[data-view="bibliotheque"]').forEach(t =>
  t.addEventListener("click", renderLibrary));

searchInput.addEventListener("input", renderLibrary);
[filterGroupe, filterMateriel, filterNiveau].forEach(el =>
  el.addEventListener("input", renderLibrary));

/* Alternatives : même groupe musculaire, en privilégiant un matériel
   différent puis le même type de mouvement (poly/iso).
   Un favori du même type remonte en tête (G1). */
function findAlternatives(ex, count = 2) {
  const fav = (typeof getFavorites === "function") ? new Set(getFavorites()) : new Set();
  return allExercisesForUI()
    .filter(e => e.groupe === ex.groupe && e.id !== ex.id)
    .map(e => {
      let score = 0;
      if (e.materiel !== ex.materiel) score += 2;
      if (e.type === ex.type) score += 1;
      if (e.niveau !== ex.niveau) score += 0.5;
      if (fav.has(e.id)) score += 4;            // favori : passe devant
      if (fav.has(e.id) && e.type === ex.type) score += 2; // favori « de type proche »
      return { e, score };
    })
    .sort((x, y) => y.score - x.score)
    .slice(0, count)
    .map(x => x.e);
}

/* ---------- Modale détail exercice ---------- */
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

function openExercise(id) {
  const ex = allExercisesForUI().find(e => e.id === id);
  if (!ex) return;

  const videoId = getVideoIdFor(ex);
  const videoBlock = videoId
    ? `<div class="video-wrap">
         <iframe src="https://www.youtube-nocookie.com/embed/${esc(videoId)}"
                 title="Vidéo de démonstration : ${esc(ex.nom)}"
                 allowfullscreen loading="lazy"></iframe>
       </div>
       <p class="video-hint">Vidéo intégrée.
         <button class="linklike" id="video-change">Changer la vidéo</button> ·
         <a class="linklike" href="${youtubeSearchUrl(ex)}" target="_blank" rel="noopener">Voir d'autres vidéos</a></p>`
    : `<div class="video-placeholder">
         <p><span class="ico">🎬 </span><strong>Vidéo de démonstration</strong></p>
         <a class="btn btn-primary" href="${youtubeSearchUrl(ex)}" target="_blank" rel="noopener">
           ▶ Voir la démonstration sur YouTube
         </a>
         <p class="video-hint">Tu as trouvé la vidéo parfaite ? Colle son lien ci-dessous pour l'intégrer directement dans cette fiche :</p>
         <div class="video-form">
           <input type="url" id="video-url-input" placeholder="https://www.youtube.com/watch?v=…">
           <button class="btn btn-ghost" id="video-save">Intégrer</button>
         </div>
         <p class="feedback" id="video-feedback"></p>
       </div>`;

  const disc = (typeof disclosure === "function") ? disclosure : null;
  /* Repli par défaut : on ne montre que l'essentiel (schéma + à quoi ça sert),
     le reste se déplie à la demande et s'explique en se dépliant. */
  const block = (key, opts) => disc ? disc("ex." + ex.id + "." + key, opts) : opts.detail;

  const alts = findAlternatives(ex, 3);

  modalContent.innerHTML = `
    <div class="modal-header">
      <span class="ex-icon big">${GROUP_ICONS[ex.groupe] || "🏋️"}</span>
      <div>
        <h2>${esc(ex.nom)}</h2>
        <div class="ex-tags">
          <span class="tag">${LABELS.groupes[ex.groupe]}</span>
          <span class="tag">${LABELS.materiel[ex.materiel]}</span>
          <span class="badge badge-${esc(ex.niveau)}">${LABELS.niveaux[ex.niveau]}</span>
          ${ex.type ? `<span class="tag">${ex.type === "poly" ? "Polyarticulaire" : "Isolation"}</span>` : ""}
        </div>
      </div>
      ${typeof favButton === "function" ? favButton(ex.id, "fav-fiche") : ""}
    </div>

    ${typeof motionSVG === "function" ? motionSVG(ex) : ""}

    <p class="ex-desc">${esc(ex.description || "")}</p>
    ${ex.muscles ? `<p class="ex-muscles-line"><strong>Muscles :</strong> ${esc(ex.muscles)}</p>` : ""}

    ${(ex.execution && ex.execution.length) ? block("exec", {
      summary: `<span class="disc-title">Comment l'exécuter</span><span class="disc-meta">${ex.execution.length} étapes</span>`,
      what: `La technique avant la charge : ces étapes décrivent la position de départ, le trajet
        du mouvement et le moment où souffler. Une répétition propre travaille le muscle visé ;
        une répétition sale déplace le travail ailleurs et use les articulations.`,
      detail: `<ol class="steps">${ex.execution.map(s => `<li>${esc(s)}</li>`).join("")}</ol>`
    }) : ""}

    ${(ex.erreurs && ex.erreurs.length) ? block("err", {
      summary: `<span class="disc-title">Erreurs à éviter</span><span class="disc-meta">${ex.erreurs.length} pièges</span>`,
      what: `Les fautes les plus fréquentes sur ce mouvement. Les connaître à l'avance évite
        de s'installer dans une mauvaise habitude — et c'est ce qui protège tes articulations.`,
      detail: `<ul class="mistakes">${ex.erreurs.map(s => `<li>${esc(s)}</li>`).join("")}</ul>`
    }) : ""}

    ${block("video", {
      summary: `<span class="disc-title">Vidéo de démonstration</span><span class="disc-meta">${videoId ? "intégrée" : "recherche YouTube"}</span>`,
      what: `Voir le geste vaut mille descriptions. Le bouton ouvre une recherche YouTube ciblée
        sur cet exercice ; si tu trouves LA bonne vidéo, colle son lien et elle reste attachée
        à cette fiche pour toujours.`,
      detail: videoBlock
    })}

    ${typeof exerciseStatsBlock === "function" ? exerciseStatsBlock(ex) : ""}

    ${alts.length ? block("alt", {
      summary: `<span class="disc-title">Alternatives</span><span class="disc-meta">${alts.length} au même muscle</span>`,
      what: `Machine occupée, douleur, ou simple envie de varier : ces mouvements travaillent le
        même muscle par un autre chemin. Tes favoris ★ apparaissent en premier.`,
      detail: `<div class="alt-list">${alts.map(a2 => `
        <button class="picker-item alt-open" data-exid="${esc(a2.id)}">
          <span>${typeof isFavorite === "function" && isFavorite(a2.id) ? "★ " : ""}${esc(a2.nom)}</span>
          <span class="tag">${LABELS.materiel[a2.materiel]} · ${a2.type === "poly" ? "Poly" : "Iso"}</span>
        </button>`).join("")}</div>`
    }) : ""}

    ${ex.custom ? `<button class="btn btn-danger" id="delete-custom">🗑 Supprimer cet exercice personnalisé</button>` : ""}
  `;

  modalContent.querySelectorAll(".alt-open").forEach(b =>
    b.addEventListener("click", () => openExercise(b.dataset.exid)));

  const saveBtn = modalContent.querySelector("#video-save");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const url = modalContent.querySelector("#video-url-input").value.trim();
      const vid = parseYouTubeId(url);
      const feedback = modalContent.querySelector("#video-feedback");
      if (!vid) {
        feedback.textContent = "Lien YouTube non reconnu — utilise un lien du type youtube.com/watch?v=… ou youtu.be/…";
        return;
      }
      const overrides = getVideoOverrides();
      overrides[ex.id] = vid;
      saveJSON(STORAGE_KEYS.videos, overrides);
      openExercise(ex.id); // recharge la fiche avec la vidéo intégrée
    });
  }

  const changeBtn = modalContent.querySelector("#video-change");
  if (changeBtn) {
    changeBtn.addEventListener("click", () => {
      const overrides = getVideoOverrides();
      delete overrides[ex.id];
      saveJSON(STORAGE_KEYS.videos, overrides);
      openExercise(ex.id);
    });
  }

  const delBtn = modalContent.querySelector("#delete-custom");
  if (delBtn) {
    delBtn.addEventListener("click", () => {
      if (!confirm("Supprimer définitivement « " + ex.nom + " » ?")) return;
      saveJSON(STORAGE_KEYS.custom, getCustomExercises().filter(e => e.id !== ex.id));
      closeModal();
      renderLibrary();
      renderCustomList();
    });
  }

  /* Sous-fenêtre : on n'immobilise PAS la page — la séance derrière
     reste visible et pilotable, le chrono continue de tourner. */
  if (typeof openSheet === "function") openSheet();
  else modal.classList.remove("hidden");
}

function closeModal() {
  if (typeof closeSheet === "function") closeSheet();
  else modal.classList.add("hidden");
}
modal.querySelector(".modal-close").addEventListener("click", closeModal);
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  // ne ferme la sous-fenêtre que si aucune vraie modale n'est ouverte au-dessus
  const blocking = ["picker", "builder", "session-modal", "onboarding"]
    .some(id => { const el = document.getElementById(id); return el && !el.classList.contains("hidden"); });
  if (!blocking) closeModal();
});

/* ---------- Ajout d'exercice personnalisé ---------- */
const addForm = document.getElementById("add-form");
const addFeedback = document.getElementById("add-feedback");

/* Anti-doublon : si le nom saisi correspond à un exercice existant
   (même sous un autre nom / en anglais), on propose de l'utiliser. */
let duplicateOverrideFor = null;

function findDuplicate(nom) {
  const nomN = normalize(nom);
  if (nomN.length < 4) return null;
  return allExercisesForUI().find(e =>
    [e.nom, ...exAliases(e)].some(n => {
      const nN = normalize(n);
      return nN === nomN || (nomN.length >= 6 && (nN.includes(nomN) || nomN.includes(nN)));
    }));
}

addForm.addEventListener("submit", e => {
  e.preventDefault();
  const nom = document.getElementById("a-nom").value.trim();
  if (!nom) return;

  const dup = findDuplicate(nom);
  if (dup && duplicateOverrideFor !== nom) {
    addFeedback.innerHTML = `« ${esc(nom)} » semble déjà exister sous
      <strong>« ${esc(dup.nom)} »</strong> —
      <button type="button" class="linklike" id="dup-open">voir la fiche</button> ·
      <button type="button" class="linklike" id="dup-force">ajouter quand même</button>`;
    document.getElementById("dup-open").addEventListener("click", () => openExercise(dup.id));
    document.getElementById("dup-force").addEventListener("click", () => {
      duplicateOverrideFor = nom;
      addForm.requestSubmit();
    });
    return;
  }
  duplicateOverrideFor = null;

  const ex = {
    id: "perso-" + Date.now(),
    nom,
    groupe: document.getElementById("a-groupe").value,
    materiel: document.getElementById("a-materiel").value,
    niveau: document.getElementById("a-niveau").value,
    type: "iso",
    muscles: LABELS.groupes[document.getElementById("a-groupe").value],
    description: document.getElementById("a-description").value.trim(),
    execution: [],
    erreurs: [],
    alias: document.getElementById("a-alias").value.split(",").map(s => s.trim()).filter(Boolean),
    videoUrl: document.getElementById("a-video").value.trim() || null,
    videoQuery: nom + " technique musculation",
    custom: true
  };

  const list = getCustomExercises();
  list.push(ex);
  saveJSON(STORAGE_KEYS.custom, list);

  addForm.reset();
  addFeedback.textContent = "✅ « " + nom + " » ajouté à ta bibliothèque !";
  setTimeout(() => (addFeedback.textContent = ""), 4000);
  renderLibrary();
  renderCustomList();
});

function renderCustomList() {
  const list = getCustomExercises();
  const container = document.getElementById("custom-list");
  if (list.length === 0) {
    container.innerHTML = "";
    return;
  }
  container.innerHTML = `
    <h2>Tes exercices (${list.length})</h2>
    <div class="grid">${list.map(exerciseCardHTML).join("")}</div>`;
  bindCardClicks(container);
}

/* ---------- Programme personnalisé ---------- */
const programForm = document.getElementById("program-form");
const programOutput = document.getElementById("program-output");

/* ---------- Répartition sur mesure des séances (D1) ---------- */
const REPART_FIELDS = {
  upper: "rep-upper", lower: "rep-lower", push: "rep-push",
  pull: "rep-pull", legs: "rep-legs", fullbody: "rep-fullbody"
};
const REPART_LABELS = {
  upper: "Haut du corps", lower: "Bas du corps", push: "Push",
  pull: "Pull", legs: "Jambes", fullbody: "Full body"
};

function readRepartition() {
  const rep = {};
  for (const [k, id] of Object.entries(REPART_FIELDS))
    rep[k] = Math.max(0, parseInt(document.getElementById(id).value, 10) || 0);
  return rep;
}

/* Avertissements d'équilibre : on n'interdit rien, on prévient. */
function repartitionWarnings(rep) {
  const w = [];
  const haut = rep.upper + rep.push + rep.pull;
  const bas = rep.lower + rep.legs;
  const total = Object.values(rep).reduce((a, b) => a + b, 0);
  if (total === 0) return w;
  if (bas === 0 && rep.fullbody === 0)
    w.push("Aucune séance pour le bas du corps : jambes et fessiers sont les plus gros muscles du corps, ne les saute pas.");
  else if (haut >= bas * 3 && bas > 0)
    w.push(`${haut} séances haut du corps pour ${bas} bas du corps : c'est très déséquilibré. Deux fois plus de haut que de bas est déjà un maximum raisonnable.`);
  if (haut === 0 && rep.fullbody === 0)
    w.push("Aucune séance pour le haut du corps sur la semaine.");
  if (rep.push > 0 && rep.pull === 0)
    w.push("Du push sans pull : le déséquilibre pectoraux/dos referme les épaules à la longue. Ajoute au moins une séance de tirage.");
  if (rep.pull > 0 && rep.push === 0)
    w.push("Du pull sans push : ajoute une séance de poussée pour équilibrer.");
  if (total >= 6 && rep.fullbody >= 4)
    w.push("Beaucoup de full body à haute fréquence : la récupération peut manquer. Alterne avec du haut/bas.");
  return w;
}

function updateRepartUI() {
  const custom = document.getElementById("p-split").value === "custom";
  const zone = document.getElementById("p-repartition");
  zone.classList.toggle("hidden", !custom);
  if (!custom) return;
  const jours = parseInt(document.getElementById("p-jours").value, 10);
  const rep = readRepartition();
  const total = Object.values(rep).reduce((a, b) => a + b, 0);
  const warns = repartitionWarnings(rep);
  const out = document.getElementById("repart-status");
  const detail = Object.entries(rep).filter(([, n]) => n > 0)
    .map(([k, n]) => `${n} × ${REPART_LABELS[k]}`).join(" + ");
  out.className = "repart-status" + (total === jours ? " repart-ok" : " repart-todo");
  out.innerHTML = `
    <strong>${total} / ${jours}</strong> séance${jours > 1 ? "s" : ""} réparties${detail ? " — " + esc(detail) : ""}
    ${total !== jours ? `<br><span class="repart-hint">${total < jours
      ? "Il reste " + (jours - total) + " séance(s) à placer (sinon je complèterai en full body)."
      : "Tu as placé plus de séances que prévu : je passerai le total à " + total + " séances/semaine."}</span>` : ""}
    ${warns.map(t => `<span class="repart-warn">⚠ ${esc(t)}</span>`).join("")}`;
}

document.getElementById("p-split").addEventListener("change", updateRepartUI);
document.getElementById("p-jours").addEventListener("change", updateRepartUI);
Object.values(REPART_FIELDS).forEach(id =>
  document.getElementById(id).addEventListener("input", updateRepartUI));

programForm.addEventListener("submit", e => {
  e.preventDefault();
  const splitPref = document.getElementById("p-split").value;
  const repartition = splitPref === "custom" ? readRepartition() : null;
  let jours = parseInt(document.getElementById("p-jours").value, 10);
  if (repartition) {
    const total = Object.values(repartition).reduce((a, b) => a + b, 0);
    if (total > jours) jours = total;                      // l'utilisateur décide
    else if (total < jours) repartition.fullbody += jours - total; // complète en full body
  }
  const params = {
    prenom: document.getElementById("p-prenom").value.trim(),
    objectif: document.getElementById("p-objectif").value,
    niveau: document.getElementById("p-niveau").value,
    jours,
    materiel: document.getElementById("p-materiel").value,
    priorite: document.getElementById("p-priorite").value || null,
    split: splitPref,
    repartition,
    duree: parseInt(document.getElementById("p-duree").value, 10) || null
  };
  saveJSON(STORAGE_KEYS.profil, params);
  const program = generateProgram(params);
  // le programme généré rejoint la liste et devient actif
  if (typeof registerGeneratedProgram === "function") registerGeneratedProgram(program);
  else saveJSON(STORAGE_KEYS.program, program);
  renderProgram(program);
  programOutput.scrollIntoView({ behavior: "smooth" });
});

/* Le programme s'affiche en « collection » de séances-cartes,
   avec durée estimée et nombre d'exercices */
/* Tableau volume/muscle : barre remplie, repère vertical sur la cible du
   muscle (réduite pour mollets/abdos/lombaires), débordement visible. */
function renderVolumeTable(vol) {
  const max = Math.max(...vol.map(v => Math.max(v.fractionnel, v.cible)), 1);
  return `<table class="volume-table"><tbody>${vol.map(v => {
    const pct = Math.min(100, (v.fractionnel / max) * 100);
    const ciblePct = Math.min(100, (v.cible / max) * 100);
    return `<tr class="vol-${v.statut}">
      <td class="vol-nom">${LABELS.groupes[v.groupe]}</td>
      <td class="vol-bar-cell">
        <span class="vol-bar" style="width:${pct}%"></span>
        <span class="vol-cible" style="left:${ciblePct}%" title="cible ${v.cible}"></span>
      </td>
      <td class="vol-val num">${v.fractionnel % 1 ? v.fractionnel.toFixed(1) : v.fractionnel}</td>
    </tr>`;
  }).join("")}</tbody></table>`;
}

function renderProgram(pr) {
  const materielLabels = {
    salle: "Salle de sport complète",
    halteres: "Haltères + banc",
    corps: "Poids du corps"
  };

  programOutput.innerHTML = `
    <div class="program-header card">
      <p class="kicker">${objIcon(pr.objectif)} ${esc(pr.objectifLabel || "Programme personnalisé")}</p>
      <h2>${esc(pr.nom || ("Programme de " + pr.prenom))}</h2>
      <p class="program-meta">
        ${LABELS.niveaux[pr.niveau]} · ${pr.jours} séances/semaine · ${pr.splitLabel ? pr.splitLabel + " · " : ""}${materielLabels[pr.materiel]}
        ${pr.duree ? " · ~" + pr.duree + " min/séance" : ""}
        ${pr.priorite ? " · Priorité : " + LABELS.groupes[pr.priorite] : ""}
        · Généré le ${esc(pr.genereLe)}
      </p>
      <div class="program-actions">
        <button class="btn btn-ghost" id="btn-regen">🔄 Régénérer</button>
        <button class="btn btn-ghost" id="btn-print">🖨 Imprimer / PDF</button>
      </div>
    </div>

    <div class="program-days">
      ${pr.days.map(day => `
        <div class="day-card card">
          <div class="day-head">
            <span class="day-num">${String(day.numero).padStart(2, "0")}</span>
            <div>
              <h3>${esc(day.titre)}</h3>
              <p class="day-focus">${esc(day.focus)}</p>
            </div>
          </div>
          <div class="day-meta">
            <span>⏱ <strong>~${estimateDayMinutes(day)} min</strong></span>
            <span>💪 <strong>${day.exercices.length}</strong> exercices</span>
          </div>
          <!-- 3 colonnes : tout tient à l'écran, aucun défilement latéral -->
          <table class="day-table">
            <thead>
              <tr><th>Exercice</th><th>Séries × reps</th><th>Repos</th></tr>
            </thead>
            <tbody>
              ${day.exercices.map(l => `
                <tr class="${l.prioritaire ? "row-priority" : ""}">
                  <td>
                    <button class="linklike ex-link" data-id="${esc(l.exercice.id)}">${esc(l.exercice.nom)}</button>
                    ${l.prioritaire ? '<span class="tag tag-custom">Priorité</span>' : ""}
                  </td>
                  <td class="num">${l.series} × ${esc(l.reps)}${l.rir ? `<span class="cell-sub">RIR ${esc(l.rir)}</span>` : ""}${l.tempo ? `<span class="cell-sub">${esc(l.tempo)}</span>` : ""}</td>
                  <td class="num">${esc(l.repos)}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>`).join("")}
    </div>

    ${typeof weeklyVolumeByMuscle === "function" ? (() => {
      const vol = weeklyVolumeByMuscle(pr);
      const cible = vol[0] ? vol[0].cible : 14;
      const sous = vol.filter(v => v.statut === "sous").map(v => LABELS.groupes[v.groupe]);
      const auto = typeof autoregulationHints === "function" ? autoregulationHints(pr) : [];
      return `
      <div class="card volume-card">
        ${typeof disclosure === "function" ? disclosure("prog.volume", {
          summary: `<span class="disc-title">Volume hebdomadaire par muscle</span><span class="disc-meta">cible ~${cible} séries</span>`,
          what: `C'est le nombre de séries par semaine et par muscle qui pilote la prise de muscle.
            Une série qui sollicite un muscle en second (triceps sur un développé) compte pour une demie.
            Le programme vise ~${cible} séries par muscle (plus pour le dos et les jambes, moins pour
            les bras, mollets, abdos et lombaires) ; le repère vertical marque la cible de chaque muscle.`,
          detail: renderVolumeTable(vol)
        }) : renderVolumeTable(vol)}
        ${sous.length ? `<p class="volume-warn">Encore sous la cible : ${sous.join(", ")}. Ajoute 1 à 2 séries sur ces muscles dans l'éditeur.</p>` : ""}
        ${auto.length ? `<div class="volume-auto"><p class="volume-auto-title">D'après tes dernières séances</p><ul>${
          auto.map(h => `<li class="auto-${h.sens}">${h.sens === "plus" ? "▲" : "▼"} <strong>${LABELS.groupes[h.groupe]}</strong> — ${esc(h.raison)}</li>`).join("")
        }</ul></div>` : ""}
      </div>`;
    })() : ""}

    <div class="card conseils-card">
      ${typeof disclosure === "function" ? disclosure("prog.conseils", {
        summary: `<span class="disc-title">Conseils — ${esc(pr.objectifLabel)}</span><span class="disc-meta">${pr.conseils.length} repères</span>`,
        what: `Le programme dit quoi faire ; ces repères disent comment le rendre efficace —
          alimentation, récupération et surcharge progressive comptent autant que les séries.`,
        detail: `<ul class="conseils">${pr.conseils.map(c => `<li>${esc(c)}</li>`).join("")}</ul>
          <p class="disclaimer">⚠️ Échauffe-toi 5-10 min avant chaque séance. Touche un exercice pour ouvrir sa fiche.</p>`
      }) : `<ul class="conseils">${pr.conseils.map(c => `<li>${esc(c)}</li>`).join("")}</ul>`}
    </div>
  `;

  programOutput.querySelectorAll(".ex-link").forEach(btn =>
    btn.addEventListener("click", () => openExercise(btn.dataset.id))
  );
  document.getElementById("btn-regen").addEventListener("click", () => {
    const params = loadJSON(STORAGE_KEYS.profil, null);
    if (!params) return;
    const program = generateProgram(params);
    if (typeof registerGeneratedProgram === "function") registerGeneratedProgram(program);
    else saveJSON(STORAGE_KEYS.program, program);
    renderProgram(program);
  });
  document.getElementById("btn-print").addEventListener("click", () => window.print());
}

/* ---------- Initialisation ---------- */
renderLibrary();
renderCustomList();

const savedProfil = loadJSON(STORAGE_KEYS.profil, null);
if (savedProfil) {
  document.getElementById("p-prenom").value = savedProfil.prenom || "";
  document.getElementById("p-objectif").value = savedProfil.objectif;
  document.getElementById("p-niveau").value = savedProfil.niveau;
  document.getElementById("p-jours").value = String(savedProfil.jours);
  document.getElementById("p-materiel").value = savedProfil.materiel;
  document.getElementById("p-priorite").value = savedProfil.priorite || "";
  document.getElementById("p-split").value = savedProfil.split || "auto";
  if (savedProfil.duree) document.getElementById("p-duree").value = String(savedProfil.duree);
  if (savedProfil.repartition)
    for (const [k, id] of Object.entries(REPART_FIELDS))
      document.getElementById(id).value = savedProfil.repartition[k] || 0;
}
updateRepartUI();
const savedProgram = loadJSON(STORAGE_KEYS.program, null);
if (savedProgram) renderProgram(savedProgram);
