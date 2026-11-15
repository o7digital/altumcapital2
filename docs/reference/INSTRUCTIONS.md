# Reprise Codex — ALTUM / PERSPECTIVA V2

## Objectif

Préserver la proposition visuelle V2 et produire une preview Astro réelle. Ne pas réutiliser la première maquette bleu nuit/doré. Ne pas remplacer cette composition par un template de cartes, ajouter des graphiques financiers factices, inventer des clients/partenaires ni uniformiser tous les blocs.

## Première exécution

1. Ouvrir `Altum_Perspectiva_V2.html` pour voir les sections et interactions prévues. La preview charge les photographies en ligne. Sans réseau, elle montre des compositions architecturales de secours ; ce n'est pas le rendu photo final.
2. `npm install` puis `npm run assets` pour télécharger les images déclarées dans `src/data/media.mjs`. Les sources sont documentées dans `SOURCES.md`.
3. `npm run check` puis `npm run build`. Résoudre les erreurs éventuelles sans changer la direction artistique. Le build Astro n'a pas été exécuté dans l'environnement ayant généré ces fichiers ; seuls la preview HTML et les fichiers JSX ont été contrôlés.
4. `npm run dev`, puis inspecter le rendu connecté à 1440 × 960, 1920 × 1080, 768 × 1024, 390 × 844 et 320 × 740.
5. `python3 scripts/make_preview.py` après téléchargement des photos pour réexporter un HTML avec visuels intégrés.

## Points visuels à préserver

- Une entrée plein écran avec un cadrage architectural photographique et un titre qui occupe réellement l'espace.
- L'alternance sans / italique sur le titre, pas un titre de template coincé dans une colonne de 550 px.
- Les proportions, espaces, filets fins et la palette pierre / graphite / olive.
- Le bloc « La firma » asymétrique, le grand module de montant MXN/USD et le chapitre investisseurs sombre.
- Les grands mots « PERSPECTIVA » et la conclusion typographique, sans animations envahissantes ni défilement détourné.
- L'absence de grilles de cartes à coins arrondis, de pastilles promotionnelles, de faux logos clients ou de données de performance inventées.

## Interactions à conserver

- Header React, navigation mobile au clavier, Escape et fermeture après sélection.
- CreditExplorer React : deux onglets, état cohérent entre montant, texte et zone géographique ; touches fléchées, Home et End.
- ContactPanel React : deux intentions, focus modal natif, champs requis, message explicite sur l'absence d'envoi côté serveur.
- Une version sans JavaScript qui conserve les contenus et les liens essentiels ; réduire les animations quand le système le demande.

## Contrôles avant présentation

Vérifier le cadrage et le contraste avec les PHOTOS chargées. Les captures de contrôle dans l'environnement d'origine utilisaient les visuels CSS de secours car le réseau était inaccessible. Tester images et polices sur Safari et Chrome si disponibles ; la validation visuelle connectée n'est pas à supposer acquise.

Vérifier absence de scroll horizontal, liens fonctionnels, titres non tronqués, contraste, lisibilité, galerie sans images cassées et comportement du formulaire. Le dialogue ne doit jamais afficher « envoyé » puisqu'aucun message n'est transmis par le site.

## Avant production, pas avant la présentation du design

Faire valider par Altum les chiffres, la fourchette de crédits, la marque, les mentions et les coordonnées. Aucun rendement promis. Le site actuel affiche des montants contradictoires selon les pages ; la maquette reprend les pages de produits et le signale.

Conserver `noindex,nofollow` tant que la preview est une proposition. Pour la production : domaine final, canonical, image OG, robots/sitemap, redirections depuis WordPress, identité Organization exacte, formulaire/CRM approuvé, consentement et mesure d'audience selon le périmètre convenu. Ne pas activer une collecte de données ou un envoi réel sans décision du propriétaire.

## Déploiement

Sortie statique Astro, commande `npm run build`, dossier `dist`. Peut être publiée sur un hébergement statique de preview. Ne pas remplacer le site public ni changer son DNS dans le cadre de cette proposition.
