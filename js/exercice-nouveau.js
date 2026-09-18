/* =========================================================
   GymCoach — Créer un exercice avec une fiche COMPLÈTE

   Jusqu'ici, un exercice ajouté à la main sortait diminué :
   `type` figé sur « iso » même pour un squat, `muscles` réduit au nom
   du groupe, `execution` et `erreurs` vides. Il s'affichait donc dans
   la bibliothèque comme une fiche creuse à côté des 141 autres.

   Ce fichier produit une fiche de même forme que celles de
   data.js : nom, groupe, matériel, niveau, type, muscles,
   description, exécution, erreurs, alias, requête vidéo.

   POUR QUE CE SOIT TENABLE, ON DEVINE CE QU'ON PEUT. Un formulaire de
   dix champs vides ne se remplit jamais. Le nom porte déjà presque
   tout : « Curl marteau à la corde » dit le groupe (biceps), le
   matériel (poulie) et le type (isolation). On pré-remplit, et
   l'utilisateur corrige — c'est beaucoup plus rapide que de choisir
   dans dix listes.

   CE QU'ON NE PEUT PAS FAIRE ICI, ET IL FAUT LE DIRE : le schéma
   animé. Les 141 schémas de la bibliothèque sont CALCULÉS — angles
   articulaires, cinématique inverse, vérification que rien ne
   traverse le sol. Aucun code ne peut en produire un à partir d'un
   nom. Un exercice créé ici a donc une fiche complète en texte, et
   pas de schéma. C'est écrit sur la fiche plutôt que caché.
   ========================================================= */

/* ---------- Inférence depuis le nom ---------- */

/* Ordre important : les entrées les plus spécifiques d'abord.
   « leg curl » doit tomber sur ischios avant que « curl » ne le
   range dans biceps. */
const DEVINE_GROUPE = [
  [/leg[\s-]*curl|ischio|femoral|soulev[ée].*terre|good[\s-]*morning|hip[\s-]*thrust|fessier|glute|nordic|pont/i, "ischios-fessiers"],
  [/mollet|calf|solaire|sol[ée]aire|gastroc/i, "mollets"],
  [/lombaire|superman|bird[\s-]*dog|hyperextension|extension\s+du?\s+dos/i, "lombaires"],
  [/crunch|abdo|gainage|planche|plank|sit[\s-]*up|relev[ée].*jambe|hollow|russian|dragon|l-?sit|mountain/i, "abdos"],
  [/triceps|dips|barre\s+au\s+front|pushdown|skull|extension.*(nuque|corde)|kickback\s+triceps/i, "triceps"],
  [/biceps|curl/i, "biceps"],
  [/[ée]l[ée]vation|oiseau|face[\s-]*pull|d[ée]velopp[ée]\s+(militaire|[ée]paule|arnold|nuque)|lateral[\s-]*raise|shoulder|pike|handstand|rowing\s+menton|upright/i, "epaules"],
  [/traction|pull[\s-]*up|chin[\s-]*up|tirage|rowing|pulldown|row\b|shrug|dorsaux?|pull[\s-]*over|rack[\s-]*pull/i, "dos"],
  [/d[ée]velopp[ée]|pompe|push[\s-]*up|[ée]cart[ée]|pec[\s-]*deck|butterfly|bench|chest|crossover|pectoraux/i, "pectoraux"],
  [/squat|presse|leg[\s-]*(press|extension)|fente|lunge|quadriceps|hack|sissy|wall[\s-]*sit|step[\s-]*up/i, "quadriceps"]
];

const DEVINE_MATERIEL = [
  [/poulie|c[âa]ble|cable|corde|rope|pulley|crossover|pushdown|pulldown/i, "poulie"],
  [/halt[èe]re|dumbbell|\bdb\b|\bhalt/i, "halteres"],
  [/machine|presse|pec[\s-]*deck|butterfly|hack|leg[\s-]*(press|curl|extension)|guid[ée]|smith|assist/i, "machine"],
  [/barre|barbell|\bez\b|trap[\s-]*bar|landmine/i, "barre"],
  [/poids\s+du\s+corps|body[\s-]*weight|traction|pompe|push[\s-]*up|pull[\s-]*up|chin[\s-]*up|dips|gainage|planche|plank|crunch|superman|burpee/i, "poids-du-corps"]
];

/* Polyarticulaire : plusieurs articulations en jeu. La liste est
   courte parce que la règle l'est — presque tout le reste est de
   l'isolation. */
