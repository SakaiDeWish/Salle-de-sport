const { ouvrir } = require('./lib.js');
(async () => { const { b, p, err } = await ouvrir();
  // historique de test : séances lun et mer de cette semaine
  await p.evaluate(() => { const now = new Date(); const lundi = new Date(now); lundi.setHours(10, 0, 0, 0); lundi.setDate(now.getDate() - ((now.getDay() + 6) % 7)); const mer = new Date(lundi); mer.setDate(lundi.getDate() + 2);
    const mk = (d, nom) => ({ id: 'h' + d.getTime(), nom, date: d.getTime(), dureeMs: 3000000, reposMs: 500000, nbSeries: 12, volume: 4000, exercices: [] });
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify([mk(lundi, 'Haut du corps'), mk(mer, 'Bas du corps')])); applyTheme('opale'); activateView('suivi'); activateView('accueil'); });
  await p.waitForTimeout(1200);
  console.log('canvas ciel :', await p.evaluate(() => { const c = document.getElementById('opale-ciel'); return c ? getComputedStyle(c).display + ' ' + c.width + 'x' + c.height + ' | html.ciel-on=' + document.documentElement.classList.contains('ciel-on') : 'absent'; }));
  console.log('étoiles dessinées (pixels non vides) :', await p.evaluate(() => { const c = document.getElementById('opale-ciel'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 20) n++; return n; }));
  console.log('constellation :', await p.evaluate(() => document.querySelectorAll('.op-const .cj').length + ' jours, ' + document.querySelectorAll('.op-const .cj.on').length + ' entraînés, lignes ' + document.querySelectorAll('.cj-lignes line').length));
  console.log('charge de l\'opale :', await p.evaluate(() => document.querySelector('.op-gem-hero').style.getPropertyValue('--charge')));
  await p.screenshot({ path: 'vivant-accueil.png' });
  await p.evaluate(() => document.body.classList.remove('home-nouveau')); await p.waitForTimeout(200);
  // tap sur le joyau
  const g = await (await p.$('.op-gem-hero')).boundingBox();
  await p.mouse.move(g.x + g.width * 0.7, g.y + g.height * 0.3); await p.mouse.down(); await p.waitForTimeout(60);
  console.log('orientation pendant le toucher :', await p.evaluate(() => ['--gx', '--gy', '--rx', '--ry'].map(k => document.querySelector('.op-gem-hero').style.getPropertyValue(k)).join(' ')), '| classe touche :', await p.evaluate(() => document.querySelector('.op-gem-hero').classList.contains('touche')));
  await p.mouse.up(); await p.waitForTimeout(150);
  console.log('tap : onde+étincelles :', await p.evaluate(() => document.querySelectorAll('.gem-onde').length + ' onde, ' + document.querySelectorAll('.etincelle').length + ' étincelles'));
  await p.waitForTimeout(1100);
  // maintien = charge, puis message
  await p.mouse.move(g.x + g.width / 2, g.y + g.height / 2); await p.mouse.down(); await p.waitForTimeout(700);
  console.log('anneau de charge :', await p.evaluate(() => !!document.querySelector('.gem-charge')));
  await p.waitForTimeout(1900);
  console.log('prêt :', await p.evaluate(() => document.querySelector('.op-gem-hero').classList.contains('pret')));
  await p.mouse.up(); await p.waitForTimeout(400);
  console.log('bulle :', await p.evaluate(() => { const b = document.querySelector('.op-bulle'); return b ? b.classList.contains('on') + ' ' + b.textContent : 'absente'; }));
  await p.screenshot({ path: 'vivant-bulle.png' });
  // étoile filante : on force
  await p.waitForTimeout(500);
  await p.evaluate(() => { const e = document.createElement('button'); e.className = 'etoile-filante'; e.style.cssText = 'top:200px;left:100px'; document.body.appendChild(e); });
  // clic sur la constellation
  await p.evaluate(() => document.querySelector('.cj.on').scrollIntoView({ block: 'center' })); await p.waitForTimeout(400);
  const j = await (await p.$('.cj.on .cj-zone')).boundingBox(); await p.mouse.click(j.x + j.width / 2, j.y + j.height / 2); await p.waitForTimeout(300);
  console.log('toast jour :', await p.evaluate(() => document.getElementById('op-toast').textContent));
  // salut
  await p.evaluate(() => document.querySelector('.home-hero .display').click()); await p.waitForTimeout(200);
  console.log('vague :', await p.evaluate(() => document.querySelectorAll('.vague-l').length + ' lettres'));
  await p.waitForTimeout(1800);
  console.log('vague finie, titre restauré :', await p.evaluate(() => document.querySelectorAll('.vague-l').length === 0 && document.querySelector('.home-hero .display').textContent));
  // autre thème : tout s'éteint
  await p.evaluate(() => applyTheme('gamifie')); await p.waitForTimeout(300);
  console.log('thème Gamifié : ciel =', await p.evaluate(() => getComputedStyle(document.getElementById('opale-ciel')).display), '| joyau hero =', await p.evaluate(() => getComputedStyle(document.querySelector('.op-gem-hero')).display));
  console.log('erreurs :', err.length ? err.join(' | ') : 'aucune'); await b.close(); })();
