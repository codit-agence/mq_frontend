import { PublicHomePage } from "@/src/projects/public-site/marketing/components/PublicHomePage";
import { buildHomeMetadata, getPublicBrandingServer } from "@/src/projects/shared/branding/branding.server";

export async function generateMetadata() {
  const branding = await getPublicBrandingServer();
  return buildHomeMetadata(branding);
}

export default async function Home() {
  const branding = await getPublicBrandingServer();
  return <PublicHomePage branding={branding} />;
}
