const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir();
  p.on('dialog', d => { console.log('  [dialogue]', d.message().slice(0, 70)); d.accept(); });
  await p.evaluate(() => { registerGeneratedProgram(generateProgram({ prenom: 'T', objectif: 'masse', niveau: 'debutant', jours: 3, materiel: 'salle', priorite: null, split: 'fullbody' })); const d = loadJSON(STORAGE_KEYS.program).days[0]; startSession('Séance 1 — ' + d.titre, exercicesDuJour(d)); activateView('seance'); expandedIndex = 0; openNext = 0; renderLiveExercises(); });
  await p.waitForTimeout(600);
  const sets = () => p.evaluate(() => JSON.stringify(live.exercises[0].sets.map(s => [s.poids, s.reps])));
  // 1) double tap rapide sur la case
  await p.evaluate(() => { document.getElementById('reps-0').value = 10; document.getElementById('poids-0').value = 20; });
  await p.evaluate(() => { const c = document.querySelector('.cb[data-check="0"]'); c.click(); c.click(); }); await p.waitForTimeout(500);
  console.log('1) double tap -> séries :', await sets());
  // 2) valeurs extrêmes
  await p.evaluate(() => { endRest && endRest(); expandedIndex = 0; openNext = 0; renderLiveExercises(); }); await p.waitForTimeout(900);
  for (const [poids, reps, nom] of [['-5', '10', 'poids négatif'], ['99999', '10', 'poids énorme'], ['20', '0', 'reps nulles'], ['20', '5000', 'reps énormes'], ['abc', '10', 'poids texte']]) {
    const avant = await p.evaluate(() => live.exercises[0].sets.length);
    await p.evaluate(([po, re]) => { const pf = document.getElementById('poids-0'), rf = document.getElementById('reps-0'); if (!pf || !rf) return; pf.value = po; rf.value = re; const c = document.querySelector('.cb[data-check="0"]'); if (c) c.click(); }, [poids, reps]); await p.waitForTimeout(300);
    const apres = await p.evaluate(() => ({ n: live.exercises[0].sets.length, der: JSON.stringify(live.exercises[0].sets.slice(-1).map(s => [s.poids, s.reps])) }));
    console.log('2)', nom.padEnd(14), apres.n > avant ? 'validé ' + apres.der : 'refusé');
    await p.evaluate(() => { endRest && endRest(); expandedIndex = 0; openNext = 0; renderLiveExercises(); }); await p.waitForTimeout(900);
  }
  // 3) pause puis rechargement
  await p.evaluate(() => pauseSession()); const avantPause = await p.evaluate(() => liveElapsed());
  await p.reload(); await p.waitForTimeout(1500);
  console.log('3) après rechargement en pause : séance', await p.evaluate(() => !!live), '| en pause', await p.evaluate(() => !!(live && live.pausedAt)), '| durée stable', await p.evaluate(a => Math.abs(liveElapsed() - a) < 2000, avantPause));
  await p.evaluate(() => resumeSession());
  // 4) séance oubliée : dernière activité il y a 5 h
  await p.evaluate(() => { live.exercises[0].sets.forEach(s => s.doneAt = Date.now() - 5 * 3600000); live.startedAt = Date.now() - 5.2 * 3600000; saveLive(); });
  await p.reload(); await p.waitForTimeout(1800);
  console.log('4) séance oubliée -> close automatiquement :', await p.evaluate(() => !live), '| historique', await p.evaluate(() => getHistory().length));
  // 5) annuler un nom de séance très long / caractères spéciaux dans le builder
  await p.evaluate(() => { openBuilder(getActiveId()); }); await p.waitForTimeout(400);
  await p.evaluate(() => { const i = document.querySelector('.b-day-titre'); i.value = '<img src=x onerror=alert(1)> "quote" & ' + 'x'.repeat(200); i.dispatchEvent(new Event('input', { bubbles: true })); document.getElementById('b-save').click(); });
  await p.waitForTimeout(500);
  await p.evaluate(() => { activateView('programme'); document.querySelector('[data-ppanel="actuel"]').click(); renderProgram(loadJSON(STORAGE_KEYS.program)); }); await p.waitForTimeout(300);
  console.log('5) injection HTML dans le titre :', await p.evaluate(() => ({ img: !!document.querySelector('#program-output img'), debordement: document.documentElement.scrollWidth > innerWidth })));
  console.log('ERR', err); await b.close(); })();
