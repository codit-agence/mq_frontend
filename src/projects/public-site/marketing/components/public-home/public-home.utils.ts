import {
  BrandingLocalizedText,
  BrandingSiteHeroSlide,
  BrandingSiteHighlight,
  BrandingSiteNavigationItem,
  BrandingSiteOffer,
  BrandingSiteService,
} from "@/src/projects/shared/branding/branding.types";

export type PublicHomeLocale = "fr" | "ar";

export function getLocalizedText(locale: PublicHomeLocale, value?: BrandingLocalizedText | null) {
  if (!value) return "";
  return locale === "ar" ? value.ar : value.fr;
}

export function getPublicHomeText(locale: PublicHomeLocale) {
  return locale === "ar"
    ? {
        chooseOffer: "اختر العرض",
        discoverOffers: "اكتشف العروض",
        servicesTitle: "خدمات مصممة لواجهة تجارية قوية ومقنعة",
        offersTitle: "عروض واسعة تجذب العميل وتدفعه لاتخاذ القرار",
        contactTitle: "ابدأ الآن أو تحدث مع المبيعات",
        contactBody: "المستخدم الجديد يختار العرض ثم يمر الى onboarding منظم قبل الدخول الى التطبيق ولوحة التحكم.",
        callUs: "اتصل بنا",
        productsTitle: "قائمة منتجاتنا",
        loginLabel: "الدخول الى التطبيق",
        productsList: [
          "نظام الولاء",
          "نظام TV Connect",
          "نظام Tracking",
          "QR مجاني",
          "موقع ويب تجاري",
          "نظام العروض والتخفيضات",
          "لوحة تحكم العميل",
        ],
      }
    : {
        chooseOffer: "Choisir une offre",
        discoverOffers: "Decouvrir les offres",
        servicesTitle: "Des services penses pour une vitrine commerciale qui convertit",
        offersTitle: "Des packs larges, lisibles et assez attractifs pour vendre vite",
        contactTitle: "Demarrer maintenant ou parler au commercial",
        contactBody: "Le prospect choisit une offre, passe par un onboarding dedie, puis utilise le login pour entrer dans l'application et gerer son dashboard.",
        callUs: "Nous appeler",
        productsTitle: "Liste de nos produits",
        loginLabel: "Connexion a l'application",
        productsList: [
          "Systeme de fidelite",
          "Systeme TV Connect",
          "Systeme Tracking",
          "QR gratuit",
          "Site web commercial",
          "Systeme promotions et campagnes",
          "Dashboard client",
        ],
      };
}

export function getPublicHomeCollections(input: {
  slides?: BrandingSiteHeroSlide[];
  offers?: BrandingSiteOffer[];
  services?: BrandingSiteService[];
  highlights?: BrandingSiteHighlight[];
  navigation?: BrandingSiteNavigationItem[];
}) {
  return {
    slides: input.slides || [],
    offers: input.offers || [],
    services: input.services || [],
    highlights: input.highlights || [],
    navigation: input.navigation || [],
  };
}