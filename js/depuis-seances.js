/* GymCoach — construire ou compléter un programme à partir de séances déjà réalisées.
   On coche une ou plusieurs séances de l'historique : chacune devient une séance du
   programme (ses exercices, son nombre de séries, ses répétitions, et en note les
   dernières charges). La destination est au choix : un programme existant
   (on y AJOUTE les séances) ou un nouveau. */
let spModal = null, spOrdre = [];

/* Marque dans les lignes d'un programme les super sets réalisés. `liens` = groupes d'identifiants d'exercice.
   Convention : la ligne portant `superset` est enchaînée avec la suivante ; les deux doivent donc se suivre. */
function programmeAppliquerLiens(lignes, liens) {
  for (const g of liens || []) {
    const idx = g.map(id => lignes.findIndex(l => l.exercice.id === id)).filter(i => i >= 0);
    if (idx.length < 2) continue;
    const lignesG = idx.map(i => lignes[i]);
    const debut = Math.min(...idx);
    lignesG.forEach(l => lignes.splice(lignes.indexOf(l), 1));            // on les regroupe à la place de la première
    lignes.splice(Math.min(debut, lignes.length), 0, ...lignesG);
    lignesG.forEach((l, k) => { l.superset = k < lignesG.length - 1; });
  }
}

/* Une séance réalisée -> une séance de programme */
function seanceDeProgrammeDepuis(r, numero) {
  const groupes = [...new Set((r.exercises || []).map(e => (LABELS.groupes || {})[e.groupe]).filter(Boolean))].slice(0, 4);
  const jour = {
    numero,
    titre: String(r.nom || "Séance " + numero).replace(/ \(bis\)$/, ""),
    focus: groupes.join(" · "),
    exercices: (r.exercises || []).map(ex => {
      const ref = allExercisesForUI().find(e => e.id === ex.exId) ||
        { id: ex.exId, nom: ex.nom, groupe: ex.groupe, materiel: "halteres", niveau: "intermediaire", type: "iso" };
      const line = builderLine(ref);
      const sets = ex.sets || [];
      line.series = Math.max(1, sets.length);
      const reps = sets.map(s => s.reps).filter(v => v);
      const secs = sets.map(s => s.secondes).filter(v => v);
      if (reps.length) {
        const lo = Math.min(...reps), hi = Math.max(...reps);
        line.reps = lo === hi ? String(lo) : `${lo}-${hi}`;
      } else if (secs.length) {
        line.reps = Math.round(secs.reduce((a, b) => a + b, 0) / secs.length) + " s";
      }
      const poids = [...new Set(sets.map(s => s.poids).filter(v => v != null && v > 0))];
      if (poids.length) line.note = "Dernières charges : " + poids.slice(0, 4).join(" / ") + " kg";
      return line;
    })
  };
  programmeAppliquerLiens(jour.exercices, r.liens);
  return jour;
}

