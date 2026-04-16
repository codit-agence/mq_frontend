import { NextResponse } from "next/server";

import { getSiteUrl } from "@/src/core/config/public-env";
import { getPublicBrandingServer } from "@/src/projects/shared/branding/branding.server";

export async function GET() {
  const branding = await getPublicBrandingServer();
  const siteUrl = getSiteUrl();
  const name = `${branding.app_name} · TV`;
  const shortName = branding.app_short_name?.trim() || "TV";

  const manifest = {
    id: `${siteUrl}/tv`,
    name,
    short_name: shortName.length > 12 ? `${shortName.slice(0, 11)}…` : shortName,
    description:
      branding.tagline ||
      "Application affichage TV et menu digital — installation sur téléviseur ou mobile.",
    start_url: "/tv?source=pwa",
    scope: "/tv",
    display: "standalone",
    orientation: "any",
    background_color: branding.app_background_color || "#050505",
    theme_color: branding.primary_color || "#2196f3",
    lang: branding.default_language === "ar" ? "ar" : "fr",
    dir: branding.default_language === "ar" && branding.rtl_enabled !== false ? "rtl" : "ltr",
    icons: [
      {
        src: `${siteUrl}/icon`,
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${siteUrl}/icon`,
        sizes: "256x256",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["business", "food"],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
