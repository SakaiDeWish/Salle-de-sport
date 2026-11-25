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
  /* Exercices choisis à la place d'un autre : ce n'est ni un ajout ni un retrait, c'est une alternative. */
  const remp = (r.remplacements || []).filter(([de, a]) => prevus.includes(de) && a !== de && !prevus.includes(a));
  const lignePar = id => day.exercices.find(l => l.exercice.id === id);
  const remplacements = remp.filter(([de, a]) => !(lignePar(de).alternatives || []).some(x => x.id === a)).map(([de, a]) => ({ de, a }));
  const rempA = new Set(remp.map(x => x[1])), rempDe = new Set(remp.map(x => x[0]));
  const ajoutes = r.structure.filter(id => !prevus.includes(id) && faits.has(id) && !rempA.has(id));
  const retires = prevus.filter(id => !r.structure.includes(id) && !rempDe.has(id));
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
  /* Super sets : paires « A>B » (A enchaîné avec B). On ne compare que les exercices présents des deux côtés. */
  const paires = groupes => (groupes || []).flatMap(g => g.slice(0, -1).map((id, k) => id + ">" + g[k + 1]));
  const duProgramme = day.exercices.flatMap((l, i) => l.superset && day.exercices[i + 1] ? [l.exercice.id + ">" + day.exercices[i + 1].exercice.id] : []);
  const dela = paires(r.liens);
  const presents = k => k.split(">").every(id => r.structure.includes(id));
  const liensAjoutes = dela.filter(k => presents(k) && !duProgramme.includes(k));
  const liensRetires = duProgramme.filter(k => presents(k) && !dela.includes(k));
  const nomPaire = k => k.split(">").map(nomDe).join(" + ");
  return { ...ref, ajoutes, retires, modifies, ordre, nomDe, liensAjoutes, liensRetires, nomPaire, remplacements,
           vide: !ajoutes.length && !retires.length && !modifies.length && !ordre && !liensAjoutes.length && !liensRetires.length && !remplacements.length };
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
  /* Super sets : on rompt les liens retirés, puis on rapproche et on relie les paires ajoutées. */
  for (const k of d.liensRetires) {
    if (!choix.liens.has(k)) continue;
    const l = lignes.find(x => x.exercice.id === k.split(">")[0]);
    if (l) l.superset = false;
  }
  for (const k of d.liensAjoutes) {
    if (!choix.liens.has(k)) continue;
    const [a, b] = k.split(">");
    const ia = lignes.findIndex(x => x.exercice.id === a), ib = lignes.findIndex(x => x.exercice.id === b);
    if (ia < 0 || ib < 0) continue;
    if (ib !== ia + 1) { const [lb] = lignes.splice(ib, 1); lignes.splice(lignes.findIndex(x => x.exercice.id === a) + 1, 0, lb); }
    lignes[lignes.findIndex(x => x.exercice.id === a)].superset = true;
  }
  /* Alternatives choisies : enregistrées sur la ligne (ou, si on préfère, elles remplacent l'exercice). */
  const refDe = id => {
    const lib = allExercisesForUI().find(e => e.id === id) || (r.exercises.find(e => e.exId === id) && { id, nom: r.exercises.find(e => e.exId === id).nom, groupe: r.exercises.find(e => e.exId === id).groupe, materiel: "halteres", niveau: "intermediaire", type: "iso" });
    return lib ? builderLine(lib).exercice : null;
  };
  for (const { de, a } of d.remplacements) {
    const mode = choix.remp.get(de + ">" + a);
    if (!mode) continue;
    const l = lignes.find(x => x.exercice.id === de), nouveau = refDe(a);
    if (!l || !nouveau) continue;
    l.alternatives = [...(l.alternatives || []), nouveau];
    if (mode === "remplacer") {
      l.alternatives = l.alternatives.filter(x => x.id !== a).concat([l.exercice]);        // l'ancien devient l'alternative
      l.exercice = nouveau;
    }
  }
  day.exercices = lignes;
  const act = loadJSON(STORAGE_KEYS.program, null);
  if (act && act.id === prog.id) setActiveProgram(prog); else upsertProgram(prog);
  if (typeof renderProgram === "function" && act && act.id === prog.id) renderProgram(prog);
  if (typeof renderProgramsPanel === "function") renderProgramsPanel();
  if (typeof renderHome === "function") renderHome();
}

