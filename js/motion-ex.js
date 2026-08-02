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
   EXACTEMENT au sol, corps compris.
   CORRIGÉ APRÈS COUP : les deux extrêmes étaient justes, mais entre
   les deux la main décollait/s'enfonçait de 3 unités — interpoler
   linéairement trois rotations ne ferme pas une chaîne fermée. Le
   parcours est maintenant résolu par IK en six intervalles ; la
   dérive résiduelle est de 0,30 unité. Le défaut a été trouvé en
   mesurant l'appui à chaque instant, pas seulement en bas et en
   haut.
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
      k: [[0, "rotate(0deg)"], [7.33, "rotate(-1.70deg)"], [14.67, "rotate(-3.40deg)"],
          [22, "rotate(-5.10deg)"], [29.33, "rotate(-6.80deg)"], [36.67, "rotate(-8.50deg)"],
          [44, "rotate(-10.20deg)"], [52, "rotate(-10.20deg)"],
          [56.67, "rotate(-8.50deg)"], [61.33, "rotate(-6.80deg)"], [66, "rotate(-5.10deg)"],
          [70.67, "rotate(-3.40deg)"], [75.33, "rotate(-1.70deg)"],
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
          k: [[0, "rotate(0deg)"], [7.33, "rotate(-13.61deg)"], [14.67, "rotate(-22.45deg)"],
              [22, "rotate(-29.80deg)"], [29.33, "rotate(-36.47deg)"], [36.67, "rotate(-42.88deg)"],
              [44, "rotate(-49.37deg)"], [52, "rotate(-49.37deg)"],
              [56.67, "rotate(-42.88deg)"], [61.33, "rotate(-36.47deg)"], [66, "rotate(-29.80deg)"],
              [70.67, "rotate(-22.45deg)"], [75.33, "rotate(-13.61deg)"],
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
              k: [[0, "rotate(0deg)"], [7.33, "rotate(28.15deg)"], [14.67, "rotate(46.31deg)"],
                  [22, "rotate(61.08deg)"], [29.33, "rotate(74.00deg)"], [36.67, "rotate(85.73deg)"],
                  [44, "rotate(96.60deg)"], [52, "rotate(96.60deg)"],
                  [56.67, "rotate(85.73deg)"], [61.33, "rotate(74.00deg)"], [66, "rotate(61.08deg)"],
                  [70.67, "rotate(46.31deg)"], [75.33, "rotate(28.15deg)"],
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
               poulie ET allongement (×2,6911 au total), échantillonné
               en SIX intervalles le long de l'arc réel de la main.
               CORRIGÉ APRÈS COUP : calé sur les seules positions
               extrêmes, le câble se détachait de 18,9 unités de la
               poignée à mi-parcours, parce que sa rotation n'est pas
               monotone (+9,4 / +12,1 / +10,8 / +7,5 / +2,9 / −2,5).
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
      k: [[0, "rotate(0deg) scale(1)"], [5.83, "rotate(9.44deg) scale(1.2665)"],
          [11.67, "rotate(12.06deg) scale(1.5845)"], [17.5, "rotate(10.83deg) scale(1.9069)"],
          [23.33, "rotate(7.47deg) scale(2.2083)"], [29.17, "rotate(2.87deg) scale(2.4733)"],
          [35, "rotate(-2.48deg) scale(2.6911)"], [45, "rotate(-2.48deg) scale(2.6911)"],
          [52.5, "rotate(2.87deg) scale(2.4733)"], [60, "rotate(7.47deg) scale(2.2083)"],
          [67.5, "rotate(10.83deg) scale(1.9069)"], [75, "rotate(12.06deg) scale(1.5845)"],
          [82.5, "rotate(9.44deg) scale(1.2665)"], [90, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="26" y1="20" x2="56" y2="54"/>`
    },
    {
      /* CÂBLE DROIT : miroir exact du gauche. */
      o: "214px 20px",
      k: [[0, "rotate(0deg) scale(1)"], [5.83, "rotate(-9.44deg) scale(1.2665)"],
          [11.67, "rotate(-12.06deg) scale(1.5845)"], [17.5, "rotate(-10.83deg) scale(1.9069)"],
          [23.33, "rotate(-7.47deg) scale(2.2083)"], [29.17, "rotate(-2.87deg) scale(2.4733)"],
          [35, "rotate(2.48deg) scale(2.6911)"], [45, "rotate(2.48deg) scale(2.6911)"],
          [52.5, "rotate(-2.87deg) scale(2.4733)"], [60, "rotate(-7.47deg) scale(2.2083)"],
          [67.5, "rotate(-10.83deg) scale(1.9069)"], [75, "rotate(-12.06deg) scale(1.5845)"],
          [82.5, "rotate(-9.44deg) scale(1.2665)"], [90, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="214" y1="20" x2="184" y2="54"/>`
    },
    {
      /* BRAS GAUCHE : un seul segment coudé à 161°, tournant autour de
         l'ÉPAULE (104, 60). Le coude ne bouge PAS par rapport au bras :
         c'est bien une adduction d'épaule pure, pas une extension de coude. */
      o: "104px 60px",
      /* même grille que le câble gauche : sinon les deux se
         désynchronisent entre les instants-clés (easing par segment). */
      k: [[0, "rotate(0deg)"], [5.83, "rotate(-17.5deg)"], [11.67, "rotate(-35deg)"],
          [17.5, "rotate(-52.5deg)"], [23.33, "rotate(-70deg)"], [29.17, "rotate(-87.5deg)"],
          [35, "rotate(-105deg)"], [45, "rotate(-105deg)"], [52.5, "rotate(-87.5deg)"],
          [60, "rotate(-70deg)"], [67.5, "rotate(-52.5deg)"], [75, "rotate(-35deg)"],
          [82.5, "rotate(-17.5deg)"], [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <polyline class="mo-limb" points="104,60 80,61 56,54"/>
        <circle class="mo-joint" cx="80" cy="61" r="2.4"/>
        <circle class="mo-hand" cx="56" cy="54" r="3.4"/>`
    },
    {
      /* BRAS DROIT : miroir. */
      o: "136px 60px",
      k: [[0, "rotate(0deg)"], [5.83, "rotate(17.5deg)"], [11.67, "rotate(35deg)"],
          [17.5, "rotate(52.5deg)"], [23.33, "rotate(70deg)"], [29.17, "rotate(87.5deg)"],
          [35, "rotate(105deg)"], [45, "rotate(105deg)"], [52.5, "rotate(87.5deg)"],
          [60, "rotate(70deg)"], [67.5, "rotate(52.5deg)"], [75, "rotate(35deg)"],
          [82.5, "rotate(17.5deg)"], [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
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
      /* scaleY exact : l'extrémité doit tomber SUR la barre (y=44+32=76),
         donc (76−16)/28 = 2,1429. Le 2,231 précédent la dépassait de 2,5. */
      k: [[0, "scaleY(1)"], [34, "scaleY(2.1429)"], [42, "scaleY(2.1429)"],
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
      k: [[0, "rotate(0.00deg) scale(1.0000)"], [5.33, "rotate(9.18deg) scale(1.3039)"], [10.67, "rotate(12.64deg) scale(1.6505)"],
          [16, "rotate(13.02deg) scale(2.0113)"], [21.33, "rotate(11.70deg) scale(2.3725)"], [26.67, "rotate(9.36deg) scale(2.7261)"],
          [32, "rotate(6.37deg) scale(3.0665)"], [40, "rotate(6.37deg) scale(3.0665)"], [48, "rotate(9.36deg) scale(2.7261)"],
          [56, "rotate(11.70deg) scale(2.3725)"], [64, "rotate(13.02deg) scale(2.0113)"], [72, "rotate(12.64deg) scale(1.6505)"],
          [80, "rotate(9.18deg) scale(1.3039)"], [88, "rotate(0.00deg) scale(1.0000)"], [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="120" y1="22" x2="113" y2="30"/>`
    },
    {
      /* CORDE DROITE : miroir. */
      o: "120px 22px",
      k: [[0, "rotate(0.00deg) scale(1.0000)"], [5.33, "rotate(-9.18deg) scale(1.3039)"], [10.67, "rotate(-12.64deg) scale(1.6505)"],
          [16, "rotate(-13.02deg) scale(2.0113)"], [21.33, "rotate(-11.70deg) scale(2.3725)"], [26.67, "rotate(-9.36deg) scale(2.7261)"],
          [32, "rotate(-6.37deg) scale(3.0665)"], [40, "rotate(-6.37deg) scale(3.0665)"], [48, "rotate(-9.36deg) scale(2.7261)"],
          [56, "rotate(-11.70deg) scale(2.3725)"], [64, "rotate(-13.02deg) scale(2.0113)"], [72, "rotate(-12.64deg) scale(1.6505)"],
          [80, "rotate(-9.18deg) scale(1.3039)"], [88, "rotate(0.00deg) scale(1.0000)"], [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="120" y1="22" x2="127" y2="30"/>`
    },
    {
      /* BRAS GAUCHE : −61,4° écarte le COUDE largement vers l'extérieur —
         c'est la signature du face pull, coude haut et non collé au corps. */
      o: "102px 72px",
      /* même grille que les cordes : easing par segment. */
      k: [[0, "rotate(-0.00deg)"], [5.33, "rotate(-10.23deg)"], [10.67, "rotate(-20.47deg)"],
          [16, "rotate(-30.70deg)"], [21.33, "rotate(-40.93deg)"], [26.67, "rotate(-51.17deg)"],
          [32, "rotate(-61.40deg)"], [40, "rotate(-61.40deg)"], [48, "rotate(-51.17deg)"],
          [56, "rotate(-40.93deg)"], [64, "rotate(-30.70deg)"], [72, "rotate(-20.47deg)"],
          [80, "rotate(-10.23deg)"], [88, "rotate(-0.00deg)"], [100, "rotate(0.00deg)"]],
      svg: `
        <line class="mo-limb" x1="102" y1="72" x2="99.9" y2="50.1"/>
        <circle class="mo-joint" cx="99.9" cy="50.1" r="2.5"/>`,
      children: [
        { o: "99.9px 50.1px",
          k: [[0, "rotate(0.00deg)"], [5.33, "rotate(10.75deg)"], [10.67, "rotate(21.50deg)"],
              [16, "rotate(32.25deg)"], [21.33, "rotate(43.00deg)"], [26.67, "rotate(53.75deg)"],
              [32, "rotate(64.50deg)"], [40, "rotate(64.50deg)"], [48, "rotate(53.75deg)"],
              [56, "rotate(43.00deg)"], [64, "rotate(32.25deg)"], [72, "rotate(21.50deg)"],
              [80, "rotate(10.75deg)"], [88, "rotate(0.00deg)"], [100, "rotate(0.00deg)"]],
          svg: `
            <line class="mo-limb" x1="99.9" y1="50.1" x2="113" y2="30"/>
            <circle class="mo-hand" cx="113" cy="30" r="3.2"/>` }
      ]
    },
    {
      /* BRAS DROIT : miroir. */
      o: "138px 72px",
      k: [[0, "rotate(0.00deg)"], [5.33, "rotate(10.23deg)"], [10.67, "rotate(20.47deg)"],
          [16, "rotate(30.70deg)"], [21.33, "rotate(40.93deg)"], [26.67, "rotate(51.17deg)"],
          [32, "rotate(61.40deg)"], [40, "rotate(61.40deg)"], [48, "rotate(51.17deg)"],
          [56, "rotate(40.93deg)"], [64, "rotate(30.70deg)"], [72, "rotate(20.47deg)"],
          [80, "rotate(10.23deg)"], [88, "rotate(0.00deg)"], [100, "rotate(0.00deg)"]],
      svg: `
        <line class="mo-limb" x1="138" y1="72" x2="140.1" y2="50.1"/>
        <circle class="mo-joint" cx="140.1" cy="50.1" r="2.5"/>`,
      children: [
        { o: "140.1px 50.1px",
          k: [[0, "rotate(-0.00deg)"], [5.33, "rotate(-10.75deg)"], [10.67, "rotate(-21.50deg)"],
              [16, "rotate(-32.25deg)"], [21.33, "rotate(-43.00deg)"], [26.67, "rotate(-53.75deg)"],
              [32, "rotate(-64.50deg)"], [40, "rotate(-64.50deg)"], [48, "rotate(-53.75deg)"],
              [56, "rotate(-43.00deg)"], [64, "rotate(-32.25deg)"], [72, "rotate(-21.50deg)"],
              [80, "rotate(-10.75deg)"], [88, "rotate(-0.00deg)"], [100, "rotate(0.00deg)"]],
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
      k: [[0, "rotate(0deg) scale(1)"], [5.33, "rotate(1.10deg) scale(1.1045)"],
          [10.67, "rotate(0.63deg) scale(1.2105)"], [16, "rotate(-1.02deg) scale(1.3105)"],
          [21.33, "rotate(-3.52deg) scale(1.3990)"], [26.67, "rotate(-6.62deg) scale(1.4720)"],
          [32, "rotate(-10.11deg) scale(1.5264)"], [40, "rotate(-10.11deg) scale(1.5264)"],
          [48, "rotate(-6.62deg) scale(1.4720)"], [56, "rotate(-3.52deg) scale(1.3990)"],
          [64, "rotate(-1.02deg) scale(1.3105)"], [72, "rotate(0.63deg) scale(1.2105)"],
          [80, "rotate(1.10deg) scale(1.1045)"], [88, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="96" y1="30" x2="105.34" y2="86.18"/>`
    },
    {
      /* AVANT-BRAS + BARRE : rotation autour du COUDE (127, 90).
         −95° tend le coude de 80° à 175°. La barre reste perpendiculaire
         à l'avant-bras : c'est la prise pronation de la barre droite. */
      o: "127px 90px",
      /* MÊME grille que le câble : l'easing est ease-in-out par SEGMENT,
         des instants-clés différents désynchronisent les deux pièces. */
      k: [[0, "rotate(0.00deg)"], [5.33, "rotate(-15.83deg)"], [10.67, "rotate(-31.67deg)"],
          [16, "rotate(-47.50deg)"], [21.33, "rotate(-63.33deg)"], [26.67, "rotate(-79.17deg)"],
          [32, "rotate(-95.00deg)"], [40, "rotate(-95.00deg)"], [48, "rotate(-79.17deg)"],
          [56, "rotate(-63.33deg)"], [64, "rotate(-47.50deg)"], [72, "rotate(-31.67deg)"],
          [80, "rotate(-15.83deg)"], [88, "rotate(0.00deg)"], [100, "rotate(0.00deg)"]],
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

/* =========================================================
   53. ÉCARTÉ INCLINÉ AUX HALTÈRES  (ecarte-incline-halteres)
   -----------------------------------------------------------
   Position  : ALLONGÉ sur un banc INCLINÉ à ~30°, un haltère dans
               chaque main, coudes légèrement fléchis et BLOQUÉS.
   Matériel  : banc incliné + deux haltères.
   Mobiles   : l'ÉPAULE seule, en adduction horizontale.
   Fixes     : le COUDE — angle vérifié à 150,0° aux deux positions,
               |épaule-main| constant à 42,51. Bras rigide, comme à
               l'écarté plat.
   CONSTAT HONNÊTE, ISSU DU CALCUL : l'ARC EST LE MÊME qu'à l'écarté
               plat, 118° dans les deux cas. Ce n'est pas une
               approximation, c'est le fait : l'amplitude se mesure
               PAR RAPPORT AU TRONC, et les bras s'arrêtent dans les
               deux cas au plan du dossier. Ce qui change n'est donc
               pas le geste mais l'ORIENTATION DU TRONC DANS
               L'ESPACE, et par conséquent quelles fibres du pectoral
               se retrouvent alignées avec la résistance : le
               FAISCEAU CLAVICULAIRE, le haut du pectoral, ici.
               Les deux schémas se distinguent donc par le
               MONTAGE — dossier incliné vu en fuite, corps plus haut
               dans le cadre — et non par une amplitude inventée pour
               les différencier.
   VUE       : de FACE, depuis les pieds, pour les mêmes raisons qu'à
               l'écarté plat : l'ouverture se fait dans un plan qui
               serait invisible de profil. Le dossier est dessiné en
               FUITE vers le haut, ce qui donne son inclinaison sans
               masquer l'arc.
   ROM       : 118° d'adduction d'épaule. On ne descend pas sous le
               plan du dossier : au-delà la tête humérale encaisse
               une contrainte antérieure pour un gain nul.
   Agonistes : HAUT DU GRAND PECTORAL (faisceau claviculaire),
               deltoïde antérieur en assistance. Pas de triceps :
               monoarticulaire.
   La famille des écartés suit donc la même logique d'angle que celle
   des développés — plat pour le milieu du pectoral, incliné pour le
   haut — à ceci près que le geste, lui, est rigoureusement identique.
   GÉOMÉTRIE (calculée) — épaules(94,102) et (126,102), bras 24,
   avant-bras 20, coude figé à 150°.
   Haut : main gauche(109.24,62.31), coude(107.63,82.25).
   Bas  : main gauche(51.80,107.18), coude(70.16,99.24).
   -> bras gauche −118°, bras droit +118° (miroir).
   ========================================================= */
EXERCISE_MOTIONS["ecarte-incline-halteres"] = {
  vb: "34 48 152 100",
  dur: 4.0,
  vue: "Vu de face",
  phases: { ecc: [0, 45], con: [52, 82] },
  alt: "Vu de face depuis les pieds. Allongé sur un banc incliné, coudes bloqués : les bras s'ouvrent en arc jusqu'au plan du dossier, puis se referment au-dessus du haut de la poitrine.",
  fixe: `
    <line class="mo-ground" x1="76" y1="142" x2="144" y2="142"/>
    <!-- dossier INCLINÉ, dessiné EN FUITE vers le haut : c'est lui qui
         donne l'inclinaison sans masquer l'arc des bras. -->
    <line class="mo-pad" x1="92" y1="134" x2="100" y2="82"/>
    <line class="mo-pad" x1="128" y1="134" x2="120" y2="82"/>
    <line class="mo-pad" x1="100" y1="82" x2="120" y2="82"/>
    <line class="mo-gear" x1="110" y1="134" x2="110" y2="142"/>
    <!-- buste en coupe, plus haut dans le cadre que sur le banc plat -->
    <ellipse class="mo-head-solid mo-head" cx="110" cy="90" rx="9" ry="9"/>
    <ellipse class="mo-torse" cx="110" cy="108" rx="17" ry="9"/>
    <circle class="mo-joint" cx="94" cy="102" r="2.8"/>
    <circle class="mo-joint" cx="126" cy="102" r="2.8"/>`,
  muscles: [
    { nom: "Haut du grand pectoral",
      svg: `<ellipse cx="101" cy="102" rx="8" ry="4"/><ellipse cx="119" cy="102" rx="8" ry="4"/>` }
  ],
  parts: [
    {
      /* BRAS GAUCHE : segment RIGIDE, coude figé. −118°. */
      o: "94px 102px",
      k: [[0, "rotate(0deg)"], [45, "rotate(-118deg)"], [52, "rotate(-118deg)"],
          [82, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="94" y1="102" x2="107.63" y2="82.25"/>
        <circle class="mo-joint" cx="107.63" cy="82.25" r="2.4"/>
        <line class="mo-limb" x1="107.63" y1="82.25" x2="109.24" y2="62.31"/>
        <line class="mo-bar2" x1="103" y1="62" x2="116" y2="62"/>
        <rect class="mo-mass" x="100" y="57" width="6" height="10" rx="2"/>
        <rect class="mo-mass" x="113" y="57" width="6" height="10" rx="2"/>`
    },
    {
      /* BRAS DROIT : miroir exact, +118°. */
      o: "126px 102px",
      k: [[0, "rotate(0deg)"], [45, "rotate(118deg)"], [52, "rotate(118deg)"],
          [82, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="126" y1="102" x2="112.37" y2="82.25"/>
        <circle class="mo-joint" cx="112.37" cy="82.25" r="2.4"/>
        <line class="mo-limb" x1="112.37" y1="82.25" x2="110.76" y2="62.31"/>
        <line class="mo-bar2" x1="104" y1="62" x2="117" y2="62"/>
        <rect class="mo-mass" x="101" y="57" width="6" height="10" rx="2"/>
        <rect class="mo-mass" x="114" y="57" width="6" height="10" rx="2"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M46 78 L64 92 M57 90 L64 92 L62 85"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M64 92 L46 78 M53 80 L46 78 L48 85"/>` }
  ]
};

/* =========================================================
   54. PEC-DECK (BUTTERFLY)  (pec-deck)
   -----------------------------------------------------------
   Position  : ASSIS, dos plaqué au dossier, avant-bras posés sur les
               coussinets verticaux, coudes à hauteur d'épaules.
   Matériel  : machine pec-deck — deux bras articulés pivotant chacun
               sur un axe VERTICAL, reliés à la colonne de charges.
   Mobiles   : l'ÉPAULE seule, en adduction horizontale.
   Fixes     : le dos, le bassin, et le COUDE dont l'angle ne change
               pas — l'avant-bras reste plaqué sur le coussinet. Bras
               et avant-bras forment donc un bloc RIGIDE, comme à
               l'écarté.
   POURQUOI L'AXE DE LA MACHINE EST DESSINÉ CONFONDU AVEC L'ÉPAULE :
               ce n'est pas une simplification de confort. Un
               pec-deck bien conçu aligne précisément son axe de
               rotation sur celui de l'épaule — c'est la condition
               pour que le coussinet suive l'arc du coude au lieu de
               le contrarier. Si les deux axes divergent, la distance
               épaule-coussinet varierait au cours du mouvement, ce
               qu'un humérus rigide ne permet pas : le bras se
               ferait tirer. Le schéma dessine donc la machine bien
               réglée.
   >>> VU DE DESSUS <<< L'adduction horizontale se fait dans le plan
               TRANSVERSE. De profil elle irait vers le spectateur et
               serait invisible ; assis, seule la vue de dessus la
               montre. Troisième schéma hors plan sagittal, et pour
               la même raison que les deux autres.
   Sens      : fermeture des coussinets = concentrique ; ouverture
               contrôlée = excentrique. Le cycle commence OUVERT.
   ROM       : 85° d'adduction, des bras dans le plan du torse
               jusqu'aux coussinets qui se rejoignent devant. On ne
               s'ouvre pas au-delà du plan du torse.
   Agonistes : GRAND PECTORAL, deltoïde antérieur en assistance.
   CE QUE LA MACHINE APPORTE, ET CE QU'ELLE COÛTE : la résistance est
               CONTINUE — elle ne s'effondre pas en position fermée
               comme avec des haltères, où la gravité cesse d'agir
               perpendiculairement. En contrepartie le trajet est
               IMPOSÉ : les stabilisateurs ne travaillent plus. C'est
               le même arbitrage que partout ailleurs entre machine
               et poids libres.
   Distinction : assis, guidé, résistance continue. ≠ écarté couché
               haltères (gravité, résistance nulle en haut),
               ≠ écarté poulie (debout, non guidé).
   GÉOMÉTRIE (calculée) — épaule/axe(96,86) à gauche, (124,86) à
   droite ; bras au coussinet 34, avant-bras 18 à angle constant.
   Ouvert : coussinet(64.05,74.37), main(70.21,57.46).
   Fermé  : coussinet(104.80,53.16).
   -> bras gauche +85°, bras droit −85° (miroir).
   ========================================================= */
EXERCISE_MOTIONS["pec-deck"] = {
  vb: "38 38 144 92",
  dur: 3.6,
  vue: "Vu de dessus",
  phases: { con: [0, 40], ecc: [48, 88] },
  alt: "Vu de dessus. Assis dans la machine, avant-bras sur les coussinets : les bras se referment devant la poitrine par adduction des épaules, puis s'ouvrent en contrôlant.",
  fixe: `
    <!-- siège et dossier, vus de dessus -->
    <line class="mo-pad" x1="92" y1="104" x2="128" y2="104"/>
    <line class="mo-gear" x1="92" y1="104" x2="92" y2="118"/>
    <line class="mo-gear" x1="128" y1="104" x2="128" y2="118"/>
    <line class="mo-gear" x1="88" y1="118" x2="132" y2="118"/>
    <!-- corps assis, vu de dessus -->
    <ellipse class="mo-torse" cx="110" cy="90" rx="18" ry="9"/>
    <circle class="mo-head mo-head-solid" cx="110" cy="70" r="9"/>
    <!-- AXES de la machine, confondus avec les épaules -->
    <circle class="mo-pulley" cx="96" cy="86" r="4.5"/>
    <circle class="mo-pulley" cx="124" cy="86" r="4.5"/>`,
  muscles: [
    { nom: "Grand pectoral",
      svg: `<ellipse cx="102" cy="84" rx="7" ry="4"/><ellipse cx="118" cy="84" rx="7" ry="4"/>` }
  ],
  parts: [
    {
      /* BRAS GAUCHE + COUSSINET : bloc RIGIDE tournant autour de
         l'axe épaule/machine. +85°. */
      o: "96px 86px",
      k: [[0, "rotate(0deg)"], [40, "rotate(85deg)"], [48, "rotate(85deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="96" y1="86" x2="64.05" y2="74.37"/>
        <circle class="mo-joint" cx="64.05" cy="74.37" r="2.6"/>
        <line class="mo-limb" x1="64.05" y1="74.37" x2="70.21" y2="57.46"/>
        <rect class="mo-mass" x="59" y="62" width="7" height="16" rx="2" transform="rotate(20 62.5 70)"/>`
    },
    {
      /* BRAS DROIT : miroir exact, −85°. */
      o: "124px 86px",
      k: [[0, "rotate(0deg)"], [40, "rotate(-85deg)"], [48, "rotate(-85deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="124" y1="86" x2="155.95" y2="74.37"/>
        <circle class="mo-joint" cx="155.95" cy="74.37" r="2.6"/>
        <line class="mo-limb" x1="155.95" y1="74.37" x2="149.79" y2="57.46"/>
        <rect class="mo-mass" x="154" y="62" width="7" height="16" rx="2" transform="rotate(-20 157.5 70)"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M58 110 L82 110 M75 105 L82 110 L75 115"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M82 110 L58 110 M65 105 L58 110 L65 115"/>` }
  ]
};

/* =========================================================
   55. DÉVELOPPÉ ASSIS À LA MACHINE CONVERGENTE
       (developpe-machine-convergente)
   -----------------------------------------------------------
   Position  : ASSIS, dos plaqué au dossier, poignées à hauteur de
               poitrine, coudes fléchis ~67° et ouverts vers
               l'arrière-dehors.
   Matériel  : machine de développé à bras INDÉPENDANTS dont les
               trajectoires CONVERGENT vers l'axe médian à
               l'extension.
   Mobiles   : l'ÉPAULE (flexion + adduction horizontale) et le
               COUDE (extension). Vraie chaîne à deux articulations.
   Fixes     : dos, bassin, tête — plaqués au dossier et au siège.
   CE QUE LA CONVERGENCE APPORTE : à la barre, l'écartement des mains
               est IMPOSÉ constant ; les pectoraux finissent donc leur
               course sans jamais raccourcir complètement. En faisant
               se rapprocher les poignées à la fin de la poussée, la
               machine convergente ajoute l'ADDUCTION horizontale au
               développé : le pectoral peut arriver en course interne
               complète. C'est un développé auquel on a greffé la fin
               d'un écarté.
   >>> VU DE DESSUS <<< La poussée vers l'avant ET la convergence se
               font toutes deux dans le plan TRANSVERSE. De profil, la
               convergence — le seul trait qui distingue cette machine
               d'un développé ordinaire — serait strictement
               invisible. Quatrième schéma hors plan sagittal, et le
               seul plan où l'exercice se lit.
   Sens      : poussée en avant = concentrique ; retour contrôlé =
               excentrique. Le cycle commence en position basse.
   ROM       : coude de 67° à 168° (extension quasi complète sans
               verrouillage) ; l'écart entre les deux mains passe de
               76 à 20 unités — c'est la convergence, mesurée.
   Agonistes : GRAND PECTORAL, deltoïde antérieur, triceps.
   Distinction : ≠ développé couché barre (écartement fixe, allongé,
               gravité), ≠ pec-deck (MONO-articulaire, coude
               verrouillé, aucune poussée), ≠ développé haltères
               (les mains se rapprochent aussi, mais rien ne guide le
               trajet et la résistance chute en haut).
   POURQUOI AUCUN AXE DE PIVOT N'EST DESSINÉ : la convergence d'une
               telle machine vient d'axes de rotation INCLINÉS dans
               le plan sagittal. La projection d'un cercle incliné sur
               une vue de dessus est une ELLIPSE, pas un cercle :
               planter un pivot vertical quelque part et faire tourner
               un bras rigide autour donnerait une trajectoire fausse.
               Le schéma montre donc la TRAJECTOIRE imposée aux
               poignées (arc pointillé), qui est vérifiable, plutôt
               qu'une timonerie inventée.
   GÉOMÉTRIE (calculée) — épaule gauche (96,80), bras 22, avant-bras
   22. Trajectoire de la poignée = arc de centre (112.92,75.98) et de
   rayon 41.70, parcouru sur 82.75°, échantillonné en 4 points :
     main   (72.00,84.00) (72.94,64.14) (82.94,46.99) (99.80,36.40)
     coude  (87.01,100.08)(74.86,86.05) (77.39,68.28) (95.66,58.01)
     |S-main| 24.33 → 27.99 → 35.50 → 43.77   (monotone : le bras
              s'allonge sans jamais se refermer en cours de poussée —
              c'est la vérification qui a fait rejeter une première
              trajectoire RECTILIGNE, qui passait à 18.7 de l'épaule
              et aurait REFERMÉ le coude au milieu de la poussée.)
     coude    67.1° → 79.0° → 107.6° → 168.2°  (monotone)
   -> bras gauche  +0 / +49.89 / +98.07 / +154.98°
      avant-bras relatif  0 / −11.85 / −40.40 / −101.08°
      côté droit : miroir exact autour de x=110, angles opposés.
   ========================================================= */
EXERCISE_MOTIONS["developpe-machine-convergente"] = {
  vb: "44 28 132 92",
  dur: 3.8,
  vue: "Vu de dessus",
  phases: { con: [0, 40], ecc: [48, 88] },
  alt: "Vu de dessus. Assis dos au dossier, les deux poignées partent de chaque côté de la poitrine, sont poussées vers l'avant et se rapprochent l'une de l'autre en fin de course, puis reviennent en contrôlant.",
  fixe: `
    <!-- DOSSIER, vu de dessus. Volontairement plus court que la
         largeur d'épaules : en position basse le coude passe DERRIÈRE
         le plan du torse, et il doit passer à CÔTÉ du dossier, pas
         dedans. -->
    <line class="mo-pad" x1="96" y1="104" x2="124" y2="104"/>
    <!-- bâti : deux rails latéraux et une traverse arrière -->
    <line class="mo-gear" x1="68" y1="110" x2="68" y2="42"/>
    <line class="mo-gear" x1="152" y1="110" x2="152" y2="42"/>
    <line class="mo-gear" x1="68" y1="110" x2="152" y2="110"/>
    <!-- corps assis, vu de dessus -->
    <ellipse class="mo-torse" cx="110" cy="86" rx="17" ry="9"/>
    <circle class="mo-head mo-head-solid" cx="110" cy="68" r="9"/>
    <!-- TRAJECTOIRES imposées aux poignées : elles CONVERGENT -->
    <path class="mo-rom" fill="none" d="M72 84 A41.7 41.7 0 0 1 99.8 36.4"/>
    <path class="mo-rom" fill="none" d="M148 84 A41.7 41.7 0 0 0 120.2 36.4"/>`,
  muscles: [
    { nom: "Grand pectoral",
      svg: `<ellipse cx="102" cy="83" rx="7" ry="3.8"/><ellipse cx="118" cy="83" rx="7" ry="3.8"/>` },
    { nom: "Deltoïde antérieur",
      svg: `<circle cx="95" cy="78" r="3.4"/><circle cx="125" cy="78" r="3.4"/>` }
  ],
  parts: [
    {
      /* BRAS GAUCHE : rotation autour de l'ÉPAULE (96,80).
         0 / +49.89 / +98.07 / +154.98°, échantillonnage régulier de
         l'arc de la poignée (et non des angles) : c'est la poignée
         qui est guidée, pas l'épaule. */
      o: "96px 80px",
      k: [[0, "rotate(0deg)"], [13.3, "rotate(49.89deg)"], [26.7, "rotate(98.07deg)"],
          [40, "rotate(154.98deg)"], [48, "rotate(154.98deg)"],
          [61.3, "rotate(98.07deg)"], [74.7, "rotate(49.89deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="96" y1="80" x2="87.01" y2="100.08"/>
        <circle class="mo-joint" cx="87.01" cy="100.08" r="2.6"/>`,
      children: [
        {
          /* AVANT-BRAS + POIGNÉE : rotation RELATIVE au bras, autour du
             COUDE (87.01,100.08). Négative : le coude s'ouvre de 67° à
             168° pendant que le bras avance. */
          o: "87.01px 100.08px",
          k: [[0, "rotate(0deg)"], [13.3, "rotate(-11.85deg)"], [26.7, "rotate(-40.40deg)"],
              [40, "rotate(-101.08deg)"], [48, "rotate(-101.08deg)"],
              [61.3, "rotate(-40.40deg)"], [74.7, "rotate(-11.85deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="87.01" y1="100.08" x2="72" y2="84"/>
            <!-- poignée verticale, tenue en pronation -->
            <line class="mo-bar2" x1="66.8" y1="88.9" x2="77.2" y2="79.1"/>
            <circle class="mo-hand" cx="72" cy="84" r="2.8"/>`
        }
      ]
    },
    {
      /* BRAS DROIT : miroir exact autour de x=110, angles opposés. */
      o: "124px 80px",
      k: [[0, "rotate(0deg)"], [13.3, "rotate(-49.89deg)"], [26.7, "rotate(-98.07deg)"],
          [40, "rotate(-154.98deg)"], [48, "rotate(-154.98deg)"],
          [61.3, "rotate(-98.07deg)"], [74.7, "rotate(-49.89deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="124" y1="80" x2="132.99" y2="100.08"/>
        <circle class="mo-joint" cx="132.99" cy="100.08" r="2.6"/>`,
      children: [
        {
          o: "132.99px 100.08px",
          k: [[0, "rotate(0deg)"], [13.3, "rotate(11.85deg)"], [26.7, "rotate(40.40deg)"],
              [40, "rotate(101.08deg)"], [48, "rotate(101.08deg)"],
              [61.3, "rotate(40.40deg)"], [74.7, "rotate(11.85deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="132.99" y1="100.08" x2="148" y2="84"/>
            <line class="mo-bar2" x1="153.2" y1="88.9" x2="142.8" y2="79.1"/>
            <circle class="mo-hand" cx="148" cy="84" r="2.8"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M56 100 L56 62 M50 70 L56 62 L62 70"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M56 62 L56 100 M50 92 L56 100 L62 92"/>` }
  ]
};

/* =========================================================
   56. POMPES DÉCLINÉES (PIEDS SURÉLEVÉS)  (pompes-declinees)
   -----------------------------------------------------------
   Position  : face au sol, MAINS au sol un peu plus larges que
               les épaules, PIEDS posés sur un banc. Corps en
               planche rigide.
   Matériel  : un banc plat (~45 cm). Deux appuis FIXES : les
               mains au sol, les pointes de pieds sur le banc.
   Mobiles   : coude, épaule, et le CORPS ENTIER qui pivote
               autour de l'appui des pieds.
   Fixes     : rachis, bassin, genoux. Mains et pieds immobiles.
   CE QUE LE SCHÉMA CORRIGE — UNE IDÉE REÇUE : « pieds surélevés
               = corps tête en bas ». C'est FAUX sur un banc
               ordinaire, et le calcul le montre. En planche,
               l'épaule est à hauteur de bras tendu au-dessus du
               sol, soit 42,8 unités ici (~60 cm). Un banc de
               45 cm ne fait monter la pointe de pied qu'à 32
               unités : l'épaule reste 10,8 unités PLUS HAUTE que
               le pied. Le corps n'est pas incliné vers le bas,
               il est quasi HORIZONTAL.
   ALORS POURQUOI ÇA CIBLE LE HAUT DES PECTORAUX ? Parce que ce
               qui compte n'est pas la hauteur absolue mais la
               direction de la GRAVITÉ par rapport au TRONC. Aux
               pompes au sol le corps est à 19,3° tête en haut ;
               ici il tombe à 4,9°. La ligne de charge bascule
               donc de ~14° vers la TÊTE — exactement la
               situation du développé INCLINÉ. Ce sont ces 14°,
               et rien d'autre, qui déplacent le travail vers les
               fibres claviculaires et le deltoïde antérieur.
   Sens/plan : descente = excentrique ; poussée du sol =
               concentrique. Plan sagittal.
   ROM       : coude 60° en bas → 170° en haut. L'épaule descend
               de 21 unités, le bassin seulement de 11 : il est
               plus près du pivot, donc il parcourt moins. Le
               corps ne « plie » pas pour autant.
   Agonistes : HAUT du grand pectoral, deltoïde antérieur,
               triceps. Abdominaux en gainage isométrique, donc
               non animés.
   Distinction : ≠ pompes au sol — même chaîne fermée, mais
               l'inclinaison du corps et donc TOUS les angles
               diffèrent (corps 4,9° au lieu de 19,3°, épaule
               calculée sur un pivot surélevé).
               ≠ pompes pike — là la HANCHE est pliée à 90° et le
               mouvement devient un développé vertical d'épaules.
   GÉOMÉTRIE (calculée) — sol y=150, dessus du banc y=118, appui
   pied (188,118), main (60,150). Bras 22, avant-bras 21,
   pied→épaule 127,09 (même sujet qu'aux pompes au sol).
   HAUT : intersection des cercles (main, 42,84) et (pied,
          127,09) -> épaule (61.37,107.18), coude (62.57,129.15).
   BAS  : épaule abaissée de 21 -> (61.32,128.20), coude ouvert
          vers l'ARRIÈRE (79.07,141.20), coude à 60,0°, et la
          main reste EXACTEMENT en (60,150).
   -> corps −9,48° ; bras relatif au corps −41,18° ;
      avant-bras relatif au bras +108,86°.
   CINQ POSITIONS INTERMÉDIAIRES ONT DÛ ÊTRE CALCULÉES EN PLUS :
   interpoler linéairement les trois rotations entre les deux
   extrêmes ne ferme PAS la chaîne au milieu — la main plongeait
   à 4 unités SOUS le sol à mi-descente. La main d'une pompe est
   un APPUI : elle doit tenir le sol à CHAQUE instant, pas
   seulement aux deux bouts. Le parcours est donc résolu par IK en
   six intervalles, et la dérive résiduelle tombe à 0,53 unité
   (mesurée sur tout le cycle, pas seulement aux extrêmes).
   ========================================================= */
EXERCISE_MOTIONS["pompes-declinees"] = {
  vb: "40 94 176 62",
  dur: 3.6,
  phases: { ecc: [0, 44], con: [52, 84] },
  alt: "Pieds posés sur un banc et mains au sol, le corps en planche quasi horizontale descend d'un bloc jusqu'à ce que la poitrine frôle le sol, puis repousse le sol.",
  fixe: `
    <line class="mo-ground" x1="44" y1="150" x2="212" y2="150"/>
    <!-- banc : c'est lui qui définit l'inclinaison du corps -->
    <line class="mo-pad" x1="164" y1="118" x2="210" y2="118"/>
    <line class="mo-gear" x1="170" y1="122" x2="170" y2="150"/>
    <line class="mo-gear" x1="204" y1="122" x2="204" y2="150"/>`,
  parts: [
    {
      /* CORPS ENTIER : pivote autour de l'APPUI DES PIEDS (188, 118),
         qui est sur le BANC et non au sol — c'est toute la différence
         avec les pompes ordinaires. −9,48° abaisse l'épaule de 21. */
      o: "188px 118px",
      k: [[0, "rotate(0deg)"], [7.33, "rotate(-1.58deg)"], [14.67, "rotate(-3.16deg)"],
          [22, "rotate(-4.74deg)"], [29.33, "rotate(-6.32deg)"], [36.67, "rotate(-7.90deg)"],
          [44, "rotate(-9.48deg)"], [52, "rotate(-9.48deg)"],
          [57.33, "rotate(-7.90deg)"], [62.67, "rotate(-6.32deg)"], [68, "rotate(-4.74deg)"],
          [73.33, "rotate(-3.16deg)"], [78.67, "rotate(-1.58deg)"],
          [84, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: ["Haut du grand pectoral", "Deltoïde antérieur"],
      muscle: `<ellipse cx="78" cy="111" rx="11" ry="4.2" transform="rotate(1.4 78 111)"/>
               <circle cx="62" cy="108" r="4.3"/>`,
      svg: `
        <circle class="mo-head" cx="49.4" cy="106.9" r="8"/>
        <line class="mo-body" x1="57.4" y1="107.1" x2="123.35" y2="108.64"/>
        <line class="mo-body" x1="123.35" y1="108.64" x2="181" y2="110"/>
        <!-- pied : cheville au-dessus du banc, pointe posée dessus -->
        <line class="mo-body" x1="181" y1="110" x2="188" y2="118"/>`,
      children: [
        {
          /* BRAS : rotation autour de l'ÉPAULE (61.37, 107.18), dans le
             repère du corps. −41,18° emmène le coude vers l'arrière. */
          o: "61.37px 107.18px",
          k: [[0, "rotate(0deg)"], [7.33, "rotate(-17.05deg)"], [14.67, "rotate(-25.00deg)"],
              [22, "rotate(-30.77deg)"], [29.33, "rotate(-35.26deg)"], [36.67, "rotate(-38.77deg)"],
              [44, "rotate(-41.31deg)"], [52, "rotate(-41.31deg)"],
              [57.33, "rotate(-38.77deg)"], [62.67, "rotate(-35.26deg)"], [68, "rotate(-30.77deg)"],
              [73.33, "rotate(-25.00deg)"], [78.67, "rotate(-17.05deg)"],
              [84, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Triceps brachial",
          muscle: `<ellipse cx="65" cy="118" rx="3.2" ry="7.5" transform="rotate(3 65 118)"/>`,
          svg: `
            <line class="mo-limb" x1="61.37" y1="107.18" x2="62.57" y2="129.15"/>
            <circle class="mo-joint" cx="62.57" cy="129.15" r="2.6"/>`,
          children: [
            {
              /* AVANT-BRAS : rotation relative autour du COUDE. +108,86°
                 maintient la MAIN exactement en (60,150), corps abaissé. */
              o: "62.57px 129.15px",
              k: [[0, "rotate(0deg)"], [7.33, "rotate(37.80deg)"], [14.67, "rotate(57.29deg)"],
                  [22, "rotate(72.68deg)"], [29.33, "rotate(86.00deg)"], [36.67, "rotate(98.01deg)"],
                  [44, "rotate(109.12deg)"], [52, "rotate(109.12deg)"],
                  [57.33, "rotate(98.01deg)"], [62.67, "rotate(86.00deg)"], [68, "rotate(72.68deg)"],
                  [73.33, "rotate(57.29deg)"], [78.67, "rotate(37.80deg)"],
                  [84, "rotate(0deg)"], [100, "rotate(0deg)"]],
              svg: `
                <line class="mo-limb" x1="62.57" y1="129.15" x2="60" y2="150"/>
                <circle class="mo-hand" cx="60" cy="150" r="3.4"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M140 124 L140 142 M135 136 L140 142 L145 136"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M140 142 L140 124 M135 130 L140 124 L145 130"/>` }
  ]
};

/* =========================================================
   57. PULL-OVER HALTÈRE  (pull-over)
   -----------------------------------------------------------
   Position  : ALLONGÉ SUR LE DOS le long d'un banc, tête à
               l'extrémité et la débordant légèrement, pieds au
               sol. Un haltère tenu à deux mains.
   Matériel  : un haltère, tenu VERTICALEMENT à deux mains par
               l'intérieur du disque supérieur. De profil on le
               voit par la tranche : un disque.
   Mobile    : l'ÉPAULE, et elle seule. Le bras décrit un grand
               arc de cercle au-dessus de la tête.
   Fixes     : le rachis, le bassin, les jambes — et surtout le
               COUDE, dont l'angle reste constant à 160°. Bras et
               avant-bras forment donc un BLOC RIGIDE, exactement
               comme à l'écarté ou au pec-deck. « Casser les
               coudes » est l'erreur n°1 : le mouvement cesse
               alors d'être une extension d'épaule pour devenir
               un demi-triceps.
   MOUVEMENT MONO-ARTICULAIRE : un seul segment mobile dans ce
               schéma, et c'est la modélisation JUSTE — pas une
               simplification. Ajouter une rotation au coude
               dessinerait précisément la faute.
   Sens/plan : descente derrière la tête = excentrique (mise en
               tension maximale) ; retour au-dessus de la
               poitrine = concentrique. Plan sagittal.
   ROM       : 88° de flexion d'épaule, de 90° (bras vertical,
               au-dessus de la poitrine) à 178° (bras dans le
               prolongement du tronc). 178° est la limite
               anatomique de la flexion d'épaule : le schéma
               s'y arrête et ne la dépasse pas. La main parcourt
               un arc de rayon 42,35 centré sur l'épaule.
   Agonistes : GRAND DORSAL et faisceau STERNAL du grand
               pectoral. Les deux sont extenseurs de l'épaule
               depuis la position haute : ils travaillent
               ensemble, et la vieille querelle « pull-over
               pectoraux OU dorsaux » n'a pas lieu d'être sur
               cette amplitude-là. Au-delà de la verticale, seul
               le dorsal continuerait — mais le mouvement
               s'arrête à la verticale.
   CE QUE LE SCHÉMA NE MONTRE PAS, ET POURQUOI : ni « ouverture
               de la cage thoracique » ni dentelé antérieur. La
               cage d'un adulte ne s'élargit pas sous l'effet
               d'un exercice — c'est une croyance des années 70,
               et une animation qui ferait gonfler le thorax
               dessinerait une chose qui n'arrive pas. Le
               dentelé, lui, est un muscle de la SCAPULA : il ne
               produit pas ce mouvement d'épaule.
   Distinction : ≠ écarté (adduction horizontale, plan
               transverse) ; ≠ tirage vertical / traction (le
               coude s'y ferme, chaîne à deux articulations) ;
               ≠ extension nuque haltère (là c'est le COUDE qui
               bouge et l'épaule qui est fixe — exactement
               l'inverse).
   GÉOMÉTRIE (calculée) — épaule (66,102), bras 22, avant-bras
   21, coude bloqué à 160° -> distance épaule-main constante
   42,35.
     haut  main (66.00,59.65)   coude (62.26,80.32)
     bas   main (23.68,100.52)  coude (44.21,104.98)
   -> un seul bloc, rotation −88° autour de l'épaule.
   Le coude en position basse est à y=104,98, donc AU-DESSUS de
   la surface du banc (111,5) et en deçà de son extrémité (56) :
   il passe à côté du banc et non dedans. Vérifié, car c'est ce
   qui a imposé d'arrêter l'amplitude à 178° et non plus bas.
   L'épaisseur du buste a également dû être corrigée : la ligne du
   rachis était à 3,5 unités du banc, soit un tronc plat. Elle est
   maintenant à 7,5 — une demi-épaisseur de torse plausible.
   ========================================================= */
EXERCISE_MOTIONS["pull-over"] = {
  vb: "14 48 148 106",
  dur: 4,
  phases: { ecc: [0, 46], con: [54, 86] },
  alt: "Allongé sur le dos le long d'un banc, un haltère tenu à deux mains bras quasi tendus : l'haltère descend en arc de cercle derrière la tête jusqu'à l'alignement du tronc, puis revient au-dessus de la poitrine.",
  fixe: `
    <line class="mo-ground" x1="20" y1="150" x2="160" y2="150"/>
    <!-- banc : le dossier s'arrête avant la tête, qui le déborde -->
    <line class="mo-pad" x1="56" y1="116" x2="128" y2="116"/>
    <line class="mo-gear" x1="64" y1="120" x2="64" y2="150"/>
    <line class="mo-gear" x1="122" y1="120" x2="122" y2="150"/>
    <!-- corps allongé sur le dos, pieds au sol -->
    <circle class="mo-head" cx="52" cy="100" r="8"/>
    <line class="mo-body" x1="60" y1="101" x2="118" y2="104"/>
    <line class="mo-body" x1="118" y1="104" x2="152" y2="118"/>
    <line class="mo-body" x1="152" y1="118" x2="148" y2="150"/>
    <!-- amplitude : l'arc RÉELLEMENT parcouru par l'haltère -->
    <path class="mo-rom" fill="none" d="M66 59.65 A42.35 42.35 0 0 0 23.68 100.52"/>`,
  muscles: [
    { nom: "Grand dorsal",
      svg: `<ellipse cx="92" cy="106.5" rx="16" ry="3.2" transform="rotate(3 92 106.5)"/>` },
    { nom: "Grand pectoral (faisceau sternal)",
      svg: `<ellipse cx="80" cy="97" rx="11" ry="4" transform="rotate(3 80 97)"/>` }
  ],
  parts: [
    {
      /* BRAS ENTIER : bloc RIGIDE (coude figé à 160°) tournant autour
         de l'ÉPAULE (66,102). −88° : de la verticale au prolongement
         du tronc. Aucun enfant : le coude ne bouge pas, et c'est le
         propos même de l'exercice. */
      o: "66px 102px",
      k: [[0, "rotate(0deg)"], [46, "rotate(-88deg)"], [54, "rotate(-88deg)"],
          [86, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="66" y1="102" x2="62.26" y2="80.32"/>
        <circle class="mo-joint" cx="62.26" cy="80.32" r="2.6"/>
        <line class="mo-limb" x1="62.26" y1="80.32" x2="66" y2="59.65"/>
        <!-- haltère vu par la tranche : un disque -->
        <circle class="mo-plate-o" cx="66" cy="59.65" r="8"/>
        <circle class="mo-hub" cx="66" cy="59.65" r="2.6"/>`
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M102 70 L78 70 M85 65 L78 70 L85 75"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M78 70 L102 70 M95 65 L102 70 L95 75"/>` }
  ]
};

/* =========================================================
   58. ÉCARTÉ À LA POULIE BASSE  (ecarte-poulie-basse)
   -----------------------------------------------------------
   Position  : DEBOUT entre deux poulies BASSES, un pied devant,
               buste droit et gainé, une poignée dans chaque main.
   Matériel  : deux câbles partant du BAS des colonnes, derrière
               les hanches. La ligne de traction va donc du bas
               vers le haut : c'est l'inverse exact de l'écarté
               à la poulie haute.
   Mobile    : l'ÉPAULE seule, en flexion (le bras monte vers
               l'avant) combinée à une adduction horizontale.
   Fixes     : le COUDE, bloqué à 161°, donc bras et avant-bras
               forment un BLOC RIGIDE ; rachis, bassin, jambes.
               « Plier les coudes » est l'erreur n°1 : le
               mouvement deviendrait un tirage.
   Sens/plan : montée des bras = CONCENTRIQUE ; descente contrôlée
               = excentrique, plus lente (phase d'étirement).
   ROM       : 120° d'arc, de 15° d'extension d'épaule (mains
               derrière les hanches) à 105° de flexion (mains à
               hauteur de visage). La main parcourt un arc de
               rayon 48,37 centré sur l'épaule.
   Agonistes : HAUT du grand pectoral (faisceau claviculaire) et
               deltoïde antérieur. C'est la direction basse-haute
               de la traction qui les sollicite : le faisceau
               claviculaire est celui dont les fibres tirent le
               bras vers le HAUT et l'avant.
   >>> POURQUOI CE SCHÉMA EST DE PROFIL, ET CE QU'IL NE MONTRE
       PAS <<< L'écarté poulie HAUTE (schéma 4) est dessiné de
       FACE, et c'était le bon choix : ses mains finissent devant
       le BASSIN, presque dans le plan du corps, donc peu
       raccourcies en projection. Ici les mains finissent devant
       le VISAGE, c'est-à-dire loin en AVANT du corps. Calcul
       fait : bras tendu de 48,37, mains ramenées vers l'axe
       médian à hauteur de visage, la longueur APPARENTE du bras
       de face tomberait à 17,9 — 37 % de sa longueur réelle. Un
       schéma de face devrait donc faire RÉTRÉCIR le bras au
       cours du mouvement, ce qui est le contraire d'un membre
       rigide. Le profil est retenu parce qu'il montre l'arc
       bas-haut à sa VRAIE longueur.
       Ce que le profil ne montre pas, en revanche : le
       rapprochement des mains vers l'axe médian. Il est réel,
       mais secondaire par rapport à la montée, et aucune vue ne
       peut rendre les deux exactement. C'est dit ici plutôt que
       dessiné approximativement.
   Distinction : ≠ écarté poulie haute (traction haut-bas, mains
               finissant en bas, vue de face) ; ≠ élévation
               frontale (là aussi le bras monte, mais avec une
               charge LIBRE dont la résistance s'annule en haut,
               et sans composante d'adduction : la poulie basse
               garde une tension oblique constante) ; ≠ développé
               incliné (le coude s'y ferme).
   GÉOMÉTRIE (calculée) — épaule (110,62), bras 24, avant-bras 25,
   coude bloqué à 161,6° -> épaule-main constante 48,37.
     bas  main (97.48,108.72)  coude (100.09,83.86)
     haut main (156.72,49.48)  coude (133.88,59.65)
   -> bloc bras : rotation −120° autour de l'épaule.
   Câble : poulie (54,138), échantillonné en SIX intervalles le long
   de l'arc réel de la poignée. Caler la rotation sur les seules
   positions extrêmes ne suffit pas ici, et le garde-fou l'a montré :
   la rotation du câble n'est pas MONOTONE (+9,2 / +11,1 / +9,1 /
   +4,9 / −0,6 / −6,8), parce que la poignée passe d'abord à
   l'aplomb de la poulie avant de s'en éloigner. Une interpolation
   entre les deux bouts détachait le câble de 21,7 unités à
   mi-parcours. Allongement ×1 -> ×2,5868.
   ========================================================= */
EXERCISE_MOTIONS["ecarte-poulie-basse"] = {
  vb: "46 32 120 122",
  dur: 4,
  phases: { con: [0, 38], ecc: [46, 90] },
  alt: "Debout de profil entre deux poulies basses, coudes bloqués : les bras montent en arc de cercle depuis derrière les hanches jusqu'à hauteur du visage, puis redescendent lentement.",
  fixe: `
    <line class="mo-ground" x1="50" y1="150" x2="164" y2="150"/>
    <!-- colonne de poulie BASSE, derrière le pratiquant -->
    <line class="mo-gear" x1="54" y1="36" x2="54" y2="150"/>
    <circle class="mo-pulley" cx="54" cy="138" r="5"/>
    <!-- corps de profil, face à droite, un pied devant -->
    <circle class="mo-head" cx="108" cy="44" r="9"/>
    <line class="mo-body" x1="108" y1="53" x2="110" y2="62"/>
    <line class="mo-body" x1="110" y1="62" x2="114" y2="104"/>
    <line class="mo-body" x1="114" y1="104" x2="128" y2="126"/>
    <line class="mo-body" x1="128" y1="126" x2="136" y2="150"/>
    <line class="mo-body" x1="114" y1="104" x2="106" y2="126"/>
    <line class="mo-body" x1="106" y1="126" x2="100" y2="150"/>
    <!-- amplitude : l'arc RÉELLEMENT parcouru par la poignée -->
    <path class="mo-rom" fill="none" d="M97.48 108.72 A48.37 48.37 0 0 0 156.72 49.48"/>`,
  muscles: [
    { nom: "Haut du grand pectoral",
      svg: `<ellipse cx="117" cy="72" rx="4.5" ry="8" transform="rotate(10 117 72)"/>` },
    { nom: "Deltoïde antérieur",
      svg: `<circle cx="113" cy="62" r="4"/>` }
  ],
  parts: [
    {
      /* CÂBLE : tourne autour de la POULIE (54,138) et s'allonge
         (×2,587) pour que son extrémité reste sur la poignée. */
      o: "54px 138px",
      k: [[0, "rotate(0deg) scale(1)"], [6.33, "rotate(9.16deg) scale(1.2654)"],
          [12.67, "rotate(11.14deg) scale(1.5821)"], [19, "rotate(9.09deg) scale(1.8965)"],
          [25.33, "rotate(4.86deg) scale(2.1796)"], [31.67, "rotate(-0.61deg) scale(2.4136)"],
          [38, "rotate(-6.80deg) scale(2.5868)"], [46, "rotate(-6.80deg) scale(2.5868)"],
          [53.33, "rotate(-0.61deg) scale(2.4136)"], [60.67, "rotate(4.86deg) scale(2.1796)"],
          [68, "rotate(9.09deg) scale(1.8965)"], [75.33, "rotate(11.14deg) scale(1.5821)"],
          [82.67, "rotate(9.16deg) scale(1.2654)"], [90, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="54" y1="138" x2="97.48" y2="108.72"/>`
    },
    {
      /* BLOC BRAS : coude figé à 161,6°, rotation −120° autour de
         l'ÉPAULE (110,62). Aucun enfant : le coude ne bouge pas, et
         c'est précisément ce que l'exercice demande. */
      o: "110px 62px",
      /* MÊME grille de keyframes que le câble : l'easing est ease-in-out
         PAR SEGMENT, deux pièces aux instants-clés différents se
         désynchronisent entre ces instants. */
      k: [[0, "rotate(0deg)"], [6.33, "rotate(-20deg)"], [12.67, "rotate(-40deg)"],
          [19, "rotate(-60deg)"], [25.33, "rotate(-80deg)"], [31.67, "rotate(-100deg)"],
          [38, "rotate(-120deg)"], [46, "rotate(-120deg)"], [53.33, "rotate(-100deg)"],
          [60.67, "rotate(-80deg)"], [68, "rotate(-60deg)"], [75.33, "rotate(-40deg)"],
          [82.67, "rotate(-20deg)"], [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="110" y1="62" x2="100.09" y2="83.86"/>
        <circle class="mo-joint" cx="100.09" cy="83.86" r="2.6"/>
        <line class="mo-limb" x1="100.09" y1="83.86" x2="97.48" y2="108.72"/>
        <circle class="mo-hand" cx="97.48" cy="108.72" r="3.4"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M66 98 L90 72 M82 72 L90 72 L89 80"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M90 72 L66 98 M67 90 L66 98 L74 97"/>` }
  ]
};

/* =========================================================
   59. TRACTIONS SUPINATION (CHIN-UP)  (tractions-supination)
   -----------------------------------------------------------
   Position  : SUSPENDU à une barre fixe, prise SUPINATION
               (paumes vers soi), mains LARGEUR D'ÉPAULES, bras
               tendus, gainage actif.
   Matériel  : barre fixe. Les MAINS sont le point fixe (chaîne
               fermée) : c'est le corps qui monte.
   Mobiles   : coude (flexion) et épaule (EXTENSION) ; le buste
               s'incline vers l'arrière.
   Fixes     : les mains sur la barre ; le rachis et les jambes,
               qui restent solidaires du buste — « balancement »
               est l'erreur n°1, donc le corps est modélisé
               RIGIDE. Que les pieds partent vers l'avant n'est
               pas un balancement : c'est la conséquence
               géométrique de l'inclinaison du buste.
   >>> POURQUOI CE SCHÉMA EST DE PROFIL ALORS QUE LA TRACTION
       PRONATION EST DE FACE <<< Ce n'est pas une variation de
       présentation, c'est le mouvement lui-même qui change de
       plan. En pronation LARGE, les coudes partent sur les
       CÔTÉS : le geste est une adduction, il vit dans le plan
       FRONTAL, et seule une vue de face le montre. En supination
       SERRÉE, les coudes descendent DEVANT le corps, le long des
       côtes : le geste devient une extension d'épaule, il vit
       dans le plan SAGITTAL, et seule une vue de profil le
       montre. Les deux vues disent la même chose que les deux
       prises : ce sont deux exercices différents.
   Sens      : montée jusqu'au menton au-dessus de la barre =
               CONCENTRIQUE ; descente contrôlée = excentrique.
   ROM       : coude de 180° (suspension complète) à 35°. Le
               buste s'incline de 25° vers l'arrière — c'est
               indispensable, et le calcul le montre : bras et
               avant-bras mesurant 22 chacun, un coude fermé à
               35° ne place l'épaule qu'à 13,2 de la barre. Sans
               inclinaison, le menton resterait SOUS la barre.
               C'est cette contrainte, et non un choix graphique,
               qui impose l'inclinaison du buste.
   Agonistes : GRAND DORSAL et BICEPS BRACHIAL, ce dernier
               beaucoup plus qu'en pronation. Raison : le biceps
               est aussi un SUPINATEUR ; avant-bras supiné, il
               est dans sa position de force et peut fléchir le
               coude à plein régime. En pronation il est
               partiellement mis hors course. C'est pour cela, et
               non par magie, que le chin-up est plus facile.
   Distinction : ≠ traction pronation (prise large, plan frontal,
               vue de face, peu de biceps) ; ≠ tirage vertical
               poulie (assis, c'est la barre qui descend vers un
               corps fixe).
   GÉOMÉTRIE (calculée) — main (120,30) FIXE, avant-bras 22,
   bras 22.
     bas   coude (120,52)     épaule (120,74)    coude à 180°
     haut  coude (110.16,49.68) épaule (129.51,39.21) coude à 35°
     menton : de (108.34,65.66) à (126.04,26.72), soit 3,3
              AU-DESSUS de la barre (y=30). C'EST CE QUI A FIXÉ LES
              25° : le même calcul à 0° d'inclinaison place le
              menton à 30,87, donc SOUS la barre. L'inclinaison
              n'est pas un effet de style, elle est la condition
              pour que la répétition soit complète.
   -> avant-bras +26,57° ; bras relatif −145,0° ; corps relatif
      +143,43° (soit +25° en absolu : l'inclinaison du buste).
   JAMBES : genoux fléchis à ~90°, tibias vers l'arrière — c'est la
   position réelle d'une traction, et c'est aussi la seule qui tienne
   dans le cadre : jambes tendues, les pieds tomberaient 30 unités
   plus bas que le sol, c'est-à-dire que le sujet serait debout.
   Cuisse (122,116)->(116,148) = 32,6 ; tibia ->(147.4,153.9) = 32,0.
   ========================================================= */
EXERCISE_MOTIONS["tractions-supination"] = {
  vb: "90 8 94 162",
  dur: 4,
  phases: { con: [0, 34], ecc: [42, 86] },
  alt: "Suspendu de profil à une barre fixe en prise supination largeur d'épaules : le corps monte, les coudes descendent devant les côtes et le buste s'incline en arrière jusqu'à ce que le menton passe au-dessus de la barre.",
  fixe: `
    <line class="mo-ground" x1="94" y1="168" x2="180" y2="168"/>
    <!-- barre murale : montant, potence et descente jusqu'à la barre -->
    <line class="mo-gear" x1="176" y1="12" x2="176" y2="168"/>
    <line class="mo-gear" x1="116" y1="12" x2="176" y2="12"/>
    <line class="mo-gear" x1="120" y1="12" x2="120" y2="25.5"/>
    <!-- barre vue par la tranche : un tube en bout -->
    <circle class="mo-pulley" cx="120" cy="30" r="6.5"/>`,
  parts: [
    {
      /* AVANT-BRAS : enraciné à la MAIN (120,30), qui ne quitte jamais
         la barre. +26,57° : l'avant-bras bascule vers l'AVANT du corps,
         ce qui est propre à la prise serrée en supination. */
      o: "120px 30px",
      k: [[0, "rotate(0deg)"], [34, "rotate(26.57deg)"], [42, "rotate(26.57deg)"],
          [86, "rotate(0deg)"], [100, "rotate(0deg)"]],
      childrenFirst: true,
      svg: `
        <circle class="mo-hand" cx="120" cy="30" r="3.6"/>
        <line class="mo-limb" x1="120" y1="30" x2="120" y2="52"/>
        <circle class="mo-joint" cx="120" cy="52" r="2.5"/>`,
      children: [
        {
          /* BRAS : flexion du coude autour de (120,52). −145° ferme le
             coude de 180° à 35°. */
          o: "120px 52px",
          k: [[0, "rotate(0deg)"], [34, "rotate(-145deg)"], [42, "rotate(-145deg)"],
              [86, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Biceps brachial",
          muscle: `<ellipse cx="116.5" cy="71" rx="3" ry="4.5"/>`,
          svg: `<line class="mo-limb" x1="120" y1="52" x2="120" y2="74"/>`,
          children: [
            {
              /* CORPS : contre-rotation de +143,43° autour de l'ÉPAULE
                 (120,74). Elle ne laisse pas le buste vertical — elle le
                 laisse à +25°, l'inclinaison arrière sans laquelle le
                 menton ne passerait pas la barre. */
              o: "120px 74px",
              k: [[0, "rotate(0deg)"], [34, "rotate(143.43deg)"], [42, "rotate(143.43deg)"],
                  [86, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: "Grand dorsal",
              muscle: `<ellipse cx="124.5" cy="92" rx="3.8" ry="13" transform="rotate(3 124.5 92)"/>`,
              svg: `
                <circle class="mo-head" cx="114" cy="60" r="8"/>
                <line class="mo-body" x1="116" y1="67" x2="120" y2="74"/>
                <line class="mo-body" x1="120" y1="74" x2="122" y2="116"/>
                <line class="mo-body" x1="122" y1="116" x2="116" y2="148"/>
                <line class="mo-body" x1="116" y1="148" x2="147.4" y2="153.9"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M164 76 L164 44 M159 52 L164 44 L169 52"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M164 44 L164 76 M159 68 L164 76 L169 68"/>` }
  ]
};

/* =========================================================
   60. TIRAGE HORIZONTAL À LA POULIE BASSE
       (tirage-horizontal-poulie)
   -----------------------------------------------------------
   Position  : ASSIS face à la poulie basse, pieds calés sur le
               repose-pied, genoux à peine fléchis (156°), buste
               DROIT, poignée en V tenue à deux mains.
   Matériel  : poulie basse, poignée neutre. Le câble tire vers
               l'AVANT et le BAS.
   Mobiles   : l'OMOPLATE (rétraction), l'ÉPAULE (extension) et
               le COUDE (flexion). Trois étages, et l'omoplate
               est le premier — c'est l'ordre correct du geste.
   Fixes     : le BASSIN sur le siège, les PIEDS sur la cale, les
               genoux, et surtout le BUSTE : « balancier du
               buste » est l'erreur n°1, donc le tronc est
               strictement immobile dans ce schéma. Un tronc qui
               oscillerait dessinerait la faute.
CE QUE CE SCHÉMA MONTRE ET QU'AUCUN AUTRE ROWING NE MONTRE :
               le RECUL DE L'ÉPAULE. « Tirer avec les bras
               seulement » est la deuxième erreur listée, et elle
               reste invisible tant que la ceinture scapulaire
               n'est pas une pièce distincte du bras. Ici elle en
               est une : elle recule de 4 unités (≈5 cm) et
               entraîne TOUT le bras avec elle — le geste part
               donc de là, et pas du coude.
   PRÉCISION QUI ÉVITE UNE SUR-AFFIRMATION : ce n'est pas la
               rétraction de l'omoplate qui est dessinée. La
               rétraction est un glissement MÉDIAL, vers le
               rachis, donc perpendiculaire au plan du schéma :
               de profil elle est strictement invisible. Ce qui
               est dessiné, c'est sa conséquence visible de
               profil — l'omoplate épouse une cage thoracique
               courbe, donc en glissant vers le dedans elle
               emmène l'articulation de l'épaule vers l'ARRIÈRE.
               Deux repères pointillés fixes bornent ce recul,
               sans quoi 4 unités ne se verraient pas.
   Sens      : traction de la poignée vers le nombril =
               CONCENTRIQUE ; retour contrôlé, omoplate qui
               revient sans que les lombaires s'arrondissent =
               excentrique.
   ROM       : coude de 174° à 72°, coude qui passe 17,75 unités
               DERRIÈRE l'épaule — c'est la marque d'un vrai
               rowing, le coude dépasse le tronc.
   Agonistes : RHOMBOÏDES et TRAPÈZE MOYEN (les rétracteurs de
               l'omoplate, donc les vrais responsables de
               l'« épaisseur » du dos), GRAND DORSAL, biceps.
   Distinction : c'est le seul tirage horizontal fait BUSTE
               VERTICAL. ≠ rowing barre / T-bar (buste penché,
               résistance verticale, lombaires chargés en
               permanence) ; ≠ rowing haltère (unilatéral, en
               appui) ; ≠ rowing inversé (chaîne fermée, c'est le
               corps qui se déplace) ; ≠ tirage vertical (le bras
               vient d'au-dessus).
   GÉOMÉTRIE (calculée) — bras 22, avant-bras 22.
     début épaule (112,66) coude (93.55,77.99) main (73.97,88)
     fin   épaule (116,66) coude (133.75,79)   main (116,92)
   TRAJET IMPOSÉ, PUIS RÉSOLU : la poignée d'un rowing assis suit
   une ligne quasi RECTILIGNE. Elle est donc imposée droite entre
   les deux extrêmes, échantillonnée en six intervalles, et la
   chaîne omoplate/bras/avant-bras est résolue par IK à chacun.
   Sans cela, l'interpolation linéaire des rotations faisait
   plonger la poignée de 11 unités à mi-course et le CÂBLE s'en
   détachait de 13 unités — défaut mesuré, pas supposé.
     coude 173,8° -> 124,6 -> 103,1 -> 88,2 -> 78,1 -> 72,8 -> 72,4
   Il se ferme donc surtout dans la PREMIÈRE moitié, puis reste
   quasi constant pendant que l'épaule recule : c'est exactement
   la technique correcte, et c'est ici une conséquence du calcul,
   pas une intention.
   Câble : poulie (44,130), rotation +26,67° et allongement
   ×1,5779 au total, échantillonnés aux mêmes six intervalles.
   ========================================================= */
EXERCISE_MOTIONS["tirage-horizontal-poulie"] = {
  vb: "34 38 124 116",
  dur: 3.8,
  phases: { con: [0, 36], ecc: [44, 88] },
  alt: "Assis buste droit face à une poulie basse : l'omoplate recule, puis le coude passe derrière le tronc et la poignée vient au nombril ; retour contrôlé.",
  fixe: `
    <line class="mo-ground" x1="36" y1="150" x2="154" y2="150"/>
    <!-- rail, colonne de poulie basse et repose-pied -->
    <line class="mo-gear" x1="40" y1="144" x2="150" y2="144"/>
    <line class="mo-gear" x1="44" y1="144" x2="44" y2="126"/>
    <circle class="mo-pulley" cx="44" cy="130" r="5"/>
    <line class="mo-pad" x1="56" y1="144" x2="72" y2="116"/>
    <!-- siège -->
    <line class="mo-pad" x1="100" y1="112" x2="142" y2="112"/>
    <line class="mo-gear" x1="120" y1="112" x2="120" y2="144"/>
    <!-- corps assis de profil, BUSTE IMMOBILE (donc dans les fixes) -->
    <circle class="mo-head" cx="114" cy="50" r="9"/>
    <line class="mo-body" x1="116" y1="59" x2="118" y2="64"/>
    <line class="mo-body" x1="118" y1="64" x2="120" y2="108"/>
    <line class="mo-body" x1="120" y1="108" x2="89" y2="116"/>
    <line class="mo-body" x1="89" y1="116" x2="64" y2="136"/>
    <line class="mo-body" x1="64" y1="136" x2="66" y2="126"/>
    <!-- REPÈRES FIXES du recul de l'épaule : sans eux, un glissement
         de 4 unités est illisible. Le premier marque la position
         protractée, le second la position rétractée. -->
    <line class="mo-rom" x1="112" y1="59.5" x2="112" y2="64"/>
    <line class="mo-rom" x1="116" y1="59.5" x2="116" y2="64"/>`,
  muscles: [
    { nom: "Rhomboïdes",
      svg: `<ellipse cx="121" cy="70" rx="3" ry="8"/>` },
    { nom: "Grand dorsal",
      svg: `<ellipse cx="124" cy="92" rx="3.6" ry="12" transform="rotate(3 124 92)"/>` }
  ],
  parts: [
    {
      /* CÂBLE : tourne autour de la POULIE (44,130) et s'allonge pour
         rester sur la poignée. */
      o: "44px 130px",
      k: [[0, "rotate(0deg) scale(1)"], [6, "rotate(6.30deg) scale(1.0748)"],
          [12, "rotate(11.73deg) scale(1.1609)"], [18, "rotate(16.37deg) scale(1.2560)"],
          [24, "rotate(20.34deg) scale(1.3581)"], [30, "rotate(23.74deg) scale(1.4657)"],
          [36, "rotate(26.67deg) scale(1.5779)"], [44, "rotate(26.67deg) scale(1.5779)"],
          [51.33, "rotate(23.74deg) scale(1.4657)"], [58.67, "rotate(20.34deg) scale(1.3581)"],
          [66, "rotate(16.37deg) scale(1.2560)"], [73.33, "rotate(11.73deg) scale(1.1609)"],
          [80.67, "rotate(6.30deg) scale(1.0748)"], [88, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="44" y1="130" x2="73.97" y2="88"/>`
    },
    {
      /* OMOPLATE : TRANSLATION pure de 4 unités vers le rachis. Elle est
         la RACINE de la chaîne du bras : tout le bras la suit. C'est ce
         qui rend visible que le geste part de l'omoplate. */
      o: "112px 66px",
      k: [[0, "translate(0px,0px)"], [6, "translate(0.67px,0px)"], [12, "translate(1.33px,0px)"],
          [18, "translate(2px,0px)"], [24, "translate(2.67px,0px)"], [30, "translate(3.33px,0px)"],
          [36, "translate(4px,0px)"], [44, "translate(4px,0px)"],
          [51.33, "translate(3.33px,0px)"], [58.67, "translate(2.67px,0px)"],
          [66, "translate(2px,0px)"], [73.33, "translate(1.33px,0px)"],
          [80.67, "translate(0.67px,0px)"], [88, "translate(0px,0px)"],
          [100, "translate(0px,0px)"]],
      svg: `<circle class="mo-joint" cx="112" cy="66" r="3.6"/>`,
      children: [
        {
          /* BRAS : rotation autour de l'ÉPAULE. −110,77° emmène le coude
             de devant à 17,75 unités DERRIÈRE l'épaule. */
          o: "112px 66px",
          k: [[0, "rotate(0deg)"], [6, "rotate(-30.09deg)"], [12, "rotate(-47.91deg)"],
              [18, "rotate(-64.35deg)"], [24, "rotate(-80.56deg)"], [30, "rotate(-96.38deg)"],
              [36, "rotate(-110.61deg)"], [44, "rotate(-110.61deg)"],
              [51.33, "rotate(-96.38deg)"], [58.67, "rotate(-80.56deg)"], [66, "rotate(-64.35deg)"],
              [73.33, "rotate(-47.91deg)"], [80.67, "rotate(-30.09deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="112" y1="66" x2="93.55" y2="77.99"/>
            <circle class="mo-joint" cx="93.55" cy="77.99" r="2.6"/>`,
          children: [
            {
              /* AVANT-BRAS + POIGNÉE : rotation RELATIVE autour du COUDE.
                 +101,63° ferme le coude de 174° à 72°. */
              o: "93.55px 77.99px",
              k: [[0, "rotate(0deg)"], [6, "rotate(49.14deg)"], [12, "rotate(70.68deg)"],
                  [18, "rotate(85.57deg)"], [24, "rotate(95.62deg)"], [30, "rotate(100.96deg)"],
                  [36, "rotate(101.33deg)"], [44, "rotate(101.33deg)"],
                  [51.33, "rotate(100.96deg)"], [58.67, "rotate(95.62deg)"], [66, "rotate(85.57deg)"],
                  [73.33, "rotate(70.68deg)"], [80.67, "rotate(49.14deg)"],
                  [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: "Biceps brachial",
              muscle: `<ellipse cx="84" cy="83" rx="6.5" ry="3" transform="rotate(-27 84 83)"/>`,
              svg: `
                <line class="mo-limb" x1="93.55" y1="77.99" x2="73.97" y2="88"/>
                <line class="mo-bar2" x1="70.9" y1="82" x2="77" y2="94"/>
                <circle class="mo-hand" cx="73.97" cy="88" r="3.4"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M68 54 L94 54 M87 49 L94 54 L87 59"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M94 54 L68 54 M75 49 L68 54 L75 59"/>` }
  ]
};

/* =========================================================
   61. ROWING MACHINE ASSIS (POITRINE APPUYÉE)
       (rowing-machine-assis)
   -----------------------------------------------------------
   Position  : ASSIS, POITRINE PLAQUÉE contre un support, pieds
               calés, une poignée dans chaque main, bras tendus
               vers l'avant.
   Matériel  : machine à deux leviers, poitrinière réglable.
   Mobiles   : l'OMOPLATE (rétraction) et le bras (épaule +
               coude). Le buste, lui, est physiquement empêché.
   Fixes     : le TRONC — non pas par consigne mais par le
               matériel. C'est toute la raison d'être de cette
               machine : « décoller la poitrine pour tricher »
               est l'erreur n°1, et la poitrinière la rend
               impossible. Le schéma dessine donc un tronc
               rigoureusement immobile, et la poitrinière juste
               devant lui.
   >>> VU DE DESSUS <<< Et c'est ici que ce schéma se sépare du
               tirage horizontal à la poulie (schéma 60). Là-bas,
               de profil, la rétraction de l'omoplate était
               invisible : c'est un glissement MÉDIAL, donc
               perpendiculaire au plan sagittal ; on ne pouvait
               en montrer que la conséquence, le recul de
               l'épaule. De DESSUS, en revanche, le glissement
               médial est dans le plan du dessin. La vue de
               dessus est donc la seule qui montre À LA FOIS le
               serrage des omoplates ET le recul des coudes —
               c'est-à-dire exactement ce que cette machine sert
               à faire.
   Sens      : traction des coudes vers l'arrière = concentrique ;
               retour bras tendus sans décoller la poitrine =
               excentrique.
   ROM       : coude de 172° à 63°, coude qui finit 5,5 unités
               DERRIÈRE le bord postérieur du tronc. Omoplate :
               4 unités vers le rachis et 2 vers l'arrière.
               « Amplitude courte » est l'erreur n°2 : le schéma
               va donc jusqu'au bout des deux.
   Agonistes : RHOMBOÏDES et TRAPÈZE MOYEN. Le grand dorsal
               participe peu ici : la traction est HAUTE et
               horizontale, coudes écartés — c'est le milieu du
               dos qui travaille, pas la course du dorsal.
   POURQUOI LE LEVIER EST DESSINÉ AVEC UNE SIMPLE HOMOTHÉTIE :
               l'axe de ces machines est HORIZONTAL. La poignée
               décrit donc un cercle dans un plan VERTICAL, et la
               projection de ce cercle vue de dessus est un
               SEGMENT DE DROITE passant par le pied de l'axe.
               Le trajet rectiligne de la poignée n'est donc pas
               une approximation : c'est la projection exacte. Le
               levier ne tourne pas dans ce plan, il s'y
               RACCOURCIT — d'où une homothétie pure (×1 -> ×7,64)
               et aucune rotation.
   Distinction : ≠ tirage poulie (buste libre, câble, de profil) ;
               ≠ rowing barre / T-bar (buste penché non soutenu,
               lombaires chargés) ; ≠ rowing inversé (chaîne
               fermée).
   GÉOMÉTRIE (calculée) — bras 22, avant-bras 22, épaule gauche
   (93,70) -> (97,72). Poignée de (89.00,26.29) à (74.39,68.08),
   pied d'axe (91.2,20). Six intervalles, IK à chacun :
     coude 172,0 -> 118,2 -> 93,7 -> 76,6 -> 65,4 -> 60,5 -> 62,9
     épaule-main 43,89 -> 22,18 -> 22,95
   La très légère réouverture finale (60,5 -> 62,9) est une
   conséquence exacte du trajet, pas une erreur : la poignée
   s'écarte un peu du corps sur la fin.
   ========================================================= */
EXERCISE_MOTIONS["rowing-machine-assis"] = {
  vb: "48 12 124 100",
  dur: 3.6,
  vue: "Vu de dessus",
  phases: { con: [0, 36], ecc: [44, 88] },
  alt: "Vu de dessus. Assis poitrine plaquée contre un support : les coudes partent vers l'arrière et les omoplates se serrent vers la colonne, puis retour bras tendus.",
  fixe: `
    <!-- bâti : arbre horizontal des leviers, à l'avant -->
    <line class="mo-gear" x1="66" y1="20" x2="154" y2="20"/>
    <line class="mo-gear" x1="66" y1="20" x2="66" y2="104"/>
    <line class="mo-gear" x1="154" y1="20" x2="154" y2="104"/>
    <!-- POITRINIÈRE : c'est elle qui interdit la triche -->
    <line class="mo-pad" x1="92" y1="58" x2="128" y2="58"/>
    <!-- siège -->
    <line class="mo-pad" x1="96" y1="96" x2="124" y2="96"/>
    <!-- corps vu de dessus, TRONC IMMOBILE -->
    <ellipse class="mo-torse" cx="110" cy="72" rx="17" ry="11"/>
    <circle class="mo-head mo-head-solid" cx="110" cy="46" r="9"/>
    <!-- trajets imposés aux poignées : deux droites (voir commentaire) -->
    <path class="mo-rom" fill="none" d="M89 26.29 L74.39 68.08"/>
    <path class="mo-rom" fill="none" d="M131 26.29 L145.61 68.08"/>
    <!-- corridor de rétraction des épaules, sans quoi 4 unités ne se voient pas -->
    <line class="mo-rom" x1="93" y1="64" x2="97" y2="64"/>
    <line class="mo-rom" x1="127" y1="64" x2="123" y2="64"/>`,
  muscles: [
    { nom: "Rhomboïdes",
      svg: `<ellipse cx="103" cy="75" rx="4" ry="6"/><ellipse cx="117" cy="75" rx="4" ry="6"/>` },
    { nom: "Trapèze moyen",
      svg: `<ellipse cx="110" cy="68" rx="9" ry="3.4"/>` }
  ],
  parts: [
    {
      /* LEVIER GAUCHE : axe HORIZONTAL, donc de dessus il ne tourne pas,
         il s'allonge le long d'une droite passant par le pied de l'axe.
         Homothétie pure ×7,6436. */
      o: "91.2px 20px",
      k: [[0, "scale(1)"], [6, "scale(2.1073)"], [12, "scale(3.2145)"],
          [18, "scale(4.3218)"], [24, "scale(5.4290)"], [30, "scale(6.5363)"],
          [36, "scale(7.6436)"], [44, "scale(7.6436)"],
          [51.33, "scale(6.5363)"], [58.67, "scale(5.4290)"], [66, "scale(4.3218)"],
          [73.33, "scale(3.2145)"], [80.67, "scale(2.1073)"], [88, "scale(1)"],
          [100, "scale(1)"]],
      svg: `<line class="mo-bar3" vector-effect="non-scaling-stroke" x1="91.2" y1="20" x2="89" y2="26.29"/>`
    },
    {
      /* LEVIER DROIT : miroir. */
      o: "128.8px 20px",
      k: [[0, "scale(1)"], [6, "scale(2.1073)"], [12, "scale(3.2145)"],
          [18, "scale(4.3218)"], [24, "scale(5.4290)"], [30, "scale(6.5363)"],
          [36, "scale(7.6436)"], [44, "scale(7.6436)"],
          [51.33, "scale(6.5363)"], [58.67, "scale(5.4290)"], [66, "scale(4.3218)"],
          [73.33, "scale(3.2145)"], [80.67, "scale(2.1073)"], [88, "scale(1)"],
          [100, "scale(1)"]],
      svg: `<line class="mo-bar3" vector-effect="non-scaling-stroke" x1="128.8" y1="20" x2="131" y2="26.29"/>`
    },
    {
      /* OMOPLATE GAUCHE : translation (4,2) vers le rachis. Racine de la
         chaîne : tout le bras la suit. */
      o: "93px 70px",
      k: [[0, "translate(0px,0px)"], [6, "translate(0.67px,0.33px)"], [12, "translate(1.33px,0.67px)"],
          [18, "translate(2px,1px)"], [24, "translate(2.67px,1.33px)"], [30, "translate(3.33px,1.67px)"],
          [36, "translate(4px,2px)"], [44, "translate(4px,2px)"],
          [51.33, "translate(3.33px,1.67px)"], [58.67, "translate(2.67px,1.33px)"],
          [66, "translate(2px,1px)"], [73.33, "translate(1.33px,0.67px)"],
          [80.67, "translate(0.67px,0.33px)"], [88, "translate(0px,0px)"],
          [100, "translate(0px,0px)"]],
      svg: `
        <line class="mo-bar3" x1="93" y1="70" x2="100" y2="79"/>
        <circle class="mo-joint" cx="93" cy="70" r="3.4"/>`,
      children: [
        {
          o: "93px 70px",
          k: [[0, "rotate(0deg)"], [6, "rotate(-32.49deg)"], [12, "rotate(-52.40deg)"],
              [18, "rotate(-71.61deg)"], [24, "rotate(-91.73deg)"], [30, "rotate(-112.06deg)"],
              [36, "rotate(-129.47deg)"], [44, "rotate(-129.47deg)"],
              [51.33, "rotate(-112.06deg)"], [58.67, "rotate(-91.73deg)"], [66, "rotate(-71.61deg)"],
              [73.33, "rotate(-52.40deg)"], [80.67, "rotate(-32.49deg)"], [88, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="93" y1="70" x2="89.46" y2="48.29"/>
            <circle class="mo-joint" cx="89.46" cy="48.29" r="2.6"/>`,
          children: [
            {
              o: "89.46px 48.29px",
              k: [[0, "rotate(0deg)"], [6, "rotate(53.75deg)"], [12, "rotate(78.20deg)"],
                  [18, "rotate(95.31deg)"], [24, "rotate(106.58deg)"], [30, "rotate(111.40deg)"],
                  [36, "rotate(109.07deg)"], [44, "rotate(109.07deg)"],
                  [51.33, "rotate(111.40deg)"], [58.67, "rotate(106.58deg)"], [66, "rotate(95.31deg)"],
                  [73.33, "rotate(78.20deg)"], [80.67, "rotate(53.75deg)"], [88, "rotate(0deg)"],
                  [100, "rotate(0deg)"]],
              svg: `
                <line class="mo-limb" x1="89.46" y1="48.29" x2="89" y2="26.29"/>
                <line class="mo-bar2" x1="85.22" y1="24.97" x2="92.78" y2="27.61"/>
                <circle class="mo-hand" cx="89" cy="26.29" r="3"/>`
            }
          ]
        }
      ]
    },
    {
      /* OMOPLATE DROITE : miroir exact autour de x=110. */
      o: "127px 70px",
      k: [[0, "translate(0px,0px)"], [6, "translate(-0.67px,0.33px)"], [12, "translate(-1.33px,0.67px)"],
          [18, "translate(-2px,1px)"], [24, "translate(-2.67px,1.33px)"], [30, "translate(-3.33px,1.67px)"],
          [36, "translate(-4px,2px)"], [44, "translate(-4px,2px)"],
          [51.33, "translate(-3.33px,1.67px)"], [58.67, "translate(-2.67px,1.33px)"],
          [66, "translate(-2px,1px)"], [73.33, "translate(-1.33px,0.67px)"],
          [80.67, "translate(-0.67px,0.33px)"], [88, "translate(0px,0px)"],
          [100, "translate(0px,0px)"]],
      svg: `
        <line class="mo-bar3" x1="127" y1="70" x2="120" y2="79"/>
        <circle class="mo-joint" cx="127" cy="70" r="3.4"/>`,
      children: [
        {
          o: "127px 70px",
          k: [[0, "rotate(0deg)"], [6, "rotate(32.49deg)"], [12, "rotate(52.40deg)"],
              [18, "rotate(71.61deg)"], [24, "rotate(91.73deg)"], [30, "rotate(112.06deg)"],
              [36, "rotate(129.47deg)"], [44, "rotate(129.47deg)"],
              [51.33, "rotate(112.06deg)"], [58.67, "rotate(91.73deg)"], [66, "rotate(71.61deg)"],
              [73.33, "rotate(52.40deg)"], [80.67, "rotate(32.49deg)"], [88, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="127" y1="70" x2="130.54" y2="48.29"/>
            <circle class="mo-joint" cx="130.54" cy="48.29" r="2.6"/>`,
          children: [
            {
              o: "130.54px 48.29px",
              k: [[0, "rotate(0deg)"], [6, "rotate(-53.75deg)"], [12, "rotate(-78.20deg)"],
                  [18, "rotate(-95.31deg)"], [24, "rotate(-106.58deg)"], [30, "rotate(-111.40deg)"],
                  [36, "rotate(-109.07deg)"], [44, "rotate(-109.07deg)"],
                  [51.33, "rotate(-111.40deg)"], [58.67, "rotate(-106.58deg)"], [66, "rotate(-95.31deg)"],
                  [73.33, "rotate(-78.20deg)"], [80.67, "rotate(-53.75deg)"], [88, "rotate(0deg)"],
                  [100, "rotate(0deg)"]],
              svg: `
                <line class="mo-limb" x1="130.54" y1="48.29" x2="131" y2="26.29"/>
                <line class="mo-bar2" x1="134.78" y1="24.97" x2="127.22" y2="27.61"/>
                <circle class="mo-hand" cx="131" cy="26.29" r="3"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M56 58 L56 86 M51 78 L56 86 L61 78"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M56 86 L56 58 M51 66 L56 58 L61 66"/>` }
  ]
};

/* =========================================================
   62. TIRAGE BRAS TENDUS À LA POULIE HAUTE
       (tirage-bras-tendus)
   -----------------------------------------------------------
   Position  : DEBOUT face à une poulie haute, pieds à largeur de
               bassin, genoux à peine fléchis, buste penché de
               22° vers l'avant, barre saisie bras tendus.
   Matériel  : poulie HAUTE, barre droite. Tension continue,
               orientée vers la poulie à chaque instant.
   Mobile    : l'ÉPAULE seule, en extension.
   Fixes     : le COUDE, bloqué à 170° — bras et avant-bras
               forment un BLOC RIGIDE ; le rachis et le bassin,
               car « buste qui se balance » est l'erreur n°2.
               « Plier les coudes » est l'erreur n°1 et
               transformerait l'exercice en tirage vertical.
   Sens      : descente de la barre vers les cuisses =
               CONCENTRIQUE ; remontée contrôlée = excentrique.
   ROM       : 125° d'extension d'épaule, de 137° de flexion
               (bras tendus vers la poulie) à 12° (barre aux
               cuisses). La main parcourt un arc de rayon 43,83
               centré sur l'épaule.
   >>> CE QUI SÉPARE VRAIMENT CET EXERCICE DU PULL-OVER (schéma
       57) <<< Les deux sont la même action : extension d'épaule
       à coude bloqué. Ce qui diffère, ce n'est pas le geste,
       c'est la PORTION D'AMPLITUDE couverte, et c'est le
       matériel qui la décide.
       Le pull-over travaille de 178° à 90° et s'ARRÊTE à la
       verticale : au-delà, le bras de levier de la gravité
       s'annule, la charge ne pèse plus rien, continuer ne
       servirait à rien.
       Le tirage bras tendus travaille de 137° à 12°, parce que
       le câble tire toujours VERS LA POULIE : la résistance ne
       s'annule jamais, et le mouvement peut donc aller jusqu'aux
       cuisses.
       Les deux amplitudes se chevauchent entre 90° et 137°, mais
       chacune a sa zone exclusive. Celle du tirage bras tendus,
       de 12° à 90°, est la COURSE INTERNE du grand dorsal —
       celle qu'un pull-over ne peut pas atteindre. Ce n'est donc
       pas un doublon.
   Agonistes : GRAND DORSAL, et LONGUE PORTION DU TRICEPS. Cette
               seconde n'est pas une coquille : elle s'insère sur
               la SCAPULA, franchit donc l'épaule, et elle est
               extenseur de l'épaule au même titre que le
               dorsal. La fiche parle d'« isolation pure » du
               grand dorsal : c'est vrai pour le BICEPS, qui est
               effectivement hors-jeu ici — c'est l'intérêt de
               l'exercice — mais le triceps et le grand rond
               travaillent aussi. Le schéma les montre plutôt que
               de laisser croire à un muscle unique.
   Distinction : ≠ pull-over (allongé, gravité, amplitude haute) ;
               ≠ tirage vertical (le coude s'y ferme, biceps
               fortement engagés) ; ≠ rowing (traction
               horizontale, coude fermé, omoplates).
   GÉOMÉTRIE (calculée) — épaule (106,50), bras 22, avant-bras 22,
   coude bloqué à 170° -> épaule-main constante 43,83.
     haut  main (66.28,31.48)  coude (85.33,42.48)
     bas   main (113.61,93.16)
   -> bloc bras, rotation −125° autour de l'épaule.
   Câble : poulie (52,20), longueur 18,32 -> 95,65. Sa rotation
   n'est PAS monotone (0 -> +30,2 -> +35,5 -> +32,5 -> +26,5 ->
   +19,1 -> +11,1) : la barre s'éloigne d'abord de l'aplomb de la
   poulie puis y revient. Six intervalles, sans quoi le câble se
   détacherait de la barre en cours de route.
   ========================================================= */
EXERCISE_MOTIONS["tirage-bras-tendus"] = {
  vb: "42 14 96 142",
  dur: 3.8,
  phases: { con: [0, 34], ecc: [42, 88] },
  alt: "Debout de profil face à une poulie haute, buste légèrement penché et coudes bloqués : la barre descend en arc de cercle jusqu'aux cuisses, puis remonte lentement.",
  fixe: `
    <line class="mo-ground" x1="46" y1="150" x2="134" y2="150"/>
    <!-- colonne et poulie HAUTE -->
    <line class="mo-gear" x1="48" y1="16" x2="48" y2="150"/>
    <circle class="mo-pulley" cx="52" cy="20" r="5"/>
    <!-- corps debout, buste penché de 22°, face à la poulie -->
    <circle class="mo-head" cx="98" cy="34" r="9"/>
    <line class="mo-body" x1="102" y1="42" x2="106" y2="50"/>
    <line class="mo-body" x1="106" y1="50" x2="124" y2="94"/>
    <line class="mo-body" x1="124" y1="94" x2="128" y2="122"/>
    <line class="mo-body" x1="128" y1="122" x2="122" y2="150"/>
    <!-- amplitude : l'arc RÉELLEMENT parcouru par la barre -->
    <path class="mo-rom" fill="none" d="M66.28 31.48 A43.83 43.83 0 0 0 113.61 93.16"/>`,
  muscles: [
    { nom: "Grand dorsal",
      svg: `<ellipse cx="120" cy="70" rx="4" ry="13" transform="rotate(22 120 70)"/>` }
  ],
  parts: [
    {
      /* CÂBLE : rotation NON MONOTONE + allongement autour de la POULIE,
         échantillonnés en six intervalles sur l'arc réel de la barre. */
      o: "52px 20px",
      k: [[0, "rotate(0deg) scale(1)"], [5.67, "rotate(30.22deg) scale(1.5679)"],
          [11.33, "rotate(35.45deg) scale(2.4148)"], [17, "rotate(32.47deg) scale(3.2676)"],
          [22.67, "rotate(26.48deg) scale(4.0451)"], [28.33, "rotate(19.14deg) scale(4.7058)"],
          [34, "rotate(11.10deg) scale(5.2218)"], [42, "rotate(11.10deg) scale(5.2218)"],
          [49.67, "rotate(19.14deg) scale(4.7058)"], [57.33, "rotate(26.48deg) scale(4.0451)"],
          [65, "rotate(32.47deg) scale(3.2676)"], [72.67, "rotate(35.45deg) scale(2.4148)"],
          [80.33, "rotate(30.22deg) scale(1.5679)"], [88, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="52" y1="20" x2="66.28" y2="31.48"/>`
    },
    {
      /* BLOC BRAS : coude figé à 170°, rotation −125° autour de l'ÉPAULE
         (106,50). Aucun enfant : plier le coude serait dessiner la faute.
         Même grille de keyframes que le câble (easing par segment). */
      o: "106px 50px",
      k: [[0, "rotate(0deg)"], [5.67, "rotate(-20.83deg)"], [11.33, "rotate(-41.67deg)"],
          [17, "rotate(-62.50deg)"], [22.67, "rotate(-83.33deg)"], [28.33, "rotate(-104.17deg)"],
          [34, "rotate(-125deg)"], [42, "rotate(-125deg)"],
          [49.67, "rotate(-104.17deg)"], [57.33, "rotate(-83.33deg)"], [65, "rotate(-62.50deg)"],
          [72.67, "rotate(-41.67deg)"], [80.33, "rotate(-20.83deg)"], [88, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      muscleNom: "Longue portion du triceps",
      muscle: `<ellipse cx="94.5" cy="49.5" rx="7" ry="3.2" transform="rotate(20 94.5 49.5)"/>`,
      svg: `
        <line class="mo-limb" x1="106" y1="50" x2="85.33" y2="42.48"/>
        <circle class="mo-joint" cx="85.33" cy="42.48" r="2.6"/>
        <line class="mo-limb" x1="85.33" y1="42.48" x2="66.28" y2="31.48"/>
        <!-- barre droite vue par la tranche -->
        <line class="mo-bar2" x1="63.78" y1="35.81" x2="68.78" y2="27.15"/>
        <circle class="mo-hand" cx="66.28" cy="31.48" r="3"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M72 104 L72 136 M67 128 L72 136 L77 128"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M72 136 L72 104 M67 112 L72 104 L77 112"/>` }
  ]
};

/* =========================================================
   63. TIRAGE VERTICAL PRISE SERRÉE (TRIANGLE)
       (tirage-vertical-prise-serree)
   -----------------------------------------------------------
   Position  : ASSIS, cuisses bloquées sous le boudin, poignée
               TRIANGLE (prise neutre, mains jointes), bras
               tendus au-dessus de la tête, buste incliné de 15°
               vers l'arrière, thorax bombé.
   Matériel  : poulie haute, poignée en V.
   Mobiles   : ÉPAULE (extension) et COUDE (flexion).
   Fixes     : le bassin sous les boudins, et le BUSTE — « se
               coucher en arrière » est l'erreur n°1, donc
               l'inclinaison de 15° est prise au départ et ne
               bouge plus d'un degré pendant la traction. Un
               buste qui s'inclinerait davantage en tirant
               dessinerait la faute.
   >>> POURQUOI DE PROFIL, ALORS QUE LE TIRAGE VERTICAL PRISE
       LARGE EST DE FACE <<< C'est la même règle que pour le
       couple traction pronation / traction supination, et elle
       est maintenant systématique dans ce catalogue : c'est la
       PRISE qui décide du plan de travail, et le plan décide de
       la vue. Prise LARGE en pronation : les coudes partent sur
       les côtés, plan FRONTAL, vue de face. Prise SERRÉE en
       neutre : les coudes descendent DEVANT le corps le long des
       côtes, plan SAGITTAL, vue de profil. Deux prises, deux
       plans, deux vues — et deux exercices.
   Sens      : traction de la poignée vers le bas du sternum =
               concentrique ; retour bras tendus en laissant le
               dorsal s'étirer = excentrique.
   ROM       : coude de 172° à 37°, puis 47° en fin de course.
               Cette légère RÉOUVERTURE de 10° n'est pas une
               erreur : la barre descend le long d'une verticale,
               elle passe donc au plus près de l'épaule (14,35)
               à hauteur de sternum, puis s'en écarte un peu
               (17,80) en arrivant au haut des abdominaux. Le
               coude finit 7,7 unités DERRIÈRE le tronc, ce qui
               est la marque d'une prise serrée menée au bout.
   Agonistes : GRAND DORSAL, fibres basses — c'est le trajet
               coudes serrés le long du corps qui les sollicite —
               et BICEPS, fortement engagé par la prise neutre.
   Distinction : ≠ tirage vertical prise large (plan frontal, vue
               de face, coudes écartés, peu de biceps) ;
               ≠ traction supination (même plan sagittal, mais
               CHAÎNE FERMÉE : là c'est le corps qui monte vers
               une barre fixe) ; ≠ tirage horizontal (traction
               horizontale, omoplates).
   GÉOMÉTRIE (calculée) — épaule (128,68), bras 24, avant-bras 20.
   Segments volontairement INÉGAUX ici : la position du coude en
   fin de course dépend du rapport bras/avant-bras, et deux
   segments égaux plaçaient le coude 21 unités derrière le tronc,
   ce qui est trop.
   Trajet de la barre imposé quasi VERTICAL, de (112.99,26.76) à
   (114.00,79.00), échantillonné en six intervalles, IK à chacun :
     coude 171,7 -> 108,4 -> 78,4 -> 56,0 -> 40,6 -> 36,7 -> 46,6
     coude (point) de (118.33,46.03) à (129.23,91.97)
   Câble : poulie (118,20), rotation −32,66° et allongement
   ×7,0281, échantillonnés sur la même grille.
   ========================================================= */
EXERCISE_MOTIONS["tirage-vertical-prise-serree"] = {
  vb: "56 8 92 152",
  dur: 4,
  phases: { con: [0, 34], ecc: [42, 88] },
  alt: "Assis de profil sous une poulie haute, poignée triangle : la poignée descend le long d'une verticale jusqu'au bas du sternum, les coudes passant derrière le tronc, puis remonte lentement.",
  fixe: `
    <line class="mo-ground" x1="60" y1="156" x2="146" y2="156"/>
    <!-- bâti : colonne, potence et poulie haute -->
    <line class="mo-gear" x1="60" y1="12" x2="60" y2="156"/>
    <line class="mo-gear" x1="60" y1="12" x2="122" y2="12"/>
    <circle class="mo-pulley" cx="118" cy="20" r="5"/>
    <!-- siège et BOUDIN de cuisses : le bassin est bloqué -->
    <line class="mo-pad" x1="100" y1="118" x2="136" y2="118"/>
    <line class="mo-gear" x1="118" y1="122" x2="118" y2="156"/>
    <line class="mo-gear" x1="100" y1="104" x2="100" y2="88"/>
    <circle class="mo-pulley" cx="100" cy="110" r="6"/>
    <!-- corps assis de profil, buste incliné de 15° et IMMOBILE -->
    <circle class="mo-head" cx="134" cy="50" r="9"/>
    <line class="mo-body" x1="131" y1="58" x2="128" y2="68"/>
    <line class="mo-body" x1="128" y1="68" x2="116" y2="112"/>
    <line class="mo-body" x1="116" y1="112" x2="86" y2="120"/>
    <line class="mo-body" x1="86" y1="120" x2="82" y2="152"/>
    <line class="mo-body" x1="82" y1="152" x2="74" y2="156"/>`,
  muscles: [
    { nom: "Grand dorsal (fibres basses)",
      svg: `<ellipse cx="124" cy="100" rx="3.6" ry="11" transform="rotate(15 124 100)"/>` }
  ],
  parts: [
    {
      /* CÂBLE : rotation + allongement autour de la POULIE (118,20),
         échantillonnés sur la trajectoire réelle de la poignée. */
      o: "118px 20px",
      k: [[0, "rotate(0deg) scale(1)"], [5.67, "rotate(-19.16deg) scale(1.9261)"],
          [11.33, "rotate(-25.60deg) scale(2.9261)"], [17, "rotate(-28.74deg) scale(3.9442)"],
          [22.67, "rotate(-30.59deg) scale(4.9693)"], [28.33, "rotate(-31.81deg) scale(5.9977)"],
          [34, "rotate(-32.66deg) scale(7.0281)"], [42, "rotate(-32.66deg) scale(7.0281)"],
          [49.67, "rotate(-31.81deg) scale(5.9977)"], [57.33, "rotate(-30.59deg) scale(4.9693)"],
          [65, "rotate(-28.74deg) scale(3.9442)"], [72.67, "rotate(-25.60deg) scale(2.9261)"],
          [80.33, "rotate(-19.16deg) scale(1.9261)"], [88, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="118" y1="20" x2="112.99" y2="26.76"/>`
    },
    {
      /* BRAS : rotation autour de l'ÉPAULE (128,68). −159,17° : le coude
         part de haut-devant, passe par l'horizontale et finit derrière le
         tronc. Même grille de keyframes que le câble. */
      o: "128px 68px",
      k: [[0, "rotate(0deg)"], [5.67, "rotate(-32.83deg)"], [11.33, "rotate(-52.31deg)"],
          [17, "rotate(-72.36deg)"], [22.67, "rotate(-98.04deg)"], [28.33, "rotate(-131.76deg)"],
          [34, "rotate(-159.17deg)"], [42, "rotate(-159.17deg)"],
          [49.67, "rotate(-131.76deg)"], [57.33, "rotate(-98.04deg)"], [65, "rotate(-72.36deg)"],
          [72.67, "rotate(-52.31deg)"], [80.33, "rotate(-32.83deg)"], [88, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      muscleNom: "Biceps brachial",
      muscle: `<ellipse cx="120" cy="58.4" rx="3" ry="6.5" transform="rotate(-24 120 58.4)"/>`,
      svg: `
        <line class="mo-limb" x1="128" y1="68" x2="118.33" y2="46.03"/>
        <circle class="mo-joint" cx="118.33" cy="46.03" r="2.6"/>`,
      children: [
        {
          /* AVANT-BRAS + POIGNÉE TRIANGLE : rotation RELATIVE au bras. */
          o: "118.33px 46.03px",
          k: [[0, "rotate(0deg)"], [5.67, "rotate(63.36deg)"], [11.33, "rotate(93.34deg)"],
              [17, "rotate(115.75deg)"], [22.67, "rotate(131.18deg)"], [28.33, "rotate(135.07deg)"],
              [34, "rotate(125.09deg)"], [42, "rotate(125.09deg)"],
              [49.67, "rotate(135.07deg)"], [57.33, "rotate(131.18deg)"], [65, "rotate(115.75deg)"],
              [72.67, "rotate(93.34deg)"], [80.33, "rotate(63.36deg)"], [88, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="118.33" y1="46.03" x2="112.99" y2="26.76"/>
            <line class="mo-bar2" x1="109.14" y1="27.83" x2="116.84" y2="25.69"/>
            <circle class="mo-hand" cx="112.99" cy="26.76" r="3"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M72 44 L72 76 M67 68 L72 76 L77 68"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M72 76 L72 44 M67 52 L72 44 L77 52"/>` }
  ]
};

/* =========================================================
   64. SHRUGS À LA BARRE  (shrugs-barre)
   -----------------------------------------------------------
   Position  : DEBOUT, barre tenue à deux mains DEVANT LES
               CUISSES, bras tendus, dos droit, regard devant.
   Matériel  : une barre chargée. C'est elle qui fait tout
               l'intérêt : deux mains sur un seul engin, on peut
               charger bien plus lourd qu'avec des haltères.
   Mobile    : l'OMOPLATE, en ÉLÉVATION. Rien d'autre.
   Fixes     : le COUDE, qui reste tendu — « plier les coudes »
               est l'erreur n°2 et transformerait le mouvement en
               tirage ; le rachis ; les jambes.
   >>> VU DE FACE, ALORS QUE LES SHRUGS AUX HALTÈRES SONT DE
       PROFIL <<< L'élévation de l'omoplate est un glissement
       vers le HAUT le long des côtes : elle vit dans le plan
       FRONTAL. Et le trapèze supérieur va de la nuque à
       l'acromion — deux points qui ne sont alignés que de face.
       C'est donc la seule vue où l'on peut montrer le muscle en
       train de se RACCOURCIR entre ses deux insertions, ce que
       ce schéma fait : le trapèze passe de 15,62 à 12,17 de
       longueur, soit −22 %, et se redresse de 30°.
       CE QUE CETTE VUE NE MONTRE PAS, ET OÙ LE VOIR : « rouler
       les épaules » est l'erreur n°1, et c'est une faute
       SAGITTALE — de face elle serait invisible. C'est
       précisément ce que montre le schéma des shrugs aux
       haltères, dessiné de profil, où l'épaule monte à la
       verticale sans partir vers l'avant. Les deux vues sont
       complémentaires, chacune montre ce que son matériel rend
       saillant.
   Sens      : montée des épaules = concentrique, suivie d'une
               TENUE d'une seconde en haut ; descente contrôlée =
               excentrique.
   ROM       : 8 unités d'élévation verticale, soit ≈8 cm à
               l'échelle du sujet. « Amplitude minuscule » est
               l'erreur n°3 : le schéma va donc au bout de
               l'élévation, et deux repères pointillés fixes
               bornent le trajet — sans eux, 8 unités passeraient
               inaperçues.
   Agonistes : TRAPÈZE SUPÉRIEUR. L'angulaire de l'omoplate élève
               lui aussi, mais il est dessiné NULLE PART ici : ses
               deux insertions, rachis cervical et angle supérieur
               de la scapula, tombent de face DERRIÈRE le crâne et
               le trapèze. Le placer visible aurait voulu dire le
               placer faux.
   PROPORTION DU BRAS : bras entier 58 pour un tronc de 50, et non
               44 comme dans les schémas à coude fléchi. Sur un
               mouvement à bras TENDUS, c'est la longueur du bras
               qui décide où tombe la barre : à 44 elle arrivait à
               la ceinture, à 58 elle arrive au haut des cuisses,
               ce que dit la consigne.
   POURQUOI L'OMOPLATE N'EST PAS DESSINÉE EN TRAIN DE TOURNER :
               l'élévation pure est une TRANSLATION. La rotation
               de l'omoplate, elle, appartient aux mouvements
               au-dessus de la tête. Faire pivoter l'omoplate ici
               serait dessiner un autre mouvement.
   Distinction : ≠ shrugs haltères (charges séparées pendant sur
               les côtés, vue de profil) ; ≠ rowing (le coude s'y
               ferme) ; ≠ face pull (rétraction, pas élévation).
   GÉOMÉTRIE (calculée) — acromion gauche (102,62) -> (102,54),
   ancrage cervical du trapèze (114,52).
     longueur du trapèze 15,62 -> 12,17  (facteur 0,779)
     orientation 140,19° -> 170,54°      (rotation +30,35°)
   Le trapèze est donc animé comme un câble l'est : rotation ET
   homothétie autour de son insertion FIXE, calculées pour que son
   extrémité tombe exactement sur l'acromion aux deux positions.
   ========================================================= */
EXERCISE_MOTIONS["shrugs-barre"] = {
  vb: "68 28 98 132",
  dur: 3.2,
  phases: { con: [0, 30], ecc: [48, 88] },
  alt: "Vu de face, debout, barre tenue à deux mains devant les cuisses : les deux épaules montent verticalement vers les oreilles, coudes tendus, puis redescendent.",
  fixe: `
    <line class="mo-ground" x1="96" y1="156" x2="146" y2="156"/>
    <!-- corps de face : tête, rachis, jambes — immobiles -->
    <circle class="mo-head" cx="120" cy="40" r="10"/>
    <line class="mo-body" x1="120" y1="50" x2="120" y2="112"/>
    <line class="mo-body" x1="120" y1="112" x2="112" y2="156"/>
    <line class="mo-body" x1="120" y1="112" x2="128" y2="156"/>
    <!-- repères FIXES du trajet de l'acromion : bas et haut -->
    <line class="mo-rom" x1="90" y1="62" x2="99" y2="62"/>
    <line class="mo-rom" x1="90" y1="54" x2="99" y2="54"/>
    <line class="mo-rom" x1="141" y1="62" x2="150" y2="62"/>
    <line class="mo-rom" x1="141" y1="54" x2="150" y2="54"/>`,
  parts: [
    {
      /* TRAPÈZE GAUCHE : animé comme un câble — rotation +30,35° et
         homothétie ×0,779 autour de son insertion CERVICALE, fixe en
         (114,52), pour que son autre extrémité suive l'acromion. C'est
         le raccourcissement du muscle lui-même qui est dessiné. */
      o: "114px 52px",
      k: [[0, "rotate(0deg) scale(1)"], [30, "rotate(30.35deg) scale(0.779)"],
          [48, "rotate(30.35deg) scale(0.779)"], [88, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      muscleNom: "Trapèze supérieur",
      muscle: `<ellipse cx="108" cy="57" rx="8.5" ry="3.6" transform="rotate(-39.81 108 57)"/>`
    },
    {
      /* TRAPÈZE DROIT : miroir. */
      o: "126px 52px",
      k: [[0, "rotate(0deg) scale(1)"], [30, "rotate(-30.35deg) scale(0.779)"],
          [48, "rotate(-30.35deg) scale(0.779)"], [88, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      muscle: `<ellipse cx="132" cy="57" rx="8.5" ry="3.6" transform="rotate(39.81 132 57)"/>`
    },
    {
      /* CEINTURE SCAPULAIRE + BRAS + BARRE : TRANSLATION verticale pure
         de 8. Le coude ne bouge pas : bras et barre montent d'un bloc. */
      o: "120px 62px",
      k: [[0, "translate(0px,0px)"], [30, "translate(0px,-8px)"],
          [48, "translate(0px,-8px)"], [88, "translate(0px,0px)"],
          [100, "translate(0px,0px)"]],
      svg: `
        <line class="mo-limb" x1="102" y1="62" x2="138" y2="62"/>
        <circle class="mo-joint" cx="102" cy="62" r="3"/>
        <circle class="mo-joint" cx="138" cy="62" r="3"/>
        <line class="mo-limb" x1="102" y1="62" x2="100" y2="120"/>
        <line class="mo-limb" x1="138" y1="62" x2="140" y2="120"/>
        <circle class="mo-joint" cx="101" cy="91" r="2.4"/>
        <circle class="mo-joint" cx="139" cy="91" r="2.4"/>
        <!-- barre chargée, vue de face : disques de plein fouet -->
        <line class="mo-bar2" x1="84" y1="120" x2="156" y2="120"/>
        <circle class="mo-plate-o" cx="88" cy="120" r="11"/>
        <circle class="mo-hub" cx="88" cy="120" r="2.6"/>
        <circle class="mo-plate-o" cx="152" cy="120" r="11"/>
        <circle class="mo-hub" cx="152" cy="120" r="2.6"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M74 88 L74 58 M69 66 L74 58 L79 66"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M74 58 L74 88 M69 80 L74 88 L79 80"/>` }
  ]
};

/* =========================================================
   65. ROWING PENDLAY  (rowing-pendlay)
   -----------------------------------------------------------
   Position  : buste PARALLÈLE AU SOL, genoux légèrement fléchis,
               barre POSÉE AU SOL sous les épaules, dos plat.
   Matériel  : barre chargée de disques pleins. Les disques
               touchent le sol au départ ET à l'arrivée de chaque
               répétition — c'est ce qui définit l'exercice.
   Mobiles   : coude (flexion) et épaule (extension).
   Fixes     : le BUSTE, à l'horizontale, du début à la fin. « Se
               redresser pendant le tirage » est l'erreur n°1 : le
               tronc est donc dans les éléments fixes, et un tronc
               qui se relèverait dessinerait la faute.
   TROIS CHOSES SÉPARENT CE SCHÉMA DE CELUI DU ROWING BARRE, ET
   LES TROIS SONT DESSINÉES :
     1. L'ANGLE DU BUSTE. 45° au rowing barre, 0° ici. Ce n'est
        pas un détail de posture : à l'horizontale, le bras de
        levier des lombaires est maximal, ce qui rend la position
        beaucoup plus dure à tenir et explique pourquoi la fiche
        cite les lombaires parmi les muscles.
     2. LE DÉPART AU SOL. Au rowing barre la barre reste en l'air,
        bras tendus. Ici elle REPOSE. Le schéma le montre par la
        géométrie : disques de rayon 16 posés sur le sol, axe de
        barre à 16 du sol, et l'épaule exactement à 44 au-dessus —
        une longueur de bras. Rien n'est choisi, tout découle de
        la taille des disques.
     3. LE TEMPO. Concentrique EXPLOSIF (18 % du cycle), retour
        contrôlé (34 %), puis une PAUSE de 40 % barre au sol. Le
        cycle est donc franchement asymétrique, alors que celui du
        rowing barre est presque régulier. « Tirer sans reposer »
        est l'erreur n°3 : le temps mort au sol est l'exercice.
   Sens      : traction explosive vers le bas de la poitrine =
               concentrique ; retour au sol = excentrique ; puis
               arrêt complet.
   ROM       : coude de 180° (bras tendus, barre au sol) à 42°, la
               barre parcourant 36 unités à la verticale. Le coude
               finit 10,8 unités AU-DESSUS de la ligne du dos —
               c'est la marque d'un rowing mené au bout.
   Agonistes : GRAND DORSAL, biceps, deltoïde postérieur. Les
               ÉRECTEURS DU RACHIS travaillent aussi, mais en
               ISOMÉTRIQUE : ils tiennent le buste à l'horizontale
               sans raccourcir. Ils ne sont donc pas animés, comme
               les abdominaux aux pompes — un muscle qui tient
               n'est pas un muscle qui bouge.
   Distinction : ≠ rowing barre (buste à 45°, barre en l'air,
               tempo régulier) ; ≠ rowing T-bar (barre sur pivot) ;
               ≠ soulevé de terre (là la hanche et le genou
               s'étendent ; ici ils ne bougent pas du tout).
   GÉOMÉTRIE (calculée) — épaule (86,90), bras 22, avant-bras 22.
   Trajet de la barre imposé RECTILIGNE de (86,134) à (98,100),
   six intervalles, IK à chacun :
     coude 180,0 -> 121,5 -> 96,8 -> 77,9 -> 62,4 -> 50,0 -> 41,6
     coude (point) de (86,112) à (105.17,79.20)
   -> bras −119,40° ; avant-bras relatif +138,41°.
   ========================================================= */
EXERCISE_MOTIONS["rowing-pendlay"] = {
  vb: "42 74 100 84",
  dur: 3.4,
  phases: { con: [0, 18], ecc: [26, 60] },
  alt: "Buste strictement parallèle au sol, barre posée au sol : la barre est tirée explosivement jusqu'au bas de la poitrine, puis reposée au sol où elle marque un arrêt complet avant la répétition suivante.",
  fixe: `
    <line class="mo-ground" x1="52" y1="150" x2="136" y2="150"/>
    <!-- corps immobile : buste À L'HORIZONTALE, genoux fléchis -->
    <circle class="mo-head" cx="66" cy="90" r="7"/>
    <line class="mo-body" x1="73" y1="90" x2="86" y2="90"/>
    <line class="mo-body" x1="86" y1="90" x2="122" y2="90"/>
    <line class="mo-body" x1="122" y1="90" x2="130" y2="120"/>
    <line class="mo-body" x1="130" y1="120" x2="124" y2="150"/>
    <!-- repère : l'horizontale du buste, qui ne doit pas bouger -->
    <line class="mo-rom" x1="84" y1="82" x2="128" y2="82"/>`,
  muscles: [
    { nom: "Grand dorsal",
      svg: `<ellipse cx="100" cy="84" rx="12" ry="4" transform="rotate(-4 100 84)"/>` }
  ],
  parts: [
    {
      /* BRAS : rotation autour de l'ÉPAULE (86,90). −119,40° emmène le
         coude AU-DESSUS de la ligne du dos et vers les hanches. */
      o: "86px 90px",
      k: [[0, "rotate(0deg)"], [3, "rotate(-32.25deg)"], [6, "rotate(-48.57deg)"],
          [9, "rotate(-63.58deg)"], [12, "rotate(-79.37deg)"], [15, "rotate(-97.56deg)"],
          [18, "rotate(-119.40deg)"], [26, "rotate(-119.40deg)"],
          [31.67, "rotate(-97.56deg)"], [37.33, "rotate(-79.37deg)"], [43, "rotate(-63.58deg)"],
          [48.67, "rotate(-48.57deg)"], [54.33, "rotate(-32.25deg)"], [60, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      muscleNom: "Biceps brachial",
      muscle: `<ellipse cx="82.5" cy="101" rx="3.2" ry="7"/>`,
      svg: `
        <line class="mo-limb" x1="86" y1="90" x2="86" y2="112"/>
        <circle class="mo-joint" cx="86" cy="112" r="2.6"/>`,
      children: [
        {
          /* AVANT-BRAS + BARRE : rotation RELATIVE autour du COUDE.
             +138,41° ferme le coude de 180° à 42°. */
          o: "86px 112px",
          k: [[0, "rotate(0deg)"], [3, "rotate(58.52deg)"], [6, "rotate(83.17deg)"],
              [9, "rotate(102.11deg)"], [12, "rotate(117.63deg)"], [15, "rotate(130.03deg)"],
              [18, "rotate(138.41deg)"], [26, "rotate(138.41deg)"],
              [31.67, "rotate(130.03deg)"], [37.33, "rotate(117.63deg)"], [43, "rotate(102.11deg)"],
              [48.67, "rotate(83.17deg)"], [54.33, "rotate(58.52deg)"], [60, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="86" y1="112" x2="86" y2="134"/>
            <!-- disque plein format : c'est son rayon qui fixe la hauteur
                 de départ de la barre, donc toute la géométrie -->
            <circle class="mo-plate-o" cx="86" cy="134" r="16"/>
            <circle class="mo-hub" cx="86" cy="134" r="2.6"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M50 126 L50 100 M45 108 L50 100 L55 108"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M50 100 L50 126 M45 118 L50 126 L55 118"/>` }
  ]
};

/* =========================================================
   66. RACK PULL (SOULEVÉ PARTIEL)  (rack-pull)
   -----------------------------------------------------------
   Position  : barre POSÉE SUR LES SÉCURITÉS d'un rack, à hauteur
               de genoux ; pieds sous la barre, dos plat, bras
               tendus.
   Matériel  : power rack + barre chargée. Les sécurités sont
               dessinées : sans elles, la barre flotterait.
   Mobiles   : HANCHE (extension), GENOU (extension résiduelle),
               cheville.
   Fixes     : le COUDE, verrouillé — « tirer avec les bras » est
               l'erreur n°3 ; le rachis, segment rigide.
   >>> CE SCHÉMA EST LITTÉRALEMENT LE HAUT DE CELUI DU SOULEVÉ DE
       TERRE, ET C'EST VÉRIFIÉ PAR LE CALCUL <<< Le même sujet, la
       même chaîne, les mêmes longueurs de segments : cheville,
       tibia 25,98, cuisse 25,97, tronc 40,02, bras 54,45. La
       position de départ du rack pull a été obtenue en parcourant
       la trajectoire du soulevé de terre jusqu'au point où la
       BARRE ARRIVE À HAUTEUR DE GENOU. Ce point tombe à t = 0,40.
       Le rack pull est donc les 60 % supérieurs du soulevé de
       terre — pas « à peu près », exactement.
       Contrôle : à t = 0,40 la barre est à y = 119,18 et le genou
       à y = 120,36. Écart 1,2 unité, soit moins de deux
       centimètres. C'est bien la hauteur de genou.
   CE QUE CETTE AMPLITUDE PARTIELLE CHANGE, ET QUI JUSTIFIE
       L'EXERCICE : les 40 % supprimés sont ceux où le genou fait
       le gros du travail. Ce qui reste — hanche de 113,5° à
       178°, genou de 133,7° à 178° seulement — est la portion où
       la charge pend au bout de bras tendus, sur les trapèzes et
       les lombaires. D'où la possibilité de charger beaucoup plus
       lourd, et d'où la liste de muscles de la fiche, qui n'est
       pas celle du soulevé complet.
   Sens      : redressement = concentrique ; retour à la sécurité
               = excentrique.
   ROM       : tibia +7,2° ; genou −42,3° relatif ; hanche +58,5°
               relatif ; bras −20,88° relatif. La barre monte de
               10,4 unités seulement — contre 25,3 au soulevé
               complet.
   Agonistes : TRAPÈZES (c'est eux que l'exercice surcharge),
               érecteurs du rachis, grands fessiers.
               L'« hyper-extension exagérée en haut » est
               l'erreur n°2 : le schéma s'arrête donc à
               l'alignement, hanche à 178°, sans jamais partir en
               arrière.
   Distinction : ≠ soulevé de terre (amplitude complète depuis le
               sol, genou dominant en bas) ; ≠ rowing Pendlay (là
               le buste ne se redresse PAS et c'est le coude qui
               travaille) ; ≠ shrugs (aucune extension de hanche).
   GÉOMÉTRIE (calculée) — départ : cheville (104,146),
   genou (99.83,120.36), hanche (115.48,99.64), épaule (95.84,64.78),
   barre (98.24,119.18), tête (90.21,55.21).
   ========================================================= */
EXERCISE_MOTIONS["rack-pull"] = {
  vb: "62 28 84 128",
  dur: 3.6,
  phases: { con: [0, 34], ecc: [42, 88] },
  alt: "Barre posée sur les sécurités d'un rack à hauteur de genoux : redressement complet des hanches et des genoux, bras tendus, puis retour contrôlé sur les sécurités.",
  fixe: `
    <line class="mo-ground" x1="66" y1="150" x2="142" y2="150"/>
    <line class="mo-body" x1="96" y1="150" x2="116" y2="150"/>
    <!-- POWER RACK : deux montants et la sécurité qui porte la barre.
         Sans elle, la barre serait en l'air sans rien pour la tenir. -->
    <line class="mo-gear" x1="70" y1="30" x2="70" y2="150"/>
    <line class="mo-gear" x1="136" y1="30" x2="136" y2="150"/>
    <line class="mo-bar3" x1="70" y1="121.5" x2="136" y2="121.5"/>`,
  parts: [
    {
      /* TIBIA : enraciné à la CHEVILLE (104,146). +7,2° seulement — le
         genou est DÉJÀ à 134° au départ, contre 112° au soulevé complet.
         C'est toute la différence : le bas du mouvement a été supprimé. */
      o: "104px 146px",
      k: [[0, "rotate(0deg)"], [34, "rotate(7.2deg)"], [42, "rotate(7.2deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-body" x1="104" y1="146" x2="99.83" y2="120.36"/>
        <circle class="mo-joint" cx="99.83" cy="120.36" r="2.6"/>`,
      children: [
        {
          /* CUISSE : extension du GENOU. −42,3° le mène de 134° à 178°. */
          o: "99.83px 120.36px",
          k: [[0, "rotate(0deg)"], [34, "rotate(-42.3deg)"], [42, "rotate(-42.3deg)"],
              [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Fessiers",
          muscle: `<circle cx="112" cy="102" r="4.4"/>`,
          svg: `
            <line class="mo-body" x1="99.83" y1="120.36" x2="115.48" y2="99.64"/>
            <circle class="mo-joint" cx="115.48" cy="99.64" r="2.6"/>`,
          children: [
            {
              /* TRONC : extension de la HANCHE, +58,5°, de 113,5° à 178°.
                 Le schéma s'arrête à l'alignement : pas d'hyper-extension. */
              o: "115.48px 99.64px",
              k: [[0, "rotate(0deg)"], [34, "rotate(58.5deg)"], [42, "rotate(58.5deg)"],
                  [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: ["Trapèzes", "Lombaires"],
              muscle: `<ellipse cx="98" cy="68" rx="7" ry="3.4" transform="rotate(29 98 68)"/>
                       <ellipse cx="106" cy="82" rx="2.8" ry="11" transform="rotate(29 106 82)"/>`,
              childrenFirst: true,
              svg: `
                <line class="mo-body" x1="115.48" y1="99.64" x2="95.84" y2="64.78"/>
                <circle class="mo-head" cx="90.21" cy="55.21" r="9"/>`,
              children: [
                {
                  /* BRAS + BARRE : suspendus à l'ÉPAULE. Coude VERROUILLÉ,
                     donc un seul segment rigide. */
                  o: "95.84px 64.78px",
                  k: [[0, "rotate(0deg)"], [34, "rotate(-20.88deg)"], [42, "rotate(-20.88deg)"],
                      [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
                  svg: `
                    <line class="mo-limb" x1="95.84" y1="64.78" x2="98.24" y2="119.18"/>
                    <circle class="mo-plate-o" cx="98.24" cy="119.18" r="12"/>
                    <circle class="mo-hub" cx="98.24" cy="119.18" r="2.8"/>`
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M124 92 L124 62 M119 70 L124 62 L129 70"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M124 62 L124 92 M119 84 L124 92 L129 84"/>` }
  ]
};

/* =========================================================
   67. TRACTIONS LESTÉES  (tractions-lestees)
   -----------------------------------------------------------
   Position  : SUSPENDU à une barre fixe, prise PRONATION large,
               une CEINTURE DE LEST à la taille et un disque
               pendu au bout d'une chaîne entre les jambes.
               Genoux fléchis et chevilles croisées — ce n'est pas
               un détail de style : jambes tendues, le disque
               toucherait le sol.
   Matériel  : barre fixe + ceinture de lest. Les MAINS sont le
               point fixe (chaîne fermée).
   Mobiles   : coude, épaule.
   Fixes     : les mains sur la barre ; le rachis gainé.
   >>> CE QUE CE SCHÉMA NE PRÉTEND PAS ÊTRE <<< Le mouvement
       articulaire est CELUI DE LA TRACTION PRONATION, et le
       schéma ne fait pas semblant du contraire : coude de 172° à
       48,6°, corps qui monte de 38,1. Prétendre à une cinématique
       différente serait faux. Ce qui change tient en trois
       choses, et ce sont elles que le schéma montre.
     1. LE LEST, et sa contrainte : disque de 38 unités de
        diamètre suspendu à 14 de chaîne sous une ceinture placée
        à la hanche. Avec les jambes tendues il descendrait sous
        le sol. Les genoux fléchis et les chevilles croisées ne
        sont donc pas décoratifs, ils sont IMPOSÉS par la
        géométrie du lest.
     2. LA CHAÎNE D'APLOMB, qui est un détecteur de balancement.
        Une chaîne est un pendule : elle ne reste verticale que si
        rien ne pousse le corps horizontalement. Ici la chaîne des
        segments — avant-bras +1,47°, bras −122,44°, corps
        +120,97° — a une somme EXACTEMENT NULLE : le corps ne
        tourne pas d'un degré, donc la chaîne reste d'aplomb.
        « Balancement » est l'erreur n°2, et la construction même
        du schéma l'interdit.
     3. LE TEMPO. Excentrique deux fois plus long que le
        concentrique (56 % du cycle contre 28 %) : « descente en
        chute libre » est l'erreur n°3, et avec du lest c'est
        elle qui casse en premier.
   POURQUOI LE COUDE NE SE FERME QU'À 48,6° : ce n'est pas un
               manque d'amplitude, c'est une contrainte de la
               prise LARGE. La main est 18 unités plus loin de
               l'axe que l'épaule, écart qui ne peut pas
               disparaître. Or épaule-main = 2×22×sin(coude/2) :
               dès que cette distance atteint 18, le coude ne
               peut plus se fermer davantage. À 48,6° elle vaut
               18,10 — on est à la butée géométrique, et le
               menton passe la barre de 2,1 unités. « Amplitude
               sacrifiée » est l'erreur n°1 : le schéma va donc
               jusqu'à cette butée et pas moins.
   Agonistes : grand dorsal, biceps. Le GAINAGE travaille aussi
               mais en isométrique : il tient, il ne raccourcit
               pas, donc il n'est pas animé.
   Distinction : ≠ traction pronation (aucun lest, tempo régulier,
               jambes libres) ; ≠ traction supination (prise
               serrée neutre, plan sagittal, vue de profil).
   GÉOMÉTRIE (calculée) — main (88,20) FIXE, avant-bras 22,
   bras 22, épaule (106,60) -> (106,21.9).
     bas  coude (95.42,40.71)   haut coude (94.90,40.90)
     menton de y=56 à y=17,9, pour une barre à y=20.
   ========================================================= */
EXERCISE_MOTIONS["tractions-lestees"] = {
  vb: "44 -6 152 174",
  dur: 4.6,
  phases: { con: [0, 28], ecc: [36, 92] },
  alt: "Suspendu en pronation large avec un disque pendu à une ceinture entre les jambes fléchies : le corps monte jusqu'au menton au-dessus de la barre, la chaîne du lest restant strictement verticale, puis redescend deux fois plus lentement.",
  fixe: `
    <line class="mo-bar3" x1="48" y1="20" x2="192" y2="20"/>
    <line class="mo-gear" x1="54" y1="20" x2="54" y2="164"/>
    <line class="mo-gear" x1="186" y1="20" x2="186" y2="164"/>
    <line class="mo-ground" x1="46" y1="164" x2="194" y2="164"/>
    <!-- repère : hauteur du menton au départ. L'écart jusqu'à la barre
         EST l'amplitude à parcourir, et rien de moins. -->
    <line class="mo-rom" x1="142" y1="56" x2="158" y2="56"/>`,
  parts: [
    {
      /* AVANT-BRAS GAUCHE : enraciné à la MAIN (88,20). +1,47° : la main
         ne quitte jamais la barre. */
      o: "88px 20px",
      k: [[0, "rotate(0deg)"], [28, "rotate(1.47deg)"], [36, "rotate(1.47deg)"],
          [92, "rotate(0deg)"], [100, "rotate(0deg)"]],
      childrenFirst: true,
      svg: `
        <circle class="mo-hand" cx="88" cy="20" r="3.6"/>
        <line class="mo-limb" x1="88" y1="20" x2="95.42" y2="40.71"/>
        <circle class="mo-joint" cx="95.42" cy="40.71" r="2.5"/>`,
      children: [
        {
          /* BRAS GAUCHE : flexion du COUDE, −122,44°, jusqu'à la BUTÉE
             géométrique de la prise large. */
          o: "95.42px 40.71px",
          k: [[0, "rotate(0deg)"], [28, "rotate(-122.44deg)"], [36, "rotate(-122.44deg)"],
              [92, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Biceps brachial",
          muscle: `<ellipse cx="101" cy="50" rx="3.2" ry="6.5" transform="rotate(29 101 50)"/>`,
          svg: `<line class="mo-limb" x1="95.42" y1="40.71" x2="106" y2="60"/>`,
          children: [
            {
              /* CORPS + CEINTURE + LEST : contre-rotation de +120,97°.
                 Somme des trois rotations = 0,00° : le corps ne tourne
                 pas, donc la chaîne du lest reste D'APLOMB. */
              o: "106px 60px",
              k: [[0, "rotate(0deg)"], [28, "rotate(120.97deg)"], [36, "rotate(120.97deg)"],
                  [92, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: "Grand dorsal",
              muscle: `<ellipse cx="112" cy="76" rx="3.8" ry="11" transform="rotate(-9 112 76)"/>
                       <ellipse cx="128" cy="76" rx="3.8" ry="11" transform="rotate(9 128 76)"/>`,
              svg: `
                <circle class="mo-head" cx="120" cy="46" r="10"/>
                <line class="mo-body" x1="106" y1="60" x2="134" y2="60"/>
                <line class="mo-body" x1="120" y1="58" x2="120" y2="102"/>
                <!-- jambes fléchies, chevilles croisées : imposé par le lest -->
                <line class="mo-body" x1="120" y1="102" x2="104" y2="132"/>
                <line class="mo-body" x1="104" y1="132" x2="128" y2="152"/>
                <line class="mo-body" x1="120" y1="102" x2="136" y2="132"/>
                <line class="mo-body" x1="136" y1="132" x2="112" y2="152"/>
                <!-- ceinture, chaîne d'aplomb et disque vu par la tranche -->
                <line class="mo-bar3" x1="110" y1="100" x2="130" y2="100"/>
                <line class="mo-cable" x1="120" y1="102" x2="120" y2="116"/>
                <rect class="mo-mass" x="117.5" y="116" width="5" height="38" rx="2"/>`
            }
          ]
        }
      ]
    },
    {
      /* AVANT-BRAS DROIT : miroir exact, enraciné à la main (152,20). */
      o: "152px 20px",
      k: [[0, "rotate(0deg)"], [28, "rotate(-1.47deg)"], [36, "rotate(-1.47deg)"],
          [92, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <circle class="mo-hand" cx="152" cy="20" r="3.6"/>
        <line class="mo-limb" x1="152" y1="20" x2="144.58" y2="40.71"/>
        <circle class="mo-joint" cx="144.58" cy="40.71" r="2.5"/>`,
      children: [
        {
          o: "144.58px 40.71px",
          k: [[0, "rotate(0deg)"], [28, "rotate(122.44deg)"], [36, "rotate(122.44deg)"],
              [92, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscle: `<ellipse cx="139" cy="50" rx="3.2" ry="6.5" transform="rotate(-29 139 50)"/>`,
          svg: `<line class="mo-limb" x1="144.58" y1="40.71" x2="134" y2="60"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M170 78 L170 40 M165 48 L170 40 L175 48"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M170 40 L170 78 M165 70 L170 78 L175 70"/>` }
  ]
};

/* =========================================================
   68. DÉVELOPPÉ ARNOLD  (developpe-arnold)
   >>> SCHÉMA NON LIVRÉ — SIGNALÉ, PAS BÂCLÉ <<<
   -----------------------------------------------------------
   ANALYSE (faite, et valide) :
   Position  : ASSIS dossier vertical, haltères DEVANT les
               épaules et presque jointes, paumes tournées VERS
               SOI, coudes bas et rentrés.
   Mobiles   : épaule (flexion + abduction + ROTATION EXTERNE de
               l'humérus), coude.
   Sens      : poussée verticale avec rotation progressive des
               paumes vers l'avant ; retour en inversant.
   ROM       : coude d'environ 50° à 146° ; l'humérus passe de
               rotation INTERNE à rotation EXTERNE.
   Agonistes : les trois faisceaux du deltoïde — et c'est
               justement la rotation qui les enchaîne : antérieur
               au départ, moyen en fin de course.

   POURQUOI AUCUN SCHÉMA N'EST LIVRÉ :
   le blocage n'est pas l'analyse, il est de PROJECTION, et il est
   MESURÉ.
   Ce qui définit cet exercice est une rotation de l'humérus
   AUTOUR DE SON PROPRE AXE. Or un axe de rotation confondu avec
   le segment lui-même ne produit AUCUN déplacement visible de ce
   segment, dans aucune projection orthographique. Ce n'est pas un
   défaut du moteur : c'est une propriété de la projection.
   Ce que cette rotation déplace, en revanche, c'est l'AVANT-BRAS,
   qui balaie l'espace autour de l'humérus. Et là le calcul montre
   le piège. En vue de FACE, avec bras 20 et avant-bras 22 :
     départ  : avant-bras à −130,03° de l'humérus  (coude 49,97°)
     verrouillage : avant-bras à +33,87°           (coude 146,13°)
   Le signe CHANGE. Passer de −130° à +34° dans le plan du dessin
   impose de passer par 0°, c'est-à-dire par un bras DESSINÉ
   PARFAITEMENT TENDU, alors que le coude réel reste autour de
   90° à cet instant. Le schéma montrerait donc une extension
   complète du coude qui n'a pas lieu : 90° d'erreur au milieu du
   mouvement. Dans la réalité ce croisement se fait EN
   PROFONDEUR, l'avant-bras contournant le corps ; en projection
   plane il ne peut que traverser.
   Les autres vues ne sauvent rien :
   • de PROFIL, au départ l'avant-bras est en travers de la
     poitrine, donc dirigé vers l'observateur : longueur projetée
     réduite à environ 30 % ;
   • de DESSUS, au verrouillage le bras pointe vers l'observateur :
     longueur projetée réduite à environ 9 %.
   Et surtout : une vue de face qui ÉVITERAIT l'artefact — en
   gardant les bras dans le plan frontal du début à la fin —
   donnerait exactement le développé haltères assis déjà livré
   (schéma 15). Elle effacerait la seule chose qui fait
   d'un Arnold un Arnold. Ce serait le cas le plus trompeur de
   tous : un schéma juste en apparence, qui montre un autre
   exercice.
   Décision : pas de schéma dédié. L'exercice retombe sur le
   pictogramme générique, explicitement étiqueté comme tel.
   Piste pour plus tard : il faudrait deux choses que le moteur
   n'a pas — un segment dont la longueur PROJETÉE varie (le
   raccourci), et une manière de figurer une rotation axiale, par
   exemple l'orientation de la paume. Les deux sortent d'un
   moteur de rotations planes à segments rigides.
   ========================================================= */

/* =========================================================
   69. ÉLÉVATIONS FRONTALES  (elevations-frontales)
   -----------------------------------------------------------
   Position  : DEBOUT, haltère devant la cuisse, bras le long du
               corps, buste droit et gainé.
   Matériel  : un haltère par main, PRISE NEUTRE. La fiche laisse
               le choix entre pronation et neutre ; c'est la prise
               neutre qui est dessinée, et pour une raison de
               lisibilité assumée : en pronation l'axe de
               l'haltère est perpendiculaire au plan sagittal,
               donc vu par le bout — un simple disque, dont
               l'orientation ne dit plus rien. En prise neutre
               l'axe reste DANS le plan du dessin, et l'haltère
               tourne visiblement avec l'avant-bras. La résistance
               est la GRAVITÉ.
   Mobile    : l'ÉPAULE seule, en FLEXION.
   Fixes     : le COUDE, bloqué à 170° — bloc rigide ; le buste,
               car « balancer le buste » est l'erreur n°1 ; les
               jambes.
   Plan      : SAGITTAL. Vue de profil, donc, et un seul bras
               dessiné : de profil le bras éloigné est
               exactement derrière le bras proche.
   Sens      : montée = concentrique ; descente lente = excentrique.
   ROM       : 85°, de 5° d'extension (haltère devant la cuisse) à
               90° de flexion — L'HORIZONTALE, et pas un degré de
               plus. Un repère pointillé matérialise cette limite.
   >>> POURQUOI S'ARRÊTER À L'HORIZONTALE, ET POURQUOI C'EST
       GÉOMÉTRIQUE <<< « Monter au-dessus des yeux » est l'erreur
       n°2. La raison n'est pas une convention : avec un haltère,
       le couple résistant vaut poids × distance HORIZONTALE
       entre l'épaule et la main. Cette distance est maximale
       quand le bras est horizontal — 57,78 ici — et elle
       DIMINUE au-delà. Monter plus haut n'ajoute donc aucune
       charge au deltoïde ; ça transfère seulement le travail au
       trapèze. Le schéma s'arrête exactement là où le couple
       est maximal.
   >>> CE QUI LE SÉPARE DE L'ÉCARTÉ POULIE BASSE (schéma 58) <<<
       Les deux montent le bras vers l'avant, de profil, coude
       bloqué. Mais le PROFIL DE RÉSISTANCE est inversé, et c'est
       tout l'écart entre les deux exercices.
       Haltère : couple NUL en bas (bras vertical, distance
       horizontale nulle), MAXIMAL à l'horizontale. Le début du
       mouvement ne pèse rien.
       Poulie basse : le câble tire toujours vers la poulie, donc
       la tension existe dès le premier degré et ne s'annule
       jamais. D'où une amplitude de 120° au lieu de 85, et une
       fin de course à hauteur de visage au lieu de l'épaule.
   Agonistes : DELTOÏDE ANTÉRIEUR. Le faisceau CLAVICULAIRE du
               grand pectoral est fléchisseur d'épaule lui aussi
               et participe franchement : il est dessiné, plutôt
               que de laisser croire à un muscle unique.
   Distinction : ≠ élévations latérales (plan frontal, deltoïde
               moyen) ; ≠ écarté poulie basse (tension continue,
               amplitude plus grande) ; ≠ développé (le coude s'y
               ferme).
   GÉOMÉTRIE (calculée) — épaule (120,54), bras 32, avant-bras 26,
   coude bloqué à 170° -> épaule-main constante 57,78.
   Proportions vérifiées : bras entier 58 pour un tronc de 50.
   C'est ce rapport qui fait tomber l'haltère devant la CUISSE au
   départ, et non à la ceinture.
     bas  main (114.96,111.56)  coude (119.74,86.00)
     haut main ( 62.22, 54.00)
   -> bloc bras, rotation +85° autour de l'épaule.
   ========================================================= */
EXERCISE_MOTIONS["elevations-frontales"] = {
  vb: "50 26 90 136",
  dur: 3.4,
  phases: { con: [0, 30], ecc: [38, 88] },
  alt: "Debout de profil, haltère en prise neutre devant la cuisse et coude bloqué : le bras monte vers l'avant jusqu'à l'horizontale exactement, puis redescend lentement.",
  fixe: `
    <line class="mo-ground" x1="54" y1="156" x2="136" y2="156"/>
    <!-- corps debout de profil, face à gauche, immobile -->
    <circle class="mo-head" cx="114" cy="38" r="9"/>
    <line class="mo-body" x1="117" y1="46" x2="120" y2="54"/>
    <line class="mo-body" x1="120" y1="54" x2="124" y2="104"/>
    <line class="mo-body" x1="124" y1="104" x2="122" y2="130"/>
    <line class="mo-body" x1="122" y1="130" x2="118" y2="156"/>
    <!-- LIMITE : l'horizontale de l'épaule. Le mouvement s'arrête là. -->
    <line class="mo-rom" x1="56" y1="54" x2="104" y2="54"/>
    <!-- amplitude : l'arc réellement parcouru par l'haltère -->
    <path class="mo-rom" fill="none" d="M114.96 111.56 A57.78 57.78 0 0 1 62.22 54"/>`,
  muscles: [
    { nom: "Deltoïde antérieur",
      svg: `<circle cx="116" cy="54" r="5"/>` },
    { nom: "Pectoral claviculaire",
      svg: `<ellipse cx="119" cy="66" rx="4" ry="7" transform="rotate(6 119 66)"/>` }
  ],
  parts: [
    {
      /* BLOC BRAS : coude figé à 170°, rotation +85° autour de l'ÉPAULE
         (120,54). Aucun enfant : plier le coude ferait de cet exercice
         autre chose. */
      o: "120px 54px",
      k: [[0, "rotate(0deg)"], [30, "rotate(85deg)"], [38, "rotate(85deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="120" y1="54" x2="119.74" y2="86"/>
        <circle class="mo-joint" cx="119.74" cy="86" r="2.6"/>
        <line class="mo-limb" x1="119.74" y1="86" x2="114.96" y2="111.56"/>
        <!-- haltère, perpendiculaire à l'avant-bras -->
        <line class="mo-bar2" x1="107.10" y1="110.09" x2="122.82" y2="113.03"/>
        <rect class="mo-mass" x="103.4" y="105.2" width="6" height="13" rx="2" transform="rotate(10.6 106.4 111.7)"/>
        <rect class="mo-mass" x="120.5" y="108.4" width="6" height="13" rx="2" transform="rotate(10.6 123.5 114.9)"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M78 126 L78 102 M73 110 L78 102 L83 110"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M78 102 L78 126 M73 118 L78 126 L83 118"/>` }
  ]
};

/* =========================================================
   70. ÉLÉVATIONS LATÉRALES À LA POULIE
       (elevations-laterales-poulie)
   -----------------------------------------------------------
   Position  : DEBOUT à CÔTÉ d'une poulie basse, la poignée
               saisie de la main OPPOSÉE — le câble traverse donc
               le corps en diagonale. Buste droit, épaule basse.
   Matériel  : poulie basse, poignée simple. UNILATÉRAL.
   Mobile    : l'ÉPAULE seule, en abduction.
   Fixes     : le COUDE, bloqué à 161° ; le buste, car « buste
               penché » est l'erreur n°3 ; le bras libre.
   Vue de FACE : l'abduction vit dans le plan FRONTAL, un profil
               ne montrerait aucun déplacement.
   ROM       : 102°, de 12° d'ADDUCTION (main devant la cuisse
               opposée) à 90° d'abduction. C'est 28° de plus que
               la version haltères, et ce n'est pas un choix : la
               main vient chercher la poignée de l'autre côté du
               corps, donc le mouvement part de plus bas.
   >>> CE QUE LA POULIE CHANGE, CHIFFRÉ <<< La fiche dit que la
       poulie « garde la tension même en bas ». Le calcul le
       confirme et le mesure. Bras de levier de la résistance
       autour de l'épaule, au fil du mouvement :
         t      0    1/6    2/6    3/6    4/6    5/6      1
         câble 38,9  46,7   48,3   45,9   40,8   33,7   25,3
         halt. 10,1   4,2   18,1   30,4   40,1   46,3   48,4
       Deux lectures.
       1. EN BAS, là où l'haltère ne pèse presque rien — 4,2 quand
          la main passe à l'aplomb de l'épaule — le câble tire
          encore à 46,7. ONZE FOIS plus. C'est exactement la
          phrase de la fiche, en chiffres.
       2. Le câble est aussi bien plus CONSTANT : de 25,3 à 48,3,
          rapport 1,9. L'haltère va de 4,2 à 48,4, rapport 11,5.
          L'un charge tout le trajet, l'autre presque uniquement
          la fin.
       Contrepartie honnête : en HAUT c'est l'haltère qui charge
       le plus (48,4 contre 25,3). Les deux versions ne sont donc
       pas redondantes, elles chargent des portions différentes du
       même mouvement.
   Agonistes : DELTOÏDE MOYEN. Le sus-épineux initie les 15
               premiers degrés d'abduction, mais il est profond et
               court : le dessiner voudrait dire le placer au
               jugé, il est donc mentionné et non tracé.
   Sens      : montée = concentrique ; descente en résistant au
               câble = excentrique, plus lente.
   Distinction : ≠ élévations latérales haltères (bilatéral,
               amplitude 74°, tension nulle en bas) ; ≠ élévations
               frontales (plan sagittal) ; ≠ rowing menton (le
               coude s'y ferme).
   GÉOMÉTRIE (calculée) — épaule gauche (104,62), bras 25,
   avant-bras 24, coude bloqué -> épaule-main constante 48,37.
     bas  main (114.06,109.31)  coude (105.31,86.97)
     haut main ( 55.63, 62.00)
   -> bloc bras, rotation +102° autour de l'épaule.
   Câble : poulie (186,142), rotation NON monotone (0 -> −5,1 ->
   +7,1) et allongement ×1,9357, échantillonnés en six intervalles.
   ========================================================= */
EXERCISE_MOTIONS["elevations-laterales-poulie"] = {
  vb: "44 26 152 130",
  dur: 3.8,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Debout de face à côté d'une poulie basse, la poignée tenue de la main opposée : le bras monte sur le côté depuis devant la cuisse opposée jusqu'à l'horizontale, puis redescend en résistant au câble.",
  fixe: `
    <line class="mo-ground" x1="60" y1="150" x2="194" y2="150"/>
    <!-- colonne et poulie BASSE, à droite du pratiquant -->
    <line class="mo-gear" x1="190" y1="26" x2="190" y2="150"/>
    <circle class="mo-pulley" cx="186" cy="142" r="5"/>
    <!-- corps de face, immobile -->
    <circle class="mo-head" cx="120" cy="42" r="10"/>
    <line class="mo-body" x1="104" y1="62" x2="136" y2="62"/>
    <line class="mo-body" x1="120" y1="52" x2="120" y2="108"/>
    <line class="mo-body" x1="120" y1="108" x2="110" y2="150"/>
    <line class="mo-body" x1="120" y1="108" x2="130" y2="150"/>
    <!-- bras libre, immobile -->
    <line class="mo-body" x1="136" y1="62" x2="140" y2="86"/>
    <line class="mo-body" x1="140" y1="86" x2="139" y2="110"/>
    <!-- LIMITE : la ligne des épaules, à ne pas dépasser -->
    <line class="mo-rom" x1="48" y1="62" x2="96" y2="62"/>`,
  muscles: [
    { nom: "Deltoïde moyen",
      svg: `<circle cx="104" cy="62" r="5.5"/>` }
  ],
  parts: [
    {
      /* CÂBLE : rotation non monotone + allongement autour de la POULIE,
         échantillonnés sur l'arc réel de la poignée. */
      o: "186px 142px",
      k: [[0, "rotate(0deg) scale(1)"], [5.33, "rotate(-4.18deg) scale(1.1630)"],
          [10.67, "rotate(-5.09deg) scale(1.3428)"], [16, "rotate(-3.77deg) scale(1.5208)"],
          [21.33, "rotate(-0.99deg) scale(1.6842)"], [26.67, "rotate(2.75deg) scale(1.8245)"],
          [32, "rotate(7.10deg) scale(1.9357)"], [40, "rotate(7.10deg) scale(1.9357)"],
          [48, "rotate(2.75deg) scale(1.8245)"], [56, "rotate(-0.99deg) scale(1.6842)"],
          [64, "rotate(-3.77deg) scale(1.5208)"], [72, "rotate(-5.09deg) scale(1.3428)"],
          [80, "rotate(-4.18deg) scale(1.1630)"], [88, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="186" y1="142" x2="114.06" y2="109.31"/>`
    },
    {
      /* BLOC BRAS : coude figé, rotation +102° autour de l'ÉPAULE (104,62).
         Même grille de keyframes que le câble. */
      o: "104px 62px",
      k: [[0, "rotate(0deg)"], [5.33, "rotate(17deg)"], [10.67, "rotate(34deg)"],
          [16, "rotate(51deg)"], [21.33, "rotate(68deg)"], [26.67, "rotate(85deg)"],
          [32, "rotate(102deg)"], [40, "rotate(102deg)"],
          [48, "rotate(85deg)"], [56, "rotate(68deg)"], [64, "rotate(51deg)"],
          [72, "rotate(34deg)"], [80, "rotate(17deg)"], [88, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="104" y1="62" x2="105.31" y2="86.97"/>
        <circle class="mo-joint" cx="105.31" cy="86.97" r="2.4"/>
        <line class="mo-limb" x1="105.31" y1="86.97" x2="114.06" y2="109.31"/>
        <line class="mo-bar2" x1="109.41" y1="111.13" x2="118.71" y2="107.49"/>
        <circle class="mo-hand" cx="114.06" cy="109.31" r="3"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M52 120 L52 92 M47 100 L52 92 L57 100"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M52 92 L52 120 M47 112 L52 120 L57 112"/>` }
  ]
};

/* =========================================================
   71. ROWING MENTON PRISE LARGE  (rowing-menton)
   -----------------------------------------------------------
   Position  : DEBOUT, barre devant les cuisses, prise PRONATION
               LARGE — mains 48 unités d'écart pour des épaules
               de 32, soit une fois et demie la largeur d'épaules.
   Matériel  : barre chargée.
   Mobiles   : ÉPAULE (abduction) et COUDE (flexion).
   Fixes     : le buste et les jambes.
   Plan      : FRONTAL — les coudes partent sur les CÔTÉS. Vue de
               face, donc ; de profil le mouvement serait
               invisible.
   Sens      : montée de la barre le long du corps = concentrique ;
               descente contrôlée = excentrique.
   ROM       : coude de 163° à 36° ; la barre monte de 34,83 à la
               VERTICALE, du haut des cuisses au BAS DE LA
               POITRINE — et pas jusqu'au menton.
   >>> POURQUOI LA PRISE LARGE ARRÊTE LA BARRE PLUS BAS, ET
       POURQUOI C'EST UN AVANTAGE <<< Les mains sont écartées de
       48, donc chaque main est 8 unités PLUS À L'EXTÉRIEUR que
       son épaule, et cet écart ne peut pas changer : la barre est
       rigide. Or au fil de la montée, la distance épaule-main
       tombe de 48,46 à 15,24. Quand cette distance approche
       l'écart latéral de 8, le bras ne peut plus monter sans que
       l'épaule parte en rotation interne — c'est la position qui
       pince l'épaule. En s'arrêtant à 15,24, le schéma s'arrête
       AVANT cette zone. Une prise serrée, elle, annulerait
       l'écart latéral et laisserait la barre monter jusqu'au
       menton — au prix exact de cette rotation interne.
       Le nom de l'exercice dit « menton » ; la prise large dit
       « poitrine ». Le schéma suit la prise, pas le nom.
   Agonistes : DELTOÏDE MOYEN et TRAPÈZE SUPÉRIEUR. C'est le
               coude HAUT qui les met en jeu : à l'arrivée le
               coude est à 59,66, soit 4,3 unités AU-DESSUS de la
               ligne d'épaules.
   Distinction : ≠ élévations latérales (coude verrouillé, aucune
               flexion) ; ≠ shrugs (aucune abduction, l'omoplate
               translate seule) ; ≠ tirage vertical (le corps est
               debout et c'est la barre qui monte, pas l'inverse).
   GÉOMÉTRIE (calculée) — épaule gauche (104,64), bras 25,
   avant-bras 24. Trajet de la barre imposé STRICTEMENT VERTICAL
   (x = 96 constant), six intervalles, IK à chacun :
     coude 163,0 -> 121,5 -> 98,3 -> 79,7 -> 63,6 -> 49,2 -> 36,2
     coude (point) de (96.36,87.80) à (79.38,59.66)
   -> bras +82,20° ; avant-bras relatif −126,88° ; barre en
      TRANSLATION verticale pure de −34,83.
   Sans cet échantillonnage, l'interpolation linéaire des deux
   rotations faisait dériver la main de 4,6 unités vers
   l'extérieur à mi-course — la barre étant rigide, c'est
   impossible.
   ========================================================= */
EXERCISE_MOTIONS["rowing-menton"] = {
  vb: "46 30 134 132",
  dur: 3.4,
  phases: { con: [0, 30], ecc: [38, 88] },
  alt: "Debout de face, barre en prise large devant les cuisses : la barre monte à la verticale le long du corps jusqu'au bas de la poitrine, coudes hauts et écartés, puis redescend.",
  fixe: `
    <line class="mo-ground" x1="96" y1="156" x2="150" y2="156"/>
    <!-- corps de face, immobile -->
    <circle class="mo-head" cx="120" cy="44" r="10"/>
    <line class="mo-body" x1="104" y1="64" x2="136" y2="64"/>
    <line class="mo-body" x1="120" y1="54" x2="120" y2="110"/>
    <line class="mo-body" x1="120" y1="110" x2="110" y2="156"/>
    <line class="mo-body" x1="120" y1="110" x2="130" y2="156"/>
    <!-- LIMITE de la prise large : bas de la poitrine, pas le menton -->
    <line class="mo-rom" x1="100" y1="77" x2="140" y2="77"/>`,
  muscles: [
    { nom: "Deltoïde moyen",
      svg: `<circle cx="104" cy="64" r="5.5"/><circle cx="136" cy="64" r="5.5"/>` },
    { nom: "Trapèze supérieur",
      svg: `<ellipse cx="112" cy="56" rx="7" ry="3.4" transform="rotate(-40 112 56)"/>
            <ellipse cx="128" cy="56" rx="7" ry="3.4" transform="rotate(40 128 56)"/>` }
  ],
  parts: [
    {
      /* BARRE : TRANSLATION verticale pure. Elle est rigide, donc elle ne
         tourne pas et l'écartement des mains ne change jamais. */
      k: [[0, "translate(0px,0px)"], [5, "translate(0px,-5.80px)"], [10, "translate(0px,-11.61px)"],
          [15, "translate(0px,-17.42px)"], [20, "translate(0px,-23.22px)"], [25, "translate(0px,-29.02px)"],
          [30, "translate(0px,-34.83px)"], [38, "translate(0px,-34.83px)"],
          [46.33, "translate(0px,-29.02px)"], [54.67, "translate(0px,-23.22px)"],
          [63, "translate(0px,-17.42px)"], [71.33, "translate(0px,-11.61px)"],
          [79.67, "translate(0px,-5.80px)"], [88, "translate(0px,0px)"],
          [100, "translate(0px,0px)"]],
      svg: `
        <line class="mo-bar2" x1="66" y1="111.8" x2="174" y2="111.8"/>
        <circle class="mo-plate-o" cx="80" cy="111.8" r="13"/>
        <circle class="mo-hub" cx="80" cy="111.8" r="2.6"/>
        <circle class="mo-plate-o" cx="160" cy="111.8" r="13"/>
        <circle class="mo-hub" cx="160" cy="111.8" r="2.6"/>`
    },
    {
      /* BRAS GAUCHE : abduction autour de l'ÉPAULE (104,64), +82,20°.
         Le coude finit AU-DESSUS de la ligne d'épaules. */
      o: "104px 64px",
      k: [[0, "rotate(0deg)"], [5, "rotate(21.59deg)"], [10, "rotate(34.51deg)"],
          [15, "rotate(45.68deg)"], [20, "rotate(56.52deg)"], [25, "rotate(68.13deg)"],
          [30, "rotate(82.20deg)"], [38, "rotate(82.20deg)"],
          [46.33, "rotate(68.13deg)"], [54.67, "rotate(56.52deg)"], [63, "rotate(45.68deg)"],
          [71.33, "rotate(34.51deg)"], [79.67, "rotate(21.59deg)"], [88, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="104" y1="64" x2="96.36" y2="87.80"/>
        <circle class="mo-joint" cx="96.36" cy="87.80" r="2.6"/>`,
      children: [
        {
          o: "96.36px 87.80px",
          k: [[0, "rotate(0deg)"], [5, "rotate(-41.57deg)"], [10, "rotate(-64.77deg)"],
              [15, "rotate(-83.31deg)"], [20, "rotate(-99.41deg)"], [25, "rotate(-113.87deg)"],
              [30, "rotate(-126.88deg)"], [38, "rotate(-126.88deg)"],
              [46.33, "rotate(-113.87deg)"], [54.67, "rotate(-99.41deg)"], [63, "rotate(-83.31deg)"],
              [71.33, "rotate(-64.77deg)"], [79.67, "rotate(-41.57deg)"], [88, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="96.36" y1="87.80" x2="96" y2="111.8"/>
            <circle class="mo-hand" cx="96" cy="111.8" r="3.2"/>`
        }
      ]
    },
    {
      /* BRAS DROIT : miroir exact autour de x=120. */
      o: "136px 64px",
      k: [[0, "rotate(0deg)"], [5, "rotate(-21.59deg)"], [10, "rotate(-34.51deg)"],
          [15, "rotate(-45.68deg)"], [20, "rotate(-56.52deg)"], [25, "rotate(-68.13deg)"],
          [30, "rotate(-82.20deg)"], [38, "rotate(-82.20deg)"],
          [46.33, "rotate(-68.13deg)"], [54.67, "rotate(-56.52deg)"], [63, "rotate(-45.68deg)"],
          [71.33, "rotate(-34.51deg)"], [79.67, "rotate(-21.59deg)"], [88, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="136" y1="64" x2="143.64" y2="87.80"/>
        <circle class="mo-joint" cx="143.64" cy="87.80" r="2.6"/>`,
      children: [
        {
          o: "143.64px 87.80px",
          k: [[0, "rotate(0deg)"], [5, "rotate(41.57deg)"], [10, "rotate(64.77deg)"],
              [15, "rotate(83.31deg)"], [20, "rotate(99.41deg)"], [25, "rotate(113.87deg)"],
              [30, "rotate(126.88deg)"], [38, "rotate(126.88deg)"],
              [46.33, "rotate(113.87deg)"], [54.67, "rotate(99.41deg)"], [63, "rotate(83.31deg)"],
              [71.33, "rotate(64.77deg)"], [79.67, "rotate(41.57deg)"], [88, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="143.64" y1="87.80" x2="144" y2="111.8"/>
            <circle class="mo-hand" cx="144" cy="111.8" r="3.2"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M56 110 L56 80 M51 88 L56 80 L61 88"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M56 80 L56 110 M51 102 L56 110 L61 102"/>` }
  ]
};

/* =========================================================
   72. DÉVELOPPÉ ÉPAULES À LA MACHINE
       (developpe-epaules-machine)
   -----------------------------------------------------------
   Position  : ASSIS dos plaqué au dossier, poignées à hauteur
               d'OREILLES, coudes bas et écartés, avant-bras
               verticaux.
   Matériel  : machine à développé vertical, trajectoire
               RECTILIGNE imposée. Deux rails guident les
               poignées ; c'est cela, « guidé ».
   Mobiles   : ÉPAULE et COUDE.
   Fixes     : le bassin et le dos, plaqués au dossier —
               « cambrure excessive » est l'erreur n°3.
   Vue de FACE : la poussée et l'écartement des coudes vivent
               dans le plan frontal.
   ROM       : coude de 80° à 165°. La poignée monte de 26,39 à la
               VERTICALE. « Descente trop courte » est l'erreur
               n°2 : le schéma redescend donc jusqu'à la hauteur
               d'oreilles exactement, bornée par un repère
               pointillé.
   >>> CE QUE LE RÉGLAGE DU SIÈGE DÉCIDE <<< « Siège trop bas »
       est l'erreur n°1, et ce n'est pas un détail de confort :
       la hauteur du siège fixe le POINT BAS de l'amplitude,
       puisque la poignée, elle, est sur un rail. Siège trop bas,
       la poignée démarre au-dessus des oreilles et toute la
       portion basse — celle où le deltoïde est le plus étiré —
       disparaît. Le repère pointillé du schéma est donc à
       hauteur d'oreilles, et c'est le siège qui le respecte ou
       non.
   >>> CE QUI LE SÉPARE DU DÉVELOPPÉ HALTÈRES (schéma 15) <<<
       Les mains. Aux haltères elles CONVERGENT : de x=76 à
       x=108, soit 32 unités de rapprochement, parce que rien ne
       les relie et que la trajectoire naturelle de l'épaule les
       ramène vers l'axe. Ici la poignée est sur un rail
       VERTICAL : l'écartement ne change pas d'une unité. Zéro
       contre 32. C'est toute la différence entre une charge
       libre et une charge guidée, et elle est visible sans rien
       lire.
       Précision honnête : il existe aussi des machines à bras
       CONVERGENTS, qui reproduisent le rapprochement des
       haltères. Le schéma dessine la version à rails
       rectilignes, la plus répandue, et le dit.
   Agonistes : DELTOÏDE antérieur et moyen, TRICEPS.
   Distinction : ≠ développé haltères assis (charge libre, mains
               convergentes, stabilisateurs sollicités) ;
               ≠ développé militaire (debout, gainage) ;
               ≠ élévations latérales (le coude ne s'y ferme pas).
   GÉOMÉTRIE (calculée) — épaule gauche (104,70), bras 30,
   avant-bras 27. Trajet de la poignée imposé STRICTEMENT VERTICAL
   (x = 74,46 constant), de y=48,21 à y=21,82, six intervalles,
   IK à chacun :
     coude 80,0 -> 87,5 -> 96,3 -> 106,8 -> 119,4 -> 135,8 -> 165,0
     coude (point) de (74.46,75.21) à (85.28,46.56)
   -> bras +61,39° ; avant-bras relatif −85,03° ; poignée en
      TRANSLATION verticale pure de −26,39.
   ========================================================= */
EXERCISE_MOTIONS["developpe-epaules-machine"] = {
  vb: "52 12 138 156",
  dur: 3.6,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Vu de face, assis dos au dossier dans une machine à développé : les poignées montent à la verticale depuis la hauteur des oreilles jusqu'aux bras presque tendus, sans se rapprocher, puis redescendent.",
  fixe: `
    <line class="mo-ground" x1="54" y1="160" x2="188" y2="160"/>
    <!-- bâti de la machine -->
    <line class="mo-gear" x1="58" y1="16" x2="58" y2="160"/>
    <line class="mo-gear" x1="182" y1="16" x2="182" y2="160"/>
    <line class="mo-gear" x1="58" y1="16" x2="182" y2="16"/>
    <!-- RAILS : la trajectoire imposée, verticale et parallèle -->
    <line class="mo-gear" x1="74.46" y1="18" x2="74.46" y2="56"/>
    <line class="mo-gear" x1="165.54" y1="18" x2="165.54" y2="56"/>
    <!-- siège et dossier -->
    <rect class="mo-gear" x="108" y="62" width="24" height="62" rx="4"/>
    <line class="mo-pad" x1="100" y1="124" x2="140" y2="124"/>
    <line class="mo-gear" x1="120" y1="124" x2="120" y2="160"/>
    <!-- corps assis de face, dos plaqué -->
    <circle class="mo-head" cx="120" cy="50" r="10"/>
    <line class="mo-body" x1="104" y1="70" x2="136" y2="70"/>
    <line class="mo-body" x1="120" y1="60" x2="120" y2="116"/>
    <line class="mo-body" x1="120" y1="116" x2="112" y2="160"/>
    <line class="mo-body" x1="120" y1="116" x2="128" y2="160"/>
    <!-- REPÈRE : hauteur d'oreilles, le point bas que le réglage du
         siège respecte ou non -->
    <line class="mo-rom" x1="86" y1="48.21" x2="100" y2="48.21"/>
    <line class="mo-rom" x1="140" y1="48.21" x2="154" y2="48.21"/>`,
  muscles: [
    { nom: "Deltoïde antérieur et moyen",
      svg: `<circle cx="104" cy="70" r="5.5"/><circle cx="136" cy="70" r="5.5"/>` }
  ],
  parts: [
    {
      /* POIGNÉES : TRANSLATION verticale pure. Sur rail, donc jamais de
         rapprochement — c'est le point qui les sépare des haltères. */
      k: [[0, "translate(0px,0px)"], [5.33, "translate(0px,-4.40px)"], [10.67, "translate(0px,-8.80px)"],
          [16, "translate(0px,-13.20px)"], [21.33, "translate(0px,-17.59px)"], [26.67, "translate(0px,-21.99px)"],
          [32, "translate(0px,-26.39px)"], [40, "translate(0px,-26.39px)"],
          [48, "translate(0px,-21.99px)"], [56, "translate(0px,-17.59px)"],
          [64, "translate(0px,-13.20px)"], [72, "translate(0px,-8.80px)"],
          [80, "translate(0px,-4.40px)"], [88, "translate(0px,0px)"],
          [100, "translate(0px,0px)"]],
      svg: `
        <line class="mo-bar2" x1="66" y1="48.21" x2="83" y2="48.21"/>
        <line class="mo-bar2" x1="157" y1="48.21" x2="174" y2="48.21"/>`
    },
    {
      /* BRAS GAUCHE : rotation autour de l'ÉPAULE (104,70), +61,39°. */
      o: "104px 70px",
      k: [[0, "rotate(0deg)"], [5.33, "rotate(8.46deg)"], [10.67, "rotate(16.87deg)"],
          [16, "rotate(25.45deg)"], [21.33, "rotate(34.58deg)"], [26.67, "rotate(45.09deg)"],
          [32, "rotate(61.39deg)"], [40, "rotate(61.39deg)"],
          [48, "rotate(45.09deg)"], [56, "rotate(34.58deg)"], [64, "rotate(25.45deg)"],
          [72, "rotate(16.87deg)"], [80, "rotate(8.46deg)"], [88, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      muscleNom: "Triceps brachial",
      muscle: `<ellipse cx="90" cy="76" rx="7" ry="3.2" transform="rotate(10 90 76)"/>`,
      svg: `
        <line class="mo-limb" x1="104" y1="70" x2="74.46" y2="75.21"/>
        <circle class="mo-joint" cx="74.46" cy="75.21" r="2.6"/>`,
      children: [
        {
          o: "74.46px 75.21px",
          k: [[0, "rotate(0deg)"], [5.33, "rotate(-7.51deg)"], [10.67, "rotate(-16.36deg)"],
              [16, "rotate(-26.79deg)"], [21.33, "rotate(-39.39deg)"], [26.67, "rotate(-55.76deg)"],
              [32, "rotate(-85.03deg)"], [40, "rotate(-85.03deg)"],
              [48, "rotate(-55.76deg)"], [56, "rotate(-39.39deg)"], [64, "rotate(-26.79deg)"],
              [72, "rotate(-16.36deg)"], [80, "rotate(-7.51deg)"], [88, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="74.46" y1="75.21" x2="74.46" y2="48.21"/>
            <circle class="mo-hand" cx="74.46" cy="48.21" r="3.2"/>`
        }
      ]
    },
    {
      /* BRAS DROIT : miroir exact autour de x=120. */
      o: "136px 70px",
      k: [[0, "rotate(0deg)"], [5.33, "rotate(-8.46deg)"], [10.67, "rotate(-16.87deg)"],
          [16, "rotate(-25.45deg)"], [21.33, "rotate(-34.58deg)"], [26.67, "rotate(-45.09deg)"],
          [32, "rotate(-61.39deg)"], [40, "rotate(-61.39deg)"],
          [48, "rotate(-45.09deg)"], [56, "rotate(-34.58deg)"], [64, "rotate(-25.45deg)"],
          [72, "rotate(-16.87deg)"], [80, "rotate(-8.46deg)"], [88, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      muscle: `<ellipse cx="150" cy="76" rx="7" ry="3.2" transform="rotate(-10 150 76)"/>`,
      svg: `
        <line class="mo-limb" x1="136" y1="70" x2="165.54" y2="75.21"/>
        <circle class="mo-joint" cx="165.54" cy="75.21" r="2.6"/>`,
      children: [
        {
          o: "165.54px 75.21px",
          k: [[0, "rotate(0deg)"], [5.33, "rotate(7.51deg)"], [10.67, "rotate(16.36deg)"],
              [16, "rotate(26.79deg)"], [21.33, "rotate(39.39deg)"], [26.67, "rotate(55.76deg)"],
              [32, "rotate(85.03deg)"], [40, "rotate(85.03deg)"],
              [48, "rotate(55.76deg)"], [56, "rotate(39.39deg)"], [64, "rotate(26.79deg)"],
              [72, "rotate(16.36deg)"], [80, "rotate(7.51deg)"], [88, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="165.54" y1="75.21" x2="165.54" y2="48.21"/>
            <circle class="mo-hand" cx="165.54" cy="48.21" r="3.2"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M94 118 L94 92 M89 100 L94 92 L99 100"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M94 92 L94 118 M89 110 L94 118 L99 110"/>` }
  ]
};

/* =========================================================
   73. PEC-DECK INVERSÉ (REVERSE FLY)  (pec-deck-inverse)
   -----------------------------------------------------------
   Position  : ASSIS FACE au dossier, poitrine plaquée contre le
               support, poignées saisies devant soi à hauteur
               d'épaules, coudes bloqués à 160°.
   Matériel  : pec-deck utilisé à l'envers. Les bras de machine
               pivotent sur des axes VERTICAUX confondus avec les
               épaules.
   Mobile    : l'ÉPAULE seule, en ABDUCTION HORIZONTALE.
   Fixes     : le COUDE — « plier les coudes » est l'erreur n°1,
               bras et avant-bras forment donc un BLOC RIGIDE ;
               et le BUSTE, que la poitrinière empêche de reculer
               (erreur n°2).
   >>> VU DE DESSUS, ET CETTE FOIS C'EST POSSIBLE <<< L'oiseau
       aux haltères (exercice 16) n'a PAS reçu de schéma, et la
       raison était de projection : buste penché à l'horizontale,
       les bras s'écartent vers l'observateur de profil, et de
       face c'est le tronc qui devient illisible. Ici la machine
       supprime le problème à la racine : elle assoit le
       pratiquant BUSTE VERTICAL. L'abduction horizontale se fait
       alors dans le plan TRANSVERSE, et une vue de dessus la
       montre entière, à la vraie longueur des bras, avec un
       tronc de vraie taille. Même muscle, même geste — mais
       cette fois une vue existe.
       C'est aussi ce qui rend ce schéma le symétrique exact de
       celui du pec-deck (schéma 54) : même vue, même machine,
       même axe confondu avec l'épaule, sens inverse.
   Sens      : OUVERTURE des bras vers l'arrière = concentrique ;
               retour contrôlé, sans laisser les charges claquer
               = excentrique.
   ROM       : 105° d'abduction horizontale, des mains jointes
               devant la poitrine jusqu'aux bras écartés 5 unités
               EN ARRIÈRE de la ligne d'épaules. « Amplitude
               courte » est l'erreur n°3 : le schéma va donc
               jusqu'à dépasser la ligne d'épaules, ce qui est la
               définition d'une ouverture complète.
   Agonistes : DELTOÏDE POSTÉRIEUR et RHOMBOÏDES. Le trapèze
               moyen participe, mais son territoire de dessus se
               confond avec celui des rhomboïdes : il est
               mentionné et non tracé à part.
   Distinction : ≠ pec-deck (sens inverse, pectoral) ; ≠ face pull
               (le coude s'y ferme, traction vers le visage) ;
               ≠ rowing (le coude s'y ferme aussi).
   GÉOMÉTRIE (calculée) — axe/épaule gauche (93,70), bras 24,
   avant-bras 24, coude bloqué à 160° -> épaule-main constante
   47,30.
     fermé  main (100.12,23.22)  coude (92.51,45.99)
     ouvert main ( 46.00,75.22)
   -> bloc rigide, rotation −105° autour de l'axe.
   ========================================================= */
EXERCISE_MOTIONS["pec-deck-inverse"] = {
  vb: "36 14 148 102",
  dur: 3.8,
  vue: "Vu de dessus",
  phases: { con: [0, 38], ecc: [46, 88] },
  alt: "Vu de dessus. Assis poitrine plaquée contre le support, bras tendus devant soi : les bras s'ouvrent vers l'arrière en écartant les mains, jusqu'à dépasser la ligne des épaules, puis reviennent en contrôlant.",
  fixe: `
    <!-- bâti : rails latéraux -->
    <line class="mo-gear" x1="40" y1="22" x2="40" y2="100"/>
    <line class="mo-gear" x1="180" y1="22" x2="180" y2="100"/>
    <line class="mo-gear" x1="40" y1="100" x2="180" y2="100"/>
    <!-- POITRINIÈRE : elle interdit au buste de reculer -->
    <line class="mo-pad" x1="98" y1="58" x2="122" y2="58"/>
    <!-- siège -->
    <line class="mo-pad" x1="96" y1="96" x2="124" y2="96"/>
    <!-- corps assis vu de dessus, face au dossier -->
    <ellipse class="mo-torse" cx="110" cy="72" rx="17" ry="11"/>
    <circle class="mo-head mo-head-solid" cx="110" cy="46" r="9"/>
    <!-- AXES de la machine, confondus avec les épaules -->
    <circle class="mo-pulley" cx="93" cy="70" r="4.5"/>
    <circle class="mo-pulley" cx="127" cy="70" r="4.5"/>
    <!-- repère : la ligne des épaules, que l'ouverture doit dépasser -->
    <line class="mo-rom" x1="44" y1="70" x2="86" y2="70"/>
    <line class="mo-rom" x1="134" y1="70" x2="176" y2="70"/>`,
  muscles: [
    { nom: "Deltoïde postérieur",
      svg: `<circle cx="95" cy="77" r="4.5"/><circle cx="125" cy="77" r="4.5"/>` },
    { nom: "Rhomboïdes",
      svg: `<ellipse cx="104" cy="79" rx="4" ry="5"/><ellipse cx="116" cy="79" rx="4" ry="5"/>` }
  ],
  parts: [
    {
      /* BRAS GAUCHE + POIGNÉE : bloc RIGIDE tournant autour de l'axe
         épaule/machine (93,70). −105° d'abduction horizontale. */
      o: "93px 70px",
      k: [[0, "rotate(0deg)"], [38, "rotate(-105deg)"], [46, "rotate(-105deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="93" y1="70" x2="92.51" y2="45.99"/>
        <circle class="mo-joint" cx="92.51" cy="45.99" r="2.6"/>
        <line class="mo-limb" x1="92.51" y1="45.99" x2="100.12" y2="23.22"/>
        <line class="mo-bar2" x1="94.43" y1="21.32" x2="105.81" y2="25.12"/>
        <circle class="mo-hand" cx="100.12" cy="23.22" r="3"/>`
    },
    {
      /* BRAS DROIT : miroir exact autour de x=110. */
      o: "127px 70px",
      k: [[0, "rotate(0deg)"], [38, "rotate(105deg)"], [46, "rotate(105deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="127" y1="70" x2="127.49" y2="45.99"/>
        <circle class="mo-joint" cx="127.49" cy="45.99" r="2.6"/>
        <line class="mo-limb" x1="127.49" y1="45.99" x2="119.88" y2="23.22"/>
        <line class="mo-bar2" x1="125.57" y1="21.32" x2="114.19" y2="25.12"/>
        <circle class="mo-hand" cx="119.88" cy="23.22" r="3"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M96 108 L70 108 M77 103 L70 108 L77 113 M124 108 L150 108 M143 103 L150 108 L143 113"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M70 108 L96 108 M89 103 L96 108 L89 113 M150 108 L124 108 M131 103 L124 108 L131 113"/>` }
  ]
};

/* =========================================================
   74. POMPES EN ÉQUILIBRE (HANDSTAND PUSH-UP)
       (handstand-pushup)
   -----------------------------------------------------------
   Position  : EN ÉQUILIBRE SUR LES MAINS, poitrine côté mur,
               mains largeur d'épaules au sol, corps gainé et
               quasi vertical — 11° d'inclinaison, les orteils en
               appui léger contre le mur.
   Matériel  : le sol et un mur. Les MAINS sont le point fixe :
               chaîne fermée, c'est le CORPS qui descend.
   Mobiles   : coude et épaule.
   Fixes     : les mains au sol ; le rachis, la hanche et le
               genou — « cambrure excessive » est l'erreur n°1,
               donc le corps est un segment rigide.
   >>> POURQUOI POITRINE CÔTÉ MUR, ET PAS DOS AU MUR <<< Ce n'est
       pas indifférent, et c'est la géométrie qui tranche. Au
       point bas, le coude se retrouve 17,18 unités EN ARRIÈRE de
       la ligne des mains. Dos au mur, le mur est justement de ce
       côté-là : les coudes le heurteraient, et il faudrait les
       écarter LATÉRALEMENT — un déplacement qui, de profil,
       serait strictement invisible et ferait paraître le bras
       plus court. Poitrine côté mur, les coudes partent du côté
       libre : le mouvement reste entier dans le plan du dessin.
       Le choix de la variante découle donc de ce que la vue peut
       montrer honnêtement.
   Sens      : descente de la tête vers le sol = excentrique ;
               poussée = concentrique.
   ROM       : coude de 180° à 75°. Le corps descend de 17
               unités ; la tête arrive à 3 unités du sol —
               « descente incontrôlée sur la tête » est l'erreur
               n°2, le schéma s'arrête donc AVANT le contact.
   LE CORPS NE TOURNE PAS D'UN DEGRÉ, ET C'EST STRUCTUREL : la
               somme des trois rotations de la chaîne vaut
               exactement zéro — avant-bras +59,23°, bras
               −104,98°, corps +45,75°. Le gainage n'est donc pas
               une consigne écrite à côté du dessin, il est dans
               la construction : le corps garde ses 11°
               d'inclinaison du début à la fin.
   Agonistes : DELTOÏDES et TRICEPS ; trapèzes et gainage en
               isométrique, donc non animés.
   Distinction : ≠ développé militaire (debout, c'est la BARRE qui
               monte vers un corps fixe ; ici c'est l'inverse) ;
               ≠ pompes pike (hanche pliée à 90°, corps en V) ;
               ≠ pompes (corps horizontal, charge partielle).
   GÉOMÉTRIE (calculée) — main (100,150) FIXE, avant-bras 20,
   bras 24.
     haut  coude (100,130)        épaule (100,106)
     bas   coude (117.18,139.77)  épaule (100,123.03)
   Corps incliné de 11° : épaule (100,106), hanche (91.1,60.9),
   genou (85.7,33.4), pied (80.7,7.9) contre le mur en x=80.
   ========================================================= */
EXERCISE_MOTIONS["handstand-pushup"] = {
  vb: "74 0 52 156",
  dur: 3.6,
  phases: { ecc: [0, 44], con: [52, 84] },
  alt: "En équilibre sur les mains, poitrine côté mur et corps gainé : les coudes fléchissent et le corps entier descend jusqu'à ce que la tête frôle le sol, puis repousse jusqu'aux bras tendus.",
  fixe: `
    <line class="mo-ground" x1="76" y1="150" x2="140" y2="150"/>
    <!-- MUR : c'est lui qui stabilise l'équilibre -->
    <line class="mo-gear" x1="80" y1="4" x2="80" y2="150"/>`,
  parts: [
    {
      /* AVANT-BRAS : enraciné à la MAIN (100,150), qui ne quitte pas le
         sol. +59,23° : le coude part vers l'arrière, côté libre. */
      o: "100px 150px",
      k: [[0, "rotate(0deg)"], [44, "rotate(59.23deg)"], [52, "rotate(59.23deg)"],
          [84, "rotate(0deg)"], [100, "rotate(0deg)"]],
      childrenFirst: true,
      svg: `
        <circle class="mo-hand" cx="100" cy="150" r="3.6"/>
        <line class="mo-limb" x1="100" y1="150" x2="100" y2="130"/>
        <circle class="mo-joint" cx="100" cy="130" r="2.6"/>`,
      children: [
        {
          /* BRAS : flexion du COUDE autour de (100,130). −104,98° le ferme
             de 180° à 75°. */
          o: "100px 130px",
          k: [[0, "rotate(0deg)"], [44, "rotate(-104.98deg)"], [52, "rotate(-104.98deg)"],
              [84, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Triceps brachial",
          muscle: `<ellipse cx="103.5" cy="118" rx="3.2" ry="7"/>`,
          svg: `<line class="mo-limb" x1="100" y1="130" x2="100" y2="106"/>`,
          children: [
            {
              /* CORPS : contre-rotation de +45,75°. Somme des trois
                 rotations = 0,00° : le corps garde EXACTEMENT ses 11°
                 d'inclinaison, il ne se cambre pas. */
              o: "100px 106px",
              k: [[0, "rotate(0deg)"], [44, "rotate(45.75deg)"], [52, "rotate(45.75deg)"],
                  [84, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: "Deltoïdes",
              muscle: `<circle cx="96.5" cy="103" r="5"/>`,
              svg: `
                <circle class="mo-head" cx="90" cy="121" r="9"/>
                <line class="mo-body" x1="94" y1="114" x2="100" y2="106"/>
                <line class="mo-body" x1="100" y1="106" x2="91.1" y2="60.9"/>
                <line class="mo-body" x1="91.1" y1="60.9" x2="85.7" y2="33.4"/>
                <line class="mo-body" x1="85.7" y1="33.4" x2="80.7" y2="7.9"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M112 64 L112 96 M107 88 L112 96 L117 88"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M112 96 L112 64 M107 72 L112 64 L117 72"/>` }
  ]
};

/* =========================================================
   75. CURL HALTÈRES ALTERNÉ AVEC SUPINATION
       (curl-halteres-alterne)
   -----------------------------------------------------------
   Position  : DEBOUT, un haltère dans chaque main le long du
               corps, PAUMES VERS LES CUISSES (prise neutre),
               coudes collés au buste.
   Mobiles   : le COUDE, et la RADIO-ULNAIRE (supination).
   Fixes     : le BRAS, collé au flanc — s'il partait vers
               l'avant ce serait un début d'élévation ; le buste,
               les jambes.
   >>> DEUX CHOSES DISTINGUENT CET EXERCICE, ET LES DEUX SONT
       ANIMÉES <<<
   1. L'ALTERNANCE. Ce n'est pas un détail de confort : pendant
      qu'un bras monte, l'autre DESCEND. Les deux avant-bras ont
      donc la même grille d'instants-clés mais des valeurs en
      opposition de phase — au départ du cycle, le bras proche
      est en bas et le bras éloigné est en haut. C'est ce que
      « alterné » veut dire, et une seule image ne peut pas le
      montrer.
   2. LA SUPINATION, et ici — contrairement au développé Arnold
      (exercice 68, non livré) — elle EST projetable, pour une
      raison précise. À l'Arnold, la rotation portait sur
      l'HUMÉRUS, segment dont l'axe est confondu avec lui-même :
      aucune projection ne peut la montrer. Ici la rotation porte
      sur l'AVANT-BRAS, mais ce qu'on regarde n'est pas
      l'avant-bras : c'est l'HALTÈRE, qui lui est
      PERPENDICULAIRE. Un objet perpendiculaire à l'axe de
      rotation change bel et bien d'orientation, et de profil sa
      longueur projetée passe de sa longueur vraie à presque
      rien.
      Prise NEUTRE : l'axe de l'haltère est dans le plan
      sagittal, on le voit en entier. Prise SUPINÉE : l'axe est
      perpendiculaire au plan sagittal, on le voit par le bout.
      Le schéma applique donc à l'haltère une homothétie sur son
      SEUL AXE — scaleX de 1 à 0,25 — appliquée dans le repère de
      l'avant-bras, donc bien le long de la barre quelle que soit
      sa position. C'est la projection exacte de la supination.
      Ce qui reste approximatif, et qui est dit : l'épaisseur
      apparente du manche est maintenue constante (trait à
      épaisseur non mise à l'échelle), alors qu'un vrai haltère
      montrerait la face de ses disques en fin de rotation.
   Sens      : montée = concentrique ; descente lente =
               excentrique. Les repères de sens et le muscle
               suivent le bras PROCHE ; le bras éloigné est en
               opposition de phase, c'est le principe même.
   ROM       : coude de 167,6° à 45°, soit 122,56° de flexion.
   Agonistes : BICEPS BRACHIAL et BRACHIAL ANTÉRIEUR. Le biceps
               est fléchisseur ET supinateur : c'est pour cela que
               tourner la paume pendant la montée le sollicite
               davantage qu'un curl à prise fixe — il fait ses
               deux métiers en même temps.
   Distinction : ≠ curl barre (les deux bras ensemble, prise
               supinée d'emblée, aucune rotation) ; ≠ curl marteau
               (prise neutre du début à la fin, donc haltère
               jamais tourné) ; ≠ curl pupitre (bras posé sur un
               pupitre incliné).
   GÉOMÉTRIE (calculée) — épaule (120,54), bras 32,06 FIXE,
   avant-bras 26. Coude proche (122,86), coude éloigné (130,86).
     bas  main (118,111.7)      haut main (102.49,68.81)
   -> avant-bras +122,56° autour du coude ; haltère scaleX 1
      -> 0,25 autour de la main, sur la même grille.
   ========================================================= */
EXERCISE_MOTIONS["curl-halteres-alterne"] = {
  vb: "96 26 52 136",
  dur: 4.2,
  phases: { con: [0, 40], ecc: [50, 90] },
  alt: "Debout de profil, un haltère dans chaque main : un bras monte en tournant la paume vers le ciel pendant que l'autre redescend, puis les rôles s'inversent.",
  fixe: `
    <line class="mo-ground" x1="100" y1="156" x2="142" y2="156"/>
    <!-- corps debout de profil, face à gauche, immobile -->
    <circle class="mo-head" cx="114" cy="38" r="9"/>
    <line class="mo-body" x1="117" y1="46" x2="120" y2="54"/>
    <line class="mo-body" x1="120" y1="54" x2="124" y2="104"/>
    <line class="mo-body" x1="124" y1="104" x2="122" y2="130"/>
    <line class="mo-body" x1="122" y1="130" x2="118" y2="156"/>
    <!-- BRAS : dans les fixes, collés au flanc. Deux, décalés en
         profondeur pour que l'alternance se lise. -->
    <line class="mo-limb" x1="120" y1="54" x2="122" y2="86"/>
    <circle class="mo-joint" cx="122" cy="86" r="2.8"/>
    <line class="mo-body" x1="122" y1="55" x2="130" y2="86"/>
    <circle class="mo-joint" cx="130" cy="86" r="2.6"/>`,
  muscles: [
    { nom: "Biceps brachial",
      svg: `<ellipse cx="117.5" cy="68" rx="3.4" ry="9" transform="rotate(4 117.5 68)"/>` },
    { nom: "Brachial antérieur",
      svg: `<ellipse cx="118.5" cy="80" rx="2.8" ry="6" transform="rotate(4 118.5 80)"/>` }
  ],
  parts: [
    {
      /* AVANT-BRAS PROCHE : rotation autour du COUDE (122,86), +122,56°.
         Grille partagée avec le bras éloigné, valeurs en opposition. */
      o: "122px 86px",
      k: [[0, "rotate(0deg)"], [10, "rotate(30.64deg)"], [20, "rotate(61.28deg)"],
          [30, "rotate(91.92deg)"], [40, "rotate(122.56deg)"], [50, "rotate(122.56deg)"],
          [60, "rotate(91.92deg)"], [70, "rotate(61.28deg)"], [80, "rotate(30.64deg)"],
          [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="122" y1="86" x2="118" y2="111.7"/>`,
      children: [
        {
          /* HALTÈRE PROCHE : homothétie sur son SEUL AXE, dans le repère de
             l'avant-bras. C'est la supination, en projection exacte. */
          o: "118px 111.7px",
          k: [[0, "scaleX(1)"], [10, "scaleX(0.8125)"], [20, "scaleX(0.625)"],
              [30, "scaleX(0.4375)"], [40, "scaleX(0.25)"], [50, "scaleX(0.25)"],
              [60, "scaleX(0.4375)"], [70, "scaleX(0.625)"], [80, "scaleX(0.8125)"],
              [90, "scaleX(1)"], [100, "scaleX(1)"]],
          svg: `
            <line class="mo-bar2" vector-effect="non-scaling-stroke" x1="109" y1="111.7" x2="127" y2="111.7"/>
            <circle class="mo-hand" cx="118" cy="111.7" r="2.8"/>`
        }
      ]
    },
    {
      /* AVANT-BRAS ÉLOIGNÉ : même grille, valeurs en OPPOSITION DE PHASE.
         Au départ du cycle il est en haut pendant que l'autre est en bas. */
      o: "130px 86px",
      k: [[0, "rotate(122.56deg)"], [10, "rotate(91.92deg)"], [20, "rotate(61.28deg)"],
          [30, "rotate(30.64deg)"], [40, "rotate(0deg)"], [50, "rotate(0deg)"],
          [60, "rotate(30.64deg)"], [70, "rotate(61.28deg)"], [80, "rotate(91.92deg)"],
          [90, "rotate(122.56deg)"], [100, "rotate(122.56deg)"]],
      svg: `
        <line class="mo-body" x1="130" y1="86" x2="126" y2="111.7"/>`,
      children: [
        {
          o: "126px 111.7px",
          k: [[0, "scaleX(0.25)"], [10, "scaleX(0.4375)"], [20, "scaleX(0.625)"],
              [30, "scaleX(0.8125)"], [40, "scaleX(1)"], [50, "scaleX(1)"],
              [60, "scaleX(0.8125)"], [70, "scaleX(0.625)"], [80, "scaleX(0.4375)"],
              [90, "scaleX(0.25)"], [100, "scaleX(0.25)"]],
          svg: `
            <line class="mo-bar3" vector-effect="non-scaling-stroke" x1="117" y1="111.7" x2="135" y2="111.7"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M138 104 L138 74 M133 82 L138 74 L143 82"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M138 74 L138 104 M133 96 L138 104 L143 96"/>` }
  ]
};

/* =========================================================
   76. CURL CONCENTRATION  (curl-concentration)
   -----------------------------------------------------------
   Position  : ASSIS au bord d'un banc, jambes écartées, buste
               penché de 50°, l'ARRIÈRE DU COUDE calé contre
               l'intérieur de la cuisse. Un seul haltère.
   Mobile    : le COUDE, et lui seul.
   Fixes     : le BRAS — non pas par consigne mais parce que la
               cuisse le bloque physiquement. « Décoller le coude
               de la cuisse » est l'erreur n°1 ; ici le coude est
               dessiné SUR la ligne de la cuisse, et le bras est
               dans les éléments fixes.
   >>> L'INCLINAISON DU BUSTE N'EST PAS UN CHOIX, ELLE EST
       IMPOSÉE <<< C'est le point que le calcul révèle. Le bras
       mesure 32,3. Buste VERTICAL, l'épaule serait en (134,68)
       et le point de cuisse le plus proche à 42 : le coude ne
       pourrait tout simplement PAS atteindre la cuisse, il
       manquerait 10 unités. Il faut donc se pencher, et se
       pencher beaucoup. À 50° d'inclinaison l'épaule descend en
       (101.8,83) et le coude tombe exactement sur la cuisse en
       (110,114.2), à 32,3 de l'épaule. La posture caractéristique
       de cet exercice — buste très penché — est donc une
       CONSÉQUENCE de la longueur du bras, pas une figure de
       style.
   Sens      : montée = concentrique ; descente TRÈS lente =
               excentrique, d'où un excentrique une fois et demie
               plus long que le concentrique dans le cycle.
   ROM       : coude de 156,4° à 40°, soit 116,4° de flexion, la
               main décrivant un arc de rayon 26 autour du coude.
               « Amplitude réduite » est l'erreur n°3 : le schéma
               part donc de l'extension quasi complète.
   BRAS DE LEVIER, ET CE QU'IL DIT DU « PIC DE CONTRACTION » : le
               couple résistant vaut poids × distance HORIZONTALE
               coude-main. Elle vaut 4 au départ, atteint son
               MAXIMUM de 26 quand l'avant-bras passe à
               l'horizontale — à 70 % de l'amplitude — puis
               redescend à 21,2 en haut. Le pic n'est donc PAS au
               sommet du mouvement, contrairement à ce que la
               sensation suggère ; il est aux trois quarts de la
               montée. C'est là qu'il faut ralentir, pas en haut.
   Agonistes : BICEPS BRACHIAL et BRACHIAL ANTÉRIEUR. Le bras
               étant immobile, ils sont dans les éléments fixes :
               ils se contractent sans se déplacer.
   Distinction : ≠ curl pupitre (bras posé sur un pupitre, les
               DEUX bras) ; ≠ curl haltères alterné (debout, bras
               libre, alternance) ; ≠ curl spider (à plat ventre,
               bras pendant à la verticale).
   GÉOMÉTRIE (calculée) — épaule (101.8,83), bras 32,3 FIXE,
   coude (110,114.2) posé sur la cuisse, avant-bras 26.
     bas  main (106,139.9)   haut main (88.76,99.20)
   -> avant-bras +116,4° autour du coude.
   ========================================================= */
EXERCISE_MOTIONS["curl-concentration"] = {
  vb: "72 54 90 110",
  dur: 4,
  phases: { con: [0, 32], ecc: [40, 90] },
  alt: "Assis buste très penché, l'arrière du coude calé contre l'intérieur de la cuisse : l'haltère monte vers l'épaule par la seule flexion du coude, puis redescend très lentement jusqu'à l'extension complète.",
  fixe: `
    <line class="mo-ground" x1="76" y1="158" x2="158" y2="158"/>
    <!-- banc -->
    <line class="mo-pad" x1="112" y1="116" x2="152" y2="116"/>
    <line class="mo-gear" x1="118" y1="120" x2="118" y2="158"/>
    <line class="mo-gear" x1="146" y1="120" x2="146" y2="158"/>
    <!-- corps assis, buste penché de 50° -->
    <circle class="mo-head" cx="89" cy="70" r="9"/>
    <line class="mo-body" x1="95" y1="76" x2="101.8" y2="83"/>
    <line class="mo-body" x1="101.8" y1="83" x2="134" y2="110"/>
    <line class="mo-body" x1="134" y1="110" x2="100" y2="116"/>
    <line class="mo-body" x1="100" y1="116" x2="94" y2="150"/>
    <line class="mo-body" x1="94" y1="150" x2="86" y2="158"/>
    <!-- bras libre, en appui sur l'autre cuisse -->
    <line class="mo-body" x1="104" y1="86" x2="122" y2="110"/>
    <!-- BRAS DE TRAVAIL : fixe, car la cuisse bloque le coude -->
    <line class="mo-limb" x1="101.8" y1="83" x2="110" y2="114.2"/>
    <circle class="mo-joint" cx="110" cy="114.2" r="3"/>
    <!-- amplitude : l'arc réellement parcouru par l'haltère -->
    <path class="mo-rom" fill="none" d="M106 139.9 A26 26 0 0 1 88.76 99.2"/>`,
  muscles: [
    { nom: "Biceps brachial",
      svg: `<ellipse cx="103" cy="96" rx="3.4" ry="9" transform="rotate(-15 103 96)"/>` },
    { nom: "Brachial antérieur",
      svg: `<ellipse cx="106" cy="108" rx="2.8" ry="6" transform="rotate(-15 106 108)"/>` }
  ],
  parts: [
    {
      /* AVANT-BRAS + HALTÈRE : rotation autour du COUDE (110,114.2),
         +116,4°. Aucun autre segment ne bouge : c'est tout l'intérêt de
         caler le coude. */
      o: "110px 114.2px",
      k: [[0, "rotate(0deg)"], [32, "rotate(116.4deg)"], [40, "rotate(116.4deg)"],
          [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="110" y1="114.2" x2="106" y2="139.9"/>
        <line class="mo-bar2" x1="98.10" y1="138.67" x2="113.90" y2="141.13"/>
        <rect class="mo-mass" x="94.4" y="133.6" width="6" height="13" rx="2" transform="rotate(8.9 97.4 140.1)"/>
        <rect class="mo-mass" x="111.6" y="136.3" width="6" height="13" rx="2" transform="rotate(8.9 114.6 142.8)"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M140 100 L140 70 M135 78 L140 70 L145 78"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M140 70 L140 100 M135 92 L140 100 L145 92"/>` }
  ]
};

/* =========================================================
   77. CURL À LA POULIE BASSE  (curl-poulie-basse)
   -----------------------------------------------------------
   Position  : DEBOUT face à une poulie basse, à environ 50 cm
               d'elle, barre en mains, COUDES COLLÉS au buste.
   Mobile    : le COUDE seul.
   Fixes     : le BRAS — « coudes qui avancent » est l'erreur
               n°2, le bras est donc dans les éléments fixes ; le
               buste, car « reculer le buste » est l'erreur n°1.
   ROM       : coude de 156° à 34°, soit 122,56° de flexion.
   >>> LA FICHE DIT « TENSION DU DÉBUT À LA FIN ». LE CALCUL DIT
       AUTRE CHOSE, ET C'EST PLUS INTÉRESSANT <<< Bras de levier
       de la résistance autour du COUDE, comparé à la même
       flexion faite à la barre :
         t        0    1/6    2/6    3/6    4/6    5/6      1
         câble  18,2   7,0    6,6   17,9   24,3   26,0   24,5
         barre   4,0  12,7   19,8   24,5   26,0   24,3   19,5
       Le câble n'aplatit PAS la courbe : il l'INVERSE. Il charge
       beaucoup plus aux deux extrémités — 18,2 contre 4,0 en bas,
       24,5 contre 19,5 en haut — et beaucoup moins dans le tiers
       bas, où il tombe à 6,6.
       Ce creux n'est pas un artefact, et il a une cause précise :
       à ce moment-là l'AVANT-BRAS POINTE VERS LA POULIE. Le câble
       tire alors exactement dans l'axe de l'avant-bras, donc en
       pure compression, sans aucun bras de levier sur le coude.
       C'est géométriquement inévitable dès que la poulie est
       devant soi, et le vérifier a demandé de tester quatre
       distances de placement : le creux ne disparaît jamais, il
       se DÉPLACE — plus on se rapproche de la poulie, plus il
       glisse vers le bas de l'amplitude.
       Ce que la fiche a raison de dire : en HAUT, là où la barre
       s'allège nettement (19,5), le câble tient encore 24,5. Le
       « parfait pour la congestion en fin de séance » vise juste,
       même si la raison n'est pas celle qu'on croit.
   Sens      : montée = concentrique ; descente lente =
               excentrique. « Relâcher en bas » est l'erreur n°3,
               et le tableau dit pourquoi : c'est justement en bas
               que le câble charge le plus.
   Agonistes : BICEPS BRACHIAL et BRACHIAL ANTÉRIEUR, dans les
               éléments fixes puisque le bras ne bouge pas.
   Distinction : ≠ curl barre (résistance verticale, profil
               inverse) ; ≠ curl concentration (assis, coude calé
               sur la cuisse) ; ≠ curl pupitre (bras sur un
               pupitre incliné).
   GÉOMÉTRIE (calculée) — épaule (120,54), bras 32,06 FIXE,
   coude (122,86), avant-bras 26, poulie (72,146).
     bas  main (118,111.69)   haut main (102.50,68.80)
   -> avant-bras +122,56° ; câble rotation −31,73° et longueur
      ×1,4464, échantillonnés en six intervalles. Sa longueur
      DIMINUE d'abord (×0,918) avant d'augmenter : la main se
      rapproche de la poulie avant de s'en éloigner.
   ========================================================= */
EXERCISE_MOTIONS["curl-poulie-basse"] = {
  vb: "60 24 76 138",
  dur: 3.8,
  phases: { con: [0, 34], ecc: [42, 90] },
  alt: "Debout de profil face à une poulie basse, coudes collés au buste : la barre monte vers les épaules par la seule flexion des coudes, puis redescend lentement.",
  fixe: `
    <line class="mo-ground" x1="64" y1="156" x2="132" y2="156"/>
    <!-- colonne et poulie basse -->
    <line class="mo-gear" x1="68" y1="26" x2="68" y2="156"/>
    <circle class="mo-pulley" cx="72" cy="146" r="5"/>
    <!-- corps debout de profil, face à gauche, immobile -->
    <circle class="mo-head" cx="114" cy="38" r="9"/>
    <line class="mo-body" x1="117" y1="46" x2="120" y2="54"/>
    <line class="mo-body" x1="120" y1="54" x2="124" y2="104"/>
    <line class="mo-body" x1="124" y1="104" x2="122" y2="130"/>
    <line class="mo-body" x1="122" y1="130" x2="118" y2="156"/>
    <!-- BRAS : dans les fixes, collé au flanc -->
    <line class="mo-limb" x1="120" y1="54" x2="122" y2="86"/>
    <circle class="mo-joint" cx="122" cy="86" r="2.8"/>
    <!-- amplitude : l'arc réellement parcouru par la barre -->
    <path class="mo-rom" fill="none" d="M118 111.69 A26 26 0 0 1 102.50 68.80"/>`,
  muscles: [
    { nom: "Biceps brachial",
      svg: `<ellipse cx="117.5" cy="68" rx="3.4" ry="9" transform="rotate(4 117.5 68)"/>` },
    { nom: "Brachial antérieur",
      svg: `<ellipse cx="118.5" cy="80" rx="2.8" ry="6" transform="rotate(4 118.5 80)"/>` }
  ],
  parts: [
    {
      /* CÂBLE : rotation et longueur échantillonnées sur l'arc réel de la
         barre. Sa longueur commence par DIMINUER (×0,918). */
      o: "72px 146px",
      k: [[0, "rotate(0deg) scale(1)"], [5.67, "rotate(-8.31deg) scale(0.9193)"],
          [11.33, "rotate(-18.34deg) scale(0.9180)"], [17, "rotate(-26.75deg) scale(0.9965)"],
          [22.67, "rotate(-31.56deg) scale(1.1301)"], [28.33, "rotate(-32.92deg) scale(1.2882)"],
          [34, "rotate(-31.73deg) scale(1.4464)"], [42, "rotate(-31.73deg) scale(1.4464)"],
          [50, "rotate(-32.92deg) scale(1.2882)"], [58, "rotate(-31.56deg) scale(1.1301)"],
          [66, "rotate(-26.75deg) scale(0.9965)"], [74, "rotate(-18.34deg) scale(0.9180)"],
          [82, "rotate(-8.31deg) scale(0.9193)"], [90, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="72" y1="146" x2="118" y2="111.69"/>`
    },
    {
      /* AVANT-BRAS + BARRE : rotation autour du COUDE (122,86), +122,56°.
         Même grille que le câble. */
      o: "122px 86px",
      k: [[0, "rotate(0deg)"], [5.67, "rotate(20.43deg)"], [11.33, "rotate(40.85deg)"],
          [17, "rotate(61.28deg)"], [22.67, "rotate(81.71deg)"], [28.33, "rotate(102.13deg)"],
          [34, "rotate(122.56deg)"], [42, "rotate(122.56deg)"],
          [50, "rotate(102.13deg)"], [58, "rotate(81.71deg)"], [66, "rotate(61.28deg)"],
          [74, "rotate(40.85deg)"], [82, "rotate(20.43deg)"], [90, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="122" y1="86" x2="118" y2="111.69"/>
        <line class="mo-bar2" x1="112.1" y1="110.15" x2="123.9" y2="113.23"/>
        <circle class="mo-hand" cx="118" cy="111.69" r="3"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M100 150 L100 126 M95 134 L100 126 L105 134"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M100 126 L100 150 M95 142 L100 150 L105 142"/>` }
  ]
};

/* =========================================================
   78. CURL SPIDER (BANC INCLINÉ À PLAT VENTRE)
       (curl-spider)
   -----------------------------------------------------------
   Position  : À PLAT VENTRE sur un banc incliné à 45°, poitrine
               contre le dossier, bras PENDANTS À LA VERTICALE
               par-dessus le bord haut du banc.
   Mobile    : le COUDE seul.
   Fixes     : le BRAS, qui pend à la verticale et ne peut ni
               avancer ni reculer — « coudes qui reculent » est
               l'erreur n°2 ; les épaules, plaquées contre le
               banc — « balancer les épaules » est l'erreur n°1.
               Le banc fait ici tout le travail de blocage.
   ROM       : coude de 180° à 40°, soit 140° de flexion.
   >>> CURL SPIDER ET CURL PUPITRE SONT LES DEUX MOITIÉS
       COMPLÉMENTAIRES DE LA MÊME COURBE <<< C'est ce que donne
       le calcul du bras de levier, qui vaut ici distance
       HORIZONTALE entre le coude et la main :
         spider   0 -> 10,3 -> 18,9 -> 24,4 -> 26,0 -> 23,2 -> 16,7
       Zéro en bas — le bras pend à la verticale, la charge ne
       pèse rien —, maximum aux deux tiers, et surtout ENCORE
       16,7 en haut.
       Au pupitre, le bras repose sur un plan incliné à 45° : la
       charge est maximale dès le BAS, et en haut l'avant-bras
       arrive à la VERTICALE, donc bras de levier NUL. C'est le
       fameux temps mort du curl pupitre en position haute.
       Les deux exercices chargent donc les deux moitiés opposées
       de l'amplitude : le pupitre l'étirement, le spider la
       contraction. « Pic de contraction » n'est pas un slogan
       ici, c'est la seule portion où cet exercice charge encore
       et où le pupitre ne charge plus.
   POURQUOI LA COURTE PORTION : le buste étant à plat ventre et
               incliné, les bras pendants sont en FLEXION d'épaule
               par rapport au tronc. Or la longue portion du
               biceps franchit l'épaule : épaule fléchie, elle est
               raccourcie, donc en mauvaise position de force. La
               courte portion, qui ne franchit pas l'épaule, prend
               le relais. C'est l'inverse exact du curl incliné,
               où le bras part en arrière et étire la longue
               portion.
   Agonistes : BICEPS, courte portion surtout, et BRACHIAL
               ANTÉRIEUR. Dans les éléments fixes, puisque le bras
               ne bouge pas.
   Sens      : montée = concentrique ; descente lente =
               excentrique. « Rythme trop rapide » est l'erreur
               n°3.
   Distinction : ≠ curl pupitre (bras sur un plan incliné, courbe
               inverse) ; ≠ curl concentration (assis, coude sur
               la cuisse) ; ≠ curl incliné (allongé sur le DOS,
               bras en arrière).
   GÉOMÉTRIE (calculée) — épaule (136,64), bras 32 vertical et
   FIXE, coude (136,96), avant-bras 26.
     bas  main (136,122)   haut main (119.28,76.08)
   -> avant-bras +140° autour du coude.
   ========================================================= */
EXERCISE_MOTIONS["curl-spider"] = {
  vb: "66 36 94 132",
  dur: 3.8,
  phases: { con: [0, 32], ecc: [40, 90] },
  alt: "À plat ventre sur un banc incliné, bras pendants à la verticale par-dessus le bord : les haltères montent par la seule flexion des coudes jusqu'à la contraction complète, puis redescendent lentement.",
  fixe: `
    <line class="mo-ground" x1="70" y1="160" x2="156" y2="160"/>
    <!-- banc incliné à 45° et son pied -->
    <line class="mo-pad" x1="152" y1="50" x2="102" y2="118"/>
    <line class="mo-gear" x1="127" y1="84" x2="127" y2="160"/>
    <line class="mo-gear" x1="108" y1="160" x2="140" y2="160"/>
    <!-- corps à plat ventre sur le banc -->
    <circle class="mo-head" cx="126" cy="50" r="9"/>
    <line class="mo-body" x1="132" y1="57" x2="136" y2="64"/>
    <line class="mo-body" x1="136" y1="64" x2="108" y2="102"/>
    <line class="mo-body" x1="108" y1="102" x2="88" y2="134"/>
    <line class="mo-body" x1="88" y1="134" x2="76" y2="160"/>
    <!-- BRAS : dans les fixes, pendant à la VERTICALE -->
    <line class="mo-limb" x1="136" y1="64" x2="136" y2="96"/>
    <circle class="mo-joint" cx="136" cy="96" r="2.8"/>
    <!-- amplitude : l'arc réellement parcouru par l'haltère -->
    <path class="mo-rom" fill="none" d="M136 122 A26 26 0 0 1 119.28 76.08"/>`,
  muscles: [
    { nom: "Biceps (courte portion)",
      svg: `<ellipse cx="131.5" cy="76" rx="3.4" ry="9"/>` },
    { nom: "Brachial antérieur",
      svg: `<ellipse cx="132.5" cy="89" rx="2.8" ry="6"/>` }
  ],
  parts: [
    {
      /* AVANT-BRAS + HALTÈRE : rotation autour du COUDE (136,96), +140°.
         Le bras ne bouge pas : le banc l'en empêche. */
      o: "136px 96px",
      k: [[0, "rotate(0deg)"], [32, "rotate(140deg)"], [40, "rotate(140deg)"],
          [90, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="136" y1="96" x2="136" y2="122"/>
        <line class="mo-bar2" x1="128" y1="122" x2="144" y2="122"/>
        <rect class="mo-mass" x="124" y="115.5" width="6" height="13" rx="2"/>
        <rect class="mo-mass" x="142" y="115.5" width="6" height="13" rx="2"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M98 90 L98 62 M93 70 L98 62 L103 70"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M98 62 L98 90 M93 82 L98 90 L103 82"/>` }
  ]
};

/* =========================================================
   79. CURL INVERSÉ (PRONATION)  (curl-inverse)
   -----------------------------------------------------------
   Position  : DEBOUT, barre saisie en PRONATION (paumes vers le
               bas), mains largeur d'épaules, coudes au corps.
   Mobile    : le COUDE seul.
   Fixes     : le BRAS, collé au flanc — « coudes qui s'écartent »
               est l'erreur n°3 ; et le POIGNET, verrouillé.
   ROM       : coude de 167,6° à 47,6°, soit 120° de flexion.
   >>> LA DIFFÉRENCE AVEC LE CURL BARRE N'EST PAS GÉOMÉTRIQUE,
       ELLE EST MUSCULAIRE — ET C'EST POUR CELA QUE LE SCHÉMA NE
       CHANGE PAS L'ARC MAIS CHANGE LES MUSCLES <<< L'arc décrit
       par la barre est le même qu'à prise supinée : même coude,
       même rayon, même amplitude. Inventer une trajectoire
       différente serait faux. Ce qui change tient à la position
       du radius.
       Le BICEPS est un supinateur autant qu'un fléchisseur. En
       pronation son tendon s'enroule autour du radius : sa ligne
       d'action est dégradée et il perd une grande part de son
       efficacité. Il n'est donc PAS dessiné ici, alors qu'il
       l'est au curl barre — c'est la traduction visuelle du
       « moins de charge » annoncé par la fiche.
       Prennent le relais le BRACHIAL ANTÉRIEUR, qui s'insère sur
       l'ULNA et se moque donc de la rotation du radius, et le
       BRACHIO-RADIAL, le long supinateur, seul muscle de ce
       catalogue dessiné sur l'AVANT-BRAS mobile.
       Réserve honnête : le brachio-radial franchit le coude, une
       partie de son corps charnu est donc sur le bras. Le
       dessiner entièrement solidaire de l'avant-bras est une
       approximation, assumée faute de pouvoir scinder un muscle
       entre deux segments.
   LE POIGNET EST DESSINÉ COMME UNE ARTICULATION MARQUÉE MAIS
       IMMOBILE : « poignets qui cassent » est l'erreur n°1, et
       en pronation ce sont les EXTENSEURS du poignet qui doivent
       tenir la barre relevée. Avant-bras et main forment donc un
       seul segment rigide de 33, avec le poignet matérialisé au
       milieu : si le schéma le laissait plier, il dessinerait la
       faute.
   Sens      : montée = concentrique ; descente lente =
               excentrique.
   Agonistes : BRACHIAL ANTÉRIEUR et BRACHIO-RADIAL.
   Distinction : ≠ curl barre (supination, biceps dominant, plus
               de charge) ; ≠ curl marteau (prise NEUTRE — le
               brachio-radial y est encore mieux placé, mais le
               biceps reste efficace, ce qui n'est pas le cas
               ici) ; ≠ curl poulie basse (résistance oblique).
   GÉOMÉTRIE (calculée) — épaule (116,56), bras 32 vertical FIXE,
   coude (118,88), avant-bras + main 33 d'un bloc, poignet à 26.
     bas  barre (112.90,120.70)  poignet (114,113.7)
     haut barre ( 92.29, 67.27)  poignet (97.74,71.67)
   -> bloc avant-bras/main, rotation +120° autour du coude.
   ========================================================= */
EXERCISE_MOTIONS["curl-inverse"] = {
  vb: "74 26 76 138",
  dur: 3.6,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Debout de profil, barre saisie paumes vers le bas et poignets verrouillés : la barre monte vers les épaules par la seule flexion des coudes, puis redescend lentement.",
  fixe: `
    <line class="mo-ground" x1="90" y1="158" x2="140" y2="158"/>
    <!-- corps debout de profil, face à gauche, immobile -->
    <circle class="mo-head" cx="110" cy="40" r="9"/>
    <line class="mo-body" x1="113" y1="48" x2="116" y2="56"/>
    <line class="mo-body" x1="116" y1="56" x2="120" y2="106"/>
    <line class="mo-body" x1="120" y1="106" x2="118" y2="132"/>
    <line class="mo-body" x1="118" y1="132" x2="114" y2="158"/>
    <!-- BRAS : dans les fixes, collé au flanc -->
    <line class="mo-limb" x1="116" y1="56" x2="118" y2="88"/>
    <circle class="mo-joint" cx="118" cy="88" r="2.8"/>
    <!-- amplitude : l'arc réellement parcouru par la barre -->
    <path class="mo-rom" fill="none" d="M112.90 120.70 A33 33 0 0 1 92.29 67.27"/>`,
  muscles: [
    { nom: "Brachial antérieur",
      svg: `<ellipse cx="114" cy="76" rx="3" ry="8"/>` }
  ],
  parts: [
    {
      /* AVANT-BRAS + MAIN + BARRE : UN SEUL segment rigide de 33, poignet
         marqué au milieu mais immobile. Rotation +120° autour du COUDE. */
      o: "118px 88px",
      k: [[0, "rotate(0deg)"], [32, "rotate(120deg)"], [40, "rotate(120deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      muscleNom: "Brachio-radial",
      muscle: `<ellipse cx="115.5" cy="97" rx="3" ry="8" transform="rotate(-9 115.5 97)"/>`,
      svg: `
        <line class="mo-limb" x1="118" y1="88" x2="112.90" y2="120.70"/>
        <circle class="mo-joint" cx="114" cy="113.7" r="2.4"/>
        <line class="mo-bar2" x1="105.98" y1="119.62" x2="119.82" y2="121.78"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M140 110 L140 84 M135 92 L140 84 L145 92"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M140 84 L140 110 M135 102 L140 110 L145 102"/>` }
  ]
};

/* =========================================================
   80. CURL À LA MACHINE  (curl-machine)
   -----------------------------------------------------------
   Position  : ASSIS, arrière des bras posé sur le pupitre
               incliné de la machine, poignées en mains.
   Mobile    : le COUDE seul.
   Fixes     : le BRAS, plaqué sur le pupitre ; le bassin sur le
               siège — « se soulever du siège » est l'erreur n°1.
   ROM       : coude de 165° à 45°, soit 120° de flexion, la
               poignée décrivant un arc de rayon 26 autour de
               l'axe.
   >>> L'AXE DE LA MACHINE EST CONFONDU AVEC LE COUDE, ET C'EST
       CE QUI CHANGE TOUT <<< Sur cette machine la charge n'agit
       PAS au bout du bras de levier : elle agit sur une poulie
       CONCENTRIQUE À L'AXE DU COUDE. Le couple résistant vaut
       donc poids × rayon de la poulie — deux grandeurs
       constantes. Il est le même à chaque degré de l'amplitude,
       par construction, et non par réglage.
       Comparé aux deux autres façons de faire un curl bras
       calés, dont les bras de levier ont été calculés aux
       schémas 76 et 78 :
         pupitre barre  18,4 -> 26,0 -> 0      (nul en haut)
         curl spider     0   -> 26,0 -> 16,7   (nul en bas)
         machine        CONSTANT
       C'est exactement pour cela que « amplitude courte en
       haut » est l'erreur n°3 de cette fiche et pas des autres :
       au pupitre, arriver en haut ne coûte rien puisque le bras
       de levier y est nul — s'y arrêter ne fait rien perdre. Sur
       la machine, la fin de course est chargée autant que le
       reste, et l'écourter revient à jeter l'unique avantage de
       l'engin.
   POURQUOI L'AXE DOIT ÊTRE RÉGLÉ SUR LE COUDE : même raison
               qu'au pec-deck. Si l'axe de la machine et celui du
               coude ne coïncident pas, la distance entre le coude
               et la poignée devrait varier au cours du mouvement
               — ce qu'un avant-bras rigide interdit. Le schéma
               dessine donc la machine bien réglée, poulie
               centrée sur le coude.
   Sens      : montée = concentrique ; descente lente =
               excentrique. « Extension brutale » est l'erreur
               n°2 : l'excentrique est donc une fois et demie plus
               long que le concentrique.
   Agonistes : BICEPS BRACHIAL et BRACHIAL ANTÉRIEUR, dans les
               éléments fixes puisque le bras repose sur le
               pupitre.
   Distinction : ≠ curl pupitre (barre, couple nul en haut) ;
               ≠ curl spider (à plat ventre, couple nul en bas) ;
               ≠ curl poulie basse (debout, câble oblique).
   GÉOMÉTRIE (calculée) — épaule (126,74), bras 32 posé sur le
   pupitre, coude/AXE (104.4,97.6), avant-bras 26.
     bas  poignée (82.47,111.57)   haut poignée (103.27,71.62)
   -> avant-bras +120° autour de l'axe.
   ========================================================= */
EXERCISE_MOTIONS["curl-machine"] = {
  vb: "66 40 104 128",
  dur: 3.6,
  phases: { con: [0, 32], ecc: [40, 88] },
  alt: "Assis de profil dans une machine à curl, arrière des bras posé sur le pupitre : les poignées montent en arc de cercle autour de l'axe confondu avec le coude, puis redescendent lentement.",
  fixe: `
    <line class="mo-ground" x1="70" y1="160" x2="166" y2="160"/>
    <!-- siège -->
    <line class="mo-pad" x1="118" y1="126" x2="156" y2="126"/>
    <line class="mo-gear" x1="136" y1="130" x2="136" y2="160"/>
    <!-- PUPITRE incliné : c'est lui qui immobilise le bras -->
    <line class="mo-pad" x1="122" y1="76" x2="96" y2="106"/>
    <!-- corps assis de profil -->
    <circle class="mo-head" cx="118" cy="60" r="9"/>
    <line class="mo-body" x1="123" y1="67" x2="126" y2="74"/>
    <line class="mo-body" x1="126" y1="74" x2="140" y2="120"/>
    <line class="mo-body" x1="140" y1="120" x2="110" y2="128"/>
    <line class="mo-body" x1="110" y1="128" x2="104" y2="160"/>
    <!-- BRAS : dans les fixes, posé sur le pupitre -->
    <line class="mo-limb" x1="126" y1="74" x2="104.4" y2="97.6"/>
    <!-- MÉCANISME : poulie CONCENTRIQUE au coude, câble et colonne -->
    <circle class="mo-pulley" cx="104.4" cy="97.6" r="7"/>
    <circle class="mo-hub" cx="104.4" cy="97.6" r="2.6"/>
    <line class="mo-cable" x1="104.4" y1="104.6" x2="104.4" y2="140"/>
    <rect class="mo-gear" x="97" y="140" width="15" height="18" rx="2"/>
    <!-- amplitude : l'arc réellement parcouru par la poignée -->
    <path class="mo-rom" fill="none" d="M82.47 111.57 A26 26 0 0 1 103.27 71.62"/>`,
  muscles: [
    { nom: "Biceps brachial",
      svg: `<ellipse cx="117" cy="84" rx="3.4" ry="9" transform="rotate(42.5 117 84)"/>` },
    { nom: "Brachial antérieur",
      svg: `<ellipse cx="110" cy="92" rx="2.8" ry="6" transform="rotate(42.5 110 92)"/>` }
  ],
  parts: [
    {
      /* AVANT-BRAS + POIGNÉE : rotation autour de l'AXE (104.4,97.6), qui
         est aussi le coude. +120°. */
      o: "104.4px 97.6px",
      k: [[0, "rotate(0deg)"], [32, "rotate(120deg)"], [40, "rotate(120deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="104.4" y1="97.6" x2="82.47" y2="111.57"/>
        <line class="mo-bar2" x1="78.71" y1="105.67" x2="86.23" y2="117.47"/>
        <circle class="mo-hand" cx="82.47" cy="111.57" r="3"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M156 100 L156 70 M151 78 L156 70 L161 78"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M156 70 L156 100 M151 92 L156 100 L161 92"/>` }
  ]
};

/* =========================================================
   81. DÉVELOPPÉ COUCHÉ PRISE SERRÉE
       (developpe-couche-prise-serree)
   -----------------------------------------------------------
   Position  : ALLONGÉ sur banc plat, barre saisie LARGEUR
               D'ÉPAULES, coudes près du corps.
   Mobiles   : coude et épaule.
   Fixes     : rachis, bassin, jambes.
   Sens      : descente vers le BAS des pectoraux = excentrique ;
               poussée jusqu'aux bras tendus = concentrique.
               « Rebond sur la poitrine » est l'erreur n°3 : le
               schéma marque un temps d'arrêt en bas plutôt que
               d'enchaîner.
   ROM       : coude de 180° à 57,8°. La barre parcourt 49,9 en
               ligne quasi droite, de l'aplomb de l'épaule
               jusqu'au bas du sternum.
   >>> CE QUE LA PRISE SERRÉE CHANGE, ET POURQUOI UN PROFIL LE
       MONTRE MIEUX ICI QU'AILLEURS <<< En prise LARGE, les
       coudes partent sur les côtés : le bras est fortement
       ABDUQUÉ, donc en grande partie hors du plan sagittal. Un
       schéma de profil le raccourcit alors beaucoup — c'est une
       approximation qu'il faut accepter. En prise SERRÉE les
       coudes restent près des côtes : l'abduction tombe à ~30°,
       le bras reste presque entièrement dans le plan du dessin,
       et sa longueur apparente passe à 27,7 pour 32 réels, soit
       87 %. C'est donc l'exercice de développé que la vue de
       profil représente le plus FIDÈLEMENT de tout ce catalogue.
   LE COUDE PASSE SOUS LE BANC, ET C'EST JUSTE : en bas, le coude
               tombe en (94.64,109.96) alors que la surface du
               banc est à 100. Il n'est pas dedans, il est À CÔTÉ
               — les bras pendent de part et d'autre. C'est
               précisément ce qui donne au développé couché son
               amplitude, et ce qu'une machine guidée interdit.
   Agonistes : TRICEPS d'abord, puis portion INTERNE du grand
               pectoral et deltoïde antérieur. C'est le trajet
               coudes serrés qui bascule la charge du pectoral
               vers le triceps : plus le coude est près du corps,
               plus l'extension du coude fait le travail.
   Distinction : ≠ développé couché barre (prise large, coudes
               écartés, pectoral dominant) ; ≠ barre au front (le
               bras y est fixe, seul le coude bouge) ; ≠ dips
               triceps (chaîne fermée, c'est le corps qui bouge).
   GÉOMÉTRIE (calculée) — épaule (72,94), bras apparent 27,7,
   avant-bras 26. Trajet de la barre imposé RECTILIGNE de
   (72,40.3) à (96,84), six intervalles, IK à chacun :
     coude 180 -> 120,3 -> 96,1 -> 78,6 -> 66,1 -> 58,9 -> 57,8
     coude (point) de (72,66.3) à (94.64,109.96)
   -> bras +125,19° ; avant-bras relatif −122,19°.
   ========================================================= */
EXERCISE_MOTIONS["developpe-couche-prise-serree"] = {
  vb: "38 24 134 144",
  dur: 3.8,
  phases: { ecc: [0, 44], con: [52, 84] },
  alt: "Allongé sur un banc plat, barre en prise largeur d'épaules : la barre descend en ligne droite jusqu'au bas du sternum, coudes serrés le long des côtes, puis est repoussée jusqu'aux bras tendus.",
  fixe: `
    <line class="mo-ground" x1="42" y1="160" x2="168" y2="160"/>
    <!-- banc plat -->
    <line class="mo-pad" x1="56" y1="100" x2="146" y2="100"/>
    <line class="mo-gear" x1="66" y1="104" x2="66" y2="160"/>
    <line class="mo-gear" x1="136" y1="104" x2="136" y2="160"/>
    <!-- corps allongé sur le dos, immobile -->
    <circle class="mo-head" cx="52" cy="90" r="9"/>
    <line class="mo-body" x1="61" y1="92" x2="72" y2="94"/>
    <line class="mo-body" x1="72" y1="94" x2="124" y2="98"/>
    <line class="mo-body" x1="124" y1="98" x2="152" y2="124"/>
    <line class="mo-body" x1="152" y1="124" x2="146" y2="160"/>
    <!-- amplitude : le trajet RECTILIGNE réellement parcouru par la barre -->
    <line class="mo-rom" x1="72" y1="40.3" x2="96" y2="84"/>`,
  muscles: [
    { nom: "Pectoral (portion interne)",
      svg: `<ellipse cx="88" cy="88" rx="12" ry="4" transform="rotate(4 88 88)"/>` }
  ],
  parts: [
    {
      /* BRAS : rotation autour de l'ÉPAULE (72,94), +125,19°. Le coude
         descend À CÔTÉ du banc, plus bas que sa surface. */
      o: "72px 94px",
      k: [[0, "rotate(0deg)"], [7.33, "rotate(33.72deg)"], [14.67, "rotate(51.89deg)"],
          [22, "rotate(69.13deg)"], [29.33, "rotate(87.24deg)"], [36.67, "rotate(106.52deg)"],
          [44, "rotate(125.19deg)"], [52, "rotate(125.19deg)"],
          [57.33, "rotate(106.52deg)"], [62.67, "rotate(87.24deg)"], [68, "rotate(69.13deg)"],
          [73.33, "rotate(51.89deg)"], [78.67, "rotate(33.72deg)"], [84, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      muscleNom: "Triceps brachial",
      muscle: `<ellipse cx="75.5" cy="80" rx="3.2" ry="8"/>`,
      svg: `
        <line class="mo-limb" x1="72" y1="94" x2="72" y2="66.3"/>
        <circle class="mo-joint" cx="72" cy="66.3" r="2.8"/>`,
      children: [
        {
          /* AVANT-BRAS + BARRE : rotation RELATIVE autour du COUDE. */
          o: "72px 66.3px",
          k: [[0, "rotate(0deg)"], [7.33, "rotate(-59.68deg)"], [14.67, "rotate(-83.94deg)"],
              [22, "rotate(-101.41deg)"], [29.33, "rotate(-113.91deg)"], [36.67, "rotate(-121.13deg)"],
              [44, "rotate(-122.19deg)"], [52, "rotate(-122.19deg)"],
              [57.33, "rotate(-121.13deg)"], [62.67, "rotate(-113.91deg)"], [68, "rotate(-101.41deg)"],
              [73.33, "rotate(-83.94deg)"], [78.67, "rotate(-59.68deg)"], [84, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          svg: `
            <line class="mo-limb" x1="72" y1="66.3" x2="72" y2="40.3"/>
            <circle class="mo-plate-o" cx="72" cy="40.3" r="11"/>
            <circle class="mo-hub" cx="72" cy="40.3" r="2.8"/>`
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M158 50 L158 84 M153 76 L158 84 L163 76"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M158 84 L158 50 M153 58 L158 50 L163 58"/>` }
  ]
};

/* =========================================================
   82. EXTENSION TRICEPS UN BRAS À LA POULIE
       (extension-un-bras-poulie)
   -----------------------------------------------------------
   Position  : DEBOUT face à une poulie haute, poignée tenue
               d'UNE main, coude collé au flanc, bras libre le
               long du corps.
   Mobile    : le COUDE seul.
   Fixes     : le BRAS, collé au flanc — « coude qui décolle »
               est l'erreur n°1, un cercle pointillé marque donc
               la position que le coude ne doit pas quitter ; le
               buste, car « rotation du buste » est l'erreur n°2
               et c'est la faute propre à l'unilatéral, rien ne
               s'oppose plus à la traction du côté opposé.
   ROM       : coude de 75,4° à 175°, soit 99,63° d'extension.
               « Amplitude écourtée » est l'erreur n°3.
   >>> PAS DE POINT MORT ICI, ET C'EST DÉMONTRABLE <<< Au curl à
       la poulie basse (schéma 77) le calcul avait révélé un
       creux : à un moment l'avant-bras pointait vers la poulie,
       le câble tirait dans son axe et le bras de levier tombait
       à 6,6. La même vérification ici donne un critère général,
       et il est simple :
         il y a un point mort si — et seulement si — la direction
         COUDE -> POULIE tombe DANS le secteur angulaire balayé
         par l'avant-bras.
       Ici la direction coude->poulie vaut 225°, et l'avant-bras
       ne balaie que de 91,4° à 191,1°. 225 est en dehors : aucun
       alignement possible, donc aucun point mort. Le bras de
       levier reste entre 15,4 et 25,9 sur toute l'amplitude,
       soit un rapport de 1,7 seulement :
         t      0    1/6    2/6    3/6    4/6    5/6      1
         levier 18,8  23,8  25,9  25,6  23,4  19,9  15,4
   POURQUOI LE CHEF LATÉRAL : le chef LONG du triceps franchit
               l'épaule. Ici l'épaule reste NEUTRE, bras le long
               du corps : le chef long est donc à une longueur
               moyenne, ni étiré ni raccourci, position où il
               n'est pas à son avantage. Les chefs latéral et
               médial, qui ne franchissent pas l'épaule, font
               l'essentiel. C'est l'inverse exact de l'extension
               nuque, où l'épaule fléchie étire le chef long et
               le met en avant.
   Sens      : extension vers le bas = concentrique ; remontée
               contrôlée = excentrique.
   Agonistes : TRICEPS, chef latéral surtout.
   Distinction : ≠ extension poulie à la barre (bilatéral, les
               deux coudes solidaires) ; ≠ extension nuque
               (épaule fléchie, chef long) ; ≠ kickback (haltère,
               résistance verticale).
   GÉOMÉTRIE (calculée) — épaule (116,56), bras 32 FIXE, coude
   (118,88), avant-bras 26, poulie (56,26).
     haut main (92.48,83.02)   bas main (117.36,113.99)
   -> avant-bras −99,63° ; câble rotation faible (+4,8° au plus,
      puis −2,3°) et allongement ×1,5848, six intervalles.
   ========================================================= */
EXERCISE_MOTIONS["extension-un-bras-poulie"] = {
  vb: "44 18 102 146",
  dur: 3.6,
  phases: { con: [0, 34], ecc: [46, 90] },
  alt: "Debout de profil face à une poulie haute, une seule main sur la poignée et le coude collé au flanc : l'avant-bras descend jusqu'à l'extension complète du coude, puis remonte lentement.",
  fixe: `
    <line class="mo-ground" x1="48" y1="158" x2="140" y2="158"/>
    <!-- colonne et poulie HAUTE -->
    <line class="mo-gear" x1="52" y1="22" x2="52" y2="158"/>
    <circle class="mo-pulley" cx="56" cy="26" r="5"/>
    <!-- corps debout de profil, face à gauche, immobile -->
    <circle class="mo-head" cx="116" cy="40" r="9"/>
    <line class="mo-body" x1="119" y1="48" x2="122" y2="56"/>
    <line class="mo-body" x1="122" y1="56" x2="126" y2="106"/>
    <line class="mo-body" x1="126" y1="106" x2="124" y2="132"/>
    <line class="mo-body" x1="124" y1="132" x2="120" y2="158"/>
    <!-- bras LIBRE, discret -->
    <line class="mo-body" x1="124" y1="57" x2="132" y2="88"/>
    <line class="mo-body" x1="132" y1="88" x2="130" y2="112"/>
    <!-- BRAS DE TRAVAIL : fixe, collé au flanc, dessiné en avant du tronc
         pour que les deux ne se confondent pas -->
    <line class="mo-limb" x1="121" y1="57" x2="118" y2="88"/>
    <circle class="mo-joint" cx="118" cy="88" r="2.8"/>
    <!-- le coude ne doit pas quitter ce cercle -->
    <circle class="mo-rom" fill="none" cx="118" cy="88" r="8"/>
    <!-- amplitude : l'arc réellement parcouru par la poignée -->
    <path class="mo-rom" fill="none" d="M92.48 83.02 A26 26 0 0 0 117.36 113.99"/>`,
  muscles: [
    { nom: "Triceps (chef latéral)",
      svg: `<ellipse cx="122.5" cy="72" rx="3.2" ry="9" transform="rotate(5 122.5 72)"/>` }
  ],
  parts: [
    {
      /* CÂBLE : rotation faible et allongement ×1,5848, échantillonnés sur
         l'arc réel de la poignée. */
      o: "56px 26px",
      k: [[0, "rotate(0deg) scale(1)"], [5.67, "rotate(3.37deg) scale(1.0924)"],
          [11.33, "rotate(4.78deg) scale(1.1997)"], [17, "rotate(4.55deg) scale(1.3105)"],
          [22.67, "rotate(3.09deg) scale(1.4158)"], [28.33, "rotate(0.73deg) scale(1.5089)"],
          [34, "rotate(-2.27deg) scale(1.5848)"], [46, "rotate(-2.27deg) scale(1.5848)"],
          [53.33, "rotate(0.73deg) scale(1.5089)"], [60.67, "rotate(3.09deg) scale(1.4158)"],
          [68, "rotate(4.55deg) scale(1.3105)"], [75.33, "rotate(4.78deg) scale(1.1997)"],
          [82.67, "rotate(3.37deg) scale(1.0924)"], [90, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="56" y1="26" x2="92.48" y2="83.02"/>`
    },
    {
      /* AVANT-BRAS + POIGNÉE : rotation autour du COUDE (118,88), −99,63°.
         Même grille que le câble. */
      o: "118px 88px",
      k: [[0, "rotate(0deg)"], [5.67, "rotate(-16.61deg)"], [11.33, "rotate(-33.21deg)"],
          [17, "rotate(-49.81deg)"], [22.67, "rotate(-66.42deg)"], [28.33, "rotate(-83.02deg)"],
          [34, "rotate(-99.63deg)"], [46, "rotate(-99.63deg)"],
          [53.33, "rotate(-83.02deg)"], [60.67, "rotate(-66.42deg)"], [68, "rotate(-49.81deg)"],
          [75.33, "rotate(-33.21deg)"], [82.67, "rotate(-16.61deg)"], [90, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="118" y1="88" x2="92.48" y2="83.02"/>
        <line class="mo-bar2" x1="91.52" y1="87.93" x2="93.44" y2="78.11"/>
        <circle class="mo-hand" cx="92.48" cy="83.02" r="3"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M136 70 L136 100 M131 92 L136 100 L141 92"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M136 100 L136 70 M131 78 L136 70 L141 78"/>` }
  ]
};

/* =========================================================
   83. KICKBACK TRICEPS  (kickback-triceps)
   -----------------------------------------------------------
   Position  : BUSTE PENCHÉ jusqu'à l'HORIZONTALE, main libre en
               appui sur un banc, dos plat, bras collé au flanc
               et parallèle au tronc, coude fléchi à 90°.
   Mobile    : le COUDE seul.
   Fixes     : le BRAS — « coude qui tombe » est l'erreur n°1 ;
               l'ÉPAULE — « élan de l'épaule » est l'erreur n°2 ;
               le tronc.
   >>> POURQUOI LE BUSTE EST DESSINÉ EXACTEMENT HORIZONTAL <<<
       Ce n'est pas une interprétation : c'est ce qu'impose la
       consigne « coude fléchi à 90° ». Le bras est parallèle au
       tronc et l'avant-bras pend à la VERTICALE sous l'effet de
       la charge. L'angle du coude vaut donc 90° + l'inclinaison
       du tronc par rapport à l'horizontale. Buste à 45°, le
       coude est déjà à 135° au repos, pas à 90°. Les deux
       consignes de la fiche ne sont compatibles que pour un
       buste horizontal — et c'est celui-là qui est dessiné.
   ROM       : 90° d'extension, du coude à 90° jusqu'à
               l'alignement complet du bras et de l'avant-bras.
   >>> LA COURBE DE CHARGE, ET POURQUOI LA FICHE A RAISON <<< Le
       couple résistant vaut poids × distance HORIZONTALE
       coude-main. L'avant-bras faisant 26 :
         rotation   0    15°    30°    45°    60°    75°    90°
         levier   0,0   6,7   13,0   18,4   22,5   25,1   26,0
       Croissance MONOTONE, maximum exactement au VERROUILLAGE.
       C'est unique parmi tous les exercices de bras de ce
       catalogue : le curl pupitre est nul en haut, le curl
       spider nul en bas, l'extension à la poulie plafonne au
       milieu. Ici la charge culmine à l'instant précis où le
       triceps est le plus court. « La contraction en fin de
       mouvement est incomparable » est donc exact, et c'est la
       géométrie qui le dit.
       Le revers, dit aussi : au DÉPART le bras de levier est
       NUL. La première moitié du mouvement ne charge presque
       rien. Et comme le maximum tombe là où le muscle est le
       plus court donc le plus faible, « charge trop lourde »
       (erreur n°3) rend le verrouillage impossible — d'où le
       balancement d'épaule qu'on voit si souvent.
   Sens      : extension = concentrique, suivie d'une TENUE d'une
               seconde ; retour = excentrique.
   Agonistes : TRICEPS, dans les éléments fixes puisque le bras
               ne bouge pas.
   Distinction : ≠ extension poulie (câble, maximum au milieu) ;
               ≠ extension nuque (épaule fléchie, chef long) ;
               ≠ barre au front (allongé, deux bras).
   GÉOMÉTRIE (calculée) — épaule (86,88), bras 32 horizontal et
   FIXE, coude (118,96), avant-bras 26. Le bras est dessiné 8
   unités SOUS la ligne du tronc, dont il est parallèle : sur la
   même ligne, les deux traits se confondaient et le schéma
   devenait illisible.
     départ main (118,122)   fin main (144,96)
   -> avant-bras −90° autour du coude.
   ========================================================= */
EXERCISE_MOTIONS["kickback-triceps"] = {
  vb: "50 68 120 98",
  dur: 3.4,
  phases: { con: [0, 30], ecc: [48, 88] },
  alt: "Buste penché à l'horizontale, main libre en appui sur un banc, bras collé au flanc : l'avant-bras se tend vers l'arrière jusqu'à l'alignement complet, marque une seconde, puis revient.",
  fixe: `
    <line class="mo-ground" x1="54" y1="158" x2="166" y2="158"/>
    <!-- banc d'appui pour la main libre -->
    <line class="mo-pad" x1="56" y1="146" x2="112" y2="146"/>
    <line class="mo-gear" x1="64" y1="150" x2="64" y2="158"/>
    <line class="mo-gear" x1="104" y1="150" x2="104" y2="158"/>
    <!-- corps penché, buste HORIZONTAL -->
    <circle class="mo-head" cx="74" cy="84" r="9"/>
    <line class="mo-body" x1="81" y1="86" x2="86" y2="88"/>
    <line class="mo-body" x1="86" y1="88" x2="130" y2="88"/>
    <line class="mo-body" x1="130" y1="88" x2="136" y2="120"/>
    <line class="mo-body" x1="136" y1="120" x2="132" y2="158"/>
    <!-- bras LIBRE, en appui sur le banc -->
    <line class="mo-body" x1="88" y1="89" x2="78" y2="118"/>
    <line class="mo-body" x1="78" y1="118" x2="72" y2="146"/>
    <!-- BRAS DE TRAVAIL : fixe, parallèle au tronc -->
    <line class="mo-limb" x1="86" y1="88" x2="86" y2="96"/>
    <line class="mo-limb" x1="86" y1="96" x2="118" y2="96"/>
    <circle class="mo-joint" cx="118" cy="96" r="2.8"/>
    <!-- amplitude : l'arc réellement parcouru par l'haltère -->
    <path class="mo-rom" fill="none" d="M118 122 A26 26 0 0 0 144 96"/>`,
  muscles: [
    { nom: "Triceps brachial",
      svg: `<ellipse cx="102" cy="92" rx="9" ry="3"/>` }
  ],
  parts: [
    {
      /* AVANT-BRAS + HALTÈRE : rotation autour du COUDE (118,88), −90°.
         Le bras ne bouge pas : c'est tout l'exercice. */
      o: "118px 96px",
      k: [[0, "rotate(0deg)"], [30, "rotate(-90deg)"], [48, "rotate(-90deg)"],
          [88, "rotate(0deg)"], [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="118" y1="96" x2="118" y2="122"/>
        <line class="mo-bar2" x1="110" y1="122" x2="126" y2="122"/>
        <rect class="mo-mass" x="106" y="115.5" width="6" height="13" rx="2"/>
        <rect class="mo-mass" x="124" y="115.5" width="6" height="13" rx="2"/>`
    }
  ],
  arrows: [
    { phase: "con", svg: `<path class="mo-arr" d="M152 116 L152 94 M147 102 L152 94 L157 102"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M152 94 L152 116 M147 108 L152 116 L157 108"/>` }
  ]
};

/* =========================================================
   84. POMPES DIAMANT  (pompes-diamant)
   -----------------------------------------------------------
   Position  : en planche, MAINS JOINTES sous la POITRINE, pouces
               et index formant un losange, coudes le long du
               corps, pointes de pieds au sol.
   Mobiles   : coude, épaule, et le CORPS entier qui pivote
               autour de la pointe des pieds.
   Fixes     : les mains au sol ; le rachis et le bassin —
               « bassin qui tombe » est l'erreur n°2, le corps est
               donc un segment rigide.
   >>> CE QUE LE PROFIL PEUT ET NE PEUT PAS MONTRER <<< Le
       LOSANGE formé par les pouces et les index est une figure du
       plan TRANSVERSE : de profil, deux mains jointes se
       superposent exactement et la forme disparaît. Elle n'est
       donc pas dessinée, et ce n'est pas un oubli.
       Ce que le profil montre, en revanche, est la conséquence
       GÉOMÉTRIQUE de ces mains jointes, et c'est le cœur de
       l'exercice : la main n'est plus sous l'ÉPAULE mais sous le
       STERNUM, soit 19,4 unités plus loin vers les pieds. Un
       repère pointillé au sol mesure cet écart, entre l'aplomb
       de l'épaule et la main.
   CE QUE CET ÉCART CHANGE, CALCULÉ : la main étant plus loin, le
       bras travaille dans un axe plus proche de celui du corps.
       Résultat, le coude ne se ferme QUE jusqu'à 79,5°, là où une
       pompe classique descend à 60°. Et pourtant l'épaule descend
       PLUS : 24,25 unités contre 21,5. Moins de flexion de coude,
       plus de descente — c'est cette combinaison qui bascule la
       charge du pectoral vers le triceps.
   CE QUI ARRÊTE LA DESCENTE N'EST PAS LE SOL : dans une pompe
       ordinaire la poitrine descend ENTRE les mains et s'arrête
       au sol. Ici les mains sont SOUS la poitrine : c'est sur
       elles que la poitrine vient buter, environ 6 unités plus
       haut. L'amplitude est bornée par l'épaisseur des mains, et
       le schéma s'arrête là.
   Sens      : descente = excentrique ; poussée = concentrique.
   ROM       : coude de 169,9° à 79,5°.
   Agonistes : TRICEPS, et portion INTERNE du grand pectoral.
   Distinction : ≠ pompes (mains sous les épaules, coude à 60°) ;
               ≠ pompes déclinées (pieds surélevés) ; ≠ développé
               couché prise serrée (c'est la barre qui bouge).
   GÉOMÉTRIE (calculée) — main (85,150) FIXE, pointe de pied
   (188,146) FIXE, pied->épaule 127,1, avant-bras 21, bras 22.
   Position haute obtenue par intersection des cercles (main,
   42,84) et (pied, 127,1) -> épaule (65.58,111.82).
     haut  coude (77.20,130.50)
     bas   épaule (61.29,136.07)  coude (82.18,129.19)
   Six intervalles, IK à chacun : coude 169,9 -> 135,9 -> 118,7 ->
   105,7 -> 95,2 -> 86,5 -> 79,5. La main reste au sol partout.
   ========================================================= */
EXERCISE_MOTIONS["pompes-diamant"] = {
  vb: "42 96 158 62",
  dur: 3.4,
  phases: { ecc: [0, 44], con: [52, 84] },
  alt: "En planche, mains jointes sous la poitrine : le corps descend d'un bloc jusqu'à ce que la poitrine touche les mains, coudes le long du corps, puis repousse le sol.",
  fixe: `
    <line class="mo-ground" x1="46" y1="150" x2="196" y2="150"/>
    <!-- écart entre l'aplomb de l'épaule et la main : 19,4 unités -->
    <line class="mo-rom" x1="65.58" y1="150" x2="85" y2="150"/>`,
  parts: [
    {
      /* AVANT-BRAS : enraciné à la MAIN (85,150), qui ne quitte pas le
         sol. La main est sous le STERNUM, pas sous l'épaule. */
      o: "85px 150px",
      k: [[0, "rotate(0deg)"], [7.33, "rotate(13.51deg)"], [14.67, "rotate(17.96deg)"],
          [22, "rotate(19.70deg)"], [29.33, "rotate(19.53deg)"], [36.67, "rotate(17.65deg)"],
          [44, "rotate(14.10deg)"], [52, "rotate(14.10deg)"],
          [57.33, "rotate(17.65deg)"], [62.67, "rotate(19.53deg)"], [68, "rotate(19.70deg)"],
          [73.33, "rotate(17.96deg)"], [78.67, "rotate(13.51deg)"], [84, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      childrenFirst: true,
      svg: `
        <circle class="mo-hand" cx="85" cy="150" r="4"/>
        <line class="mo-limb" x1="85" y1="150" x2="77.20" y2="130.50"/>
        <circle class="mo-joint" cx="77.20" cy="130.50" r="2.6"/>`,
      children: [
        {
          /* BRAS : flexion du COUDE. −90,45° le ferme de 169,9° à 79,5°. */
          o: "77.20px 130.50px",
          k: [[0, "rotate(0deg)"], [7.33, "rotate(-34.04deg)"], [14.67, "rotate(-51.24deg)"],
              [22, "rotate(-64.22deg)"], [29.33, "rotate(-74.74deg)"], [36.67, "rotate(-83.41deg)"],
              [44, "rotate(-90.45deg)"], [52, "rotate(-90.45deg)"],
              [57.33, "rotate(-83.41deg)"], [62.67, "rotate(-74.74deg)"], [68, "rotate(-64.22deg)"],
              [73.33, "rotate(-51.24deg)"], [78.67, "rotate(-34.04deg)"], [84, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          muscleNom: "Triceps brachial",
          muscle: `<ellipse cx="74.4" cy="119.4" rx="3.2" ry="7" transform="rotate(-31.9 74.4 119.4)"/>`,
          svg: `<line class="mo-limb" x1="77.20" y1="130.50" x2="65.58" y2="111.82"/>`,
          children: [
            {
              /* CORPS : contre-rotation, pour qu'il ne pivote que des 11,12°
                 imposés par le pied fixe. Il ne se cambre jamais. */
              o: "65.58px 111.82px",
              k: [[0, "rotate(0deg)"], [7.33, "rotate(18.67deg)"], [14.67, "rotate(29.58deg)"],
                  [22, "rotate(38.96deg)"], [29.33, "rotate(47.80deg)"], [36.67, "rotate(56.49deg)"],
                  [44, "rotate(65.23deg)"], [52, "rotate(65.23deg)"],
                  [57.33, "rotate(56.49deg)"], [62.67, "rotate(47.80deg)"], [68, "rotate(38.96deg)"],
                  [73.33, "rotate(29.58deg)"], [78.67, "rotate(18.67deg)"], [84, "rotate(0deg)"],
                  [100, "rotate(0deg)"]],
              muscleNom: "Pectoral (portion interne)",
              muscle: `<ellipse cx="81.30" cy="122.44" rx="10" ry="4" transform="rotate(15.6 81.30 122.44)"/>`,
              svg: `
                <circle class="mo-head" cx="54.03" cy="108.59" r="8"/>
                <line class="mo-body" x1="61.73" y1="110.74" x2="125.29" y2="128.50"/>
                <line class="mo-body" x1="125.29" y1="128.50" x2="179.78" y2="143.72"/>
                <line class="mo-body" x1="179.78" y1="143.72" x2="188" y2="146"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M150 102 L150 122 M145 116 L150 122 L155 116"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M150 122 L150 102 M145 108 L150 102 L155 108"/>` }
  ]
};

/* =========================================================
   85. DIPS À LA MACHINE ASSISTÉE  (dips-machine)
   -----------------------------------------------------------
   Position  : à GENOUX sur la plateforme d'assistance, poignées
               en mains, BUSTE VERTICAL, coudes fléchis à 90°.
   Matériel  : machine à dips assistée. Les POIGNÉES sont le
               point fixe : c'est le corps qui monte et descend,
               exactement comme aux dips libres.
   Mobiles   : coude et épaule.
   Fixes     : les mains sur les poignées ; le rachis.
   >>> BUSTE VERTICAL, ET C'EST CE QUI ORIENTE L'EXERCICE <<< Aux
       dips pectoraux (schéma 5) le buste est penché de 25° :
       cette inclinaison place le bras en avant du tronc et charge
       le bas du grand pectoral. Ici le buste est STRICTEMENT
       VERTICAL, le bras reste dans l'axe du corps, et c'est
       l'extension du coude qui fait le travail. Même machine,
       même chaîne, deux orientations — et c'est l'angle du buste,
       pas l'engin, qui décide.
       « Buste qui s'affaisse » est d'ailleurs l'erreur n°3 : le
       corps est donc modélisé RIGIDE, et la somme des trois
       rotations de la chaîne vaut exactement zéro — avant-bras
       +38,76°, bras −84,89°, corps +46,13° — de sorte qu'il ne
       peut pas s'incliner d'un degré.
   LA PLATEFORME EST DESSINÉE SOLIDAIRE DES GENOUX : c'est la
       seule pièce que cette machine ajoute au mouvement, et elle
       doit suivre le corps. Elle est donc placée DANS le groupe
       du corps, et descend avec lui de 12,86 unités.
   ROM       : coude de 175° à 90°, et pas plus. « Amplitude
               excessive en haut » est l'erreur n°2 : descendre
               au-delà de 90° fait passer l'épaule sous le coude,
               position où la tête humérale est la plus exposée.
               Un repère pointillé marque la hauteur d'épaule à
               ne pas dépasser.
   Sens      : descente = excentrique ; poussée = concentrique.
   Agonistes : TRICEPS surtout, deltoïde antérieur en assistance.
   Distinction : ≠ dips pectoraux (buste penché à 25°, bas du
               pectoral) ; ≠ dips banc (mains derrière, pieds au
               sol) ; ≠ extension poulie (le coude y est fixe et
               c'est la charge qui bouge).
   GÉOMÉTRIE (calculée) — poignée (110,110) FIXE, avant-bras 22,
   bras 22.
     tendu  coude (110.95,88.02)   épaule (110,66.04)
     fléchi coude (124.50,93.45)   épaule (108,78.90)
   -> avant-bras +38,76° ; bras relatif −84,89° ; corps relatif
      +46,13°, somme nulle.
   ========================================================= */
EXERCISE_MOTIONS["dips-machine"] = {
  vb: "56 36 124 128",
  dur: 3.6,
  phases: { ecc: [0, 44], con: [52, 84] },
  alt: "À genoux sur la plateforme d'une machine à dips assistée, buste vertical : le corps descend jusqu'à 90 degrés de flexion des coudes, puis remonte jusqu'aux bras tendus.",
  fixe: `
    <line class="mo-ground" x1="58" y1="158" x2="178" y2="158"/>
    <!-- bâti de la machine -->
    <line class="mo-gear" x1="60" y1="40" x2="60" y2="158"/>
    <line class="mo-gear" x1="176" y1="40" x2="176" y2="158"/>
    <line class="mo-gear" x1="60" y1="40" x2="176" y2="40"/>
    <!-- rail de la plateforme d'assistance -->
    <line class="mo-gear" x1="146" y1="90" x2="146" y2="158"/>
    <!-- poignée, vue par la tranche -->
    <circle class="mo-pulley" cx="110" cy="110" r="5"/>
    <!-- LIMITE : hauteur d'épaule à 90° de coude, à ne pas dépasser -->
    <line class="mo-rom" x1="84" y1="78.9" x2="102" y2="78.9"/>`,
  parts: [
    {
      /* AVANT-BRAS : enraciné à la POIGNÉE (110,110), qui ne bouge pas.
         +38,76° : le coude part vers l'arrière. */
      o: "110px 110px",
      k: [[0, "rotate(0deg)"], [44, "rotate(38.76deg)"], [52, "rotate(38.76deg)"],
          [84, "rotate(0deg)"], [100, "rotate(0deg)"]],
      childrenFirst: true,
      svg: `
        <circle class="mo-hand" cx="110" cy="110" r="3.6"/>
        <line class="mo-limb" x1="110" y1="110" x2="110.95" y2="88.02"/>
        <circle class="mo-joint" cx="110.95" cy="88.02" r="2.6"/>`,
      children: [
        {
          /* BRAS : flexion du COUDE, −84,89°, de 175° à 90° exactement. */
          o: "110.95px 88.02px",
          k: [[0, "rotate(0deg)"], [44, "rotate(-84.89deg)"], [52, "rotate(-84.89deg)"],
              [84, "rotate(0deg)"], [100, "rotate(0deg)"]],
          muscleNom: "Triceps brachial",
          muscle: `<ellipse cx="114" cy="77" rx="3.2" ry="8" transform="rotate(-2 114 77)"/>`,
          svg: `<line class="mo-limb" x1="110.95" y1="88.02" x2="110" y2="66.04"/>`,
          children: [
            {
              /* CORPS + PLATEFORME : contre-rotation de +46,13°, qui rend la
                 somme nulle. Le buste reste donc rigoureusement vertical, et
                 la plateforme, solidaire des genoux, descend avec lui. */
              o: "110px 66.04px",
              k: [[0, "rotate(0deg)"], [44, "rotate(46.13deg)"], [52, "rotate(46.13deg)"],
                  [84, "rotate(0deg)"], [100, "rotate(0deg)"]],
              muscleNom: "Deltoïde antérieur",
              muscle: `<circle cx="106" cy="68" r="4.4"/>`,
              svg: `
                <circle class="mo-head" cx="104" cy="50" r="9"/>
                <line class="mo-body" x1="107" y1="58" x2="110" y2="66.04"/>
                <line class="mo-body" x1="110" y1="66.04" x2="112" y2="112"/>
                <line class="mo-body" x1="112" y1="112" x2="106" y2="138"/>
                <line class="mo-body" x1="106" y1="138" x2="128" y2="142"/>
                <!-- plateforme d'assistance, solidaire des genoux -->
                <line class="mo-pad" x1="94" y1="142" x2="134" y2="142"/>
                <line class="mo-gear" x1="134" y1="142" x2="146" y2="142"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M160 62 L160 92 M155 84 L160 92 L165 84"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M160 92 L160 62 M155 70 L160 62 L165 70"/>` }
  ]
};

/* =========================================================
   86. EXTENSION NUQUE À LA CORDE (POULIE BASSE)
       (extension-corde-nuque-poulie)
   -----------------------------------------------------------
   Position  : DEBOUT, DOS à une poulie BASSE, la corde passée
               derrière la nuque, coudes pointés vers le CIEL,
               buste légèrement penché en avant.
   Mobile    : le COUDE seul.
   Fixes     : le BRAS — « coudes qui s'écartent » est l'erreur
               n°1, le cercle pointillé marque la position que le
               coude ne doit pas quitter ; le BUSTE — « buste qui
               plonge » est l'erreur n°2.
   >>> POURQUOI LE BUSTE EST PENCHÉ EN AVANT, ET PAS DROIT <<<
       Le câble part d'une poulie placée DERRIÈRE le lifter et
       tire donc les mains vers l'arrière-bas. Debout parfaitement
       vertical, ce couple n'est équilibré par rien et le corps
       recule. L'inclinaison du tronc (épaule 106,74 → hanche
       112,114, soit 8,5° vers l'avant) est la contrepartie
       mécanique de cette traction : elle ramène le centre de
       gravité en avant du pied. Ce n'est pas un détail de style,
       c'est ce qui rend la position tenable.
   >>> POURQUOI LE BRAS SE TEND VERS L'AVANT-HAUT, ET PAS VERS
       L'ARRIÈRE <<< La fiche dit « tends les bras vers
       l'avant-haut ». Ce n'est pas une nuance : à 175° de coude
       il y a DEUX positions possibles, l'avant-bras dépassant la
       verticale du bras vers l'avant ou vers l'arrière, et elles
       sont symétriques par rapport à l'alignement parfait. C'est
       celle de l'avant qui est dessinée (avant-bras à −87,87°,
       main en 110,96/16,02), et le balayage vaut donc 153° et non
       130° : la main passe PAR-DESSUS le coude au lieu de rester
       derrière.
   ROM       : coude de 32° (flexion profonde, corde sur la nuque)
               à 175°, soit 143° — et 153° de rotation d'avant-bras.
               « Amplitude courte » est l'erreur n°3.
   POURQUOI LE CHEF LONG : c'est l'inverse exact du schéma 82
               (extension un bras à la poulie, épaule neutre →
               chefs latéral et médial). Ici l'épaule est
               FLÉCHIE à fond, bras à la verticale : le chef long,
               seul des trois à franchir l'épaule, est mis en
               ÉTIREMENT maximal avant même que le coude bouge.
               C'est toute la raison d'être de l'exercice.
   >>> ICI LE CRITÈRE DU POINT MORT RÉPOND OUI, ET LA FICHE EST
       DÉMENTIE SUR UN POINT <<< Critère établi au schéma 82 : il
       y a point mort si — et seulement si — la direction COUDE ->
       POULIE tombe DANS le secteur balayé par l'avant-bras.
       Direction coude->poulie : 61,03°. Secteur balayé : de
       65,13° à −87,87°. 61,03 est DEDANS. Il existe donc une
       position — et une seule — où le câble tire exactement dans
       l'axe de l'avant-bras, ne produit aucun couple sur le
       coude, et où le triceps n'a mécaniquement rien à faire.
       Elle tombe à 4,10° du départ, soit à 2,7 % de l'amplitude :
       autant dire à la position d'étirement elle-même.
         t      0    1/6    2/6    3/6    4/6    5/6      1
         levier 2,33 11,7  21,7  25,9  24,6  19,3  11,4
       La fiche annonce « tension continue ». C'est vrai sur les
       cinq sixièmes hauts, c'est FAUX en bas : le levier y vaut
       2,33 et passe par zéro juste avant. Conséquence pratique,
       mesurée et non supposée : la position basse est celle où le
       chef long est le plus ÉTIRÉ et en même temps celle où il
       est le moins CHARGÉ. Les deux ne coïncident pas, et c'est
       exactement ce qui distingue cette version de l'extension
       nuque à l'haltère, où la charge est verticale et le levier
       maximal en bas.
   Sens      : extension du coude vers le haut-avant = concentrique ;
               retour lent derrière la nuque = excentrique.
   Agonistes : TRICEPS, chef long avant tout.
   Distinction : ≠ extension nuque haltère (résistance verticale,
               levier maximal en bas et nul en haut — l'exact
               opposé de la courbe ci-dessus) ; ≠ extension un bras
               poulie haute (épaule neutre) ; ≠ extension poulie à
               la barre (épaule neutre, poulie haute).
   GÉOMÉTRIE (calculée) — sol y=166 ; poulie (172,154) ; épaule
   (106,74) ; bras 32,25 FIXE vers le haut ; coude (110,42) ;
   avant-bras 26 ; direction coude->épaule 97,13°.
     départ main (120.94,65.59)   fin main (110.96,16.02)
   -> avant-bras −153° ; câble rotation NON monotone (+12,70° au
      plus puis redescente à +6,15°) et allongement ×1,4778,
      échantillonnés sur six intervalles.
   ========================================================= */
EXERCISE_MOTIONS["extension-corde-nuque-poulie"] = {
  vb: "82 8 102 166",
  dur: 3.8,
  phases: { con: [0, 34], ecc: [42, 90] },
  alt: "Debout de profil, dos à une poulie basse, la corde derrière la nuque et les coudes pointés vers le ciel : les avant-bras se déplient vers le haut et l'avant jusqu'aux bras tendus, puis reviennent lentement derrière la nuque.",
  fixe: `
    <line class="mo-ground" x1="86" y1="166" x2="180" y2="166"/>
    <!-- colonne et poulie BASSE, derrière le lifter -->
    <line class="mo-gear" x1="176" y1="20" x2="176" y2="166"/>
    <circle class="mo-pulley" cx="172" cy="154" r="5"/>
    <!-- corps debout de profil, face à gauche, dos à la poulie,
         buste légèrement penché en avant (voir analyse) -->
    <circle class="mo-head" cx="95" cy="56" r="9"/>
    <line class="mo-body" x1="99.7" y1="63.7" x2="106" y2="74"/>
    <line class="mo-body" x1="106" y1="74" x2="112" y2="114"/>
    <line class="mo-body" x1="112" y1="114" x2="110" y2="139"/>
    <line class="mo-body" x1="110" y1="139" x2="106" y2="166"/>
    <!-- BRAS : fixe, à la verticale, coude vers le ciel.
         De profil les deux bras se superposent : un seul est dessiné.
         La tête est reculée à x=95 pour que le bras levé ne se
         confonde pas avec le crâne — il passe à 13,25 du centre. -->
    <line class="mo-limb" x1="106" y1="74" x2="110" y2="42"/>
    <circle class="mo-joint" cx="110" cy="42" r="2.8"/>
    <!-- le coude ne doit pas quitter ce cercle -->
    <circle class="mo-rom" fill="none" cx="110" cy="42" r="8"/>
    <!-- amplitude : l'arc réellement parcouru par les mains, 153° -->
    <path class="mo-rom" fill="none" d="M120.94 65.59 A26 26 0 0 0 110.96 16.02"/>`,
  muscles: [
    { nom: "Triceps (chef long, étiré)",
      svg: `<ellipse cx="111.5" cy="58" rx="3.2" ry="10" transform="rotate(7.13 111.5 58)"/>` }
  ],
  parts: [
    {
      /* CÂBLE : la corde monte de la poulie basse jusqu'aux mains.
         Rotation NON monotone (+12,70° puis retour à +6,15°) et
         allongement ×1,4778, échantillonnés sur l'arc réel des mains :
         caler sur les deux extrêmes seulement décrocherait la corde. */
      o: "172px 154px",
      k: [[0, "rotate(0deg) scale(1)"], [5.67, "rotate(6.26deg) scale(1.021)"],
          [11.33, "rotate(10.81deg) scale(1.0958)"], [17, "rotate(12.7deg) scale(1.2016)"],
          [22.67, "rotate(12.11deg) scale(1.3133)"], [28.33, "rotate(9.71deg) scale(1.4102)"],
          [34, "rotate(6.15deg) scale(1.4778)"], [42, "rotate(6.15deg) scale(1.4778)"],
          [50, "rotate(9.71deg) scale(1.4102)"], [58, "rotate(12.11deg) scale(1.3133)"],
          [66, "rotate(12.7deg) scale(1.2016)"], [74, "rotate(10.81deg) scale(1.0958)"],
          [82, "rotate(6.26deg) scale(1.021)"], [90, "rotate(0deg) scale(1)"],
          [100, "rotate(0deg) scale(1)"]],
      svg: `<line class="mo-cable" x1="172" y1="154" x2="120.94" y2="65.59"/>`
    },
    {
      /* AVANT-BRAS + CORDE : rotation autour du COUDE (110,42), −153°.
         Même grille de keyframes que le câble — l'easing étant appliqué
         PAR SEGMENT, deux grilles différentes se désynchroniseraient
         entre les instants clés. */
      o: "110px 42px",
      k: [[0, "rotate(0deg)"], [5.67, "rotate(-25.5deg)"], [11.33, "rotate(-51deg)"],
          [17, "rotate(-76.5deg)"], [22.67, "rotate(-102deg)"], [28.33, "rotate(-127.5deg)"],
          [34, "rotate(-153deg)"], [42, "rotate(-153deg)"],
          [50, "rotate(-127.5deg)"], [58, "rotate(-102deg)"], [66, "rotate(-76.5deg)"],
          [74, "rotate(-51deg)"], [82, "rotate(-25.5deg)"], [90, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      svg: `
        <line class="mo-limb" x1="110" y1="42" x2="120.94" y2="65.59"/>
        <line class="mo-bar2" x1="125.47" y1="63.48" x2="116.4" y2="67.69"/>
        <circle class="mo-hand" cx="120.94" cy="65.59" r="3"/>`
    }
  ],
  arrows: [
    /* x=155 : le câble balaie jusqu'à x=143,3 dans la bande y∈[28,62]
       (maximum atteint en bas de la bande) — une flèche plus à gauche
       se confondrait avec lui, ils ont la même couleur d'accent. */
    { phase: "con", svg: `<path class="mo-arr" d="M155 62 L155 28 M150 36 L155 28 L160 36"/>` },
    { phase: "ecc", svg: `<path class="mo-arr" d="M155 28 L155 62 M150 54 L155 62 L160 54"/>` }
  ]
};

/* =========================================================
   87. FRONT SQUAT (SQUAT AVANT)  (front-squat)
   -----------------------------------------------------------
   Position  : DEBOUT, barre posée sur l'AVANT des épaules
               (rack avant), coudes hauts, pieds largeur d'épaules.
   Mobiles   : CHEVILLE, GENOU, HANCHE — chaîne ouverte enracinée
               au pied, exactement comme le squat barre.
   Fixes     : le PIED, ancré au sol ; le dos, segment RIGIDE qui
               bascule sans s'arrondir (« dos qui s'arrondit » est
               l'erreur n°3) ; le TALON, qui ne décolle pas
               (erreur n°2) — c'est pour cela que le pied est
               dessiné entier et que la cheville est placée à sa
               vraie position dans le pied, à 6 unités du talon
               sur 22 de longueur, soit 27 % : le milieu du pied
               tombe donc 4,4 unités EN AVANT de la cheville, et
               c'est là que passe l'aplomb.
   >>> LA SEULE DIFFÉRENCE AVEC LE SQUAT BARRE, ET ELLE SE CALCULE
       <<< Les deux exercices ont la même chaîne, le même sol, la
       même contrainte : la barre reste à l'aplomb du milieu du
       pied. Ce qui change, c'est UNIQUEMENT la position de la
       barre par rapport au tronc :
         - rack avant : 4 unités EN AVANT de l'articulation de
           l'épaule (la barre repose sur les deltoïdes antérieurs) ;
         - barre haute : 1 unité EN ARRIÈRE (elle repose sur les
           trapèzes).
       5 unités d'écart, sur un tronc de 32. Le système ne peut
       les absorber que d'une seule façon : en tournant le tronc.
       À PROFONDEUR ET DORSIFLEXION STRICTEMENT IDENTIQUES
       (32° de dorsiflexion, cuisse 5° sous l'horizontale), le
       calcul donne :
         front squat   20,44° d'inclinaison du tronc
         squat barre   31,09° d'inclinaison du tronc
       soit 10,65° de moins. Voilà tout l'exercice : « le buste
       reste vertical » n'est pas une consigne de style qu'on
       pourrait appliquer au squat barre si on faisait attention,
       c'est une CONSÉQUENCE géométrique de l'endroit où est posée
       la barre. Et réciproquement, coudes qui tombent = barre qui
       roule vers l'avant = la contrainte n'est plus tenable :
       c'est bien l'erreur n°1 de la fiche.
   >>> CE QUE LE CALCUL A RÉVÉLÉ SUR L'ANIMATION ELLE-MÊME <<<
       Le tronc ne bascule PAS de façon monotone. Il s'incline
       jusqu'à 23,41° aux cinq sixièmes de la descente, puis se
       REDRESSE de 3° pour finir à 20,44°. En n'inscrivant que les
       deux positions extrêmes, l'interpolation linéaire des trois
       rotations aurait fait sortir la barre de l'aplomb de 5,83
       unités à mi-descente (≈ 9 cm à l'échelle) :
         f      1/6   2/6   3/6   4/6   5/6
         écart +2,58 +4,69 +5,83 +5,61 +3,72
       Sur un exercice dont TOUT le propos est la trajectoire de
       barre, c'était inacceptable. Les trois segments sont donc
       échantillonnés sur six intervalles, l'angle du tronc étant
       à chaque instant RÉSOLU pour que la barre reste sur
       l'aplomb — pas interpolé.
   ROM       : dorsiflexion 0 → 32° ; genou jusqu'à la cuisse 5°
               SOUS l'horizontale (le front squat se fait sous la
               parallèle, l'inverse du « demi-squat ») ; hanche
               de 86,0 à 118,5 en ordonnée, soit 32,5 de descente.
   À NOTER    : l'épaule ne se déplace que de 1,70 unité à
               l'horizontale sur toute la descente (119,00 →
               120,70). La trajectoire d'un front squat correct
               est une VERTICALE, et le schéma le montre.
   Agonistes : QUADRICEPS (dominants), grand fessier, haut du dos
               et érecteurs pour tenir le rack.
   Distinction : ≠ squat barre (barre sur les trapèzes, 31,09° de
               tronc contre 20,44°) ; ≠ squat gobelet (charge
               légère tenue devant la poitrine, pas de rack) ;
               ≠ presse à cuisses (dos appuyé, aucun gainage).
   GÉOMÉTRIE (calculée) — sol y=150 ; pied 104→126 ; cheville
   (120,138) ; tibia 26 ; cuisse 26 ; tronc 32 ; barre à 37,1 le
   long du tronc et 4 en avant ; aplomb x=115.
   ========================================================= */
EXERCISE_MOTIONS["front-squat"] = {
  vb: "94 24 54 130",
  dur: 4.6,
  phases: { ecc: [0, 42], con: [50, 82] },
  alt: "Barre posée sur l'avant des épaules, coudes hauts : descente jusqu'à la cuisse sous l'horizontale en gardant le buste presque vertical, la barre suivant l'aplomb du milieu du pied, puis remontée.",
  fixe: `
    <line class="mo-ground" x1="98" y1="150" x2="140" y2="150"/>
    <!-- pied ancré au sol : racine de toute la chaîne.
         Cheville à 6 du talon (126) et 16 des orteils (104) : le
         milieu du pied, donc l'aplomb, tombe à x=115. -->
    <line class="mo-limb" x1="104" y1="150" x2="126" y2="150"/>
    <line class="mo-limb" x1="120" y1="138" x2="106" y2="150"/>
    <line class="mo-limb" x1="120" y1="138" x2="125" y2="150"/>
    <!-- APLOMB DU MILIEU DU PIED : la barre ne le quitte jamais -->
    <line class="mo-rom" x1="115" y1="28" x2="115" y2="150"/>`,
  parts: [
    {
      /* TIBIA : rotation autour de la CHEVILLE (120,138). −32,00°
         = 32° de dorsiflexion, bien plus qu'au squat barre : c'est
         ce que coûte un buste vertical. */
      o: "120px 138px",
      k: [[0, "rotate(0deg)"], [7, "rotate(-5.33deg)"], [14, "rotate(-10.67deg)"],
          [21, "rotate(-16deg)"], [28, "rotate(-21.33deg)"], [35, "rotate(-26.67deg)"],
          [42, "rotate(-32deg)"], [50, "rotate(-32deg)"],
          [55.33, "rotate(-26.67deg)"], [60.67, "rotate(-21.33deg)"], [66, "rotate(-16deg)"],
          [71.33, "rotate(-10.67deg)"], [76.67, "rotate(-5.33deg)"], [82, "rotate(0deg)"],
          [100, "rotate(0deg)"]],
      svg: `
        <circle class="mo-joint" cx="120" cy="138" r="2.8"/>
        <line class="mo-limb" x1="120" y1="138" x2="119.5" y2="112"/>`,
      children: [
        {
          /* CUISSE : +128,11° relatif. En bas elle est 5° SOUS
             l'horizontale — la hanche passe sous le genou. */
          o: "119.5px 112px",
          k: [[0, "rotate(0deg)"], [7, "rotate(21.35deg)"], [14, "rotate(42.7deg)"],
              [21, "rotate(64.06deg)"], [28, "rotate(85.41deg)"], [35, "rotate(106.76deg)"],
              [42, "rotate(128.11deg)"], [50, "rotate(128.11deg)"],
              [55.33, "rotate(106.76deg)"], [60.67, "rotate(85.41deg)"], [66, "rotate(64.06deg)"],
              [71.33, "rotate(42.7deg)"], [76.67, "rotate(21.35deg)"], [82, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          muscleNom: ["Quadriceps", "Grand fessier"],
          muscle: `
            <ellipse cx="116.4" cy="99" rx="3.6" ry="10" transform="rotate(1.1 116.4 99)"/>
            <circle cx="122.5" cy="90" r="4.5"/>`,
          svg: `
            <circle class="mo-joint" cx="119.5" cy="112" r="2.8"/>
            <line class="mo-limb" x1="119.5" y1="112" x2="119" y2="86"/>`,
          children: [
            {
              /* TRONC + RACK AVANT : −116,55° relatif au total, mais
                 RÉSOLU à chaque échantillon pour tenir l'aplomb, pas
                 interpolé (voir l'analyse : 5,83 d'écart sinon). Le
                 dos est un segment rigide, la barre lui est solidaire. */
              o: "119px 86px",
              k: [[0, "rotate(0deg)"], [7, "rotate(-23.47deg)"], [14, "rotate(-46.37deg)"],
                  [21, "rotate(-67.9deg)"], [28, "rotate(-87.18deg)"], [35, "rotate(-103.5deg)"],
                  [42, "rotate(-116.55deg)"], [50, "rotate(-116.55deg)"],
                  [55.33, "rotate(-103.5deg)"], [60.67, "rotate(-87.18deg)"], [66, "rotate(-67.9deg)"],
                  [71.33, "rotate(-46.37deg)"], [76.67, "rotate(-23.47deg)"], [82, "rotate(0deg)"],
                  [100, "rotate(0deg)"]],
              muscleNom: "Haut du dos et érecteurs (gainage)",
              muscle: `<ellipse cx="121.6" cy="66" rx="2.8" ry="11"/>`,
              svg: `
                <circle class="mo-joint" cx="119" cy="86" r="2.8"/>
                <line class="mo-body" x1="119" y1="86" x2="119" y2="54"/>
                <!-- disque vu de profil : la barre est SUR l'avant des
                     épaules, donc son disque recouvre en partie la tête ;
                     la tête est dessinée après, pleine, pour rester lisible
                     (même convention qu'au squat barre). -->
                <circle class="mo-plate-o" cx="115" cy="48.91" r="10"/>
                <circle class="mo-hub" cx="115" cy="48.91" r="2.6"/>
                <!-- COUDES HAUTS : bras à l'horizontale vers l'avant,
                     avant-bras replié sur la barre. C'est l'étagère qui
                     tient la barre — s'il s'effondre, elle roule. -->
                <line class="mo-limb" x1="119" y1="54" x2="100" y2="53"/>
                <circle class="mo-joint" cx="100" cy="53" r="2.4"/>
                <line class="mo-limb" x1="100" y1="53" x2="113.5" y2="47.8"/>
                <line class="mo-body" x1="119" y1="54" x2="113" y2="44.5"/>
                <circle class="mo-head mo-head-solid" cx="111" cy="36" r="9"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M141 60 L141 100 M136 92 L141 100 L146 92"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M141 100 L141 60 M136 68 L141 60 L146 68"/>` }
  ]
};

/* =========================================================
   88. HACK SQUAT (MACHINE)  (hack-squat)
   -----------------------------------------------------------
   Position  : DEBOUT sur un plateau FIXE incliné, dos et épaules
               calés contre un chariot qui coulisse sur un rail à
               45°. Pieds largeur d'épaules.
   Mobiles   : le CHARIOT (translation pure le long du rail, il ne
               tourne PAS), et la chaîne CUISSE + TIBIA qui relie
               la hanche — solidaire du chariot — à la cheville,
               posée sur le plateau fixe. CHAÎNE FERMÉE.
   Fixes     : le PLATEAU et le rail ; le TRONC, qui ne change
               jamais d'orientation : il reste parallèle au rail
               d'un bout à l'autre.
   >>> CE QUI CHANGE VRAIMENT PAR RAPPORT AU SQUAT : LA CONTRAINTE
       DISPARAÎT <<< Aux schémas 25 et 87 (squat barre, front
       squat), TOUTE la géométrie découlait d'une seule contrainte :
       la barre reste à l'aplomb du milieu du pied. C'est elle qui
       imposait l'angle du tronc, et c'est elle qui rendait
       l'exercice difficile à équilibrer. Ici, le rail la remplace :
       la ligne d'action est tenue par la machine. Conséquence
       directe, et c'est exactement ce que dit la fiche par
       « sans contrainte d'équilibre » : l'angle du tronc n'est
       plus une variable à calculer, c'est une CONSTANTE de la
       machine. Le schéma le montre en dessinant le tronc comme un
       bloc en translation, sans la moindre rotation.
   >>> ET PAR RAPPORT À LA PRESSE À CUISSES : LES RÔLES SONT
       INVERSÉS <<< Les deux ont la même chaîne fermée hanche →
       genou → cheville → plateau, et le même rail à 45°. Mais :
         presse  : le TRONC est fixe, le CHARIOT s'éloigne ;
         hack    : le CHARIOT porte le tronc, le PLATEAU est fixe.
       Cinématiquement c'est le même mouvement relatif ; ce qui
       diffère est ce qu'on soulève. À la presse le corps ne monte
       pas : seule la charge est déplacée. Au hack squat le lifter
       se soulève LUI-MÊME en plus du chariot, et sur un rail à 45°
       la résistance vaut cos(45°) = 0,707 fois le poids total
       chariot + haut du corps. C'est le seul des deux où le poids
       de corps compte.
   >>> L'INCLINAISON DU PLATEAU N'EST PAS CHOISIE, ELLE EST
       DÉDUITE <<< « Décoller les talons » est l'erreur n°1. Le
       talon reste au contact tant que le tibia n'a pas à se
       coucher sur le plateau. J'ai donc pris l'inclinaison qui
       rend le tibia PERPENDICULAIRE au plateau dans la position
       basse : 14,2° au-dessus de l'horizontale, pointes hautes.
       En haut le tibia est à 24,8° de cette perpendiculaire, en
       bas à 0° — la cheville est donc au plus près du neutre
       précisément là où la flexion est la plus profonde, ce qui
       est toute la raison d'être d'un plateau incliné. (Les
       machines réelles varient autour de cette valeur ; c'est la
       relation qui compte, pas le chiffre.)
   ROM       : genou de 157,2° (haut, non verrouillé — la fiche
               dit « sans verrouiller brutalement ») à 85,9°, soit
               71,4° de flexion. Le chariot parcourt 16 unités le
               long du rail. « Amplitude minuscule chargée lourd »
               est l'erreur n°3.
   >>> CHAÎNE FERMÉE : IL A FALLU RÉSOUDRE, PAS INTERPOLER <<<
       Le pied ne quitte jamais le plateau. En n'inscrivant que
       les deux positions extrêmes, l'interpolation linéaire des
       deux rotations décollait la cheville de 2,25 unités à
       mi-course. Le genou est donc calculé par intersection de
       cercles à chaque échantillon (six intervalles), et les
       angles DÉROULÉS — sans quoi le solveur produisait des
       keyframes à −335° et +315°, un tour complet parasite en
       plein milieu de la descente.
   Agonistes : QUADRICEPS, grand fessier.
   Distinction : ≠ presse à cuisses (tronc fixe, corps non soulevé) ;
               ≠ squat barre (aplomb à tenir, tronc variable) ;
               ≠ sissy squat (pas de charge guidée, hanche tendue).
   GÉOMÉTRIE (calculée) — cheville FIXE (73,125) ; hanche haute
   (115.36,96.64) ; cuisse 26 ; tibia 26 ; rail à −45° ; course
   du chariot 16 ; plateau à 14,2°.
   ========================================================= */
EXERCISE_MOTIONS["hack-squat"] = {
  vb: "48 52 124 102",
  dur: 4.4,
  phases: { ecc: [0, 42], con: [50, 82] },
  alt: "Debout sur le plateau incliné d'une machine à hack squat, dos calé contre le chariot : le chariot descend le long du rail à 45° jusqu'à 86° de flexion des genoux, puis remonte, le tronc gardant exactement la même orientation.",
  fixe: `
    <line class="mo-ground" x1="46" y1="150" x2="174" y2="150"/>
    <!-- RAIL à 45° : c'est lui qui remplace l'aplomb du squat -->
    <line class="mo-gear" x1="100" y1="126" x2="168" y2="58"/>
    <line class="mo-gear" x1="168" y1="58" x2="168" y2="150"/>
    <line class="mo-gear" x1="100" y1="126" x2="100" y2="150"/>
    <!-- PLATEAU FIXE incliné à 14,2° : l'inclinaison qui rend le
         tibia perpendiculaire au plateau en position basse. -->
    <line class="mo-gear" x1="84.61" y1="136.19" x2="51.65" y2="127.86"/>
    <line class="mo-gear" x1="84.61" y1="136.19" x2="84.61" y2="150"/>
    <line class="mo-gear" x1="51.65" y1="127.86" x2="51.65" y2="150"/>
    <!-- PIED : posé à plat, cheville reliée au talon ET à l'avant.
         Le talon ne décolle pas — erreur n°1 de la fiche. -->
    <line class="mo-limb" x1="77.83" y1="134.48" x2="60.38" y2="130.06"/>
    <line class="mo-limb" x1="73" y1="125" x2="77.83" y2="134.48"/>
    <line class="mo-limb" x1="73" y1="125" x2="66.48" y2="131.61"/>
    <circle class="mo-joint" cx="73" cy="125" r="2.8"/>`,
  parts: [
    {
      /* CHARIOT + TRONC : TRANSLATION PURE le long du rail, 16 unités.
         Aucune rotation : le tronc garde exactement son orientation,
         c'est la définition même de la machine. */
      k: [[0, "translate(0px,0px)"], [7, "translate(-1.89px,1.89px)"],
          [14, "translate(-3.77px,3.77px)"], [21, "translate(-5.66px,5.66px)"],
          [28, "translate(-7.54px,7.54px)"], [35, "translate(-9.43px,9.43px)"],
          [42, "translate(-11.31px,11.31px)"], [50, "translate(-11.31px,11.31px)"],
          [55.33, "translate(-9.43px,9.43px)"], [60.67, "translate(-7.54px,7.54px)"],
          [66, "translate(-5.66px,5.66px)"], [71.33, "translate(-3.77px,3.77px)"],
          [76.67, "translate(-1.89px,1.89px)"], [82, "translate(0px,0px)"],
          [100, "translate(0px,0px)"]],
      svg: `
        <!-- dossier et coussinets d'épaules, solidaires du chariot -->
        <line class="mo-pad" x1="124" y1="92.94" x2="141.9" y2="75"/>
        <line class="mo-pad" x1="136" y1="68" x2="146" y2="78"/>
        <line class="mo-body" x1="115.36" y1="96.64" x2="137.99" y2="74.01"/>
        <line class="mo-body" x1="137.99" y1="74.01" x2="142.99" y2="68.01"/>
        <circle class="mo-head" cx="149" cy="62" r="8.5"/>
        <!-- bras aux poignées, dessinés en avant du tronc -->
        <line class="mo-limb" x1="137.99" y1="74.01" x2="127" y2="80"/>
        <line class="mo-limb" x1="127" y1="80" x2="132" y2="72"/>
        <line class="mo-bar3" x1="135.4" y1="74.1" x2="128.6" y2="69.9"/>
        <circle class="mo-joint" cx="115.36" cy="96.64" r="2.8"/>`,
      children: [
        {
          /* CUISSE : rotation autour de la HANCHE, qui voyage avec le
             chariot. +40,72° au total, mais RÉSOLU par intersection de
             cercles à chaque échantillon — la chaîne est fermée. */
          o: "115.36px 96.64px",
          k: [[0, "rotate(0deg)"], [7, "rotate(10.78deg)"], [14, "rotate(18.28deg)"],
              [21, "rotate(24.59deg)"], [28, "rotate(30.27deg)"], [35, "rotate(35.6deg)"],
              [42, "rotate(40.72deg)"], [50, "rotate(40.72deg)"],
              [55.33, "rotate(35.6deg)"], [60.67, "rotate(30.27deg)"], [66, "rotate(24.59deg)"],
              [71.33, "rotate(18.28deg)"], [76.67, "rotate(10.78deg)"], [82, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          muscleNom: ["Quadriceps", "Grand fessier"],
          muscle: `
            <ellipse cx="102" cy="98.4" rx="3.4" ry="9.5" transform="rotate(67.58 102 98.4)"/>
            <circle cx="118" cy="101" r="4.2"/>`,
          svg: `<line class="mo-limb" x1="115.36" y1="96.64" x2="91.33" y2="106.56"/>`,
          children: [
            {
              /* TIBIA : −71,37° relatif. Son extrémité retombe exactement
                 sur la cheville fixe (73,125) à chacun des sept
                 échantillons — c'est la contrainte de fermeture. */
              o: "91.33px 106.56px",
              k: [[0, "rotate(0deg)"], [7, "rotate(-20.34deg)"], [14, "rotate(-33.96deg)"],
                  [21, "rotate(-45.05deg)"], [28, "rotate(-54.69deg)"], [35, "rotate(-63.38deg)"],
                  [42, "rotate(-71.37deg)"], [50, "rotate(-71.37deg)"],
                  [55.33, "rotate(-63.38deg)"], [60.67, "rotate(-54.69deg)"], [66, "rotate(-45.05deg)"],
                  [71.33, "rotate(-33.96deg)"], [76.67, "rotate(-20.34deg)"], [82, "rotate(0deg)"],
                  [100, "rotate(0deg)"]],
              svg: `
                <circle class="mo-joint" cx="91.33" cy="106.56" r="2.8"/>
                <line class="mo-limb" x1="91.33" y1="106.56" x2="73" y2="125"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M90 74 L66 98 M68.07 90.27 L66 98 L73.73 95.93"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M66 98 L90 74 M87.93 81.73 L90 74 L82.27 76.07"/>` }
  ]
};

/* =========================================================
   89. SQUAT SUMO  (squat-sumo)   — VU DE FACE
   -----------------------------------------------------------
   >>> POURQUOI CE SCHÉMA EST LE PREMIER SQUAT VU DE FACE <<<
       Les trois erreurs de la fiche sont « genoux qui rentrent »,
       « buste qui plonge », « pointes de pieds pas alignées avec
       les genoux ». La première et la troisième se produisent
       ENTIÈREMENT dans le plan frontal : de profil, un genou qui
       rentre et un genou qui sort se projettent exactement au
       même endroit. Et ce que la fiche annonce — pieds très
       écartés, pointes à 45° — est strictement invisible de
       profil. Un schéma sagittal aurait donc été un quasi-doublon
       du squat barre montrant zéro information propre au sumo.
       D'où la vue de FACE, et le badge qui le signale.
   Position  : DEBOUT, barre sur les trapèzes, pieds bien plus
               larges que les épaules (68 unités d'écart entre
               chevilles contre 16 entre hanches), pointes à 45°.
   Mobiles   : le TRONC (translation verticale pure) et les DEUX
               jambes. CHAÎNE FERMÉE DOUBLE : les deux chevilles
               sont fixes au sol et le bassin est rigide.
   Fixes     : les PIEDS ; le bassin ne peut pas dériver
               latéralement — par symétrie il n'y a aucune raison
               qu'il le fasse, et le tronc descend donc à la
               verticale stricte.
   >>> À QUOI RESSEMBLE UN PIED À 45° VU DE FACE <<< Ce n'est pas
       un détail de dessin. Un pied dont l'axe pointe à 45° vers
       l'extérieur ET vers l'avant se projette sur le plan frontal
       en gardant sa composante latérale seule : longueur apparente
       = cos(45°) × longueur réelle, soit 0,707. Sur un pied de 22,
       la cheville étant à 30 % du talon, cela donne 4,67 en dedans
       et 10,89 en dehors. Le pied est donc dessiné COURT et
       purement latéral — c'est exactement ce qu'on voit de face,
       et c'est ce qui rend lisible la consigne « pointes à 45° ».
   >>> CE QUE MESURE VRAIMENT « POUSSER LES GENOUX VERS
       L'EXTÉRIEUR » <<< Sur la descente, le fémur passe de 48,79°
       sous l'horizontale à 0° : 48,79° d'ABDUCTION dans le plan
       frontal, et le genou se déplace de 8,87 unités vers le
       dehors. Voilà pourquoi les ADDUCTEURS figurent dans la liste
       des muscles alors qu'ils n'étendent rien : ils sont les
       ANTAGONISTES de ces 48,79°. « Genoux qui rentrent »,
       l'erreur n°1, c'est littéralement les adducteurs qui
       gagnent. Aucun autre squat de la bibliothèque n'a cette
       excursion frontale.
   >>> UN MUSCLE VOLONTAIREMENT NON MARQUÉ <<< La fiche cite aussi
       les fessiers. Le grand fessier est POSTÉRIEUR : de face il
       est derrière le bassin, invisible. Le marquer quelque part
       sur cette vue reviendrait à le placer là où il n'est pas.
       Il est donc absent du schéma, et c'est délibéré — mieux
       vaut un muscle manquant qu'un muscle mal placé.
   ROM       : genou de 158,74° à 90,00° EXACTEMENT ; en bas le
               fémur est exactement horizontal (parallèle) et le
               tibia exactement vertical, donc le genou pile à
               l'aplomb de la cheville. Le bassin descend de 18.
   >>> LA FLEXION N'EST PAS LINÉAIRE DANS LE TEMPS, ET C'EST VRAI
       <<< Le bassin descend à vitesse constante — c'est ce que
       fait une barre. Il en résulte que le genou ne fléchit PAS
       régulièrement : 20,72° sur le premier sixième contre 7,01°
       sur le dernier. Près de l'extension, quelques unités de
       hauteur coûtent beaucoup d'angle. L'animation le montre :
       les genoux s'écartent vite au départ puis se stabilisent.
   >>> CHAÎNE FERMÉE DOUBLE : RÉSOLUE, PAS INTERPOLÉE <<< Genou
       par intersection de cercles à chaque échantillon, angles
       déroulés, six intervalles. Les deux positions extrêmes
       seules décollaient chaque cheville du sol de 2,56.
   LIMITE ASSUMÉE DE LA PROJECTION : la cuisse dessinée est la
       PROJECTION frontale du fémur. Si la hanche est 6 unités en
       arrière du genou, le fémur réel est 2,5 % plus long que le
       segment dessiné. Sous 3 %, et sans effet sur les angles
       frontaux qui sont justement ce que ce schéma mesure.
   Agonistes : QUADRICEPS, ADDUCTEURS (et fessiers, non marqués).
   Distinction : ≠ squat barre (stance étroite, vue de profil,
               aucune abduction) ; ≠ front squat (position de barre) ;
               ≠ squat gobelet (charge devant, légère).
   GÉOMÉTRIE (calculée) — sol y=150 ; chevilles (66,150) et
   (134,150) ; hanches (92,106) et (108,106) ; cuisse 26 ;
   tibia 26 ; descente du bassin 18.
   ========================================================= */
EXERCISE_MOTIONS["squat-sumo"] = {
  vb: "48 42 102 114",
  dur: 4.4,
  vue: "Vu de face",
  phases: { ecc: [0, 42], con: [50, 82] },
  alt: "Vu de face, barre sur les trapèzes et pieds très écartés pointes ouvertes : le bassin descend à la verticale pendant que les genoux s'écartent vers l'extérieur jusqu'à la cuisse parallèle au sol, puis remontée.",
  fixe: `
    <line class="mo-ground" x1="50" y1="150" x2="150" y2="150"/>
    <!-- PIEDS à 45° vus de face : projection latérale seule,
         4,67 en dedans de la cheville et 10,89 en dehors. -->
    <line class="mo-limb" x1="129.33" y1="150" x2="144.89" y2="150"/>
    <line class="mo-limb" x1="70.67" y1="150" x2="55.11" y2="150"/>
    <circle class="mo-joint" cx="134" cy="150" r="2.8"/>
    <circle class="mo-joint" cx="66" cy="150" r="2.8"/>
    <!-- AXE PIED-GENOU : en bas le genou tombe exactement dessus.
         « Pointes pas alignées avec les genoux » est l'erreur n°3. -->
    <line class="mo-rom" x1="134" y1="104" x2="134" y2="150"/>
    <line class="mo-rom" x1="66" y1="104" x2="66" y2="150"/>`,
  parts: [
    {
      /* TRONC + BASSIN + BARRE : translation VERTICALE pure de 18.
         Par symétrie le bassin n'a aucune raison de dériver
         latéralement, et « buste droit » (erreur n°2) est ce qui rend
         la projection frontale honnête : un buste qui plonge se
         raccourcirait de face et le schéma mentirait. */
      k: [[0, "translate(0px,0px)"], [7, "translate(0px,3px)"], [14, "translate(0px,6px)"],
          [21, "translate(0px,9px)"], [28, "translate(0px,12px)"], [35, "translate(0px,15px)"],
          [42, "translate(0px,18px)"], [50, "translate(0px,18px)"],
          [55.33, "translate(0px,15px)"], [60.67, "translate(0px,12px)"], [66, "translate(0px,9px)"],
          [71.33, "translate(0px,6px)"], [76.67, "translate(0px,3px)"], [82, "translate(0px,0px)"],
          [100, "translate(0px,0px)"]],
      svg: `
        <line class="mo-body" x1="92" y1="106" x2="108" y2="106"/>
        <line class="mo-body" x1="86" y1="66" x2="92" y2="106"/>
        <line class="mo-body" x1="114" y1="66" x2="108" y2="106"/>
        <line class="mo-body" x1="86" y1="66" x2="114" y2="66"/>
        <line class="mo-body" x1="100" y1="66" x2="100" y2="61"/>
        <circle class="mo-head" cx="100" cy="54" r="9"/>
        <line class="mo-limb" x1="86" y1="66" x2="80" y2="80"/>
        <line class="mo-limb" x1="80" y1="80" x2="78" y2="67"/>
        <line class="mo-limb" x1="114" y1="66" x2="120" y2="80"/>
        <line class="mo-limb" x1="120" y1="80" x2="122" y2="67"/>
        <!-- barre vue de face : les disques sont vus par la tranche -->
        <line class="mo-bar3" x1="68" y1="66" x2="132" y2="66"/>
        <rect class="mo-mass" x="68" y="56" width="4" height="20" rx="1.5"/>
        <rect class="mo-mass" x="128" y="56" width="4" height="20" rx="1.5"/>
        <circle class="mo-joint" cx="108" cy="106" r="2.8"/>
        <circle class="mo-joint" cx="92" cy="106" r="2.8"/>`,
      children: [
        {
          /* CUISSE DROITE : rotation autour de la hanche, qui descend
             avec le bassin. −48,79° = l'abduction frontale complète. */
          o: "108px 106px",
          k: [[0, "rotate(0deg)"], [7, "rotate(-12.16deg)"], [14, "rotate(-20.86deg)"],
              [21, "rotate(-28.42deg)"], [28, "rotate(-35.43deg)"], [35, "rotate(-42.16deg)"],
              [42, "rotate(-48.79deg)"], [50, "rotate(-48.79deg)"],
              [55.33, "rotate(-42.16deg)"], [60.67, "rotate(-35.43deg)"], [66, "rotate(-28.42deg)"],
              [71.33, "rotate(-20.86deg)"], [76.67, "rotate(-12.16deg)"], [82, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          muscleNom: ["Quadriceps", "Adducteurs"],
          muscle: `
            <ellipse cx="116.57" cy="115.78" rx="4" ry="10" transform="rotate(-41.21 116.57 115.78)"/>
            <ellipse cx="109.38" cy="115.16" rx="2.6" ry="7" transform="rotate(-41.21 109.38 115.16)"/>`,
          svg: `<line class="mo-limb" x1="108" y1="106" x2="125.13" y2="125.56"/>`,
          children: [
            {
              /* TIBIA DROIT : +68,74° relatif. Il retombe exactement sur
                 la cheville fixe (134,150) aux sept échantillons. */
              o: "125.13px 125.56px",
              k: [[0, "rotate(0deg)"], [7, "rotate(20.72deg)"], [14, "rotate(34.13deg)"],
                  [21, "rotate(44.78deg)"], [28, "rotate(53.83deg)"], [35, "rotate(61.73deg)"],
                  [42, "rotate(68.74deg)"], [50, "rotate(68.74deg)"],
                  [55.33, "rotate(61.73deg)"], [60.67, "rotate(53.83deg)"], [66, "rotate(44.78deg)"],
                  [71.33, "rotate(34.13deg)"], [76.67, "rotate(20.72deg)"], [82, "rotate(0deg)"],
                  [100, "rotate(0deg)"]],
              svg: `
                <circle class="mo-joint" cx="125.13" cy="125.56" r="2.8"/>
                <line class="mo-limb" x1="125.13" y1="125.56" x2="134" y2="150"/>`
            }
          ]
        },
        {
          /* CUISSE GAUCHE : miroir exact. */
          o: "92px 106px",
          k: [[0, "rotate(0deg)"], [7, "rotate(12.16deg)"], [14, "rotate(20.86deg)"],
              [21, "rotate(28.42deg)"], [28, "rotate(35.43deg)"], [35, "rotate(42.16deg)"],
              [42, "rotate(48.79deg)"], [50, "rotate(48.79deg)"],
              [55.33, "rotate(42.16deg)"], [60.67, "rotate(35.43deg)"], [66, "rotate(28.42deg)"],
              [71.33, "rotate(20.86deg)"], [76.67, "rotate(12.16deg)"], [82, "rotate(0deg)"],
              [100, "rotate(0deg)"]],
          muscle: `
            <ellipse cx="83.43" cy="115.78" rx="4" ry="10" transform="rotate(41.21 83.43 115.78)"/>
            <ellipse cx="90.62" cy="115.16" rx="2.6" ry="7" transform="rotate(41.21 90.62 115.16)"/>`,
          svg: `<line class="mo-limb" x1="92" y1="106" x2="74.87" y2="125.56"/>`,
          children: [
            {
              o: "74.87px 125.56px",
              k: [[0, "rotate(0deg)"], [7, "rotate(-20.72deg)"], [14, "rotate(-34.13deg)"],
                  [21, "rotate(-44.78deg)"], [28, "rotate(-53.83deg)"], [35, "rotate(-61.73deg)"],
                  [42, "rotate(-68.74deg)"], [50, "rotate(-68.74deg)"],
                  [55.33, "rotate(-61.73deg)"], [60.67, "rotate(-53.83deg)"], [66, "rotate(-44.78deg)"],
                  [71.33, "rotate(-34.13deg)"], [76.67, "rotate(-20.72deg)"], [82, "rotate(0deg)"],
                  [100, "rotate(0deg)"]],
              svg: `
                <circle class="mo-joint" cx="74.87" cy="125.56" r="2.8"/>
                <line class="mo-limb" x1="74.87" y1="125.56" x2="66" y2="150"/>`
            }
          ]
        }
      ]
    }
  ],
  arrows: [
    { phase: "ecc", svg: `<path class="mo-arr" d="M56 60 L56 100 M51 92 L56 100 L61 92"/>` },
    { phase: "con", svg: `<path class="mo-arr" d="M56 100 L56 60 M51 68 L56 60 L61 68"/>` }
  ]
};
