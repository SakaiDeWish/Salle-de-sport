/* ====================================================================
   shell.js — coquille de navigation (itération « accueil au centre »)

   Ce fichier ne réécrit aucune vue existante : il déplace des nœuds,
   ajoute un panneau et deux réglages. Tout ce qui marchait avant marche
   toujours, y compris les écouteurs déjà posés par les autres fichiers.
   ==================================================================== */

STORAGE_KEYS.restSound = "gymcoach.restSound";
STORAGE_KEYS.restVibrate = "gymcoach.restVibrate";
STORAGE_KEYS.restVolume = "gymcoach.restVolume";

/* ==================== PANNEAU DE VUE ==================== */
/* Nutrition et Bibliothèque n'ont plus d'onglet (points 1 et 2). Plutôt
   que de recopier leur HTML — ce qui dupliquerait des dizaines
   d'identifiants et casserait les écouteurs posés au chargement — on
   DÉPLACE le <main> dans le panneau, puis on le remet exactement où il
   était. Le DOM reste unique, le code de rendu n'est pas touché. */
let panelRetour = null;   // { noeud, parent, suivant }

function panelEl() { return document.getElementById("panel"); }

function openViewPanel(view, titre) {
  const noeud = document.getElementById("view-" + view);
  const host = document.getElementById("panel-host");
  if (!noeud || !host) return;
  if (panelRetour) closeViewPanel(true);

  panelRetour = { noeud, parent: noeud.parentNode, suivant: noeud.nextSibling };
  host.appendChild(noeud);
  noeud.classList.add("active", "as-panel");
  document.getElementById("panel-title").textContent = titre || "";

  const el = panelEl();
  el.classList.remove("hidden");
  requestAnimationFrame(() => el.classList.add("sheet-in"));
  const scroll = el.querySelector(".sheet-scroll");
  if (scroll) scroll.scrollTop = 0;

  /* Chaque vue a son rendu ; on le relance à l'ouverture pour que le
     panneau montre l'état courant et non celui du chargement. */
  try {
    if (view === "bibliotheque" && typeof renderLibrary === "function") renderLibrary();
    if (view === "nutrition" && typeof renderNutrition === "function") renderNutrition();
  } catch (e) { /* une vue non initialisée ne doit pas bloquer l'ouverture */ }
}

function closeViewPanel(immediat) {
  const el = panelEl();
  if (!el) return;
  el.classList.remove("sheet-in");
  const rendre = () => {
    if (!panelRetour) { el.classList.add("hidden"); return; }
    const { noeud, parent, suivant } = panelRetour;
    noeud.classList.remove("active", "as-panel");
    parent.insertBefore(noeud, suivant);      // remis à sa place exacte
    panelRetour = null;
    el.classList.add("hidden");
    const host = document.getElementById("panel-host");
    if (host) host.innerHTML = "";            // vide le contenu généré (réglages)
  };
  if (immediat) rendre();
  else setTimeout(() => { if (!el.classList.contains("sheet-in")) rendre(); }, 240);
}

/* Panneau à contenu généré (réglages) : même feuille, sans déplacement */
function openHtmlPanel(titre, html) {
  if (panelRetour) closeViewPanel(true);
  const host = document.getElementById("panel-host");
  if (!host) return;
  host.innerHTML = html;
  document.getElementById("panel-title").textContent = titre;
  const el = panelEl();
  el.classList.remove("hidden");
  requestAnimationFrame(() => el.classList.add("sheet-in"));
  const scroll = el.querySelector(".sheet-scroll");
  if (scroll) scroll.scrollTop = 0;
}

document.getElementById("panel-close").addEventListener("click", () => closeViewPanel());
panelEl().addEventListener("click", e => { if (e.target === panelEl()) closeViewPanel(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !panelEl().classList.contains("hidden")) closeViewPanel();
});

/* Changer d'onglet referme le panneau : sans ça, activateView retirerait
   la classe .active de la vue déplacée et laisserait un panneau vide. */
if (typeof activateView === "function") {
  const _activate = activateView;
  window.activateView = function (view) {
    /* Les deux vues sans onglet s'ouvrent en panneau, d'où qu'on les appelle
       (tuiles d'accueil, liens de programme, mini-barre…). L'onglet visible
       ne change pas : on reste sur l'accueil, comme demandé. */
    if (view === "nutrition") return openViewPanel("nutrition", "Nutrition");
    if (view === "bibliotheque") return openViewPanel("bibliotheque", "Bibliothèque d'exercices");
    if (panelRetour || !panelEl().classList.contains("hidden")) closeViewPanel(true);
    return _activate(view);
  };
  activateView = window.activateView;
}

