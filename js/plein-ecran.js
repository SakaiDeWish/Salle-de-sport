/* =========================================================
   GymCoach — Plein écran de l'exercice en cours

   UNE VUE DE PLUS SUR `live`, PAS UN SECOND ÉTAT.
   Les champs de la liste (#poids-i, #reps-i, #rir-i, #temps-i) restent
   la source de vérité : le plein écran les lit, les écrit, puis appelle
   validateSet() et stepValue() tels quels. Rien n'est dupliqué.

   NAVIGUER NE CHANGE QUE L'AFFICHAGE. `live.currentIndex` et les chronos
   ne bougent qu'à la validation d'une série (déjà le cas dans
   validateSet). Un swipe accidentel se corrige donc en re-swipant.

   Trois moyens de naviguer, jamais un seul : glisser, bandes de bord
   (qui sont aussi les boutons Précédent et Suivant), flèches du clavier.
   ========================================================= */

const pe = { open: false, index: 0, pane: null, foot: "", moving: false, timer: null, detail: false, notes: new WeakMap() };

const elPe = document.getElementById("plein-ecran");
const elPeStage = document.getElementById("pe-stage");
const elPeFoot = document.getElementById("pe-foot");
const elPePos = document.getElementById("pe-pos");
const elPePrev = document.getElementById("pe-prev");
const elPeNext = document.getElementById("pe-next");
const elPeRest = document.getElementById("pe-rest");

/* Départ progressif : une courbe « expo » démarre à plus de 100 px par
   image sur 390 px, ce qui se lit comme un saut. Celle-ci plafonne autour de 45. */
const PE_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const peReduit = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const peRepos = () => !document.getElementById("rest-overlay").classList.contains("hidden");
const peN = () => (live && live.exercises ? live.exercises.length : 0);
const peFr = n => String(n).replace(".", ",");

/* ---------- Lecture des champs de la liste ---------- */

/* Valeur d'un champ de la liste. S'il est vide et qu'une série vient
   d'être faite dans cette séance, on reprend ses valeurs : la série
   suivante ressemble presque toujours à la précédente. */
function peValeur(i, champ, cleSerie) {
  const inp = document.getElementById(champ + "-" + i);
  if (!inp) return "";
  if (inp.value === "") {
    const sets = live.exercises[i].sets;
    const s = sets[sets.length - 1];
    if (s && s[cleSerie] != null) inp.value = String(s[cleSerie]);
  }
  return inp.value;
}

/* Une lecture de la colonne de droite : libellé, valeur, deux petits boutons de pas.
   La valeur est un bouton, pas un champ : un tap ouvre le pavé numérique de
   l'app (js/pave.js) sur le champ caché de la liste, qui reste la source
   de vérité. Le pas vient du pas-à-pas de la liste : une seule définition. */
function peLecture(i, champ, cleSerie, libelle, unite) {
  const src = document.getElementById(champ + "-" + i);
  if (!src) return "";
  const plus = document.querySelector(`.step-btn[data-target="${champ}-${i}"][data-delta="1"]`);
  const pas = plus ? parseFloat(plus.closest(".stepper").dataset.step) || 1 : 0;
  const v = peValeur(i, champ, cleSerie);
  const bouton = d => `<button type="button" class="pe-step" data-champ="${champ}" data-delta="${d}"
        aria-label="${d < 0 ? "Retirer" : "Ajouter"} ${peFr(pas)} ${libelle.toLowerCase()}">${icon(d < 0 ? "minus" : "plus")}</button>`;
  return `
    <div class="pe-champ" data-champ="${champ}">
      <button type="button" class="pe-lecture" data-saisie="${champ}" aria-label="${libelle} : ${v === "" ? "vide" : esc(peFr(v))}. Toucher pour saisir.">
        <span class="pe-label">${libelle}</span>
        <span class="pe-vl"><span class="pe-v${v === "" ? " vide" : ""}">${v === "" ? "–" : esc(peFr(v))}</span>${unite ? `<span class="pe-u">${unite}</span>` : ""}</span>
      </button>
      ${pas ? `<div class="pe-steps">${bouton(-1)}${bouton(1)}</div>` : ""}
    </div>`;
}

