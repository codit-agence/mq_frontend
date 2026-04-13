import { PublicSolutionsPage } from "@/src/projects/public-site/marketing/components/PublicSolutionsPage";
import { buildMarketingPageMetadata, getPublicBrandingServer } from "@/src/projects/shared/branding/branding.server";

export async function generateMetadata() {
  const branding = await getPublicBrandingServer();
  return buildMarketingPageMetadata({
    branding,
    path: "/solutions",
    title: `${branding.app_name} | Solutions digitales, TV Connect, tracking et fidelite`,
    description: "Decouvrez les solutions produits: TV Connect, systeme de fidelite, tracking, QR gratuit, site web commercial et dashboard client.",
    keywords: ["solutions tv connect", "systeme fidelite", "tracking ecrans", branding.app_name],
  });
}

export default async function SolutionsPage() {
  const branding = await getPublicBrandingServer();
  return <PublicSolutionsPage branding={branding} />;
}