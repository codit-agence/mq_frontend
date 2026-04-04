"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProductForm } from "@/src/features/catalog/store/useProductForm";
import { 
  ArrowLeft, Loader2, Save, Plus, Trash2, 
  Info, ImageIcon, ChevronRight 
} from "lucide-react";

type Lang = "fr" | "ar" | "en" | "es";

export default function AddProductPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Utilisation du Hook : initialData est null pour une création
  const { 
    register, handleSubmit, preview, handleImageChange, 
    categories, isSubmitting, fields, append, remove 
  } = useProductForm(null, () => router.push(`/dashboard/menu/`));

  const [activeLang, setActiveLang] = useState<Lang>("fr");

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
              Nouveau <span className="text-indigo-600 italic">Produit</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[3px] mt-1">Création Catalogue</p>
          </div>
        </div>
      </div>

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
                  <span className="text-[9px] font-black uppercase tracking-widest">Ajouter une image</span>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>

          {/* PRIX & CATEGORIE */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest px-1">Prix (MAD)</label>
              <input 
                {...register("price")} 
                type="number" 
                step="0.01"
                placeholder="0.00"
                className="w-full px-6 py-5 bg-slate-50 rounded-[22px] border-2 border-transparent focus:border-indigo-500 outline-none font-black text-2xl text-indigo-600 shadow-inner" 
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 block tracking-widest px-1">Catégorie</label>
              <select 
                {...register("category_id")} 
                className="w-full px-6 py-5 bg-slate-50 rounded-[22px] border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-700 appearance-none shadow-inner"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE (Infos Multilingues & Variantes) --- */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-white p-6 md:p-10 rounded-[50px] border border-slate-100 shadow-xl shadow-slate-200/40">
            {/* TABS DE LANGUES */}
            <div className="flex bg-slate-100 p-2 rounded-[25px] gap-1 mb-10 overflow-x-auto">
              {(["fr", "ar", "en", "es"] as Lang[]).map(l => (
                <button 
                  key={l} type="button" onClick={() => setActiveLang(l)} 
                  className={`flex-1 min-w-[100px] py-3 rounded-[20px] text-[10px] font-black uppercase tracking-wider transition-all ${activeLang === l ? "bg-white text-indigo-600 shadow-md scale-105" : "text-slate-400 hover:text-slate-600"}`}
                >
                  {l === "fr" ? "Français 🇫🇷" : l === "ar" ? "العربية 🇲🇦" : l === "en" ? "English 🇬🇧" : "Español 🇪🇸"}
                </button>
              ))}
            </div>

            {/* INPUTS DYNAMIQUES */}
            <div className="space-y-8" dir={activeLang === "ar" ? "rtl" : "ltr"}>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2">Nom du produit ({activeLang})</label>
                <input 
                   {...register(activeLang === "fr" ? "name" : `name_${activeLang}` as any)} 
                   placeholder="Ex: Couscous Royal..."
                   className="w-full px-8 py-5 bg-slate-50 rounded-[25px] border-2 border-transparent focus:border-indigo-500 outline-none font-black text-xl shadow-inner" 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2">Description ({activeLang})</label>
                <textarea 
                   {...register(activeLang === "fr" ? "description" : `description_${activeLang}` as any)} 
                   rows={4}
                   className="w-full px-8 py-5 bg-slate-50 rounded-[25px] border-2 border-transparent focus:border-indigo-500 outline-none font-medium text-slate-600 shadow-inner" 
                />
              </div>
            </div>
          </div>

          {/* VARIANTES SECTION */}
          <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-[3px]">Options (Tailles, Suppléments...)</h3>
              <button 
                type="button" 
                onClick={() => append({ label: "", price: 0, is_default: false })} 
                className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-4 animate-in slide-in-from-right-5">
                  <input 
                    {...register(`variants.${index}.label` as const)} 
                    placeholder="Label (ex: XL)" 
                    className="flex-1 px-6 py-4 bg-slate-50 rounded-[20px] outline-none font-bold text-slate-700 shadow-inner" 
                  />
                  <input 
                    {...register(`variants.${index}.price` as const)} 
                    type="number" placeholder="+0"
                    className="w-28 px-4 py-4 bg-slate-50 rounded-[20px] text-center font-black text-indigo-600 shadow-inner" 
                  />
                  <button type="button" onClick={() => remove(index)} className="p-3 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors">
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
            className="w-full py-8 bg-slate-900 text-white rounded-[40px] font-black text-xl shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 disabled:bg-slate-200"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={28} /> : <Save size={28} />}
            <span className="uppercase tracking-widest">Enregistrer le produit</span>
          </button>
        </div>
      </form>
    </div>
  );
}