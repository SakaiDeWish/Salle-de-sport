/* GymCoach — mouvement doux et retours tactiles.
   1. VITESSE : tous les mouvements de l'app sont multipliés par `--vit`
      (1,45 en « animations douces », 1 sinon). Le CSS lit la variable ; le JS
      appelle vit() pour ses propres durées.
   2. HAPTIQUE : une petite vibration accompagne les gestes (bouton, case,
      onglet, déplacement, validation), en phase avec le mouvement à l'écran.
      Android : navigator.vibrate. iPhone : Safari n'a pas d'API de vibration ;
      on déclenche à la place le tic d'un interrupteur natif (iOS 17.4+), au
      mieux — sans garantie, et sans effet si l'appareil ne le permet pas. */
const VIT_CLE = "gymcoach.animDouces";
const HAPTIQUE_CLE = "gymcoach.haptique";
function animDouces() { return localStorage.getItem(VIT_CLE) !== "0"; }          // « douces » par défaut
function vit() { return animDouces() ? 1.45 : 1; }
function appliqueVit() { document.documentElement.style.setProperty("--vit", String(vit())); }
appliqueVit();

function haptiqueOn() { return localStorage.getItem(HAPTIQUE_CLE) !== "0"; }      // activé par défaut
let derniereHap = 0, ioHap = null;
const MOTIFS_HAP = {
  selection: 6,               // effleurement : bouton, onglet
  leger: 11,                  // case, pavé
  moyen: 18,                  // prise d'un exercice
  succes: [10, 45, 16],       // série validée
  seuil: [8, 30, 8],          // déposé à sa place
  erreur: [22, 40, 22, 40, 22]
};
function haptique(type = "selection") {
  if (!haptiqueOn()) return;
  const t = performance.now();
  /* Jamais de mitraillette : deux effleurements trop proches n'en font qu'un.
     Un succès, une erreur ou un dépôt, eux, passent toujours : ils sont rares et ils comptent. */
  const important = type === "succes" || type === "erreur" || type === "seuil";
  if (!important && t - derniereHap < 35) return;
  derniereHap = t;
  if (navigator.vibrate) { try { navigator.vibrate(MOTIFS_HAP[type] || 6); } catch { /* non supporté */ } return; }
  hapIOS();
}
function hapIOS() {
  try {
    if (!ioHap) {
      ioHap = document.createElement("label");
      ioHap.setAttribute("aria-hidden", "true");
      ioHap.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;pointer-events:none";
      const i = document.createElement("input");
      i.type = "checkbox"; i.setAttribute("switch", ""); i.tabIndex = -1;
      ioHap.appendChild(i);
      document.body.appendChild(ioHap);
    }
    ioHap.click();
  } catch { /* sans effet */ }
}

/* Un effleurement sur tout ce qui se touche. Android au pointerdown (au plus près du doigt) ;
   iPhone au click, seul instant où le système accepte le tic. */
const SEL_HAP = ".btn, .chip, .tab, .segm, .cb, .step-btn, .step-pas, .pave-k, .pave-disque, .pave-chip, .cb-nb-btn, .mv, .live-ex-head, .badge-tile, .opale-plus, .opale-menu button, .oj-fleche, .disc-toggle";
document.addEventListener("pointerdown", e => {
  if (!navigator.vibrate) return;
  const el = e.target.closest && e.target.closest(SEL_HAP);
  if (el) haptique(el.matches(".cb, .pave-k, .pave-disque, .step-btn") ? "leger" : "selection");
}, { capture: true, passive: true });
document.addEventListener("click", e => {
  if (navigator.vibrate) return;
  if (e.target.closest && e.target.closest(SEL_HAP)) haptique("selection");
}, { capture: true, passive: true });
