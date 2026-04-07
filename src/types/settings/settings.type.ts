export interface Tenant {
  id: string;
  name: string;
  slug: string;
  business_type: string;
  address?: string;
  city?: string;
  country?: string;
  primary_color: string;
  logo?: string;
  is_active: boolean;
  is_verified: boolean;
  display_settings: DisplaySettings;
  tenant_settings: TenantSettings;
}

export interface DisplaySettings {
  template: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  default_language: string;
  active_languages: string[];
  is_rtl: boolean;
}

export interface TenantSettings {
  description: string;
  currency: string;
  social_links: any;
  show_prices: boolean;
  show_images: boolean;
  cover_image?: string;
  work_start: string;
  work_end: string;
}