/* =========================================================
   GymCoach — Générateur de programme personnalisé
   Adapte le split, les exercices, les séries, les répétitions
   et les temps de repos à l'objectif, au niveau, au nombre de
   séances et au matériel disponible.
   ========================================================= */

/* Paramètres d'entraînement selon l'objectif */
const GOAL_SCHEMES = {
  masse: {
    label: "Prise de masse musculaire",
    icone: "💪",
    // Repos long : un repos court réduit le volume-charge réalisable, et
    // c'est lui qui porte l'hypertrophie (Schoenfeld 2016, Longo 2020).
    // RIR = répétitions en réserve à la fin de chaque série. Proche de
    // l'échec pour l'hypertrophie, mais pas l'échec systématique
    // (Refalo 2022, Robinson 2024).
    poly:  { series: 4, reps: "8-12",  repos: "2-3 min", rir: "1-3" },
    iso:   { series: 3, reps: "10-15", repos: "90 s",    rir: "1-3" },
    conseils: [
      "Mange en léger surplus calorique (+250 à +400 kcal/jour) avec 1,8 à 2,2 g de protéines par kilo de poids de corps.",
      "Cherche la surcharge progressive : ajoute du poids ou des répétitions à chaque semaine si possible.",
      "Dors 7 à 9 h par nuit — c'est là que le muscle se construit.",
      "Termine tes séries à 1-3 répétitions de l'échec. Aller jusqu'à l'échec à chaque série coûte plus de fatigue sans gain supplémentaire.",
      "Prends des repos complets (2 à 3 min sur les gros mouvements) : c'est le volume que tu peux soulever qui construit le muscle, pas la course contre la montre."
    ]
  },
  force: {
    label: "Force maximale",
    icone: "🏋️",
    poly:  { series: 5, reps: "3-6",   repos: "3-5 min", rir: "2-4" },
    iso:   { series: 3, reps: "6-10",  repos: "2-3 min", rir: "1-3" },
    conseils: [
      "Prends des repos longs (3 à 5 min sur les gros mouvements) : la force exige une récupération complète entre les séries.",
      "Échauffe-toi avec des séries progressives avant tes séries de travail lourdes.",
      "La technique passe avant la charge : une répétition laide est une répétition qui ne compte pas.",
      "Garde 2-4 répétitions en réserve sur les séries lourdes. La force se construit sur une large plage de proximité de l'échec, sans le payer en fatigue.",
      "Filme tes séries lourdes pour vérifier ta technique."
    ]
  },
  seche: {
    label: "Sèche / Perte de gras",
    icone: "🔥",
    // Même entraînement qu'en prise de masse : en déficit, l'objectif est
    // de CONSERVER le muscle, donc le stimulus doit être identique. À
    // effort égal l'hypertrophie ne dépend pas de la plage de répétitions
    // (Schoenfeld 2017) : il n'y a pas de « reps de définition ». La sèche
    // se joue dans l'assiette et le cardio, pas dans le schéma de séries.
    poly:  { series: 4, reps: "8-12",  repos: "2-3 min", rir: "1-3" },
    iso:   { series: 3, reps: "10-15", repos: "90 s",    rir: "1-3" },
    conseils: [
      "L'entraînement est le même qu'en prise de masse : charges lourdes, mêmes séries et répétitions. C'est le déficit calorique qui fait perdre le gras.",
      "Crée un déficit calorique modéré (-300 à -500 kcal/jour) en gardant les protéines hautes (2 g/kg) pour préserver le muscle.",
      "Ajoute 20-30 min de cardio modéré ou 10-15 min de HIIT après la séance ou les jours off.",
      "Vise 8 000 à 10 000 pas par jour pour augmenter la dépense sans fatigue supplémentaire."
    ]
  },
  forme: {
    label: "Remise en forme / Tonification",
    icone: "⚡",
    poly:  { series: 3, reps: "8-12",  repos: "90 s", rir: "2-4" },
    iso:   { series: 2, reps: "12-15", repos: "75 s", rir: "2-4" },
    conseils: [
      "La régularité bat l'intensité : mieux vaut 3 séances moyennes par semaine que 1 séance parfaite.",
      "Termine chaque séance par 5-10 min d'étirements ou de mobilité.",
      "Hydrate-toi (2 à 3 L d'eau par jour) et privilégie les aliments non transformés.",
      "Augmente les charges progressivement quand les dernières répétitions deviennent faciles."
    ]
  }
};

