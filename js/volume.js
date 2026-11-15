/* ==================== VOLUME PAR MUSCLE ====================

   Combien de séries chaque muscle a reçues ces 7 derniers jours, placées
   contre des repères de volume hebdomadaire : sous le minimum (MEV, le moins
   qui fasse encore progresser), suffisant, zone idéale (à partir du bas de la
   fourchette MAV), et au-dessus du maximum récupérable (MRV).

   Les repères viennent de la littérature d'entraînement en hypertrophie
   (Renaissance Periodization et reprises). Les sources ne donnent pas les mêmes
   chiffres : ce sont des points de départ à ajuster, pas des normes. Le
   comptage se fait sur le groupe principal de chaque exercice, sans les
   muscles secondaires : un développé couché compte pour les pectoraux seuls.

   Même données que le reste du suivi (l'historique), rien de nouveau à saisir. */

const VOLUME_REPERES = {
  "pectoraux": { mev: 8, mav: 12, mrv: 22 },
  "dos": { mev: 8, mav: 14, mrv: 25 },
  "epaules": { mev: 6, mav: 10, mrv: 22 },
  "biceps": { mev: 6, mav: 10, mrv: 20 },
  "triceps": { mev: 6, mav: 10, mrv: 18 },
  "quadriceps": { mev: 6, mav: 10, mrv: 20 },
  "ischios-fessiers": { mev: 4, mav: 8, mrv: 16 },
  "mollets": { mev: 6, mav: 10, mrv: 20 },
  "abdos": { mev: 4, mav: 8, mrv: 20 },
  "lombaires": { mev: 2, mav: 4, mrv: 10 }
};
const VOLUME_ZONES = ["Pas travaillé", "Sous le minimum", "Suffisant", "Zone idéale", "Trop"];

/* Séries par groupe sur les 7 derniers jours (fenêtre glissante). */
function volumeSemaine(maintenant = Date.now()) {
  const depuis = maintenant - 7 * 86400000;
  const n = {};
  for (const g of Object.keys(VOLUME_REPERES)) n[g] = 0;
  for (const r of getHistory()) {
    if (r.date < depuis || r.date > maintenant) continue;
    for (const ex of r.exercises) if (ex.groupe in n) n[ex.groupe] += ex.sets.length;
  }
  return n;
}

/* 0 pas travaillé, 1 sous le minimum, 2 suffisant, 3 zone idéale, 4 trop. */
function volumeZone(groupe, series) {
  const r = VOLUME_REPERES[groupe];
  if (!r || series <= 0) return 0;
  return series < r.mev ? 1 : series < r.mav ? 2 : series <= r.mrv ? 3 : 4;
}

/* Un mannequin de face et de dos, en formes simples : chaque muscle est coloré
   par sa zone. Le tableau des jauges en dessous dit la même chose en chiffres. */
