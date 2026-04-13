import { getWebsocketOrigin as getConfiguredWebsocketOrigin } from "@/src/core/config/public-env";

/**
 * Dérive l’origine WebSocket depuis NEXT_PUBLIC_API_URL (hôte Django, hors préfixe /api).
 * Optionnel : NEXT_PUBLIC_WS_URL (ex. ws://127.0.0.1:8000)
 */
export function getWebsocketOrigin(): string {
  return getConfiguredWebsocketOrigin();
}

export function wsUrl(path: string): string {
  const origin = getWebsocketOrigin();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${p}`;
}
