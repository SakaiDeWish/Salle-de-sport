---
name: GymCoach
description: Coach de salle sur téléphone, lu en une seconde entre deux séries. Charbon chaud, volt, chiffres Anton.
colors:
  charbon: "#141210"
  charbon-doux: "#1c1916"
  carte: "#211d19"
  carte-survol: "#282320"
  trait: "#34302a"
  texte: "#f4f5f7"
  texte-discret: "#9aa1ad"
  volt: "#ceff00"
  volt-texte: "#b8f227"
  volt-fin-degrade: "#6ef05a"
  sur-volt: "#0c0e05"
  validation: "#3ecf8e"
  attention: "#f5b83d"
  danger: "#ef5561"
typography:
  display:
    fontFamily: "Anton, Arial Narrow, Impact, sans-serif"
    fontSize: "clamp(3rem, 11vw, 6.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.01em"
  title:
    fontFamily: "Anton, Arial Narrow, Impact, sans-serif"
    fontSize: "clamp(1.3rem, 4vw, 1.9rem)"
    fontWeight: 400
    letterSpacing: "0.02em"
  body:
    fontFamily: "Barlow, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Barlow, Segoe UI, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    letterSpacing: "0.02em"
rounded:
  sm: "12px"
  md: "20px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "clamp(20px, 4vw, 30px)"
components:
  button-primary:
    backgroundColor: "{colors.volt}"
    textColor: "{colors.sur-volt}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
    height: "48px"
  button-ghost:
    backgroundColor: "{colors.charbon-doux}"
    textColor: "{colors.texte}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
    height: "48px"
  chip:
    backgroundColor: "{colors.charbon-doux}"
    textColor: "{colors.texte-discret}"
    rounded: "{rounded.pill}"
    padding: "10px 16px"
    height: "44px"
  card:
    backgroundColor: "{colors.carte}"
    textColor: "{colors.texte}"
    rounded: "{rounded.md}"
    padding: "16px"
  input:
    backgroundColor: "{colors.charbon-doux}"
    textColor: "{colors.texte}"
    rounded: "{rounded.sm}"
    padding: "13px 16px"
    height: "48px"
---

# Design System: GymCoach

## Overview

**Creative North Star: "Le tableau de bord de salle"**

GymCoach se lit comme un afficheur : on le regarde une seconde entre deux séries, une main libre, les doigts moites. Les chiffres (chrono, poids, répétitions) sont grands, en Anton, et c'est le seul endroit où la typographie crie. Tout le reste reste calme et lisible. Le volt est un signal, pas une peinture : il marque l'action en cours et le chiffre qui compte.

Le fond est un charbon chaud, pas un noir d'écran. Les surfaces se distinguent par la teinte (`carte` sur `charbon`) plus que par les ombres. La densité est moyenne : peu de choses à l'écran, chacune à portée du pouce.

**Key Characteristics:**
- Un seul accent, le volt, rare à l'écran
- Chiffres en Anton, texte en Barlow
- Cibles de 44 px minimum, 48 à 56 px pour les actions de séance
- Profondeur par la teinte, ombre seulement sur l'en-tête collant
- Mouvement court, qui glisse ou se fond, jamais de saut

## Colors

Un charbon chaud, des cartes à peine plus claires, et un volt jaune-vert électrique pour l'action.

