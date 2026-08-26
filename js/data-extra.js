/* =========================================================
   GymCoach — Extension de la base d'exercices
   Chargé après data.js : complète EXERCISES avec les
   variantes classiques de salle pour tous les groupes.
   ========================================================= */

const EXERCISES_EXTRA = [

  /* ==================== PECTORAUX ==================== */
  {
    id: "developpe-decline-barre",
    nom: "Développé décliné à la barre",
    groupe: "pectoraux", materiel: "barre", niveau: "intermediaire", type: "poly",
    muscles: "Bas des pectoraux, triceps",
    description: "Sur banc décliné, l'accent se porte sur le bas des pectoraux avec une trajectoire plus courte qui permet de charger lourd.",
    execution: [
      "Allongé sur banc décliné, chevilles calées, saisis la barre prise légèrement plus large que les épaules.",
      "Descends la barre vers le bas des pectoraux en contrôlant.",
      "Repousse à la verticale en expirant."
    ],
    erreurs: ["Rebondir la barre sur la poitrine.", "Descendre vers le cou.", "Amplitude écourtée."],
    videoQuery: "développé décliné barre technique pectoraux"
  },
  {
    id: "ecarte-halteres",
    nom: "Écarté couché aux haltères",
    groupe: "pectoraux", materiel: "halteres", niveau: "debutant", type: "iso",
    muscles: "Pectoraux (étirement maximal)",
    description: "Bras ouverts en croix sur banc plat : l'exercice d'étirement de référence pour les pectoraux.",
    execution: [
      "Allongé sur banc plat, haltères au-dessus de la poitrine, coudes légèrement fléchis.",
      "Ouvre les bras en arc de cercle jusqu'à sentir l'étirement des pectoraux.",
      "Referme en contractant, comme pour enlacer un tronc d'arbre."
    ],
    erreurs: ["Plier les coudes pendant la descente.", "Descendre trop bas (épaules).", "Charger trop lourd."],
    videoQuery: "écarté couché haltères technique pectoraux"
  },
  {
    id: "ecarte-incline-halteres",
    nom: "Écarté incliné aux haltères",
    groupe: "pectoraux", materiel: "halteres", niveau: "intermediaire", type: "iso",
    muscles: "Haut des pectoraux",
    description: "La version inclinée de l'écarté pour isoler et étirer le haut des pectoraux.",
    execution: [
      "Banc incliné à 30°, haltères au-dessus de la poitrine, coudes légèrement fléchis.",
      "Ouvre en arc de cercle en gardant l'angle des coudes fixe.",
      "Reviens en serrant les pectoraux en haut."
    ],
    erreurs: ["Transformer en développé.", "Descente incontrôlée.", "Banc trop incliné."],
    videoQuery: "écarté incliné haltères technique haut des pectoraux"
  },
  {
    id: "pec-deck",
    nom: "Pec-deck (butterfly)",
    groupe: "pectoraux", materiel: "machine", niveau: "debutant", type: "iso",
    muscles: "Pectoraux (isolation guidée)",
    description: "La machine à écartés : isolation des pectoraux en toute sécurité, idéale pour apprendre à les sentir.",
    execution: [
      "Assis, dos plaqué, avant-bras ou mains sur les supports à hauteur de poitrine.",
      "Rapproche les bras devant toi en contractant les pectoraux.",
      "Tiens 1 seconde puis rouvre lentement sans relâcher."
    ],
    erreurs: ["Décoller le dos du dossier.", "Amplitude arrière excessive.", "Mouvement saccadé."],
    videoQuery: "pec deck butterfly machine technique"
  },
  {
    id: "developpe-machine-convergente",
    nom: "Développé assis à la machine convergente",
    groupe: "pectoraux", materiel: "machine", niveau: "debutant", type: "poly",
    muscles: "Pectoraux, triceps, deltoïdes antérieurs",
    description: "Le développé guidé : parfait pour débuter ou finir les pectoraux en sécurité sans pareur.",
    execution: [
      "Règle le siège pour que les poignées soient à hauteur de poitrine.",
      "Pousse les poignées vers l'avant jusqu'à l'extension presque complète.",
      "Reviens lentement sans laisser les charges se reposer."
    ],
    erreurs: ["Siège mal réglé (poignées trop hautes).", "Coudes qui partent trop en arrière.", "À-coups."],
    videoQuery: "développé machine convergente pectoraux technique"
  },
  {
    id: "pompes-declinees",
    nom: "Pompes déclinées (pieds surélevés)",
    groupe: "pectoraux", materiel: "poids-du-corps", niveau: "intermediaire", type: "poly",
    muscles: "Haut des pectoraux, épaules, triceps",
    description: "Pieds sur un banc, les pompes ciblent davantage le haut des pectoraux et les épaules.",
    execution: [
      "Pieds sur un banc, mains au sol un peu plus larges que les épaules.",
      "Corps gainé, descends la poitrine vers le sol.",
      "Repousse en expirant sans casser la ligne du corps."
    ],
    erreurs: ["Bassin qui tombe.", "Tête qui plonge.", "Amplitude partielle."],
    videoQuery: "pompes déclinées pieds surélevés technique"
  },
  {
    id: "pull-over",
    nom: "Pull-over haltère",
    groupe: "pectoraux", materiel: "halteres", niveau: "intermediaire", type: "iso",
    muscles: "Pectoraux, grand dorsal, dentelés",
    description: "Un haltère derrière la tête, allongé en travers d'un banc : ouverture de cage et étirement complet.",
    execution: [
      "Allongé en travers ou le long d'un banc, un haltère tenu à deux mains au-dessus de la poitrine.",
      "Descends l'haltère derrière la tête, bras légèrement fléchis, en inspirant profondément.",
      "Ramène au-dessus de la poitrine en contractant."
    ],
    erreurs: ["Casser les coudes.", "Cambrer excessivement.", "Descendre trop bas trop vite."],
    videoQuery: "pull over haltère technique pectoraux dorsaux"
  },
  {
    id: "ecarte-poulie-basse",
    nom: "Écarté à la poulie basse",
    groupe: "pectoraux", materiel: "poulie", niveau: "intermediaire", type: "iso",
    muscles: "Haut des pectoraux",
    description: "Les poulies partent d'en bas et remontent : tension continue orientée haut des pectoraux.",
    execution: [
      "Au centre des poulies basses, saisis les poignées, un pied devant.",
      "Remonte les bras devant toi en arc de cercle jusqu'à hauteur du visage.",
      "Serre les pectoraux puis redescends lentement."
    ],
    erreurs: ["Plier les coudes.", "Élan du buste.", "Épaules qui montent."],
    videoQuery: "écarté poulie basse haut pectoraux technique"
  },

  /* ==================== DOS ==================== */
  {
    id: "tractions-supination",
    nom: "Tractions supination (chin-up)",
    groupe: "dos", materiel: "poids-du-corps", niveau: "intermediaire", type: "poly",
    muscles: "Grand dorsal, biceps (fortement), avant-bras",
    description: "Paumes vers soi : la traction la plus accessible, avec un gros travail des biceps en plus du dos.",
    execution: [
      "Suspends-toi paumes vers toi, mains largeur d'épaules.",
      "Tire jusqu'à amener le menton au-dessus de la barre, coudes vers le bas.",
      "Redescends de façon contrôlée jusqu'à l'extension quasi complète."
    ],
    erreurs: ["Balancement.", "Demi-amplitude.", "Épaules haussées."],
    videoQuery: "tractions supination chin up technique"
  },
  {
    id: "tirage-horizontal-poulie",
    nom: "Tirage horizontal à la poulie basse",
    groupe: "dos", materiel: "poulie", niveau: "debutant", type: "poly",
    muscles: "Milieu du dos, grand dorsal, rhomboïdes, biceps",
    description: "Assis face à la poulie basse : le rowing guidé de référence pour l'épaisseur du dos.",
    execution: [
      "Assis, pieds calés, buste droit, saisis la poignée bras tendus.",
      "Tire la poignée vers le nombril en serrant les omoplates.",
      "Reviens lentement en laissant le dos s'étirer sans arrondir les lombaires."
    ],
    erreurs: ["Balancier du buste.", "Épaules enroulées vers l'avant.", "Tirer avec les bras seulement."],
    videoQuery: "tirage horizontal poulie basse technique dos"
  },
  {
    id: "rowing-machine-assis",
    nom: "Rowing machine assis (poitrine appuyée)",
    groupe: "dos", materiel: "machine", niveau: "debutant", type: "poly",
    muscles: "Milieu du dos, rhomboïdes, trapèzes moyens",
    description: "La poitrine calée contre le support supprime toute triche : isolation propre du milieu du dos.",
    execution: [
      "Assis, poitrine contre le support, saisis les poignées.",
      "Tire les coudes en arrière en serrant fort les omoplates.",
      "Reviens lentement bras tendus sans décoller la poitrine."
    ],
    erreurs: ["Décoller la poitrine pour tricher.", "Amplitude courte.", "Tirer trop haut."],
    videoQuery: "rowing machine assis chest supported technique"
  },
  {
    id: "tirage-bras-tendus",
    nom: "Tirage bras tendus à la poulie haute",
    groupe: "dos", materiel: "poulie", niveau: "intermediaire", type: "iso",
    muscles: "Grand dorsal (isolation pure)",
    description: "Bras quasi tendus, tu abaisses la barre vers les cuisses : le seul exercice qui isole vraiment le grand dorsal sans les biceps.",
    execution: [
      "Debout face à la poulie haute, barre saisie bras tendus, buste légèrement penché.",
      "Abaisse la barre vers les cuisses en gardant les bras quasi tendus.",
      "Contracte les dorsaux en bas puis remonte lentement."
    ],
    erreurs: ["Plier les coudes (ça devient un tirage).", "Buste qui se balance.", "Épaules enroulées."],
    videoQuery: "tirage bras tendus poulie grand dorsal technique"
  },
  {
    id: "tirage-vertical-prise-serree",
    nom: "Tirage vertical prise serrée (triangle)",
    groupe: "dos", materiel: "poulie", niveau: "debutant", type: "poly",
    muscles: "Grand dorsal (fibres basses), biceps",
    description: "Avec la poignée triangle, le tirage se fait coudes serrés : gros étirement du dorsal et travail en épaisseur.",
    execution: [
      "Assis cuisses calées, poignée triangle saisie bras tendus.",
      "Bombe le torse et tire la poignée vers le haut des abdominaux.",
      "Reviens lentement en laissant les dorsaux s'étirer."
    ],
    erreurs: ["Se coucher en arrière.", "Tirer vers le cou.", "Dos arrondi en haut."],
    videoQuery: "tirage vertical prise serrée triangle technique"
  },
  {
    id: "shrugs-barre",
    nom: "Shrugs à la barre",
    groupe: "dos", materiel: "barre", niveau: "debutant", type: "iso",
    muscles: "Trapèzes supérieurs",
    description: "La version barre des haussements d'épaules : permet de charger très lourd pour des trapèzes massifs.",
    execution: [
      "Debout, barre en mains devant les cuisses, bras tendus.",
      "Hausse les épaules verticalement le plus haut possible.",
      "Tiens 1 seconde puis redescends lentement."
    ],
    erreurs: ["Rouler les épaules.", "Plier les coudes.", "Amplitude minuscule."],
    videoQuery: "shrugs barre trapèzes technique"
  },
  {
    id: "rowing-pendlay",
    nom: "Rowing Pendlay",
    groupe: "dos", materiel: "barre", niveau: "avance", type: "poly",
    muscles: "Dos complet, explosivité, lombaires",
    description: "Chaque répétition part du sol, buste à l'horizontale : rowing explosif prisé en force athlétique.",
    execution: [
      "Buste parallèle au sol, barre au sol sous les épaules, dos plat.",
      "Tire explosivement la barre vers le bas de la poitrine.",
      "Repose la barre au sol entre chaque répétition et refixe ta position."
    ],
    erreurs: ["Se redresser pendant le tirage.", "Dos arrondi.", "Tirer sans reposer (ce n'est plus un Pendlay)."],
    videoQuery: "rowing pendlay technique dos"
  },
  {
    id: "rack-pull",
    nom: "Rack pull (soulevé partiel)",
    groupe: "dos", materiel: "barre", niveau: "intermediaire", type: "poly",
    muscles: "Trapèzes, lombaires, fessiers, grip",
    description: "Soulevé de terre partiel depuis un rack à hauteur des genoux : surcharge le haut du mouvement et les trapèzes.",
    execution: [
      "Barre posée sur les sécurités du rack au niveau des genoux.",
      "Dos plat, saisis la barre et redresse-toi en verrouillant les hanches.",
      "Serre les trapèzes en haut puis repose en contrôlant."
    ],
    erreurs: ["Arrondir le dos.", "Hyper-extension exagérée en haut.", "Tirer avec les bras."],
    videoQuery: "rack pull technique soulevé partiel"
  },
  {
    id: "tractions-lestees",
    nom: "Tractions lestées",
    groupe: "dos", materiel: "poids-du-corps", niveau: "avance", type: "poly",
    muscles: "Grand dorsal, biceps, gainage",
    description: "Une ceinture de lest ou un haltère entre les jambes : la progression naturelle quand les tractions deviennent faciles.",
    execution: [
      "Fixe le lest à une ceinture, saisis la barre en pronation.",
      "Tire jusqu'au menton au-dessus de la barre, sans balancement.",
      "Descends lentement en contrôlant le surplus de charge."
    ],
    erreurs: ["Lest trop lourd et amplitude sacrifiée.", "Balancement.", "Descente en chute libre."],
    videoQuery: "tractions lestées technique progression"
  },

  /* ==================== ÉPAULES ==================== */
  {
    id: "developpe-arnold",
    nom: "Développé Arnold",
    groupe: "epaules", materiel: "halteres", niveau: "intermediaire", type: "poly",
    muscles: "Deltoïdes (3 faisceaux), triceps",
    description: "Le développé avec rotation inventé par Schwarzenegger : recrute les trois faisceaux du deltoïde sur une seule répétition.",
    execution: [
      "Assis, haltères devant les épaules, paumes vers toi.",
      "Pousse vers le haut en tournant les paumes vers l'avant pendant la montée.",
      "Redescends en inversant la rotation."
    ],
    erreurs: ["Rotation trop brutale.", "Cambrure lombaire.", "Charge trop lourde pour contrôler la rotation."],
    videoQuery: "développé arnold press technique épaules"
  },
  {
    id: "elevations-frontales",
    nom: "Élévations frontales",
    groupe: "epaules", materiel: "halteres", niveau: "debutant", type: "iso",
    muscles: "Deltoïdes antérieurs",
    description: "Montée des bras devant soi pour isoler l'avant de l'épaule. À doser si tu fais déjà beaucoup de développés.",
    execution: [
      "Debout, haltères devant les cuisses, paumes vers toi ou neutres.",
      "Monte un bras (ou les deux) devant toi jusqu'à l'horizontale.",
      "Redescends lentement sans élan."
    ],
    erreurs: ["Balancer le buste.", "Monter au-dessus des yeux.", "Rythme précipité."],
    videoQuery: "élévations frontales haltères technique"
  },
  {
    id: "elevations-laterales-poulie",
    nom: "Élévations latérales à la poulie",
    groupe: "epaules", materiel: "poulie", niveau: "intermediaire", type: "iso",
    muscles: "Deltoïdes moyens (tension continue)",
    description: "La poulie garde la tension même en bas du mouvement : la meilleure variante pour la largeur d'épaules.",
    execution: [
      "Debout côté poulie basse, saisis la poignée main opposée.",
      "Monte le bras sur le côté jusqu'à l'horizontale, coude souple.",
      "Redescends lentement en résistant au câble."
    ],
    erreurs: ["S'éloigner de la poulie pour tricher.", "Épaule haussée.", "Buste penché."],
    videoQuery: "élévations latérales poulie technique deltoïde"
  },
  {
    id: "rowing-menton",
    nom: "Rowing menton prise large",
    groupe: "epaules", materiel: "barre", niveau: "intermediaire", type: "poly",
    muscles: "Deltoïdes moyens, trapèzes",
    description: "Tirage vertical de la barre le long du corps. En prise large, il cible les épaules en préservant les poignets.",
    execution: [
      "Debout, barre en pronation prise plus large que les épaules.",
      "Tire la barre le long du corps jusqu'au bas de la poitrine, coudes vers l'extérieur.",
      "Redescends lentement."
    ],
    erreurs: ["Prise trop serrée (poignets/épaules).", "Tirer jusqu'au menton avec des charges lourdes.", "Élan des jambes."],
    videoQuery: "rowing menton prise large technique épaules"
  },
  {
    id: "developpe-epaules-machine",
    nom: "Développé épaules à la machine",
    groupe: "epaules", materiel: "machine", niveau: "debutant", type: "poly",
    muscles: "Deltoïdes, triceps",
    description: "Le développé vertical guidé : idéal pour débuter ou pour finir les épaules sans souci d'équilibre.",
    execution: [
      "Règle le siège pour que les poignées soient à hauteur d'oreilles.",
      "Pousse vers le haut sans verrouiller brutalement les coudes.",
      "Redescends lentement jusqu'aux oreilles."
    ],
    erreurs: ["Siège trop bas.", "Descente trop courte.", "Cambrure excessive."],
    videoQuery: "développé épaules machine technique"
  },
  {
    id: "pec-deck-inverse",
    nom: "Pec-deck inversé (reverse fly)",
    groupe: "epaules", materiel: "machine", niveau: "debutant", type: "iso",
    muscles: "Deltoïdes postérieurs, rhomboïdes",
    description: "Face à la machine, tu ouvres les bras en arrière : l'oiseau version guidée, imparable pour l'arrière d'épaule.",
    execution: [
      "Assis face au dossier, poignées saisies devant toi à hauteur d'épaules.",
      "Ouvre les bras en arrière en serrant les omoplates.",
      "Reviens lentement sans laisser les charges claquer."
    ],
    erreurs: ["Plier les coudes.", "Reculer le buste.", "Amplitude courte."],
    videoQuery: "pec deck inversé reverse fly technique"
  },
  {
    id: "handstand-pushup",
    nom: "Pompes en équilibre (handstand push-up)",
    groupe: "epaules", materiel: "poids-du-corps", niveau: "avance", type: "poly",
    muscles: "Deltoïdes, triceps, trapèzes, gainage",
    description: "Contre un mur, la pompe verticale : le développé militaire au poids du corps, réservé aux pratiquants confirmés.",
    execution: [
      "Monte en équilibre contre un mur, mains largeur d'épaules.",
      "Fléchis les coudes pour descendre la tête vers le sol en contrôlant.",
      "Repousse jusqu'à l'extension complète des bras."
    ],
    erreurs: ["Cambrure excessive.", "Descente incontrôlée sur la tête.", "Coudes complètement écartés."],
    videoQuery: "handstand push up technique progression"
  },

  /* ==================== BICEPS ==================== */
  {
    id: "curl-halteres-alterne",
    nom: "Curl haltères alterné avec supination",
    groupe: "biceps", materiel: "halteres", niveau: "debutant", type: "iso",
    muscles: "Biceps, brachial",
    description: "Le curl classique un bras après l'autre, avec rotation du poignet pour une contraction maximale du biceps.",
    execution: [
      "Debout, haltères le long du corps, paumes vers les cuisses.",
      "Monte un haltère en tournant la paume vers le ciel pendant la montée.",
      "Redescends lentement puis alterne."
    ],
    erreurs: ["Balancer le buste.", "Coude qui avance.", "Supination inexistante."],
    videoQuery: "curl haltères alterné supination technique"
  },
  {
    id: "curl-concentration",
    nom: "Curl concentration",
    groupe: "biceps", materiel: "halteres", niveau: "debutant", type: "iso",
    muscles: "Biceps (pic de contraction)",
    description: "Assis, coude calé contre la cuisse : impossible de tricher, contraction maximale du biceps.",
    execution: [
      "Assis, penché en avant, l'arrière du coude calé contre l'intérieur de la cuisse.",
      "Monte l'haltère vers l'épaule en contractant fort.",
      "Descends très lentement jusqu'à l'extension complète."
    ],
    erreurs: ["Décoller le coude de la cuisse.", "Élan de l'épaule.", "Amplitude réduite."],
    videoQuery: "curl concentration biceps technique"
  },
  {
    id: "curl-poulie-basse",
    nom: "Curl à la poulie basse",
    groupe: "biceps", materiel: "poulie", niveau: "debutant", type: "iso",
    muscles: "Biceps (tension continue)",
    description: "Le câble maintient la tension du début à la fin : parfait pour la congestion en fin de séance.",
    execution: [
      "Face à la poulie basse, barre ou corde en mains, coudes collés au buste.",
      "Monte la charge vers les épaules en contractant les biceps.",
      "Redescends lentement sans tendre brutalement."
    ],
    erreurs: ["Reculer le buste.", "Coudes qui avancent.", "Relâcher en bas."],
    videoQuery: "curl poulie basse biceps technique"
  },
  {
    id: "curl-spider",
    nom: "Curl spider (banc incliné à plat ventre)",
    groupe: "biceps", materiel: "halteres", niveau: "intermediaire", type: "iso",
    muscles: "Biceps (courte portion)",
    description: "À plat ventre sur banc incliné, bras pendants à la verticale : strictement aucune triche possible.",
    execution: [
      "Allongé poitrine contre un banc incliné, bras pendants à la verticale.",
      "Monte les haltères en contractant les biceps, coudes fixes.",
      "Descends lentement jusqu'à l'extension complète."
    ],
    erreurs: ["Balancer les épaules.", "Coudes qui reculent.", "Rythme trop rapide."],
    videoQuery: "spider curl banc incliné technique biceps"
  },
  {
    id: "curl-inverse",
    nom: "Curl inversé (pronation)",
    groupe: "biceps", materiel: "barre", niveau: "intermediaire", type: "iso",
    muscles: "Brachial, long supinateur, avant-bras",
    description: "Paumes vers le bas : moins de charge mais un travail unique du brachial et des avant-bras pour des bras épais.",
    execution: [
      "Debout, barre saisie en pronation (paumes vers le bas), mains largeur d'épaules.",
      "Monte la barre vers les épaules en gardant les poignets verrouillés.",
      "Redescends lentement."
    ],
    erreurs: ["Poignets qui cassent.", "Charge d'ego.", "Coudes qui s'écartent."],
    videoQuery: "curl inversé pronation avant-bras technique"
  },
  {
    id: "curl-machine",
    nom: "Curl à la machine",
    groupe: "biceps", materiel: "machine", niveau: "debutant", type: "iso",
    muscles: "Biceps (isolation guidée)",
    description: "Bras calés sur le pupitre de la machine : la façon la plus simple d'isoler les biceps en sécurité.",
    execution: [
      "Règle le siège, arrière des bras posés sur le support.",
      "Monte les poignées en contractant les biceps.",
      "Redescends lentement sans tendre brutalement les coudes."
    ],
    erreurs: ["Se soulever du siège.", "Extension brutale.", "Amplitude courte en haut."],
    videoQuery: "curl machine biceps technique"
  },

  /* ==================== TRICEPS ==================== */
  {
    id: "developpe-couche-prise-serree",
    nom: "Développé couché prise serrée",
    groupe: "triceps", materiel: "barre", niveau: "intermediaire", type: "poly",
    muscles: "Triceps, pectoraux internes, deltoïdes antérieurs",
    description: "Le développé couché mains rapprochées : l'exercice de base pour la masse et la force des triceps.",
    execution: [
      "Allongé sur banc plat, saisis la barre mains écartées largeur d'épaules.",
      "Descends la barre vers le bas des pectoraux, coudes proches du corps.",
      "Repousse en tendant complètement les bras."
    ],
    erreurs: ["Prise trop serrée (poignets).", "Coudes complètement écartés.", "Rebond sur la poitrine."],
    videoQuery: "développé couché prise serrée triceps technique"
  },
  {
    id: "extension-un-bras-poulie",
    nom: "Extension triceps un bras à la poulie",
    groupe: "triceps", materiel: "poulie", niveau: "intermediaire", type: "iso",
    muscles: "Triceps (chef latéral)",
    description: "Un bras à la fois pour corriger les déséquilibres et obtenir une contraction parfaite.",
    execution: [
      "Face à la poulie haute, saisis la poignée d'une main, coude collé au flanc.",
      "Tends le bras vers le bas en contractant le triceps.",
      "Remonte lentement sans bouger le coude."
    ],
    erreurs: ["Coude qui décolle.", "Rotation du buste.", "Amplitude écourtée."],
    videoQuery: "extension triceps un bras poulie technique"
  },
  {
    id: "kickback-triceps",
    nom: "Kickback triceps",
    groupe: "triceps", materiel: "halteres", niveau: "debutant", type: "iso",
    muscles: "Triceps (contraction maximale)",
    description: "Buste penché, tu tends le bras en arrière : la contraction en fin de mouvement est incomparable.",
    execution: [
      "Buste penché, dos plat, bras collé au flanc, coude fléchi à 90°.",
      "Tends l'avant-bras en arrière jusqu'à l'alignement complet.",
      "Tiens 1 seconde puis reviens sans bouger le coude."
    ],
    erreurs: ["Coude qui tombe.", "Élan de l'épaule.", "Charge trop lourde."],
    videoQuery: "kickback triceps haltère technique"
  },
  {
    id: "pompes-diamant",
    nom: "Pompes diamant",
    groupe: "triceps", materiel: "poids-du-corps", niveau: "intermediaire", type: "poly",
    muscles: "Triceps, pectoraux internes",
    description: "Mains jointes en losange sous la poitrine : la pompe la plus efficace pour les triceps.",
    execution: [
      "Position de pompe, pouces et index joints formant un losange sous la poitrine.",
      "Descends la poitrine vers les mains, coudes le long du corps.",
      "Repousse jusqu'à l'extension complète."
    ],
    erreurs: ["Coudes qui s'écartent.", "Bassin qui tombe.", "Amplitude partielle."],
    videoQuery: "pompes diamant triceps technique"
  },
  {
    id: "dips-machine",
    nom: "Dips à la machine assistée",
    groupe: "triceps", materiel: "machine", niveau: "debutant", type: "poly",
    muscles: "Triceps, pectoraux, deltoïdes antérieurs",
    description: "La machine à dips (assistée ou chargée) : le mouvement des dips accessible à tous les niveaux.",
    execution: [
      "Assis ou à genoux selon la machine, saisis les poignées coudes fléchis.",
      "Pousse vers le bas jusqu'à l'extension complète des bras.",
      "Reviens lentement à 90° de flexion."
    ],
    erreurs: ["Épaules haussées.", "Amplitude excessive en haut.", "Buste qui s'affaisse."],
    videoQuery: "dips machine technique triceps"
  },
  {
    id: "extension-corde-nuque-poulie",
    nom: "Extension nuque à la corde (poulie basse)",
    groupe: "triceps", materiel: "poulie", niveau: "intermediaire", type: "iso",
    muscles: "Triceps (longue portion étirée)",
    description: "Dos à la poulie, corde derrière la nuque : la longue portion travaille en étirement avec tension continue.",
    execution: [
      "Dos à la poulie basse, corde saisie derrière la nuque, coudes vers le ciel.",
      "Tends les bras vers l'avant-haut en écartant la corde en fin de mouvement.",
      "Reviens lentement en gardant les coudes fixes."
    ],
    erreurs: ["Coudes qui s'écartent.", "Buste qui plonge.", "Amplitude courte."],
    videoQuery: "extension triceps nuque corde poulie technique"
  },

  /* ==================== QUADRICEPS ==================== */
  {
    id: "front-squat",
    nom: "Front squat (squat avant)",
    groupe: "quadriceps", materiel: "barre", niveau: "avance", type: "poly",
    muscles: "Quadriceps (dominant), fessiers, gainage",
    description: "Barre sur l'avant des épaules : le buste reste vertical et les quadriceps encaissent tout le travail.",
    execution: [
      "Barre posée sur l'avant des épaules, coudes hauts, prise clean ou bras croisés.",
      "Descends en squat en gardant le buste le plus vertical possible.",
      "Remonte en poussant dans le sol, coudes toujours hauts."
    ],
    erreurs: ["Coudes qui tombent (barre qui roule).", "Talons qui décollent.", "Dos qui s'arrondit."],
    videoQuery: "front squat technique squat avant"
  },
  {
    id: "hack-squat",
    nom: "Hack squat (machine)",
    groupe: "quadriceps", materiel: "machine", niveau: "intermediaire", type: "poly",
    muscles: "Quadriceps, fessiers",
    description: "Le squat guidé incliné : charge lourde sur les quadriceps sans contrainte d'équilibre.",
    execution: [
      "Dos et épaules calés dans la machine, pieds largeur d'épaules sur le plateau.",
      "Débloque les sécurités et descends jusqu'à 90° ou plus bas selon ta mobilité.",
      "Remonte en poussant dans l'ensemble du pied sans verrouiller brutalement."
    ],
    erreurs: ["Décoller les talons.", "Genoux qui rentrent.", "Amplitude minuscule chargée lourd."],
    videoQuery: "hack squat machine technique quadriceps"
  },
  {
    id: "squat-sumo",
    nom: "Squat sumo",
    groupe: "quadriceps", materiel: "barre", niveau: "intermediaire", type: "poly",
    muscles: "Quadriceps, adducteurs, fessiers",
    description: "Pieds très écartés, pointes ouvertes : la variante qui recrute adducteurs et fessiers en plus des cuisses.",
    execution: [
      "Barre sur les trapèzes, pieds bien plus larges que les épaules, pointes à 45°.",
      "Descends en poussant les genoux vers l'extérieur, buste droit.",
      "Remonte en serrant fessiers et adducteurs."
    ],
    erreurs: ["Genoux qui rentrent.", "Buste qui plonge.", "Pointes de pieds pas alignées avec les genoux."],
    videoQuery: "squat sumo technique adducteurs fessiers"
  },
  {
    id: "step-ups",
    nom: "Step-ups (montées sur banc)",
    groupe: "quadriceps", materiel: "halteres", niveau: "debutant", type: "poly",
    muscles: "Quadriceps, fessiers, équilibre",
    description: "Monter sur un banc une jambe à la fois : simple, fonctionnel et redoutablement efficace.",
    execution: [
      "Face à un banc solide, haltères en mains le long du corps.",
      "Pose un pied entier sur le banc et monte en poussant uniquement sur cette jambe.",
      "Redescends en contrôlant puis alterne."
    ],
    erreurs: ["S'élancer avec la jambe au sol.", "Banc trop haut.", "Genou qui rentre."],
    videoQuery: "step ups banc haltères technique"
  },
  {
    id: "presse-unilaterale",
    nom: "Presse à cuisses unilatérale",
    groupe: "quadriceps", materiel: "machine", niveau: "intermediaire", type: "poly",
    muscles: "Quadriceps, fessiers (une jambe)",
    description: "Une jambe à la fois à la presse : corrige les déséquilibres et intensifie le travail de chaque cuisse.",
    execution: [
      "Assis à la presse, un seul pied au centre du plateau.",
      "Descends en contrôlant jusqu'à 90° de flexion.",
      "Pousse dans le talon sans verrouiller le genou."
    ],
    erreurs: ["Bassin qui pivote.", "Descendre trop bas.", "Pousser sur la pointe."],
    videoQuery: "presse à cuisses unilatérale technique"
  },
  {
    id: "sissy-squat",
    nom: "Sissy squat",
    groupe: "quadriceps", materiel: "poids-du-corps", niveau: "avance", type: "iso",
    muscles: "Quadriceps (droit fémoral, étirement extrême)",
    description: "Genoux qui avancent, buste qui recule : l'isolation la plus intense du quadriceps, à progresser prudemment.",
    execution: [
      "Debout, talons surélevés ou tenus, une main sur un support.",
      "Laisse les genoux avancer en inclinant le buste en arrière, corps aligné des genoux à la tête.",
      "Descends aussi bas que contrôlable puis remonte avec les quadriceps."
    ],
    erreurs: ["Casser aux hanches.", "Descendre trop bas trop tôt.", "Genoux douloureux ignorés."],
    videoQuery: "sissy squat technique quadriceps"
  },
  {
    id: "wall-sit",
    nom: "Chaise contre le mur (wall sit)",
    groupe: "quadriceps", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Quadriceps (isométrie)",
    description: "Assis contre un mur sans chaise : le brûleur de cuisses statique, parfait en fin de séance ou en circuit.",
    execution: [
      "Dos plaqué contre un mur, descends jusqu'à avoir les cuisses parallèles au sol.",
      "Genoux à 90°, au-dessus des chevilles, mains libres ou sur les cuisses.",
      "Tiens la position en respirant normalement."
    ],
    erreurs: ["Cuisses pas parallèles.", "Mains en appui sur les genoux.", "Retenir sa respiration."],
    videoQuery: "wall sit chaise contre mur technique"
  },
  {
    id: "squat-jump",
    nom: "Squat sauté (jump squat)",
    groupe: "quadriceps", materiel: "poids-du-corps", niveau: "intermediaire", type: "poly",
    muscles: "Quadriceps, fessiers, mollets, explosivité",
    description: "Le squat version pliométrique : explosivité, cardio et jambes toniques. Idéal pour la sèche et le conditionnement.",
    execution: [
      "Descends en squat au poids du corps.",
      "Explose vers le haut en sautant le plus haut possible.",
      "Amortis la réception en douceur et enchaîne."
    ],
    erreurs: ["Réception jambes tendues.", "Genoux qui rentrent à la réception.", "Dos arrondi."],
    videoQuery: "jump squat squat sauté technique"
  },

  /* ==================== ISCHIOS / FESSIERS ==================== */
  {
    id: "leg-curl-assis",
    nom: "Leg curl assis",
    groupe: "ischios-fessiers", materiel: "machine", niveau: "debutant", type: "iso",
    muscles: "Ischio-jambiers (position assise)",
    description: "La flexion de jambe assis : hanches fléchies, les ischios travaillent sur une plus grande amplitude qu'allongé.",
    execution: [
      "Assis, cuisses bloquées, chevilles sur le boudin jambes tendues.",
      "Fléchis les genoux en ramenant les talons sous le siège.",
      "Tiens la contraction puis reviens lentement."
    ],
    erreurs: ["Se soulever du siège.", "Retour en chute libre.", "Amplitude partielle."],
    videoQuery: "leg curl assis machine technique ischios"
  },
  {
    id: "good-morning",
    nom: "Good morning",
    groupe: "ischios-fessiers", materiel: "barre", niveau: "avance", type: "poly",
    muscles: "Ischios, lombaires, fessiers",
    description: "Barre sur le dos, tu salues : un hinge exigeant qui blinde toute la chaîne postérieure. Technique irréprochable obligatoire.",
    execution: [
      "Barre sur les trapèzes, pieds largeur de hanches, genoux légèrement fléchis.",
      "Pousse les hanches en arrière en penchant le buste, dos parfaitement plat.",
      "Descends jusqu'à l'étirement des ischios puis remonte avec les hanches."
    ],
    erreurs: ["Dos qui s'arrondit (danger).", "Charge trop lourde.", "Plier les genoux comme un squat."],
    videoQuery: "good morning barre technique ischios lombaires"
  },
  {
    id: "souleve-terre-jambes-tendues",
    nom: "Soulevé de terre jambes tendues",
    groupe: "ischios-fessiers", materiel: "halteres", niveau: "intermediaire", type: "poly",
    muscles: "Ischios (étirement maximal), fessiers, lombaires",
    description: "Jambes quasi tendues et amplitude complète : l'étirement des ischios le plus profond, aux haltères ou à la barre.",
    execution: [
      "Debout, haltères devant les cuisses, jambes presque tendues.",
      "Descends les haltères le long des jambes en poussant les hanches en arrière, dos plat.",
      "Remonte en contractant ischios et fessiers."
    ],
    erreurs: ["Arrondir le dos.", "Charges éloignées des jambes.", "Forcer l'amplitude au-delà de ta souplesse."],
    videoQuery: "soulevé de terre jambes tendues technique"
  },
  {
    id: "souleve-terre-sumo",
    nom: "Soulevé de terre sumo",
    groupe: "ischios-fessiers", materiel: "barre", niveau: "intermediaire", type: "poly",
    muscles: "Fessiers, adducteurs, ischios, quadriceps",
    description: "Pieds très écartés, mains à l'intérieur : un soulevé plus vertical, gros recrutement des fessiers et adducteurs.",
    execution: [
      "Pieds très écartés pointes ouvertes, saisis la barre mains à l'intérieur des genoux.",
      "Dos plat, poitrine haute, pousse le sol en écartant les genoux.",
      "Verrouille les hanches en haut puis redescends en contrôlant."
    ],
    erreurs: ["Genoux qui rentrent.", "Hanches qui montent avant les épaules.", "Barre loin du corps."],
    videoQuery: "soulevé de terre sumo technique"
  },
  {
    id: "kettlebell-swing",
    nom: "Kettlebell swing",
    groupe: "ischios-fessiers", materiel: "halteres", niveau: "intermediaire", type: "poly",
    muscles: "Fessiers, ischios, lombaires, cardio",
    description: "Le balancier de hanches explosif : puissance de la chaîne postérieure et cardio en un seul mouvement.",
    execution: [
      "Kettlebell (ou haltère) tenu à deux mains, pieds largeur d'épaules.",
      "Envoie la charge entre les jambes en poussant les hanches en arrière, dos plat.",
      "Claque l'extension de hanches pour projeter la charge à hauteur de poitrine."
    ],
    erreurs: ["Squatter au lieu de faire un hinge.", "Tirer avec les bras.", "Dos arrondi."],
    videoQuery: "kettlebell swing technique russe"
  },
  {
    id: "abduction-machine",
    nom: "Abduction à la machine",
    groupe: "ischios-fessiers", materiel: "machine", niveau: "debutant", type: "iso",
    muscles: "Moyens fessiers",
    description: "Écarter les cuisses contre résistance : cible le moyen fessier, essentiel pour le galbe et la stabilité du bassin.",
    execution: [
      "Assis dans la machine, cuisses contre les supports.",
      "Écarte les jambes le plus loin possible en contractant les fessiers.",
      "Tiens 1 seconde puis reviens lentement."
    ],
    erreurs: ["Utiliser l'élan.", "Amplitude courte.", "Buste qui bascule."],
    videoQuery: "abduction machine fessiers technique"
  },
  {
    id: "kickback-fessier-poulie",
    nom: "Kickback fessier à la poulie",
    groupe: "ischios-fessiers", materiel: "poulie", niveau: "debutant", type: "iso",
    muscles: "Grands fessiers (isolation)",
    description: "Extension de hanche à la poulie basse, une jambe à la fois : isolation directe du grand fessier.",
    execution: [
      "Face à la poulie basse, sangle à la cheville, mains sur le support.",
      "Tends la jambe en arrière en contractant le fessier, buste stable.",
      "Tiens 1 seconde puis reviens lentement."
    ],
    erreurs: ["Cambrer les lombaires.", "Élan de la jambe.", "Buste qui se redresse à chaque rep."],
    videoQuery: "kickback fessier poulie technique"
  },
  {
    id: "nordic-curl",
    nom: "Nordic curl",
    groupe: "ischios-fessiers", materiel: "poids-du-corps", niveau: "avance", type: "iso",
    muscles: "Ischio-jambiers (excentrique)",
    description: "Chevilles bloquées, tu retiens ta chute avec les ischios : l'exercice excentrique de référence, aussi utilisé en prévention des blessures.",
    execution: [
      "À genoux, chevilles bloquées par un partenaire ou un support.",
      "Laisse-toi descendre vers l'avant le plus lentement possible, corps aligné.",
      "Amortis avec les mains puis repousse-toi pour revenir."
    ],
    erreurs: ["Casser aux hanches.", "Chute non contrôlée.", "Trop de volume dès le début (courbatures sévères)."],
    videoQuery: "nordic curl technique ischios excentrique"
  },
  {
    id: "fentes-arriere",
    nom: "Fentes arrière",
    groupe: "ischios-fessiers", materiel: "halteres", niveau: "debutant", type: "poly",
    muscles: "Fessiers, ischios, quadriceps",
    description: "Le pas en arrière sollicite davantage fessiers et ischios que la fente avant, avec moins de stress sur les genoux.",
    execution: [
      "Debout, haltères le long du corps.",
      "Fais un grand pas en arrière et fléchis les deux genoux à 90°.",
      "Pousse dans le talon avant pour revenir debout puis alterne."
    ],
    erreurs: ["Pas trop court.", "Buste qui plonge.", "Genou avant qui dépasse loin des orteils."],
    videoQuery: "fentes arrière haltères technique fessiers"
  },

  /* ==================== MOLLETS ==================== */
  {
    id: "mollets-presse",
    nom: "Extensions mollets à la presse",
    groupe: "mollets", materiel: "machine", niveau: "debutant", type: "iso",
    muscles: "Gastrocnémiens, soléaires",
    description: "Pointes de pieds en bas du plateau de la presse : permet de charger lourd les mollets en sécurité.",
    execution: [
      "Assis à la presse, avant des pieds en bas du plateau, jambes tendues.",
      "Laisse le plateau descendre en étirant les mollets.",
      "Pousse sur les pointes le plus haut possible."
    ],
    erreurs: ["Plier les genoux.", "Rebonds sans étirement.", "Amplitude réduite."],
    videoQuery: "extensions mollets presse à cuisses technique"
  },
  {
    id: "mollets-unijambiste",
    nom: "Extensions mollets sur une jambe",
    groupe: "mollets", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Gastrocnémiens (unilatéral)",
    description: "Sur une marche, une jambe à la fois : intensité maximale sans aucun matériel et correction des déséquilibres.",
    execution: [
      "Avant du pied sur une marche, l'autre jambe croisée derrière, une main en appui.",
      "Descends le talon le plus bas possible.",
      "Monte sur la pointe au maximum, marque un temps en haut."
    ],
    erreurs: ["S'aider de la main d'appui.", "Rebondir.", "Séries trop courtes."],
    videoQuery: "extensions mollets une jambe technique"
  },

  /* ==================== ABDOS ==================== */
  {
    id: "gainage-lateral",
    nom: "Gainage latéral (side plank)",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Obliques, transverse, moyen fessier",
    description: "La planche sur le côté : indispensable pour les obliques et la stabilité latérale du tronc.",
    execution: [
      "Sur le côté, en appui sur l'avant-bras, coude sous l'épaule.",
      "Décolle le bassin pour aligner le corps des pieds à la tête.",
      "Tiens la position sans laisser la hanche tomber, puis change de côté."
    ],
    erreurs: ["Hanche qui s'affaisse.", "Bassin qui part en avant ou en arrière.", "Respiration bloquée."],
    videoQuery: "gainage latéral side plank technique"
  },
  {
    id: "crunch-poulie",
    nom: "Crunch à la poulie haute (à genoux)",
    groupe: "abdos", materiel: "poulie", niveau: "intermediaire", type: "iso",
    muscles: "Grand droit (avec charge progressive)",
    description: "Le crunch lesté à la corde : le seul exercice d'abdos où la surcharge progressive est vraiment simple.",
    execution: [
      "À genoux face à la poulie haute, corde tenue de chaque côté de la tête.",
      "Enroule le buste vers le bas en contractant les abdos, coudes vers les genoux.",
      "Remonte lentement sans bouger les hanches."
    ],
    erreurs: ["Tirer avec les bras.", "Plier aux hanches au lieu d'enrouler.", "Amplitude courte."],
    videoQuery: "crunch poulie haute corde abdos technique"
  },
  {
    id: "hollow-hold",
    nom: "Hollow hold",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "intermediaire", type: "iso",
    muscles: "Grand droit, transverse (gainage dynamique)",
    description: "La position creuse des gymnastes : bas du dos plaqué, bras et jambes tendus. Un gainage redoutable.",
    execution: [
      "Allongé sur le dos, plaque les lombaires au sol en contractant les abdos.",
      "Décolle épaules et jambes tendues, bras tendus derrière la tête.",
      "Tiens la position, lombaires toujours collées au sol."
    ],
    erreurs: ["Lombaires qui décollent (raccourcis la position).", "Menton collé à la poitrine.", "Respiration bloquée."],
    videoQuery: "hollow hold technique gainage gymnastique"
  },
  {
    id: "releve-jambes-sol",
    nom: "Relevé de jambes au sol",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Grand droit (portion basse), fléchisseurs de hanches",
    description: "La version au sol du relevé de jambes : accessible à tous pour cibler le bas des abdominaux.",
    execution: [
      "Allongé sur le dos, mains sous les fessiers, jambes tendues.",
      "Monte les jambes à la verticale en gardant les lombaires au sol.",
      "Redescends lentement sans toucher le sol."
    ],
    erreurs: ["Cambrer en bas.", "Élan des jambes.", "Descendre trop bas pour ton niveau."],
    videoQuery: "relevé de jambes au sol abdos technique"
  },
  {
    id: "v-ups",
    nom: "V-ups",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "intermediaire", type: "poly",
    muscles: "Grand droit complet, fléchisseurs de hanches",
    description: "Buste et jambes se rejoignent en V : le crunch complet qui travaille haut et bas des abdos simultanément.",
    execution: [
      "Allongé bras tendus derrière la tête, jambes tendues.",
      "Monte simultanément buste et jambes pour toucher tes pieds en formant un V.",
      "Redescends en contrôlant sans reposer complètement."
    ],
    erreurs: ["Dos qui claque au sol.", "Jambes très fléchies.", "Élan des bras."],
    videoQuery: "v-ups technique abdominaux"
  },
  {
    id: "pallof-press",
    nom: "Pallof press",
    groupe: "abdos", materiel: "poulie", niveau: "intermediaire", type: "iso",
    muscles: "Obliques, transverse (anti-rotation)",
    description: "Tu résistes à la rotation imposée par le câble : le meilleur exercice de gainage anti-rotation pour un tronc solide.",
    execution: [
      "De profil par rapport à la poulie réglée à hauteur de poitrine, poignée tenue à deux mains.",
      "Tends les bras devant toi sans laisser le câble te faire pivoter.",
      "Tiens 2-3 secondes bras tendus puis reviens, change de côté ensuite."
    ],
    erreurs: ["Se laisser tourner.", "Épaules haussées.", "Trop de charge et compensation du bassin."],
    videoQuery: "pallof press technique anti rotation gainage"
  },
  {
    id: "dead-bug",
    nom: "Dead bug",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Transverse, coordination, protection lombaire",
    description: "Bras et jambe opposés qui s'éloignent, lombaires plaquées : le gainage le plus sûr pour apprendre à stabiliser son tronc.",
    execution: [
      "Sur le dos, bras vers le plafond, hanches et genoux à 90°.",
      "Descends lentement un bras derrière la tête et la jambe opposée vers le sol.",
      "Reviens et alterne, lombaires collées au sol en permanence."
    ],
    erreurs: ["Lombaires qui décollent.", "Mouvement rapide.", "Respiration bloquée."],
    videoQuery: "dead bug exercice technique gainage"
  },
  {
    id: "dragon-flag",
    nom: "Dragon flag",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "avance", type: "poly",
    muscles: "Grand droit, gainage complet du tronc",
    description: "Le corps entier se lève et descend comme un drapeau, popularisé par Bruce Lee. Réservé aux tronc déjà très solides.",
    execution: [
      "Allongé sur un banc, mains agrippées derrière la tête.",
      "Monte le corps entier à la verticale en appui sur les épaules.",
      "Descends le corps aligné le plus lentement possible sans casser aux hanches."
    ],
    erreurs: ["Casser aux hanches.", "Descendre en chute libre.", "Cambrer les lombaires."],
    videoQuery: "dragon flag technique progression abdos"
  },
  {
    id: "sit-ups",
    nom: "Sit-ups",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Grand droit, fléchisseurs de hanches",
    description: "Le redressement assis complet : un classique du conditionnement, à exécuter sans tirer sur la nuque.",
    execution: [
      "Allongé, genoux fléchis, pieds au sol, mains aux tempes ou croisées sur la poitrine.",
      "Enroule le buste jusqu'à la position assise en expirant.",
      "Redescends vertèbre par vertèbre en contrôlant."
    ],
    erreurs: ["Tirer sur la nuque.", "Buste qui retombe d'un bloc.", "Pieds bloqués qui font tout le travail des hanches."],
    videoQuery: "sit ups technique correcte abdominaux"
  },

  /* ==================== LOMBAIRES ==================== */
  {
    id: "bird-dog",
    nom: "Bird-dog",
    groupe: "lombaires", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Lombaires, transverse, fessiers, coordination",
    description: "À quatre pattes, bras et jambe opposés tendus : le renfort lombaire doux recommandé par les kinés.",
    execution: [
      "À quatre pattes, mains sous les épaules, genoux sous les hanches.",
      "Tends simultanément un bras devant et la jambe opposée derrière, dos neutre.",
      "Tiens 2-3 secondes puis alterne sans balancer le bassin."
    ],
    erreurs: ["Cambrer en levant la jambe.", "Bassin qui pivote.", "Mouvement précipité."],
    videoQuery: "bird dog exercice technique lombaires"
  },
  {
    id: "hyperextension-inversee",
    nom: "Hyperextension inversée",
    groupe: "lombaires", materiel: "machine", niveau: "intermediaire", type: "iso",
    muscles: "Lombaires, fessiers, ischios",
    description: "Buste fixe sur le banc, ce sont les jambes qui montent : renforce le bas du dos avec très peu de compression vertébrale.",
    execution: [
      "Allongé à plat ventre sur un banc haut, hanches au bord, jambes pendantes.",
      "Monte les jambes tendues jusqu'à l'alignement avec le buste.",
      "Tiens 1 seconde puis redescends lentement."
    ],
    erreurs: ["Monter au-dessus de l'horizontale.", "Élan des jambes.", "Rythme saccadé."],
    videoQuery: "reverse hyperextension inversée technique lombaires"
  }
];

