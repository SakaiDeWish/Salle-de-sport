# 🏋️ GymCoach — Salle de sport

Application web de musculation : bibliothèque d'exercices complète, programmes personnalisés selon tes objectifs, et vidéo de démonstration pour chaque exercice.

**Aucune installation nécessaire** : ouvre simplement `index.html` dans ton navigateur (ou héberge le dossier sur GitHub Pages).

## ✨ Fonctionnalités

### 📚 Bibliothèque d'exercices
- **50 exercices référencés** couvrant tous les groupes musculaires : pectoraux, dos, épaules, biceps, triceps, quadriceps, ischios/fessiers, mollets, abdos, lombaires.
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

### ➕ Référence tes propres exercices
Ajoute tes exercices personnels (nom, muscle, matériel, description, lien vidéo) : ils rejoignent la bibliothèque et peuvent être intégrés à tes programmes. Tout est stocké localement dans ton navigateur.

## 🗂 Structure du projet

```
index.html        Interface (3 vues : bibliothèque, programme, ajout)
css/style.css     Styles (thème sombre, responsive, impression)
js/data.js        Base de données des 50 exercices
js/program.js     Générateur de programme personnalisé
js/app.js         Logique de l'interface et stockage local
```

## ⚠️ Avertissement

Échauffe-toi toujours avant une séance et consulte un professionnel de santé en cas de doute ou de pathologie. Cette application ne remplace pas un coach diplômé.
