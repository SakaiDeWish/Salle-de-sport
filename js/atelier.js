/* GymCoach — le monde de l'opale : ciel de l'heure, lune du streak, atelier de teintes,
   sons doux, aurore des records et défis de la semaine. Thème Opale uniquement. */

/* ---------- 1. Le ciel suit l'heure ---------- */
const CIELS = {
  aube:       { a: "rgba(255, 170, 120, 0.11)", b: "rgba(255, 120, 170, 0.06)", etoiles: 0.55, filantes: 0.7 },
  jour:       { a: "rgba(120, 180, 255, 0.10)", b: "rgba(150, 220, 255, 0.05)", etoiles: 0.35, filantes: 0.5 },
  crepuscule: { a: "rgba(190, 120, 255, 0.11)", b: "rgba(255, 140, 90, 0.07)",  etoiles: 0.8,  filantes: 1 },
  nuit:       { a: "rgba(120, 220, 200, 0.07)", b: "rgba(150, 130, 255, 0.04)", etoiles: 1,    filantes: 1.4 }
};
function phaseDuCiel(h = new Date().getHours()) {
  return h >= 5 && h < 8 ? "aube" : h >= 8 && h < 17 ? "jour" : h >= 17 && h < 21 ? "crepuscule" : "nuit";
}
function appliqueCiel() {
  const c = CIELS[phaseDuCiel()];
  const s = document.documentElement.style;
  s.setProperty("--ciel-1", c.a); s.setProperty("--ciel-2", c.b);
  window.__cielFacteur = c.etoiles; window.__cielFilantes = c.filantes;
}
appliqueCiel();
setInterval(appliqueCiel, 10 * 60 * 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) appliqueCiel(); });

/* ---------- 2. Sons doux (synthèse Web Audio, aucun fichier) ---------- */
const SONS_CLE = "gymcoach.sonsDoux";
const sonsOn = () => localStorage.getItem(SONS_CLE) !== "0";
const SONS_MOTIFS = {
  etoile:    [[880, 0], [1318.5, 0.09]],
  fusion:    [[392, 0], [523.3, 0.08], [659.3, 0.16], [784, 0.24], [1046.5, 0.34]],
  defi:      [[523.3, 0], [659.3, 0.1], [784, 0.2]],
  record:    [[392, 0], [587.3, 0.12], [784, 0.24], [1174.7, 0.4]],
  deblocage: [[523.3, 0], [784, 0.1], [1046.5, 0.2]],
  choix:     [[660, 0]]
};
function sonDoux(type) {
  if (!sonsOn() || !vivantOk()) return;
  try {
    const ctx = typeof audioContext === "function" ? audioContext() : null;
    if (!ctx) return;
    const vol = (typeof restVolume === "function" ? restVolume() : 70) / 100;
    const pic = 0.11 * vol * vol;
    if (pic < 0.002) return;
    if (typeof baisseLesAutres === "function") baisseLesAutres();
    const t0 = ctx.currentTime;
    (SONS_MOTIFS[type] || SONS_MOTIFS.choix).forEach(([f, d]) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
      o.type = "sine"; o.frequency.setValueAtTime(f, t0 + d);
      lp.type = "lowpass"; lp.frequency.value = 3200;
      g.gain.setValueAtTime(0.0001, t0 + d);
      g.gain.exponentialRampToValueAtTime(pic, t0 + d + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.75);
      o.connect(lp); lp.connect(g); g.connect(ctx.destination);
      o.start(t0 + d); o.stop(t0 + d + 0.8);
    });
  } catch { /* audio indisponible : silencieux, jamais bloquant */ }
}

/* ---------- 3. La lune du streak ---------- */
const LUNES = ["Nouvelle lune", "Premier croissant", "Premier croissant", "Croissant", "Premier quartier",
               "Lune gibbeuse", "Lune gibbeuse", "Presque pleine", "Pleine lune"];