/* Élévation latérale égyptienne : demandée explicitement */
EXERCISES_EXTRA.push({
  id: "elevation-laterale-egyptienne",
  nom: "Élévation latérale égyptienne",
  groupe: "epaules", materiel: "halteres", niveau: "intermediaire", type: "iso",
  muscles: "Deltoïde moyen (étirement accru, triche impossible)",
  description: "Penché sur le côté, une main en appui sur un support : l'élévation latérale unilatérale avec un étirement de départ plus profond et zéro élan possible.",
  execution: [
    "Tiens-toi à un montant, incline le corps sur le côté, bras libre avec l'haltère pendu vers le sol.",
    "Monte le bras tendu (coude souple) jusqu'à l'horizontale.",
    "Redescends lentement en résistant, sans balancer le buste."
  ],
  erreurs: ["Élan du buste.", "Monter au-dessus de l'horizontale.", "Coude complètement verrouillé."],
  videoQuery: "élévation latérale égyptienne egyptian lateral raise technique"
});

EXERCISES.push(...EXERCISES_EXTRA);

/* =========================================================
   La hanche sous toutes les coutures : hip thrust et
   variantes, abduction/adduction (machines, poulie, sol),
   kickbacks, pull-through, unilatéral. Complète la famille
   fessiers/adducteurs/fléchisseurs de hanche.
   ========================================================= */
