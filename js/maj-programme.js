/* GymCoach — mettre le programme à jour d'après la séance réalisée.
   À la fin d'une séance du programme, on compare ce qui a été fait à la séance
   prévue : exercices ajoutés, retirés, nombre de séries ou répétitions différents,
   ordre changé. Deux entrées : une question rapide quand des exercices ont été
   ajoutés ou retirés, et un mode édition (toujours proposé) pour choisir
   précisément ce qu'on reporte dans le programme. */

function majJourDe(r) {
  const m = /^Séance (\d+)/.exec(r.nom || "");
  if (!m) return null;
  const lib = typeof getPrograms === "function" ? getPrograms() : [];
  const act = loadJSON(STORAGE_KEYS.program, null);
  let prog = null;
  if (r.programId) prog = (act && act.id === r.programId) ? act : lib.find(p => p.id === r.programId) || null;
  if (!prog && !r.programId) prog = act;        // programme d'origine supprimé : on ne touche pas à un autre
  if (!prog) return null;
  const day = prog.days.find(d => d.numero === parseInt(m[1], 10));
  return day ? { prog, day } : null;
}

function majRepsDe(sets) {
  const reps = sets.map(s => s.reps).filter(v => v);
  const secs = sets.map(s => s.secondes).filter(v => v);
  if (reps.length) { const lo = Math.min(...reps), hi = Math.max(...reps); return lo === hi ? String(lo) : `${lo}-${hi}`; }
  if (secs.length) return Math.round(secs.reduce((a, b) => a + b, 0) / secs.length) + " s";
  return "";
}

/* Calcule l'écart entre la séance prévue et la séance faite. */
function majDiff(r) {
  const ref = majJourDe(r);
  if (!ref || !Array.isArray(r.structure)) return null;
  const { day } = ref;
  const prevus = day.exercices.map(l => l.exercice.id);
  const faits = new Map((r.exercises || []).map(e => [e.exId, e]));
  const nomDe = id => (day.exercices.find(l => l.exercice.id === id) || {}).exercice?.nom
    || (r.exercises.find(e => e.exId === id) || {}).nom || id;
  const ajoutes = r.structure.filter(id => !prevus.includes(id) && faits.has(id));
  const retires = prevus.filter(id => !r.structure.includes(id));
  const modifies = [];
  const nb = (liste, id) => liste.filter(x => x === id).length;
  for (const l of day.exercices) {
    const f = faits.get(l.exercice.id);
    if (!f) continue;
    if (nb(prevus, l.exercice.id) > 1 || nb(r.structure, l.exercice.id) > 1) continue;   // même exercice deux fois : comparaison ambiguë, on ne propose rien
    const to = { series: f.sets.length, reps: majRepsDe(f.sets) || String(l.reps) };
    /* Des répétitions qui restent dans la fourchette prévue ne sont pas une modification. */
    const num = t => { const m = /(\d+)(?:\s*-\s*(\d+))?/.exec(String(t)); return m ? [+m[1], +(m[2] || m[1])] : null; };
    const [pl, ph] = num(l.reps) || [0, 0], [dl, dh] = num(to.reps) || [0, 0];
    const horsFourchette = !/s\s*$/.test(String(l.reps)) && pl && dl && (dl > ph || dh < pl);
    if (to.series !== l.series || horsFourchette) modifies.push({ id: l.exercice.id, from: { series: l.series, reps: String(l.reps) }, to });
  }
  const communs = r.structure.filter(id => prevus.includes(id));
  const ordre = communs.some((id, i) => id !== prevus.filter(x => communs.includes(x))[i]);
  return { ...ref, ajoutes, retires, modifies, ordre, nomDe,
           vide: !ajoutes.length && !retires.length && !modifies.length && !ordre };
}

/* Applique les changements choisis au programme et le range. */
function majAppliquer(r, d, choix) {
  const { prog, day } = d;
  const faits = new Map((r.exercises || []).map(e => [e.exId, e]));
  let lignes = day.exercices.filter(l => !(d.retires.includes(l.exercice.id) && choix.retires.has(l.exercice.id)));
  for (const m of d.modifies) {
    if (!choix.modifies.has(m.id)) continue;
    const l = lignes.find(x => x.exercice.id === m.id);
    if (l) { l.series = m.to.series; l.reps = m.to.reps; }
  }
  for (const id of d.ajoutes) {
    if (!choix.ajoutes.has(id)) continue;
    lignes.push(seanceDeProgrammeDepuis({ exercises: [faits.get(id)] }, 1).exercices[0]);
  }
  if (choix.ordre) {
    const rang = id => { const i = r.structure.indexOf(id); return i < 0 ? 999 : i; };
    lignes = lignes.map((l, i) => ({ l, i })).sort((a, b) => rang(a.l.exercice.id) - rang(b.l.exercice.id) || a.i - b.i).map(x => x.l);
  }
  day.exercices = lignes;
  const act = loadJSON(STORAGE_KEYS.program, null);
  if (act && act.id === prog.id) setActiveProgram(prog); else upsertProgram(prog);
  if (typeof renderProgram === "function" && act && act.id === prog.id) renderProgram(prog);
  if (typeof renderProgramsPanel === "function") renderProgramsPanel();
  if (typeof renderHome === "function") renderHome();
}

