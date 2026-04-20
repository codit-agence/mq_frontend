import { getServerApiBaseUrl } from "@/src/core/config/public-env";
import type { QmwebPageData } from "./qmweb.types";

function normalizeQmwebPayload(raw: unknown): QmwebPageData | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const heroRaw = Array.isArray(o.hero_slides) ? o.hero_slides : [];
  const hero = [...heroRaw].sort(
    (a, b) => ((a as { order?: number }).order ?? 0) - ((b as { order?: number }).order ?? 0),
  );
  return {
    hero_slides: hero as QmwebPageData["hero_slides"],
    sections: (Array.isArray(o.sections) ? o.sections : []) as QmwebPageData["sections"],
    services: (Array.isArray(o.services) ? o.services : []) as QmwebPageData["services"],
    pricing_plans: (Array.isArray(o.pricing_plans) ? o.pricing_plans : []) as QmwebPageData["pricing_plans"],
    partners: (Array.isArray(o.partners) ? o.partners : []) as QmwebPageData["partners"],
    testimonials: (Array.isArray(o.testimonials) ? o.testimonials : []) as QmwebPageData["testimonials"],
    faqs: (Array.isArray(o.faqs) ? o.faqs : []) as QmwebPageData["faqs"],
    legal_documents: (Array.isArray(o.legal_documents) ? o.legal_documents : []) as QmwebPageData["legal_documents"],
  };
}

/**
 * Fetches the full qmweb landing page payload (server-side, cached 1 min).
 * Uses `getServerApiBaseUrl()` so Docker SSR peut joindre Django via le nom de service.
 */
export async function fetchQmwebPage(): Promise<QmwebPageData | null> {
  try {
    const url = `${getServerApiBaseUrl()}/qmweb/page`;
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return normalizeQmwebPayload(await res.json());
  } catch {
    return null;
  }
}
