"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCatalogStore } from "@/src/projects/client-dashboard/catalog/store/catalog.store";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { Loader2, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { getErrorMessage } from "@/src/utils/errors";
import type { Category } from "@/src/types/catalogs/catalog_types";

type Lang = "fr" | "ar" | "en" | "es";

const ALL_LANGS: Lang[] = ["fr", "ar", "en", "es"];

function normalizeActiveLanguages(raw: unknown): Lang[] {
  if (!Array.isArray(raw) || raw.length === 0) return ["fr"];
  const allowed = new Set<Lang>(ALL_LANGS);
  const picked = raw.filter((x): x is Lang => typeof x === "string" && allowed.has(x as Lang));
  return picked.length > 0 ? picked : ["fr"];
}

interface CategoryFormProps {
  onSuccess: () => void;
  initialData?: Category | null;
}

const emptyFields = {
  name: "",
  name_ar: "",
  name_en: "",
  name_es: "",
  note: "",
  note_ar: "",
  note_en: "",
  note_es: "",
};

export const CategoryForm = ({ onSuccess, initialData }: CategoryFormProps) => {
  const { createCategory, updateCategory } = useCatalogStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { formData } = useSettingsStore();
  const { locale } = useAppLocale();
  const activeLanguages = normalizeActiveLanguages(formData?.display?.active_languages);
  const defaultLanguage = (formData?.display?.default_language as Lang) || activeLanguages[0] || "fr";

  const [langStep, setLangStep] = useState(0);
  const [fields, setFields] = useState(emptyFields);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeLang = activeLanguages[langStep] ?? defaultLanguage;

  const text =
    locale === "ar"
      ? {
          languages: { fr: "الفرنسية", ar: "العربية", en: "الإنجليزية", es: "الإسبانية" } as Record<Lang, string>,
          needOne:
            "أدخل اسماً في أحد الحقول أعلاه (لغة واحدة تكفي). الملاحظة والصورة اختياريان.",
          categoryError: "خطأ أثناء حفظ التصنيف:",
          photo: "صورة التصنيف (اختياري)",
          photoHint: "JPG أو PNG أو WEBP — يظهر في القائمة",
          groupName: "اسم المجموعة / التصنيف",
          noteLabel: "ملاحظة قصيرة (اختياري)",
          noteHint: "سطر للعميل على البطاقة — مثال: يُقدّم بارداً، نباتي، إلخ.",
          placeholder: "مثال: المقبلات الساخنة",
          stepOf: (n: number, t: number) => `اللغة ${n} / ${t}`,
          prev: "السابق",
          next: "التالي",
          update: "تحديث",
          create: "إنشاء التصنيف",
        }
      : {
          languages: { fr: "Francais", ar: "Arabe", en: "Anglais", es: "Espagnol" } as Record<Lang, string>,
          needOne:
            "Saisissez un nom dans le champ ci-dessus (une langue suffit, utilisez Suivant pour une autre langue). Note et photo optionnels.",
          categoryError: "Erreur action categorie:",
          photo: "Photo de la categorie (optionnel)",
          photoHint: "JPG, PNG ou WEBP — affichee sur la carte menu",
          groupName: "Nom du groupe / Categorie",
          noteLabel: "Ligne de note (optionnel)",
          noteHint: "Texte client sur la carte — ex. servi froid, vegetarien, epice...",
          placeholder: "Ex: Entrees chaudes",
          stepOf: (n: number, t: number) => `Langue ${n} / ${t}`,
          prev: "Precedent",
          next: "Suivant",
          update: "Mettre a jour",
          create: "Creer la categorie",
        };

  useEffect(() => {
    if (!initialData) {
      setFields(emptyFields);
      setImagePreview(null);
      setImageFile(null);
      return;
    }
    setFields({
      name: initialData.name || "",
      name_ar: initialData.name_ar || "",
      name_en: initialData.name_en || "",
      name_es: initialData.name_es || "",
      note: initialData.note || "",
      note_ar: initialData.note_ar || "",
      note_en: initialData.note_en || "",
      note_es: initialData.note_es || "",
    });
    setImagePreview(initialData.image ? getImageUrl(initialData.image) : null);
    setImageFile(null);
  }, [initialData?.id]);

  useEffect(() => {
    if (langStep >= activeLanguages.length) {
      setLangStep(Math.max(0, activeLanguages.length - 1));
    }
  }, [activeLanguages.length, langStep]);

  const nameKey = (lang: Lang) => (lang === "fr" ? "name" : `name_${lang}`) as keyof typeof fields;
  const noteKey = (lang: Lang) => (lang === "fr" ? "note" : `note_${lang}`) as keyof typeof fields;

  /** Toute langue remplie compte (aligné backend), même si les réglages « langues actives » sont vides ou incohérents. */
  const hasAnyName = () =>
    ALL_LANGS.some((lang) => !!String(fields[nameKey(lang)] || "").trim());

  const hasMinimumContent = () => hasAnyName();

  const goNext = () => setLangStep((s) => Math.min(s + 1, activeLanguages.length - 1));
  const goPrev = () => setLangStep((s) => Math.max(0, s - 1));

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error(locale === "ar" ? "الصورة كبيرة جداً (حد أقصى 2 ميجا)" : "Image trop lourde (max 2 Mo)");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasMinimumContent()) {
      toast.error(text.needOne);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: fields.name.trim(),
        name_ar: fields.name_ar.trim(),
        name_en: fields.name_en.trim(),
        name_es: fields.name_es.trim(),
        note: fields.note.trim() || undefined,
        note_ar: fields.note_ar.trim() || undefined,
        note_en: fields.note_en.trim() || undefined,
        note_es: fields.note_es.trim() || undefined,
        is_active: initialData?.is_active ?? true,
        order: initialData?.order ?? 0,
      };

      if (initialData?.id) {
        await updateCategory(initialData.id, payload, imageFile || undefined);
      } else {
        await createCategory(payload, imageFile || undefined);
      }

      toast.success(locale === "ar" ? "تم الحفظ" : "Enregistre");
      onSuccess();
    } catch (err) {
      console.error(text.categoryError, err);
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayPhoto = imagePreview;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-4">
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-wider">{text.photo}</label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative block w-full aspect-[21/9] max-h-48 bg-slate-50 rounded-[28px] border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer group hover:border-indigo-300 transition-all"
        >
          {displayPhoto ? (
            <img src={displayPhoto} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
              <ImageIcon size={32} strokeWidth={1.5} />
              <span className="text-[10px] font-black uppercase">{text.photoHint}</span>
            </div>
          )}
        </button>
        <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleImagePick} />
      </div>

      <p className="text-[10px] text-slate-500 px-1">{text.needOne}</p>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
            {text.stepOf(langStep + 1, activeLanguages.length)} — {text.languages[activeLang]}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={langStep === 0}
              className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[10px] font-black uppercase text-slate-600 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              {text.prev}
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={langStep >= activeLanguages.length - 1}
              className="flex items-center gap-1 rounded-2xl bg-slate-900 px-4 py-2 text-[10px] font-black uppercase text-white disabled:opacity-40"
            >
              {text.next}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
            style={{ width: `${((langStep + 1) / activeLanguages.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2" dir={activeLang === "ar" ? "rtl" : "ltr"}>
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-wider">
            {text.groupName} ({activeLang})
          </label>
          <input
            placeholder={text.placeholder}
            className="w-full p-5 bg-slate-50 border-none rounded-[24px] font-bold text-lg outline-indigo-500 transition-all"
            value={fields[nameKey(activeLang)]}
            onChange={(e) =>
              setFields((prev) => ({ ...prev, [nameKey(activeLang)]: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2" dir={activeLang === "ar" ? "rtl" : "ltr"}>
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-wider">
            {text.noteLabel} ({activeLang})
          </label>
          <p className="text-[10px] text-slate-400 px-2">{text.noteHint}</p>
          <textarea
            rows={3}
            placeholder="…"
            className="w-full p-5 bg-slate-50 border-none rounded-[24px] font-medium text-sm outline-indigo-500 transition-all resize-none"
            value={fields[noteKey(activeLang)]}
            onChange={(e) =>
              setFields((prev) => ({ ...prev, [noteKey(activeLang)]: e.target.value }))
            }
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none uppercase tracking-widest"
      >
        {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : initialData ? text.update : text.create}
      </button>
    </form>
  );
};
