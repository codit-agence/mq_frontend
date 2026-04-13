export interface BrandingLocalizedText {
  fr: string;
  ar: string;
}

export interface BrandingSiteNavigationItem {
  key: string;
  label: BrandingLocalizedText;
  href: string;
}

export interface BrandingSiteService {
  code: string;
  title: BrandingLocalizedText;
  description: BrandingLocalizedText;
}

export interface BrandingSiteOffer {
  code: string;
  name: BrandingLocalizedText;
  tagline: BrandingLocalizedText;
  price_label: BrandingLocalizedText;
  original_price_label?: BrandingLocalizedText | null;
  promo_label?: BrandingLocalizedText | null;
  promo_deadline_label?: BrandingLocalizedText | null;
  features: BrandingLocalizedText[];
  highlight: BrandingLocalizedText;
}

export interface BrandingSiteHighlight {
  value: string;
  label: BrandingLocalizedText;
}

export interface BrandingSiteHeroSlide {
  code: string;
  title: BrandingLocalizedText;
  description: BrandingLocalizedText;
  image_url: string;
  cta_label?: BrandingLocalizedText | null;
}

export interface PublicBranding {
  app_name: string;
  app_short_name: string;
  tagline: string;
  logo?: string | null;
  logo_dark?: string | null;
  favicon?: string | null;
  login_background?: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  app_background_color: string;
  text_color: string;
  border_radius_px: number;
  app_theme?: string;
  latin_font_family: string;
  arabic_font_family: string;
  tv_font_family: string;
  default_language: "fr" | "ar" | "en" | string;
  active_languages: string[];
  rtl_enabled: boolean;
  login_title: string;
  login_subtitle: string;
  login_layout?: string;
  show_register_button: boolean;
  show_forgot_password: boolean;
  home_badge?: string;
  home_blog_label?: string;
  site_navigation?: BrandingSiteNavigationItem[];
  site_services?: BrandingSiteService[];
  site_offers?: BrandingSiteOffer[];
  site_highlights?: BrandingSiteHighlight[];
  site_hero_slides?: BrandingSiteHeroSlide[];
  maintenance_mode?: boolean;
  maintenance_message?: string;
  support_email?: string;
  support_phone?: string;
  seo_meta_title?: string;
  seo_meta_description?: string;
}
