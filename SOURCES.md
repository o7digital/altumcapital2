# Source du contenu et des photographies

Source demandée : https://altumcapital.vercel.app/.
Destination : https://altumcapital2.vercel.app/.

`src/data/source-pages.json` conserve, pour chacune des 18 pages, l’URL originale,
les sections, le texte relevé et les images attendues. L’extraction charge les CSS
avant d’inspecter les arrière-plans : cela inclut les photos de couverture qui
manquaient dans la première adaptation.

Les 48 médias originaux sont dans `public/source-media/`, avec les chemins de la
source. Leurs empreintes SHA-256 permettent de contrôler que les fichiers publiés
sont identiques aux fichiers récupérés. Le logo est également celui de la source.
Aucune photo de remplacement n’est utilisée dans les pages actives.

Les actualités et les documents légaux conservent le texte et les dates de la
source. Les compteurs utilisent leurs valeurs finales `data-to-value`, en évitant
les zéros affichés avant animation. Les liens locaux sont réécrits pour les pages
migrées ; les archives techniques WordPress restent des liens vers la source.
Le lien téléphonique CDMX reprend +52, conformément au numéro visible de la source.

La typographie Inter et Bodoni Moda du V2 reste servie localement via Fontsource.
Les licences SIL Open Font License 1.1 sont dans `public/licenses/`.

La maquette initiale et ses instructions restent archivées dans `docs/reference/`
et sur la branche `backup`. Elles ne constituent plus la source éditoriale du site.

Depuis la refonte éditoriale du 15 novembre 2026, cette archive sert de référence
pour la conservation du contenu. Les pages internes ne réutilisent plus ses
structures HTML ni ses mises en page : voir `docs/EDITORIAL_REDESIGN.md`.
La palette et les typographies de la homepage restent la référence visuelle.
Après les captures signalées par Olivier, celui-ci a expressément autorisé la
correction des proportions et des grands vides de la homepage également.
Les synthèses historiques de `narrative.ts` renvoient aux publications du clone
sur les dix ans de la firme (2024), la troisième émission BIVA (2024) et le prêt
vert NADBank (2025). Les six descriptions de solutions expliquent les usages
déjà énumérés par le client sans introduire de nouvelles conditions de crédit.
Les extraits des trois actualités principales sont rédigés en phrases complètes,
avec leur date, au lieu de fragments interrompus automatiquement.