const EXERCISES_HIP = [

  {
    id: "hip-thrust-machine",
    nom: "Hip thrust à la machine",
    groupe: "ischios-fessiers", materiel: "machine", niveau: "debutant", type: "poly",
    muscles: "Fessiers (maximal), ischios",
    description: "La version guidée du hip thrust : installation rapide, dos calé, charge stable. Idéale pour progresser lourd sans gérer une barre.",
    execution: [
      "Règle le dossier pour que l'appui tombe sous les omoplates, coussin sur les hanches.",
      "Pieds à plat largeur de hanches, tibias verticaux en haut du mouvement.",
      "Pousse les hanches vers le plafond jusqu'à l'alignement épaules-hanches-genoux.",
      "Serre les fessiers 1 seconde en haut, redescends en contrôlant sans reposer la charge."
    ],
    erreurs: ["Hyper-extension du bas du dos en haut.", "Pousser sur les pointes de pieds.", "Amplitude écourtée en haut."],
    videoQuery: "hip thrust machine technique fessiers"
  },
  {
    id: "hip-thrust-unilateral",
    nom: "Hip thrust unilatéral",
    groupe: "ischios-fessiers", materiel: "halteres", niveau: "intermediaire", type: "poly",
    muscles: "Fessier (une jambe), ischios, stabilisateurs de hanche",
    description: "Le hip thrust sur une jambe : corrige les asymétries et intensifie le travail du fessier sans charge lourde.",
    execution: [
      "Haut du dos calé sur un banc, un haltère posé sur la hanche de la jambe de travail.",
      "L'autre jambe tendue ou genou vers la poitrine.",
      "Pousse la hanche vers le plafond avec le talon au sol, bassin bien horizontal.",
      "Marque 1 seconde en haut puis redescends lentement."
    ],
    erreurs: ["Bassin qui tourne d'un côté.", "Pousser avec le mollet plutôt que le fessier.", "Aller trop vite."],
    videoQuery: "single leg hip thrust technique"
  },
  {
    id: "frog-pumps",
    nom: "Frog pumps",
    groupe: "ischios-fessiers", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Fessiers (grand fessier), rotateurs externes de hanche",
    description: "Pont fessier plantes de pieds jointes, genoux ouverts : la rotation externe de hanche cible directement le grand fessier. Parfait en fin de séance ou en activation.",
    execution: [
      "Allongé au sol, plantes de pieds l'une contre l'autre, genoux ouverts vers l'extérieur.",
      "Menton rentré, bas du dos plaqué au sol.",
      "Pousse les hanches vers le plafond en serrant fort les fessiers.",
      "Enchaîne des répétitions rythmées sans reposer complètement le bassin."
    ],
    erreurs: ["Cambrer le bas du dos.", "Fermer les genoux pendant la montée.", "Amplitude trop courte."],
    videoQuery: "frog pumps technique fessiers"
  },
  {
    id: "pull-through-poulie",
    nom: "Pull-through à la poulie",
    groupe: "ischios-fessiers", materiel: "poulie", niveau: "debutant", type: "poly",
    muscles: "Fessiers, ischios, lombaires (gainage)",
    description: "Une extension de hanche à la corde, dos à la poulie basse : le geste du soulevé de terre avec une tension continue et sans stress lombaire. Excellent pour apprendre le hinge.",
    execution: [
      "Dos à la poulie basse, corde saisie entre les jambes, quelques pas en avant.",
      "Pieds largeur d'épaules, genoux souples.",
      "Pousse les hanches vers l'arrière en gardant le dos plat, la corde passe entre les cuisses.",
      "Reviens debout en contractant les fessiers, sans tirer avec les bras."
    ],
    erreurs: ["Tirer avec les bras ou le dos.", "Fléchir les genoux comme un squat.", "S'arrêter avant l'extension complète de hanche."],
    videoQuery: "cable pull through technique fessiers"
  },
  {
    id: "souleve-terre-unijambiste",
    nom: "Soulevé de terre unijambiste",
    groupe: "ischios-fessiers", materiel: "halteres", niveau: "intermediaire", type: "poly",
    muscles: "Ischios, fessier, stabilisateurs de hanche et de cheville",
    description: "Le hinge sur une jambe : étirement profond des ischios, équilibre et symétrie droite/gauche. Un haltère suffit.",
    execution: [
      "Debout sur une jambe, haltère dans la main opposée (ou les deux mains).",
      "Penche le buste vers l'avant en poussant la hanche vers l'arrière, jambe libre tendue derrière.",
      "Descends jusqu'à sentir l'étirement de l'ischio, dos plat, hanches horizontales.",
      "Reviens debout en serrant le fessier de la jambe d'appui."
    ],
    erreurs: ["Ouvrir la hanche de la jambe libre vers le plafond.", "Arrondir le dos.", "Verrouiller le genou d'appui."],
    videoQuery: "soulevé de terre unijambiste single leg RDL technique"
  },
  {
    id: "adduction-machine",
    nom: "Adduction à la machine",
    groupe: "ischios-fessiers", materiel: "machine", niveau: "debutant", type: "iso",
    muscles: "Adducteurs (intérieur des cuisses)",
    description: "Le pendant de l'abduction : on serre les jambes contre la résistance pour renforcer l'intérieur des cuisses, stabilisateur clé du squat et des fentes.",
    execution: [
      "Assis, jambes écartées contre les coussins, dos collé au dossier.",
      "Serre les jambes l'une vers l'autre en expirant, sans à-coups.",
      "Marque un temps jambes serrées.",
      "Rouvre lentement en retenant la charge, sans claquer les plaques."
    ],
    erreurs: ["Amplitude de départ excessive (étirement forcé).", "Mouvement balistique.", "Décoller le bassin du siège."],
    videoQuery: "adduction machine technique adducteurs"
  },
  {
    id: "abduction-hanche-poulie",
    nom: "Abduction de hanche à la poulie",
    groupe: "ischios-fessiers", materiel: "poulie", niveau: "debutant", type: "iso",
    muscles: "Moyen fessier, tenseur du fascia lata",
    description: "Debout, une sangle à la cheville : la jambe s'écarte contre la résistance. Cible le moyen fessier, celui qui dessine le galbe latéral et stabilise le bassin.",
    execution: [
      "Sangle à la cheville extérieure, côté opposé à la poulie basse, main sur le montant.",
      "Buste droit, jambe de travail tendue, pointe de pied vers l'avant.",
      "Écarte la jambe sur le côté sans pencher le buste.",
      "Reviens lentement sans reposer la tension."
    ],
    erreurs: ["Pencher le buste pour monter plus haut.", "Ouvrir la pointe de pied vers le plafond.", "Élan du bassin."],
    videoQuery: "abduction hanche poulie cable hip abduction technique"
  },
  {
    id: "adduction-hanche-poulie",
    nom: "Adduction de hanche à la poulie",
    groupe: "ischios-fessiers", materiel: "poulie", niveau: "intermediaire", type: "iso",
    muscles: "Adducteurs (intérieur des cuisses)",
    description: "La jambe intérieure croise devant l'autre contre la résistance : un travail d'adducteurs en amplitude complète, débout et fonctionnel.",
    execution: [
      "Sangle à la cheville intérieure, côté poulie basse, main sur le montant.",
      "Laisse la jambe de travail s'écarter vers la poulie (étirement contrôlé).",
      "Ramène la jambe vers l'intérieur en croisant légèrement devant la jambe d'appui.",
      "Reviens lentement en retenant la charge."
    ],
    erreurs: ["Buste qui penche pour compenser.", "Charge trop lourde (élan).", "Amplitude écourtée au retour."],
    videoQuery: "adduction hanche poulie cable hip adduction technique"
  },
  {
    id: "kickback-fessier-machine",
    nom: "Kickback fessier à la machine",
    groupe: "ischios-fessiers", materiel: "machine", niveau: "debutant", type: "iso",
    muscles: "Grand fessier, ischios",
    description: "L'extension de hanche guidée, debout : on pousse la plateforme vers l'arrière avec le talon. Isolation du fessier avec une charge facile à régler.",
    execution: [
      "Buste appuyé sur les coussins, mains sur les poignées, un pied sur la plateforme.",
      "Pousse la plateforme vers l'arrière avec le talon jusqu'à l'extension complète de hanche.",
      "Serre le fessier 1 seconde en fin de mouvement.",
      "Reviens lentement sans reposer complètement la charge."
    ],
    erreurs: ["Cambrer le bas du dos en fin de poussée.", "Pousser avec la pointe de pied.", "Amplitude incomplète."],
    videoQuery: "glute kickback machine technique fessiers"
  },
  {
    id: "donkey-kicks",
    nom: "Donkey kicks",
    groupe: "ischios-fessiers", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Grand fessier",
    description: "À quatre pattes, le talon monte vers le plafond genou fléchi : la ruade. Simple, sans matériel, redoutable en séries longues ou avec lest à la cheville.",
    execution: [
      "À quatre pattes, mains sous les épaules, genoux sous les hanches, dos neutre.",
      "Genou fléchi à 90°, monte le talon vers le plafond en serrant le fessier.",
      "Arrête-toi quand la cuisse est dans l'alignement du dos.",
      "Redescends sans poser le genou et enchaîne."
    ],
    erreurs: ["Cambrer le dos pour monter plus haut.", "Ouvrir la hanche sur le côté.", "Balancer le bassin."],
    videoQuery: "donkey kicks technique fessiers"
  },
  {
    id: "fire-hydrant",
    nom: "Fire hydrant",
    groupe: "ischios-fessiers", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Moyen fessier, rotateurs externes de hanche",
    description: "À quatre pattes, le genou s'ouvre sur le côté : l'abduction en quadrupédie. Complément parfait des donkey kicks pour cibler le moyen fessier.",
    execution: [
      "À quatre pattes, mains sous les épaules, genoux sous les hanches.",
      "Genou fléchi à 90°, ouvre la jambe sur le côté sans bouger le buste.",
      "Monte jusqu'à la hauteur de hanche maximum, sans basculer le bassin.",
      "Redescends lentement sans reposer le genou."
    ],
    erreurs: ["Basculer tout le buste sur le côté.", "Aller trop vite.", "Cambrer le bas du dos."],
    videoQuery: "fire hydrant exercice fessiers technique"
  },
  {
    id: "clamshell",
    nom: "Clamshell",
    groupe: "ischios-fessiers", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Moyen fessier, rotateurs externes de hanche",
    description: "Allongé sur le côté, genoux fléchis, le genou du dessus s'ouvre comme un coquillage. L'exercice d'activation et de santé de hanche par excellence, encore mieux avec un élastique.",
    execution: [
      "Allongé sur le côté, hanches fléchies à 45°, genoux à 90°, pieds joints.",
      "Garde les pieds en contact et ouvre le genou du dessus vers le plafond.",
      "Le bassin reste empilé, sans rouler vers l'arrière.",
      "Referme lentement. Ajoute un élastique au-dessus des genoux pour durcir."
    ],
    erreurs: ["Rouler le bassin vers l'arrière.", "Amplitude forcée.", "Aller trop vite pour sentir le fessier."],
    videoQuery: "clamshell exercice moyen fessier technique"
  },
  {
    id: "marche-laterale-elastique",
    nom: "Marche latérale avec élastique",
    groupe: "ischios-fessiers", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Moyen fessier, stabilisateurs du bassin",
    description: "Élastique au-dessus des genoux ou aux chevilles, on marche en crabe en gardant la tension : activation des fessiers avant squat/fentes, ou finisher qui brûle.",
    execution: [
      "Élastique au-dessus des genoux (facile) ou aux chevilles (dur), pieds largeur de hanches.",
      "Demi-squat léger, buste droit, tension constante dans l'élastique.",
      "Fais des pas latéraux contrôlés d'un côté, puis reviens de l'autre.",
      "Ne laisse jamais les genoux rentrer vers l'intérieur."
    ],
    erreurs: ["Pieds qui se rejoignent (perte de tension).", "Se redresser complètement entre les pas.", "Genoux qui rentrent."],
    videoQuery: "marche latérale élastique lateral band walk technique"
  },
  {
    id: "fente-croisee",
    nom: "Fente croisée (curtsy lunge)",
    groupe: "ischios-fessiers", materiel: "halteres", niveau: "intermediaire", type: "poly",
    muscles: "Moyen et grand fessier, quadriceps, adducteurs",
    description: "La jambe arrière croise derrière la jambe d'appui, comme une révérence : l'angle inhabituel charge le moyen fessier plus qu'une fente classique.",
    execution: [
      "Debout, haltères en mains le long du corps.",
      "Recule une jambe en diagonale derrière l'autre, comme une révérence.",
      "Descends jusqu'à ce que le genou arrière frôle le sol, buste droit.",
      "Repousse sur le talon avant pour revenir debout, puis alterne."
    ],
    erreurs: ["Genou avant qui s'effondre vers l'intérieur.", "Buste qui tourne avec la jambe.", "Pas trop court."],
    videoQuery: "curtsy lunge fente croisée technique fessiers"
  },
  {
    id: "flexion-hanche-poulie",
    nom: "Flexion de hanche à la poulie",
    groupe: "quadriceps", materiel: "poulie", niveau: "intermediaire", type: "iso",
    muscles: "Fléchisseurs de hanche (psoas), quadriceps",
    description: "Sangle à la cheville, on monte le genou contre la résistance : le psoas est le grand oublié de la salle, pourtant décisif pour le sprint, les abdos et la santé de hanche.",
    execution: [
      "Dos à la poulie basse, sangle à la cheville, main sur un support.",
      "Buste droit et gainé, monte le genou vers la poitrine contre la résistance.",
      "Dépasse l'horizontale de la cuisse si possible.",
      "Redescends lentement sans reposer la tension entre les répétitions."
    ],
    erreurs: ["Se pencher en arrière pour monter le genou.", "Élan du bassin.", "Amplitude écourtée sous l'horizontale."],
    videoQuery: "flexion de hanche poulie hip flexion psoas technique"
  },
  {
    id: "extension-hanche-banc",
    nom: "Extension de hanche au banc (frog reverse hyper)",
    groupe: "ischios-fessiers", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Grand fessier, ischios, lombaires (léger)",
    description: "Allongé à plat ventre sur un banc, buste tenu, les jambes montent derrière par la seule force des fessiers. Une reverse hyper accessible sans machine dédiée.",
    execution: [
      "À plat ventre sur un banc, crêtes de hanche au bord, mains agrippées sous le banc.",
      "Jambes fléchies genoux ouverts (version frog) ou tendues serrées.",
      "Monte les talons vers le plafond en serrant les fessiers, sans cambrer violemment.",
      "Redescends lentement jusqu'à la verticale et enchaîne."
    ],
    erreurs: ["Donner de l'élan avec le dos.", "Monter au-delà de l'alignement du buste.", "Relâcher les fessiers en haut."],
    videoQuery: "frog reverse hyper banc extension hanche fessiers"
  }
];
EXERCISES.push(...EXERCISES_HIP);

