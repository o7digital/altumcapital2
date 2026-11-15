# Altum Capital — Perspectiva

Site Astro statique, projet Vercel `altumcapital2` :
https://altumcapital2.vercel.app/. Travail sur `dev` ; la branche `backup` conserve
la maquette initiale au commit `87087ba`.

La palette pierre/olive et les typographies sans/italique de la homepage donnent
l’identité commune. Après la revue des captures du 15 novembre, Olivier a autorisé
la correction de ses proportions également : toutes les pages utilisent désormais
des compositions Astro explicites, des photographies proportionnées au contenu et
des paragraphes regroupés. Menu React et footer sont communs à tout le site.

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
- `src/styles/editorial.css` : rythme éditorial partagé.
- `src/styles/home.css` : entrée plein écran et chapitres de la homepage.
- `src/data/editorial/content.ts` : informations institutionnelles sourcées.
- `src/data/editorial/narrative.ts` : explications des usages du crédit et faits
  historiques reliés aux publications datées du client.
- `src/data/editorial/prose.json` : textes des neuf articles et des deux documents,
  extraits en blocs sémantiques sans structure WordPress.
- `src/data/source-pages.json` : archive de référence du contenu du clone et des
  médias d’origine. Aucune route active n’utilise `SourcePage.astro`.

`npm run content:import` actualise l’archive source, pas les compositions.
`scripts/extract-editorial-prose.mjs` extrait les blocs de prose depuis les textes
sources vérifiés dans `src/data/imported.json`. Une actualisation éditoriale exige
une revue du contenu et des rendus ; elle ne doit pas importer une mise en page.

Voir `docs/EDITORIAL_REDESIGN.md` pour le déroulé de validation de `/about/`, la
revue de densité et les contrôles de conservation du contenu.

## Validation

```sh
npx playwright install firefox
npm run check
npm run build
npm test
```

Les tests vérifient les 18 routes, le contenu et les médias client, les liens,
les ancres, le menu et les cinq formats d’écran. Ils contrôlent aussi les régressions
signalées : manque de texte, hauteur excessive des pages et citation Apollo trop
grande. Les captures intégrales sont revues séparément ; un compteur de mots ou un
build réussi ne valide pas la direction artistique. Les anciennes captures de la
homepage restent archivées dans `tests/reference/homepage.json`.

Après publication : `PREVIEW_URL=https://altumcapital2.vercel.app npm test`.

## Déploiement

Vercel, build `npm run check && npm run build`, dossier `dist`. Déployer le projet
existant depuis `dev` avec le CLI Vercel. Ne pas modifier le projet source
`altumcapital`, ses DNS ou l’audience de la proposition.

Le site conserve `noindex,nofollow`. Aucun backend, CRM ni suivi analytique n’est
ajouté. Les coordonnées et documents financiers/réglementaires restent ceux de
la source client.
