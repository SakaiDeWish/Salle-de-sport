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

const pe = { open: false, index: 0, pane: null, foot: "", moving: false, timer: null };

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

/* Un champ numérique de la bande de saisie : libellé, valeur éditable, deux boutons de pas.
   Le pas vient du pas-à-pas de la liste : une seule définition par champ. */
function peChamp(i, id, champ, cleSerie, libelle) {
  const plus = document.querySelector(`.step-btn[data-target="${champ}-${i}"][data-delta="1"]`);
  const pas = plus ? parseFloat(plus.closest(".stepper").dataset.step) || 1 : 0;
  const mode = champ === "poids" ? "decimal" : "numeric";
  const bouton = d => `<button type="button" class="pe-step" data-champ="${champ}" data-delta="${d}"
        aria-label="${d < 0 ? "Retirer" : "Ajouter"} ${peFr(pas)} ${libelle.toLowerCase()}">${d < 0 ? "−" : "+"}${peFr(pas)}</button>`;
  return `
    <div class="pe-field">
      <label class="pe-label" for="pe-in-${id}">${libelle}</label>
      <input class="pe-val" id="pe-in-${id}" data-champ="${champ}" type="number"
        inputmode="${mode}" min="0" step="${champ === "poids" ? "0.5" : "1"}" placeholder="0"
        value="${esc(peValeur(i, champ, cleSerie))}">
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

/* Le tableau des séries, en lecture seule : ce qui est fait, la série en
   cours, ce qui reste, et la séance précédente à côté. Au plus cinq lignes,
   pour que la hauteur de l'écran ne dépende jamais du nombre de séries.
   La séance précédente vient de `memoDepart`, figé au début de l'exercice :
   `recallSet` bouge dès qu'une série est validée. */
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
    const rir = s && !statique && s.rir != null && s.rir !== "" ? ` <small>RIR ${esc(s.rir)}</small>` : "";
    const etat = s ? "fait" : k === courant ? "courant" : "prevu";
    const contenu = s ? esc(peSerieTexte(s, statique)) + rir : k === courant ? "en cours" : "–";
    html += `<li class="pe-ligne pe-${etat}"${k === courant ? ' aria-current="step"' : ""}>
      <span class="pe-n">${k + 1}</span>
      <span class="pe-fait">${contenu}</span>
      <span class="pe-avant">${avant ? esc(avant) : "–"}</span>
      <span class="pe-ok">${s ? `${icon("check")}<span class="visually-hidden">validée</span>` : ""}</span>
    </li>`;
  }
  return `<div class="pe-series-bloc">
    <p class="pe-series-tete" aria-hidden="true"><span>Série</span><span>Fait</span><span>Avant</span><span></span></p>
    <ol class="pe-series" aria-label="Séries de l'exercice">${html}</ol>
  </div>`;
}

/* Le schéma animé de la fiche, en aperçu permanent. Sans lui l'écran
   n'a plus de visuel : une erreur est journalisée, pas avalée. */
function peSchemaHTML(ex) {
  const fiche = allExercisesForUI().find(e => e.id === ex.exId) || { ...ex, id: ex.exId };
  try { return motionSVG(fiche); }
  catch (err) { console.error("Schéma indisponible pour " + ex.exId, err); return ""; }
}

function pePaneHTML(i) {
  const ex = live.exercises[i];
  const statique = estStatique(ex);
  const infos = [ex.target ? `Cible ${ex.target}` : "", ex.rir ? `RIR visé ${ex.rir}` : "", ex.tempo ? `tempo ${ex.tempo}` : ""]
    .filter(Boolean).join(", ");
  const avecRir = !statique && (ex.rir || peValeur(i, "rir", "rir") !== "");
  const champs = statique
    ? [peChamp(i, "temps", "temps", "secondes", "Temps (s)"), peChamp(i, "poids", "poids", "poids", "Lest (kg)")]
    : [peChamp(i, "poids", "poids", "poids", "Poids (kg)"), peChamp(i, "reps", "reps", "reps", "Répétitions"),
       avecRir ? peChamp(i, "rir", "rir", "rir", "RIR") : ""].filter(Boolean);
  return `
    <div class="pe-haut">
      <h2 class="pe-name" tabindex="-1">${esc(ex.nom)}</h2>
      ${infos ? `<p class="pe-line">${esc(infos)}</p>` : ""}
      <div class="pe-schema">${peSchemaHTML(ex)}</div>
      ${statique ? holdBloc(i) : ""}
      ${peSeriesHTML(i)}
    </div>
    <div class="pe-saisie" style="--n:${champs.length}">${champs.join("")}</div>`;
}

/* Chrono de maintien : le bouton de la liste fait le travail, on le déclenche. */
function holdBloc(i) {
  const on = holdEnCours(i);
  return `<div class="pe-hold${on ? " on" : ""}">
    <span class="pe-hold-val" id="pe-hold-val">${fmtSec(on ? holdSecondes() : 0)}</span>
    <button type="button" class="btn ${on ? "btn-danger-ghost" : "btn-ghost"} pe-hold-go">${on ? "Arrêter le maintien" : "Démarrer le maintien"}</button>
  </div>`;
}

function peFootHTML(i) {
  const p = exerciseProgress(live.exercises[i]);
  const suiv = live.exercises[i + 1];
  const ensuite = `<p class="pe-ensuite">${suiv ? `Ensuite : ${esc(suiv.nom)}` : "Dernier exercice"}</p>`;
  if (!p.fini) return `${ensuite}<button type="button" class="btn btn-primary pe-go" data-act="valider">Valider la série</button>`;
  const suivant = nextUnfinished(i);
  return `${ensuite}<button type="button" class="btn btn-primary pe-go" data-act="${suivant != null ? "suivant" : "fermer"}">${suivant != null ? "Exercice suivant" : "Fermer"}</button>
    <button type="button" class="btn btn-ghost pe-more" data-act="valider">Ajouter une série</button>`;
}

/* ---------- Affichage ---------- */

function peBarre() {
  const n = peN();
  elPePos.textContent = `Exercice ${pe.index + 1} sur ${n}`;
  elPePrev.disabled = pe.index <= 0;
  elPeNext.disabled = pe.index >= n - 1;
  const html = peFootHTML(pe.index);
  if (html !== pe.foot) { pe.foot = html; elPeFoot.innerHTML = html; }
}

function peCreerPane(i) {
  const d = document.createElement("div");
  d.className = "pe-pane";
  d.dataset.i = i;
  d.innerHTML = pePaneHTML(i);
  return d;
}

/* Les champs ont été relus depuis la liste : mise à jour sur place, sans animation. */
function peRefresh() {
  if (!pe.open) return;
  if (!live || !peN()) { peFermer(); return; }
  if (pe.index >= peN()) pe.index = peN() - 1;
  if (pe.pane) pe.pane.innerHTML = pePaneHTML(pe.index);
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
  elPeStage.insertBefore(neuf, elPePrev);
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
  elPeStage.insertBefore(pe.pane, elPePrev);
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
  /* Le champ obligatoire manquant reçoit le focus ici : celui de la liste
     est caché derrière le plein écran. */
  const requis = estStatique(ex) ? (holdEnCours(v) ? null : "temps") : "reps";
  if (requis) {
    const f = document.getElementById("pe-in-" + requis);
    const n = parseInt(f && f.value, 10);
    if (!n || n < 1) { if (f) f.focus(); return; }
  }
  validateSet(v);
  if (!pe.open) return;
  /* Superset : l'exercice courant a changé tout seul, l'affichage le suit. */
  const cur = live.currentIndex;
  if (cur !== v && cur >= 0 && cur < peN()) peAller(cur, cur > v ? 1 : -1);
}

function peStep(champ, delta) {
  const btn = document.querySelector(`.step-btn[data-target="${champ}-${pe.index}"][data-delta="${delta}"]`);
  if (!btn) return;
  stepValue(btn);
  const inp = document.getElementById("pe-in-" + champ);
  const src = document.getElementById(champ + "-" + pe.index);
  if (inp && src) inp.value = src.value;
}

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
  const act = e.target.closest("[data-act]");
  if (act) {
    const a = act.dataset.act;
    if (a === "valider") peValider();
    else if (a === "suivant") { const n = nextUnfinished(pe.index); if (n != null) peAller(n, n > pe.index ? 1 : -1); }
    else peFermer();
    return;
  }
  /* Au clavier un bouton de pas n'envoie qu'un clic (detail 0) ; au doigt,
     le pointerdown ci-dessous a déjà compté et répète. */
  const step = e.target.closest(".pe-step");
  if (step && e.detail === 0) peStep(step.dataset.champ, step.dataset.delta);
});

/* Saisie directe : la valeur tapée est recopiée dans le champ de la liste. */
elPe.addEventListener("input", e => {
  const inp = e.target.closest(".pe-val");
  if (!inp) return;
  const src = document.getElementById(inp.dataset.champ + "-" + pe.index);
  if (src) src.value = inp.value;
});
elPe.addEventListener("focusin", e => {
  if (e.target.matches(".pe-val")) e.target.select();
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
    if (Math.abs(dy) > Math.abs(dx)) { peDrag = null; return; }       // défilement vertical
    peDrag.actif = true;
    elPeStage.setPointerCapture(e.pointerId);
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
  if (e.key === "Escape") { e.preventDefault(); peFermer(); return; }
  if (e.key === "Tab") {                                              // focus piégé dans le plein écran
    const f = [...elPe.querySelectorAll("button:not([disabled]), input")].filter(x => x.offsetParent !== null);
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