/* =========================================================
   Ajouts issus d'un programme partagé (Legs 2 / Push 2).
   Seuls figurent ici les mouvements qui n'existaient pas
   déjà : les treize autres lignes de ce programme sont
   des exercices de la bibliothèque, et « 21's » ou « drop
   set » sont des schémas de séries, pas des exercices.
   ========================================================= */
const EXERCISES_PROG = [
  {
    id: "curl-marteau-triche",
    nom: "Curl marteau en triche",
    groupe: "biceps", materiel: "halteres", niveau: "avance", type: "iso",
    muscles: "Biceps, brachial, long supinateur (brachio-radial)",
    description: "Le curl marteau volontairement lancé : une impulsion de hanches fait passer la charge au-delà du point de blocage, puis la descente se fait lente et contrôlée. Sert à surcharger l'excentrique avec des haltères plus lourds que ce qu'on peut curler strictement.",
    execution: [
      "Debout, haltères en prise neutre le long du corps, gainage serré.",
      "Donne une impulsion brève des hanches pour lancer la montée, sans reculer le buste.",
      "Une fois le point de blocage passé, reprends le contrôle et monte jusqu'en haut.",
      "Descends en trois à quatre secondes, sans élan : c'est là que se fait le travail."
    ],
    erreurs: [
      "Transformer l'impulsion en balancement continu à chaque répétition.",
      "Cambrer les lombaires pour lancer la charge.",
      "Lâcher la descente : sans excentrique contrôlé, la triche ne sert plus à rien."
    ],
    videoQuery: "hammer cheat curl technique triche excentrique"
  },
  {
    id: "extension-lombaire-prisonnier",
    nom: "Extension lombaire mains derrière la tête",
    groupe: "lombaires", materiel: "machine", niveau: "intermediaire", type: "iso",
    muscles: "Lombaires, fessiers, ischios",
    description: "L'extension au banc à 45°, mains croisées derrière la nuque : la position « prisonnier » éloigne le centre de masse de la hanche et alourdit nettement le mouvement, sans ajouter le moindre kilo.",
    execution: [
      "Cuisses calées sur le banc à 45°, chevilles bloquées, mains croisées derrière la tête.",
      "Descends le buste dos neutre, coudes ouverts et immobiles.",
      "Remonte jusqu'à l'alignement du corps, sans dépasser.",
      "Garde les coudes larges : les ramener vers l'avant raccourcit le levier et annule l'intérêt."
    ],
    erreurs: [
      "Tirer sur la nuque avec les mains.",
      "Refermer les coudes pendant la montée.",
      "Dépasser l'alignement en hyper-extension."
    ],
    videoQuery: "prisoner back extension mains derrière la tête technique"
  },
  {
    id: "l-sit-leste",
    nom: "L-sit lesté",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "avance", type: "iso",
    muscles: "Grand droit, fléchisseurs de hanche, triceps, grand dorsal (dépression scapulaire)",
    description: "Assis entre deux barres parallèles, bras tendus qui poussent le corps vers le haut, jambes tendues à l'horizontale : un gainage en compression totale. Le lest se pose sur les chevilles ou entre les pieds.",
    execution: [
      "Mains sur les barres, bras verrouillés, épaules basses et éloignées des oreilles.",
      "Décolle le bassin en poussant fort vers le sol, jambes tendues devant.",
      "Monte les jambes jusqu'à l'horizontale, pointes tendues, dos arrondi vers l'arrière.",
      "Tiens sans respirer court : le temps sous tension est tout l'exercice."
    ],
    erreurs: [
      "Épaules qui remontent vers les oreilles.",
      "Genoux fléchis pour tricher sur la hauteur.",
      "Bassin qui recule au lieu de rester sous les épaules."
    ],
    videoQuery: "weighted l-sit hold technique parallettes gainage"
  }
];
EXERCISES.push(...EXERCISES_PROG);

