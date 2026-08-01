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

/* =========================================================
   23. BARRE AU FRONT  (barre-au-front)
   -----------------------------------------------------------
   Position  : ALLONGÉ sur un banc plat, pieds au sol, barre EZ en
               pronation, BRAS pointant vers le plafond (épaule
               fléchie à ~90°, très légèrement inclinée vers la tête
               pour conserver de la tension en haut).
   Matériel  : barre EZ (ou droite) + banc plat.
   Mobiles   : le COUDE.
   Fixes     : l'ÉPAULE. L'humérus reste dirigé vers le plafond et
               ne bouge pas. Si le coude part vers l'arrière, le
               mouvement devient un pull-over et le grand dorsal
               prend le relais : c'est l'erreur qui vide l'exercice
               de son intérêt.
   Sens/plan : la barre DESCEND vers le front par flexion du coude
               = EXCENTRIQUE ; l'extension qui la renvoie au plafond
               = CONCENTRIQUE. Le cycle commence donc bras tendus,
               comme au développé couché. Plan sagittal.
   ROM       : coude d'environ 174° (bras tendus) à ~95° en bas.
               NOTE : on pourrait croire, par analogie avec les
               curls, à une flexion beaucoup plus fermée. La
               géométrie dit le contraire — avec un bras vertical et
               une barre amenée AU FRONT, l'avant-bras finit à peine
               au-delà de l'horizontale. Ce sont les variantes
               « derrière la tête » qui referment davantage le coude.
   Agonistes : TRICEPS, LONGUE PORTION surtout : elle s'insère sur
               l'omoplate et croise donc l'épaule ; celle-ci étant
               fléchie à 90°, la longue portion est PRÉ-ÉTIRÉE avant
               même le début du mouvement. C'est exactement ce que
               l'extension à la poulie, épaule neutre, ne fait pas.
   Distinction : allongé, épaule à 90°, barre vers le FRONT.
               ≠ extension poulie haute (debout, épaule neutre,
               câble), ≠ extension nuque (épaule fléchie à 180°).
   GÉOMÉTRIE (calculée) — épaule S(78,98) ; bras L1=22 incliné de
   10° vers la tête -> coude E(74.2,76.3) ; avant-bras L2=22.
   Haut : main H0(72.68,54.35), coude 174°.
   Bas  : main H1(52.27,78) juste au-dessus du front (tête centrée
   en (52.27,92), r=8, sommet du crâne à y=84), coude 95,5°.
   -> avant-bras −90,47°.
   ========================================================= */
