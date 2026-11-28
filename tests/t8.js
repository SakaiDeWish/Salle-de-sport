const { ouvrir } = require('./lib.js'); const D = __dirname + '/sortie/';
(async () => {
  const { b, p, err } = await ouvrir(); p.on('dialog', d => d.accept());
  await p.evaluate(() => {
    const ex = allExercisesForUI();
    startSession("T", ['pompes-inclinees','tractions','curl-barre'].map(i => newLiveExercise(ex.find(e => e.id === i), '3 × 10', 60)));
    activateView('seance'); showLive(); endWarmup && endWarmup();
  });
  await p.waitForTimeout(500);
  await p.evaluate(() => document.querySelector('.live-ex-open').scrollIntoView());
  await p.waitForTimeout(250);
  const m = await p.evaluate(() => {
    const c = document.querySelector('.live-ex-open .cb.next, .live-ex-open .cb-row.next .cb'); const r = c.getBoundingClientRect();
    const h = ms => { const x = document.querySelector(ms); return x ? Math.round(x.getBoundingClientRect().height) : null; };
    const hit = getComputedStyle(c, '::after');
    return { caseW: Math.round(r.width), apercuHauteur: h('.live-apercu-fig'), ligne: h('.cb-row'), carte: h('.live-ex-open') };
  });
  console.log(JSON.stringify(m));
  await p.screenshot({ path: D + 'mini1.png' });
  // la zone de tap reste confortable : un tap 9 px à côté de la case la coche
  const box = await p.locator('.live-ex-open .cb-row.next .cb').boundingBox();
  await p.mouse.click(box.x - 7, box.y + box.height / 2);
  await p.waitForTimeout(400);
  console.log('tap à 7 px de la case :', await p.evaluate(() => live.exercises[0].sets.length), 'série(s) cochée(s)');
  console.log('erreurs :', err.length ? err.join(' | ') : 'aucune');
  await b.close();
})();
