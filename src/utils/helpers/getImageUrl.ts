// src/utils/helpers/getImageUrl.ts

import { getBackendOrigin } from "@/src/core/config/public-env";

/**
 * Construit l’URL absolue d’un média servi par Django.
 * Les fichiers sont exposés sous MEDIA_URL (`/media/…`). Les anciennes entrées
 * JSON (ex. `/mq/…`) sans préfixe `/media/` sont corrigées automatiquement.
 */
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return "/mq/petitedejeuner.jpg";

  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (
    cleanPath.startsWith("/media/") ||
    cleanPath.startsWith("/static/") ||
    cleanPath.startsWith("/api/")
  ) {
    return `${getBackendOrigin()}${cleanPath}`;
  }

  // Chemins relatifs au MEDIA_ROOT sans préfixe (ex. défaut branding `/mq/…`)
  return `${getBackendOrigin()}/media${cleanPath}`;
};