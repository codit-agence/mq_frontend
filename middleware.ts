import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Correction 1 : Utilisation sécurisée du cookie
  const cookie = request.cookies.get('access_token');
  const token = cookie ? cookie.value : null;
  
  const { pathname } = request.nextUrl;

  // 1. Définition des routes publiques
  const isAuthRoute = pathname.startsWith('/account');
  const isScreenRoute = pathname.startsWith('/screen');
  const isTvRoute = pathname.startsWith('/tv');
  const isHome = pathname === '/';

  const isPublicRoute = isAuthRoute || isScreenRoute || isTvRoute || isHome;

  // 3. LOGIQUE DE REDIRECTION
  
  // CAS A : Pas de token + route privée -> Login
  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/account/login', request.url);
    // Optionnel: ajouter l'URL actuelle en paramètre pour rediriger après login
    // loginUrl.searchParams.set('from', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // CAS B : Token présent + page login -> Dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Matcher optimisé pour éviter d'intercepter les fichiers système
  matcher: [
    /*
     * Match toutes les routes sauf :
     * 1. api (API routes)
     * 2. _next/static (fichiers statiques)
     * 3. _next/image (optimisation d'images)
     * 4. favicon.ico (icône du navigateur)
     * 5. fichiers avec extensions (ex: .png, .svg)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};