/* =========================================================
   Trous manifestes de la bibliothèque.

   Repérés en cherchant chaque exercice sous le nom écrit sur la
   machine plutôt que sous son nom de fiche. Cinq mouvements très
   courants ne répondaient à AUCUNE recherche parce qu'ils
   n'existaient pas — à ne pas confondre avec les mollets assis, qui
   existaient et que seul un alias manquant rendait introuvables.

   Chaque famille avait déjà ses variantes voisines : le développé
   incliné n'existait qu'aux haltères, le leg curl qu'allongé et
   assis, l'élévation latérale qu'aux haltères et à la poulie, le
   crunch qu'au sol et à la poulie, l'extension triceps qu'à la
   barre. Ce sont les cinq chaînons manquants.
   ========================================================= */
const EXERCISES_TROUS = [
  {
    id: "developpe-incline-barre",
    nom: "Développé incliné à la barre",
    groupe: "pectoraux", materiel: "barre", niveau: "intermediaire", type: "poly",
    muscles: "Faisceau claviculaire des pectoraux, deltoïde antérieur, triceps",
    description: "Le développé couché basculé à 30-45° : la barre permet de charger plus lourd qu'aux haltères et de progresser en charge sur le haut des pectoraux, la portion la plus souvent en retard.",
    execution: [
      "Banc réglé entre 30 et 45° : au-delà, ce sont les épaules qui prennent le travail.",
      "Prise un peu plus large que les épaules, omoplates serrées et basses, pieds ancrés au sol.",
      "Descends la barre vers le HAUT des pectoraux, sous les clavicules — pas au milieu du sternum.",
      "Pousse en gardant les coudes à environ 45° du buste, sans verrouiller sèchement en haut."
    ],
    erreurs: [
      "Banc trop redressé : l'exercice devient un développé épaules.",
      "Barre qui descend trop bas sur le sternum, comme au couché à plat.",
      "Décoller les fesses du banc pour lancer la charge."
    ],
    videoQuery: "développé incliné barre incline bench press technique"
  },
  {
    id: "extension-corde-poulie-haute",
    nom: "Extension triceps à la corde (poulie haute)",
    groupe: "triceps", materiel: "poulie", niveau: "debutant", type: "iso",
    muscles: "Triceps brachial, chef latéral surtout",
    description: "Le pushdown à la corde plutôt qu'à la barre : en fin d'extension, les mains s'écartent et tournent vers l'extérieur, ce qui ajoute une contraction que la barre droite ne permet pas.",
    execution: [
      "Face à la poulie haute, corde en prise neutre, coudes collés au buste.",
      "Buste très légèrement penché vers la machine, gainé, immobile.",
      "Pousse vers le bas jusqu'aux bras tendus.",
      "En bas, écarte les mains et tourne les paumes vers l'arrière : c'est tout l'intérêt de la corde."
    ],
    erreurs: [
      "Coudes qui décollent du buste et transforment le geste en tirage.",
      "Coup de buste pour lancer la charge.",
      "Garder les mains serrées en bas : autant prendre la barre."
    ],
    videoQuery: "rope pushdown triceps corde poulie haute technique"
  },
  {
    id: "leg-curl-debout",
    nom: "Leg curl debout (une jambe)",
    groupe: "ischios-fessiers", materiel: "machine", niveau: "debutant", type: "iso",
    muscles: "Ischio-jambiers (unilatéral)",
    description: "Le curl fémoral une jambe à la fois, hanche tendue : la position debout étire la longue portion du biceps fémoral autrement que la version assise, et révèle les déséquilibres entre les deux jambes.",
    execution: [
      "Debout face à la machine, buste contre le support, cuisse calée sous le coussinet.",
      "Hanche tendue, bassin immobile : c'est le genou seul qui travaille.",
      "Ramène le talon vers la fesse le plus loin possible.",
      "Redescends lentement sans laisser la charge reposer en bas."
    ],
    erreurs: [
      "Fléchir la hanche pour gagner de l'amplitude.",
      "Cambrer les lombaires en fin de flexion.",
      "Descendre en lâchant la charge d'un coup."
    ],
    videoQuery: "standing leg curl une jambe ischios technique"
  },
  {
    id: "elevations-laterales-machine",
    nom: "Élévations latérales à la machine",
    groupe: "epaules", materiel: "machine", niveau: "debutant", type: "iso",
    muscles: "Deltoïde moyen",
    description: "L'élévation latérale guidée : les coussinets appuient sur le bras et non sur la main, ce qui supprime la triche et maintient la résistance sur toute l'amplitude, y compris en bas où les haltères ne pèsent presque rien.",
    execution: [
      "Assis, dos plaqué, épaules dans l'axe des pivots de la machine.",
      "Bras contre les coussinets, coudes légèrement fléchis.",
      "Monte jusqu'à l'horizontale des bras, pas plus haut.",
      "Redescends en freinant, sans laisser les poids se reposer entre les répétitions."
    ],
    erreurs: [
      "Monter au-dessus de l'horizontale : le trapèze prend le relais.",
      "Pousser avec les mains au lieu de laisser le bras appuyer.",
      "Décoller le dos du dossier pour lancer la charge."
    ],
    videoQuery: "machine lateral raise élévations latérales machine technique"
  },
  {
    id: "crunch-machine",
    nom: "Crunch à la machine",
    groupe: "abdos", materiel: "machine", niveau: "debutant", type: "iso",
    muscles: "Grand droit de l'abdomen",
    description: "Le crunch chargé et guidé : la machine permet d'ajouter des kilos proprement là où le crunch au sol plafonne très vite, sans tirer sur la nuque.",
    execution: [
      "Assis, axe de la machine à hauteur du nombril, poignées ou coussinets pris aux épaules.",
      "Enroule le buste vers l'avant en creusant le ventre, menton vers le sternum.",
      "Va chercher la contraction courte, sans chercher à toucher les cuisses.",
      "Reviens lentement, sans laisser la charge te redresser d'un coup."
    ],
    erreurs: [
      "Tirer sur les poignées avec les bras au lieu d'enrouler le buste.",
      "Basculer en arrière avec le dos rond pour lancer la machine.",
      "Amplitude trop grande : le crunch est un mouvement court."
    ],
    videoQuery: "machine crunch abdominal machine technique"
  }
];
EXERCISES.push(...EXERCISES_TROUS);

