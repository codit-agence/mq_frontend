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
};

export function getTenantSettingsText(locale: string): TenantSettingsText {
  return locale === "ar" ? arText : frText;
}