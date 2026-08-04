/* =========================================================
   GymCoach — Moteur de schémas animés
   Deux niveaux :
   1. ANIMATION DÉDIÉE (js/motion-ex.js) : un schéma construit
      exercice par exercice — bonne position du corps, bon
      matériel, seuls les segments réellement mobiles bougent,
      amplitude réelle, muscles ciblés surlignés, flèche de
      direction, phases excentrique/concentrique au bon tempo,
      contrôles lecture / rejouer / vitesse.
   2. REPLI GÉNÉRIQUE : pour les exercices pas encore repris,
      un pictogramme de pattern EXPLICITEMENT étiqueté comme
      approximatif. Mieux vaut annoncer un schéma générique
      qu'un schéma faux.
   ========================================================= */

/* ---------------------------------------------------------
   Rig à segments : chaque partie mobile est un groupe SVG qui
   tourne (ou translate) autour de son articulation. Les groupes
   s'imbriquent, donc les rotations se composent comme un vrai
   squelette (épaule -> coude -> main).
   --------------------------------------------------------- */

/* Construit un bloc @keyframes à partir de [[pourcent, transform], …] */
function moKeyframes(name, frames) {
  return `@keyframes ${name}{` +
    frames.map(([p, t]) => `${p}%{transform:${t}}`).join("") + "}";
}

/* Surlignage musculaire : discret pendant l'excentrique,
   marqué pendant le concentrique (c'est là que le muscle tire). */
function moMuscleKeyframes(name, phases, iso) {
  /* ISOMÉTRIQUE : le muscle ne s'allume pas « pendant une phase », il est
     sous tension EN PERMANENCE. On ne montre donc pas une montée puis une
     retombée, mais une intensité haute et continue, très légèrement
     respirante pour signaler que c'est vivant et non figé. */
  if (iso) {
    return `@keyframes ${name}{0%{opacity:.8}50%{opacity:1}100%{opacity:.8}}`;
  }
  const [c0, c1] = phases.con;
  const pts = [
    [0, 0.18], [Math.max(0, c0 - 6), 0.18], [c0, 0.85],
    [(c0 + c1) / 2, 1], [c1, 0.5], [Math.min(100, c1 + 8), 0.18], [100, 0.18]
  ];
  return `@keyframes ${name}{` +
    pts.map(([p, o]) => `${p}%{opacity:${o}}`).join("") + "}";
}

/* Repère de MAINTIEN : anneau qui se remplit une fois par cycle.
   Il remplace les flèches de sens sur un exercice isométrique — il parle de
   TEMPS SOUS TENSION, jamais de direction, et ne peut donc pas être lu comme
   un mouvement à effectuer. */
function moHoldKeyframes(name, circonference) {
  return `@keyframes ${name}{0%{stroke-dashoffset:${circonference}}` +
    `90%{stroke-dashoffset:0}100%{stroke-dashoffset:0}}`;
}

/* Flèche de direction : visible seulement pendant sa phase */
function moArrowKeyframes(name, [a0, a1]) {
  const pts = [
    [0, 0], [Math.max(0, a0 - 4), 0], [a0 + 2, 1],
    [a1 - 4, 1], [a1, 0], [100, 0]
  ].filter((v, i, arr) => i === 0 || v[0] >= arr[i - 1][0]);
  return `@keyframes ${name}{` +
    pts.map(([p, o]) => `${p}%{opacity:${o}}`).join("") + "}";
}

let moCounter = 0;

/* Noms des muscles surlignés sur les segments mobiles (pour la légende) */
function collectPartMuscleNames(parts) {
  const out = [];
  for (const p of parts) {
    if (p.muscleNom) out.push(...[].concat(p.muscleNom));
    if (p.children) out.push(...collectPartMuscleNames(p.children));
  }
  return out;
}

