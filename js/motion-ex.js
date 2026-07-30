/* =========================================================
   GymCoach — Schémas animés DÉDIÉS, un exercice à la fois
   Chaque entrée est construite après une analyse écrite du
   mouvement (position, matériel, articulations mobiles et
   fixes, sens, amplitude, muscles). Aucune animation n'est
   réutilisée d'un exercice à l'autre : les variantes barre /
   haltères / machine ont chacune la leur.

   Repère commun : viewBox 0 0 240 150, sol à y = 146.
   Convention : les segments sont dessinés dans la position
   HAUTE (verrouillage), et les rotations les amènent en
   position basse — l'amplitude codée est donc la ROM réelle.
   ========================================================= */

const EXERCISE_MOTIONS = {};

/* =========================================================
   1. DÉVELOPPÉ COUCHÉ À LA BARRE  (developpe-couche-barre)
   -----------------------------------------------------------
   Position  : allongé sur le dos, banc PLAT horizontal ; tête,
               haut du dos et fessiers en contact ; pieds à plat
               au sol, tibias verticaux ; omoplates serrées.
   Matériel  : barre olympique, prise pronation ~1,5 largeur
               d'épaules, tenue bras tendus À LA VERTICALE
               au-dessus du BAS de la poitrine (vue de profil :
               les disques se voient de face, en disque).
   Mobiles   : épaule (adduction horizontale + flexion),
               coude (extension).
   Fixes     : rachis, bassin, hanches, genoux, chevilles —
               le tronc et les jambes ne bougent pas d'un pouce.
   Sens/plan : barre vers le sternum = excentrique ; retour
               vertical = concentrique. Coude en plan sagittal,
               épaule en plan transverse.
   ROM       : coude ~90° fléchi en bas (barre au contact du bas
               des pectoraux) → ~175° en haut. Trajet de barre
               ≈ 34 unités, soit ~35-40 cm à l'échelle.
   Agonistes : grand pectoral (chef sternocostal), deltoïde
               antérieur, triceps brachial.
   Distinction : banc PLAT (≠ incliné/décliné) et BARRE — les
               deux mains sont liées par un axe rigide, la
               trajectoire est unique ; aux haltères les mains
               convergent l'une vers l'autre en fin de poussée.
   ========================================================= */