/* ---------- Écran de fin : comparatif « programme / séance » avec un choix par changement ----------
   Chaque écart est une ligne : à gauche ce que prévoyait le programme, à droite ce qui a été fait,
   dessous les choix possibles. Rien n'est appliqué tant qu'on n'a pas validé. */

/* Les écarts sous forme de lignes : { k, type, prevu, fait, options:[[valeur, libellé]], defaut } */
function majItems(r, d) {
  const ligneDe = id => d.day.exercices.find(l => l.exercice.id === id);
  const fait = id => (r.exercises || []).find(e => e.exId === id);
  const prevuTxt = id => { const l = ligneDe(id); return l ? `${l.series} × ${l.reps}` : ""; };
  const faitTxt = id => {
    const f = fait(id); if (!f) return "";
    const poids = f.sets.map(x => x.poids).filter(v => v > 0);
    return `${f.sets.length} × ${majRepsDe(f.sets) || "?"}${poids.length ? " · " + Math.max(...poids) + " kg" : ""}`;
  };
  const items = [];
  for (const { de, a } of d.remplacements) items.push({
    k: "remp:" + de + ">" + a, type: "remp",
    prevu: { nom: d.nomDe(de), det: prevuTxt(de), etat: "Prévu" },
    fait: { nom: d.nomDe(a), det: faitTxt(a), etat: "Choisi à la place" },
    options: [["remplacer", "Remplacer"], ["alt", "Ajouter comme alternative"], ["non", "Ne rien changer"]], defaut: "alt" });
  for (const id of d.retires) items.push({
    k: "retire:" + id, type: "retire",
    prevu: { nom: d.nomDe(id), det: prevuTxt(id), etat: "Prévu" },
    fait: { nom: "Retiré de la séance", det: "", etat: "Fait", vide: true },
    options: [["retirer", "Retirer du programme"], ["garder", "Le garder"]], defaut: "retirer" });
  for (const id of d.ajoutes) items.push({
    k: "ajout:" + id, type: "ajout",
    prevu: { nom: "Pas dans le programme", det: "", etat: "Prévu", vide: true },
    fait: { nom: d.nomDe(id), det: faitTxt(id), etat: "Ajouté" },
    options: [["ajouter", "Ajouter au programme"], ["ignorer", "Ignorer"]], defaut: "ajouter" });
  for (const m of d.modifies) items.push({
    k: "modif:" + m.id, type: "modif",
    prevu: { nom: d.nomDe(m.id), det: `${m.from.series} × ${m.from.reps}`, etat: "Prévu" },
    fait: { nom: d.nomDe(m.id), det: `${m.to.series} × ${m.to.reps}`, etat: "Fait" },
    options: [["appliquer", "Mettre à jour"], ["garder", "Garder le prévu"]], defaut: "appliquer" });
  for (const k of d.liensAjoutes) items.push({
    k: "lien:" + k, type: "lien",
    prevu: { nom: d.nomPaire(k), det: "enchaînés : non", etat: "Prévu" },
    fait: { nom: d.nomPaire(k), det: "super set", etat: "Fait" },
    options: [["appliquer", "Enregistrer le super set"], ["ignorer", "Ignorer"]], defaut: "appliquer" });
  for (const k of d.liensRetires) items.push({
    k: "lien:" + k, type: "lien",
    prevu: { nom: d.nomPaire(k), det: "super set", etat: "Prévu" },
    fait: { nom: d.nomPaire(k), det: "enchaînés : non", etat: "Fait" },
    options: [["appliquer", "Retirer le super set"], ["ignorer", "Ignorer"]], defaut: "appliquer" });
  if (d.ordre) items.push({
    k: "ordre", type: "ordre",
    prevu: { nom: "Ordre du programme", det: d.day.exercices.map(l => d.nomDe(l.exercice.id).split(" ")[0]).join(" › "), etat: "Prévu" },
    fait: { nom: "Ordre de la séance", det: r.structure.map(id => d.nomDe(id).split(" ")[0]).join(" › "), etat: "Fait" },
    options: [["appliquer", "Reprendre cet ordre"], ["garder", "Garder le prévu"]], defaut: "appliquer" });
  return items;
}

