/* =========================================================
   GymCoach — Accueil, onboarding, nutrition & outils
   - Écran d'accueil : prochaine séance, anneau d'objectif,
     streak, dernier PR, résumé du mois, accroche motivante
   - Onboarding au premier lancement (pré-remplit le profil
     et génère le programme)
   - Nutrition : TDEE (Mifflin-St Jeor), macros, conseils
   - Outils : estimateur de 1RM + calculateur de disques
   ========================================================= */

STORAGE_KEYS.nutrition = "gymcoach.nutrition";
STORAGE_KEYS.onboarded = "gymcoach.onboarded";

/* ---------- Accroches motivantes (sobres, pas de bullshit) ---------- */
const QUOTES = [
  "La meilleure séance, c'est celle que tu fais.",
  "Personne n'a jamais regretté un entraînement terminé.",
  "La régularité bat le talent quand le talent ne s'entraîne pas.",
  "Chaque série te rapproche de la version de toi que tu vises.",
  "Le fer ne ment jamais : tu récoltes ce que tu répètes.",
  "Aujourd'hui compte double : c'est le jour où tu y vas quand même."
];

/* ---------- Écran d'accueil ---------- */
function nextProgramDay() {
  const program = loadJSON(STORAGE_KEYS.program, null);
  if (!program || !program.days.length) return null;
  // prochaine séance = celle qui suit la dernière séance du programme jouée
  const h = getHistory();
  let lastNum = 0;
  for (const r of h) {
    const m = /^Séance (\d+)/.exec(r.nom);
    if (m) { lastNum = parseInt(m[1], 10); break; } // l'historique est trié récent -> ancien
  }
  const idx = lastNum % program.days.length; // après la n, la n+1 (boucle)
  return { program, day: program.days[idx], index: idx };
}

/* Progression hebdo « barre olympique » : un disque chargé par séance
   validée — la métaphore appartient à la salle, pas aux dashboards. */
function plateLoader(done, goal) {
  const g = Math.max(1, goal);
  const W = 300, H = 84, midY = H / 2;
  const sleeveX = 74;                       // début du manchon (zone des disques)
  const plateW = 15, gap = 5;
  const plates = [];
  for (let i = 0; i < g; i++) {
    const x = sleeveX + 14 + i * (plateW + gap);
    const ph = 56 - i * 3;                  // disques dégressifs, comme en vrai
    plates.push(`<rect class="plate ${i < done ? "plate-on" : ""}" x="${x}" y="${midY - ph / 2}"
      width="${plateW}" height="${ph}" rx="4" style="animation-delay:${i * 0.08}s"></rect>`);
  }
  return `<div class="plate-loader" role="img" aria-label="${done} séance(s) sur ${g} cette semaine">
    <svg viewBox="0 0 ${W} ${H}">
      <line class="pl-bar" x1="6" y1="${midY}" x2="${W - 6}" y2="${midY}"></line>
      <rect class="pl-collar" x="${sleeveX}" y="${midY - 9}" width="9" height="18" rx="3"></rect>
      ${plates.join("")}
    </svg>
  </div>`;
}

/* Accès direct Programme & Nutrition depuis l'accueil (C1) : pas un simple
   lien, une tuile qui montre déjà l'état — programme actif, calories du jour. */
function homeAccessTiles() {
  const program = loadJSON(STORAGE_KEYS.program, null);
  const nutri = loadJSON(STORAGE_KEYS.nutrition, null);
  let kcal = null;
  if (nutri && nutri.age) {
    const bmr = nutri.sexe === "h"
      ? 10 * nutri.poids + 6.25 * nutri.taille - 5 * nutri.age + 5
      : 10 * nutri.poids + 6.25 * nutri.taille - 5 * nutri.age - 161;
    const delta = nutri.objectif === "masse" ? 300 : nutri.objectif === "seche" ? -400 : 0;
    kcal = Math.round(bmr * parseFloat(nutri.activite) + delta);
  }
  return `<div class="home-access">
    <button class="card access-tile" data-go="programme">
      <span class="access-ico">${icon("target")}</span>
      <span class="access-txt">
        <span class="access-nom">Programme</span>
        <span class="access-val">${program
          ? esc(program.nom || program.objectifLabel || "Actif") + " · " + program.days.length + " séances/sem."
          : "À créer — 2 min de questions"}</span>
      </span>
    </button>
    <button class="card access-tile" data-go="nutrition">
      <span class="access-ico">${icon("apple")}</span>
      <span class="access-txt">
        <span class="access-nom">Nutrition</span>
        <span class="access-val">${kcal
          ? kcal.toLocaleString("fr-FR") + " kcal/jour · macros calculées"
          : "Calcule tes besoins"}</span>
      </span>
      <span class="access-hint" aria-hidden="true">Panneau</span>
    </button>
    <button class="card access-tile" data-go="bibliotheque">
      <span class="access-ico">${icon("book")}</span>
      <span class="access-txt">
        <span class="access-nom">Bibliothèque d'exercices</span>
        <span class="access-val">${(typeof allExercisesForUI === "function"
          ? allExercisesForUI().length : 0)} exercices · schémas animés</span>
      </span>
      <span class="access-hint" aria-hidden="true">Panneau</span>
    </button>
  </div>`;
}

