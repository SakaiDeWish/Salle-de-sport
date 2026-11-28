const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir();
  // 1. changement de vue
  await p.evaluate(() => activateView('suivi')); await p.waitForTimeout(60);
  console.log('vue : ancienne encore visible :', await p.evaluate(() => { const a=document.getElementById('view-accueil'); return a.classList.contains('partant') && getComputedStyle(a).display!=='none'; }),
    '| nouvelle animée :', await p.evaluate(() => document.getElementById('view-suivi').getAnimations().length > 0));
  await p.waitForTimeout(400);
  console.log('vue : ancienne nettoyée :', await p.evaluate(() => { const a=document.getElementById('view-accueil'); return !a.classList.contains('partant') && a.style.cssText===''; }), '| une seule vue active :', await p.evaluate(() => document.querySelectorAll('.view.active').length));
  // 2. liste de séance : dépliage + réordonnancement
  await p.evaluate(() => { const L = allExercisesForUI(); startSession("T", [0,1,2].map(k => newLiveExercise(L[k], '3 × 10', 60))); activateView('seance'); expandedIndex = 0; renderLiveExercises(); });
  await p.waitForTimeout(500);
  await p.evaluate(() => { expandedIndex = 1; renderLiveExercises(); });
  await p.waitForTimeout(30);
  console.log('liste : cartes animées au dépliage :', await p.evaluate(() => [...document.querySelectorAll('.live-ex')].map(c => c.getAnimations().length)));
  await p.waitForTimeout(500);
  const ordre = () => p.evaluate(() => live.exercises.map(e => e.nom.slice(0,12)).join(' | '));
  console.log('avant :', await ordre());
  await p.evaluate(() => { const t = live.exercises.splice(0,1)[0]; live.exercises.splice(1,0,t); renderLiveExercises(); });
  await p.waitForTimeout(30);
  console.log('liste : animées après déplacement :', await p.evaluate(() => [...document.querySelectorAll('.live-ex')].map(c => c.getAnimations().length)));
  console.log('après :', await ordre());
  await p.waitForTimeout(500);
  // 3. sortie du repos
  await p.evaluate(() => { openNext=0; renderLiveExercises(); const r=document.getElementById('reps-0'); r.value='10'; const w=document.getElementById('poids-0'); w.value='20'; validateSet(0); });
  await p.waitForTimeout(500);
  console.log('repos visible :', await p.evaluate(() => !document.getElementById('rest-overlay').classList.contains('hidden')));
  await p.evaluate(() => endRest()); await p.waitForTimeout(60);
  console.log('repos : fantôme de sortie :', await p.evaluate(() => document.querySelectorAll('.sortie').length), '| ids dupliqués :', await p.evaluate(() => { const ids=[...document.querySelectorAll('[id]')].map(n=>n.id); return ids.length-new Set(ids).size; }));
  await p.waitForTimeout(500);
  console.log('fantôme nettoyé :', await p.evaluate(() => document.querySelectorAll('.sortie').length === 0));
  // 4. pavé
  await p.evaluate(() => { openNext=0; renderLiveExercises(); }); await p.click('#poids-0'); await p.waitForTimeout(400); await p.click('.pave-ok'); await p.waitForTimeout(60);
  console.log('pavé : fantôme :', await p.evaluate(() => document.querySelectorAll('.sortie').length)); await p.waitForTimeout(500);
  console.log('erreurs :', err.length ? err.join(' | ') : 'aucune');
  await b.close(); })();
