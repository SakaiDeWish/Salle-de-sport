/* GymCoach — analyses avancées (premium).
   Calculées sur l'historique local : courbe du 1RM estimé par exercice, volume des 12 dernières
   semaines, comparaison avec le mois précédent, plateaux détectés. */

const e1rmDe = s => (s && s.poids > 0 && s.reps > 0) ? s.poids * (1 + s.reps / 30) : null;      // formule d'Epley

function analysesDonnees() {
  const h = getHistory().slice().sort((a, b) => a.date - b.date);
  const parEx = new Map();
  for (const r of h) for (const ex of (r.exercises || [])) {
    const meilleur = Math.max(0, ...(ex.sets || []).map(e1rmDe).filter(v => v));
    if (!meilleur) continue;
    if (!parEx.has(ex.exId)) parEx.set(ex.exId, { nom: ex.nom, pts: [] });
    parEx.get(ex.exId).pts.push({ date: r.date, poids: Math.round(meilleur * 10) / 10 });
  }
  return { h, parEx };
}

/* Un exercice stagne si, sur ses 3 dernières séances, il n'a pas dépassé le meilleur d'avant (à 0,5 % près). */
function analysesPlateaux(parEx) {
  const out = [];
  for (const [id, ex] of parEx) {
    if (ex.pts.length < 4) continue;
    const derniers = ex.pts.slice(-3), avant = ex.pts.slice(0, -3);
    const mAvant = Math.max(...avant.map(p => p.poids)), mDerniers = Math.max(...derniers.map(p => p.poids));
    if (mDerniers <= mAvant * 1.005) out.push({ id, nom: ex.nom, best: mAvant });
  }
  return out.slice(0, 5);
}

function analysesVolume12(h) {
  const lundi = d => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x.getTime(); };
  const debut = lundi(Date.now());
  const semaines = Array.from({ length: 12 }, (_, i) => ({ t: debut - (11 - i) * 7 * 86400000, v: 0 }));
  for (const r of h) { const s = semaines.find(x => lundi(r.date) === x.t); if (s) s.v += r.volume || 0; }
  return semaines;
}

function analysesBarres(sem) {
  const max = Math.max(1, ...sem.map(s => s.v)), W = 320, H = 110, bw = W / sem.length;
  return `<svg class="an-barres" viewBox="0 0 ${W} ${H + 18}" role="img" aria-label="Volume par semaine sur 12 semaines, maximum ${Math.round(max)} kg">
    ${sem.map((s, i) => { const hh = s.v ? Math.max(3, s.v / max * H) : 1;
      return `<rect x="${(i * bw + 4).toFixed(1)}" y="${(H - hh).toFixed(1)}" width="${(bw - 8).toFixed(1)}" height="${hh.toFixed(1)}" rx="3" class="${i === sem.length - 1 ? "an-cur" : ""}"></rect>`; }).join("")}
    <text x="0" y="${H + 14}" class="an-axe">il y a 12 sem.</text><text x="${W}" y="${H + 14}" text-anchor="end" class="an-axe">cette sem.</text></svg>`;
}

function analysesMois(h) {
  const now = new Date(), m0 = new Date(now.getFullYear(), now.getMonth(), 1), m1 = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const dans = (r, a, b) => r.date >= a.getTime() && r.date < b.getTime();
  const sum = (liste, k) => liste.reduce((s, r) => s + (r[k] || 0), 0);
  const cur = h.filter(r => dans(r, m0, new Date(8.64e15))), prec = h.filter(r => dans(r, m1, m0));
  const ligne = (lab, a, b, fmt = v => v) => { const delta = b ? Math.round((a - b) / b * 100) : null;
    return `<div class="an-ligne"><span>${lab}</span><strong>${fmt(a)}</strong><span class="an-delta ${delta == null ? "" : delta >= 0 ? "haut" : "bas"}">${delta == null ? "—" : (delta >= 0 ? "+" : "") + delta + " %"}</span></div>`; };
  return ligne("Séances", cur.length, prec.length) + ligne("Séries", sum(cur, "nbSeries"), sum(prec, "nbSeries")) +
         ligne("Volume", sum(cur, "volume"), sum(prec, "volume"), v => Math.round(v).toLocaleString("fr-FR") + " kg");
}

function analysesCarte() {
  if (!estPremium()) return `
    <div class="card an-carte an-verrou">
      <p class="chrono-label">Analyses avancées</p>
      <div class="an-apercu" aria-hidden="true">
        <svg viewBox="0 0 320 90"><polyline points="4,70 50,62 95,58 140,44 190,40 240,24 316,16" fill="none" stroke="currentColor" stroke-width="3"/></svg>
      </div>
      <p>Courbe du 1RM, volume sur 12 semaines, plateaux détectés.</p>
      <button class="btn btn-primary" id="an-debloquer" aria-label="Découvrir le premium">${icon("gem")} Premium</button>
    </div>`;
  const { h, parEx } = analysesDonnees();
  if (!h.length) return `<div class="card an-carte"><p class="chrono-label">Analyses avancées</p><p>Elles apparaîtront après quelques séances.</p></div>`;
  const options = [...parEx.entries()].filter(([, e]) => e.pts.length >= 2).sort((a, b) => b[1].pts.length - a[1].pts.length).slice(0, 20);
  const plateaux = analysesPlateaux(parEx);
  return `
    <div class="card an-carte">
      <p class="chrono-label">Analyses avancées</p>
      <h3 class="an-h">1RM estimé</h3>
      ${options.length ? `<select id="an-ex" class="an-select" aria-label="Exercice">${options.map(([id, e]) => `<option value="${esc(id)}">${esc(e.nom)}</option>`).join("")}</select>
        <div id="an-chart"></div>` : `<p class="video-hint">Il faut au moins 2 séances avec charge sur un même exercice.</p>`}
      <h3 class="an-h">Volume · 12 semaines</h3>
      ${analysesBarres(analysesVolume12(h))}
      <h3 class="an-h">Ce mois-ci</h3>
      <div class="an-mois">${analysesMois(h)}</div>
      <h3 class="an-h">Plateaux</h3>
      ${plateaux.length ? `<ul class="an-plateaux">${plateaux.map(p => `<li><strong>${esc(p.nom)}</strong><span>stable depuis 3 séances (${Math.round(p.best)} kg estimés). Essaie une semaine allégée de 10 %, ou change le nombre de répétitions.</span></li>`).join("")}</ul>`
        : `<p class="video-hint">Aucun plateau : tu progresses partout où il y a assez de données.</p>`}
    </div>`;
}

function analysesLier() {
  document.getElementById("an-debloquer")?.addEventListener("click", () => ouvrirPremium("Analyses avancées"));
  const sel = document.getElementById("an-ex");
  if (!sel) return;
  const { parEx } = analysesDonnees();
  const dessine = () => {
    const e = parEx.get(sel.value);
    document.getElementById("an-chart").innerHTML = e ? evolutionChart(e.pts, { w: 340, unit: "kg" }) : "";
  };
  sel.addEventListener("change", dessine);
  dessine();
}
