/* Le Voyage de Noah – Chapitre 3
   Progression d'une mission : couloir des portes et scores des jeux.
   Les scores restent dans le navigateur de l'élève (rien n'est envoyé). */
const Progression = (() => {
  const MISSIONS = {
    mission1: {
      titre: "Mission 1 : La fiche piégée",
      etapes: [
        { cle: "jeu1", nom: "Le chatbot piégé", lien: "../jeu1/" },
        { cle: "jeu2", nom: "Fiable ou douteux ?", lien: "../jeu2/" },
        { cle: "jeu3", nom: "La fiche Pesquet", lien: "../jeu3/" },
        { cle: "jeu4", nom: "Piège ton binôme", lien: "../jeu4/" },
        { cle: "jeu5", nom: "L’enquête Fortnite", lien: "../jeu5/" },
        { cle: "bilan", nom: "Bilan", lien: "../bilan/" }
      ]
    }
  };

  function lire(mission) {
    try { return JSON.parse(localStorage.getItem("noah-ch3-" + mission)) || {}; } catch (e) { return {}; }
  }
  function enregistrer(mission, cle, resultat) {
    const donnees = lire(mission);
    const avant = donnees[cle];
    // On garde le meilleur résultat de l'élève
    if (!avant || resultat.points >= avant.points) donnees[cle] = resultat;
    try { localStorage.setItem("noah-ch3-" + mission, JSON.stringify(donnees)); } catch (e) { /* stockage indisponible */ }
  }
  function etoiles(points, total) {
    const ratio = points / total;
    return ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
  }
  function dessinerCouloir(conteneur, mission, cleActuelle) {
    const m = MISSIONS[mission];
    const faits = lire(mission);
    const ol = document.createElement("ol");
    m.etapes.forEach((e, i) => {
      const li = document.createElement("li");
      if (e.cle === cleActuelle) li.setAttribute("aria-current", "step");
      else if (faits[e.cle]) li.classList.add("ouverte");
      const etat = e.cle === cleActuelle ? " (tu es ici)" : faits[e.cle] ? " (porte ouverte)" : "";
      li.innerHTML = '<span class="num">' + (e.cle === "bilan" ? "Bilan" : "Jeu " + (i + 1)) + '</span><span class="nom">' + e.nom + "</span>";
      li.setAttribute("aria-label", (e.cle === "bilan" ? "Bilan" : "Jeu " + (i + 1) + " : " + e.nom) + etat);
      ol.append(li);
    });
    conteneur.innerHTML = "";
    conteneur.append(ol);
  }
  function suivant(mission, cle) {
    const etapes = MISSIONS[mission].etapes;
    const i = etapes.findIndex((e) => e.cle === cle);
    return etapes[i + 1];
  }
  return { lire, enregistrer, etoiles, dessinerCouloir, suivant };
})();
