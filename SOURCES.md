# Sources et statut du contenu

## Contenu migré sur dev

Le contenu éditorial est désormais celui de https://altumcapital.vercel.app/,
récupéré à la demande du propriétaire le 14 novembre 2026. Les neuf articles et
les deux documents légaux sont stockés dans `src/data/imported.json`, avec leurs
URL source, dates et images. Les informations de présentation sont dans
`src/data/site.ts` et les offres dans `src/data/products.ts`.

Les adresses exactes des images importées et leurs chemins locaux sont dans
`src/data/imported.json` (`assets`). Les images architecturales de la maquette
restent conceptuelles. Le logo et le témoignage Apollo figurent sur la page
investisseurs source ; aucun nouveau partenaire n’est inventé.

Voir `docs/CONTENT_MIGRATION.md` pour les routes, les chiffres repris, le traitement
des montants MXN/USD et la sauvegarde `backup` de l’ancien site. Les mentions
légales sont maintenant accessibles localement, sans dépendre du certificat de
`altumcapital.mx`.

## Référence fournie

- `docs/reference/AltumCapital_V2_Preview.html` : composition, textes espagnols,
  chiffres (2014, six fonds, 450+ crédits), contacts, liens légaux, fourchettes MXN
  et USD, interactions et images.
- `docs/reference/INSTRUCTIONS.md` : consignes de reprise fournies avec la maquette.

La référence V2 initiale décrivait ces informations comme provenant du site institutionnel et
signale des montants contradictoires selon ses pages. Elles n’ont pas fait l’objet
d’une validation institutionnelle indépendante. Les chiffres actuels sont repris
de la source Vercel demandée. Aucune promesse de rendement n’est ajoutée.
Les photos architecturales sont conceptuelles et ne représentent ni des
locaux, ni des actifs, ni des projets financés par Altum.

La version initiale pointait vers `altumcapital.mx`, dont le certificat échouait
au contrôle local. La migration utilise les textes et documents de la copie
Vercel fournie, sur les pages locales `/aviso-de-privacidad/` et `/legal/`.

## Photographies

Les URL exactes, tailles et destinations locales sont dans `src/data/media.mjs`.
Les images proviennent de la maquette fournie, via Unsplash :

| Usage | Source |
| --- | --- |
| Entrée architecturale | https://images.unsplash.com/photo-1486406146926-c627a92ad1ab |
| La firma | https://images.unsplash.com/photo-1487958449943-2429e8be8625 |
| Chapitre investisseurs | https://images.unsplash.com/photo-1497366216548-37526070297c |

Conditions de référence : https://unsplash.com/license. Confirmer les droits et
l’adéquation éditoriale des médias avant le lancement institutionnel.

## Typographie

- Inter Variable : `@fontsource-variable/inter`.
- Bodoni Moda Variable, italique : `@fontsource-variable/bodoni-moda`.

Les fichiers WOFF2 sont inclus par Vite à la compilation, sans appel à Google
Fonts. Les deux familles sont sous SIL Open Font License 1.1 ; les textes des
licences sont inclus dans `public/licenses/`.
