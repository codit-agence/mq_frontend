# Frontend Deployment

Ce frontend Next.js est pret pour un hebergement Vercel avec domaine public qalyas.com et backend separe sur un serveur Contabo.

## Valeurs cibles

- Frontend public: `https://qalyas.com`
- Backend API: `https://your-contabo-backend-domain/api`
- Backend media: `https://your-contabo-backend-domain`
- WebSocket: `wss://your-contabo-backend-domain`

Si vous placez un reverse proxy ou un sous-domaine propre devant Contabo, utilisez plutot un domaine de type `api.qalyas.com`.

## Variables Vercel

Definir au minimum dans `Project Settings > Environment Variables`:

- `NEXT_PUBLIC_SITE_URL=https://qalyas.com`
- `NEXT_PUBLIC_API_URL=https://your-contabo-backend-domain/api`

Variables optionnelles conseillees:

- `NEXT_PUBLIC_WS_URL=wss://your-contabo-backend-domain`
- `NEXT_PUBLIC_BACKEND_URL=https://your-contabo-backend-domain`

## Configuration Vercel

- Framework preset: `Next.js`
- Root Directory: `mq_fronend`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: automatique
- Production Domain: `qalyas.com`

Si vous connectez Vercel au repo racine `mq-front-saas`, le point critique est bien le `Root Directory = mq_fronend`.

## Domaine qalyas.com

- Ajouter `qalyas.com` dans le projet Vercel
- Ajouter `www.qalyas.com` seulement si vous voulez le rediriger vers le domaine canonique
- Garder `NEXT_PUBLIC_SITE_URL` identique au domaine canonique final pour le SEO, `robots.txt`, `sitemap.xml` et les metadata Next.js

## Backend Contabo

Le backend doit autoriser le frontend Vercel:

- `CORS_ALLOWED_ORIGINS=https://qalyas.com`
- `CSRF_TRUSTED_ORIGINS=https://qalyas.com`

Si vous utilisez aussi `www.qalyas.com`, ajoutez-le egalement dans les deux listes.

Le backend doit aussi exposer correctement:

- `/api/...`
- `/media/...`
- les endpoints WebSocket si vous utilisez chat, notifications ou TV

## Checklist Git avant push

- Ne pas versionner `.env.local`, `.env.production` ou secrets Vercel
- Verifier que le repo ne contient pas d'IP Contabo ou de credentials en dur
- Lancer `npm run build`
- Corriger les erreurs TypeScript avant le push

## Ce que le frontend fait deja

- URLs site/API/backend/socket centralisees via la config publique
- `metadataBase`, `robots.txt` et `sitemap.xml` bases sur `NEXT_PUBLIC_SITE_URL`
- Images backend `media/` autorisees via `next.config.ts`
- Fallback local conservé pour le developpement sans casser la prod