EXERCISE_MOTIONS["developpe-couche-barre"] = {
  vb: "26 32 196 120",   // cadrage serré sur la scène
  dur: 3.6,
  // excentrique 0→45 % (lent), pause 45→52 %, concentrique 52→80 % (rapide)
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Allongé sur un banc plat, la barre descend vers le bas de la poitrine puis remonte à la verticale ; seuls les bras bougent.",
  fixe: `
    <line class="mo-ground" x1="18" y1="146" x2="222" y2="146"/>
    <!-- banc plat : plateau horizontal + deux pieds -->
    <rect class="mo-gear" x="40" y="104" width="132" height="9" rx="3"/>
    <line class="mo-gear" x1="54" y1="113" x2="54" y2="146"/>
    <line class="mo-gear" x1="158" y1="113" x2="158" y2="146"/>
    <!-- corps allongé : tête, tronc, cuisse, tibia, pied au sol (immobiles) -->
    <circle class="mo-head" cx="52" cy="94" r="9"/>
    <line class="mo-body" x1="62" y1="98" x2="130" y2="100"/>
    <line class="mo-body" x1="130" y1="100" x2="152" y2="124"/>
    <line class="mo-body" x1="152" y1="124" x2="148" y2="146"/>
    <line class="mo-body" x1="140" y1="146" x2="156" y2="146"/>`,
  muscles: [
    { nom: "Grand pectoral",
      svg: `<ellipse cx="88" cy="95" rx="13" ry="4.5"/>` },
    { nom: "Deltoïde antérieur",
      svg: `<circle cx="74" cy="95" r="4.5"/>` }
  ],
  parts: [
    {
      // BRAS : rotation autour de l'ÉPAULE (74, 96). 0° = vertical (verrouillage),
      // 128° = position basse : le coude descend au niveau du tronc, en avant
      // du banc. Angles obtenus par cinématique inverse pour que la main
      // arrive au BAS des pectoraux (102, 88) avec un coude à ~80°.
      o: "74px 96px",
      k: [[0, "rotate(0deg)"], [45, "rotate(128deg)"], [52, "rotate(128deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Triceps brachial",
      muscle: `<ellipse cx="74" cy="85" rx="3.2" ry="7.5"/>`,   // triceps, suit le bras
      svg: `
        <line class="mo-limb" x1="74" y1="96" x2="74" y2="74"/>
        <circle class="mo-joint" cx="74" cy="74" r="2.6"/>`,
      children: [
        {
          // AVANT-BRAS + BARRE : rotation RELATIVE au bras, autour du COUDE (74, 74).
          // −102° laisse l'avant-bras quasi vertical en bas, poignet au-dessus
          // du coude — l'alignement poignet/coude du vrai développé couché.
          o: "74px 74px",
          k: [[0, "rotate(0deg)"], [45, "rotate(-102deg)"], [52, "rotate(-102deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="74" y1="74" x2="74" y2="50"/>
            <!-- barre vue de profil : l'axe s'enfonce dans la profondeur, on voit le disque -->
            <circle class="mo-plate-o" cx="74" cy="50" r="9"/>
            <circle class="mo-hub" cx="74" cy="50" r="2.6"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M136 52 L136 84 M131 77 L136 84 L141 77"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M136 84 L136 52 M131 59 L136 52 L141 59"/>` }
  ]
};

/* =========================================================
   2. DÉVELOPPÉ INCLINÉ AUX HALTÈRES  (developpe-incline-halteres)
   -----------------------------------------------------------
   Position  : assis-allongé sur un banc INCLINÉ à ~30° ; dos et
               tête plaqués contre le dossier, fessiers au fond
               du siège, pieds au sol.
   Matériel  : DEUX haltères, un dans chaque main, indépendants.
               Prise neutre à semi-pronation. En haut ils sont
               au-dessus du HAUT de la poitrine et se rapprochent
               l'un de l'autre (ici vue de profil : un seul
               haltère visible, dessiné en barre courte avec ses
               deux masses).
   Mobiles   : épaule (flexion + adduction horizontale),
               coude (extension).
   Fixes     : rachis (plaqué au dossier), bassin, hanches,
               genoux, chevilles.
   Sens/plan : haltère vers le haut de la poitrine = excentrique ;
               poussée vers le haut et légèrement vers l'arrière
               (perpendiculaire au buste incliné) = concentrique.
   ROM       : coude ~85° en bas (haltère au niveau de la
               clavicule/haut du pectoral, plus bas que la barre
               car les mains sont libres) → ~170° en haut.
   Agonistes : faisceau CLAVICULAIRE du grand pectoral (haut des
               pectoraux), deltoïde antérieur, triceps.
   Distinction : le dossier est INCLINÉ (≠ développé couché à plat)
               et la charge est en DEUX haltères indépendants
               (≠ barre) : la trajectoire est perpendiculaire au
               buste incliné, donc oblique, pas verticale.
   ========================================================= */
EXERCISE_MOTIONS["developpe-incline-halteres"] = {
  vb: "46 8 168 144",
  dur: 3.8,
  phases: { ecc: [0, 46], con: [54, 82] },
  alt: "Sur un banc incliné à 30°, deux haltères descendent vers le haut de la poitrine puis sont poussés perpendiculairement au buste ; seuls les bras bougent.",
  fixe: `
    <line class="mo-ground" x1="52" y1="146" x2="212" y2="146"/>
    <!-- banc incliné ~32° : dossier oblique, assise, deux pieds -->
    <line class="mo-pad" x1="70" y1="70" x2="132" y2="108"/>
    <line class="mo-pad" x1="132" y1="108" x2="174" y2="112"/>
    <line class="mo-gear" x1="82" y1="82" x2="82" y2="146"/>
    <line class="mo-gear" x1="166" y1="114" x2="166" y2="146"/>
    <!-- corps plaqué au dossier : tête, dos, cuisse, tibia, pied -->
    <circle class="mo-head" cx="66" cy="52" r="9"/>
    <line class="mo-body" x1="72" y1="59" x2="128" y2="94"/>
    <line class="mo-body" x1="128" y1="94" x2="164" y2="106"/>
    <line class="mo-body" x1="164" y1="106" x2="168" y2="146"/>
    <line class="mo-body" x1="160" y1="146" x2="178" y2="146"/>`,
  muscles: [
    { nom: "Haut des pectoraux",
      svg: `<ellipse cx="88" cy="70" rx="12" ry="4.4" transform="rotate(32 88 70)"/>` },
    { nom: "Deltoïde antérieur",
      svg: `<circle cx="76" cy="62" r="4.5"/>` }
  ],
  parts: [
    {
      /* BRAS : rotation autour de l'ÉPAULE (76, 62). Dessiné PERPENDICULAIRE
         au buste incliné (et non à la verticale) : c'est ce qui distingue
         l'incliné du couché à plat. +128° amène le coude bas et en arrière
         du plan du buste, comme au bas d'un développé incliné haltères. */
      o: "76px 62px",
      k: [[0, "rotate(0deg)"], [46, "rotate(128deg)"], [54, "rotate(128deg)"],
          [82, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Triceps brachial",
      muscle: `<ellipse cx="82" cy="52" rx="3.2" ry="7.5" transform="rotate(32 82 52)"/>`,
      svg: `
        <line class="mo-limb" x1="76" y1="62" x2="88" y2="43"/>
        <circle class="mo-joint" cx="88" cy="43" r="2.6"/>`,
      children: [
        {
          /* AVANT-BRAS + HALTÈRE : rotation relative autour du COUDE (88, 43).
             −131° place l'haltère au niveau du HAUT de la poitrine en bas. */
          o: "88px 43px",
          k: [[0, "rotate(0deg)"], [46, "rotate(-131deg)"], [54, "rotate(-131deg)"],
              [82, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="88" y1="43" x2="101" y2="23"/>
            <!-- UN haltère (pas une barre) : poignée courte + deux masses,
                 les deux mains sont indépendantes -->
            <line class="mo-bar2" x1="92" y1="14" x2="110" y2="32"/>
            <rect class="mo-mass" x="86" y="9" width="7" height="15" rx="2" transform="rotate(45 89.5 16.5)"/>
            <rect class="mo-mass" x="106" y="27" width="7" height="15" rx="2" transform="rotate(45 109.5 34.5)"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M138 30 L154 56 M146 50 L154 56 L155 46"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M154 56 L138 30 M137 40 L138 30 L147 36"/>` }
  ]
};

/* =========================================================
   3. POMPES  (pompes)
   -----------------------------------------------------------
   Position  : face au sol, appui sur les MAINS (largeur épaules,
               sous les épaules) et sur les POINTES DE PIEDS.
               Corps en planche rigide, tête dans l'alignement.
   Matériel  : aucun — poids du corps. Les appuis (mains, pieds)
               sont FIXES au sol.
   Mobiles   : coude (flexion/extension), épaule ; et le CORPS
               ENTIER qui pivote autour de la pointe des pieds.
   Fixes     : rachis, bassin, genoux — aucune flexion de hanche,
               le corps descend d'un bloc. Mains et pieds
               immobiles au sol.
   Sens/plan : descente du corps = excentrique ; poussée du sol
               = concentrique. Coude en plan sagittal.
   ROM       : coude ~60-90° en bas (poitrine à quelques cm du
               sol) → ~170° en haut. Le bassin descend d'environ
               22 unités, soit ~20 cm à l'échelle.
   Agonistes : grand pectoral, deltoïde antérieur, triceps ;
               abdominaux en gainage isométrique (donc non
               animés : ils tiennent, ils ne raccourcissent pas).
   Distinction : CHAÎNE FERMÉE — contrairement au développé
               couché où la charge se déplace et le corps est
               fixe, ici la main est fixe et c'est le CORPS qui
               se déplace. Amplitude bornée par le sol.
   Angles obtenus par cinématique inverse pour que la main reste
   EXACTEMENT au sol dans les deux positions, corps compris.
   ========================================================= */
EXERCISE_MOTIONS["pompes"] = {
  vb: "40 78 172 78",
  dur: 3.4,
  phases: { ecc: [0, 44], con: [52, 80] },
  alt: "Corps en planche rigide, mains et pieds fixes au sol : le corps entier descend en bloc puis repousse le sol.",
  fixe: `
    <line class="mo-ground" x1="46" y1="146" x2="206" y2="146"/>`,
  parts: [
    {
      /* CORPS ENTIER : pivote autour de la POINTE DE PIED (188, 142).
         −10,2° abaisse l'épaule de 22 unités, sans plier la hanche. */
      o: "188px 142px",
      k: [[0, "rotate(0deg)"], [44, "rotate(-10.2deg)"], [52, "rotate(-10.2deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: ["Grand pectoral", "Deltoïde antérieur"],
      muscle: `<ellipse cx="82" cy="110" rx="11" ry="4.2" transform="rotate(18 82 110)"/>
               <circle cx="70" cy="105" r="4.3"/>`,
      svg: `
        <circle class="mo-head" cx="58" cy="100" r="8"/>
        <line class="mo-body" x1="66" y1="103" x2="129" y2="123"/>
        <line class="mo-body" x1="129" y1="123" x2="183" y2="140"/>
        <line class="mo-body" x1="183" y1="140" x2="190" y2="146"/>`,
      children: [
        {
          /* BRAS : rotation autour de l'ÉPAULE (70, 104), dans le repère du
             corps. −49,6° amène le coude vers l'arrière en position basse. */
          o: "70px 104px",
          k: [[0, "rotate(0deg)"], [44, "rotate(-49.6deg)"], [52, "rotate(-49.6deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Triceps brachial",
          muscle: `<ellipse cx="72" cy="114" rx="3.2" ry="7.5" transform="rotate(-12 72 114)"/>`,
          svg: `
            <line class="mo-limb" x1="70" y1="104" x2="74.6" y2="125.5"/>
            <circle class="mo-joint" cx="74.6" cy="125.5" r="2.6"/>`,
          children: [
            {
              /* AVANT-BRAS : rotation relative autour du COUDE. +96,6° garde
                 la MAIN exactement au même point du sol, corps abaissé. */
              o: "74.6px 125.5px",
              k: [[0, "rotate(0deg)"], [44, "rotate(96.6deg)"], [52, "rotate(96.6deg)"],
                  [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
              svg: `
                <line class="mo-limb" x1="74.6" y1="125.5" x2="70" y2="146"/>
                <circle class="mo-hand" cx="70" cy="146" r="3.4"/>`
            }
          ]
        }
      ],
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M126 92 L126 112 M121 106 L126 112 L131 106"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M126 112 L126 92 M121 98 L126 92 L131 98"/>` }
  ]
};

/* =========================================================
   4. ÉCARTÉ À LA POULIE VIS-À-VIS  (ecarte-poulie-vis-a-vis)
   -----------------------------------------------------------
   Position  : DEBOUT au centre de deux poulies HAUTES en
               vis-à-vis, un pied légèrement devant pour la
               stabilité, buste très légèrement penché en avant,
               gainage serré.
   Matériel  : deux câbles descendant de poulies placées AU-DESSUS
               des épaules, une poignée dans chaque main. La ligne
               de traction est oblique, de haut en bas et de
               l'extérieur vers l'intérieur.
   Mobiles   : ÉPAULE uniquement (adduction horizontale + un peu
               d'extension, la poulie étant haute).
   Fixes     : le COUDE garde un angle constant d'environ 160°
               pendant tout le mouvement — c'est ce qui fait la
               différence avec un développé. Rachis, bassin et
               jambes immobiles.
   Sens/plan : rapprochement des mains devant/en bas = CONCENTRIQUE
               (plan transverse) ; retour bras écartés = excentrique
               (plus lent, c'est la phase d'étirement).
   ROM       : arc d'environ 105° par bras, des mains hautes et
               écartées jusqu'aux mains jointes devant le bassin.
   Agonistes : grand pectoral (le rapprochement des mains, donc la
               portion interne), deltoïde antérieur en assistance.
   Distinction : vue de FACE (le geste est symétrique dans le plan
               transverse, un profil ne montrerait qu'un bras) ;
               tension continue par câble, coude verrouillé — à ne
               pas confondre avec l'écarté couché aux haltères,
               allongé et sans tension en haut.
   Cinématique : le câble suit la main par rotation autour de la
               poulie ET allongement (facteur 2,62), calculé pour
               que son extrémité tombe exactement sur la poignée.
   ========================================================= */
EXERCISE_MOTIONS["ecarte-poulie-vis-a-vis"] = {
  vb: "14 6 212 148",
  dur: 4.0,
  // concentrique 0→35 % (rapprochement), tenue 35→45 %, excentrique 45→90 % (lent)
  phases: { con: [0, 35], ecc: [45, 90] },
  alt: "Debout entre deux poulies hautes, vue de face : les mains descendent en arc de cercle jusqu'à se rejoindre devant le bassin, coudes bloqués à angle constant.",
  fixe: `
    <line class="mo-ground" x1="30" y1="148" x2="210" y2="148"/>
    <!-- deux colonnes de poulies en vis-à-vis -->
    <line class="mo-gear" x1="26" y1="16" x2="26" y2="148"/>
    <line class="mo-gear" x1="214" y1="16" x2="214" y2="148"/>
    <circle class="mo-pulley" cx="26" cy="20" r="5"/>
    <circle class="mo-pulley" cx="214" cy="20" r="5"/>
    <!-- corps de face, immobile : tête, tronc, jambes (pied gauche devant) -->
    <circle class="mo-head" cx="120" cy="44" r="10"/>
    <line class="mo-body" x1="120" y1="54" x2="120" y2="100"/>
    <line class="mo-body" x1="104" y1="60" x2="136" y2="60"/>
    <line class="mo-body" x1="120" y1="100" x2="104" y2="148"/>
    <line class="mo-body" x1="120" y1="100" x2="136" y2="146"/>`,
  muscles: [
    { nom: "Grand pectoral",
      svg: `<ellipse cx="110" cy="70" rx="8.5" ry="5"/><ellipse cx="130" cy="70" rx="8.5" ry="5"/>` },
    { nom: "Deltoïde antérieur",
      svg: `<circle cx="104" cy="60" r="4.5"/><circle cx="136" cy="60" r="4.5"/>` }
  ],
  parts: [
    {
      /* CÂBLE GAUCHE : tourne autour de la POULIE (26, 20) et s'allonge
         (×2,62) pour que son extrémité reste sur la poignée. */
      o: "26px 20px",
      k: [[0, "rotate(0deg) scale(1)"], [35, "rotate(-3.6deg) scale(2.62)"],
          [45, "rotate(-3.6deg) scale(2.62)"], [90, "rotate(0deg) scale(1)"], [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="26" y1="20" x2="56" y2="54"/>`
    },
    {
      /* CÂBLE DROIT : miroir exact du gauche. */
      o: "214px 20px",
      k: [[0, "rotate(0deg) scale(1)"], [35, "rotate(3.6deg) scale(2.62)"],
          [45, "rotate(3.6deg) scale(2.62)"], [90, "rotate(0deg) scale(1)"], [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="214" y1="20" x2="184" y2="54"/>`
    },
    {
      /* BRAS GAUCHE : un seul segment coudé à 161°, tournant autour de
         l'ÉPAULE (104, 60). Le coude ne bouge PAS par rapport au bras :
         c'est bien une adduction d'épaule pure, pas une extension de coude. */
      o: "104px 60px",
      k: [[0, "rotate(0deg)"], [35, "rotate(-105deg)"], [45, "rotate(-105deg)"],
          [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <polyline class="mo-limb" points="104,60 80,61 56,54"/>
        <circle class="mo-joint" cx="80" cy="61" r="2.4"/>
        <circle class="mo-hand" cx="56" cy="54" r="3.4"/>`
    },
    {
      /* BRAS DROIT : miroir. */
      o: "136px 60px",
      k: [[0, "rotate(0deg)"], [35, "rotate(105deg)"], [45, "rotate(105deg)"],
          [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <polyline class="mo-limb" points="136,60 160,61 184,54"/>
        <circle class="mo-joint" cx="160" cy="61" r="2.4"/>
        <circle class="mo-hand" cx="184" cy="54" r="3.4"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M74 76 L98 100 M90 99 L98 100 L97 92 M166 76 L142 100 M150 99 L142 100 L143 92"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M98 100 L74 76 M75 84 L74 76 L82 77 M142 100 L166 76 M165 84 L166 76 L158 77"/>` }
  ]
};

/* =========================================================
   5. DIPS (ORIENTÉS PECTORAUX)  (dips-pectoraux)
   -----------------------------------------------------------
   Position  : en appui bras tendus sur des BARRES PARALLÈLES,
               corps suspendu sous les mains. Pour l'orientation
               PECTORAUX : buste penché en avant d'environ 25°,
               genoux fléchis et pieds croisés derrière.
   Matériel  : deux barres parallèles fixes, prise neutre. Les
               MAINS sont le point fixe (chaîne fermée), c'est le
               corps qui se déplace.
   Mobiles   : coude (flexion/extension) et épaule (extension puis
               flexion). Le corps entier descend et remonte.
   Fixes     : les mains sur les barres ; l'inclinaison du buste
               reste quasi constante (elle s'accentue de ~4° en
               bas seulement) ; l'angle des genoux ne change pas.
   Sens/plan : descente du corps = excentrique ; poussée sur les
               barres = concentrique. Plan sagittal.
   ROM       : coude de ~170° (verrouillé) à ~75° en bas — plus
               bas que l'horizontale, ce que permet le buste
               penché. Le corps descend d'environ 18 unités.
   Agonistes : BAS du grand pectoral (c'est le buste penché qui
               l'oriente là), triceps, deltoïde antérieur.
   Distinction : buste PENCHÉ (≠ dips triceps, buste vertical et
               coudes serrés) ; chaîne fermée main fixe (≠ dips
               machine où c'est une charge qui se déplace).
   Cinématique : chaîne enracinée à la MAIN (main → coude →
               épaule → corps), donc la main ne peut pas quitter
               la barre. Le corps est contre-tourné pour garder
               son inclinaison dans le repère du sol.
   ========================================================= */
EXERCISE_MOTIONS["dips-pectoraux"] = {
  vb: "44 4 156 150",
  dur: 3.8,
  phases: { ecc: [0, 46], con: [54, 82] },
  alt: "En appui sur des barres parallèles, buste penché en avant : le corps descend sous les mains puis repousse les barres.",
  fixe: `
    <line class="mo-ground" x1="52" y1="150" x2="196" y2="150"/>
    <!-- barres parallèles : la barre vue de profil + ses montants -->
    <line class="mo-bar3" x1="66" y1="70" x2="176" y2="70"/>
    <line class="mo-gear" x1="76" y1="70" x2="76" y2="150"/>
    <line class="mo-gear" x1="166" y1="70" x2="166" y2="150"/>`,
  parts: [
    {
      /* AVANT-BRAS : enraciné à la MAIN (100, 70), qui reste sur la barre.
         +77,2° amène le coude vers l'arrière, comme au bas d'un dips. */
      o: "100px 70px",
      k: [[0, "rotate(0deg)"], [46, "rotate(77.2deg)"], [54, "rotate(77.2deg)"],
          [82, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <circle class="mo-hand" cx="100" cy="70" r="3.6"/>
        <line class="mo-limb" x1="100" y1="70" x2="100" y2="50"/>
        <circle class="mo-joint" cx="100" cy="50" r="2.6"/>`,
      children: [
        {
          /* BRAS : rotation relative autour du COUDE (100, 50). −105,6°
             place l'épaule 18 unités plus bas et 10 en avant. */
          o: "100px 50px",
          k: [[0, "rotate(0deg)"], [46, "rotate(-105.6deg)"], [54, "rotate(-105.6deg)"],
              [82, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Triceps brachial",
          muscle: `<ellipse cx="100" cy="40" rx="3.4" ry="7"/>`,
          childrenFirst: true,   // le bras (proche) passe devant le buste
          svg: `<line class="mo-limb" x1="100" y1="50" x2="100" y2="30"/>
                <circle class="mo-joint" cx="100" cy="30" r="2.6"/>`,
          children: [
            {
              /* CORPS : contre-rotation de +24° autour de l'ÉPAULE (100, 30)
                 pour que le buste garde son inclinaison par rapport au sol
                 (il ne s'incline que de ~4° de plus en position basse). */
              o: "100px 30px",
              k: [[0, "rotate(0deg)"], [46, "rotate(24deg)"], [54, "rotate(24deg)"],
                  [82, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: "Bas du grand pectoral",
              muscle: `<ellipse cx="104" cy="44" rx="9" ry="4.6" transform="rotate(68 104 44)"/>`,
              svg: `
                <circle class="mo-head" cx="91" cy="21" r="9"/>
                <line class="mo-body" x1="100" y1="30" x2="116" y2="70"/>
                <line class="mo-body" x1="116" y1="70" x2="102" y2="100"/>
                <line class="mo-body" x1="102" y1="100" x2="124" y2="110"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M150 44 L150 74 M145 67 L150 74 L155 67"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M150 74 L150 44 M145 51 L150 44 L155 51"/>` }
  ]
};

/* =========================================================
   6. DÉVELOPPÉ COUCHÉ AUX HALTÈRES  (developpe-couche-halteres)
   -----------------------------------------------------------
   Position  : allongé sur le dos, banc PLAT horizontal, pieds au
               sol, omoplates serrées. La position du corps et le
               banc sont — dans la réalité — identiques à ceux du
               développé couché à la barre : les dessiner
               autrement serait faux. Ce qui change, et qui est
               animé différemment, c'est le MATÉRIEL, l'AMPLITUDE
               et la TRAJECTOIRE.
   Matériel  : DEUX haltères indépendants (ici l'haltère proche,
               vu de profil : poignée courte + deux masses), prise
               pronation à semi-pronation.
   Mobiles   : épaule (adduction horizontale + flexion),
               coude (extension).
   Fixes     : rachis, bassin, hanches, genoux, chevilles.
   Sens/plan : descente jusqu'au NIVEAU des pectoraux, voire un
               peu en dessous = excentrique ; poussée = concentrique.
   ROM       : coude ~75° en bas — soit PLUS PROFOND qu'à la barre
               (~90°, bloquée par la poitrine) : c'est l'intérêt
               principal des haltères. Extension à ~170° en haut.
   Agonistes : grand pectoral, deltoïde antérieur, triceps, plus
               les stabilisateurs de l'épaule (charge non liée).
   Distinction vs BARRE : amplitude basse plus grande (rien ne
               bute contre le sternum), mains libres, tempo plus
               lent car la charge doit être contrôlée. Vs INCLINÉ
               haltères : banc PLAT, trajectoire verticale et non
               oblique.
   ========================================================= */
EXERCISE_MOTIONS["developpe-couche-halteres"] = {
  vb: "26 32 196 122",
  dur: 4.0,
  // excentrique plus lent qu'à la barre : la charge libre se contrôle
  phases: { ecc: [0, 48], con: [56, 84] },
  alt: "Allongé sur un banc plat, deux haltères descendent au niveau des pectoraux — plus bas que ne le permet une barre — puis remontent à la verticale.",
  fixe: `
    <line class="mo-ground" x1="18" y1="146" x2="222" y2="146"/>
    <rect class="mo-gear" x="40" y="104" width="132" height="9" rx="3"/>
    <line class="mo-gear" x1="54" y1="113" x2="54" y2="146"/>
    <line class="mo-gear" x1="158" y1="113" x2="158" y2="146"/>
    <circle class="mo-head" cx="52" cy="94" r="9"/>
    <line class="mo-body" x1="62" y1="98" x2="130" y2="100"/>
    <line class="mo-body" x1="130" y1="100" x2="152" y2="124"/>
    <line class="mo-body" x1="152" y1="124" x2="148" y2="146"/>
    <line class="mo-body" x1="140" y1="146" x2="156" y2="146"/>
    <!-- repère d'amplitude : le niveau bas atteint, sous la ligne de poitrine -->
    <line class="mo-rom" x1="88" y1="96" x2="118" y2="96"/>`,
  muscles: [
    { nom: "Grand pectoral", svg: `<ellipse cx="88" cy="95" rx="13" ry="4.5"/>` },
    { nom: "Deltoïde antérieur", svg: `<circle cx="74" cy="95" r="4.5"/>` }
  ],
  parts: [
    {
      /* BRAS : rotation autour de l'ÉPAULE (74, 96). 149,3° — nettement plus
         que les 128° de la version barre : le coude descend plus bas parce
         que rien ne vient buter contre la poitrine. */
      o: "74px 96px",
      k: [[0, "rotate(0deg)"], [48, "rotate(149.3deg)"], [56, "rotate(149.3deg)"],
          [84, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Triceps brachial",
      muscle: `<ellipse cx="74" cy="85" rx="3.2" ry="7.5"/>`,
      childrenFirst: false,
      svg: `
        <line class="mo-limb" x1="74" y1="96" x2="74" y2="74"/>
        <circle class="mo-joint" cx="74" cy="74" r="2.6"/>`,
      children: [
        {
          /* AVANT-BRAS + HALTÈRE : −111,2° relatif amène l'haltère au NIVEAU
             de la poitrine (100, 96), main à l'extérieur. */
          o: "74px 74px",
          k: [[0, "rotate(0deg)"], [48, "rotate(-111.2deg)"], [56, "rotate(-111.2deg)"],
              [84, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="74" y1="74" x2="74" y2="50"/>
            <!-- UN haltère indépendant : poignée + deux masses (pas un disque) -->
            <line class="mo-bar2" x1="64" y1="50" x2="84" y2="50"/>
            <rect class="mo-mass" x="60" y="42" width="7" height="16" rx="2"/>
            <rect class="mo-mass" x="81" y="42" width="7" height="16" rx="2"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M136 52 L136 92 M131 85 L136 92 L141 85"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M136 92 L136 52 M131 59 L136 52 L141 59"/>` }
  ]
};
