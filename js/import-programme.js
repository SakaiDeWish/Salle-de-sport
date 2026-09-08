/* =========================================================
   GymCoach — Importer un programme depuis un texte

   POURQUOI PAS DIRECTEMENT UNE PHOTO.
   Lire une photo demande de la reconnaissance de texte. Trois voies
   existaient, aucune ne tient :
     — une IA distante : il faudrait une clé d'API dans le code, donc
       lisible par quiconque ouvre les outils du navigateur ;
     — une bibliothèque OCR embarquée (Tesseract) : quatre mégaoctets
       dans une app conçue pour fonctionner hors ligne, pour une
       précision médiocre sur une photo de tableau de salle ;
     — l'API TextDetector du navigateur : expérimentale, Chrome
       seulement, absente sur iOS.

   Or le téléphone SAIT DÉJÀ le faire, et mieux : iOS (Live Text) et
   Android (Google Lens) extraient le texte d'une photo nativement.
   On photographie son programme, on sélectionne, on copie, on colle
   ici. Zéro octet ajouté, meilleure reconnaissance qu'aucune
   bibliothèque embarquée, et ça marche hors ligne.

   CE QUE CE FICHIER FAIT : lire ce texte collé, en tirer des jours et
   des exercices, rapprocher chaque nom de la bibliothèque (141
   exercices et leurs alias français et anglais), et signaler
   franchement ceux qu'il ne reconnaît pas plutôt que d'inventer.
   ========================================================= */

/* ==================== CE QU'ON REÇOIT VRAIMENT ====================

   Un programme n'est presque jamais collé proprement. Le texte qui a
   servi de banc d'essai vient d'une transcription vidéo passée par
   l'OCR d'un téléphone, et cumule tout ce qui peut mal tourner :

     — des horodatages, tantôt seuls sur leur ligne (« 2:26 »), tantôt
       collés en fin de ligne (« … 10-12 reps 2:59 ») ;
     — des noms coupés en deux par la largeur de l'écran :
       « Exercise 4: Eccentric-Accentuated Leg » / « Extension 3 sets
       x 10-12 reps » — deux lignes pour un seul exercice ;
     — des préfixes « Exercise 3: », des superséries « 7A / 7B » ;
     — des commentaires entre parenthèses, parfois sur leur ligne ;
     — des séries écrites de six façons : « 3 sets × 4 reps »,
       « 3 sets 10-12 reps » (sans le x), « 3 set x 10/10 reps »,
       « 2 sets x 30s », « 3 sets to failure », « 3 sets x 7/7|7 » ;
     — des en-têtes de jour sans le mot « jour » : « Legs 1 (Quad
       Focused) », parfois suivis d'un exercice SUR LA MÊME LIGNE.

   Mesuré sur ce texte, la première version reconnaissait 0 exercice
   sur 37 et découpait 9 jours au lieu de 6 — des jours intitulés
   « reps », parce qu'une ligne orpheline courte et sans chiffre était
   prise pour un titre. Ce qui suit corrige les cinq causes.
   ================================================================== */

/* Un titre de jour : « Jour 1 », « Day 2 — Push », « Séance A »,
   « Lundi », ou une ligne courte sans indication de séries. */
const JOUR_RE = /^\s*(?:jour|journee|journée|day|séance|seance|s[ée]ance)\s*[:\-–—]?\s*(\d+|[a-z])\b/i;
const JOURS_SEMAINE = /^\s*(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;

/* Un jour peut aussi s'annoncer par son seul contenu, sans le mot
   « jour » : c'est la forme la plus courante des programmes anglo-
   saxons (« Push 1 », « Legs 2 (Posterior-Chain Focused) »). */
const SPLIT_MOTS = "push|pull|legs?|upper(?:\\s*body)?|lower(?:\\s*body)?|full\\s*body|arms?|chest|back|shoulders?|"
  + "haut\\s+du\\s+corps|bas\\s+du\\s+corps|jambes|bras|dos|pectoraux|[ée]paules|abdos";
const SPLIT_RE = new RegExp("^\\s*(?:" + SPLIT_MOTS + ")\\b[\\s\\d]*(?:\\([^)]*\\))?\\s*$", "i");

/* Marqueur d'exercice : « Exercise 3: », « Exercise 7A: »,
   « Exercise 4 (Optional): », « Ex. 2 - », « Exercice 5 : ».
   Groupe 1 : le numéro. Groupe 2 : la lettre de supersérie. */
const MARQUEUR_RE = /^\s*(?:exercises?|exercices?|ex)\s*\.?\s*(\d{1,2})\s*([a-z])?\s*(?:\([^)]*\))?\s*[:.\-–—]\s*/i;

/* Le même marqueur, mais repéré APRÈS un en-tête resté sur la même
   ligne : « Pull 2 (Mid-Back…) Exercise 1: OMNI-Grip Lat Pulldown ».
   Sans cette coupe, tout un jour disparaît d'un coup. */
const SPLIT_COLLE_RE = new RegExp(
  "^\\s*((?:" + SPLIT_MOTS + ")\\b[\\s\\d]*(?:\\([^)]*\\))?)\\s+(?=(?:exercises?|exercices?|ex)\\s*\\.?\\s*\\d)", "i");

/* Puce ou numérotation simple. */
const PUCE_RE = /^\s*(?:[•*·>]\s*|\d{1,2}[.)]\s+)/;

