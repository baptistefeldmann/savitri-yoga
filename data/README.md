# Modifier les horaires et les lieux de cours

Tout le contenu des **horaires** et des **lieux** se trouve dans un seul fichier :

```
data/contenu.js
```

Ouvrez-le avec un éditeur de texte (Bloc-notes, VS Code, TextEdit…), modifiez,
enregistrez, puis rafraîchissez la page du site. **C'est tout.**

Vous n'avez jamais besoin de toucher aux autres fichiers.

---

## Les 5 règles d'or

1. Le texte se met **toujours entre `"guillemets droits"`** (pas « ni », ni « ").
2. Chaque bloc `{ ... }` se termine par une **virgule**.
3. Pour **ajouter** : copiez un bloc `{ ... }` entier, collez-le en dessous,
   changez les valeurs.
4. Pour **supprimer** : effacez le bloc `{ ... }` en entier (avec sa virgule).
5. Dans le planning, le champ **`lieu`** doit reprendre **exactement** un `id`
   défini dans la liste des lieux.

---

## Exemple : ajouter un horaire

Je veux ajouter un cours le **samedi matin à Saint-Coulomb**. Dans la partie
`planning`, je copie une ligne existante et je la modifie :

```js
  planning: [
    { jour: "Lundi", horaire: "18h30 – 20h00", cours: "Hatha Yoga", lieu: "saint-coulomb" },

    { jour: "Samedi", horaire: "10h00 – 11h30", cours: "Hatha Yoga", lieu: "saint-coulomb" },  // ← ligne ajoutée

  ],
```

## Exemple : ajouter un lieu

Dans la partie `lieux`, j'ajoute un bloc. Je choisis un `id` court, **sans
espace ni accent** :

```js
  lieux: [
    { id: "saint-coulomb", nom: "Saint-Coulomb", adresse: "Salle du Complexe Sportif\nRue du Lac" },

    { id: "dinard", nom: "Dinard", adresse: "Salle des fêtes\n2 rue de la Plage" },  // ← lieu ajouté

  ],
```

Le nouveau lieu apparaît **automatiquement** comme carte ET comme bouton de
filtre. Je peux ensuite l'utiliser dans le planning avec `lieu: "dinard"`.

> 💡 `\n` (barre oblique inversée + n) crée un retour à la ligne dans l'adresse.

---

## ✅ Bon / ❌ Mauvais

| ❌ Mauvais | Pourquoi | ✅ Bon |
|-----------|----------|--------|
| `jour: Lundi` | Guillemets manquants | `jour: "Lundi"` |
| `jour: "Lundi"` (sans virgule à la fin de la ligne) | Virgule oubliée | `jour: "Lundi",` |
| `lieu: "st coulomb"` alors que l'id est `saint-coulomb` | Le `lieu` ne correspond à aucun `id` | `lieu: "saint-coulomb"` |
| `id: "Saint Coulomb"` | Espace/accent dans un id | `id: "saint-coulomb"` |

---

## En cas de problème

Si le fichier contient une faute (guillemet ou virgule oublié·e), le site
affiche un **message d'avertissement** à la place du tableau des horaires plutôt
qu'une page cassée. Il suffit alors de relire la dernière modification :
c'est presque toujours une **virgule** ou un **guillemet** manquant.

Pour un contrôle plus précis, ouvrez la page dans un navigateur, faites un
clic droit → « Inspecter » → onglet « Console » : le message d'erreur y indique
la nature du souci.
