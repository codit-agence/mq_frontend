import { NextRequest, NextResponse } from "next/server";

/**
 * Détecte la langue préférée du visiteur à partir du header Accept-Language.
 * Retourne "ar" si l'arabe est en tête, sinon "fr".
 */
function detectLocale(acceptLanguage: string | null): "fr" | "ar" {
  if (!acceptLanguage) return "fr";

  // Découpe chaque tag : "ar,fr-FR;q=0.9,en;q=0.8"
  const entries = acceptLanguage.split(",").map((part) => {
    const [tag, q] = part.trim().split(";q=");
    return { lang: tag.trim().toLowerCase(), q: q ? parseFloat(q) : 1.0 };
  });

  // Trie par priorité décroissante
  entries.sort((a, b) => b.q - a.q);

  // Cherche le premier tag FR ou AR
  for (const { lang } of entries) {
    if (lang.startsWith("ar")) return "ar";
    if (lang.startsWith("fr")) return "fr";
  }
  return "fr";
}

export const LOCALE_COOKIE = "qalyas-locale";

/** Ne pas exécuter la logique locale sur les assets / internals Next (évite 403 / blocages sur /__nextjs_font en dev). */
function isLocaleSkippedPath(pathname: string): boolean {
  if (pathname.startsWith("/__nextjs_font")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname === "/favicon.ico") return true;
  // Fichiers statiques typiques (icônes, polices servies depuis /public, etc.)
  if (/\.(ico|png|jpg|jpeg|gif|webp|svg|woff2?|ttf|eot)$/i.test(pathname)) return true;
  return false;
}

export function proxy(request: NextRequest) {
  if (isLocaleSkippedPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Si l'utilisateur a déjà un cookie de langue → on respecte son choix
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (existing === "fr" || existing === "ar") {
    return response;
  }

  // Sinon on détecte depuis le navigateur et on pose le cookie (1 an)
  const locale = detectLocale(request.headers.get("accept-language"));
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false, // lisible côté client pour le hook
  });

  return response;
}

// Exclure api, internals Next, polices overlay dev (__nextjs_font), favicon, espace compte.
export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|__nextjs_font|_nextjs_font|account/).*)",
  ],
};
