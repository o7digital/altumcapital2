# Altum Capital — Perspectiva V2

Site Astro statique utilisant le design Perspectiva V2 et le contenu récupéré sur
`https://altumcapital.vercel.app/`. La palette pierre, graphite et olive, les
photographies architecturales et la composition de la maquette sont conservées.
Le site comprend l’accueil, six pages de présentation, deux pages légales et neuf
actualités, avec les images de contenu servies localement.

Le travail se fait sur `dev`. La branche `backup` conserve la version V2 initiale
au commit `87087ba`, avant cette migration. Voir `docs/CONTENT_MIGRATION.md`.

## Développement

Node.js 26.x et npm sont requis.

```sh
npm ci
npm run assets
npm run dev
```

Ouvrir explicitement Firefox sur l’URL locale affichée par Astro, normalement
`http://127.0.0.1:4321`. Les photos sont versionnées ; `npm run assets` ne les
retélécharge que si elles manquent. Les images importées et les deux polices sont
également locales.

L’import reproductible du contenu se lance avec `npm run content:import` après
l’installation du navigateur Firefox de Playwright. Le contenu nettoyé est dans
`src/data/imported.json`, les informations de présentation dans `src/data/site.ts`.

## Vérification

```sh
npm run check
npm run build
npx playwright install firefox
npm test
```

Les tests Firefox couvrent les cinq tailles demandées, les photos, les liens
internes, le clavier du menu et des onglets MXN/USD, les deux intentions du
dialogue, la validation native, l’absence de requête de formulaire, la réduction
des animations et les contenus essentiels sans JavaScript. Ils vérifient aussi
les 18 routes, les liens internes, les médias, les neuf actualités, les mentions
légales et la mise en page des pages internes sur ordinateur et mobile.

Pour contrôler une URL déployée : `PREVIEW_URL=https://… npm test`.

## HTML autonome de la maquette d’origine

```sh
python3 scripts/make_preview.py
```

Le fichier produit dans `artifacts/AltumCapital_V2_Preview.html` est une copie
portable de la référence V2 initiale, avec les photos, les polices et son CSS
intégrés. Il sert d’archive visuelle et ne contient pas le contenu migré. Pour le
site actuel, utiliser `npm run build` puis servir `dist/`. L’export n’est pas
versionné ; la référence initiale reste dans `docs/reference/` et dans `backup`.

## Hébergement de la proposition

Vercel : framework Astro, commande `npm run check && npm run build`, dossier `dist`.
Créer/lier un projet de preview indépendant avec `vercel link`, puis `vercel --prod`.
Ne pas lier le projet existant `altumcapital`, changer les DNS ou remplacer le site
institutionnel. La branche de travail est `dev` et le projet cible est
`altumcapital2`, sur `https://altumcapital2.vercel.app/`.

## Périmètre

Cette proposition conserve `noindex,nofollow`, `robots.txt` et `X-Robots-Tag`.
Ces directives évitent l’indexation et ne constituent pas un contrôle d’accès.
Le formulaire prépare un lien `mailto:` ; aucun backend, stockage, CRM ou suivi
d’audience n’est activé. Le visiteur doit envoyer lui-même le message depuis son
application de courrier.

Les textes, coordonnées, chiffres, actualités et documents légaux proviennent du
site source demandé. Les dates des articles et la date historique de la politique
de confidentialité sont conservées. Voir `SOURCES.md` pour la provenance.
