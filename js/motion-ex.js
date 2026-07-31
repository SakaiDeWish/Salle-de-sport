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

/* =========================================================
   7. TRACTIONS (PRONATION)  (tractions)
   -----------------------------------------------------------
   Position  : SUSPENDU à une barre fixe, bras tendus, prise
               PRONATION (paumes vers l'avant) nettement plus
               large que les épaules, gainage actif, pas de
               balancement.
   Matériel  : barre fixe horizontale. Les MAINS sont le point
               fixe (chaîne fermée) : c'est le CORPS qui monte.
   Mobiles   : coude (flexion) et épaule (adduction + extension),
               omoplates qui s'abaissent et se rétractent.
   Fixes     : rachis gainé, bassin, angle des genoux ; et bien
               sûr les mains sur la barre.
   Sens/plan : montée du corps jusqu'au menton au-dessus de la
               barre = CONCENTRIQUE ; descente contrôlée =
               excentrique (plus lente). Prise large ⇒ dominante
               dans le plan frontal (adduction).
   ROM       : coude de ~172° (suspension complète) à ~49° en
               haut. Le corps monte de 38 unités, menton au-dessus
               de la barre.
   Agonistes : grand dorsal (principal), grand rond, trapèze
               moyen et rhomboïdes ; biceps en assistance.
   Distinction : PRONATION large ⇒ accent grand dorsal, peu de
               biceps (≠ traction supination, où le biceps prend
               le relais). Et surtout : ici le corps monte vers
               une barre fixe — au tirage vertical à la poulie,
               c'est l'inverse, le corps est assis et c'est la
               barre qui descend.
   Vue de FACE : la prise large et la symétrie du geste ne se
               lisent pas de profil.
   ========================================================= */