/* Rend une animation dédiée à partir de sa fiche technique */
function renderDedicatedMotion(ex, spec) {
  const uid = "m" + (++moCounter);
  const css = [];

  /* Un muscle porté par un segment mobile (triceps sur le bras, quadriceps
     sur la cuisse…) doit suivre ce segment : il est dessiné DANS le groupe
     mobile, avec sa propre animation d'intensité. */
  const iso = !!spec.isometrique;

  let mi = 0;
  const muscleIn = svg => {
    if (!svg) return "";
    const name = `${uid}mi${mi++}`;
    css.push(moMuscleKeyframes(name, spec.phases, iso));
    return `<g class="mo-anim mo-muscle" style="animation-name:${name}">${svg}</g>`;
  };

  /* Chaîne articulaire : un segment CONTIENT ses segments enfants, donc les
     rotations se composent comme un vrai squelette (épaule → coude → main).
     Les angles d'un enfant sont donc RELATIFS à son parent. */
  let pi = 0;
  const renderPart = p => {
    const name = `${uid}p${pi++}`;
    css.push(moKeyframes(name, p.k));
    const kids = (p.children || []).map(renderPart).join("");
    // childrenFirst : le segment porteur se dessine PAR-DESSUS ses enfants
    // (membre proche devant le corps, sinon le coude disparaît derrière)
    const corps = p.childrenFirst ? kids + muscleIn(p.muscle) + p.svg
                                  : muscleIn(p.muscle) + p.svg + kids;
    return `<g class="mo-anim mo-part" style="${p.o ? `transform-origin:${p.o};` : ""}animation-name:${name}">${corps}</g>`;
  };
  const parts = (spec.parts || []).map(renderPart).join("");

  const muscles = (spec.muscles || []).map((m, i) => {
    const name = `${uid}m${i}`;
    css.push(moMuscleKeyframes(name, spec.phases, iso));
    return `<g class="mo-anim mo-muscle" style="animation-name:${name}">${m.svg}</g>`;
  }).join("");

  /* Sur un isométrique il n'y a NI phase NI sens : pas de flèches, mais un
     repère de maintien. Les deux sont exclusifs, jamais cumulés. */
  const hold = iso && spec.maintien ? (() => {
    const [hx, hy] = spec.maintien.split(/\s+/).map(Number);
    const r = spec.maintienR || 9;
    const c = (2 * Math.PI * r).toFixed(1);
    const name = `${uid}h`;
    css.push(moHoldKeyframes(name, c));
    return `<g class="mo-hold">
      <circle class="mo-hold-piste" cx="${hx}" cy="${hy}" r="${r}"/>
      <circle class="mo-anim mo-hold-ring" cx="${hx}" cy="${hy}" r="${r}"
        style="stroke-dasharray:${c};animation-name:${name}"
        transform="rotate(-90 ${hx} ${hy})"/>
      <circle class="mo-hold-core" cx="${hx}" cy="${hy}" r="2.4"/>
    </g>`;
  })() : "";

  const arrows = iso ? "" : (spec.arrows || []).map((a, i) => {
    const name = `${uid}a${i}`;
    css.push(moArrowKeyframes(name, spec.phases[a.phase] || spec.phases.con));
    const inner = a.o
      ? `<g class="mo-anim" style="transform-origin:${a.o};animation-name:${a.follow}">${a.svg}</g>`
      : a.svg;
    return `<g class="mo-anim mo-arrow" style="animation-name:${name}">${inner}</g>`;
  }).join("");

  const styleTag = `<style>${css.join("")}</style>`;
  // légende : muscles fixes + muscles portés par un segment mobile
  const musclesNoms = (spec.muscles || []).map(m => m.nom)
    .concat(collectPartMuscleNames(spec.parts || []))
    .filter(Boolean);

  return `<figure class="motion-wrap motion-dedie" style="--mo-dur:${spec.dur}s;--mo-k:1${
      spec.hauteur ? `;--mo-h:${spec.hauteur}px` : ""}"
      role="img" aria-label="Schéma animé du mouvement : ${esc(ex.nom)}. ${esc(spec.alt || "")}">
    ${styleTag}
    <svg viewBox="${spec.vb}" preserveAspectRatio="xMidYMid meet">
      <g class="mo-fixe">${spec.fixe || ""}</g>
      ${muscles}
      ${parts}
      ${arrows}
      ${hold}
    </svg>
    <span class="motion-tag">${iso ? "Schéma vérifié · maintien" : "Schéma vérifié"}</span>
    ${spec.vue ? `<span class="motion-vue">${esc(spec.vue)}</span>` : ""}
    <figcaption class="motion-cap">
      <span class="mo-legend">${musclesNoms.map(n => `<span class="mo-leg-item">${esc(n)}</span>`).join("")}</span>
      <span class="mo-ctl">
        <button type="button" class="mo-btn" data-mo="play" aria-label="Mettre en pause">⏸</button>
        <button type="button" class="mo-btn" data-mo="replay" aria-label="Rejouer">↻</button>
        <button type="button" class="mo-btn mo-speed" data-mo="speed" aria-label="Vitesse">1×</button>
      </span>
    </figcaption>
  </figure>`;
}

