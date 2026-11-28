/* GymCoach — compte premium.
   Rien n'est encore vendu : l'état premium est local et s'active en « mode essai ».
   Le jour où les achats des stores sont branchés (StoreKit, Google Play Billing ou RevenueCat),
   il suffit de remplacer `window.Facturation` par un adaptateur qui respecte la même interface :
     Facturation.disponible            booléen : un vrai paiement existe-t-il ?
     Facturation.acheter(plan)         Promise<{ ok, jusqua? }>   plan : "mensuel" | "annuel" | "a-vie"
     Facturation.restaurer()           Promise<{ ok, jusqua? }>
   Le reste de l'app ne lit que estPremium() et exigePremium(). */

/* Tant que l'app n'est pas publiée, rien n'est verrouillé : toutes les options sont ouvertes.
   AU MOMENT DE PUBLIER : mettre `true` (ou brancher le vrai paiement). Pour tester les verrous sans modifier le code :
   localStorage.setItem("gymcoach.verrou", "1") puis recharger. */
const PREMIUM_VERROUILLE = (() => { try { return localStorage.getItem("gymcoach.verrou") === "1"; } catch { return false; } })();
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
  if (!PREMIUM_VERROUILLE) return true;                  // version de test : tout est ouvert
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
const ESSAI_CLE = "gymcoach.essai";
window.Facturation = window.Facturation || {
  disponible: false,
  /* Un seul essai par appareil : on retient qu'il a été pris. */
  async acheter() {
    if (localStorage.getItem(ESSAI_CLE)) return { ok: false, raison: "essai-utilise" };
    try { localStorage.setItem(ESSAI_CLE, "1"); } catch { /* stockage indisponible */ }
    return { ok: true, jusqua: Date.now() + 7 * 86400000, source: "essai" };
  },
  /* Restaurer ne rend jamais plus que ce qui est valide : un essai échu ne se « restaure » pas. */
  async restaurer() { const e = premiumEtat(); return estPremium() ? { ok: true, jusqua: e.jusqua || null } : { ok: false }; }
};

function ouvrirPremium(raison) {
  const box = document.getElementById("modal-content");
  if (!box) return;
  const e = premiumEtat();
  const actif = estPremium();
  box.innerHTML = `
    <div class="modal-header"><div><h2>Premium</h2>
      <p class="day-focus">${!PREMIUM_VERROUILLE ? "Version de test : tout est débloqué" : actif ? "Actif" + (e.jusqua ? " jusqu'au " + new Date(e.jusqua).toLocaleDateString("fr-FR") : "") : (raison ? esc(raison) : "Va plus loin dans ton suivi")}</p></div></div>
    <ul class="prem-liste">
      ${PREMIUM_AVANTAGES.map(a => `<li class="${a.dispo ? "" : "prem-bientot"}">
        <span class="prem-ico">${icon(a.ico)}</span>
        <span><strong>${esc(a.titre)}</strong>${a.dispo ? "" : ' <em class="prem-tag">à venir</em>'}<small>${esc(a.txt)}</small></span></li>`).join("")}
    </ul>
    ${actif ? `<button class="btn btn-ghost btn-lg" id="prem-stop">Arrêter l'essai</button>`
      : `${localStorage.getItem(ESSAI_CLE)
          ? `<p class="video-hint">Ton essai gratuit est terminé. Le paiement n'est pas encore en place.</p>`
          : `<button class="btn btn-primary btn-lg" id="prem-go">${icon("play")} Essayer 7 jours</button>
             <p class="video-hint">Le paiement n'est pas encore en place : l'essai est gratuit et sans engagement.</p>`}
         <button class="btn btn-ghost btn-sm" id="prem-restaure">Restaurer mon achat</button>`}`;
  document.getElementById("prem-go")?.addEventListener("click", async () => {
    const r = await window.Facturation.acheter("mensuel");
    if (r && r.ok) { premiumSet({ actif: true, source: r.source || "store", jusqua: r.jusqua || null }); ouvrirPremium(); if (typeof toast === "function") toast("Premium activé ✦", 2500); }
    else if (r && r.raison === "essai-utilise") ouvrirPremium("Ton essai gratuit a déjà été utilisé.");
  });
  document.getElementById("prem-restaure")?.addEventListener("click", async () => {
    const r = await window.Facturation.restaurer();
    if (r && r.ok) { premiumSet({ actif: true, source: "store", jusqua: r.jusqua || null }); ouvrirPremium(); }
    else if (typeof toast === "function") toast("Aucun achat à restaurer.", 2500);
  });
  document.getElementById("prem-stop")?.addEventListener("click", () => { premiumSet(null); revenirAuThemeGratuit(); ouvrirPremium(); });
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

/* Sans premium valide (essai terminé, arrêté, sauvegarde importée), les thèmes réservés laissent place au thème Sombre. */
function revenirAuThemeGratuit() {
  if (estPremium() || typeof currentTheme !== "function") return;
  if (THEMES_PREMIUM.includes(currentTheme()) && typeof applyTheme === "function") applyTheme("gamifie");
}
revenirAuThemeGratuit();

/* Mode développeur : 7 touchers sur le numéro de version, dans Réglages. À retirer avant la publication,
   quand le vrai paiement existe. */
document.addEventListener("click", e => {
  if (!e.target.closest || !e.target.closest("#set-version")) return;
  window.__devTaps = (window.__devTaps || 0) + 1;
  clearTimeout(window.__devT); window.__devT = setTimeout(() => { window.__devTaps = 0; }, 2500);
  if (window.__devTaps >= 7) {
    window.__devTaps = 0;
    premiumSet({ actif: true, source: "dev", jusqua: null });
    if (typeof toast === "function") toast("Mode développeur : premium actif.", 3000);
  }
});

/* ---------- Export CSV (premium) ---------- */
function exporterCsv() {
  /* Une cellule texte qui commence par = + - @ serait lue comme une formule : on la neutralise. */
  const echap = v => { let t = String(v ?? ""); if (typeof v === "string" && /^[=+\-@\t\r]/.test(t)) t = "'" + t; return /[",;\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
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
