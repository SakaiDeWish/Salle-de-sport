# 🏋️ GymCoach — Salle de sport

Application web de musculation : bibliothèque d'exercices complète, programmes personnalisés selon tes objectifs, et vidéo de démonstration pour chaque exercice.

**Aucune installation nécessaire** : ouvre simplement `index.html` dans ton navigateur (ou héberge le dossier sur GitHub Pages).

## ✨ Fonctionnalités

### 📚 Bibliothèque d'exercices
- **116 exercices référencés** couvrant tous les groupes musculaires (pectoraux, dos, épaules, biceps, triceps, quadriceps, ischios/fessiers, mollets, abdos, lombaires) et tout le matériel (barre, haltères, machines, poulies, poids du corps).
- Chaque fiche contient : muscles sollicités, exécution pas à pas, erreurs à éviter, niveau de difficulté et matériel requis.
- Recherche instantanée + filtres par muscle, matériel et niveau.

### 🎬 Vidéo pour chaque exercice
- Chaque fiche donne accès en un clic à une **vidéo de démonstration** (recherche YouTube ciblée sur la technique de l'exercice).
- Tu peux **intégrer directement une vidéo dans la fiche** : colle un lien YouTube et le lecteur s'affiche dans la fiche, mémorisé pour les prochaines visites.

### 🎯 Programme personnalisé
Réponds à quelques questions et reçois un programme hebdomadaire complet adapté à :
- **Ton objectif** : prise de masse, force, sèche ou remise en forme — les séries, répétitions et temps de repos s'adaptent automatiquement.
- **Ton niveau** : débutant, intermédiaire, avancé (volume et exercices accessibles ajustés).
- **Tes disponibilités** : de 2 à 6 séances/semaine avec le split optimal (full body, push/pull/legs, haut/bas…).
- **Ton matériel** : salle complète, haltères à la maison ou poids du corps uniquement.
- **Ton point faible** : priorise un groupe musculaire en retard.

Le programme est sauvegardé sur ton appareil, régénérable pour varier les exercices, et imprimable en PDF. Chaque conseil nutrition/récupération est adapté à l'objectif choisi.

### ⏱ Séance en direct (style Nike Training Club)
Lance une séance chronométrée et enregistre **exactement** ce que tu fais, même si tu t'écartes du programme :
- **Chronomètre global** de la séance (horodatage réel, aucune dérive).
- **Chrono par exercice** : le temps passé sur chaque mouvement est mesuré.
- **Minuteur de repos précis** après chaque série validée : compte à rebours plein écran, boutons ±15 s, bip sonore à la fin, dépassement affiché — et c'est le **repos réellement pris** qui est enregistré, à la seconde près.
- Journal exact : poids × répétitions pour chaque série, ajout d'exercices à la volée en pleine séance, retrait, changement d'ordre d'exécution libre.
- Démarrage en un clic depuis une séance de ton programme (objectifs et repos pré-remplis) ou en **séance libre**.
- **Résumé de fin** (durée, repos cumulé, séries, volume total en kg) et **historique complet** des séances, consultable et supprimable.
- La séance en cours survit à un rechargement de page (reprise automatique).

### ➕ Référence tes propres exercices
Ajoute tes exercices personnels (nom, muscle, matériel, description, lien vidéo) : ils rejoignent la bibliothèque et peuvent être intégrés à tes programmes. Tout est stocké localement dans ton navigateur.

### 🎨 Deux thèmes au choix
- **Gamifié** (défaut) : sombre, accent vert volt, cartes-posters, anneaux, XP et badges.
- **Épuré** : éditorial clair (blanc cassé + noir + terracotta), typographie magazine, zéro emoji décoratif.
- Bascule dans l'en-tête, mémorisée sur l'appareil. Mêmes fonctionnalités et mêmes données dans les deux.

### 📊 Suivi, gamification & sauvegarde
- **Tableau de bord** : objectif hebdomadaire ajustable avec « ✓ Objectif atteint » et streak de semaines validées, niveau/XP, badges, statistiques globales, répartition par muscle, records personnels (PR) avec graphique d'évolution, suivi du poids de corps.
- **Mes séances** : liste ou tableau triable, recherche et filtre par période, détail complet, RPE (1-10) + notes, modification, duplication (rejouer une séance), suppression.
- **Calendrier** mensuel : pastilles sur les jours entraînés, détail au clic, statut d'objectif par semaine.
- **Export / import JSON** de toutes les données, et **PWA légère** (installable, fonctionne hors ligne en salle).

## 🗂 Structure du projet

```
index.html        Interface (4 vues : bibliothèque, programme, séance, ajout)
css/style.css     Styles (thème sombre, responsive, impression)
js/data.js        Base de données des exercices (socle)
js/data-extra.js  Extension de la base (116 exercices au total)
js/program.js     Générateur de programme personnalisé
js/app.js         Logique de l'interface et stockage local
js/workout.js     Séance en direct : chronos, repos, RPE, historique
js/tracking.js    Suivi : stats, XP/badges, PR, calendrier, thèmes, export
manifest.webmanifest + sw.js + icon.svg   PWA (hors-ligne)
```

## ⚠️ Avertissement

Échauffe-toi toujours avant une séance et consulte un professionnel de santé en cas de doute ou de pathologie. Cette application ne remplace pas un coach diplômé.
