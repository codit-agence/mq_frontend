"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCatalogStore } from "@/src/features/catalog/store/catalog.store";
import { useProductForm } from "@/src/features/catalog/store/useProductForm";
import { ProductUpdate } from "@/src/types/catalogs/catalog_types";
import { catalogService } from "@/src/features/catalog/catalog.services";
// Importe ta fonction utilitaire pour les images
import { ArrowLeft, Loader2, Save, Plus, Trash2, Info, ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/src/features/account/store/useAuthStore";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

type Lang = "fr" | "ar" | "en" | "es";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products } = useCatalogStore();
  const { tenant } = useAuthStore();
  
  const [initialData, setInitialData] = useState<ProductUpdate | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState<Lang>("fr");
  const [serverImage, setServerImage] = useState<string | null>(null);

  // 1. Chargement du produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const found = products.find(p => p.id === id) as unknown as ProductUpdate;
        let data = found;
        if (!found) {
          data = await catalogService.getProductById(id as string);
        }
        setInitialData(data);
        // On stocke l'image venant du serveur
        if (data.image) {
          setServerImage(getImageUrl(data.image));
        }
      } catch (err) {
        toast.error("Impossible de charger le produit");
        if (tenant?.id) router.push(`/dashboard/tenant/${tenant.id}/menu`);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, products, tenant?.id]);

  // 2. Initialisation du Hook avec extraction de 'errors'
  const { 
    register, handleSubmit, preview, handleImageChange, 
    categories, isSubmitting, fields, append, remove,
    formState: { errors } // CRUCIAL pour afficher les erreurs
  } = useProductForm(initialData, () => {
    toast.success("Produit mis à jour");
    router.push(`/dashboard/tenant/${tenant?.id}/menu`);
  });

  // Priorité d'affichage : Nouvelle preview > Image Serveur > Icone vide
  const displayImage = preview || serverImage;

  if (loading) return (
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
          <div>
            <h1 className="text-3xl font-black text-slate-900">Édition <span className="text-indigo-600 italic">Produit</span></h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLONNE GAUCHE */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* IMAGE SECTION */}
          <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
            <label className="relative block aspect-square bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 overflow-hidden cursor-pointer group">
              {displayImage ? (
                <img src={displayImage} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-3">
                  <ImageIcon size={40} />
                  <span className="text-[9px] font-black uppercase">Changer la photo</span>
                </div>
              )}
              <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
            </label>
          </div>

          {/* PRIX & CATÉGORIE */}
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 block px-1">Prix (MAD) *</label>
              <input 
                {...register("price", { required: "Le prix est requis" })} 
                type="number" step="0.01" 
                className={`w-full px-6 py-5 bg-slate-50 rounded-[22px] border-2 outline-none font-black text-2xl text-indigo-600 shadow-inner transition-all ${errors.price ? 'border-rose-400' : 'border-transparent focus:border-indigo-500'}`} 
              />
              {errors.price && <p className="text-rose-500 text-[10px] font-bold uppercase">{errors.price.message as string}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-400 block px-1">Catégorie *</label>
              <select 
                {...register("category_id", { required: "Sélectionnez une catégorie" })} 
                className="w-full px-6 py-5 bg-slate-50 rounded-[22px] border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-700 shadow-inner"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-xl">
            {/* TABS LANGUES */}
            <div className="flex bg-slate-100 p-2 rounded-[22px] mb-10 overflow-x-auto">
              {(["fr", "ar", "en", "es"] as Lang[]).map(l => (
                <button key={l} type="button" onClick={() => setActiveLang(l)} 
                  className={`px-7 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-wider transition-all ${activeLang === l ? "bg-white text-indigo-600 shadow-md" : "text-slate-400"}`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-8" dir={activeLang === "ar" ? "rtl" : "ltr"}>
              {/* NOM */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2 italic">Nom du produit ({activeLang}) *</label>
                <input 
                   {...register(activeLang === "fr" ? "name" : `name_${activeLang}` as any, { 
                     required: activeLang === "fr" ? "Le nom français est obligatoire" : false 
                   })} 
                   placeholder="Ex: Tajine..."
                   className={`w-full px-8 py-5 bg-slate-50 rounded-[25px] border-2 outline-none font-black text-xl shadow-inner ${errors.name && activeLang === "fr" ? 'border-rose-400' : 'border-transparent focus:border-indigo-500'}`} 
                />
                {errors.name && activeLang === "fr" && <p className="text-rose-500 text-[10px] font-bold uppercase">{errors.name.message as string}</p>}
              </div>

              {/* DESCRIPTION COURTE */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2">Accroche courte</label>
                <input {...register(activeLang === "fr" ? "short_description" : `short_description_${activeLang}` as any)} className="w-full px-8 py-5 bg-slate-50 rounded-[25px] border-2 border-transparent focus:border-indigo-500 outline-none shadow-inner" />
              </div>

              {/* DESCRIPTION LONGUE */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 block px-2">Description complète</label>
                <textarea {...register(activeLang === "fr" ? "description" : `description_${activeLang}` as any)} rows={4} className="w-full px-8 py-5 bg-slate-50 rounded-[25px] border-2 border-transparent focus:border-indigo-500 outline-none shadow-inner" />
              </div>
            </div>
          </div>

          {/* VARIANTES */}
          <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-xl">
             <div className="flex justify-between mb-8">
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-[3px]">Options & Variantes</h3>
                <button type="button" onClick={() => append({ label: "", price: 0, is_default: false })} className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-full font-black text-[10px] hover:bg-indigo-600 hover:text-white transition-all">
                  + AJOUTER
                </button>
             </div>
             <div className="space-y-4">
               {fields.map((field, index) => (
                 <div key={field.id} className="flex gap-4 items-center">
                    <input {...register(`variants.${index}.label` as const, { required: true })} placeholder="Label" className={`flex-1 px-6 py-4 bg-slate-50 rounded-[20px] outline-none font-bold text-sm ${errors.variants?.[index]?.label ? 'border-2 border-rose-400' : ''}`} />
                    <input {...register(`variants.${index}.price` as const)} type="number" className="w-32 px-4 py-4 bg-slate-50 rounded-[20px] text-center font-black text-indigo-600" />
                    <button type="button" onClick={() => remove(index)} className="p-3 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
                 </div>
               ))}
             </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-8 bg-slate-900 text-white rounded-[40px] font-black text-xl shadow-2xl hover:bg-indigo-600 active:scale-[0.98] transition-all disabled:bg-slate-200 flex items-center justify-center gap-4"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={28} /> : <Save size={28} />}
            <span className="uppercase">{isSubmitting ? "Enregistrement..." : "Mettre à jour le produit"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}