/* =========================================================
   GymCoach — Logique de l'interface
   ========================================================= */

/* ---------- Stockage local ---------- */
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
/* Extrait l'identifiant d'une URL YouTube (watch, youtu.be, shorts, embed). */
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

/* ---------- Navigation par onglets ---------- */
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById("view-" + tab.dataset.view).classList.add("active");
    window.scrollTo({ top: 0 });
  });
});

/* ---------- Bibliothèque ---------- */
const grid = document.getElementById("exercise-grid");
const searchInput = document.getElementById("search");
const filterGroupe = document.getElementById("filter-groupe");
const filterMateriel = document.getElementById("filter-materiel");
const filterNiveau = document.getElementById("filter-niveau");
const resultCount = document.getElementById("result-count");

function normalize(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function renderLibrary() {
  const q = normalize(searchInput.value.trim());
  const g = filterGroupe.value, m = filterMateriel.value, n = filterNiveau.value;

  const list = allExercisesForUI().filter(ex => {
    if (g && ex.groupe !== g) return false;
    if (m && ex.materiel !== m) return false;
    if (n && ex.niveau !== n) return false;
    if (q && !normalize(ex.nom + " " + (ex.muscles || "")).includes(q)) return false;
    return true;
  });

  resultCount.textContent = list.length + " exercice" + (list.length > 1 ? "s" : "") + " trouvé" + (list.length > 1 ? "s" : "");

  grid.innerHTML = list.map(ex => `
    <article class="ex-card" data-id="${esc(ex.id)}">
      <div class="ex-card-head">
        <span class="ex-icon">${GROUP_ICONS[ex.groupe] || "🏋️"}</span>
        <span class="badge badge-${esc(ex.niveau)}">${LABELS.niveaux[ex.niveau]}</span>
      </div>
      <h3>${esc(ex.nom)}</h3>
      <p class="ex-muscles">${esc(ex.muscles || LABELS.groupes[ex.groupe])}</p>
      <div class="ex-tags">
        <span class="tag">${LABELS.groupes[ex.groupe]}</span>
        <span class="tag">${LABELS.materiel[ex.materiel]}</span>
        ${ex.custom ? '<span class="tag tag-custom">Perso</span>' : ""}
      </div>
      <button class="btn btn-ghost">📋 Fiche + 🎬 Vidéo</button>
    </article>
  `).join("");

  grid.querySelectorAll(".ex-card").forEach(card => {
    card.addEventListener("click", () => openExercise(card.dataset.id));
  });
}

[searchInput, filterGroupe, filterMateriel, filterNiveau].forEach(el =>
  el.addEventListener("input", renderLibrary)
);

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
       <p class="video-hint">Vidéo intégrée. <button class="linklike" id="video-change">Changer la vidéo</button></p>`
    : `<div class="video-placeholder">
         <p>🎬 <strong>Vidéo de démonstration</strong></p>
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

  modalContent.innerHTML = `
    <div class="modal-header">
      <span class="ex-icon big">${GROUP_ICONS[ex.groupe] || "🏋️"}</span>
      <div>
        <h2>${esc(ex.nom)}</h2>
        <div class="ex-tags">
          <span class="tag">${LABELS.groupes[ex.groupe]}</span>
          <span class="tag">${LABELS.materiel[ex.materiel]}</span>
          <span class="badge badge-${esc(ex.niveau)}">${LABELS.niveaux[ex.niveau]}</span>
        </div>
      </div>
    </div>

    ${videoBlock}

    <p class="ex-desc">${esc(ex.description || "")}</p>
    ${ex.muscles ? `<p><strong>💪 Muscles sollicités :</strong> ${esc(ex.muscles)}</p>` : ""}

    ${(ex.execution && ex.execution.length) ? `
      <h3>✅ Exécution</h3>
      <ol class="steps">${ex.execution.map(s => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}

    ${(ex.erreurs && ex.erreurs.length) ? `
      <h3>⚠️ Erreurs à éviter</h3>
      <ul class="mistakes">${ex.erreurs.map(s => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}

    ${ex.custom ? `<button class="btn btn-danger" id="delete-custom">🗑 Supprimer cet exercice personnalisé</button>` : ""}
  `;

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

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}
modal.querySelector(".modal-close").addEventListener("click", closeModal);
modal.querySelector(".modal-backdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

/* ---------- Ajout d'exercice personnalisé ---------- */
const addForm = document.getElementById("add-form");
const addFeedback = document.getElementById("add-feedback");

addForm.addEventListener("submit", e => {
  e.preventDefault();
  const nom = document.getElementById("a-nom").value.trim();
  if (!nom) return;

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
    <h2>Tes exercices personnalisés (${list.length})</h2>
    <div class="grid">${list.map(ex => `
      <article class="ex-card" data-id="${esc(ex.id)}">
        <div class="ex-card-head">
          <span class="ex-icon">${GROUP_ICONS[ex.groupe] || "🏋️"}</span>
          <span class="badge badge-${esc(ex.niveau)}">${LABELS.niveaux[ex.niveau]}</span>
        </div>
        <h3>${esc(ex.nom)}</h3>
        <div class="ex-tags">
          <span class="tag">${LABELS.groupes[ex.groupe]}</span>
          <span class="tag">${LABELS.materiel[ex.materiel]}</span>
          <span class="tag tag-custom">Perso</span>
        </div>
      </article>`).join("")}
    </div>`;
  container.querySelectorAll(".ex-card").forEach(card =>
    card.addEventListener("click", () => openExercise(card.dataset.id))
  );
}

/* ---------- Programme personnalisé ---------- */
const programForm = document.getElementById("program-form");
const programOutput = document.getElementById("program-output");

programForm.addEventListener("submit", e => {
  e.preventDefault();
  const params = {
    prenom: document.getElementById("p-prenom").value.trim(),
    objectif: document.getElementById("p-objectif").value,
    niveau: document.getElementById("p-niveau").value,
    jours: parseInt(document.getElementById("p-jours").value, 10),
    materiel: document.getElementById("p-materiel").value,
    priorite: document.getElementById("p-priorite").value || null
  };
  saveJSON(STORAGE_KEYS.profil, params);
  const program = generateProgram(params);
  saveJSON(STORAGE_KEYS.program, program);
  renderProgram(program);
  programOutput.scrollIntoView({ behavior: "smooth" });
});

function renderProgram(pr) {
  const materielLabels = {
    salle: "Salle de sport complète",
    halteres: "Haltères + banc",
    corps: "Poids du corps"
  };

  programOutput.innerHTML = `
    <div class="program-header card">
      <h2>${pr.objectifIcone} Programme de ${esc(pr.prenom)} — ${esc(pr.objectifLabel)}</h2>
      <p class="program-meta">
        ${LABELS.niveaux[pr.niveau]} · ${pr.jours} séances/semaine · ${materielLabels[pr.materiel]}
        ${pr.priorite ? " · Priorité : " + LABELS.groupes[pr.priorite] : ""}
        · Généré le ${esc(pr.genereLe)}
      </p>
      <div class="program-actions">
        <button class="btn btn-ghost" id="btn-regen">🔄 Régénérer (varier les exercices)</button>
        <button class="btn btn-ghost" id="btn-print">🖨 Imprimer / PDF</button>
      </div>
    </div>

    <div class="program-days">
      ${pr.days.map(day => `
        <div class="day-card card">
          <div class="day-head">
            <h3>Séance ${day.numero} — ${esc(day.titre)}</h3>
            <p class="day-focus">${esc(day.focus)}</p>
          </div>
          <table class="day-table">
            <thead>
              <tr><th>Exercice</th><th>Séries</th><th>Reps</th><th>Repos</th><th></th></tr>
            </thead>
            <tbody>
              ${day.exercices.map(l => `
                <tr class="${l.prioritaire ? "row-priority" : ""}">
                  <td>
                    <button class="linklike ex-link" data-id="${esc(l.exercice.id)}">${esc(l.exercice.nom)}</button>
                    ${l.prioritaire ? '<span class="tag tag-custom">Priorité</span>' : ""}
                  </td>
                  <td>${l.series}</td>
                  <td>${esc(l.reps)}</td>
                  <td>${esc(l.repos)}</td>
                  <td><a class="video-link" href="${youtubeSearchUrl(l.exercice)}" target="_blank" rel="noopener" title="Vidéo de démonstration">🎬</a></td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>`).join("")}
    </div>

    <div class="card conseils-card">
      <h3>📌 Conseils pour ton objectif « ${esc(pr.objectifLabel)} »</h3>
      <ul class="conseils">${pr.conseils.map(c => `<li>${esc(c)}</li>`).join("")}</ul>
      <p class="disclaimer">⚠️ Échauffe-toi 5-10 minutes avant chaque séance. Clique sur un exercice pour ouvrir sa fiche technique complète avec vidéo.</p>
    </div>
  `;

  programOutput.querySelectorAll(".ex-link").forEach(btn =>
    btn.addEventListener("click", () => openExercise(btn.dataset.id))
  );
  document.getElementById("btn-regen").addEventListener("click", () => {
    const params = loadJSON(STORAGE_KEYS.profil, null);
    if (!params) return;
    const program = generateProgram(params);
    saveJSON(STORAGE_KEYS.program, program);
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
}
const savedProgram = loadJSON(STORAGE_KEYS.program, null);
if (savedProgram) renderProgram(savedProgram);
