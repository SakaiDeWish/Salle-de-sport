const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir();
  const etat = () => p.evaluate(() => live.exercises.map((e, i) => `${e.nom.slice(0,6)} cible="${e.target}" faites=${e.sets.length} fini=${exerciseProgress(e).fini}`).join(' || '));
  await p.evaluate(() => { const L = allExercisesForUI(); startSession("T", [0,1].map(k => newLiveExercise(L[k], '3 × 10', 60))); activateView('seance'); expandedIndex = 0; renderLiveExercises(); });
  await p.waitForTimeout(400);
  const clic = sel => p.evaluate(s => document.querySelector(s).click(), sel);
  console.log('départ :', await etat(), '| texte :', await p.textContent('.live-ex-open .cb-nb-val'));
  await clic('.live-ex-open .cb-nb-btn[data-nb="1"]'); await p.waitForTimeout(200);
  console.log('+1    :', await etat(), '|', await p.textContent('.live-ex-open .cb-nb-val'), '| lignes :', await p.evaluate(() => document.querySelectorAll('.live-ex-open .cb-row').length));
  await clic('.live-ex-open .cb-nb-btn[data-nb="-1"]'); await clic('.live-ex-open .cb-nb-btn[data-nb="-1"]'); await p.waitForTimeout(200);
  console.log('-2    :', await etat(), '| lignes :', await p.evaluate(() => document.querySelectorAll('.live-ex-open .cb-row').length));
  console.log('Valider l\'exercice sans série faite :', await p.evaluate(() => !!document.querySelector('.cb-fin')));
  // valide 2 séries sur 4 prévues
  await clic('.live-ex-open .cb-nb-btn[data-nb="1"]'); await clic('.live-ex-open .cb-nb-btn[data-nb="1"]');
  for (let k = 0; k < 2; k++) { await p.evaluate(() => { const o = live.exercises[0]; document.getElementById('reps-0').value = '10'; document.getElementById('poids-0').value = '20'; validateSet(0); }); await p.waitForTimeout(150); await p.evaluate(() => endRest()); await p.waitForTimeout(150); }
  console.log('2 séries faites :', await etat(), '| bouton valider :', await p.evaluate(() => !!document.querySelector('.cb-fin')), '| − désactivé à 2 ? ', await p.evaluate(() => document.querySelector('.live-ex-open .cb-nb-btn[data-nb="-1"]').disabled));
  await clic('.cb-fin'); await p.waitForTimeout(400);
  console.log('après valider :', await etat(), '| courant :', await p.evaluate(() => live.currentIndex), '| déplié :', await p.evaluate(() => expandedIndex));
  console.log('erreurs :', err.length ? err.join(' | ') : 'aucune');
  await b.close(); })();