const POLY_RE = /squat|d[ée]velopp[ée]|soulev[ée]|rowing|traction|pull[\s-]*up|chin[\s-]*up|dips|presse|fente|lunge|hip[\s-]*thrust|good[\s-]*morning|clean|[ée]paul[ée]|arrach[ée]|tirage|pompe|push[\s-]*up|burpee|step[\s-]*up|thruster/i;

/* Muscles usuels par groupe : un point de départ que l'utilisateur
   affine, plutôt que le simple nom du groupe. */
const MUSCLES_PAR_GROUPE = {
  pectoraux: "Grand pectoral, deltoïde antérieur, triceps",
  dos: "Grand dorsal, rhomboïdes, trapèzes, biceps",
  epaules: "Deltoïdes (antérieur, moyen, postérieur)",
  biceps: "Biceps brachial, brachial antérieur, brachio-radial",
  triceps: "Triceps brachial (3 chefs)",
  quadriceps: "Quadriceps, fessiers, adducteurs",
  "ischios-fessiers": "Ischio-jambiers, grand fessier, lombaires",
  mollets: "Gastrocnémiens, soléaire",
  abdos: "Grand droit, obliques, transverse",
  lombaires: "Érecteurs du rachis, fessiers"
};

function devineFiche(nom) {
  const n = String(nom || "");
  /* Renvoie null quand RIEN ne correspond, au lieu du premier de la
     liste. « Zercher Carry » ne dit rien à ces expressions : le
     classer « pectoraux » parce que c'est la première entrée serait
     une devinette présentée comme un fait, et l'utilisateur la
     validerait sans la lire. Un champ vide, lui, se remarque. */
  const trouve = (table) => {
    for (const [re, val] of table) if (re.test(n)) return val;
    return null;
  };
  const groupe = trouve(DEVINE_GROUPE);
  return {
    nom: n.trim(),
    groupe,
    materiel: trouve(DEVINE_MATERIEL),
    niveau: "intermediaire",
    /* Le type, lui, a un défaut légitime : l'immense majorité des
       exercices sont de l'isolation, et la liste polyarticulaire est
       courte et fiable. */
    type: POLY_RE.test(n) ? "poly" : "iso",
    muscles: groupe ? (MUSCLES_PAR_GROUPE[groupe] || "") : "",
    description: "",
    execution: [],
    erreurs: [],
    alias: []
  };
}

/* ---------- Formulaire de fiche complète ---------- */

const G_OPTS = [
  ["pectoraux", "Pectoraux"], ["dos", "Dos"], ["epaules", "Épaules"],
  ["biceps", "Biceps"], ["triceps", "Triceps"], ["quadriceps", "Quadriceps"],
  ["ischios-fessiers", "Ischios / Fessiers"], ["mollets", "Mollets"],
  ["abdos", "Abdominaux"], ["lombaires", "Lombaires"]
];
const M_OPTS = [
  ["barre", "Barre"], ["halteres", "Haltères"], ["machine", "Machine"],
  ["poulie", "Poulie"], ["poids-du-corps", "Poids du corps"]
];
const N_OPTS = [["debutant", "Débutant"], ["intermediaire", "Intermédiaire"], ["avance", "Avancé"]];

/* Quand la valeur n'a pas pu être devinée, on ouvre sur un choix vide
   et marqué : le champ exige une décision au lieu d'en suggérer une. */
const sel = (id, opts, val, lab) => `
  <label class="fx-champ${val ? "" : " fx-adevine"}">${lab}${val ? "" : ` <span class="fx-flag">à choisir</span>`}
    <select id="${id}" required>
      ${val ? "" : `<option value="" selected>— à choisir —</option>`}
      ${opts.map(([v, t]) =>
        `<option value="${v}" ${v === val ? "selected" : ""}>${t}</option>`).join("")}
    </select>
  </label>`;

