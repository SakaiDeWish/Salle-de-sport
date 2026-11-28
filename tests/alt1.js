const { ouvrir } = require('./lib.js');
(async () => {
  const { b, p, err } = await ouvrir();
  p.on('dialog', d => d.accept());
  const ligne0 = () => p.evaluate(() => { const l = loadJSON(STORAGE_KEYS.program).days[0].exercices[0]; return l.exercice.nom.slice(0, 22) + ' | alt: ' + (l.alternatives || []).map(a => a.nom.slice(0, 22)).join(', '); });
  await p.evaluate(() => { registerGeneratedProgram(generateProgram({ prenom: 'T', objectif: 'masse', niveau: 'debutant', jours: 3, materiel: 'salle', priorite: null, split: 'fullbody' })); });
  console.log('départ', await ligne0());
  const demarre = () => p.evaluate(() => { const d = loadJSON(STORAGE_KEYS.program).days[0]; startSession('Séance 1 — ' + d.titre, exercicesDuJour(d)); });
  await demarre(); await p.waitForTimeout(600);
  // feuille de remplacement
  await p.evaluate(() => swapExercise(0)); await p.waitForTimeout(500);
  console.log('feuille :', await p.evaluate(() => document.getElementById('modal-content').innerText.replace(/\n+/g, ' | ').slice(0, 260)));
  await p.screenshot({ path: 'alt1a.png' });
  // choix libre dans la bibliothèque (via le sélecteur)
  await p.evaluate(() => document.getElementById('rem-chercher').click()); await p.waitForTimeout(400);
  console.log('sélecteur ouvert :', await p.evaluate(() => !document.getElementById('picker').classList.contains('hidden')));
  await p.evaluate(() => { document.getElementById('picker-search').value = 'fentes'; document.getElementById('picker-search').dispatchEvent(new Event('input')); }); await p.waitForTimeout(300);
  const choisi = await p.evaluate(() => { const b = document.querySelector('.picker-item'); const n = b.innerText.split('\n')[0]; b.click(); return n; });
  await p.waitForTimeout(400);
  console.log('choisi :', choisi, '| 1er exercice de la séance :', await p.evaluate(() => live.exercises[0].nom + ' (remplace ' + live.exercises[0].remplace.nom + ')'));
  await p.evaluate(() => { live.exercises[0].sets.push({ poids: 0, reps: 12 }, { poids: 0, reps: 12 }); live.exercises[1].sets.push({ poids: 20, reps: 10 }); finishSession(); }); await p.waitForTimeout(900);
  console.log('carte :', await p.evaluate(() => document.getElementById('maj-card').innerText.replace(/\n+/g, ' | ')));
  await p.evaluate(() => document.getElementById('maj-card').scrollIntoView({ block: 'center' })); await p.screenshot({ path: 'alt1b.png' });
  await p.evaluate(() => document.getElementById('maj-go').click()); await p.waitForTimeout(400);
  console.log('après Oui', await ligne0());
  // relance : « Tes alternatives »
  await demarre(); await p.waitForTimeout(500);
  await p.evaluate(() => swapExercise(0)); await p.waitForTimeout(400);
  console.log('feuille 2 :', await p.evaluate(() => document.getElementById('modal-content').innerText.replace(/\n+/g, ' | ').slice(0, 200)));
  // 2e scénario : « remplacer l'exercice » via le mode édition
  await p.evaluate(() => { closeSheet(); live.exercises[0].sets.push({ poids: 0, reps: 10 }); finishSession(); }); await p.waitForTimeout(600);
  // alternative déjà enregistrée -> aucune carte de remplacement
  console.log('re-proposé ?', await p.evaluate(() => !!document.querySelector('.mj-item[data-k^="remp:"]')));
  // builder
  await p.evaluate(() => openBuilder(getActiveId())); await p.waitForTimeout(600);
  console.log('chips dans l\'éditeur :', await p.evaluate(() => document.querySelectorAll('.b-alt').length));
  await p.evaluate(() => document.querySelector('.b-alt-add').click()); await p.waitForTimeout(300);
  await p.evaluate(() => { document.getElementById('picker-search').value = 'curl'; document.getElementById('picker-search').dispatchEvent(new Event('input')); }); await p.waitForTimeout(300);
  await p.evaluate(() => document.querySelector('.picker-item').click()); await p.waitForTimeout(400);
  console.log('après ajout :', await p.evaluate(() => [...document.querySelectorAll('.b-alt')].map(e => e.innerText.replace(/\n|×/g, '').trim().slice(0, 24)).join(' ; ')));
  await p.evaluate(() => document.getElementById('b-save').click()); await p.waitForTimeout(500);
  console.log('enregistré', await ligne0());
  await p.evaluate(() => { activateView('programme'); document.querySelector('[data-ppanel="actuel"]').click(); renderProgram(loadJSON(STORAGE_KEYS.program)); }); await p.waitForTimeout(400);
  console.log('affichage dossier :', await p.evaluate(() => document.querySelector('.dl-alt') ? document.querySelector('.dl-alt').innerText : 'absent'));
  console.log('ERR', err); await b.close();
})();
