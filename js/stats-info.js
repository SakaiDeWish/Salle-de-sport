/* ====================================================================
   stats-info.js — ce que veut dire chaque chiffre

   AVANT : les explications vivaient dans le champ `what` de chaque
   disclosure(), c'est-à-dire recopiées à l'endroit où la stat est
   affichée. Deux conséquences : elles gonflaient le tableau de bord, et
   la même notion expliquée à deux endroits (le volume est sur l'accueil
   ET dans le suivi) avait deux textes à maintenir.

   MAINTENANT : un seul dictionnaire, une seule vérité. Chaque stat porte
   un ⓘ discret qui ouvre une fiche dans le panneau glissant déjà en
   place — le même que Nutrition, Bibliothèque et Réglages. Rien de
   bloquant, fermable au geste ou au tap à côté.

   MÉMOIRE : une stat dont on a lu la fiche garde ensuite sa définition
   en une ligne sous le chiffre. L'interface reste compacte tant qu'on
   n'a rien demandé, et se souvient de ce qu'on a voulu savoir.
   ==================================================================== */

STORAGE_KEYS.statInfoVus = "gymcoach.statInfoVus";

const STAT_INFO = {
  seances: {
    nom: "Séances",
    quoi: "Le nombre de séances que tu as terminées depuis le début.",
    calcul: "= nombre d'entrées dans l'historique",
    sert: "C'est le compteur qui prédit le mieux les résultats à long terme. Bien avant les charges soulevées, ce qui fait progresser c'est le nombre de fois où tu es venu.",
    exemple: "Trois séances par semaine pendant un an font 156 séances — et cette régularité bat n'importe quel programme parfait suivi deux mois."
  },
  temps: {
    nom: "Temps total",
    quoi: "Le temps cumulé passé en séance, repos compris.",
    calcul: "= Σ (fin − début − pauses) de chaque séance",
    sert: "Repère de charge d'entraînement. Utile surtout comparé au volume : beaucoup de temps pour peu de volume, ce sont des repos trop longs ou des séances dispersées.",
    exemple: "Une séance d'1 h 15 dont 35 min de repos cumulé, c'est normal en force ; c'est beaucoup en hypertrophie."
  },
  volume: {
    nom: "Volume total",
    quoi: "La somme de tous les poids multipliés par leurs répétitions.",
    calcul: "= Σ (charge × reps) sur toutes les séries",
    sert: "C'est la mesure la plus directe du travail mécanique fourni. Sa progression semaine après semaine est le meilleur signal que l'entraînement avance — plus fiable qu'un record isolé.",
    exemple: "5 séries de 10 reps à 100 kg = 5 × 10 × 100 = 5 000 kg de volume pour cet exercice."
  },
  regularite: {
    nom: "Séances par semaine",
    quoi: "Ta moyenne réelle de séances hebdomadaires depuis la première.",
    calcul: "= nombre de séances ÷ nombre de semaines écoulées",
    sert: "À distinguer de ton objectif : c'est ce que tu fais, pas ce que tu vises. L'écart entre les deux dit si l'objectif est réaliste.",
    exemple: "40 séances sur 16 semaines donnent 2,5 — si ton objectif est à 4, il est probablement trop haut."
  },
  reps: {
    nom: "Répétitions totales",
    quoi: "Le nombre de répétitions validées, toutes séances confondues.",
    calcul: "= Σ reps de toutes les séries",
    sert: "Complète le volume : à volume égal, beaucoup de reps signifie des charges légères et un travail d'endurance, peu de reps signifie du lourd.",
    exemple: "10 000 kg en 100 reps, c'est 100 kg de moyenne ; les mêmes 10 000 kg en 400 reps, c'est 25 kg."
  },
  series: {
    nom: "Séries totales",
    quoi: "Le nombre de séries validées depuis le début.",
    calcul: "= Σ séries de toutes les séances",
    sert: "C'est l'unité que la recherche utilise pour doser un entraînement : on raisonne en séries hebdomadaires par groupe musculaire, pas en heures.",
    exemple: "Un repère courant est 10 à 20 séries par semaine et par groupe musculaire."
  },
  objectif: {
    nom: "Objectif de la semaine",
    quoi: "Le nombre de séances visées entre lundi et dimanche.",
    calcul: "= séances terminées cette semaine ÷ objectif fixé",
    sert: "Il ne compte que les séances réellement terminées, séances libres incluses. Par défaut il vaut le nombre de séances de ton programme actif.",
    exemple: "2/4 lundi soir n'a rien d'inquiétant ; 2/4 samedi soir veut dire qu'il reste une séance à caser."
  },
  streak: {
    nom: "Streak",
    quoi: "Le nombre de semaines d'affilée où tu as atteint ton objectif.",
    calcul: "= semaines consécutives validées, en remontant depuis aujourd'hui",
    sert: "La semaine en cours ne compte que si elle est déjà validée — le streak ne se casse donc pas un lundi matin. C'est l'indicateur d'assiduité le plus parlant.",
    exemple: "Un streak de 6 veut dire six semaines de suite à l'objectif. Une semaine ratée le remet à zéro, pas les précédentes."
  },
  xp: {
    nom: "XP et niveau",
    quoi: "Un compteur d'assiduité, pas de force.",
    calcul: "= 50 par séance + 2 par série + 5 par ressenti noté + 100 par semaine à l'objectif",
    sert: "Il ne mesure pas ce que tu soulèves : il récompense le fait de revenir et de renseigner tes séances. C'est fait pour créer une habitude, rien d'autre.",
    exemple: "Une séance de 20 séries avec ressenti noté rapporte 50 + 40 + 5 = 95 XP."
  },
  muscles: {
    nom: "Répartition par muscle",
    quoi: "Le nombre de séries faites sur chaque groupe musculaire.",
    calcul: "= Σ séries, regroupées par groupe musculaire",
    sert: "Sert à repérer les oubliés. Un déséquilibre durable entre tirage et poussée se paie sur la posture et les épaules ; un ratio proche de 1 est un bon repère.",
    exemple: "Si les pectoraux sont à 120 séries et le dos à 55, il manque environ 65 séries de tirage."
  },
  pr: {
    nom: "Records personnels",
    quoi: "Ta série la plus lourde sur chaque exercice.",
    calcul: "= max(charge) parmi toutes les séries de cet exercice",
    sert: "C'est le poids maximum par exercice. Un record ne se bat pas à chaque séance : viser +2,5 kg ou +1 répétition par mois sur un mouvement de base est déjà une excellente progression.",
    exemple: "100 kg × 5 puis 102,5 kg × 5 le mois suivant : le record passe à 102,5 kg."
  },
  rm1: {
    nom: "1RM estimé",
    quoi: "La charge que tu pourrais soulever une seule fois, déduite d'une série plus légère.",
    calcul: "= charge × (1 + reps ÷ 30)   — formule d'Epley",
    sert: "Évite d'avoir à tester un maximum réel, qui est risqué et fatigant. Sert surtout à calculer des pourcentages de travail.",
    exemple: "100 kg × 8 reps donnent 100 × (1 + 8/30) ≈ 127 kg. L'estimation devient peu fiable au-delà de 12 répétitions."
  },
  poidsCorps: {
    nom: "Poids de corps",
    quoi: "Ton poids relevé au fil du temps.",
    calcul: "= dernière pesée enregistrée, et sa courbe",
    sert: "À lire en tendance sur plusieurs semaines, jamais au jour le jour : l'eau, le sel et le transit font varier la balance de 1 à 2 kg sans que rien n'ait changé.",
    exemple: "−0,4 kg par semaine sur un mois est une perte propre ; −2 kg en trois jours, c'est de l'eau."
  },
  rpe: {
    nom: "Ressenti (RPE)",
    quoi: "La difficulté perçue de la séance, de 1 à 10.",
    calcul: "= note que tu donnes toi-même à la fin de la séance",
    sert: "Le seul indicateur qui capte la fatigue, le sommeil et le stress — que les kilos ignorent complètement. Plusieurs séances faciles d'affilée à charges égales signalent qu'il est temps d'augmenter.",
    exemple: "Un RPE de 9 sur une séance habituellement à 7 est souvent le signe d'une récupération insuffisante."
  },
  volumeMois: {
    nom: "Volume du mois",
    quoi: "La somme charge × reps des séances du mois en cours.",
    calcul: "= Σ (charge × reps) des séances du mois",
    sert: "Se compare au mois précédent. C'est à ce pas de temps que la progression du volume devient lisible — la semaine est trop bruitée.",
    exemple: "42 000 kg en janvier puis 47 000 en février : +12 %, une progression saine."
  },
  seancesMois: {
    nom: "Séances du mois",
    quoi: "Le nombre de séances terminées depuis le 1er du mois.",
    calcul: "= séances dont la date tombe dans le mois en cours",
    sert: "Vue intermédiaire entre la semaine, trop courte pour juger, et le total, trop lent à bouger.",
    exemple: "12 séances sur un mois de 4 semaines, c'est une moyenne de 3 par semaine."
  },
  tempsMois: {
    nom: "Temps du mois",
    quoi: "Le temps cumulé passé en séance ce mois-ci.",
    calcul: "= Σ durée des séances du mois",
    sert: "Utile pour caler l'entraînement dans un emploi du temps réel, et pour voir si les séances s'allongent sans que le volume suive.",
    exemple: "10 h sur le mois pour 12 séances font des séances de 50 minutes en moyenne."
  },
  tdee: {
    nom: "Maintenance (TDEE)",
    quoi: "Les calories que tu dépenses en moyenne sur une journée.",
    calcul: "= métabolisme de base (Mifflin-St Jeor) × facteur d'activité",
    sert: "C'est le point d'équilibre : manger autant maintient le poids. Tout objectif de masse ou de sèche se construit à partir de ce chiffre.",
    exemple: "Un TDEE de 2 600 kcal donne environ 2 900 pour prendre, 2 200 pour sécher."
  },
  kcalCible: {
    nom: "Objectif calorique",
    quoi: "Le nombre de calories visé chaque jour selon ton objectif.",
    calcul: "= TDEE + 300 (masse) · TDEE − 400 (sèche) · TDEE (maintien)",
    sert: "Des écarts volontairement modestes : au-delà, la prise se fait en gras et la perte attaque le muscle.",
    exemple: "Un déficit de 400 kcal par jour fait environ 0,4 kg de perte par semaine."
  }
};

