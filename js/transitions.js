/* GymCoach — aucune téléportation entre deux états de l'interface.
   1. La liste des exercices de la séance se redessine d'un bloc (innerHTML) :
      chaque carte est donc suivie, puis glisse et change de hauteur de
      son ancienne place à la nouvelle (technique FLIP) — déplier un
      exercice, réordonner, valider une série ne sautent plus.
   2. Panneaux, fenêtres, repos, pavé, barres : l'entrée est en CSS ; la
      SORTIE est jouée ici par un fantôme, car un élément passé en
      display:none ne peut plus s'animer.
   Tout est coupé si l'appareil demande de réduire les animations. */
const reduitMouvement = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/* Courbe à dépassement : l'élément va un peu trop loin, puis se pose. */
const RESSORT = "cubic-bezier(0.34, 1.56, 0.64, 1)";

/* Petit coup de ressort sur un élément, rejouable à volonté. */
function rebond(el, depart = 0.82, pic = 1.12, ms = 380) {
  if (!el || reduitMouvement() || !el.animate) return;
  el.animate([{ transform: `scale(${depart})` }, { transform: `scale(${pic})`, offset: 0.55 }, { transform: "scale(1)" }],
    { duration: ms, easing: "ease-out" });
}
function rebondCase(cb) {
  rebond(cb, 0.5, 1.22, 420);
  rebond(cb.querySelector(".icon"), 0.2, 1.3, 460);
}

/* ---------- 1. FLIP sur la liste de séance ---------- */
(function () {
  if (typeof renderLiveExercises !== "function") return;
  const original = renderLiveExercises;
  const nbSeries = new WeakMap();
  const DUREE = 300, COURBE = "cubic-bezier(0.2, 0.8, 0.2, 1)";
  renderLiveExercises = function () {
    const liste = document.getElementById("live-exercises");
    if (!liste || reduitMouvement() || !liste.offsetParent) return original.apply(this, arguments);
    const avant = new Map();
    liste.querySelectorAll(".live-ex").forEach(c => {
      if (!c.__ex) return;
      const r = c.getBoundingClientRect();
      avant.set(c.__ex, { top: r.top, h: r.height });
    });
    const sortie = original.apply(this, arguments);
    liste.querySelectorAll(".live-ex").forEach(c => {
      c.__ex = live && live.exercises[+c.dataset.i];     // l'identité survit aux déplacements
      /* Une série de plus qu'au rendu précédent : sa case rebondit. */
      const nb = c.__ex ? c.__ex.sets.length : 0;
      const vu = c.__ex ? nbSeries.get(c.__ex) : undefined;      // les cartes sont recréées : on retient par exercice
      if (vu != null && nb > vu) {
        const cb = c.querySelector(`.cb.on[data-undo-j="${nb - 1}"]`);
        if (cb) rebondCase(cb);
      }
      if (c.__ex) nbSeries.set(c.__ex, nb);
      const a = c.__ex && avant.get(c.__ex);
      if (!a) return;
      const r = c.getBoundingClientRect();
      const dy = a.top - r.top, dh = a.h - r.height;
      if (Math.abs(dy) < 1 && Math.abs(dh) < 1) return;
      /* Un simple déplacement (même hauteur) rebondit en arrivant ; un
         changement de hauteur reste sans dépassement, qui ferait baver
         le contenu hors de la carte. */
      const deplacement = Math.abs(dh) < 1;
      c.animate(
        [{ transform: `translateY(${dy}px)`, height: a.h + "px", overflow: "hidden" },
         { transform: "none", height: r.height + "px", overflow: "hidden" }],
        { duration: deplacement ? 420 : DUREE, easing: deplacement ? RESSORT : COURBE });
    });
    return sortie;
  };
})();

/* ---------- 2. Sorties : un fantôme joue la disparition ---------- */
(function () {
  const CIBLES = "#rest-overlay, #picker, #onboarding, #builder, #session-modal, #pave, #reorder-bar, #live-minibar";
  new MutationObserver(lot => {
    if (reduitMouvement()) return;
    for (const m of lot) {
      const el = m.target;
      if (!(el instanceof Element) || !el.matches(CIBLES)) continue;
      if (/(^|\s)hidden(\s|$)/.test(m.oldValue || "") || !el.classList.contains("hidden")) continue;
      const fantome = el.cloneNode(true);
      fantome.removeAttribute("id");
      fantome.querySelectorAll("[id]").forEach(n => n.removeAttribute("id"));
      fantome.querySelectorAll("[autofocus]").forEach(n => n.removeAttribute("autofocus"));
      fantome.classList.remove("hidden");
      fantome.classList.add("sortie");
      fantome.setAttribute("aria-hidden", "true");
      fantome.inert = true;
      el.parentNode.insertBefore(fantome, el.nextSibling);
      const fin = () => fantome.remove();
      fantome.addEventListener("animationend", fin, { once: true });
      setTimeout(fin, 500);                      // filet : jamais de fantôme qui reste
    }
  }).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"], attributeOldValue: true });
})();
