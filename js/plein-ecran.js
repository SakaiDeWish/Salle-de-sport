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
/* L'écart avec la même série de la séance précédente (`memoDepart`) : « +5 »,
   « −2,5 ». Vide s'il n'y a rien à comparer ou si la valeur n'a pas bougé. */
function peEcartTexte(v, ref) {
  const d = Math.round((parseFloat(v) - parseFloat(ref)) * 100) / 100;
  if (!Number.isFinite(d) || d === 0) return { texte: "", sens: "" };
  return { texte: (d > 0 ? "+" : "−") + peFr(Math.abs(d)), sens: d > 0 ? "hausse" : "baisse" };
}
function peLecture(i, champ, cleSerie, libelle, unite) {
  if (!document.getElementById(champ + "-" + i)) return "";
  const v = peValeur(i, champ, cleSerie);
  const exo = live.exercises[i];
  const memo = Array.isArray(exo.memoDepart) ? exo.memoDepart[exo.sets.length] : null;
  const ref = memo && memo[cleSerie] != null && memo[cleSerie] !== "" ? memo[cleSerie] : null;
  const ec = ref != null && v !== "" ? peEcartTexte(v, ref) : { texte: "", sens: "" };
  /* Pas de boutons − et + : on tape pour saisir, on glisse pour changer, les
     flèches du clavier font le pas (voir l'écouteur « keydown »). */
  return `
    <div class="pe-champ" data-champ="${champ}"${ref != null ? ` data-ref="${esc(ref)}"` : ""}>
      <button type="button" class="pe-lecture" data-saisie="${champ}" data-unite="${esc(unite)}">
        <span class="pe-v${v === "" ? " vide" : ""}">${v === "" ? "–" : esc(peFr(v))}</span>
        <span class="pe-regle" aria-hidden="true"></span>
        <span class="pe-label">${libelle}${unite ? " " + unite : ""}<span class="pe-ecart" data-sens="${ec.sens}" title="Écart avec la séance précédente">${ec.texte}</span></span>
      </button>
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
/* Où en est l'exercice : combien de séries faites, laquelle est en cours. */
function peSeriesEtat(i) {
  const ex = live.exercises[i];
  const p = exerciseProgress(ex);
  const fait = ex.sets.length;
  const total = Math.max(p.target != null ? p.target : fait + 1, fait);
  return { ex, fait, total, courant: fait < total ? fait : -1, statique: estStatique(ex) };
}
function peAvantTexte(e, k) {
  const avantSet = Array.isArray(e.ex.memoDepart) ? e.ex.memoDepart[k] : recallSet(e.ex.exId, k);
  return peSerieTexte(avantSet, e.statique);
}

/* Sous le nom : la série en cours et ce qu'on avait fait à la même série la fois d'avant. */
function peSousTitre(i) {
  const e = peSeriesEtat(i);
  if (e.courant < 0) return `${e.fait} série${e.fait > 1 ? "s" : ""} faite${e.fait > 1 ? "s" : ""}`;
  const avant = peAvantTexte(e, e.courant);
  return `Série ${e.courant + 1} sur ${e.total}${avant ? ", avant " + avant : ""}`;
}

/* La frise : une pastille par série sur le bord gauche, reliées par un trait
   qui vire au vert une fois la série faite. La série en cours est plus grosse
   et porte son numéro. Au plus six pastilles, pour que la hauteur de l'écran
   ne dépende jamais du nombre de séries. Le détail de chaque série est dans
   son libellé accessible. */
function peFriseHTML(i) {
  const e = peSeriesEtat(i);
  const max = 6;
  const debut = Math.max(0, Math.min(e.courant >= 0 ? e.courant - 2 : e.total - max, e.total - max));
  let html = "";
  for (let k = debut; k < Math.min(e.total, debut + max); k++) {
    const s = e.ex.sets[k];
    const etat = s ? "fait" : k === e.courant ? "courant" : "prevu";
    const texte = s ? peSerieTexte(s, e.statique) : peAvantTexte(e, k);
    const nom = `Série ${k + 1}, ${s ? "faite" : k === e.courant ? "en cours" : "à venir"}${texte ? " : " + texte : ""}`;
    html += `<li class="pe-pt pe-${etat}${k > debut && e.ex.sets[k - 1] ? " apres-fait" : ""}" aria-label="${esc(nom)}"${k === e.courant ? ' aria-current="step"' : ""}>${k === e.courant ? `<span>${k + 1}</span>` : ""}</li>`;
  }
  return `<ol class="pe-frise" aria-label="Séries de l'exercice">${html}</ol>`;
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
      <p class="pe-line">${esc(peSousTitre(i))}</p>
      ${infos ? `<p class="pe-line">${esc(infos)}</p>` : ""}
    </header>
    ${statique ? holdBloc(i) : ""}
    <div class="pe-bas">${peFriseHTML(i)}</div>
    ${lire ? `<div class="pe-lire"><div class="pe-champs">${lire}</div><p class="pe-indice">Glisse un chiffre, touche pour saisir</p></div>` : ""}`;
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
  if (out) {
    out.textContent = v === "" ? "–" : peFr(v);
    out.classList.toggle("vide", v === "");
    const ch = out.closest(".pe-champ");
    const chip = ch && ch.querySelector(".pe-ecart");
    if (chip) {
      const ec = ch.dataset.ref !== undefined && v !== "" ? peEcartTexte(v, ch.dataset.ref) : { texte: "", sens: "" };
      chip.textContent = ec.texte;
      chip.dataset.sens = ec.sens;
    }
    if (typeof rebond === "function") rebond(out, 0.92, 1.1, 200);
  }
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
  /* Toucher le schéma lui-même, hors de ses boutons, ouvre ou ferme le détail. */
  if (e.target.closest(".pe-scene") && !e.target.closest("button, a, .pe-guide")) peDetail(!pe.detail);
});

