import { notFound } from "next/navigation";

import { PublicOfferDetailPage } from "@/src/projects/public-site/marketing/components/PublicOfferDetailPage";
import { getMarketingOfferByCode, getMarketingOffers } from "@/src/projects/public-site/marketing/components/public-home/offers.data";
import { buildMarketingPageMetadata, getPublicBrandingServer } from "@/src/projects/shared/branding/branding.server";

export async function generateStaticParams() {
  const branding = await getPublicBrandingServer();
  return getMarketingOffers(branding).map((offer) => ({ code: offer.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const branding = await getPublicBrandingServer();
  const offer = getMarketingOfferByCode(branding, code);

  if (!offer) {
    return buildMarketingPageMetadata({
      branding,
      path: `/offres/${code}`,
      title: `${branding.app_name} | Offre introuvable`,
      description: "Cette offre n'est pas disponible.",
    });
  }

  return buildMarketingPageMetadata({
    branding,
    path: `/offres/${offer.code}`,
    title: `${branding.app_name} | ${offer.name.fr} - pack detaille`,
    description: offer.tagline.fr,
    keywords: [offer.name.fr, offer.code, "tv connectee", "qr gratuit", branding.app_name],
  });
}

export default async function OfferDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const branding = await getPublicBrandingServer();
  const offer = getMarketingOfferByCode(branding, code);

  if (!offer) {
    notFound();
  }

  const relatedOffers = getMarketingOffers(branding).filter((item) => item.code !== offer.code).slice(0, 3);

  return <PublicOfferDetailPage branding={branding} offer={offer} relatedOffers={relatedOffers} />;
}