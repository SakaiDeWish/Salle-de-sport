const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir();
  await p.evaluate(() => { const L = allExercisesForUI(); startSession("T", [0,1,2,3].map(k => newLiveExercise(L[k], '3 × 10', 60))); activateView('seance'); renderLiveExercises(); });
  await p.waitForTimeout(500);
  const noms = () => p.evaluate(() => live.exercises.map(e => e.nom.split(' ')[0] + (e.nom.split(' ')[1]||'').slice(0,3)).join(' | '));
  const heads = async () => (await p.$$('.live-ex-head')).map(h => ({ boundingBox: async () => { await h.evaluate(n => n.scrollIntoView({block:'center'})); return h.boundingBox(); }, click: async () => { await h.evaluate(n => n.scrollIntoView({block:'center'})); await p.waitForTimeout(80); const r = await h.boundingBox(); await p.mouse.click(r.x + 30, r.y + 12); } }));
  console.log('départ  :', await noms());
  // 1. appui long -> mode réorganisation
  const bb = await (await heads())[0].boundingBox(); await p.mouse.move(bb.x + 30, bb.y + 20); await p.mouse.down(); await p.waitForTimeout(700); await p.mouse.up(); await p.waitForTimeout(300);
  console.log('appui long -> réorg :', await p.evaluate(() => reordering), '| gigote :', await p.evaluate(() => getComputedStyle(document.querySelector('#live-exercises > .live-ex')).animationName), '| 1er choisi :', await p.evaluate(() => !!document.querySelector('.reorder-sel')));
  console.log('message :', await p.textContent('#reorder-msg'));
  // 2. toucher 1er (déjà choisi, donc toucher le 3e) -> échange 1 et 3
  await p.waitForTimeout(450);
  await (await heads())[2].click(); await p.waitForTimeout(500);
  console.log('échange 1↔3 :', await noms());
  // 3. toucher 2 puis 4
  await (await heads())[1].click(); await p.waitForTimeout(100); await (await heads())[3].click(); await p.waitForTimeout(500);
  console.log('échange 2↔4 :', await noms());
  // 4. glisser le 1er sous le 3e
  const hs = await heads(); const a = await hs[0].boundingBox(), c = await hs[2].boundingBox();
  await p.mouse.move(a.x + 40, a.y + 15); await p.mouse.down(); await p.mouse.move(a.x + 40, a.y + 40, { steps: 4 });
  console.log('glisse actif :', await p.evaluate(() => !!document.querySelector('.glisse')));
  await p.mouse.move(a.x + 40, c.y + c.height / 2 + 30, { steps: 12 }); await p.waitForTimeout(100);
  console.log('autres décalés :', await p.evaluate(() => [...document.querySelectorAll('#live-exercises > .live-ex')].map(e => e.style.translate || '-').join(' ; ')));
  await p.mouse.up(); await p.waitForTimeout(600);
  console.log('après glisser :', await noms());
  // 5. glisser sans bouger = tap -> sélection, pas de changement
  await (await heads())[0].click(); await p.waitForTimeout(450);
  console.log('tap simple sélectionne :', await p.evaluate(() => !!document.querySelector('.reorder-sel')));
  await p.evaluate(() => document.getElementById('reorder-done').click()); await p.waitForTimeout(400);
  console.log('terminé : réorg =', await p.evaluate(() => reordering), '| gigote :', await p.evaluate(() => document.querySelectorAll('#live-exercises .live-ex').length), 'cartes');
  console.log('erreurs :', err.length ? err.join(' | ') : 'aucune');
  await b.close(); })();