/* Faire défiler une valeur : le doigt posé sur le poids, les reps ou le RIR,
   glisser vers la droite augmente, vers la gauche diminue, d'un pas tous les
   PE_CRAN pixels. Un simple tap ouvre toujours le pavé. */
const PE_CRAN = 24;
let peScrub = null, peScrubFin = 0;
elPe.addEventListener("pointerdown", e => {
  const l = e.target.closest(".pe-lecture");
  if (!l || pe.moving) return;
  const champ = l.closest(".pe-champ").dataset.champ;
  const src = document.getElementById(champ + "-" + pe.index);
  const v0 = src ? parseFloat(src.value) || 0 : 0;
  /* Pour le cadran : le pas du champ, la même série de la séance précédente
     (« avant »), et si l'exercice se fait à la barre (on montre les disques). */
  const plus = document.querySelector(`.step-btn[data-target="${champ}-${pe.index}"][data-delta="1"]`);
  const pas = plus ? parseFloat(plus.closest(".stepper").dataset.step) || 1 : 1;
  const ref = parseFloat(l.closest(".pe-champ").dataset.ref);
  const fiche = allExercisesForUI().find(f => f.id === live.exercises[pe.index].exId);
  peScrub = {
    id: e.pointerId, el: l, champ, x0: e.clientX, cran: 0, actif: false, v0, derniere: v0, unite: l.dataset.unite || "",
    pas, ref: Number.isFinite(ref) ? ref : null, passe: Number.isFinite(ref) && v0 > ref,
    barre: champ === "poids" && !!fiche && fiche.materiel === "barre"
  };
  l.style.setProperty("--dx", "0px");
  l.classList.add("presse");                       // la valeur grossit dès l'appui : on voit qu'elle est « tenue »
});
elPe.addEventListener("pointermove", e => {
  if (!peScrub || e.pointerId !== peScrub.id) return;
  const dx = e.clientX - peScrub.x0;
  if (!peScrub.actif) {
    if (Math.abs(dx) < 10) return;
    peScrub.actif = true;
    peScrub.el.classList.add("scrub");
    peScrub.el.setPointerCapture(e.pointerId);
    elPe.classList.add("pe-tient");                                  // le reste de l'écran s'estompe
    peScrub.el.closest(".pe-champ").classList.add("pe-champ-tenu");
    const b = peBulleEl();
    b.toggleAttribute("data-barre", peScrub.barre);
    b.querySelector(".pe-bulle-v").textContent = "";                  // les chiffres se refont, ils ne roulent pas depuis l'ancienne valeur
    b.querySelector(".pe-disques").textContent = "";
    const tape = b.querySelector(".pe-bulle-tape");
    peScrub.W = tape.clientWidth;
    tape.querySelectorAll(".pe-t").forEach(e => e.remove());
    peScrub.ticks = Array.from({ length: Math.ceil(peScrub.W / PE_CRAN) + 3 }, () => tape.appendChild(Object.assign(document.createElement("i"), { className: "pe-t" })));
    peBulleMaj(0);
    b.classList.add("on");
  }
  peScrub.el.style.setProperty("--dx", dx + "px");   // la règle défile avec le doigt
  const cran = Math.round(dx / PE_CRAN);             // la valeur change à mi-chemin entre deux graduations : la graduation choisie est toujours la plus proche du centre
  let dernierSens = 0;
  while (peScrub.cran !== cran) {
    const sens = cran > peScrub.cran ? 1 : -1;
    dernierSens = sens;
    peStep(peScrub.champ, sens);
    peScrub.cran += sens;
    const src = document.getElementById(peScrub.champ + "-" + pe.index);
    const val = src ? parseFloat(src.value) : NaN;
    /* Un cran net à chaque pas, un coup plus long à chaque palier de 10 kg,
       et un coup franc quand on dépasse ce qu'on avait fait la séance d'avant. */
    const palier = peScrub.champ === "poids" && Number.isFinite(val) && Math.floor(val / 10) !== Math.floor(peScrub.derniere / 10);
    if (Number.isFinite(val)) peScrub.derniere = val;
    let franchi = false;
    if (peScrub.ref != null && Number.isFinite(val) && (val > peScrub.ref) !== peScrub.passe) { peScrub.passe = !peScrub.passe; franchi = true; }
    if (typeof vibre === "function") vibre(franchi ? 45 : palier ? 28 : 10);
  }
  if (dernierSens) peBulleMaj(dernierSens);
  peBulleTape(dx);
});

