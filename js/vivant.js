/* GymCoach — l'app vivante (thème Opale).
   Le décor répond au toucher et raconte l'entraînement :
   · l'opale de l'accueil s'oriente sous le doigt, vibre au tap, se charge en
     la maintenant, et s'allume à mesure que l'objectif de la semaine avance ;
   · un ciel d'étoiles (canvas) qui scintille, dérive avec le défilement, fuit
     le doigt et laisse une poussière d'étoiles ;
   · une étoile filante passe de temps en temps : on peut l'attraper ;
   · la constellation de la semaine : une étoile par jour entraîné.
   Tout s'éteint si le thème n'est pas Opale ou si l'appareil demande de
   réduire les animations. */
const vivantOk = () => opaleThemeActif();
const vivantReduit = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const ETOILES_CLE = "gymcoach.etoiles";
const nbEtoiles = () => parseInt(localStorage.getItem(ETOILES_CLE), 10) || 0;
/* Les étoiles sont une monnaie : on en gagne (étoile filante, défis, records), on les dépense (atelier). */
const SEMAINE_ETOILES_CLE = "gymcoach.etoilesSemaine";            // { cle: de la semaine, n: filantes attrapées }
function cleSemaine(d = new Date()) {
  const l = new Date(d); l.setHours(0, 0, 0, 0); l.setDate(l.getDate() - ((l.getDay() + 6) % 7));
  return l.getFullYear() + "-" + String(l.getMonth() + 1).padStart(2, "0") + "-" + String(l.getDate()).padStart(2, "0");
}
function filantesSemaine() {
  try { const o = JSON.parse(localStorage.getItem(SEMAINE_ETOILES_CLE)); return o && o.cle === cleSemaine() ? o.n : 0; } catch { return 0; }
}
function majCompteursEtoiles() {
  document.querySelectorAll(".op-etoiles-n, .at-solde-n").forEach(x => { x.textContent = nbEtoiles(); });
}
function gagneEtoiles(n, raison) {
  try {
    localStorage.setItem(ETOILES_CLE, String(Math.max(0, nbEtoiles() + n)));
    if (raison === "filante") localStorage.setItem(SEMAINE_ETOILES_CLE, JSON.stringify({ cle: cleSemaine(), n: filantesSemaine() + 1 }));
  } catch { /* stockage indisponible */ }
  majCompteursEtoiles();
  if (typeof majDefis === "function") majDefis();
}
const vitV = () => (typeof vit === "function" ? vit() : 1);

/* ---------- Petites bulles de message ---------- */
function opaleToast(texte) {
  let t = document.getElementById("op-toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "op-toast"; t.className = "op-toast"; t.setAttribute("role", "status");
    document.body.appendChild(t);
  }
  t.textContent = texte;
  t.classList.remove("on"); void t.offsetWidth; t.classList.add("on");
  clearTimeout(t.__t); t.__t = setTimeout(() => t.classList.remove("on"), 2800);
}

