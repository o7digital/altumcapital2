# Refonte éditoriale et correction de densité

Branche : `dev`. La branche `backup` reste au commit `87087ba`.

## Retour d’Olivier sur les captures du 15 novembre 2026

Les captures placées sur son Bureau montrent trop de photos et de titres par
rapport aux paragraphes, des espaces sans fonction éditoriale et une citation
Apollo trop grande. Le succès des contrôles techniques précédents ne constituait
pas une validation de ce résultat. Olivier a ensuite explicitement autorisé la
correction de la homepage également, en gardant ses couleurs et typographies.
L’ancienne obligation de comparaison intégrale pixel pour pixel est donc remplacée
par la conservation de l’identité et la revue des nouvelles compositions.

## Correction

- `/about/` a été reprise et revue sur Firefox à 1440 et 390 px avant l’extension
  aux autres pages. Les textes côtoient les photographies dans une même section.
- Les grands titres restent réservés aux entrées. Les intertitres et paragraphes
  ont des tailles de lecture ; les photos ont des dimensions bornées.
- Les chiffres sont rassemblés sur une seule composition compacte.
- La homepage a un composant Astro natif : entrée photographique plein écran,
  activité et objectif, faits clés, solutions en pesos/dollars, investisseurs et
  trois actualités. Les motifs décoratifs hérités du WordPress ne sont pas repris.
- Les six usages du crédit ont chacun un texte explicatif, sans nouvelles
  conditions, promesses ou critères d’éligibilité.
- Le chapitre « Socio Estratégico » présente réellement les quatre facteurs
  différenciants, au lieu d’une phrase seule et d’un renvoi vers une autre page.
- L’équipe rassemble les informations de capital humain, les deux statistiques,
  l’origine de la firme et ses priorités clients/investisseurs.
- La page investisseurs rapproche présentation, historique et documents BIVA ;
  la citation Apollo est ramenée à une taille de lecture. Les opérations reprises
  dans sa chronologie sont datées et reliées aux publications originales.
- Les textes mobiles restent à 16 px pour la lecture institutionnelle et juridique.

## Origine des contenus

`source-pages.json` est l’archive du clone. `content.ts` sélectionne les paragraphes
originaux ; `prose.json` contient intégralement les neuf articles et les deux textes
légaux sous forme sémantique. `narrative.ts` contient les explications des six usages,
ainsi que les synthèses des publications datées du client. Les synthèses ne
transforment pas des montants historiques en chiffres courants.

Toutes les routes actives sont composées explicitement dans Astro. Aucune ne
utilise `SourcePage.astro`, ni ses colonnes et widgets importés. Le menu React et le
footer restent partagés. Les médias et documents sources ne sont pas remplacés.

## Vérifications

`npm run check`, `npm run build`, puis `npm test` :

- conservation des textes, images, données financières et documents sur 18 routes ;
- absence de structures de contenu WordPress dans toutes les routes ;
- vérification des empreintes des 48 médias d’origine ;
- cohérence des liens, des ancres, du menu et de sa navigation clavier ;
- absence de débordements et captures desktop/mobile à cinq largeurs, homepage
  incluse (1440, 1920, 768, 390 et 320 px) ;
- contrôle spécifique des pages excessivement hautes avec très peu de mots,
  de la taille de la citation Apollo et du contenu explicatif des solutions ;
- disponibilité du contenu sans JavaScript.

Les captures sont inspectées séparément. Les bornes de hauteur et de quantité de
texte protègent contre la régression signalée, mais ne remplacent pas cette revue.
Les captures de la correction sont dans `artifacts/density-review/` et les captures
de la suite de tests dans `test-results/` (dossiers de contrôle non versionnés).
