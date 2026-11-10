/* GymCoach — envoi différé d'une notification de fin de repos (Web Push).
   Un Durable Object par appareil : /programmer pose une alarme à l'heure
   exacte, /annuler l'efface. Aucune donnée n'est gardée après l'envoi. */
import { buildPushPayload } from "@block65/webcrypto-web-push";

const ORIGINE = "https://sakaidewish.github.io";
const cors = {
  "Access-Control-Allow-Origin": ORIGINE,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const json = (o, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });

async function cleDe(endpoint) {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(endpoint));
  return [...new Uint8Array(h)].map(x => x.toString(16).padStart(2, "0")).join("");
}

export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method !== "POST") return json({ erreur: "POST uniquement" }, 405);
    if (req.headers.get("Origin") !== ORIGINE) return json({ erreur: "origine refusée" }, 403);
    const url = new URL(req.url);
    let corps;
    try { corps = await req.json(); } catch { return json({ erreur: "JSON invalide" }, 400); }
    const sub = corps.subscription;
    if (!sub || typeof sub.endpoint !== "string" || !sub.endpoint.startsWith("https://"))
      return json({ erreur: "abonnement invalide" }, 400);
    const stub = env.REPOS.get(env.REPOS.idFromName(await cleDe(sub.endpoint)));
    if (url.pathname === "/programmer") {
      const delai = Math.round(Number(corps.delaiSec));
      if (!(delai >= 1 && delai <= 3600)) return json({ erreur: "délai hors limites" }, 400);
      return stub.fetch("https://do/programmer", { method: "POST", body: JSON.stringify({
        sub, delai, titre: String(corps.titre || "Repos terminé").slice(0, 80),
        texte: String(corps.texte || "").slice(0, 120) }) });
    }
    if (url.pathname === "/annuler") return stub.fetch("https://do/annuler", { method: "POST" });
    return json({ erreur: "inconnu" }, 404);
  },
};

export class Repos {
  constructor(state, env) { this.state = state; this.env = env; }
  async fetch(req) {
    const chemin = new URL(req.url).pathname;
    if (chemin === "/annuler") {
      await this.state.storage.deleteAlarm();
      await this.state.storage.delete("envoi");
      return json({ ok: true });
    }
    const d = await req.json();
    await this.state.storage.put("envoi", d);
    await this.state.storage.setAlarm(Date.now() + d.delai * 1000);   // remplace l'alarme précédente
    return json({ ok: true });
  }
  async alarm() {
    const d = await this.state.storage.get("envoi");
    if (!d) return;
    await this.state.storage.delete("envoi");
    const vapid = { subject: this.env.VAPID_SUBJECT, publicKey: this.env.VAPID_PUBLIC_KEY, privateKey: this.env.VAPID_PRIVATE_KEY };
    const msg = { data: JSON.stringify({ titre: d.titre, texte: d.texte }), options: { ttl: 120, urgency: "high" } };
    const charge = await buildPushPayload(msg, d.sub, vapid);
    await fetch(d.sub.endpoint, charge);
  }
}