function luneSvg(semaines) {
  const f = Math.min(semaines, 8) / 8, r = 11, cx = 13, cy = 13;
  const rx = Math.abs(1 - 2 * f) * r;
  const sweep = f < 0.5 ? 0 : 1;
  const eclairee = f <= 0 ? "" : f >= 1
    ? `<circle cx="${cx}" cy="${cy}" r="${r}" class="lune-pleine"/>`
    : `<path class="lune-clair" d="M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx.toFixed(2)} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z"/>`;
  return `<svg viewBox="0 0 26 26" width="26" height="26" aria-hidden="true"><circle cx="${cx}" cy="${cy}" r="${r}" class="lune-fond"/>${eclairee}</svg>`;
}
function monteLune() {
  const stat = document.querySelector(".op-stats .op-stat");
  if (!stat) return;
  const vieille = stat.querySelector(".op-lune");
  if (vieille) vieille.remove();                                   // le streak a pu changer depuis
  let s = 0;
  try { s = goalStatus().streak; } catch { /* pas de données */ }
  const b = document.createElement("button");
  b.type = "button"; b.className = "op-lune" + (s >= 8 ? " pleine" : "");
  b.setAttribute("aria-label", `${LUNES[Math.min(s, 8)]} : ${s} semaine(s) d'affilée`);
  b.innerHTML = luneSvg(s);
  b.addEventListener("click", () => {
    haptique("selection");
    b.animate([{ transform: "scale(1)" }, { transform: "scale(1.4) rotate(12deg)" }, { transform: "scale(1)" }], { duration: 600 * vitV(), easing: "cubic-bezier(0.34, 1.5, 0.64, 1)" });
    opaleToast(s >= 8 ? `${LUNES[8]} · ${s} semaines d'affilée` : `${LUNES[s]} · encore ${8 - s} semaine${8 - s > 1 ? "s" : ""} avant la pleine lune`);
  });
  stat.appendChild(b);
}

/* ---------- 4. Atelier : choisir la teinte de l'opale avec ses étoiles ---------- */
const TEINTES = [
  { id: "opale",    nom: "Classique", hue: 0,    cout: 0 },
  { id: "saphir",   nom: "Saphir",    hue: 65,   cout: 3 },
  { id: "amethyste",nom: "Améthyste", hue: 125,  cout: 4 },
  { id: "rubis",    nom: "Rubis",     hue: 190,  cout: 5 },
  { id: "ambre",    nom: "Ambre",     hue: -140, cout: 6 },
  { id: "emeraude", nom: "Émeraude",  hue: -70,  cout: 8 }
];
const TEINTE_CLE = "gymcoach.teinte", TEINTES_OK_CLE = "gymcoach.teintes";
const teintesDebloquees = () => { try { const t = JSON.parse(localStorage.getItem(TEINTES_OK_CLE)); return Array.isArray(t) ? t : ["opale"]; } catch { return ["opale"]; } };
const teinteCourante = () => { const id = localStorage.getItem(TEINTE_CLE); return TEINTES.find(t => t.id === id && teintesDebloquees().includes(id)) || TEINTES[0]; };
function appliqueTeinte() { document.documentElement.style.setProperty("--gem-hue", teinteCourante().hue + "deg"); }
appliqueTeinte();

