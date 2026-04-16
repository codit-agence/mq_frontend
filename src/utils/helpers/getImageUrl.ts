// src/utils/helpers/getImageUrl.ts

import { getBackendOrigin, getSiteUrl } from "@/src/core/config/public-env";

/**
 * Fichiers marketing (slides, logos référencés en JSON, etc.) : tout passe par l’API Django,
 * sous `MEDIA_ROOT`, URL publique **`/media/...`** (ex. `/media/mq/slide.png`).
 *
 * Les trois visuels hero par défaut (`qalyas_*.png`) sont aussi servis par le **front**
 * (`public/mq/`) : en prod l’API renvoie souvent `/media/mq/...` alors que les fichiers
 * ne sont pas encore sur `MEDIA_ROOT` → 404. On pointe vers le site pour ces noms seulement.
 *
 * Anciens chemins **`/mq/...`** (sans `media`) : complétés en `/media/mq/...` automatiquement.
 */
export const DEFAULT_MEDIA_MARKETING_IMAGE = "/media/mq/qalyas_service_1.png";

const STOCK_MQ_PNG = /^\/media\/mq\/(qalyas_service_1|qalyas_application_1|qalyas_project)\.png$/i;

function stockMqUrlOnSite(cleanPath: string): string | null {
  if (!STOCK_MQ_PNG.test(cleanPath)) return null;
  const name = cleanPath.split("/").pop() || "";
  return `${getSiteUrl()}/mq/${name}`;
}

export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) {
    return stockMqUrlOnSite(DEFAULT_MEDIA_MARKETING_IMAGE) || `${getBackendOrigin()}${DEFAULT_MEDIA_MARKETING_IMAGE}`;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  const stockOnSite = stockMqUrlOnSite(cleanPath);
  if (stockOnSite) return stockOnSite;

  if (
    cleanPath.startsWith("/media/") ||
    cleanPath.startsWith("/static/") ||
    cleanPath.startsWith("/api/")
  ) {
    return `${getBackendOrigin()}${cleanPath}`;
  }

  return `${getBackendOrigin()}/media${cleanPath}`;
};
