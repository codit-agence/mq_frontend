import Script from "next/script";

import { getSiteUrl } from "@/src/core/config/public-env";
import { PublicHomePage } from "@/src/projects/public-site/marketing/components/PublicHomePage";
import { buildHomeMetadata, getPublicBrandingServer } from "@/src/projects/shared/branding/branding.server";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { fetchQmwebPage } from "@/src/projects/public-site/marketing/api/qmweb.api";

export async function generateMetadata() {
  const branding = await getPublicBrandingServer();
  return buildHomeMetadata(branding);
}

export default async function Home() {
  const [branding, qmwebData] = await Promise.all([
    getPublicBrandingServer(),
    fetchQmwebPage(),
  ]);

  const siteUrl = getSiteUrl();
  const logoUrl = branding.logo ? getImageUrl(branding.logo) : undefined;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: branding.app_name,
    url: siteUrl,
    description: branding.seo_meta_description || branding.tagline || undefined,
    ...(logoUrl ? { logo: logoUrl } : {}),
    sameAs: [],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: branding.app_name,
    url: siteUrl,
  };

  return (
    <>
      <Script
        id="jsonld-organization"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Script
        id="jsonld-website"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <PublicHomePage branding={branding} qmwebData={qmwebData} />
    </>
  );
}