const MAJ_ENTETES = { remp: "Remplacé", retire: "Retiré", ajout: "Ajouté", modif: "Séries / répétitions", lien: "Super set", ordre: "Ordre" };

function majProgrammeCarte(r) {
  const d = majDiff(r);
  if (!d) return "";
  if (d.vide) return `<div class="card maj-card" id="maj-card"><p class="maj-q">${icon("tick")} Séance identique au programme.</p></div>`;
  const col = (c, cls) => `<div class="mj-col ${cls}${c.vide ? " mj-vide" : ""}"><span class="mj-col-lab">${esc(c.etat)}</span>
      <strong>${esc(c.nom)}</strong>${c.det ? `<small>${esc(c.det)}</small>` : ""}</div>`;
  const items = majItems(r, d);
  return `<div class="card maj-card" id="maj-card">
    <p class="chrono-label">Programme · séance ${d.day.numero}</p>
    <p class="maj-q">Qu'est-ce qu'on garde dans le programme ?</p>
    ${items.map((it, n) => `
      <div class="mj-item mj-${it.type}" data-k="${esc(it.k)}">
        <span class="mj-type">${esc(MAJ_ENTETES[it.type])}</span>
        <div class="mj-cmp">${col(it.prevu, "mj-prevu")}<span class="mj-fleche" aria-hidden="true">→</span>${col(it.fait, "mj-fait")}</div>
        <div class="mj-seg" role="radiogroup" aria-label="${esc(MAJ_ENTETES[it.type])} : que faire ?">
          ${it.options.map(([v, lab]) => `<label class="mj-opt"><input type="radio" name="mj-${n}" value="${esc(v)}" ${v === it.defaut ? "checked" : ""}><span>${esc(lab)}</span></label>`).join("")}
        </div>
      </div>`).join("")}
    <div class="program-actions">
      <button class="btn btn-primary" id="maj-go" aria-label="Mettre le programme à jour">${icon("tick")} Mettre à jour</button>
      <button class="btn btn-ghost" id="maj-non" aria-label="Ne rien changer au programme">${icon("x")} Ne rien changer</button>
    </div></div>`;
}

function majProgrammeLier(r) {
  const carte = document.getElementById("maj-card");
  const d = majDiff(r);
  if (!carte || !d || d.vide) return;
  document.getElementById("maj-non")?.addEventListener("click", () => { carte.innerHTML = `<p class="maj-q">Programme inchangé.</p>`; });
  document.getElementById("maj-go")?.addEventListener("click", () => {
    const c = { ajoutes: new Set(), retires: new Set(), modifies: new Set(), liens: new Set(), remp: new Map(), ordre: false };
    let n = 0;
    carte.querySelectorAll(".mj-item").forEach(el => {
      const k = el.dataset.k, v = (el.querySelector("input:checked") || {}).value;
      const [type, ...reste] = k.split(":"), cle = reste.join(":");
      if (type === "remp" && v !== "non") { c.remp.set(cle, v); n++; }
      else if (type === "retire" && v === "retirer") { c.retires.add(cle); n++; }
      else if (type === "ajout" && v === "ajouter") { c.ajoutes.add(cle); n++; }
      else if (type === "modif" && v === "appliquer") { c.modifies.add(cle); n++; }
      else if (type === "lien" && v === "appliquer") { c.liens.add(cle); n++; }
      else if (type === "ordre" && v === "appliquer") { c.ordre = true; n++; }
    });
    if (n) majAppliquer(r, d, c);
    carte.innerHTML = `<p class="maj-q">${n ? icon("tick") + " Programme mis à jour (" + n + " changement" + (n > 1 ? "s" : "") + ")." : "Programme inchangé."}</p>`;
  });
}
