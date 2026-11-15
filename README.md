# Altum Capital — Perspectiva V2

Preview Astro statique reconstruite à partir du HTML et des consignes fournis.
La composition pierre, graphite et olive, les textes et les photographies de la
maquette sont conservés. Les sources originales sont dans `docs/reference/`.

## Développement

Node.js ≥ 22.23.4 et npm sont requis.

```sh
npm ci
npm run assets
npm run dev
```

Ouvrir explicitement Firefox sur l’URL locale affichée par Astro, normalement
`http://127.0.0.1:4321`. Les photos sont versionnées ; `npm run assets` ne les
retélécharge que si elles manquent. Les deux polices sont servies localement.

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
des animations et les contenus essentiels sans JavaScript.

Pour contrôler une URL déployée : `PREVIEW_URL=https://… npm test`.

## HTML autonome

```sh
python3 scripts/make_preview.py
```

Le fichier produit dans `artifacts/AltumCapital_V2_Preview.html` est une copie
portable de la référence HTML, avec les photos, les polices et le CSS actuel
intégrés. Il conserve le JavaScript original ; les composants React sont ceux du
site Astro. L’export n’est pas versionné.

## Hébergement de la proposition

Vercel : framework Astro, commande `npm run check && npm run build`, dossier `dist`.
Créer/lier un projet de preview indépendant avec `vercel link`, puis `vercel --prod`.
Ne pas lier le projet existant `altumcapital`, changer les DNS ou remplacer le site
institutionnel. La branche de travail est `feat/perspectiva-v2`.

## Périmètre

Cette proposition conserve `noindex,nofollow`, `robots.txt` et `X-Robots-Tag`.
Ces directives évitent l’indexation et ne constituent pas un contrôle d’accès.
Le formulaire prépare un lien `mailto:` ; aucun backend, stockage, CRM ou suivi
d’audience n’est activé. Le visiteur doit envoyer lui-même le message depuis son
application de courrier.

Les coordonnées, chiffres, fourchettes, mentions et la marque proviennent du
document fourni et restent à faire valider par Altum avant un lancement public.
Voir `SOURCES.md` pour les médias et les réserves sur le contenu.
