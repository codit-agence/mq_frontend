"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProductForm } from "@/src/projects/client-dashboard/catalog/store/useProductForm";
import { 
  ArrowLeft, Loader2, Plus, Trash2, 
  ImageIcon, Save, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { useBranding } from "@/src/projects/shared/branding/useBranding";
import { useAppLocale } from "@/src/projects/shared/branding/useAppLocale";
import { toast } from "react-hot-toast";

type Lang = "fr" | "ar" | "en" | "es";

export default function AddProductPage() {
  const router = useRouter();
  const { tenant } = useAuthStore();
  const { formData } = useSettingsStore();
  const { branding } = useBranding();
  const { locale, isRtl } = useAppLocale();
  const [langStep, setLangStep] = useState(0);
  const activeLanguages = (formData?.display?.active_languages || ["fr"]) as Lang[];
  const defaultLanguage = (formData?.display?.default_language as Lang) || activeLanguages[0] || "fr";
  const activeLang = activeLanguages[langStep] ?? defaultLanguage;
  const isOwner = tenant?.role === "owner";
  const catalogRestricted = !!formData?.display?.catalog_client_restricted;
  const readonlyMode = catalogRestricted && !isOwner;
  const text = locale === "ar"
    ? {
        restricted: "وصول مقيّد",
        restrictedDesc: "الكتالوج مقفل للعملاء. فقط المالك يمكنه إنشاء أو تعديل المنتجات.",
        back: "الرجوع إلى القائمة",
        newProduct: "منتج جديد",
        creation: "إنشاء الكتالوج",
        requiredTitle: "حقول متعددة اللغات مطلوبة",
        requiredDesc: `للحفظ، يجب تعبئة \`الاسم\` و\`الوصف\` في كل لغة مفعلة (${activeLanguages.join(", ")}). غيّر اللغات المفعلة من الإعدادات > التصميم إذا لزم الأمر.`,
        image: "إضافة صورة",
        price: "السعر (MAD)",
        category: "التصنيف",
        selectCategory: "اختر تصنيفاً",
        productName: "اسم المنتج",
        shortDescription: "وصف مختصر",
        description: "الوصف",
        note: "ملاحظة داخلية",
        processing: "جار المعالجة...",
        submit: "تأكيد الحفظ",
        stepOf: (n: number, t: number) => `اللغة ${n} / ${t}`,
        prev: "السابق",
        next: "التالي",
        fillLang: "املأ الاسم والوصف لهذه اللغة قبل المتابعة.",
      }
    : {
        restricted: "Acces restreint",
        restrictedDesc: "Le catalogue est verrouille pour les clients. Seuls les proprietaires peuvent creer ou modifier des produits.",
        back: "Retour au menu",
        newProduct: "Nouveau produit",
        creation: "Creation catalogue",
        requiredTitle: "Champs obligatoires multilingues",
        requiredDesc: `Pour enregistrer, vous devez remplir \`Nom\` et \`Description\` dans chaque langue active (${activeLanguages.join(", ")}). Sinon, modifiez \`Active languages\` dans Parametres > Design.`,
        image: "Ajouter une image",
        price: "Prix (MAD)",
        category: "Categorie",
        selectCategory: "Selectionner...",
        productName: "Nom du produit",
        shortDescription: "Courte description",
        description: "Description",
        note: "Note interne",
        processing: "Traitement en cours...",
        submit: "Confirmer l'enregistrement",
        stepOf: (n: number, t: number) => `Langue ${n} / ${t}`,
        prev: "Precedent",
        next: "Suivant",
        fillLang: "Remplissez le nom et la description pour cette langue avant de continuer.",
      };

  useEffect(() => {
    if (langStep >= activeLanguages.length) {
      setLangStep(Math.max(0, activeLanguages.length - 1));
    }
  }, [activeLanguages.length, langStep]);

  // Initialisation du Hook avec redirection dynamique
  const { 
    register, handleSubmit, preview, handleImageChange, 
    categories, isSubmitting, fields, append, remove, 
    formState: { errors },
    getValues,
  } = useProductForm(null, () => {
    if (tenant?.id) {
      router.push(`/dashboard/tenant/${tenant.id}/menu`);
    } else {
      router.push("/dashboard");
    }
  });

  const goNextLang = () => {
    const data = getValues() as unknown as Record<string, string | undefined>;
    const name = activeLang === "fr" ? data.name : data[`name_${activeLang}`];
    const desc = activeLang === "fr" ? data.description : data[`description_${activeLang}`];
    if (!String(name || "").trim() || !String(desc || "").trim()) {
      toast.error(text.fillLang);
      return;
    }
    setLangStep((s) => Math.min(s + 1, activeLanguages.length - 1));
  };

  const goPrevLang = () => setLangStep((s) => Math.max(0, s - 1));

  if (readonlyMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-3xl rounded-3xl border border-rose-200 bg-white p-12 text-center shadow-xl">
          <h1 className="text-3xl font-black text-rose-600 mb-4">{text.restricted}</h1>
          <p className="text-sm text-slate-600 mb-8">{text.restrictedDesc}</p>
          <button onClick={() => router.push(`/dashboard/tenant/${tenant?.id}/menu`)} className="px-8 py-4 rounded-3xl bg-slate-900 text-white font-black uppercase tracking-[0.2em]">{text.back}</button>
        </div>
      </div>
    );
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="max-w-6xl mx-auto p-4 md:p-10 pb-40 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button 
            type="button"
            onClick={() => router.back()} 
            className="group p-4 bg-white rounded-[22px] shadow-sm border border-slate-100 hover:bg-indigo-600 transition-all duration-300"
          >
            <ArrowLeft size={20} className="text-slate-500 group-hover:text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {locale === "ar" ? "منتج" : "Nouveau"} <span className="text-indigo-600 italic">{locale === "ar" ? "جديد" : "Produit"}</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[3px] mt-1">{text.creation}</p>
          </div>
        </div>
      </div>

      {activeLanguages.length > 0 && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-xs font-black uppercase tracking-wider text-amber-700">
            {text.requiredTitle}
          </p>
          <p className="mt-1 text-sm text-amber-800">{text.requiredDesc}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- COLONNE GAUCHE (Image, Prix, Catégorie) --- */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* IMAGE SECTION */}
          <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-5 tracking-widest px-2 text-center">Photo du plat</span>
            <label className="relative block aspect-square bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer group hover:border-indigo-400 transition-all">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3">
                  <ImageIcon size={40} strokeWidth={1.5} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{text.image}</span>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>

          {/* PRIX & CATEGORIE */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest px-1">{text.price}</label>
              <input 
                {...register("price", { 
                  required: "Prix requis", 
                  min: { value: 0, message: "Le prix doit être positif" } 
                })} 
                type="number" 
                step="0.01"
                placeholder="0.00"
                className={`w-full px-6 py-5 bg-slate-50 rounded-[22px] border-2 outline-none font-black text-2xl text-indigo-600 shadow-inner transition-all ${errors.price ? 'border-rose-200 focus:border-rose-500' : 'border-transparent focus:border-indigo-500'}`} 
              />
              {errors.price && <p className="text-[10px] text-rose-500 font-bold px-2 uppercase tracking-tighter">{errors.price.message as string}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest px-1">{text.category}</label>
              <select 
                {...register("category_id", { required: text.selectCategory })} 
                className={`w-full px-6 py-5 bg-slate-50 rounded-[22px] border-2 outline-none font-bold text-slate-700 appearance-none shadow-inner transition-all ${errors.category_id ? 'border-rose-200 focus:border-rose-500' : 'border-transparent focus:border-indigo-500'}`}
              >
                <option value="">{text.selectCategory}</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.category_id && <p className="text-[10px] text-rose-500 font-bold px-2 uppercase tracking-tighter">{errors.category_id.message as string}</p>}
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE (Infos Multilingues & Variantes) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white p-6 md:p-10 rounded-[50px] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                {text.stepOf(langStep + 1, activeLanguages.length)} —{" "}
                {activeLang === "fr" ? "Français" : activeLang === "ar" ? "العربية" : activeLang === "en" ? "English" : "Español"}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={goPrevLang}
                  disabled={langStep === 0}
                  className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[10px] font-black uppercase text-slate-600 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  {text.prev}
                </button>
                <button
                  type="button"
                  onClick={goNextLang}
                  disabled={langStep >= activeLanguages.length - 1}
                  className="flex items-center gap-1 rounded-2xl bg-slate-900 px-4 py-2 text-[10px] font-black uppercase text-white disabled:opacity-40"
                >
                  {text.next}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden mb-10">
              <div
                className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${((langStep + 1) / activeLanguages.length) * 100}%` }}
              />
            </div>

            {/* INPUTS DYNAMIQUES */}
            <div className="space-y-8" dir={activeLang === "ar" ? "rtl" : "ltr"}>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2 italic">{text.productName} ({activeLang})</label>
                <input 
                   {...register(activeLang === "fr" ? "name" : `name_${activeLang}` as any, { 
                     required: activeLang === "fr" ? "Le nom en Français est obligatoire" : false 
                   })} 
                   placeholder="Ex: Couscous Royal..."
                   className="w-full px-8 py-5 bg-slate-50 rounded-[25px] border-2 border-transparent focus:border-indigo-500 outline-none font-black text-xl shadow-inner" 
                />
                {activeLang === "fr" && errors.name && <p className="text-[10px] text-rose-500 font-bold px-2 uppercase tracking-tighter">{errors.name.message as string}</p>}
              </div>

              <div className="space-y-3 grid gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 block px-2 italic">{text.shortDescription} ({activeLang})</label>
                  <input 
                    {...register(activeLang === "fr" ? "short_description" : `short_description_${activeLang}` as any)}
                    placeholder="Ex: Pain maison, sauce épicée..."
                    className="w-full px-8 py-5 bg-slate-50 rounded-[25px] border-2 border-transparent focus:border-indigo-500 outline-none shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 block px-2 italic">{text.description} ({activeLang})</label>
                  <textarea 
                     {...register(activeLang === "fr" ? "description" : `description_${activeLang}` as any)} 
                     rows={4}
                     placeholder="Détails, ingrédients, conseil..."
                     className="w-full px-8 py-5 bg-slate-50 rounded-[25px] border-2 border-transparent focus:border-indigo-500 outline-none font-medium text-slate-600 shadow-inner resize-none" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 block px-2 italic">{text.note} ({activeLang})</label>
                  <input 
                    {...register(activeLang === "fr" ? "note" : `note_${activeLang}` as any)}
                    placeholder="Note cuisine, allergènes..."
                    className="w-full px-8 py-5 bg-slate-50 rounded-[25px] border-2 border-transparent focus:border-indigo-500 outline-none shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* VARIANTES SECTION */}
          <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[3px]">Variantes & Suppléments</h3>
              <button 
                type="button" 
                onClick={() => append({ label: "", price: 0, is_default: false })} 
                className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {fields.length === 0 && (
                <p className="text-center py-6 text-slate-300 text-[10px] font-bold uppercase tracking-widest border-2 border-dashed border-slate-50 rounded-[30px]">Aucune option configurée</p>
              )}
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4 animate-in slide-in-from-right-5 duration-300">
                  <input 
                    {...register(`variants.${index}.label` as const, { required: true })} 
                    placeholder="Nom (ex: XL)" 
                    className="flex-1 px-6 py-4 bg-slate-50 rounded-[20px] border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-700 shadow-inner" 
                  />
                  <input 
                    {...register(`variants.${index}.price` as const, { valueAsNumber: true })} 
                    type="number" 
                    placeholder="+0"
                    className="w-28 px-4 py-4 bg-slate-50 rounded-[20px] text-center font-black text-indigo-600 border-2 border-transparent focus:border-indigo-500 outline-none shadow-inner" 
                  />
                  <button type="button" onClick={() => remove(index)} className="p-3 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* BOUTON FINAL */}
          <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto px-12 py-5 rounded-[25px] font-black text-[10px] uppercase tracking-[3px] transition-all flex items-center justify-center gap-3 shadow-2xl
                ${isSubmitting ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200'}`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isSubmitting ? text.processing : text.submit}
          </button>
        </div>
      </form>
    </div>
  );
}
