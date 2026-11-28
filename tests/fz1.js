const { chromium, EXE, URL } = require('./lib.js');
(async () => {
  const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
  const url = URL;
  // 1) état réaliste
  const ctx0 = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p0 = await ctx0.newPage();
  await p0.addInitScript(() => { try { sessionStorage.setItem('gymcoach.intro', '1'); } catch (e) {} });
  await p0.goto(url); await p0.waitForTimeout(1200);
  if (await p0.locator('#ob-skip').count()) await p0.click('#ob-skip');
  await p0.evaluate(() => {
    const L = allExercisesForUI(); const e0 = L[0];
    const h = []; for (let i = 0; i < 6; i++) h.push({ id: 's' + i, nom: 'Séance 1 — A', date: Date.now() - i * 3 * 86400000, dureeMs: 3000000, reposMs: 400000, nbSeries: 2, volume: 1200, exercises: [{ exId: e0.id, nom: e0.nom, groupe: e0.groupe, sets: [{ poids: 60, reps: 10 }, { poids: 60, reps: 10 }] }], structure: [e0.id] });
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(h));
    localStorage.setItem(STORAGE_KEYS.weights, JSON.stringify([{ date: Date.now(), kg: 80 }]));
    registerGeneratedProgram(generateProgram({ prenom: 'T', objectif: 'masse', niveau: 'debutant', jours: 3, materiel: 'salle', priorite: null, split: 'fullbody' }));
    const d = loadJSON(STORAGE_KEYS.program).days[0]; startSession('Séance 1 — ' + d.titre, exercicesDuJour(d)); live.exercises[0].sets.push({ poids: 20, reps: 10 }); saveLive();
    localStorage.setItem('gymcoach.etoiles', '5'); localStorage.setItem('gymcoach.defis', '{"cle":"x","ids":[]}');
  });
  const etat = await p0.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter(k => k.startsWith('gymcoach.')).map(k => [k, localStorage.getItem(k)])));
  await ctx0.close();
  const cles = Object.keys(etat);
  console.log(cles.length, 'clés :', cles.join(', '));
  const pires = ['{{', 'null', '[]', '{}', '"x"'];
  const echecs = [];
  for (const cle of cles) {
    for (const g of pires) {
      const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
      const p = await ctx.newPage();
      const err = []; p.on('pageerror', e => err.push(String(e).slice(0, 110)));
      await p.addInitScript(([e, cle, g]) => { try { sessionStorage.setItem('gymcoach.intro', '1'); } catch (x) {} for (const [k, v] of Object.entries(e)) localStorage.setItem(k, k === cle ? g : v); }, [etat, cle, g]);
      try {
        await p.goto(url); await p.waitForTimeout(700);
        if (await p.locator('#ob-skip').count()) await p.click('#ob-skip').catch(() => {});
        for (const v of ['accueil', 'programme', 'seance', 'suivi', 'bibliotheque', 'nutrition']) {
          await p.evaluate(v => { try { activateView(v); } catch (e) { throw e; } }, v).catch(e => err.push('vue ' + v + ': ' + String(e).slice(0, 90)));
          await p.waitForTimeout(120);
        }
        await p.evaluate(() => { document.querySelector('.seg[data-panel="seances"]')?.click(); document.querySelector('.seg[data-panel="calendrier"]')?.click(); }).catch(() => {});
      } catch (e) { err.push('chargement: ' + String(e).slice(0, 80)); }
      if (err.length) echecs.push(cle + ' = ' + g + ' → ' + [...new Set(err)].slice(0, 2).join(' | '));
      await ctx.close();
    }
  }
  console.log('ÉCHECS', echecs.length); echecs.forEach(x => console.log(' -', x));
  await b.close();
})();