/* Une série en quelques caractères : « 60 × 10 », « 10 reps » (poids du corps)
   ou le temps d'un maintien. */
function peSerieTexte(s, statique) {
  if (!s) return "";
  if (statique) return [s.secondes ? fmtSec(s.secondes) : "", s.poids ? `+${peFr(s.poids)} kg` : ""].filter(Boolean).join(" ");
  if (!s.reps) return "";
  return s.poids ? `${peFr(s.poids)} × ${s.reps}` : `${s.reps} reps`;
}

/* Les séries, en colonne à gauche et en lecture seule. Une série faite montre
   ce qui a été fait, la série en cours et celles à venir montrent la séance
   précédente (`memoDepart`, figé au début de l'exercice : `recallSet` bouge
   dès qu'une série est validée). Au plus cinq lignes, pour que la hauteur
   de l'écran ne dépende jamais du nombre de séries. */
function peSeriesHTML(i) {
  const ex = live.exercises[i];
  const p = exerciseProgress(ex);
  const statique = estStatique(ex);
  const fait = ex.sets.length;
  const total = Math.max(p.target != null ? p.target : fait + 1, fait);
  const courant = fait < total ? fait : -1;
  const lignes = 5;
  const debut = Math.max(0, Math.min(courant >= 0 ? courant - 2 : total - lignes, total - lignes));
  let html = "";
  for (let k = debut; k < Math.min(total, debut + lignes); k++) {
    const s = ex.sets[k];
    const avantSet = Array.isArray(ex.memoDepart) ? ex.memoDepart[k] : recallSet(ex.exId, k);
    const avant = peSerieTexte(avantSet, statique);
    const etat = s ? "fait" : k === courant ? "courant" : "prevu";
    const rir = s && !statique && s.rir != null && s.rir !== "" ? ` <small>RIR ${esc(s.rir)}</small>` : "";
    const texte = s ? esc(peSerieTexte(s, statique)) + rir
      : avant ? (k === courant ? `<small>avant</small> ${esc(avant)}` : esc(avant)) : "–";
    html += `<li class="pe-ligne pe-${etat}"${k === courant ? ' aria-current="step"' : ""}>
      <span class="pe-n">${s ? icon("check") : k + 1}</span>
      <span class="pe-r">${texte}${s && s.note ? ` <span class="pe-note-ico" title="${esc(s.note)}">${icon("message")}</span>` : ""}</span>
    </li>`;
  }
  return `<ol class="pe-series" aria-label="Séries de l'exercice">${html}</ol>`;
}

/* Le schéma animé de la fiche, plein cadre derrière les données. Sans lui
   l'écran n'a plus de visuel : une erreur est journalisée, pas avalée. */
function peSchemaHTML(ex) {
  const fiche = allExercisesForUI().find(e => e.id === ex.exId) || { ...ex, id: ex.exId };
  try { return motionSVG(fiche); }
  catch (err) { console.error("Schéma indisponible pour " + ex.exId, err); return ""; }
}

/* La scène (le schéma) ne se redessine pas quand les données changent :
   sinon l'animation repartirait à chaque série validée. */
function peSceneHTML(i) {
  return `<div class="pe-fig">${peSchemaHTML(live.exercises[i])}</div>${peGuideHTML(live.exercises[i])}`;
}

/* Le guide d'exécution de la fiche, visible seulement dans le mode détail :
   étapes, erreurs à éviter et lien vers une démonstration vidéo. Ce sont
   les textes de l'app, rien d'externe n'est copié. */
