export type AdminBrandingState = Record<string, any>;

export type NetworkProbe = {
  key: string;
  label: string;
  ok: boolean;
  durationMs: number;
  detail: string;
};

export type CmsEditorKey = "site_navigation" | "site_services" | "site_offers" | "site_highlights" | "site_hero_slides";