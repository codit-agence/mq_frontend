"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useCatalogStore } from "@/src/features/catalog/store/catalog.store";
import { useProductForm } from "@/src/features/catalog/store/useProductForm";
import { ProductUpdate } from "@/src/types/catalogs/catalog_types";

import { catalogService } from "@/src/features/catalog/catalog.services";

import { ArrowLeft, Loader2, Save, Plus, Trash2, Info, Globe, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";

// Support des 4 langues
type Lang = "fr" | "ar" | "en" | "es";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, fetchCatalog } = useCatalogStore();
  
  const [initialData, setInitialData] = useState<ProductUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState<Lang>("fr");

  // 1. Chargement intelligent (Store d'abord, API sinon)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const found = products.find(p => p.id === id) as unknown as ProductUpdate;
        if (found) {
          setInitialData(found);
        } else {
          const data = await catalogService.getProductById(id as string);
          setInitialData(data);
        }
      } catch (err) {
        toast.error("Impossible de charger le produit");
        router.push("/dashboard/menu");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, products, router]);

  // 2. Initialisation du Hook de formulaire
  const { 
    register, handleSubmit, preview, handleImageChange, 
    categories, isSubmitting, fields, append, remove 
  } = useProductForm(initialData, () => router.push("/dashboard/menu"));

  if (loading) return (
    <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
      <p className="text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Chargement du produit...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 pb-40">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => router.back()} 
            className="group p-4 bg-white rounded-[22px] shadow-sm border border-slate-100 hover:bg-indigo-600 transition-all duration-300"
          >
            <ArrowLeft size={20} className="text-slate-500 group-hover:text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Édition <span className="text-indigo-600 italic">Produit</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[3px] mt-1">International Dashboard</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* --- COLONNE GAUCHE (Params Fixes) --- */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* IMAGE SECTION */}
          <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
            <span className="text-[10px] font-black uppercase text-slate-400 block mb-5 tracking-widest px-2">Visuel Principal</span>
            <label className="relative block aspect-square bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer group hover:border-indigo-400 transition-colors">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3">
                  <Plus size={40} strokeWidth={1.5} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Upload Photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <div className="bg-white/90 p-3 rounded-full shadow-xl"><Plus size={20} className="text-indigo-600" /></div>
              </div>
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>

          {/* PRIX & CATÉGORIE */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest px-1 text-center lg:text-left">Prix (MAD)</label>
              <input 
                {...register("price")} 
                type="number" 
                step="0.01" 
                className="w-full px-6 py-5 bg-slate-50 rounded-[22px] border-2 border-transparent focus:border-indigo-500 outline-none font-black text-2xl text-indigo-600 text-center lg:text-left shadow-inner transition-all" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest px-1">Catégorie</label>
              <select 
                {...register("category_id")} 
                className="w-full px-6 py-5 bg-slate-50 rounded-[22px] border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-700 appearance-none shadow-inner"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE (Contenu Multilingue) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-xl shadow-slate-200/40">
            {/* SELECTEUR DE LANGUE */}
            <div className="flex bg-slate-100 p-2 rounded-[22px] w-fit mb-10 border border-slate-200/30">
              {(["fr", "ar", "en", "es"] as Lang[]).map(l => (
                <button 
                  key={l} type="button" onClick={() => setActiveLang(l)} 
                  className={`px-7 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${activeLang === l ? "bg-white text-indigo-600 shadow-lg scale-105" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {l === "fr" ? "Français 🇫🇷" : l === "ar" ? "العربية 🇲🇦" : l === "en" ? "English 🇬🇧" : "Español 🇪🇸"}
                </button>
              ))}
            </div>

            {/* CHAMPS DYNAMIQUES */}
            <div className={`space-y-8 ${activeLang === "ar" ? "text-right" : "text-left"}`} dir={activeLang === "ar" ? "rtl" : "ltr"}>
              
              {/* NOM */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2 tracking-widest">Nom du produit</label>
                <input 
                   {...register(activeLang === "fr" ? "name" : `name_${activeLang}` as any)} 
                   placeholder="Ex: Tajine au citron..."
                   className="w-full px-8 py-5 bg-slate-50 rounded-[25px] border-2 border-transparent focus:border-indigo-500 outline-none font-black text-xl text-slate-900 transition-all shadow-inner" 
                />
              </div>

              {/* SHORT DESCRIPTION */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2 tracking-widest">Slogan / Accroche courte</label>
                <input 
                   {...register(activeLang === "fr" ? "short_description" : `short_description_${activeLang}` as any)} 
                   placeholder="Le secret du Chef..."
                   className="w-full px-8 py-5 bg-slate-50 rounded-[25px] border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-600 shadow-inner" 
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2 tracking-widest">Description complète</label>
                <textarea 
                   {...register(activeLang === "fr" ? "description" : `description_${activeLang}` as any)} 
                   rows={4}
                   placeholder="Décrivez les saveurs et les ingrédients..."
                   className="w-full px-8 py-5 bg-slate-50 rounded-[25px] border-2 border-transparent focus:border-indigo-500 outline-none font-medium text-slate-600 shadow-inner" 
                />
              </div>

              {/* NOTE */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-indigo-400 px-2 tracking-widest flex items-center gap-2">
                  <Info size={14} /> Note importante ou conseil
                </label>
                <input 
                   {...register(activeLang === "fr" ? "note" : `note_${activeLang}` as any)} 
                   placeholder="Ex: Disponible seulement le Vendredi..."
                   className="w-full px-8 py-4 bg-indigo-50/30 rounded-[20px] border-2 border-transparent focus:border-indigo-200 outline-none text-sm font-semibold italic text-indigo-900 shadow-sm" 
                />
              </div>
            </div>
          </div>

          {/* VARIANTES SECTION */}
          <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-[3px]">Options & Variantes</h3>
              </div>
              <button 
                type="button" 
                onClick={() => append({ label: "", price: 0, is_default: false })} 
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-full font-black text-[10px] hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Plus size={16} /> AJOUTER
              </button>
            </div>
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4 animate-in slide-in-from-right-10 duration-500">
                  <div className="flex-1 relative group">
                    <input 
                      {...register(`variants.${index}.label` as const)} 
                      placeholder="Ex: Sans Oignon, XL..." 
                      className="w-full px-6 py-4 bg-slate-50 rounded-[20px] border-2 border-transparent focus:border-indigo-500 outline-none text-sm font-black text-slate-700 shadow-inner" 
                    />
                  </div>
                  <div className="w-32 relative">
                    <input 
                      {...register(`variants.${index}.price` as const)} 
                      type="number" 
                      placeholder="+ 0" 
                      className="w-full px-4 py-4 bg-slate-50 rounded-[20px] border-2 border-transparent focus:border-indigo-500 outline-none text-sm font-black text-indigo-600 text-center shadow-inner" 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => remove(index)} 
                    className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {fields.length === 0 && (
                <div className="py-12 border-2 border-dashed border-slate-100 rounded-[30px] flex flex-col items-center justify-center text-slate-400 gap-2">
                   <p className="text-[10px] font-black uppercase tracking-widest">Aucune option configurée</p>
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-8 bg-slate-900 text-white rounded-[40px] font-black text-xl shadow-2xl hover:bg-indigo-600 hover:shadow-indigo-200/50 active:scale-[0.98] transition-all duration-500 disabled:bg-slate-200 flex items-center justify-center gap-4 group"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={28} />
            ) : (
              <Save size={28} className="group-hover:rotate-12 transition-transform duration-300" />
            )}
            <span className="tracking-tight uppercase">
              {isSubmitting ? "Enregistrement en cours..." : "Mettre à jour le produit"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}