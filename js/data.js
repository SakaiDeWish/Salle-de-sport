/* =========================================================
   GymCoach — Base de données des exercices
   Chaque exercice contient : technique, erreurs à éviter
   et une recherche vidéo ciblée pour la démonstration.
   ========================================================= */

const EXERCISES = [

  /* ==================== PECTORAUX ==================== */
  {
    id: "developpe-couche-barre",
    nom: "Développé couché à la barre",
    groupe: "pectoraux",
    materiel: "barre",
    niveau: "intermediaire",
    type: "poly",
    muscles: "Pectoraux, triceps, deltoïdes antérieurs",
    description: "L'exercice roi pour les pectoraux. Allongé sur un banc plat, tu descends la barre vers la poitrine puis la repousses à la verticale.",
    execution: [
      "Allonge-toi sur le banc, pieds bien ancrés au sol, omoplates serrées et légère cambrure lombaire.",
      "Saisis la barre avec une prise légèrement plus large que les épaules.",
      "Descends la barre de façon contrôlée jusqu'au bas des pectoraux en inspirant.",
      "Repousse la barre vers le haut en expirant, sans verrouiller brutalement les coudes."
    ],
    erreurs: [
      "Rebondir la barre sur la poitrine.",
      "Décoller les fessiers du banc.",
      "Prise trop large qui met les épaules en danger."
    ],
    videoQuery: "développé couché barre technique exécution musculation"
  },
  {
    id: "developpe-incline-halteres",
    nom: "Développé incliné aux haltères",
    groupe: "pectoraux",
    materiel: "halteres",
    niveau: "intermediaire",
    type: "poly",
    muscles: "Haut des pectoraux, deltoïdes antérieurs, triceps",
    description: "Sur un banc incliné à 30-45°, cible le haut des pectoraux pour un torse plus complet.",
    execution: [
      "Règle le banc entre 30 et 45° d'inclinaison.",
      "Monte les haltères au-dessus de la poitrine, paumes vers l'avant.",
      "Descends lentement jusqu'à sentir un étirement des pectoraux.",
      "Repousse en expirant en rapprochant légèrement les haltères en haut."
    ],
    erreurs: [
      "Incliner le banc à plus de 45° (les épaules prennent le relais).",
      "Descendre trop bas et sur-étirer l'épaule.",
      "Cambrer excessivement le dos."
    ],
    videoQuery: "développé incliné haltères technique musculation"
  },
  {
    id: "pompes",
    nom: "Pompes",
    groupe: "pectoraux",
    materiel: "poids-du-corps",
    niveau: "debutant",
    type: "poly",
    muscles: "Pectoraux, triceps, deltoïdes, gainage",
    description: "Le grand classique au poids du corps, réalisable partout. Idéal pour débuter ou finir une séance.",
    execution: [
      "Mains au sol légèrement plus écartées que les épaules, corps parfaitement gainé.",
      "Descends la poitrine près du sol en gardant les coudes à ~45° du buste.",
      "Repousse le sol en expirant jusqu'à l'extension des bras.",
      "Garde la tête dans le prolongement de la colonne."
    ],
    erreurs: [
      "Casser la ligne du corps (bassin qui tombe ou fesses en l'air).",
      "Amplitude partielle.",
      "Coudes complètement écartés à 90°."
    ],
    videoQuery: "pompes push up technique parfaite musculation"
  },
  {
    id: "ecarte-poulie-vis-a-vis",
    nom: "Écarté à la poulie vis-à-vis",
    groupe: "pectoraux",
    materiel: "poulie",
    niveau: "debutant",
    type: "iso",
    muscles: "Pectoraux (isolation), deltoïdes antérieurs",
    description: "Exercice d'isolation avec tension continue, parfait pour la congestion et le travail de la portion interne des pectoraux.",
    execution: [
      "Place-toi au centre des poulies hautes, un pied devant pour la stabilité.",
      "Bras légèrement fléchis, ramène les poignées devant toi en arc de cercle.",
      "Contracte fort les pectoraux en fin de mouvement 1 seconde.",
      "Reviens lentement en contrôlant l'étirement."
    ],
    erreurs: [
      "Plier les coudes pendant le mouvement (ça devient un développé).",
      "Charger trop lourd et perdre le contrôle.",
      "Buste qui bascule d'avant en arrière."
    ],
    videoQuery: "écarté poulie vis à vis pectoraux technique"
  },
  {
    id: "dips-pectoraux",
    nom: "Dips (orientés pectoraux)",
    groupe: "pectoraux",
    materiel: "poids-du-corps",
    niveau: "avance",
    type: "poly",
    muscles: "Bas des pectoraux, triceps, deltoïdes antérieurs",
    description: "Aux barres parallèles, buste penché en avant pour cibler les pectoraux. Redoutable pour l'épaisseur du torse.",
    execution: [
      "Saisis les barres parallèles, penche le buste en avant (~30°).",
      "Descends en fléchissant les coudes jusqu'à ce que les épaules soient au niveau des coudes.",
      "Remonte en expirant en gardant l'inclinaison du buste.",
      "Garde les coudes légèrement ouverts."
    ],
    erreurs: [
      "Descendre trop bas et forcer sur les épaules.",
      "Rester trop vertical (le travail bascule sur les triceps).",
      "Mouvement de balancier avec les jambes."
    ],
    videoQuery: "dips pectoraux barres parallèles technique musculation"
  },
  {
    id: "developpe-couche-halteres",
    nom: "Développé couché aux haltères",
    groupe: "pectoraux",
    materiel: "halteres",
    niveau: "debutant",
    type: "poly",
    muscles: "Pectoraux, triceps, deltoïdes antérieurs",
    description: "Variante du développé couché offrant plus d'amplitude et un meilleur équilibrage gauche/droite.",
    execution: [
      "Allongé sur banc plat, un haltère dans chaque main au niveau de la poitrine.",
      "Pousse les haltères vers le haut jusqu'à l'extension des bras.",
      "Rapproche-les légèrement en haut sans les entrechoquer.",
      "Redescends lentement en ouvrant les coudes à ~45°."
    ],
    erreurs: [
      "Descendre trop bas et sur-étirer les épaules.",
      "Trajectoire instable par charge trop lourde.",
      "Cambrure excessive."
    ],
    videoQuery: "développé couché haltères technique musculation"
  },

  /* ==================== DOS ==================== */
  {
    id: "tractions",
    nom: "Tractions (pronation)",
    groupe: "dos",
    materiel: "poids-du-corps",
    niveau: "intermediaire",
    type: "poly",
    muscles: "Grand dorsal, biceps, trapèzes, avant-bras",
    description: "La référence pour élargir le dos. Suspendu à une barre, tu tires ton corps jusqu'à amener le menton au-dessus.",
    execution: [
      "Suspends-toi à la barre, prise pronation un peu plus large que les épaules.",
      "Tire en amenant les coudes vers le bas et l'arrière, poitrine vers la barre.",
      "Monte jusqu'à ce que le menton dépasse la barre.",
      "Redescends de façon contrôlée jusqu'à l'extension quasi complète."
    ],
    erreurs: [
      "S'aider en se balançant (kipping involontaire).",
      "Demi-amplitude en haut comme en bas.",
      "Hausser les épaules au lieu de tirer avec le dos."
    ],
    videoQuery: "tractions pronation technique dos musculation"
  },
  {
    id: "rowing-barre",
    nom: "Rowing barre buste penché",
    groupe: "dos",
    materiel: "barre",
    niveau: "intermediaire",
    type: "poly",
    muscles: "Grand dorsal, trapèzes, rhomboïdes, lombaires, biceps",
    description: "Le meilleur exercice pour l'épaisseur du dos. Buste penché, tu tires la barre vers le nombril.",
    execution: [
      "Buste penché à ~45°, dos plat, genoux légèrement fléchis.",
      "Saisis la barre en pronation, bras tendus.",
      "Tire la barre vers le nombril en serrant les omoplates.",
      "Redescends lentement sans arrondir le dos."
    ],
    erreurs: [
      "Arrondir le bas du dos (dangereux).",
      "Tricher avec un balancement du buste.",
      "Tirer vers la poitrine avec les coudes écartés."
    ],
    videoQuery: "rowing barre buste penché technique musculation"
  },
  {
    id: "tirage-vertical",
    nom: "Tirage vertical poitrine",
    groupe: "dos",
    materiel: "poulie",
    niveau: "debutant",
    type: "poly",
    muscles: "Grand dorsal, biceps, trapèzes inférieurs",
    description: "L'alternative machine aux tractions, parfaite pour apprendre à recruter le dos et progresser vers la barre fixe.",
    execution: [
      "Assis, cuisses calées, saisis la barre en prise large pronation.",
      "Bombe le torse et tire la barre vers le haut de la poitrine.",
      "Descends les coudes vers le bas et l'arrière en serrant les omoplates.",
      "Remonte lentement en contrôlant l'étirement du dos."
    ],
    erreurs: [
      "Tirer derrière la nuque (risque pour les épaules).",
      "Se pencher exagérément en arrière.",
      "Tirer avec les bras sans engager le dos."
    ],
    videoQuery: "tirage vertical poitrine poulie haute technique"
  },
  {
    id: "rowing-haltere",
    nom: "Rowing haltère un bras",
    groupe: "dos",
    materiel: "halteres",
    niveau: "debutant",
    type: "poly",
    muscles: "Grand dorsal, trapèzes, rhomboïdes, biceps",
    description: "Un bras à la fois, genou sur le banc : idéal pour corriger les déséquilibres et bien sentir le dos travailler.",
    execution: [
      "Genou et main du même côté posés sur le banc, dos plat parallèle au sol.",
      "Haltère dans l'autre main, bras tendu vers le sol.",
      "Tire l'haltère vers la hanche en gardant le coude près du corps.",
      "Redescends lentement en étirant le dorsal."
    ],
    erreurs: [
      "Faire pivoter le buste pour monter plus lourd.",
      "Tirer vers l'épaule plutôt que vers la hanche.",
      "Dos arrondi."
    ],
    videoQuery: "rowing haltère un bras technique dos"
  },
  {
    id: "souleve-de-terre",
    nom: "Soulevé de terre",
    groupe: "dos",
    materiel: "barre",
    niveau: "avance",
    type: "poly",
    muscles: "Chaîne postérieure complète : lombaires, fessiers, ischios, trapèzes, dorsaux",
    description: "L'exercice le plus complet de la musculation. Technique exigeante mais gains de force et de masse incomparables.",
    execution: [
      "Pieds sous la barre écartés largeur de hanches, saisis la barre bras tendus.",
      "Dos plat, poitrine sortie, abdos gainés.",
      "Pousse le sol avec les jambes puis redresse le buste, barre au contact des jambes.",
      "Verrouille les hanches en haut puis redescends en contrôlant."
    ],
    erreurs: [
      "Arrondir le bas du dos (risque majeur de blessure).",
      "Barre éloignée des tibias.",
      "Tirer avec le dos avant de pousser avec les jambes."
    ],
    videoQuery: "soulevé de terre deadlift technique complète musculation"
  },
  {
    id: "rowing-t-bar",
    nom: "Rowing T-bar",
    groupe: "dos",
    materiel: "machine",
    niveau: "intermediaire",
    type: "poly",
    muscles: "Grand dorsal, trapèzes moyens, rhomboïdes",
    description: "Variante de rowing guidée qui permet de charger lourd en sécurité pour épaissir le milieu du dos.",
    execution: [
      "Place-toi au-dessus de la barre, buste penché, dos plat.",
      "Saisis les poignées, tire la charge vers la poitrine.",
      "Serre fort les omoplates en fin de tirage.",
      "Redescends lentement sans reposer complètement la charge."
    ],
    erreurs: [
      "Se redresser pendant le tirage.",
      "Amplitude écourtée en haut.",
      "À-coups avec les lombaires."
    ],
    videoQuery: "rowing t-bar technique dos musculation"
  },

  /* ==================== ÉPAULES ==================== */
  {
    id: "developpe-militaire",
    nom: "Développé militaire barre",
    groupe: "epaules",
    materiel: "barre",
    niveau: "intermediaire",
    type: "poly",
    muscles: "Deltoïdes antérieurs et moyens, triceps, trapèzes",
    description: "Le développé debout à la barre : force et masse pour les épaules, avec un gros travail de gainage.",
    execution: [
      "Debout, barre au niveau des clavicules, prise largeur d'épaules.",
      "Gaine les abdos et serre les fessiers.",
      "Pousse la barre à la verticale en passant la tête légèrement en avant en fin de montée.",
      "Redescends lentement jusqu'aux clavicules."
    ],
    erreurs: [
      "Cambrer le bas du dos pour pousser plus lourd.",
      "Pousser la barre vers l'avant plutôt qu'à la verticale.",
      "Ne pas verrouiller le gainage."
    ],
    videoQuery: "développé militaire barre debout technique épaules"
  },
  {
    id: "elevations-laterales",
    nom: "Élévations latérales",
    groupe: "epaules",
    materiel: "halteres",
    niveau: "debutant",
    type: "iso",
    muscles: "Deltoïdes moyens",
    description: "L'exercice incontournable pour élargir les épaules. Léger et strict : c'est la qualité d'exécution qui paie.",
    execution: [
      "Debout, un haltère dans chaque main le long du corps, coudes très légèrement fléchis.",
      "Monte les bras sur les côtés jusqu'à l'horizontale, comme pour verser une carafe.",
      "Marque un temps d'arrêt en haut.",
      "Redescends lentement en résistant à la charge."
    ],
    erreurs: [
      "Prendre trop lourd et s'élancer avec le buste.",
      "Monter au-dessus de l'horizontale en haussant les épaules.",
      "Descente en chute libre."
    ],
    videoQuery: "élévations latérales haltères technique épaules"
  },
  {
    id: "developpe-halteres-assis",
    nom: "Développé épaules haltères assis",
    groupe: "epaules",
    materiel: "halteres",
    niveau: "debutant",
    type: "poly",
    muscles: "Deltoïdes, triceps, trapèzes",
    description: "Le développé assis aux haltères : plus naturel pour les articulations que la barre et accessible à tous.",
    execution: [
      "Assis dossier légèrement incliné, haltères au niveau des oreilles, paumes vers l'avant.",
      "Pousse les haltères vers le haut jusqu'à presque les rejoindre.",
      "Ne verrouille pas brutalement les coudes.",
      "Redescends en contrôlant jusqu'aux oreilles."
    ],
    erreurs: [
      "Descendre trop bas (haltères aux épaules).",
      "Cambrer et décoller le dos du dossier.",
      "Entrechoquer les haltères en haut."
    ],
    videoQuery: "développé épaules haltères assis technique"
  },
  {
    id: "oiseau-halteres",
    nom: "Oiseau (élévations buste penché)",
    groupe: "epaules",
    materiel: "halteres",
    niveau: "debutant",
    type: "iso",
    muscles: "Deltoïdes postérieurs, trapèzes moyens, rhomboïdes",
    description: "L'exercice clé pour l'arrière d'épaule, souvent négligé : essentiel pour l'équilibre et la posture.",
    execution: [
      "Buste penché à l'horizontale, dos plat, haltères sous la poitrine.",
      "Ouvre les bras sur les côtés, coudes légèrement fléchis.",
      "Serre les omoplates en haut du mouvement.",
      "Redescends lentement sans balancier."
    ],
    erreurs: [
      "Se redresser pendant la montée.",
      "Tirer avec les trapèzes supérieurs.",
      "Charge trop lourde et mouvement saccadé."
    ],
    videoQuery: "oiseau haltères deltoïde postérieur technique"
  },
  {
    id: "face-pull",
    nom: "Face pull à la poulie",
    groupe: "epaules",
    materiel: "poulie",
    niveau: "debutant",
    type: "iso",
    muscles: "Deltoïdes postérieurs, rotateurs externes, trapèzes",
    description: "Le meilleur exercice de santé d'épaule : il renforce l'arrière d'épaule et corrige la posture enroulée.",
    execution: [
      "Poulie à hauteur du visage avec une corde, saisis les extrémités paumes vers l'intérieur.",
      "Tire la corde vers le visage en écartant les mains de chaque côté de la tête.",
      "Les coudes restent hauts, rotation externe en fin de mouvement.",
      "Reviens lentement bras tendus."
    ],
    erreurs: [
      "Tirer vers la poitrine avec les coudes bas.",
      "Utiliser trop de poids et reculer le buste.",
      "Négliger la rotation externe finale."
    ],
    videoQuery: "face pull poulie corde technique épaules"
  },

  /* ==================== BICEPS ==================== */
  {
    id: "curl-barre",
    nom: "Curl biceps à la barre",
    groupe: "biceps",
    materiel: "barre",
    niveau: "debutant",
    type: "iso",
    muscles: "Biceps, avant-bras",
    description: "L'exercice de base pour la masse des biceps, avec barre droite ou EZ.",
    execution: [
      "Debout, barre en supination, mains largeur d'épaules, coudes collés au buste.",
      "Monte la barre vers les épaules en contractant les biceps.",
      "Serre fort en haut sans avancer les coudes.",
      "Redescends lentement jusqu'à l'extension presque complète."
    ],
    erreurs: [
      "Balancer le buste pour tricher.",
      "Avancer les coudes (les épaules prennent le relais).",
      "Demi-répétitions en bas."
    ],
    videoQuery: "curl biceps barre technique musculation"
  },
  {
    id: "curl-incline",
    nom: "Curl incliné aux haltères",
    groupe: "biceps",
    materiel: "halteres",
    niveau: "intermediaire",
    type: "iso",
    muscles: "Biceps (longue portion)",
    description: "Sur banc incliné, les bras en arrière étirent la longue portion du biceps : recrutement maximal.",
    execution: [
      "Assis sur un banc incliné à 45-60°, bras pendants vers le sol.",
      "Monte les haltères en supination sans bouger les coudes.",
      "Contracte en haut, puis descends très lentement.",
      "Garde les épaules basses et plaquées au dossier."
    ],
    erreurs: [
      "Avancer les épaules pour aider la montée.",
      "Descente relâchée.",
      "Amplitude réduite en bas."
    ],
    videoQuery: "curl incliné haltères biceps technique"
  },
  {
    id: "curl-marteau",
    nom: "Curl marteau",
    groupe: "biceps",
    materiel: "halteres",
    niveau: "debutant",
    type: "iso",
    muscles: "Biceps, brachial, long supinateur (avant-bras)",
    description: "Prise neutre (marteau) pour épaissir le bras et renforcer les avant-bras.",
    execution: [
      "Debout, haltères en prise neutre (paumes face à face).",
      "Monte l'haltère vers l'épaule en gardant le poignet fixe.",
      "Contracte en haut, coude collé au buste.",
      "Redescends en contrôlant. Alterne ou simultané."
    ],
    erreurs: [
      "Élan du buste.",
      "Poignets qui cassent.",
      "Coudes qui partent en arrière."
    ],
    videoQuery: "curl marteau haltères technique biceps"
  },
  {
    id: "curl-pupitre",
    nom: "Curl au pupitre (larry scott)",
    groupe: "biceps",
    materiel: "machine",
    niveau: "intermediaire",
    type: "iso",
    muscles: "Biceps (courte portion), brachial",
    description: "Bras calés sur le pupitre : impossible de tricher, isolation totale du biceps.",
    execution: [
      "Ajuste le siège, arrière des bras plaqué sur le pupitre.",
      "Monte la charge en contractant le biceps.",
      "Ne décolle jamais les coudes du support.",
      "Descends lentement sans tendre brutalement les bras en bas."
    ],
    erreurs: [
      "Extension brutale en bas (risque tendineux).",
      "Se lever du siège pour tricher.",
      "Amplitude écourtée en haut."
    ],
    videoQuery: "curl pupitre larry scott technique biceps"
  },

  /* ==================== TRICEPS ==================== */
  {
    id: "extension-poulie",
    nom: "Extension triceps à la poulie haute",
    groupe: "triceps",
    materiel: "poulie",
    niveau: "debutant",
    type: "iso",
    muscles: "Triceps (3 chefs)",
    description: "L'exercice d'isolation triceps le plus accessible : tension continue et articulations préservées.",
    execution: [
      "Face à la poulie haute, saisis la barre ou la corde, coudes collés au buste.",
      "Tends les bras vers le bas en contractant les triceps.",
      "Avec la corde, écarte les mains en fin d'extension.",
      "Remonte lentement sans décoller les coudes."
    ],
    erreurs: [
      "Écarter les coudes du corps.",
      "Se pencher sur la charge pour pousser avec le poids du corps.",
      "Demi-extensions."
    ],
    videoQuery: "extension triceps poulie haute technique"
  },
  {
    id: "barre-au-front",
    nom: "Barre au front",
    groupe: "triceps",
    materiel: "barre",
    niveau: "intermediaire",
    type: "iso",
    muscles: "Triceps (longue portion surtout)",
    description: "Allongé, tu descends la barre vers le front : un classique redoutable pour la masse des triceps.",
    execution: [
      "Allongé sur un banc, barre EZ saisie en pronation, bras verticaux.",
      "Fléchis les coudes pour amener la barre vers le front ou légèrement derrière.",
      "Seuls les avant-bras bougent, les coudes restent fixes.",
      "Tends les bras en contractant les triceps."
    ],
    erreurs: [
      "Écarter les coudes vers l'extérieur.",
      "Bouger les épaules (ça devient un pull-over).",
      "Charge trop lourde et contrôle perdu près du visage."
    ],
    videoQuery: "barre au front triceps technique musculation"
  },
  {
    id: "dips-banc",
    nom: "Dips entre bancs",
    groupe: "triceps",
    materiel: "poids-du-corps",
    niveau: "debutant",
    type: "poly",
    muscles: "Triceps, deltoïdes antérieurs, pectoraux",
    description: "Version accessible des dips, mains sur un banc derrière soi. Parfait sans matériel.",
    execution: [
      "Mains sur le bord d'un banc derrière toi, jambes tendues devant.",
      "Descends en fléchissant les coudes vers l'arrière jusqu'à ~90°.",
      "Remonte en poussant fort dans les paumes.",
      "Garde le dos proche du banc."
    ],
    erreurs: [
      "Descendre trop bas (épaules en danger).",
      "S'éloigner du banc.",
      "Épaules qui remontent vers les oreilles."
    ],
    videoQuery: "dips entre bancs triceps technique"
  },
  {
    id: "extension-nuque-haltere",
    nom: "Extension nuque haltère",
    groupe: "triceps",
    materiel: "halteres",
    niveau: "debutant",
    type: "iso",
    muscles: "Triceps (longue portion)",
    description: "Bras au-dessus de la tête, la longue portion est étirée : excellent pour le développement complet du triceps.",
    execution: [
      "Assis ou debout, tiens un haltère à deux mains au-dessus de la tête.",
      "Descends l'haltère derrière la nuque en fléchissant les coudes.",
      "Garde les coudes serrés qui pointent vers le plafond.",
      "Tends les bras en contractant les triceps."
    ],
    erreurs: [
      "Coudes qui s'écartent.",
      "Cambrure lombaire excessive.",
      "Descente incontrôlée."
    ],
    videoQuery: "extension triceps nuque haltère technique"
  },

  /* ==================== QUADRICEPS ==================== */
  {
    id: "squat-barre",
    nom: "Squat à la barre",
    groupe: "quadriceps",
    materiel: "barre",
    niveau: "intermediaire",
    type: "poly",
    muscles: "Quadriceps, fessiers, ischios, gainage",
    description: "Le roi des exercices jambes. Force, masse, hormones : rien ne remplace le squat.",
    execution: [
      "Barre posée sur les trapèzes, pieds largeur d'épaules, pointes légèrement ouvertes.",
      "Inspire, gaine, descends en poussant les hanches en arrière et en pliant les genoux.",
      "Descends au moins jusqu'à ce que les cuisses soient parallèles au sol.",
      "Remonte en poussant fort dans le sol, expire en haut."
    ],
    erreurs: [
      "Genoux qui rentrent vers l'intérieur.",
      "Talons qui décollent.",
      "Dos qui s'arrondit en bas.",
      "Demi-squat avec charge d'ego."
    ],
    videoQuery: "squat barre technique complète musculation"
  },
  {
    id: "presse-a-cuisses",
    nom: "Presse à cuisses",
    groupe: "quadriceps",
    materiel: "machine",
    niveau: "debutant",
    type: "poly",
    muscles: "Quadriceps, fessiers, ischios",
    description: "Le mouvement guidé pour charger lourd les jambes en sécurité, sans contrainte technique du squat.",
    execution: [
      "Assis dans la machine, pieds sur le plateau largeur d'épaules.",
      "Débloque les sécurités, descends le plateau en contrôlant jusqu'à ~90° de flexion.",
      "Pousse dans les talons sans verrouiller brutalement les genoux.",
      "Le bas du dos reste plaqué au dossier en permanence."
    ],
    erreurs: [
      "Décoller le bas du dos en descendant trop bas.",
      "Verrouiller les genoux avec une charge lourde.",
      "Pousser sur la pointe des pieds."
    ],
    videoQuery: "presse à cuisses inclinée technique jambes"
  },
  {
    id: "fentes-marchees",
    nom: "Fentes marchées",
    groupe: "quadriceps",
    materiel: "halteres",
    niveau: "intermediaire",
    type: "poly",
    muscles: "Quadriceps, fessiers, équilibre et gainage",
    description: "Un grand pas, une flexion, et on avance : brûlure garantie et travail unilatéral complet.",
    execution: [
      "Debout, un haltère dans chaque main le long du corps.",
      "Fais un grand pas en avant et fléchis les deux genoux à 90°.",
      "Le genou arrière frôle le sol, le genou avant reste au-dessus de la cheville.",
      "Pousse sur la jambe avant pour enchaîner le pas suivant."
    ],
    erreurs: [
      "Pas trop court (genou qui dépasse loin des orteils).",
      "Buste penché en avant.",
      "Genou avant qui rentre à l'intérieur."
    ],
    videoQuery: "fentes marchées haltères technique jambes"
  },
  {
    id: "leg-extension",
    nom: "Leg extension",
    groupe: "quadriceps",
    materiel: "machine",
    niveau: "debutant",
    type: "iso",
    muscles: "Quadriceps (isolation)",
    description: "L'isolation pure des quadriceps, idéale en fin de séance ou en pré-fatigue.",
    execution: [
      "Assis, chevilles derrière le boudin, dos plaqué au dossier.",
      "Tends les jambes jusqu'à l'extension complète.",
      "Contracte les quadriceps 1 seconde en haut.",
      "Redescends lentement sans laisser tomber la charge."
    ],
    erreurs: [
      "Donner des à-coups avec le bassin.",
      "Descente en chute libre.",
      "Amplitude écourtée en haut."
    ],
    videoQuery: "leg extension machine technique quadriceps"
  },
  {
    id: "squat-gobelet",
    nom: "Squat gobelet (goblet squat)",
    groupe: "quadriceps",
    materiel: "halteres",
    niveau: "debutant",
    type: "poly",
    muscles: "Quadriceps, fessiers, gainage",
    description: "Un haltère contre la poitrine : la meilleure façon d'apprendre le squat avec une technique parfaite.",
    execution: [
      "Tiens un haltère verticalement contre ta poitrine, coudes vers le bas.",
      "Pieds largeur d'épaules, descends en squat en gardant le buste droit.",
      "Les coudes passent entre les genoux en bas.",
      "Remonte en poussant dans les talons."
    ],
    erreurs: [
      "Laisser l'haltère s'éloigner de la poitrine.",
      "Talons qui décollent.",
      "Regarder le sol."
    ],
    videoQuery: "goblet squat gobelet haltère technique"
  },
  {
    id: "squat-poids-du-corps",
    nom: "Squat au poids du corps",
    groupe: "quadriceps",
    materiel: "poids-du-corps",
    niveau: "debutant",
    type: "poly",
    muscles: "Quadriceps, fessiers",
    description: "Le mouvement fondamental, sans matériel. Base de tout entraînement des jambes.",
    execution: [
      "Pieds largeur d'épaules, bras tendus devant pour l'équilibre.",
      "Descends comme pour t'asseoir sur une chaise invisible.",
      "Cuisses au moins parallèles au sol, buste droit.",
      "Remonte en serrant les fessiers."
    ],
    erreurs: [
      "Genoux vers l'intérieur.",
      "Descente trop rapide sans contrôle.",
      "Dos arrondi."
    ],
    videoQuery: "squat poids du corps technique parfaite"
  },

  /* ==================== ISCHIOS / FESSIERS ==================== */
  {
    id: "souleve-terre-roumain",
    nom: "Soulevé de terre roumain",
    groupe: "ischios-fessiers",
    materiel: "barre",
    niveau: "intermediaire",
    type: "poly",
    muscles: "Ischio-jambiers, fessiers, lombaires",
    description: "Jambes presque tendues, la barre glisse le long des cuisses : l'étirement des ischios est incomparable.",
    execution: [
      "Debout, barre en mains devant les cuisses, genoux légèrement fléchis.",
      "Pousse les hanches en arrière en descendant la barre le long des jambes.",
      "Dos plat, descends jusqu'à sentir un fort étirement des ischios.",
      "Remonte en contractant fessiers et ischios, hanches en avant."
    ],
    erreurs: [
      "Arrondir le dos.",
      "Plier les genoux comme un soulevé de terre classique.",
      "Barre qui s'éloigne des jambes."
    ],
    videoQuery: "soulevé de terre roumain technique ischios"
  },
  {
    id: "hip-thrust",
    nom: "Hip thrust",
    groupe: "ischios-fessiers",
    materiel: "barre",
    niveau: "debutant",
    type: "poly",
    muscles: "Fessiers (maximal), ischios",
    description: "L'exercice numéro 1 pour les fessiers : extension de hanche pure, chargée lourd.",
    execution: [
      "Haut du dos calé sur un banc, barre sur les hanches (avec protection).",
      "Pieds au sol largeur de hanches, genoux fléchis.",
      "Pousse les hanches vers le plafond jusqu'à l'alignement épaules-hanches-genoux.",
      "Serre fort les fessiers 1 seconde en haut, redescends en contrôlant."
    ],
    erreurs: [
      "Cambrer les lombaires en haut au lieu de contracter les fessiers.",
      "Pousser avec les quadriceps (pieds trop près).",
      "Amplitude écourtée en haut."
    ],
    videoQuery: "hip thrust barre technique fessiers"
  },
  {
    id: "leg-curl",
    nom: "Leg curl allongé",
    groupe: "ischios-fessiers",
    materiel: "machine",
    niveau: "debutant",
    type: "iso",
    muscles: "Ischio-jambiers (isolation)",
    description: "L'isolation des ischios à la machine : indispensable pour l'équilibre quadriceps/ischios et la prévention des blessures.",
    execution: [
      "Allongé à plat ventre, chevilles sous le boudin.",
      "Ramène les talons vers les fessiers en contractant les ischios.",
      "Marque un temps en haut.",
      "Redescends lentement sans cambrer."
    ],
    erreurs: [
      "Décoller les hanches du banc.",
      "Mouvement balistique.",
      "Retour en chute libre."
    ],
    videoQuery: "leg curl allongé machine technique ischios"
  },
  {
    id: "pont-fessier",
    nom: "Pont fessier (glute bridge)",
    groupe: "ischios-fessiers",
    materiel: "poids-du-corps",
    niveau: "debutant",
    type: "poly",
    muscles: "Fessiers, ischios, gainage",
    description: "La version au sol du hip thrust, parfaite pour débuter ou s'entraîner à la maison.",
    execution: [
      "Allongé sur le dos, genoux fléchis, pieds au sol proches des fessiers.",
      "Pousse les hanches vers le plafond en serrant les fessiers.",
      "Aligne épaules-hanches-genoux en haut.",
      "Redescends lentement sans toucher complètement le sol."
    ],
    erreurs: [
      "Cambrer le bas du dos en haut.",
      "Pousser sur la pointe des pieds.",
      "Rythme trop rapide sans contraction."
    ],
    videoQuery: "pont fessier glute bridge technique"
  },

  /* ==================== MOLLETS ==================== */
  {
    id: "mollets-debout",
    nom: "Extensions mollets debout",
    groupe: "mollets",
    materiel: "machine",
    niveau: "debutant",
    type: "iso",
    muscles: "Gastrocnémiens (jumeaux)",
    description: "Le mouvement de base pour les mollets, à la machine ou avec une marche.",
    execution: [
      "Debout, avant des pieds sur la cale, talons dans le vide.",
      "Descends les talons le plus bas possible pour étirer.",
      "Monte sur la pointe des pieds le plus haut possible.",
      "Marque un temps en haut et en bas."
    ],
    erreurs: [
      "Rebondir sans amplitude.",
      "Plier les genoux pour aider.",
      "Rythme trop rapide."
    ],
    videoQuery: "extensions mollets debout technique"
  },
  {
    id: "mollets-assis",
    nom: "Extensions mollets assis",
    groupe: "mollets",
    materiel: "machine",
    niveau: "debutant",
    type: "iso",
    muscles: "Soléaires",
    description: "Genoux fléchis, c'est le soléaire qui travaille : complète le travail debout pour des mollets complets.",
    execution: [
      "Assis, genoux sous les boudins, avant des pieds sur la cale.",
      "Descends les talons pour un étirement complet.",
      "Monte sur les pointes en contractant fort.",
      "Contrôle chaque phase, pas de rebond."
    ],
    erreurs: [
      "Amplitude réduite.",
      "Charge trop lourde et rebonds.",
      "Séries trop courtes (les mollets aiment le volume)."
    ],
    videoQuery: "extensions mollets assis machine technique"
  },

  /* ==================== ABDOS ==================== */
  {
    id: "planche",
    nom: "Planche (gainage)",
    groupe: "abdos",
    materiel: "poids-du-corps",
    niveau: "debutant",
    type: "iso",
    muscles: "Transverse, grand droit, obliques, lombaires",
    description: "Le gainage fondamental : un tronc solide protège ton dos sur tous les autres exercices.",
    execution: [
      "En appui sur les avant-bras et les pointes de pieds.",
      "Corps parfaitement aligné des talons à la tête.",
      "Serre les abdos et les fessiers, rétroversion légère du bassin.",
      "Respire normalement et tiens la position."
    ],
    erreurs: [
      "Bassin qui tombe (cambrure).",
      "Fesses trop hautes.",
      "Retenir sa respiration."
    ],
    videoQuery: "planche gainage technique parfaite"
  },
  {
    id: "crunch",
    nom: "Crunch au sol",
    groupe: "abdos",
    materiel: "poids-du-corps",
    niveau: "debutant",
    type: "iso",
    muscles: "Grand droit de l'abdomen",
    description: "Le mouvement de flexion de base pour cibler les abdominaux, sans matériel.",
    execution: [
      "Allongé sur le dos, genoux fléchis, mains aux tempes.",
      "Décolle les épaules du sol en enroulant le buste.",
      "Expire en contractant les abdos en haut.",
      "Redescends lentement sans reposer complètement la tête."
    ],
    erreurs: [
      "Tirer sur la nuque avec les mains.",
      "Monter tout le buste (ce n'est pas un sit-up).",
      "Mouvement rapide sans contraction."
    ],
    videoQuery: "crunch abdominaux technique correcte"
  },
  {
    id: "releve-jambes-suspendu",
    nom: "Relevé de jambes suspendu",
    groupe: "abdos",
    materiel: "poids-du-corps",
    niveau: "avance",
    type: "poly",
    muscles: "Grand droit (portion basse), fléchisseurs de hanches, grip",
    description: "Suspendu à la barre, tu montes les jambes : l'un des exercices d'abdos les plus complets et exigeants.",
    execution: [
      "Suspends-toi à une barre de traction, corps gainé.",
      "Monte les jambes tendues (ou genoux fléchis pour la version facile) jusqu'à l'horizontale ou plus.",
      "Enroule le bassin en fin de montée.",
      "Redescends lentement sans te balancer."
    ],
    erreurs: [
      "Se balancer et utiliser l'élan.",
      "Monter uniquement avec les hanches sans enrouler le bassin.",
      "Descente incontrôlée."
    ],
    videoQuery: "relevé de jambes suspendu technique abdos"
  },
  {
    id: "russian-twist",
    nom: "Russian twist",
    groupe: "abdos",
    materiel: "poids-du-corps",
    niveau: "intermediaire",
    type: "iso",
    muscles: "Obliques, grand droit",
    description: "Rotation du buste assis en équilibre : cible les obliques pour une taille dessinée.",
    execution: [
      "Assis, buste incliné en arrière à ~45°, pieds décollés ou posés.",
      "Mains jointes (ou avec un poids), tourne le buste d'un côté puis de l'autre.",
      "La rotation vient du tronc, pas des bras.",
      "Garde le dos droit pendant tout l'exercice."
    ],
    erreurs: [
      "Arrondir le dos.",
      "Bouger seulement les bras sans tourner les épaules.",
      "Aller trop vite."
    ],
    videoQuery: "russian twist technique obliques"
  },
  {
    id: "roulette-abdos",
    nom: "Roulette à abdos (ab wheel)",
    groupe: "abdos",
    materiel: "poids-du-corps",
    niveau: "avance",
    type: "poly",
    muscles: "Grand droit, transverse, dorsaux, épaules",
    description: "La roulette : un gainage dynamique extrêmement intense pour un tronc en acier.",
    execution: [
      "À genoux, mains sur la roulette sous les épaules.",
      "Roule vers l'avant en gardant les abdos serrés et le bassin rétroversé.",
      "Va aussi loin que possible sans cambrer.",
      "Reviens en tirant avec les abdos et les dorsaux."
    ],
    erreurs: [
      "Cambrer le bas du dos (danger).",
      "Casser aux hanches au retour.",
      "Aller trop loin trop tôt."
    ],
    videoQuery: "ab wheel roulette abdos technique"
  },

  /* ==================== LOMBAIRES ==================== */
  {
    id: "extension-lombaire-banc",
    nom: "Extension lombaire au banc à 45°",
    groupe: "lombaires",
    materiel: "machine",
    niveau: "debutant",
    type: "iso",
    muscles: "Lombaires, fessiers, ischios",
    description: "Renforce le bas du dos en sécurité : la meilleure assurance anti-blessure pour les exercices lourds.",
    execution: [
      "Cuisses calées sur le banc à 45°, chevilles bloquées.",
      "Descends le buste en gardant le dos neutre.",
      "Remonte jusqu'à l'alignement du corps, sans hyper-extension.",
      "Croise les bras sur la poitrine ou tiens un disque pour durcir."
    ],
    erreurs: [
      "Monter trop haut en hyper-extension.",
      "Mouvement rapide et saccadé.",
      "Arrondir complètement le dos en bas."
    ],
    videoQuery: "extension lombaire banc 45 degrés technique"
  },
  {
    id: "superman",
    nom: "Superman au sol",
    groupe: "lombaires",
    materiel: "poids-du-corps",
    niveau: "debutant",
    type: "iso",
    muscles: "Lombaires, fessiers, trapèzes inférieurs",
    description: "Allongé au sol, tu décolles bras et jambes : le renfort lombaire accessible partout.",
    execution: [
      "Allongé à plat ventre, bras tendus devant toi.",
      "Décolle simultanément bras, poitrine et jambes du sol.",
      "Tiens 2 secondes en haut en contractant le bas du dos.",
      "Redescends lentement."
    ],
    erreurs: [
      "Mouvement de balancier rapide.",
      "Hyper-extension cervicale (regarder loin devant).",
      "Retenir sa respiration."
    ],
    videoQuery: "superman exercice lombaires technique"
  },

  /* ==================== POIDS DU CORPS COMPLÉMENTS ==================== */
  {
    id: "rowing-inverse",
    nom: "Rowing inversé (tirage horizontal au poids du corps)",
    groupe: "dos",
    materiel: "poids-du-corps",
    niveau: "debutant",
    type: "poly",
    muscles: "Dos, biceps, arrière d'épaules",
    description: "Sous une barre basse ou une table solide, tu tires ta poitrine vers la barre : le rowing sans matériel de musculation.",
    execution: [
      "Allonge-toi sous une barre fixée à hauteur de hanches.",
      "Saisis la barre, corps gainé et aligné, talons au sol.",
      "Tire la poitrine vers la barre en serrant les omoplates.",
      "Redescends lentement bras tendus."
    ],
    erreurs: [
      "Bassin qui tombe.",
      "Amplitude partielle.",
      "Coup de reins pour monter."
    ],
    videoQuery: "rowing inversé australian pull up technique"
  },
  {
    id: "pompes-pike",
    nom: "Pompes piquées (pike push-up)",
    groupe: "epaules",
    materiel: "poids-du-corps",
    niveau: "intermediaire",
    type: "poly",
    muscles: "Deltoïdes, triceps, haut des pectoraux",
    description: "En V inversé, les pompes deviennent un développé épaules au poids du corps.",
    execution: [
      "Position pompe puis recule les pieds et monte les fesses en V inversé.",
      "Fléchis les coudes pour amener le sommet du crâne vers le sol.",
      "Repousse le sol jusqu'à l'extension des bras.",
      "Garde les jambes tendues et les abdos serrés."
    ],
    erreurs: [
      "Casser le V et revenir en pompe classique.",
      "Amplitude trop courte.",
      "Coudes qui partent complètement sur les côtés."
    ],
    videoQuery: "pike push up pompes piquées technique épaules"
  },
  {
    id: "fentes-bulgares",
    nom: "Fentes bulgares",
    groupe: "quadriceps",
    materiel: "halteres",
    niveau: "intermediaire",
    type: "poly",
    muscles: "Quadriceps, fessiers, équilibre",
    description: "Pied arrière surélevé sur un banc : l'exercice unilatéral jambes le plus efficace (et le plus redouté).",
    execution: [
      "Pied arrière posé sur un banc derrière toi, pied avant bien ancré.",
      "Descends verticalement en fléchissant la jambe avant.",
      "Le genou arrière descend vers le sol, buste droit ou légèrement penché.",
      "Remonte en poussant dans le talon avant."
    ],
    erreurs: [
      "Pied avant trop proche du banc.",
      "Pousser avec la jambe arrière.",
      "Genou avant qui rentre à l'intérieur."
    ],
    videoQuery: "fentes bulgares technique quadriceps fessiers"
  },
  {
    id: "burpees",
    nom: "Burpees",
    groupe: "abdos",
    materiel: "poids-du-corps",
    niveau: "intermediaire",
    type: "poly",
    muscles: "Corps entier + cardio",
    description: "L'exercice cardio-musculation par excellence : parfait pour la sèche et le conditionnement.",
    execution: [
      "Debout, descends en squat et pose les mains au sol.",
      "Jette les pieds en arrière en position de pompe, fais une pompe.",
      "Ramène les pieds sous toi d'un saut.",
      "Saute verticalement bras au ciel et enchaîne."
    ],
    erreurs: [
      "Dos qui s'effondre lors du passage en planche.",
      "Sauter la pompe (version facile assumée seulement).",
      "Rythme irrégulier."
    ],
    videoQuery: "burpees technique correcte exécution"
  },
  {
    id: "mountain-climbers",
    nom: "Mountain climbers",
    groupe: "abdos",
    materiel: "poids-du-corps",
    niveau: "debutant",
    type: "poly",
    muscles: "Abdos, fléchisseurs de hanches, épaules + cardio",
    description: "En planche, tu ramènes les genoux en courant sur place : gainage dynamique et cardio.",
    execution: [
      "Position de pompe bras tendus, corps aligné.",
      "Ramène un genou vers la poitrine puis alterne rapidement.",
      "Le bassin reste stable et bas.",
      "Garde les épaules au-dessus des poignets."
    ],
    erreurs: [
      "Fesses qui montent.",
      "Rebondir sur les pointes sans amplitude.",
      "Épaules qui reculent derrière les mains."
    ],
    videoQuery: "mountain climbers technique gainage"
  },
  {
    id: "shrugs-halteres",
    nom: "Shrugs (haussements d'épaules)",
    groupe: "dos",
    materiel: "halteres",
    niveau: "debutant",
    type: "iso",
    muscles: "Trapèzes supérieurs",
    description: "Haussements d'épaules chargés pour des trapèzes imposants.",
    execution: [
      "Debout, un haltère lourd dans chaque main le long du corps.",
      "Hausse les épaules le plus haut possible, vers les oreilles.",
      "Tiens la contraction 1 seconde en haut.",
      "Redescends lentement en laissant les bras détendus."
    ],
    erreurs: [
      "Rouler les épaules (inutile et risqué).",
      "Plier les bras pour monter la charge.",
      "Amplitude minuscule avec charge d'ego."
    ],
    videoQuery: "shrugs haltères trapèzes technique"
  }
];

/* Libellés d'affichage */
const LABELS = {
  groupes: {
    "pectoraux": "Pectoraux",
    "dos": "Dos",
    "epaules": "Épaules",
    "biceps": "Biceps",
    "triceps": "Triceps",
    "quadriceps": "Quadriceps",
    "ischios-fessiers": "Ischios / Fessiers",
    "mollets": "Mollets",
    "abdos": "Abdominaux",
    "lombaires": "Lombaires"
  },
  materiel: {
    "barre": "Barre",
    "halteres": "Haltères",
    "machine": "Machine",
    "poulie": "Poulie",
    "poids-du-corps": "Poids du corps"
  },
  niveaux: {
    "debutant": "Débutant",
    "intermediaire": "Intermédiaire",
    "avance": "Avancé"
  }
};

const GROUP_ICONS = {
  "pectoraux": "🫁", "dos": "🦅", "epaules": "🪨", "biceps": "💪",
  "triceps": "🔱", "quadriceps": "🦵", "ischios-fessiers": "🍑",
  "mollets": "🐐", "abdos": "🧱", "lombaires": "🛡️"
};
