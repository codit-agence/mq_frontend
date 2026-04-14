"use client";

import React, { useState, useEffect } from "react";
import { useCatalogStore } from "@/src/projects/client-dashboard/catalog/store/catalog.store";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";

type Lang = "fr" | "ar" | "en" | "es";

interface CategoryFormProps {
  onSuccess: () => void;
  // ✅ On utilise le type complet pour éviter les erreurs de mapping
  initialData?: any; 
}

export const CategoryForm = ({ onSuccess, initialData }: CategoryFormProps) => {
  const { createCategory, updateCategory, loading } = useCatalogStore();
  const { formData } = useSettingsStore();
  const { branding } = useBranding();
  const { locale } = useAppLocale(branding);
  const activeLanguages = (formData?.display?.active_languages || ["fr"]) as Lang[];
  const defaultLanguage = (formData?.display?.default_language as Lang) || activeLanguages[0] || "fr";
  const [activeLang, setActiveLang] = useState<Lang>(defaultLanguage);

  const [fields, setFields] = useState<Record<string, string>>({
    name: initialData?.name || "",
    name_ar: initialData?.name_ar || "",
    name_en: initialData?.name_en || "",
    name_es: initialData?.name_es || "",
  });
  const [emoji, setEmoji] = useState(initialData?.image || "🍔");
  const text = locale === "ar"
    ? {
        languages: { fr: "الفرنسية", ar: "العربية", en: "الإنجليزية", es: "الإسبانية" } as Record<Lang, string>,
        missing: "مطلوب: اسم التصنيف باللغة",
        orChange: "أكمل الحقول أو غيّر اللغات المفعلة من الإعدادات > التصميم.",
        categoryError: "خطأ أثناء حفظ التصنيف:",
        icon: "أيقونة / Emoji",
        groupName: "اسم المجموعة / التصنيف",
        placeholder: "مثال: المقبلات الساخنة",
        update: "تحديث",
        create: "إنشاء التصنيف",
      }
    : {
        languages: { fr: "Francais", ar: "Arabe", en: "Anglais", es: "Espagnol" } as Record<Lang, string>,
        missing: "Obligatoire: nom categorie en",
        orChange: "Completez les champs ou modifiez Active languages dans Parametres > Design.",
        categoryError: "Erreur action categorie:",
        icon: "Icone / Emoji",
        groupName: "Nom du groupe / Categorie",
        placeholder: "Ex: Entrees chaudes",
        update: "Mettre a jour",
        create: "Creer la categorie",
      };

  useEffect(() => {
    if (initialData) {
      setFields({
        name: initialData.name || "",
        name_ar: initialData.name_ar || "",
        name_en: initialData.name_en || "",
        name_es: initialData.name_es || "",
      });
      setEmoji(initialData.image || "🍔");
    }
  }, [initialData]);

  useEffect(() => {
    if (!activeLanguages.includes(activeLang)) {
      setActiveLang(defaultLanguage);
    }
  }, [activeLanguages, activeLang, defaultLanguage]);

  const currentName = fields[activeLang === 'fr' ? 'name' : `name_${activeLang}`]?.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingLang = activeLanguages.find((lang) => {
      const key = lang === "fr" ? "name" : `name_${lang}`;
      return !String(fields[key] || "").trim();
    });

    if (missingLang) {
      setActiveLang(missingLang);
      toast.error(
        `${text.missing} ${text.languages[missingLang]}. ${text.orChange}`
      );
      return;
    }
    
    try {
      const payload = {
        name: fields.name,
        name_ar: fields.name_ar,
        name_en: fields.name_en,
        name_es: fields.name_es,
        image: emoji,
        is_active: initialData?.is_active ?? true,
        order: initialData?.order ?? 0,
      };

      if (initialData?.id) {
        await updateCategory(initialData.id, payload);
      } else {
        await createCategory(payload);
      }
      
      onSuccess();
    } catch (err) {
      console.error(text.categoryError, err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-4">
      <div className="flex flex-col items-center gap-4">
        <div className="text-5xl p-6 bg-slate-50 rounded-[35px] border-2 border-slate-100 shadow-inner group hover:border-indigo-200 transition-all">
           <input 
             value={emoji}
             maxLength={2}
             onChange={(e) => setEmoji(e.target.value)}
             className="w-16 text-center bg-transparent outline-none cursor-pointer"
             title={text.icon}
           />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{text.icon}</p>
      </div>

      <div className="space-y-6">
        <div className="flex bg-slate-100 p-2 rounded-[25px] gap-2 overflow-x-auto no-scrollbar">
          {activeLanguages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`min-w-[90px] rounded-2xl px-4 py-3 text-[10px] font-black uppercase transition ${activeLang === lang ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
            >
              {lang === 'fr' ? 'Français' : lang === 'en' ? 'English' : lang === 'ar' ? 'العربية' : 'Español'}
            </button>
          ))}
        </div>

        <div className="space-y-2" dir={activeLang === "ar" ? "rtl" : "ltr"}>
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-wider">
            {text.groupName} ({activeLang})
          </label>
          <input 
            required={activeLang === defaultLanguage}
            placeholder={text.placeholder}
            className="w-full p-5 bg-slate-50 border-none rounded-[24px] font-bold text-lg outline-indigo-500 transition-all"
            value={fields[activeLang === 'fr' ? 'name' : `name_${activeLang}`] || ''}
            onChange={(e) => setFields((prev) => ({ ...prev, [activeLang === 'fr' ? 'name' : `name_${activeLang}`]: e.target.value }))}
          />
        </div>
      </div>

      <button 
        type="submit"
        disabled={loading || !currentName}
        className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none uppercase tracking-widest"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          initialData ? text.update : text.create
        )}
      </button>
    </form>
  );
};