/* Le cadran : pendant qu'on fait défiler une valeur, le doigt cache le
   chiffre. Une bande s'ouvre au centre de l'écran, toujours au même endroit :
   le chiffre en grand, qui roule comme un compteur ; une règle qui suit le
   doigt au pixel près, avec un repère « avant » (la même série la séance
   précédente) ; et, pour un exercice à la barre, la barre qui se charge de disques sous le doigt. */
let peBulle = null;
function peBulleEl() {
  if (!peBulle) {
    peBulle = document.createElement("div");
    peBulle.className = "pe-bulle";
    peBulle.setAttribute("aria-hidden", "true");
    peBulle.innerHTML = `<div class="pe-bulle-in">
      <div class="pe-bulle-haut"><span class="pe-bulle-v"></span><span class="pe-bulle-u"></span></div>
      <div class="pe-bulle-tape">
        <span class="pe-bulle-avant" hidden><span class="pe-bulle-avant-t"></span></span>
      </div>
      <div class="pe-bulle-barre"><span class="pe-collier"></span><div class="pe-disques"></div></div>
      <p class="pe-bulle-par"></p>
    </div>`;
    elPe.appendChild(peBulle);
  }
  return peBulle;
}

/* Les chiffres roulent : seul le chiffre qui change glisse (vers le haut quand
   la valeur monte, vers le bas quand elle descend). Si le nombre de chiffres
   change, tout est refait et apparaît en fondu. */
