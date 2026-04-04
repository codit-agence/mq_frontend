"use client";

import React, { useEffect } from "react";
import { useCatalogStore } from "@/src/features/catalog/store/catalog.store";
import { useDisplayStore } from "@/src/features/display/display.store";
import { Monitor, Power, Loader2, Lock } from "lucide-react"; // Ajout de Lock
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

export default function DisplayContent() {
  const { toggleTvVisibility, toggleCategoryVisibility, loadingId } = useDisplayStore();
  const { categories, products, fetchCatalog } = useCatalogStore();

  useEffect(() => {
    if (products.length === 0 || categories.length === 0) fetchCatalog();
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10">
      
      {/* HEADER (Identique) */}
      <div className="bg-slate-900 rounded-[40px] p-8 text-white flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-3xl flex items-center justify-center text-indigo-400">
            <Monitor size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Régie d'Affichage</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[3px]">Configuration du flux TV</p>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {categories.map((cat) => {
          const isCategoryDisabled = !cat.is_active;

          return (
            <div key={cat.id} className={`space-y-6 transition-opacity ${isCategoryDisabled ? 'opacity-60' : 'opacity-100'}`}>
              
              {/* --- HEADER CATÉGORIE AVEC BTN --- */}
              <div className={`flex items-center justify-between p-6 rounded-[30px] border-2 transition-all ${!isCategoryDisabled ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-100 border-slate-200'}`}>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{"🍽️"}</span>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">{cat.name}</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">
                      {isCategoryDisabled ? "Flux désactivé pour cette section" : "Flux actif"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleCategoryVisibility(cat.id, !!cat.is_active)}
                  disabled={loadingId === cat.id}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md
                    ${!isCategoryDisabled 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-slate-400 text-white hover:bg-slate-500'}`}
                >
                  {loadingId === cat.id ? <Loader2 className="animate-spin" size={16} /> : <Power size={16} />}
                  {isCategoryDisabled ? "Activer la Catégorie" : "Désactiver la Catégorie"}
                </button>
              </div>

              {/* --- GRILLE PRODUITS --- */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products
                  .filter((p) => p.category_id === cat.id)
                  .map((product) => {
                    // Logique : Si catégorie OFF, le produit est forcé en gris (disabled)
                    const isLocked = isCategoryDisabled;
                    const isActive = product.is_active && !isLocked;

                    return (
                      <div 
                        key={product.id}
                        className={`relative p-5 rounded-[32px] border-2 transition-all duration-300 flex items-center justify-between
                          ${isActive 
                            ? 'bg-white border-indigo-500 shadow-xl shadow-indigo-100' 
                            : 'bg-slate-100 border-transparent grayscale text-slate-400'}`} // Grayscale si inactif
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white overflow-hidden shadow-sm border border-slate-100 relative">
                            <img src={getImageUrl(product.image)} className="w-full h-full object-cover" alt="" />
                            {loadingId === product.id && (
                              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                <Loader2 className="animate-spin text-indigo-600" size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className={`font-black text-sm leading-tight mb-1 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                {product.name}
                            </h4>
                            <div className="flex items-center gap-2">
                                {isLocked ? (
                                    <span className="text-[9px] font-bold uppercase text-rose-400 flex items-center gap-1">
                                        <Lock size={10} /> Catégorie Bloquée
                                    </span>
                                ) : (
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                                        {isActive ? '● En diffusion' : '○ Masqué'}
                                    </p>
                                )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => !isLocked && toggleTvVisibility(product.id, product.is_active)}
                          disabled={loadingId === product.id || isLocked}
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg
                            ${isLocked 
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                                : isActive 
                                    ? 'bg-slate-900 text-white hover:bg-rose-500' 
                                    : 'bg-white text-slate-300 border border-slate-200 hover:text-indigo-500'}`}
                        >
                          <Power size={20} strokeWidth={3} />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}