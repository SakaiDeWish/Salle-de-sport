/* GymCoach — saisie personnalisée du poids, des reps, du RIR et du temps.
   1. PAS réglable par exercice (puce « ±2,5 » sur le champ poids) : la
      curl aux haltères avance de 1 kg, le squat de 5 kg, et l'app s'en
      souvient exercice par exercice.
   2. PAVÉ NUMÉRIQUE propre à l'app, à la place du clavier du téléphone :
      gros chiffres, ± au pas de l'exercice, touche « Clavier » en secours.
   3. DISQUES pour les exercices à barre : on compose la charge avec les
      disques de chaque côté, la barre à vide étant réglable. */
const PAS_CLE = "gymcoach.pas";            // { exId: pas du poids en kg }
const BARRE_CLE = "gymcoach.barre";        // { exId: poids de la barre à vide }
const PAS_POIDS = [1, 2, 2.5, 5, 10];
const BARRES = [20, 15, 10];
const DISQUES = [25, 20, 15, 10, 5, 2.5, 1.25];

function lireMap(cle) { try { return JSON.parse(localStorage.getItem(cle)) || {}; } catch { return {}; } }
function ecrireMap(cle, exId, v) {
  try { const m = lireMap(cle); m[exId] = v; localStorage.setItem(cle, JSON.stringify(m)); } catch { /* stockage indisponible */ }
}
/* Pas par défaut : les haltères montent de 2 kg en 2 kg (la paire grimpe
   donc de 2 en 2 sur chaque main), le reste par 2,5 kg. Le choix fait sur
   la puce, lui, prime toujours. */
function pasParDefaut(exId) {
  const def = typeof allExercisesForUI === "function" ? allExercisesForUI().find(e => e.id === exId) : null;
  return def && def.materiel === "halteres" ? 2 : 2.5;
}
function pasPoids(exId) { const v = lireMap(PAS_CLE)[exId]; return PAS_POIDS.includes(v) ? v : pasParDefaut(exId); }
function poidsBarre(exId) { const v = lireMap(BARRE_CLE)[exId]; return BARRES.includes(v) ? v : 20; }
const fmtNb = n => String(Math.round(n * 100) / 100).replace(".", ",");

/* Décompose une charge en disques PAR CÔTÉ (glouton, du plus lourd au plus léger).
   Renvoie null si la charge est sous la barre ou si elle n'est pas atteignable
   avec les disques disponibles : mieux vaut le dire que d'arrondir en silence. */
function disquesPourCharge(total, barre) {
  if (!(total >= barre)) return null;
  let reste = Math.round(((total - barre) / 2) * 100) / 100;
  const out = [];
  for (const d of DISQUES) while (reste >= d - 1e-9) { out.push(d); reste = Math.round((reste - d) * 100) / 100; }
  return reste === 0 ? out : null;
}

/* ---------- Puce de pas ---------- */
document.addEventListener("click", e => {
  const chip = e.target.closest(".step-pas");
  if (!chip) return;
  const exId = chip.dataset.exid;
  const suiv = PAS_POIDS[(PAS_POIDS.indexOf(pasPoids(exId)) + 1) % PAS_POIDS.length];
  ecrireMap(PAS_CLE, exId, suiv);
  document.querySelectorAll(`.step-pas[data-exid="${exId}"]`).forEach(c => {
    c.textContent = "±" + fmtNb(suiv);
    const grp = c.closest(".stepper");
    if (grp) grp.dataset.step = String(suiv);
  });
});

/* ---------- Pavé ---------- */
let pave = null;      // { id, kind, exId, texte, frais, pas, materiel }
let paveEl = null;
let clavierNatif = null;

function exerciceDuChamp(champ) {
  const m = /^(?:poids|reps|rir|temps)-(\d+)$/.exec(champ.id);
  const i = m ? +m[1] : (typeof editingSet !== "undefined" && editingSet ? editingSet.i : null);
  const ex = (typeof live !== "undefined" && live && i != null) ? live.exercises[i] : null;
  return ex || null;
}
function genreDuChamp(id) {
  if (/^(ed-)?poids/.test(id)) return "poids";
  if (/^(ed-)?reps/.test(id)) return "reps";
  if (/^(ed-)?rir/.test(id)) return "rir";
  return "temps";
}