function ouvrirSeancesVersProgramme(preselection = []) {
  const toutes = getHistory().slice().sort((a, b) => b.date - a.date);
  /* 80 séances récentes, PLUS celles qu'on a présélectionnées (même très anciennes). */
  const histo = toutes.filter((r, i) => i < 80 || preselection.includes(r.id));
  if (!histo.length) { alert("Aucune séance réalisée pour l'instant : fais une séance, puis reviens ici."); return; }
  const programmes = (typeof getPrograms === "function") ? getPrograms() : [];
  const actifId = typeof getActiveId === "function" ? getActiveId() : null;
  spOrdre = preselection.filter(id => histo.some(r => r.id === id));
  if (!spModal) {
    spModal = document.createElement("div");
    spModal.id = "sp-modal"; spModal.className = "modal hidden";
    spModal.innerHTML = `<div class="modal-backdrop"></div><div class="modal-box"><button class="modal-close" aria-label="Fermer">${icon("x")}</button><div id="sp-contenu"></div></div>`;
    document.body.appendChild(spModal);
    spModal.querySelector(".modal-close").addEventListener("click", fermerSeancesVersProgramme);
    spModal.querySelector(".modal-backdrop").addEventListener("click", fermerSeancesVersProgramme);
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !spModal.classList.contains("hidden")) fermerSeancesVersProgramme(); });
  }
  const nbS = r => (r.exercises || []).reduce((n, e) => n + (e.sets || []).length, 0);
  const aDesProgrammes = programmes.length > 0;
  spModal.querySelector("#sp-contenu").innerHTML = `
    <h2 class="display-sm">Programme depuis mes séances</h2>
    <p class="program-meta">Coche les séances que tu as déjà faites : chacune devient une séance du programme
      (exercices, séries, répétitions, et tes dernières charges en note).</p>
    <div class="sp-liste" role="group" aria-label="Séances réalisées">
      ${histo.map(r => `
        <label class="sp-ligne">
          <input type="checkbox" class="sp-case" value="${esc(r.id)}" ${spOrdre.includes(r.id) ? "checked" : ""}>
          <span class="sp-txt"><strong>${esc(r.nom)}</strong>
            <span class="sp-sous">${new Date(r.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
              · ${(r.exercises || []).length} exercice${(r.exercises || []).length > 1 ? "s" : ""} · ${nbS(r)} série${nbS(r) > 1 ? "s" : ""}</span></span>
        </label>`).join("")}
    </div>
    <div class="sp-dest">
      <p class="chrono-label">Destination</p>
      <label class="sp-radio"><input type="radio" name="sp-mode" value="existant" ${aDesProgrammes ? "checked" : "disabled"}>
        <span>Ajouter à un programme existant</span></label>
      <select id="sp-prog" class="sp-select" ${aDesProgrammes ? "" : "disabled"} aria-label="Programme existant">
        ${programmes.map(p => `<option value="${esc(p.id)}" ${p.id === actifId ? "selected" : ""}>${esc(p.nom || "Programme")} · ${(p.days || []).length} séance${(p.days || []).length > 1 ? "s" : ""}${p.id === actifId ? " (actif)" : ""}</option>`).join("")}
      </select>
      <label class="sp-radio"><input type="radio" name="sp-mode" value="nouveau" ${aDesProgrammes ? "" : "checked"}>
        <span>Créer un nouveau programme</span></label>
      <input type="text" id="sp-nom" class="sp-champ" maxlength="60" value="Programme du ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}" aria-label="Nom du nouveau programme">
      <label class="sp-radio sp-act"><input type="checkbox" id="sp-activer" ${aDesProgrammes ? "" : "checked"}>
        <span>Le rendre actif tout de suite</span></label>
    </div>
    <p class="feedback" id="sp-retour" role="status"></p>
    <div class="program-actions">
      <button type="button" class="btn btn-primary" id="sp-ok">Ajouter</button>
      <button type="button" class="btn btn-ghost" id="sp-annule">Annuler</button>
    </div>`;
  const cases = [...spModal.querySelectorAll(".sp-case")];
  const radios = [...spModal.querySelectorAll('[name="sp-mode"]')];
  const majMode = () => {
    const nouveau = (radios.find(r => r.checked) || {}).value === "nouveau";
    spModal.querySelector("#sp-prog").disabled = nouveau || !aDesProgrammes;
    spModal.querySelector("#sp-nom").disabled = !nouveau;
    spModal.querySelector("#sp-activer").disabled = !nouveau;
  };
  radios.forEach(r => r.addEventListener("change", majMode)); majMode();
  const majBouton = () => {
    const n = spOrdre.length;
    spModal.querySelector("#sp-ok").textContent = n ? `Ajouter ${n} séance${n > 1 ? "s" : ""}` : "Ajouter";
    spModal.querySelector("#sp-ok").disabled = !n;
  };
  cases.forEach(c => c.addEventListener("change", () => {      // l'ordre de coche devient l'ordre dans le programme
    spOrdre = spOrdre.filter(id => id !== c.value);
    if (c.checked) spOrdre.push(c.value);
    majBouton();
  }));
  majBouton();
  spModal.querySelector("#sp-annule").addEventListener("click", fermerSeancesVersProgramme);
  spModal.querySelector("#sp-ok").addEventListener("click", validerSeancesVersProgramme);
  spModal.classList.remove("hidden");
}
function fermerSeancesVersProgramme() { if (spModal) spModal.classList.add("hidden"); }

function validerSeancesVersProgramme() {
  const retour = spModal.querySelector("#sp-retour");
  const histo = getHistory();
  const records = spOrdre.map(id => histo.find(r => r.id === id)).filter(Boolean);
  if (!records.length) { retour.textContent = "Coche au moins une séance."; return; }
  const mode = (spModal.querySelector('[name="sp-mode"]:checked') || {}).value;
  let prog, nouveau = false;
  if (mode === "nouveau") {
    const nom = spModal.querySelector("#sp-nom").value.trim() || "Mon programme";
    prog = newEmptyProgram();
    prog.nom = nom; prog.source = "seance"; prog.days = [];
    nouveau = true;
  } else {
    const id = spModal.querySelector("#sp-prog").value;
    prog = (id === getActiveId() ? loadJSON(STORAGE_KEYS.program, null) : null) || getPrograms().find(p => p.id === id);
    if (!prog) { retour.textContent = "Programme introuvable."; return; }
    prog.days = prog.days || [];
  }
  records.forEach(r => prog.days.push(seanceDeProgrammeDepuis(r, prog.days.length + 1)));
  prog.days.forEach((d, i) => { d.numero = i + 1; });
  prog.jours = prog.days.length;
  const actif = nouveau ? spModal.querySelector("#sp-activer").checked : prog.id === getActiveId();
  if (actif) { setActiveProgram(prog); if (typeof renderProgram === "function") renderProgram(prog); }
  else upsertProgram(prog);
  if (typeof renderProgramsPanel === "function") renderProgramsPanel();
  const n = records.length;
  retour.innerHTML = `${n} séance${n > 1 ? "s" : ""} ajoutée${n > 1 ? "s" : ""} à « <strong>${esc(prog.nom || "ton programme")}</strong> »${actif ? " (programme actif)" : ""}.`;
  const ok = spModal.querySelector("#sp-ok");
  ok.disabled = true;
  const voir = document.createElement("button");
  voir.type = "button"; voir.className = "btn btn-primary"; voir.textContent = "Voir mes programmes";
  voir.addEventListener("click", () => {
    fermerSeancesVersProgramme();
    activateView("programme");
    const seg = document.querySelector('[data-ppanel="programmes"]'); if (seg) seg.click();
  });
  const reorg = document.createElement("button");
  reorg.type = "button"; reorg.className = "btn btn-ghost"; reorg.textContent = "Réorganiser les séances";
  reorg.addEventListener("click", () => { fermerSeancesVersProgramme(); activateView("programme"); openBuilder(prog.id); });
  ok.replaceWith(voir);
  voir.after(reorg);
  spModal.querySelector("#sp-annule").textContent = "Fermer";
}

/* Le bouton du panneau « Mes programmes » (re-rendu à chaque ouverture : écouteur délégué). */
document.addEventListener("click", e => {
  if (e.target.closest("#from-sessions")) ouvrirSeancesVersProgramme();
});