/* Nombre d'exercices par séance selon le niveau */
const LEVEL_VOLUME = { debutant: 5, intermediaire: 6, avance: 7 };

/* Modèles de séances : liste de créneaux { groupe, type préféré } */
const DAY_TEMPLATES = {
  fullbody: {
    titre: "Full body",
    focus: "Corps entier",
    slots: [
      { groupe: "quadriceps", type: "poly" },
      { groupe: "pectoraux", type: "poly" },
      { groupe: "dos", type: "poly" },
      { groupe: "epaules", type: "poly" },
      { groupe: "ischios-fessiers", type: "poly" },
      { groupe: "mollets", type: "iso" },
      { groupe: "biceps", type: "iso" },
      { groupe: "triceps", type: "iso" },
      { groupe: "abdos", type: "iso" },
      { groupe: "lombaires", type: "iso" }
    ]
  },
  push: {
    titre: "Push (poussée)",
    focus: "Pectoraux · Épaules · Triceps",
    slots: [
      { groupe: "pectoraux", type: "poly" },
      { groupe: "pectoraux", type: "poly" },
      { groupe: "epaules", type: "poly" },
      { groupe: "epaules", type: "iso" },
      { groupe: "triceps", type: "iso" },
      { groupe: "triceps", type: "iso" },
      { groupe: "pectoraux", type: "iso" }
    ]
  },
  pull: {
    titre: "Pull (tirage)",
    focus: "Dos · Biceps · Arrière d'épaules",
    slots: [
      { groupe: "dos", type: "poly" },
      { groupe: "dos", type: "poly" },
      { groupe: "dos", type: "poly" },
      { groupe: "epaules", type: "iso" },
      { groupe: "biceps", type: "iso" },
      { groupe: "biceps", type: "iso" },
      { groupe: "lombaires", type: "iso" }
    ]
  },
  legs: {
    titre: "Legs (jambes)",
    focus: "Quadriceps · Ischios · Fessiers · Mollets",
    slots: [
      { groupe: "quadriceps", type: "poly" },
      { groupe: "quadriceps", type: "poly" },
      { groupe: "ischios-fessiers", type: "poly" },
      { groupe: "ischios-fessiers", type: "iso" },
      { groupe: "mollets", type: "iso" },
      { groupe: "abdos", type: "iso" },
      { groupe: "quadriceps", type: "iso" }
    ]
  },
  upper: {
    titre: "Haut du corps",
    focus: "Pectoraux · Dos · Épaules · Bras",
    slots: [
      { groupe: "pectoraux", type: "poly" },
      { groupe: "dos", type: "poly" },
      { groupe: "epaules", type: "poly" },
      { groupe: "dos", type: "poly" },
      { groupe: "biceps", type: "iso" },
      { groupe: "triceps", type: "iso" },
      { groupe: "epaules", type: "iso" }
    ]
  },
  lower: {
    titre: "Bas du corps",
    focus: "Jambes · Fessiers · Abdos",
    slots: [
      { groupe: "quadriceps", type: "poly" },
      { groupe: "ischios-fessiers", type: "poly" },
      { groupe: "quadriceps", type: "poly" },
      { groupe: "ischios-fessiers", type: "iso" },
      { groupe: "mollets", type: "iso" },
      { groupe: "abdos", type: "iso" },
      { groupe: "lombaires", type: "iso" }
    ]
  }
};

/* Répartition sur mesure : on entrelace les blocs pour ne jamais enchaîner
   deux fois le même (récupération) — ex. {upper:3, lower:1} donne
   upper, lower, upper, upper. */
function splitFromRepartition(rep) {
  const items = Object.entries(rep)
    .filter(([k, n]) => n > 0 && DAY_TEMPLATES[k])
    .map(([k, n]) => ({ k, n }));
  const out = [];
  let last = null;
  let remaining = items.reduce((s, x) => s + x.n, 0);
  while (remaining > 0) {
    items.sort((a, b) => b.n - a.n);                 // le bloc le plus fourni d'abord
    const pick = items.find(x => x.n > 0 && x.k !== last) || items.find(x => x.n > 0);
    out.push(pick.k);
    pick.n--; remaining--; last = pick.k;
  }
  return out;
}