EXERCISE_MOTIONS["tractions"] = {
  vb: "34 -2 172 154",
  dur: 4.2,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Suspendu à une barre fixe en prise pronation large, le corps monte jusqu'au menton au-dessus de la barre puis redescend lentement.",
  fixe: `
    <!-- barre fixe + montants -->
    <line class="mo-bar3" x1="44" y1="24" x2="196" y2="24"/>
    <line class="mo-gear" x1="50" y1="24" x2="50" y2="150"/>
    <line class="mo-gear" x1="190" y1="24" x2="190" y2="150"/>
    <line class="mo-ground" x1="40" y1="150" x2="200" y2="150"/>`,
  parts: [
    {
      /* AVANT-BRAS GAUCHE : enraciné à la MAIN (86, 24), qui ne quitte
         jamais la barre. +2° seulement : l'avant-bras reste presque dans
         l'axe, c'est le bras et le corps qui font le travail. */
      o: "86px 24px",
      k: [[0, "rotate(0deg)"], [32, "rotate(2deg)"], [40, "rotate(2deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      childrenFirst: true,
      svg: `
        <circle class="mo-hand" cx="86" cy="24" r="3.6"/>
        <line class="mo-limb" x1="86" y1="24" x2="93.5" y2="44.7"/>
        <circle class="mo-joint" cx="93.5" cy="44.7" r="2.5"/>`,
      children: [
        {
          /* BRAS GAUCHE : flexion du coude autour de (93.5, 44.7).
             −122,7° fait passer le coude de tendu (~172°) à ~49°. */
          o: "93.5px 44.7px",
          k: [[0, "rotate(0deg)"], [32, "rotate(-122.7deg)"], [40, "rotate(-122.7deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Biceps brachial",
          muscle: `<ellipse cx="99" cy="54" rx="3.2" ry="6.5" transform="rotate(29 99 54)"/>`,
          svg: `<line class="mo-limb" x1="93.5" y1="44.7" x2="104" y2="64"/>`,
          children: [
            {
              /* CORPS : contre-rotation de +120,7° autour de l'ÉPAULE gauche
                 (104, 64) pour rester vertical pendant que le bras tourne. */
              o: "104px 64px",
              k: [[0, "rotate(0deg)"], [32, "rotate(120.7deg)"], [40, "rotate(120.7deg)"],
                  [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: "Grand dorsal",
              muscle: `<ellipse cx="111" cy="80" rx="3.8" ry="11" transform="rotate(-9 111 80)"/>
                       <ellipse cx="129" cy="80" rx="3.8" ry="11" transform="rotate(9 129 80)"/>`,
              svg: `
                <circle class="mo-head" cx="120" cy="50" r="10"/>
                <line class="mo-body" x1="104" y1="64" x2="136" y2="64"/>
                <line class="mo-body" x1="120" y1="62" x2="120" y2="104"/>
                <line class="mo-body" x1="120" y1="104" x2="111" y2="140"/>
                <line class="mo-body" x1="120" y1="104" x2="129" y2="140"/>`
            }
          ]
        }
      ]
    },
    {
      /* AVANT-BRAS DROIT : miroir exact, enraciné à la main (154, 24). */
      o: "154px 24px",
      k: [[0, "rotate(0deg)"], [32, "rotate(-2deg)"], [40, "rotate(-2deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <circle class="mo-hand" cx="154" cy="24" r="3.6"/>
        <line class="mo-limb" x1="154" y1="24" x2="146.5" y2="44.7"/>
        <circle class="mo-joint" cx="146.5" cy="44.7" r="2.5"/>`,
      children: [
        {
          o: "146.5px 44.7px",
          k: [[0, "rotate(0deg)"], [32, "rotate(122.7deg)"], [40, "rotate(122.7deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscle: `<ellipse cx="141" cy="54" rx="3.2" ry="6.5" transform="rotate(-29 141 54)"/>`,
          svg: `<line class="mo-limb" x1="146.5" y1="44.7" x2="136" y2="64"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M168 96 L168 58 M163 66 L168 58 L173 66"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M168 58 L168 96 M163 88 L168 96 L173 88"/>` }
  ]
};

/* =========================================================
   8. ROWING BARRE BUSTE PENCHÉ  (rowing-barre)
   -----------------------------------------------------------
   Position  : DEBOUT, pieds largeur de bassin, genoux légèrement
               fléchis, buste penché en avant à ~45°, dos PLAT
               (jamais arrondi), regard vers le sol devant soi.
   Matériel  : barre olympique tenue bras tendus sous les épaules,
               prise pronation. Vue de profil, on voit le disque.
   Mobiles   : coude (flexion) et épaule (extension), avec
               rétraction des omoplates.
   Fixes     : LE BUSTE — son angle de 45° ne bouge pas d'un
               degré pendant la série, c'est le point technique
               central. Hanches, genoux et rachis immobiles.
   Sens/plan : barre tirée vers le bas des côtes = concentrique ;
               descente contrôlée = excentrique. Plan sagittal.
   ROM       : coude de ~170° (barre pendante) à ~74° (barre au
               contact du bas des côtes) ; le coude passe haut et
               EN ARRIÈRE, pas sur le côté.
   Agonistes : grand dorsal, trapèze moyen et rhomboïdes,
               deltoïde postérieur ; biceps en assistance ;
               lombaires en gainage isométrique — donc non animés,
               ils tiennent la position, ils ne raccourcissent pas.
   Distinction : buste penché et charge LIBRE (le tronc doit
               résister au poids) — ≠ tirage horizontal à la
               poulie (assis, buste vertical, tronc soutenu),
               ≠ rowing haltère (unilatéral, une main en appui),
               ≠ T-bar (barre ancrée au sol).
   ========================================================= */
EXERCISE_MOTIONS["rowing-barre"] = {
  vb: "40 32 158 122",
  dur: 3.8,
  phases: { con: [0, 34], ecc: [42, 88] },
  alt: "Debout buste penché à 45°, la barre est tirée depuis les bras tendus jusqu'au bas des côtes, coudes en arrière ; le buste ne bouge pas.",
  fixe: `
    <line class="mo-ground" x1="52" y1="150" x2="190" y2="150"/>
    <!-- corps immobile : jambes semi-fléchies, buste penché à 45°, dos plat -->
    <line class="mo-body" x1="120" y1="150" x2="116" y2="116"/>
    <line class="mo-body" x1="116" y1="116" x2="124" y2="92"/>
    <line class="mo-body" x1="124" y1="92" x2="86" y2="60"/>
    <circle class="mo-head" cx="76" cy="52" r="9"/>
    <!-- repère : l'angle du buste, qui doit rester constant -->
    <line class="mo-rom" x1="124" y1="92" x2="88" y2="92"/>`,
  muscles: [
    { nom: "Grand dorsal",
      svg: `<ellipse cx="104" cy="74" rx="12" ry="4.6" transform="rotate(40 104 74)"/>` },
    { nom: "Deltoïde postérieur",
      svg: `<circle cx="88" cy="62" r="4.4"/>` }
  ],
  parts: [
    {
      /* BRAS : rotation autour de l'ÉPAULE (86, 60). −79,8° amène le coude
         HAUT et EN ARRIÈRE — la signature du rowing, à l'opposé d'un
         coude qui partirait sur le côté. */
      o: "86px 60px",
      k: [[0, "rotate(0deg)"], [34, "rotate(-79.8deg)"], [42, "rotate(-79.8deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Biceps brachial",
      muscle: `<ellipse cx="86" cy="72" rx="3.2" ry="7"/>`,
      svg: `
        <line class="mo-limb" x1="86" y1="60" x2="86" y2="84"/>
        <circle class="mo-joint" cx="86" cy="84" r="2.6"/>`,
      children: [
        {
          /* AVANT-BRAS + BARRE : +105,8° relatif amène la barre au contact
             du bas des côtes (100, 84). */
          o: "86px 84px",
          k: [[0, "rotate(0deg)"], [34, "rotate(105.8deg)"], [42, "rotate(105.8deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="86" y1="84" x2="86" y2="106"/>
            <circle class="mo-plate-o" cx="86" cy="106" r="9"/>
            <circle class="mo-hub" cx="86" cy="106" r="2.6"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M58 106 L58 76 M53 84 L58 76 L63 84"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M58 76 L58 106 M53 98 L58 106 L63 98"/>` }
  ]
};

/* =========================================================
   9. TIRAGE VERTICAL POITRINE  (tirage-vertical)
   -----------------------------------------------------------
   Position  : ASSIS à la machine, cuisses bloquées sous les
               boudins, pieds à plat, buste quasi vertical avec
               une très légère inclinaison arrière, poitrine
               sortie.
   Matériel  : barre longue suspendue à un CÂBLE venant d'une
               poulie haute, prise pronation large.
   Mobiles   : coude (flexion) et épaule (adduction) ; c'est la
               BARRE qui descend.
   Fixes     : bassin bloqué sous les boudins, jambes, et
               l'inclinaison du buste, qui ne doit pas se
               transformer en balancement.
   Sens/plan : barre tirée vers le haut de la poitrine =
               concentrique ; remontée contrôlée = excentrique.
               Plan frontal, d'où la vue de FACE.
   ROM       : coude de ~170° (bras tendus) à ~63° (barre au
               niveau des clavicules) ; la barre descend de 32
               unités, verticalement.
   Agonistes : grand dorsal, grand rond, trapèze inférieur ;
               biceps en assistance.
   Distinction : chaîne OUVERTE et corps FIXE — c'est la charge
               qui se déplace, exactement l'inverse de la
               traction où le corps monte vers une barre fixe.
               C'est ce qui en fait la régression naturelle de la
               traction : la charge est réglable.
   ========================================================= */
EXERCISE_MOTIONS["tirage-vertical"] = {
  vb: "44 2 168 152",
  dur: 3.9,
  phases: { con: [0, 34], ecc: [42, 88] },
  alt: "Assis à la poulie haute, cuisses bloquées : la barre descend jusqu'aux clavicules, coudes vers le bas, puis remonte lentement.",
  fixe: `
    <line class="mo-ground" x1="56" y1="150" x2="184" y2="150"/>
    <!-- bâti + poulie haute -->
    <line class="mo-gear" x1="66" y1="10" x2="66" y2="150"/>
    <line class="mo-gear" x1="66" y1="10" x2="120" y2="10"/>
    <circle class="mo-pulley" cx="120" cy="16" r="5"/>
    <!-- siège et boudins de cuisses : le bassin est bloqué -->
    <line class="mo-pad" x1="100" y1="120" x2="146" y2="120"/>
    <line class="mo-pad" x1="104" y1="102" x2="140" y2="102"/>
    <line class="mo-gear" x1="122" y1="124" x2="122" y2="150"/>
    <!-- corps assis, immobile -->
    <circle class="mo-head" cx="120" cy="62" r="10"/>
    <line class="mo-body" x1="104" y1="78" x2="136" y2="78"/>
    <line class="mo-body" x1="120" y1="72" x2="120" y2="114"/>
    <line class="mo-body" x1="120" y1="114" x2="106" y2="118"/>
    <line class="mo-body" x1="120" y1="114" x2="134" y2="118"/>`,
  muscles: [
    { nom: "Grand dorsal",
      svg: `<ellipse cx="110" cy="94" rx="3.8" ry="11" transform="rotate(-8 110 94)"/>
            <ellipse cx="130" cy="94" rx="3.8" ry="11" transform="rotate(8 130 94)"/>` },
    { nom: "Trapèze inférieur",
      svg: `<ellipse cx="120" cy="84" rx="9" ry="3.6"/>` }
  ],
  parts: [
    {
      /* CÂBLE : s'allonge (×2,23) depuis la poulie quand la barre descend. */
      o: "120px 16px",
      k: [[0, "scaleY(1)"], [34, "scaleY(2.231)"], [42, "scaleY(2.231)"],
          [88, "scaleY(1)"], [100, "scaleY(1)"]],
      svg: `<line class="mo-cable" x1="120" y1="16" x2="120" y2="44"/>`
    },
    {
      /* BARRE : descend de 32 unités, à l'horizontale — elle ne tourne pas. */
      k: [[0, "translateY(0)"], [34, "translateY(32px)"], [42, "translateY(32px)"],
          [88, "translateY(0)"], [100, "translateY(0)"]],
      svg: `
        <line class="mo-bar3" x1="76" y1="44" x2="164" y2="44"/>
        <circle class="mo-hand" cx="82" cy="44" r="3.4"/>
        <circle class="mo-hand" cx="158" cy="44" r="3.4"/>`
    },
    {
      /* BRAS GAUCHE : enraciné à l'ÉPAULE (104, 78), qui est FIXE.
         −106° fait descendre le coude vers le bas et l'extérieur. */
      o: "104px 78px",
      k: [[0, "rotate(0deg)"], [34, "rotate(-106deg)"], [42, "rotate(-106deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="104" y1="78" x2="92.1" y2="59.5"/>
        <circle class="mo-joint" cx="92.1" cy="59.5" r="2.5"/>`,
      children: [
        { o: "92.1px 59.5px",
          k: [[0, "rotate(0deg)"], [34, "rotate(117deg)"], [42, "rotate(117deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `<line class="mo-limb" x1="92.1" y1="59.5" x2="82" y2="44"/>` }
      ]
    },
    {
      /* BRAS DROIT : miroir. */
      o: "136px 78px",
      k: [[0, "rotate(0deg)"], [34, "rotate(106deg)"], [42, "rotate(106deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="136" y1="78" x2="147.9" y2="59.5"/>
        <circle class="mo-joint" cx="147.9" cy="59.5" r="2.5"/>`,
      children: [
        { o: "147.9px 59.5px",
          k: [[0, "rotate(0deg)"], [34, "rotate(-117deg)"], [42, "rotate(-117deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `<line class="mo-limb" x1="147.9" y1="59.5" x2="158" y2="44"/>` }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M176 40 L176 74 M171 66 L176 74 L181 66"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M176 74 L176 40 M171 48 L176 40 L181 48"/>` }
  ]
};

/* =========================================================
   10. ROWING HALTÈRE UN BRAS  (rowing-haltere)
   -----------------------------------------------------------
   Position  : UNILATÉRAL. Un genou et la main opposée en appui
               sur un banc plat, l'autre pied au sol en arrière,
               dos PLAT et pratiquement HORIZONTAL, tête dans
               l'alignement du rachis.
   Matériel  : UN haltère dans la main libre, bras pendant à la
               verticale sous l'épaule.
   Mobiles   : coude (flexion) et épaule (extension) du côté
               chargé, avec rétraction de l'omoplate.
   Fixes     : le buste horizontal, qui ne doit PAS tourner
               (l'erreur classique est d'ouvrir l'épaule vers le
               plafond) ; la main et le genou d'appui ; le bassin.
   Sens/plan : haltère tiré vers la hanche = concentrique ;
               descente contrôlée = excentrique. Plan sagittal.
   ROM       : coude de ~175° (bras pendant) à ~71° (haltère à la
               hanche) — amplitude PLUS GRANDE qu'à la barre,
               puisque rien ne vient buter contre le tronc.
   Agonistes : grand dorsal, grand rond, trapèze moyen, deltoïde
               postérieur ; biceps en assistance.
   Distinction : buste HORIZONTAL et SOUTENU par l'appui (≠ les
               45° du rowing barre, où le tronc travaille en
               isométrie), travail un bras à la fois, et le coude
               longe le corps jusqu'à la hanche.
   ========================================================= */
EXERCISE_MOTIONS["rowing-haltere"] = {
  vb: "50 56 148 98",
  dur: 3.8,
  phases: { con: [0, 34], ecc: [42, 88] },
  alt: "Un genou et une main sur le banc, dos horizontal : l'haltère est tiré depuis le bras tendu jusqu'à la hanche, coude le long du corps.",
  fixe: `
    <line class="mo-ground" x1="56" y1="150" x2="192" y2="150"/>
    <!-- banc plat et ses pieds -->
    <rect class="mo-gear" x="60" y="100" width="84" height="8" rx="3"/>
    <line class="mo-gear" x1="70" y1="108" x2="70" y2="150"/>
    <line class="mo-gear" x1="134" y1="108" x2="134" y2="150"/>
    <!-- corps : dos horizontal, appuis main + genou sur le banc -->
    <circle class="mo-head" cx="74" cy="80" r="9"/>
    <line class="mo-body" x1="82" y1="83" x2="134" y2="88"/>
    <line class="mo-body" x1="92" y1="85" x2="96" y2="100"/>
    <circle class="mo-hand" cx="96" cy="100" r="3.2"/>
    <line class="mo-body" x1="134" y1="88" x2="130" y2="100"/>
    <line class="mo-body" x1="134" y1="88" x2="156" y2="122"/>
    <line class="mo-body" x1="156" y1="122" x2="152" y2="150"/>
    <!-- repère : le dos reste horizontal, il ne tourne pas -->
    <line class="mo-rom" x1="84" y1="83" x2="136" y2="88"/>`,
  muscles: [
    { nom: "Grand dorsal",
      svg: `<ellipse cx="104" cy="86" rx="13" ry="4.4" transform="rotate(6 104 86)"/>` },
    { nom: "Deltoïde postérieur",
      svg: `<circle cx="86" cy="84" r="4.4"/>` }
  ],
  parts: [
    {
      /* BRAS CHARGÉ : rotation autour de l'ÉPAULE (86, 84). −105,7° fait
         monter le coude EN ARRIÈRE, le long du corps, jusqu'à la hanche. */
      o: "86px 84px",
      k: [[0, "rotate(0deg)"], [34, "rotate(-105.7deg)"], [42, "rotate(-105.7deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Biceps brachial",
      muscle: `<ellipse cx="86" cy="95" rx="3.2" ry="7"/>`,
      svg: `
        <line class="mo-limb" x1="86" y1="84" x2="86" y2="106"/>
        <circle class="mo-joint" cx="86" cy="106" r="2.6"/>`,
      children: [
        {
          /* AVANT-BRAS + HALTÈRE : +108,8° relatif amène l'haltère à la
             hanche (106, 100). */
          o: "86px 106px",
          k: [[0, "rotate(0deg)"], [34, "rotate(108.8deg)"], [42, "rotate(108.8deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="86" y1="106" x2="86" y2="128"/>
            <line class="mo-bar2" x1="76" y1="128" x2="96" y2="128"/>
            <rect class="mo-mass" x="72" y="120" width="7" height="16" rx="2"/>
            <rect class="mo-mass" x="93" y="120" width="7" height="16" rx="2"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M62 130 L62 100 M57 108 L62 100 L67 108"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M62 100 L62 130 M57 122 L62 130 L67 122"/>` }
  ]
};

/* =========================================================
   11. SOULEVÉ DE TERRE  (souleve-de-terre)
   -----------------------------------------------------------
   Position  : debout devant une barre AU SOL, pieds largeur de
               bassin, barre au-dessus du milieu du pied et
               contre les tibias. Hanches hautes mais sous les
               épaules, genoux fléchis, dos PLAT, épaules
               légèrement en avant de la barre.
   Matériel  : barre olympique chargée AU SOL — c'est le rayon du
               disque qui fixe la hauteur de départ.
   Mobiles   : HANCHE (extension, dominante), GENOU (extension),
               cheville un peu. Le mouvement est une extension
               simultanée des deux.
   Fixes     : le RACHIS, qui garde sa courbure du début à la fin ;
               et les COUDES, verrouillés tendus — plier les bras
               sous une barre lourde est une faute dangereuse, le
               bras ne fait que suspendre.
   Sens/plan : montée de la barre le long des jambes jusqu'à la
               station debout = concentrique ; retour au sol =
               excentrique. Plan sagittal.
   ROM       : genou de ~112° à ~178°, hanche de ~55° de flexion
               à l'extension complète ; la barre monte de 28
               unités, verticalement, au contact des jambes.
   Agonistes : ischio-jambiers et grand fessier (moteurs de
               l'extension de hanche), érecteurs du rachis (qui
               tiennent le dos), quadriceps au décollage.
   Distinction : la barre REPART DU SOL à chaque répétition et les
               genoux sont franchement fléchis au départ — ≠ le
               soulevé de terre roumain, qui part debout, ne touche
               pas le sol et garde les genoux presque tendus.
               Pieds étroits, mains à l'extérieur des jambes ≠ sumo.
   Cinématique : chaîne enracinée à la CHEVILLE, qui reste au sol
               (cheville → genou → hanche → tronc → bras → barre),
               donc le pied ne décolle jamais et la barre monte
               bien à la verticale.
   ========================================================= */
EXERCISE_MOTIONS["souleve-de-terre"] = {
  vb: "56 26 132 130",
  dur: 4.2,
  phases: { con: [0, 36], ecc: [46, 90] },
  alt: "Barre au sol contre les tibias : extension simultanée des genoux et des hanches pour se redresser, dos plat et bras tendus, puis retour au sol.",
  fixe: `
    <line class="mo-ground" x1="60" y1="150" x2="184" y2="150"/>
    <line class="mo-body" x1="96" y1="150" x2="118" y2="150"/>`,
  parts: [
    {
      /* TIBIA : enraciné à la CHEVILLE (104, 146), qui reste au sol.
         +12° : le tibia se redresse à mesure que le genou s'étend. */
      o: "104px 146px",
      k: [[0, "rotate(0deg)"], [36, "rotate(12deg)"], [46, "rotate(12deg)"],
          [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-body" x1="104" y1="146" x2="97.7" y2="120.8"/>
        <circle class="mo-joint" cx="97.7" cy="120.8" r="2.6"/>`,
      children: [
        {
          /* CUISSE : extension du GENOU autour de (97.7, 120.8).
             −70,5° fait passer le genou de ~112° à ~178°. */
          o: "97.7px 120.8px",
          k: [[0, "rotate(0deg)"], [36, "rotate(-70.5deg)"], [46, "rotate(-70.5deg)"],
              [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Ischio-jambiers",
          muscle: `<ellipse cx="109" cy="114" rx="3.2" ry="8" transform="rotate(60 109 114)"/>`,
          svg: `
            <line class="mo-body" x1="97.7" y1="120.8" x2="120.3" y2="108"/>
            <circle class="mo-joint" cx="120.3" cy="108" r="2.6"/>`,
          children: [
            {
              /* TRONC : extension de la HANCHE autour de (120.3, 108), +97,5°.
                 Le rachis lui-même ne se déroule pas : segment rigide. */
              o: "120.3px 108px",
              k: [[0, "rotate(0deg)"], [36, "rotate(97.5deg)"], [46, "rotate(97.5deg)"],
                  [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: ["Grand fessier", "Érecteurs du rachis"],
              muscle: `<circle cx="118" cy="104" r="4.2"/>
                       <ellipse cx="106" cy="94" rx="2.8" ry="11" transform="rotate(-45 106 94)"/>`,
              childrenFirst: true,
              svg: `
                <line class="mo-body" x1="120.3" y1="108" x2="92" y2="79.7"/>
                <circle class="mo-head" cx="84" cy="72" r="9"/>`,
              children: [
                {
                  /* BRAS : suspendu à l'ÉPAULE (92, 79.7). Le coude reste
                     VERROUILLÉ : un seul segment rigide, jamais deux. */
                  o: "92px 79.7px",
                  k: [[0, "rotate(0deg)"], [36, "rotate(-34.8deg)"], [46, "rotate(-34.8deg)"],
                      [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
                  svg: `
                    <line class="mo-limb" x1="92" y1="79.7" x2="96" y2="134"/>
                    <circle class="mo-plate-o" cx="96" cy="134" r="12"/>
                    <circle class="mo-hub" cx="96" cy="134" r="2.8"/>`
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M152 132 L152 104 M147 112 L152 104 L157 112"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M152 104 L152 132 M147 124 L152 132 L157 124"/>` }
  ]
};

/* =========================================================
   12. ROWING T-BAR  (rowing-t-bar)
   -----------------------------------------------------------
   Position  : debout au-dessus de la barre, pieds de part et
               d'autre sur la plateforme, genoux fléchis, buste
               penché, dos plat.
   Matériel  : barre dont une extrémité est ANCRÉE AU SOL par un
               pivot, disques à l'autre bout, poignées parallèles
               près de la charge.
   Mobiles   : coude (flexion) et épaule (extension), rétraction
               des omoplates ; et la BARRE, qui tourne autour de
               son point d'ancrage.
   Fixes     : buste (son angle ne bouge pas), hanches, genoux,
               pieds sur la plateforme, et le point d'ancrage.
   Sens/plan : traction de la charge vers la poitrine =
               concentrique ; retour contrôlé = excentrique.
   ROM       : coude de ~170° à ~45°, la barre balayant un arc
               d'environ 18° autour de son ancrage.
   Agonistes : grand dorsal, trapèze moyen et rhomboïdes (le
               « milieu du dos » que l'exercice épaissit),
               deltoïde postérieur ; biceps en assistance.
   Distinction : la charge décrit un ARC DE CERCLE autour de
               l'ancrage — c'est LA différence avec le rowing
               barre libre, dont la trajectoire est verticale.
               Le guidage est ce qui permet de charger plus lourd.
   ========================================================= */
EXERCISE_MOTIONS["rowing-t-bar"] = {
  vb: "36 50 156 106",
  dur: 3.8,
  phases: { con: [0, 34], ecc: [42, 88] },
  alt: "Buste penché au-dessus d'une barre ancrée au sol : la charge est tirée vers la poitrine en décrivant un arc de cercle autour de l'ancrage.",
  fixe: `
    <line class="mo-ground" x1="42" y1="150" x2="186" y2="150"/>
    <!-- plateforme + ancrage pivot de la barre -->
    <rect class="mo-gear" x="60" y="142" width="96" height="8" rx="2"/>
    <circle class="mo-pulley" cx="52" cy="144" r="4.5"/>
    <!-- corps immobile : jambes fléchies, buste penché, dos plat -->
    <line class="mo-body" x1="134" y1="142" x2="128" y2="120"/>
    <line class="mo-body" x1="128" y1="120" x2="140" y2="98"/>
    <line class="mo-body" x1="140" y1="98" x2="104" y2="78"/>
    <circle class="mo-head" cx="94" cy="70" r="9"/>
    <line class="mo-rom" x1="140" y1="98" x2="106" y2="98"/>`,
  muscles: [
    { nom: "Trapèze moyen · Rhomboïdes",
      svg: `<ellipse cx="122" cy="88" rx="11" ry="4.2" transform="rotate(29 122 88)"/>` },
    { nom: "Deltoïde postérieur",
      svg: `<circle cx="106" cy="80" r="4.4"/>` }
  ],
  parts: [
    {
      /* BARRE : pivote autour de son ANCRAGE (52, 144) — l'arc de cercle
         qui signe le T-bar. −18° amène la charge vers la poitrine. */
      o: "52px 144px",
      k: [[0, "rotate(0deg)"], [34, "rotate(-18deg)"], [42, "rotate(-18deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-bar3" x1="52" y1="144" x2="116" y2="110"/>
        <circle class="mo-plate-o" cx="106" cy="115" r="11"/>
        <circle class="mo-hub" cx="106" cy="115" r="2.6"/>`
    },
    {
      /* BRAS : enraciné à l'ÉPAULE (104, 78), qui est fixe. −40,2° monte
         le coude en arrière ; la main suit exactement la poignée. */
      o: "104px 78px",
      k: [[0, "rotate(0deg)"], [34, "rotate(-40.2deg)"], [42, "rotate(-40.2deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Biceps brachial",
      muscle: `<ellipse cx="107" cy="86" rx="3" ry="6.5" transform="rotate(20 107 86)"/>`,
      svg: `
        <line class="mo-limb" x1="104" y1="78" x2="110.3" y2="94.8"/>
        <circle class="mo-joint" cx="110.3" cy="94.8" r="2.5"/>`,
      children: [
        { o: "110.3px 94.8px",
          k: [[0, "rotate(0deg)"], [34, "rotate(134.6deg)"], [42, "rotate(134.6deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="110.3" y1="94.8" x2="116" y2="110"/>
            <circle class="mo-hand" cx="116" cy="110" r="3.2"/>` }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M74 118 L64 92 M70 99 L64 92 L62 101"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M64 92 L74 118 M68 111 L74 118 L76 109"/>` }
  ]
};

/* =========================================================
   13. DÉVELOPPÉ MILITAIRE BARRE  (developpe-militaire)
   -----------------------------------------------------------
   Position  : DEBOUT, pieds largeur de bassin, abdominaux gainés
               et fessiers serrés, barre posée sur les clavicules
               et les deltoïdes antérieurs (position de rack),
               coudes bas et légèrement en avant.
   Matériel  : barre olympique, prise pronation largeur d'épaules.
               Vue de profil : on voit le disque.
   Mobiles   : épaule (flexion/abduction), coude (extension) ; et
               la tête, qui recule légèrement pour laisser passer
               la barre — d'où le trajet vertical du bar path.
   Fixes     : rachis et bassin, sans cambrure lombaire
               compensatoire (la faute classique) ; jambes tendues
               sans impulsion — c'est un développé STRICT.
   Sens/plan : poussée verticale au-dessus de la tête =
               concentrique ; descente aux clavicules =
               excentrique. Plan scapulaire.
   ROM       : coude d'environ 37° en position de rack (la barre
               repose près de l'épaule, le coude est donc très
               fléchi) à ~156° bras tendus, barre à l'aplomb du
               milieu du pied. Trajet de barre : 35 unités.
   Agonistes : deltoïde antérieur et moyen, triceps, trapèze
               supérieur ; gainage abdominal en isométrie, donc
               non animé.
   Distinction : DEBOUT et STRICT (≠ push press, avec impulsion
               des jambes ; ≠ développé épaules assis, qui a un
               dossier), et BARRE — un axe rigide qui doit
               contourner la tête, contrairement aux haltères qui
               montent de part et d'autre du visage.
   Vue de PROFIL : c'est elle qui montre le passage de la barre
   devant le visage puis son verrouillage au-dessus des oreilles.
   ========================================================= */
EXERCISE_MOTIONS["developpe-militaire"] = {
  vb: "80 10 122 148",
  dur: 3.9,
  phases: { con: [0, 36], ecc: [44, 90] },
  alt: "Debout, barre aux clavicules : poussée verticale au-dessus de la tête jusqu'aux bras tendus, sans impulsion des jambes, puis descente contrôlée.",
  /* GÉOMÉTRIE (calculée, pas estimée) — épaule S(118,66), bras L1=20,
     avant-bras L2=22.
     RACK : la barre repose DEVANT les clavicules, main H0(102,70) ; d=16,5.
       Loi des cosinus -> le coude tombe SOUS l'épaule, E0(117.1,86.0),
       coude fermé à ~46° : c'est la valeur réelle du front rack, la main
       étant très proche de l'épaule.
     VERROUILLAGE : bras tendu à l'aplomb du pied, H1(120,24.1),
       E1(118.95,46.0).
     -> bras +180,2° (le coude passe par l'avant), avant-bras −134,1°
        relatif. La tête est remontée et reculée pour que le disque passe
        DEVANT le menton sans jamais le recouvrir. */
  fixe: `
    <line class="mo-ground" x1="86" y1="150" x2="164" y2="150"/>
    <!-- corps debout, gainé, immobile -->
    <circle class="mo-head" cx="110" cy="47" r="9"/>
    <line class="mo-body" x1="118" y1="66" x2="120" y2="110"/>
    <line class="mo-body" x1="120" y1="110" x2="116" y2="150"/>
    <line class="mo-body" x1="120" y1="110" x2="126" y2="150"/>
    <!-- aplomb : la barre finit au-dessus du milieu du pied -->
    <line class="mo-rom" x1="120" y1="20" x2="120" y2="66"/>`,
  muscles: [
    { nom: "Deltoïde antérieur et moyen",
      svg: `<circle cx="118" cy="66" r="5.5"/>` },
    { nom: "Trapèze supérieur",
      svg: `<ellipse cx="114" cy="59" rx="6" ry="3.2" transform="rotate(-30 114 59)"/>` }
  ],
  parts: [
    {
      /* BRAS : rotation autour de l'ÉPAULE (118, 66). +180,2° : le coude
         part de sous l'épaule (rack), passe par l'avant, et finit à la
         verticale au-dessus — c'est la flexion d'épaule complète du press. */
      o: "118px 66px",
      k: [[0, "rotate(0deg)"], [36, "rotate(180.2deg)"], [44, "rotate(180.2deg)"],
          [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Triceps brachial",
      muscle: `<ellipse cx="117.5" cy="76" rx="3.2" ry="7.5"/>`,
      svg: `
        <line class="mo-limb" x1="118" y1="66" x2="117.1" y2="86"/>
        <circle class="mo-joint" cx="117.1" cy="86" r="2.6"/>`,
      children: [
        {
          /* AVANT-BRAS + BARRE : −134,1° relatif. En bas l'avant-bras monte
             en oblique du coude vers la barre posée sur les clavicules ;
             en haut il s'aligne sur le bras, coude verrouillé, barre à
             l'aplomb du milieu du pied. */
          o: "117.1px 86px",
          k: [[0, "rotate(0deg)"], [36, "rotate(-134.1deg)"], [44, "rotate(-134.1deg)"],
              [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="117.1" y1="86" x2="102" y2="70"/>
            <circle class="mo-plate-o" cx="102" cy="70" r="7.5"/>
            <circle class="mo-hub" cx="102" cy="70" r="2.6"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M148 66 L148 30 M143 38 L148 30 L153 38"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M148 30 L148 66 M143 58 L148 66 L153 58"/>` }
  ]
};

/* =========================================================
   14. ÉLÉVATIONS LATÉRALES  (elevations-laterales)
   -----------------------------------------------------------
   Position  : DEBOUT, pieds largeur de bassin, buste droit et
               très légèrement penché en avant, gainage serré,
               bras le long du corps.
   Matériel  : deux haltères, prise neutre, paumes vers les
               cuisses au départ.
   Mobiles   : ÉPAULE uniquement, en ABDUCTION dans le plan
               frontal.
   Fixes     : le COUDE, verrouillé à ~161° pendant toute la
               série — s'il se plie, ce n'est plus une élévation ;
               rachis, bassin, jambes. Aucun balancement du tronc
               (l'erreur classique : donner de l'élan aux hanches).
   Sens/plan : montée des bras sur les CÔTÉS jusqu'à l'horizontale
               = concentrique ; descente contrôlée = excentrique,
               c'est là que le deltoïde travaille le plus.
   ROM       : abduction de 0° (bras le long du corps) à ~90°
               (mains à hauteur d'épaules). On ne monte PAS plus
               haut : au-delà, c'est le trapèze qui prend le relais.
   Agonistes : deltoïde MOYEN (faisceau latéral) ; supra-épineux
               au démarrage.
   Distinction : plan FRONTAL et coude verrouillé — ≠ élévations
               frontales (plan sagittal, bras devant), ≠ oiseau
               (buste penché, abduction horizontale, deltoïde
               postérieur), ≠ développé épaules (le coude s'étend).
   Vue de FACE : un profil ne montrerait aucun déplacement.
   ========================================================= */
EXERCISE_MOTIONS["elevations-laterales"] = {
  vb: "44 22 152 132",
  dur: 3.6,
  phases: { con: [0, 30], ecc: [38, 86] },
  alt: "Debout, bras le long du corps : les haltères montent sur les côtés jusqu'à l'horizontale, coudes bloqués, puis redescendent lentement.",
  fixe: `
    <line class="mo-ground" x1="86" y1="150" x2="156" y2="150"/>
    <circle class="mo-head" cx="120" cy="42" r="10"/>
    <line class="mo-body" x1="104" y1="62" x2="136" y2="62"/>
    <line class="mo-body" x1="120" y1="52" x2="120" y2="108"/>
    <line class="mo-body" x1="120" y1="108" x2="110" y2="150"/>
    <line class="mo-body" x1="120" y1="108" x2="130" y2="150"/>
    <!-- repère : la hauteur à ne pas dépasser (ligne des épaules) -->
    <line class="mo-rom" x1="56" y1="62" x2="184" y2="62"/>`,
  muscles: [
    { nom: "Deltoïde moyen",
      svg: `<circle cx="104" cy="62" r="5.5"/><circle cx="136" cy="62" r="5.5"/>` }
  ],
  parts: [
    {
      /* BRAS GAUCHE : segment RIGIDE coudé à 161°, en abduction pure autour
         de l'ÉPAULE (104, 62). +73,7° amène la main à l'horizontale. */
      o: "104px 62px",
      k: [[0, "rotate(0deg)"], [30, "rotate(73.7deg)"], [38, "rotate(73.7deg)"],
          [86, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <polyline class="mo-limb" points="104,62 97,86 98,110"/>
        <circle class="mo-joint" cx="97" cy="86" r="2.4"/>
        <line class="mo-bar2" x1="90" y1="110" x2="106" y2="110"/>
        <rect class="mo-mass" x="86" y="103" width="6" height="14" rx="2"/>
        <rect class="mo-mass" x="104" y="103" width="6" height="14" rx="2"/>`
    },
    {
      /* BRAS DROIT : miroir exact. */
      o: "136px 62px",
      k: [[0, "rotate(0deg)"], [30, "rotate(-73.7deg)"], [38, "rotate(-73.7deg)"],
          [86, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <polyline class="mo-limb" points="136,62 143,86 142,110"/>
        <circle class="mo-joint" cx="143" cy="86" r="2.4"/>
        <line class="mo-bar2" x1="134" y1="110" x2="150" y2="110"/>
        <rect class="mo-mass" x="130" y="103" width="6" height="14" rx="2"/>
        <rect class="mo-mass" x="148" y="103" width="6" height="14" rx="2"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M76 104 L62 74 M69 81 L62 74 L60 84 M164 104 L178 74 M171 81 L178 74 L180 84"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M62 74 L76 104 M69 97 L76 104 L78 94 M178 74 L164 104 M171 97 L164 104 L162 94"/>` }
  ]
};

/* =========================================================
   15. DÉVELOPPÉ ÉPAULES HALTÈRES ASSIS  (developpe-halteres-assis)
   -----------------------------------------------------------
   Position  : ASSIS sur un banc à DOSSIER quasi vertical, dos
               plaqué contre le dossier, pieds à plat au sol.
   Matériel  : DEUX haltères indépendants, prise pronation,
               partant au niveau des oreilles, coudes sous les
               poignets.
   Mobiles   : épaule (flexion/abduction) et coude (extension).
   Fixes     : le dos plaqué au dossier — pas de cambrure
               lombaire compensatoire, c'est justement l'intérêt
               du dossier ; bassin et jambes.
   Sens/plan : poussée verticale = concentrique ; descente
               jusqu'aux oreilles = excentrique. Plan scapulaire.
   ROM       : coude de ~84° en bas (bras à l'horizontale) à
               ~161° en haut, avec CONVERGENCE des haltères l'un
               vers l'autre : l'écart entre les mains passe de 88
               à 24 unités.
   Agonistes : deltoïde antérieur et moyen, triceps, trapèze
               supérieur.
   Distinction : ASSIS avec dossier — le tronc est soutenu, alors
               qu'au développé militaire debout c'est le gainage
               qui tient tout. Et HALTÈRES indépendants qui
               convergent, contre une barre rigide qui doit
               contourner la tête.
   Vue de FACE : c'est la seule qui montre la convergence, la
   signature du mouvement aux haltères.
   ========================================================= */
EXERCISE_MOTIONS["developpe-halteres-assis"] = {
  vb: "44 8 152 146",
  dur: 3.9,
  phases: { con: [0, 34], ecc: [42, 88] },
  alt: "Assis dossier vertical, haltères au niveau des oreilles : poussée verticale jusqu'aux bras tendus, les haltères se rapprochant l'un de l'autre.",
  fixe: `
    <line class="mo-ground" x1="86" y1="150" x2="158" y2="150"/>
    <!-- dossier vertical derrière le dos + assise -->
    <line class="mo-pad" x1="120" y1="30" x2="120" y2="106"/>
    <line class="mo-pad" x1="100" y1="112" x2="142" y2="112"/>
    <!-- corps assis, dos plaqué, immobile -->
    <circle class="mo-head" cx="120" cy="46" r="10"/>
    <line class="mo-body" x1="104" y1="66" x2="136" y2="66"/>
    <line class="mo-body" x1="120" y1="56" x2="120" y2="104"/>
    <line class="mo-body" x1="120" y1="104" x2="104" y2="118"/>
    <line class="mo-body" x1="120" y1="104" x2="136" y2="118"/>
    <line class="mo-body" x1="104" y1="118" x2="102" y2="150"/>
    <line class="mo-body" x1="136" y1="118" x2="138" y2="150"/>`,
  muscles: [
    { nom: "Deltoïde antérieur et moyen",
      svg: `<circle cx="104" cy="66" r="5.5"/><circle cx="136" cy="66" r="5.5"/>` }
  ],
  parts: [
    {
      /* BRAS GAUCHE : rotation autour de l'ÉPAULE (104, 66), +125°. */
      o: "104px 66px",
      k: [[0, "rotate(0deg)"], [34, "rotate(125deg)"], [42, "rotate(125deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Triceps brachial",
      muscle: `<ellipse cx="97" cy="73" rx="3.2" ry="7" transform="rotate(-43 97 73)"/>`,
      svg: `
        <line class="mo-limb" x1="104" y1="66" x2="90.4" y2="80.6"/>
        <circle class="mo-joint" cx="90.4" cy="80.6" r="2.5"/>`,
      children: [
        {
          /* AVANT-BRAS + HALTÈRE : −62,2° relatif. La main passe de (76,64)
             à (108,26) : c'est cette CONVERGENCE qui signe les haltères. */
          o: "90.4px 80.6px",
          k: [[0, "rotate(0deg)"], [34, "rotate(-62.2deg)"], [42, "rotate(-62.2deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="90.4" y1="80.6" x2="76" y2="64"/>
            <line class="mo-bar2" x1="68" y1="56" x2="84" y2="72"/>
            <rect class="mo-mass" x="63" y="50" width="6" height="14" rx="2" transform="rotate(45 66 57)"/>
            <rect class="mo-mass" x="81" y="68" width="6" height="14" rx="2" transform="rotate(45 84 75)"/>`
        }
      ]
    },
    {
      /* BRAS DROIT : miroir exact. */
      o: "136px 66px",
      k: [[0, "rotate(0deg)"], [34, "rotate(-125deg)"], [42, "rotate(-125deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscle: `<ellipse cx="143" cy="73" rx="3.2" ry="7" transform="rotate(43 143 73)"/>`,
      svg: `
        <line class="mo-limb" x1="136" y1="66" x2="149.6" y2="80.6"/>
        <circle class="mo-joint" cx="149.6" cy="80.6" r="2.5"/>`,
      children: [
        { o: "149.6px 80.6px",
          k: [[0, "rotate(0deg)"], [34, "rotate(62.2deg)"], [42, "rotate(62.2deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="149.6" y1="80.6" x2="164" y2="64"/>
            <line class="mo-bar2" x1="156" y1="72" x2="172" y2="56"/>
            <rect class="mo-mass" x="153" y="68" width="6" height="14" rx="2" transform="rotate(-45 156 75)"/>
            <rect class="mo-mass" x="171" y="50" width="6" height="14" rx="2" transform="rotate(-45 174 57)"/>` }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M58 74 L58 36 M53 44 L58 36 L63 44"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M58 36 L58 74 M53 66 L58 74 L63 66"/>` }
  ]
};

/* =========================================================
   16. OISEAU (ÉLÉVATIONS BUSTE PENCHÉ)  (oiseau-halteres)
   >>> SCHÉMA NON LIVRÉ — SIGNALÉ PLUTÔT QUE BÂCLÉ <<<
   -----------------------------------------------------------
   L'analyse du mouvement est faite : DEBOUT buste penché
   jusqu'à l'horizontale, coude verrouillé à ~160°, ABDUCTION
   HORIZONTALE d'épaule sur ~87°, agonistes deltoïde postérieur,
   trapèze moyen et rhomboïdes.
   Le problème est de PROJECTION, pas d'analyse :
   • de PROFIL, la posture penchée se lit parfaitement mais les
     bras s'écartent vers l'observateur et vers le fond — leur
     déplacement est presque invisible ;
   • de FACE (personne penchée vers l'observateur), l'écartement
     des bras est parfait mais le tronc raccourci ne se lit plus :
     trois essais successifs (bassin haut, jambes écartées, tête
     occultante) donnent tous une silhouette qu'un lecteur prend
     pour une élévation latérale DEBOUT — c'est-à-dire un schéma
     TROMPEUR, précisément ce qu'il faut éviter.
   Décision : pas de schéma dédié pour l'instant. L'exercice
   retombe donc sur le pictogramme générique, explicitement
   étiqueté comme tel.
   Piste pour plus tard : un schéma en DEUX VIGNETTES — la
   posture de profil d'un côté, le mouvement des bras de face de
   l'autre — ce que le moteur ne sait pas encore composer.
   ========================================================= */

/* =========================================================
   17. FACE PULL À LA POULIE  (face-pull)
   -----------------------------------------------------------
   Position  : DEBOUT face à une poulie réglée à hauteur de
               VISAGE, un pied devant, léger recul pour mettre le
               câble en tension, gainage serré.
   Matériel  : corde double, prise neutre pouces vers soi.
   Mobiles   : épaule (abduction horizontale + ROTATION EXTERNE)
               et coude (flexion), avec rétraction des omoplates.
   Fixes     : rachis, bassin, jambes — aucun recul du buste pour
               aider.
   Sens/plan : traction de la corde VERS LE VISAGE, coudes hauts,
               mains qui finissent de part et d'autre de la tête =
               concentrique ; retour contrôlé = excentrique.
               Plan transverse.
   ROM       : coude de ~141° (bras tendus) à ~77° ; les coudes
               s'écartent largement et montent à hauteur d'épaules.
   Agonistes : deltoïde postérieur, trapèze moyen et inférieur,
               rhomboïdes, et surtout les ROTATEURS EXTERNES
               (infra-épineux, petit rond) — c'est ce qui en fait
               un exercice de santé d'épaule.
   Distinction : la corde arrive au VISAGE et les coudes restent
               HAUTS — ≠ tirage horizontal, où les coudes longent
               le corps et les mains vont au ventre ; ≠ oiseau, où
               les bras restent tendus sans flexion de coude.
   VUE CHOISIE : de DOS. C'est elle qui montre à la fois
   l'écartement des coudes, les mains qui arrivent au niveau des
   oreilles, et les omoplates qui se serrent.
   ========================================================= */
EXERCISE_MOTIONS["face-pull"] = {
  vb: "44 6 152 150",
  dur: 3.8,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Debout face à une poulie haute, vue de dos : la corde est tirée vers le visage, coudes hauts et écartés, mains de part et d'autre de la tête.",
  fixe: `
    <line class="mo-ground" x1="86" y1="152" x2="158" y2="152"/>
    <!-- poulie à hauteur de visage, devant la personne -->
    <circle class="mo-pulley" cx="120" cy="22" r="5"/>
    <line class="mo-gear" x1="108" y1="14" x2="132" y2="14"/>
    <!-- dos de la personne : tête, épaules, rachis, fente légère -->
    <circle class="mo-head" cx="120" cy="52" r="10"/>
    <line class="mo-body" x1="102" y1="72" x2="138" y2="72"/>
    <line class="mo-body" x1="120" y1="62" x2="120" y2="116"/>
    <line class="mo-body" x1="120" y1="116" x2="108" y2="152"/>
    <line class="mo-body" x1="120" y1="116" x2="134" y2="148"/>`,
  muscles: [
    { nom: "Deltoïde postérieur",
      svg: `<circle cx="102" cy="72" r="5"/><circle cx="138" cy="72" r="5"/>` },
    { nom: "Trapèze moyen · Rhomboïdes",
      svg: `<ellipse cx="120" cy="82" rx="11" ry="6"/>` }
  ],
  parts: [
    {
      /* CORDE GAUCHE : tourne autour de la POULIE (120, 22) et s'allonge
         (×3,08) pour rester accrochée à la main. */
      o: "120px 22px",
      k: [[0, "rotate(0deg) scale(1)"], [32, "rotate(6.3deg) scale(3.08)"],
          [40, "rotate(6.3deg) scale(3.08)"], [88, "rotate(0deg) scale(1)"], [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="120" y1="22" x2="113" y2="30"/>`
    },
    {
      /* CORDE DROITE : miroir. */
      o: "120px 22px",
      k: [[0, "rotate(0deg) scale(1)"], [32, "rotate(-6.3deg) scale(3.08)"],
          [40, "rotate(-6.3deg) scale(3.08)"], [88, "rotate(0deg) scale(1)"], [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="120" y1="22" x2="127" y2="30"/>`
    },
    {
      /* BRAS GAUCHE : −61,4° écarte le COUDE largement vers l'extérieur —
         c'est la signature du face pull, coude haut et non collé au corps. */
      o: "102px 72px",
      k: [[0, "rotate(0deg)"], [32, "rotate(-61.4deg)"], [40, "rotate(-61.4deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="102" y1="72" x2="99.9" y2="50.1"/>
        <circle class="mo-joint" cx="99.9" cy="50.1" r="2.5"/>`,
      children: [
        { o: "99.9px 50.1px",
          k: [[0, "rotate(0deg)"], [32, "rotate(64.5deg)"], [40, "rotate(64.5deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="99.9" y1="50.1" x2="113" y2="30"/>
            <circle class="mo-hand" cx="113" cy="30" r="3.2"/>` }
      ]
    },
    {
      /* BRAS DROIT : miroir. */
      o: "138px 72px",
      k: [[0, "rotate(0deg)"], [32, "rotate(61.4deg)"], [40, "rotate(61.4deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="138" y1="72" x2="140.1" y2="50.1"/>
        <circle class="mo-joint" cx="140.1" cy="50.1" r="2.5"/>`,
      children: [
        { o: "140.1px 50.1px",
          k: [[0, "rotate(0deg)"], [32, "rotate(-64.5deg)"], [40, "rotate(-64.5deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="140.1" y1="50.1" x2="127" y2="30"/>
            <circle class="mo-hand" cx="127" cy="30" r="3.2"/>` }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M70 30 L62 58 M62 49 L62 58 L70 54"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M62 58 L70 30 M70 39 L70 30 L62 34"/>` }
  ]
};

/* =========================================================
   18. CURL BICEPS À LA BARRE  (curl-barre)
   -----------------------------------------------------------
   Position  : DEBOUT, pieds largeur de bassin, buste droit et
               gainé, COUDES COLLÉS au buste, bras le long du
               corps, barre tenue en supination.
   Matériel  : barre droite ou EZ, prise supination largeur
               d'épaules. Vue de profil : on voit le disque.
   Mobiles   : le COUDE, et lui seul (flexion).
   Fixes     : l'ÉPAULE — le bras ne bouge pas d'un degré, c'est
               LE point technique : si le coude avance, l'épaule
               prend le travail ; le rachis (aucun balancement du
               buste, l'erreur classique), le bassin, les jambes.
   Sens/plan : flexion du coude pour amener la barre vers les
               épaules = concentrique ; descente contrôlée =
               excentrique. Plan sagittal.
   ROM       : coude de ~172° (bras tendus) à ~45°. On ne monte
               PAS plus haut : au-delà, l'épaule prend le relais
               et la tension quitte le biceps.
   Agonistes : biceps brachial, brachial antérieur, brachio-radial.
   Distinction : DEBOUT coudes libres le long du corps — ≠ curl
               au pupitre (bras posé sur un plan incliné, épaule
               en flexion), ≠ curl incliné (épaule en extension,
               bras derrière le corps). Et BARRE : les deux mains
               sont liées, il n'y a pas d'alternance.
   Le bras est dessiné dans les éléments FIXES : c'est la
   manière la plus honnête de montrer qu'il ne bouge pas.
   ========================================================= */
EXERCISE_MOTIONS["curl-barre"] = {
  vb: "56 36 132 120",
  dur: 3.6,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Debout, coudes collés au buste : la barre monte par flexion des coudes jusqu'aux épaules, puis redescend lentement. Le bras ne bouge pas.",
  fixe: `
    <line class="mo-ground" x1="92" y1="152" x2="152" y2="152"/>
    <!-- corps debout et gainé, immobile -->
    <circle class="mo-head" cx="116" cy="52" r="9"/>
    <line class="mo-body" x1="124" y1="62" x2="128" y2="112"/>
    <line class="mo-body" x1="128" y1="112" x2="124" y2="152"/>
    <line class="mo-body" x1="128" y1="112" x2="134" y2="152"/>
    <!-- BRAS : dessiné parmi les éléments fixes, car il ne bouge pas.
         Épaule reliée au buste, puis segment STRICTEMENT VERTICAL :
         c'est la lecture du point technique (le coude n'avance pas). -->
    <line class="mo-limb" x1="125" y1="65" x2="114" y2="68"/>
    <line class="mo-limb" x1="114" y1="68" x2="114" y2="92"/>
    <circle class="mo-joint" cx="114" cy="92" r="2.8"/>
    <!-- repère d'amplitude : l'arc réellement parcouru par la barre -->
    <path class="mo-rom" fill="none" d="M114 118 A26 26 0 0 1 95 74.3"/>`,
  muscles: [
    { nom: "Biceps brachial",
      svg: `<ellipse cx="114" cy="79" rx="3.6" ry="9"/>` }
  ],
  parts: [
    {
      /* AVANT-BRAS + BARRE : rotation autour du COUDE (116, 92) uniquement.
         +135° amène la barre au niveau des épaules, coude fermé à ~45°. */
      o: "114px 92px",
      k: [[0, "rotate(0deg)"], [32, "rotate(133deg)"], [40, "rotate(133deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="114" y1="92" x2="114" y2="118"/>
        <circle class="mo-plate-o" cx="114" cy="118" r="10"/>
        <circle class="mo-hub" cx="114" cy="118" r="2.6"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M150 122 L150 84 M145 92 L150 84 L155 92"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M150 84 L150 122 M145 114 L150 122 L155 114"/>` }
  ]
};

/* =========================================================
   19. CURL INCLINÉ AUX HALTÈRES  (curl-incline)
   -----------------------------------------------------------
   Position  : ASSIS-ALLONGÉ sur un banc INCLINÉ à ~55-60°, dos
               plaqué, bras pendants LIBREMENT DERRIÈRE la ligne
               du corps — c'est cette position qui met le biceps
               en étirement dès le départ.
   Matériel  : deux haltères, prise supination.
   Mobiles   : le COUDE (flexion).
   Fixes     : l'ÉPAULE, maintenue en EXTENSION (le bras reste
               derrière le buste pendant toute la série — s'il
               remonte, l'étirement disparaît) ; le dos plaqué
               au dossier.
   Sens/plan : flexion du coude = concentrique ; retour en
               étirement complet = excentrique, phase clé de cet
               exercice. Plan sagittal.
   ROM       : coude de ~175° (extension complète, bras derrière)
               à ~50°. L'amplitude basse est PLUS GRANDE qu'au
               curl debout puisque l'épaule est en extension.
   Agonistes : biceps brachial, particulièrement sa longue portion
               (celle qui traverse l'épaule et se retrouve étirée).
   Distinction : le bras part DERRIÈRE le corps sur un dossier
               incliné — ≠ curl debout (bras vertical le long du
               corps), ≠ curl pupitre (bras devant, sur un appui).
   ========================================================= */
EXERCISE_MOTIONS["curl-incline"] = {
  vb: "48 26 152 130",
  dur: 3.8,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Assis sur un banc incliné, bras pendant derrière le corps : l'haltère monte par flexion du coude, puis redescend en étirement complet.",
  fixe: `
    <line class="mo-ground" x1="60" y1="152" x2="192" y2="152"/>
    <!-- banc incliné ~57° : dossier + assise + pieds -->
    <line class="mo-pad" x1="86" y1="52" x2="126" y2="112"/>
    <line class="mo-pad" x1="126" y1="112" x2="166" y2="116"/>
    <line class="mo-gear" x1="96" y1="66" x2="96" y2="152"/>
    <line class="mo-gear" x1="160" y1="118" x2="160" y2="152"/>
    <!-- corps plaqué au dossier -->
    <circle class="mo-head" cx="80" cy="46" r="9"/>
    <line class="mo-body" x1="86" y1="53" x2="122" y2="106"/>
    <line class="mo-body" x1="122" y1="106" x2="160" y2="114"/>
    <line class="mo-body" x1="160" y1="114" x2="166" y2="152"/>
    <!-- BRAS : fixe, en EXTENSION d'épaule, il pend DERRIÈRE le buste -->
    <line class="mo-limb" x1="92" y1="62" x2="86" y2="88"/>
    <circle class="mo-joint" cx="86" cy="88" r="2.8"/>
    <!-- repère d'amplitude : l'arc réellement parcouru par l'haltère -->
    <path class="mo-rom" fill="none" d="M84 114 A26.1 26.1 0 0 1 66.7 70.4"/>`,
  muscles: [
    { nom: "Biceps brachial (longue portion)",
      svg: `<ellipse cx="91" cy="75" rx="3.6" ry="9" transform="rotate(13 91 75)"/>` }
  ],
  parts: [
    {
      /* AVANT-BRAS + HALTÈRE : rotation autour du COUDE (86, 88).
         +128° referme le coude de ~175° à ~50°. */
      o: "86px 88px",
      k: [[0, "rotate(0deg)"], [32, "rotate(128deg)"], [40, "rotate(128deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="86" y1="88" x2="84" y2="114"/>
        <line class="mo-bar2" x1="74" y1="114" x2="94" y2="115"/>
        <rect class="mo-mass" x="70" y="107" width="7" height="15" rx="2"/>
        <rect class="mo-mass" x="91" y="108" width="7" height="15" rx="2"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M58 116 L58 78 M53 86 L58 78 L63 86"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M58 78 L58 116 M53 108 L58 116 L63 108"/>` }
  ]
};

/* =========================================================
   20. CURL MARTEAU  (curl-marteau)
   -----------------------------------------------------------
   Position  : DEBOUT, buste droit et gainé, coudes collés au
               buste, bras le long du corps.
   Matériel  : deux haltères tenus en PRISE NEUTRE — pouces vers
               le haut, comme on tient un marteau. C'est toute la
               différence : l'haltère reste PARALLÈLE au corps
               pendant tout le mouvement au lieu d'être
               perpendiculaire.
   Mobiles   : le COUDE (flexion), sans aucune supination.
   Fixes     : l'ÉPAULE, le poignet (qui ne tourne pas — c'est ce
               qui définit le marteau), le rachis, le bassin.
   Sens/plan : flexion du coude en gardant les pouces vers le
               haut = concentrique ; descente contrôlée =
               excentrique. Plan sagittal.
   ROM       : coude de ~172° à ~45°.
   Agonistes : BRACHIO-RADIAL et BRACHIAL ANTÉRIEUR en premier —
               c'est là que le marteau se distingue : la prise
               neutre place le biceps en position moins favorable
               et transfère le travail sur ces deux muscles, ceux
               qui épaississent l'avant-bras.
   Distinction : prise NEUTRE (≠ supination du curl barre ou
               haltères classique), donc l'haltère est dessiné
               DANS L'AXE de l'avant-bras et non en travers.
   ========================================================= */
EXERCISE_MOTIONS["curl-marteau"] = {
  vb: "56 36 132 120",
  dur: 3.5,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Debout, haltères tenus pouces vers le haut : flexion du coude en gardant la prise neutre, l'haltère restant dans l'axe de l'avant-bras.",
  fixe: `
    <line class="mo-ground" x1="92" y1="152" x2="152" y2="152"/>
    <circle class="mo-head" cx="116" cy="52" r="9"/>
    <line class="mo-body" x1="124" y1="62" x2="128" y2="112"/>
    <line class="mo-body" x1="128" y1="112" x2="124" y2="152"/>
    <line class="mo-body" x1="128" y1="112" x2="134" y2="152"/>
    <!-- BRAS fixe, coude collé au buste, segment vertical -->
    <line class="mo-limb" x1="125" y1="65" x2="114" y2="68"/>
    <line class="mo-limb" x1="114" y1="68" x2="114" y2="92"/>
    <circle class="mo-joint" cx="114" cy="92" r="2.8"/>
    <path class="mo-rom" fill="none" d="M114 118 A26 26 0 0 1 95 74.3"/>`,
  muscles: [
    { nom: "Brachial antérieur",
      svg: `<ellipse cx="114" cy="79" rx="3.4" ry="9"/>` }
  ],
  parts: [
    {
      /* AVANT-BRAS + HALTÈRE EN PRISE NEUTRE : rotation autour du COUDE.
         L'haltère est dessiné DANS L'AXE de l'avant-bras — c'est la
         signature du marteau, à l'opposé du curl en supination où il
         est perpendiculaire. */
      o: "114px 92px",
      k: [[0, "rotate(0deg)"], [32, "rotate(133deg)"], [40, "rotate(133deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Brachio-radial",
      muscle: `<ellipse cx="114" cy="104" rx="3.4" ry="9"/>`,
      svg: `
        <line class="mo-limb" x1="114" y1="92" x2="114" y2="114"/>
        <line class="mo-bar2" x1="114" y1="106" x2="114" y2="128"/>
        <rect class="mo-mass" x="107" y="103" width="14" height="7" rx="2"/>
        <rect class="mo-mass" x="107" y="124" width="14" height="7" rx="2"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M150 126 L150 88 M145 96 L150 88 L155 96"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M150 88 L150 126 M145 118 L150 126 L155 118"/>` }
  ]
};

/* =========================================================
   21. CURL AU PUPITRE (LARRY SCOTT)  (curl-pupitre)
   -----------------------------------------------------------
   Position  : au pupitre, ARRIÈRE DES BRAS PLAQUÉ sur le plan
               incliné à ~45°, aisselles calées contre le haut du
               pupitre, buste redressé. (Représenté DEBOUT : c'est
               un usage courant du pupitre, et cela évite qu'un
               siège et des jambes encombrent la lecture du seul
               mécanisme qui compte ici, le coude.)
   Matériel  : barre EZ ou haltère en supination, posée sur un
               pupitre rembourré incliné.
   Mobiles   : le COUDE, et lui seul (flexion).
   Fixes     : l'ÉPAULE, maintenue en FLEXION d'environ 45° par le
               pupitre. C'est LA différence de cet exercice : ailleurs
               « ne bouge pas le coude » est une consigne, ici le
               support l'INTERDIT physiquement. Aucun balancement
               possible : c'est l'isolation la plus stricte du biceps.
   Sens/plan : flexion du coude pour remonter la barre le long du
               plan = concentrique ; retour en étirement = excentrique.
               Plan sagittal.
   ROM       : coude de ~160° à ~55°. On ne va PAS jusqu'à
               l'extension complète en bas : sur un pupitre, bras
               calés, la position basse met le tendon distal du
               biceps sous une tension extrême — d'où la légère
               flexion conservée.
   Agonistes : BRACHIAL ANTÉRIEUR et la COURTE PORTION du biceps.
               L'épaule étant fléchie, la longue portion (qui croise
               l'épaule) part déjà raccourcie et travaille mal : le
               relais est pris par le brachial et la courte portion.
               C'est l'exact inverse du curl incliné.
   Distinction : les trois curls se distinguent par la position de
               l'ÉPAULE, pas par celle du coude — pupitre : épaule
               FLÉCHIE, bras devant sur un appui ; debout : épaule
               NEUTRE, bras vertical ; incliné : épaule en EXTENSION,
               bras derrière le corps.
   GÉOMÉTRIE (calculée) — épaule S(136,68) au sommet du pupitre,
   bras L1=20 couché SUR le plan -> coude E(121.4,81.7).
   Avant-bras L2=22. Bas : coude à 160°, main H0(111.5,101.4).
   Haut : coude à 55°, main H1(118.2,59.9). -> rotation +145°.
   ========================================================= */
EXERCISE_MOTIONS["curl-pupitre"] = {
  vb: "90 30 86 128",
  dur: 3.7,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Arrière des bras plaqué sur le pupitre incliné : la barre remonte par la seule flexion des coudes, puis redescend sans tendre complètement les bras.",
  fixe: `
    <line class="mo-ground" x1="96" y1="150" x2="168" y2="150"/>
    <!-- pupitre : plan incliné rembourré + montant -->
    <line class="mo-pad" x1="134" y1="70" x2="100" y2="102"/>
    <line class="mo-gear" x1="108" y1="96" x2="108" y2="150"/>
    <!-- corps debout contre le pupitre -->
    <circle class="mo-head" cx="129" cy="42" r="9"/>
    <line class="mo-body" x1="136" y1="68" x2="138" y2="110"/>
    <line class="mo-body" x1="138" y1="110" x2="134" y2="150"/>
    <line class="mo-body" x1="138" y1="110" x2="142" y2="150"/>
    <!-- BRAS : dans les éléments FIXES, couché sur le plan incliné —
         le pupitre lui interdit tout mouvement. -->
    <line class="mo-limb" x1="136" y1="68" x2="121.4" y2="81.7"/>
    <circle class="mo-joint" cx="121.4" cy="81.7" r="2.8"/>
    <!-- repère d'amplitude : l'arc réellement parcouru par la barre -->
    <path class="mo-rom" fill="none" d="M111.5 101.4 A22 22 0 0 1 118.2 59.9"/>`,
  muscles: [
    { nom: "Brachial antérieur",
      svg: `<ellipse cx="131" cy="78" rx="3.2" ry="7" transform="rotate(47 131 78)"/>` },
    { nom: "Biceps (courte portion)",
      svg: `<ellipse cx="126.5" cy="73.5" rx="3.2" ry="7" transform="rotate(47 126.5 73.5)"/>` }
  ],
  parts: [
    {
      /* AVANT-BRAS + BARRE : rotation autour du COUDE (121.4, 81.7).
         +145° referme le coude de ~160° à ~55°. La main part en dessous
         du bord bas du pupitre et remonte le long du plan. */
      o: "121.4px 81.7px",
      k: [[0, "rotate(0deg)"], [32, "rotate(145deg)"], [40, "rotate(145deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="121.4" y1="81.7" x2="111.5" y2="101.4"/>
        <circle class="mo-plate-o" cx="111.5" cy="101.4" r="7"/>
        <circle class="mo-hub" cx="111.5" cy="101.4" r="2.6"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M162 104 L162 66 M157 74 L162 66 L167 74"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M162 66 L162 104 M157 96 L162 104 L167 96"/>` }
  ]
};

/* =========================================================
   22. EXTENSION TRICEPS À LA POULIE HAUTE  (extension-poulie)
   -----------------------------------------------------------
   Position  : DEBOUT face à la poulie HAUTE, pieds largeur de
               bassin, buste très légèrement penché vers la machine,
               gainé, COUDES COLLÉS au buste.
   Matériel  : poulie haute + barre droite (ou corde). Le câble
               descend d'en haut : tension continue, y compris en
               position haute — ce que ne donne aucune barre libre.
   Mobiles   : le COUDE, et lui seul (EXTENSION).
   Fixes     : l'ÉPAULE — le bras reste vertical le long du corps.
               Si le coude s'écarte ou que l'épaule part en
               extension, ce n'est plus le triceps qui pousse mais
               le dos. Le rachis aussi : pas de coup de buste pour
               lancer la charge, l'erreur la plus fréquente.
   Sens/plan : ATTENTION, c'est l'inverse des curls — le
               CONCENTRIQUE va VERS LE BAS (extension du coude), la
               remontée est l'excentrique. Plan sagittal.
   ROM       : coude d'environ 80° (position haute, avant-bras
               au-dessus de l'horizontale) à ~175° en bas. On ne
               remonte pas plus haut que ~80° : au-delà les coudes
               décollent du buste.
   Agonistes : TRICEPS BRACHIAL, ses trois chefs. L'épaule étant
               neutre, la longue portion travaille en position
               moyenne — c'est justement ce qui distingue ce
               mouvement de l'extension au-dessus de la tête, où
               cette même longue portion est mise en étirement.
   Distinction : câble venant d'EN HAUT et bras le long du corps.
               ≠ barre au front (allongé, épaule à 90°), ≠ extension
               nuque (bras au-dessus de la tête).
   GÉOMÉTRIE (calculée) — épaule S(128,66), bras L1=22 vertical ->
   coude E(127,88) ; avant-bras L2=22.
   Haut : coude 80°, main H0(105.5,83.2). Bas : coude 175°,
   main H1(124.1,109.8). -> avant-bras −95°.
   CÂBLE : poulie P(96,30). |P->H0| = 54.0 à 79.9° ; |P->H1| = 84.6
   à 70.6°. -> rotate(−9.3°) scale(1.566) autour de la poulie, ce
   qui fait suivre exactement la main.
   ========================================================= */
EXERCISE_MOTIONS["extension-poulie"] = {
  vb: "86 20 96 138",
  dur: 3.5,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Face à la poulie haute, coudes collés au buste : les avant-bras poussent la barre vers le bas jusqu'aux bras tendus, puis remontent lentement.",
  fixe: `
    <line class="mo-ground" x1="92" y1="152" x2="174" y2="152"/>
    <!-- colonne + poulie haute -->
    <line class="mo-gear" x1="96" y1="34" x2="96" y2="152"/>
    <circle class="mo-pulley" cx="96" cy="30" r="5"/>
    <!-- corps debout, très légèrement penché vers la machine -->
    <circle class="mo-head" cx="125" cy="48" r="9"/>
    <line class="mo-body" x1="133" y1="64" x2="136" y2="110"/>
    <line class="mo-body" x1="136" y1="110" x2="132" y2="152"/>
    <line class="mo-body" x1="136" y1="110" x2="141" y2="152"/>
    <!-- BRAS : dans les éléments FIXES, épaule reliée au buste puis segment
         STRICTEMENT VERTICAL — le coude ne quitte pas le flanc. -->
    <line class="mo-limb" x1="133" y1="65" x2="127" y2="68"/>
    <line class="mo-limb" x1="127" y1="68" x2="127" y2="90"/>
    <circle class="mo-joint" cx="127" cy="90" r="2.8"/>
    <!-- repère d'amplitude : l'arc réellement parcouru par la barre -->
    <path class="mo-rom" fill="none" d="M105.34 86.18 A22 22 0 0 0 125.08 111.91"/>`,
  muscles: [
    { nom: "Triceps brachial (3 chefs)",
      svg: `<ellipse cx="129.4" cy="79" rx="3.2" ry="8"/>` }
  ],
  parts: [
    {
      /* CÂBLE : rotation + mise à l'échelle autour de la POULIE, de sorte
         que son extrémité colle à la main pendant tout le mouvement. */
      o: "96px 30px",
      k: [[0, "rotate(0deg) scale(1)"], [32, "rotate(-10.1deg) scale(1.5263)"],
          [40, "rotate(-10.1deg) scale(1.5263)"], [88, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="96" y1="30" x2="105.34" y2="86.18"/>`
    },
    {
      /* AVANT-BRAS + BARRE : rotation autour du COUDE (127, 90).
         −95° tend le coude de 80° à 175°. La barre reste perpendiculaire
         à l'avant-bras : c'est la prise pronation de la barre droite. */
      o: "127px 90px",
      k: [[0, "rotate(0deg)"], [32, "rotate(-95deg)"], [40, "rotate(-95deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="127" y1="90" x2="105.34" y2="86.18"/>
        <line class="mo-bar2" x1="106.56" y1="79.29" x2="104.12" y2="93.08"/>
        <circle class="mo-hand" cx="105.34" cy="86.18" r="3"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M158 76 L158 114 M153 106 L158 114 L163 106"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M158 114 L158 76 M153 84 L158 76 L163 84"/>` }
  ]
};
