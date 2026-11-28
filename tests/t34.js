const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir();
  const v = () => p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--vit').trim() + ' / vit()=' + vit());
  console.log('vitesse par défaut :', await v());
  const dur = () => p.evaluate(() => { activateView('suivi'); const a = getComputedStyle(document.getElementById('view-suivi')); const f = getComputedStyle(document.querySelector('#view-suivi > :not(section):not(.hidden)')); return `vue ${a.animationDuration} | 3e bloc ${f.animationName} ${f.animationDuration} délai ${f.animationDelay}`; });
  console.log('durées (douces) :', await dur());
  await p.evaluate(() => { localStorage.setItem('gymcoach.animDouces', '0'); appliqueVit(); });
  console.log('durées (normales) :', await dur(), '| vit :', await v());
  await p.evaluate(() => { localStorage.setItem('gymcoach.animDouces', '1'); appliqueVit(); });
  // haptique : simule vibrate
  await p.evaluate(() => { window.__v = []; Object.defineProperty(navigator, 'vibrate', { value: m => { window.__v.push(JSON.stringify(m)); return true; }, configurable: true }); });
  await p.click('.bottom-nav .tab[data-view="accueil"]'); await p.waitForTimeout(80);
  await p.evaluate(() => { const L = allExercisesForUI(); startSession("T", [newLiveExercise(L[0], '3 × 10', 60)]); activateView('seance'); expandedIndex = 0; openNext = 0; renderLiveExercises(); });
  await p.waitForTimeout(500);
  await p.evaluate(() => { document.getElementById('reps-0').value = '10'; document.getElementById('poids-0').value = '20'; });
  await p.click('.step-btn[data-target="poids-0"][data-delta="1"]'); await p.waitForTimeout(60);
  await p.click('.cb[data-check="0"]'); await p.waitForTimeout(150);
  console.log('vibrations :', await p.evaluate(() => window.__v.join(' ')));
  await p.waitForTimeout(700); await p.evaluate(() => { endRest(); localStorage.setItem('gymcoach.haptique', '0'); window.__v.length = 0; });
  await p.waitForTimeout(100); await p.click('.bottom-nav .tab[data-view="suivi"]'); await p.waitForTimeout(80);
  console.log('haptique coupé :', await p.evaluate(() => window.__v.length + ' vibration'));
  // réglages
  await p.evaluate(() => { localStorage.removeItem('gymcoach.haptique'); openSettings(); }); await p.waitForTimeout(500);
  console.log('cases réglages :', await p.evaluate(() => ['set-douces', 'set-haptique'].map(i => !!document.getElementById(i)).join(',')));
  await p.click('#set-douces'); console.log('après décoche douces :', await v());
  console.log('erreurs :', err.length ? err.join(' | ') : 'aucune'); await b.close(); })();
