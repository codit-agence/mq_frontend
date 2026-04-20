import { notFound } from "next/navigation";

import { getServerApiBaseUrl } from "@/src/core/config/public-env";
import { LegalDocumentView, type LegalDocumentPayload } from "@/src/projects/public-site/marketing/components/LegalDocumentView";
import { getPublicBrandingServer } from "@/src/projects/shared/branding/branding.server";

async function fetchLegalDoc(slug: string): Promise<LegalDocumentPayload | null> {
  const base = getServerApiBaseUrl();
  const url = `${base}/qmweb/legal/${encodeURIComponent(slug)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as LegalDocumentPayload;
  } catch {
    return null;
  }
}

export default async function LegalSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [doc, branding] = await Promise.all([fetchLegalDoc(slug), getPublicBrandingServer()]);
  if (!doc) notFound();
  return <LegalDocumentView branding={branding} doc={doc} />;
}
