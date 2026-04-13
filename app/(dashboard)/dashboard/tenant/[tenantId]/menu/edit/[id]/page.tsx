"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCatalogStore } from "@/src/projects/client-dashboard/catalog/store/catalog.store";
import { useProductForm } from "@/src/projects/client-dashboard/catalog/store/useProductForm";
import { useAuthStore } from "@/src/projects/client-dashboard/account/store/useAuthStore";
import { useSettingsStore } from "@/src/projects/client-dashboard/settings/store/useSettingStore";
import { catalogService } from "@/src/projects/client-dashboard/catalog/catalog.services";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { ArrowLeft, Loader2, Save, Trash2, ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";

type Lang = "fr" | "ar" | "en" | "es";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, categories } = useCatalogStore();
  const { tenant } = useAuthStore();
  const { formData } = useSettingsStore();

  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const activeLanguages = (formData?.display?.active_languages || ["fr"]) as Lang[];
  const defaultLanguage = (formData?.display?.default_language as Lang) || activeLanguages[0] || "fr";
  const [activeLang, setActiveLang] = useState<Lang>(defaultLanguage);
  const isOwner = tenant?.role === "owner";
  const catalogRestricted = !!formData?.display?.catalog_client_restricted;
  const readonlyMode = catalogRestricted && !isOwner;

  useEffect(() => {
    if (!activeLanguages.includes(activeLang)) {
      setActiveLang(defaultLanguage);
    }
  }, [activeLanguages, activeLang, defaultLanguage]);

  // 1. Chargement robuste du produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const found = products.find((p) => p.id === id);
        if (found) {
          setInitialData(found);
        } else {
          const data = await catalogService.getProductById(id as string);
          setInitialData(data);
        }
      } catch (err) {
        toast.error("Produit introuvable");
        router.push(`/dashboard/tenant/${tenant?.id}/menu`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, products, tenant?.id, router]);

  // 2. Hook de formulaire
  const {
    register, handleSubmit, preview, handleImageChange,
    isSubmitting, fields, append, remove, formState: { errors }
  } = useProductForm(initialData, () => {
    router.push(`/dashboard/tenant/${tenant?.id}/menu`);
  });

  // Calcul de l'image (Memoïsé pour éviter les clignotements)
  const displayImage = useMemo(() => {
    if (preview) return preview;
    if (initialData?.image) return getImageUrl(initialData.image);
    return null;
  }, [preview, initialData?.image]);

  if (readonlyMode) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-3xl rounded-3xl border border-rose-200 bg-white p-12 text-center shadow-xl">
        <h1 className="text-3xl font-black text-rose-600 mb-4">Accès restreint</h1>
        <p className="text-sm text-slate-600 mb-8">Le catalogue est verrouillé pour les clients. Seuls les propriétaires peuvent modifier ou mettre à jour ce produit.</p>
        <button onClick={() => router.push(`/dashboard/tenant/${tenant?.id}/menu`)} className="px-8 py-4 rounded-3xl bg-slate-900 text-white font-black uppercase tracking-[0.2em]">Retour au menu</button>
      </div>
    </div>
  );

  if (loading || !initialData) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Chargement...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 pb-40">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button onClick={() => router.back()} className="p-4 bg-white rounded-[22px] shadow-sm border border-slate-100 hover:bg-indigo-600 group transition-all">
            <ArrowLeft size={20} className="text-slate-500 group-hover:text-white" />
          </button>
          <h1 className="text-3xl font-black text-slate-900">
            Édition <span className="text-indigo-600 italic">Produit</span>
          </h1>
        </div>
      </div>

      {activeLanguages.length > 0 && (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-xs font-black uppercase tracking-wider text-amber-700">
            Champs obligatoires multilingues
          </p>
          <p className="mt-1 text-sm text-amber-800">
            Pour enregistrer, vous devez remplir `Nom` et `Description` dans chaque langue active ({activeLanguages.join(", ")}).
            Sinon, modifiez `Active languages` dans Parametres &gt; Design.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLONNE GAUCHE : IMAGE & PRIX */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
            <label className="relative block aspect-square bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer group">
              {displayImage ? (
                <img src={displayImage} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3">
                  <ImageIcon size={40} />
                  <span className="text-[9px] font-black">AJOUTER IMAGE</span>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block px-1 mb-2">Prix (MAD)</label>
              <input 
                {...register("price", { required: true })} 
                type="number" step="0.01"
                className="w-full px-6 py-4 bg-slate-50 rounded-[20px] font-black text-xl text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block px-1 mb-2">Catégorie</label>
              <select 
                {...register("category_id")} 
                className="w-full px-6 py-4 bg-slate-50 rounded-[20px] font-bold outline-none"
              >
                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : CONTENU MULTILINGUE & VARIANTES */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-[50px] border border-slate-100 shadow-xl">
            {/* TABS LANGUES */}
            <div className="flex bg-slate-100 p-1.5 rounded-[22px] mb-8 w-fit">
              {activeLanguages.map((l) => (
                <button key={l} type="button" onClick={() => setActiveLang(l)} 
                  className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase transition-all ${activeLang === l ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}>
                  {l === "fr" ? "Français" : l === "ar" ? "العربية" : l === "en" ? "English" : "Español"}
                </button>
              ))}
            </div>

            <div className="space-y-6" dir={activeLang === "ar" ? "rtl" : "ltr"}>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2 mb-2">Nom ({activeLang})</label>
                <input 
                  {...register(activeLang === "fr" ? "name" : `name_${activeLang}` as any)} 
                  className="w-full px-6 py-4 bg-slate-50 rounded-[22px] font-bold text-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2 mb-2">Courte description ({activeLang})</label>
                <input
                  {...register(activeLang === "fr" ? "short_description" : `short_description_${activeLang}` as any)}
                  className="w-full px-6 py-4 bg-slate-50 rounded-[22px] border-2 border-transparent focus:border-indigo-500 outline-none shadow-inner"
                  placeholder="Résumé court pour le menu"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2 mb-2">Description ({activeLang})</label>
                <textarea 
                  {...register(activeLang === "fr" ? "description" : `description_${activeLang}` as any)} 
                  rows={4}
                  className="w-full px-6 py-4 bg-slate-50 rounded-[22px] font-medium outline-none focus:border-indigo-500 shadow-inner resize-none" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2 mb-2">Note interne ({activeLang})</label>
                <input
                  {...register(activeLang === "fr" ? "note" : `note_${activeLang}` as any)}
                  className="w-full px-6 py-4 bg-slate-50 rounded-[22px] border-2 border-transparent focus:border-indigo-500 outline-none shadow-inner"
                  placeholder="Note équipe cuisine, allergènes..."
                />
              </div>
            </div>
          </div>

          {/* VARIANTES */}
          <div className="bg-white p-8 md:p-10 rounded-[50px] border border-slate-100 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Variantes</h3>
              <button type="button" onClick={() => append({ label: "", price: 0 })} className="text-[10px] font-black text-indigo-600 hover:underline">+ AJOUTER</button>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <input {...register(`variants.${index}.label` as const)} placeholder="Taille, Option..." className="flex-1 px-5 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none" />
                  <input {...register(`variants.${index}.price` as const)} type="number" placeholder="+0" className="w-24 px-3 py-3 bg-slate-50 rounded-xl text-center font-black text-indigo-600 outline-none" />
                  <button type="button" onClick={() => remove(index)} className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-6 bg-slate-900 text-white rounded-[32px] font-black text-lg shadow-xl hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
            <span>{isSubmitting ? "ENREGISTREMENT..." : "SAUVEGARDER LES MODIFICATIONS"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
