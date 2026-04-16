import { getSiteUrl } from "@/src/core/config/public-env";

function absolutize(pathOrUrl: string): string {
  const t = pathOrUrl.trim();
  if (!t) return t;
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  const origin = getSiteUrl().replace(/\/$/, "");
  return t.startsWith("/") ? `${origin}${t}` : `${origin}/${t}`;
}

/**
 * URL encodée dans le QR (toujours absolue pour les scanners).
 * Priorité : page publique → redirection explicite → lien court /q/{slug}.
 */
export function resolveTenantQrUrl(input: {
  public_landing_url?: string | null;
  qr_redirect_url?: string | null;
  qr_slug?: string | null;
}) {
  if (input.public_landing_url?.trim()) {
    return absolutize(input.public_landing_url.trim());
  }
  if (input.qr_redirect_url?.trim()) {
    return absolutize(input.qr_redirect_url.trim());
  }
  const slug = input.qr_slug?.trim();
  if (slug) {
    return `${getSiteUrl().replace(/\/$/, "")}/q/${slug}`;
  }
  return null;
}