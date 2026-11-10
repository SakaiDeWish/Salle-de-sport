/* =========================================================
   GymCoach — Système d'icônes SVG maison
   Un seul jeu de glyphes (sprite <symbol>), DEUX rendus :
   - thème CLAIR  : trait fin (1.5), élégant, discret
   - thème SOMBRE : trait épais (2.6), bouts ronds, accents
     colorés + animations (flamme, play, trophée)
   Même icône = même signification partout ; le style bascule
   avec le thème via CSS (voir "ICÔNES" dans style.css).
   ========================================================= */

const ICON_SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  <!-- Navigation -->
  <symbol id="ic-home" viewBox="0 0 24 24"><path d="M3 11 12 3l9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/></symbol>
  <symbol id="ic-book" viewBox="0 0 24 24"><path d="M12 6c-2-1.6-4.5-2-8-2v15c3.5 0 6 .4 8 2 2-1.6 4.5-2 8-2V4c-3.5 0-6 .4-8 2Z"/><path d="M12 6v15"/></symbol>
  <symbol id="ic-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" class="ic-fill"/></symbol>
  <symbol id="ic-timer" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 13V8.5"/><path d="M9 2h6"/><path d="M12 2v3"/></symbol>
  <symbol id="ic-chart" viewBox="0 0 24 24"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></symbol>
  <symbol id="ic-apple" viewBox="0 0 24 24"><path d="M12 7c-4-2-8 .5-8 5.5S7.5 21 12 21s8-3.5 8-8.5S16 5 12 7Z"/><path d="M12 7c0-2 1-4 3-5"/></symbol>
  <symbol id="ic-plus" viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></symbol>
  <symbol id="ic-minus" viewBox="0 0 24 24"><path d="M5 12h14"/></symbol>
  <!-- Entraînement -->
  <symbol id="ic-dumbbell" viewBox="0 0 24 24"><rect x="2" y="9" width="3" height="6" rx="1"/><rect x="6" y="7" width="3" height="10" rx="1"/><rect x="15" y="7" width="3" height="10" rx="1"/><rect x="19" y="9" width="3" height="6" rx="1"/><path d="M9 12h6"/></symbol>
  <symbol id="ic-play" viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5Z" class="ic-fill"/></symbol>
  <symbol id="ic-arrow-right" viewBox="0 0 24 24"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></symbol>
  <!-- Ajout de contexte : appareil photo, photothèque, fichier -->
  <symbol id="ic-camera" viewBox="0 0 24 24"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.5"/></symbol>
  <symbol id="ic-image" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5"/><path d="m3 16 4.5-4 4 3.5L15 12l6 5"/></symbol>
  <symbol id="ic-file" viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M12 17.5V12M9.6 14.4 12 12l2.4 2.4"/></symbol>
  <symbol id="ic-flame" viewBox="0 0 24 24"><path d="M12 3c1 3-3 5-3 9a5.5 5.5 0 0 0 11 0c0-2-1-3.5-2-5-.2 1.2-.8 2-2 2.5C16.5 7 15 4.5 12 3Z"/><path d="M12 21c-1.8 0-3-1.3-3-3 0-1.6 1.5-2.5 3-4 1.5 1.5 3 2.4 3 4 0 1.7-1.2 3-3 3Z" class="ic-fill"/></symbol>
  <symbol id="ic-trophy" viewBox="0 0 24 24"><path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M7 5H3.5c0 4 1.8 5.8 3.8 6M17 5h3.5c0 4-1.8 5.8-3.8 6"/><path d="M12 14v4"/><path d="M8 21h8"/><path d="M9 21c0-2 1.3-3 3-3s3 1 3 3"/></symbol>
  <symbol id="ic-crown" viewBox="0 0 24 24"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-1.5 11h-15Z"/></symbol>
  <symbol id="ic-medal" viewBox="0 0 24 24"><circle cx="12" cy="14" r="6"/><path d="m12 12 .9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3Z" class="ic-fill"/><path d="M8 8.5 5 2h5l2 4 2-4h5l-3 6.5"/></symbol>
  <symbol id="ic-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m7.5 12.5 3 3 6-7"/></symbol>
  <symbol id="ic-calendar" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/><circle cx="12" cy="15" r="1.4" class="ic-fill"/></symbol>
  <symbol id="ic-bolt" viewBox="0 0 24 24"><path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5Z"/></symbol>
  <symbol id="ic-trend" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/></symbol>
  <symbol id="ic-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2.5"/></symbol>
  <symbol id="ic-stack" viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></symbol>
  <symbol id="ic-scale" viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8a6 6 0 0 1 8 0l-2.5 3a3 3 0 0 0-3 0Z"/></symbol>
  <symbol id="ic-swap" viewBox="0 0 24 24"><path d="M7 4 3 8l4 4"/><path d="M3 8h13a5 5 0 0 1 5 5"/><path d="m17 20 4-4-4-4"/><path d="M21 16H8a5 5 0 0 1-5-5"/></symbol>
  <symbol id="ic-trash" viewBox="0 0 24 24"><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></symbol>
  <symbol id="ic-edit" viewBox="0 0 24 24"><path d="M4 20h4L20 8l-4-4L4 16Z"/><path d="m13 7 4 4"/></symbol>
  <symbol id="ic-copy" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></symbol>
  <symbol id="ic-download" viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></symbol>
  <symbol id="ic-upload" viewBox="0 0 24 24"><path d="M12 15V3"/><path d="m7 8 5-5 5 5"/><path d="M4 21h16"/></symbol>
  <symbol id="ic-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/></symbol>
  <symbol id="ic-note" viewBox="0 0 24 24"><path d="M5 3h11l3 3v15H5Z"/><path d="M16 3v4h4"/><path d="M9 12h6M9 16h6"/></symbol>
  <symbol id="ic-link" viewBox="0 0 24 24"><path d="M9 15l6-6"/><path d="M11 6.5 13 4.5a4 4 0 0 1 6 6L17 12.5"/><path d="M13 17.5 11 19.5a4 4 0 0 1-6-6L7 11.5"/></symbol>
  <symbol id="ic-video" viewBox="0 0 24 24"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></symbol>
  <symbol id="ic-party" viewBox="0 0 24 24"><path d="M6 10 3 21l11-3"/><path d="M6 10c3 1 7 5 8 8"/><path d="M13 6l.8-3M17 8l2.5-2.5M19 12l3-.5" /></symbol>
  <!-- Groupes musculaires -->
  <symbol id="ic-g-pectoraux" viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M12 7c-4-2-8 0-8 4 0 3 3 5 8 5"/><path d="M12 7c4-2 8 0 8 4 0 3-3 5-8 5"/></symbol>
  <symbol id="ic-g-dos" viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M12 5C9 5 5 6.5 4 10c2.5.5 4.5 2.5 5 6l3-2"/><path d="M12 5c3 0 7 1.5 8 5-2.5.5-4.5 2.5-5 6l-3-2"/></symbol>
  <symbol id="ic-g-epaules" viewBox="0 0 24 24"><circle cx="6" cy="10" r="3.5"/><circle cx="18" cy="10" r="3.5"/><path d="M9 8.5c1-1.5 5-1.5 6 0"/><path d="M6 13.5V19M18 13.5V19"/></symbol>
  <symbol id="ic-g-biceps" viewBox="0 0 24 24"><path d="M5 20c0-6 2-11 5-15"/><path d="M10 5l7 3"/><path d="M8 13c4-2 8 0 8 3.5 0 2.5-2.5 3.5-5.5 3.5H5"/></symbol>
  <symbol id="ic-g-triceps" viewBox="0 0 24 24"><path d="M19 4c-6 0-11 2-15 5"/><path d="M4 9l3 7"/><path d="M11 11c2 4 0 8-3.5 8"/><path d="M14 8c3 2 4 6 2 9"/></symbol>
  <symbol id="ic-g-quadriceps" viewBox="0 0 24 24"><path d="M8 3c-1 5-1 9 1 12l1 6"/><path d="M16 3c1 5 1 9-1 12l-1 6"/><path d="M9.5 9h5"/></symbol>
  <symbol id="ic-g-ischios-fessiers" viewBox="0 0 24 24"><path d="M5 8c0-3 3-4 7-4s7 1 7 4"/><path d="M5 8c0 4 2.5 6 7 6s7-2 7-6"/><path d="M8 14l-1 7M16 14l1 7"/></symbol>
  <symbol id="ic-g-mollets" viewBox="0 0 24 24"><path d="M9 3c-2 4-2.5 8 0 11l.5 7"/><path d="M15 3c2 4 2.5 8 0 11l-.5 7"/><path d="M9.5 8c2 1.5 3.5 1.5 5.5 0"/></symbol>
  <symbol id="ic-g-abdos" viewBox="0 0 24 24"><rect x="7" y="3.5" width="4.4" height="5" rx="1.4"/><rect x="12.6" y="3.5" width="4.4" height="5" rx="1.4"/><rect x="7" y="9.5" width="4.4" height="5" rx="1.4"/><rect x="12.6" y="9.5" width="4.4" height="5" rx="1.4"/><rect x="7" y="15.5" width="4.4" height="5" rx="1.4"/><rect x="12.6" y="15.5" width="4.4" height="5" rx="1.4"/></symbol>
  <symbol id="ic-g-lombaires" viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M8.5 6h7M9 10h6M9.5 14h5M10 18h4"/></symbol>
  <!-- Interface : tracés de Lucide (https://lucide.dev), licence ISC, remplacent
       les emojis et glyphes typographiques. Même grille 24, même trait que le reste. -->
  <symbol id="ic-alert" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /> <path d="M12 9v4" /> <path d="M12 17h.01" /></symbol>
  <symbol id="ic-arrows-v" viewBox="0 0 24 24"><path d="m21 16-4 4-4-4" /> <path d="M17 20V4" /> <path d="m3 8 4-4 4 4" /> <path d="M7 4v16" /></symbol>
  <symbol id="ic-arrows-h" viewBox="0 0 24 24"><path d="M8 3 4 7l4 4" /> <path d="M4 7h16" /> <path d="m16 21 4-4-4-4" /> <path d="M20 17H4" /></symbol>
  <symbol id="ic-moon" viewBox="0 0 24 24"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></symbol>
  <symbol id="ic-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /> <path d="M12 2v2" /> <path d="M12 20v2" /> <path d="m4.93 4.93 1.41 1.41" /> <path d="m17.66 17.66 1.41 1.41" /> <path d="M2 12h2" /> <path d="M20 12h2" /> <path d="m6.34 17.66-1.41 1.41" /> <path d="m19.07 4.93-1.41 1.41" /></symbol>
  <symbol id="ic-star" viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></symbol>
  <symbol id="ic-message" viewBox="0 0 24 24"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" /></symbol>
  <symbol id="ic-clapper" viewBox="0 0 24 24"><path d="m12.296 3.464 3.02 3.956" /> <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z" /> <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /> <path d="m6.18 5.276 3.1 3.899" /></symbol>
  <symbol id="ic-tick" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></symbol>
  <symbol id="ic-refresh" viewBox="0 0 24 24"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /> <path d="M21 3v5h-5" /> <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /> <path d="M8 16H3v5" /></symbol>
  <symbol id="ic-printer" viewBox="0 0 24 24"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /> <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /> <rect x="6" y="14" width="12" height="8" rx="1" /></symbol>
  <symbol id="ic-bulb" viewBox="0 0 24 24"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /> <path d="M9 18h6" /> <path d="M10 22h4" /></symbol>
  <symbol id="ic-pencil" viewBox="0 0 24 24"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /> <path d="m15 5 4 4" /></symbol>
  <symbol id="ic-undo" viewBox="0 0 24 24"><path d="M9 14 4 9l5-5" /> <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></symbol>
  <symbol id="ic-thumbs-up" viewBox="0 0 24 24"><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" /> <path d="M7 10v12" /></symbol>
  <symbol id="ic-settings" viewBox="0 0 24 24"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /> <circle cx="12" cy="12" r="3" /></symbol>
  <symbol id="ic-x" viewBox="0 0 24 24"><path d="M18 6 6 18" /> <path d="m6 6 12 12" /></symbol>
  <symbol id="ic-rotate" viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /> <path d="M21 3v5h-5" /></symbol>
  <symbol id="ic-arrow-up" viewBox="0 0 24 24"><path d="m5 12 7-7 7 7" /> <path d="M12 19V5" /></symbol>
  <symbol id="ic-arrow-down" viewBox="0 0 24 24"><path d="M12 5v14" /> <path d="m19 12-7 7-7-7" /></symbol>
  <symbol id="ic-chevron-up" viewBox="0 0 24 24"><path d="m18 15-6-6-6 6" /></symbol>
  <symbol id="ic-chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></symbol>
  <symbol id="ic-pause" viewBox="0 0 24 24"><rect x="14" y="3" width="5" height="18" rx="1" /> <rect x="5" y="3" width="5" height="18" rx="1" /></symbol>
  <symbol id="ic-stop" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2" /></symbol>
  <symbol id="ic-zap" viewBox="0 0 24 24"><path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z" /></symbol>
  <symbol id="ic-chevron-left" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></symbol>
  <symbol id="ic-chevron-right" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></symbol>
</svg>`;

document.body.insertAdjacentHTML("afterbegin", ICON_SPRITE);

/* Génère une icône : icon("flame"), icon("g-dos", "icon-lg") */
function icon(name, cls = "") {
  return `<svg class="icon i-${name} ${cls}" aria-hidden="true" focusable="false"><use href="#ic-${name}"></use></svg>`;
}

/* Icônes d'objectif (remplacent les emojis des programmes) */
function objIcon(objectif) {
  return icon({ masse: "dumbbell", force: "trophy", seche: "flame", forme: "bolt" }[objectif] || "dumbbell");
}

/* Les templates existants interpolent GROUP_ICONS[groupe] :
   on remplace les emojis par les icônes SVG des muscles.
   (défini dans data.js, redéfini ici — icons.js est chargé après) */
Object.keys(GROUP_ICONS).forEach(g => { GROUP_ICONS[g] = icon("g-" + g, "icon-group"); });
