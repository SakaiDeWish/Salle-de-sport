# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Un pratiquant de musculation en salle, sur téléphone, une main occupée ou moite, qui regarde l'écran une seconde entre deux séries. Il veut noter exactement ce qu'il fait (poids, répétitions, repos) sans perdre le fil. Les amis qui reçoivent un programme par le partage JSON sont des utilisateurs secondaires, avec le même usage.

## Product Purpose

GymCoach est une application web de musculation : bibliothèque de 116 exercices avec fiches, programmes personnalisés ou créés à la main, séance en direct chronométrée, suivi et historique. Le succès, c'est une séance enregistrée telle qu'elle s'est vraiment passée, sans friction pendant l'effort.

## Positioning

Gratuite, sans compte, avec les données dans le navigateur de l'utilisateur, utilisable hors ligne en salle (PWA). Elle enregistre le repos réellement pris, à la seconde près, plutôt qu'un repos théorique.

## Operating Context

La salle de sport : réseau faible ou absent, téléphone tenu d'une main, doigts moites, attention partagée avec l'effort. La séance en cours survit à un rechargement de page. Le minuteur de repos est un écran plein écran avec bip, réductible en mini-barre.

## Capabilities and Constraints

- Application statique (HTML, CSS, JavaScript), sans build, sans serveur. Données en `localStorage`. Service worker avec cache versionné (`sw.js`), à incrémenter à chaque livraison.
- Séance en direct : exercice courant, séries avec poids, répétitions et RIR (ou temps pour les maintiens), chronos global et par exercice, supersets enchaînés sans repos, échauffement comme phase de la séance.
- Deux thèmes (sombre par défaut, clair "Épuré"), bascule mémorisée.
- Dépôt public : aucune donnée personnelle dans le code ni la documentation.

## Evidence on Hand

README.md décrit l'ensemble des fonctionnalités. Aucun témoignage, aucune statistique d'usage, aucune capture publiée : rien de cela ne doit être inventé.

## Product Principles

- Lisible en une seconde : les chiffres de la série en cours passent avant tout le reste.
- Une main, doigts moites : cibles larges, peu de saisie au clavier, aucun geste unique pour une action importante.
- Fidèle au réel : l'app enregistre ce qui s'est passé, pas ce qui était prévu.
- Sans conséquence en cas d'erreur : un geste accidentel se corrige sans rien casser.
- Hors ligne d'abord : aucune fonction de séance ne dépend du réseau.
