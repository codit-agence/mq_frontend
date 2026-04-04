import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Définition des routes publiques
  const isAuthRoute = pathname.startsWith('/account');
  const isScreenRoute = pathname.startsWith('/screen');
  const isTvRoute = pathname.startsWith('/tv');

  const isHome = pathname === '/';

  const isPublicRoute = isAuthRoute || isScreenRoute || isTvRoute || isHome;

  // 3. LOGIQUE DE REDIRECTION
  
  // CAS A : L'utilisateur n'est PAS connecté et tente d'accéder à une zone privée (ex: /dashboard)
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/account/login', request.url));
  }

  // CAS B : L'utilisateur EST connecté et tente d'accéder aux pages de login/register
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Le matcher est correct, il exclut les fichiers statiques et l'API
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};