/* Choix du split selon le nombre de séances, le niveau et la préférence
   utilisateur : "auto" (recommandé), "fullbody", "split" ou "custom"
   (répartition exacte fournie par l'utilisateur). */
function chooseSplit(jours, niveau, splitPref, repartition) {
  if (splitPref === "custom" && repartition) {
    const s = splitFromRepartition(repartition);
    if (s.length) return s;
  }
  if (splitPref === "fullbody") {
    return Array(jours).fill("fullbody");
  }
  if (splitPref === "split") {
    switch (jours) {
      case 2: return ["upper", "lower"];
      case 3: return ["push", "pull", "legs"];
      case 4: return ["upper", "lower", "upper", "lower"];
      case 5: return ["push", "pull", "legs", "upper", "lower"];
      case 6: return ["push", "pull", "legs", "push", "pull", "legs"];
      default: return ["push", "pull", "legs"];
    }
  }
  // auto : full body quand la fréquence est basse ou le niveau débutant.
  // À 3 séances, haut/bas plutôt que push/pull/legs : le PPL n'étale
  // correctement le volume qu'à partir de 5-6 séances, sinon chaque
  // muscle n'est travaillé qu'une fois par semaine.
  switch (jours) {
    case 2: return ["fullbody", "fullbody"];
    case 3: return niveau === "debutant"
      ? ["fullbody", "fullbody", "fullbody"]
      : ["upper", "lower", "upper"];
    case 4: return ["upper", "lower", "upper", "lower"];
    case 5: return ["push", "pull", "legs", "upper", "lower"];
    case 6: return ["push", "pull", "legs", "push", "pull", "legs"];
    default: return ["fullbody", "fullbody", "fullbody"];
  }
}

/* Matériel autorisé selon l'équipement déclaré */
const EQUIPMENT_POOLS = {
  salle: ["barre", "halteres", "machine", "poulie", "poids-du-corps"],
  halteres: ["halteres", "poids-du-corps"],
  corps: ["poids-du-corps"]
};

/* Niveaux d'exercices accessibles selon le niveau du pratiquant */
const LEVEL_POOLS = {
  debutant: ["debutant"],
  intermediaire: ["debutant", "intermediaire"],
  avance: ["debutant", "intermediaire", "avance"]
};

function getAllExercises() {
  const custom = (typeof getCustomExercises === "function") ? getCustomExercises() : [];
  return EXERCISES.concat(custom);
}

/* Sélectionne un exercice pour un créneau, en évitant les doublons du jour
   et en variant entre les séances de la semaine. */
function pickExercise(slot, pool, usedToday, usedThisWeek) {
  const candidates = pool.filter(e => e.groupe === slot.groupe);
  if (candidates.length === 0) return null;

  const score = (e) => {
    let s = Math.random();
    if (e.type === slot.type) s += 2;                 // type préféré (poly/iso)
    if (!usedThisWeek.has(e.id)) s += 1;              // varier sur la semaine
    return s;
  };

  const available = candidates.filter(e => !usedToday.has(e.id));
  if (available.length === 0) return null;

  available.sort((a, b) => score(b) - score(a));
  return available[0];
}

