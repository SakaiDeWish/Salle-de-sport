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

EXERCISES.push(...EXERCISES_EXTRA);
