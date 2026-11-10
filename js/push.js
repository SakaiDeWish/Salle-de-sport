/* GymCoach — notification de fin de repos par Web Push.
   Le serveur (dossier push-worker/, un Cloudflare Worker) envoie la
   notification à l'heure exacte, même app fermée ou écran verrouillé.
   Tant que PUSH_URL ou PUSH_CLE_PUBLIQUE est vide, rien n'est envoyé
   et l'app garde la notification locale de secours. */
const PUSH_URL = "";           // ex. "https://gymcoach-push.TON-COMPTE.workers.dev"
const PUSH_CLE_PUBLIQUE = "";  // VAPID_PUBLIC_KEY affichée par push-worker/genvapid.mjs

function pushConfigure() { return !!(PUSH_URL && PUSH_CLE_PUBLIQUE && "PushManager" in window); }

function cleEnOctets(b64) {
  const s = (b64 + "=".repeat((4 - b64.length % 4) % 4)).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}

async function pushAbonnement(creer) {
  if (!pushConfigure() || !("serviceWorker" in navigator)) return null;
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return null;
  let sub = await reg.pushManager.getSubscription();
  if (!sub && creer) sub = await reg.pushManager.subscribe({
    userVisibleOnly: true, applicationServerKey: cleEnOctets(PUSH_CLE_PUBLIQUE) });
  return sub;
}

async function pushAppel(chemin, corps) {
  const r = await fetch(PUSH_URL + chemin, { method: "POST",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(corps) });
  return r.ok;
}

/* Programme la notification pour dans `delaiSec` secondes. */
async function pushProgrammer(delaiSec, exName) {
  try {
    if (localStorage.getItem("gymcoach.restNotif") !== "1") return false;
    const sub = await pushAbonnement(false);
    if (!sub) return false;
    return await pushAppel("/programmer", { subscription: sub.toJSON(), delaiSec,
      titre: "Repos terminé — on reprend", texte: exName || "" });
  } catch { return false; }
}

async function pushAnnuler() {
  try {
    const sub = await pushAbonnement(false);
    if (sub) await pushAppel("/annuler", { subscription: sub.toJSON() });
  } catch { /* hors ligne : l'alarme partira, sans gravité */ }
}
