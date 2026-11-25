# Audit « nouvel utilisateur » — traité en v115

Méthode : parcours complet à 390 × 844 depuis un état vierge (accueil → création du programme → séance → repos → fin de séance → suivi → bibliothèque → réglages), avec captures et mesures (débordement, cibles tactiles, noms accessibles), puis relecture de code des 14 derniers commits. Rien n'a été testé sur un vrai téléphone.

## P1 — bloque ou perd un nouvel utilisateur

- [x] **Accueil vierge : l'action principale est tout en bas.** « Crée ton programme » vient après la sphère, trois chiffres à 0, la constellation et les défis. Mettre ce bouton en premier ; masquer chiffres à 0, constellation et défis tant qu'aucune séance n'est faite.
- [x] **Programme n'est plus dans la barre du bas.** On n'y accède que par le « + » rond en haut à droite, sans libellé. Ajouter un accès visible (onglet, ou bouton libellé sur l'accueil).
- [x] **Suivi vide quand on y arrive autrement que par l'onglet.** Le tableau de bord ne se dessine qu'au toucher de l'onglet (`renderSuivi`), pas dans `activateView("suivi")`. Les raccourcis (jalons, liens, menu +) donnent une page blanche. Corriger dans `activateView`.
- [x] **Après la génération du programme, rien ne dit comment commencer.** Ajouter un bouton « Commencer » sur chaque séance de l'onglet Ton programme.
- [x] **Premier appui sur une case de série : le pavé s'ouvre sur « 0 kg » sans explication, puis il faut retoucher la case.** Valider la série automatiquement après « OK » quand le poids et les reps sont renseignés.
- [x] **Écran de fin : le premier bloc est la correction de l'échauffement** (texte long, « dont échauffement 00:03 » sur une séance de 5 s). L'échauffement démarre tout seul et compte tant qu'on ne l'arrête pas. Le replier dans un détail et ne l'afficher que s'il dépasse quelques minutes.
- [x] **Détail de la séance (écran de fin) : colonne « Repos pris » écrasée**, titre en lettres verticales, valeur coupée (« 00:0 »). Revoir le tableau pour 390 px.
- [x] **Jargon jamais expliqué** : « Série 0 semaine » (confondu avec les séries d'un exercice), streak, RIR 1-3, « 2 étoiles filantes » (défi dont la mécanique est cachée), Atelier, « séances / sem. 1,0 ». Mots simples ou explication au premier affichage.
- [x] **Boutons en icône seule sans aide sur téléphone** (suite à l'épure) : super set (éclair), ordre, abandonner (poubelle) ressemble à « supprimer l'exercice », ✓ = terminer. Pas de survol sur mobile : ajouter un libellé court la première fois, ou un appui long qui affiche le nom.

## P2 — gênant

- [x] Le bouton Réglages flottant recouvre le contenu de l'accueil (cartes de défis).
- [x] Réglages : bande olive/brune derrière la rangée des thèmes (rendu étrange).
- [x] Le formulaire du programme affiche « Please fill out this field » en anglais, et le prénom est obligatoire alors qu'il ne sert à rien d'indispensable. Le rendre facultatif.
- [x] Carte de séance sur l'accueil : « ~61 min · 6 [icône haltère] » — l'icône seule ne dit pas « exercices ».
- [x] Écran de repos plein écran : on ne voit plus la série suivante ; le seul moyen de réduire est un chevron nu.
- [x] Séance : après le premier lancement, l'écran Séance commence par « Repos calculé automatiquement » (explication) avant le bouton de démarrage ; « Outils rapides » (1RM, disques) en dessous, champs tronqués (« Poids total visé (k »).
- [x] Cibles tactiles : le bouton d'info `i` avait déjà une zone de toucher de 30 px (fausse alerte de la mesure). Poignée de la feuille (26 px) laissée telle quelle : c'est une poignée de glissement, pas un bouton principal.
- [x] Suivi à zéro : une page de chiffres vides ; prévoir un état vide qui renvoie vers la première séance.
- [x] Texte d'intégration en transparence : fausse alerte, c'était le fondu de fermeture au moment de la capture.

## Relecture de code (14 derniers commits)

- [x] `js/maj-programme.js` : si le programme d'origine a été supprimé, la mise à jour se rabat sur le programme actif et réécrit sa séance du même numéro. Retourner `null` quand `programId` est connu mais introuvable.
- [x] `js/maj-programme.js` : un exercice présent deux fois dans la même séance fausse le calcul des écarts (Map par identifiant).
- [x] `js/workout.js` : le repos restauré après rechargement ne réarme ni le bip d'arrière-plan ni la notification push.
- [x] `js/opale.js` : `opaleOn()` ne teste plus le thème, donc le repos est retardé de 0,55 s dans tous les thèmes alors que l'onde ne dure plus que 0,42 s. Retarder seulement en Opale, ou supprimer le retard.
- [x] `js/ui.js` : la migration `gymcoach.homeEpure` efface la personnalisation de l'accueil importée avec une sauvegarde ; la clé n'est pas dans l'export.
- [x] `js/workout.js` : double confirmation quand on termine une séance sans série (« Terminer ? » puis « Aucune série validée… »).
- [x] `js/shell.js` : les champs Objectif et Repos par défaut gardent la valeur saisie (vide ou 99) alors qu'une autre valeur est enregistrée.
- [x] `index.html` : l'onglet `#pp-autre` est un `role="tab"` toujours « sélectionné », sans action au toucher.
- [x] Code mort : variable `bandeau` vide et commentaire obsolète dans `renderLiveExercises`.

## Vérifié en v116 (sur ordinateur, sans téléphone)

- [x] Hors ligne : le service worker s'installe, les 34 fichiers sont en cache, l'app se recharge sans réseau (182 exercices affichés). Les polices Google sont maintenant mises en cache à la première visite.
- [x] Accessibilité (axe-core, règles WCAG A et AA) sur les 7 écrans et les 5 thèmes : 3 problèmes trouvés puis corrigés (cartes d'exercice = bouton dans un bouton, onglets de la barre Programme, champs de fichier cachés focalisables). Il n'en reste aucun.
- [x] Paysage, petit écran 320 px, tablette, bureau, police agrandie à 150 % : aucun débordement horizontal.
- [x] 400 séances : rendu en moins de 30 ms par écran ; sauvegarde (550 Ko) → vidage → restauration identique.
- [x] Premier lancement : le message « Nouvelle version disponible » apparaissait à tort (le worker prend la main pour la première fois) ; corrigé.
- [x] Installation : icônes PNG 192/512, icône « maskable », apple-touch-icon et balises iOS ajoutées au manifeste et à la page.
- [x] Worker Cloudflare : le paquet se construit (`wrangler deploy --dry-run`) ; en local, mauvaise origine refusée (403), hôte non autorisé et délai hors limites refusés (400), programmation acceptée, alarme déclenchée. Le sujet VAPID était une adresse e-mail personnelle dans un dépôt public : remplacé par l'adresse du site.

## Reste à faire par toi (impossible depuis ici)

- [ ] Déployer le Worker (`wrangler login`, secrets VAPID, `wrangler deploy`) puis renseigner `js/push.js`.
- [ ] Tester sur ton iPhone : ajout à l'écran d'accueil, notification de fin de repos, retour de l'app après plusieurs minutes en arrière-plan, bouton retour Android.
- [ ] Lecteur d'écran réel (VoiceOver / TalkBack) : seules les règles automatiques ont été passées.

## Ce qui a été fait (v115)

Accueil vierge (action en premier, le reste caché jusqu'à la première séance) ; onglet Programme dans la barre du bas ; suivi dessiné à chaque arrivée + état vide ; bouton ▶ sur chaque séance du programme ; « OK » du pavé poursuit la validation de la série ; fin de séance (échauffement replié, tableau lisible) ; vocabulaire clarifié (semaines d'affilée, « en réserve », défi des étoiles filantes) ; légendes sous les icônes d'action et info-bulle à l'appui long sur les boutons en icône ; réglages (bande parasite, pastille discrète, champs recalés) ; prénom facultatif ; écran de repos « Voir la séance » ; les neuf points de la relecture de code.

## Premium et App Store — préparé en v124

Fait, sans serveur ni compte développeur :
- [x] Interrupteur premium local (`js/premium.js`) avec essai de 7 jours ; adaptateur `Facturation` prêt à être remplacé par StoreKit / Google Play / RevenueCat.
- [x] Réservé au premium : thèmes Studio, Mono, Opale ; plus de 2 programmes (ceux déjà créés sont conservés) ; export CSV ; analyses avancées (1RM estimé par exercice, volume sur 12 semaines, comparaison mensuelle, plateaux).
- [x] Pont natif (`js/natif.js`) : retours tactiles et notifications de fin de repos locales sous Capacitor (testé avec un Capacitor simulé).
- [x] Projet Capacitor dans `native/` (iOS et Android générés, icônes et écrans de démarrage, script de copie `npm run sync`).
- [x] Polices embarquées (plus aucune requête externe), icônes PNG, page de politique de confidentialité, fiche App Store (`docs/app-store.md`), feuille de route (`docs/feuille-de-route.md`).

À faire par toi :
- [ ] Renseigner l'adresse de contact dans `confidentialite.html` (placeholder volontaire : ton adresse personnelle ne doit pas être publiée par erreur).
- [ ] Compte Apple Developer, Mac + Xcode, signature, création de l'app dans App Store Connect, achats intégrés (`docs/app-store.md`).
- [ ] Brancher le vrai paiement (`docs/feuille-de-route.md`, point 1) puis retirer l'essai gratuit local.
- [ ] Décider de ce qui reste gratuit : les limites actuelles (2 programmes, 3 thèmes) sont des propositions.
- [ ] Sauvegarde multi-appareils, Apple Santé, chrono sur écran verrouillé, Apple Watch, coach IA : voir la feuille de route ; ils demandent un serveur ou du code natif.
