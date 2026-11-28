const { ouvrir } = require('./lib.js'); const D = __dirname + '/sortie/';
(async () => {
  const { b, p, err } = await ouvrir();
  await p.evaluate(() => {
    const ex = allExercisesForUI();
    startSession("Test", ['pompes-inclinees','tractions','curl-barre'].map(i => newLiveExercise(ex.find(e => e.id === i), '3 × 10', 60)));
    activateView('seance'); showLive();
  });
  await p.waitForTimeout(600);
  const r = await p.evaluate(() => {
    const n = document.getElementById('live-reorder'); if (!n) return 'ABSENT';
    const rc = n.getBoundingClientRect(); let e = n, vis = true;
    while (e && e !== document.body) { const cs = getComputedStyle(e); if (cs.display==='none'||cs.visibility==='hidden'||cs.opacity==='0') vis=false; e = e.parentElement; }
    return { top: Math.round(rc.top), h: Math.round(rc.height), w: Math.round(rc.width), offsetParent: !!n.offsetParent, visible: vis };
  });
  console.log('bouton Ordre :', JSON.stringify(r));
  await p.screenshot({ path: D + 'seance.png' });
  console.log('erreurs :', err.length ? err.join(' | ') : 'aucune');
  await b.close();
})();