/* ==================== RÉGLAGES ==================== */
function restSoundOn() { return localStorage.getItem(STORAGE_KEYS.restSound) !== "0"; }
/* Le volume est défini dans workout.js — restVolume() — avec le bip
   qu'il pilote. On l'appelle, on ne le redéclare PAS : deux fonctions du
   même nom dans deux fichiers non modulaires, c'est la seconde qui
   gagne, et laquelle dépend de l'ordre des <script>. */
function volPct() {
  return typeof restVolume === "function" ? restVolume() : 70;
}
function restVibrateOn() { return localStorage.getItem(STORAGE_KEYS.restVibrate) !== "0"; }
function currentTheme() { return localStorage.getItem("gymcoach.theme") || "gamifie"; }

function applyTheme(theme) {
  document.documentElement.className = "theme-" + theme;
  localStorage.setItem("gymcoach.theme", theme);
  const lab = document.getElementById("theme-toggle-label");
  if (lab) lab.textContent = theme === "gamifie" ? "Épuré" : "Gamifié";
  const ico = document.getElementById("settings-fab-ico");
  if (ico) ico.textContent = theme === "gamifie" ? "☾" : "☀";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "gamifie" ? "#0a0a0b" : "#f6f1e7");
}

function settingsHtml() {
  const t = currentTheme();
  return `
    <div class="card set-card">
      <h3 class="set-h">Apparence</h3>
      <div class="set-row">
        <span class="set-lab">Thème</span>
        <div class="seg-mini" role="group" aria-label="Choix du thème">
          <button class="segm ${t === "gamifie" ? "active" : ""}" data-theme="gamifie">☾ Sombre</button>
          <button class="segm ${t === "epure" ? "active" : ""}" data-theme="epure">☀ Clair</button>
        </div>
      </div>
    </div>

    <div class="card set-card">
      <h3 class="set-h">Fin du temps de repos</h3>
      <label class="set-row set-check">
        <span class="set-lab">Bip sonore
          <span class="set-sub">Un seul bip court de 260 ms, à 1000 Hz.</span></span>
        <input type="checkbox" id="set-sound" ${restSoundOn() ? "checked" : ""}>
      </label>
      <div class="set-vol${restSoundOn() ? "" : " off"}" id="set-vol-bloc">
        <div class="set-vol-head">
          <span class="set-lab">Volume du bip</span>
          <span class="set-vol-val" id="set-vol-val">${volPct()} %</span>
        </div>
        <input type="range" class="vol-range" id="set-vol" min="0" max="100" step="5"
          value="${volPct()}" aria-label="Volume du bip sonore"
          aria-valuetext="${volPct()} pour cent">
        <p class="set-sub">Le curseur se relâche sur un bip d'essai. À 0 %, le bip se tait
          — la vibration, elle, continue si elle est active.</p>
      </div>
      <label class="set-row set-check">
        <span class="set-lab">Vibration
          <span class="set-sub">Une impulsion brève, si l'appareil le permet.</span></span>
        <input type="checkbox" id="set-vibrate" ${restVibrateOn() ? "checked" : ""}>
      </label>
      <button class="btn btn-ghost btn-sm" id="set-test-son">Tester le signal</button>
    </div>

    <div class="card set-card">
      <h3 class="set-h">À propos</h3>
      <p class="set-sub">GYMCOACH — Échauffe-toi avant chaque séance ; en cas de doute,
        consulte un professionnel de santé.</p>
    </div>`;
}

