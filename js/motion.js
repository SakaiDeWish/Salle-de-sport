/* =========================================================
   GymCoach — Schémas animés du mouvement
   Chaque exercice affiche une image SYNTHÉTIQUE animée (SVG
   + CSS, aucun asset externe) montrant le pattern du geste :
   poussée, tirage, squat, hinge, curl… Le personnage est
   volontairement schématique — c'est un diagramme de
   mouvement, pas une photo. Les vidéos restent disponibles.
   ========================================================= */

/* Déduit le pattern moteur d'un exercice (groupe + intitulé) */
function guessPattern(ex) {
  const n = normalize(ex.nom);
  switch (ex.groupe) {
    case "biceps": return "curl";
    case "triceps": return "extension";
    case "mollets": return "calf";
    case "abdos": return n.includes("planche") || n.includes("gainage") || n.includes("hold") ? "plank" : "core";
    case "lombaires": return n.includes("extension") || n.includes("superman") ? "hinge" : "plank";
    case "epaules":
      return (n.includes("elevation") || n.includes("oiseau") || n.includes("raise") || n.includes("face pull"))
        ? "raise" : "push-v";
    case "pectoraux":
      return (n.includes("ecarte") || n.includes("pec-deck") || n.includes("butterfly") || n.includes("pull-over") || n.includes("fly"))
        ? "fly" : "push-h";
    case "dos":
      return (n.includes("traction") || n.includes("tirage vertical") || n.includes("pull"))
        ? "pull-v"
        : (n.includes("souleve") || n.includes("rack")) ? "hinge" : "pull-h";
    case "quadriceps":
      return "squat";
    case "ischios-fessiers":
      return (n.includes("souleve") || n.includes("good morning") || n.includes("swing") || n.includes("nordic"))
        ? "hinge"
        : (n.includes("hip thrust") || n.includes("pont")) ? "bridge" : "squat";
    default: return "push-v";
  }
}

/* Scènes : personnage schématique (traits) + partie mobile animée
   en accent. viewBox 220x120, sol à y=110. */