/* ---------- Gerbe d'étincelles (dans un conteneur positionné, ou fixe à l'écran) ---------- */
function jaillit(conteneur, cx, cy, n = 10, dist = 40, fixe = false) {
  if (vivantReduit()) return;
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 + Math.random() * 0.6, d = dist * (0.6 + Math.random() * 0.8);
    const e = document.createElement("span");
    e.className = "etincelle" + (fixe ? " fixe" : "");
    e.style.cssText = `left:${cx}px;top:${cy}px`;
    conteneur.appendChild(e);
    e.animate([{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
               { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(0.2)`, opacity: 0 }],
      { duration: (620 + Math.random() * 300) * vitV(), easing: "cubic-bezier(0.2, 0.7, 0.3, 1)" }).onfinish = () => e.remove();
  }
}

/* ---------- 1. L'opale de l'accueil ---------- */
(function () {
  let g = null, taps = [], bulleT = null;
  const rectGem = gem => gem.getBoundingClientRect();
  const oriente = (gem, e) => {
    const r = rectGem(gem);
    const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    gem.style.setProperty("--gx", (50 + dx * 34) + "%");        // le reflet suit le doigt
    gem.style.setProperty("--gy", (50 + dy * 34) + "%");
    gem.style.setProperty("--ry", (dx * 18) + "deg");           // et la sphère s'incline vers lui
    gem.style.setProperty("--rx", (-dy * 18) + "deg");
  };
  const libere = gem => ["--gx", "--gy", "--rx", "--ry"].forEach(k => gem.style.removeProperty(k));

  const bulle = (gem, lignes) => {
    const hero = gem.closest(".op-hero"); if (!hero) return;
    let b = hero.querySelector(".op-bulle");
    if (!b) { b = document.createElement("div"); b.className = "op-bulle"; hero.appendChild(b); }
    b.innerHTML = lignes.map(l => `<span>${l}</span>`).join("");
    b.classList.remove("on"); void b.offsetWidth; b.classList.add("on");
    clearTimeout(bulleT); bulleT = setTimeout(() => b.classList.remove("on"), 3800);
  };
  const messageSemaine = () => {
    try {
      const gs = goalStatus();
      const fait = gs.doneThisWeek, but = gs.goal;
      return [fait >= but ? "Objectif de la semaine atteint ✦" : `${fait} / ${but} séances cette semaine`,
              gs.streak ? `${gs.streak} semaine${gs.streak > 1 ? "s" : ""} d'affilée` : "Une série commence à la première semaine validée"];
    } catch { return ["Ton opale est prête."]; }
  };
  const onde = (gem) => {
    const o = document.createElement("span");
    o.className = "gem-onde";
    gem.appendChild(o);
    o.animate([{ transform: "scale(0.96)", opacity: 0.8 }, { transform: "scale(1.7)", opacity: 0 }],
      { duration: 900 * vitV(), easing: "cubic-bezier(0.16, 1, 0.3, 1)" }).onfinish = () => o.remove();
  };
  const tap = gem => {
    haptique("leger");
    onde(gem);
    gem.animate([{ scale: 1 }, { scale: 1.07 }, { scale: 0.985 }, { scale: 1 }], { duration: 620 * vitV(), easing: "ease-out" });
    const hero = gem.closest(".op-hero"), r = gem.getBoundingClientRect(), h = hero.getBoundingClientRect();
    jaillit(hero, r.left - h.left + r.width / 2, r.top - h.top + r.height / 2, 8, r.width * 0.62);
    const now = performance.now();
    taps = taps.filter(t => now - t < 2600); taps.push(now);
    if (taps.length >= 5) { taps = []; fusion(gem, hero, r, h); }
  };
  const fusion = (gem, hero, r, h) => {                          // cinq tap : l'opale s'emballe
    haptique("succes");
    if (typeof sonDoux === "function") sonDoux("fusion");
    gem.animate([{ filter: "hue-rotate(0deg) brightness(1)" }, { filter: "hue-rotate(360deg) brightness(1.35)", offset: 0.6 }, { filter: "hue-rotate(360deg) brightness(1)" }],
      { duration: 1500 * vitV(), easing: "ease-in-out" });
    gem.animate([{ scale: 1 }, { scale: 1.12 }, { scale: 1 }], { duration: 1500 * vitV(), easing: "cubic-bezier(0.34, 1.5, 0.64, 1)" });
    jaillit(hero, r.left - h.left + r.width / 2, r.top - h.top + r.height / 2, 26, r.width * 0.95);
    opaleToast("Opale en fusion ✦");
  };
  const demarreCharge = gem => {
    if (!g || g.gem !== gem || g.bouge) return;
    g.charge = true;
    const c = document.createElement("i");
    c.className = "gem-charge"; gem.appendChild(c); g.anneau = c;
    haptique("moyen");
    c.addEventListener("animationend", () => { if (g && g.anneau === c) { g.pret = true; haptique("succes"); gem.classList.add("pret"); } });
  };

  document.addEventListener("pointerdown", e => {
    if (!vivantOk()) return;
    const gem = e.target.closest && e.target.closest(".op-gem-hero");
    if (!gem) return;
    g = { gem, id: e.pointerId, t0: performance.now(), x0: e.clientX, y0: e.clientY, bouge: false, charge: false, pret: false };
    gem.classList.add("touche");
    try { gem.setPointerCapture(e.pointerId); } catch { /* sans capture */ }
    oriente(gem, e);
    g.minuteur = setTimeout(() => demarreCharge(gem), 520);
  });
  window.addEventListener("pointermove", e => {
    if (!g || e.pointerId !== g.id) return;
    oriente(g.gem, e);
    if (!g.bouge && Math.hypot(e.clientX - g.x0, e.clientY - g.y0) > 9) {
      g.bouge = true; clearTimeout(g.minuteur);
      if (g.anneau) { g.anneau.remove(); g.anneau = null; g.charge = false; }
    }
  });
  const fin = e => {
    if (!g || e.pointerId !== g.id) return;
    const s = g; g = null;
    clearTimeout(s.minuteur);
    s.gem.classList.remove("touche", "pret");
    libere(s.gem);
    if (s.anneau) s.anneau.remove();
    if (e.type === "pointercancel") return;
    if (s.pret) {                                                  // relâché une fois chargé : gerbe + message
      const hero = s.gem.closest(".op-hero"), r = s.gem.getBoundingClientRect(), h = hero.getBoundingClientRect();
      haptique("succes");
      onde(s.gem);
      jaillit(hero, r.left - h.left + r.width / 2, r.top - h.top + r.height / 2, 22, r.width * 0.9);
      s.gem.animate([{ scale: 1 }, { scale: 1.1 }, { scale: 1 }], { duration: 800 * vitV(), easing: "cubic-bezier(0.34, 1.5, 0.64, 1)" });
      bulle(s.gem, messageSemaine());
    } else if (!s.bouge && !s.charge && performance.now() - s.t0 < 450) tap(s.gem);
  };
  window.addEventListener("pointerup", fin);
  window.addEventListener("pointercancel", fin);

  /* L'opale s'allume avec l'objectif de la semaine ; complète, une étoile tourne autour. */
  const majCharge = () => {
    const gem = document.querySelector(".op-gem-hero");
    if (!gem) return;
    let part = 0, complet = false;
    try { const gs = goalStatus(); part = Math.max(0, Math.min(1, gs.doneThisWeek / Math.max(1, gs.goal))); complet = gs.doneThisWeek >= gs.goal && gs.goal > 0; } catch { /* pas de données */ }
    gem.style.setProperty("--charge", String(part));
    gem.classList.toggle("complete", complet);
    if (complet && !gem.querySelector(".gem-orbite")) gem.insertAdjacentHTML("beforeend", '<i class="gem-orbite"></i>');
  };
  window.__majCharge = majCharge;
})();

/* ---------- 2. Constellation de la semaine ---------- */
function constellationSemaine() {
  const hero = document.querySelector(".op-hero");
  if (!hero || hero.querySelector(".op-const")) return;
  let h = [];
  try { h = getHistory(); } catch { /* pas d'historique */ }
  const now = new Date();
  const lundi = new Date(now); lundi.setHours(0, 0, 0, 0); lundi.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const jours = [...Array(7)].map((_, i) => { const d = new Date(lundi); d.setDate(lundi.getDate() + i); return d; });
  const memeJour = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const parJour = jours.map(d => h.filter(r => memeJour(new Date(r.date), d)));
  const noms = ["L", "M", "M", "J", "V", "S", "D"];
  const ys = [34, 22, 38, 26, 40, 20, 32];
  const pts = jours.map((d, i) => ({ x: 24 + i * 42, y: ys[i], on: parJour[i].length > 0, auj: memeJour(d, now), i }));
  const on = pts.filter(p => p.on);
  const lignes = on.slice(1).map((p, k) => `<line x1="${on[k].x}" y1="${on[k].y}" x2="${p.x}" y2="${p.y}"/>`).join("");
  const etoiles = pts.map(p => `
    <g class="cj${p.on ? " on" : ""}${p.auj ? " auj" : ""}" data-j="${p.i}" tabindex="0" role="button"
       aria-label="${jours[p.i].toLocaleDateString("fr-FR", { weekday: "long" })} : ${parJour[p.i].length ? parJour[p.i].length + " séance(s)" : "repos"}">
      <circle class="cj-zone" cx="${p.x}" cy="${p.y}" r="16"/>
      ${p.auj ? `<circle class="cj-auj" cx="${p.x}" cy="${p.y}" r="11"/>` : ""}
      <circle class="cj-pt" cx="${p.x}" cy="${p.y}" r="${p.on ? 5.5 : 3}"/>
      <text x="${p.x}" y="68" text-anchor="middle">${noms[p.i]}</text>
    </g>`).join("");
  const bloc = document.createElement("div");
  bloc.className = "op-const";
  bloc.innerHTML = `
    <div class="op-const-tete"><span class="op-k">Ta semaine</span><span class="op-etoiles" title="Tes étoiles : on les gagne, on les dépense à l'atelier">★ <b class="op-etoiles-n">${nbEtoiles()}</b></span></div>
    <svg viewBox="0 0 300 74" role="group" aria-label="Constellation de la semaine"><g class="cj-lignes">${lignes}</g>${etoiles}</svg>`;
  hero.appendChild(bloc);
  bloc.addEventListener("click", e => {
    const g = e.target.closest(".cj"); if (!g) return;
    const j = +g.dataset.j, liste = parJour[j];
    const nom = jours[j].toLocaleDateString("fr-FR", { weekday: "long" });
    haptique("selection");
    const c = g.querySelector(".cj-pt");
    c.animate([{ transform: "scale(1)" }, { transform: "scale(1.9)" }, { transform: "scale(1)" }], { duration: 560 * vitV(), easing: "cubic-bezier(0.34, 1.5, 0.64, 1)" });
    opaleToast(liste.length ? `${nom} · ${liste.map(r => r.nom).join(", ")}` : `${nom} · repos`);
  });
}

/* Accueil rendu (ou re-rendu) : on y branche la constellation et la charge de l'opale. */
(function () {
  const cible = document.getElementById("home-content");
  if (!cible) return;
  const maj = () => { if (!vivantOk()) return; constellationSemaine(); if (window.__majCharge) window.__majCharge(); };
  new MutationObserver(maj).observe(cible, { childList: true });
  new MutationObserver(maj).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  setTimeout(maj, 300);
})();

/* ---------- 3. Étoile filante ----------
   Une vraie météore : rapide (un peu plus d'une seconde), une tête vive et une
   longue traîne qui s'effile. Elle est dessinée DANS le ciel (canvas), donc
   derrière l'interface : elle ne gêne rien, on la voit dans les creux entre les
   cartes. On l'attrape en touchant le fond près de sa trajectoire — un toucher
   sur un bouton, une carte ou un champ ne compte jamais. */
window.__meteores = [];
(function () {
  let suivant = null;
  const INTERACTIF = "button, a, input, select, textarea, label, [role='button'], .ex-card, .badge-tile, .home-cta, .cb-row, .live-ex-head, .card.stat-tile, .defi";
  const plan = (ms) => { clearTimeout(suivant); suivant = setTimeout(lance, ms); };
  function lance() {
    plan((18000 + Math.random() * 30000) / (window.__cielFilantes || 1));      // plus fréquentes la nuit
    if (!vivantOk() || vivantReduit() || document.hidden) return;
    const vue = document.querySelector(".view.active");
    if (!vue || vue.id !== "view-accueil") return;
    if (document.querySelector(".rest-overlay:not(.hidden), #opale-jalon:not(.hidden), #opale-atelier:not(.hidden), .modal:not(.hidden)")) return;
    const W = window.innerWidth, H = window.innerHeight;
    const dir = Math.random() < 0.5 ? 1 : -1;                                  // de gauche à droite ou l'inverse
    const ang = (16 + Math.random() * 22) * Math.PI / 180;
    const x0 = dir > 0 ? W * (0.02 + Math.random() * 0.4) : W * (0.98 - Math.random() * 0.4);
    const y0 = H * (0.03 + Math.random() * 0.32);
    const longueur = 260 + Math.random() * 240;
    window.__meteores.push({
      x0, y0, x1: x0 + dir * Math.cos(ang) * longueur, y1: y0 + Math.sin(ang) * longueur, dir,
      t0: performance.now(), dur: (1050 + Math.random() * 500) * (vitV() > 1 ? 1.15 : 1), queue: 120 + Math.random() * 70
    });
  }
  /* Position de la tête à l'instant t (0..1), avec une légère accélération. */
  const tete = (m, p) => { const q = Math.pow(p, 1.25); return { x: m.x0 + (m.x1 - m.x0) * q, y: m.y0 + (m.y1 - m.y0) * q }; };
  document.addEventListener("pointerdown", e => {
    if (!window.__meteores.length || !vivantOk()) return;
    if (e.target.closest && e.target.closest(INTERACTIF)) return;
    const now = performance.now();
    for (let i = 0; i < window.__meteores.length; i++) {
      const m = window.__meteores[i], p = (now - m.t0) / m.dur;
      if (p < 0.04 || p > 0.96) continue;
      const h = tete(m, p);
      const ux = -m.dir * Math.cos(Math.atan2(m.y1 - m.y0, Math.abs(m.x1 - m.x0))), uy = -Math.sin(Math.atan2(m.y1 - m.y0, Math.abs(m.x1 - m.x0)));
      const tx = h.x + ux * m.queue * Math.min(1, p * 3), ty = h.y + uy * m.queue * Math.min(1, p * 3);
      /* distance du doigt au segment queue-tête */
      const vx = h.x - tx, vy = h.y - ty, l2 = vx * vx + vy * vy || 1;
      const k = Math.max(0, Math.min(1, ((e.clientX - tx) * vx + (e.clientY - ty) * vy) / l2));
      if (Math.hypot(e.clientX - (tx + vx * k), e.clientY - (ty + vy * k)) > 58) continue;
      window.__meteores.splice(i, 1);
      jaillit(document.body, h.x, h.y, 18, 70, true);
      gagneEtoiles(1, "filante");
      const n = nbEtoiles();
      if (typeof sonDoux === "function") sonDoux("etoile");
      haptique("succes");
      opaleToast(n === 1 ? "Première étoile attrapée ★" : `Étoile attrapée ★ ${n}`);
      return;
    }
  }, { capture: true, passive: true });
  window.__meteoreTete = tete;
  plan(7000);
})();

/* ---------- 4. Le ciel : étoiles qui scintillent, dérivent et fuient le doigt ---------- */
(function () {
  const cv = document.createElement("canvas");
  cv.id = "opale-ciel"; cv.setAttribute("aria-hidden", "true");
  document.body.prepend(cv);
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, etoiles = [], poussieres = [], ptr = { x: -999, y: -999, bas: false }, raf = 0, dernierEmis = 0;
  const COULEURS = ["#ffffff", "#cffff0", "#d9ccff", "#bfe9ff"];
  const init = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, (W * H) / 9000));
    etoiles = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H * 1.25, r: 0.4 + Math.random() * 1.2, z: 0.2 + Math.random() * 0.8,
      ph: Math.random() * 6.283, v: 0.6 + Math.random() * 1.6, c: COULEURS[(Math.random() * COULEURS.length) | 0], ox: 0, oy: 0
    }));
  };
  const emet = (x, y, n, force) => {
    for (let k = 0; k < n && poussieres.length < 160; k++) {
      const a = Math.random() * 6.283, v = (0.4 + Math.random() * 1.6) * (force || 1);
      poussieres.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.3, vie: 1, r: 0.6 + Math.random() * 1.4, c: COULEURS[(Math.random() * COULEURS.length) | 0] });
    }
  };
  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    const sy = window.scrollY || 0;
    const tx = parseFloat(document.documentElement.style.getPropertyValue("--tx")) || 0;
    const ty = parseFloat(document.documentElement.style.getPropertyValue("--ty")) || 0;
    const haut = H * 1.25;
    for (const s of etoiles) {
      let px = s.x + tx * 18 * s.z + s.ox;
      let py = (s.y - sy * 0.12 * s.z + ty * 14 * s.z) % haut; if (py < 0) py += haut; py += s.oy;
      const dx = px - ptr.x, dy = py - ptr.y, d = Math.hypot(dx, dy);
      if (ptr.bas && d < 120 && d > 0.1) { const f = (120 - d) / 120; s.ox += (dx / d) * f * 2.4; s.oy += (dy / d) * f * 2.4; }
      s.ox *= 0.93; s.oy *= 0.93;
      const a = (0.35 + 0.65 * (0.5 + 0.5 * Math.sin((t / 1000) * s.v + s.ph))) * (0.3 + 0.7 * s.z);
      ctx.globalAlpha = a * (window.__cielFacteur == null ? 1 : window.__cielFacteur); ctx.fillStyle = s.c;
      ctx.beginPath(); ctx.arc(px, py, s.r, 0, 6.283); ctx.fill();
    }
    /* Étoiles filantes : traîne effilée en dégradé, tête lumineuse. */
    const maint = performance.now();
    for (let i = window.__meteores.length - 1; i >= 0; i--) {
      const m = window.__meteores[i], p = (maint - m.t0) / m.dur;
      if (p >= 1) { window.__meteores.splice(i, 1); continue; }
      if (p < 0) continue;
      const h = window.__meteoreTete(m, p);
      const alpha = Math.min(1, p / 0.1) * Math.min(1, (1 - p) / 0.28);
      const ang = Math.atan2(m.y1 - m.y0, Math.abs(m.x1 - m.x0));
      const L = m.queue * Math.min(1, p * 3.5);
      const tx = h.x - m.dir * Math.cos(ang) * L, ty = h.y - Math.sin(ang) * L;
      const g = ctx.createLinearGradient(tx, ty, h.x, h.y);
      g.addColorStop(0, "rgba(170, 215, 255, 0)"); g.addColorStop(0.65, "rgba(200, 235, 255, 0.35)"); g.addColorStop(1, "rgba(255, 255, 255, 0.95)");
      const nx = -Math.sin(ang) * (m.dir > 0 ? 1 : -1), ny = Math.cos(ang) * (m.dir > 0 ? 1 : -1);
      const w = 1.7;                                          // demi-largeur à la tête, 0 au bout de la traîne
      ctx.globalAlpha = alpha; ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(h.x + nx * w, h.y + ny * w); ctx.lineTo(h.x - nx * w, h.y - ny * w); ctx.closePath(); ctx.fill();
      const halo = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 9);
      halo.addColorStop(0, "rgba(255, 255, 255, 0.95)"); halo.addColorStop(0.35, "rgba(220, 240, 255, 0.45)"); halo.addColorStop(1, "rgba(220, 240, 255, 0)");
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(h.x, h.y, 9, 0, 6.283); ctx.fill();
    }
    for (let i = poussieres.length - 1; i >= 0; i--) {
      const p = poussieres[i];
      p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.018; p.x += p.vx; p.y += p.vy; p.vie -= 0.017;
      if (p.vie <= 0) { poussieres.splice(i, 1); continue; }
      ctx.globalAlpha = p.vie; ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.vie + 0.3, 0, 6.283); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  const sync = () => {
    const actif = vivantOk() && !vivantReduit() && !document.hidden;
    cv.style.display = vivantOk() && !vivantReduit() ? "block" : "none";
    document.documentElement.classList.toggle("ciel-on", vivantOk() && !vivantReduit());
    if (actif && !raf) { init(); raf = requestAnimationFrame(frame); }
    else if (!actif && raf) { cancelAnimationFrame(raf); raf = 0; }
  };
  window.addEventListener("resize", () => { if (raf) init(); });
  document.addEventListener("visibilitychange", sync);
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  /* Le doigt : les étoiles s'écartent, et une poussière suit. */
  document.addEventListener("pointerdown", e => { if (!vivantOk()) return; ptr = { x: e.clientX, y: e.clientY, bas: true }; emet(e.clientX, e.clientY, 7, 1.1); }, { passive: true });
  document.addEventListener("pointermove", e => {
    if (!vivantOk()) return;
    ptr.x = e.clientX; ptr.y = e.clientY;
    if (ptr.bas && performance.now() - dernierEmis > 28) { dernierEmis = performance.now(); emet(e.clientX, e.clientY, 2, 0.8); }
  }, { passive: true });
  const leve = () => { ptr = { x: -999, y: -999, bas: false }; };
  document.addEventListener("pointerup", leve, { passive: true });
  document.addEventListener("pointercancel", leve, { passive: true });
  sync();
})();

