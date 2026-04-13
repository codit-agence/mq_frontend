import type { Metadata } from "next";

import { getApiBaseUrl, getSiteUrl } from "@/src/core/config/public-env";
import { brandingService } from "@/src/projects/shared/branding/branding.service";
import { PublicBranding } from "@/src/projects/shared/branding/branding.types";

const apiBaseUrl = getApiBaseUrl();
const siteUrl = getSiteUrl();

export async function getPublicBrandingServer(): Promise<PublicBranding> {
  try {
    const response = await fetch(`${apiBaseUrl}/branding/public`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Branding public HTTP ${response.status}`);
    }

    return (await response.json()) as PublicBranding;
  } catch {
    return brandingService.getDefaultBranding();
  }
}

export function buildHomeMetadata(branding: PublicBranding): Metadata {
  const title = branding.seo_meta_title || `${branding.app_name} | Site web, TV connectee, QR et marketing digital`;
  const description =
    branding.seo_meta_description || `${branding.app_name} propose site web commercial, TV connectee, QR gratuit, promotions, tracking et dashboard client pour piloter votre activite.`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: [
      "tv connectee",
      "menu digital",
      "site web commercial",
      "qr menu",
      "promotion restaurant",
      "dashboard client",
      "tracking ecrans",
      branding.app_name,
    ],
    category: "business",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    alternates: {
      canonical: "/",
      languages: {
        fr: "/",
        ar: "/",
      },
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: branding.app_name,
      locale: branding.default_language === "ar" ? "ar_MA" : "fr_FR",
      type: "website",
      images: [
        {
          url: branding.site_hero_slides?.[0]?.image_url || "/mq/jus2.jfif",
          width: 1200,
          height: 630,
          alt: branding.app_name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [branding.site_hero_slides?.[0]?.image_url || "/mq/jus2.jfif"],
    },
  };
}

export function buildMarketingPageMetadata({
  branding,
  path,
  title,
  description,
  keywords,
}: {
  branding: PublicBranding;
  path: string;
  title: string;
  description: string;
  keywords?: string[];
}): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${path}`,
      siteName: branding.app_name,
      locale: branding.default_language === "ar" ? "ar_MA" : "fr_FR",
      type: "website",
      images: [
        {
          url: branding.site_hero_slides?.[0]?.image_url || "/mq/jus2.jfif",
          width: 1200,
          height: 630,
          alt: branding.app_name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [branding.site_hero_slides?.[0]?.image_url || "/mq/jus2.jfif"],
    },
  };
}