### Primary
- **Volt** (#ceff00) : bouton principal (en dégradé vers #6ef05a), anneau de repos, barre de progression, bordure de l'exercice en cours.
- **Volt texte** (#b8f227) : texte et icônes volt sur fond sombre, focus visible.
- **Sur volt** (#0c0e05) : texte posé sur le volt, jamais du noir pur.

### Neutral
- **Charbon** (#141210) : fond de page.
- **Charbon doux** (#1c1916) : champs, puces, boutons secondaires.
- **Carte** (#211d19) et **carte survol** (#282320) : cartes et panneaux.
- **Trait** (#34302a) : bordures d'un pixel.
- **Texte** (#f4f5f7) et **texte discret** (#9aa1ad) : texte principal et secondaire (environ 7:1 sur le fond).

### Semantic
- **Validation** (#3ecf8e), **attention** (#f5b83d), **danger** (#ef5561) : séries validées, avertissements, abandon.

### Named Rules
**The One Signal Rule.** Le volt marque une seule chose par zone : l'action ou le chiffre en cours. S'il est partout, il ne signale plus rien.
**The Warm Charcoal Rule.** Le fond est #141210, jamais #000, #0B0B0B ou #111. Aucun blanc pur #FFF.

## Typography

**Display Font:** Anton (avec Arial Narrow, Impact)
**Body Font:** Barlow (avec Segoe UI, system-ui)

**Character:** Anton est massive et condensée, faite pour les chiffres et les titres courts. Barlow, plus ouverte, porte les explications sans fatiguer.

### Hierarchy
- **Display** (400, clamp(3rem, 11vw, 6.5rem), 0.95) : titres de page, en capitales.
- **Title** (400, clamp(1.3rem, 4vw, 1.9rem)) : titres de carte et de séance.
- **Chrono** (Anton, 2 à 2,8 rem principal, 1,35 rem secondaires, chiffres tabulaires) : durée, repos, séries.
- **Body** (400, 1rem, 1.6) : explications, descriptions.
- **Label** (700, 0.8rem, 0.02em, casse normale) : libellés de chrono et de progression, 12 px minimum.

### Named Rules
**The Short Caps Rule.** Les capitales ne servent qu'aux titres et aux boutons d'action courts. Jamais sur une phrase.
**The Tabular Rule.** Tout chiffre qui change (chrono, poids, reps) est en `tabular-nums`, pour qu'il ne danse pas.

## Layout

Mobile d'abord, une colonne, barre d'onglets en bas à 5 entrées dont Accueil au centre (le pouce y retombe). Au-delà de 760 px, une barre du haut remplace la barre du bas. L'en-tête de séance est collant et se réduit en pilule au défilement. Rythme à 8, 12, 16 px ; padding de carte de 16 px (20 à 30 px sur les grandes cartes).

## Elevation & Depth

Profondeur surtout par la teinte : `carte` (#211d19) sur `charbon` (#141210). Une seule ombre, `0 18px 40px rgba(0,0,0,0.45)`, réservée à l'en-tête collant de séance. Pas de flou de fond (backdrop-filter) ni de lueur.

### Named Rules
**The Flat-By-Default Rule.** Une surface est plate au repos. L'ombre signale seulement ce qui flotte au-dessus du défilement.

## Shapes

Deux rayons : 20 px pour les cartes, 12 px pour les champs, et des pilules (999 px) pour les boutons et les puces. Bordures d'un pixel en `trait`. Jamais de liseré coloré sur un seul côté : l'exercice en cours prend une bordure volt complète.

## Components

### Buttons
- **Shape:** pilule (999 px), 48 px de haut minimum, 56 px en grand format.
- **Primary:** dégradé volt (#ceff00 vers #6ef05a), texte `sur-volt`, capitales, 700, espacement 0.06em. Un seul par écran.
- **Ghost:** fond `charbon-doux`, bordure `trait`, texte `texte` ; au survol, bordure et texte volt.
- **Danger ghost:** contour, texte `danger`.
- **Press:** `scale(0.97)` à l'appui, 160 ms.

### Chips
- **Style:** fond `charbon-doux`, bordure `trait`, texte `texte-discret`, pilule, 44 px de haut.
- **State:** survol en `texte` ; sélectionnée en volt.

### Cards / Containers
- **Corner Style:** 20 px. **Background:** `carte`. **Border:** 1 px `trait`. **Padding:** 16 px. L'exercice en cours : bordure volt complète.

### Inputs / Fields
- **Style:** fond `charbon-doux`, bordure `trait`, 12 px de rayon, 48 px de haut.
- **Focus:** contour volt de 3 px, décalé de 2 px.

### Navigation
- Barre du bas : 5 onglets, icône SVG plus libellé de 12 px, onglet actif en volt texte, fond `charbon` opaque, hauteur 52 px par onglet.

### Chrono de séance (composant signature)
- Durée en Anton volt, repos et séries en Anton blanc plus petit, sur une seule ligne. Pilule réduite au défilement. L'en-tête mesure 205 px sur 844, le premier exercice reste visible sans défiler.

## Do's and Don'ts

### Do:
- **Do** garder les cibles tactiles à 44 px minimum.
- **Do** mettre les chiffres changeants en `tabular-nums`.
- **Do** faire glisser ou fondre tout changement de cible, et raccourcir (jamais remplacer par un saut) sous `prefers-reduced-motion`.
- **Do** utiliser des icônes SVG du sprite (`js/icons.js`).

### Don't:
- **Don't** utiliser d'emojis, de glyphes Unicode (⌃ ⌄ ⏸ ✕) ou de sparkles comme icônes ou puces.
- **Don't** mettre de sur-titre en capitales espacées au-dessus d'un titre.
- **Don't** utiliser de mono pour les libellés, ni Inter, Geist ou Space Grotesk.
- **Don't** ajouter de lueur radiale, de flou de verre, de dégradé décoratif ni de liseré gauche coloré.
- **Don't** étendre le thème « Épuré » (crème #f6f1e7, Fraunces, terracotta #d14836) : il reprend la famille de tics n°1 de la règle anti-AI slop. Dette documentée, à repenser ou retirer.
