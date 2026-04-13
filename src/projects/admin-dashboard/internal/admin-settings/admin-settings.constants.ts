import { getApiBaseUrl } from "@/src/core/config/public-env";
import { CmsEditorKey } from "./admin-settings.types";

export const cmsEditorLabels: Record<CmsEditorKey, string> = {
  site_navigation: "Navigation publique",
  site_services: "Services home",
  site_offers: "Offres & abonnements",
  site_highlights: "Highlights chiffres",
  site_hero_slides: "Slides hero",
};

export const inputClassName = "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white";

export const apiBaseUrl = getApiBaseUrl();