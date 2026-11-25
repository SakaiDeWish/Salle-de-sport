/* GymCoach — compte premium.
   Rien n'est encore vendu : l'état premium est local et s'active en « mode essai ».
   Le jour où les achats des stores sont branchés (StoreKit, Google Play Billing ou RevenueCat),
   il suffit de remplacer `window.Facturation` par un adaptateur qui respecte la même interface :
     Facturation.disponible            booléen : un vrai paiement existe-t-il ?
     Facturation.acheter(plan)         Promise<{ ok, jusqua? }>   plan : "mensuel" | "annuel" | "a-vie"
     Facturation.restaurer()           Promise<{ ok, jusqua? }>
   Le reste de l'app ne lit que estPremium() et exigePremium(). */

const PREMIUM_CLE = "gymcoach.premium";
const LIMITE_PROGRAMMES_GRATUITS = 2;
const THEMES_PREMIUM = ["figma", "mono", "opale"];

/* Ce qu'apporte le premium. `dispo` : déjà dans l'app ; sinon « à venir » (demande un serveur ou l'app native). */
const PREMIUM_AVANTAGES = [
  { ico: "chart",    titre: "Analyses avancées",           txt: "Courbe du 1RM par exercice, volume sur 12 semaines, plateaux détectés.", dispo: true },
  { ico: "stack",    titre: "Programmes illimités",        txt: "Gratuit : " + LIMITE_PROGRAMMES_GRATUITS + " programmes.", dispo: true },
  { ico: "gem",      titre: "Thèmes Studio, Mono, Opale",  txt: "Sombre et Clair restent gratuits.", dispo: true },
  { ico: "download", titre: "Export CSV",                  txt: "Toutes tes séries dans un tableur.", dispo: true },
  { ico: "refresh",  titre: "Sauvegarde multi-appareils",  txt: "Retrouve tes données sur un nouveau téléphone.", dispo: false },
  { ico: "target",   titre: "Apple Santé / Google Fit",    txt: "Séances et poids envoyés automatiquement.", dispo: false },
  { ico: "timer",    titre: "Chrono sur l'écran verrouillé", txt: "Le repos reste visible sans ouvrir l'app.", dispo: false }
];

function premiumEtat() { try { return JSON.parse(localStorage.getItem(PREMIUM_CLE)) || null; } catch { return null; } }
function estPremium() {
  const e = premiumEtat();
  if (!e || !e.actif) return false;
  return !e.jusqua || e.jusqua > Date.now();            // abonnement échu : plus premium
}
function premiumSet(etat) {
  try { if (etat) localStorage.setItem(PREMIUM_CLE, JSON.stringify(etat)); else localStorage.removeItem(PREMIUM_CLE); } catch { /* stockage indisponible */ }
  document.documentElement.classList.toggle("est-premium", estPremium());
  if (typeof renderDashboard === "function" && document.getElementById("panel-dashboard")?.innerHTML) { try { renderDashboard(); } catch { /* vue non prête */ } }
}

/* Adaptateur de facturation : ici, l'essai local. À remplacer par le vrai paiement. */
window.Facturation = window.Facturation || {
  disponible: false,
  async acheter() { return { ok: true, jusqua: Date.now() + 7 * 86400000, source: "essai" }; },
  async restaurer() { const e = premiumEtat(); return { ok: !!(e && e.actif) }; }
};

function ouvrirPremium(raison) {
  const box = document.getElementById("modal-content");
  if (!box) return;
  const e = premiumEtat();
  const actif = estPremium();
  box.innerHTML = `
    <div class="modal-header"><div><h2>Premium</h2>
      <p class="day-focus">${actif ? "Actif" + (e.jusqua ? " jusqu'au " + new Date(e.jusqua).toLocaleDateString("fr-FR") : "") : (raison ? esc(raison) : "Va plus loin dans ton suivi")}</p></div></div>
    <ul class="prem-liste">
      ${PREMIUM_AVANTAGES.map(a => `<li class="${a.dispo ? "" : "prem-bientot"}">
        <span class="prem-ico">${icon(a.ico)}</span>
        <span><strong>${esc(a.titre)}</strong>${a.dispo ? "" : ' <em class="prem-tag">à venir</em>'}<small>${esc(a.txt)}</small></span></li>`).join("")}
    </ul>
    ${actif ? `<button class="btn btn-ghost btn-lg" id="prem-stop">Arrêter l'essai</button>`
      : `<button class="btn btn-primary btn-lg" id="prem-go">${icon("play")} Essayer 7 jours</button>
         <p class="video-hint">Le paiement n'est pas encore en place : l'essai est gratuit et sans engagement.</p>
         <button class="btn btn-ghost btn-sm" id="prem-restaure">Restaurer mon achat</button>`}`;
  document.getElementById("prem-go")?.addEventListener("click", async () => {
    const r = await window.Facturation.acheter("mensuel");
    if (r && r.ok) { premiumSet({ actif: true, source: r.source || "store", jusqua: r.jusqua || null }); ouvrirPremium(); if (typeof toast === "function") toast("Premium activé ✦", 2500); }
  });
  document.getElementById("prem-restaure")?.addEventListener("click", async () => {
    const r = await window.Facturation.restaurer();
    if (r && r.ok) { premiumSet({ actif: true, source: "store", jusqua: r.jusqua || null }); ouvrirPremium(); }
    else if (typeof toast === "function") toast("Aucun achat à restaurer.", 2500);
  });
  document.getElementById("prem-stop")?.addEventListener("click", () => { premiumSet(null); ouvrirPremium(); });
  openSheet();
}

/* Exécute `fn` si premium ; sinon ouvre la page premium. Renvoie vrai si l'action a pu se faire. */
function exigePremium(raison, fn) {
  if (estPremium()) { if (typeof fn === "function") fn(); return true; }
  ouvrirPremium(raison);
  return false;
}

/* Création d'un programme : les deux premiers sont gratuits, les existants sont toujours conservés. */
function programmeAutorise() {
  if (estPremium()) return true;
  const n = typeof getPrograms === "function" ? getPrograms().length : 0;
  if (n < LIMITE_PROGRAMMES_GRATUITS) return true;
  ouvrirPremium("Tu as déjà " + n + " programmes. Le premium en autorise autant que tu veux.");
  return false;
}

document.documentElement.classList.toggle("est-premium", estPremium());

/* ---------- Export CSV (premium) ---------- */
function exporterCsv() {
  const echap = v => { const t = String(v ?? ""); return /[",;\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
  const lignes = [["date", "séance", "exercice", "série", "poids_kg", "reps", "secondes", "rir", "repos_s", "note"]];
  for (const r of getHistory()) for (const ex of (r.exercises || [])) (ex.sets || []).forEach((s, i) =>
    lignes.push([new Date(r.date).toISOString().slice(0, 10), r.nom, ex.nom, i + 1, s.poids ?? "", s.reps ?? "", s.secondes ?? "", s.rir ?? "", s.restAfter ?? "", s.note ?? ""]));
  const blob = new Blob(["﻿" + lignes.map(l => l.map(echap).join(";")).join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gymcoach-seances-" + new Date().toISOString().slice(0, 10) + ".csv";
  a.click();
  URL.revokeObjectURL(a.href);
}
