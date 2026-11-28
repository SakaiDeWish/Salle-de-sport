const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir();
  await p.evaluate(() => {
    const L = allExercisesForUI(); const e0 = L[0], e1 = L[1], e2 = L[2];
    const mk = (id, nom, j, exs) => ({ id, nom, date: Date.now() - j * 86400000, dureeMs: 3000000, reposMs: 400000, nbSeries: 9, volume: 3000, exercises: exs });
    const ex = (e, sets) => ({ exId: e.id, nom: e.nom, groupe: e.groupe, sets });
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify([
      mk('s1', 'Pecs du lundi', 6, [ex(e0, [{ poids: 60, reps: 10 }, { poids: 62.5, reps: 8 }, { poids: 62.5, reps: 8 }]), ex(e1, [{ poids: 24, reps: 12 }, { poids: 24, reps: 10 }])]),
      mk('s2', 'Dos du jeudi', 3, [ex(e2, [{ poids: 40, reps: 12 }, { poids: 40, reps: 12 }, { poids: 45, reps: 10 }])])
    ]));
    const gp = generateProgram({ prenom: 'T', objectif: 'forme', niveau: 'debutant', jours: 3, materiel: 'salle', priorite: null, split: 'fullbody' });
    registerGeneratedProgram(gp);
  });
  console.log('programme actif au départ :', await p.evaluate(() => { const pr = loadJSON(STORAGE_KEYS.program, null); return pr.nom + ' · ' + pr.days.length + ' séances'; }));
  // 1) depuis le panneau Mes programmes
  await p.evaluate(() => { activateView('programme'); document.querySelector('[data-ppanel="programmes"]').click(); });
  await p.waitForTimeout(500);
  console.log('bouton présent :', await p.evaluate(() => !!document.getElementById('from-sessions')));
  await p.evaluate(() => document.getElementById('from-sessions').click()); await p.waitForTimeout(500);
  console.log('lignes de séances :', await p.evaluate(() => document.querySelectorAll('.sp-ligne').length), '| bouton :', await p.evaluate(() => document.getElementById('sp-ok').textContent + ' disabled=' + document.getElementById('sp-ok').disabled));
  await p.evaluate(() => { const c = [...document.querySelectorAll('.sp-case')]; c.find(x => x.value === 's2').click(); c.find(x => x.value === 's1').click(); });
  console.log('bouton après 2 coches :', await p.evaluate(() => document.getElementById('sp-ok').textContent));
  await p.screenshot({ path: 'sp-modal.png' });
  await p.evaluate(() => document.getElementById('sp-ok').click()); await p.waitForTimeout(300);
  console.log('retour :', await p.evaluate(() => document.getElementById('sp-retour').textContent));
  console.log('programme actif après :', await p.evaluate(() => { const pr = loadJSON(STORAGE_KEYS.program, null); return pr.nom + ' · ' + pr.days.length + ' séances · dernières : ' + pr.days.slice(-2).map(d => d.titre + ' [' + d.exercices.map(x => x.series + '×' + x.reps + (x.note ? ' ' + x.note : '')).join(' ; ') + ']').join(' | '); }));
  await p.evaluate(() => document.getElementById('sp-annule').click());
  // 2) nouveau programme depuis la modale d'une séance
  await p.evaluate(() => { activateView('suivi'); });
  await p.evaluate(() => openSessionModal('s1')); await p.waitForTimeout(400);
  console.log('bouton dans la séance :', await p.evaluate(() => !!document.getElementById('sm-add-prog')));
  await p.evaluate(() => document.getElementById('sm-add-prog').click()); await p.waitForTimeout(400);
  console.log('présélection :', await p.evaluate(() => [...document.querySelectorAll('.sp-case:checked')].map(c => c.value).join(',')));
  await p.evaluate(() => { document.querySelector('[name="sp-mode"][value="nouveau"]').click(); document.getElementById('sp-nom').value = 'Mon split perso'; });
  await p.evaluate(() => document.getElementById('sp-ok').click()); await p.waitForTimeout(300);
  console.log('nouveau programme :', await p.evaluate(() => getPrograms().map(x => x.nom + ' (' + x.days.length + ')').join(' ; ')), '| actif inchangé :', await p.evaluate(() => loadJSON(STORAGE_KEYS.program, null).nom));
  console.log('erreurs :', err.length ? err.join(' | ') : 'aucune'); await b.close(); })();