function volumeCorpsHTML(n) {
  const z = g => volumeZone(g, n[g]);
  const R = (g, x, y, w, h, rx) => `<rect class="vc-r" data-z="${z(g)}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;
  const E = (g, cx, cy, rx, ry) => `<ellipse class="vc-r" data-z="${z(g)}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`;
  const neutre = `<circle class="vc-ne" cx="60" cy="17" r="11"/><rect class="vc-ne" x="54" y="27" width="12" height="9" rx="3"/>
    <rect class="vc-ne" x="22" y="84" width="11" height="30" rx="5"/><rect class="vc-ne" x="87" y="84" width="11" height="30" rx="5"/>
    <rect class="vc-ne" x="43" y="98" width="34" height="16" rx="6"/>`;
  const mollets = R("mollets", 43, 174, 14, 46, 6) + R("mollets", 63, 174, 14, 46, 6);
  const face = neutre + E("epaules", 35, 45, 10, 9) + E("epaules", 85, 45, 10, 9)
    + R("pectoraux", 41, 38, 18, 20, 6) + R("pectoraux", 61, 38, 18, 20, 6)
    + R("biceps", 24, 56, 11, 26, 5) + R("biceps", 85, 56, 11, 26, 5)
    + R("abdos", 47, 60, 26, 36, 7)
    + R("quadriceps", 41, 116, 18, 52, 8) + R("quadriceps", 61, 116, 18, 52, 8) + mollets;
  const dos = neutre + E("epaules", 35, 45, 10, 9) + E("epaules", 85, 45, 10, 9)
    + R("dos", 41, 38, 38, 36, 8)
    + R("triceps", 24, 56, 11, 26, 5) + R("triceps", 85, 56, 11, 26, 5)
    + R("lombaires", 48, 76, 24, 20, 6)
    + R("ischios-fessiers", 42, 98, 36, 18, 8) + R("ischios-fessiers", 41, 118, 18, 50, 8) + R("ischios-fessiers", 61, 118, 18, 50, 8) + mollets;
  const fig = (nom, corps) => `<figure class="vc-fig"><svg viewBox="0 0 120 224" aria-hidden="true" focusable="false">${corps}</svg><figcaption>${nom}</figcaption></figure>`;
  return `<div class="vc-corps">${fig("Face", face)}${fig("Dos", dos)}</div>`;
}

function volumeJaugesHTML(n) {
  return `<div class="vc-liste">${Object.keys(VOLUME_REPERES).sort((a, b) => n[b] - n[a]).map(g => {
    const r = VOLUME_REPERES[g], max = r.mrv * 1.3, pc = v => Math.min(100, v / max * 100).toFixed(1) + "%";
    const zone = volumeZone(g, n[g]);
    return `<div class="vc-row" role="img" aria-label="${esc(LABELS.groupes[g])} : ${n[g]} séries, ${VOLUME_ZONES[zone].toLowerCase()}">
      <span class="vc-nom">${esc(LABELS.groupes[g])}</span>
      <div class="vc-jauge" style="--mev:${pc(r.mev)};--mav:${pc(r.mav)};--mrv:${pc(r.mrv)}"><i class="vc-fill" data-z="${zone}" style="width:${pc(n[g])}"></i></div>
      <span class="vc-n">${n[g]}</span>
    </div>`;
  }).join("")}</div>`;
}

/* Le bloc du tableau de bord (appelé par renderDashboard). */
function volumeBlocHTML() {
  if (!getHistory().length) return "";
  const n = volumeSemaine();
  const total = Object.values(n).reduce((s, v) => s + v, 0);
  const ideal = Object.keys(n).filter(g => volumeZone(g, n[g]) === 3).length;
  return `<div class="card">
    ${disclosure("dash.volume", {
      summary: `<span class="disc-title">Volume de la semaine</span>
        <span class="disc-meta">${total} série${total > 1 ? "s" : ""}, ${ideal} muscle${ideal > 1 ? "s" : ""} en zone idéale</span>`,
      what: `Séries des 7 derniers jours, par muscle, face aux repères hebdomadaires : le minimum pour progresser,
        la zone idéale, le maximum récupérable. Les repères viennent de la littérature d'entraînement et varient
        selon les sources : à ajuster à ton ressenti. Seul le muscle principal de chaque exercice est compté.`,
      detail: `${volumeCorpsHTML(n)}${volumeJaugesHTML(n)}
        <p class="vc-legende"><span data-z="1"></span>sous le minimum <span data-z="2"></span>suffisant <span data-z="3"></span>zone idéale <span data-z="4"></span>trop</p>`,
      dflt: true
    })}
  </div>`;
}

/* ==================== CARTE DE SÉANCE À PARTAGER ====================

   Une image 1080 × 1350 dessinée dans un canvas, avec les couleurs du thème
   actif : durée, volume, séries et les meilleures séries de chaque exercice.
   Le menu de partage du téléphone la propose aux autres applis (Web Share) ;
   sans lui, elle est téléchargée. Rien ne quitte l'appareil de lui-même : c'est
   la personne qui choisit où l'envoyer. Aucun nom ni donnée de profil dedans. */
