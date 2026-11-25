# Feuille de route — ce qui demande plus que l'app web

Ces éléments ne peuvent pas se faire depuis le navigateur seul. Chacun indique ce qu'il faut et où le brancher.

## 1. Paiement du premium
- **État actuel** : `js/premium.js` gère l'état premium en local, avec un « essai 7 jours » sans paiement.
- **À brancher** : remplacer `window.Facturation` par un adaptateur StoreKit / Google Play Billing. Le plus court : RevenueCat (`@revenuecat/purchases-capacitor`). Il faut dans l'adaptateur : `acheter(plan)`, `restaurer()`, et `jusqua` (date de fin d'abonnement) pour que `estPremium()` se désactive à l'échéance.
- **Avant la mise en ligne** : retirer le bouton « Essayer 7 jours » gratuit local (ou le garder comme vrai essai géré par le store).

## 2. Sauvegarde multi-appareils (premium)
- **Principe** : toutes les données sont des clés `gymcoach.*` du `localStorage`. Une synchronisation reprend ces clés.
- **Option Apple** : CloudKit (ou iCloud Key-Value Store pour de petits volumes) via un plugin Capacitor. Pas de serveur à gérer.
- **Option multiplateforme** : un petit backend (Cloudflare D1 / Supabase) avec connexion Sign in with Apple. Règle de fusion proposée : dernière modification gagne, clé par clé, avec un horodatage par clé ; l'historique se fusionne par identifiant de séance.
- **À prévoir** : politique de confidentialité mise à jour, suppression de compte dans l'app (obligatoire chez Apple si un compte existe).

## 3. Apple Santé / Google Fit
- Plugin `@perfood/capacitor-healthkit` (iOS) ou équivalent ; écrire une séance de musculation (durée, calories estimées) et le poids de corps.
- Déclarer `NSHealthShareUsageDescription` / `NSHealthUpdateUsageDescription` dans `Info.plist` et remplir l'étiquette de confidentialité.

## 4. Chrono sur l'écran verrouillé (Live Activity) et widget
- Extension Swift (ActivityKit) dans le projet Xcode ; l'app web envoie `{ fin du repos, exercice }` via un petit plugin Capacitor. Demande un iPhone et Xcode.

## 5. Apple Watch
- App watchOS séparée (SwiftUI) qui lit la séance en cours et valide une série. Gros chantier : à faire en dernier.

## 6. Coach IA (optionnel)
- Demande un serveur (clé d'API, limite d'usage par utilisateur) : réservé à un abonnement payant. Entrée : historique des 4 dernières semaines ; sortie : propositions d'ajustement du programme, présentées dans le même comparatif que la fin de séance.

## 7. Qualité avant publication
- Tester sur de vrais appareils : iPhone récent et ancien, Android milieu de gamme.
- Passer VoiceOver / TalkBack.
- Traduire si une autre langue est visée (tous les textes sont aujourd'hui en français, dans le code).