function majToutChoisir(d) {
  return { ajoutes: new Set(d.ajoutes), retires: new Set(d.retires), modifies: new Set(d.modifies.map(m => m.id)), ordre: d.ordre };
}

/* Carte de l'écran de fin de séance. */
function majProgrammeCarte(r) {
  const d = majDiff(r);
  if (!d) return "";
  const struct = d.ajoutes.length || d.retires.length;
  if (struct) {
    const puces = [...d.ajoutes.map(id => `<li class="mj-plus">+ ${esc(d.nomDe(id))}</li>`), ...d.retires.map(id => `<li class="mj-moins">− ${esc(d.nomDe(id))}</li>`)].join("");
    return `<div class="card maj-card" id="maj-card">
      <p class="chrono-label">Séance ${d.day.numero} modifiée</p>
      <ul class="mj-list">${puces}</ul>
      <p class="maj-q">Mettre à jour le programme ?</p>
      <div class="program-actions">
        <button class="btn btn-primary btn-sm" id="maj-oui" aria-label="Mettre à jour le programme">${icon("tick")} Oui</button>
        <button class="btn btn-ghost btn-sm" id="maj-edit" aria-label="Choisir ce qui change">${icon("pencil")} Choisir</button>
        <button class="btn btn-ghost btn-sm" id="maj-non" aria-label="Ne pas modifier le programme">${icon("x")}</button>
      </div></div>`;
  }
  return `<div class="card maj-card" id="maj-card">
      <button class="btn btn-ghost btn-sm" id="maj-edit" aria-label="Mode édition : modifier le programme d'après cette séance">${icon("pencil")} Modifier le programme d'après cette séance</button></div>`;
}

function majProgrammeLier(r) {
  const carte = document.getElementById("maj-card");
  if (!carte) return;
  const d = majDiff(r);
  const fin = txt => { carte.innerHTML = `<p class="maj-q">${esc(txt)}</p>`; };
  document.getElementById("maj-oui")?.addEventListener("click", () => {
    const c = majToutChoisir(d); c.modifies = new Set(); c.ordre = false;      // la question rapide ne touche qu'aux ajouts / retraits
    majAppliquer(r, d, c); fin("Programme mis à jour.");
  });
  document.getElementById("maj-non")?.addEventListener("click", () => { carte.remove(); });
  document.getElementById("maj-edit")?.addEventListener("click", () => majOuvrirEdition(r));
}

/* Mode édition : une ligne par changement, cochée par défaut. */
function majOuvrirEdition(r) {
  const d = majDiff(r);
  const box = document.getElementById("modal-content");
  if (!d || !box) return;
  const ligne = (cle, id, texte, etat) => `<label class="mj-row"><input type="checkbox" data-k="${cle}" data-id="${esc(id)}" checked>
      <span class="mj-nom">${esc(texte)}</span><span class="mj-etat">${etat}</span></label>`;
  const lignes = [
    ...d.ajoutes.map(id => ligne("ajoutes", id, d.nomDe(id), "ajouté")),
    ...d.retires.map(id => ligne("retires", id, d.nomDe(id), "retiré")),
    ...d.modifies.map(m => ligne("modifies", m.id, d.nomDe(m.id), `${m.from.series} × ${esc(m.from.reps)} → <strong>${m.to.series} × ${esc(m.to.reps)}</strong>`)),
    d.ordre ? ligne("ordre", "", "Nouvel ordre des exercices", "ordre") : ""
  ].join("");
  box.innerHTML = `
    <div class="modal-header"><div><h2>Séance ${d.day.numero} — ${esc(d.day.titre)}</h2></div></div>
    ${d.vide ? `<p class="video-hint">Identique au programme : rien à changer.</p>` : `<div class="mj-rows">${lignes}</div>
    <button class="btn btn-primary btn-lg" id="mj-go" aria-label="Appliquer au programme">${icon("tick")} Appliquer</button>`}`;
  document.getElementById("mj-go")?.addEventListener("click", () => {
    const c = { ajoutes: new Set(), retires: new Set(), modifies: new Set(), ordre: false };
    box.querySelectorAll("input[data-k]:checked").forEach(i => {
      if (i.dataset.k === "ordre") c.ordre = true; else c[i.dataset.k].add(i.dataset.id);
    });
    majAppliquer(r, d, c);
    if (typeof closeSheet === "function") closeSheet();
    const carte = document.getElementById("maj-card");
    if (carte) carte.innerHTML = `<p class="maj-q">Programme mis à jour.</p>`;
    if (typeof toast === "function") toast("Programme mis à jour d'après ta séance.");
  });
  openSheet();
}