/* =========================================================
   La famille L-sit.

   La bibliothèque n'avait que la version LESTÉE — c'est-à-dire la plus
   dure des trois, et la seule qu'on ne fait jamais en premier. Les
   deux formes qui la précèdent manquaient.

   Ce qui les sépare n'est pas « plus ou moins dur » : c'est un couple
   de flexion de hanche, calculable. Jambes tendues, les deux jambes
   imposent 7,35 unités poids × longueur en permanence. Genoux repliés,
   leur centre de masse se rapproche de la hanche et le couple tombe à
   5,46 — soit 74 %, un quart de moins. C'est cette différence-là qui
   fait du groupé une progression, et non une variante de confort.

   (Les deux chiffres sortent du même modèle segmentaire que les schémas
   animés, et sont mesurés sur les positions RÉELLEMENT dessinées : voir
   les n° 146 et 147 de motion-ex.js, où la correction d'un tibia qui
   traversait la barre a fait passer le second de 4,99 à 5,46.)
   ========================================================= */
const EXERCISES_LSIT = [
  {
    id: "l-sit-jambes-tendues",
    nom: "L-sit jambes tendues",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "avance", type: "iso",
    muscles: "Grand droit, fléchisseurs de hanche, quadriceps, triceps, grand dorsal (dépression scapulaire)",
    description: "La forme de référence : assis entre deux barres parallèles, bras verrouillés qui poussent le corps vers le haut, bassin décollé, jambes tendues à l'horizontale. Un gainage en compression totale, tenu au temps.",
    execution: [
      "Mains sur les barres, bras verrouillés, épaules BASSES et éloignées des oreilles — c'est la moitié de l'exercice.",
      "Pousse fort vers le sol pour décoller le bassin : les fesses ne traînent jamais.",
      "Tends les jambes devant, genoux verrouillés, jusqu'à l'horizontale, pointes tendues.",
      "Tiens en respirant : le temps sous tension EST l'exercice. Descends dès que les genoux fléchissent."
    ],
    erreurs: [
      "Épaules qui remontent vers les oreilles : l'appui devient passif.",
      "Genoux fléchis pour gagner de la hauteur — c'est alors un L-sit groupé, pas un L-sit tendu.",
      "Bassin qui recule au lieu de rester sous les épaules.",
      "Tenir en apnée : la position lâche d'un coup au lieu de se contrôler."
    ],
    videoQuery: "l-sit jambes tendues parallettes technique gainage"
  },
  {
    id: "l-sit-groupe",
    nom: "L-sit groupé (genoux repliés)",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "intermediaire", type: "iso",
    muscles: "Grand droit, fléchisseurs de hanche, triceps, grand dorsal (dépression scapulaire)",
    description: "La marche d'avant. Mêmes bras verrouillés, même bassin décollé, mais genoux repliés : le couple à tenir à la hanche tombe d'un quart. On y apprend la dépression scapulaire et le décollement du bassin avant d'y ajouter le levier des jambes.",
    execution: [
      "Mains sur les barres, bras verrouillés, épaules basses : la position d'appui est identique au L-sit tendu.",
      "Pousse vers le sol jusqu'à décoller complètement le bassin.",
      "Monte les genoux jusqu'à ce que les cuisses soient à l'horizontale, tibias à la verticale sous les genoux.",
      "Quand tu tiens 30 s propres, tends une jambe, puis les deux : la progression se fait par le levier, pas par la durée seule."
    ],
    erreurs: [
      "Bassin resté au sol : sans décollement, ce n'est plus l'exercice.",
      "Cuisses sous l'horizontale, genoux qui pendent — le couple disparaît avec elles.",
      "Épaules qui remontent vers les oreilles.",
      "S'aider d'un balancement du buste pour lancer la position."
    ],
    videoQuery: "tuck l-sit genoux repliés parallettes progression technique"
  }
];
EXERCISES.push(...EXERCISES_LSIT);