/* Génère le programme complet */
function generateProgram(params) {
  const { prenom, objectif, niveau, jours, materiel, priorite, split: splitPref, repartition } = params;
  const scheme = GOAL_SCHEMES[objectif];
  const split = chooseSplit(jours, niveau, splitPref || "auto", repartition);
  const maxExos = LEVEL_VOLUME[niveau];

  const allowedMateriel = EQUIPMENT_POOLS[materiel];
  const allowedNiveaux = LEVEL_POOLS[niveau];
  const pool = getAllExercises().filter(e =>
    allowedMateriel.includes(e.materiel) && allowedNiveaux.includes(e.niveau)
  );

  const usedThisWeek = new Set();      // ids déjà placés cette semaine
  const couvertsSemaine = new Set();   // groupes ayant reçu ≥ 1 exercice cette semaine

  // Tous les groupes que la semaine doit couvrir (union des modèles + priorité).
  const groupesSemaine = new Set();
  split.forEach(k => DAY_TEMPLATES[k].slots.forEach(s => groupesSemaine.add(s.groupe)));
  if (priorite) groupesSemaine.add(priorite);

  function buildEntry(ex) {
    const p = scheme[ex.type === "poly" ? "poly" : "iso"];
    return {
      exercice: ex,
      series: p.series,
      reps: ex.id === "planche" ? "30-60 s" : p.reps,
      repos: p.repos,
      rir: ex.id === "planche" ? null : (p.rir || null),
      prioritaire: ex.groupe === priorite
    };
  }

  const dayTemplateKeys = [];
  const days = split.map((templateKey, i) => {
    const template = DAY_TEMPLATES[templateKey];
    const usedToday = new Set();
    const budget = maxExos + (priorite ? 1 : 0);
    dayTemplateKeys[i] = templateKey;

    // Priorité : insérer un créneau supplémentaire pour le point faible
    let slots = template.slots.slice();
    if (priorite && (slots.some(s => s.groupe === priorite) || templateKey === "fullbody")) {
      slots = [{ groupe: priorite, type: "poly" }, ...slots];
    }

    // Un créneau par groupe d'abord (ordre du modèle), le volume en plus ensuite.
    // Les groupes pas encore vus de la semaine passent devant : la couverture se
    // répartit sur les séances au lieu de gonfler une seule séance.
    const premierDuGroupe = [];
    const supplement = [];
    const vus = new Set();
    for (const slot of slots) {
      if (vus.has(slot.groupe)) supplement.push(slot);
      else { vus.add(slot.groupe); premierDuGroupe.push(slot); }
    }
    premierDuGroupe.sort((a, b) =>
      (couvertsSemaine.has(a.groupe) ? 1 : 0) - (couvertsSemaine.has(b.groupe) ? 1 : 0));
    const ordered = premierDuGroupe.concat(supplement);

    const exercices = [];
    for (const slot of ordered) {
      if (exercices.length >= budget) break;
      const ex = pickExercise(slot, pool, usedToday, usedThisWeek);
      if (!ex) continue;
      usedToday.add(ex.id);
      usedThisWeek.add(ex.id);
      couvertsSemaine.add(ex.groupe);
      exercices.push(buildEntry(ex));
    }

    // un même bloc peut revenir plusieurs fois (haut/bas, répartition sur
    // mesure) : on numérote pour distinguer « Haut du corps » et « Haut du corps 2 »
    const occurrences = split.filter(k => k === templateKey).length;
    const rank = split.slice(0, i + 1).filter(k => k === templateKey).length;

    return {
      numero: i + 1,
      titre: occurrences > 1 ? `${template.titre} ${rank}` : template.titre,
      focus: template.focus,
      exercices
    };
  });

  // Rattrapage : un muscle attendu cette semaine et jamais placé est ajouté à
  // la séance la moins chargée dont le modèle le contient. Léger dépassement du
  // budget toléré plutôt que de sauter un muscle sur la semaine.
  for (const groupe of groupesSemaine) {
    if (couvertsSemaine.has(groupe)) continue;
    const candidats = days
      .map((d, idx) => ({ d, key: dayTemplateKeys[idx] }))
      .filter(x => DAY_TEMPLATES[x.key].slots.some(s => s.groupe === groupe))
      .sort((a, b) => a.d.exercices.length - b.d.exercices.length);
    for (const { d } of candidats) {
      const usedToday = new Set(d.exercices.map(e => e.exercice.id));
      const ex = pickExercise({ groupe, type: "iso" }, pool, usedToday, usedThisWeek);
      if (!ex) continue;
      usedThisWeek.add(ex.id);
      couvertsSemaine.add(ex.groupe);
      d.exercices.push(buildEntry(ex));
      break;
    }
  }

  return {
    prenom,
    objectif,
    objectifLabel: scheme.label,
    objectifIcone: scheme.icone,
    niveau,
    jours: split.length,
    materiel,
    priorite,
    split: splitPref || "auto",
    repartition: repartition || null,
    splitLabel: (splitPref === "fullbody") ? "Full body"
              : (splitPref === "split") ? "Split"
              : (splitPref === "custom") ? "Répartition sur mesure"
              : "Auto",
    genereLe: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    days,
    conseils: scheme.conseils
  };
}