const MOTION_SCENES = {
  /* poussée allongée (développés couchés, pompes) */
  "push-h": `
    <line class="mo-ground" x1="40" y1="96" x2="180" y2="96"/>
    <line class="mo-body" x1="66" y1="88" x2="150" y2="88"/>
    <circle class="mo-head" cx="58" cy="88" r="7"/>
    <line class="mo-body" x1="132" y1="88" x2="146" y2="108"/>
    <g class="mo-move mo-anim-updown">
      <line class="mo-limb" x1="92" y1="86" x2="92" y2="56"/>
      <line class="mo-bar" x1="60" y1="56" x2="124" y2="56"/>
      <rect class="mo-plate" x="56" y="46" width="7" height="20" rx="2"/>
      <rect class="mo-plate" x="121" y="46" width="7" height="20" rx="2"/>
    </g>`,
  /* poussée verticale (développés épaules) */
  "push-v": `
    <line class="mo-ground" x1="60" y1="110" x2="160" y2="110"/>
    <circle class="mo-head" cx="110" cy="52" r="8"/>
    <line class="mo-body" x1="110" y1="60" x2="110" y2="88"/>
    <line class="mo-body" x1="110" y1="88" x2="98" y2="110"/>
    <line class="mo-body" x1="110" y1="88" x2="122" y2="110"/>
    <g class="mo-move mo-anim-press">
      <line class="mo-limb" x1="96" y1="64" x2="96" y2="40"/>
      <line class="mo-limb" x1="124" y1="64" x2="124" y2="40"/>
      <line class="mo-bar" x1="80" y1="40" x2="140" y2="40"/>
      <rect class="mo-plate" x="76" y="31" width="7" height="18" rx="2"/>
      <rect class="mo-plate" x="137" y="31" width="7" height="18" rx="2"/>
    </g>`,
  /* tirage vertical (tractions, poulie haute) */
  "pull-v": `
    <line class="mo-bar" x1="70" y1="18" x2="150" y2="18"/>
    <g class="mo-move mo-anim-pullup">
      <line class="mo-limb" x1="92" y1="18" x2="98" y2="44"/>
      <line class="mo-limb" x1="128" y1="18" x2="122" y2="44"/>
      <circle class="mo-head" cx="110" cy="46" r="8"/>
      <line class="mo-body" x1="110" y1="54" x2="110" y2="84"/>
      <line class="mo-body" x1="110" y1="84" x2="102" y2="104"/>
      <line class="mo-body" x1="110" y1="84" x2="118" y2="104"/>
    </g>`,
  /* tirage horizontal (rowings) */
  "pull-h": `
    <line class="mo-ground" x1="40" y1="110" x2="180" y2="110"/>
    <circle class="mo-head" cx="76" cy="46" r="8"/>
    <line class="mo-body" x1="82" y1="52" x2="120" y2="72"/>
    <line class="mo-body" x1="120" y1="72" x2="118" y2="110"/>
    <g class="mo-move mo-anim-row">
      <line class="mo-limb" x1="92" y1="58" x2="88" y2="88"/>
      <line class="mo-bar" x1="66" y1="88" x2="112" y2="88"/>
      <rect class="mo-plate" x="62" y="80" width="6" height="16" rx="2"/>
    </g>`,
  /* squat / presse / fentes */
  "squat": `
    <line class="mo-ground" x1="60" y1="110" x2="160" y2="110"/>
    <line class="mo-body" x1="98" y1="86" x2="98" y2="110"/>
    <line class="mo-body" x1="122" y1="86" x2="122" y2="110"/>
    <g class="mo-move mo-anim-squat">
      <circle class="mo-head" cx="110" cy="34" r="8"/>
      <line class="mo-body" x1="110" y1="42" x2="110" y2="72"/>
      <line class="mo-body" x1="110" y1="72" x2="98" y2="86"/>
      <line class="mo-body" x1="110" y1="72" x2="122" y2="86"/>
      <line class="mo-bar" x1="86" y1="46" x2="134" y2="46"/>
      <rect class="mo-plate" x="82" y="38" width="6" height="16" rx="2"/>
      <rect class="mo-plate" x="132" y="38" width="6" height="16" rx="2"/>
    </g>`,
  /* hinge (soulevés, good morning, swings) */
  "hinge": `
    <line class="mo-ground" x1="50" y1="110" x2="180" y2="110"/>
    <line class="mo-body" x1="118" y1="72" x2="112" y2="110"/>
    <line class="mo-body" x1="118" y1="72" x2="126" y2="110"/>
    <g class="mo-move mo-anim-hinge" style="transform-origin:118px 72px">
      <line class="mo-body" x1="118" y1="72" x2="118" y2="38"/>
      <circle class="mo-head" cx="118" cy="30" r="8"/>
      <line class="mo-limb" x1="116" y1="48" x2="104" y2="76"/>
      <line class="mo-bar" x1="86" y1="76" x2="122" y2="76"/>
    </g>`,
  /* hip thrust / pont fessier */
  "bridge": `
    <line class="mo-ground" x1="30" y1="104" x2="190" y2="104"/>
    <circle class="mo-head" cx="58" cy="88" r="7"/>
    <line class="mo-body" x1="132" y1="86" x2="140" y2="104"/>
    <g class="mo-move mo-anim-bridge" style="transform-origin:66px 90px">
      <line class="mo-body" x1="66" y1="90" x2="132" y2="86"/>
      <line class="mo-bar" x1="96" y1="74" x2="96" y2="98"/>
      <rect class="mo-plate" x="88" y="70" width="16" height="7" rx="2"/>
    </g>`,
  /* curl biceps */
  "curl": `
    <line class="mo-ground" x1="60" y1="110" x2="160" y2="110"/>
    <circle class="mo-head" cx="104" cy="34" r="8"/>
    <line class="mo-body" x1="104" y1="42" x2="104" y2="82"/>
    <line class="mo-body" x1="104" y1="82" x2="96" y2="110"/>
    <line class="mo-body" x1="104" y1="82" x2="112" y2="110"/>
    <line class="mo-limb" x1="104" y1="52" x2="118" y2="66"/>
    <g class="mo-move mo-anim-curl" style="transform-origin:118px 66px">
      <line class="mo-limb" x1="118" y1="66" x2="136" y2="76"/>
      <rect class="mo-plate" x="132" y="70" width="12" height="12" rx="3"/>
    </g>`,
  /* extension triceps */
  "extension": `
    <line class="mo-ground" x1="60" y1="110" x2="160" y2="110"/>
    <circle class="mo-head" cx="104" cy="38" r="8"/>
    <line class="mo-body" x1="104" y1="46" x2="104" y2="84"/>
    <line class="mo-body" x1="104" y1="84" x2="96" y2="110"/>
    <line class="mo-body" x1="104" y1="84" x2="112" y2="110"/>
    <line class="mo-limb" x1="104" y1="52" x2="118" y2="38"/>
    <g class="mo-move mo-anim-ext" style="transform-origin:118px 38px">
      <line class="mo-limb" x1="118" y1="38" x2="134" y2="28"/>
      <rect class="mo-plate" x="130" y="22" width="11" height="11" rx="3"/>
    </g>`,
  /* élévations / écartés bras tendus */
  "raise": `
    <line class="mo-ground" x1="60" y1="110" x2="160" y2="110"/>
    <circle class="mo-head" cx="110" cy="34" r="8"/>
    <line class="mo-body" x1="110" y1="42" x2="110" y2="84"/>
    <line class="mo-body" x1="110" y1="84" x2="100" y2="110"/>
    <line class="mo-body" x1="110" y1="84" x2="120" y2="110"/>
    <g class="mo-move mo-anim-raise" style="transform-origin:110px 52px">
      <line class="mo-limb" x1="110" y1="52" x2="146" y2="58"/>
      <rect class="mo-plate" x="142" y="52" width="11" height="11" rx="3"/>
    </g>`,
  /* écarté pectoraux (fly) : deux bras qui se referment */
  "fly": `
    <line class="mo-ground" x1="40" y1="96" x2="180" y2="96"/>
    <line class="mo-body" x1="66" y1="88" x2="150" y2="88"/>
    <circle class="mo-head" cx="58" cy="88" r="7"/>
    <g class="mo-move mo-anim-flyL" style="transform-origin:96px 86px">
      <line class="mo-limb" x1="96" y1="86" x2="70" y2="56"/>
      <rect class="mo-plate" x="64" y="48" width="11" height="11" rx="3"/>
    </g>
    <g class="mo-move mo-anim-flyR" style="transform-origin:100px 86px">
      <line class="mo-limb" x1="100" y1="86" x2="126" y2="56"/>
      <rect class="mo-plate" x="121" y="48" width="11" height="11" rx="3"/>
    </g>`,
  /* crunch / relevés */
  "core": `
    <line class="mo-ground" x1="30" y1="104" x2="190" y2="104"/>
    <line class="mo-body" x1="120" y1="102" x2="134" y2="84"/>
    <line class="mo-body" x1="134" y1="84" x2="146" y2="104"/>
    <g class="mo-move mo-anim-crunch" style="transform-origin:120px 102px">
      <line class="mo-body" x1="120" y1="102" x2="78" y2="98"/>
      <circle class="mo-head" cx="70" cy="96" r="7"/>
    </g>`,
  /* gainage : tenue + micro-oscillation de contrôle */
  "plank": `
    <line class="mo-ground" x1="30" y1="104" x2="190" y2="104"/>
    <g class="mo-move mo-anim-plank">
      <circle class="mo-head" cx="62" cy="80" r="7"/>
      <line class="mo-body" x1="70" y1="82" x2="150" y2="90"/>
      <line class="mo-limb" x1="80" y1="84" x2="78" y2="104"/>
      <line class="mo-limb" x1="150" y1="90" x2="158" y2="104"/>
    </g>`,
  /* extensions mollets */
  "calf": `
    <line class="mo-ground" x1="60" y1="110" x2="160" y2="110"/>
    <g class="mo-move mo-anim-calf">
      <circle class="mo-head" cx="110" cy="26" r="8"/>
      <line class="mo-body" x1="110" y1="34" x2="110" y2="74"/>
      <line class="mo-body" x1="110" y1="74" x2="104" y2="106"/>
      <line class="mo-body" x1="110" y1="74" x2="116" y2="106"/>
      <line class="mo-limb" x1="98" y1="106" x2="122" y2="106"/>
    </g>`
};

/* Rend le schéma animé d'un exercice */
function motionSVG(ex) {
  const pattern = guessPattern(ex);
  const scene = MOTION_SCENES[pattern] || MOTION_SCENES["push-v"];
  return `<div class="motion-wrap" role="img" aria-label="Schéma animé du mouvement : ${esc(ex.nom)}">
    <svg viewBox="0 0 220 120">${scene}</svg>
    <span class="motion-tag">Schéma du geste · ${pattern.replace("-", " ")}</span>
  </div>`;
}