/* =========================================================
   Variantes des autres exercices STATIQUES.

   Un mot sur ce que « statique » veut dire ici, parce que la base
   prête à confusion : le champ `type: "iso"` signifie ISOLATION, pas
   isométrie — c'est pour cela que 78 exercices le portent, curls et
   leg extensions compris. Les vrais maintiens sont les sept marqués
   `isometrique` dans leur schéma animé. Trois formaient déjà la
   famille L-sit ; les quatre autres étaient seuls.

   UN MAINTIEN NE SE RÈGLE PAS EN CHARGE, MAIS EN LEVIER. C'est le
   seul réglage disponible, et il est calculable — d'où une variante
   qui raccourcit le levier (progression) ou l'allonge (surcharge)
   pour chacun des quatre.

   ATTENTION À L'INDICATEUR CHOISI. Pour la planche, la part du poids
   posée sur les avant-bras semble le bon chiffre. Elle ne l'est pas :
   avancer les coudes ALLONGE la base d'appui, donc SOULAGE les bras
   (74,8 % → 68,1 %) alors que l'exercice devient nettement plus dur.
   Ce que les abdominaux retiennent est un moment anti-extension autour
   de la hanche : 8,14 pour la planche standard, 2,87 sur les genoux
   (35 %), 12,29 en long levier (151 %). C'est cet indicateur-là qui
   classe les trois dans le bon ordre.
   ========================================================= */
const EXERCISES_STATIQUES = [
  {
    id: "planche-genoux",
    nom: "Planche sur les genoux",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Transverse, grand droit, grand fessier",
    description: "La planche avec l'appui avancé aux genoux : le levier raccourcit et le moment que les abdominaux retiennent tombe à un tiers de celui de la planche complète. La bonne marche quand le bassin s'affaisse au bout de dix secondes.",
    execution: [
      "Coudes sous les épaules, avant-bras à plat au sol, mains vers l'avant.",
      "Genoux au sol, tibias posés derrière, pieds relevés.",
      "Aligne épaules, hanches et genoux : c'est la même ligne droite que la planche, simplement plus courte.",
      "Serre les fessiers et rentre le bassin. Passe à la planche complète quand tu tiens 60 s sans que la ligne bouge."
    ],
    erreurs: [
      "Bassin qui remonte : la position devient un repos, plus un gainage.",
      "Cambrure lombaire, ventre qui plonge vers le sol.",
      "Appui sur les mains plutôt que sur les avant-bras.",
      "Tête rentrée ou relevée : elle suit la ligne du corps."
    ],
    videoQuery: "planche sur les genoux gainage débutant technique"
  },
  {
    id: "planche-long-levier",
    nom: "Planche à long levier",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "avance", type: "iso",
    muscles: "Transverse, grand droit, grand dorsal, grand fessier",
    description: "La planche avec les coudes avancés loin devant les épaules. Le corps s'allonge et s'aplatit, et le moment anti-extension à la hanche passe à une fois et demie celui de la planche standard. Les avant-bras portent pourtant MOINS de poids — c'est le tronc qui prend tout.",
    execution: [
      "Pars en planche classique, coudes sous les épaules.",
      "Avance les coudes centimètre par centimètre vers l'avant : les épaules reculent derrière eux et le corps s'aplatit.",
      "Arrête-toi à la limite où le bassin reste rentré et les lombaires plates — pas un centimètre de plus.",
      "Dix à vingt secondes suffisent : c'est une position de surcharge, pas d'endurance."
    ],
    erreurs: [
      "Avancer jusqu'à cambrer : tout le bénéfice part dans les lombaires.",
      "Épaules qui s'affaissent entre les omoplates au lieu de rester poussées.",
      "Retenir sa respiration pour tenir plus longtemps.",
      "Vouloir la durée d'une planche normale : la position est une fois et demie plus exigeante."
    ],
    videoQuery: "long lever plank technique gainage avancé"
  },
  {
    id: "gainage-lateral-jambe",
    nom: "Gainage latéral jambe levée",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "avance", type: "iso",
    muscles: "Obliques, carré des lombes, moyen fessier",
    description: "Le gainage latéral avec la jambe du dessus levée. L'appui au sol se réduit à un seul pied, et le moyen fessier de la jambe levée travaille en même temps que celui de la jambe d'appui : deux fessiers au lieu d'un.",
    execution: [
      "Installe un gainage latéral propre : coude sous l'épaule, corps en ligne, hanche haute.",
      "Lève la jambe du dessus d'environ 35°, sans laisser la hanche partir en arrière.",
      "Garde le pied de la jambe levée dans l'axe du corps, orteils vers l'avant.",
      "Tiens, puis change de côté. La hanche qui redescend signe la fin de la série."
    ],
    erreurs: [
      "Hanche du dessous qui s'affaisse dès que la jambe monte.",
      "Rouler en arrière pour lever la jambe plus haut.",
      "Lever la jambe plié au genou, ce qui supprime le levier.",
      "Négliger le côté faible : les deux côtés se travaillent au même temps, pas au même ressenti."
    ],
    videoQuery: "side plank leg raise gainage latéral jambe levée technique"
  },
  {
    id: "hollow-hold-groupe",
    nom: "Hollow hold groupé",
    groupe: "abdos", materiel: "poids-du-corps", niveau: "debutant", type: "iso",
    muscles: "Grand droit, transverse, fléchisseurs de hanche",
    description: "Le hollow hold genoux repliés, cuisses à la verticale et tibias à l'horizontale. Le centre de masse des jambes revient presque au-dessus de la hanche : le moment à retenir tombe à un quart de celui du hollow hold tendu. C'est là qu'on apprend à plaquer les lombaires, avant d'y ajouter le levier.",
    execution: [
      "Allongé sur le dos, plaque les lombaires au sol : c'est le seul contact qui doit rester.",
      "Monte les genoux à l'aplomb des hanches, cuisses verticales, tibias horizontaux.",
      "Décolle les épaules et tends les bras au-delà de la tête.",
      "Si le bas du dos décolle, c'est fini : redescends plutôt que de tenir mal."
    ],
    erreurs: [
      "Lombaires décollées : l'exercice se transforme en travail de fléchisseurs de hanche.",
      "Menton collé à la poitrine au lieu du regard vers les genoux.",
      "Tibias qui pendent vers le sol, cuisses sous la verticale.",
      "Se balancer pour tenir : un maintien ne se balance pas."
    ],
    videoQuery: "tuck hollow hold genoux repliés technique gainage"
  },
  {
    id: "wall-sit-une-jambe",
    nom: "Wall sit une jambe",
    groupe: "quadriceps", materiel: "poids-du-corps", niveau: "avance", type: "iso",
    muscles: "Quadriceps (isométrie), grand fessier, fléchisseurs de hanche de la jambe levée",
    description: "La chaise contre le mur sur une seule jambe : le même poids de corps repose sur un seul quadriceps, soit environ le double de charge. La jambe libre, tendue devant, ajoute son propre levier et fait travailler ses fléchisseurs de hanche.",
    execution: [
      "Installe une chaise contre le mur classique : cuisses parallèles au sol, genou au-dessus de la cheville.",
      "Tends une jambe devant toi, légèrement au-dessus de l'horizontale, pied fléchi.",
      "Garde le genou d'appui à l'aplomb de la cheville : il ne doit ni rentrer ni avancer.",
      "Change de jambe et fais le même temps des deux côtés, même si le second est plus dur."
    ],
    erreurs: [
      "Genou d'appui qui part vers l'intérieur — l'erreur la plus fréquente et la plus coûteuse.",
      "Bassin qui glisse vers le haut du mur pour soulager la cuisse.",
      "Prendre appui sur les mains posées sur la cuisse.",
      "Jambe libre qui redescend au sol sans qu'on s'en aperçoive."
    ],
    videoQuery: "single leg wall sit chaise une jambe technique"
  }
];
EXERCISES.push(...EXERCISES_STATIQUES);

/* =========================================================
   Noms alternatifs (FR + EN) : la recherche, le sélecteur
   et l'anti-doublon reconnaissent l'exercice sous tous
   ses noms. Complété par ex.alias sur les exos persos.
   ========================================================= */
