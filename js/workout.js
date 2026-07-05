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

let live = null;      // séance en cours
let liveTimer = null; // interval d'affichage
let rest = null;      // { setRef, exName, startAt, targetSec, beeped }

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

/* Bip de fin de repos (WebAudio, aucun fichier nécessaire) */
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.25].forEach(delay => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.25, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.2);
    });
  } catch { /* audio indisponible : silencieux */ }
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
    restSec: restSec || getDefaultRest(),
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
    exercises,
    currentIndex: exercises.length ? 0 : -1
  };
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
      ${program.objectifIcone} Lancer : Séance ${d.numero} — ${esc(d.titre)}
    </button>`).join("");
  container.querySelectorAll(".start-day").forEach(btn => {
    btn.addEventListener("click", () => {
      saveJSON(STORAGE_KEYS.restDefault, parseInt(defaultRestInput.value, 10) || 90);
      const day = program.days[parseInt(btn.dataset.day, 10)];
      const exercises = day.exercices.map(l =>
        newLiveExercise(l.exercice, `${l.series} × ${l.reps}`, parseRestToSeconds(l.repos))
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
  if (rest) total += Date.now() - rest.startAt;
  return total;
}

function setCount() {
  return live.exercises.reduce((n, ex) => n + ex.sets.length, 0);
}

function exerciseElapsed(ex) {
  if (!ex.startedAt) return 0;
  return (ex.endedAt || Date.now()) - ex.startedAt;
}

/* Progression type NTC : « Exercice X / Y » + barre globale */
function updateProgress() {
  const label = document.getElementById("live-progress-label");
  const bar = document.getElementById("live-progress-bar");
  if (!label || !bar || !live) return;
  const total = live.exercises.length;
  if (total === 0) { label.textContent = ""; bar.style.width = "0%"; return; }
  const current = Math.min(Math.max(live.currentIndex, 0) + 1, total);
  const done = live.exercises.filter(e => e.sets.length > 0).length;
  label.textContent = `Exercice ${current} / ${total} · ${done} entamé${done > 1 ? "s" : ""}`;
  bar.style.width = Math.round((done / total) * 100) + "%";
}

function tick() {
  if (!live) return;
  document.getElementById("chrono-session").textContent = fmtClock(Date.now() - live.startedAt);
  document.getElementById("chrono-rest-total").textContent = fmtClock(totalRestMs());
  document.getElementById("live-set-count").textContent = setCount();

  // chrono de l'exercice actif
  live.exercises.forEach((ex, i) => {
    const el = document.getElementById("ex-chrono-" + i);
    if (el) el.textContent = fmtClock(exerciseElapsed(ex));
  });

  // minuteur de repos + anneau de progression
  if (rest) {
    const elapsed = (Date.now() - rest.startAt) / 1000;
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

function renderLiveExercises() {
  if (live.exercises.length === 0) {
    elLiveExercises.innerHTML = `<div class="card empty-live">
      <p>Ta séance est vide pour l'instant : ajoute ton premier exercice pour commencer. 💪</p>
    </div>`;
    updateProgress();
    return;
  }

  elLiveExercises.innerHTML = live.exercises.map((ex, i) => {
    const isCurrent = i === live.currentIndex;
    return `
    <div class="card live-ex ${isCurrent ? "live-ex-current" : ""}" data-i="${i}">
      <div class="live-ex-head">
        <div>
          <h3><button class="linklike ex-fiche" data-exid="${esc(ex.exId)}">${esc(ex.nom)}</button></h3>
          <p class="day-focus">
            ${LABELS.groupes[ex.groupe] || ""}
            ${ex.target ? " · Objectif : " + esc(ex.target) : ""}
            · Repos : ${ex.restSec} s
          </p>
        </div>
        <div class="live-ex-right">
          <span class="ex-chrono" id="ex-chrono-${i}">${fmtClock(exerciseElapsed(ex))}</span>
          ${isCurrent ? '<span class="tag tag-custom">En cours</span>'
                      : `<button class="btn btn-ghost btn-sm set-current" data-i="${i}">▶ Passer à cet exercice</button>`}
        </div>
      </div>

      ${ex.sets.length ? `
      <table class="sets-table">
        <thead><tr><th>Série</th><th>Poids (kg)</th><th>Reps</th><th>Repos pris</th></tr></thead>
        <tbody>
          ${ex.sets.map((s, j) => `
            <tr>
              <td>✔ ${j + 1}</td>
              <td>${s.poids || "—"}</td>
              <td>${s.reps}</td>
              <td>${s.restAfter != null ? fmtSec(s.restAfter) : "…"}</td>
            </tr>`).join("")}
        </tbody>
      </table>` : ""}

      <div class="set-form">
        <input type="number" inputmode="decimal" min="0" step="0.5" placeholder="Poids (kg)" id="poids-${i}" class="set-input" aria-label="Poids en kilogrammes">
        <input type="number" inputmode="numeric" min="1" step="1" placeholder="Reps" id="reps-${i}" class="set-input" aria-label="Répétitions">
        <button class="btn btn-primary validate-set" data-i="${i}">✔ Valider la série</button>
        <button class="btn btn-danger-ghost remove-ex" data-i="${i}" title="Retirer l'exercice" aria-label="Retirer l'exercice">🗑</button>
      </div>
    </div>`;
  }).join("");

  elLiveExercises.querySelectorAll(".validate-set").forEach(btn =>
    btn.addEventListener("click", () => validateSet(parseInt(btn.dataset.i, 10))));
  elLiveExercises.querySelectorAll(".set-current").forEach(btn =>
    btn.addEventListener("click", () => setCurrentExercise(parseInt(btn.dataset.i, 10))));
  elLiveExercises.querySelectorAll(".remove-ex").forEach(btn =>
    btn.addEventListener("click", () => removeExercise(parseInt(btn.dataset.i, 10))));
  elLiveExercises.querySelectorAll(".ex-fiche").forEach(btn =>
    btn.addEventListener("click", () => openExercise(btn.dataset.exid)));

  updateProgress();
}

function setCurrentExercise(i) {
  const now = Date.now();
  const prev = live.exercises[live.currentIndex];
  if (prev && prev.startedAt && !prev.endedAt) prev.endedAt = now;
  live.currentIndex = i;
  const ex = live.exercises[i];
  if (!ex.startedAt) ex.startedAt = now;
  else ex.endedAt = null; // on y revient : le chrono repart
  saveLive();
  renderLiveExercises();
}

function removeExercise(i) {
  const ex = live.exercises[i];
  if (ex.sets.length && !confirm(`Retirer « ${ex.nom} » et ses ${ex.sets.length} série(s) enregistrée(s) ?`)) return;
  live.exercises.splice(i, 1);
  if (live.currentIndex >= live.exercises.length) live.currentIndex = live.exercises.length - 1;
  saveLive();
  renderLiveExercises();
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
  if (!ex.startedAt) ex.startedAt = now;
  ex.endedAt = null;

  const set = { poids: isNaN(poids) ? null : poids, reps, doneAt: now, restAfter: null };
  ex.sets.push(set);
  saveLive();
  renderLiveExercises();

  // lance le minuteur de repos
  rest = { setRef: { exIndex: i, setIndex: ex.sets.length - 1 }, exName: ex.nom, startAt: now, targetSec: ex.restSec, beeped: false };
  document.getElementById("rest-exercise-name").textContent = ex.nom + " — série " + ex.sets.length + " terminée";
  elRestOverlay.classList.remove("hidden");
  tick();
}

function endRest() {
  if (!rest) return;
  const actual = Math.round((Date.now() - rest.startAt) / 1000);
  const ex = live.exercises[rest.setRef.exIndex];
  if (ex && ex.sets[rest.setRef.setIndex]) ex.sets[rest.setRef.setIndex].restAfter = actual;
  rest = null;
  elRestOverlay.classList.add("hidden");
  saveLive();
  renderLiveExercises();
}

document.getElementById("rest-resume").addEventListener("click", endRest);
document.getElementById("rest-plus").addEventListener("click", () => { if (rest) { rest.targetSec += 15; rest.beeped = false; tick(); } });
document.getElementById("rest-minus").addEventListener("click", () => { if (rest) { rest.targetSec = Math.max(5, rest.targetSec - 15); tick(); } });

/* ---------- Sélecteur d'exercice ---------- */
function openPicker() {
  elPicker.classList.remove("hidden");
  const input = document.getElementById("picker-search");
  input.value = "";
  renderPickerList("");
  input.focus();
}
function closePicker() { elPicker.classList.add("hidden"); }

function renderPickerList(query) {
  const q = normalize(query.trim());
  const list = allExercisesForUI().filter(ex =>
    !q || normalize(ex.nom + " " + (ex.muscles || "") + " " + (LABELS.groupes[ex.groupe] || "")).includes(q)
  ).slice(0, 40);
  document.getElementById("picker-list").innerHTML = list.map(ex => `
    <button class="picker-item" data-exid="${esc(ex.id)}">
      <span>${GROUP_ICONS[ex.groupe] || "🏋️"} ${esc(ex.nom)}</span>
      <span class="tag">${LABELS.groupes[ex.groupe]}</span>
    </button>`).join("") || `<p class="video-hint">Aucun exercice trouvé.</p>`;
  document.querySelectorAll(".picker-item").forEach(btn =>
    btn.addEventListener("click", () => {
      const ex = allExercisesForUI().find(e => e.id === btn.dataset.exid);
      if (!ex || !live) return;
      live.exercises.push(newLiveExercise(ex, null, getDefaultRest()));
      if (live.currentIndex === -1) live.currentIndex = 0;
      saveLive();
      renderLiveExercises();
      closePicker();
    }));
}

document.getElementById("picker-search").addEventListener("input", e => renderPickerList(e.target.value));
document.getElementById("picker-close").addEventListener("click", closePicker);
document.getElementById("picker-backdrop").addEventListener("click", closePicker);
document.getElementById("live-add-ex").addEventListener("click", openPicker);

/* ---------- Fin de séance ---------- */
document.getElementById("live-finish").addEventListener("click", finishSession);
document.getElementById("live-abort").addEventListener("click", () => {
  if (!confirm("Abandonner la séance ? Rien ne sera enregistré.")) return;
  if (rest) { rest = null; elRestOverlay.classList.add("hidden"); }
  if (liveTimer) clearInterval(liveTimer);
  clearLive();
  showSetup();
});

function finishSession() {
  if (rest) endRest();
  const now = Date.now();
  const cur = live.exercises[live.currentIndex];
  if (cur && cur.startedAt && !cur.endedAt) cur.endedAt = now;
  live.endedAt = now;
  if (liveTimer) clearInterval(liveTimer);

  const record = {
    id: "seance-" + now,
    nom: live.nom,
    date: now,
    dureeMs: now - live.startedAt,
    reposMs: totalRestMs(),
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
      <h2>Bien joué 🎉</h2>
      <p class="program-meta">${esc(r.nom)} · ${new Date(r.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
      <div class="live-chronos summary-stats">
        <div class="chrono-block"><span class="chrono-label">Durée totale</span><span class="chrono-value">${fmtClock(r.dureeMs)}</span></div>
        <div class="chrono-block"><span class="chrono-label">Repos cumulé</span><span class="chrono-value">${fmtClock(r.reposMs)}</span></div>
        <div class="chrono-block"><span class="chrono-label">Séries</span><span class="chrono-value">${r.nbSeries}</span></div>
        <div class="chrono-block"><span class="chrono-label">Volume total</span><span class="chrono-value">${Math.round(r.volume)} kg</span></div>
      </div>
      ${renderSessionDetail(r)}
      <button class="btn btn-primary btn-lg" id="summary-back">↩ Retour aux séances</button>
    </div>`;
  document.getElementById("summary-back").addEventListener("click", showSetup);
}

function renderSessionDetail(r) {
  return `<div class="session-detail">${r.exercises.map(ex => `
    <div class="session-ex">
      <h4>${GROUP_ICONS[ex.groupe] || "🏋️"} ${esc(ex.nom)} <span class="ex-chrono">${fmtClock(ex.dureeMs)}</span></h4>
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
  container.innerHTML = `
    <h2>📖 Historique (${history.length} séance${history.length > 1 ? "s" : ""})</h2>
    ${history.map(r => `
      <div class="card history-item" data-id="${esc(r.id)}">
        <div class="history-head">
          <div>
            <h3>${esc(r.nom)}</h3>
            <p class="day-focus">${new Date(r.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              · ${fmtClock(r.dureeMs)} · ${r.nbSeries} séries · ${Math.round(r.volume)} kg de volume · repos ${fmtClock(r.reposMs)}</p>
          </div>
          <div class="history-actions">
            <button class="btn btn-ghost btn-sm toggle-detail">Détails</button>
            <button class="btn btn-danger-ghost btn-sm delete-session" title="Supprimer" aria-label="Supprimer la séance">🗑</button>
          </div>
        </div>
        <div class="history-detail hidden">${renderSessionDetail(r)}</div>
      </div>`).join("")}`;

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
