# Application native (iOS / Android) avec Capacitor

L'app web est enveloppée dans une coquille native. Le dossier `ios/` et `android/` sont déjà générés ;
il reste à les ouvrir dans Xcode / Android Studio sur ta machine.

## Pré-requis
- **iOS** : un Mac, Xcode 15+, CocoaPods (`sudo gem install cocoapods`), un compte Apple Developer (99 $ / an) pour tester sur iPhone et publier.
- **Android** : Android Studio, un compte Google Play Console (25 $ une fois) pour publier.
- Node 18+.

## Première fois
```bash
cd native
npm install
npm run sync          # copie l'app web dans www/ puis dans les projets natifs
npm run ios           # ouvre Xcode
```
Dans Xcode : onglet *Signing & Capabilities* → choisis ton équipe, vérifie l'identifiant (`fr.gymcoach.app`, modifiable dans `capacitor.config.json` *avant* de créer l'app dans App Store Connect), puis lance sur ton iPhone.

## À chaque modification de l'app web
```bash
cd native && npm run sync
```

## Ce que fait la coquille
- Charge l'app depuis des fichiers embarqués (marche sans réseau, polices comprises).
- `js/natif.js` détecte Capacitor : retours tactiles via le plugin Haptics, notifications de fin de repos **locales** (plus de Worker Cloudflare nécessaire).
- Icônes et écrans de démarrage générés depuis `resources/` (`npx capacitor-assets generate`).

## Avant de soumettre à l'App Store
Voir `docs/app-store.md` (fiche, étiquettes de confidentialité, achats intégrés) et `docs/feuille-de-route.md` (paiement réel, synchronisation, Santé).
Apple refuse les simples sites dans un cadre : mets en avant le hors-ligne, les retours tactiles et les notifications locales dans les notes de validation.
