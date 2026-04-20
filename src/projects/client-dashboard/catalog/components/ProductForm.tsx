"use client";

import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { useCatalogStore } from "@/src/projects/client-dashboard/catalog/store/catalog.store";
import { Product } from "@/src/types/catalogs/catalog_types";
import { Image as ImageIcon, Loader2, StickyNote } from "lucide-react";
import { getErrorMessage } from "@/src/utils/errors";

interface ProductFormProps {
  onSuccess: () => void;
  initialData?: Product | null;
}

export const ProductForm = ({ onSuccess, initialData }: ProductFormProps) => {
  // ✅ On utilise uniquement le store principal
  const { categories, createProduct, updateProduct, error } = useCatalogStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const [imageFile, setImageFile] = useState<File | undefined>();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    category_id: initialData?.category_id || (categories[0]?.id || ""),
    price: initialData?.price || 0,
    description: initialData?.description || "",
    note: initialData?.note || "",
    is_active: initialData?.is_active ?? true,
    variants: initialData?.variants || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanData = {
      ...formData,
      price: Number(formData.price),
      category_id: formData.category_id || categories[0]?.id 
    };

    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await updateProduct(initialData.id, cleanData as any, imageFile);
      } else {
        await createProduct(cleanData as any, imageFile);
      }
      onSuccess();
    } catch (err) {
      console.error("Erreur lors de la soumission", err);
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

 return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-bold uppercase">
          {error}
        </div>
      )}

      {/* 🟢 LAYOUT DEUX COLONNES SUR LARGE SCREEN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* COLONNE GAUCHE : IMAGE */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
            Visuel du produit
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative h-64 lg:h-[450px] w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[48px] flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-indigo-300 transition-all shadow-inner"
          >
            {imagePreview ? (
              <img src={imagePreview} className="h-full w-full object-cover" alt="Preview" />
            ) : (
              <div className="text-slate-400 flex flex-col items-center group-hover:text-indigo-500 transition-colors">
                <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                  <ImageIcon size={40} strokeWidth={1.5} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-tighter">Cliquer pour uploader</span>
                <span className="text-[9px] mt-1 opacity-50 italic">Format JPG, PNG ou WEBP</span>
              </div>
            )}
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if(file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
            }} />
          </div>
        </div>

        {/* COLONNE DROITE : INFOS */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Détails de l'article</label>
              <input 
                required 
                placeholder="Nom du plat (ex: Burger Deluxe)" 
                className="w-full p-6 bg-slate-50 border-none rounded-[28px] font-bold text-xl outline-indigo-500 shadow-inner"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select 
                className="p-6 bg-slate-50 border-none rounded-[28px] font-bold outline-indigo-500 appearance-none cursor-pointer shadow-inner"
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              
              <div className="relative">
                <input 
                  required 
                  type="number" 
                  placeholder="Prix" 
                  className="w-full p-6 bg-slate-50 border-none rounded-[28px] font-bold outline-indigo-500 shadow-inner"
                  value={formData.price || ""} 
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px]">MAD</span>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-amber-50/50 border border-amber-100 rounded-[28px]">
              <StickyNote size={24} className="text-amber-500 shrink-0" />
              <input 
                placeholder="Note cuisine interne..." 
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-amber-900 placeholder:text-amber-300"
                value={formData.note}
                onChange={(e) => setFormData({...formData, note: e.target.value})}
              />
            </div>

            <textarea 
              placeholder="Description pour les clients..."
              className="w-full p-6 bg-slate-50 border-none rounded-[28px] text-sm min-h-[150px] resize-none outline-indigo-500 shadow-inner"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* BOUTON EN BAS À DROITE */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 bg-indigo-600 text-white rounded-[32px] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : (initialData ? "Sauvegarder les modifications" : "Confirmer l'ajout au menu")}
          </button>
        </div>
      </div>
    </form>
  );
};