const { ouvrir } = require('./lib.js');
(async () => {
  const { b, p, err } = await ouvrir();
  await p.evaluate(() => localStorage.setItem('gymcoach.verrou','1')); await p.reload(); await p.waitForTimeout(1200);
  p.on('dialog', d => d.accept());
  const sheet = () => p.evaluate(() => !document.getElementById('modal').classList.contains('hidden') && document.getElementById('modal-content').innerText.slice(0, 40).replace(/\n/g, ' '));
  await p.evaluate(() => {
    const L = allExercisesForUI(); const e0 = L[0], e1 = L[1];
    const h = [];
    for (let i = 0; i < 8; i++) h.push({ id: 's' + i, nom: 'Séance 1 — A', date: Date.now() - (8 - i) * 6 * 86400000, dureeMs: 3000000, reposMs: 400000, nbSeries: 6, volume: 3000 + i * 100,
      exercises: [{ exId: e0.id, nom: e0.nom, groupe: e0.groupe, sets: [{ poids: 40 + i * 2, reps: 8 }, { poids: 40 + i * 2, reps: 8 }] },
                  { exId: e1.id, nom: e1.nom, groupe: e1.groupe, sets: [{ poids: i < 4 ? 30 + i * 2 : 36, reps: 10 }] }] });
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(h));
  });
  console.log('gratuit :', await p.evaluate(() => estPremium()));
  // thèmes
  await p.evaluate(() => openSettings()); await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('[data-theme="opale"]').click()); await p.waitForTimeout(400);
  console.log('thème Opale refusé -> page premium :', await sheet(), '| thème actuel', await p.evaluate(() => currentTheme()));
  await p.evaluate(() => closeSheet()); await p.waitForTimeout(400);
  // limite de programmes
  await p.evaluate(() => { for (const o of ['masse', 'forme']) registerGeneratedProgram(generateProgram({ prenom: 'T', objectif: o, niveau: 'debutant', jours: 3, materiel: 'salle', priorite: null, split: 'fullbody' })); });
  console.log('programmes :', await p.evaluate(() => getPrograms().length), '| 3e autorisé ?', await p.evaluate(() => programmeAutorise()), '| page premium :', await sheet());
  await p.evaluate(() => closeSheet());
  // analyses verrouillées
  await p.evaluate(() => { activateView('suivi'); }); await p.waitForTimeout(500);
  console.log('analyses verrou :', await p.evaluate(() => !!document.querySelector('.an-verrou')));
  await p.screenshot({ path: 'pr1a.png', fullPage: true });
  // CSV refusé
  await p.evaluate(() => { openSettings(); }); await p.waitForTimeout(400);
  await p.evaluate(() => document.getElementById('set-csv').click()); await p.waitForTimeout(300);
  console.log('CSV gratuit -> page premium :', await sheet());
  // activer l'essai
  await p.evaluate(() => document.getElementById('prem-go').click()); await p.waitForTimeout(500);
  console.log('premium :', await p.evaluate(() => estPremium()));
  await p.evaluate(() => closeSheet()); await p.waitForTimeout(300);
  await p.evaluate(() => { document.querySelector('[data-theme="opale"]').click(); }); await p.waitForTimeout(300);
  console.log('thème après essai :', await p.evaluate(() => currentTheme()));
  console.log('3e programme autorisé :', await p.evaluate(() => programmeAutorise()));
  const [dl] = await Promise.all([p.waitForEvent('download'), p.evaluate(() => document.getElementById('set-csv').click())]);
  const csv = await require('fs').promises.readFile(await dl.path(), 'utf8');
  console.log('CSV :', csv.split('\n').length, 'lignes ;', csv.split('\n').slice(0, 2).join(' / ').slice(0, 120));
  await p.evaluate(() => { closeSheet(); document.getElementById('panel-host'); activateView('accueil'); activateView('suivi'); }); await p.waitForTimeout(600);
  console.log('analyses :', await p.evaluate(() => ({ select: !!document.getElementById('an-ex'), chart: !!document.querySelector('#an-chart svg'), barres: !!document.querySelector('.an-barres'), plateaux: (document.querySelector('.an-plateaux') || { innerText: 'aucun' }).innerText.replace(/\n+/g, ' ').slice(0, 120) })));
  await p.evaluate(() => document.querySelector('.an-carte').scrollIntoView()); await p.waitForTimeout(300);
  await p.screenshot({ path: 'pr1b.png' });
  console.log('débordement :', await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'ERR', err);
  await b.close();
})();
