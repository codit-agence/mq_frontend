export interface TenantSettingsText {
  title: string;
  subtitle: string;
  identity: string;
  design: string;
  business: string;
  syncing: string;
  ready: string;
  saving: string;
  publish: string;
  accountReadOnlyTitle: string;
  labelTenantId: string;
  labelSlug: string;
  labelStatus: string;
}

const frText: TenantSettingsText = {
  title: "Configuration complete du tenant",
  subtitle: "Gerez tous les parametres de votre etablissement",
  identity: "Identite de l'etablissement",
  design: "Configuration du design",
  business: "Parametres business",
  syncing: "Synchronisation en cours...",
  ready: "Toutes les modifications sont pretes",
  saving: "ENREGISTREMENT...",
  publish: "PUBLIER LES MODIFICATIONS",
  accountReadOnlyTitle: "Compte (lecture seule, synchronise avec le serveur)",
  labelTenantId: "ID tenant",
  labelSlug: "Slug",
  labelStatus: "Statut",
};

const arText: TenantSettingsText = {
  title: "الاعدادات الكاملة للمستأجر",
  subtitle: "ادارة جميع اعدادات المؤسسة",
  identity: "هوية المؤسسة",
  design: "اعدادات التصميم",
  business: "اعدادات النشاط",
  syncing: "المزامنة جارية...",
  ready: "كل التعديلات جاهزة",
  saving: "جار الحفظ...",
  publish: "نشر التعديلات",
  accountReadOnlyTitle: "الحساب (للقراءة فقط، متزامن مع الخادم)",
  labelTenantId: "معرف المستأجر",
  labelSlug: "المسار",
  labelStatus: "الحالة",
};

export function getTenantSettingsText(locale: string): TenantSettingsText {
  return locale === "ar" ? arText : frText;
}

/** Textes des onglets Identité / Business / Design (FR + AR, alignés sur LocaleToggle). */
export interface TenantSettingsTabsText {
  identity: {
    establishmentFallback: string;
    legalNamePrefix: string;
    registrationDate: string;
    deadlineFiveMonths: string;
    remainingDays: string;
    daysSuffix: string;
    na: string;
    localization: string;
    cityPlaceholder: string;
    countryPlaceholder: string;
    address: string;
    coverImage: string;
    noCover: string;
    chooseCover: string;
    logoAlt: string;
    coverAlt: string;
    partnerFallback: string;
  };
  business: {
    commercialNameOverride: string;
    menuCurrency: string;
    businessDescription: string;
    businessDescriptionPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    hoursJson: string;
    hoursJsonPlaceholder: string;
    socialNetworks: string;
    showPrices: string;
    showImages: string;
  };
  design: {
    clientTemplate: string;
    primaryColor: string;
    secondaryColor: string;
    languageConfig: string;
    defaultLanguage: string;
    templates: Record<string, string>;
  };
}

const tabsFr: TenantSettingsTabsText = {
  identity: {
    establishmentFallback: "Établissement",
    legalNamePrefix: "Nom légal :",
    registrationDate: "Date inscription",
    deadlineFiveMonths: "Échéance (5 mois)",
    remainingDays: "Jours restants",
    daysSuffix: "jours",
    na: "N/A",
    localization: "Localisation",
    cityPlaceholder: "Ville",
    countryPlaceholder: "Pays",
    address: "Adresse",
    coverImage: "Image de couverture",
    noCover: "Aucune image de couverture",
    chooseCover: "Choisir une cover",
    logoAlt: "Logo",
    coverAlt: "Couverture",
    partnerFallback: "SaaS Partner",
  },
  business: {
    commercialNameOverride: "Nom commercial (override)",
    menuCurrency: "Devise du menu",
    businessDescription: "Description du business",
    businessDescriptionPlaceholder: "Décrivez votre restaurant…",
    phone: "Téléphone",
    phonePlaceholder: "+212…",
    hoursJson: "Horaires (JSON)",
    hoursJsonPlaceholder: '{"monday":{"open":"09:00","close":"18:00"}}',
    socialNetworks: "Réseaux sociaux",
    showPrices: "Afficher les prix",
    showImages: "Afficher les images",
  },
  design: {
    clientTemplate: "Modèle client",
    primaryColor: "Couleur primaire",
    secondaryColor: "Couleur secondaire",
    languageConfig: "Langues du menu (client)",
    defaultLanguage: "Langue par défaut",
    templates: {
      standard: "Standard",
      full_promo: "Full promo",
      branded: "Branded",
      tvplayer: "Lecteur TV",
      display: "Affichage",
    },
  },
};

const tabsAr: TenantSettingsTabsText = {
  identity: {
    establishmentFallback: "المؤسسة",
    legalNamePrefix: "الاسم القانوني:",
    registrationDate: "تاريخ التسجيل",
    deadlineFiveMonths: "الاستحقاق (5 أشهر)",
    remainingDays: "الأيام المتبقية",
    daysSuffix: "يومًا",
    na: "غير متوفر",
    localization: "الموقع",
    cityPlaceholder: "المدينة",
    countryPlaceholder: "الدولة",
    address: "العنوان",
    coverImage: "صورة الغلاف",
    noCover: "لا توجد صورة غلاف",
    chooseCover: "اختيار صورة الغلاف",
    logoAlt: "الشعار",
    coverAlt: "الغلاف",
    partnerFallback: "شريك SaaS",
  },
  business: {
    commercialNameOverride: "الاسم التجاري (تجاوز)",
    menuCurrency: "عملة القائمة",
    businessDescription: "وصف النشاط",
    businessDescriptionPlaceholder: "صف مطعمك…",
    phone: "الهاتف",
    phonePlaceholder: "+212…",
    hoursJson: "ساعات العمل (JSON)",
    hoursJsonPlaceholder: '{"monday":{"open":"09:00","close":"18:00"}}',
    socialNetworks: "وسائل التواصل",
    showPrices: "عرض الأسعار",
    showImages: "عرض الصور",
  },
  design: {
    clientTemplate: "قالب العرض للعميل",
    primaryColor: "اللون الأساسي",
    secondaryColor: "اللون الثانوي",
    languageConfig: "لغات القائمة (للعميل)",
    defaultLanguage: "اللغة الافتراضية",
    templates: {
      standard: "قياسي",
      full_promo: "عروض كاملة",
      branded: "هوية بصرية",
      tvplayer: "مشغل TV",
      display: "عرض",
    },
  },
};

export function getTenantSettingsTabsText(locale: string): TenantSettingsTabsText {
  return locale === "ar" ? tabsAr : tabsFr;
}