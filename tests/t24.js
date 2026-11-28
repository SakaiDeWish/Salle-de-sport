const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir();
  await p.evaluate(() => { const L = allExercisesForUI(); startSession("T", [newLiveExercise(L[0], '3 × 10', 60)]); activateView('seance'); expandedIndex = 0; openNext = 0; renderLiveExercises(); });
  await p.waitForTimeout(400);
  await p.click('#poids-0'); await p.waitForTimeout(150);
  console.log('pavé ouvert :', await p.evaluate(() => !document.getElementById('pave').classList.contains('hidden')), '| champ a le focus :', await p.evaluate(() => document.activeElement && document.activeElement.id === 'poids-0'), '| readonly :', await p.evaluate(() => document.getElementById('poids-0').readOnly));
  await p.click('.pave-k[data-k="7"]'); await p.click('.pave-k[data-k="5"]'); await p.click('.pave-ok'); await p.waitForTimeout(100);
  console.log('valeur :', await p.inputValue('#poids-0'));
  // champ obligatoire vide à la validation -> pavé des reps, sans focus
  await p.evaluate(() => { const r = document.getElementById('reps-0'); r.value = ''; r.dispatchEvent(new Event('input', { bubbles: true })); });
  await p.click('.cb[data-check="0"]'); await p.waitForTimeout(250);
  console.log('case sans reps -> pavé :', await p.evaluate(() => !document.getElementById('pave').classList.contains('hidden')), '|', await p.textContent('#pave-lab'));
  await p.click('.pave-k[data-k="8"]'); await p.click('.pave-ok'); await p.waitForTimeout(100);
  await p.waitForTimeout(400);
  console.log('série validée :', await p.evaluate(() => JSON.stringify(live.exercises[0].sets.map(s => [s.poids, s.reps]))));
  // clavier du téléphone : bouton « Clavier »
  await p.evaluate(() => endRest()); await p.waitForTimeout(300);
  await p.evaluate(() => { openNext = 0; renderLiveExercises(); }); await p.click('#reps-0'); await p.click('[data-pave="clavier"]'); await p.waitForTimeout(150);
  console.log('mode clavier : focus =', await p.evaluate(() => document.activeElement.id), '| readonly =', await p.evaluate(() => document.getElementById('reps-0').readOnly));
  await p.evaluate(() => document.getElementById('reps-0').blur()); await p.waitForTimeout(100);
  console.log('après sortie : readonly =', await p.evaluate(() => document.getElementById('reps-0').readOnly));
  console.log('erreurs :', err.length ? err.join(' | ') : 'aucune'); await b.close(); })();