/* ---------- 5. « Salut. » fait la vague ---------- */
document.addEventListener("click", e => {
  const t = e.target.closest && e.target.closest(".home-hero .display");
  if (!t || t.__vague || vivantReduit()) return;
  t.__vague = true;
  const html = t.innerHTML;
  const frag = document.createDocumentFragment();
  [...t.childNodes].forEach(n => {
    if (n.nodeType === 3) [...n.textContent].forEach(c => { const s = document.createElement("span"); s.className = "vague-l"; s.textContent = c; frag.appendChild(s); });
    else { const s = document.createElement("span"); s.className = "vague-l"; s.appendChild(n.cloneNode(true)); frag.appendChild(s); }
  });
  t.textContent = ""; t.appendChild(frag);
  haptique("selection");
  [...t.querySelectorAll(".vague-l")].forEach((s, i) => s.animate(
    [{ transform: "translateY(0)" }, { transform: "translateY(-14px) rotate(-4deg)" }, { transform: "translateY(0)" }],
    { duration: 700 * vitV(), delay: i * 55 * vitV(), easing: "cubic-bezier(0.34, 1.6, 0.64, 1)" }));
  setTimeout(() => { t.innerHTML = html; t.__vague = false; }, (700 + 7 * 55) * vitV() + 80);
});
