/* GymCoach — animations du thème « Opale ».
   Une seule idée, déclinée partout : la lumière. Elle arrive en cascade, elle
   glisse d'un onglet à l'autre, elle suit le doigt, elle onde quand on valide,
   elle respire pendant le repos. Rien ne bouge sans raison, et tout s'éteint si
   le thème n'est pas Opale ou si l'appareil demande de réduire les animations. */
const opaleOn = () =>
  document.documentElement.classList.contains("theme-opale") &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const opaleThemeActif = () => document.documentElement.classList.contains("theme-opale");

/* ---------- 1. Pastille d'onglet qui glisse ---------- */
(function () {
  const nav = document.querySelector(".bottom-nav");
  if (!nav) return;
  const pastille = document.createElement("span");
  pastille.className = "nav-pill";
  pastille.setAttribute("aria-hidden", "true");
  nav.prepend(pastille);
  const place = () => {
    const act = nav.querySelector(".tab.active");
    if (!act || !opaleThemeActif() || nav.offsetWidth === 0) return;
    pastille.style.setProperty("--x", act.offsetLeft + "px");
    pastille.style.setProperty("--y", act.offsetTop + "px");
    pastille.style.setProperty("--w", act.offsetWidth + "px");
    pastille.style.setProperty("--h", act.offsetHeight + "px");
  };
  new MutationObserver(place).observe(nav, { subtree: true, attributes: true, attributeFilter: ["class"] });
  new MutationObserver(() => { pastille.classList.add("sans-transition"); place(); requestAnimationFrame(() => requestAnimationFrame(() => pastille.classList.remove("sans-transition"))); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("resize", place);
  window.addEventListener("load", () => setTimeout(place, 50));
  setTimeout(place, 150);
})();

/* ---------- 2. Parallaxe : l'opale et les étoiles ralentissent ---------- */
(function () {
  let attente = false;
  const maj = () => {
    attente = false;
    document.documentElement.style.setProperty("--py", String(Math.min(window.scrollY, 1200)));
  };
  window.addEventListener("scroll", () => {
    if (attente || !opaleOn()) return;
    attente = true; requestAnimationFrame(maj);
  }, { passive: true });
})();

/* ---------- 3. Chiffres qui comptent ---------- */
function opaleCompte(racine) {
  if (!opaleOn() || !racine) return;
  const cibles = racine.querySelectorAll(".chrono-value, .streak-num, .goal-big, .stat-tile .chrono-value");
  cibles.forEach(el => {
    if (el.__compte || el.childNodes.length !== 1 || el.firstChild.nodeType !== 3) return;
    const texte = el.textContent;
    if (texte.includes(":")) return;                              // un chrono n'est pas un compteur
    const m = /^(\D*?)(\d(?:[\d\s  ]*\d)?(?:[.,]\d+)?)(\D*)$/.exec(texte.trim());
    if (!m) return;
    const brut = m[2].replace(/[\s  ]/g, "").replace(",", ".");
    const cible = parseFloat(brut);
    if (!Number.isFinite(cible) || cible === 0) return;
    const dec = (brut.split(".")[1] || "").length;
    const debut = performance.now(), duree = 900;
    el.__compte = true;
    const fin = () => { el.textContent = texte; el.__compte = false; };
    const pas = t => {
      const k = Math.min(1, (t - debut) / duree), e = k === 1 ? 1 : 1 - Math.pow(2, -10 * k);   // easeOutExpo
      if (k === 1) return fin();
      el.textContent = m[1] + (cible * e).toLocaleString("fr-FR", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + m[3];
      requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  });
}
(function () {
  const vues = document.querySelectorAll(".view");
  const obs = new MutationObserver(lot => lot.forEach(m => {
    if (m.target.classList.contains("active") && !(m.oldValue || "").split(" ").includes("active"))
      setTimeout(() => opaleCompte(m.target), 120);              // après le rendu de la vue
  }));
  vues.forEach(v => obs.observe(v, { attributes: true, attributeFilter: ["class"], attributeOldValue: true }));
  window.addEventListener("load", () => setTimeout(() => opaleCompte(document.querySelector(".view.active")), 350));
})();

/* ---------- 5. Onde à la validation + balayage quand on progresse ---------- */
function opaleValidation(cb) {
  if (!opaleOn() || !cb) return;
  const ligne = cb.closest(".cb-row");
  if (ligne) {
    const r = cb.getBoundingClientRect(), l = ligne.getBoundingClientRect();
    ligne.style.position = "relative";
    const cx = r.left - l.left + r.width / 2, cy = r.top - l.top + r.height / 2;
    const onde = document.createElement("span");
    onde.className = "onde";
    onde.style.cssText = `left:${cx}px;top:${cy}px`;
    ligne.appendChild(onde);
    onde.animate([{ transform: "translate(-50%,-50%) scale(0.3)", opacity: 0.9 }, { transform: "translate(-50%,-50%) scale(5.5)", opacity: 0 }],
      { duration: 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }).onfinish = () => onde.remove();
    for (let k = 0; k < 8; k++) {                                  // étincelles
      const a = (k / 8) * Math.PI * 2 + Math.random() * 0.5, d = 26 + Math.random() * 26;
      const e = document.createElement("span");
      e.className = "etincelle";
      e.style.cssText = `left:${cx}px;top:${cy}px`;
      ligne.appendChild(e);
      e.animate([{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
                 { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(0.2)`, opacity: 0 }],
        { duration: 600 + Math.random() * 250, easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" }).onfinish = () => e.remove();
    }
    if (ligne.querySelector(".set-trend-up")) {                    // mieux que la dernière fois : reflet sur toute la carte
      const carte = cb.closest(".live-ex");
      if (carte) {
        const b = document.createElement("span");
        b.className = "balayage";
        carte.appendChild(b);
        setTimeout(() => b.remove(), 1300);
      }
    }
  }
}

/* ---------- 6. Lueur qui suit le doigt ---------- */
(function () {
  const SEL = ".card, .ex-card, .btn-ghost, .chip";
  let actif = null, minuteur = null;
  const pose = e => {
    if (!opaleOn()) return;
    const el = e.target.closest && e.target.closest(SEL);
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (e.clientX - r.left) + "px");
    el.style.setProperty("--my", (e.clientY - r.top) + "px");
    if (actif !== el) { if (actif) actif.classList.remove("lueur"); actif = el; }
    el.classList.add("lueur");
    clearTimeout(minuteur);
  };
  const eteint = () => { minuteur = setTimeout(() => { if (actif) { actif.classList.remove("lueur"); actif = null; } }, 260); };
  document.addEventListener("pointerdown", pose, { passive: true });
  document.addEventListener("pointermove", e => { if (e.pressure > 0 || e.pointerType === "mouse") pose(e); }, { passive: true });
  document.addEventListener("pointerup", eteint, { passive: true });
  document.addEventListener("pointercancel", eteint, { passive: true });
})();

/* ---------- 7. Reflet selon l'inclinaison (sur demande) ---------- */
const OPALE_TILT_CLE = "gymcoach.tilt";
let opaleTilt = null;
async function opaleTiltActive(on) {
  try { localStorage.setItem(OPALE_TILT_CLE, on ? "1" : "0"); } catch { /* stockage indisponible */ }
  if (!on) {
    if (opaleTilt) { window.removeEventListener("deviceorientation", opaleTilt.ecoute); cancelAnimationFrame(opaleTilt.raf); opaleTilt = null; }
    document.documentElement.style.removeProperty("--tx"); document.documentElement.style.removeProperty("--ty");
    return true;
  }
  if (!("DeviceOrientationEvent" in window)) return false;
  if (typeof DeviceOrientationEvent.requestPermission === "function") {   // iOS : permission explicite, geste requis
    try { if ((await DeviceOrientationEvent.requestPermission()) !== "granted") return false; } catch { return false; }
  }
  if (opaleTilt) return true;
  const etat = { tx: 0, ty: 0, cx: 0, cy: 0, raf: 0 };
  etat.ecoute = e => {
    if (e.gamma == null) return;
    etat.cx = Math.max(-1, Math.min(1, e.gamma / 28));
    etat.cy = Math.max(-1, Math.min(1, ((e.beta || 0) - 45) / 28));
  };
  const boucle = () => {
    etat.tx += (etat.cx - etat.tx) * 0.1; etat.ty += (etat.cy - etat.ty) * 0.1;      // lissage : pas de saccade
    if (opaleOn()) {
      const s = document.documentElement.style;
      s.setProperty("--tx", etat.tx.toFixed(3)); s.setProperty("--ty", etat.ty.toFixed(3));
    }
    etat.raf = requestAnimationFrame(boucle);
  };
  window.addEventListener("deviceorientation", etat.ecoute);
  etat.raf = requestAnimationFrame(boucle);
  opaleTilt = etat;
  return true;
}
if (localStorage.getItem(OPALE_TILT_CLE) === "1" && !(typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function")) opaleTiltActive(true);

/* =========================================================
   INTERFACE OPALE — menu « + », jalons en plein écran, fin de séance
   ========================================================= */

/* ---------- Bouton « + » : Programme, Ajouter, Bibliothèque, Nutrition ----------
   La barre du bas se réduit à Accueil / Suivi / Séance ; ce qui sert moins
   souvent s'ouvre ici, en haut à droite de chaque écran. */
(function () {
  const bouton = document.createElement("button");
  bouton.id = "opale-plus";
  bouton.type = "button";
  bouton.className = "opale-plus";
  bouton.setAttribute("aria-label", "Plus d'écrans");
  bouton.setAttribute("aria-haspopup", "menu");
  bouton.setAttribute("aria-expanded", "false");
  bouton.innerHTML = icon("plus");
  const menu = document.createElement("div");
  menu.id = "opale-menu";
  menu.className = "opale-menu hidden";
  menu.setAttribute("role", "menu");
  const ITEMS = [["programme", "target", "Programme"], ["ajouter", "plus", "Ajouter un exercice"],
                 ["bibliotheque", "book", "Bibliothèque"], ["nutrition", "apple", "Nutrition"]];
  menu.innerHTML = ITEMS.map(([v, ic, lab]) =>
    `<button type="button" role="menuitem" data-go-opale="${v}">${icon(ic)}<span>${lab}</span></button>`).join("");
  document.body.append(bouton, menu);
  const ferme = () => { menu.classList.add("hidden"); bouton.setAttribute("aria-expanded", "false"); bouton.classList.remove("ouvert"); };
  bouton.addEventListener("click", e => {
    e.stopPropagation();
    const ouvre = menu.classList.contains("hidden");
    menu.classList.toggle("hidden", !ouvre);
    bouton.setAttribute("aria-expanded", String(ouvre));
    bouton.classList.toggle("ouvert", ouvre);
  });
  menu.addEventListener("click", e => {
    const b = e.target.closest("[data-go-opale]");
    if (!b) return;
    ferme();
    activateView(b.dataset.goOpale);
  });
  document.addEventListener("click", e => { if (!menu.contains(e.target) && e.target !== bouton) ferme(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") ferme(); });
})();

/* ---------- Jalons : un badge, un écran ---------- */
(function () {
  let jalon = null, indice = 0, balayage = null;
  const construit = () => {
    jalon = document.createElement("div");
    jalon.id = "opale-jalon";
    jalon.className = "opale-jalon hidden";
    jalon.setAttribute("role", "dialog");
    jalon.setAttribute("aria-modal", "true");
    jalon.innerHTML = `
      <button type="button" class="oj-close" aria-label="Fermer">${icon("x")}</button>
      <div class="oj-scene" id="oj-scene"><div class="op-gem op-gem-jalon" id="oj-gem"><span class="op-gem-ico" id="oj-ico"></span></div></div>
      <h2 class="oj-titre" id="oj-titre"></h2>
      <span class="oj-pill" id="oj-pill"></span>
      <p class="oj-desc" id="oj-desc"></p>
      <div class="oj-barre" id="oj-barre"><span class="oj-fill" id="oj-fill"></span><span class="oj-val" id="oj-val"></span></div>
      <div class="oj-nav">
        <button type="button" class="oj-fleche" data-oj="-1" aria-label="Jalon précédent">${icon("chevron-left")}</button>
        <span class="oj-compte" id="oj-compte"></span>
        <button type="button" class="oj-fleche" data-oj="1" aria-label="Jalon suivant">${icon("chevron-right")}</button>
      </div>`;
    document.body.appendChild(jalon);
    jalon.querySelector(".oj-close").addEventListener("click", ferme);
    jalon.querySelectorAll("[data-oj]").forEach(b => b.addEventListener("click", () => va(+b.dataset.oj)));
    const scene = jalon.querySelector("#oj-scene");
    scene.addEventListener("pointerdown", e => { balayage = { x: e.clientX }; });
    window.addEventListener("pointerup", e => {
      if (!balayage || jalon.classList.contains("hidden")) { balayage = null; return; }
      const dx = e.clientX - balayage.x; balayage = null;
      if (Math.abs(dx) > 50) va(dx < 0 ? 1 : -1);
    });
    document.addEventListener("keydown", e => {
      if (jalon.classList.contains("hidden")) return;
      if (e.key === "Escape") ferme(); else if (e.key === "ArrowRight") va(1); else if (e.key === "ArrowLeft") va(-1);
    });
  };
  const rend = (sens) => {
    const B = computeBadges(), b = B[indice];
    if (!b) return;
    const gem = jalon.querySelector("#oj-gem");
    gem.classList.toggle("allume", b.ok);
    jalon.querySelector("#oj-ico").innerHTML = icon(b.ico);
    jalon.querySelector("#oj-titre").textContent = b.nom;
    const pill = jalon.querySelector("#oj-pill");
    pill.textContent = b.ok ? "Obtenu" : "À débloquer";
    pill.classList.toggle("ok", b.ok);
    jalon.querySelector("#oj-desc").textContent = b.desc;
    const part = b.ok ? 1 : (b.binaire ? 0 : Math.max(0, Math.min(1, b.val / b.cible)));
    jalon.querySelector("#oj-barre").classList.toggle("sans", !b.ok && b.binaire);
    jalon.querySelector("#oj-fill").style.width = Math.round(part * 100) + "%";
    jalon.querySelector("#oj-val").textContent = b.ok ? "Accompli" : (b.binaire ? "Pas encore" : badgeAvance(b));
    jalon.querySelector("#oj-compte").textContent = (indice + 1) + " / " + B.length;
    if (sens && !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      gem.animate([{ transform: `translateX(${sens * 90}px) scale(0.85)`, opacity: 0 }, { transform: "none", opacity: 1 }],
        { duration: 460, easing: "cubic-bezier(0.34, 1.4, 0.64, 1)" });
  };
  const va = d => { const n = computeBadges().length; indice = (indice + d + n) % n; rend(d); };
  const ferme = () => { if (jalon) jalon.classList.add("hidden"); };
  document.addEventListener("click", e => {
    if (!opaleThemeActif()) return;
    const t = e.target.closest(".badge-tile[data-badge]");
    if (!t) return;
    if (!jalon) construit();
    indice = +t.dataset.badge;
    rend(0);
    jalon.classList.remove("hidden");
    jalon.querySelector(".oj-close").focus({ preventScroll: true });
  });
})();

/* ---------- Fin de séance : le joyau s'illumine et les chiffres comptent ---------- */
(function () {
  const resume = document.getElementById("seance-summary");
  if (!resume) return;
  new MutationObserver(() => {
    if (!opaleOn() || !resume.querySelector(".summary-card")) return;
    setTimeout(() => opaleCompte(resume), 450);
  }).observe(resume, { childList: true });
})();
