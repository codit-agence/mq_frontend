import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/src/core/config/public-env";
import { AUTH_PATHS } from "@/src/projects/client-dashboard/account/auth-paths";
import { brandingService } from "@/src/projects/shared/branding/branding.service";

const siteUrl = getSiteUrl();

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const defaultOffers = brandingService.getDefaultBranding().site_offers || [];

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/offres`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/solutions`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...defaultOffers.map((offer) => ({
      url: `${siteUrl}/offres/${offer.code}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    {
      url: `${siteUrl}${AUTH_PATHS.register}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}${AUTH_PATHS.terms}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}