import { AdminSystemStatus, BrandingAdminOptions } from "@/src/projects/admin-dashboard/internal/services/admin-config.service";

export const previewBranding = {
  app_name: "QALYAS",
  app_short_name: "QALYAS",
  tagline: "Retail media, TV menu et diffusion connectee.",
  primary_color: "#0f172a",
  secondary_color: "#f8fafc",
  accent_color: "#f97316",
  app_background_color: "#f1f5f9",
  text_color: "#0f172a",
  border_radius_px: 18,
  app_theme: "clean",
  latin_font_family: "Poppins",
  arabic_font_family: "Cairo",
  tv_font_family: "Cairo",
  default_language: "fr",
  active_languages: ["fr", "ar"],
  rtl_enabled: true,
  login_title: "QALYAS Control",
  login_subtitle: "Configuration et supervision applicative.",
  login_layout: "split",
  show_register_button: true,
  show_forgot_password: true,
  home_badge: "Digital menu, TV and ADS",
  home_blog_label: "Blog bientot disponible",
  site_navigation: [
    { key: "services", label: { fr: "Services", ar: "الخدمات" }, href: "#services" },
    { key: "offers", label: { fr: "Offres", ar: "العروض" }, href: "#offers" },
  ],
  site_services: [
    { code: "digital-menu", title: { fr: "Menu digital intelligent", ar: "قائمة رقمية ذكية" }, description: { fr: "Catalogue, QR public et diffusion.", ar: "كتالوج و QR عام وبث رقمي." } },
  ],
  site_offers: [
    {
      code: "starter",
      name: { fr: "Launch", ar: "إنطلق" },
      tagline: { fr: "Pack de demarrage", ar: "باقة انطلاق" },
      price_label: { fr: "499 MAD / mois", ar: "499 درهم / شهر" },
      original_price_label: { fr: "65 MAD / mois", ar: "65 درهم / شهر" },
      promo_label: { fr: "Promo lancement", ar: "عرض الانطلاق" },
      promo_deadline_label: { fr: "Jusqu'au 30/04", ar: "إلى غاية 30/04" },
      features: [{ fr: "1 TV connectees", ar: "شاشة واحدة" }],
      highlight: { fr: "Ideal pour petit point de vente", ar: "مناسب لنقطة بيع صغيرة" },
    },
  ],
  site_highlights: [
    { value: "90%", label: { fr: "usage mobile", ar: "استخدام عبر الهاتف" } },
    { value: "24/7", label: { fr: "presence digitale", ar: "حضور رقمي دائم" } },
  ],
  site_hero_slides: [
    {
      title: { fr: "Pilotez votre vitrine digitale", ar: "أدر واجهتك الرقمية" },
      description: { fr: "Menus, ecrans et promotions synchronises depuis un seul back-office.", ar: "القوائم والشاشات والعروض من لوحة تحكم واحدة." },
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      cta_label: { fr: "Voir les offres", ar: "اكتشف العروض" },
      cta_href: "#offers",
    },
  ],
  maintenance_mode: false,
  maintenance_message: "Maintenance planifiee cette nuit de 02:00 a 02:30.",
  support_email: "support@qalyas.com",
  support_phone: "+212 600 000 000",
  seo_meta_title: "QALYAS Admin",
  seo_meta_description: "Pilotage branding et diagnostics.",
};

export const previewOptions: BrandingAdminOptions = {
  app_themes: [
    { value: "clean", label: "Clean" },
    { value: "bold", label: "Bold" },
  ],
  login_layouts: [
    { value: "split", label: "Split" },
    { value: "centered", label: "Centered" },
  ],
  recommended_latin_fonts: ["Poppins", "Manrope", "Space Grotesk"],
  recommended_arabic_fonts: ["Cairo", "Tajawal", "Changa"],
  recommended_tv_fonts: ["Cairo", "Tajawal", "Poppins"],
  languages: [
    { value: "fr", label: "Francais" },
    { value: "ar", label: "Arabe" },
  ],
};

export const previewStatus: AdminSystemStatus = {
  app_name: "QALYAS",
  app_version: "preview",
  environment: "preview",
  debug: true,
  docker_detected: true,
  maintenance_mode: false,
  default_language: "fr",
  active_languages: ["fr", "ar"],
  support_email: "support@qalyas.com",
  support_phone: "+212 663 673 57",
  database_engine: "preview-mock",
  channel_layer_backend: "channels_redis.core.RedisChannelLayer",
  redis_url_configured: true,
  websocket_routes: ["/ws/notifications/", "/ws/chat/:tenant_id/", "/ws/tv/:token/"],
  server_time: new Date().toISOString(),
  checks: [
    { key: "database", label: "Database", status: "ok", detail: "Mock database preview active." },
    { key: "branding", label: "Branding", status: "ok", detail: "Configuration branding chargee en mode preview." },
    { key: "channel-layer", label: "Channels", status: "ok", detail: "Backend channels simule pour revue interface." },
  ],
};

export const previewNetworkChecks = [
  { key: "branding-public", label: "Branding public", ok: true, durationMs: 42, detail: "HTTP 200 (preview)" },
  { key: "auth-me", label: "Auth /me", ok: true, durationMs: 39, detail: "Preview bypass actif" },
  { key: "admin-system", label: "Admin system", ok: true, durationMs: 47, detail: "Mock diagnostics charges" },
];