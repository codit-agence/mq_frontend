import { BrandingSiteOffer, PublicBranding } from "@/src/projects/shared/branding/branding.types";

export const fallbackMarketingOffers: BrandingSiteOffer[] = [
  {
    code: "launch",
    name: { fr: "Launch", ar: "لانش" },
    tagline: { fr: "2 TV connectees, QR gratuit, site vitrine et promos de base.", ar: "شاشتان متصلتان و QR مجاني وموقع وعروض اساسية." },
    price_label: { fr: "499 MAD / mois", ar: "499 درهم / شهر" },
    features: [
      { fr: "2 TV connectees", ar: "شاشتان متصلتان" },
      { fr: "QR gratuit", ar: "QR مجاني" },
      { fr: "Promotions simples", ar: "عروض بسيطة" },
    ],
    highlight: { fr: "Ideal pour debuter vite", ar: "مثالي للانطلاق" },
  },
  {
    code: "growth",
    name: { fr: "Growth", ar: "النمو" },
    tagline: { fr: "5 TV connectees, plus de playlists, plus de medias, plus de performance.", ar: "خمس شاشات متصلة ووسائط اكثر واداء اكبر." },
    price_label: { fr: "990 MAD / mois", ar: "990 درهم / شهر" },
    promo_label: { fr: "Le plus demande", ar: "الاكثر طلبا" },
    features: [
      { fr: "5 TV connectees", ar: "5 شاشات متصلة" },
      { fr: "Tracking avance", ar: "تتبع متقدم" },
      { fr: "Promotions evoluees", ar: "عروض متطورة" },
    ],
    highlight: { fr: "Bon equilibre entre ressource et vente", ar: "توازن قوي بين الموارد والبيع" },
  },
  {
    code: "scale",
    name: { fr: "Scale", ar: "التوسع" },
    tagline: { fr: "Pour les clients qui diffusent plus, consomment plus et ont besoin d'un pilotage plus large.", ar: "للعملاء الذين يستهلكون اكثر ويحتاجون قيادة اوسع." },
    price_label: { fr: "Sur devis", ar: "حسب الطلب" },
    features: [
      { fr: "Infrastructure multi-ecrans", ar: "بنية متعددة الشاشات" },
      { fr: "Suivi prioritaire", ar: "متابعة ذات اولوية" },
      { fr: "Accompagnement grand compte", ar: "مرافقة للحسابات الكبيرة" },
    ],
    highlight: { fr: "Plus de ressource, plus de valeur, plus de service", ar: "كلما زاد الاستهلاك زادت القيمة والخدمة" },
  },
];

export function getMarketingOffers(branding: PublicBranding) {
  return branding.site_offers?.length ? branding.site_offers : fallbackMarketingOffers;
}

export function getMarketingOfferByCode(branding: PublicBranding, code: string) {
  return getMarketingOffers(branding).find((offer) => offer.code === code) || null;
}