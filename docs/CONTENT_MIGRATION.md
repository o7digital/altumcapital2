# Reprise fidèle du contenu source

Source : https://altumcapital.vercel.app/

Destination : https://altumcapital2.vercel.app/

Le travail est sur `dev`. `backup` reste au commit initial `87087ba`.

La première adaptation conservait les photographies architecturales de la maquette
et reformulait plusieurs titres. La correction remplace cette adaptation par une
extraction directe des 18 pages sources, y compris leurs arrière-plans CSS, leurs
photographies secondaires, le logo et le pied de page.

Le fichier `src/data/source-pages.json` conserve les sections dans l’ordre de la
source et sert de base au rendu Astro. Les textes ne sont ni résumés ni reformulés.
Les 48 médias sont copiés dans `public/source-media/` ; chaque fichier possède une
empreinte SHA-256 vérifiée par les tests. Les styles V2 règlent la typographie,
les espacements et l’adaptation aux écrans sans remplacer les images.

La navigation dessert les mêmes rubriques : Nuestra Firma, Soluciones de Crédito,
Equipo, Inversionistas, Noticias, Contacto, Legal. Les neuf articles et l’avis de
confidentialité sont également disponibles localement. Les liens d’archives datées
WordPress non migrées dirigent vers les pages originales.

Le site n’active aucun formulaire serveur, CRM ou suivi analytique. Les scripts et
formulaires WordPress sont filtrés. Le numéro visible CDMX est conservé ; son lien
corrige +51 en +52. Les compteurs utilisent les valeurs finales de la source.

Les contrôles vérifient les textes et photos page par page, l’identité des fichiers,
les liens, les cinq formats d’écran, le menu au clavier et l’accès sans JavaScript.