/* Panneau de personnalisation : quelles cartes, dans quel ordre (C2) */
function homeCustomizePanel() {
  const cards = getHomeCards();
  return disclosure("home.custom", {
    summary: `<span class="disc-title">Personnaliser l'accueil</span>
      <span class="disc-meta">${cards.filter(c => c.on).length} bloc(s) affiché(s)</span>`,
    label: "Modifier",
    what: `Choisis ce que tu veux voir en ouvrant l'app, et dans quel ordre. Décoche ce qui ne
      te sert pas : un accueil court se lit d'un coup d'œil entre deux séries. Ton choix est
      mémorisé sur cet appareil.`,
    detail: `<ul class="hc-list">
      ${cards.map((c, i) => `
        <li class="hc-item">
          <label class="hc-check">
            <input type="checkbox" class="hc-on" data-key="${esc(c.key)}" ${c.on ? "checked" : ""}>
            <span>${esc(HOME_CARD_LABELS[c.key] || c.key)}</span>
          </label>
          <span class="hc-order">
            <button class="btn-ic hc-up" data-key="${esc(c.key)}" title="Monter" aria-label="Monter" ${i === 0 ? "disabled" : ""}>▲</button>
            <button class="btn-ic hc-down" data-key="${esc(c.key)}" title="Descendre" aria-label="Descendre" ${i === cards.length - 1 ? "disabled" : ""}>▼</button>
          </span>
        </li>`).join("")}
    </ul>
    <button class="btn btn-ghost btn-sm" id="hc-reset">Rétablir l'accueil par défaut</button>`
  });
}

