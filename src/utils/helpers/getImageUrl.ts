// src/utils/helpers/getImageUrl.ts

import { getBackendOrigin } from "@/src/core/config/public-env";

/**
 * Fichiers marketing (slides, logos référencés en JSON, etc.) : tout passe par l’API Django,
 * sous `MEDIA_ROOT`, URL publique **`/media/...`** (ex. `/media/mq/slide.png`).
 *
 * Anciens chemins **`/mq/...`** (sans `media`) : complétés en `/media/mq/...` automatiquement.
 */
export const DEFAULT_MEDIA_MARKETING_IMAGE = "/media/mq/qalyas_service_1.png";

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) {
    return `${getBackendOrigin()}${DEFAULT_MEDIA_MARKETING_IMAGE}`;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (
    cleanPath.startsWith("/media/") ||
    cleanPath.startsWith("/static/") ||
    cleanPath.startsWith("/api/")
  ) {
    return `${getBackendOrigin()}${cleanPath}`;
  }

  return `${getBackendOrigin()}/media${cleanPath}`;
};
