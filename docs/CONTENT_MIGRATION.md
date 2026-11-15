# Migration du contenu dans Perspectiva V2

Source demandée : https://altumcapital.vercel.app/

Destination : https://altumcapital2.vercel.app/
Date de récupération : 14 novembre 2026 (America/Mexico_City).

## Branches

- `backup` : état initial du site V2, commit `87087ba4307824267d7de12c1c09db887beee643`, sauvegardé sur GitHub avant les modifications.
- `dev` : migration du contenu et déploiement sur le projet Vercel `altumcapital2`.
- `feat/perspectiva-v2` : ancienne branche, laissée à son état précédent.

## Correspondance

Les routes sont conservées : chaque `/chemin/index.html` de la source possède
une page statique locale `/chemin/` et son fichier `index.html` dans `dist/`.

| Source | Intégration |
| --- | --- |
| `/` | Entrée, financement MXN/USD, présentation, trois actualités, contact et avis institutionnel |
| `/about/` | Présentation, objectif, sept compteurs, quatre différenciateurs |
| `/soluciones-de-credito/` | Pesos/dollars et six usages des crédits |
| `/equipo/` | Présentation de l’équipe, +40 personnes, +180 années d’expérience et photographie source |
| `/inversionistas/` | Socios estratégicos, témoignage et logo Apollo, texte historique et lien BIVA |
| `/blog/` | Les neuf actualités, avec leurs images et liens locaux |
| Neuf routes d’articles | Textes complets, dates, auteurs et liens éditoriaux |
| `/contact/` | Deux bureaux, deux téléphones, email et avis institutionnel |
| `/legal/` | Texte source, coordonnées UNE/CONDUSEF et dix visuels documentaires |
| `/aviso-de-privacidad/` | Texte source, y compris sa date du 15 juillet 2016 |

Le design V2 reste la base : photographies architecturales, grands titres sans /
italique, palette pierre / graphite / olive, chapitre sombre et filets fins.
Les pages internes et les lignes d’actualités prolongent cette composition.

## Choix de reprise

- Le montant MXN affiché est **75–500 millions**, tel qu’indiqué sur l’accueil de
  la source. Les montants datés des articles restent dans ces articles.
- La page source consacrée aux dollars ne donne pas de fourchette chiffrée : la
  fourchette 5–20 de l’ancienne maquette est retirée, ainsi que le délai 3–5 ans.
- Les compteurs d’`about` utilisent les valeurs `data-to-value` du HTML source,
  et non les zéros du compteur avant animation : 10, 6, 40, 15 300, 450, 50, 110.
- Le texte de rendement historique de la page investisseurs est conservé comme
  information historique, avec une mention indiquant qu’il ne garantit pas les
  rendements futurs. Aucun nouveau rendement n’est calculé ou promis.
- Le numéro CDMX utilise `tel:+525567211031`, conformément au numéro visible
  +52 de la source ; son ancien lien `tel:+515567211031` était incohérent.
- Les liens légaux passent vers les pages locales, dont le contenu provient de la
  copie Vercel demandée. Leur texte n’a pas été réécrit comme un nouvel avis.
- Les liens sociaux dépourvus de destination dans la source ne sont pas ajoutés.
  Les liens YouTube et Instagram existants sont conservés.

## Import et limites de périmètre

`scripts/import-content.mjs` extrait les neuf articles et les deux documents
légaux, télécharge leurs images ainsi que les images équipe/Apollo, et produit
`src/data/imported.json`. Il filtre scripts, styles, iframes et formulaires
WordPress. Les informations de présentation sont reprises dans `src/data/site.ts`
et les offres dans `src/data/products.ts`.

Les archives techniques WordPress (auteur, catégorie, calendrier) et les
commentaires désactivés ne sont pas reproduits. Le formulaire conserve le flux
`mailto:` du V2, sans backend, stockage ni collecte analytique. Le site source,
les DNS et les autres projets Vercel restent inchangés. `noindex,nofollow` reste
activé sur toutes les pages de la proposition.