EXERCISE_MOTIONS["barre-au-front"] = {
  vb: "38 42 116 116",
  dur: 3.8,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Allongé sur un banc, bras vers le plafond : la barre descend vers le front par flexion des coudes, puis remonte par extension des triceps.",
  fixe: `
    <line class="mo-ground" x1="40" y1="152" x2="150" y2="152"/>
    <!-- banc plat -->
    <line class="mo-pad" x1="44" y1="100" x2="140" y2="100"/>
    <line class="mo-gear" x1="56" y1="102" x2="56" y2="152"/>
    <line class="mo-gear" x1="130" y1="102" x2="130" y2="152"/>
    <!-- corps allongé, tête posée sur le banc -->
    <circle class="mo-head" cx="52.27" cy="92" r="8"/>
    <line class="mo-body" x1="78" y1="98" x2="118" y2="100"/>
    <line class="mo-body" x1="118" y1="100" x2="132" y2="124"/>
    <line class="mo-body" x1="132" y1="124" x2="130" y2="152"/>
    <!-- BRAS : dans les éléments FIXES, dirigé vers le plafond -->
    <line class="mo-limb" x1="78" y1="98" x2="74.2" y2="76.3"/>
    <circle class="mo-joint" cx="74.2" cy="76.3" r="2.8"/>
    <!-- repère d'amplitude : l'arc réellement parcouru par la barre -->
    <path class="mo-rom" fill="none" d="M72.68 54.35 A22 22 0 0 0 52.27 78"/>`,
  muscles: [
    { nom: "Triceps (longue portion)",
      svg: `<ellipse cx="78" cy="87" rx="3.2" ry="8" transform="rotate(-10 78 87)"/>` }
  ],
  parts: [
    {
      /* AVANT-BRAS + BARRE : rotation autour du COUDE (74.2, 76.3).
         −90,47° amène la barre du plafond jusqu'au front. Le disque
         s'arrête au contact du sommet du crâne : c'est la fin de course
         réelle, pas une approximation. */
      o: "74.2px 76.3px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-90.47deg)"], [52, "rotate(-90.47deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="74.2" y1="76.3" x2="72.68" y2="54.35"/>
        <circle class="mo-plate-o" cx="72.68" cy="54.35" r="6"/>
        <circle class="mo-hub" cx="72.68" cy="54.35" r="2.4"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M104 96 L104 60 M99 68 L104 60 L109 68"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M104 60 L104 96 M99 88 L104 96 L109 88"/>` }
  ]
};

/* =========================================================
   24. DIPS ENTRE BANCS  (dips-banc)
   -----------------------------------------------------------
   Position  : DOS à un banc, mains posées sur son bord de part et
               d'autre des hanches, doigts vers l'avant, bassin
               DEVANT le banc, jambes tendues posées sur un second
               banc en face — d'où « entre bancs ».
   Matériel  : deux bancs (ou un banc et le sol pour la version
               plus facile, pieds au sol genoux fléchis).
   Mobiles   : le COUDE (flexion à la descente, extension à la
               remontée) et, en second, l'ÉPAULE qui part en
               extension. Le corps descend en bloc.
   Fixes     : les MAINS sur le banc et les PIEDS sur l'autre banc.
               C'est une DOUBLE CHAÎNE FERMÉE : les deux extrémités
               sont ancrées et c'est le corps qui se déplace entre
               elles. Le schéma est donc construit à l'envers d'un
               mouvement classique — enraciné à la main d'un côté,
               au pied de l'autre, le bassin étant le point de
               rencontre des deux chaînes.
   Sens/plan : descente = excentrique, remontée = concentrique.
               Le cycle commence bras tendus. Plan sagittal.
   ROM       : coude de ~174° à 90° EXACTEMENT, pas plus bas. Au-delà
               l'épaule part en hyper-extension et toute la contrainte
               se reporte sur l'articulation gléno-humérale et la
               coiffe des rotateurs : c'est le point de sécurité de
               cet exercice, et la raison pour laquelle le schéma
               s'arrête net à l'horizontale du bras.
   Agonistes : TRICEPS en premier, deltoïde antérieur et bas du
               pectoral en assistance.
   Distinction : mains DERRIÈRE le corps, buste vertical, corps qui
               descend devant l'appui. ≠ dips aux barres parallèles
               (mains sur les côtés, buste penché en avant, corps
               entre les barres), ≠ barre au front (allongé).
   GÉOMÉTRIE (calculée) — main ancrée H(66,96), bras et avant-bras
   L=20. Haut : coude(68,76), épaule(72.2,56.4), coude à 173,6°.
   Bas  : épaule descendue de 13 unités à (75.67,69.42) ;
   loi des cosinus -> coude(57.55,77.87), pointant vers l'ARRIÈRE,
   angle vérifié à 90,0°.
   -> avant-bras −30,7°, bras +83,6° relatif, buste −52,9° relatif
   (soit une rotation absolue nulle : le tronc reste vertical et ne
   fait que descendre, ce qui est exactement le mouvement réel).
   JAMBES : pied ancré F(125,98), tibia 24, cuisse 26. Le genou et la
   cuisse sont recalculés pour que la hanche rejoigne exactement
   celle du tronc aux deux positions -> tibia −1,42°, cuisse −27,37° (jambes quasi tendues).
   ========================================================= */
EXERCISE_MOTIONS["dips-banc"] = {
  vb: "32 30 136 128",
  dur: 4.0,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Mains sur le bord d'un banc derrière soi, jambes tendues sur un second banc : le corps descend en fléchissant les coudes vers l'arrière jusqu'à 90°, puis remonte.",
  fixe: `
    <line class="mo-ground" x1="36" y1="152" x2="164" y2="152"/>
    <!-- banc des MAINS (derrière) -->
    <line class="mo-pad" x1="36" y1="100" x2="72" y2="100"/>
    <line class="mo-gear" x1="44" y1="102" x2="44" y2="152"/>
    <line class="mo-gear" x1="68" y1="102" x2="68" y2="152"/>
    <!-- banc des PIEDS (devant) -->
    <line class="mo-pad" x1="112" y1="100" x2="156" y2="100"/>
    <line class="mo-gear" x1="120" y1="102" x2="120" y2="152"/>
    <line class="mo-gear" x1="150" y1="102" x2="150" y2="152"/>`,
  parts: [
    {
      /* CHAÎNE DES JAMBES, enracinée au PIED (124, 98). */
      o: "125px 98px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-1.42deg)"], [52, "rotate(-1.42deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <circle class="mo-hand" cx="125" cy="98" r="3"/>
        <line class="mo-body" x1="125" y1="98" x2="102" y2="91.14"/>`,
      children: [
        { /* CUISSE : rejoint la hanche du tronc, calculée pour coïncider. */
          o: "102px 91.14px",
          k: [[0, "rotate(0deg)"], [45, "rotate(-27.37deg)"], [52, "rotate(-27.37deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <circle class="mo-joint" cx="102" cy="91.14" r="2.4"/>
            <line class="mo-body" x1="102" y1="91.14" x2="76" y2="92"/>` }
      ]
    },
    {
      /* AVANT-BRAS, enraciné à la MAIN (66, 96) qui ne quitte pas le banc.
         childrenFirst : le bras au premier plan se dessine PAR-DESSUS le
         tronc, sinon le buste le recouvrirait. */
      o: "66px 96px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-30.7deg)"], [52, "rotate(-30.7deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      childrenFirst: true,
      svg: `
        <circle class="mo-hand" cx="66" cy="96" r="3.4"/>
        <line class="mo-limb" x1="66" y1="96" x2="68" y2="76"/>
        <circle class="mo-joint" cx="68" cy="76" r="2.6"/>`,
      children: [
        {
          /* BRAS : flexion du coude. C'est lui qui porte le triceps. */
          o: "68px 76px",
          k: [[0, "rotate(0deg)"], [45, "rotate(83.6deg)"], [52, "rotate(83.6deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          childrenFirst: true,
          muscleNom: "Triceps brachial",
          muscle: `<ellipse cx="67.2" cy="65.6" rx="3" ry="7.5" transform="rotate(12 67.2 65.6)"/>`,
          svg: `<line class="mo-limb" x1="68" y1="76" x2="72.2" y2="56.4"/>`,
          children: [
            {
              /* TRONC : contre-rotation exacte -> rotation absolue nulle.
                 Le buste reste vertical et ne fait que descendre. */
              o: "72.2px 56.4px",
              k: [[0, "rotate(0deg)"], [45, "rotate(-52.9deg)"], [52, "rotate(-52.9deg)"],
                  [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: "Deltoïde antérieur",
              muscle: `<circle cx="72.2" cy="56.4" r="4"/>`,
              svg: `
                <circle class="mo-head" cx="70" cy="42" r="8"/>
                <line class="mo-body" x1="72.2" y1="56.4" x2="76" y2="92"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M94 74 L94 44 M89 52 L94 44 L99 52"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M94 44 L94 74 M89 66 L94 74 L99 66"/>` }
  ]
};

/* =========================================================
   25. EXTENSION NUQUE HALTÈRE  (extension-nuque-haltere)
   -----------------------------------------------------------
   Position  : DEBOUT (ou assis), buste droit et gainé, un haltère
               tenu à DEUX MAINS au-dessus de la tête, bras
               VERTICAUX, coudes serrés pointant vers le plafond.
   Matériel  : un haltère, saisi par le disque supérieur.
   Mobiles   : le COUDE.
   Fixes     : l'ÉPAULE, maintenue en FLEXION MAXIMALE (~180°, bras
               contre les oreilles). Les coudes ne s'écartent pas
               vers l'extérieur et ne partent pas vers l'avant :
               c'est ce qui garde la charge sur le triceps.
   Sens/plan : l'haltère descend DERRIÈRE LA NUQUE par flexion du
               coude = excentrique ; l'extension qui le renvoie
               au-dessus de la tête = concentrique. Le cycle commence
               bras tendus. Plan sagittal.
   ROM       : coude de ~175° à ~45°. Ici l'amplitude est RÉELLEMENT
               grande, contrairement à la barre au front où la charge
               s'arrête au front : l'haltère descend derrière la
               nuque, donc bien plus bas, et referme beaucoup le
               coude.
   Agonistes : TRICEPS, LONGUE PORTION avant tout. L'épaule étant
               fléchie à 180°, cette portion — la seule des trois à
               croiser l'épaule — est en ÉTIREMENT MAXIMAL, le plus
               grand qu'elle puisse atteindre. D'où la hiérarchie des
               trois exercices de triceps déjà traités, du moins au
               plus étiré : poulie (épaule neutre) < barre au front
               (épaule à 90°) < nuque (épaule à 180°).
   Distinction : bras VERTICAUX au-dessus de la tête, charge DERRIÈRE
               la nuque. ≠ barre au front (allongé, épaule à 90°,
               charge vers le front), ≠ extension poulie (debout,
               épaule neutre, charge devant en bas).
   GÉOMÉTRIE (calculée) — épaule S(126,64), bras L1=22 vertical ->
   coude E(126,42) ; avant-bras L2=22.
   Haut : main H0(124.08,20.08), coude 175°.
   Bas  : main H1(141.56,57.56) derrière la nuque, coude 45°.
   -> avant-bras +140°, la main passant PAR-DESSUS la tête avant de
   descendre en arrière.
   ========================================================= */
EXERCISE_MOTIONS["extension-nuque-haltere"] = {
  vb: "86 2 92 154",
  dur: 3.7,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Debout, haltère tenu à deux mains au-dessus de la tête : il descend derrière la nuque par flexion des coudes, puis remonte par extension des triceps.",
  fixe: `
    <line class="mo-ground" x1="90" y1="152" x2="170" y2="152"/>
    <!-- corps debout et gainé -->
    <circle class="mo-head" cx="114" cy="46" r="9"/>
    <line class="mo-body" x1="126" y1="64" x2="129" y2="110"/>
    <line class="mo-body" x1="129" y1="110" x2="125" y2="152"/>
    <line class="mo-body" x1="129" y1="110" x2="134" y2="152"/>
    <!-- BRAS : dans les éléments FIXES, vertical contre l'oreille —
         l'épaule reste en flexion maximale pendant toute la série. -->
    <line class="mo-limb" x1="126" y1="64" x2="126" y2="42"/>
    <circle class="mo-joint" cx="126" cy="42" r="2.8"/>
    <!-- repère d'amplitude : l'arc réellement parcouru par l'haltère -->
    <path class="mo-rom" fill="none" d="M124.08 20.08 A22 22 0 0 1 141.56 57.56"/>`,
  muscles: [
    { nom: "Triceps (longue portion)",
      svg: `<ellipse cx="128.4" cy="53" rx="3.2" ry="8"/>` }
  ],
  parts: [
    {
      /* AVANT-BRAS + HALTÈRE : rotation autour du COUDE (126, 42).
         +140° ferme le coude de 175° à 45°. L'haltère est dessiné DANS
         L'AXE de l'avant-bras : les deux mains tiennent le disque, les
         masses dépassent de part et d'autre de la prise. */
      o: "126px 42px",
      k: [[0, "rotate(0deg)"], [45, "rotate(140deg)"], [52, "rotate(140deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="126" y1="42" x2="124.08" y2="20.08"/>
        <line class="mo-bar2" x1="124.78" y1="28.05" x2="123.38" y2="12.11"/>
        <rect class="mo-mass" x="117.78" y="25.05" width="14" height="6" rx="2" transform="rotate(-5 124.78 28.05)"/>
        <rect class="mo-mass" x="116.38" y="9.11" width="14" height="6" rx="2" transform="rotate(-5 123.38 12.11)"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M160 62 L160 26 M155 34 L160 26 L165 34"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M160 26 L160 62 M155 54 L160 62 L165 54"/>` }
  ]
};

/* =========================================================
   26. SQUAT À LA BARRE  (squat-barre)
   -----------------------------------------------------------
   Position  : DEBOUT, barre posée sur les TRAPÈZES (prise haute),
               pieds largeur d'épaules, pointes légèrement ouvertes,
               gainage serré, regard horizontal.
   Matériel  : barre olympique. Vue de profil : on voit le disque.
   Mobiles   : TROIS articulations en même temps — la HANCHE, le
               GENOU et la CHEVILLE. Premier mouvement vraiment
               polyarticulaire des jambes traité ici.
   Fixes     : le PIED, ancré au sol : chaîne fermée. Et le RACHIS,
               qui reste gainé et neutre. Attention à ne pas
               confondre : le buste S'INCLINE (rotation à la hanche)
               sans que le dos ne s'arrondisse. Le schéma dessine
               donc un tronc rigide qui bascule, jamais un dos qui
               se courbe.
   CONTRAINTE MAÎTRESSE : la BARRE reste à l'APLOMB DU MILIEU DU
               PIED pendant toute la descente. C'est la contrainte
               d'équilibre fondamentale du squat, et c'est ELLE qui
               impose l'inclinaison du buste : quand les genoux
               avancent, le bassin doit reculer d'autant pour que la
               charge ne quitte pas cette verticale. L'inclinaison du
               tronc n'a donc pas été choisie à l'oeil — elle a été
               RÉSOLUE à partir de cette contrainte, et vaut 22,4°.
               Un schéma où la barre avance ou recule est faux.
   Sens/plan : descente = excentrique, remontée = concentrique. Le
               cycle commence debout. Plan sagittal.
   ROM       : genou de 173° à 75°, hanche de 178° à 68°, cheville
               en dorsiflexion de 15°. La descente s'arrête cuisses
               PARALLÈLES AU SOL (vérifié : la cuisse est à 0,00° de
               l'horizontale en position basse).
   Agonistes : QUADRICEPS en premier, GRAND FESSIER, ischio-jambiers
               en co-contraction, érecteurs du rachis en gainage
               isométrique — ils ne raccourcissent pas, ils
               empêchent le buste de s'effondrer.
   Distinction : barre sur les TRAPÈZES, donc derrière, d'où un
               buste nettement incliné. ≠ squat gobelet (charge
               devant, buste bien plus vertical), ≠ presse à cuisses
               (assis, dos appuyé, aucun gainage), ≠ soulevé de terre
               (dominante de hanche, barre au sol dans les mains).
   GÉOMÉTRIE (calculée) — cheville A(120,138) ancrée, tibia 26,
   cuisse 26, tronc 32. Milieu du pied à x=123.
   Haut : genou(119.5,112), hanche(122,86.13), épaule(124,54.2),
          barre(123,47).
   Bas  : dorsiflexion 15° -> genou(113.27,112.88) ; cuisse
          horizontale -> hanche(139.26,112.88) ; inclinaison du tronc
          résolue pour que la barre reste à x=123 -> 22,42°,
          épaule(127.06,83.31), barre(123.00,77.28).
   La barre descend donc de 30,3 unités À LA VERTICALE, sans dériver
   d'un millimètre.
   -> tibia −13,90°, cuisse +98,38° relatif, tronc −110,49° relatif.
   Les BRAS sont dessinés courts et repliés : de profil ils partent
   vers le spectateur pour saisir la barre, ils sont donc fortement
   raccourcis et ne portent aucun mouvement propre.
   ========================================================= */
EXERCISE_MOTIONS["squat-barre"] = {
  vb: "92 26 78 132",
  dur: 4.4,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Barre sur les trapèzes : descente jusqu'aux cuisses parallèles au sol en pliant genoux et hanches, la barre restant à l'aplomb du milieu du pied, puis remontée.",
  fixe: `
    <line class="mo-ground" x1="100" y1="150" x2="158" y2="150"/>
    <!-- pied ancré au sol : c'est la racine de toute la chaîne -->
    <line class="mo-limb" x1="112" y1="150" x2="134" y2="150"/>
    <line class="mo-limb" x1="120" y1="138" x2="113" y2="150"/>
    <!-- APLOMB DU MILIEU DU PIED : la barre ne doit jamais quitter
         cette verticale. C'est le repère technique central du squat. -->
    <line class="mo-rom" x1="123" y1="32" x2="123" y2="150"/>`,
  parts: [
    {
      /* TIBIA : rotation autour de la CHEVILLE (120, 138), fixe au sol.
         −13,90° = 15° de dorsiflexion, le genou avance. */
      o: "120px 138px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-13.9deg)"], [52, "rotate(-13.9deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <circle class="mo-joint" cx="120" cy="138" r="2.8"/>
        <line class="mo-limb" x1="120" y1="138" x2="119.5" y2="112"/>`,
      children: [
        {
          /* CUISSE : +98,38° relatif. En bas elle est exactement
             PARALLÈLE AU SOL — la profondeur de référence. */
          o: "119.5px 112px",
          k: [[0, "rotate(0deg)"], [45, "rotate(98.38deg)"], [52, "rotate(98.38deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: ["Quadriceps", "Grand fessier"],
          muscle: `
            <ellipse cx="117.3" cy="99" rx="3.4" ry="9" transform="rotate(5.5 117.3 99)"/>
            <circle cx="125.5" cy="90" r="4.5"/>`,
          svg: `
            <circle class="mo-joint" cx="119.5" cy="112" r="2.8"/>
            <line class="mo-limb" x1="119.5" y1="112" x2="122" y2="86.13"/>`,
          children: [
            {
              /* TRONC : −110,49° relatif, soit 22,42° d'inclinaison
                 absolue vers l'avant. Segment RIGIDE : le dos bascule,
                 il ne s'arrondit pas. La barre est solidaire du tronc,
                 ce qui garantit qu'elle suit exactement l'aplomb. */
              o: "122px 86.13px",
              k: [[0, "rotate(0deg)"], [45, "rotate(-110.49deg)"], [52, "rotate(-110.49deg)"],
                  [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: "Érecteurs du rachis (gainage)",
              muscle: `<ellipse cx="125.5" cy="70" rx="2.8" ry="11" transform="rotate(3.6 125.5 70)"/>`,
              svg: `
                <circle class="mo-joint" cx="122" cy="86.13" r="2.8"/>
                <line class="mo-body" x1="122" y1="86.13" x2="124" y2="54.2"/>
                <circle class="mo-plate-o" cx="123" cy="47" r="11"/>
                <circle class="mo-hub" cx="123" cy="47" r="2.6"/>
                <line class="mo-limb" x1="124" y1="54.2" x2="129" y2="64"/>
                <line class="mo-limb" x1="129" y1="64" x2="126" y2="50"/>
                <circle class="mo-head mo-head-solid" cx="111" cy="38.5" r="9"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M152 96 L152 56 M147 64 L152 56 L157 64"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M152 56 L152 96 M147 88 L152 96 L157 88"/>` }
  ]
};

/* =========================================================
   27. PRESSE À CUISSES  (presse-a-cuisses)
   -----------------------------------------------------------
   Position  : ASSIS-ALLONGÉ dans la machine, DOS ET BASSIN PLAQUÉS
               contre le dossier incliné, pieds à plat sur le
               plateau, largeur d'épaules, à mi-hauteur.
   Matériel  : presse inclinée à 45° — un chariot chargé qui
               COULISSE le long de deux rails. Le chariot ne tourne
               pas : il TRANSLATE. C'est la première pièce de
               matériel de toute la bibliothèque qui se déplace en
               ligne droite au lieu de pivoter, et elle est animée
               comme telle.
   Mobiles   : le GENOU et la HANCHE.
   Fixes     : le DOS, le BASSIN et tout le tronc — dessinés dans
               les éléments fixes. C'est LA différence avec le
               squat : le tronc est SOUTENU, il n'y a ni gainage à
               fournir ni équilibre à gérer. D'où la possibilité de
               charger plus lourd qu'au squat sans que les deux
               soient comparables. Le décollement du bassin en bas
               est l'erreur classique : le schéma s'arrête avant.
   Sens/plan : le chariot s'éloigne (extension) = concentrique ; il
               revient vers soi = excentrique. Le cycle commence
               jambes tendues. Plan sagittal.
   ROM       : genou de 172° à 90°. On ne VERROUILLE PAS les genoux
               en haut : sous une charge lourde et guidée, c'est le
               danger propre à cet exercice, l'articulation encaissant
               tout à la place du muscle. D'où les 172° et non 180°.
   Agonistes : QUADRICEPS surtout, grand fessier et ischio-jambiers
               en assistance. AUCUN érecteur du rachis, puisque le
               dos est soutenu : c'est la distinction fonctionnelle
               majeure avec le squat, où ils travaillent en gainage.
   Distinction : dos SOUTENU, charge poussée par les pieds le long
               d'un rail. ≠ squat (debout, charge sur le dos,
               gainage et équilibre), ≠ leg extension (isolation,
               un seul segment mobile).
   GÉOMÉTRIE (calculée) — hanche H(86,116) FIXE, cuisse 26, tibia 26.
   Haut : pied F0(120.62,77.38), |H-F0|=51,87 -> genou 171,8°,
          genou en (101.92,95.44).
   Bas  : pied F1(110,88), |H-F1|=36,88 -> genou 90,3°,
          genou en (84.08,90.07), remonté vers la poitrine.
   -> cuisse −41,98°, tibia +81,42° relatif.
   CHARIOT : translation pure de (−10,62 ; +10,62), soit 15,02 le
   long du rail à 45°. Cette course vaut 0,58 longueur de tibia —
   exactement le rapport réel (≈23 cm pour un tibia de 40 cm).
   ========================================================= */
EXERCISE_MOTIONS["presse-a-cuisses"] = {
  vb: "30 38 132 114",
  dur: 4.0,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Assis dos plaqué dans la presse inclinée : le chariot revient vers soi jusqu'à 90° de flexion des genoux, puis est repoussé le long du rail sans verrouiller les genoux.",
  fixe: `
    <line class="mo-ground" x1="40" y1="142" x2="152" y2="142"/>
    <!-- rail incliné à 45° sur lequel coulisse le chariot -->
    <line class="mo-gear" x1="106" y1="92" x2="150" y2="48"/>
    <!-- dossier incliné + bâti -->
    <line class="mo-pad" x1="89" y1="122" x2="49" y2="103"/>
    <line class="mo-gear" x1="60" y1="106" x2="60" y2="142"/>
    <line class="mo-gear" x1="88" y1="118" x2="88" y2="142"/>
    <!-- TRONC ENTIER dans les éléments fixes : dos et bassin plaqués,
         c'est le point qui distingue la presse du squat. -->
    <circle class="mo-head" cx="42" cy="96" r="8"/>
    <line class="mo-body" x1="86" y1="116" x2="52" y2="100"/>
    <line class="mo-limb" x1="52" y1="100" x2="58" y2="114"/>
    <circle class="mo-joint" cx="86" cy="116" r="3"/>`,
  parts: [
    {
      /* CHARIOT : TRANSLATION pure le long du rail — il ne pivote pas. */
      k: [[0, "translate(0px,0px)"], [45, "translate(-10.62px,10.62px)"],
          [52, "translate(-10.62px,10.62px)"], [80, "translate(0px,0px)"],
          [100, "translate(0px,0px)"]],
      svg: `
        <line class="mo-gear" x1="110.02" y1="66.78" x2="131.22" y2="87.98"/>
        <circle class="mo-plate-o" cx="130.52" cy="67.48" r="9"/>
        <circle class="mo-hub" cx="130.52" cy="67.48" r="2.6"/>`
    },
    {
      /* CUISSE : rotation autour de la HANCHE, qui ne bouge pas.
         −41,98° : le genou remonte vers la poitrine. */
      o: "86px 116px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-41.98deg)"], [52, "rotate(-41.98deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: ["Quadriceps", "Grand fessier"],
      muscle: `
        <ellipse cx="91.2" cy="103.6" rx="3.4" ry="9" transform="rotate(37.8 91.2 103.6)"/>
        <circle cx="89.5" cy="119" r="4.5"/>`,
      svg: `<line class="mo-limb" x1="86" y1="116" x2="101.92" y2="95.44"/>`,
      children: [
        {
          /* TIBIA : +81,42° relatif. Son extrémité suit exactement le
             plateau du chariot, ce qui est la contrainte de la chaîne
             fermée : le pied ne quitte jamais le plateau. */
          o: "101.92px 95.44px",
          k: [[0, "rotate(0deg)"], [45, "rotate(81.42deg)"], [52, "rotate(81.42deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <circle class="mo-joint" cx="101.92" cy="95.44" r="2.8"/>
            <line class="mo-limb" x1="101.92" y1="95.44" x2="120.62" y2="77.38"/>
            <circle class="mo-hand" cx="120.62" cy="77.38" r="3"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M100 66 L118 48 M115.17 56.49 L118 48 L109.51 50.83"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M118 48 L100 66 M108.49 63.17 L100 66 L102.83 57.51"/>` }
  ]
};

/* =========================================================
   28. FENTES MARCHÉES  (fentes-marchees)
   -----------------------------------------------------------
   Position  : appui DISSOCIÉ — un pied loin devant à plat, un pied
               derrière EN APPUI SUR LES ORTEILS, talon décollé.
               Buste droit et vertical, haltères le long du corps.
   Matériel  : deux haltères, prise neutre.
   Mobiles   : hanche, genou et cheville des DEUX jambes, en même
               temps. La jambe avant encaisse et pousse, la jambe
               arrière accompagne en descendant le genou vers le sol.
   Fixes     : les DEUX PIEDS. C'est encore une double chaîne fermée,
               mais d'un genre nouveau : ici les deux ancrages sont
               au SOL et à des hauteurs différentes (le talon arrière
               est décollé), et c'est le BASSIN qui est le point de
               rencontre des deux chaînes.
               Le BUSTE reste VERTICAL — contre-rotation exacte, sa
               rotation absolue est nulle. S'il penche en avant, la
               charge quitte les jambes pour les lombaires.
   Sens/plan : descente = excentrique, remontée = concentrique.
               Plan sagittal.
   ROM       : les DEUX genoux passent de 168° à 90°, simultanément
               (vérifié aux deux positions). Le genou arrière descend
               à 8,85 unités du sol — proche, sans jamais le toucher.
               Le genou avant finit 2,8 unités DEVANT la cheville :
               légèrement, ce qui est normal et recherché, pas la
               caricature du genou qui part loin devant.
   Agonistes : QUADRICEPS et GRAND FESSIER de la jambe avant. Le
               fessier travaille PLUS qu'au squat, à cause de la
               grande amplitude de hanche en position unilatérale.
               S'y ajoutent les stabilisateurs de hanche, qui n'ont
               pas de traduction graphique mais expliquent pourquoi
               l'exercice est bien plus exigeant qu'il n'en a l'air.
   Distinction : appui DISSOCIÉ, donc travail unilatéral et forte
               demande d'équilibre. ≠ squat (pieds côte à côte,
               bilatéral), ≠ presse (assis, guidé, aucun équilibre).
   GÉOMÉTRIE (calculée) — chevilles ancrées Af(96,144) et
   Ar(148,138) ; cuisse 26, tibia 26.
   Le bassin est l'INTERSECTION des deux cercles de rayon |cheville-
   hanche| : haut 51,72 -> H0(116.89,96.69) ; bas 36,77 ->
   H1(119.04,115.34). Il descend de 18,65 presque à la verticale.
   Genoux : avant (103.97,119.25)->(93.19,118.15) ;
            arrière (130.27,118.98)->(122.19,141.15).
   -> AVANT tibia −24,04°, cuisse +78,03° rel, tronc −53,98° rel.
      ARRIÈRE tibia −53,96°, cuisse +77,97° rel.
   ========================================================= */
EXERCISE_MOTIONS["fentes-marchees"] = {
  vb: "58 36 110 124",
  dur: 4.2,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Fente : un pied devant, un pied derrière sur les orteils, le bassin descend en pliant les deux genoux jusqu'à 90°, buste vertical, puis remonte.",
  fixe: `
    <line class="mo-ground" x1="62" y1="150" x2="162" y2="150"/>
    <!-- pied AVANT à plat, cheville ancrée -->
    <line class="mo-limb" x1="88" y1="150" x2="106" y2="150"/>
    <line class="mo-limb" x1="96" y1="144" x2="91" y2="150"/>
    <circle class="mo-joint" cx="96" cy="144" r="2.8"/>
    <!-- pied ARRIÈRE sur les orteils, talon décollé -->
    <line class="mo-limb" x1="148" y1="138" x2="154" y2="150"/>
    <circle class="mo-joint" cx="148" cy="138" r="2.8"/>`,
  parts: [
    {
      /* JAMBE ARRIÈRE, enracinée à sa cheville. Dessinée en premier :
         elle passe DERRIÈRE le corps. */
      o: "148px 138px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-53.96deg)"], [52, "rotate(-53.96deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `<line class="mo-body" x1="148" y1="138" x2="130.27" y2="118.98"/>`,
      children: [
        { o: "130.27px 118.98px",
          k: [[0, "rotate(0deg)"], [45, "rotate(77.97deg)"], [52, "rotate(77.97deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <circle class="mo-joint" cx="130.27" cy="118.98" r="2.6"/>
            <line class="mo-body" x1="130.27" y1="118.98" x2="116.89" y2="96.69"/>` }
      ]
    },
    {
      /* JAMBE AVANT, enracinée à sa cheville. Elle porte le tronc. */
      o: "96px 144px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-24.04deg)"], [52, "rotate(-24.04deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `<line class="mo-limb" x1="96" y1="144" x2="103.97" y2="119.25"/>`,
      children: [
        {
          o: "103.97px 119.25px",
          k: [[0, "rotate(0deg)"], [45, "rotate(78.03deg)"], [52, "rotate(78.03deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: ["Quadriceps", "Grand fessier"],
          muscle: `
            <ellipse cx="107.4" cy="106.23" rx="3.4" ry="9" transform="rotate(29.8 107.4 106.23)"/>
            <circle cx="120.5" cy="99" r="4.5"/>`,
          svg: `
            <circle class="mo-joint" cx="103.97" cy="119.25" r="2.8"/>
            <line class="mo-limb" x1="103.97" y1="119.25" x2="116.89" y2="96.69"/>`,
          children: [
            {
              /* TRONC : contre-rotation exacte -> rotation absolue NULLE.
                 Le buste ne penche jamais, il ne fait que descendre. */
              o: "116.89px 96.69px",
              k: [[0, "rotate(0deg)"], [45, "rotate(-53.98deg)"], [52, "rotate(-53.98deg)"],
                  [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
              svg: `
                <circle class="mo-joint" cx="116.89" cy="96.69" r="2.8"/>
                <line class="mo-body" x1="116.89" y1="96.69" x2="116.89" y2="62.69"/>
                <line class="mo-limb" x1="116.89" y1="62.69" x2="111" y2="78"/>
                <line class="mo-limb" x1="111" y1="78" x2="107" y2="93"/>
                <line class="mo-bar2" x1="101" y1="93" x2="113" y2="93"/>
                <rect class="mo-mass" x="98" y="88" width="6" height="10" rx="2"/>
                <rect class="mo-mass" x="110" y="88" width="6" height="10" rx="2"/>
                <circle class="mo-head" cx="115" cy="50" r="9"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M68 122 L68 86 M63 94 L68 86 L73 94"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M68 86 L68 122 M63 114 L68 122 L73 114"/>` }
  ]
};

/* =========================================================
   29. LEG EXTENSION  (leg-extension)
   -----------------------------------------------------------
   Position  : ASSIS, dos plaqué au dossier, CUISSES posées sur
               l'assise, chevilles derrière le boudin rembourré,
               mains sur les poignées latérales.
   Matériel  : machine à bras de levier — un axe pivotant portant un
               boudin, relié à la colonne de charges.
   Mobiles   : le GENOU, et lui seul. C'est l'isolation la plus pure
               du quadriceps de toute la bibliothèque.
   Fixes     : la HANCHE, la CUISSE plaquée sur l'assise, le dos, le
               bassin. La cuisse ne bouge pas d'un degré, et c'est
               pour cela qu'elle est dessinée dans les éléments
               fixes, avec le quadriceps posé dessus.
   RÉGLAGE CRITIQUE : l'AXE de la machine doit être ALIGNÉ avec
               l'axe du GENOU. Mal réglé, le levier cisaille
               l'articulation au lieu de la faire tourner. Le schéma
               fait donc coïncider explicitement le pivot de la
               machine et le centre du genou, et le signale par un
               repère : c'est le seul exercice où un réglage, et non
               un geste, est le point technique principal.
   Sens/plan : extension du genou = concentrique ; retour = 
               excentrique. Le cycle commence jambes fléchies. Plan
               sagittal.
   ROM       : genou de 90° à 175° (vérifié aux deux positions). On
               ne verrouille pas brutalement en haut, d'où 175°.
   Agonistes : QUADRICEPS seul. Nuance qui explique la limite de
               l'exercice : le DROIT FÉMORAL, seul des quatre chefs
               à croiser la hanche, travaille ici en position
               RACCOURCIE puisque la hanche est fléchie à 90°. Il
               est donc moins efficace qu'au squat — l'isolation se
               paie.
   Distinction : UN SEUL segment mobile, une seule articulation, et
               en chaîne OUVERTE — le pied ne pousse contre rien de
               fixe, il déplace un levier. ≠ presse à cuisses
               (chaîne fermée, deux articulations), ≠ squat.
   GÉOMÉTRIE (calculée) — hanche H(112,106), cuisse HORIZONTALE de
   26 -> genou/pivot K(86,106). Tibia 26.
   Bas : pied F0(86,132), tibia vertical, genou 90,0°.
   Haut : pied F1(60.10,103.73), genou 175,0°.
   -> tibia +95,00°. La colonne de charges monte de 14 en
   translation pendant le concentrique.
   (Le câble reliant le levier à la colonne n'est pas dessiné : son
   trajet passe derrière le bâti et l'ajouter masquerait le genou,
   qui est le sujet du schéma.)
   ========================================================= */
EXERCISE_MOTIONS["leg-extension"] = {
  vb: "42 48 118 102",
  dur: 3.6,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Assis dans la machine, chevilles derrière le boudin : les genoux se tendent jusqu'à l'extension complète, puis reviennent lentement.",
  fixe: `
    <line class="mo-ground" x1="60" y1="142" x2="154" y2="142"/>
    <!-- bâti : assise, dossier, montants -->
    <line class="mo-pad" x1="86" y1="110" x2="116" y2="110"/>
    <line class="mo-pad" x1="117" y1="108" x2="129" y2="76"/>
    <line class="mo-gear" x1="90" y1="112" x2="90" y2="142"/>
    <line class="mo-gear" x1="120" y1="112" x2="120" y2="142"/>
    <!-- colonne de charges : rail de guidage -->
    <line class="mo-gear" x1="141" y1="80" x2="141" y2="142"/>
    <!-- CORPS : tout le haut est immobile, cuisse comprise -->
    <circle class="mo-head" cx="128" cy="62" r="8"/>
    <line class="mo-body" x1="112" y1="106" x2="123" y2="76"/>
    <line class="mo-limb" x1="123" y1="76" x2="116" y2="96"/>
    <line class="mo-limb" x1="112" y1="106" x2="86" y2="106"/>
    <circle class="mo-joint" cx="112" cy="106" r="2.8"/>
    <!-- AXE DE LA MACHINE CONFONDU AVEC L'AXE DU GENOU : le réglage
         qui conditionne tout l'exercice. -->
    <circle class="mo-pulley" cx="86" cy="106" r="4.5"/>
    <line class="mo-rom" x1="86" y1="92" x2="86" y2="120"/>`,
  muscles: [
    { nom: "Quadriceps (isolation)",
      svg: `<ellipse cx="99" cy="102" rx="10" ry="3.4"/>` }
  ],
  parts: [
    {
      /* COLONNE DE CHARGES : translation verticale pure, elle monte
         quand le levier se lève. */
      k: [[0, "translate(0px,0px)"], [32, "translate(0px,-14px)"],
          [40, "translate(0px,-14px)"], [88, "translate(0px,0px)"],
          [100, "translate(0px,0px)"]],
      svg: `
        <rect class="mo-mass" x="134" y="104" width="14" height="6" rx="1.5"/>
        <rect class="mo-mass" x="134" y="112" width="14" height="6" rx="1.5"/>
        <rect class="mo-mass" x="134" y="120" width="14" height="6" rx="1.5"/>`
    },
    {
      /* TIBIA + BOUDIN : rotation autour du PIVOT, qui est aussi le
         genou. +95° tend le genou de 90° à 175°. Le levier de la
         machine est dessiné sous le tibia, ils tournent ensemble —
         c'est précisément ce que garantit un axe bien réglé. */
      o: "86px 106px",
      k: [[0, "rotate(0deg)"], [32, "rotate(95deg)"], [40, "rotate(95deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-gear" x1="86" y1="106" x2="86" y2="132"/>
        <line class="mo-limb" x1="86" y1="106" x2="86" y2="132"/>
        <circle class="mo-mass" cx="86" cy="132" r="6"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M52 130 L52 96 M47 104 L52 96 L57 104"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M52 96 L52 130 M47 122 L52 130 L57 122"/>` }
  ]
};

/* =========================================================
   30. SQUAT GOBELET  (squat-gobelet)
   -----------------------------------------------------------
   Position  : DEBOUT, un haltère tenu VERTICALEMENT contre la
               poitrine, deux mains sous le disque supérieur, coudes
               BAS et serrés. Pieds largeur d'épaules.
   Matériel  : un haltère (ou une kettlebell).
   Mobiles   : hanche, genou, cheville — même chaîne qu'au squat
               barre, pied ancré au sol.
   Fixes     : le pied. Le rachis reste gainé et neutre.
   LA DIFFÉRENCE : la charge est DEVANT, contre la poitrine, et non
               derrière sur les trapèzes. Elle agit comme un
               CONTREPOIDS : elle permet — et impose — un buste
               beaucoup plus VERTICAL. C'est ce qui en fait
               l'exercice d'apprentissage du squat : la position
               correcte devient la plus facile à tenir.
               Chiffré, d'un schéma à l'autre : le buste s'incline
               de 8° ici contre 22,4° au squat barre.
   Sens/plan : descente = excentrique, remontée = concentrique.
   ROM       : genou de 173° à 62°, soit PLUS BAS qu'au squat barre
               (75°) : la hanche descend 2,7 unités SOUS le genou,
               donc sous la parallèle. Le buste vertical et la charge
               frontale rendent cette profondeur accessible, et les
               coudes viennent alors entre les genoux.
               Dorsiflexion 22°, contre 15° au squat barre — une
               descente plus profonde en demande davantage.
   Agonistes : quadriceps et grand fessier, plus le HAUT DU DOS et
               les bras qui travaillent en ISOMÉTRIE pour tenir la
               charge devant. Cette sollicitation-là n'existe pas au
               squat barre, où la barre repose sur le squelette.
   Distinction : charge DEVANT -> buste vertical et descente plus
               profonde. ≠ squat barre (charge derrière, buste à
               22,4°, descente à la parallèle).
   GÉOMÉTRIE — cheville A(120,138) ancrée, tibia 26, cuisse 26,
   tronc 32.
   Haut : genou(119.5,112), hanche(122,86.13), buste à 2°.
   Bas  : dorsiflexion 22° -> genou(110.26,113.89) ; cuisse à −6°
          -> hanche(136.12,116.61), sous le genou ; buste à 8°.
   -> tibia −20,90°, cuisse +111,38° rel, tronc −96,48° rel.
   NOTE D'HONNÊTETÉ : contrairement au squat barre, l'inclinaison du
   buste n'est PAS déduite ici d'une contrainte géométrique. Au squat
   barre, la charge est lourde et domine l'équilibre, donc « la barre
   reste à l'aplomb du milieu du pied » suffit à tout déterminer. Au
   gobelet la charge est légère devant un corps bien plus lourd :
   c'est le centre de masse COMBINÉ qui s'équilibre, et le résoudre
   exigerait d'inventer des masses. L'angle de 8° est donc une valeur
   caractéristique documentée du mouvement, pas un résultat de calcul.
   Pour la même raison, aucun repère d'aplomb n'est dessiné ici : il
   suggérerait une contrainte qui ne s'applique pas à cette charge.
   ========================================================= */
EXERCISE_MOTIONS["squat-gobelet"] = {
  vb: "96 28 72 130",
  dur: 4.2,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Haltère tenu verticalement contre la poitrine : descente profonde en gardant le buste vertical, coudes entre les genoux, puis remontée.",
  fixe: `
    <line class="mo-ground" x1="102" y1="150" x2="158" y2="150"/>
    <line class="mo-limb" x1="112" y1="150" x2="134" y2="150"/>
    <line class="mo-limb" x1="120" y1="138" x2="113" y2="150"/>
    <circle class="mo-joint" cx="120" cy="138" r="2.8"/>`,
  parts: [
    {
      o: "120px 138px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-20.9deg)"], [52, "rotate(-20.9deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `<line class="mo-limb" x1="120" y1="138" x2="119.5" y2="112"/>`,
      children: [
        {
          o: "119.5px 112px",
          k: [[0, "rotate(0deg)"], [45, "rotate(111.38deg)"], [52, "rotate(111.38deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: ["Quadriceps", "Grand fessier"],
          muscle: `
            <ellipse cx="117.3" cy="99" rx="3.4" ry="9" transform="rotate(5.5 117.3 99)"/>
            <circle cx="125.5" cy="90" r="4.5"/>`,
          svg: `
            <circle class="mo-joint" cx="119.5" cy="112" r="2.8"/>
            <line class="mo-limb" x1="119.5" y1="112" x2="122" y2="86.13"/>`,
          children: [
            {
              /* TRONC + HALTÈRE : le buste ne bascule que de 2° à 8°.
                 L'haltère est solidaire du tronc, tenu à la verticale
                 contre la poitrine, coudes bas. */
              o: "122px 86.13px",
              k: [[0, "rotate(0deg)"], [45, "rotate(-96.48deg)"], [52, "rotate(-96.48deg)"],
                  [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: "Haut du dos (isométrique)",
              muscle: `<ellipse cx="123.6" cy="64" rx="2.8" ry="8" transform="rotate(2 123.6 64)"/>`,
              svg: `
                <circle class="mo-joint" cx="122" cy="86.13" r="2.8"/>
                <line class="mo-body" x1="122" y1="86.13" x2="120.88" y2="54.15"/>
                <line class="mo-limb" x1="120.88" y1="54.15" x2="126.5" y2="75"/>
                <line class="mo-limb" x1="126.5" y1="75" x2="116.5" y2="58"/>
                <line class="mo-bar2" x1="114.45" y1="70.39" x2="113.89" y2="54.39"/>
                <rect class="mo-mass" x="107.45" y="67.39" width="14" height="6" rx="2" transform="rotate(-2 114.45 70.39)"/>
                <rect class="mo-mass" x="106.89" y="51.39" width="14" height="6" rx="2" transform="rotate(-2 113.89 54.39)"/>
                <circle class="mo-head mo-head-solid" cx="119" cy="40" r="9"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M152 100 L152 62 M147 70 L152 62 L157 70"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M152 62 L152 100 M147 92 L152 100 L157 92"/>` }
  ]
};

/* =========================================================
   31. SQUAT AU POIDS DU CORPS  (squat-poids-du-corps)
   -----------------------------------------------------------
   Position  : DEBOUT, pieds largeur d'épaules, BRAS TENDUS DEVANT.
   Matériel  : aucun.
   Mobiles   : hanche, genou, cheville. Pied ancré au sol.
   Fixes     : le pied. Rachis gainé.
   LES BRAS : ils sont tendus devant et RESTENT HORIZONTAUX pendant
               toute la descente — ils reçoivent donc dans le schéma
               une contre-rotation de +26° qui annule celle du
               tronc. Ce n'est pas un détail d'esthétique : sans
               charge, les bras déplacent un peu de masse vers
               l'AVANT pour compenser le bassin qui recule. C'est
               leur fonction MÉCANIQUE, et s'ils suivaient
               passivement le buste ils ne la rempliraient pas.
   Sens/plan : descente = excentrique, remontée = concentrique.
   ROM       : LA PLUS GRANDE des trois variantes de squat. Sans
               charge, rien n'empêche de descendre jusqu'où la
               mobilité le permet : genou à 51°, hanche 6,3 unités
               sous le genou, dorsiflexion 25°.
               Le tableau complet des trois squats, désormais
               comparables chiffre à chiffre :
                 barre    : genou 75°, buste 22,4°, hanche AU niveau
                            du genou (parallèle), dorsiflexion 15°
                 gobelet  : genou 62°, buste  8,0°, hanche 2,7 sous,
                            dorsiflexion 22°
                 sans charge : genou 51°, buste 26,0°, hanche 6,3
                            sous, dorsiflexion 25°
               Le buste se REDRESSE au gobelet (contrepoids frontal)
               mais se repenche ici : sans contrepoids, plus on
               descend, plus le bassin recule et plus le buste doit
               s'incliner pour rester en équilibre.
   Agonistes : quadriceps et grand fessier. La charge étant le seul
               poids du corps, l'intensité est faible : c'est un
               mouvement d'apprentissage, d'échauffement et de
               volume, pas de force.
   Distinction : aucune charge, bras tendus devant en contrepoids,
               descente la plus profonde. ≠ squat barre et gobelet,
               qui portent une charge et s'arrêtent plus haut.
   GÉOMÉTRIE — cheville A(120,138) ancrée, tibia 26, cuisse 26,
   tronc 32. Haut : genou(119.5,112), hanche(122,86.13).
   Bas : genou(109.01,114.44), hanche(134.24,120.73), épaule
   (119.22,92.47).
   -> tibia −23,90°, cuisse +122,38° rel, tronc −124,48° rel,
      bras +26,00° rel (contre-rotation exacte).
   NOTE D'HONNÊTETÉ : comme au gobelet et contrairement au squat
   barre, l'angle du buste n'est pas déduit d'une contrainte
   géométrique — sans charge extérieure il n'y a pas d'aplomb à
   tenir, seul le centre de masse du corps s'équilibre. Les 26° sont
   une valeur caractéristique, pas un calcul.
   ========================================================= */
EXERCISE_MOTIONS["squat-poids-du-corps"] = {
  vb: "88 28 84 130",
  dur: 4.0,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Squat sans charge, bras tendus devant en contrepoids : descente profonde jusqu'à la flexion complète des genoux, puis remontée.",
  fixe: `
    <line class="mo-ground" x1="98" y1="150" x2="160" y2="150"/>
    <line class="mo-limb" x1="112" y1="150" x2="134" y2="150"/>
    <line class="mo-limb" x1="120" y1="138" x2="113" y2="150"/>
    <circle class="mo-joint" cx="120" cy="138" r="2.8"/>`,
  parts: [
    {
      o: "120px 138px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-23.9deg)"], [52, "rotate(-23.9deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `<line class="mo-limb" x1="120" y1="138" x2="119.5" y2="112"/>`,
      children: [
        {
          o: "119.5px 112px",
          k: [[0, "rotate(0deg)"], [45, "rotate(122.38deg)"], [52, "rotate(122.38deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: ["Quadriceps", "Grand fessier"],
          muscle: `
            <ellipse cx="117.3" cy="99" rx="3.4" ry="9" transform="rotate(5.5 117.3 99)"/>
            <circle cx="125.5" cy="90" r="4.5"/>`,
          svg: `
            <circle class="mo-joint" cx="119.5" cy="112" r="2.8"/>
            <line class="mo-limb" x1="119.5" y1="112" x2="122" y2="86.13"/>`,
          children: [
            {
              o: "122px 86.13px",
              k: [[0, "rotate(0deg)"], [45, "rotate(-124.48deg)"], [52, "rotate(-124.48deg)"],
                  [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
              svg: `
                <circle class="mo-joint" cx="122" cy="86.13" r="2.8"/>
                <line class="mo-body" x1="122" y1="86.13" x2="120.88" y2="54.15"/>
                <circle class="mo-head" cx="119" cy="40" r="9"/>`,
              children: [
                {
                  /* BRAS : contre-rotation de +26° -> ils restent
                     HORIZONTAUX en absolu pendant toute la descente.
                     C'est ce qui leur permet de jouer leur rôle de
                     contrepoids vers l'avant. */
                  o: "120.88px 54.15px",
                  k: [[0, "rotate(0deg)"], [45, "rotate(26deg)"], [52, "rotate(26deg)"],
                      [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
                  svg: `
                    <line class="mo-limb" x1="120.88" y1="54.15" x2="108" y2="55"/>
                    <circle class="mo-joint" cx="108" cy="55" r="2.4"/>
                    <line class="mo-limb" x1="108" y1="55" x2="95" y2="56"/>
                    <circle class="mo-hand" cx="95" cy="56" r="3"/>`
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M156 104 L156 64 M151 72 L156 64 L161 72"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M156 64 L156 104 M151 96 L156 104 L161 96"/>` }
  ]
};

/* =========================================================
   32. SOULEVÉ DE TERRE ROUMAIN  (souleve-terre-roumain)
   -----------------------------------------------------------
   Position  : DEBOUT, barre en pronation devant les cuisses, bras
               tendus, pieds largeur de bassin, genoux LÉGÈREMENT
               fléchis — et qui le restent.
   Matériel  : barre.
   Mobiles   : la HANCHE, essentiellement seule. C'est une CHARNIÈRE
               DE HANCHE (hip hinge), pas un mouvement de genou.
   Fixes     : le GENOU — son angle est CONSTANT, vérifié à 165,67°
               aux deux positions, soit une rotation relative de la
               cuisse de 0,00°. C'est la signature du mouvement, et
               le schéma la rend littérale : la cuisse ne tourne pas
               d'un degré par rapport au tibia. Le RACHIS reste
               gainé et neutre, dos plat.
   Sens/plan : la barre descend le long des cuisses par flexion de
               hanche = excentrique ; l'extension de hanche =
               concentrique. Le cycle commence DEBOUT. Plan sagittal.
   ROM       : hanche de 171° à 100°. Le bassin RECULE de 22,6
               unités : c'est ce recul, et non une flexion de genou,
               qui fait descendre la barre. La barre arrive à hauteur
               de genou. Le critère d'arrêt réel n'est d'ailleurs pas
               une profondeur mais la perte de la neutralité
               lombaire — dès que le dos ne peut plus rester plat,
               on remonte.
   CONTRAINTE MAÎTRESSE : la barre pend à la verticale sous les
               épaules et reste à l'APLOMB DU MILIEU DU PIED. C'est
               cette contrainte qui a déterminé l'inclinaison du
               tronc (43,79°), exactement comme au squat barre — et
               non une valeur choisie.
               Elle a au passage corrigé une idée reçue que j'avais :
               on dit « la barre reste collée aux jambes », et j'ai
               d'abord voulu la faire toucher le tibia en bas. C'est
               géométriquement IMPOSSIBLE : un bras qui pend à la
               verticale ne peut pas ramener la barre contre un
               tibia quasi vertical quand le buste est penché. La
               barre longe les CUISSES puis descend à l'aplomb. Le
               schéma montre la géométrie réelle, pas la formule.
   Agonistes : ISCHIO-JAMBIERS avant tout — mis en étirement puis
               contractés —, GRAND FESSIER, et érecteurs du rachis
               en isométrie pour tenir le dos plat.
   Distinction : hanche dominante, genou quasi fixe, départ DEBOUT.
               ≠ soulevé de terre classique (départ au SOL, genou ET
               hanche travaillent ensemble), ≠ squat (genou dominant).
   GÉOMÉTRIE (calculée) — cheville A(120,138), milieu du pied à
   x=116, tibia 26, cuisse 26, tronc 32, bras 39.
   Haut : genou(118,112), hanche(122.5,86.3), épaule(123,54.3),
          barre(116,93.3).
   Bas  : tibia incliné de 22° vers l'arrière -> genou(129.74,113.89) ;
          angle de genou conservé -> hanche(145.14,92.95) ;
          inclinaison du tronc RÉSOLUE par l'aplomb -> 43,79°,
          épaule(123,69.85), barre(116,108.85).
   -> tibia +26,40°, cuisse 0,00° relatif, tronc −71,08° relatif,
      bras +44,68° relatif (contre-rotation : il pend toujours à la
      verticale, comme l'impose la gravité).
   Le bras est dessiné 7 unités devant la ligne du tronc : une
   silhouette filaire n'a pas d'épaisseur de corps, et sans ce décalage
   bras et buste se confondraient.
   ========================================================= */
EXERCISE_MOTIONS["souleve-terre-roumain"] = {
  vb: "98 28 76 130",
  dur: 4.2,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Debout, barre devant les cuisses : le bassin recule et le buste s'incline, genoux fixes, jusqu'à ce que la barre arrive au genou, puis extension de hanche pour se redresser.",
  fixe: `
    <line class="mo-ground" x1="102" y1="150" x2="170" y2="150"/>
    <line class="mo-limb" x1="105" y1="150" x2="127" y2="150"/>
    <line class="mo-limb" x1="120" y1="138" x2="111" y2="150"/>
    <circle class="mo-joint" cx="120" cy="138" r="2.8"/>
    <!-- APLOMB DU MILIEU DU PIED : la barre ne le quitte jamais.
         C'est cette contrainte qui fixe l'inclinaison du buste. -->
    <line class="mo-rom" x1="116" y1="80" x2="116" y2="150"/>`,
  parts: [
    {
      /* TIBIA : +26,40°. Le genou RECULE — c'est ce recul qui fait
         descendre la barre, pas une flexion. */
      o: "120px 138px",
      k: [[0, "rotate(0deg)"], [45, "rotate(26.4deg)"], [52, "rotate(26.4deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `<line class="mo-limb" x1="120" y1="138" x2="118" y2="112"/>`,
      children: [
        {
          /* CUISSE : rotation relative NULLE. L'angle du genou est
             rigoureusement conservé, signature du roumain. */
          o: "118px 112px",
          k: [[0, "rotate(0deg)"], [45, "rotate(0deg)"], [52, "rotate(0deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: ["Ischio-jambiers", "Grand fessier"],
          muscle: `
            <ellipse cx="123.7" cy="99.75" rx="3.4" ry="10" transform="rotate(9.9 123.7 99.75)"/>
            <circle cx="126" cy="89" r="4.5"/>`,
          svg: `
            <circle class="mo-joint" cx="118" cy="112" r="2.8"/>
            <line class="mo-limb" x1="118" y1="112" x2="122.5" y2="86.3"/>`,
          children: [
            {
              /* TRONC : −71,08° relatif, soit 43,79° d'inclinaison
                 absolue. Segment RIGIDE : le dos bascule à la hanche,
                 il ne s'arrondit pas. */
              o: "122.5px 86.3px",
              k: [[0, "rotate(0deg)"], [45, "rotate(-71.08deg)"], [52, "rotate(-71.08deg)"],
                  [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: "Érecteurs du rachis (gainage)",
              muscle: `<ellipse cx="125.25" cy="70" rx="2.8" ry="11" transform="rotate(1 125.25 70)"/>`,
              svg: `
                <circle class="mo-joint" cx="122.5" cy="86.3" r="2.8"/>
                <line class="mo-body" x1="122.5" y1="86.3" x2="123" y2="54.3"/>
                <circle class="mo-head" cx="119" cy="40" r="9"/>`,
              children: [
                {
                  /* BRAS + BARRE : contre-rotation de +44,68°, donc le
                     bras reste VERTICAL en absolu — c'est la gravité qui
                     l'impose, il ne peut pas en être autrement. La barre
                     descend ainsi tout droit sur l'aplomb. */
                  o: "123px 54.3px",
                  k: [[0, "rotate(0deg)"], [45, "rotate(44.68deg)"], [52, "rotate(44.68deg)"],
                      [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
                  svg: `
                    <line class="mo-limb" x1="123" y1="55" x2="116" y2="56"/>
                    <line class="mo-limb" x1="116" y1="56" x2="116" y2="93.3"/>
                    <circle class="mo-plate-o" cx="116" cy="93.3" r="9"/>
                    <circle class="mo-hub" cx="116" cy="93.3" r="2.6"/>`
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M160 112 L160 74 M155 82 L160 74 L165 82"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M160 74 L160 112 M155 104 L160 112 L165 104"/>` }
  ]
};

/* =========================================================
   33. HIP THRUST  (hip-thrust)
   -----------------------------------------------------------
   Position  : POINTE DES OMOPLATES appuyée sur le bord d'un banc,
               pieds à plat au sol, barre posée sur le pli de la
               hanche (avec une protection).
   Matériel  : barre + banc.
   Mobiles   : la HANCHE (extension), le genou suivant.
   Fixes     : les PIEDS au sol et le POINT D'APPUI DES OMOPLATES
               sur le banc. Double appui : le corps pivote entre les
               deux, et le schéma est construit exactement ainsi —
               chaîne enracinée au contact d'omoplate, cheville
               vérifiée immobile aux deux positions.
   LA TÊTE  : elle reçoit une CONTRE-ROTATION exacte de −58°, donc
               elle ne bouge pas alors que le buste tourne. Ce n'est
               pas une commodité de dessin : le menton rentré et le
               regard vers l'avant sont LA consigne de sécurité de
               l'exercice, c'est ce qui empêche l'hyperextension
               cervicale et lombaire. Une tête qui suivrait
               passivement le buste montrerait la faute.
   Sens/plan : montée du bassin = concentrique ; descente =
               excentrique. Le cycle commence EN BAS. Plan sagittal.
   ROM       : hanche de 93,2° à 180,0° — exactement 180°, vérifié.
               En haut, épaules, hanches et genoux forment une LIGNE
               DROITE, et pas un degré de plus : monter plus haut ce
               n'est pas contracter le fessier, c'est cambrer les
               lombaires. Le bassin s'élève de 23,4 unités ; le genou
               passe de 126,6° à 102,0°, les tibias finissant
               verticaux.
   Agonistes : GRAND FESSIER avant tout, ischio-jambiers en
               assistance.
   CE QUI REND CET EXERCICE UNIQUE : c'est le seul de la
               bibliothèque où la résistance est maximale en position
               CONTRACTÉE. Barre à l'aplomb au sommet, le bras de
               levier sur la hanche est à son maximum précisément
               quand le fessier est le plus raccourci. C'est
               l'exact contraire du soulevé de terre roumain, qui le
               charge en position ÉTIRÉE. Les deux schémas se lisent
               donc en miroir.
   Distinction : appui haut du dos sur un banc, charge sur le pli de
               hanche. ≠ pont fessier (au sol, sans banc, amplitude
               réduite), ≠ roumain (fessier en étirement).
   GÉOMÉTRIE (calculée) — omoplates SC(152.7,101.94) et cheville
   A(96,140) toutes deux FIXES ; tronc 32, cuisse 26, tibia 26.
   Bas  : hanche(141.76,132.01), genou(116.87,124.49) — le genou est
          bien PLUS HAUT que la hanche.
   Haut : hanche(121.43,108.59), genou(96,114), tibia vertical.
   -> tronc +57,99°, cuisse −86,80° rel, tibia −24,56° rel,
      tête −57,99° rel (contre-rotation).
   ========================================================= */
EXERCISE_MOTIONS["hip-thrust"] = {
  vb: "72 82 124 74",
  dur: 4.0,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Omoplates sur un banc, barre sur la hanche : le bassin monte jusqu'à l'alignement épaules-hanches-genoux, puis redescend.",
  fixe: `
    <line class="mo-ground" x1="80" y1="150" x2="192" y2="150"/>
    <!-- banc : seul le haut du dos y touche -->
    <line class="mo-pad" x1="150" y1="104" x2="188" y2="104"/>
    <line class="mo-gear" x1="158" y1="106" x2="158" y2="150"/>
    <line class="mo-gear" x1="182" y1="106" x2="182" y2="150"/>
    <!-- pied ancré au sol -->
    <line class="mo-limb" x1="86" y1="150" x2="104" y2="150"/>
    <line class="mo-limb" x1="96" y1="140" x2="89" y2="150"/>
    <circle class="mo-joint" cx="96" cy="140" r="2.8"/>
    <!-- point d'appui des omoplates : l'autre ancrage -->
    <circle class="mo-joint" cx="152.7" cy="101.94" r="3"/>`,
  parts: [
    {
      /* TRONC : rotation autour du CONTACT D'OMOPLATE. +57,99°. */
      o: "152.7px 101.94px",
      k: [[0, "rotate(0deg)"], [32, "rotate(57.99deg)"], [40, "rotate(57.99deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `<line class="mo-body" x1="152.7" y1="101.94" x2="141.76" y2="132.01"/>`,
      children: [
        {
          /* TÊTE : contre-rotation exacte -> elle ne bouge pas.
             Menton rentré, regard vers l'avant. */
          o: "152.7px 101.94px",
          k: [[0, "rotate(0deg)"], [32, "rotate(-57.99deg)"], [40, "rotate(-57.99deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-body" x1="152.7" y1="101.94" x2="160" y2="97"/>
            <circle class="mo-head" cx="166" cy="93" r="8"/>`
        },
        {
          /* CUISSE : −86,80° relatif. Elle porte la barre, posée sur
             le pli de la hanche. */
          o: "141.76px 132.01px",
          k: [[0, "rotate(0deg)"], [32, "rotate(-86.8deg)"], [40, "rotate(-86.8deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: ["Grand fessier", "Ischio-jambiers"],
          muscle: `
            <circle cx="139" cy="127" r="5"/>
            <ellipse cx="128.3" cy="131.6" rx="3" ry="9" transform="rotate(-73.3 128.3 131.6)"/>`,
          svg: `
            <line class="mo-limb" x1="141.76" y1="132.01" x2="116.87" y2="124.49"/>
            <circle class="mo-plate-o" cx="141.76" cy="132.01" r="11"/>
            <circle class="mo-hub" cx="141.76" cy="132.01" r="2.6"/>`,
          children: [
            {
              /* TIBIA : −24,56° relatif. Son extrémité retombe
                 exactement sur la cheville ancrée, aux deux positions. */
              o: "116.87px 124.49px",
              k: [[0, "rotate(0deg)"], [32, "rotate(-24.56deg)"], [40, "rotate(-24.56deg)"],
                  [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
              svg: `
                <circle class="mo-joint" cx="116.87" cy="124.49" r="2.8"/>
                <line class="mo-limb" x1="116.87" y1="124.49" x2="96" y2="140"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M80 138 L80 106 M75 114 L80 106 L85 114"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M80 106 L80 138 M75 130 L80 138 L85 130"/>` }
  ]
};

/* =========================================================
   34. LEG CURL ALLONGÉ  (leg-curl)
   -----------------------------------------------------------
   Position  : ALLONGÉ SUR LE VENTRE sur le banc de la machine,
               hanches plaquées, chevilles derrière le boudin, mains
               sur les poignées.
   Matériel  : machine à bras de levier, axe aligné sur le GENOU.
   Mobiles   : le GENOU (flexion), et lui seul.
   Fixes     : la HANCHE et le BASSIN, plaqués sur le banc — donc
               toute la cuisse, dessinée dans les éléments fixes avec
               les ischio-jambiers posés dessus.
               Le DÉCOLLEMENT DU BASSIN est l'erreur classique :
               quand les ischios fatiguent, on soulève les hanches
               pour tricher, et le bas du dos passe en compression.
               C'est d'ailleurs pour l'empêcher que les bons bancs de
               leg curl sont « cassés », légèrement inclinés.
   RÉGLAGE   : comme à la leg extension, l'axe de la machine doit
               être ALIGNÉ sur l'axe du genou, sans quoi le levier
               cisaille l'articulation. Les deux schémas signalent ce
               même repère.
   Sens/plan : flexion du genou, talon vers les fessiers =
               concentrique ; retour = excentrique. Le cycle commence
               jambes tendues. Plan sagittal.
   ROM       : genou de 174,9° à 40,0° (vérifié). Le talon monte
               20,7 unités AU-DESSUS du plan du banc.
   Agonistes : ISCHIO-JAMBIERS, les trois chefs, plus le GASTROCNÉMIEN
               qui participe à la flexion du genou — d'où sa présence
               sur le tibia mobile.
               NUANCE, exactement symétrique de celle de la leg
               extension : allongé à plat, la HANCHE est en EXTENSION,
               donc les ischios partent déjà RACCOURCIS à leur origine
               haute et travaillent en position défavorable. C'est
               l'inverse du leg curl assis, où la hanche fléchie les
               pré-étire. À la leg extension c'était le droit fémoral
               qui subissait ce défaut ; ici ce sont les ischios. Deux
               machines miroir, deux limites miroir.
   Distinction : allongé sur le VENTRE, hanche en extension.
               ≠ leg curl assis (hanche fléchie, ischios pré-étirés),
               ≠ soulevé de terre roumain (hanche dominante, genou
               fixe — l'exact opposé de celui-ci, où la hanche est
               fixe et le genou mobile).
   GÉOMÉTRIE (calculée) — hanche H(100,100), cuisse HORIZONTALE de
   26 -> genou/pivot K(126,100). Tibia 26.
   Bas : pied F0(151.90,102.30), genou 174,9°.
   Haut : pied F1(106.08,83.29), genou 40,0°.
   -> tibia −145,07°. La colonne de charges monte de 14.
   ========================================================= */
EXERCISE_MOTIONS["leg-curl"] = {
  vb: "36 66 152 92",
  dur: 3.6,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Allongé sur le ventre, chevilles derrière le boudin : les talons remontent vers les fessiers par flexion des genoux, puis redescendent lentement.",
  fixe: `
    <line class="mo-ground" x1="44" y1="150" x2="176" y2="150"/>
    <!-- banc + bâti -->
    <line class="mo-pad" x1="44" y1="104" x2="126" y2="104"/>
    <line class="mo-gear" x1="60" y1="106" x2="60" y2="150"/>
    <line class="mo-gear" x1="118" y1="106" x2="118" y2="150"/>
    <line class="mo-gear" x1="141" y1="112" x2="141" y2="150"/>
    <!-- CORPS : tout est immobile, cuisse comprise -->
    <circle class="mo-head" cx="48" cy="96" r="8"/>
    <line class="mo-body" x1="56" y1="100" x2="100" y2="100"/>
    <line class="mo-limb" x1="60" y1="100" x2="53" y2="110"/>
    <line class="mo-limb" x1="100" y1="100" x2="126" y2="100"/>
    <circle class="mo-joint" cx="100" cy="100" r="2.8"/>
    <!-- AXE DE LA MACHINE CONFONDU AVEC L'AXE DU GENOU -->
    <circle class="mo-pulley" cx="126" cy="100" r="4.5"/>
    <line class="mo-rom" x1="126" y1="86" x2="126" y2="114"/>`,
  muscles: [
    { nom: "Ischio-jambiers",
      svg: `<ellipse cx="113" cy="96" rx="11" ry="3.4"/>` }
  ],
  parts: [
    {
      /* COLONNE DE CHARGES : translation verticale pure. */
      k: [[0, "translate(0px,0px)"], [32, "translate(0px,-14px)"],
          [40, "translate(0px,-14px)"], [88, "translate(0px,0px)"],
          [100, "translate(0px,0px)"]],
      svg: `
        <rect class="mo-mass" x="134" y="118" width="14" height="6" rx="1.5"/>
        <rect class="mo-mass" x="134" y="126" width="14" height="6" rx="1.5"/>
        <rect class="mo-mass" x="134" y="134" width="14" height="6" rx="1.5"/>`
    },
    {
      /* TIBIA + BOUDIN : rotation autour du PIVOT, qui est aussi le
         genou. −145,07° referme le genou de 175° à 40°. */
      o: "126px 100px",
      k: [[0, "rotate(0deg)"], [32, "rotate(-145.07deg)"], [40, "rotate(-145.07deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Gastrocnémien",
      muscle: `<ellipse cx="138.95" cy="97.65" rx="9" ry="3" transform="rotate(5.07 138.95 97.65)"/>`,
      svg: `
        <line class="mo-gear" x1="126" y1="100" x2="151.9" y2="102.3"/>
        <line class="mo-limb" x1="126" y1="100" x2="151.9" y2="102.3"/>
        <circle class="mo-mass" cx="151.9" cy="102.3" r="6"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M168 110 L168 78 M163 86 L168 78 L173 86"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M168 78 L168 110 M163 102 L168 110 L173 102"/>` }
  ]
};

/* =========================================================
   35. PONT FESSIER (GLUTE BRIDGE)  (pont-fessier)
   -----------------------------------------------------------
   Position  : ALLONGÉ SUR LE DOS au sol, genoux fléchis, pieds à
               plat près des fessiers, bras le long du corps.
   Matériel  : aucun.
   Mobiles   : la HANCHE (extension), le genou suivant.
   Fixes     : les PIEDS et les ÉPAULES, toutes deux AU SOL. Double
               appui, comme au hip thrust — mais les deux ancrages
               sont ici à la MÊME hauteur, et c'est toute la
               différence.
   CE QUE CELA CHANGE, CHIFFRÉ : les épaules étant au sol et non
               surélevées sur un banc, le bassin ne peut pas
               descendre plus bas que le sol. Sa course n'est donc
               que de 14,3 unités, contre 23,4 au hip thrust — soit
               61 % de l'amplitude. C'est exactement pourquoi le pont
               est la version d'apprentissage sans matériel, et le
               hip thrust la version chargée : ce n'est pas une
               question de charge, c'est une question de COURSE
               disponible.
   LA TÊTE  : comme au hip thrust, contre-rotation exacte de −26,5° —
               elle reste posée au sol pendant que le buste pivote.
               Les bras aussi restent au sol, donc dessinés parmi les
               éléments fixes.
   Sens/plan : montée du bassin = concentrique ; descente =
               excentrique. Le cycle commence bassin au sol.
   ROM       : hanche de 115,0° à 180,0° (vérifié). Même critère
               d'arrêt qu'au hip thrust : épaules, hanches et genoux
               ALIGNÉS, pas un degré de plus, sous peine de cambrer
               les lombaires au lieu de contracter le fessier.
   Agonistes : GRAND FESSIER, ischio-jambiers en assistance.
   Distinction : AU SOL, épaules au sol, sans charge.
               ≠ hip thrust (épaules sur un banc, 64 % d'amplitude en
               plus, charge lourde possible).
   GÉOMÉTRIE (calculée) — épaules SC(150,134) et cheville A(96,134)
   toutes deux FIXES au sol ; tronc 32, cuisse 26, tibia 26.
   Bas  : hanche(118,134) posée au sol, genou(107,110.44).
   Haut : alignement -> hanche(121.37,119.70), genou(98.11,108.09).
   -> tronc +26,54°, cuisse −64,97° rel, tibia +18,06° rel,
      tête −26,54° rel.
   ========================================================= */
EXERCISE_MOTIONS["pont-fessier"] = {
  vb: "76 94 108 56",
  dur: 3.8,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Allongé sur le dos, genoux fléchis, pieds à plat : le bassin monte jusqu'à l'alignement épaules-hanches-genoux, puis redescend au sol.",
  fixe: `
    <line class="mo-ground" x1="80" y1="140" x2="180" y2="140"/>
    <!-- pied ancré au sol -->
    <line class="mo-limb" x1="86" y1="140" x2="104" y2="140"/>
    <line class="mo-limb" x1="96" y1="134" x2="89" y2="140"/>
    <circle class="mo-joint" cx="96" cy="134" r="2.8"/>
    <!-- épaule au sol : l'autre ancrage -->
    <circle class="mo-joint" cx="150" cy="134" r="3"/>
    <!-- bras posés au sol, ils ne bougent pas -->
    <line class="mo-limb" x1="146" y1="136" x2="128" y2="138"/>`,
  parts: [
    {
      /* TRONC : rotation autour de l'appui d'épaule. +26,54°. */
      o: "150px 134px",
      k: [[0, "rotate(0deg)"], [32, "rotate(26.54deg)"], [40, "rotate(26.54deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `<line class="mo-body" x1="150" y1="134" x2="118" y2="134"/>`,
      children: [
        {
          /* TÊTE : contre-rotation -> elle reste posée au sol. */
          o: "150px 134px",
          k: [[0, "rotate(0deg)"], [32, "rotate(-26.54deg)"], [40, "rotate(-26.54deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-body" x1="150" y1="134" x2="156" y2="132"/>
            <circle class="mo-head" cx="164" cy="130" r="8"/>`
        },
        {
          o: "118px 134px",
          k: [[0, "rotate(0deg)"], [32, "rotate(-64.97deg)"], [40, "rotate(-64.97deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: ["Grand fessier", "Ischio-jambiers"],
          muscle: `
            <circle cx="117" cy="131" r="4.5"/>
            <ellipse cx="109.3" cy="123.7" rx="3" ry="9" transform="rotate(-25 109.3 123.7)"/>`,
          svg: `<line class="mo-limb" x1="118" y1="134" x2="107" y2="110.44"/>`,
          children: [
            {
              /* TIBIA : +18,06° relatif. Son extrémité retombe
                 exactement sur la cheville ancrée, aux deux positions. */
              o: "107px 110.44px",
              k: [[0, "rotate(0deg)"], [32, "rotate(18.06deg)"], [40, "rotate(18.06deg)"],
                  [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
              svg: `
                <circle class="mo-joint" cx="107" cy="110.44" r="2.8"/>
                <line class="mo-limb" x1="107" y1="110.44" x2="96" y2="134"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M84 132 L84 106 M79 114 L84 106 L89 114"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M84 106 L84 132 M79 124 L84 132 L89 124"/>` }
  ]
};

/* =========================================================
   36. EXTENSIONS MOLLETS DEBOUT  (mollets-debout)
   -----------------------------------------------------------
   Position  : DEBOUT à la machine, coussinets sur les épaules,
               AVANT-PIEDS sur la cale, TALONS DANS LE VIDE, jambes
               TENDUES, buste droit.
   Matériel  : machine à mollets debout (charge sur les épaules) ou
               simple marche.
   Mobiles   : la CHEVILLE, et elle seule (flexion plantaire).
   Fixes     : le GENOU — TENDU, et c'est capital, voir plus bas —
               la hanche et le rachis.
   POURQUOI UNE CALE : le talon doit pouvoir descendre SOUS le niveau
               de l'avant-pied. À plat sur le sol, on perd toute la
               moitié basse de l'amplitude, celle qui met le muscle en
               étirement. Ici le talon parcourt 16,5 unités.
   Sens/plan : montée sur la pointe = concentrique ; descente
               contrôlée en étirement = excentrique. Le cycle commence
               talon bas. Plan sagittal.
   ROM       : 45° de rotation du pied autour de l'avant-pied, du
               talon nettement sous la cale jusqu'à l'extension
               complète sur la pointe.
   MODÉLISATION : seul le PIED tourne, autour de l'appui d'avant-pied.
               Toute la jambe et le corps reçoivent une
               contre-rotation exacte de +45° : ils ne basculent donc
               pas, ils MONTENT. C'est bien ce qui se passe — le corps
               s'élève sans jamais pencher, sinon on tomberait.
   Agonistes : TRICEPS SURAL, et plus précisément le GASTROCNÉMIEN.
               C'EST TOUTE LA RAISON D'ÊTRE DE LA VERSION DEBOUT : le
               gastrocnémien croise le GENOU. Genou TENDU, il est
               étiré donc pleinement efficace, et il domine le
               mouvement. Genou FLÉCHI — la version assise — il part
               raccourci, devient inefficace, et c'est le SOLÉAIRE
               qui prend le relais.
               C'est le même principe que la longue portion du triceps
               (poulie / front / nuque), que le droit fémoral à la leg
               extension et que les ischios au leg curl : un muscle
               qui croise deux articulations voit son efficacité
               décidée par la position de l'AUTRE articulation. Quatre
               familles d'exercices, une seule règle.
   Distinction : genou TENDU -> gastrocnémien. ≠ mollets assis (genou
               fléchi -> soléaire). Ce n'est pas une variante de
               confort, les deux ne travaillent pas le même muscle.
   GÉOMÉTRIE (calculée) — appui d'avant-pied P(110,140) qui sert de
   PIVOT. Cheville A(118,135), talon(130,148).
   Rotation du pied −45° -> cheville(112.12,130.81), talon(129.80,
   131.52). Le talon s'élève de 16,48 et le corps entier de 4,19.
   ========================================================= */
EXERCISE_MOTIONS["mollets-debout"] = {
  vb: "84 24 92 140",
  dur: 3.4,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Avant-pieds sur une cale, talons dans le vide, jambes tendues : montée complète sur la pointe des pieds, puis descente lente jusqu'à l'étirement sous le niveau de la cale.",
  fixe: `
    <line class="mo-ground" x1="88" y1="158" x2="168" y2="158"/>
    <!-- cale : son bord est le pivot, le talon passe dans le vide -->
    <rect class="mo-gear" x="88" y="140" width="32" height="18" rx="2"/>
    <line class="mo-pad" x1="88" y1="140" x2="120" y2="140"/>
    <circle class="mo-pulley" cx="110" cy="140" r="4"/>`,
  parts: [
    {
      /* PIED : rotation autour de l'appui d'AVANT-PIED. −45°. */
      o: "110px 140px",
      k: [[0, "rotate(0deg)"], [32, "rotate(-45deg)"], [40, "rotate(-45deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="110" y1="140" x2="130" y2="148"/>
        <line class="mo-limb" x1="110" y1="140" x2="118" y2="135"/>`,
      children: [
        {
          /* JAMBE + CORPS : contre-rotation exacte de +45°. Rotation
             absolue nulle : le corps MONTE sans jamais basculer. */
          o: "118px 135px",
          k: [[0, "rotate(0deg)"], [32, "rotate(45deg)"], [40, "rotate(45deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Gastrocnémien (jumeaux)",
          muscle: `<ellipse cx="122.5" cy="120" rx="4" ry="11"/>`,
          svg: `
            <circle class="mo-joint" cx="118" cy="135" r="2.8"/>
            <line class="mo-limb" x1="118" y1="135" x2="119" y2="109"/>
            <circle class="mo-joint" cx="119" cy="109" r="2.6"/>
            <line class="mo-limb" x1="119" y1="109" x2="120" y2="83"/>
            <line class="mo-body" x1="120" y1="83" x2="121" y2="51"/>
            <circle class="mo-head" cx="116" cy="37" r="9"/>
            <!-- coussinets de charge sur les épaules -->
            <rect class="mo-mass" x="110" y="46" width="22" height="7" rx="2"/>
            <line class="mo-limb" x1="121" y1="53" x2="126" y2="72"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M152 148 L152 116 M147 124 L152 116 L157 124"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M152 116 L152 148 M147 140 L152 148 L157 140"/>` }
  ]
};

/* =========================================================
   37. EXTENSIONS MOLLETS ASSIS  (mollets-assis)
   -----------------------------------------------------------
   Position  : ASSIS, avant-pieds sur la cale, talons dans le vide,
               COUSSINETS POSÉS SUR LES CUISSES juste au-dessus des
               genoux, genoux fléchis autour de 90°.
   Matériel  : machine à mollets assis — la charge appuie sur les
               cuisses, pas sur les épaules.
   Mobiles   : la CHEVILLE, et elle seule. Le genou et la hanche
               suivent passivement : les cuisses s'élèvent de 3,3
               unités en soulevant les coussinets, ce qui est
               justement la façon dont la charge est déplacée.
   Fixes     : le BASSIN sur le siège et l'AVANT-PIED sur la cale.
               Encore une double chaîne fermée, la troisième forme
               rencontrée : ici les deux ancrages sont à des hauteurs
               différentes et c'est le GENOU qui est le point mobile
               entre les deux.
   Sens/plan : montée sur la pointe = concentrique ; descente en
               étirement = excentrique. Le cycle commence talon bas.
   ROM       : 45° de rotation du pied, exactement comme debout. Le
               talon parcourt les mêmes 16,5 unités et descend sous
               le niveau de la cale. L'amplitude n'est donc PAS ce
               qui distingue les deux versions.
   Agonistes : SOLÉAIRE. C'EST TOUTE LA RAISON D'ÊTRE DE CETTE
               VERSION, et elle est l'exact pendant de la version
               debout. Le genou est fléchi à ~95°, vérifié aux deux
               positions : le gastrocnémien, qui croise le genou,
               part donc RACCOURCI et devient inefficace. Le
               SOLÉAIRE, qui ne croise QUE la cheville, n'est pas
               affecté par la position du genou et prend tout le
               travail.
               Debout et assis ne sont donc pas deux variantes de
               confort : ils travaillent deux muscles différents, et
               les deux sont nécessaires. C'est la même règle que
               pour la longue portion du triceps, le droit fémoral et
               les ischios — un muscle bi-articulaire voit son
               efficacité décidée par l'AUTRE articulation.
   Distinction : genou FLÉCHI -> soléaire, charge sur les CUISSES.
               ≠ mollets debout (genou tendu -> gastrocnémien, charge
               sur les épaules).
   GÉOMÉTRIE (calculée) — bassin H(145,108) et avant-pied P(110,140)
   tous deux FIXES ; cuisse 26, tibia 26.
   Bas  : cheville(118,135), genou(119.02,109.02), talon y=148,
          genou à 94,5°.
   Haut : pied tourné de −45° -> cheville(112.12,130.81),
          genou(119.10,105.76), talon y=131.51, genou à 100,6°.
   -> pied −45°, tibia +58,31° rel, cuisse −6,12° rel,
      tronc −7,19° rel (il reste vertical).
   ========================================================= */
EXERCISE_MOTIONS["mollets-assis"] = {
  vb: "82 46 108 120",
  dur: 3.4,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Assis, coussinets sur les cuisses, avant-pieds sur la cale : montée complète sur la pointe des pieds, puis descente lente en étirement sous le niveau de la cale.",
  fixe: `
    <line class="mo-ground" x1="86" y1="158" x2="184" y2="158"/>
    <!-- cale : son bord est le pivot, le talon passe dans le vide -->
    <rect class="mo-gear" x="88" y="140" width="32" height="18" rx="2"/>
    <line class="mo-pad" x1="88" y1="140" x2="120" y2="140"/>
    <circle class="mo-pulley" cx="110" cy="140" r="4"/>
    <!-- siège : le bassin y est ancré -->
    <line class="mo-pad" x1="138" y1="112" x2="176" y2="112"/>
    <line class="mo-gear" x1="146" y1="114" x2="146" y2="158"/>
    <line class="mo-gear" x1="170" y1="114" x2="170" y2="158"/>
    <circle class="mo-joint" cx="145" cy="108" r="3"/>`,
  parts: [
    {
      /* PIED : rotation autour de l'appui d'AVANT-PIED. −45°,
         identique à la version debout. */
      o: "110px 140px",
      k: [[0, "rotate(0deg)"], [32, "rotate(-45deg)"], [40, "rotate(-45deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="110" y1="140" x2="130" y2="148"/>
        <line class="mo-limb" x1="110" y1="140" x2="118" y2="135"/>`,
      children: [
        {
          /* TIBIA : +58,31° relatif. Il porte le SOLÉAIRE. */
          o: "118px 135px",
          k: [[0, "rotate(0deg)"], [32, "rotate(58.31deg)"], [40, "rotate(58.31deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Soléaire",
          muscle: `<ellipse cx="122" cy="122" rx="4" ry="11" transform="rotate(-2 122 122)"/>`,
          svg: `
            <circle class="mo-joint" cx="118" cy="135" r="2.8"/>
            <line class="mo-limb" x1="118" y1="135" x2="119.02" y2="109.02"/>`,
          children: [
            {
              /* CUISSE + COUSSINETS : elle s'élève de 3,3 en
                 soulevant la charge. C'est ainsi que le poids est
                 déplacé, et c'est pour cela que les coussinets sont
                 dessinés solidaires de la cuisse. */
              o: "119.02px 109.02px",
              k: [[0, "rotate(0deg)"], [32, "rotate(-6.12deg)"], [40, "rotate(-6.12deg)"],
                  [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
              svg: `
                <circle class="mo-joint" cx="119.02" cy="109.02" r="2.8"/>
                <line class="mo-limb" x1="119.02" y1="109.02" x2="145" y2="108"/>
                <rect class="mo-mass" x="124" y="98" width="22" height="7" rx="2"/>
                <line class="mo-gear" x1="135" y1="98" x2="135" y2="86"/>`,
              children: [
                {
                  /* TRONC : contre-rotation -> il reste vertical. */
                  o: "145px 108px",
                  k: [[0, "rotate(0deg)"], [32, "rotate(-7.19deg)"], [40, "rotate(-7.19deg)"],
                      [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
                  svg: `
                    <line class="mo-body" x1="145" y1="108" x2="147" y2="76"/>
                    <line class="mo-limb" x1="147" y1="78" x2="140" y2="96"/>
                    <circle class="mo-head" cx="143" cy="62" r="9"/>`
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M182 142 L182 110 M177 118 L182 110 L187 118"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M182 110 L182 142 M177 134 L182 142 L187 134"/>` }
  ]
};

/* =========================================================
   38. PLANCHE (GAINAGE)  (planche)
   -----------------------------------------------------------
   Position  : appui sur les AVANT-BRAS et les pointes de pieds,
               COUDES À L'APLOMB DES ÉPAULES, corps en LIGNE DROITE
               de la tête aux talons, nuque neutre dans l'alignement.
   Matériel  : aucun.
   Mobiles   : RIEN. Premier exercice purement ISOMÉTRIQUE de la
               bibliothèque : aucune articulation ne bouge, aucun
               muscle ne change de longueur.
   Le travail : il consiste précisément à NE PAS bouger. Il faut
               empêcher le bassin de S'AFFAISSER — lombaires en
               hyperextension — et de REMONTER en chien tête en bas,
               position qui décharge tout. La performance se mesure
               en TEMPS SOUS TENSION, pas en répétitions.
   Agonistes : transverse et grand droit de l'abdomen, obliques,
               fessiers et érecteurs du rachis en co-contraction.

   COMMENT CE SCHÉMA EST CONSTRUIT — et pourquoi il a fallu étendre
   le moteur plutôt que bricoler :
     - le corps est ENTIÈREMENT dans les éléments fixes. Rien ne
       tourne, rien ne translate. C'est la vérité du mouvement ;
     - pas de flèches de sens, car il n'y a pas de sens. Elles sont
       remplacées par un ANNEAU DE MAINTIEN qui se remplit une fois
       par cycle : il parle de TEMPS sous tension et ne peut pas
       être lu comme un geste à exécuter ;
     - les muscles ne pulsent pas « sur la phase concentrique »,
       ils restent allumés en CONTINU, très légèrement respirants ;
     - un repère d'ALIGNEMENT traverse tout le corps et DÉPASSE aux
       deux bouts, ce qui rend la rectitude tête-talons lisible.
       C'est le seul point technique de l'exercice.
   Fabriquer un faux aller-retour aurait montré un mouvement là où
   l'exercice consiste à n'en faire aucun : un lecteur en aurait
   déduit qu'il faut monter et descendre le bassin, c'est-à-dire
   exactement la faute à éviter.
   GÉOMÉTRIE — épaule S(60,106) à l'aplomb exact du coude (60,130).
   Tête, épaule, hanche(91.3,112.8), genou(116.6,118.4) et
   cheville(142,123.9) sont COLINÉAIRES, vérifié par construction :
   tous placés sur la droite S -> orteils.
   ========================================================= */
EXERCISE_MOTIONS["planche"] = {
  vb: "30 74 150 68",
  dur: 4.0,
  isometrique: true,
  maintien: "104 88",
  alt: "Gainage sur les avant-bras et la pointe des pieds : le corps forme une ligne droite de la tête aux talons et cette position se maintient sans bouger.",
  fixe: `
    <line class="mo-ground" x1="40" y1="130" x2="172" y2="130"/>
    <!-- REPÈRE D'ALIGNEMENT : il dépasse aux deux bouts pour que la
         rectitude tête-talons se lise d'un coup d'oeil. -->
    <line class="mo-rom" x1="34" y1="100" x2="166" y2="129"/>
    <!-- avant-bras au sol, coude À L'APLOMB de l'épaule -->
    <line class="mo-limb" x1="60" y1="130" x2="86" y2="130"/>
    <line class="mo-limb" x1="60" y1="130" x2="60" y2="106"/>
    <circle class="mo-joint" cx="60" cy="130" r="2.8"/>
    <circle class="mo-joint" cx="60" cy="106" r="2.8"/>
    <!-- corps : une seule ligne droite, tête comprise -->
    <circle class="mo-head" cx="47.3" cy="103.2" r="8"/>
    <line class="mo-body" x1="60" y1="106" x2="91.3" y2="112.8"/>
    <line class="mo-body" x1="91.3" y1="112.8" x2="116.6" y2="118.4"/>
    <line class="mo-body" x1="116.6" y1="118.4" x2="142" y2="123.9"/>
    <circle class="mo-joint" cx="91.3" cy="112.8" r="2.6"/>
    <circle class="mo-joint" cx="116.6" cy="118.4" r="2.6"/>
    <!-- pointe de pied au sol -->
    <line class="mo-limb" x1="142" y1="123.9" x2="152" y2="130"/>`,
  muscles: [
    { nom: "Transverse · grand droit",
      svg: `<ellipse cx="75.6" cy="113.4" rx="12" ry="3.4" transform="rotate(12.3 75.6 113.4)"/>` },
    { nom: "Grand fessier",
      svg: `<circle cx="93" cy="108" r="4.5"/>` }
  ],
  parts: []
};

/* =========================================================
   39. CRUNCH AU SOL  (crunch)
   -----------------------------------------------------------
   Position  : ALLONGÉ SUR LE DOS, genoux fléchis, pieds à plat au
               sol, mains aux tempes — jamais derrière la nuque en
               tirant dessus.
   Matériel  : aucun.
   Mobiles   : le RACHIS, qui s'ENROULE. Seul exercice de la
               bibliothèque dont le segment mobile n'est pas un os
               rigide mais une colonne qui se courbe.
   Fixes     : le BASSIN, qui NE DÉCOLLE PAS du sol, et le bas du dos
               qui reste plaqué. C'est LA différence avec le relevé de
               buste : là-bas le bassin bascule et les fléchisseurs de
               hanche prennent le relais du travail abdominal. Ici,
               seules les omoplates quittent le sol.
   Sens/plan : enroulement = concentrique ; déroulement contrôlé =
               excentrique. Le cycle commence à plat. Plan sagittal.
   ROM       : TRÈS COURTE, et c'est volontaire : l'épaule s'élève de
               11 unités, pas davantage. On ne monte pas s'asseoir —
               au-delà, ce n'est plus le grand droit qui travaille.
   Agonistes : GRAND DROIT de l'abdomen, obliques en assistance.
   LA TÊTE   : elle est solidaire du segment haut, sans
               contre-rotation. C'est délibéré et c'est la consigne :
               la nuque reste neutre, la tête accompagne la poitrine
               au lieu de la précéder. Une tête qui bougerait seule
               dessinerait précisément la faute des mains qui tirent
               sur la nuque.
   COMMENT LE RACHIS EST MODÉLISÉ — et pourquoi c'est une
   APPROXIMATION ASSUMÉE :
               une colonne qui s'enroule est une courbe continue ; mes
               segments sont des droites rigides. Le tronc est donc
               coupé en DEUX segments articulés au milieu du dos : le
               segment BAS reste strictement plaqué au sol, le segment
               HAUT pivote. Ce n'est pas la courbe exacte d'un rachis,
               mais c'est fidèle sur le point qui compte — le bas du
               dos ne décolle pas, le haut s'enroule — alors qu'un
               tronc d'un seul tenant tournant autour de la hanche
               aurait dessiné un RELEVÉ DE BUSTE, c'est-à-dire un
               autre exercice.
   Distinction : bassin FIXE, seules les omoplates décollent, faible
               amplitude. ≠ relevé de buste (bassin qui bascule,
               psoas), ≠ relevé de jambes suspendu (c'est le bassin
               qui bouge, pas le buste).
   GÉOMÉTRIE — bassin(120,124) et bas du dos jusqu'à (98,124) au sol.
   Segment haut (98,124)->(76,124), longueur 22, pivotant de +30° ->
   épaule(78.95,113), tête(70.06,104.40).
   ========================================================= */
EXERCISE_MOTIONS["crunch"] = {
  vb: "50 82 132 58",
  dur: 3.4,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Allongé sur le dos, genoux fléchis : les omoplates s'enroulent et décollent du sol de quelques centimètres, le bas du dos restant plaqué, puis retour contrôlé.",
  fixe: `
    <line class="mo-ground" x1="56" y1="130" x2="178" y2="130"/>
    <!-- bassin + bas du dos : PLAQUÉS, ils ne bougent pas -->
    <line class="mo-body" x1="120" y1="124" x2="98" y2="124"/>
    <circle class="mo-joint" cx="120" cy="124" r="2.8"/>
    <!-- repère : cette portion reste en contact avec le sol -->
    <line class="mo-rom" x1="97" y1="128" x2="122" y2="128"/>
    <!-- jambes : genoux fléchis, pieds à plat, immobiles -->
    <line class="mo-limb" x1="120" y1="124" x2="144" y2="113"/>
    <circle class="mo-joint" cx="144" cy="113" r="2.6"/>
    <line class="mo-limb" x1="144" y1="113" x2="163.7" y2="130"/>
    <line class="mo-limb" x1="158" y1="130" x2="174" y2="130"/>`,
  muscles: [
    { nom: "Obliques",
      svg: `<ellipse cx="108" cy="120" rx="9" ry="3"/>` }
  ],
  parts: [
    {
      /* SEGMENT HAUT DU TRONC : pivote autour du MILIEU DU DOS.
         +30° seulement — l'amplitude courte est le mouvement juste,
         pas une simplification. */
      o: "98px 124px",
      k: [[0, "rotate(0deg)"], [32, "rotate(30deg)"], [40, "rotate(30deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Grand droit de l'abdomen",
      muscle: `<ellipse cx="88" cy="119" rx="10" ry="3.2"/>`,
      svg: `
        <circle class="mo-joint" cx="98" cy="124" r="2.6"/>
        <line class="mo-body" x1="98" y1="124" x2="76" y2="124"/>
        <circle class="mo-head" cx="64" cy="121" r="8"/>
        <line class="mo-limb" x1="76" y1="124" x2="82" y2="112"/>
        <line class="mo-limb" x1="82" y1="112" x2="70" y2="116"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M112 110 L112 88 M107 96 L112 88 L117 96"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M112 88 L112 110 M107 102 L112 110 L117 102"/>` }
  ]
};

/* =========================================================
   40. RELEVÉ DE JAMBES SUSPENDU  (releve-jambes-suspendu)
   -----------------------------------------------------------
   Position  : SUSPENDU à une barre fixe, bras tendus, corps gainé,
               jambes tendues.
   Matériel  : barre fixe.
   Mobiles   : la HANCHE, et surtout — c'est LE point technique — la
               RÉTROVERSION DU BASSIN.
   Fixes     : les MAINS sur la barre : chaîne fermée enracinée à la
               barre. Les bras et le haut du buste ne bougent pas,
               ils sont dans les éléments fixes. Aucun balancement :
               l'élan qui viendrait des épaules retirerait tout le
               travail aux abdominaux.
   CE QUE LE SCHÉMA MONTRE ET QU'ON RATE SOUVENT : le mouvement n'est
               PAS une simple flexion de hanche. Le tronc bas est un
               segment à part, articulé, qui BASCULE de 25° — c'est
               la rétroversion du bassin. Tant qu'elle n'a pas lieu,
               ce sont les FLÉCHISSEURS DE HANCHE qui montent les
               jambes, pas les abdominaux. Un repère pointillé marque
               l'horizontale de la hanche : c'est le seuil au-delà
               duquel le travail devient réellement abdominal, et les
               jambes le franchissent de 9 unités.
   Sens/plan : montée des jambes = concentrique ; descente contrôlée
               = excentrique. Le cycle commence jambes basses.
   ROM       : hanche de 180° à 105°, soit 75° de flexion, PLUS 25°
               de rétroversion du bassin. Le genou ne bouge pas :
               rotation relative du tibia de 0,00°, jambes tendues.
   Agonistes : GRAND DROIT de l'abdomen, sa portion basse en premier
               puisque c'est la rétroversion qui la sollicite ;
               obliques ; et le PSOAS en co-agoniste inévitable, qui
               est signalé sur la cuisse plutôt que passé sous
               silence.
   Distinction : c'est le BASSIN et les JAMBES qui bougent, le buste
               reste fixe — l'EXACT INVERSE du crunch, où le buste
               s'enroule et le bassin reste au sol. Les deux sont
               complémentaires et se lisent en miroir.
   GÉOMÉTRIE — mains(120,24) ancrées, bras 40, haut du buste
   (120,64)->(120,82) fixes. Bassin (120,82)->(120,96) pivotant
   de +25° -> hanche(114.08,94.69). Cuisse 26 et tibia 26 alignés
   à 190° -> genou(88.48,90.17), cheville(62.87,85.66).
   -> bassin +25°, cuisse +75° rel, tibia 0,00° rel.
   ========================================================= */
EXERCISE_MOTIONS["releve-jambes-suspendu"] = {
  vb: "50 14 146 150",
  dur: 3.8,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Suspendu à une barre fixe, jambes tendues : le bassin bascule en rétroversion et les jambes montent au-dessus de l'horizontale, puis redescendent lentement.",
  fixe: `
    <line class="mo-bar3" x1="60" y1="24" x2="180" y2="24"/>
    <line class="mo-gear" x1="66" y1="24" x2="66" y2="156"/>
    <line class="mo-gear" x1="174" y1="24" x2="174" y2="156"/>
    <line class="mo-ground" x1="56" y1="156" x2="184" y2="156"/>
    <!-- suspension : mains, bras et haut du buste, tous immobiles -->
    <circle class="mo-hand" cx="120" cy="24" r="3.6"/>
    <line class="mo-limb" x1="120" y1="24" x2="120" y2="64"/>
    <circle class="mo-joint" cx="120" cy="64" r="2.8"/>
    <line class="mo-body" x1="120" y1="62" x2="126" y2="55"/>
    <circle class="mo-head" cx="130" cy="50" r="9"/>
    <line class="mo-body" x1="120" y1="64" x2="120" y2="82"/>
    <!-- SEUIL : au-dessus de cette horizontale, le travail devient
         réellement abdominal ; en dessous ce sont les fléchisseurs. -->
    <line class="mo-rom" x1="58" y1="95" x2="112" y2="95"/>`,
  muscles: [
    { nom: "Obliques",
      svg: `<ellipse cx="116.5" cy="74" rx="3" ry="7"/>` }
  ],
  parts: [
    {
      /* BASSIN : +25° de RÉTROVERSION. C'est ce segment-là qui fait
         la différence entre un vrai relevé abdominal et un simple
         balancement de jambes. */
      o: "120px 82px",
      k: [[0, "rotate(0deg)"], [32, "rotate(25deg)"], [40, "rotate(25deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Grand droit (portion basse)",
      muscle: `<ellipse cx="116.5" cy="89" rx="3" ry="7"/>`,
      svg: `<line class="mo-body" x1="120" y1="82" x2="120" y2="96"/>`,
      children: [
        {
          /* CUISSE : +75° relatif. Elle porte le PSOAS, co-agoniste
             qu'il serait malhonnête de ne pas montrer. */
          o: "120px 96px",
          k: [[0, "rotate(0deg)"], [32, "rotate(75deg)"], [40, "rotate(75deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Psoas (fléchisseur de hanche)",
          muscle: `<ellipse cx="123.5" cy="103" rx="3" ry="7"/>`,
          svg: `
            <circle class="mo-joint" cx="120" cy="96" r="2.8"/>
            <line class="mo-limb" x1="120" y1="96" x2="120" y2="122"/>`,
          children: [
            {
              /* TIBIA : rotation relative NULLE — le genou ne bouge
                 pas, les jambes restent tendues. */
              o: "120px 122px",
              k: [[0, "rotate(0deg)"], [32, "rotate(0deg)"], [40, "rotate(0deg)"],
                  [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
              svg: `
                <circle class="mo-joint" cx="120" cy="122" r="2.6"/>
                <line class="mo-limb" x1="120" y1="122" x2="120" y2="148"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M162 140 L162 104 M157 112 L162 104 L167 112"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M162 104 L162 140 M157 132 L162 140 L167 132"/>` }
  ]
};

/* =========================================================
   41. RUSSIAN TWIST  (russian-twist)
   -----------------------------------------------------------
   Position  : ASSIS au sol, BUSTE INCLINÉ VERS L'ARRIÈRE à environ
               45°, genoux fléchis, mains jointes (ou lest) devant la
               poitrine.
   Matériel  : poids du corps, ou un lest tenu à deux mains.
   Mobiles   : la ROTATION du tronc autour de son axe longitudinal.
   Fixes     : le bassin et les jambes, qui ne doivent pas partir en
               balancier — sinon ce sont les hanches qui tournent et
               plus les obliques qui travaillent.
   Sens      : rotation d'un côté puis de l'autre, en alternance.
   ROM       : 45° de chaque côté, soit 90° d'amplitude totale.
   Agonistes : OBLIQUES, qui travaillent en COUPLE CROISÉ — l'oblique
               externe d'un côté avec l'oblique interne de l'autre.
               Grand droit en gainage, et fléchisseurs de hanche pour
               tenir le buste incliné.

   >>> PREMIER SCHÉMA EN VUE DE DESSUS — ET C'EST DÉLIBÉRÉ <<<
   Les quarante schémas précédents sont en vue SAGITTALE, de profil.
   Ce mouvement est une rotation autour de l'axe long du corps, dans
   le plan TRANSVERSE. De profil, cette rotation est strictement
   INVISIBLE : la silhouette ne changerait pas d'un pixel, et le
   schéma montrerait un corps parfaitement immobile pour un exercice
   qui bouge. Ce serait pire qu'inutile.
   Le schéma est donc dessiné VU DE DESSUS, seule projection où ce
   mouvement existe réellement : la ligne d'épaules balaie 90° autour
   du bassin et le lest décrit un arc, matérialisé en pointillés.
   CE QUE CETTE VUE NE PEUT PAS MONTRER, et qu'il faut donc savoir :
   l'inclinaison du buste vers l'arrière, qui est pourtant ce qui met
   les abdominaux sous tension. Un buste qui se redresse pendant la
   série vide l'exercice de son intérêt. C'est écrit ici faute de
   pouvoir être dessiné.

   LES DEUX « PHASES » NE SONT PAS CONCENTRIQUE/EXCENTRIQUE : ce sont
   les deux SENS de rotation. Dans un mouvement alterné, chaque sens
   est concentrique pour les obliques du côté opposé. Les deux flèches
   du schéma indiquent donc deux directions, pas une montée et une
   descente.
   GÉOMÉTRIE — bassin(110,132) axe de rotation, axe du tronc 40,
   ligne d'épaules 38, lest à 22 du bassin.
   Extrêmes vérifiés à ±45° : tête(71.82,93.82) / (148.18,93.82),
   lest(94.44,116.44) / (125.56,116.44).
   ========================================================= */
EXERCISE_MOTIONS["russian-twist"] = {
  vb: "56 66 116 110",
  dur: 4.0,
  vue: "Vu de dessus",
  phases: { con: [0, 45], ecc: [55, 100] },
  alt: "Vu de dessus. Assis buste incliné en arrière, mains jointes devant la poitrine : le tronc pivote de 45° d'un côté puis de l'autre, bassin et jambes immobiles.",
  fixe: `
    <!-- jambes, vues de dessus : elles ne tournent pas -->
    <line class="mo-limb" x1="110" y1="132" x2="94" y2="166"/>
    <line class="mo-limb" x1="110" y1="132" x2="126" y2="166"/>
    <line class="mo-limb" x1="88" y1="166" x2="100" y2="166"/>
    <line class="mo-limb" x1="120" y1="166" x2="132" y2="166"/>
    <circle class="mo-joint" cx="110" cy="132" r="3.4"/>
    <!-- arc réellement parcouru par le lest : 90° au total -->
    <path class="mo-rom" fill="none" d="M94.44 116.44 A22 22 0 0 1 125.56 116.44"/>`,
  parts: [
    {
      /* TRONC ENTIER : rotation autour du BASSIN, de −45° à +45°.
         Tête, épaules, bras et lest tournent ensemble : c'est un bloc
         rigide qui pivote, ce qu'est réellement le mouvement. */
      o: "110px 132px",
      k: [[0, "rotate(-45deg)"], [45, "rotate(45deg)"], [55, "rotate(45deg)"],
          [100, "rotate(-45deg)"]],
      muscleNom: ["Obliques", "Grand droit (gainage)"],
      muscle: `
        <ellipse cx="101.5" cy="112" rx="3.5" ry="9"/>
        <ellipse cx="118.5" cy="112" rx="3.5" ry="9"/>`,
      svg: `
        <line class="mo-body" x1="110" y1="132" x2="110" y2="92"/>
        <line class="mo-body" x1="91" y1="92" x2="129" y2="92"/>
        <circle class="mo-head" cx="110" cy="78" r="9"/>
        <line class="mo-limb" x1="91" y1="92" x2="110" y2="110"/>
        <line class="mo-limb" x1="129" y1="92" x2="110" y2="110"/>
        <circle class="mo-plate-o" cx="110" cy="110" r="7"/>
        <circle class="mo-hub" cx="110" cy="110" r="2.4"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M132 150 L154 150 M147 145 L154 150 L147 155"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M88 150 L66 150 M73 145 L66 150 L73 155"/>` }
  ]
};

/* =========================================================
   42. ROULETTE À ABDOS  (roulette-abdos)
   -----------------------------------------------------------
   Position  : À GENOUX, roulette tenue à deux mains sous les
               épaules, bras tendus, dos gainé et bassin en légère
               rétroversion.
   Matériel  : roulette à abdos.
   Mobiles   : la HANCHE qui s'ouvre et l'ÉPAULE qui part vers
               l'avant. Le corps se déploie et la roue AVANCE en
               ROULANT — le schéma fait tourner un rayon de 367,6°,
               calculé sur la distance parcourue (64,2 pour un rayon
               de 10) : la roue roule, elle ne glisse pas.
   Fixes     : les GENOUX au sol, racine de toute la chaîne.
   LE POINT TECHNIQUE, ET LE DANGER : le RACHIS doit rester NEUTRE.
               Si le gainage lâche, le bassin bascule en antéversion
               et les lombaires s'écrasent en hyperextension. Dans le
               schéma, tronc et cuisse sont des segments RIGIDES qui
               finissent parfaitement ALIGNÉS — hanche vérifiée à
               180,0° en fin de déroulé, jamais au-delà.
   NATURE DU TRAVAIL — c'est ce qui rend l'exercice singulier :
               les abdominaux ne raccourcissent PAS pour créer le
               mouvement, ils RÉSISTENT à l'extension imposée par le
               poids du corps. C'est un travail ANTI-EXTENSION.
               Conséquence directe sur le sens des phases : le
               DÉROULÉ vers l'avant est l'EXCENTRIQUE — les abdos
               s'allongent sous tension — et le retour est le
               concentrique. C'est l'inverse de l'intuition, qui
               voit dans le déroulé « l'effort ».
   ROM       : hanche de 128,6° à 180,0°. La roue avance de 64,2, les
               épaules descendent de 26 et le corps finit presque
               parallèle au sol.
   Agonistes : GRAND DROIT en anti-extension, obliques, et GRAND
               DORSAL qui freine l'épaule pendant le déroulé.
   Distinction : la roulette est une PLANCHE DYNAMIQUE. Même travail
               anti-extension que le gainage, mais avec une amplitude
               et un bras de levier croissants. ≠ crunch (flexion
               active du rachis), ≠ planche (isométrique, sans
               déplacement).
   GÉOMÉTRIE (calculée) — genou(140,134) ancré, cuisse 26, tronc 32,
   bras 40, roue de rayon 10 roulant au sol.
   Départ : hanche(138,108), épaule(111.5,90), roue(111.5,130),
            bras VERTICAUX sous les épaules.
   Fin    : hanche(115.27,125.97), épaule(84.84,116.08),
            roue(47.34,130).
   -> cuisse −67,60°, tronc +51,42° rel, bras +85,82° rel,
      roue −367,6° (rotation propre).
   ========================================================= */
EXERCISE_MOTIONS["roulette-abdos"] = {
  vb: "30 62 152 90",
  dur: 4.4,
  phases: { ecc: [0, 50], con: [58, 90] },
  alt: "À genoux, roulette sous les épaules : le corps se déploie vers l'avant en gardant le dos neutre jusqu'à l'alignement complet, puis revient.",
  fixe: `
    <line class="mo-ground" x1="36" y1="140" x2="178" y2="140"/>
    <!-- genou ancré au sol, jambe repliée derrière -->
    <circle class="mo-joint" cx="140" cy="134" r="3.2"/>
    <line class="mo-limb" x1="140" y1="134" x2="164" y2="138"/>
    <line class="mo-limb" x1="160" y1="140" x2="172" y2="140"/>`,
  parts: [
    {
      /* CUISSE : rotation autour du GENOU. −67,60°. */
      o: "140px 134px",
      k: [[0, "rotate(0deg)"], [50, "rotate(-67.6deg)"], [58, "rotate(-67.6deg)"],
          [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `<line class="mo-limb" x1="140" y1="134" x2="138" y2="108"/>`,
      children: [
        {
          /* TRONC : segment RIGIDE. Il finit aligné avec la cuisse,
             jamais au-delà — c'est la limite de sécurité. */
          o: "138px 108px",
          k: [[0, "rotate(0deg)"], [50, "rotate(51.42deg)"], [58, "rotate(51.42deg)"],
              [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: ["Grand droit (anti-extension)", "Grand dorsal"],
          muscle: `
            <ellipse cx="122.5" cy="102.3" rx="3.4" ry="11" transform="rotate(-55.8 122.5 102.3)"/>
            <circle cx="114" cy="94" r="4.5"/>`,
          svg: `
            <circle class="mo-joint" cx="138" cy="108" r="2.8"/>
            <line class="mo-body" x1="138" y1="108" x2="111.5" y2="90"/>
            <circle class="mo-head" cx="100.73" cy="82.69" r="8"/>`,
          children: [
            {
              /* BRAS TENDUS : +85,82° relatif. Ils restent droits,
                 le coude ne fléchit pas. */
              o: "111.5px 90px",
              k: [[0, "rotate(0deg)"], [50, "rotate(85.82deg)"], [58, "rotate(85.82deg)"],
                  [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
              svg: `
                <circle class="mo-joint" cx="111.5" cy="90" r="2.8"/>
                <line class="mo-limb" x1="111.5" y1="90" x2="111.5" y2="130"/>`,
              children: [
                {
                  /* ROUE : rotation PROPRE de −367,6°, déduite de la
                     distance parcourue. Le rayon dessiné rend le
                     roulement visible — sans lui, la roue glisserait. */
                  o: "111.5px 130px",
                  k: [[0, "rotate(0deg)"], [50, "rotate(-367.6deg)"], [58, "rotate(-367.6deg)"],
                      [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
                  svg: `
                    <circle class="mo-plate-o" cx="111.5" cy="130" r="10"/>
                    <line class="mo-bar2" x1="111.5" y1="130" x2="111.5" y2="120"/>
                    <circle class="mo-hub" cx="111.5" cy="130" r="2.6"/>`
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M104 70 L66 70 M73 65 L66 70 L73 75"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M66 70 L104 70 M97 65 L104 70 L97 75"/>` }
  ]
};

/* =========================================================
   43. EXTENSION LOMBAIRE AU BANC À 45°  (extension-lombaire-banc)
   -----------------------------------------------------------
   Position  : sur un banc à lombaires incliné à 45°, cuisses
               appuyées sur le coussin, chevilles bloquées sous les
               rouleaux, bras croisés sur la poitrine.
   Matériel  : banc à lombaires à 45°.
   Mobiles   : la HANCHE.
   Fixes     : les CUISSES sur le coussin et les CHEVILLES sous les
               rouleaux — double ancrage. Et le RACHIS, dessiné comme
               un segment RIGIDE.
   LE NOM DE L'EXERCICE EST TROMPEUR, et le schéma corrige cela :
               malgré « extension lombaire » — et pire, « hyper-
               extension » en anglais — le mouvement bien exécuté
               n'est PAS une extension du rachis. C'est une CHARNIÈRE
               DE HANCHE, colonne neutre. La colonne ne doit ni
               s'enrouler ni se cambrer : d'où un tronc modélisé
               comme un seul segment rigide, exactement comme au
               soulevé de terre roumain.
   Sens/plan : descente (flexion de hanche) = excentrique ; remontée
               = concentrique. Le cycle commence en haut, corps
               aligné. Plan sagittal.
   ROM       : hanche de 180,0° à 45,0°, vérifié — le buste finit
               À LA VERTICALE, ce que la gravité impose sur un banc
               incliné à 45°. On ne remonte PAS
               au-delà de l'alignement : l'hyperextension lombaire
               sous charge est précisément ce qu'il faut éviter,
               quoi qu'en dise le nom anglais. Un repère pointillé
               matérialise cette ligne d'alignement, qui est la
               butée haute du mouvement.
   Agonistes : contrairement à ce que le nom suggère encore, les
               moteurs sont le GRAND FESSIER et les ISCHIO-JAMBIERS —
               ce sont eux qui font l'extension de hanche. Les
               ÉRECTEURS DU RACHIS travaillent en ISOMÉTRIE, pour
               tenir la colonne neutre, pas pour créer le mouvement.
               Même répartition qu'au roumain.
   Distinction : charnière de hanche assistée, tronc soutenu, sans
               charge dans les mains. ≠ superman au sol (là c'est une
               VRAIE extension du rachis), ≠ soulevé de terre roumain
               (debout, charge, et c'est le bassin qui recule).
   GÉOMÉTRIE (calculée) — hanche P(120,96) au bord du coussin, sert
   de pivot. Cuisse et tibia de 26 le long du banc à 45° ->
   genou(138.38,114.38), cheville(156.77,132.77).
   Tronc 32 : épaule haut(97.37,73.37) -> bas(120,128), tête finissant
   en (120,141), buste vertical.
   -> tronc −135,00°.
   ========================================================= */
EXERCISE_MOTIONS["extension-lombaire-banc"] = {
  vb: "70 52 124 116",
  dur: 4.0,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Sur un banc à lombaires à 45°, cuisses calées et chevilles bloquées : le buste descend par flexion de hanche en gardant le dos droit, puis remonte jusqu'à l'alignement, sans aller au-delà.",
  fixe: `
    <line class="mo-ground" x1="94" y1="160" x2="188" y2="160"/>
    <!-- coussin des cuisses, incliné à 45° -->
    <line class="mo-pad" x1="126" y1="102" x2="148" y2="124"/>
    <line class="mo-gear" x1="136" y1="114" x2="136" y2="160"/>
    <line class="mo-gear" x1="164" y1="136" x2="164" y2="160"/>
    <!-- rouleaux qui bloquent les chevilles : le second ancrage -->
    <circle class="mo-mass" cx="152" cy="139" r="5"/>
    <circle class="mo-mass" cx="166" cy="128" r="5"/>
    <!-- jambes immobiles, plaquées sur le banc -->
    <line class="mo-limb" x1="120" y1="96" x2="138.38" y2="114.38"/>
    <circle class="mo-joint" cx="138.38" cy="114.38" r="2.6"/>
    <line class="mo-limb" x1="138.38" y1="114.38" x2="156.77" y2="132.77"/>
    <circle class="mo-joint" cx="120" cy="96" r="3.2"/>
    <!-- LIGNE D'ALIGNEMENT : butée haute du mouvement, on ne la
         dépasse pas. -->
    <line class="mo-rom" x1="150" y1="126" x2="84" y2="60"/>`,
  muscles: [
    { nom: "Grand fessier",
      svg: `<circle cx="127" cy="101" r="5"/>` },
    { nom: "Ischio-jambiers",
      svg: `<ellipse cx="132" cy="102.4" rx="3" ry="10" transform="rotate(-45 132 102.4)"/>` }
  ],
  parts: [
    {
      /* TRONC : segment RIGIDE pivotant autour de la HANCHE. −90°.
         Le rachis ne s'enroule pas et ne se cambre pas : c'est tout
         l'enjeu de l'exercice, et le schéma ne montre donc aucune
         courbure du dos. */
      o: "120px 96px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-135deg)"], [52, "rotate(-135deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Érecteurs du rachis (isométrique)",
      muscle: `<ellipse cx="110" cy="86" rx="3" ry="11" transform="rotate(-45 110 86)"/>`,
      svg: `
        <line class="mo-body" x1="120" y1="96" x2="97.37" y2="73.37"/>
        <circle class="mo-head" cx="88.18" cy="64.18" r="8"/>
        <line class="mo-limb" x1="97.37" y1="73.37" x2="106" y2="82"/>
        <line class="mo-limb" x1="106" y1="82" x2="97" y2="88"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M180 122 L180 86 M175 94 L180 86 L185 94"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M180 86 L180 122 M175 114 L180 122 L185 114"/>` }
  ]
};

/* =========================================================
   44. SUPERMAN AU SOL  (superman)
   -----------------------------------------------------------
   Position  : ALLONGÉ SUR LE VENTRE, bras tendus devant, jambes
               tendues, front vers le sol.
   Matériel  : aucun.
   Mobiles   : le RACHIS en EXTENSION — le buste se soulève — ET les
               HANCHES en extension : les jambes se soulèvent. Les
               deux extrémités décollent EN MÊME TEMPS.
   Fixes     : le BASSIN et l'abdomen, seul point resté au sol. C'est
               le pivot autour duquel les deux extrémités montent, et
               le schéma est construit exactement ainsi : deux
               segments partant du même point d'appui et tournant en
               sens OPPOSÉS (+12° pour le haut, −12° pour le bas).
   >>> LE CONTRASTE AVEC LE BANC À 45° EST L'INFORMATION PRINCIPALE :
       ici la colonne SE CAMBRE, c'est une VRAIE extension du rachis,
       et les ÉRECTEURS sont les MOTEURS. Au banc à 45°, la colonne
       reste NEUTRE, c'est la hanche qui bouge, et les mêmes érecteurs
       n'y travaillent qu'en ISOMÉTRIE. Deux exercices aux noms
       voisins, deux contraintes opposées — les schémas le montrent :
       segment rigide là-bas, segments qui se cassent au bassin ici.
   Sens/plan : montée = concentrique ; retour au sol = excentrique.
               Le cycle commence à plat. Plan sagittal.
   ROM       : FAIBLE, et c'est volontaire — 12° de chaque côté. Les
               mains s'élèvent de 13,8 et les chevilles de 10,9. Ce
               n'est pas un exercice d'amplitude mais de contraction
               et de contrôle : pousser la cambrure plus loin
               comprime les articulations postérieures du rachis pour
               un gain nul.
   Agonistes : ÉRECTEURS DU RACHIS en moteurs, GRAND FESSIER et
               ISCHIO-JAMBIERS pour l'extension de hanche.
   Distinction : les deux extrémités décollent d'un abdomen resté au
               sol. ≠ extension lombaire au banc (charnière de hanche,
               colonne neutre, corps soutenu), ≠ planche (isométrique
               anti-extension, exactement l'inverse du travail ici).
   GÉOMÉTRIE — bassin(120,124) pivot. Haut : épaule(88,124) et
   main(54,126) -> +12° -> épaule(88.70,117.35), main(55.03,112.23).
   Bas : genou(146,126) et cheville(172,128) -> −12° ->
   genou(145.85,120.55), cheville(171.70,117.10).
   ========================================================= */
EXERCISE_MOTIONS["superman"] = {
  vb: "44 94 142 52",
  dur: 3.6,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Allongé sur le ventre, bras et jambes tendus : les deux extrémités se soulèvent en même temps de quelques centimètres, l'abdomen restant au sol, puis redescendent.",
  fixe: `
    <line class="mo-ground" x1="48" y1="130" x2="182" y2="130"/>
    <!-- seul point resté au sol : l'abdomen, pivot des deux segments -->
    <circle class="mo-joint" cx="120" cy="124" r="3.4"/>
    <!-- niveau de départ : au repos le corps est sur cette ligne, en
         haut les deux extrémités passent au-dessus. -->
    <line class="mo-rom" x1="52" y1="125" x2="178" y2="125"/>`,
  muscles: [
    { nom: "Grand fessier",
      svg: `<circle cx="127" cy="120" r="5"/>` }
  ],
  parts: [
    {
      /* HAUT DU CORPS : +12° autour du bassin. Le rachis s'étend
         réellement — c'est ici que les érecteurs sont MOTEURS. */
      o: "120px 124px",
      k: [[0, "rotate(0deg)"], [32, "rotate(12deg)"], [40, "rotate(12deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Érecteurs du rachis (moteurs)",
      muscle: `<ellipse cx="104" cy="120" rx="12" ry="3.2"/>`,
      svg: `
        <line class="mo-body" x1="120" y1="124" x2="88" y2="124"/>
        <circle class="mo-joint" cx="88" cy="124" r="2.6"/>
        <line class="mo-limb" x1="88" y1="124" x2="54" y2="126"/>
        <circle class="mo-head" cx="78" cy="120" r="7"/>`
    },
    {
      /* BAS DU CORPS : −12°, sens OPPOSÉ. Les jambes montent pendant
         que le buste monte : c'est la signature du superman. */
      o: "120px 124px",
      k: [[0, "rotate(0deg)"], [32, "rotate(-12deg)"], [40, "rotate(-12deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Ischio-jambiers",
      muscle: `<ellipse cx="133" cy="122" rx="10" ry="3"/>`,
      svg: `
        <line class="mo-limb" x1="120" y1="124" x2="146" y2="126"/>
        <circle class="mo-joint" cx="146" cy="126" r="2.6"/>
        <line class="mo-limb" x1="146" y1="126" x2="172" y2="128"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M100 114 L100 98 M95 105 L100 98 L105 105"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M100 98 L100 114 M95 107 L100 114 L105 107"/>` }
  ]
};

/* =========================================================
   45. ROWING INVERSÉ  (rowing-inverse)
   -----------------------------------------------------------
   Position  : SUSPENDU SOUS une barre basse, prise pronation largeur
               d'épaules, bras tendus, corps GAINÉ EN LIGNE DROITE,
               talons au sol.
   Matériel  : barre basse (cage, machine Smith) ou anneaux.
   Mobiles   : le COUDE (flexion) et l'ÉPAULE (extension horizontale
               avec rétraction des omoplates).
   Fixes     : les MAINS sur la barre ET les TALONS au sol. Double
               ancrage : le corps pivote autour des talons pendant que
               les mains ne bougent pas.
   LE CORPS EST UN SEGMENT RIGIDE : c'est un gainage anti-affaissement
               exactement comme la planche, greffé sur un tirage. Si
               le bassin tombe, l'exercice perd son sens — d'où un
               corps modélisé d'un seul tenant, sans cassure possible.
   Sens/plan : tirage vers la barre = concentrique ; descente =
               excentrique. Le cycle commence bras tendus.
   ROM       : coude de 163,8° à 66,7°, le corps se redressant de
               14,7° et l'épaule montant de 20,7.
               CONTRAINTE GÉOMÉTRIQUE INTÉRESSANTE, découverte en
               calculant : avec un corps rigide de 84 ancré aux
               talons et des mains fixes à 102,96 de là, la distance
               main-épaule ne peut PAS descendre sous 18,96 — c'est
               la position où corps, épaule et main sont alignés. Le
               coude ne peut donc pas se fermer autant qu'à une
               traction : sa limite absolue ici est ~57°. Ce n'est pas
               un choix de dessin, c'est la géométrie de l'exercice.
   Agonistes : GRAND DORSAL, TRAPÈZE MOYEN et RHOMBOÏDES pour la
               rétraction, DELTOÏDE POSTÉRIEUR, biceps.
   RÉGLAGE DE LA DIFFICULTÉ : elle se règle par l'INCLINAISON du
               corps — plus il est proche de l'horizontale, plus
               c'est dur. Le schéma montre la version exigeante,
               corps à 7,5° de l'horizontale au départ. C'est ce
               réglage continu qui en fait la progression naturelle
               vers les tractions.
   Distinction : pendant HORIZONTAL et en chaîne fermée du rowing
               barre. ≠ tractions (verticales, corps libre),
               ≠ rowing barre (debout penché, charge externe, corps
               non ancré).
   GÉOMÉTRIE (calculée) — mains(80,96) et talons(170,146) fixes,
   corps rigide 84, bras et avant-bras 20.
   Départ : épaule(86.72,135.03), coude(86.14,115.03).
   Fin    : épaule(92.21,114.30), coude(100,95.88).
   -> corps +14,66°, avant-bras (enraciné à la main) −72,47°,
      bras +97,05° relatif.
   ========================================================= */
EXERCISE_MOTIONS["rowing-inverse"] = {
  vb: "56 74 140 92",
  dur: 3.8,
  phases: { con: [0, 34], ecc: [42, 88] },
  alt: "Suspendu sous une barre basse, corps gainé en ligne droite et talons au sol : la poitrine est tirée vers la barre par flexion des coudes et rétraction des omoplates, puis redescend.",
  fixe: `
    <line class="mo-ground" x1="60" y1="150" x2="192" y2="150"/>
    <!-- barre basse + montants -->
    <line class="mo-bar3" x1="62" y1="96" x2="112" y2="96"/>
    <line class="mo-gear" x1="68" y1="96" x2="68" y2="150"/>
    <!-- talon ancré au sol : le second point fixe -->
    <line class="mo-limb" x1="164" y1="150" x2="180" y2="150"/>
    <circle class="mo-joint" cx="170" cy="146" r="2.8"/>
    <!-- main sur la barre : elle ne bouge pas -->
    <circle class="mo-hand" cx="80" cy="96" r="3.6"/>`,
  parts: [
    {
      /* CORPS : segment RIGIDE pivotant autour des TALONS. +14,66°.
         Aucune cassure au bassin : le gainage est l'exercice. */
      o: "170px 146px",
      k: [[0, "rotate(0deg)"], [34, "rotate(14.66deg)"], [42, "rotate(14.66deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: ["Grand dorsal", "Trapèze moyen · Rhomboïdes"],
      muscle: `
        <ellipse cx="104" cy="139" rx="12" ry="3.6" transform="rotate(7.5 104 139)"/>
        <circle cx="90" cy="131" r="4.5"/>`,
      svg: `
        <line class="mo-body" x1="170" y1="146" x2="86.72" y2="135.03"/>
        <!-- hanche et genou marqués : ces articulations EXISTENT, elles
             ne bougent simplement pas. Sans elles le corps se lirait
             comme une planche de bois plutôt que comme un gainage. -->
        <circle class="mo-joint" cx="118.45" cy="139.21" r="2.4"/>
        <circle class="mo-joint" cx="144.2" cy="142.6" r="2.4"/>
        <circle class="mo-joint" cx="86.72" cy="135.03" r="2.8"/>
        <circle class="mo-head" cx="74" cy="133" r="8"/>`
    },
    {
      /* AVANT-BRAS enraciné à la MAIN, qui ne quitte pas la barre.
         childrenFirst : le bras au premier plan passe par-dessus le
         corps, sinon le coude disparaîtrait derrière le buste. */
      o: "80px 96px",
      k: [[0, "rotate(0deg)"], [34, "rotate(-72.47deg)"], [42, "rotate(-72.47deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      childrenFirst: true,
      svg: `
        <line class="mo-limb" x1="80" y1="96" x2="86.14" y2="115.03"/>
        <circle class="mo-joint" cx="86.14" cy="115.03" r="2.6"/>`,
      children: [
        {
          /* BRAS : +97,05° relatif. Son extrémité rejoint exactement
             l'épaule portée par le corps, aux deux positions. */
          o: "86.14px 115.03px",
          k: [[0, "rotate(0deg)"], [34, "rotate(97.05deg)"], [42, "rotate(97.05deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Deltoïde postérieur",
          muscle: `<ellipse cx="86.4" cy="125" rx="3" ry="7"/>`,
          svg: `<line class="mo-limb" x1="86.14" y1="115.03" x2="86.72" y2="135.03"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M132 130 L132 104 M127 112 L132 104 L137 112"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M132 104 L132 130 M127 122 L132 130 L137 122"/>` }
  ]
};

/* =========================================================
   46. POMPES PIQUÉES  (pompes-pike)
   -----------------------------------------------------------
   Position  : mains et pieds au sol, BASSIN HAUT — le corps forme un
               V inversé —, mains largeur d'épaules, tête entre les
               bras.
   Matériel  : aucun.
   Mobiles   : le COUDE et l'ÉPAULE. Le sommet de la tête descend
               vers le sol entre les mains, puis remonte.
   Fixes     : les MAINS et les PIEDS au sol — double chaîne fermée.
               Et l'ANGLE DU V lui-même, qui doit être MAINTENU :
               tronc et jambes forment ici un bloc rigide à 85°, et
               le bassin ne redescend pas. S'il redescend, on revient
               à une pompe classique.
   POURQUOI LE V — c'est toute la raison d'être de l'exercice : il
               rend la poussée VERTICALE. Corps horizontal (pompe
               classique), la ligne de poussée est horizontale et ce
               sont les PECTORAUX qui travaillent. En V, la ligne de
               poussée passe au-dessus des épaules et c'est le
               DELTOÏDE ANTÉRIEUR qui prend le relais. C'est le
               développé militaire du poids du corps — même
               contraste qu'entre développé couché et développé
               militaire, obtenu sans changer de matériel, juste en
               changeant l'orientation du corps.
   Sens/plan : descente de la tête = excentrique ; poussée =
               concentrique. Le cycle commence bras tendus.
   ROM       : coude de 166,0° à 90,0°. La tête descend jusqu'à
               frôler le sol — vérifié : elle s'arrête à 1,1 unité
               au-dessus, sans jamais le traverser.
   Agonistes : DELTOÏDE ANTÉRIEUR surtout, TRICEPS, trapèze
               supérieur. Les pectoraux ne sont qu'en assistance
               mineure, contrairement à la pompe classique.
   Distinction : bassin HAUT -> poussée verticale -> épaules.
               ≠ pompes classiques (corps horizontal, poussée
               horizontale, pectoraux).
   GÉOMÉTRIE (calculée) — main(70,140) et pied(150,140) fixes, bras
   et avant-bras 20, tronc 32, jambes 52, angle du V 85° fixe
   (donc |épaule-pied| = 58,63 constant).
   Vérification d'atteignabilité faite AVANT de dessiner : avec les
   mains à 80 des pieds, les deux positions extrêmes sont bien dans
   le domaine atteignable — ce n'était pas acquis, un écartement
   main-pied trop grand rend le coude à 90° impossible.
   Haut : épaule(98.36,112.22), coude(82.47,124.36), hanche(124.96,94.43).
   Bas  : épaule(93.51,124.28), coude(73.90,120.38), hanche(115.53,101.07).
   -> avant-bras −27,34°, bras +75,97° rel, corps en V −61,36° rel.
   ========================================================= */
EXERCISE_MOTIONS["pompes-pike"] = {
  vb: "55 80 125 78",
  dur: 3.8,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Mains et pieds au sol, bassin haut en V inversé : la tête descend entre les mains par flexion des coudes, puis les épaules repoussent le corps vers le haut.",
  fixe: `
    <line class="mo-ground" x1="60" y1="140" x2="176" y2="140"/>
    <circle class="mo-hand" cx="70" cy="140" r="3.6"/>
    <line class="mo-limb" x1="144" y1="140" x2="158" y2="140"/>
    <circle class="mo-joint" cx="150" cy="140" r="2.8"/>`,
  parts: [
    {
      /* AVANT-BRAS enraciné à la MAIN, qui ne quitte pas le sol. */
      o: "70px 140px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-27.34deg)"], [52, "rotate(-27.34deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      childrenFirst: true,
      svg: `
        <line class="mo-limb" x1="70" y1="140" x2="82.47" y2="124.36"/>
        <circle class="mo-joint" cx="82.47" cy="124.36" r="2.6"/>`,
      children: [
        {
          /* BRAS : +75,97° relatif. Il porte le TRICEPS. */
          o: "82.47px 124.36px",
          k: [[0, "rotate(0deg)"], [45, "rotate(75.97deg)"], [52, "rotate(75.97deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Triceps brachial",
          muscle: `<ellipse cx="92" cy="121" rx="3" ry="7" transform="rotate(52 92 121)"/>`,
          svg: `<line class="mo-limb" x1="82.47" y1="124.36" x2="98.36" y2="112.22"/>`,
          children: [
            {
              /* CORPS EN V : bloc RIGIDE tronc + jambes, angle de 85°
                 conservé. Son extrémité retombe exactement sur le pied
                 ancré, aux deux positions. */
              o: "98.36px 112.22px",
              k: [[0, "rotate(0deg)"], [45, "rotate(-61.36deg)"], [52, "rotate(-61.36deg)"],
                  [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: ["Deltoïde antérieur", "Trapèze supérieur"],
              muscle: `
                <circle cx="101" cy="115" r="5"/>
                <ellipse cx="107" cy="110" rx="6" ry="3" transform="rotate(-34 107 110)"/>`,
              svg: `
                <circle class="mo-joint" cx="98.36" cy="112.22" r="2.8"/>
                <line class="mo-body" x1="98.36" y1="112.22" x2="124.96" y2="94.43"/>
                <circle class="mo-joint" cx="124.96" cy="94.43" r="2.6"/>
                <line class="mo-body" x1="124.96" y1="94.43" x2="150" y2="140"/>
                <circle class="mo-head" cx="88.39" cy="118.89" r="7"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M166 128 L166 98 M161 106 L166 98 L171 106"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M166 98 L166 128 M161 120 L166 128 L171 120"/>` }
  ]
};

/* =========================================================
   47. FENTES BULGARES  (fentes-bulgares)
   -----------------------------------------------------------
   Position  : en fente, PIED ARRIÈRE POSÉ EN HAUTEUR sur un banc,
               pied avant à plat au sol bien devant, haltères le long
               du corps, buste droit et légèrement penché.
   Matériel  : deux haltères + un banc.
   Mobiles   : hanche, genou et cheville de la jambe AVANT. La jambe
               arrière SUIT passivement.
   Fixes     : le PIED AVANT au sol et le PIED ARRIÈRE sur le banc.
               Double ancrage, mais à des hauteurs TRÈS différentes
               (34 unités d'écart) — c'est la première fois dans la
               bibliothèque, et c'est justement ce qui définit
               l'exercice.
   CE QUE LA SURÉLÉVATION CHANGE : la jambe arrière étant en hauteur,
               elle ne PEUT PAS pousser. Tout le travail est reporté
               sur la jambe avant : l'exercice est quasi UNILATÉRAL,
               la charge par jambe est bien supérieure à ce que le
               poids des haltères laisse croire, et la demande
               d'équilibre est forte.
   OBSERVATION ISSUE DU CALCUL, contre-intuitive : le genou ARRIÈRE
               ne se fléchit pas pendant la descente, il SE TEND —
               il passe de 139,0° à 107,9°... en réalité il se
               referme de 31°, mais bien moins que le genou avant qui
               se referme de 84°. La jambe arrière accompagne, elle
               ne travaille pas. Son genou descend de 15,7 et
               s'arrête à 23,7 du sol.
   Sens/plan : descente = excentrique, remontée = concentrique.
   ROM       : genou AVANT de 173,8° à 89,8°, genou arrière de 139,0°
               à 107,9°. Le genou avant s'arrête 3 unités EN ARRIÈRE
               de l'orteil : il ne part pas loin devant, ce qui est la
               consigne.
   INCLINAISON DU BUSTE : elle passe de 5° à 15°. Ce n'est pas un
               détail — plus le buste penche, plus le FESSIER
               travaille ; plus il est vertical, plus c'est le
               QUADRICEPS. Le schéma montre la version équilibrée.
   Agonistes : QUADRICEPS et GRAND FESSIER de la jambe avant, plus
               les stabilisateurs de hanche pour l'équilibre.
   Distinction : pied arrière SURÉLEVÉ -> jambe arrière hors jeu ->
               unilatéral. ≠ fentes marchées (les deux pieds au sol,
               la jambe arrière participe à la poussée).
   GÉOMÉTRIE (calculée, atteignabilité vérifiée avant tracé) —
   pied avant(96,150) et pied arrière(156,116) ancrés, distants de
   68,96 pour deux jambes de 52 : le bassin doit rester dans la
   lentille d'intersection, ce qui est vérifié aux deux positions.
   Haut : hanche(110,100), genou av(101.64,124.62), ar(130.01,116.60).
   Bas  : hanche(114,118), genou av(88.95,124.97), ar(135.73,132.28).
   -> AVANT tibia −28,25°, cuisse +83,93° rel, tronc −65,68° rel.
      ARRIÈRE tibia −37,43°, cuisse +31,06° rel.
   ========================================================= */
EXERCISE_MOTIONS["fentes-bulgares"] = {
  vb: "62 42 132 124",
  dur: 4.2,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Pied arrière posé sur un banc, pied avant au sol devant : le bassin descend en pliant la jambe avant jusqu'à 90°, la jambe arrière accompagnant sans pousser, puis remontée.",
  fixe: `
    <line class="mo-ground" x1="70" y1="156" x2="188" y2="156"/>
    <!-- banc : c'est lui qui surélève le pied arrière -->
    <line class="mo-pad" x1="148" y1="120" x2="186" y2="120"/>
    <line class="mo-gear" x1="156" y1="122" x2="156" y2="156"/>
    <line class="mo-gear" x1="180" y1="122" x2="180" y2="156"/>
    <!-- pied AVANT à plat au sol -->
    <line class="mo-limb" x1="86" y1="156" x2="106" y2="156"/>
    <line class="mo-limb" x1="96" y1="150" x2="89" y2="156"/>
    <circle class="mo-joint" cx="96" cy="150" r="2.8"/>
    <!-- pied ARRIÈRE posé sur le banc -->
    <line class="mo-limb" x1="156" y1="116" x2="170" y2="120"/>
    <circle class="mo-joint" cx="156" cy="116" r="2.8"/>`,
  parts: [
    {
      /* JAMBE ARRIÈRE : elle ACCOMPAGNE. Dessinée en premier, elle
         passe derrière le corps. */
      o: "156px 116px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-37.43deg)"], [52, "rotate(-37.43deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `<line class="mo-body" x1="156" y1="116" x2="130.01" y2="116.60"/>`,
      children: [
        { o: "130.01px 116.6px",
          k: [[0, "rotate(0deg)"], [45, "rotate(31.06deg)"], [52, "rotate(31.06deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <circle class="mo-joint" cx="130.01" cy="116.6" r="2.6"/>
            <line class="mo-body" x1="130.01" y1="116.6" x2="110" y2="100"/>` }
      ]
    },
    {
      /* JAMBE AVANT : elle porte tout le travail, et le tronc. */
      o: "96px 150px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-28.25deg)"], [52, "rotate(-28.25deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `<line class="mo-limb" x1="96" y1="150" x2="101.64" y2="124.62"/>`,
      children: [
        {
          o: "101.64px 124.62px",
          k: [[0, "rotate(0deg)"], [45, "rotate(83.93deg)"], [52, "rotate(83.93deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: ["Quadriceps", "Grand fessier"],
          muscle: `
            <ellipse cx="103" cy="112" rx="3.4" ry="9" transform="rotate(-19 103 112)"/>
            <circle cx="112" cy="103" r="4.5"/>`,
          svg: `
            <circle class="mo-joint" cx="101.64" cy="124.62" r="2.8"/>
            <line class="mo-limb" x1="101.64" y1="124.62" x2="110" y2="100"/>`,
          children: [
            {
              /* TRONC : son inclinaison passe de 5° à 15°. Plus il
                 penche, plus le fessier prend ; plus il est vertical,
                 plus c'est le quadriceps. */
              o: "110px 100px",
              k: [[0, "rotate(0deg)"], [45, "rotate(-65.68deg)"], [52, "rotate(-65.68deg)"],
                  [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
              svg: `
                <circle class="mo-joint" cx="110" cy="100" r="2.8"/>
                <line class="mo-body" x1="110" y1="100" x2="107.21" y2="68.12"/>
                <line class="mo-limb" x1="107.21" y1="68.12" x2="101" y2="84"/>
                <line class="mo-limb" x1="101" y1="84" x2="97" y2="99"/>
                <line class="mo-bar2" x1="91" y1="99" x2="103" y2="99"/>
                <rect class="mo-mass" x="88" y="94" width="6" height="10" rx="2"/>
                <rect class="mo-mass" x="100" y="94" width="6" height="10" rx="2"/>
                <circle class="mo-head" cx="106" cy="55" r="9"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M76 128 L76 96 M71 104 L76 96 L81 104"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M76 96 L76 128 M71 120 L76 128 L81 120"/>` }
  ]
};

/* =========================================================
   48. BURPEES  (burpees)
   >>> SCHÉMA NON LIVRÉ — SIGNALÉ, PAS BÂCLÉ <<<
   -----------------------------------------------------------
   ANALYSE (faite, et valide) :
   Séquence  : DEBOUT -> flexion, mains posées au sol -> jambes
               projetées en arrière, position de PLANCHE -> souvent
               une pompe -> jambes ramenées sous le corps -> SAUT
               vertical, bras au-dessus de la tête -> retour debout.
   Matériel  : aucun.
   Mobiles   : tout le corps.
   Agonistes : quadriceps, fessiers, pectoraux, triceps, épaules,
               gainage. C'est un mouvement cardio full-body, pas un
               exercice de muscle isolé.

   POURQUOI AUCUN SCHÉMA N'EST LIVRÉ :
   ce n'est PAS le nombre de positions qui bloque — le format de
   keyframes en accepte autant qu'on veut, et plusieurs schémas déjà
   livrés en utilisent cinq. Le blocage est ailleurs, et il est
   structurel : PENDANT UN BURPEE, AUCUN POINT DU CORPS N'EST FIXE.
   Les pieds quittent le sol au saut, les mains le touchent puis le
   quittent. Or tout le moteur est bâti sur des chaînes articulées
   ENRACINÉES à un point immobile — c'est ce qui garantit que les
   segments restent solidaires et que les contacts au sol tiennent.
   Sans ancrage, il faudrait calculer indépendamment la trajectoire
   de chaque segment à chaque instant : ce n'est plus un squelette
   articulé, c'est de l'animation image par image. Les phases
   concentrique/excentrique et les deux flèches de sens n'auraient
   pas davantage de signification sur un enchaînement.

   POURQUOI JE N'ÉTENDS PAS LE MOTEUR POUR AUTANT — c'est un choix,
   pas une impossibilité :
   un « mode séquence » (frise de positions clés numérotées) serait
   la bonne réponse SI plusieurs exercices en avaient besoin. J'ai
   vérifié : sur toute la bibliothèque, le burpee est le SEUL vrai
   enchaînement sans ancrage. Les autres candidats gardent tous un
   point fixe et sont des mouvements dirigés normaux — mountain
   climbers (mains au sol), step-ups (pied sur le banc), kettlebell
   swing (pieds au sol). Un mode de rendu entier construit pour un
   cas unique serait plus difficile à garder juste qu'il ne
   rapporterait. Le moteur a déjà été étendu deux fois, à chaque fois
   parce qu'un exercice l'imposait et qu'aucune alternative honnête
   n'existait ; ici l'alternative existe et elle est honnête.

   L'exercice retombe donc sur le pictogramme générique, explicitement
   étiqueté « Schéma générique ». Si d'autres enchaînements entrent
   un jour dans la bibliothèque, le mode séquence se justifiera et
   cette note sera le point de départ.
   ========================================================= */

/* =========================================================
   49. MOUNTAIN CLIMBERS  (mountain-climbers)
   -----------------------------------------------------------
   Position  : en PLANCHE BRAS TENDUS, mains sous les épaules, corps
               en ligne droite de la tête aux talons.
   Matériel  : aucun.
   Mobiles   : les HANCHES et les GENOUX, en ALTERNANCE — un genou
               vient sous la poitrine pendant que l'autre jambe reste
               tendue, puis on inverse.
   Fixes     : les MAINS au sol, les BRAS tendus, et surtout le
               TRONC. C'est LE point technique et c'est pour cela que
               tout le haut du corps est dans les éléments fixes : le
               bassin ne doit ni monter, ni descendre, ni tourner. Le
               gainage est la moitié de l'exercice ; sans lui il ne
               reste qu'un pédalage.
   LES DEUX « PHASES » SONT LES DEUX JAMBES, pas un concentrique et un
               excentrique. Comme au russian twist, le mouvement est
               ALTERNÉ : chaque jambe est motrice à son tour, et les
               deux flèches indiquent les deux jambes plutôt qu'une
               montée et une descente. Les deux jambes portent donc
               des animations en OPPOSITION DE PHASE.
   ROM       : hanche de 179,7° (jambe tendue) à 45,2° (genou sous la
               poitrine) ; genou de 180,0° à 55,2°. Le genou fléchi
               s'arrête 11 unités au-dessus du sol et le pied 2 : on
               reste au ras du sol sans le toucher, ce qui est
               l'exécution réelle.
   Agonistes : GAINAGE avant tout — grand droit, obliques, transverse
               — pour immobiliser le tronc, plus les FLÉCHISSEURS DE
               HANCHE qui ramènent le genou. Composante cardio forte.
   Distinction : PLANCHE DYNAMIQUE à jambes alternées, tronc
               immobile. ≠ planche (statique, rien ne bouge),
               ≠ burpee (le corps entier se déplace, aucun point fixe).
   GÉOMÉTRIE (calculée) — main(66,140) et bras vertical de 32 ->
   épaule(66,108) ; tronc 32,6 -> hanche(98,114). Cuisse et tibia 26,5.
   Jambe tendue : genou(124,119), cheville(150,124).
   Jambe fléchie : genou(76.2,129), pied(100,138).
   -> cuisse +134,58°, tibia −124,75° relatif.
   ========================================================= */
EXERCISE_MOTIONS["mountain-climbers"] = {
  vb: "48 86 130 66",
  dur: 2.6,
  phases: { con: [0, 45], ecc: [55, 100] },
  alt: "En position de planche bras tendus : les genoux viennent alternativement sous la poitrine, au ras du sol, pendant que le tronc reste parfaitement immobile.",
  fixe: `
    <line class="mo-ground" x1="54" y1="140" x2="172" y2="140"/>
    <!-- main au sol, bras tendu vertical : rien de tout cela ne bouge -->
    <circle class="mo-hand" cx="66" cy="140" r="3.6"/>
    <line class="mo-limb" x1="66" y1="140" x2="66" y2="108"/>
    <circle class="mo-joint" cx="66" cy="108" r="2.8"/>
    <!-- TRONC IMMOBILE : c'est l'exercice. -->
    <line class="mo-body" x1="66" y1="108" x2="98" y2="114"/>
    <circle class="mo-joint" cx="98" cy="114" r="2.8"/>
    <circle class="mo-head" cx="54" cy="105" r="7"/>`,
  muscles: [
    { nom: "Gainage (grand droit · obliques)",
      svg: `<ellipse cx="82" cy="115" rx="12" ry="3.4" transform="rotate(10.6 82 115)"/>` }
  ],
  parts: [
    {
      /* JAMBE A : tendue au départ, elle se replie à mi-cycle. */
      o: "98px 114px",
      k: [[0, "rotate(0deg)"], [45, "rotate(134.58deg)"], [55, "rotate(134.58deg)"],
          [100, "rotate(0deg)"]],
      muscleNom: "Fléchisseurs de hanche",
      muscle: `<ellipse cx="104" cy="117" rx="6" ry="3"/>`,
      svg: `<line class="mo-limb" x1="98" y1="114" x2="124" y2="119"/>`,
      children: [
        { o: "124px 119px",
          k: [[0, "rotate(0deg)"], [45, "rotate(-124.75deg)"], [55, "rotate(-124.75deg)"],
              [100, "rotate(0deg)"]],
          svg: `
            <circle class="mo-joint" cx="124" cy="119" r="2.6"/>
            <line class="mo-limb" x1="124" y1="119" x2="150" y2="124"/>` }
      ]
    },
    {
      /* JAMBE B : EN OPPOSITION DE PHASE — repliée quand l'autre est
         tendue. C'est l'alternance qui définit l'exercice. */
      o: "98px 114px",
      k: [[0, "rotate(134.58deg)"], [45, "rotate(0deg)"], [55, "rotate(0deg)"],
          [100, "rotate(134.58deg)"]],
      svg: `<line class="mo-body" x1="98" y1="114" x2="124" y2="119"/>`,
      children: [
        { o: "124px 119px",
          k: [[0, "rotate(-124.75deg)"], [45, "rotate(0deg)"], [55, "rotate(0deg)"],
              [100, "rotate(-124.75deg)"]],
          svg: `
            <circle class="mo-joint" cx="124" cy="119" r="2.4"/>
            <line class="mo-body" x1="124" y1="119" x2="150" y2="124"/>` }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M138 96 L112 96 M119 91 L112 96 L119 101"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M112 96 L138 96 M131 91 L138 96 L131 101"/>` }
  ]
};

/* =========================================================
   50. SHRUGS (HAUSSEMENTS D'ÉPAULES)  (shrugs-halteres)
   -----------------------------------------------------------
   Position  : DEBOUT, un haltère dans chaque main le long du corps,
               bras TENDUS, buste droit, regard horizontal.
   Matériel  : deux haltères.
   Mobiles   : l'OMOPLATE, en ÉLÉVATION. C'est le seul exercice de
               toute la bibliothèque dont le segment mobile n'est pas
               un os long articulé mais une SCAPULA qui COULISSE sur
               la cage thoracique. Il est donc animé par une
               TRANSLATION pure, et non par une rotation : c'est la
               modélisation juste, l'omoplate ne pivote pas autour
               d'un axe, elle glisse.
   Fixes     : le COUDE — et c'est l'erreur numéro un de cet
               exercice : dès qu'on plie les bras pour aider, ce sont
               les biceps qui prennent le relais et les trapèzes
               cessent de travailler. Le schéma garde donc le bras
               parfaitement rigide, il monte et descend sans jamais
               se plier. Fixes aussi : le rachis, les hanches.
   Sens/plan : élévation des épaules vers les oreilles =
               concentrique ; descente contrôlée = excentrique.
   ROM       : TRÈS COURTE — 8 unités, quelques centimètres. C'est
               l'amplitude naturelle de l'élévation scapulaire, et
               un repère pointillé marque la hauteur de départ pour
               que ce déplacement se voie. Aucune ROTATION d'épaule :
               les « rolls » n'ajoutent rien et malmènent
               l'articulation, le schéma ne les montre donc pas.
   Agonistes : TRAPÈZE SUPÉRIEUR et ANGULAIRE DE L'OMOPLATE. Ils sont
               dessinés en muscles FIXES bien qu'ils raccourcissent :
               ils relient le rachis immobile à l'omoplate mobile,
               donc aucune des deux catégories ne leur convient
               exactement. Les laisser sur la partie fixe est la
               simplification la moins trompeuse.
   Distinction : seule l'omoplate bouge, le coude reste verrouillé.
               ≠ tous les autres exercices de dos, où c'est le BRAS
               qui se déplace.
   GÉOMÉTRIE — épaule au repos(122,64), élevée(122,56) : translation
   verticale pure de 8. Bras rigide épaule -> coude(120,86) ->
   main(119,108), haltère solidaire.
   ========================================================= */
EXERCISE_MOTIONS["shrugs-halteres"] = {
  vb: "92 30 80 130",
  dur: 3.0,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Debout, un haltère dans chaque main bras tendus : les épaules montent vers les oreilles de quelques centimètres puis redescendent, les coudes restant parfaitement tendus.",
  fixe: `
    <line class="mo-ground" x1="112" y1="152" x2="160" y2="152"/>
    <!-- rachis et jambes : immobiles -->
    <circle class="mo-head" cx="120" cy="42" r="9"/>
    <line class="mo-body" x1="128" y1="56" x2="132" y2="110"/>
    <line class="mo-body" x1="132" y1="110" x2="128" y2="152"/>
    <line class="mo-body" x1="132" y1="110" x2="137" y2="152"/>
    <!-- hauteur de départ de l'épaule : sans ce repère, un
         déplacement de 8 unités passerait inaperçu. -->
    <line class="mo-rom" x1="98" y1="64" x2="116" y2="64"/>`,
  muscles: [
    { nom: "Trapèze supérieur",
      svg: `<ellipse cx="125" cy="60" rx="6.5" ry="3.4" transform="rotate(-40 125 60)"/>` },
    { nom: "Angulaire de l'omoplate",
      svg: `<ellipse cx="129" cy="50" rx="2.6" ry="6.5" transform="rotate(14 129 50)"/>` }
  ],
  parts: [
    {
      /* CEINTURE SCAPULAIRE + BRAS + HALTÈRE : TRANSLATION verticale
         pure de 8. L'omoplate coulisse, elle ne pivote pas — et le
         bras monte d'un bloc, coude jamais fléchi. */
      k: [[0, "translate(0px,0px)"], [32, "translate(0px,-8px)"],
          [40, "translate(0px,-8px)"], [88, "translate(0px,0px)"],
          [100, "translate(0px,0px)"]],
      svg: `
        <line class="mo-limb" x1="128" y1="58" x2="122" y2="64"/>
        <circle class="mo-joint" cx="122" cy="64" r="2.8"/>
        <line class="mo-limb" x1="122" y1="64" x2="120" y2="86"/>
        <circle class="mo-joint" cx="120" cy="86" r="2.4"/>
        <line class="mo-limb" x1="120" y1="86" x2="119" y2="108"/>
        <line class="mo-bar2" x1="113" y1="108" x2="125" y2="108"/>
        <rect class="mo-mass" x="110" y="103" width="6" height="10" rx="2"/>
        <rect class="mo-mass" x="122" y="103" width="6" height="10" rx="2"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M150 82 L150 52 M145 60 L150 52 L155 60"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M150 52 L150 82 M145 74 L150 82 L155 74"/>` }
  ]
};

/* =========================================================
   51. DÉVELOPPÉ DÉCLINÉ À LA BARRE  (developpe-decline-barre)
   -----------------------------------------------------------
   Position  : ALLONGÉ sur un banc DÉCLINÉ d'environ 20° — tête plus
               BASSE que les hanches —, pieds bloqués sous les
               rouleaux, barre en pronation.
   Matériel  : banc décliné + barre.
   Mobiles   : l'ÉPAULE (adduction horizontale) et le COUDE.
   Fixes     : le banc, les pieds sous les rouleaux, le dos plaqué.
   CE QUE LE DÉCLIN CHANGE : la ligne de poussée reste
               PERPENDICULAIRE AU TORSE, et comme le torse est
               incliné vers le bas, cette ligne bascule vers la tête.
               Elle recrute davantage le FAISCEAU INFÉRIEUR du grand
               pectoral et moins le deltoïde antérieur.
               Le schéma le construit littéralement : le verrouillage
               est calculé sur la perpendiculaire au tronc, pas sur
               la verticale. C'est cette perpendiculaire qui définit
               tous les développés.
   LA FAMILLE EST MAINTENANT COMPLÈTE et se lit comme un continuum
               d'angles, un schéma par angle :
                 incliné (+30°) -> haut des pectoraux, épaule très
                                   sollicitée
                 plat    (0°)   -> milieu
                 décliné (−20°) -> bas des pectoraux, épaule
                                   nettement moins sollicitée
               Trois exercices, un seul paramètre qui change, et
               c'est l'inclinaison du banc.
   ROM       : coude de 176,5° à 78,6°. Plus courte qu'au plat : la
               barre descend vers le BAS de la poitrine, pas vers le
               sternum.
   Agonistes : BAS DU GRAND PECTORAL en premier, TRICEPS, deltoïde
               antérieur en retrait.
   Distinction : banc DÉCLINÉ, pieds bloqués. ≠ développé couché
               (banc plat), ≠ développé incliné (banc relevé, effet
               inverse sur le pectoral).
   GÉOMÉTRIE (calculée) — épaule(72,110) fixe, hanche(102,99), donc
   un tronc incliné dont la perpendiculaire vaut (−0.344,−0.938).
   Bras et avant-bras de 22.
   Haut : main(56.86,68.73) sur cette perpendiculaire, coude(64.43,89.36).
   Bas  : main(62,84) au bas de la poitrine, coude(82.89,90.89).
   -> bras +49,82°, avant-bras −101,44° relatif.
   ========================================================= */
EXERCISE_MOTIONS["developpe-decline-barre"] = {
  vb: "36 56 132 90",
  dur: 3.8,
  phases: { ecc: [0, 45], con: [52, 80] },
  alt: "Allongé sur un banc décliné, pieds bloqués : la barre descend vers le bas de la poitrine puis est repoussée perpendiculairement au torse jusqu'aux bras tendus.",
  fixe: `
    <line class="mo-ground" x1="42" y1="140" x2="162" y2="140"/>
    <!-- banc DÉCLINÉ : la tête est plus basse que les hanches -->
    <line class="mo-pad" x1="52" y1="118" x2="134" y2="89"/>
    <line class="mo-gear" x1="62" y1="116" x2="62" y2="140"/>
    <line class="mo-gear" x1="126" y1="93" x2="126" y2="140"/>
    <!-- rouleaux qui bloquent les pieds au point haut -->
    <circle class="mo-mass" cx="143" cy="112" r="5"/>
    <circle class="mo-mass" cx="153" cy="106" r="5"/>
    <!-- corps plaqué : tête en bas, jambes en haut -->
    <circle class="mo-head" cx="52" cy="116" r="8"/>
    <line class="mo-body" x1="72" y1="110" x2="102" y2="99"/>
    <circle class="mo-joint" cx="72" cy="110" r="2.8"/>
    <line class="mo-body" x1="102" y1="99" x2="126.5" y2="90.4"/>
    <circle class="mo-joint" cx="126.5" cy="90.4" r="2.6"/>
    <line class="mo-body" x1="126.5" y1="90.4" x2="145" y2="109"/>`,
  muscles: [
    { nom: "Bas du grand pectoral",
      svg: `<ellipse cx="80" cy="103" rx="10" ry="4" transform="rotate(-20 80 103)"/>` }
  ],
  parts: [
    {
      /* BRAS : rotation autour de l'ÉPAULE. +49,82°. */
      o: "72px 110px",
      k: [[0, "rotate(0deg)"], [45, "rotate(49.82deg)"], [52, "rotate(49.82deg)"],
          [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Triceps brachial",
      muscle: `<ellipse cx="70" cy="100" rx="3" ry="7" transform="rotate(20 70 100)"/>`,
      svg: `<line class="mo-limb" x1="72" y1="110" x2="64.43" y2="89.36"/>`,
      children: [
        {
          /* AVANT-BRAS + BARRE : −101,44° relatif. Le verrouillage se
             fait sur la PERPENDICULAIRE AU TRONC, pas sur la verticale
             — c'est ce qui distingue les trois développés. */
          o: "64.43px 89.36px",
          k: [[0, "rotate(0deg)"], [45, "rotate(-101.44deg)"], [52, "rotate(-101.44deg)"],
              [80, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <circle class="mo-joint" cx="64.43" cy="89.36" r="2.6"/>
            <line class="mo-limb" x1="64.43" y1="89.36" x2="56.86" y2="68.73"/>
            <circle class="mo-plate-o" cx="56.86" cy="68.73" r="9"/>
            <circle class="mo-hub" cx="56.86" cy="68.73" r="2.6"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M104 78 L92 62 M99 66 L92 62 L91 70"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M92 62 L104 78 M97 74 L104 78 L105 70"/>` }
  ]
};

/* =========================================================
   52. ÉCARTÉ COUCHÉ AUX HALTÈRES  (ecarte-halteres)
   -----------------------------------------------------------
   Position  : ALLONGÉ sur un banc PLAT, un haltère dans chaque main,
               bras au-dessus de la poitrine, COUDES LÉGÈREMENT
               FLÉCHIS et qui le RESTENT.
   Matériel  : banc plat + deux haltères.
   Mobiles   : l'ÉPAULE seule, en adduction horizontale.
   Fixes     : le COUDE. Son angle est CONSTANT — vérifié à 150,0°
               aux deux positions, donc |épaule-main| reste
               rigoureusement à 42,51. Le bras est modélisé comme un
               SEGMENT RIGIDE en deux morceaux : c'est la signature
               de l'écarté, exactement comme la cuisse au soulevé de
               terre roumain.
   CE QUI SÉPARE L'ÉCARTÉ DU DÉVELOPPÉ : au développé le coude fléchit
               et s'étend, le mouvement est POLYARTICULAIRE et le
               triceps pousse. Ici le coude est bloqué, le mouvement
               est MONOARTICULAIRE et le pectoral travaille seul en
               adduction. Aucun triceps dans les muscles sollicités,
               et ce n'est pas un oubli.

   >>> VUE DE FACE, DEPUIS LES PIEDS — ET C'EST NÉCESSAIRE <<<
   L'écarté ouvre les bras SUR LES CÔTÉS, dans le plan frontal. De
   profil, ce mouvement irait vers le spectateur et serait invisible,
   exactement comme la rotation du russian twist. Vu de dessus il ne
   vaudrait pas mieux : les bras verticaux s'y projetteraient sur les
   épaules, et les segments sembleraient s'allonger depuis rien — un
   artefact de projection, pas un geste. Seule la vue de FACE, prise
   depuis les pieds, montre l'arc réel sans raccourci.

   ROM       : l'épaule balaie 118°, des mains jointes au-dessus de
               la poitrine jusqu'aux mains au niveau du banc. On ne
               descend PAS plus bas : au-delà, la tête humérale subit
               une contrainte antérieure importante pour un gain nul.
   Agonistes : GRAND PECTORAL en adduction horizontale, deltoïde
               antérieur en assistance.
   NUANCE QUE LE SCHÉMA NE PEUT PAS DESSINER, donc écrite ici : avec
               des HALTÈRES la résistance vient de la gravité, donc
               elle est MAXIMALE bras écartés et QUASI NULLE en haut,
               où la force passe dans l'axe de l'os. À la poulie, la
               tension est continue. Même geste, courbe de résistance
               opposée — c'est pourquoi les deux versions coexistent.
   Distinction : monoarticulaire, coude bloqué, vue de face.
               ≠ développé couché (polyarticulaire, coude mobile,
               triceps), ≠ écarté à la poulie (debout, tension
               continue).
   GÉOMÉTRIE (calculée) — épaules(94,106) et (126,106), bras 24,
   avant-bras 20, coude figé à 150° -> |épaule-main| = 42,51.
   Haut : main gauche(108.54,66.05), coude(107.28,86.01).
   Bas  : main gauche(51.90,111.92), coude(70.11,103.66).
   -> bras gauche −118°, bras droit +118° (miroir exact).
   ========================================================= */
EXERCISE_MOTIONS["ecarte-halteres"] = {
  vb: "34 52 152 88",
  dur: 4.0,
  vue: "Vu de face",
  phases: { ecc: [0, 45], con: [52, 82] },
  alt: "Vu de face depuis les pieds. Allongé sur un banc plat, coudes légèrement fléchis et bloqués : les bras s'ouvrent en arc jusqu'au niveau du banc, puis se referment au-dessus de la poitrine.",
  fixe: `
    <!-- banc vu en bout, et buste en coupe -->
    <line class="mo-pad" x1="86" y1="122" x2="134" y2="122"/>
    <line class="mo-gear" x1="94" y1="124" x2="94" y2="138"/>
    <line class="mo-gear" x1="126" y1="124" x2="126" y2="138"/>
    <line class="mo-ground" x1="76" y1="138" x2="144" y2="138"/>
    <ellipse class="mo-head-solid mo-head" cx="110" cy="96" rx="9" ry="9"/>
    <ellipse class="mo-torse" cx="110" cy="112" rx="18" ry="9"/>
    <circle class="mo-joint" cx="94" cy="106" r="2.8"/>
    <circle class="mo-joint" cx="126" cy="106" r="2.8"/>`,
  muscles: [
    { nom: "Grand pectoral",
      svg: `<ellipse cx="101" cy="108" rx="8" ry="4"/><ellipse cx="119" cy="108" rx="8" ry="4"/>` }
  ],
  parts: [
    {
      /* BRAS GAUCHE : segment RIGIDE, coude figé à 150°. −118°. */
      o: "94px 106px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-118deg)"], [52, "rotate(-118deg)"],
          [82, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="94" y1="106" x2="107.28" y2="86.01"/>
        <circle class="mo-joint" cx="107.28" cy="86.01" r="2.4"/>
        <line class="mo-limb" x1="107.28" y1="86.01" x2="108.54" y2="66.05"/>
        <line class="mo-bar2" x1="102" y1="66" x2="115" y2="66"/>
        <rect class="mo-mass" x="99" y="61" width="6" height="10" rx="2"/>
        <rect class="mo-mass" x="112" y="61" width="6" height="10" rx="2"/>`
    },
    {
      /* BRAS DROIT : miroir exact, +118°. */
      o: "126px 106px",
      k: [[0, "rotate(0deg)"], [45, "rotate(118deg)"], [52, "rotate(118deg)"],
          [82, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="126" y1="106" x2="112.72" y2="86.01"/>
        <circle class="mo-joint" cx="112.72" cy="86.01" r="2.4"/>
        <line class="mo-limb" x1="112.72" y1="86.01" x2="111.46" y2="66.05"/>
        <line class="mo-bar2" x1="105" y1="66" x2="118" y2="66"/>
        <rect class="mo-mass" x="102" y="61" width="6" height="10" rx="2"/>
        <rect class="mo-mass" x="115" y="61" width="6" height="10" rx="2"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M46 82 L64 96 M57 94 L64 96 L62 89"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M64 96 L46 82 M53 84 L46 82 L48 89"/>` }
  ]
};
