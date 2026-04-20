"use client";

import { useEffect } from "react";

import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

export function BrandingRuntime() {
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale();

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.lang = locale;
    root.dir = isRtl ? "rtl" : "ltr";
    root.style.setProperty("--brand-primary", branding.primary_color);
    root.style.setProperty("--brand-secondary", branding.secondary_color);
    root.style.setProperty("--brand-accent", branding.accent_color);
    root.style.setProperty("--app-bg", branding.app_background_color);
    root.style.setProperty("--app-text", branding.text_color);
    root.style.setProperty("--brand-radius", `${branding.border_radius_px}px`);
    root.style.setProperty("--font-brand-latin", branding.latin_font_family);
    root.style.setProperty("--font-brand-arabic", branding.arabic_font_family);
    body.style.backgroundColor = branding.app_background_color;
    body.style.color = branding.text_color;

    if (branding.app_name) {
      document.title = branding.app_name;
    }

    const favicon = branding.favicon || branding.logo;
    if (favicon) {
      let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = getImageUrl(favicon);
    }
  }, [branding, isRtl, locale]);

  return null;
}
