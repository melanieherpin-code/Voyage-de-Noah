/* Le Voyage de Noah – Chapitre 3
   Portraits illustrés (style dessin, pas photo) pour la mission 3.
   Portraits.svg({ genre: "F"|"H", age, tenue }, graine) renvoie un <svg>. */
const Portraits = (() => {
  const NS = "http://www.w3.org/2000/svg";
  const PEAUX = ["#F6D7C3", "#EBC0A0", "#D9A37E", "#B97E56", "#8D5A3B", "#5E3B26"];
  const CHEVEUX_JEUNES = ["#2B1B12", "#4A2E1E", "#7A4B2A", "#C79A5B", "#A0522D", "#1C1C1C"];
  const CHEVEUX_GRIS = ["#8E8E8E", "#A8A8A8"];
  const CHEVEUX_BLANCS = ["#E4E4E4", "#D2D2D2"];
  const FONDS = ["#2B3080", "#3A2F7A", "#1F4A6E", "#40306E", "#22506A", "#33407F"];
  const PULLS = ["#E07A5F", "#3D9970", "#F2CC8F", "#81B29A", "#9B5DE5", "#4D96FF", "#F28482", "#E9C46A"];
  const STYLES_F = ["long", "carre", "chignon", "queue", "boucles", "long", "carre", "queue"];
  const STYLES_H = ["court", "rase", "boucles_courtes", "court", "rase", "meche"];

  function n(tag, attrs) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; }

  function svg(p, graine) {
    const g = graine || 0;
    const age = p.age, F = p.genre === "F";
    const peau = PEAUX[p.peau !== undefined ? p.peau : (g * 5 + 2) % PEAUX.length];
    const cheveux = age >= 70 ? CHEVEUX_BLANCS[g % 2] : age >= 55 ? CHEVEUX_GRIS[g % 2] : CHEVEUX_JEUNES[(g * 3) % CHEVEUX_JEUNES.length];
    let style = F ? STYLES_F[(g * 3 + 1) % STYLES_F.length] : STYLES_H[(g * 2) % STYLES_H.length];
    if (!F && age >= 60 && g % 2 === 0) style = "chauve";
    const barbe = !F && age >= 20 && g % 3 === 1;
    const lunettes = age >= 60 ? g % 2 === 1 : g % 5 === 3;
    const boucles = F && g % 2 === 0;
    const casquette = p.tenue === "pilote";

    const s = n("svg", { viewBox: "0 0 100 110", "aria-hidden": "true" });
    s.append(n("rect", { width: 100, height: 110, fill: FONDS[g % FONDS.length] }));

    // Cheveux derrière la tête
    if (style === "long") s.append(n("path", { d: "M29 42 Q26 84 33 92 L67 92 Q74 84 71 42 Z", fill: cheveux }));
    if (style === "carre") s.append(n("path", { d: "M29 42 Q27 66 34 69 L66 69 Q73 66 71 42 Z", fill: cheveux }));
    if (style === "chignon") s.append(n("circle", { cx: 50, cy: 19, r: 9, fill: cheveux }));
    if (style === "queue") s.append(n("ellipse", { cx: 73, cy: 52, rx: 6, ry: 15, fill: cheveux }));
    if (style === "boucles") [[30, 34], [36, 24], [46, 19], [56, 19], [65, 24], [70, 34], [28, 46], [72, 46], [30, 58], [70, 58]].forEach(([x, y]) => s.append(n("circle", { cx: x, cy: y, r: 8, fill: cheveux })));

    // Cou et tenue
    s.append(n("rect", { x: F ? 45 : 43, y: 60, width: F ? 10 : 14, height: 16, fill: peau }));
    tenue(s, p.tenue, g, peau);

    // Tête
    s.append(n("circle", { cx: 32, cy: 48, r: 4, fill: peau }));
    s.append(n("circle", { cx: 68, cy: 48, r: 4, fill: peau }));
    if (F) s.append(n("ellipse", { cx: 50, cy: 46, rx: 17.5, ry: 22, fill: peau }));
    else s.append(n("path", { d: "M31 42 Q31 22 50 22 Q69 22 69 42 L68 54 Q66 66 50 69 Q34 66 32 54 Z", fill: peau }));
    if (boucles) { s.append(n("circle", { cx: 32, cy: 53, r: 1.8, fill: "#FFC857" })); s.append(n("circle", { cx: 68, cy: 53, r: 1.8, fill: "#FFC857" })); }

    // Barbe (sous la bouche)
    if (barbe) s.append(n("path", { d: "M33 50 Q35 72 50 72 Q65 72 67 50 Q63 61 50 62 Q37 61 33 50 Z", fill: cheveux }));

    // Rides selon l’âge
    const trait = { stroke: "rgba(60,30,20,.45)", "stroke-width": 1, fill: "none", "stroke-linecap": "round" };
    if (age >= 45) { s.append(n("path", { d: "M43 34 Q50 32 57 34", ...trait })); }
    if (age >= 55) {
      s.append(n("path", { d: "M42 31 Q50 29 58 31", ...trait }));
      s.append(n("path", { d: "M36 47 l-3 -1 M36 49 l-3 1 M64 47 l3 -1 M64 49 l3 1", ...trait }));
      s.append(n("path", { d: "M42 54 Q41 59 43 62 M58 54 Q59 59 57 62", ...trait }));
    }

    // Yeux, sourcils, nez, bouche
    s.append(n("circle", { cx: 43, cy: 46, r: 2.2, fill: "#1E1E2E" }));
    s.append(n("circle", { cx: 57, cy: 46, r: 2.2, fill: "#1E1E2E" }));
    const sourcil = { stroke: age >= 55 ? cheveux : "#2B1B12", "stroke-width": F ? 1.4 : 2.8, fill: "none", "stroke-linecap": "round" };
    if (F) {
      const cil = { stroke: "#1E1E2E", "stroke-width": 1, "stroke-linecap": "round" };
      s.append(n("path", { d: "M40.5 44.5 l-1.8 -1.6 M45.5 44.5 l1.8 -1.6 M54.5 44.5 l-1.8 -1.6 M59.5 44.5 l1.8 -1.6", ...cil }));
      s.append(n("circle", { cx: 39, cy: 54, r: 3.2, fill: "rgba(230,110,110,.25)" }));
      s.append(n("circle", { cx: 61, cy: 54, r: 3.2, fill: "rgba(230,110,110,.25)" }));
    }
    s.append(n("path", { d: "M39 41 Q43 39 47 41", ...sourcil }));
    s.append(n("path", { d: "M53 41 Q57 39 61 41", ...sourcil }));
    s.append(n("path", { d: "M50 48 Q48 53 51 54", stroke: "rgba(60,30,20,.5)", "stroke-width": 1.2, fill: "none", "stroke-linecap": "round" }));
    s.append(n("path", { d: "M44 59 Q50 63 56 59", stroke: F ? "#C0475A" : "#8A3A3A", "stroke-width": F ? 2.4 : 1.8, fill: "none", "stroke-linecap": "round" }));

    // Lunettes
    if (lunettes) {
      const l = { stroke: "#1E1E2E", "stroke-width": 1.4, fill: "rgba(255,255,255,.15)" };
      s.append(n("circle", { cx: 43, cy: 46, r: 5, ...l }));
      s.append(n("circle", { cx: 57, cy: 46, r: 5, ...l }));
      s.append(n("path", { d: "M48 46 L52 46", stroke: "#1E1E2E", "stroke-width": 1.4 }));
    }

    // Cheveux devant
    if (casquette) {
      s.append(n("path", { d: "M30 34 Q50 14 70 34 Z", fill: "#1D2B53" }));
      s.append(n("rect", { x: 28, y: 32, width: 44, height: 5, rx: 2, fill: "#141E3C" }));
      s.append(n("circle", { cx: 50, cy: 27, r: 3, fill: "#FFC857" }));
      if (style !== "chauve") { s.append(n("path", { d: "M32 37 Q31 44 33 48 L35 38 Z", fill: cheveux })); s.append(n("path", { d: "M68 37 Q69 44 67 48 L65 38 Z", fill: cheveux })); }
    } else if (style === "chauve") {
      s.append(n("path", { d: "M32 40 Q31 48 33 52 L35 42 Z", fill: cheveux }));
      s.append(n("path", { d: "M68 40 Q69 48 67 52 L65 42 Z", fill: cheveux }));
    } else if (style === "rase") {
      s.append(n("path", { d: "M31 42 Q30 21 50 20 Q70 21 69 42 Q66 30 50 29 Q34 30 31 42 Z", fill: cheveux, opacity: .9 }));
    } else if (style === "boucles_courtes") {
      [[36, 30], [43, 25], [50, 23], [57, 25], [64, 30], [33, 37], [67, 37]].forEach(([x, y]) => s.append(n("circle", { cx: x, cy: y, r: 6, fill: cheveux })));
    } else if (style === "boucles") {
      [[38, 29], [46, 26], [54, 26], [62, 29]].forEach(([x, y]) => s.append(n("circle", { cx: x, cy: y, r: 6, fill: cheveux })));
    } else if (style === "meche") {
      s.append(n("path", { d: "M31 42 Q30 22 50 21 Q70 22 69 42 Q66 32 58 30 Q52 36 40 34 Q34 36 31 42 Z", fill: cheveux }));
    } else {
      // long, carré, chignon, queue, court
      s.append(n("path", { d: "M31 44 Q29 21 50 20 Q71 21 69 44 Q66 31 54 29 Q46 33 36 33 Q32 37 31 44 Z", fill: cheveux }));
    }
    return s;
  }

  function tenue(s, t, g, peau) {
    const epaules = "M8 110 C8 86 26 74 50 74 C74 74 92 86 92 110 Z";
    const col = (c) => s.append(n("path", { d: "M42 74 L50 88 L58 74 Z", fill: c }));
    if (t === "costume") {
      s.append(n("path", { d: epaules, fill: "#23263A" }));
      col("#F4F4F4");
      s.append(n("path", { d: "M48 78 L52 78 L53 96 L50 100 L47 96 Z", fill: g % 2 ? "#B23A48" : "#2E6F8E" }));
    } else if (t === "pilote") {
      s.append(n("path", { d: epaules, fill: "#1D2B53" }));
      col("#F4F4F4");
      s.append(n("path", { d: "M48 78 L52 78 L53 96 L50 100 L47 96 Z", fill: "#111" }));
      s.append(n("rect", { x: 16, y: 88, width: 12, height: 3, fill: "#FFC857" }));
      s.append(n("rect", { x: 72, y: 88, width: 12, height: 3, fill: "#FFC857" }));
    } else if (t === "hopital") {
      s.append(n("path", { d: epaules, fill: "#4FA3A5" }));
      s.append(n("path", { d: "M42 74 L50 86 L58 74 Z", fill: peau }));
      s.append(n("path", { d: "M42 74 L50 86 L58 74", stroke: "#2F7F81", "stroke-width": 2, fill: "none" }));
    } else if (t === "labo") {
      s.append(n("path", { d: epaules, fill: "#F2F2F2" }));
      col("#6C8EBF");
      s.append(n("path", { d: "M42 74 L47 100 M58 74 L53 100", stroke: "#C8C8C8", "stroke-width": 2, fill: "none" }));
    } else if (t === "cardigan") {
      s.append(n("path", { d: epaules, fill: PULLS[(g + 2) % PULLS.length] }));
      col("#F4EBDD");
      s.append(n("path", { d: "M50 88 L50 110", stroke: "rgba(0,0,0,.25)", "stroke-width": 1.5 }));
      [94, 102].forEach((y) => s.append(n("circle", { cx: 50, cy: y, r: 1.4, fill: "rgba(0,0,0,.4)" })));
    } else if (t === "chemise") {
      s.append(n("path", { d: epaules, fill: ["#A9C9EE", "#E8D5B5", "#C9E4CA", "#F1C0B9"][g % 4] }));
      s.append(n("path", { d: "M42 74 L50 84 L58 74 L55 82 L50 86 L45 82 Z", fill: "rgba(255,255,255,.6)" }));
    } else if (t === "tablier") {
      s.append(n("path", { d: epaules, fill: "#6B7FA8" }));
      s.append(n("path", { d: "M36 80 L64 80 L66 110 L34 110 Z", fill: "#DCE3F0" }));
      s.append(n("path", { d: "M36 80 L44 74 M64 80 L56 74", stroke: "#DCE3F0", "stroke-width": 3 }));
    } else if (t === "sweat") {
      s.append(n("path", { d: "M24 84 Q22 66 34 62 L66 62 Q78 66 76 84 Z", fill: "#3B3F4E" }));
      s.append(n("path", { d: epaules, fill: "#4A4F63" }));
      s.append(n("path", { d: "M46 76 L45 92 M54 76 L55 92", stroke: "#DADADA", "stroke-width": 1.5 }));
    } else if (t === "sport") {
      s.append(n("path", { d: epaules, fill: ["#FF6B6B", "#4ECDC4", "#FFD93D", "#6BCB77"][g % 4] }));
      s.append(n("path", { d: "M42 75 Q50 82 58 75", stroke: "rgba(255,255,255,.7)", "stroke-width": 2.5, fill: "none" }));
      s.append(n("path", { d: "M20 96 L80 96", stroke: "rgba(255,255,255,.5)", "stroke-width": 3 }));
    } else if (t === "smartphone") {
      s.append(n("path", { d: epaules, fill: PULLS[(g + 2) % PULLS.length] }));
      s.append(n("path", { d: "M42 75 Q50 81 58 75", stroke: "rgba(0,0,0,.2)", "stroke-width": 3, fill: "none" }));
      s.append(n("rect", { x: 58, y: 86, width: 13, height: 22, rx: 2, fill: "#1E1E2E", stroke: "#9AA0B5", "stroke-width": 1 }));
      s.append(n("rect", { x: 60, y: 89, width: 9, height: 15, fill: "#8ECAE6" }));
      s.append(n("ellipse", { cx: 64, cy: 106, rx: 8, ry: 5, fill: peau }));
    } else {
      // pull
      s.append(n("path", { d: epaules, fill: PULLS[g % PULLS.length] }));
      s.append(n("path", { d: "M42 75 Q50 81 58 75", stroke: "rgba(0,0,0,.2)", "stroke-width": 3, fill: "none" }));
    }
  }

  return { svg };
})();
