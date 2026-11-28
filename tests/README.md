# Tests de bout en bout

Des scripts Playwright pilotent l'app dans Chromium (390 × 844, comme un téléphone) et vérifient les parcours :
séance et pavé, repos, programmes en dossiers, alternatives et super sets, comparatif de fin de séance, premium,
robustesse face à un stockage abîmé (`fz1`), fenêtres et focus (`af1`), débordements par thème et largeur (`mx1`), textes suspects (`tx1`).

```bash
cd tests
npm install playwright-core            # une fois
export CHROME=/chemin/vers/chromium    # si besoin
bash lancer.sh                         # tout lancer ; ou : bash lancer.sh t8 rc1
```
Les captures éventuelles sont écrites dans `tests/sortie/` (ignoré par git).