/* Contrôles : un seul écouteur délégué, valable pour tous les schémas */
document.addEventListener("click", e => {
  const btn = e.target.closest(".mo-btn");
  if (!btn) return;
  const wrap = btn.closest(".motion-wrap");
  if (!wrap) return;
  const action = btn.dataset.mo;

  if (action === "play") {
    const paused = wrap.classList.toggle("mo-paused");
    btn.textContent = paused ? "▶" : "⏸";
    btn.setAttribute("aria-label", paused ? "Lancer" : "Mettre en pause");
  } else if (action === "replay") {
    wrap.classList.remove("mo-paused");
    const play = wrap.querySelector('[data-mo="play"]');
    if (play) { play.textContent = "⏸"; play.setAttribute("aria-label", "Mettre en pause"); }
    // relance depuis zéro : on coupe l'animation, on force un reflow, on la remet
    wrap.querySelectorAll(".mo-anim").forEach(g => {
      const n = g.style.animationName;
      g.style.animationName = "none";
      void g.offsetWidth;
      g.style.animationName = n;
    });
  } else if (action === "speed") {
    const cycle = [1, 0.75, 0.5];
    const cur = parseFloat(wrap.style.getPropertyValue("--mo-k")) || 1;
    const next = cycle[(cycle.indexOf(cur) + 1) % cycle.length];
    wrap.style.setProperty("--mo-k", next);
    btn.textContent = (next === 1 ? "1" : String(next).replace("0.", "0,")) + "×";
  }
});

/* ---------------------------------------------------------
   REPLI GÉNÉRIQUE — exercices pas encore repris un par un.
   Étiqueté comme tel : ce sont des pictogrammes de pattern
   moteur, pas des schémas fidèles à l'exercice précis.
   --------------------------------------------------------- */
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
      return n.includes("flexion de hanche") ? "leg-swing" : "squat";
    case "ischios-fessiers":
      if (n.includes("souleve") || n.includes("good morning") || n.includes("swing") || n.includes("pull-through") || n.includes("pull through") || n.includes("nordic")) return "hinge";
      if (n.includes("hip thrust") || n.includes("pont") || n.includes("frog pump")) return "bridge";
      if (n.includes("donkey") || n.includes("fire hydrant") || n.includes("kickback") || n.includes("extension de hanche au banc")) return "kick";
      if (n.includes("abduction") || n.includes("adduction") || n.includes("clamshell") || n.includes("marche laterale")) return "leg-swing";
      return "squat";
    default: return "push-v";
  }
}

