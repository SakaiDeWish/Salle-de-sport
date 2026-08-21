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

/* Un titre de jour : « Jour 1 », « Day 2 — Push », « Séance A »,
   « Lundi », ou une ligne courte sans indication de séries. */
const JOUR_RE = /^\s*(?:jour|journee|journée|day|séance|seance|s[ée]ance)\s*[:\-–—]?\s*(\d+|[a-z])\b/i;
const JOURS_SEMAINE = /^\s*(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;

/* Séries × reps, dans les formes réellement rencontrées :
   « 4x8 », « 4 × 8 », « 3x8-10 », « 4 sets x 12 », « 3 séries de 10 ».
   Le groupe 1 est le nombre de séries, le groupe 2 les répétitions
   (éventuellement une fourchette). */
const SETS_RE = new RegExp(
  "(\\d{1,2})\\s*(?:s[ée]ries?|sets?|x|×)?\\s*(?:de|of|x|×)\\s*(\\d{1,3}(?:\\s*[-–/à]\\s*\\d{1,3})?)"
  + "|(\\d{1,2})\\s*[x×]\\s*(\\d{1,3}(?:\\s*[-–/à]\\s*\\d{1,3})?)", "i");

/* Bruit fréquent en fin de ligne : temps de repos, tempo, RPE, charge.
   On le retire du NOM, pas de la ligne — le nom est ce qu'on cherche
   à rapprocher de la bibliothèque. */
const BRUIT_RE = /\b(?:repos|rest|tempo|rpe|rir)\b.*$|\b\d+\s*(?:s|sec|secondes?|min|kg|lbs?)\b.*$|@.*$/i;

function normNom(t) {
  return t
    .replace(/^[\s•*\-–—·>]+/, "")        // puces
    .replace(/^\d+[.)]\s*/, "")           // numérotation « 1. »
    .replace(BRUIT_RE, "")
    .replace(/[:\-–—]\s*$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* Analyse le texte collé. Ne décide RIEN : renvoie ce qu'il a compris,
   avec les lignes non reconnues, pour que l'écran les montre. */
function parseProgrammeTexte(txt) {
  const lignes = String(txt || "").split(/\r?\n/);
  const jours = [];
  const ignorees = [];
  let courant = null;

  const nouveauJour = (titre) => {
    courant = { titre: titre || `Jour ${jours.length + 1}`, lignes: [] };
    jours.push(courant);
  };

  for (const brute of lignes) {
    const l = brute.trim();
    if (!l) continue;

    const mJour = JOUR_RE.exec(l) || JOURS_SEMAINE.exec(l);
    const aDesSets = SETS_RE.test(l);

    /* Un en-tête de jour ne porte jamais de séries : « Jour 3 × 8 »
       n'existe pas, mais « Développé 4 x 8 » commence par un chiffre.
       C'est cette condition qui évite de couper un programme en
       autant de jours qu'il a d'exercices. */
    if (mJour && !aDesSets) {
      nouveauJour(l.replace(/[:\-–—]\s*$/, "").trim());
      continue;
    }

    if (!aDesSets) {
      /* Ligne sans séries : soit un titre de bloc (« Push », « Haut du
         corps »), soit du bruit. Courte et sans chiffre, on la prend
         pour un titre ; sinon on la met de côté et on le dit. */
      if (l.length <= 32 && !/\d/.test(l)) nouveauJour(l);
      else ignorees.push(l);
      continue;
    }

    const m = SETS_RE.exec(l);
    const series = parseInt(m[1] || m[3], 10);
    const reps = (m[2] || m[4] || "").replace(/\s/g, "");
    const nom = normNom(l.slice(0, m.index));
    if (!nom) { ignorees.push(l); continue; }
    if (!courant) nouveauJour(null);
    courant.lignes.push({ nom, series, reps, brute: l });
  }

  return { jours: jours.filter(j => j.lignes.length), ignorees };
}

/* Rapproche un nom de la bibliothèque. On réutilise exMatches(), donc
   toute la table d'alias français / anglais construite pour la
   recherche — « incline bench press » comme « développé incliné ».
   Renvoie le meilleur candidat, ou null. */
function trouveExercice(nom) {
  const tous = allExercisesForUI();
  const n = normalize(nom);
  const rien = { ex: null, ambigu: false, candidats: [] };
  if (!n) return rien;

  // 1. nom exact — aucune ambiguïté possible
  let hit = tous.find(e => normalize(e.nom) === n);
  if (hit) return { ex: hit, ambigu: false, candidats: [] };
  // 2. alias exact
  hit = tous.find(e => exAliases(e).some(a => normalize(a) === n));
  if (hit) return { ex: hit, ambigu: false, candidats: [] };
  // 3. recherche par mots — celle de la barre de recherche
  const cands = tous.filter(e => exMatches(e, nom));
  if (!cands.length) return rien;
  if (cands.length === 1) return { ex: cands[0], ambigu: false, candidats: [] };

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
  const q = normalize(nom).split(/\s+/).filter(Boolean).length;
  const c = normalize(tri[0].nom.replace(/\([^)]*\)/g, " ")).split(/\s+/).filter(Boolean).length;
  /* On renvoie AUSSI les autres candidats : quand le choix est
     incertain, l'écran doit pouvoir les proposer plutôt que de
     laisser l'utilisateur retoucher son texte à l'aveugle. */
  return { ex: tri[0], ambigu: c > q, candidats: tri.slice(0, 8) };
}

/* Départage entre plusieurs exercices qui correspondent.

   PREMIÈRE VERSION, FAUSSE : « le nom le plus court est le moins
   spécifique ». Elle donnait « Tractions » → « Tractions lestées »
   (17 caractères) au lieu de « Tractions (pronation) » (21), et
   « Rowing barre » → « Rowing Pendlay » au lieu de « Rowing barre
   buste penché ». Un nom court peut très bien être une variante.

   RÈGLE RETENUE, dans l'ordre :
   1. le nom COMMENCE-T-IL par ce qui est demandé ? « Rowing barre
      buste penché » commence par « rowing barre », « Rowing Pendlay »
      non — c'est ce seul critère qui tranche ce cas ;
   2. combien de mots EN PLUS, une fois les parenthèses retirées ?
      « Tractions (pronation) » n'ajoute rien à « Tractions », alors
      que « Tractions lestées » ajoute un qualificatif ;
   3. à égalité, le nom le plus court. */
function cmpCandidat(a, b, nom) {
  const s = (ex) => {
    const q = normalize(nom);
    const plein = normalize(ex.nom);
    const sansParen = normalize(ex.nom.replace(/\([^)]*\)/g, " "));
    const motsQ = q.split(/\s+/).filter(Boolean).length;
    const motsC = sansParen.split(/\s+/).filter(Boolean).length;
    return [
      (plein.startsWith(q) || sansParen.startsWith(q)) ? 0 : 1,
      Math.max(0, motsC - motsQ),
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
    const exercices = j.lignes.filter(l => l.ex).map(l => ({
      exercice: l.ex,
      series: l.series,
      reps: l.reps,
      repos: typeof smartRest === "function" ? smartRest(l.ex) : 90,
      prioritaire: false
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
                <span class="imp-nom">${l.ex ? esc(l.ex.nom) : esc(l.nom)}</span>
                <span class="imp-sets">${l.series} × ${esc(l.reps)}</span>
                ${l.ex ? (l.ambigu ? `<span class="imp-tag imp-tag-flou">à vérifier</span>` : "")
                       : `<span class="imp-tag">inconnu</span>`}
              </div>
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
                  ${!l.ex ? `<button type="button" class="btn btn-ghost btn-sm imp-chercher"
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
