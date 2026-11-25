# GymCoach — notification de fin de repos (Web Push)

Un Cloudflare Worker envoie la notification à l'heure exacte, même app
fermée ou écran verrouillé. L'app ne sait rien de plus que : « dans N secondes,
préviens cet appareil ».

## Mise en place (une seule fois, ~5 min)

```bash
cd push-worker
npm install
node genvapid.mjs                  # affiche VAPID_PUBLIC_KEY et VAPID_PRIVATE_KEY
npx wrangler login                 # compte Cloudflare
npx wrangler secret put VAPID_PUBLIC_KEY    # colle la clé publique
npx wrangler secret put VAPID_PRIVATE_KEY   # colle la clé privée
npx wrangler deploy                # affiche l'URL https://gymcoach-push.<compte>.workers.dev
```

Puis dans `js/push.js` :

```js
const PUSH_URL = "https://gymcoach-push.<compte>.workers.dev";
const PUSH_CLE_PUBLIQUE = "<VAPID_PUBLIC_KEY>";
```

Commit, push, puis dans l'app : Réglages → « Notification de reprise ».

La clé privée ne va JAMAIS dans le dépôt : seulement dans `wrangler secret`.
La clé publique, elle, est faite pour être visible.

## iPhone
Les notifications push n'existent que pour l'app **ajoutée à l'écran d'accueil**
(Partager → Sur l'écran d'accueil), iOS 16.4 minimum.

## Ce que le serveur garde
Le temps d'un repos : l'adresse d'envoi de l'appareil et l'heure d'alarme.
Tout est supprimé à l'envoi ou à l'annulation. Seule l'origine
`https://sakaidewish.github.io` est acceptée.

## Coût
Durable Objects (version SQLite) sont dans l'offre gratuite de Cloudflare ;
quelques dizaines de repos par séance restent très en dessous des limites.
