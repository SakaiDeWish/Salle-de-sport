const { chromium, EXE, URL } = require('./lib.js');
(async () => {
  const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
  const url = URL;
  const themes = ['gamifie', 'epure', 'figma', 'mono', 'opale'];
  const problemes = [];
  for (const w of [320, 390, 768]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w === 768 ? 1024 : 700 } });
    const p = await ctx.newPage();
    const err = []; p.on('pageerror', e => err.push(String(e).slice(0, 100)));
    await p.addInitScript(() => { try { sessionStorage.setItem('gymcoach.intro', '1'); } catch (e) {} });
    await p.goto(url); await p.waitForTimeout(1000);
    if (await p.locator('#ob-skip').count()) await p.click('#ob-skip').catch(() => {});
    await p.evaluate(() => {
      const L = allExercisesForUI(); const e0 = L[0], e1 = L[1];
      const h = []; for (let i = 0; i < 5; i++) h.push({ id: 's' + i, nom: 'Séance 1 — Haut du corps avec un nom assez long', date: Date.now() - i * 3 * 86400000, dureeMs: 3000000, reposMs: 400000, nbSeries: 4, volume: 2200, exercises: [{ exId: e0.id, nom: e0.nom, groupe: e0.groupe, sets: [{ poids: 60, reps: 10, note: 'difficile' }, { poids: 62.5, reps: 8 }] }, { exId: e1.id, nom: e1.nom, groupe: e1.groupe, sets: [{ poids: 24, reps: 12 }] }], structure: [e0.id, e1.id] });
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(h));
      for (const o of ['masse', 'forme', 'seche']) registerGeneratedProgram(generateProgram({ prenom: 'T', objectif: o, niveau: 'debutant', jours: 4, materiel: 'salle', priorite: 'pectoraux', split: 'split' }));
    });
    for (const t of themes) {
      for (const v of ['accueil', 'programme', 'seance', 'suivi', 'bibliotheque', 'nutrition', 'ajouter']) {
        await p.evaluate(([t, v]) => { applyTheme(t); activateView(v); if (v === 'accueil') renderHome(); if (v === 'programme') { document.querySelector('[data-ppanel="actuel"]').click(); } }, [t, v]);
        await p.waitForTimeout(350);
        const r = await p.evaluate(() => { const W = innerWidth; const hors = []; document.querySelectorAll('main .view.active *').forEach(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); if (r.width > 0 && cs.position !== 'fixed' && (r.right > W + 2)) hors.push((e.id || e.className || e.tagName).toString().slice(0, 28)); }); return { x: document.documentElement.scrollWidth > W, hors: [...new Set(hors)].slice(0, 3) }; });
        if (r.x || r.hors.length) problemes.push(`${w}px ${t}/${v} ${JSON.stringify(r)}`);
      }
      // feuilles et fenêtres
      for (const [nom, fn] of [['réglages', () => openSettings()], ['premium', () => ouvrirPremium()], ['aperçu', () => { activateView('accueil'); renderHome(); apercuProgramme(); }], ['éditeur', () => openBuilder(getActiveId())]]) {
        await p.evaluate(fn).catch(e => err.push(nom + ': ' + String(e).slice(0, 60)));
        await p.waitForTimeout(1100);       // laisse finir l'animation d'entrée des panneaux latéraux
        const r = await p.evaluate(() => { const W = innerWidth; const boite = document.querySelector('.sheet:not(.hidden) .sheet-box, .modal:not(.hidden) .modal-box'); if (!boite) return { absent: true }; const hors = []; boite.querySelectorAll('*').forEach(e => { const r = e.getBoundingClientRect(); if (r.width > 0 && r.right > W + 2) hors.push((e.id || e.className || e.tagName).toString().slice(0, 28)); }); return { x: document.documentElement.scrollWidth > W, hors: [...new Set(hors)].slice(0, 3) }; });
        if (r.x || (r.hors && r.hors.length) || r.absent) problemes.push(`${w}px ${t}/${nom} ${JSON.stringify(r)}`);
        await p.evaluate(() => { try { closeSheet(); } catch (e) {} try { closeBuilder(); } catch (e) {} document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden')); document.body.style.overflow = ''; });
      }
    }
    if (err.length) problemes.push(w + 'px erreurs: ' + [...new Set(err)].slice(0, 3).join(' | '));
    await ctx.close();
  }
  console.log('PROBLÈMES', problemes.length); problemes.slice(0, 30).forEach(x => console.log(' -', x));
  await b.close();
})();
