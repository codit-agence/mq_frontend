import api from "@/src/core/api/axios";
import { PublicBranding } from "@/src/projects/shared/branding/branding.types";

const BRANDING_CACHE_KEY = "public-branding-cache-v1";
const BRANDING_CACHE_TTL_MS = 10 * 60 * 1000;

let memoryCache: PublicBranding | null = null;

const defaultBranding: PublicBranding = {
  app_name: "QALYAS",
  app_short_name: "QALYAS",
  tagline: "",
  logo: null,
  logo_dark: null,
  favicon: null,
  login_background: null,
  primary_color: "#2D4F9E",
  secondary_color: "#77BB65",
  accent_color: "#77BB65",
  app_background_color: "#F4F8FF",
  text_color: "#0F172A",
  border_radius_px: 16,
  app_theme: "clean",
  latin_font_family: "Poppins",
  arabic_font_family: "Cairo",
  tv_font_family: "Cairo",
  default_language: "fr",
  active_languages: ["fr", "ar", "en"],
  rtl_enabled: true,
  login_title: "Bienvenue sur QALYAS",
  login_subtitle: "Connectez-vous pour gerer votre plateforme.",
  login_layout: "split",
  show_register_button: true,
  show_forgot_password: true,
  home_badge: "TV Connect, QR, Site web et tracking",
  home_blog_label: "Blog bientot disponible",
  site_navigation: [
    { key: "services", label: { fr: "Services", ar: "الخدمات" }, href: "#services" },
    { key: "pricing-logic", label: { fr: "Tarification", ar: "التسعير" }, href: "#pricing-logic" },
    { key: "offers", label: { fr: "Offres", ar: "العروض" }, href: "#offers" },
    { key: "products", label: { fr: "Produits", ar: "المنتجات" }, href: "#products" },
    { key: "access", label: { fr: "Connexion", ar: "الدخول" }, href: "#access" },
    { key: "contact", label: { fr: "Contact", ar: "التواصل" }, href: "#contact" },
    { key: "partners", label: { fr: "Partenaires", ar: "الشركاء" }, href: "#partners" },
  ],
  site_services: [
    {
      code: "digital-menu",
      title: { fr: "Menu digital intelligent", ar: "قائمة رقمية ذكية" },
      description: { fr: "Catalogue, QR public, affichage et diffusion optimisee pour vente et branding.", ar: "كتالوج و QR عام وعرض محسن للبيع والهوية البصرية." },
    },
    {
      code: "commercial-ops",
      title: { fr: "Pilotage commercial", ar: "قيادة تجارية" },
      description: { fr: "Offres, prix, promotions et contenus adaptes au niveau du client.", ar: "عروض واسعار وترقيات ومحتوى حسب مستوى العميل." },
    },
    {
      code: "seo-presence",
      title: { fr: "Presence web & SEO", ar: "حضور ويب وتهيئة SEO" },
      description: { fr: "Une home marketing pensee pour convertir et etre bien referencee.", ar: "صفحة رئيسية تسويقية مهيأة للتحويل والظهور في محركات البحث." },
    },
    {
      code: "connected-tv",
      title: { fr: "TV connectee & playlists", ar: "TV متصلة وقوائم بث" },
      description: { fr: "2 TV incluses pour demarrer, puis plus de diffusion selon le niveau d'offre.", ar: "شاشتان في البداية ثم توسع حسب مستوى العرض." },
    },
    {
      code: "tracking-ops",
      title: { fr: "Tracking & pilotage", ar: "تتبع وقيادة" },
      description: { fr: "Mesurez l'usage, pilotez les ecrans et faites evoluer le compte selon la consommation.", ar: "قِس الاستعمال وادِر الشاشات وطوّر الحساب حسب الاستهلاك." },
    },
    {
      code: "loyalty-promo",
      title: { fr: "Fidelite & promotions", ar: "ولاء وعروض" },
      description: { fr: "Activez QR, promotions, campagnes et mecanismes de retour client.", ar: "فعّل QR والعروض والحملات وآليات رجوع العميل." },
    },
  ],
  site_offers: [
    {
      code: "starter",
      name: { fr: "Launch", ar: "لانش" },
      tagline: { fr: "Pour debuter avec une vitrine digitale rapide.", ar: "للانطلاق بسرعة مع واجهة رقمية اساسية." },
      price_label: { fr: "499 MAD / mois", ar: "499 درهم / شهر" },
      original_price_label: { fr: "650 MAD / mois", ar: "650 درهم / شهر" },
      promo_label: { fr: "Promo lancement", ar: "عرض الانطلاق" },
      promo_deadline_label: { fr: "Jusqu'au 30/06/2026", ar: "الى غاية 30/06/2026" },
      features: [
        { fr: "2 TV connectees", ar: "شاشتان متصلتان" },
        { fr: "Site web commercial", ar: "موقع ويب تجاري" },
        { fr: "QR gratuit", ar: "QR مجاني" },
        { fr: "Produits illimites", ar: "منتجات غير محدودة" },
      ],
      highlight: { fr: "Ideal pour petit point de vente", ar: "مناسب لنقطة بيع صغيرة" },
    },
    {
      code: "pro-growth",
      name: { fr: "Growth", ar: "النمو" },
      tagline: { fr: "Pour vendre plus avec plus d'ecrans, plus de medias et plus de suivi.", ar: "لبيع اكثر مع شاشات اكثر ووسائط اكثر ومتابعة اقوى." },
      price_label: { fr: "990 MAD / mois", ar: "990 درهم / شهر" },
      original_price_label: { fr: "1 250 MAD / mois", ar: "1 250 درهم / شهر" },
      promo_label: { fr: "Pack recommande", ar: "العرض الموصى به" },
      promo_deadline_label: { fr: "Promo saisonniere active", ar: "عرض موسمي نشط" },
      features: [
        { fr: "5 TV connectees", ar: "5 شاشات متصلة" },
        { fr: "Promotions avancees", ar: "عروض متقدمة" },
        { fr: "Tracking plus riche", ar: "تتبع اغنى" },
        { fr: "Accompagnement commercial", ar: "مرافقة تجارية" },
      ],
      highlight: { fr: "Tres bon rapport entre capacite et conversion", ar: "توازن ممتاز بين القدرة والتحويل" },
    },
    {
      code: "enterprise-plus",
      name: { fr: "Scale", ar: "التوسع" },
      tagline: { fr: "Pour les structures qui consomment plus de TV, plus de playlists et plus d'operations.", ar: "للبنيات التي تستهلك شاشات اكثر وقوائم اكثر وعمليات اكثر." },
      price_label: { fr: "Sur devis", ar: "حسب الطلب" },
      promo_label: { fr: "Grand compte", ar: "حساب كبير" },
      features: [
        { fr: "5+ TV connectees", ar: "اكثر من 5 شاشات" },
        { fr: "Pilotage avance", ar: "قيادة متقدمة" },
        { fr: "Support prioritaire", ar: "دعم ذو اولوية" },
        { fr: "Tarif selon charge reelle", ar: "سعر حسب الحمل الحقيقي" },
      ],
      highlight: { fr: "Plus le client consomme, plus l'offre monte logiquement", ar: "كلما زاد الاستهلاك ارتفع العرض بشكل منطقي" },
    },
  ],
  site_highlights: [
    { value: "80%", label: { fr: "usage mobile", ar: "استخدام عبر الهاتف" } },
    { value: "24/7", label: { fr: "presence digitale", ar: "حضور رقمي دائم" } },
    { value: "2-5 TV", label: { fr: "capacite standard", ar: "السعة القياسية" } },
    { value: "SEO", label: { fr: "acquisition locale", ar: "اكتساب محلي" } },
  ],
  site_hero_slides: [
    {
      code: "hero-menu",
      title: { fr: "Un frontend commercial puissant pour vendre vos offres", ar: "واجهة تجارية قوية لبيع عروضك" },
      description: { fr: "Page publique responsive, packs lisibles, QR gratuit, TV connectee et entree rapide vers le dashboard client.", ar: "صفحة عامة متجاوبة مع عروض واضحة و QR مجاني و TV متصلة ودخول سريع الى لوحة العميل." },
      image_url: "/mq/jus2.jfif",
      cta_label: { fr: "Choisir une offre", ar: "اختر عرضا" },
    },
    {
      code: "hero-breakfast",
      title: { fr: "Montrez vos produits, services et promotions avec impact", ar: "اعرض منتجاتك وخدماتك وعروضك بتأثير قوي" },
      description: { fr: "Des ecrans connectes, des pages d'offres et une presentation premium pour convertir le visiteur en client.", ar: "شاشات متصلة وصفحات عروض وتقديم احترافي يحول الزائر الى عميل." },
      image_url: "/mq/petitedejeuner.jpg",
      cta_label: { fr: "Voir les packs", ar: "شاهد الباقات" },
    },
    {
      code: "hero-brand",
      title: { fr: "Une solution bien organisee, claire et prete a scaler", ar: "حل منظم وواضح وجاهز للتوسع" },
      description: { fr: "Site public, dashboard client et dashboard admin relies a une meme base, avec une architecture prudente des maintenant.", ar: "موقع عام ولوحة عميل ولوحة ادارة مربوطة بقاعدة واحدة مع تنظيم حذر من البداية." },
      image_url: "/mq/hero-brand.svg",
      cta_label: { fr: "Decouvrir la plateforme", ar: "اكتشف المنصة" },
    },
  ],
  maintenance_mode: false,
  maintenance_message: "",
  support_email: "",
  support_phone: "",
  seo_meta_title: "QALYAS | TV connectee, QR gratuit, promotions et site web commercial",
  seo_meta_description: "QALYAS aide les commerces a vendre plus avec TV connectee, QR gratuit, promotions, tracking, dashboard client et site web reference.",
};

function readLocalCache(): PublicBranding | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(BRANDING_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { timestamp: number; data: PublicBranding };
    if (!parsed?.data || !parsed?.timestamp) return null;
    if (Date.now() - parsed.timestamp > BRANDING_CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeLocalCache(data: PublicBranding) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BRANDING_CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // Ignore storage quota errors.
  }
}

export const brandingService = {
  getDefaultBranding(): PublicBranding {
    return defaultBranding;
  },

  async getPublicBranding(): Promise<PublicBranding> {
    if (memoryCache) return memoryCache;

    const cached = readLocalCache();
    if (cached) {
      memoryCache = cached;
      return cached;
    }

    try {
      const response = await api.get<PublicBranding>("/branding/public");
      memoryCache = response.data;
      writeLocalCache(response.data);
      return response.data;
    } catch {
      memoryCache = defaultBranding;
      return defaultBranding;
    }
  },
};