/* Horodatage de transcription : « 2:26 », « 12:20 ». */
const HORODATE_RE = /\b\d{1,3}:\d{2}\b/g;

/* Une fourchette de répétitions telle qu'elle s'écrit : « 8 », « 30s »,
   « 10-12 », « 7/7/7 », « 15 à 20 ». La barre verticale est là parce
   que l'OCR rend souvent « / » par « | ». */
const REPS_MOTIF = "\\d{1,3}\\s*s?(?:\\s*[-–/|à]\\s*\\d{1,3}\\s*s?)*";

/* Séries × reps. Deux formes, essayées dans cet ordre :
   1. avec le mot « sets » / « séries », le séparateur devenant
      FACULTATIF — « 3 sets 10-12 reps » s'écrit vraiment comme ça ;
   2. la forme nue « 4x8 ». */
const SETS_RE = new RegExp(
  "(\\d{1,2})\\s*(?:s[ée]ries?|sets?)\\s*(?:de|of|x|×|:)?\\s*(" + REPS_MOTIF + ")"
  + "|(\\d{1,2})\\s*[x×]\\s*(" + REPS_MOTIF + ")", "i");

/* « 3 sets to failure » : un nombre de séries, pas de répétitions. */
const ECHEC_RE = /(\d{1,2})\s*(?:s[ée]ries?|sets?)\s+(?:to\s+failure|jusqu'?[àa]\s+l'?[ée]chec|[àa]\s+l'?[ée]chec|au\s+max)/i;

/* Bruit fréquent en fin de ligne : temps de repos, tempo, RPE, charge.
   On le retire du NOM, pas de la ligne — le nom est ce qu'on cherche
   à rapprocher de la bibliothèque. */
const BRUIT_RE = /\b(?:repos|rest|tempo|rpe|rir)\b.*$|\b\d+\s*(?:s|sec|secondes?|min|kg|lbs?)\b.*$|@.*$/i;

const ECHAUFF_RE = /\b(?:warm[\s-]*up|[ée]chauffement|pyramid\s+warm)\b/i;

function normNom(t) {
  return t
    .replace(MARQUEUR_RE, "")
    .replace(PUCE_RE, "")
    .replace(/^[\s\-–—]+/, "")
    .replace(BRUIT_RE, "")
    .replace(/[:\-–—|]\s*$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* Sépare le nom de ses parenthèses. « Cable Pullover (Kneeling) » se
   cherche en bibliothèque sous « Cable Pullover » ; le reste est un
   commentaire de l'auteur, qui a sa place à côté de l'exercice mais
   pas dans la requête. */
function extraitNote(nom) {
  const notes = [];
  const propre = nom.replace(/\(([^)]*)\)/g, (_, c) => { notes.push(c.trim()); return " "; });
  return {
    nom: propre.replace(/\s{2,}/g, " ").replace(/[\s,;]+$/, "").trim(),
    note: notes.filter(Boolean).join(" · ")
  };
}

/* ---------- 1. Nettoyage ----------
   Retire les horodatages et les barres résiduelles de l'OCR, et jette
   les lignes qui n'étaient QUE ça. */
function nettoieLignes(txt) {
  return String(txt || "").split(/\r?\n/)
    .map(l => l.replace(HORODATE_RE, " ").replace(/\s*\|\s*/g, " ").replace(/\s{2,}/g, " ").trim())
    .filter(Boolean);
}

/* ---------- 2. Recollage ----------
   LE POINT DÉLICAT. Une ligne coupée par la largeur de l'écran doit
   rejoindre la précédente, mais un titre de séance ne doit surtout pas
   avaler l'exercice qui le suit.

   Le signal fiable n'est pas la forme de la coupure — « Exercise 4:
   Eccentric-Accentuated Leg » se termine par un mot parfaitement
   ordinaire. C'est l'INCOHÉRENCE : une ligne qui s'annonce comme un
   exercice et n'a pas de séries est forcément tronquée. D'où deux
   règles, et deux seulement :

     a) l'entrée précédente porte un marqueur d'exercice mais pas de
        séries → elle est tronquée, on lui recolle la suite ;
     b) l'entrée précédente est complète, et la ligne courante n'a ni
        marqueur, ni séries, ni en-tête → c'est sa fin de phrase
        (« reps », « 1RM) », « (Deficit Pushups are a replacement) »).

   Une ligne sans marqueur ET sans séries qui suit une autre ligne sans
   marqueur ET sans séries n'est recollée à rien : c'est ce qui protège
   « Séance poitrine et dos » de manger l'exercice suivant. */
function estEnTete(l) {
  return JOUR_RE.test(l) || JOURS_SEMAINE.test(l) || SPLIT_RE.test(l);
}

function recolleLignes(lignes) {
  const out = [];
  for (const brute of lignes) {
    /* En-tête et exercice sur la même ligne : on coupe avant d'aller
       plus loin, sinon les deux se perdent ensemble. */
    const colle = SPLIT_COLLE_RE.exec(brute);
    const morceaux = colle
      ? [colle[1].trim(), brute.slice(colle[0].length).trim()]
      : [brute];

    for (const l of morceaux) {
      if (!l) continue;
      const marqueur = MARQUEUR_RE.test(l) || PUCE_RE.test(l);
      const sets = SETS_RE.test(l) || ECHEC_RE.test(l);
      const entete = estEnTete(l);
      const prec = out.length ? out[out.length - 1] : null;

      if (!entete && !marqueur && prec && !prec.entete) {
        const precTronquee = prec.marqueur && !prec.sets;
        if (precTronquee || (prec.sets && !sets)) {
          prec.texte += " " + l;
          prec.sets = SETS_RE.test(prec.texte) || ECHEC_RE.test(prec.texte);
          continue;
        }
      }
      out.push({ texte: l, marqueur, sets, entete });
    }
  }
  return out;
}

/* ---------- 3. Analyse ----------
   Ne décide RIEN : renvoie ce qu'il a compris, avec les lignes non
   reconnues, pour que l'écran les montre. */
function parseProgrammeTexte(txt) {
  const entrees = recolleLignes(nettoieLignes(txt));
  const jours = [];
  const ignorees = [];
  let courant = null;

  const nouveauJour = (titre) => {
    courant = { titre: titre || `Jour ${jours.length + 1}`, lignes: [], echauffement: false };
    jours.push(courant);
  };

  for (const e of entrees) {
    const l = e.texte;

    if (e.entete && !e.sets) {
      nouveauJour(l.replace(/[:\-–—]\s*$/, "").trim());
      continue;
    }

    /* « Sample Pyramid Warm-up » n'est pas du bruit : c'est une
       consigne d'échauffement, et la séance sait désormais en tenir
       une. On la note sur le jour plutôt que de la jeter. */
    if (!e.sets && ECHAUFF_RE.test(l)) {
      if (!courant) nouveauJour(null);
      courant.echauffement = true;
      continue;
    }

    const mMarq = MARQUEUR_RE.exec(l);
    const superserie = mMarq && mMarq[2] ? (mMarq[1] + mMarq[2].toUpperCase()) : null;

    let series = null, reps = null, coupe = -1;
    const m = SETS_RE.exec(l);
    if (m) {
      series = parseInt(m[1] || m[3], 10);
      reps = (m[2] || m[4] || "").replace(/\s/g, "").replace(/\|/g, "/");
      coupe = m.index;
    } else {
      const mf = ECHEC_RE.exec(l);
      if (mf) { series = parseInt(mf[1], 10); reps = "max"; coupe = mf.index; }
    }

    /* Une ligne qui porte un marqueur d'exercice EST un exercice, même
       quand l'auteur n'a donné ni séries ni répétitions — cela arrive,
       et il vaut mieux le dire que la faire disparaître. */
    if (coupe < 0 && !e.marqueur) { ignorees.push(l); continue; }

    const { nom, note } = extraitNote(normNom(coupe >= 0 ? l.slice(0, coupe) : l));
    if (!nom) { ignorees.push(l); continue; }
    if (!courant) nouveauJour(null);
    courant.lignes.push({
      nom, series, reps, note, superserie,
      sansSets: coupe < 0,
      brute: l
    });
  }

  return { jours: jours.filter(j => j.lignes.length), ignorees };
}

/* Clé de comparaison. normalize() retire les accents et la casse, mais
   PAS les traits d'union — et c'est ce détail qui faisait échouer la
   moitié des rapprochements : l'alias « weighted pull up » ne
   rencontrait jamais « Weighted Pull-Up ». Apostrophes, barres
   obliques et ponctuation subissent le même sort. */
function normCle(s) {
  return normalize(String(s || ""))
    .replace(/['’`]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/* Singulier approximatif, anglais et français confondus. « Squats »
   doit trouver « Squat ». Le piège est « press » et « bench press »,
   qui ne sont pas des pluriels : d'où la garde sur « ss ». */
function singulierMot(w) {
  if (w.length <= 4 || /ss$/.test(w)) return w;
  if (/(?:ch|sh|x|z)es$/.test(w)) return w.slice(0, -2);   // crunches → crunch
  if (/s$/.test(w)) return w.slice(0, -1);
  return w;
}
const singulier = (s) => s.split(" ").map(singulierMot).join(" ");

/* Qualificatifs de TECHNIQUE, pas de mouvement. « Eccentric-
   Accentuated Leg Extension » reste un leg extension ; « Lateral
   Raise 21's » reste une élévation latérale. La bibliothèque ne
   porte pas ces mentions dans ses noms — les retirer retrouve
   l'exercice, mais on le signale, parce qu'on a jeté quelque chose
   au passage. */
const QUALIF_RE = new RegExp("\\b(?:eccentric(?:ally)?\\s*accentuated|eccentric|accentuated|"
  + "long\\s*lever|omni\\s*grip|21\\s*s|myo(?:\\s*reps?)?|cheat|tempo|paused?|deficit|"
  + "drop\\s*set|explosive|slow|constant\\s*tension|optional|alternative|superset)\\b", "gi");

/* Rapproche un nom de la bibliothèque. On réutilise exMatches(), donc
   toute la table d'alias français / anglais construite pour la
   recherche — « incline bench press » comme « développé incliné ».
   Renvoie le meilleur candidat, ou null. */
/* Le matériel, lui, ne se traduit pas tout seul. exMatches() exige que
   CHAQUE mot de la requête se retrouve quelque part ; « cable » ne
   figure nulle part dans une bibliothèque française, et suffisait donc
   à faire échouer « Cable Pullover » alors que l'exercice existe. On
   substitue — sans ajouter, puisque tous les mots doivent tomber. */
const MATERIEL_EN = [
  [/\bcables?\b/g, "poulie"],
  [/\bropes?\b/g, "corde"],
  [/\bdumbbells?\b|\bdb\b/g, "haltere"],
  [/\bbarbells?\b/g, "barre"],
  [/\bbodyweights?\b/g, "poids du corps"]
  /* « bench » n'est PAS dans cette liste : « bench press » est un alias
     connu de la bibliothèque, et le traduire le détruirait. */
];
const traduitMateriel = (q) =>
  MATERIEL_EN.reduce((s, [re, fr]) => s.replace(re, fr), q).replace(/\s+/g, " ").trim();

function trouveExercice(nom) {
  const tous = allExercisesForUI();
  const n = normCle(nom);
  const rien = { ex: null, ambigu: false, candidats: [] };
  if (!n) return rien;

  const exact = (q) =>
    tous.find(e => normCle(e.nom) === q) ||
    tous.find(e => exAliases(e).some(a => normCle(a) === q)) || null;

  /* Les requêtes essayées, de la plus fidèle à la plus permissive.
     « allege » dit s'il a fallu jeter de l'information : dans ce cas
     le résultat est marqué « à vérifier », même s'il tombe juste. */
  const essais = [];
  const ajoute = (q, allege) => {
    if (q && !essais.some(e => e.q === q)) essais.push({ q, allege });
  };
  ajoute(n, false);
  ajoute(singulier(n), false);
  ajoute(traduitMateriel(n), false);
  ajoute(singulier(traduitMateriel(n)), false);
  const nu = normCle(n.replace(QUALIF_RE, " "));
  ajoute(nu, true);
  ajoute(singulier(nu), true);
  ajoute(traduitMateriel(nu), true);
  ajoute(singulier(traduitMateriel(nu)), true);

  for (const { q, allege } of essais) {
    const hit = exact(q);
    if (hit) return { ex: hit, ambigu: allege, candidats: allege ? [hit] : [] };
  }

  let cands = [], requete = n, allege = false;
  for (const essai of essais) {
    cands = tous.filter(e => exMatches(e, essai.q));
    if (cands.length) { requete = essai.q; allege = essai.allege; break; }
  }
  if (!cands.length) return rien;
  if (cands.length === 1) return { ex: cands[0], ambigu: allege, candidats: allege ? cands : [] };
  nom = requete;

  const tri = cands.slice().sort((a, b) => cmpCandidat(a, b, nom));

  /* QUAND FAUT-IL DIRE « À VÉRIFIER ».

     Premier critère essayé : les deux meilleurs candidats à égalité
     parfaite. Trop étroit — « Squat » élisait « Squat sumo » sans
     égalité, donc sans alerte, alors que « Squat » seul ne désigne
     évidemment aucun squat en particulier.

     Critère retenu : le nom RETENU est-il PLUS PRÉCIS que ce qui a
     été demandé ? Si l'app ajoute des mots que le texte ne contenait
     pas, elle a choisi une variante à la place de l'utilisateur, et
     elle doit le dire. Un nom exact ou un alias exact passent avant
     et ne sont jamais marqués. */
  const q = nom.split(/\s+/).filter(Boolean).length;
  const c = normCle(tri[0].nom.replace(/\([^)]*\)/g, " ")).split(/\s+/).filter(Boolean).length;
  /* On renvoie AUSSI les autres candidats : quand le choix est
     incertain, l'écran doit pouvoir les proposer plutôt que de
     laisser l'utilisateur retoucher son texte à l'aveugle. */
  return { ex: tri[0], ambigu: allege || c > q, candidats: tri.slice(0, 8) };
}

/* Départage entre plusieurs exercices qui correspondent.

   PREMIÈRE VERSION, FAUSSE : « le nom le plus court est le moins
   spécifique ». Elle donnait « Tractions » → « Tractions lestées »
   (17 caractères) au lieu de « Tractions (pronation) » (21), et
   « Rowing barre » → « Rowing Pendlay » au lieu de « Rowing barre
   buste penché ». Un nom court peut très bien être une variante.

   DEUXIÈME VERSION, INCOMPLÈTE : elle ne comptait que les mots EN
   TROP. « Incline Dumbbell Curl » y tombait sur « Curl spider (banc
   incliné à plat ventre) » plutôt que sur « Curl incliné aux
   haltères » — parce que « spider » ne compte que deux mots hors
   parenthèses, contre quatre. Le critère décisif manquait : combien
   de mots DEMANDÉS le candidat ne porte-t-il pas ? Le spider n'a pas
   « haltère » dans son nom, le curl incliné si.

   RÈGLE RETENUE, dans l'ordre :
   1. combien de mots demandés MANQUENT au candidat ? C'est le seul
      critère qui mesure la ressemblance plutôt que la longueur ;
   2. le nom COMMENCE-T-IL par ce qui est demandé ? « Rowing barre
      buste penché » commence par « rowing barre », « Rowing Pendlay »
      non — c'est ce critère qui tranche ce cas ;
   3. combien de mots EN PLUS, une fois les parenthèses retirées ?
      « Tractions (pronation) » n'ajoute rien à « Tractions », alors
      que « Tractions lestées » ajoute un qualificatif ;
   4. à égalité, le nom le plus court. */
function cmpCandidat(a, b, nom) {
  const s = (ex) => {
    const q = normCle(nom);
    const plein = normCle(ex.nom);
    const sansParen = normCle(ex.nom.replace(/\([^)]*\)/g, " "));
    const motsQ = q.split(/\s+/).filter(Boolean);
    const motsC = sansParen.split(/\s+/).filter(Boolean).length;
    /* Le nom ET les alias : « Rowing Pendlay » ne porte pas « barre »,
       même si un de ses alias parle de barbell. */
    const propre = normCle(ex.nom + " " + exAliases(ex).join(" "));
    return [
      motsQ.filter(w => !propre.includes(w)).length,
      (plein.startsWith(q) || sansParen.startsWith(q)) ? 0 : 1,
      Math.max(0, motsC - motsQ.length),
      ex.nom.length
    ];
  };
  const sa = s(a), sb = s(b);
  for (let i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return sa[i] - sb[i];
  return 0;
}

/* Résout tout un programme analysé. Chaque ligne reçoit son exercice
   ou reste explicitement non résolue. */
function resoudreProgramme(parse) {
  const jours = parse.jours.map((j, i) => ({
    numero: i + 1,
    titre: j.titre,
    lignes: j.lignes.map(l => {
      const r = trouveExercice(l.nom);
      return { ...l, ex: r.ex, ambigu: r.ambigu, candidats: r.candidats || [] };
    })
  }));
  const inconnus = [];
  for (const j of jours)
    for (const l of j.lignes)
      if (!l.ex && !inconnus.some(x => normalize(x) === normalize(l.nom))) inconnus.push(l.nom);
  return { jours, inconnus, ignorees: parse.ignorees };
}

/* Construit l'objet programme attendu par le reste de l'app.
   Les lignes non résolues sont ÉCARTÉES : mieux vaut un programme
   incomplet et juste qu'un programme complet et faux. L'écran a déjà
   dit lesquelles, et proposé de les créer. */
function programmeDepuisImport(resolu, nom) {
  const days = resolu.jours.map((j, i) => {
    /* Une ligne dont l'auteur n'a donné ni séries ni répétitions garde
       la valeur saisie dans l'aperçu ; sans saisie, le repli 3 × 10 est
       explicite plutôt que caché derrière un null qui s'afficherait
       « null × null » en séance. */
    const exercices = j.lignes.filter(l => l.ex).map(l => ({
      exercice: l.ex,
      series: Number.isFinite(l.series) && l.series > 0 ? l.series : 3,
      reps: (l.reps == null || l.reps === "") ? "10" : String(l.reps),
      repos: typeof smartRest === "function" ? smartRest(l.ex) : 90,
      prioritaire: false,
      note: l.note || ""
    }));
    return {
      numero: i + 1,
      titre: j.titre.replace(JOUR_RE, "").replace(/^[\s:\-–—]+/, "").trim() || `Jour ${i + 1}`,
      focus: [...new Set(exercices.map(e => LABELS.groupes[e.exercice.groupe]))].join(", "),
      exercices
    };
  }).filter(d => d.exercices.length);

  return {
    prenom: (loadJSON(STORAGE_KEYS.profil, null) || {}).prenom || "",
    objectif: "masse",
    objectifLabel: "Programme importé",
    objectifIcone: "dumbbell",
    niveau: "intermediaire",
    jours: days.length,
    materiel: "salle",
    priorite: null,
    split: "custom",
    splitLabel: "Importé",
    importe: true,
    genereLe: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    nom: nom || "Programme importé",
    days,
    conseils: [
      "Ce programme vient d'un texte importé : vérifie les séries et les répétitions avant la première séance.",
      "Les exercices non reconnus n'ont pas été ajoutés — crée-les depuis l'onglet Ajouter si tu en as besoin."
    ]
  };
}

/* ==================== ÉCRAN D'IMPORT ==================== */
let impResolu = null;

function renderImportApercu(res) {
  const el = document.getElementById("imp-apercu");
  if (!el) return;
  const nbLignes = res.jours.reduce((n, j) => n + j.lignes.length, 0);
  const nbOk = res.jours.reduce((n, j) => n + j.lignes.filter(l => l.ex).length, 0);
  const nbFlous = res.jours.reduce((n, j) => n + j.lignes.filter(l => l.ex && l.ambigu).length, 0);

  if (!nbLignes) {
    el.innerHTML = `<div class="card"><p class="goal-left">Aucun exercice reconnu dans ce texte.
      Chaque ligne d'exercice doit porter ses séries et ses répétitions, par exemple
      « Développé couché 4x8 ».</p></div>`;
    return;
  }

  el.innerHTML = `
    <div class="card">
      <h3 class="set-h">Aperçu · ${res.jours.length} jour${res.jours.length > 1 ? "s" : ""}</h3>
      <p class="goal-left" style="margin-bottom:12px">
        <strong>${nbOk}</strong> exercice${nbOk > 1 ? "s" : ""} reconnu${nbOk > 1 ? "s" : ""} sur ${nbLignes}${
          nbFlous ? `, dont <strong>${nbFlous}</strong> à vérifier` : ""}.
      </p>
      ${res.jours.map((j, ji) => `
        <div class="imp-jour">
          <p class="chrono-label">${esc(j.titre)}</p>
          ${j.lignes.map((l, li) => `
            <div class="imp-ligne ${l.ex ? (l.ambigu ? "flou" : "ok") : "ko"}" data-ji="${ji}" data-li="${li}">
              <div class="imp-tete">
                ${l.superserie ? `<span class="imp-ss">${esc(l.superserie)}</span>` : ""}
                <span class="imp-nom">${l.ex ? esc(l.ex.nom) : esc(l.nom)}</span>
                ${l.sansSets
                  ? `<span class="imp-tag imp-tag-flou">séries à préciser</span>`
                  : `<span class="imp-sets">${l.series} × ${esc(l.reps)}</span>`}
                ${l.ex ? (l.ambigu ? `<span class="imp-tag imp-tag-flou">à vérifier</span>` : "")
                       : `<span class="imp-tag">inconnu</span>`}
              </div>
              ${l.note ? `<p class="imp-note">${esc(l.note)}</p>` : ""}
              ${l.sansSets ? `
                <div class="imp-sets-edit">
                  <label>Séries
                    <input type="number" min="1" max="12" step="1" value="${l.series || 3}"
                           data-sets-j="${ji}" data-sets-l="${li}" data-sets-champ="series">
                  </label>
                  <label>Répétitions
                    <input type="text" inputmode="numeric" value="${esc(l.reps || "10")}"
                           data-sets-j="${ji}" data-sets-l="${li}" data-sets-champ="reps">
                  </label>
                </div>` : ""}
              ${(l.ambigu || !l.ex) ? `
                <div class="imp-choix">
                  ${(l.ambigu && l.candidats.length > 1) ? `
                    <label class="imp-sel">
                      <span class="visually-hidden">Exercice pour « ${esc(l.nom)} »</span>
                      <select data-pick-j="${ji}" data-pick-l="${li}">
                        ${l.candidats.map(c => `<option value="${esc(c.id)}"
                           ${c.id === l.ex.id ? "selected" : ""}>${esc(c.nom)}</option>`).join("")}
                      </select>
                    </label>` : ""}
                  ${/* Une ligne « à vérifier » doit pouvoir être CHANGÉE. Quand
                        le rapprochement vient d'un nom simplifié, il n'y a
                        qu'un candidat, donc pas de menu déroulant : sans ce
                        bouton, l'utilisateur ne pouvait que créer un doublon. */
                    (!l.ex || l.ambigu) ? `<button type="button" class="btn btn-ghost btn-sm imp-chercher"
                        data-j="${ji}" data-l="${li}">Choisir dans la bibliothèque</button>` : ""}
                  <button type="button" class="btn btn-ghost btn-sm imp-creer-ex"
                    data-j="${ji}" data-l="${li}">＋ Créer « ${esc(l.nom)} »</button>
                </div>` : ""}
            </div>`).join("")}
        </div>`).join("")}

      ${res.inconnus.length ? `
        <div class="imp-inconnus">
          <p class="chrono-label">${res.inconnus.length} exercice${res.inconnus.length > 1 ? "s" : ""} non reconnu${res.inconnus.length > 1 ? "s" : ""}</p>
          <p class="goal-left">Tant qu'ils ne sont pas résolus, ils ne seront pas ajoutés au
            programme — un exercice inventé vaudrait moins qu'un exercice absent.
            Utilise les boutons de chaque ligne pour choisir un équivalent ou créer
            l'exercice avec sa fiche.</p>
          <div class="imp-liste">${res.inconnus.map(n => `<span class="tag">${esc(n)}</span>`).join("")}</div>
        </div>` : ""}

      ${res.ignorees.length ? `
        <details class="imp-ignorees">
          <summary>${res.ignorees.length} ligne${res.ignorees.length > 1 ? "s" : ""} ignorée${res.ignorees.length > 1 ? "s" : ""}</summary>
          <div class="imp-liste">${res.ignorees.map(n => `<span class="tag">${esc(n)}</span>`).join("")}</div>
        </details>` : ""}

      <div class="program-actions" style="margin-top:14px">
        <button class="btn btn-primary" id="imp-creer" ${nbOk ? "" : "disabled"}>
          Créer ce programme</button>
      </div>
    </div>`;

  /* --- Résolution ligne par ligne ---
     Chaque geste modifie `res` en mémoire puis redessine : l'aperçu
     reste la seule source de vérité, et le bouton « Créer ce
     programme » lit toujours l'état courant. */
  const ligne = (b) => res.jours[+b.dataset.j].lignes[+b.dataset.l];

  el.querySelectorAll("[data-pick-j]").forEach(s2 =>
    s2.addEventListener("change", () => {
      const l = res.jours[+s2.dataset.pickJ].lignes[+s2.dataset.pickL];
      const choisi = allExercisesForUI().find(e => e.id === s2.value);
      if (!choisi) return;
      l.ex = choisi;
      l.ambigu = false;          // choix explicite : il n'y a plus de doute
      renderImportApercu(res);
    }));

  /* Séries laissées en blanc par l'auteur du programme. On ne les
     invente pas dans les données : on affiche un champ pré-rempli et
     c'est la saisie de l'utilisateur qui fait foi. Pas de re-rendu à
     chaque frappe — le champ perdrait le curseur. */
  el.querySelectorAll("[data-sets-champ]").forEach(inp =>
    inp.addEventListener("input", () => {
      const l = res.jours[+inp.dataset.setsJ].lignes[+inp.dataset.setsL];
      if (inp.dataset.setsChamp === "series") {
        const v = parseInt(inp.value, 10);
        l.series = Number.isFinite(v) && v > 0 ? Math.min(v, 12) : null;
      } else {
        l.reps = inp.value.trim() || null;
      }
    }));

  el.querySelectorAll(".imp-chercher").forEach(b =>
    b.addEventListener("click", () => {
      const l = ligne(b);
      openPickerPour(l.nom, (ex) => {
        l.ex = ex; l.ambigu = false;
        renderImportApercu(res);
      });
    }));

  el.querySelectorAll(".imp-creer-ex").forEach(b =>
    b.addEventListener("click", () => {
      const l = ligne(b);
      openFicheForm(l.nom, (ex) => {
        /* La fiche vient d'être créée : on la pose sur CETTE ligne, et
           sur toute autre ligne qui portait le même nom — un programme
           répète souvent le même exercice sur plusieurs jours. */
        const n = normalize(l.nom);
        for (const j of res.jours)
          for (const x of j.lignes)
            if (!x.ex && normalize(x.nom) === n) { x.ex = ex; x.ambigu = false; }
        res.inconnus = res.inconnus.filter(u => normalize(u) !== n);
        renderImportApercu(res);
      });
    }));

  const creer = document.getElementById("imp-creer");
  if (creer) creer.addEventListener("click", () => {
    const prog = programmeDepuisImport(res, "Programme importé");
    saveJSON(STORAGE_KEYS.program, prog);
    if (typeof renderProgram === "function") renderProgram(prog);
    if (typeof renderHome === "function") renderHome();
    toast(`Programme importé : ${prog.days.length} jour${prog.days.length > 1 ? "s" : ""}, ${nbOk} exercice${nbOk > 1 ? "s" : ""}.`);
    document.querySelector('[data-ppanel="generer"]')?.click();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.getElementById("imp-lire")?.addEventListener("click", () => {
  const txt = document.getElementById("imp-txt").value;
  impResolu = resoudreProgramme(parseProgrammeTexte(txt));
  renderImportApercu(impResolu);
});
document.getElementById("imp-vider")?.addEventListener("click", () => {
  document.getElementById("imp-txt").value = "";
  document.getElementById("imp-apercu").innerHTML = "";
  impResolu = null;
});

/* Sélecteur d'exercice existant : liste filtrable, réutilise la
   recherche de la bibliothèque. Ouvert depuis une ligne d'import qui
   n'a pas trouvé son exercice. */
function openPickerPour(nom, onChoisi) {
  const tous = allExercisesForUI();
  const rendre = (q) => {
    const l = q ? tous.filter(e => exMatches(e, q)) : tous;
    return l.slice(0, 60).map(e => `
      <button type="button" class="picker-item pk-item" data-exid="${esc(e.id)}">
        <span>${esc(e.nom)}</span>
        <span class="tag">${LABELS.groupes[e.groupe]} · ${LABELS.materiel[e.materiel]}</span>
      </button>`).join("") || `<p class="goal-left">Aucun exercice ne correspond.</p>`;
  };

  openHtmlPanel("Choisir un exercice", `
    <div class="card">
      <label class="fx-champ">Rechercher
        <input type="search" id="pk-q" value="${esc(nom)}" placeholder="Nom, muscle, matériel…">
      </label>
      <div id="pk-liste" class="alt-list">${rendre(nom)}</div>
    </div>`);

  const liste = document.getElementById("pk-liste");
  const brancher = () => liste.querySelectorAll(".pk-item").forEach(b =>
    b.addEventListener("click", () => {
      const ex = tous.find(e => e.id === b.dataset.exid);
      if (!ex) return;
      closeViewPanel();
      onChoisi(ex);
    }));
  brancher();
  document.getElementById("pk-q").addEventListener("input", (e) => {
    liste.innerHTML = rendre(e.target.value.trim());
    brancher();
  });
}

/* ==================== AJOUTER UNE PHOTO OU UN FICHIER ====================

   CE QUI EST RÉELLEMENT POSSIBLE, ET CE QUI NE L'EST PAS.

   Aucune API web ne permet d'appeler Live Text ou Google Lens depuis
   du code. Mais les deux systèmes agissent sur les images AFFICHÉES
   DANS UNE PAGE :
     — Safari (iOS 16+) applique Live Text aux <img> d'un site : un
       appui long propose « Sélectionner le texte » ;
     — Chrome sur Android propose « Rechercher avec Google Lens » au
       même appui long, et Lens sait extraire le texte.

   Il suffit donc d'AFFICHER la photo dans l'app pour donner accès à
   l'OCR du système — sans bibliothèque, sans clé d'API, sans envoyer
   la photo nulle part. Elle ne quitte jamais l'appareil : elle vit
   dans une URL d'objet en mémoire, révoquée quand on la retire.

   Un fichier texte, lui, n'a besoin d'aucune de ces contorsions : il
   est lu et versé directement dans le champ.
   ==================================================================== */

const IMP_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const IMP_ANDROID = /Android/i.test(navigator.userAgent);
const IMP_MOBILE = IMP_IOS || IMP_ANDROID;

let impObjectUrl = null;

/* Marche à suivre, dans les mots de la plateforme. Ne rien dire de
   générique : « utilise l'OCR de ton téléphone » n'aide personne. */
function impConsigne() {
  /* Ne sont en gras que les mots à retrouver du regard dans les menus
     du téléphone. Tout mettre en gras revient à ne rien souligner. */
  if (IMP_IOS) return `
    <p class="imp-cons">Appuie longuement sur la photo, puis
      <strong>Sélectionner le texte</strong> → <strong>Tout sélectionner</strong> →
      <strong>Copier</strong>. Reviens ici et touche <strong>Coller le texte</strong>.</p>
    <p class="imp-cons-sub">C'est Live Text, intégré à iOS depuis la version 16. La photo ne quitte pas ton téléphone.</p>`;
  if (IMP_ANDROID) return `
    <p class="imp-cons">Appuie longuement sur la photo, puis
      <strong>Rechercher avec Google Lens</strong> → onglet <strong>Texte</strong> →
      <strong>Tout sélectionner</strong> → <strong>Copier</strong>. Reviens ici et touche
      <strong>Coller le texte</strong>.</p>
    <p class="imp-cons-sub">Selon ton navigateur, l'entrée peut s'appeler « Rechercher l'image ».</p>`;
  return `
    <p class="imp-cons">Sur ordinateur, aucun outil de reconnaissance n'est intégré au navigateur.
      Deux solutions : rouvrir cette page sur ton téléphone, ou passer la photo par
      <a href="https://lens.google.com/" target="_blank" rel="noopener">Google Lens</a>
      pour en extraire le texte, puis le coller ici.</p>`;
}

function impAfficheImage(file) {
  const el = document.getElementById("imp-image");
  if (!el) return;
  if (impObjectUrl) URL.revokeObjectURL(impObjectUrl);
  impObjectUrl = URL.createObjectURL(file);
  el.classList.remove("hidden");
  el.classList.remove("grand");
  el.innerHTML = `
    <img id="imp-img" src="${impObjectUrl}" alt="Photo du programme à lire">
    <div class="imp-actions">
      <button type="button" class="btn btn-ghost btn-sm" id="imp-img-zoom">Agrandir</button>
      <button type="button" class="btn btn-ghost btn-sm" id="imp-img-retirer">Retirer la photo</button>
    </div>
    ${impConsigne()}`;

  /* Une photo de programme est un mur de texte : réduite à 320 px de
     haut, on ne vise plus rien au pouce. Le bouton rend la hauteur
     réelle, ce qui donne à l'appui long de quoi mordre. */
  const zoom = document.getElementById("imp-img-zoom");
  zoom.addEventListener("click", () => {
    const grand = el.classList.toggle("grand");
    zoom.textContent = grand ? "Réduire" : "Agrandir";
    document.getElementById("imp-img").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("imp-img-retirer").addEventListener("click", () => {
    if (impObjectUrl) { URL.revokeObjectURL(impObjectUrl); impObjectUrl = null; }
    el.classList.add("hidden");
    el.classList.remove("grand");
    el.innerHTML = "";
  });
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* Un fichier texte va directement dans le champ : rien à extraire. */
function impLitFichier(file) {
  if (file.type.startsWith("image/")) { impAfficheImage(file); return; }
  const fr = new FileReader();
  fr.onload = () => {
    const zone = document.getElementById("imp-txt");
    zone.value = String(fr.result || "");
    toast(`« ${file.name} » chargé — touche Analyser.`);
    zone.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };
  fr.onerror = () => toast("Ce fichier n'a pas pu être lu.");
  fr.readAsText(file);
}

/* Feuille « Ajouter du contexte » : trois entrées, comme partout
   ailleurs sur mobile. L'appareil photo n'a de sens que là où il
   existe — sur ordinateur la tuile ouvrirait un sélecteur de fichiers
   déguisé, donc elle n'apparaît pas. */
function openContexteSheet() {
  const tuile = (id, ico, lab) => `
    <button type="button" class="ctx-tuile" data-ctx="${id}">
      <span class="ctx-ico">${ico}</span>
      <span class="ctx-lab">${lab}</span>
    </button>`;

  openHtmlPanel("Ajouter du contexte", `
    <div class="ctx-grille">
      ${IMP_MOBILE ? tuile("camera", icon("camera"), "Appareil photo") : ""}
      ${tuile("photo", icon("image"), "Photos")}
      ${tuile("fichier", icon("file"), "Fichiers")}
    </div>
    <p class="ctx-note">
      Une photo est affichée telle quelle : c'est ${IMP_IOS ? "Live Text d'iOS"
        : IMP_ANDROID ? "Google Lens" : "l'outil de ton choix"} qui en extrait le texte,
      pas l'application. Rien n'est envoyé sur un serveur.
      Un fichier texte (.txt, .md, .csv) est lu directement.
    </p>`);

  document.querySelectorAll("[data-ctx]").forEach(b =>
    b.addEventListener("click", () => {
      closeViewPanel();
      /* Le clic sur l'input doit suivre la fermeture du panneau, sinon
         Safari considère qu'il ne vient plus d'un geste utilisateur et
         refuse d'ouvrir le sélecteur. */
      setTimeout(() => document.getElementById("imp-f-" + b.dataset.ctx)?.click(), 260);
    }));
}

["camera", "photo", "fichier"].forEach(k => {
  document.getElementById("imp-f-" + k)?.addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) impLitFichier(f);
    e.target.value = "";     // permet de reprendre le MÊME fichier ensuite
  });
});

document.getElementById("imp-contexte")?.addEventListener("click", openContexteSheet);

document.getElementById("imp-coller")?.addEventListener("click", async () => {
  /* Le presse-papiers exige HTTPS, un geste utilisateur, et peut être
     refusé sans explication. On ne suppose donc jamais qu'il répond. */
  try {
    const t = await navigator.clipboard.readText();
    if (!t || !t.trim()) { toast("Le presse-papiers est vide."); return; }
    document.getElementById("imp-txt").value = t;
    toast("Texte collé — touche Analyser.");
  } catch {
    toast("Ton navigateur n'autorise pas la lecture du presse-papiers : colle à la main dans le champ.");
    document.getElementById("imp-txt").focus();
  }
});
