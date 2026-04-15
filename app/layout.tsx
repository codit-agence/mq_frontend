import type { Metadata } from "next";

import "./globals.css";
import { getSiteUrl } from "@/src/core/config/public-env";
import { getPublicBrandingServer } from "@/src/projects/shared/branding/branding.server";
import { BrandingProvider } from "@/src/projects/shared/branding/components/BrandingProvider";
import { BrandingRuntime } from "@/src/projects/shared/branding/components/BrandingRuntime";

const siteUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getPublicBrandingServer();

  return {
    metadataBase: new URL(siteUrl),
    applicationName: branding.app_name,
    title: {
      default: branding.seo_meta_title || branding.app_name,
      template: `%s | ${branding.app_name}`,
    },
    description: branding.seo_meta_description || branding.tagline || `${branding.app_name} plateforme de gestion digitale`,
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: "/icon",
      shortcut: "/icon",
      apple: "/icon",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const branding = await getPublicBrandingServer();

  return (
    <html lang="fr">
      <body>
        <BrandingProvider branding={branding}>
          <BrandingRuntime />
          {children}
        </BrandingProvider>
      </body>
    </html>
  );
}