# QALYAS Frontend

Frontend Next.js pour qalyas.com.

Le projet couvre:

- site public marketing
- dashboard client
- espace admin interne
- TV, messaging et branding partage

## Developpement local

1. Installer les dependances:

```bash
npm install
```

2. Creer un fichier `.env.local` a partir de `.env.example`

3. Lancer le serveur:

```bash
npm run dev
```

## Variables publiques

Variables principales:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`

Variables optionnelles:

- `NEXT_PUBLIC_WS_URL`
- `NEXT_PUBLIC_BACKEND_URL`

En production Vercel pour qalyas.com, utilisez les valeurs documentees dans [DEPLOYMENT.md](./DEPLOYMENT.md).

## Verification avant push

```bash
npm run build
npm run test
```

## Deploiement Vercel

- Root Directory Vercel: `mq_fronend`
- Domaine canonique: `https://qalyas.com`
- Backend: serveur Contabo expose derriere un domaine HTTPS

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour la checklist complete.
