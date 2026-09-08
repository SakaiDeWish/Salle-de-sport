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
- **Repos auto-adapté** à chaque exercice (polyarticulaire/isolation × objectif × niveau), toujours modifiable.
- **Alternatives** : chaque exercice se remplace d'un tap par un mouvement équivalent (même muscle, autre matériel).
- **Bilan de fin** : trop dur / correct / trop facile → ajustement du volume appliqué au programme en un clic.
- **Séance libre guidée** : choisis tes muscles, l'app propose un enchaînement cohérent (poly → isolation → gainage).
- Outils intégrés : estimateur de 1RM et calculateur de disques.
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

### 🏠 Écran d'accueil
Prochaine séance du programme en un tap, anneau d'objectif hebdo, streak, dernier record, résumé du mois et accroche du jour. Onboarding de 30 secondes au premier lancement.

### 🍎 Nutrition
Besoins caloriques (TDEE, Mifflin-St Jeor) et macros calculés depuis ton profil et ton objectif, conseils fondés (timing, hydratation, collations, compléments sans survente) et exemples de repas.

### 🎨 Deux thèmes, deux sets d'icônes
- **Sombre** (défaut) : quasi-noir, accent vert volt, cartes-posters, icônes épaisses et animées (flamme du streak, play pulsé, badges qui pop).
- **Clair** : éditorial (blanc cassé + noir + terracotta réservé aux CTA), typographie magazine, icônes fines et discrètes.
- Un seul jeu de glyphes SVG maison (30+ : navigation, 10 groupes musculaires, badges, actions) stylé différemment par thème. Bascule dans l'en-tête, mémorisée. Mêmes fonctionnalités et mêmes données dans les deux.

### 📋 Créateur de programmes
- **Plusieurs programmes enregistrés** : générés par questionnaire, modèles prêts à l'emploi (Full body, Haut/Bas, PPL), créés de A à Z, ou « refaire ça » depuis une séance passée.
- **Éditeur complet** : jours, exercices depuis la bibliothèque, séries/reps/repos/notes par exercice, supersets, réorganisation par glisser-déposer (+ flèches sur mobile), suggestions d'exercices, remplacement par alternative.
- **Programme actif** : il alimente l'accueil, l'écran Séance et les ajustements de fin de séance ; on bascule d'un programme à l'autre en un tap.
- **Partage** : export d'un programme en JSON à envoyer à un ami, import en un clic.
- **Projection 8 semaines** : surcharge progressive + semaines de décharge (deload), ajustée par les bilans de fin de séance.

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
js/icons.js       Système d'icônes SVG (2 rendus par thème)
js/tracking.js    Suivi : stats, XP/badges, PR, calendrier, thèmes, export
js/programs.js    Créateur/gestionnaire de programmes, partage, projection
manifest.webmanifest + sw.js + icon.svg   PWA (hors-ligne)
```

## ⚠️ Avertissement

Échauffe-toi toujours avant une séance et consulte un professionnel de santé en cas de doute ou de pathologie. Cette application ne remplace pas un coach diplômé.
