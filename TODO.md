# À faire — audit « nouvel utilisateur » (v114)

Méthode : parcours complet à 390 × 844 depuis un état vierge (accueil → création du programme → séance → repos → fin de séance → suivi → bibliothèque → réglages), avec captures et mesures (débordement, cibles tactiles, noms accessibles), puis relecture de code des 14 derniers commits. Rien n'a été testé sur un vrai téléphone.

## P1 — bloque ou perd un nouvel utilisateur

- [ ] **Accueil vierge : l'action principale est tout en bas.** « Crée ton programme » vient après la sphère, trois chiffres à 0, la constellation et les défis. Mettre ce bouton en premier ; masquer chiffres à 0, constellation et défis tant qu'aucune séance n'est faite.
- [ ] **Programme n'est plus dans la barre du bas.** On n'y accède que par le « + » rond en haut à droite, sans libellé. Ajouter un accès visible (onglet, ou bouton libellé sur l'accueil).
- [ ] **Suivi vide quand on y arrive autrement que par l'onglet.** Le tableau de bord ne se dessine qu'au toucher de l'onglet (`renderSuivi`), pas dans `activateView("suivi")`. Les raccourcis (jalons, liens, menu +) donnent une page blanche. Corriger dans `activateView`.
- [ ] **Après la génération du programme, rien ne dit comment commencer.** Ajouter un bouton « Commencer » sur chaque séance de l'onglet Ton programme.
- [ ] **Premier appui sur une case de série : le pavé s'ouvre sur « 0 kg » sans explication, puis il faut retoucher la case.** Valider la série automatiquement après « OK » quand le poids et les reps sont renseignés.
- [ ] **Écran de fin : le premier bloc est la correction de l'échauffement** (texte long, « dont échauffement 00:03 » sur une séance de 5 s). L'échauffement démarre tout seul et compte tant qu'on ne l'arrête pas. Le replier dans un détail et ne l'afficher que s'il dépasse quelques minutes.
- [ ] **Détail de la séance (écran de fin) : colonne « Repos pris » écrasée**, titre en lettres verticales, valeur coupée (« 00:0 »). Revoir le tableau pour 390 px.
- [ ] **Jargon jamais expliqué** : « Série 0 semaine » (confondu avec les séries d'un exercice), streak, RIR 1-3, « 2 étoiles filantes » (défi dont la mécanique est cachée), Atelier, « séances / sem. 1,0 ». Mots simples ou explication au premier affichage.
- [ ] **Boutons en icône seule sans aide sur téléphone** (suite à l'épure) : super set (éclair), ordre, abandonner (poubelle) ressemble à « supprimer l'exercice », ✓ = terminer. Pas de survol sur mobile : ajouter un libellé court la première fois, ou un appui long qui affiche le nom.

## P2 — gênant

- [ ] Le bouton Réglages flottant recouvre le contenu de l'accueil (cartes de défis).
- [ ] Réglages : bande olive/brune derrière la rangée des thèmes (rendu étrange).
- [ ] Le formulaire du programme affiche « Please fill out this field » en anglais, et le prénom est obligatoire alors qu'il ne sert à rien d'indispensable. Le rendre facultatif.
- [ ] Carte de séance sur l'accueil : « ~61 min · 6 [icône haltère] » — l'icône seule ne dit pas « exercices ».
- [ ] Écran de repos plein écran : on ne voit plus la série suivante ; le seul moyen de réduire est un chevron nu.
- [ ] Séance : après le premier lancement, l'écran Séance commence par « Repos calculé automatiquement » (explication) avant le bouton de démarrage ; « Outils rapides » (1RM, disques) en dessous, champs tronqués (« Poids total visé (k »).
- [ ] Cibles tactiles trop petites : bouton d'info `i` (15 × 15), poignée de la feuille (26 px de haut).
- [ ] Suivi à zéro : une page de chiffres vides ; prévoir un état vide qui renvoie vers la première séance.
- [ ] Vérifier que l'écran d'accueil du premier lancement ne laisse pas voir le texte d'intégration en transparence derrière l'accueil (visible sur la capture de chargement).

## Relecture de code (14 derniers commits)

- [ ] `js/maj-programme.js` : si le programme d'origine a été supprimé, la mise à jour se rabat sur le programme actif et réécrit sa séance du même numéro. Retourner `null` quand `programId` est connu mais introuvable.
- [ ] `js/maj-programme.js` : un exercice présent deux fois dans la même séance fausse le calcul des écarts (Map par identifiant).
- [ ] `js/workout.js` : le repos restauré après rechargement ne réarme ni le bip d'arrière-plan ni la notification push.
- [ ] `js/opale.js` : `opaleOn()` ne teste plus le thème, donc le repos est retardé de 0,55 s dans tous les thèmes alors que l'onde ne dure plus que 0,42 s. Retarder seulement en Opale, ou supprimer le retard.
- [ ] `js/ui.js` : la migration `gymcoach.homeEpure` efface la personnalisation de l'accueil importée avec une sauvegarde ; la clé n'est pas dans l'export.
- [ ] `js/workout.js` : double confirmation quand on termine une séance sans série (« Terminer ? » puis « Aucune série validée… »).
- [ ] `js/shell.js` : les champs Objectif et Repos par défaut gardent la valeur saisie (vide ou 99) alors qu'une autre valeur est enregistrée.
- [ ] `index.html` : l'onglet `#pp-autre` est un `role="tab"` toujours « sélectionné », sans action au toucher.
- [ ] Code mort : variable `bandeau` vide et commentaire obsolète dans `renderLiveExercises`.

## Non vérifié

- Appareils réels : installation en application sur iPhone, mode hors ligne, retour du Web Push (le Worker Cloudflare n'est pas déployé), retour arrière Android.
- Lecteur d'écran, mode paysage, tablette, grandes polices système.
- Calendrier et « Mes séances » avec beaucoup de données ; sauvegarde puis restauration complète.
