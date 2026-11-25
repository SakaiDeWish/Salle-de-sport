/* GymCoach — pont vers l'application native (Capacitor).
   Dans le navigateur, rien ne change : estNatif() est faux et chaque fonction rend la main.
   Dans l'enveloppe iOS / Android, les retours tactiles et les notifications de fin de repos passent
   par les plugins natifs (Haptics, LocalNotifications), à la place du Web Push et de l'astuce iPhone. */
const Natif = (function () {
  const cap = () => window.Capacitor;
  const estNatif = () => !!(cap() && cap().isNativePlatform && cap().isNativePlatform());
  const plugin = nom => (cap() && cap().Plugins && cap().Plugins[nom]) || null;
  const ID_REPOS = 4201;
  let permission = null;

  /* Retour tactile : rend vrai si le plugin l'a joué. */
  function haptique(type) {
    const H = plugin("Haptics");
    if (!estNatif() || !H) return false;
    try {
      if (type === "succes") H.notification({ type: "SUCCESS" });
      else if (type === "erreur") H.notification({ type: "ERROR" });
      else if (type === "seuil" || type === "moyen") H.impact({ style: "MEDIUM" });
      else if (type === "leger") H.impact({ style: "LIGHT" });
      else H.selectionChanged();
      return true;
    } catch { return false; }
  }

  async function notifPermission() {
    const N = plugin("LocalNotifications");
    if (!estNatif() || !N) return false;
    try {
      const r = await N.checkPermissions();
      permission = r.display === "granted" ? r : await N.requestPermissions();
      return permission.display === "granted";
    } catch { return false; }
  }

  /* Notification locale à l'heure exacte : fonctionne app fermée, sans serveur. */
  async function notifProgrammer(delaiSec, texte) {
    const N = plugin("LocalNotifications");
    if (!estNatif() || !N) return false;
    try {
      if (!(await notifPermission())) return false;
      await N.cancel({ notifications: [{ id: ID_REPOS }] });
      await N.schedule({ notifications: [{ id: ID_REPOS, title: "Repos terminé — on reprend", body: texte || "",
        schedule: { at: new Date(Date.now() + delaiSec * 1000), allowWhileIdle: true } }] });
      return true;
    } catch { return false; }
  }
  async function notifAnnuler() {
    const N = plugin("LocalNotifications");
    if (!estNatif() || !N) return;
    try { await N.cancel({ notifications: [{ id: ID_REPOS }] }); } catch { /* rien à annuler */ }
  }

  /* Barre d'état et écran de démarrage : sobres, aux couleurs de l'app. */
  function demarrer() {
    if (!estNatif()) return;
    document.documentElement.classList.add("natif");
    const S = plugin("StatusBar");
    try { if (S) { S.setStyle({ style: "DARK" }); } } catch { /* facultatif */ }
  }
  return { estNatif, haptique, notifPermission, notifProgrammer, notifAnnuler, demarrer };
})();
Natif.demarrer();
