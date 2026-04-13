# Frontend Zones

Ce frontend est organise par zones pour preparer une separation propre des trois parties produit sans toucher au backend.

## Zones

- `public-site/`: marketing, pages publiques, SEO, pages de vente et futurs packs.
- `client-dashboard/`: authentification client, dashboard tenant, catalogues, settings, messaging, tvstream et outils operateurs client.
- `admin-dashboard/`: dashboard interne global, supervision, users, tenants, settings admin.
- `shared/`: briques partagees entre plusieurs zones, par exemple branding commun.

## Regle de travail

- Tout nouveau travail sur la partie publique doit partir de `src/projects/public-site/`.
- Tout nouveau travail dashboard client doit partir de `src/projects/client-dashboard/`.
- Tout nouveau travail admin doit partir de `src/projects/admin-dashboard/`.
- Ce dossier ne separe pas encore les builds Next en multi-zones. Il separe d'abord le code source pour reduire le melange et preparer une evolution propre.