const EXERCISE_ALIASES = {
  "curl-marteau-triche": ["hammer cheat curl", "cheat curl", "curl triché"],
  "extension-lombaire-prisonnier": ["prisoner back extension", "back extension prisonnier", "hyperextension mains derrière la tête"],
  /* « L-sit » tout court désignait la version LESTÉE, faute des deux
     autres. Ce n'était pas anodin : un texte qui dit « L-sit » parle du
     poids du corps, jamais d'un lest. Les noms nus reviennent donc à la
     version tendue, et la lestée garde ce qui la nomme explicitement. */
  "l-sit-leste": ["weighted l-sit hold", "weighted l sit", "équerre lestée", "l-sit lesté"],
  "l-sit-jambes-tendues": ["l sit", "l-sit", "lsit", "full l-sit", "l sit hold",
                           "équerre", "l-sit jambes tendues", "straight leg l-sit"],
  "l-sit-groupe": ["tuck l-sit", "tuck l sit", "tuck sit", "l-sit groupé",
                   "l sit genoux repliés", "équerre groupée", "tucked l-sit"],

  /* Variantes statiques. « Long-Lever Planks » vient d'un vrai
     programme importé, où il ne trouvait que « Planche » à peu près. */
  "planche-genoux": ["knee plank", "planche genoux", "gainage genoux", "plank on knees"],
  "planche-long-levier": ["long lever plank", "long-lever plank", "planche longue",
                          "rkc plank", "planche coudes avancés"],
  "gainage-lateral-jambe": ["side plank leg raise", "star side plank",
                            "gainage latéral jambe levée", "side plank abduction"],
  "hollow-hold-groupe": ["tuck hollow hold", "hollow hold groupé", "hollow tuck",
                         "hollow hold genoux repliés"],
  "wall-sit-une-jambe": ["single leg wall sit", "one leg wall sit", "chaise une jambe",
                         "wall sit unilatéral"],
  "developpe-couche-barre": ["bench press", "couché à la barre", "développé allongé", "barbell bench"],
  "developpe-couche-halteres": ["dumbbell bench press", "couché haltères"],
  "developpe-incline-halteres": ["incline dumbbell press", "incliné haltères"],
  "developpe-decline-barre": ["decline bench press"],
  "pompes": ["push up", "push-ups", "pushup"],
  "pec-deck": ["butterfly", "pec butterfly", "machine fly", "papillon"],
  "ecarte-halteres": ["dumbbell fly", "flyes", "écartés couchés"],
  /* Les DEUX écartés à la poulie sont des crossovers : celui-ci part des
     poulies HAUTES et descend, l'autre part des poulies BASSES et monte.
     Seul celui-ci portait l'alias « crossover », si bien qu'une recherche
     « crossover poulie basse » ne renvoyait RIEN alors que l'exercice
     existe. Les deux le portent désormais, chacun avec sa hauteur. */
  "ecarte-poulie-vis-a-vis": ["cable crossover", "crossover", "crossover poulie haute",
    "high cable crossover", "crossover haut", "écarté poulie haute"],
  "ecarte-poulie-basse": ["crossover poulie basse", "low cable crossover",
    "low to high crossover", "crossover bas", "cable crossover basse"],
  "dips-pectoraux": ["chest dips", "répulsions"],
  "tractions": ["pull up", "pull-ups", "pullup", "barre fixe"],
  "tractions-supination": ["chin up", "chin-ups", "traction marteau"],
  "rowing-barre": ["barbell row", "bent over row", "tirage buste penché"],
  "rowing-haltere": ["dumbbell row", "one arm row", "rowing unilatéral"],
  "tirage-vertical": ["lat pulldown", "pulldown", "tirage poitrine"],
  "tirage-horizontal-poulie": ["seated cable row", "low row", "rowing assis"],
  "souleve-de-terre": ["deadlift", "SDT"],
  "souleve-terre-roumain": ["romanian deadlift", "RDL", "SDT roumain"],
  "souleve-terre-sumo": ["sumo deadlift"],
  "developpe-militaire": ["military press", "overhead press", "OHP", "développé debout"],
  "developpe-halteres-assis": ["seated dumbbell press", "shoulder press"],
  "developpe-arnold": ["arnold press"],
  "elevations-laterales": ["lateral raise", "side raise", "élévations côté"],
  "elevation-laterale-egyptienne": ["egyptian lateral raise", "égyptien latéral raise", "leaning lateral raise"],
  "oiseau-halteres": ["reverse fly", "rear delt fly", "bent over raise"],
  "face-pull": ["facepull", "tirage visage"],
  "curl-barre": ["barbell curl", "curl ez"],
  "curl-marteau": ["hammer curl"],
  "curl-incline": ["incline curl"],
  "curl-pupitre": ["preacher curl", "curl larry scott"],
  "extension-poulie": ["triceps pushdown", "pushdown", "extension barre poulie"],
  "barre-au-front": ["skull crusher", "skullcrusher", "french press"],
  "developpe-couche-prise-serree": ["close grip bench press", "CGBP"],
  "squat-barre": ["back squat", "squat arrière"],
  "front-squat": ["squat avant", "squat clavicule"],
  "squat-gobelet": ["goblet squat"],
  "presse-a-cuisses": ["leg press", "presse inclinée"],
  "fentes-marchees": ["walking lunges", "lunges", "fentes avant"],
  "fentes-bulgares": ["bulgarian split squat", "split squat"],
  "hip-thrust": ["glute bridge barre", "extension de hanches", "hip trust", "barbell hip thrust"],
  "hip-thrust-machine": ["machine hip thrust", "hip thrust guidé", "hip trust machine"],
  "hip-thrust-unilateral": ["single leg hip thrust", "hip thrust une jambe", "b-stance hip thrust"],
  "pont-fessier": ["glute bridge", "pont", "relevé de bassin"],
  "frog-pumps": ["frog pump", "pont grenouille"],
  "pull-through-poulie": ["cable pull through", "pull through", "tirage entre les jambes"],
  "souleve-terre-unijambiste": ["single leg deadlift", "single leg RDL", "SDT unijambiste", "soulevé de terre une jambe"],
  "abduction-machine": ["hip abduction", "machine à abduction", "abducteurs assis", "écartement des jambes"],
  "adduction-machine": ["hip adduction", "machine à adduction", "adducteurs assis", "serrage des jambes"],
  "abduction-hanche-poulie": ["cable hip abduction", "abduction debout", "élévation latérale de jambe"],
  "adduction-hanche-poulie": ["cable hip adduction", "adduction debout"],
  "kickback-fessier-poulie": ["cable kickback", "glute kickback", "extension de hanche poulie"],
  "kickback-fessier-machine": ["glute kickback machine", "extension de hanche machine", "presse fessier"],
  "donkey-kicks": ["donkey kick", "ruade", "coup de pied d'âne"],
  "fire-hydrant": ["fire hydrants", "abduction à quatre pattes"],
  "clamshell": ["clam shell", "coquillage", "ouverture de genou"],
  "marche-laterale-elastique": ["lateral band walk", "monster walk", "marche du crabe", "pas chassés élastique"],
  "fente-croisee": ["curtsy lunge", "fente curtsy", "fente révérence"],
  "flexion-hanche-poulie": ["hip flexion", "relevé de genou poulie", "psoas poulie"],
  "extension-hanche-banc": ["frog reverse hyper", "reverse hyper au banc", "extension fessiers banc"],
  "leg-curl": ["lying leg curl", "curl fémoral"],
  "leg-extension": ["extension de jambes", "quad extension"],
  "kettlebell-swing": ["russian swing", "swing"],
  "planche": ["plank", "gainage ventral"],
  "crunch": ["crunchs", "abdos au sol"],
  "mollets-debout": ["standing calf raise", "calf raises", "calf raise debout"],
  "hyperextension-inversee": ["reverse hyper"],

  /* Noms anglais manquants. Le défaut est toujours le même : l'exercice
     EXISTE, mais on le cherche sous le nom écrit sur la machine, et la
     recherche ne trouve rien. « Seated calf » ne ramenait aucun
     résultat alors que les mollets assis sont dans la bibliothèque
     depuis le premier jour. */
  "mollets-assis": ["seated calf raise", "seated calf", "calf raise assis", "soléaire"],
  "mollets-presse": ["calf press", "leg press calf raise", "calf raise presse"],
  "mollets-unijambiste": ["single leg calf raise", "one leg calf raise", "calf raise une jambe"],
  "crunch-poulie": ["cable crunch", "kneeling cable crunch", "crunch câble"],
  "extension-un-bras-poulie": ["single arm pushdown", "one arm pushdown"],
  "extension-corde-nuque-poulie": ["overhead rope extension", "extension corde au dessus de la tête"],
  "kickback-triceps": ["triceps kickback", "extension triceps buste penché"],
  "ecarte-halteres": ["chest fly", "dumbbell fly", "flye"],
  "ecarte-incline-halteres": ["incline chest fly", "incline dumbbell fly"],
  "ecarte-poulie-vis-a-vis": ["cable crossover", "crossover", "cable fly"],
  "pec-deck": ["butterfly", "machine chest fly", "peck deck"],
  "developpe-incline-halteres": ["incline dumbbell press", "développé incliné haltères"],
  "developpe-couche-halteres": ["dumbbell bench press", "développé haltères"],
  "developpe-decline-barre": ["decline bench press"],
  "leg-extension": ["leg extensions", "knee extension"],
  "leg-curl": ["lying leg curl", "curl fémoral", "leg curl couché"],
  "leg-curl-assis": ["seated leg curl", "curl fémoral assis"],
  "hack-squat": ["machine hack squat", "squat hack"],
  "step-ups": ["step up", "montée sur banc", "box step up"],
  /* « wall sit » nu doit rester la version à DEUX jambes. Sans cet
     alias explicite, la variante unilatérale le prenait : son nom
     commence par « wall sit », celui du parent ne commence pas par lui
     (« Chaise contre le mur (wall sit) »), et le départage tranche sur
     ce critère. Le même piège que pour « L-sit ». */
  "wall-sit": ["chaise", "mur", "isometric squat", "wall sit", "wallsit"],
  "rowing-machine-assis": ["seated cable row", "seated row", "rowing assis"],
  "tirage-horizontal-poulie": ["cable row", "low row", "tirage horizontal"],
  "tirage-bras-tendus": ["straight arm pulldown", "pullover poulie"],
  "tirage-vertical-prise-serree": ["close grip pulldown", "tirage triangle", "v-bar pulldown"],
  "shrugs-halteres": ["dumbbell shrugs", "haussements d'épaules haltères"],
  "shrugs-barre": ["barbell shrugs"],
  "rack-pull": ["rack pulls", "soulevé partiel"],
  "tractions-lestees": ["weighted pull up", "tractions lestées"],
  "elevations-frontales": ["front raise", "élévation frontale"],
  "elevations-laterales-poulie": ["cable lateral raise"],
  "rowing-menton": ["upright row", "tirage menton"],
  "developpe-epaules-machine": ["machine shoulder press", "développé épaules guidé"],
  "pec-deck-inverse": ["reverse pec deck", "rear delt machine"],
  "gainage-lateral": ["side plank"],
  "hollow-hold": ["hollow body hold"],
  "dead-bug": ["deadbug"],
  "sit-ups": ["sit up", "redressement assis"],
  "russian-twist": ["russian twists", "rotation russe"],
  "roulette-abdos": ["ab wheel", "ab rollout", "roue abdominale"],
  "releve-jambes-suspendu": ["hanging leg raise", "toes to bar"],
  "curl-poulie-basse": ["cable curl", "low pulley curl"],
  "curl-machine": ["machine curl"],
  "curl-inverse": ["reverse curl"],
  "curl-concentration": ["concentration curl"],
  "curl-spider": ["spider curl"],
  "good-morning": ["good mornings"],
  "nordic-curl": ["nordic hamstring curl", "nordique"],
  "souleve-terre-jambes-tendues": ["stiff leg deadlift", "SLDL"],
  "souleve-terre-sumo": ["sumo deadlift"],
  "extension-lombaire-banc": ["back extension", "hyperextension", "extension lombaire"],
  "superman": ["superman hold"],
  "bird-dog": ["birddog", "quadrupède"],

  "developpe-incline-barre": ["incline bench press", "incline barbell press", "développé incliné"],
  "extension-corde-poulie-haute": ["rope pushdown", "triceps rope pushdown", "extension corde", "pushdown corde"],
  "leg-curl-debout": ["standing leg curl", "curl fémoral debout", "leg curl une jambe"],
  "elevations-laterales-machine": ["machine lateral raise", "lateral raise machine", "élévation latérale guidée"],
  "crunch-machine": ["machine crunch", "ab machine", "crunch guidé", "abdominal machine"],

  /* Ajoutés après le passage d'un vrai programme anglophone à
     l'import : chacun corrige un exercice qui EXISTE en bibliothèque
     mais que son nom anglais ne trouvait pas. */
  "squat-barre-plus": ["squats", "barbell back squat"],
  "presse-unilaterale": ["single leg press", "one leg press", "unilateral leg press",
                         "presse unilatérale", "presse une jambe"],
  "rowing-machine-assis-plus": ["chest supported row", "chest-supported row", "seal row"],
  "shrugs-halteres": ["shrug", "dumbbell shrug", "incline dumbbell shrug", "incline shrug",
                      "haussement d'épaules"],
  "face-pull-plus": ["rope face pull", "face pull corde"],
  "tirage-bras-tendus-plus": ["cable pullover", "straight arm pullover", "lat prayer"],
  "kickback-triceps-plus": ["cable tricep kickback", "cable triceps kickback", "tricep kickback"],
  "mollets-unijambiste": ["single leg calf raise", "one leg calf raise", "mollet une jambe"]
};

/* Les clés « -plus » ci-dessus complètent un exercice qui a DÉJÀ des
   alias plus haut dans la table. Un objet ne gardant qu'une valeur par
   clé, les redéclarer écraserait les premiers : on les fusionne. */
Object.keys(EXERCISE_ALIASES).forEach(k => {
  if (!k.endsWith("-plus")) return;
  const base = k.slice(0, -5);
  EXERCISE_ALIASES[base] = (EXERCISE_ALIASES[base] || []).concat(EXERCISE_ALIASES[k]);
  delete EXERCISE_ALIASES[k];
});

/* Un alias posé sur un identifiant qui n'existe pas ne prévient
   personne : il ne sert simplement jamais. C'est exactement ce qui
   venait d'arriver à « mollets-une-jambe », dont le vrai identifiant
   est « mollets-unijambiste ». */
(() => {
  const orphelins = Object.keys(EXERCISE_ALIASES).filter(k => !EXERCISES.some(e => e.id === k));
  if (orphelins.length) console.warn("Alias sans exercice :", orphelins.join(", "));
})();

/* Tous les noms connus d'un exercice (nom + alias intégrés + alias perso) */
function exAliases(ex) {
  return (EXERCISE_ALIASES[ex.id] || []).concat(ex.alias || []);
}

/* Recherche par mots : chaque mot de la requête doit apparaître
   quelque part dans le nom, les muscles, le groupe, le matériel
   ou un alias — « hip thrust machine » trouve donc bien
   « Hip thrust à la machine ». */
function exMatches(ex, query) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = normalize(
    ex.nom + " " + (ex.muscles || "") + " " +
    ((typeof LABELS !== "undefined" && LABELS.groupes[ex.groupe]) || "") + " " +
    ((typeof LABELS !== "undefined" && LABELS.materiel[ex.materiel]) || "") + " " +
    exAliases(ex).join(" ")
  );
  return words.every(w => hay.includes(w));
}
