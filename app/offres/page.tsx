import { PublicOffersPage } from "@/src/projects/public-site/marketing/components/PublicOffersPage";
import { buildMarketingPageMetadata, getPublicBrandingServer } from "@/src/projects/shared/branding/branding.server";

export async function generateMetadata() {
  const branding = await getPublicBrandingServer();
  return buildMarketingPageMetadata({
    branding,
    path: "/offres",
    title: `${branding.app_name} | Offres, packs et tarification TV connectee`,
    description: "Comparez les offres, packs et niveaux de service pour TV connectee, QR gratuit, tracking, promotions et site web commercial.",
    keywords: ["offres tv connectee", "packs tv connectee", "tarification qr menu", branding.app_name],
  });
}

export default async function OffersPage() {
  const branding = await getPublicBrandingServer();
  return <PublicOffersPage branding={branding} />;
}