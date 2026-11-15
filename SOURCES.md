# Sources et statut du contenu

## Référence fournie

- `docs/reference/AltumCapital_V2_Preview.html` : composition, textes espagnols,
  chiffres (2014, six fonds, 450+ crédits), contacts, liens légaux, fourchettes MXN
  et USD, interactions et images.
- `docs/reference/INSTRUCTIONS.md` : consignes de reprise fournies avec la maquette.

Le document décrit ces informations comme provenant du site institutionnel et
signale des montants contradictoires selon ses pages. Elles n’ont pas fait l’objet
d’une nouvelle validation institutionnelle dans ce projet. Aucune promesse de
rendement n’est ajoutée. Les photos sont conceptuelles et ne représentent ni des
locaux, ni des actifs, ni des projets financés par Altum.

Les liens institutionnels `/aviso-de-privacidad/` et `/legal/` ont été conservés.
Lors du contrôle local, leur accès HTTPS a échoué avec une erreur de certificat
sur le domaine externe `altumcapital.mx`. Leur accessibilité reste à vérifier
côté site institutionnel ; aucune mention légale de remplacement n’est inventée.

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