let atelier = null, selection = null;
function construitAtelier() {
  atelier = document.createElement("div");
  atelier.id = "opale-atelier"; atelier.className = "opale-atelier hidden";
  atelier.setAttribute("role", "dialog"); atelier.setAttribute("aria-modal", "true");
  atelier.innerHTML = `
    <button type="button" class="oj-close at-close" aria-label="Fermer">${icon("x")}</button>
    <h2 class="oj-titre">Atelier</h2>
    <p class="at-sous">Choisis la teinte de ton opale. Les étoiles se gagnent en attrapant les étoiles filantes, en relevant les défis et en battant des records.</p>
    <div class="at-scene"><div class="op-gem op-gem-atelier" id="at-gem"></div></div>
    <div class="at-solde">Tes étoiles <b>★ <span class="at-solde-n">0</span></b></div>
    <div class="at-nuancier" id="at-nuancier" role="listbox" aria-label="Teintes"></div>
    <button type="button" class="btn btn-primary at-action" id="at-action"></button>`;
  document.body.appendChild(atelier);
  atelier.querySelector(".at-close").addEventListener("click", fermeAtelier);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !atelier.classList.contains("hidden")) fermeAtelier(); });
  atelier.querySelector("#at-nuancier").addEventListener("click", e => {
    const b = e.target.closest("[data-teinte]"); if (!b) return;
    selection = b.dataset.teinte; haptique("selection"); sonDoux("choix"); rendAtelier();
  });
  atelier.querySelector("#at-action").addEventListener("click", () => {
    const t = TEINTES.find(x => x.id === selection); if (!t) return;
    const ok = teintesDebloquees();
    if (!ok.includes(t.id)) {
      if (nbEtoiles() < t.cout) { haptique("erreur"); opaleToast(`Il te manque ${t.cout - nbEtoiles()} étoile(s)`); return; }
      gagneEtoiles(-t.cout);
      try { localStorage.setItem(TEINTES_OK_CLE, JSON.stringify([...ok, t.id])); } catch { /* stockage indisponible */ }
      sonDoux("deblocage"); haptique("succes");
      const g = atelier.querySelector("#at-gem"), r = g.getBoundingClientRect();
      jaillit(document.body, r.left + r.width / 2, r.top + r.height / 2, 24, 130, true);
      opaleToast(`${t.nom} débloquée ✦`);
    }
    try { localStorage.setItem(TEINTE_CLE, t.id); } catch { /* stockage indisponible */ }
    appliqueTeinte(); rendAtelier();
  });
}
function rendAtelier() {
  const ok = teintesDebloquees(), cour = teinteCourante();
  if (!selection) selection = cour.id;
  const t = TEINTES.find(x => x.id === selection) || TEINTES[0];
  atelier.querySelector("#at-gem").style.setProperty("--gem-hue", t.hue + "deg");
  atelier.querySelector("#at-nuancier").innerHTML = TEINTES.map(x => `
    <button type="button" role="option" class="at-sw${x.id === selection ? " sel" : ""}${ok.includes(x.id) ? "" : " verrou"}" data-teinte="${x.id}" aria-selected="${x.id === selection}" style="--h:${x.hue}deg">
      <span class="at-dot"></span><span class="at-nom">${x.nom}</span>
      <span class="at-prix">${x.id === cour.id ? "En cours" : ok.includes(x.id) ? "Débloquée" : "★ " + x.cout}</span>
    </button>`).join("");
  const btn = atelier.querySelector("#at-action");
  const possede = ok.includes(t.id);
  btn.disabled = possede && t.id === cour.id;
  btn.textContent = possede ? (t.id === cour.id ? "Teinte en cours" : `Choisir ${t.nom}`) : `Débloquer ${t.nom} · ★ ${t.cout}`;
  majCompteursEtoiles();
}
function ouvrirAtelier() {
  if (!atelier) construitAtelier();
  selection = teinteCourante().id;
  rendAtelier();
  atelier.classList.remove("hidden");
  haptique("selection");
}
function fermeAtelier() { if (atelier) atelier.classList.add("hidden"); }

/* ---------- 5. Record battu : l'aurore ---------- */
function meilleurHistorique(exId) {
  let max = null;
  try {
    getHistory().forEach(r => (r.exercises || []).forEach(ex => {
      if (ex.exId !== exId) return;
      (ex.sets || []).forEach(s => { if (s.reps && s.poids != null && (max == null || s.poids > max)) max = s.poids; });
    }));
  } catch { /* pas d'historique */ }
  return max;
}
function aurore() {
  if (vivantReduit()) return;
  document.querySelectorAll("#opale-aurore").forEach(n => n.remove());
  const a = document.createElement("div");
  a.id = "opale-aurore"; a.className = "op-aurore"; a.setAttribute("aria-hidden", "true");
  a.innerHTML = "<i></i><i></i><i></i>";
  document.body.appendChild(a);
  setTimeout(() => a.remove(), 6200 * vitV());
}
function opaleRecordCheck(ex, set) {
  if (!vivantOk() || !ex || !set || !set.reps || set.poids == null) return;
  const avant = meilleurHistorique(ex.exId);
  if (avant == null || set.poids <= avant) return;                 // une première fois n'est pas un record
  if (ex.__recordPoids != null && set.poids <= ex.__recordPoids) return;
  ex.__recordPoids = set.poids;
  setTimeout(() => {
    aurore(); sonDoux("record"); haptique("succes");
    gagneEtoiles(1);
    opaleToast(`Record ! ${set.poids} kg · ${ex.nom} (+1 ★)`);
  }, 700);                                                         // après l'onde de validation
}

