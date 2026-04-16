import type { Metadata, Viewport } from "next";

import { getSiteUrl } from "@/src/core/config/public-env";
import { getPublicBrandingServer } from "@/src/projects/shared/branding/branding.server";

import TvPwaShell from "./componenents/TvPwaShell";

export async function generateMetadata(): Promise<Metadata> {
  const branding = await getPublicBrandingServer();
  const siteUrl = getSiteUrl();
  return {
    title: `TV · ${branding.app_name}`,
    description: `${branding.app_name} — affichage menu sur TV et mobile (PWA).`,
    applicationName: branding.app_name,
    manifest: `${siteUrl}/tv/web-manifest`,
    appleWebApp: {
      capable: true,
      title: `${branding.app_short_name || branding.app_name} TV`,
      statusBarStyle: "black-translucent",
    },
    formatDetection: { telephone: false },
    icons: {
      icon: "/icon",
      apple: "/icon",
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const branding = await getPublicBrandingServer();
  return {
    themeColor: branding.primary_color || "#050505",
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
  };
}

export default async function TvLayout({ children }: { children: React.ReactNode }) {
  return <TvPwaShell>{children}</TvPwaShell>;
}
