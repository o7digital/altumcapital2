# Altum Capital — contenu source dans Perspectiva

Branche de travail : `dev`. Le site déployé est https://altumcapital2.vercel.app/.
La branche `backup` conserve le V2 initial au commit `87087ba`.

Le contenu vient directement de https://altumcapital.vercel.app/ : mêmes sections,
titres, paragraphes, photos, couvertures, logo, actualités et pied de page.
Les photographies de remplacement et les textes de la première adaptation ne sont
plus utilisés dans le site. La typographie et les espacements restent ceux du V2.

## Développement

Node.js 26.x et npm.

```sh
npm ci
npm run assets
npm run dev
```

Ouvrir l’URL affichée explicitement dans Firefox.

## Contenu et médias

`src/data/source-pages.json` contient les 18 pages extraites du site source après
chargement de ses styles, ainsi que les URL originales et les empreintes SHA-256
des 48 médias. Les fichiers sont versionnés dans `public/source-media/`.

`npm run content:import` refait l’extraction avec Firefox de Playwright. Les
paragraphes sont repris sans réécriture ; les images HTML et les arrière-plans CSS
sont importés. Le moteur ne reprend pas les scripts ni les formulaires WordPress.

## Validation

```sh
npx playwright install firefox
npm run check
npm run build
npm test
```

Les contrôles comparent le contenu et l’inventaire des photos de chaque page avec
la source, vérifient les 48 fichiers par SHA-256, les liens, le clavier du menu et
les cinq formats 1440×960, 1920×1080, 768×1024, 390×844 et 320×740.
Pour l’URL déployée : `PREVIEW_URL=https://altumcapital2.vercel.app npm test`.

## Déploiement

Projet Vercel existant `altumcapital2`, build `npm run check && npm run build`,
dossier `dist`. Déployer avec le CLI Vercel depuis `dev`. Le projet source
`altumcapital`, son hébergement et les DNS restent inchangés.

`noindex,nofollow` est conservé. Aucun backend, CRM ou suivi d’audience n’est ajouté.
Les liens de contact reprennent ceux de la source. Les liens vers les archives
WordPress datées non migrées restent dirigés vers le site source.
