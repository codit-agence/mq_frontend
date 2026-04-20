/** Base URL du front (liens absolus, emails). */
const DEFAULT_SITE_URL = "http://localhost:3000";
/** Racine Ninja Django : `path("api/", api.urls)` — toujours `{origin}/api` (un seul segment). */
const DEFAULT_API_URL = "http://localhost:8000/api";
const NINJA_API_PATH = "/api";

/** Hôtes typiques Docker / K8s : inaccessibles depuis le navigateur si utilisés dans NEXT_PUBLIC_* */
const BROWSER_BLOCKED_HOSTNAMES = new Set([
  "backend",
  "django",
  "web",
  "api",
  "app",
  "mq-back",
  "mq_back",
  "mq-backend",
]);

function trimTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function safeUrl(value: string, fallback: string) {
  try {
    return new URL(value).toString();
  } catch {
    return fallback;
  }
}

function deriveOrigin(value: string, fallback: string) {
  try {
    return trimTrailingSlash(new URL(value).origin);
  } catch {
    return fallback;
  }
}

function deriveWebsocketOrigin(value: string, fallback: string) {
  try {
    const url = new URL(value);

    if (url.protocol === "https:") {
      url.protocol = "wss:";
    } else if (url.protocol === "http:") {
      url.protocol = "ws:";
    } else if (url.protocol !== "ws:" && url.protocol !== "wss:") {
      return fallback;
    }

    url.pathname = "";
    url.search = "";
    url.hash = "";
    return trimTrailingSlash(url.origin);
  } catch {
    return fallback;
  }
}

/**
 * Ajoute http:// si l’utilisateur a collé `localhost:8000/api` (sans schéma).
 */
function withHttpSchemeIfMissing(value: string): string {
  const v = value.trim();
  if (!v || /^https?:\/\//i.test(v)) {
    return v;
  }
  if (v.startsWith("//")) {
    return `http:${v}`;
  }
  if (v.startsWith("[")) {
    return `http://${v}`;
  }
  if (
    /^[a-z0-9_.-]+(:\d+)?(\/|$)/i.test(v) ||
    /^\d{1,3}(\.\d{1,3}){3}(:\d+)?(\/|$)/.test(v)
  ) {
    return `http://${v}`;
  }
  return v;
}

/**
 * Force l’URL publique vers la racine Ninja unique : `{origin}/api`.
 * - `http://host` → `http://host/api`
 * - `http://host/api/api` → `http://host/api`
 * - `http://host/api/openapi.json` → `http://host/api` (collage d’URL complète)
 */
function normalizeToNinjaApiRoot(resolvedAbsoluteUrl: string): string {
  let parsed: URL;
  try {
    parsed = new URL(resolvedAbsoluteUrl);
  } catch {
    return trimTrailingSlash(DEFAULT_API_URL);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return trimTrailingSlash(DEFAULT_API_URL);
  }

  let path = parsed.pathname.replace(/\/+$/, "") || "/";
  while (path.includes("/api/api")) {
    path = path.replace("/api/api", "/api");
  }

  if (path === "/" || path === "") {
    path = NINJA_API_PATH;
  } else if (path === NINJA_API_PATH) {
    /* ok */
  } else if (path.startsWith(`${NINJA_API_PATH}/`)) {
    path = NINJA_API_PATH;
  } else {
    path = NINJA_API_PATH;
  }

  parsed.pathname = path;
  parsed.search = "";
  parsed.hash = "";
  return trimTrailingSlash(parsed.toString());
}

function warnIfBrowserCannotReachApi(u: URL, rawEnv: string) {
  if (process.env.NODE_ENV === "production") {
    return;
  }
  const h = u.hostname.toLowerCase();
  if (BROWSER_BLOCKED_HOSTNAMES.has(h)) {
    console.warn(
      `[public-env] NEXT_PUBLIC_API_URL="${rawEnv || "(absent)"}" → hôte « ${h} ». ` +
        "Depuis le navigateur, utilisez l’URL publiée du backend (ex. http://localhost:8000/api), " +
        "pas le nom de service Docker.",
    );
  }
  if (
    h !== "host.docker.internal" &&
    (h.endsWith(".internal") || h.endsWith(".svc.cluster.local"))
  ) {
    console.warn(
      `[public-env] NEXT_PUBLIC_API_URL semble interne (${h}). ` +
        "Le client navigateur ne pourra pas l’atteindre.",
    );
  }
}

