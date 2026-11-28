const { ouvrir } = require('./lib.js');
(async () => {
  const { b, p, err } = await ouvrir();
  p.on('dialog', d => d.accept());
  await p.evaluate(() => { registerGeneratedProgram(generateProgram({ prenom: 'T', objectif: 'masse', niveau: 'debutant', jours: 3, materiel: 'salle', priorite: null, split: 'fullbody' })); });
  const etat = () => p.evaluate(() => loadJSON(STORAGE_KEYS.program).days[0].exercices.map(l => (l.superset ? '⛓' : '') + l.exercice.nom.slice(0, 12) + ' ' + l.series + 'x' + l.reps + (l.alternatives && l.alternatives.length ? ' [alt:' + l.alternatives.map(a => a.nom.slice(0, 8)).join(',') + ']' : '')));
  console.log('avant', JSON.stringify(await etat()));
  await p.evaluate(() => {
    const d = loadJSON(STORAGE_KEYS.program).days[0]; startSession('Séance 1 — ' + d.titre, exercicesDuJour(d));
    const L = allExercisesForUI();
    const fait = (i, n, reps = 10) => { for (let k = 0; k < n; k++) live.exercises[i].sets.push({ poids: 30, reps }); };
    appliquerRemplacement(0, L.find(e => /fentes march/i.test(e.nom)));      // remplacé
    fait(0, 3);
    live.exercises.splice(2, 1);                                           // retiré (3e du programme)
    fait(1, 5, 12);                                                         // séries changées
    fait(2, 3);
    const nx = newLiveExercise(L.find(e => /curl biceps à la barre/i.test(e.nom)), '3 × 12', null); live.exercises.push(nx); fait(live.exercises.length - 1, 3, 12);   // ajouté
    ssCreate(1, 2);                                                         // super set
    finishSession();
  });
  await p.waitForTimeout(1000);
  await p.evaluate(() => { activateView('seance'); document.getElementById('maj-card').scrollIntoView(); }); await p.waitForTimeout(500);
  await p.screenshot({ path: 'rc1a.png' });
  await p.evaluate(() => window.scrollBy(0, 560)); await p.waitForTimeout(300);
  await p.screenshot({ path: 'rc1b.png' });
  console.log('lignes du comparatif :', await p.evaluate(() => [...document.querySelectorAll('.mj-item')].map(e => e.dataset.k + ' défaut=' + e.querySelector('input:checked').value)));
  console.log('débordement :', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  // choix : remplacer = « Ne rien changer », retiré = garder, le reste par défaut
  await p.evaluate(() => {
    const radio = (cle, v) => document.querySelector(`.mj-item[data-k="${cle}"] input[value="${v}"]`).click();
    document.querySelectorAll('.mj-item').forEach(e => { if (e.dataset.k.startsWith('remp:')) radio(e.dataset.k, 'non'); if (e.dataset.k.startsWith('retire:')) radio(e.dataset.k, 'garder'); });
    document.getElementById('maj-go').click();
  });
  await p.waitForTimeout(500);
  console.log('message :', await p.evaluate(() => document.getElementById('maj-card').innerText));
  console.log('après', JSON.stringify(await etat()));
  console.log('ERR', err); await b.close();
})();
