const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir(); p.on('dialog', d => d.accept());
  await p.evaluate(() => { registerGeneratedProgram(generateProgram({ prenom: 'T', objectif: 'masse', niveau: 'debutant', jours: 3, materiel: 'salle', priorite: null, split: 'fullbody' })); activateView('accueil'); renderHome(); });
  const cas = [
    ['réglages', () => openSettings(), '#panel:not(.hidden)'], ['bibliothèque', () => activateView('bibliotheque'), '#panel:not(.hidden)'],
    ['fiche exercice', () => openExercise('developpe-couche-barre'), '#modal:not(.hidden)'],
    ['premium', () => ouvrirPremium(), '#modal:not(.hidden)'],
    ['aperçu programme', () => apercuProgramme(), '#modal:not(.hidden)'],
    ['éditeur', () => openBuilder(getActiveId()), '#builder:not(.hidden)'],
    ['sélecteur', () => { startSession('Séance libre', []); openPicker(); }, '#picker:not(.hidden)'],
    ['pavé', () => { activateView('seance'); expandedIndex = 0; renderLiveExercises(); }, null]
  ];
  for (const [nom, ouvre, sel] of cas) {
    if (!sel) continue;
    await p.evaluate(ouvre); await p.waitForTimeout(500);
    const focusDedans = await p.evaluate(s => { const o = document.querySelector(s); return !!o && o.contains(document.activeElement); }, sel);
    await p.keyboard.press('Escape'); await p.waitForTimeout(500);
    const ferme = await p.evaluate(s => !document.querySelector(s), sel);
    const retour = await p.evaluate(() => document.activeElement === document.body ? 'body' : (document.activeElement.id || document.activeElement.className || document.activeElement.tagName).toString().slice(0, 24));
    console.log(nom.padEnd(18), 'focus dedans:', focusDedans, '| Échap ferme:', ferme, '| focus après:', retour);
    await p.evaluate(() => { try { closeSheet(); } catch (e) {} try { closeBuilder(); } catch (e) {} try { closePicker(); } catch (e) {} document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden')); document.body.style.overflow = ''; });
  }
  console.log(err); await b.close(); })();