export function getSiteUrl() {
  return trimTrailingSlash(
    safeUrl(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL, DEFAULT_SITE_URL),
  );
}

/**
 * Base URL pour axios : toujours `{origin}/api` (Django Ninja).
 *
 * - `NEXT_PUBLIC_API_URL` vide → défaut local.
 * - Hôte seul (`http://127.0.0.1:8000`) → ajout de `/api`.
 * - Doublons (`.../api/api`) → normalisés.
 * - Suffixe (`.../api/docs`, `.../api/openapi.json`) → tronqué à `.../api`.
 * - Schéma absent (`localhost:8000/api`) → préfixe `http://`.
 *
 * Docker : dans le **navigateur**, définir l’URL du host (port mappé), ex. `http://localhost:8000/api`,
 * pas `http://backend:8000/api`.
 */
export function getApiBaseUrl() {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "").trim();
  const preliminary = raw
    ? trimTrailingSlash(safeUrl(withHttpSchemeIfMissing(raw), DEFAULT_API_URL))
    : trimTrailingSlash(DEFAULT_API_URL);

  const normalized = normalizeToNinjaApiRoot(preliminary);

  try {
    warnIfBrowserCannotReachApi(new URL(normalized), raw);
  } catch {
    /* ignore */
  }

  return normalized;
}

/**
 * Base URL Ninja pour les `fetch()` **côté serveur Next.js** (SSR, Route Handlers).
 *
 * Dans Docker, `NEXT_PUBLIC_API_URL` vaut souvent `http://localhost:8000/api` pour le
 * navigateur hôte, mais **depuis le conteneur front**, `localhost` n’est pas Django.
 * Définir alors `API_URL_INTERNAL=http://web:8000/api` (nom du service compose du backend).
 */
export function getServerApiBaseUrl(): string {
  const raw =
    process.env.API_URL_INTERNAL?.trim() ||
    process.env.INTERNAL_API_URL?.trim() ||
    "";
  if (raw) {
    const preliminary = trimTrailingSlash(
      safeUrl(withHttpSchemeIfMissing(raw), DEFAULT_API_URL),
    );
    return normalizeToNinjaApiRoot(preliminary);
  }
  return getApiBaseUrl();
}

const LOOPBACK_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]"]);

function isLoopbackHost(hostname: string) {
  return LOOPBACK_HOSTNAMES.has(hostname.toLowerCase());
}

/**
 * Base URL réellement utilisée par axios (navigateur vs SSR).
 *
 * Si `NEXT_PUBLIC_API_URL` pointe vers **localhost / 127.0.0.1** mais que la page est
 * ouverte sur une autre origine (ex. `http://192.168.1.10:3000`), le navigateur tente
 * quand même `http://localhost:3000/api` → **Network Error** (localhost = la machine du client).
 * Dans ce cas on force `{window.location.origin}/api` (même proxy Next que la page).
 */
export function resolveActiveApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return getServerApiBaseUrl();
  }
  const configured = getApiBaseUrl();
  try {
    const u = new URL(configured);
    if (isLoopbackHost(u.hostname) && window.location.origin !== u.origin) {
      return `${window.location.origin}/api`;
    }
  } catch {
    /* ignore */
  }
  return configured;
}

export function getBackendOrigin() {
  const fallback = deriveOrigin(DEFAULT_API_URL, "http://127.0.0.1:8000");
  const explicitBackend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

  if (explicitBackend) {
    const abs = withHttpSchemeIfMissing(explicitBackend);
    return deriveOrigin(trimTrailingSlash(safeUrl(abs, DEFAULT_API_URL)), fallback);
  }

  return deriveOrigin(getApiBaseUrl(), fallback);
}

export function getWebsocketOrigin() {
  const fallback = deriveWebsocketOrigin(DEFAULT_API_URL, "ws://127.0.0.1:8000");
  const explicitWs = process.env.NEXT_PUBLIC_WS_URL?.trim();

  if (explicitWs) {
    const abs = withHttpSchemeIfMissing(explicitWs);
    return deriveWebsocketOrigin(trimTrailingSlash(safeUrl(abs, DEFAULT_API_URL)), fallback);
  }

  return deriveWebsocketOrigin(getApiBaseUrl(), fallback);
}