function renderHome() {
  const profil = loadJSON(STORAGE_KEYS.profil, null);
  const gs = goalStatus();
  const next = nextProgramDay();
  const h = getHistory();
  const now = new Date();
  const thisMonth = h.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const moisTemps = thisMonth.reduce((s, r) => s + r.dureeMs, 0);
  const moisVolume = thisMonth.reduce((s, r) => s + (r.volume || 0), 0);
  const prs = computePRs();
  const lastPR = prs.slice().sort((a, b) => b.best.date - a.best.date)[0] || null;
  const quote = QUOTES[new Date().getDate() % QUOTES.length];
  const prenom = profil?.prenom ? ", " + esc(profil.prenom) : "";
  const weights = loadJSON(STORAGE_KEYS.weights, []);

  /* Chaque bloc de l'accueil est indépendant : affiché ou non, dans
     l'ordre choisi par l'utilisateur (C2). */
  const BLOCKS = {
    next: () => next ? `
      <button class="card home-cta" id="home-start">
        <div>
          <p class="chrono-label">Prochaine séance</p>
          <h2 class="display-sm">Séance ${next.day.numero} — ${esc(next.day.titre)}</h2>
          <p class="day-focus">${esc(next.day.focus)} · ~${estimateDayMinutes(next.day)} min · ${next.day.exercices.length} exercices</p>
        </div>
        <span class="home-cta-go">${icon("play")}</span>
      </button>` : `
      <button class="card home-cta" id="home-create-program">
        <div>
          <p class="chrono-label">Première étape</p>
          <h2 class="display-sm">Crée ton programme</h2>
          <p class="day-focus">2 min de questions, un plan adapté à ton objectif.</p>
        </div>
        <span class="home-cta-go">${icon("play")}</span>
      </button>`,

    acces: () => homeAccessTiles(),

    objectif: () => `
      <div class="card home-tile home-goal">
        <div>
          <p class="chrono-label">La barre de la semaine</p>
          ${plateLoader(gs.doneThisWeek, gs.goal)}
          <p class="goal-big">${gs.doneThisWeek}<span class="goal-sep">/</span>${gs.goal}
          ${gs.achievedThisWeek
            ? '<span class="goal-ok">Objectif atteint</span>'
            : `<span class="goal-left">encore ${gs.goal - gs.doneThisWeek} disque${gs.goal - gs.doneThisWeek > 1 ? "s" : ""}</span>`}</p>
        </div>
      </div>`,

    pr: () => `
      <div class="card home-tile">
        <p class="chrono-label">${icon("trophy")} Dernier record</p>
        ${lastPR
          ? `<p class="home-pr">${esc(lastPR.nom)}</p>
             <p class="goal-left"><strong>${lastPR.best.poids} kg × ${lastPR.best.reps}</strong> · ${new Date(lastPR.best.date).toLocaleDateString("fr-FR")}</p>`
          : `<p class="goal-left">Valide des séries chargées pour débloquer tes records.</p>`}
      </div>`,

    mois: () => `
      <div class="stat-tiles">
        <div class="card stat-tile"><span class="chrono-value">${thisMonth.length}</span><span class="chrono-label">Séances ce mois</span></div>
        <div class="card stat-tile"><span class="chrono-value">${fmtClock(moisTemps)}</span><span class="chrono-label">Temps ce mois</span></div>
        <div class="card stat-tile"><span class="chrono-value">${Math.round(moisVolume).toLocaleString("fr-FR")} kg</span><span class="chrono-label">Volume ce mois</span></div>
      </div>`,

    poids: () => `
      <div class="card home-tile">
        <p class="chrono-label">Poids de corps</p>
        ${weights.length
          ? `<p class="goal-big">${weights[weights.length - 1].kg} <span class="goal-left">kg</span></p>
             <p class="goal-left">Relevé du ${new Date(weights[weights.length - 1].date).toLocaleDateString("fr-FR")}${
               weights.length >= 2 ? ` · ${(weights[weights.length - 1].kg - weights[0].kg >= 0 ? "+" : "")}${(weights[weights.length - 1].kg - weights[0].kg).toFixed(1)} kg depuis le début` : ""}</p>`
          : `<p class="goal-left">Aucun relevé — ajoute-le depuis l'onglet Suivi.</p>`}
      </div>`,

    liens: () => `
      <div class="program-actions home-links">
        <button class="btn btn-ghost" data-go="bibliotheque">Exercices</button>
        <button class="btn btn-ghost" data-go="suivi">Mon suivi</button>
        <button class="btn btn-ghost" data-go="seance">Démarrer une séance</button>
      </div>`
  };

  const cards = getHomeCards();
  const on = k => cards.some(c => c.key === k && c.on);
  // les tuiles objectif + PR partagent une grille quand les deux sont visibles
  const gridKeys = ["objectif", "pr", "poids"].filter(on);
  const rendered = [];
  let gridDone = false;
  for (const c of cards) {
    if (!c.on || c.key === "streak") continue;
    if (gridKeys.includes(c.key)) {
      if (gridDone) continue;
      gridDone = true;
      rendered.push(`<div class="home-grid">${gridKeys.map(k => BLOCKS[k]()).join("")}</div>`);
      continue;
    }
    if (BLOCKS[c.key]) rendered.push(BLOCKS[c.key]());
  }

  document.getElementById("home-content").innerHTML = `
    <section class="hero home-hero">
      <div class="home-hero-text">
        <p class="kicker">${now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
        <h1 class="display">Salut${prenom}<span class="accent">.</span></h1>
        <p class="hero-sub">${esc(quote)}</p>
      </div>
      ${on("streak") ? `
      <!-- pièce héros : le streak en numéral géant, décalé -->
      <div class="streak-hero" aria-label="Streak : ${gs.streak} semaine(s)">
        <span class="streak-num">${gs.streak}</span>
        <span class="streak-cap">${icon("flame")} semaine${gs.streak > 1 ? "s" : ""}<br>d'affilée</span>
      </div>` : ""}
    </section>
    ${rendered.join("")}
    ${homeCustomizePanel()}
  `;

  const start = document.getElementById("home-start");
  if (start) start.addEventListener("click", () => {
    // même logique que le lancement depuis l'écran Séance
    const exercises = next.day.exercices.map(l =>
      newLiveExercise(l.exercice, `${l.series} × ${l.reps}`, null));
    startSession(`Séance ${next.day.numero} — ${next.day.titre}`, exercises);
    activateView("seance");
  });
  const create = document.getElementById("home-create-program");
  if (create) create.addEventListener("click", () => activateView("programme"));
  document.querySelectorAll("#home-content [data-go]").forEach(b =>
    b.addEventListener("click", () => activateView(b.dataset.go)));

  /* Personnalisation : visibilité + ordre, puis re-rendu */
  document.querySelectorAll(".hc-on").forEach(box =>
    box.addEventListener("change", () => {
      const list = getHomeCards();
      const c = list.find(x => x.key === box.dataset.key);
      if (c) c.on = box.checked;
      saveHomeCards(list);
      renderHome();
    }));
  const move = (key, dir) => {
    const list = getHomeCards();
    const i = list.findIndex(x => x.key === key);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    saveHomeCards(list);
    renderHome();
  };
  document.querySelectorAll(".hc-up").forEach(b =>
    b.addEventListener("click", () => move(b.dataset.key, -1)));
  document.querySelectorAll(".hc-down").forEach(b =>
    b.addEventListener("click", () => move(b.dataset.key, 1)));
  const reset = document.getElementById("hc-reset");
  if (reset) reset.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.homeCards);
    renderHome();
  });
}

document.querySelectorAll('.tab[data-view="accueil"]').forEach(t =>
  t.addEventListener("click", renderHome));

/* ---------- Onboarding (premier lancement) ---------- */
function maybeOnboard() {
  if (localStorage.getItem(STORAGE_KEYS.onboarded)) return;
  if (loadJSON(STORAGE_KEYS.profil, null)) {          // utilisateur existant :
    localStorage.setItem(STORAGE_KEYS.onboarded, "1"); // pas d'onboarding
    return;
  }
  const box = document.getElementById("onboarding");
  document.getElementById("onboarding-content").innerHTML = `
    <p class="kicker">Bienvenue</p>
    <h2 class="display-sm">On se règle en 30 secondes.</h2>
    <p class="video-hint">Ces réponses pré-remplissent ton programme, tes repos et ta nutrition. Tout reste modifiable ensuite.</p>
    <div class="form-grid onb-grid">
      <label>Ton prénom
        <input type="text" id="ob-prenom" placeholder="Ex : Ethan"></label>
      <label>Ton objectif
        <select id="ob-objectif">
          <option value="masse">Prise de masse</option>
          <option value="force">Force</option>
          <option value="seche">Sèche / perte de gras</option>
          <option value="forme">Remise en forme</option>
        </select></label>
      <label>Ton niveau
        <select id="ob-niveau">
          <option value="debutant">Débutant</option>
          <option value="intermediaire">Intermédiaire</option>
          <option value="avance">Avancé</option>
        </select></label>
      <label>Ton matériel
        <select id="ob-materiel">
          <option value="salle">Salle complète</option>
          <option value="halteres">Haltères + banc</option>
          <option value="corps">Poids du corps</option>
        </select></label>
      <label>Séances / semaine
        <select id="ob-jours">
          <option value="2">2</option><option value="3" selected>3</option>
          <option value="4">4</option><option value="5">5</option>
        </select></label>
    </div>
    <button class="btn btn-primary btn-lg" id="ob-go">C'est parti</button>
    <button class="linklike onb-skip" id="ob-skip">Plus tard, je veux juste explorer</button>
  `;
  box.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  const close = () => {
    localStorage.setItem(STORAGE_KEYS.onboarded, "1");
    box.classList.add("hidden");
    document.body.style.overflow = "";
    renderHome();
  };
  document.getElementById("ob-skip").addEventListener("click", close);
  document.getElementById("ob-go").addEventListener("click", () => {
    const params = {
      prenom: document.getElementById("ob-prenom").value.trim() || "Champion",
      objectif: document.getElementById("ob-objectif").value,
      niveau: document.getElementById("ob-niveau").value,
      jours: parseInt(document.getElementById("ob-jours").value, 10),
      materiel: document.getElementById("ob-materiel").value,
      priorite: null,
      split: "auto"
    };
    saveJSON(STORAGE_KEYS.profil, params);
    // pré-remplit le formulaire Programme avec les réponses de l'onboarding
    document.getElementById("p-prenom").value = params.prenom;
    document.getElementById("p-objectif").value = params.objectif;
    document.getElementById("p-niveau").value = params.niveau;
    document.getElementById("p-jours").value = String(params.jours);
    document.getElementById("p-materiel").value = params.materiel;
    document.getElementById("p-split").value = params.split;
    const program = generateProgram(params);
    if (typeof registerGeneratedProgram === "function") registerGeneratedProgram(program);
    else saveJSON(STORAGE_KEYS.program, program);
    renderProgram(program);
    close();
  });
}

/* ---------- Nutrition ---------- */
function renderNutrition() {
  const saved = loadJSON(STORAGE_KEYS.nutrition, null);
  const profil = loadJSON(STORAGE_KEYS.profil, null) || {};
  const weights = loadJSON(STORAGE_KEYS.weights, []);
  const lastWeight = weights.length ? weights[weights.length - 1].kg : "";

  const d = saved || { sexe: "h", age: "", taille: "", poids: lastWeight, activite: "1.55", objectif: profil.objectif || "masse" };
  const calcule = !!(saved && saved.age);

  /* Une fois les besoins calculés, le questionnaire disparaît derrière
     « Modifier mes infos » : on ne montre plus que le résultat (H1). */
  const formHTML = `
    <form class="card program-form" id="nutri-form">
      <div class="form-grid">
        <label>Sexe
          <select id="n-sexe">
            <option value="h" ${d.sexe === "h" ? "selected" : ""}>Homme</option>
            <option value="f" ${d.sexe === "f" ? "selected" : ""}>Femme</option>
          </select></label>
        <label>Âge
          <input type="number" id="n-age" min="14" max="99" value="${esc(d.age)}" placeholder="Ex : 24" required></label>
        <label>Taille (cm)
          <input type="number" id="n-taille" min="120" max="230" value="${esc(d.taille)}" placeholder="Ex : 178" required></label>
        <label>Poids (kg)
          <input type="number" id="n-poids" min="30" max="250" step="0.1" value="${esc(d.poids)}" placeholder="Ex : 74" required></label>
        <label>Activité hors sport
          <select id="n-activite">
            <option value="1.2" ${d.activite === "1.2" ? "selected" : ""}>Sédentaire (bureau)</option>
            <option value="1.375" ${d.activite === "1.375" ? "selected" : ""}>Légèrement actif</option>
            <option value="1.55" ${d.activite === "1.55" ? "selected" : ""}>Actif (3-5 séances/sem.)</option>
            <option value="1.725" ${d.activite === "1.725" ? "selected" : ""}>Très actif (physique + sport)</option>
          </select></label>
        <label>Objectif
          <select id="n-objectif">
            <option value="masse" ${d.objectif === "masse" ? "selected" : ""}>Prise de masse (+300 kcal)</option>
            <option value="seche" ${d.objectif === "seche" ? "selected" : ""}>Sèche (−400 kcal)</option>
            <option value="forme" ${d.objectif === "forme" || d.objectif === "force" ? "selected" : ""}>Maintien / recomposition</option>
          </select></label>
      </div>
      <button type="submit" class="btn btn-primary btn-lg">${calcule ? "Recalculer" : "Calculer mes besoins"}</button>
    </form>`;

  document.getElementById("nutrition-content").innerHTML = `
    <div id="nutri-result"></div>
    ${calcule ? `<div class="card">${disclosure("nutri.form", {
      summary: `<span class="disc-title">Mes infos</span>
        <span class="disc-meta">${d.sexe === "h" ? "Homme" : "Femme"} · ${d.age} ans · ${d.taille} cm · ${d.poids} kg</span>`,
      label: "Modifier mes infos",
      what: `Tes besoins sont recalculés à partir de ces cinq données. Mets-les à jour quand ton
        poids bouge de 2-3 kg ou quand ton objectif change — les calories suivent.`,
      detail: formHTML
    })}</div>` : formHTML}
  `;

  document.getElementById("nutri-form").addEventListener("submit", e => {
    e.preventDefault();
    const data = {
      sexe: document.getElementById("n-sexe").value,
      age: parseInt(document.getElementById("n-age").value, 10),
      taille: parseInt(document.getElementById("n-taille").value, 10),
      poids: parseFloat(document.getElementById("n-poids").value),
      activite: document.getElementById("n-activite").value,
      objectif: document.getElementById("n-objectif").value
    };
    saveJSON(STORAGE_KEYS.nutrition, data);
    renderNutrition();   // repasse en « résultat seul + infos repliées »
  });

  if (calcule) renderNutriResult(saved);
}

function renderNutriResult(d) {
  /* Mifflin-St Jeor : la formule de référence pour le métabolisme de base */
  const bmr = d.sexe === "h"
    ? 10 * d.poids + 6.25 * d.taille - 5 * d.age + 5
    : 10 * d.poids + 6.25 * d.taille - 5 * d.age - 161;
  const tdee = bmr * parseFloat(d.activite);
  const delta = d.objectif === "masse" ? 300 : d.objectif === "seche" ? -400 : 0;
  const cible = Math.round(tdee + delta);

  // macros : protéines élevées (référence g/kg), lipides ~1 g/kg, le reste en glucides
  const protG = Math.round(d.poids * (d.objectif === "seche" ? 2.2 : 1.8));
  const lipG = Math.round(d.poids * 1.0);
  const glucG = Math.max(0, Math.round((cible - protG * 4 - lipG * 9) / 4));
  const eau = Math.round(d.poids * 35 / 100) / 10; // ~35 ml/kg

  document.getElementById("nutri-result").innerHTML = `
    <div class="stat-tiles nutri-tiles">
      <div class="card stat-tile"><span class="chrono-value">${Math.round(tdee)}</span><span class="chrono-label">Maintenance (TDEE) kcal</span></div>
      <div class="card stat-tile"><span class="chrono-value">${cible}</span><span class="chrono-label">Objectif kcal/jour ${delta ? (delta > 0 ? "(+" + delta + ")" : "(" + delta + ")") : ""}</span></div>
      <div class="card stat-tile"><span class="chrono-value">${eau} L</span><span class="chrono-label">Eau par jour (repère)</span></div>
    </div>

    <div class="card">
      <h3 class="panel-title">Macros du jour</h3>
      <p class="disc-what">Les calories disent <em>combien</em>, les macros disent <em>quoi</em> :
        les protéines réparent le muscle, les lipides tiennent les hormones, les glucides
        alimentent la séance.</p>
      <div class="macro-bars">
        <div class="macro-row"><span class="macro-label">Protéines</span>
          <div class="muscle-bar-track"><div class="muscle-bar" style="width:${Math.round(protG * 4 / cible * 100)}%"></div></div>
          <span class="macro-val"><strong>${protG} g</strong> · ${d.objectif === "seche" ? "2,2" : "1,8"} g/kg</span></div>
        <div class="macro-row"><span class="macro-label">Lipides</span>
          <div class="muscle-bar-track"><div class="muscle-bar" style="width:${Math.round(lipG * 9 / cible * 100)}%"></div></div>
          <span class="macro-val"><strong>${lipG} g</strong> · ~1 g/kg</span></div>
        <div class="macro-row"><span class="macro-label">Glucides</span>
          <div class="muscle-bar-track"><div class="muscle-bar" style="width:${Math.round(glucG * 4 / cible * 100)}%"></div></div>
          <span class="macro-val"><strong>${glucG} g</strong> · le reste des calories</span></div>
      </div>
    </div>

    <div class="card">
      ${disclosure("nutri.bases", {
        summary: `<span class="disc-title">Les bases qui comptent</span>
          <span class="disc-meta">timing, protéines, compléments</span>`,
        what: `Le reste n'est que du détail : ces six points couvrent 95 % du résultat.
          Tout ce qui n'est pas là est optionnel.`,
        detail: `<ul class="conseils">
          <li><strong>Autour de l'entraînement :</strong> protéines + glucides 2-3 h avant, et dans les heures qui suivent. Le total de la journée prime sur la « fenêtre anabolique ».</li>
          <li><strong>Protéines :</strong> 3-4 prises de ~20-40 g (viande, poisson, œufs, laitages, légumineuses, tofu).</li>
          <li><strong>Collations utiles :</strong> fromage blanc + fruits, œufs durs, amandes, yaourt grec, banane + beurre de cacahuète.</li>
          <li><strong>Hydratation :</strong> ton repère quotidien, plus 500 ml autour de la séance.</li>
          <li><strong>Compléments :</strong> seules la <em>créatine monohydrate</em> (3-5 g/jour) et la <em>whey</em> ont une efficacité solidement démontrée. La caféine aide avant une grosse séance. Le reste est optionnel.</li>
          <li><strong>Journée type :</strong> flocons + œufs · riz-poulet-légumes · collation protéinée · poisson-patates douces-légumes.</li>
        </ul>
        <p class="disclaimer">⚠️ Estimations générales, pas une prescription. Pas de restriction sévère : en cas de doute, d'antécédents médicaux ou de troubles alimentaires, parles-en à un médecin ou un(e) diététicien(ne).</p>`
      })}
    </div>
  `;
}

document.querySelectorAll('.tab[data-view="nutrition"]').forEach(t =>
  t.addEventListener("click", renderNutrition));

/* ---------- Outils : 1RM + calculateur de disques ---------- */
/* (inspirés de Strong / Hevy — très utilisés entre deux séries) */
function renderTools() {
  const holder = document.getElementById("seance-tools");
  if (!holder) return;
  holder.innerHTML = `
    <div class="card">
      <h3 class="panel-title">Outils rapides</h3>
      <div class="tools-grid">
        <div class="tool">
          <p class="chrono-label">Estimateur de 1RM (formule d'Epley)</p>
          <div class="weight-row">
            <input type="number" id="rm-poids" placeholder="Poids (kg)" min="1" step="0.5">
            <input type="number" id="rm-reps" placeholder="Reps" min="1" max="15" step="1">
          </div>
          <p class="tool-result" id="rm-result">—</p>
        </div>
        <div class="tool">
          <p class="chrono-label">Disques par côté (barre olympique 20 kg)</p>
          <div class="weight-row">
            <input type="number" id="plate-target" placeholder="Poids total visé (kg)" min="20" step="0.5">
          </div>
          <p class="tool-result" id="plate-result">—</p>
        </div>
      </div>
    </div>`;

  const rmCalc = () => {
    const p = parseFloat(document.getElementById("rm-poids").value);
    const r = parseInt(document.getElementById("rm-reps").value, 10);
    document.getElementById("rm-result").innerHTML = (p && r)
      ? `1RM estimé : <strong>${Math.round(p * (1 + r / 30))} kg</strong> · 90 % = ${Math.round(p * (1 + r / 30) * 0.9)} kg · 80 % = ${Math.round(p * (1 + r / 30) * 0.8)} kg`
      : "—";
  };
  ["rm-poids", "rm-reps"].forEach(id =>
    document.getElementById(id).addEventListener("input", rmCalc));

  document.getElementById("plate-target").addEventListener("input", e => {
    const target = parseFloat(e.target.value);
    const out = document.getElementById("plate-result");
    if (!target || target < 20) { out.textContent = "—"; return; }
    let side = (target - 20) / 2;
    const plates = [25, 20, 15, 10, 5, 2.5, 1.25];
    const used = [];
    for (const pl of plates) while (side >= pl - 0.001) { used.push(pl); side -= pl; }
    out.innerHTML = used.length
      ? `Par côté : <strong>${used.join(" + ")} kg</strong>${side > 0.01 ? ` (reste ${side.toFixed(2)} kg non chargeable)` : ""}`
      : "Barre seule (20 kg)";
  });
}

/* ---------- Initialisation ---------- */
(function initHome() {
  // point d'ancrage des outils sur l'écran Séance
  const setup = document.getElementById("seance-setup");
  if (setup && !document.getElementById("seance-tools")) {
    const div = document.createElement("div");
    div.id = "seance-tools";
    setup.appendChild(div);
    renderTools();
  }
  renderHome();
  renderNutrition();
  // l'onboarding ne s'affiche pas si une séance live est en cours de reprise
  if (!live) maybeOnboard();
})();
