const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir();
  p.on('dialog', d => d.accept());
  await p.evaluate(() => {
    const L = allExercisesForUI(); const e0 = L[0], e1 = L[5];
    const h = []; for (let i = 0; i < 6; i++) h.push({ id: 's' + i, nom: 'Séance ' + (1 + i % 3) + ' — Haut', date: Date.now() - i * 3 * 86400000, dureeMs: 3000000, reposMs: 400000, nbSeries: 3, volume: 1800, rpe: 7, notes: 'ok', exercises: [{ exId: e0.id, nom: e0.nom, groupe: e0.groupe, sets: [{ poids: 60, reps: 10 }, { poids: 62.5, reps: 8, note: 'difficile' }] }, { exId: e1.id, nom: e1.nom, groupe: e1.groupe, sets: [{ secondes: 45 }] }], structure: [e0.id, e1.id] });
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(h));
    localStorage.setItem(STORAGE_KEYS.weights, JSON.stringify([{ date: Date.now() - 864e5 * 9, kg: 80 }, { date: Date.now(), kg: 79.2 }]));
    for (const o of ['masse', 'forme']) registerGeneratedProgram(generateProgram({ prenom: 'T', objectif: o, niveau: 'debutant', jours: 3, materiel: 'salle', priorite: null, split: 'fullbody' }));
  });
  const mauvais = /undefined|NaN|\[object|\bnull\b|Infinity|\{\{|\$\{/;
  const trouve = [];
  for (const t of ['gamifie', 'opale']) for (const v of ['accueil', 'programme', 'seance', 'suivi', 'bibliotheque', 'nutrition', 'ajouter']) {
    await p.evaluate(([t, v]) => { applyTheme(t); activateView(v); if (v === 'accueil') renderHome(); }, [t, v]); await p.waitForTimeout(500);
    for (const panel of v === 'suivi' ? ['dashboard', 'seances', 'calendrier'] : [null]) {
      if (panel) { await p.evaluate(pn => document.querySelector(`.seg[data-panel="${pn}"]`).click(), panel); await p.waitForTimeout(300); }
      const txt = await p.evaluate(() => document.body.innerText + ' ' + [...document.querySelectorAll('[aria-label],[title],[placeholder]')].map(e => (e.getAttribute('aria-label') || '') + ' ' + (e.title || '') + ' ' + (e.placeholder || '')).join(' '));
      const m = txt.match(mauvais); if (m) trouve.push(`${t}/${v}${panel ? '/' + panel : ''}: …${txt.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\n/g, ' ')}…`);
    }
  }
  // fenêtres
  for (const [nom, fn] of [['réglages', () => openSettings()], ['fiche', () => openExercise(allExercisesForUI()[3].id)], ['aperçu', () => apercuProgramme()], ['premium', () => ouvrirPremium()], ['éditeur', () => openBuilder(getActiveId())], ['séance détail', () => { const r = getHistory()[0]; openSessionModal(r.id); }]]) {
    await p.evaluate(fn).catch(e => trouve.push(nom + ' : erreur ' + String(e).slice(0, 60))); await p.waitForTimeout(500);
    const txt = await p.evaluate(() => document.body.innerText);
    const m = txt.match(mauvais); if (m) trouve.push(`${nom}: …${txt.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\n/g, ' ')}…`);
    await p.evaluate(() => { try { closeSheet(); } catch (e) {} try { closeBuilder(); } catch (e) {} document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden')); try { closeViewPanel(true); } catch (e) {} });
  }
  console.log('textes suspects :', trouve.length); trouve.forEach(x => console.log(' -', x)); console.log('ERR', err); await b.close(); })();
