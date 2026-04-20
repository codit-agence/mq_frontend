"use client";

import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { CategoryForm } from "@/src/projects/client-dashboard/catalog/components/CategoryForm";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

export default function AddCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.tenantId;
  const { tenant } = useAuthStore();
  const { formData } = useSettingsStore();
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale();
  const isOwner = tenant?.role === "owner";
  const catalogRestricted = !!formData?.display?.catalog_client_restricted;
  const readonlyMode = catalogRestricted && !isOwner;
  const rawLangs = formData?.display?.active_languages;
  const activeLanguages =
    Array.isArray(rawLangs) && rawLangs.length > 0 ? rawLangs : (["fr"] as string[]);
  const text = locale === "ar"
    ? {
        restricted: "وصول مقيّد",
        restrictedDesc: "الكتالوج مقفل للعملاء. فقط المالك يمكنه إنشاء التصنيفات.",
        back: "الرجوع إلى القائمة",
        title: "تصنيف جديد",
        subtitle: "أنشئ تصنيفاً جديداً لكتالوجك.",
        requiredTitle: "اسم التصنيف",
        requiredDesc: `لغة واحدة تكفي (${activeLanguages.join(", ")}). الملاحظة والصورة اختياريان. زر «التالي» يعرض لغة أخرى إن لزم.`,
      }
    : {
        restricted: "Acces restreint",
        restrictedDesc: "Le catalogue est verrouille pour les clients. Seuls les proprietaires peuvent creer des categories.",
        back: "Retour au menu",
        title: "Nouvelle categorie",
        subtitle: "Creez une nouvelle categorie pour votre catalogue.",
        requiredTitle: "Nom de la categorie",
        requiredDesc: `Une seule langue suffit (${activeLanguages.join(", ")}). Note et photo optionnels. Le bouton « Suivant » sert a passer a une autre langue si vous voulez.`,
      };

  if (readonlyMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-3xl rounded-3xl border border-rose-200 bg-white p-12 text-center shadow-xl">
          <h1 className="text-3xl font-black text-rose-600 mb-4">{text.restricted}</h1>
          <p className="text-sm text-slate-600 mb-8">{text.restrictedDesc}</p>
          <button onClick={() => router.push(`/dashboard/tenant/${tenantId ?? tenant?.id}/menu`)} className="px-8 py-4 rounded-3xl bg-slate-900 text-white font-black uppercase tracking-[0.2em]">{text.back}</button>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="max-w-5xl mx-auto p-6 md:p-10 pb-40">
      <div className="flex items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{text.title}</h1>
          <p className="text-sm text-slate-500 mt-2">{text.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/dashboard/tenant/${tenantId ?? tenant?.id}/menu`)}
          className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-100 transition"
        >
          {text.back}
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl">
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-xs font-black uppercase tracking-wider text-amber-700">
            {text.requiredTitle}
          </p>
          <p className="mt-1 text-sm text-amber-800">{text.requiredDesc}</p>
        </div>
        <CategoryForm onSuccess={() => router.push(`/dashboard/tenant/${tenantId ?? tenant?.id}/menu`)} />
      </div>
    </div>
  );
}