function peChiffres(el, txt, sens) {
  const nouveaux = [...txt];
  const boites = [...el.children];
  const reduit = peReduit(), duree = reduit ? 80 : 130, h = sens > 0 ? 100 : -100;
  if (boites.length !== nouveaux.length) {
    el.innerHTML = nouveaux.map(c => `<span class="ch"><span>${c}</span></span>`).join("");
    if (boites.length) el.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: duree });
    return;
  }
  nouveaux.forEach((c, k) => {
    const boite = boites[k];
    while (boite.children.length > 1) boite.firstElementChild.remove();   // un roulement encore en cours : on le termine
    const vieux = boite.firstElementChild;
    if (vieux.textContent === c) return;
    const neuf = document.createElement("span");
    neuf.textContent = c;
    boite.appendChild(neuf);
    vieux.animate([{ transform: "translateY(0)", opacity: 1 }, { transform: reduit ? "none" : `translateY(${-h}%)`, opacity: 0 }],
      { duration: duree, easing: PE_EASE, fill: "forwards" });
    neuf.animate([{ transform: reduit ? "none" : `translateY(${h}%)`, opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
      { duration: duree, easing: PE_EASE }).finished.catch(() => {}).then(() => { if (vieux.isConnected) vieux.remove(); });
  });
}

/* La barre : les disques à mettre de chaque côté (même calcul que l'outil de
   l'accueil). Un disque qui change entre en grossissant, un disque en trop
   s'efface. Hauteur et épaisseur imitent de vrais disques. */
const PE_DISQUES = { 25: [56, 14], 20: [52, 14], 15: [44, 13], 10: [36, 12], 5: [28, 10], 2.5: [22, 8], 1.25: [18, 6] };
function peDisque(p) {
  const d = document.createElement("span");
  const [h, w] = PE_DISQUES[p];
  d.className = "pe-disque";
  d.dataset.p = p;
  d.style.cssText = `height:${h}px;width:${w}px`;
  d.animate([{ transform: peReduit() ? "none" : "scale(0.4)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }],
    { duration: peReduit() ? 80 : 160, easing: PE_EASE });
  return d;
}
function peBarreMaj(v) {
  const box = peBulle.querySelector(".pe-disques");
  const total = parseFloat(v);
  const { pris, reste } = Number.isFinite(total) && total >= 20 ? disquesParCote(total) : { pris: [], reste: 0 };
  const vivants = [...box.children].filter(e => !e.dataset.sort);
  pris.forEach((p, i) => {
    const el = vivants[i];
    if (el && +el.dataset.p === p) return;
    const n = peDisque(p);
    if (el) { el.dataset.sort = "1"; box.replaceChild(n, el); } else box.appendChild(n);
  });
  vivants.slice(pris.length).forEach(el => {
    el.dataset.sort = "1";
    el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100 }).finished.catch(() => {}).then(() => el.remove());
  });
  peBulle.querySelector(".pe-bulle-par").textContent = !Number.isFinite(total) || total < 20 ? "Moins que la barre (20 kg)"
    : pris.length ? `Par côté : ${pris.map(peFr).join(" + ")}${reste ? `, reste ${peFr(reste)}` : ""}` : "Barre seule";
}

function peBulleMaj(sens) {
  if (!peScrub || !peBulle) return;
  const src = document.getElementById(peScrub.champ + "-" + pe.index);
  const v = src ? src.value : "";
  peChiffres(peBulle.querySelector(".pe-bulle-v"), v === "" ? "–" : peFr(v), sens);
  peBulle.querySelector(".pe-bulle-u").textContent = peScrub.unite;
  if (peScrub.barre) peBarreMaj(v);
}

/* La règle suit le doigt en continu (le chiffre, lui, change tous les PE_CRAN px).
   Si la valeur est bloquée (zéro), la règle s'arrête avec elle. */
function peBulleTape(dx) {
  if (!peScrub || !peBulle) return;
  const t = peBulle.querySelector(".pe-bulle-tape");
  const W = peScrub.W || t.clientWidth;
  const src = document.getElementById(peScrub.champ + "-" + pe.index);
  const val = src ? parseFloat(src.value) : NaN;
  const snap = Number.isFinite(val) ? ((val - peScrub.v0) / peScrub.pas) * PE_CRAN : dx;
  const dxEff = Math.abs(snap - peScrub.cran * PE_CRAN) < 1 ? dx : snap;
  /* Pas d'aiguille posée par-dessus : la graduation de la valeur courante est une
     graduation de la règle (plus haute, en volt), elle défile avec les autres.
     Chaque graduation garde un indice m (valeur = départ + m pas) ; l'indice ne
     change que pour celle qui sort de la bande, jamais pour une graduation visible. */
  const u = dxEff / PE_CRAN, n = peScrub.ticks.length;
  const cur = Number.isFinite(val) ? Math.round((val - peScrub.v0) / peScrub.pas) : peScrub.cran;
  peScrub.ticks.forEach((el, i) => {
    const m = i + n * Math.round((u - i) / n);
    el.style.translate = (W / 2 + (m - u) * PE_CRAN) + "px 0";
    el.dataset.d = Math.min(2, Math.abs(m - cur));
  });
  const av = t.querySelector(".pe-bulle-avant");
  if (peScrub.ref == null) { av.hidden = true; return; }
  av.hidden = false;
  const x = W / 2 + ((peScrub.ref - peScrub.v0) / peScrub.pas) * PE_CRAN - dxEff;
  const marge = 48;
  av.style.left = Math.min(W - marge, Math.max(marge, x)) + "px";
  av.dataset.passe = peScrub.passe ? "1" : "";
  const nom = "avant " + peFr(peScrub.ref);
  av.firstElementChild.textContent = nom;
}
function peScrubStop(e) {
  if (!peScrub || e.pointerId !== peScrub.id) return;
  peScrub.el.classList.remove("scrub", "presse");
  elPe.classList.remove("pe-tient");
  peScrub.el.closest(".pe-champ").classList.remove("pe-champ-tenu");
  if (peBulle) peBulle.classList.remove("on");
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
  /* Sans boutons − et +, les flèches sur une valeur font le pas. */
  const lec = e.target.closest && e.target.closest(".pe-lecture");
  if (lec && /^Arrow(Left|Right|Up|Down)$/.test(e.key)) {
    e.preventDefault();
    peStep(lec.closest(".pe-champ").dataset.champ, /Right|Up/.test(e.key) ? 1 : -1);
    return;
  }
  if (e.key === "ArrowLeft") { e.preventDefault(); peAller(pe.index - 1, -1); }
  if (e.key === "ArrowRight") { e.preventDefault(); peAller(pe.index + 1, 1); }
});
