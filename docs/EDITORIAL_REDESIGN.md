# Refonte homogène des pages internes

Référence : homepage publiée sur https://altumcapital2.vercel.app/ le 15 novembre
2026. Branche de travail : `dev`. La branche `backup` reste inchangée.

## Homepage protégée

Les captures desktop 1440×960 et mobile 390×844 de la version locale avant
modification étaient identiques à celles de la version publiée. Leurs empreintes
PNG sont conservées dans `tests/reference/homepage.json`. Les tests vérifient que
le rendu intégral reste identique après la refonte. Le contenu, les photographies,
la composition, la palette, le menu et le footer de la homepage ne sont pas refaits.

## Validation de /about/ avant généralisation

`/about/` a été conçue en premier puis contrôlée visuellement à 1440 et 390 px :
entrée typographique sans/italique, photographie panoramique, objectif en colonnes
asymétriques, diptyque photographique, chapitre de chiffres clés sur fond olive,
activité et différenciateurs en lignes éditoriales. Aucun débordement observé.
Les captures de la homepage sont restées identiques aux deux formats.

La même direction a ensuite été appliquée aux 16 autres pages internes.

## Architecture

- `EditorialLayout.astro` réutilise le menu React et le footer de `SiteLayout`.
- `Hero`, `Photo`, `SectionHead`, `Statistics`, `Principles` et `NewsRows` forment
  les composants éditoriaux partagés.
- Les pages firme, crédit, équipe, investisseurs et contact disposent chacune
  d’une composition Astro explicite adaptée à leur contenu.
- Les actualités ont une couverture, une signature datée, une colonne de lecture
  et des recommandations locales.
- Les documents légaux ont un sommaire ancré, des chapitres et une galerie de
  documents ouvrables en grand format.
- `editorial.css` est réservé à ces composants. Il ne modifie pas la homepage.
- Les révélations discrètes sont limitées aux pages internes, respectent la
  réduction des animations et laissent le contenu visible sans JavaScript.

Les pages internes n’utilisent plus `SourcePage`, ni les sections, colonnes,
widgets ou attributs de mise en page importés du WordPress. Le rendu historique de
la homepage est conservé séparément, conformément à l’exigence de préservation.

## Contenu conservé

Les informations institutionnelles proviennent de `source-pages.json`. Les
actualités et documents sont extraits en blocs de contenu sémantiques dans
`src/data/editorial/prose.json` : paragraphes, titres, listes, citations et liens
inline ; aucun conteneur ou style WordPress n’est injecté dans les pages internes.

Les chiffres clés, les textes financiers, les coordonnées, les dates des articles,
les textes réglementaires, les photographies et les documents sources sont
conservés. La mise en forme des milliers peut varier (15,300 au lieu de 15300),
avec la même valeur. Aucun montant ni rendement nouveau n’est calculé.
Les copies techniques de commentaires WordPress désactivés ne sont pas des
informations institutionnelles et ne sont pas ajoutées aux nouvelles actualités.

## Vérifications

`npm run check`, `npm run build` et `npm test` couvrent :

- les 18 routes et la conservation des textes institutionnels ;
- l’absence de structure WordPress dans le contenu des pages internes ;
- les médias et documents sources, avec contrôle SHA-256 des fichiers ;
- la homepage inchangée, pixel pour pixel à deux formats ;
- toutes les pages internes à 1440, 1920, 768, 390 et 320 px, avec captures ;
- les liens locaux, les ancres, le menu mobile au clavier et la rubrique active ;
- la visibilité du contenu sans JavaScript et avec réduction des animations.

Les contrôles de contenu et de médias sont distincts de la revue visuelle des
captures : aucun test de texte ne remplace cette revue.
