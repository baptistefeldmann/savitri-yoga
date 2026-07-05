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
  `lieu` d'un cours doit correspondre à un `id` de lieu). Chaque carte de lieu est
  un lien `<a>` ouvrant **Google Maps** (nouvel onglet) sur `nom + adresse`. Un guide destiné au
  mainteneur non-technique est fourni dans `data/README.md`. Format `.js` (et non
  `.json`) volontaire : fonctionne aussi en ouverture `file://` sans serveur.
  Le rendu est protégé par validation + `try/catch` : en cas de données mal
  formées, un message d'erreur s'affiche à la place du tableau.
- **`index.html`** — page unique, structurée en sections avec `id` servant
  d'ancres de navigation : `#accueil`, `#apropos`, `#cours`, `#services`,
  `#massages`, `#respiration`, `#tarifs`, `#galerie`, `#contact`.
- **`assets/photos/`** — logos + photos. `logo_savitri_yoga.png` = logo fourni
  (fond crème opaque, source). Versions **détourées** (fond transparent) dérivées
  par script : `logo-savitri.png` = logo complet (icône + « Savitri Yoga » +
  tagline), rogné au plus près, utilisé dans l'en-tête (`.brand-logo`) ;
  `logo-mark.png` = icône lotus seule ; `favicon.png` = icône lotus carrée
  256×256, servie comme favicon (l'ancien `assets/favicon.svg` n'est plus
  référencé). `fond-meditation.jpg`
  est l'image de fond du hero (posée sous un voile `--hero-overlay` pour la
  lisibilité, clair/sombre). `galerie/nb-01..12.jpg` sont les 12 photos **noir
  et blanc** de la galerie (le tableau `photos` de `main.js` référence ces
  fichiers). Les textes de présentation des pratiques (yoga sur chaise, nidra,
  yogathérapie, massages) sont recopiés **verbatim** depuis le site source.
- **`css/styles.css`** — un seul fichier, organisé en blocs commentés :
  - *Design tokens* : variables CSS dans `:root`, thème sombre via
    `[data-theme="dark"]`. **Toujours passer par les variables** (`--sage`,
    `--accent`, `--ink`, `--bg`, `--card`, `--line`, `--radius`, `--shadow`…)
    pour rester cohérent et compatible dark mode. ⚠️ Palette **orangé / beige**
    calée sur le doré du logo (`#bd8937`) : `--sage` n'est plus vert mais un
    **ocre doré** (couleur secondaire), `--accent` est l'**orange** (boutons /
    liens), les fonds sont beiges. Les noms de tokens sont conservés.
  - Composants (header, hero, sections, cartes, planning, respiration, tarifs,
    galerie, FAQ, contact, footer) puis **media queries** en fin de fichier
    (`900px`, `760px`, `420px`).
- **`js/main.js`** — un seul IIFE, vanilla JS, découpé en modules commentés :
  bascule de thème (persistée dans `localStorage` sous `savitri-theme`), menu
  mobile, header au scroll + barre de progression, apparition au défilement
  (IntersectionObserver + **filet de sécurité** qui révèle tout si l'observer
  n'a rien déclenché), filtre du planning, galerie/lightbox (photos N&B,
  tableau `photos`), validation du formulaire, widget de respiration.

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
- **SEO** : URL canonique `https://www.savitriyoga-saintmalo.fr/`. Fichiers
  `robots.txt` + `sitemap.xml` à la racine (mettre à jour `<lastmod>` lors de
  changements majeurs) ; dans le `<head>` de `index.html` : balise canonical,
  Open Graph complet (`og:url`, `og:image`…), Twitter Card et données
  structurées JSON-LD `LocalBusiness` (téléphone, Facebook, les 4 lieux de
  cours avec adresses). ⚠️ Si un lieu change dans `data/contenu.js`, mettre
  aussi à jour le bloc JSON-LD.
- **Formulaire = Netlify Forms** : `<form name="contact" data-netlify="true"
  netlify-honeypot="bot-field">` avec champ caché `form-name` et honeypot.
  L'envoi se fait en **AJAX** (`fetch("/", POST, x-www-form-urlencoded)`) dans le
  handler `submit` de `main.js`. En **local** (`localhost`/`file://`) l'endpoint
  n'existe pas → l'envoi est **simulé** (confirmation affichée). En **ligne**, un
  échec réel n'est plus masqué : message d'erreur `#formError` + repli `mailto:`
  vers `corinnemontigny.yoga@gmail.com` (et `console.error`).
- ⚠️ Le `<form>` porte `name="contact"` : ne PAS lire les champs via `form.name`
  (renvoie "contact"). On lit par `id` (`#name`, `#email`, `#message`).
- Détection Netlify : le formulaire est en HTML statique dans `index.html` (pas
  injecté par JS), donc bien détecté au déploiement.

## Points d'attention / dette connue

- **Formulaire de contact** = fonctionnel via Netlify Forms une fois déployé ;
  en local l'envoi est simulé. Notifications email à configurer côté Netlify
  (Site settings → Forms → notifications).
- **Horaires du planning** (`data/contenu.js`) = repris du **planning officiel
  « Rentrée 2026 »** (image du site source, cours à partir du 07/09/2026). Les
  tarifs (`#tarifs`) et les massages (`#massages`, sans les bols tibétains, désormais
  supprimés) sont également alignés sur le site source.
- **Image de fond du hero** = `fond-meditation.jpg` en `background-attachment: fixed`
  (image statique, le texte défile dessus), sous un voile `--hero-overlay` léger.
- **Section « Le Yoga »** (`#apropos`) illustrée par `yoga-nidra.jpg` (image de la
  page Yoga Nidra du site source), classe `.about-photo`.
- **Formulaire d'inscription** = PDF `assets/formulaire-inscription.pdf` (repris du
  site source), proposé au téléchargement dans `#contact` (`.download-card`).
- **Section « Entreprises »** (`#entreprises`) = contenu **rédigé** (yoga en
  entreprise) : la page entreprise d'origine n'existe plus sur le site source (le
  menu y renvoie vers *contact*), donc texte à faire valider par la cliente.
- **Visuels** = image de fond du hero + galerie = vraies photos reprises du site
  source (`assets/photos/`). La galerie ne retient que les photos **noir et blanc**.
- **Avis** = vrais avis Google (5,0/5, 4 avis ; 3 avec texte : Sylvie M., Julien F.,
  Odile G.), récupérés via un agrégateur. Légendes de la galerie retirées (l'`alt`
  reste pour l'accessibilité).
- Coordonnées réelles issues du site source : `06 67 82 52 01`,
  `corinnemontigny.yoga@gmail.com`, Facebook « Savitri Yoga Saint-Malo ».

## Idées d'évolution

- Brancher le formulaire à un vrai service d'envoi d'email.
- Ajouter une carte (OpenStreetMap/Leaflet) des 4 lieux de cours.
- Intégrer un calendrier de réservation en ligne.
- Remplacer les SVG par les vraies photos + attributs `loading="lazy"`.
- Ajouter un fichier de mentions légales / politique de confidentialité (RGPD).
