/* =========================================================
   Savitri Yoga · Saint-Malo — CONTENU MODIFIABLE
   =========================================================

   👉 Ce fichier est le SEUL à modifier pour mettre à jour les
      HORAIRES et les LIEUX de cours. Aucune connaissance du code
      n'est nécessaire : on édite juste les listes ci-dessous.

   RÈGLES À RESPECTER (importantes) :
   • Le texte se met toujours entre "guillemets".
   • Chaque ligne { ... } se termine par une virgule.
   • Pour AJOUTER une entrée : copiez une ligne { ... } complète,
     collez-la en dessous, puis changez les valeurs.
   • Pour SUPPRIMER une entrée : effacez la ligne { ... } entière.
   • Dans le planning, le champ "lieu" doit reprendre EXACTEMENT
     un "id" défini dans la liste des lieux plus bas.

   Un exemple de "bon" et "mauvais" se trouve dans data/README.md.
   ========================================================= */

window.SAVITRI_DATA = {

  /* ─────────────────────────────────────────────
     1) LES LIEUX DE COURS
     - id      : identifiant court, sans espace ni accent (sert de lien
                 avec le planning et le filtre). Ex : "saint-coulomb".
     - nom     : nom affiché du lieu.
     - adresse : adresse affichée (utilisez \n pour un retour à la ligne).
     ───────────────────────────────────────────── */
  lieux: [
    {
      id: "saint-coulomb",
      nom: "Saint-Coulomb",
      adresse: "Salle du Complexe Sportif\nRue du Lac",
    },
    {
      id: "langrolay",
      nom: "Langrolay-sur-Rance",
      adresse: "Salle Annexe de la Mairie\nPlace François Barbu",
    },
    {
      id: "benoit",
      nom: "St-Benoît-des-Ondes",
      adresse: "Rue du bord de mer",
    },
    {
      id: "jouan",
      nom: "St-Jouan-des-Guérets",
      adresse: "Maison du Temps Libre\n33 Rue de Rennes",
    },
  ],

  /* ─────────────────────────────────────────────
     2) LE PLANNING HEBDOMADAIRE
     - jour    : ex "Lundi", "Mardi"...
     - horaire : ex "18h30 – 20h00".
     - cours   : ex "Hatha Yoga", "Yoga sur chaise", "Yoga Nidra".
     - lieu    : doit reprendre un "id" de la liste des lieux ci-dessus.
     ───────────────────────────────────────────── */
  planning: [
    { jour: "Lundi",    horaire: "18h30 – 20h00", cours: "Hatha Yoga",      lieu: "saint-coulomb" },
    { jour: "Mardi",    horaire: "10h45 – 11h45", cours: "Yoga sur chaise", lieu: "saint-coulomb" },
    { jour: "Mardi",    horaire: "18h30 – 20h00", cours: "Hatha Yoga",      lieu: "langrolay" },
    { jour: "Mercredi", horaire: "19h00 – 20h30", cours: "Hatha Yoga",      lieu: "benoit" },
    { jour: "Jeudi",    horaire: "18h30 – 20h00", cours: "Hatha Yoga",      lieu: "jouan" },
    { jour: "Vendredi", horaire: "09h30 – 10h45", cours: "Yoga Nidra",      lieu: "saint-coulomb" },
  ],

};
