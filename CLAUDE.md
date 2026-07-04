# CLAUDE.md — notes pour l'agent IA / les développeurs

Ce fichier oriente toute personne (ou IA) qui reprend ce projet. Il décrit
l'architecture, les conventions et comment travailler efficacement dessus.

## Contexte

Site vitrine **statique** reproduisant, en le modernisant, le site du studio
**Savitri Yoga Saint-Malo** (Corinne Montigny). Objectifs fixés :
1. reproduire le contenu du site original ;
2. l'améliorer graphiquement et le rendre responsive ;
3. ajouter/retirer des fonctionnalités pertinentes pour la thématique yoga.

Aucun framework, aucun build, aucune dépendance npm au runtime. Tout tient en
trois fichiers : `index.html`, `css/styles.css`, `js/main.js`.

## Comment lancer

```bash
npx serve -l 5500 .      # ou: python -m http.server 5500
```
→ http://localhost:5500 . Le fichier `.claude/launch.json` définit ce serveur
pour la prévisualisation intégrée.

> ⚠️ Dans le panneau de preview intégré, l'onglet tourne en
> `document.visibilityState === "hidden"`. Conséquence : **les transitions CSS ne
> s'exécutent pas** (elles restent à leur valeur de départ) et `preview_screenshot`
> peut expirer. Ce n'est **pas un bug** — dans un vrai navigateur visible tout
> s'anime normalement. Pour vérifier, préférer `preview_eval`/`preview_inspect`
> (lire les classes, l'état du DOM, `localStorage`) plutôt que le screenshot.

## Architecture

- **`data/contenu.js`** — **contenu modifiable sans coder** : horaires (`planning`)
  et lieux (`lieux`) dans `window.SAVITRI_DATA`. C'est le seul fichier à éditer
  pour mettre à jour le planning. `main.js` génère à partir de ces données : le
  tableau des horaires, les cartes de lieux et les boutons de filtre (le champ
  `lieu` d'un cours doit correspondre à un `id` de lieu). Un guide destiné au
  mainteneur non-technique est fourni dans `data/README.md`. Format `.js` (et non
  `.json`) volontaire : fonctionne aussi en ouverture `file://` sans serveur.
  Le rendu est protégé par validation + `try/catch` : en cas de données mal
  formées, un message d'erreur s'affiche à la place du tableau.
- **`index.html`** — page unique, structurée en sections avec `id` servant
  d'ancres de navigation : `#accueil`, `#apropos`, `#cours`, `#services`,
  `#massages`, `#respiration`, `#tarifs`, `#galerie`, `#contact`.
- **`css/styles.css`** — un seul fichier, organisé en blocs commentés :
  - *Design tokens* : variables CSS dans `:root`, thème sombre via
    `[data-theme="dark"]`. **Toujours passer par les variables** (`--sage`,
    `--accent`, `--ink`, `--bg`, `--card`, `--line`, `--radius`, `--shadow`…)
    pour rester cohérent et compatible dark mode.
  - Composants (header, hero, sections, cartes, planning, respiration, tarifs,
    galerie, FAQ, contact, footer) puis **media queries** en fin de fichier
    (`900px`, `760px`, `420px`).
- **`js/main.js`** — un seul IIFE, vanilla JS, découpé en modules commentés :
  bascule de thème (persistée dans `localStorage` sous `savitri-theme`), menu
  mobile, header au scroll + barre de progression, apparition au défilement
  (IntersectionObserver + **filet de sécurité** qui révèle tout si l'observer
  n'a rien déclenché), filtre du planning, galerie/lightbox (SVG générés),
  validation du formulaire, widget de respiration.

## Conventions

- **Langue** : tout le contenu et les commentaires sont en **français**.
- **CSS** : mobile-first raisonnable, unités `clamp()` pour la fluidité, pas de
  `!important`. Nouvelles couleurs → ajouter un token, pas de valeur en dur.
- **JS** : vanilla, pas de dépendance. Helpers `$` / `$$` en tête de fichier.
  Toute nouvelle interaction va dans un bloc commenté dédié du même IIFE.
- **Accessibilité** : conserver les `aria-*`, le lien d'évitement, le focus
  clavier, et respecter `prefers-reduced-motion`.

## Déploiement (Netlify)

- Site statique **sans build** : `netlify.toml` définit `publish = "."` et une
  commande vide, + en-têtes de sécurité. Pas de cache agressif sur `js/`/`css/`
  (volontaire, pour que les màj de `data/contenu.js` soient vues tout de suite).
- **Formulaire = Netlify Forms** : `<form name="contact" data-netlify="true"
  netlify-honeypot="bot-field">` avec champ caché `form-name` et honeypot.
  L'envoi se fait en **AJAX** (`fetch("/", POST, x-www-form-urlencoded)`) dans le
  handler `submit` de `main.js` ; repli silencieux en local (l'endpoint n'existe
  pas hors Netlify → on affiche quand même la confirmation).
- ⚠️ Le `<form>` porte `name="contact"` : ne PAS lire les champs via `form.name`
  (renvoie "contact"). On lit par `id` (`#name`, `#email`, `#message`).
- Détection Netlify : le formulaire est en HTML statique dans `index.html` (pas
  injecté par JS), donc bien détecté au déploiement.

## Points d'attention / dette connue

- **Formulaire de contact** = fonctionnel via Netlify Forms une fois déployé ;
  en local l'envoi est simulé. Notifications email à configurer côté Netlify
  (Site settings → Forms → notifications).
- **Horaires du planning** = indicatifs (le site source ne les publiait pas tous).
  Seul « Yoga sur chaise, mardi 10h45 à Saint-Coulomb » est confirmé.
- **Visuels** = illustrations SVG générées, pas les vraies photos du studio.
- **Témoignages** = exemples illustratifs (à remplacer par de vrais avis).
- Coordonnées réelles issues du site source : `06 67 82 52 01`,
  `corinnemontigny.yoga@gmail.com`, Facebook « Savitri Yoga Saint-Malo ».

## Idées d'évolution

- Brancher le formulaire à un vrai service d'envoi d'email.
- Ajouter une carte (OpenStreetMap/Leaflet) des 4 lieux de cours.
- Intégrer un calendrier de réservation en ligne.
- Remplacer les SVG par les vraies photos + attributs `loading="lazy"`.
- Ajouter un fichier de mentions légales / politique de confidentialité (RGPD).
