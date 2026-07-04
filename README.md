# Savitri Yoga · Saint-Malo — reproduction améliorée

Reproduction locale, modernisée et enrichie du site
[savitriyoga-saintmalo.com](https://www.savitriyoga-saintmalo.com/), le studio de
yoga de **Corinne Montigny** dans la région de Saint-Malo (Hatha Yoga Sivananda,
yoga sur chaise, yoga nidra, yogathérapie et massages).

Le projet est un **site statique** (HTML / CSS / JavaScript, sans build ni
dépendances) : il suffit d'un navigateur pour le consulter.

---

## 🚀 Lancer le site en local

Le site est 100 % statique. Le plus simple est de le servir via un petit serveur
web local (recommandé pour que les polices, le JS et les icônes se chargent bien).

### Option 1 — Node.js (recommandée, déjà présent sur la machine)

```bash
# depuis le dossier du projet
npx serve -l 5500 .
```

Puis ouvrez **http://localhost:5500** dans votre navigateur.

### Option 2 — Python

```bash
python -m http.server 5500      # Python 3
```

Puis **http://localhost:5500**.

### Option 3 — Sans serveur

Vous pouvez aussi **double-cliquer sur `index.html`** pour l'ouvrir directement
dans le navigateur. Tout fonctionne, à l'exception éventuelle de quelques
navigateurs très stricts sur le protocole `file://` — d'où la recommandation
d'utiliser un serveur local.

> 💡 Avec l'extension Claude Code / VS Code, un fichier `.claude/launch.json` est
> déjà configuré (serveur `npx serve` sur le port 5500).

---

## 📁 Structure du projet

```
site_web/
├── index.html          # Page unique (single-page) avec toutes les sections
├── css/
│   └── styles.css      # Design system, responsive, mode clair/sombre
├── js/
│   └── main.js         # Interactivité (menu, thème, planning, respiration…)
├── assets/
│   └── favicon.svg     # Icône du site
├── .claude/
│   └── launch.json     # Config de prévisualisation locale
├── README.md           # Ce fichier
└── CLAUDE.md           # Notes techniques pour l'IA / les développeurs
```

---

## ✨ Ce qui a été amélioré par rapport au site original

### 1. Améliorations graphiques & responsive

- **Design entièrement repensé** : palette zen (sauge, terracotta, or, crème),
  typographie soignée (Cormorant Garamond + Nunito Sans), espacements généreux.
- **Mise en page moderne** : hero immersif avec formes organiques floutées,
  cartes, ombres douces, coins arrondis.
- **100 % responsive** : grilles fluides, menu hamburger sur mobile, et le
  tableau des horaires se transforme en cartes lisibles sur petit écran.
- **Mode sombre / clair** avec bascule mémorisée (respecte aussi la préférence
  système `prefers-color-scheme`).
- **Micro-animations** : apparition au défilement, barre de progression de
  lecture, effets au survol — le tout désactivé si l'utilisateur a activé
  `prefers-reduced-motion` (accessibilité).

### 2. Améliorations / choix techniques (features)

**Ajouté**, car pertinent pour un site de yoga :

- 🧘 **Widget de respiration guidée** interactif (3 rythmes : apaisant 4-7-8,
  carré 4-4-4-4, énergie 4-4) — un vrai plus « bien-être » directement utilisable.
- 🗓️ **Planning hebdomadaire filtrable** par lieu de cours.
- 🖼️ **Galerie avec lightbox** (illustrations SVG légères, sans images lourdes).
- ❓ **FAQ en accordéon** répondant aux questions fréquentes des débutants.
- ✅ **Formulaire de contact avec validation** côté client et message de
  confirmation (démo — voir la note ci-dessous).
- 🔝 Bouton « retour en haut », liens d'accès rapide, ancrage fluide.
- 🔎 **SEO & partage** : balises `meta description`, Open Graph, `lang="fr"`,
  structure sémantique et `favicon`.
- ♿ **Accessibilité** : lien d'évitement, contrastes, `aria-*`, navigation
  clavier (lightbox fermable avec `Échap`).

**Simplifié / retiré :**

- L'entrée de menu « Entreprises » qui, sur le site d'origine, pointait vers la
  page de contact : l'offre entreprise est désormais intégrée comme sujet du
  formulaire de contact.
- Passage d'un site **multi-pages** à une **single-page** fluide : navigation par
  ancres, chargement instantané, meilleure expérience mobile.

---

## ☁️ Déployer sur Netlify

Le site est **prêt pour Netlify** (hébergement gratuit, HTTPS automatique,
formulaire de contact fonctionnel). Aucune étape de build : Netlify publie les
fichiers tels quels (voir [`netlify.toml`](netlify.toml)).

### Mise en ligne (2 méthodes)

- **Glisser-déposer** : sur [app.netlify.com](https://app.netlify.com), déposer
  le dossier du projet dans la zone prévue. Le site est en ligne en quelques
  secondes. (Inconvénient : il faut re-déposer le dossier à chaque mise à jour.)
- **Via GitHub (recommandé)** : pousser le projet sur un dépôt GitHub, puis
  *Add new site → Import an existing project → GitHub*. Chaque modification
  poussée (y compris l'édition de `data/contenu.js` depuis github.com) **republie
  le site automatiquement**.

### Formulaire de contact (Netlify Forms)

Le formulaire est déjà câblé pour **Netlify Forms** :

- attribut `data-netlify="true"` + champ caché `form-name` sur le `<form>` ;
- champ piège anti-spam (`bot-field`, honeypot) ;
- envoi en **AJAX** (le visiteur reste sur la page, message de confirmation
  affiché) — voir le handler `submit` dans `js/main.js`.

Une fois le site déployé, les messages arrivent dans **Netlify → onglet Forms**.
Pour être prévenu par email : *Site settings → Forms → Form notifications →
Add notification → Email notification* (indiquer `corinnemontigny.yoga@gmail.com`).

> En local (hors Netlify), l'envoi est **simulé** : la validation s'exécute et le
> message de confirmation s'affiche, mais aucun email n'est transmis.

### Nom de domaine

Dans *Site settings → Domain management → Add a custom domain*, saisir
`www.savitriyoga-saintmalo.com`, puis soit :

1. **garder le domaine chez son registrar** : y créer un `CNAME` `www` →
   `<votre-site>.netlify.app` (et l'enregistrement `A`/redirection indiqué par
   Netlify pour le domaine racine) ;
2. **ou déléguer les DNS à Netlify** (« Netlify DNS ») : Netlify configure alors
   tout automatiquement (HTTPS, `www` ↔ racine).

> ⚠️ Si une **adresse email** est liée à ce domaine, conserver ses
> enregistrements `MX` lors de la bascule pour ne pas couper la réception des
> emails.

---

## ✏️ Modifier les horaires et les lieux (sans coder)

Les **horaires** et les **lieux de cours** se modifient dans un seul fichier,
sans toucher au reste du site :

```
data/contenu.js
```

On y édite deux listes (`lieux` et `planning`) ; le tableau des horaires, les
cartes de lieux et les boutons de filtre se régénèrent automatiquement. Un guide
pas-à-pas avec exemples « bon / mauvais » est fourni dans
[`data/README.md`](data/README.md).

---

## ⚠️ Notes importantes

- **Contenu** : les textes (yoga, nidra, yogathérapie, massages, tarifs) et les
  coordonnées (06 67 82 52 01 · corinnemontigny.yoga@gmail.com) proviennent du
  site original. Les **horaires du planning sont donnés à titre indicatif** — le
  site d'origine ne les publiait pas tous en clair.
- **Formulaire de contact** : câblé pour **Netlify Forms** (voir la section
  Déploiement). Il devient fonctionnel une fois le site déployé sur Netlify ;
  **en local, l'envoi est simulé** (validation OK + message de confirmation, mais
  aucun email transmis).
- **Images** : pour rester léger et sans dépendance externe, les visuels sont des
  **illustrations SVG** générées, et non les photos du studio.
- Ce projet est une **reproduction pédagogique** à des fins de démonstration.