/* ---------- 6. Défis de la semaine ---------- */
const DEFIS_CLE = "gymcoach.defis";
const DEFI_GAIN = 2;
function semainesPrecedentes(n = 4) {
  const h = getHistory(), out = [];
  for (let k = 1; k <= n; k++) {
    const d = new Date(); d.setDate(d.getDate() - 7 * k);
    const cle = cleSemaine(d);
    const sem = h.filter(r => cleSemaine(new Date(r.date)) === cle);
    if (sem.length) out.push({ vol: sem.reduce((s, r) => s + (r.volume || 0), 0), series: sem.reduce((s, r) => s + (r.nbSeries || 0), 0) });
  }
  return out;
}
function defisDeLaSemaine() {
  let h = [], gs = { goal: 3 };
  try { h = getHistory(); gs = goalStatus(); } catch { /* données absentes */ }
  const cle = cleSemaine();
  const sem = h.filter(r => cleSemaine(new Date(r.date)) === cle);
  const vol = sem.reduce((s, r) => s + (r.volume || 0), 0), series = sem.reduce((s, r) => s + (r.nbSeries || 0), 0);
  const prec = semainesPrecedentes();
  const arr500 = v => Math.max(500, Math.round(v / 500) * 500);
  const cibleVol = prec.length ? arr500(prec.reduce((s, p) => s + p.vol, 0) / prec.length * 1.05) : 5000;
  const cibleSeries = prec.length ? Math.max(6, Math.round(prec.reduce((s, p) => s + p.series, 0) / prec.length)) : Math.max(6, 5 * (gs.goal || 3));
  return [
    { id: "seances", nom: `${gs.goal || 3} séances`, val: sem.length, cible: gs.goal || 3 },
    { id: "series", nom: `${cibleSeries} séries`, val: series, cible: cibleSeries },
    { id: "volume", nom: `${cibleVol.toLocaleString("fr-FR")} kg soulevés`, val: Math.round(vol), cible: cibleVol },
    { id: "filantes", nom: "2 étoiles filantes", val: filantesSemaine(), cible: 2 }
  ];
}
function defisReclames() {
  try { const o = JSON.parse(localStorage.getItem(DEFIS_CLE)); return o && o.cle === cleSemaine() ? o.ids : []; } catch { return []; }
}
function majDefis() {
  const bloc = document.querySelector(".op-defis");
  if (!bloc) return;
  const reclames = defisReclames();
  const liste = defisDeLaSemaine();
  bloc.querySelector(".op-defis-liste").innerHTML = liste.map(d => {
    const pris = reclames.includes(d.id), fini = d.val >= d.cible, part = Math.min(1, d.val / d.cible);
    return `<li class="defi${pris ? " pris" : fini ? " pret" : ""}" data-defi="${d.id}">
      <div class="defi-haut"><span class="defi-nom">${d.nom}</span>
        ${pris ? `<span class="defi-etat">${icon("tick")} +${DEFI_GAIN} ★</span>`
               : fini ? `<button type="button" class="defi-btn">Récupérer +${DEFI_GAIN} ★</button>`
               : `<span class="defi-etat">${Math.min(d.val, d.cible).toLocaleString("fr-FR")} / ${d.cible.toLocaleString("fr-FR")}</span>`}</div>
      <div class="defi-barre"><span style="width:${Math.round(part * 100)}%"></span></div>
    </li>`;
  }).join("");
}
function monteDefis() {
  const hero = document.querySelector(".op-hero");
  if (!hero || hero.querySelector(".op-defis")) return;
  const b = document.createElement("div");
  b.className = "op-defis";
  b.innerHTML = `<div class="op-const-tete"><span class="op-k">Défis de la semaine</span>
    <button type="button" class="op-atelier-btn" id="op-atelier-btn">${icon("gem")} Atelier</button></div><ul class="op-defis-liste"></ul>`;
  hero.appendChild(b);
  majDefis();
  b.querySelector("#op-atelier-btn").addEventListener("click", ouvrirAtelier);
  b.addEventListener("click", e => {
    const btn = e.target.closest(".defi-btn"); if (!btn) return;
    const li = btn.closest(".defi"), id = li.dataset.defi;
    const ids = defisReclames();
    if (ids.includes(id)) return;
    try { localStorage.setItem(DEFIS_CLE, JSON.stringify({ cle: cleSemaine(), ids: [...ids, id] })); } catch { /* stockage indisponible */ }
    gagneEtoiles(DEFI_GAIN);
    sonDoux("defi"); haptique("succes");
    const r = btn.getBoundingClientRect();
    jaillit(document.body, r.left + r.width / 2, r.top + r.height / 2, 16, 70, true);
    opaleToast(`Défi relevé ! +${DEFI_GAIN} ★`);
    majDefis();
  });
}

/* Accueil rendu : on y branche lune et défis (après la constellation de vivant.js). */
(function () {
  const cible = document.getElementById("home-content");
  if (!cible) return;
  const maj = () => setTimeout(() => { if (!vivantOk()) return; monteLune(); monteDefis(); majDefis(); majCompteursEtoiles(); }, 0);
  new MutationObserver(maj).observe(cible, { childList: true });
  const vue = document.getElementById("view-accueil");
  if (vue) new MutationObserver(maj).observe(vue, { attributes: true, attributeFilter: ["class"] });
  new MutationObserver(maj).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  setTimeout(maj, 450);
})();