function peGuideHTML(ex) {
  const fiche = allExercisesForUI().find(e => e.id === ex.exId);
  if (!fiche) return "";
  const etapes = (fiche.execution || []).map(s => `<li>${esc(s)}</li>`).join("");
  const pieges = (fiche.erreurs || []).map(s => `<li>${esc(s)}</li>`).join("");
  if (!etapes && !pieges) return "";
  return `<div class="pe-guide">
    ${etapes ? `<h3>Comment l'exécuter</h3><ol class="pe-pas">${etapes}</ol>` : ""}
    ${pieges ? `<h3>Erreurs à éviter</h3><ul class="pe-pieges">${pieges}</ul>` : ""}
    <a class="pe-video" href="${esc(youtubeSearchUrl(fiche))}" target="_blank" rel="noopener noreferrer">Voir une démonstration en vidéo</a>
  </div>`;
}

function peHudHTML(i) {
  const ex = live.exercises[i];
  const statique = estStatique(ex);
  const infos = [ex.target ? `Cible ${ex.target}` : "", ex.rir ? `RIR visé ${ex.rir}` : "", ex.tempo ? `tempo ${ex.tempo}` : ""]
    .filter(Boolean).join(", ");
  const avecRir = !statique && (ex.rir || peValeur(i, "rir", "rir") !== "");
  const lectures = statique
    ? [peLecture(i, "temps", "secondes", "Temps", "s"), peLecture(i, "poids", "poids", "Lest", "kg")]
    : [peLecture(i, "poids", "poids", "Poids", "kg"), peLecture(i, "reps", "reps", "Reps", ""),
       avecRir ? peLecture(i, "rir", "rir", "RIR", "") : ""];
  const lire = lectures.filter(Boolean).join("");
  return `
    <header class="pe-tete">
      <h2 class="pe-name" tabindex="-1">${esc(ex.nom)}</h2>
      ${infos ? `<p class="pe-line">${esc(infos)}</p>` : ""}
    </header>
    ${statique ? holdBloc(i) : ""}
    <div class="pe-bas">${peSeriesHTML(i)}</div>
    ${lire ? `<div class="pe-lire">${lire}</div>` : ""}`;
}

function pePaneHTML(i) {
  return `<button type="button" class="pe-loupe" data-act="detail" aria-pressed="false" aria-label="Voir le mouvement en détail">
      <span class="pe-loupe-ouvre">${icon("expand")}</span><span class="pe-loupe-ferme">${icon("x")}</span>
    </button>
    <div class="pe-scene">${peSceneHTML(i)}</div><div class="pe-hud">${peHudHTML(i)}</div>`;
}

/* Chrono de maintien : le bouton de la liste fait le travail, on le déclenche. */
function holdBloc(i) {
  const on = holdEnCours(i);
  return `<div class="pe-hold${on ? " on" : ""}">
    <span class="pe-hold-val" id="pe-hold-val">${fmtSec(on ? holdSecondes() : 0)}</span>
    <button type="button" class="btn ${on ? "btn-danger-ghost" : "btn-ghost"} pe-hold-go">${on ? "Arrêter" : "Démarrer"}</button>
  </div>`;
}

function peFootHTML(i) {
  const p = exerciseProgress(live.exercises[i]);
  const suiv = live.exercises[i + 1];
  const note = pe.notes.get(live.exercises[i]);
  const ensuite = `<div class="pe-rang">
    <p class="pe-ensuite">${suiv ? `<span>Ensuite</span><strong>${esc(suiv.nom)}</strong>` : "<span>Dernier exercice</span>"}</p>
    <button type="button" class="pe-note-btn${note ? " on" : ""}" data-act="note" aria-label="${note ? "Modifier la note de la série en cours" : "Ajouter une note à la série en cours"}">${icon("message")}<span>${note ? "Note ajoutée" : "Note"}</span></button>
  </div>`;
  if (!p.fini) return `${ensuite}<button type="button" class="btn btn-primary pe-go" data-act="valider">Valider la série</button>`;
  const suivant = nextUnfinished(i);
  return `${ensuite}<button type="button" class="btn btn-primary pe-go" data-act="${suivant != null ? "suivant" : "fermer"}">${suivant != null ? "Exercice suivant" : "Fermer"}</button>
    <button type="button" class="btn btn-ghost pe-more" data-act="plus">Ajouter une série</button>`;
}

/* ---------- Affichage ---------- */

function peBarre() {
  const n = peN();
  elPePos.innerHTML = `<span class="visually-hidden">Exercice ${pe.index + 1} sur ${n}</span><span aria-hidden="true">${pe.index + 1} / ${n}</span>`;
  elPePrev.disabled = pe.index <= 0;
  elPeNext.disabled = pe.index >= n - 1;
  const html = peFootHTML(pe.index);
  if (html !== pe.foot) { pe.foot = html; elPeFoot.innerHTML = html; }
}

function peCreerPane(i) {
  const d = document.createElement("div");
  d.className = "pe-pane";
  d.dataset.i = i;
  d.dataset.ex = live.exercises[i].exId;
  d.innerHTML = pePaneHTML(i);
  return d;
}

/* Les champs ont été relus depuis la liste : mise à jour sur place, sans animation. */
function peRefresh() {
  if (!pe.open) return;
  if (!live || !peN()) { peFermer(); return; }
  if (pe.index >= peN()) pe.index = peN() - 1;
  if (pe.pane) {
    /* Seules les données se redessinent : le schéma garde son animation.
       Si l'exercice affiché a été remplacé (échange), tout est refait. */
    const hud = pe.pane.querySelector(".pe-hud");
    if (hud && pe.pane.dataset.ex === live.exercises[pe.index].exId) hud.innerHTML = peHudHTML(pe.index);
    else { pe.pane.dataset.ex = live.exercises[pe.index].exId; pe.pane.innerHTML = pePaneHTML(pe.index); }
  }
  peBarre();
}

/* Passage à un autre exercice : le contenu glisse, il ne saute jamais.
   `dx` est le décalage déjà pris par le doigt, l'animation repart de là. */
function peAller(cible, sens, dx = 0) {
  if (cible < 0 || cible >= peN() || cible === pe.index || pe.moving) return;
  const ancien = pe.pane;
  const neuf = peCreerPane(cible);
  pe.index = cible;
  pe.pane = neuf;
  elPeStage.appendChild(neuf);
  peDetail(false, true);
  peBarre();

  const reduit = peReduit();
  const L = elPeStage.clientWidth;
  const dist = reduit ? 24 : L;
  const duree = reduit ? 160 : 300;
  const opts = { duration: duree, easing: PE_EASE };
  pe.moving = true;
  ancien.animate([
    { transform: `translateX(${dx}px)`, opacity: 1 },
    { transform: `translateX(${dx - sens * dist}px)`, opacity: reduit ? 0 : 1 }
  ], { ...opts, fill: "forwards" }).finished
    .catch(() => {})
    .then(() => { ancien.remove(); pe.moving = false; });
  neuf.animate([
    { transform: `translateX(${sens * dist + (reduit ? 0 : dx)}px)`, opacity: reduit ? 0 : 1 },
    { transform: "translateX(0)", opacity: 1 }
  ], opts);
  const nom = neuf.querySelector(".pe-name");
  if (nom) nom.focus({ preventScroll: true });
}

function peOuvrir(i) {
  if (!live || !peN()) return;
  pe.index = Math.min(Math.max(i, 0), peN() - 1);
  pe.open = true;
  pe.foot = "";
  elPeStage.querySelectorAll(".pe-pane").forEach(p => p.remove());
  pe.pane = peCreerPane(pe.index);
  elPeStage.appendChild(pe.pane);
  peDetail(false, true);
  elPe.classList.remove("hidden");
  document.documentElement.classList.add("pe-open");
  peBarre();
  peTick();
  pe.timer = setInterval(peTick, 250);
  pe.pane.querySelector(".pe-name").focus({ preventScroll: true });
}

function peFermer() {
  if (!pe.open) return;
  pe.open = false;
  clearInterval(pe.timer);
  elPe.classList.add("hidden");
  document.documentElement.classList.remove("pe-open");
  const retour = document.querySelector(".ex-plein");
  if (retour) retour.focus({ preventScroll: true });
}

/* Deux choses vivent à l'horloge : le maintien en cours, et le repos réduit
   (sinon on ne verrait plus le compte à rebours derrière le plein écran). */
function peTick() {
  if (!pe.open || !live) return;
  const hv = document.getElementById("pe-hold-val");
  if (hv && holdEnCours(pe.index)) hv.textContent = fmtSec(holdSecondes());
  const reduit = !!(typeof rest !== "undefined" && rest && restMinimized);
  elPeRest.classList.toggle("hidden", !reduit);
  if (reduit) {
    const reste = Math.round(rest.targetSec - (nowRef() - rest.startAt) / 1000);
    elPeRest.textContent = "Repos " + (reste >= 0 ? fmtSec(reste) : "+" + fmtSec(-reste));
  }
}

/* ---------- Actions ---------- */

function peValider() {
  const v = pe.index;
  const ex = live.exercises[v];
  /* Le champ obligatoire manquant ouvre le pavé : celui de la liste est
     caché derrière le plein écran. */
  const requis = estStatique(ex) ? (holdEnCours(v) ? null : "temps") : "reps";
  if (requis) {
    const f = document.getElementById(requis + "-" + v);
    const n = parseInt(f && f.value, 10);
    if (!n || n < 1) { if (f) ouvrirPave(f); return; }
  }
  const avant = ex.sets.length;
  validateSet(v);
  const note = pe.notes.get(ex);
  if (note && ex.sets.length > avant) {            // la note en attente part avec la série validée
    ex.sets[ex.sets.length - 1].note = note;
    pe.notes.delete(ex);
    saveLive();
    renderLiveExercises();
  }
  if (!pe.open) return;
  /* Superset : l'exercice courant a changé tout seul, l'affichage le suit. */
  const cur = live.currentIndex;
  if (cur !== v && cur >= 0 && cur < peN()) peAller(cur, cur > v ? 1 : -1);
}

function peStep(champ, delta) {
  const btn = document.querySelector(`.step-btn[data-target="${champ}-${pe.index}"][data-delta="${delta}"]`);
  if (!btn) return;
  stepValue(btn);          // écrit dans le champ de la liste et déclenche « input » : l'affichage suit
}

/* Détail : le schéma passe au premier plan, les données s'effacent. Le
   schéma glisse vers sa nouvelle place (FLIP), il ne saute pas. */
function peDetail(on, sansAnim) {
  const fig = pe.pane && pe.pane.querySelector(".motion-wrap");
  const avant = fig ? fig.getBoundingClientRect().top : 0;
  pe.detail = on;
  elPe.classList.toggle("pe-detail", on);
  const b = pe.pane && pe.pane.querySelector(".pe-loupe");
  if (b) {
    b.setAttribute("aria-pressed", String(on));
    b.setAttribute("aria-label", on ? "Revenir aux séries" : "Voir le mouvement en détail");
  }
  if (sansAnim || !fig) return;
  const apres = fig.getBoundingClientRect().top;
  if (Math.abs(avant - apres) > 1) {
    fig.animate([{ transform: `translateY(${avant - apres}px)` }, { transform: "translateY(0)" }],
      { duration: peReduit() ? 140 : 300, easing: PE_EASE });
  }
}

/* La valeur change dans le champ de la liste (pas, pavé, saisie) : la lecture suit sur place. */
document.addEventListener("input", e => {
  if (!pe.open) return;
  const m = /^(poids|reps|rir|temps)-(\d+)$/.exec(e.target.id || "");
  if (!m || +m[2] !== pe.index) return;
  const v = e.target.value;
  const out = elPe.querySelector(`.pe-champ[data-champ="${m[1]}"] .pe-v`);
  if (out) { out.textContent = v === "" ? "–" : peFr(v); out.classList.toggle("vide", v === ""); }
});

/* ---------- Événements ---------- */

document.addEventListener("click", e => {
  const entree = e.target.closest(".ex-plein");
  if (entree) { peOuvrir(parseInt(entree.dataset.i, 10)); return; }
  if (!pe.open || !elPe.contains(e.target)) return;
  if (e.target.closest("#pe-close")) { peFermer(); return; }
  if (e.target.closest("#pe-rest")) {
    restMinimized = false;
    document.getElementById("rest-overlay").classList.remove("hidden");
    return;
  }
  if (e.target.closest("#pe-prev")) { peAller(pe.index - 1, -1); return; }
  if (e.target.closest("#pe-next")) { peAller(pe.index + 1, 1); return; }
  if (e.target.closest(".pe-hold-go")) {
    const go = document.querySelector(`.hold-go[data-i="${pe.index}"]`);
    if (go) go.click();
    return;
  }
  const puce = e.target.closest("[data-puce]");
  if (puce) {
    const inp = document.getElementById("pe-note-in");
    inp.value = ((inp.value ? inp.value.replace(/\s*$/, "") + ", " : "") + puce.dataset.puce).slice(0, NOTE_MAX);
    return;
  }
  if (e.target.closest("[data-note=ok]")) { peNoteFermer(); return; }
  const lecture = e.target.closest("[data-saisie]");
  if (lecture) {
    if (performance.now() < peScrubFin) return;     // le doigt vient de faire défiler la valeur : pas un tap
    const f = document.getElementById(lecture.dataset.saisie + "-" + pe.index);
    if (f) ouvrirPave(f);
    return;
  }
  const act = e.target.closest("[data-act]");
  if (act) {
    const a = act.dataset.act;
    if (a === "detail") peDetail(!pe.detail);
    else if (a === "note") peNoteOuvrir();
    else if (a === "plus") { bonusRows.add(live.exercises[pe.index]); renderLiveExercises(); }
    else if (a === "valider") peValider();
    else if (a === "suivant") { const n = nextUnfinished(pe.index); if (n != null) peAller(n, n > pe.index ? 1 : -1); }
    else peFermer();
    return;
  }
  /* Au clavier un bouton de pas n'envoie qu'un clic (detail 0) ; au doigt,
     le pointerdown ci-dessous a déjà compté et répète. */
  const step = e.target.closest(".pe-step");
  if (step && e.detail === 0) { peStep(step.dataset.champ, step.dataset.delta); return; }
  /* Toucher le schéma lui-même, hors de ses boutons, ouvre ou ferme le détail. */
  if (e.target.closest(".pe-scene") && !e.target.closest("button, a, .pe-guide")) peDetail(!pe.detail);
});

/* Appui long sur − ou + : le pas se répète. */
let peRepet = null;
function peStopRepet() { clearTimeout(peRepet); clearInterval(peRepet); peRepet = null; }
elPe.addEventListener("pointerdown", e => {
  const b = e.target.closest(".pe-step");
  if (!b) return;
  e.preventDefault();                                   // pas de focus ni de sélection au doigt
  peStep(b.dataset.champ, b.dataset.delta);
  peRepet = setTimeout(() => {
    peRepet = setInterval(() => peStep(b.dataset.champ, b.dataset.delta), 110);
  }, 420);
});
["pointerup", "pointercancel", "pointerleave", "contextmenu"].forEach(t =>
  elPe.addEventListener(t, peStopRepet, true));

/* Faire défiler une valeur : le doigt posé sur le poids, les reps ou le RIR,
   glisser vers la droite augmente, vers la gauche diminue, d'un pas tous les
   PE_CRAN pixels. Un simple tap ouvre toujours le pavé. */
const PE_CRAN = 24;
let peScrub = null, peScrubFin = 0;
elPe.addEventListener("pointerdown", e => {
  const l = e.target.closest(".pe-lecture");
  if (!l || pe.moving) return;
  peScrub = { id: e.pointerId, el: l, champ: l.closest(".pe-champ").dataset.champ, x0: e.clientX, cran: 0, actif: false };
});
elPe.addEventListener("pointermove", e => {
  if (!peScrub || e.pointerId !== peScrub.id) return;
  const dx = e.clientX - peScrub.x0;
  if (!peScrub.actif) {
    if (Math.abs(dx) < 10) return;
    peScrub.actif = true;
    peScrub.el.classList.add("scrub");
    peScrub.el.setPointerCapture(e.pointerId);
  }
  const cran = Math.trunc(dx / PE_CRAN);
  while (peScrub.cran !== cran) {
    const sens = cran > peScrub.cran ? 1 : -1;
    peStep(peScrub.champ, sens);
    peScrub.cran += sens;
    if (typeof vibre === "function") vibre(6);
  }
});
function peScrubStop(e) {
  if (!peScrub || e.pointerId !== peScrub.id) return;
  peScrub.el.classList.remove("scrub");
  if (peScrub.actif) peScrubFin = performance.now() + 350;
  peScrub = null;
}
elPe.addEventListener("pointerup", peScrubStop);
elPe.addEventListener("pointercancel", peScrubStop);

/* Note de la série en cours : elle part avec la série quand on la valide. */
function peNoteConstruire() {
  const f = document.createElement("div");
  f.id = "pe-note";
  f.className = "pe-note hidden";
  f.setAttribute("role", "dialog");
  f.setAttribute("aria-modal", "true");
  f.setAttribute("aria-labelledby", "pe-note-titre");
  f.innerHTML = `
    <div class="pe-note-fond" data-note="ok"></div>
    <div class="pe-note-feuille" tabindex="-1">
      <p class="pe-note-titre" id="pe-note-titre"></p>
      <input type="text" id="pe-note-in" class="pe-note-in" maxlength="${NOTE_MAX}" enterkeyhint="done"
        placeholder="Ex : aidé sur les 2 dernières" aria-labelledby="pe-note-titre">
      <div class="pe-note-puces">${NOTE_RAPIDES.map(t => `<button type="button" class="chip" data-puce="${esc(t)}">${esc(t)}</button>`).join("")}</div>
      <button type="button" class="btn btn-primary pe-note-ok" data-note="ok">OK</button>
    </div>`;
  elPe.appendChild(f);
  feuilleGlisser(f.querySelector(".pe-note-feuille"), peNoteFermer, e => e.target.closest("input"));
  f.querySelector("#pe-note-in").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); peNoteFermer(); } });
  return f;
}
function peNoteOuvrir() {
  const ex = live.exercises[pe.index];
  const f = document.getElementById("pe-note") || peNoteConstruire();
  f.querySelector("#pe-note-titre").textContent = `Note pour la série ${ex.sets.length + 1}`;
  f.querySelector("#pe-note-in").value = pe.notes.get(ex) || "";
  f.classList.remove("hidden");
  f.querySelector(".pe-note-feuille").focus({ preventScroll: true });   // pas sur le champ : le clavier du téléphone ne s'ouvre que si on touche le champ
}
function peNoteFermer() {
  const f = document.getElementById("pe-note");
  if (!f || f.classList.contains("hidden")) return;
  const ex = live.exercises[pe.index];
  const v = f.querySelector("#pe-note-in").value.trim().slice(0, NOTE_MAX);
  if (v) pe.notes.set(ex, v); else pe.notes.delete(ex);    // fermer n'est jamais une perte : la note est gardée
  f.classList.add("hidden");
  f.querySelector("#pe-note-in").blur();
  peBarre();
  const b = elPeFoot.querySelector(".pe-note-btn");
  if (b) b.focus({ preventScroll: true });
}

/* Glisser horizontalement : le contenu suit le doigt, puis glisse ou revient. */
let peDrag = null;
elPeStage.addEventListener("pointerdown", e => {
  if (peRepos() || pe.moving) return;
  if (e.pointerType === "mouse" && e.button !== 0) return;
  if (e.target.closest("input, button, a, label")) return;
  if (e.clientX < 20 || e.clientX > window.innerWidth - 20) return;   // geste « retour » du système
  peDrag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, t0: performance.now(), actif: false };
});
elPeStage.addEventListener("pointermove", e => {
  if (!peDrag || e.pointerId !== peDrag.id) return;
  const dx = e.clientX - peDrag.x0, dy = e.clientY - peDrag.y0;
  if (!peDrag.actif) {
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    if (Math.abs(dy) > Math.abs(dx)) {
      if (dy > 0 && !pe.detail) peDrag.ferme = true;                  // vers le bas : fermer la fenêtre
      else { peDrag = null; return; }                                 // vers le haut, ou défilement du détail
    }
    peDrag.actif = true;
    elPeStage.setPointerCapture(e.pointerId);
  }
  if (peDrag.ferme) {
    peDrag.dy = Math.max(0, dy);
    elPe.style.transform = `translateY(${peDrag.dy}px)`;
    return;
  }
  const voisin = pe.index + (dx < 0 ? 1 : -1);
  const existe = voisin >= 0 && voisin < peN();
  peDrag.dx = existe ? dx : dx * 0.25;                                // résistance au bord
  pe.pane.style.transform = `translateX(${peDrag.dx}px)`;
});
function peFinDrag(e, annule) {
  if (!peDrag || e.pointerId !== peDrag.id) return;
  const d = peDrag;
  peDrag = null;
  if (!d.actif) return;
  if (d.ferme) {
    const h = elPe.offsetHeight;
    const v = d.dy / Math.max(1, performance.now() - d.t0);
    const ferme = !annule && (d.dy > h * 0.25 || (v > 0.5 && d.dy > 40));
    const a = elPe.animate(
      [{ transform: `translateY(${d.dy}px)` }, { transform: `translateY(${ferme ? h : 0}px)` }],
      { duration: peReduit() ? 140 : 300, easing: PE_EASE });
    elPe.style.transform = ferme ? `translateY(${h}px)` : "";
    a.finished.catch(() => {}).then(() => { if (ferme) peFermer(); elPe.style.transform = ""; });
    return;
  }
  const L = elPeStage.clientWidth;
  const vitesse = Math.abs(d.dx) / Math.max(1, performance.now() - d.t0);
  const sens = d.dx < 0 ? 1 : -1;
  const voisin = pe.index + sens;
  const valide = !annule && voisin >= 0 && voisin < peN() && (Math.abs(d.dx) > L * 0.25 || (vitesse > 0.5 && Math.abs(d.dx) > 30));
  if (valide) { peAller(voisin, sens, d.dx); return; }
  pe.pane.style.transform = "";
  pe.pane.animate([{ transform: `translateX(${d.dx}px)` }, { transform: "translateX(0)" }],
    { duration: peReduit() ? 120 : 220, easing: PE_EASE });
}
elPeStage.addEventListener("pointerup", e => peFinDrag(e, false));
elPeStage.addEventListener("pointercancel", e => peFinDrag(e, true));

document.addEventListener("keydown", e => {
  if (!pe.open || peRepos()) return;
  if (typeof pave !== "undefined" && pave) return;                    // le pavé a ses propres touches
  const feuille = document.getElementById("pe-note");
  if (feuille && !feuille.classList.contains("hidden")) {              // la note aussi
    if (e.key === "Escape") { e.preventDefault(); peNoteFermer(); }
    return;
  }
  if (e.key === "Escape" && pe.detail) { e.preventDefault(); peDetail(false); return; }
  if (e.key === "Escape") { e.preventDefault(); peFermer(); return; }
  if (e.key === "Tab") {                                              // focus piégé dans le plein écran
    const f = [...elPe.querySelectorAll("button:not([disabled]), input")].filter(x => x.offsetParent !== null && getComputedStyle(x).visibility !== "hidden");
    if (!f.length) return;
    const premier = f[0], dernier = f[f.length - 1];
    if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
    else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    return;
  }
  if (e.target.matches && e.target.matches("input, textarea")) return;
  if (e.key === "ArrowLeft") { e.preventDefault(); peAller(pe.index - 1, -1); }
  if (e.key === "ArrowRight") { e.preventDefault(); peAller(pe.index + 1, 1); }
});
