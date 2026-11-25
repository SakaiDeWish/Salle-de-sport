# Fiche App Store — GymCoach

À relire et adapter. Les limites de caractères sont celles d'App Store Connect (à confirmer au moment de la saisie).

## Identité
- **Nom** (30 car. max) : `GymCoach`
- **Sous-titre** (30 car.) : `Séances, repos et progression`
- **Catégorie principale** : Forme et santé · **secondaire** : Sports
- **Langue** : français (France)
- **Identifiant de l'app** : `fr.gymcoach.app` (à changer dans `native/capacitor.config.json` si tu as un autre identifiant)

## Texte promotionnel (170 car.)
Un coach de poche pour la salle : ton programme, un chrono de repos précis, les charges de la dernière fois et ta progression. Tout reste sur ton téléphone.

## Description
GymCoach t'accompagne pendant toute ta séance de musculation.

SÉANCE EN DIRECT
• Chrono de séance, repos calculé par exercice, décompte vocal « 3, 2, 1 »
• Pavé numérique pensé pour la salle, calcul des disques de la barre
• Super sets, exercices alternatifs, réorganisation en glissant

PROGRAMMES
• Génère un programme selon ton objectif, ton niveau et ton matériel
• Importe le tien, range-le en dossiers, modifie-le d'après ce que tu as réellement fait
• Les exercices de remplacement que tu choisis sont enregistrés

PROGRESSION
• Records, volume, séries, régularité, objectifs hebdomadaires
• Calendrier, historique de chaque série, notes et récapitulatif de séance

TES DONNÉES T'APPARTIENNENT
• Aucun compte, aucune publicité. Sauvegarde et restauration en un geste.

PREMIUM (optionnel)
• Analyses avancées (1RM estimé, volume sur 12 semaines, plateaux), programmes illimités, thèmes supplémentaires, export CSV.

GymCoach est un outil de suivi, pas un avis médical. Consulte un professionnel de santé en cas de doute.

## Mots-clés (100 car., séparés par des virgules, sans espaces inutiles)
`musculation,salle,programme,séance,chrono,repos,fitness,entraînement,suivi,haltères,force,coach`

## URL
- **Politique de confidentialité** : `https://sakaidewish.github.io/Salle-de-sport/confidentialite.html`
- **Assistance** : à renseigner (page ou adresse e-mail).

## Classification d'âge
Aucun contenu sensible. Probablement 4+. Réponds « Non » à tout, sauf mention médicale/santé : « Conseils médicaux ou de santé » → « Non » (l'app ne donne pas de conseil médical, seulement des repères d'entraînement et un avertissement).

## Confidentialité de l'app (étiquettes « nutrition »)
- **Collecte de données** : *Aucune donnée collectée.*
- **Suivi (tracking)** : Non.
- Si tu ajoutes Apple Santé : déclarer l'accès à HealthKit et l'usage (affichage dans l'app, pas de partage).

## Notes pour l'équipe de validation
- Application sans compte : aucun identifiant nécessaire.
- Le premium est un abonnement auto-renouvelable (voir ci-dessous) ; « Restaurer mon achat » est dans la fenêtre Premium.
- Fonctions natives utilisées : retour haptique à la validation d'une série, notifications locales de fin de repos, stockage local.

## Achats intégrés (à créer dans App Store Connect)
| Référence | Type | Durée | Prix indicatif |
|---|---|---|---|
| `gymcoach.premium.mensuel` | Abonnement auto-renouvelable | 1 mois | à tester (4 à 6 €) |
| `gymcoach.premium.annuel` | Abonnement auto-renouvelable | 1 an | à tester (30 à 45 €) |
| `gymcoach.premium.vie` | Non consommable | — | à tester |

Chaque abonnement doit afficher dans l'app : le prix, la durée, le renouvellement automatique, les liens vers les conditions d'utilisation et la politique de confidentialité, et « Restaurer mon achat ».