function ficheFormHtml(pre) {
  return `
  <form id="fx-form" class="card fx-form">
    <p class="video-hint" style="margin-bottom:14px">
      Les champs sont pré-remplis d'après le nom — corrige ce qui ne va pas.
      Plus la fiche est complète, plus elle ressemble aux autres de la bibliothèque.
    </p>

    <label class="fx-champ">Nom de l'exercice *
      <input type="text" id="fx-nom" required value="${esc(pre.nom)}">
    </label>

    <div class="fx-grille">
      ${sel("fx-groupe", G_OPTS, pre.groupe, "Groupe musculaire *")}
      ${sel("fx-materiel", M_OPTS, pre.materiel, "Matériel *")}
      ${sel("fx-niveau", N_OPTS, pre.niveau, "Niveau *")}
      ${sel("fx-type", [["poly", "Polyarticulaire"], ["iso", "Isolation"]], pre.type, "Type *")}
    </div>

    <label class="fx-champ">Muscles travaillés
      <input type="text" id="fx-muscles" value="${esc(pre.muscles)}"
        placeholder="Ex : Grand pectoral, deltoïde antérieur, triceps">
    </label>

    <label class="fx-champ">Description
      <textarea id="fx-description" rows="2"
        placeholder="À quoi sert cet exercice, ce qui le distingue de ses voisins.">${esc(pre.description)}</textarea>
    </label>

    <label class="fx-champ">Exécution — une étape par ligne
      <textarea id="fx-execution" rows="4"
        placeholder="Position de départ.&#10;Trajet du mouvement.&#10;Moment où souffler.&#10;Retour contrôlé.">${esc((pre.execution || []).join("\n"))}</textarea>
    </label>

    <label class="fx-champ">Erreurs fréquentes — une par ligne
      <textarea id="fx-erreurs" rows="3"
        placeholder="Dos qui s'arrondit.&#10;Amplitude écourtée.&#10;Élan des hanches.">${esc((pre.erreurs || []).join("\n"))}</textarea>
    </label>

    <label class="fx-champ">Autres noms — séparés par des virgules
      <input type="text" id="fx-alias" value="${esc((pre.alias || []).join(", "))}"
        placeholder="Ex : incline bench press, développé incliné">
    </label>

    <p class="fx-note">
      Cet exercice n'aura pas de schéma animé : les 141 schémas de la bibliothèque
      sont calculés un par un (angles articulaires, cinématique), aucun code ne peut
      en produire à partir d'un nom. Tout le reste de la fiche fonctionnera
      normalement — recherche, séances, statistiques, records.
    </p>

    <button type="submit" class="btn btn-primary btn-lg">Créer l'exercice</button>
  </form>`;
}

/* Lit le formulaire et fabrique la fiche. Les lignes vides des zones
   de texte sont retirées : une étape vide dans une liste numérotée
   est plus laide qu'une étape manquante. */
function ficheDepuisForm() {
  const v = (id) => (document.getElementById(id)?.value || "").trim();
  const lignes = (id) => v(id).split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const nom = v("fx-nom");
  const groupe = v("fx-groupe");
  if (!nom || !groupe || !v("fx-materiel")) return null;
  return {
    id: "perso-" + Date.now(),
    nom,
    groupe,
    materiel: v("fx-materiel"),
    niveau: v("fx-niveau"),
    type: v("fx-type"),
    muscles: v("fx-muscles") || LABELS.groupes[groupe],
    description: v("fx-description"),
    execution: lignes("fx-execution"),
    erreurs: lignes("fx-erreurs"),
    alias: v("fx-alias").split(",").map(s => s.trim()).filter(Boolean),
    videoUrl: null,
    videoQuery: nom + " technique musculation",
    custom: true
  };
}

/* Ouvre le formulaire dans le panneau existant. `onCree` reçoit la
   fiche enregistrée — c'est ainsi que l'écran d'import remplace sa
   ligne inconnue par le nouvel exercice. */
function openFicheForm(nom, onCree) {
  const pre = devineFiche(nom);
  openHtmlPanel("Nouvel exercice", ficheFormHtml(pre));
  const form = document.getElementById("fx-form");

  /* Choisir le groupe met à jour la suggestion de muscles — mais
     JAMAIS par-dessus ce que l'utilisateur a écrit. On ne remplace que
     si le champ est vide ou porte encore une suggestion automatique,
     ce qui se reconnaît à ce qu'elle figure dans la table. */
  const champMuscles = document.getElementById("fx-muscles");
  const suggestions = Object.values(MUSCLES_PAR_GROUPE);
  document.getElementById("fx-groupe").addEventListener("change", (e) => {
    const v = champMuscles.value.trim();
    if (!v || suggestions.includes(v)) champMuscles.value = MUSCLES_PAR_GROUPE[e.target.value] || "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ex = ficheDepuisForm();
    if (!ex) return;
    const list = getCustomExercises();
    list.push(ex);
    saveJSON(STORAGE_KEYS.custom, list);
    if (typeof renderLibrary === "function") renderLibrary();
    if (typeof renderCustomList === "function") renderCustomList();
    closeViewPanel();
    toast(`« ${ex.nom} » ajouté à ta bibliothèque.`);
    if (typeof onCree === "function") onCree(ex);
  });
}
