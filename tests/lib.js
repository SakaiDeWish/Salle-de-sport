/* Outils communs aux tests de bout en bout (Playwright + Chromium).
   Variables d'environnement : PLAYWRIGHT_CORE (chemin du module), CHROME (chemin de Chromium). */
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const EXE = process.env.CHROME || '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');
async function ouvrir(url = URL) {
  const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  if (!process.env.INTRO) await p.addInitScript(() => { try { sessionStorage.setItem('gymcoach.intro', '1'); } catch (e) {} });
  const err = []; p.on('pageerror', e => err.push(String(e)));
  await p.goto(url);
  await p.waitForTimeout(600);
  if (await p.locator('#ob-skip').count()) { await p.click('#ob-skip'); await p.waitForTimeout(250); }
  return { b, p, err };
}
module.exports = { ouvrir, chromium, EXE, URL };