function openSettings() {
  openHtmlPanel("Réglages", settingsHtml());
  const host = document.getElementById("panel-host");
  host.querySelectorAll("[data-theme]").forEach(b =>
    b.addEventListener("click", () => {
      applyTheme(b.dataset.theme);
      host.querySelectorAll("[data-theme]").forEach(x =>
        x.classList.toggle("active", x.dataset.theme === b.dataset.theme));
    }));
  const s = document.getElementById("set-sound");
  const v = document.getElementById("set-vibrate");
  const vol = document.getElementById("set-vol");
  const volVal = document.getElementById("set-vol-val");
  const volBloc = document.getElementById("set-vol-bloc");
  s.addEventListener("change", () => {
    localStorage.setItem(STORAGE_KEYS.restSound, s.checked ? "1" : "0");
    /* Un curseur de volume sous un son coupé ne veut rien dire : il
       s'estompe et se verrouille plutôt que de mentir. */
    volBloc.classList.toggle("off", !s.checked);
    vol.disabled = !s.checked;
  });
  vol.disabled = !s.checked;
  /* Pendant le glissement : on met à jour le chiffre et la portion
     colorée de la piste, rien de plus — un bip à chaque pixel serait
     une mitraillette. */
  const peindre = () => vol.style.setProperty("--vol", vol.value);
  peindre();
  vol.addEventListener("input", () => {
    volVal.textContent = vol.value + " %";
    vol.setAttribute("aria-valuetext", vol.value + " pour cent");
    peindre();
  });
  /* Au relâchement : on enregistre, et on fait ENTENDRE le résultat.
     Régler un volume sans l'entendre revient à choisir à l'aveugle. */
  vol.addEventListener("change", () => {
    localStorage.setItem(STORAGE_KEYS.restVolume, vol.value);
    if (typeof beep === "function") beep(true, +vol.value);
  });
  v.addEventListener("change", () => localStorage.setItem(STORAGE_KEYS.restVibrate, v.checked ? "1" : "0"));
  document.getElementById("set-test-son").addEventListener("click", () => {
    if (typeof beep === "function") beep(true);
  });
}

document.getElementById("settings-fab").addEventListener("click", openSettings);

/* Le bouton Réglages s'efface quand la mini-barre de séance occupe le bas
   de l'écran : deux pastilles superposées au même endroit, ce serait un
   piège au pouce. On observe la classe de la mini-barre plutôt que de
   sonder en boucle — aucun coût quand rien ne bouge. */
(function () {
  const barre = document.getElementById("live-minibar");
  if (!barre) return;
  const sync = () => document.body.classList.toggle("live-on", !barre.classList.contains("hidden"));
  new MutationObserver(sync).observe(barre, { attributes: true, attributeFilter: ["class"] });
  sync();
})();

/* L'ancienne bascule de la barre du haut reste fonctionnelle sur desktop :
   elle passe simplement par le même chemin que le panneau. */
(function () {
  const vieux = document.getElementById("theme-toggle");
  if (!vieux) return;
  const clone = vieux.cloneNode(true);      // retire l'écouteur d'origine
  vieux.parentNode.replaceChild(clone, vieux);
  clone.addEventListener("click", () =>
    applyTheme(currentTheme() === "gamifie" ? "epure" : "gamifie"));
})();

applyTheme(currentTheme());

/* ==================== RETOUR AU CHRONO ==================== */
/* Le chrono se réduit en descendant, et il RESTE réduit : la remontée ne
   le ré-ouvre plus (voir onLiveScroll). Le geste de « flick » qui le
   rappelait automatiquement a été retiré pour la même raison — il se
   déclenchait sur des remontées que l'utilisateur ne destinait pas à ça.
   Reste ce bouton flottant, discret, qui ramène en haut et ré-ouvre le
   chrono : une action voulue, jamais une surprise. */
(function () {
  let tick2 = false;

  function surScroll() {
    const btn = document.getElementById("to-chrono");
    if (!btn) return;
    const live = document.getElementById("seance-live");
    const visible = live && !live.classList.contains("hidden")
      && document.getElementById("view-seance").classList.contains("active")
      && (window.scrollY || 0) > 140;   // dès que l'en-tête s'est réduit
    btn.classList.toggle("show", !!visible);
  }

  window.addEventListener("scroll", () => {
    if (tick2) return;
    tick2 = true;
    requestAnimationFrame(() => { tick2 = false; surScroll(); });
  }, { passive: true });

  const btn = document.createElement("button");
  btn.id = "to-chrono";
  btn.className = "to-chrono";
  btn.type = "button";
  btn.setAttribute("aria-label", "Revenir au chronomètre");
  btn.innerHTML = '<span aria-hidden="true">⌃</span>';
  btn.addEventListener("click", () => {
    if (typeof toggleHeaderManual === "function") toggleHeaderManual(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.body.appendChild(btn);
})();