/* Petit bouton ⓘ à coller à côté d'un libellé de stat. */
function statInfo(key) {
  if (!STAT_INFO[key]) return "";
  return `<button type="button" class="stat-i" data-stat-info="${key}"
    aria-label="Que veut dire : ${esc(STAT_INFO[key].nom)} ?" title="Qu'est-ce que c'est ?">i</button>`;
}

/* Définition en une ligne, affichée UNIQUEMENT pour les stats dont
   l'utilisateur a déjà ouvert la fiche. C'est la mémoire demandée :
   compact par défaut, développé pour ce qu'on a voulu savoir. */
function statInfoVus() { return loadJSON(STORAGE_KEYS.statInfoVus, []); }
function statInfoVu(key) { return statInfoVus().includes(key); }
function statInfoMarque(key) {
  const v = statInfoVus();
  if (!v.includes(key)) { v.push(key); saveJSON(STORAGE_KEYS.statInfoVus, v); }
}
function statLigne(key) {
  const d = STAT_INFO[key];
  if (!d || !statInfoVu(key)) return "";
  return `<span class="stat-rappel">${esc(d.quoi)}</span>`;
}

function statInfoHtml(key) {
  const d = STAT_INFO[key];
  return `
    <div class="card si-card">
      <p class="si-lab">Qu'est-ce que c'est</p>
      <p class="si-txt">${esc(d.quoi)}</p>
    </div>
    <div class="card si-card">
      <p class="si-lab">Comment c'est calculé</p>
      <p class="si-formule">${esc(d.calcul)}</p>
    </div>
    <div class="card si-card">
      <p class="si-lab">À quoi ça sert</p>
      <p class="si-txt">${esc(d.sert)}</p>
    </div>
    ${d.exemple ? `
    <div class="card si-card si-ex">
      <p class="si-lab">Exemple</p>
      <p class="si-txt">${esc(d.exemple)}</p>
    </div>` : ""}`;
}

function openStatInfo(key) {
  const d = STAT_INFO[key];
  if (!d || typeof openHtmlPanel !== "function") return;
  openHtmlPanel(d.nom, statInfoHtml(key));
  const neuf = !statInfoVu(key);
  statInfoMarque(key);
  /* Re-rendre la vue pour faire apparaître le rappel d'une ligne, mais
     seulement la PREMIÈRE fois : sinon on reconstruirait le tableau de
     bord sous le panneau à chaque consultation, pour rien. */
  if (neuf) {
    try {
      if (typeof renderDashboard === "function"
          && document.getElementById("panel-dashboard")) renderDashboard();
      if (typeof renderHome === "function"
          && document.getElementById("view-accueil").classList.contains("active")) renderHome();
    } catch (e) { /* une vue absente ne doit pas empêcher d'ouvrir la fiche */ }
  }
}

/* Un seul écouteur délégué : les re-rendus ne perdent jamais le lien. */
document.addEventListener("click", e => {
  const b = e.target.closest("[data-stat-info]");
  if (!b) return;
  e.preventDefault();
  e.stopPropagation();          // ne pas déclencher le disclosure qui l'entoure
  openStatInfo(b.dataset.statInfo);
});
