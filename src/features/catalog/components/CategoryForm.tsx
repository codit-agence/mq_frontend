"use client";

import React, { useState } from "react";
import { useCatalogStore } from "@/src/features/catalog/store/catalog.store"; // ✅ Utilise le bon import
import { Loader2 } from "lucide-react";

interface CategoryFormProps {
  onSuccess: () => void;
}

export const CategoryForm = ({ onSuccess }: CategoryFormProps) => {
  // ✅ On récupère l'action et l'état de chargement directement du store
  const { createCategory, loading } = useCatalogStore();
  
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍔");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // ✅ Utilise l'action du store qui gère déjà l'ajout dans la liste
      await createCategory({ 
        name, 
        image: emoji, 
        is_active: true, 
        order: 0 
      });
      
      onSuccess();
    } catch (err) {
      // L'erreur est généralement gérée dans le store, mais on peut ajouter un feedback ici
      console.error("Erreur creation categorie:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 py-4">
      {/* Icon Selector */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-5xl p-6 bg-slate-50 rounded-[35px] border-2 border-slate-100 shadow-inner group hover:border-indigo-200 transition-all">
           <input 
             value={emoji}
             maxLength={2} // Limite à un emoji
             onChange={(e) => setEmoji(e.target.value)}
             className="w-16 text-center bg-transparent outline-none cursor-pointer"
             title="Cliquez pour changer l'icône"
           />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Icône / Emoji</p>
      </div>

      {/* Input Name */}
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-wider">
          Nom du groupe / Catégorie
        </label>
        <input 
          required
          placeholder="Ex: Entrées Chaudes"
          className="w-full p-5 bg-slate-50 border-none rounded-[24px] font-bold text-lg outline-indigo-500 transition-all"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit"
        disabled={loading || !name}
        className="w-full py-5 bg-slate-900 text-white rounded-[28px] font-black shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          "CRÉER LA CATÉGORIE"
        )}
      </button>
    </form>
  );
};