function construirePave() {
  paveEl = document.createElement("div");
  paveEl.id = "pave";
  paveEl.className = "pave hidden";
  paveEl.setAttribute("role", "dialog");
  paveEl.setAttribute("aria-modal", "true");
  paveEl.innerHTML = `
    <div class="pave-fond" data-pave="fermer"></div>
    <div class="pave-feuille">
      <div class="pave-tete"><span class="pave-lab" id="pave-lab"></span>
        <button type="button" class="pave-lien" data-pave="clavier">Clavier</button></div>
      <div class="pave-aff"><span id="pave-val">0</span><span class="pave-unite" id="pave-unite"></span></div>
      <div class="pave-disques hidden" id="pave-disques">
        <div class="pave-ligne"><span id="pave-cote"></span>
          <button type="button" class="pave-chip" data-pave="barre"></button></div>
        <div class="pave-rang" id="pave-rang"></div>
      </div>
      <div class="pave-pas">
        <button type="button" class="pave-k pave-k-pm" data-pave="moins"></button>
        <button type="button" class="pave-k pave-k-pm" data-pave="plus"></button>
      </div>
      <div class="pave-touches">
        ${[1,2,3,4,5,6,7,8,9].map(n => `<button type="button" class="pave-k" data-k="${n}">${n}</button>`).join("")}
        <button type="button" class="pave-k" data-k="," id="pave-virg">,</button>
        <button type="button" class="pave-k" data-k="0">0</button>
        <button type="button" class="pave-k" data-pave="eff" aria-label="Effacer le dernier chiffre">${typeof icon === "function" ? icon("x") : "⌫"}</button>
      </div>
      <button type="button" class="btn btn-primary pave-ok" data-pave="ok">OK</button>
    </div>`;
  document.body.appendChild(paveEl);
  feuilleGlisser(paveEl.querySelector(".pave-feuille"), fermerPave);
  paveEl.addEventListener("click", e => {
    const t = e.target.closest("[data-k],[data-pave],[data-disque]");
    if (!t || !pave) return;
    if (t.dataset.k != null) return frappe(t.dataset.k);
    if (t.dataset.disque != null) return ajouteDisque(+t.dataset.disque);
    const a = t.dataset.pave;
    if (a === "ok" || a === "fermer") return fermerPave();
    if (a === "eff") { pave.frais = false; pave.texte = pave.texte.slice(0, -1); return majPave(); }
    if (a === "moins" || a === "plus") {
      const base = parseFloat((pave.texte || "0").replace(",", ".")) || 0;
      const v = Math.max(pave.min, Math.round((base + (a === "plus" ? 1 : -1) * pave.pas) * 100) / 100);
      pave.texte = String(v).replace(".", ","); pave.frais = false; return majPave();
    }
    if (a === "barre") {
      const suiv = BARRES[(BARRES.indexOf(poidsBarre(pave.exId)) + 1) % BARRES.length];
      ecrireMap(BARRE_CLE, pave.exId, suiv); return majPave();
    }
    if (a === "clavier") {
      const id = pave.id; fermerPave(); clavierNatif = id;
      const c = document.getElementById(id);
      if (c) { c.setAttribute("inputmode", pave.kind === "poids" ? "decimal" : "numeric"); c.focus(); }
    }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && pave) fermerPave(); });
}

/* Glisser vers le bas pour fermer une feuille (pavé, note...). La feuille suit
   le doigt, puis glisse hors de l'écran ou revient : elle ne saute jamais.
   `ignore(e)` écarte les départs qui ne doivent pas lancer le geste (un champ
   de texte, par exemple). Un simple tap n'est jamais pris pour un glissement. */
function feuilleGlisser(feuille, fermer, ignore) {
  let d = null;
  const reduit = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  feuille.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (ignore && ignore(e)) return;
    d = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dy: 0, actif: false, t0: performance.now() };
  });
  feuille.addEventListener("pointermove", e => {
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
    if (!d.actif) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (dy <= 0 || Math.abs(dx) > dy) { d = null; return; }       // vers le haut ou de côté : pas un geste de fermeture
      d.actif = true;
      feuille.setPointerCapture(e.pointerId);
    }
    d.dy = Math.max(0, dy);
    feuille.style.transform = `translateY(${d.dy}px)`;
  });
  const fin = (e, annule) => {
    if (!d || e.pointerId !== d.id) return;
    const x = d; d = null;
    if (!x.actif) return;
    const h = feuille.offsetHeight;
    const v = x.dy / Math.max(1, performance.now() - x.t0);
    const ferme = !annule && (x.dy > h * 0.3 || (v > 0.5 && x.dy > 40));
    const a = feuille.animate(
      [{ transform: `translateY(${x.dy}px)` }, { transform: `translateY(${ferme ? h : 0}px)` }],
      { duration: reduit() ? 140 : 220, easing: "cubic-bezier(0.4, 0, 0.2, 1)" });
    feuille.style.transform = ferme ? `translateY(${h}px)` : "";
    a.finished.catch(() => {}).then(() => { if (ferme) fermer(); feuille.style.transform = ""; });
  };
  feuille.addEventListener("pointerup", e => fin(e, false));
  feuille.addEventListener("pointercancel", e => fin(e, true));
}

