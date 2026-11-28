const { ouvrir } = require('./lib.js');
(async () => {
  const { b, p, err } = await ouvrir();
  p.on('dialog', d => d.accept());
  const prog = () => p.evaluate(() => loadJSON(STORAGE_KEYS.program).days[0].exercices.slice(0, 4).map(l => (l.superset ? '⛓' : '·') + l.exercice.nom.slice(0, 14)));
  await p.evaluate(() => { registerGeneratedProgram(generateProgram({ prenom: 'T', objectif: 'masse', niveau: 'debutant', jours: 3, materiel: 'salle', priorite: null, split: 'fullbody' })); });
  console.log('départ', JSON.stringify(await prog()));
  // 1) créer un super set dans la séance puis terminer : proposé au programme
  await p.evaluate(() => { activateView('accueil'); renderHome(); document.getElementById('home-start').click(); });
  await p.waitForTimeout(800);
  await p.evaluate(() => { live.exercises[0].sets.push({ poids: 20, reps: 10 }); live.exercises[1].sets.push({ poids: 20, reps: 10 }); ssCreate(0, 1); finishSession(); });
  await p.waitForTimeout(1000);
  console.log('carte :', await p.evaluate(() => (document.getElementById('maj-card') || {}).innerText.replace(/\n+/g, ' | ')));
  await p.evaluate(() => document.getElementById('maj-go').click()); await p.waitForTimeout(500);
  console.log('après « Oui »', JSON.stringify(await prog()));
  // 2) relancer la séance : le super set est recréé
  await p.evaluate(() => { const d = loadJSON(STORAGE_KEYS.program).days[0]; startSession('Séance 1 — ' + d.titre, exercicesDuJour(d)); });
  await p.waitForTimeout(800);
  console.log('séance relancée : ss partagé =', await p.evaluate(() => !!live.exercises[0].ss && live.exercises[0].ss === live.exercises[1].ss), '| 3e hors groupe =', await p.evaluate(() => !live.exercises[2].ss));
  // 3) rompre le lien pendant la séance
  await p.evaluate(() => { live.exercises[0].sets.push({ poids: 20, reps: 10 }); live.exercises[1].sets.push({ poids: 20, reps: 10 }); ssBreak(live.exercises[0].ss); finishSession(); });
  await p.waitForTimeout(1000);
  console.log('carte rupture :', await p.evaluate(() => (document.getElementById('maj-card') || {}).innerText.replace(/\n+/g, ' | ')));
  console.log('comparatif :', await p.evaluate(() => [...document.querySelectorAll('.mj-item')].map(r => r.dataset.k).join(' / ')));
  await p.evaluate(() => document.getElementById('maj-go').click()); await p.waitForTimeout(500);
  console.log('après rupture appliquée', JSON.stringify(await prog()));
  // 4) séance libre avec super set -> ajoutée au programme
  await p.evaluate(() => { startSession('Séance libre', []); const L = allExercisesForUI(); live.exercises.push(newLiveExercise(L[0], '', null), newLiveExercise(L[1], '', null), newLiveExercise(L[2], '', null)); live.exercises.forEach(e => e.sets.push({ poids: 10, reps: 8 })); ssCreate(1, 2); finishSession(); });
  await p.waitForTimeout(1000);
  await p.evaluate(() => document.getElementById('add-to-program').click()); await p.waitForTimeout(500);
  console.log('séance libre ajoutée', JSON.stringify(await p.evaluate(() => { const pr = loadJSON(STORAGE_KEYS.program); const d = pr.days[pr.days.length - 1]; return d.exercices.map(l => (l.superset ? '⛓' : '·') + l.exercice.nom.slice(0, 10)); })));
  // 5) affichage dans l'onglet Programme
  await p.evaluate(() => { activateView('programme'); document.querySelector('[data-ppanel="actuel"]').click(); renderProgram(loadJSON(STORAGE_KEYS.program)); });
  console.log('lignes marquées dans les dossiers :', await p.evaluate(() => document.querySelectorAll('.day-lines li.ss-debut').length));
  console.log('ERR', err); await b.close();
})();
