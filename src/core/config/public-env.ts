const DEFAULT_SITE_URL = "http://localhost:3000";
const DEFAULT_API_URL = "http://127.0.0.1:8000/api";

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

export function getSiteUrl() {
  return trimTrailingSlash(safeUrl(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL, DEFAULT_SITE_URL));
}

export function getApiBaseUrl() {
  return trimTrailingSlash(safeUrl(process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL, DEFAULT_API_URL));
}

export function getBackendOrigin() {
  const fallback = deriveOrigin(DEFAULT_API_URL, "http://127.0.0.1:8000");
  const explicitBackend = process.env.NEXT_PUBLIC_BACKEND_URL?.trim();

  if (explicitBackend) {
    return deriveOrigin(explicitBackend, fallback);
  }

  return deriveOrigin(getApiBaseUrl(), fallback);
}

export function getWebsocketOrigin() {
  const fallback = deriveWebsocketOrigin(DEFAULT_API_URL, "ws://127.0.0.1:8000");
  const explicitWs = process.env.NEXT_PUBLIC_WS_URL?.trim();

  if (explicitWs) {
    return deriveWebsocketOrigin(explicitWs, fallback);
  }

  return deriveWebsocketOrigin(getApiBaseUrl(), fallback);
}
