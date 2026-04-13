import type { BusinessType } from "@/src/types/common/entities";

export interface DisplaySettings {
  template: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  active_languages: string[];
  default_language: string;
  is_rtl: boolean;
  catalog_client_restricted?: boolean;
}

export interface BusinessSettings {
  id: string;
  name_override: string | null;
  description: string | null;
  logo: string | File | null;
  cover_image: string | File | null;
  currency: string;
  tel: string;
  address: string;
  opening_hours: any | null;
  social_links: Record<string, string>;
  work_start: string | null;
  work_end: string | null;
  show_images: boolean;
  show_prices: boolean;
  created_at: string;
}

export interface TenantSettingsUpdatePayload {
  name?: string;
  slug?: string;
  city?: string;
  country?: string;
  business_type?: BusinessType;
  business?: Omit<BusinessSettings, 'id' | 'created_at'> & {
    logo?: File | string | null;
    cover_image?: File | string | null;
  };
  display?: DisplaySettings;
}

export interface TenantSettingsData {
  id?: string;
  name?: string;
  slug?: string;
  qr_slug?: string;
  qr_is_active?: boolean;
  public_landing_url?: string;
  city?: string;
  country?: string;
  business_type?: BusinessType;
  status?: string;
  created_at?: string;
  business?: {
    id?: string;
    name_override?: string;
    description?: string;
    logo?: string | File | null;
    cover_image?: string | File | null;
    currency?: string;
    tel?: string;
    address?: string;
    opening_hours?: Record<string, any> | null;
    social_links?: Record<string, string> | null;
    work_start?: string | null;
    work_end?: string | null;
    show_images?: boolean;
    show_prices?: boolean;
    created_at?: string;
  };
  display?: {
    template?: string;
    primary_color?: string;
    secondary_color?: string;
    font_family?: string;
    active_languages?: string[];
    default_language?: string;
    is_rtl?: boolean;
    catalog_client_restricted?: boolean;
  };
};

export type Tenant = TenantSettingsData;