const MOTION_SCENES = {
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
  "bridge": `
    <line class="mo-ground" x1="30" y1="104" x2="190" y2="104"/>
    <circle class="mo-head" cx="58" cy="88" r="7"/>
    <line class="mo-body" x1="132" y1="86" x2="140" y2="104"/>
    <g class="mo-move mo-anim-bridge" style="transform-origin:66px 90px">
      <line class="mo-body" x1="66" y1="90" x2="132" y2="86"/>
      <line class="mo-bar" x1="96" y1="74" x2="96" y2="98"/>
      <rect class="mo-plate" x="88" y="70" width="16" height="7" rx="2"/>
    </g>`,
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
  "core": `
    <line class="mo-ground" x1="30" y1="104" x2="190" y2="104"/>
    <line class="mo-body" x1="120" y1="102" x2="134" y2="84"/>
    <line class="mo-body" x1="134" y1="84" x2="146" y2="104"/>
    <g class="mo-move mo-anim-crunch" style="transform-origin:120px 102px">
      <line class="mo-body" x1="120" y1="102" x2="78" y2="98"/>
      <circle class="mo-head" cx="70" cy="96" r="7"/>
    </g>`,
  "plank": `
    <line class="mo-ground" x1="30" y1="104" x2="190" y2="104"/>
    <g class="mo-move mo-anim-plank">
      <circle class="mo-head" cx="62" cy="80" r="7"/>
      <line class="mo-body" x1="70" y1="82" x2="150" y2="90"/>
      <line class="mo-limb" x1="80" y1="84" x2="78" y2="104"/>
      <line class="mo-limb" x1="150" y1="90" x2="158" y2="104"/>
    </g>`,
  "leg-swing": `
    <line class="mo-ground" x1="40" y1="110" x2="180" y2="110"/>
    <line class="mo-ground" x1="66" y1="42" x2="66" y2="110"/>
    <circle class="mo-head" cx="98" cy="30" r="8"/>
    <line class="mo-body" x1="98" y1="38" x2="98" y2="78"/>
    <line class="mo-limb" x1="98" y1="50" x2="68" y2="58"/>
    <line class="mo-body" x1="98" y1="78" x2="94" y2="110"/>
    <g class="mo-move mo-anim-legswing" style="transform-origin:98px 78px">
      <line class="mo-limb" x1="98" y1="78" x2="106" y2="110"/>
      <rect class="mo-plate" x="101" y="103" width="11" height="8" rx="2"/>
    </g>`,
  "kick": `
    <line class="mo-ground" x1="30" y1="104" x2="190" y2="104"/>
    <circle class="mo-head" cx="60" cy="64" r="7"/>
    <line class="mo-body" x1="68" y1="68" x2="124" y2="70"/>
    <line class="mo-limb" x1="78" y1="70" x2="78" y2="104"/>
    <line class="mo-body" x1="120" y1="70" x2="124" y2="104"/>
    <g class="mo-move mo-anim-kick" style="transform-origin:124px 72px">
      <line class="mo-limb" x1="124" y1="72" x2="158" y2="86"/>
      <rect class="mo-plate" x="152" y="80" width="11" height="8" rx="2"/>
    </g>`,
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

const PATTERN_LABELS = {
  "push-h": "poussée horizontale", "push-v": "poussée verticale",
  "pull-v": "tirage vertical", "pull-h": "tirage horizontal",
  "squat": "flexion de jambes", "hinge": "charnière de hanche",
  "bridge": "extension de hanche au sol", "curl": "flexion de coude",
  "extension": "extension de coude", "raise": "élévation bras tendu",
  "fly": "écarté", "core": "flexion du tronc", "plank": "gainage",
  "leg-swing": "mouvement de jambe", "kick": "ruade", "calf": "extension de cheville"
};

/* Point d'entrée : schéma dédié si l'exercice a été repris, sinon
   pictogramme générique clairement annoncé comme approximatif. */
function motionSVG(ex) {
  const spec = (typeof EXERCISE_MOTIONS !== "undefined") ? EXERCISE_MOTIONS[ex.id] : null;
  if (spec) return renderDedicatedMotion(ex, spec);

  const pattern = guessPattern(ex);
  const scene = MOTION_SCENES[pattern] || MOTION_SCENES["push-v"];
  return `<figure class="motion-wrap motion-generique" role="img"
      aria-label="Pictogramme générique du pattern « ${esc(PATTERN_LABELS[pattern] || pattern)} » — pas encore un schéma fidèle de ${esc(ex.nom)}">
    <svg viewBox="0 0 220 120">${scene}</svg>
    <span class="motion-tag motion-tag-warn">Schéma générique</span>
    <figcaption class="motion-cap motion-cap-warn">
      Pictogramme du pattern « ${esc(PATTERN_LABELS[pattern] || pattern)} », partagé par plusieurs exercices :
      il donne l'idée du geste, pas la position exacte de cet exercice. Schéma dédié en cours de relecture.
    </figcaption>
  </figure>`;
}
