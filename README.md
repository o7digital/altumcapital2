# Altum Capital — Perspectiva

Site Astro statique, projet Vercel `altumcapital2` :
https://altumcapital2.vercel.app/. Travail sur `dev` ; la branche `backup` conserve
la maquette initiale au commit `87087ba`.

La homepage publiée est la référence visuelle et reste inchangée. Les 17 pages
internes utilisent des compositions éditoriales Astro dédiées et des composants
partagés : grands titres sans/italique, palette pierre/olive, photographies
immersives, chiffres clés, filets et espaces généreux. Menu React et footer sont
communs à tout le site.

## Développement

Node.js 26.x et npm.

```sh
npm ci
npm run assets
npm run dev
```

Ouvrir les previews explicitement dans Firefox.

## Structure et contenu

- `src/components/editorial/` : pages et composants éditoriaux.
- `src/layouts/EditorialLayout.astro` : layout partagé des pages internes.
- `src/styles/editorial.css` : styles des pages internes, isolés de la homepage.
- `src/data/editorial/content.ts` : informations institutionnelles sourcées.
- `src/data/editorial/prose.json` : textes des neuf articles et des deux documents,
  extraits en blocs sémantiques sans structure WordPress.
- `src/data/source-pages.json` : archive de référence du contenu du clone et des
  médias d’origine. `SourcePage.astro` reste utilisé uniquement par la homepage.

`npm run content:import` actualise l’archive source, pas les compositions.
`scripts/extract-editorial-prose.mjs` extrait les blocs de prose depuis les textes
sources vérifiés dans `src/data/imported.json`. Une actualisation éditoriale exige
une revue du contenu et des rendus ; elle ne doit pas importer une mise en page.

Voir `docs/EDITORIAL_REDESIGN.md` pour le déroulé de validation de `/about/`, la
protection de la homepage et les contrôles de conservation du contenu.

## Validation

```sh
npx playwright install firefox
npm run check
npm run build
npm test
```

Les tests vérifient les 18 routes, le contenu et les médias client, les liens,
les ancres, le menu et les cinq formats d’écran. Deux comparaisons PNG protègent
la homepage sur le Firefox macOS utilisé comme référence. Les versions de
Playwright et des polices sont figées par le lockfile ; un autre moteur de rendu
peut nécessiter une baseline visuelle revue.

Après publication : `PREVIEW_URL=https://altumcapital2.vercel.app npm test`.

## Déploiement

Vercel, build `npm run check && npm run build`, dossier `dist`. Déployer le projet
existant depuis `dev` avec le CLI Vercel. Ne pas modifier le projet source
`altumcapital`, ses DNS ou l’audience de la proposition.

Le site conserve `noindex,nofollow`. Aucun backend, CRM ni suivi analytique n’est
ajouté. Les coordonnées et documents financiers/réglementaires restent ceux de
la source client.