function frappe(k) {
  if (pave.frais) { pave.texte = ""; pave.frais = false; }   // la 1re touche remplace, comme une calculette
  if (k === ",") { if (pave.kind !== "poids" || pave.texte.includes(",")) return; if (!pave.texte) pave.texte = "0"; }
  if (pave.texte.replace(",", "").length >= 6) return;
  pave.texte += k;
  majPave();
}
function ajouteDisque(d) {
  const base = parseFloat((pave.texte || "0").replace(",", ".")) || 0;
  const depart = pave.frais && base < poidsBarre(pave.exId) ? poidsBarre(pave.exId) : base;
  pave.texte = fmtNb(depart + 2 * d); pave.frais = false; majPave();
}

function majPave() {
  const champ = document.getElementById(pave.id);
  document.getElementById("pave-val").textContent = pave.texte === "" ? "0" : pave.texte;
  document.getElementById("pave-virg").disabled = pave.kind !== "poids";
  const sens = pave.kind === "poids" ? "kg" : pave.kind === "temps" ? "s" : pave.kind === "rir" ? "en réserve" : "reps";
  document.getElementById("pave-unite").textContent = sens;
  const pm = paveEl.querySelectorAll(".pave-k-pm");
  pm[0].textContent = "− " + fmtNb(pave.pas); pm[1].textContent = "+ " + fmtNb(pave.pas);
  const bloc = document.getElementById("pave-disques");
  bloc.classList.toggle("hidden", !(pave.kind === "poids" && pave.materiel === "barre"));
  if (pave.kind === "poids" && pave.materiel === "barre") {
    const barre = poidsBarre(pave.exId);
    const total = parseFloat((pave.texte || "0").replace(",", "."));
    const dq = disquesPourCharge(total, barre);
    document.getElementById("pave-cote").textContent = !(total >= barre)
      ? "Sous la barre à vide"
      : dq === null ? "Pas faisable avec ces disques"
      : dq.length ? "Par côté : " + dq.map(fmtNb).join(" + ") : "Barre à vide";
    bloc.querySelector("[data-pave=barre]").textContent = "Barre " + barre + " kg";
    document.getElementById("pave-rang").innerHTML =
      DISQUES.map(d => `<button type="button" class="pave-disque" data-disque="${d}">${fmtNb(d)}</button>`).join("");
  }
  const val = document.getElementById("pave-val");
  if (val && typeof rebond === "function") rebond(val, 0.9, 1.07, 220);
  if (champ) {            // écriture immédiate : fermer le pavé n'est jamais une perte
    champ.value = pave.texte === "" ? "" : pave.texte.replace(",", ".");
    champ.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function ouvrirPave(champ) {
  if (!paveEl) construirePave();
  const ex = exerciceDuChamp(champ);
  const kind = genreDuChamp(champ.id);
  const def = ex && typeof allExercisesForUI === "function" ? allExercisesForUI().find(e => e.id === ex.exId) : null;
  pave = { id: champ.id, kind, exId: ex ? ex.exId : "?", materiel: def ? def.materiel : null,
    pas: kind === "poids" ? pasPoids(ex ? ex.exId : "?") : kind === "temps" ? 5 : 1,
    min: kind === "reps" || kind === "temps" ? 1 : 0,
    texte: champ.value === "" ? "" : String(champ.value).replace(".", ","), frais: true };
  document.getElementById("pave-lab").textContent =
    (champ.getAttribute("aria-label") || champ.placeholder || "") + (ex ? " · " + ex.nom : "");
  paveEl.classList.remove("hidden");
  majPave();
  paveEl.querySelector(".pave-ok").focus({ preventScroll: true });
}
function fermerPave() {
  if (!paveEl) return;
  paveEl.classList.add("hidden");
  const id = pave && pave.id;
  pave = null;
  const c = id && document.getElementById(id);
  if (c) c.dispatchEvent(new Event("change", { bubbles: true }));
}

/* Un champ de la séance qui prend le focus ouvre le pavé, sauf si
   l'utilisateur a demandé le clavier du téléphone pour CE champ. */
document.addEventListener("focusin", e => {
  const c = e.target;
  if (!(c instanceof HTMLInputElement) || c.type !== "number") return;
  if (!c.closest("#live-exercises")) return;
  if (clavierNatif === c.id) return;
  c.blur();
  ouvrirPave(c);
});
document.addEventListener("focusout", e => { if (e.target && e.target.id === clavierNatif) clavierNatif = null; });
