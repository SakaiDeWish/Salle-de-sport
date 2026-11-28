const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir();
  await p.evaluate(() => applyTheme('opale')); await p.waitForTimeout(400);
  // 1 cascade
  await p.evaluate(() => activateView('suivi')); await p.waitForTimeout(80);
  console.log('cascade :', await p.evaluate(() => [...document.querySelectorAll('#view-suivi > :not(.hidden)')].slice(0, 4).map(e => getComputedStyle(e).animationName + '@' + getComputedStyle(e).animationDelay).join(' | ')));
  // 2 pastille d'onglet
  const pos = () => p.evaluate(() => { const n = document.querySelector('.nav-pill'); return n.style.getPropertyValue('--x') + '/' + n.style.getPropertyValue('--w') + ' (' + getComputedStyle(n).display + ')'; });
  console.log('pastille sur Suivi :', await pos());
  await p.evaluate(() => activateView('seance')); await p.waitForTimeout(700);
  console.log('pastille sur Séance :', await pos());
  // 3 parallaxe
  await p.evaluate(() => { activateView('accueil'); }); await p.waitForTimeout(500);
  await p.evaluate(() => window.scrollTo(0, 300)); await p.waitForTimeout(200);
  console.log('parallaxe --py :', await p.evaluate(() => document.documentElement.style.getPropertyValue('--py')), '| transform opale :', await p.evaluate(() => getComputedStyle(document.querySelector('#view-accueil'), '::before').transform));
  // 4 compteurs : relève la valeur en cours d'animation
  await p.evaluate(() => { window.scrollTo(0, 0); activateView('suivi'); }); await p.waitForTimeout(100); await p.evaluate(() => activateView('accueil')); await p.waitForTimeout(300);
  console.log('compteur (mi-course) :', await p.evaluate(() => [...document.querySelectorAll('#view-accueil .chrono-value, #view-accueil .streak-num')].map(e => e.textContent.trim() + (e.__compte ? '*' : '')).join(' ; ')));
  await p.waitForTimeout(1200);
  console.log('compteur (fini)      :', await p.evaluate(() => [...document.querySelectorAll('#view-accueil .chrono-value, #view-accueil .streak-num')].map(e => e.textContent.trim()).join(' ; ')));
  await p.evaluate(() => { const d = document.createElement('div'); d.innerHTML = '<span class="chrono-value" id="cv1">4 500 kg</span><span class="chrono-value" id="cv2">12,5 kg</span><span class="chrono-value" id="cv3">07:30</span>'; document.getElementById('view-accueil').appendChild(d); opaleCompte(d); });
  await p.waitForTimeout(250);
  console.log('compte (mi-course) :', await p.evaluate(() => ['cv1','cv2','cv3'].map(i => document.getElementById(i).textContent).join(' ; ')));
  await p.waitForTimeout(900);
  console.log('compte (fini)      :', await p.evaluate(() => ['cv1','cv2','cv3'].map(i => document.getElementById(i).textContent).join(' ; ')));
  // 5 série validée : onde + étincelles
  await p.evaluate(() => { const L = allExercisesForUI(); startSession("T", [newLiveExercise(L[0], '3 × 10', 60)]); activateView('seance'); expandedIndex = 0; openNext = 0; renderLiveExercises(); });
  await p.waitForTimeout(600);
  await p.evaluate(() => { document.getElementById('reps-0').value='10'; document.getElementById('poids-0').value='20'; validateSet(0); }); await p.waitForTimeout(120);
  console.log('onde/étincelles :', await p.evaluate(() => document.querySelectorAll('.onde').length + ' onde, ' + document.querySelectorAll('.etincelle').length + ' étincelles'));
  // 6 chrono qui défile : change le texte du compte à rebours
  await p.waitForTimeout(300);
  await p.evaluate(() => { const c = document.getElementById('rest-countdown'); c.textContent = '00:59'; c.textContent = '00:58'; }); await p.waitForTimeout(60);
  console.log('chiffres défilants :', await p.evaluate(() => document.querySelectorAll('#rest-countdown .dg').length + ' spans, animés : ' + [...document.querySelectorAll('#rest-countdown .dg')].filter(s => s.getAnimations().length).length));
  console.log('respire :', await p.evaluate(() => getComputedStyle(document.querySelector('.ring-wrap')).animationName));
  // 7 lueur qui suit le doigt
  await p.evaluate(() => endRest()); await p.waitForTimeout(300);
  const c = await (await p.$('.live-ex')).boundingBox(); await p.mouse.move(c.x + 40, c.y + 30); await p.mouse.down(); await p.waitForTimeout(80);
  console.log('lueur :', await p.evaluate(() => { const e = document.querySelector('.live-ex.lueur'); return e ? e.style.getPropertyValue('--mx') + ',' + e.style.getPropertyValue('--my') : 'aucune'; })); await p.mouse.up();
  // 8 inclinaison
  await p.evaluate(() => { Object.defineProperty(window, 'DeviceOrientationEvent', { value: function(){}, configurable: true }); });
  console.log('inclinaison activée :', await p.evaluate(() => opaleTiltActive(true)));
  await p.evaluate(() => window.dispatchEvent(Object.assign(new Event('deviceorientation'), { gamma: 20, beta: 60 }))); await p.waitForTimeout(500);
  console.log('--tx/--ty :', await p.evaluate(() => document.documentElement.style.getPropertyValue('--tx') + ' / ' + document.documentElement.style.getPropertyValue('--ty')));
  console.log('squelette présent dans le CSS :', await p.evaluate(() => { const s = document.createElement('span'); s.className = 'squelette'; document.body.appendChild(s); const a = getComputedStyle(s).animationName; s.remove(); return a; }));
  console.log('erreurs :', err.length ? err.join(' | ') : 'aucune'); await b.close(); })();
