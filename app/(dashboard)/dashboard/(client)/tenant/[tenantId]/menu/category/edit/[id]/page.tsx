"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { useCatalogStore } from "@/src/projects/client-dashboard/catalog/store/catalog.store";
import { CategoryForm } from "@/src/projects/client-dashboard/catalog/components/CategoryForm";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

export default function EditCategoryPage() {
  const { tenantId, id } = useParams();
  const router = useRouter();
  const { tenant } = useAuthStore();
  const { formData } = useSettingsStore();
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale();
  const { categories, fetchCatalog } = useCatalogStore();
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isOwner = tenant?.role === "owner";
  const catalogRestricted = !!formData?.display?.catalog_client_restricted;
  const readonlyMode = catalogRestricted && !isOwner;
  const activeLanguages = (formData?.display?.active_languages || ["fr"]) as string[];
  const text = locale === "ar"
    ? {
        notFoundToast: "التصنيف غير موجود",
        restricted: "وصول مقيّد",
        restrictedDesc: "الكتالوج مقفل للعملاء. فقط المالك يمكنه تعديل التصنيفات.",
        loading: "جاري تحميل التصنيف...",
        notFound: "التصنيف غير موجود",
        back: "الرجوع إلى القائمة",
        title: "تعديل التصنيف",
        subtitle: "عدّل النصوص متعددة اللغات وأيقونة التصنيف.",
        requiredTitle: "حقول متعددة اللغات مطلوبة",
        requiredDesc: `لحفظ التصنيف، يجب تعبئة \`الاسم\` في كل لغة مفعلة (${activeLanguages.join(", ")})، أو تغيير \`Active languages\` من الإعدادات > التصميم.`,
      }
    : {
        notFoundToast: "Categorie introuvable",
        restricted: "Acces restreint",
        restrictedDesc: "Le catalogue est verrouille pour les clients. Seuls les proprietaires peuvent editer des categories.",
        loading: "Chargement de la categorie...",
        notFound: "Categorie introuvable",
        back: "Retour au menu",
        title: "Modifier la categorie",
        subtitle: "Ajustez les textes multilingues et l'icone de la categorie.",
        requiredTitle: "Champs obligatoires multilingues",
        requiredDesc: `Pour enregistrer une categorie, vous devez remplir \`Nom\` dans chaque langue active (${activeLanguages.join(", ")}), ou modifier \`Active languages\` dans Parametres > Design.`,
      };

  useEffect(() => {
    const loadCategory = async () => {
      if (!id) return;
      if (categories.length === 0) {
        await fetchCatalog();
      }

      const found = categories.find((category) => category.id === id);
      if (found) {
        setInitialData(found);
      } else {
        toast.error(text.notFoundToast);
      }
      setLoading(false);
    };

    loadCategory();
  }, [categories, fetchCatalog, id, text.notFoundToast]);

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

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="text-slate-400 font-black uppercase tracking-[0.25em]">{text.loading}</div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xl">
          <h1 className="text-3xl font-black text-slate-900 mb-4">{text.notFound}</h1>
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
        <CategoryForm initialData={initialData} onSuccess={() => router.push(`/dashboard/tenant/${tenantId ?? tenant?.id}/menu`)} />
      </div>
    </div>
  );
}
