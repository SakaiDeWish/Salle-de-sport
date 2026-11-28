const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir();
  // worker : liste d'hôtes
  const fs = require('fs'); const src = fs.readFileSync(require('path').resolve(__dirname, '..', 'push-worker', 'src.js'), 'utf8');
  const fn = src.slice(src.indexOf('const HOTES_PUSH'), src.indexOf('async function cleDe'));
  const hoteAutorise = new Function(fn + '; return hoteAutorise;')();
  for (const u of ['https://fcm.googleapis.com/fcm/send/abc', 'https://web.push.apple.com/xyz', 'https://updates.push.services.mozilla.com/wpush/v2/x', 'https://victim.example/a', 'http://fcm.googleapis.com/x', 'https://fcm.googleapis.com:8443/x'])
    console.log('  endpoint', u.slice(0, 48).padEnd(48), '→', hoteAutorise(u) ? 'accepté' : 'refusé');
  // déplacement entre séances
  await p.evaluate(() => { const gp = generateProgram({ prenom: 'T', objectif: 'forme', niveau: 'debutant', jours: 3, materiel: 'salle', priorite: null, split: 'fullbody' }); registerGeneratedProgram(gp); activateView('programme'); openBuilder(gp.id); });
  await p.waitForTimeout(400);
  const compte = () => p.evaluate(() => [...document.querySelectorAll('.b-day')].map(d => d.querySelectorAll('.b-row').length).join(','));
  console.log('exos par séance :', await compte());
  await p.selectOption('.b-day:first-of-type .b-mv-day, .b-day .b-mv-day', '1'); await p.waitForTimeout(200);
  console.log('après déplacement 1→2 :', await compte());
  // annulation push sur fin de séance
  await p.evaluate(() => { window.__push = []; window.pushAnnulerBrut = async () => { window.__push.push('annuler'); }; window.pushProgrammerBrut = async (d) => { window.__push.push('programmer ' + d); };
    localStorage.setItem('gymcoach.restNotif', '1');
    const L = allExercisesForUI(); startSession("T", [newLiveExercise(L[0], '3 × 10', 60)]); activateView('seance'); expandedIndex = 0; openNext = 0; renderLiveExercises(); });
  await p.waitForTimeout(500);
  await p.evaluate(() => { document.getElementById('reps-0').value = '10'; document.getElementById('poids-0').value = '20'; validateSet(0); }); await p.waitForTimeout(400);
  await p.evaluate(() => document.getElementById('rest-minus').click()); await p.waitForTimeout(100);
  await p.evaluate(() => { window.confirm = () => true; clearLive(); }); await p.waitForTimeout(300);
  console.log('appels push :', await p.evaluate(() => window.__push.join(' | ')));
  console.log('erreurs :', err.join(' | ') || 'aucune'); await b.close(); })();
