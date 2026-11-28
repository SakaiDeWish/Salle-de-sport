const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir();
  await p.evaluate(() => { const L = allExercisesForUI(); startSession("T", Array.from({length: 14}, (_, k) => newLiveExercise(L[k], '3 × 10', 60))); activateView('seance'); renderLiveExercises(); });
  await p.waitForTimeout(400);
  const vis = () => p.evaluate(() => { const r = document.getElementById('reorder-rail'); return !!r && getComputedStyle(r).display !== 'none'; });
  console.log('rail avant mode ordre :', await vis());
  await p.evaluate(() => reorderStart()); await p.waitForTimeout(500);
  console.log('rail en mode ordre    :', await vis());
  // appui bref sur ▼ : saute d'un écran
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(100);
  const box = await (await p.$('#reorder-rail button[data-sens="1"]')).boundingBox();
  await p.mouse.move(box.x + 20, box.y + 20); await p.mouse.down(); await p.waitForTimeout(80); await p.mouse.up(); await p.waitForTimeout(700);
  const y1 = await p.evaluate(() => window.scrollY);
  console.log('appui bref ▼ : scrollY =', y1);
  // appui long sur ▼ : défile en continu
  await p.mouse.move(box.x + 20, box.y + 20); await p.mouse.down(); await p.waitForTimeout(900); const yMid = await p.evaluate(() => window.scrollY); await p.mouse.up(); await p.waitForTimeout(200);
  console.log('appui long ▼  : scrollY =', yMid, '(plus bas ?', yMid > y1 + 100, ')');
  // ▲ : remonte
  const boxU = await (await p.$('#reorder-rail button[data-sens="-1"]')).boundingBox();
  await p.mouse.move(boxU.x + 20, boxU.y + 20); await p.mouse.down(); await p.waitForTimeout(900); await p.mouse.up(); await p.waitForTimeout(200);
  console.log('appui long ▲  : scrollY =', await p.evaluate(() => window.scrollY));
  // glisser une carte vers le bord bas : la page défile toute seule
  await p.evaluate(() => { window.scrollTo(0, 0); document.querySelectorAll('#live-exercises > .live-ex')[1].scrollIntoView({block:'center'}); }); await p.waitForTimeout(300);
  const y0 = await p.evaluate(() => window.scrollY);
  const c = await (await p.$$('#live-exercises > .live-ex'))[1].boundingBox();
  await p.mouse.move(c.x + 60, c.y + 20); await p.mouse.down(); await p.mouse.move(c.x + 60, c.y + 60, { steps: 4 });
  await p.mouse.move(c.x + 60, 825, { steps: 8 });
  console.log('drag actif :', await p.evaluate(() => !!(drag && drag.actif)), '| bande du bas :', await p.evaluate(() => document.body.classList.contains('zone-bas')));
  await p.waitForTimeout(1200);
  const yAuto = await p.evaluate(() => window.scrollY);
  console.log('défilement auto (doigt immobile au bord) :', y0, '->', yAuto, '| index cible t =', await p.evaluate(() => drag && drag.t));
  await p.mouse.up(); await p.waitForTimeout(700);
  console.log('ordre : 1er exercice a bougé :', await p.evaluate(() => live.exercises.findIndex(e => e.exId === allExercisesForUI()[1].id)));
  await p.evaluate(() => reorderStop()); await p.waitForTimeout(300);
  console.log('rail après Terminé    :', await vis(), '| bandes retirées :', await p.evaluate(() => !document.body.classList.contains('drag-actif')));
  console.log('erreurs :', err.length ? err.join(' | ') : 'aucune');
  await b.close(); })();