function meilleureSerieTexte(ex) {
  const s = ex.sets.filter(x => x.reps || x.secondes);
  if (!s.length) return "";
  if (!s.some(x => x.reps)) {
    const t = s.reduce((m, x) => (x.secondes > m.secondes ? x : m));
    return `${t.secondes} s${t.poids ? ` + ${t.poids} kg` : ""}`;
  }
  const b = s.filter(x => x.reps).reduce((m, x) => ((x.poids || 0) * x.reps > (m.poids || 0) * m.reps ? x : m));
  const fr = v => String(v).replace(".", ",");
  return b.poids ? `${fr(b.poids)} kg × ${b.reps}` : `${b.reps} reps`;
}

async function carteSeanceBlob(r) {
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch { /* police par défaut */ }
  const W = 1080, H = 1350, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d"), css = getComputedStyle(document.documentElement);
  const col = (n, d) => css.getPropertyValue(n).trim() || d;
  const bg = col("--bg", "#12110f"), txt = col("--text", "#f4f1ea"), soft = col("--text-soft", "#9aa1ad"), acc = col("--accent", "#ceff00");
  const disp = col("--font-display", "Impact, sans-serif"), corps = getComputedStyle(document.body).fontFamily;
  const rogne = (t, max) => { while (t.length > 1 && g.measureText(t).width > max) t = t.slice(0, -2) + "…"; return t; };
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.fillStyle = acc; g.fillRect(0, 0, W, 14);
  g.textBaseline = "alphabetic";
  g.fillStyle = soft; g.font = `600 40px ${corps}`;
  g.fillText(new Date(r.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }), 72, 130);
  g.fillStyle = txt; g.font = `110px ${disp}`;
  g.fillText(rogne((r.nom || "Séance").toUpperCase(), W - 144), 72, 270);
  const stats = [[fmtClock(r.dureeMs), "durée"], [Math.round(r.volume || 0).toLocaleString("fr-FR") + " kg", "volume"], [String(r.nbSeries || 0), "séries"]];
  stats.forEach(([v, l], i) => {
    const x = [72, 360, 790][i];
    g.fillStyle = i === 1 ? acc : txt; g.font = `96px ${disp}`; g.fillText(v, x, 470);
    g.fillStyle = soft; g.font = `600 36px ${corps}`; g.fillText(l, x, 520);
  });
  const lignes = (r.exercises || []).filter(e => e.sets && e.sets.length).slice(0, 7);
  lignes.forEach((e, i) => {
    const y = 650 + i * 78;
    g.fillStyle = txt; g.font = `600 40px ${corps}`; g.textAlign = "left";
    g.fillText(rogne(e.nom, 600), 72, y);
    g.fillStyle = acc; g.textAlign = "right"; g.fillText(meilleureSerieTexte(e), W - 72, y);
    g.textAlign = "left";
  });
  if ((r.exercises || []).length > lignes.length) {
    g.fillStyle = soft; g.font = `600 34px ${corps}`;
    g.fillText(`et ${(r.exercises || []).length - lignes.length} autre${(r.exercises || []).length - lignes.length > 1 ? "s" : ""}`, 72, 650 + lignes.length * 78);
  }
  g.fillStyle = soft; g.font = `600 36px ${corps}`; g.textAlign = "left";
  g.fillText("GymCoach", 72, H - 72);
  return new Promise(ok => c.toBlob(ok, "image/png"));
}

async function partagerSeance(r, bouton) {
  if (bouton) bouton.disabled = true;
  try {
    const blob = await carteSeanceBlob(r);
    if (!blob) return;
    const fichier = new File([blob], "seance-gymcoach.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [fichier] })) {
      await navigator.share({ files: [fichier], title: r.nom || "Séance" });
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "seance-gymcoach.png";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }
  } catch (e) {
    if (!e || e.name !== "AbortError") console.info("GymCoach : partage impossible", e && e.name);   // annulé par la personne : rien à dire
  } finally {
    if (bouton) bouton.disabled = false;
  }
}
