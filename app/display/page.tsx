"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

import { useCatalogStore } from "@/src/features/catalog/store/catalog.store";

import { getImageUrl } from "@/src/utils/helpers/getImageUrl";

export default function TVDisplayPage() {
  const { products, fetchCatalog } = useCatalogStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // 1. Refresh automatique des données (toutes les 30s)
  useEffect(() => {
    fetchCatalog();
    const interval = setInterval(() => fetchCatalog(), 30000);
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => { clearInterval(interval); clearInterval(clock); };
  }, []);

  // 2. On filtre uniquement ce qui est activé pour la TV
  const tvProducts = products.filter(p => p.is_active);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0a0a0b] text-white grid grid-cols-[1fr_25%] grid-rows-[12%_1fr_13%] font-sans">
      
      {/* --- HAUT (10-12%) : HEADER --- */}
      <header className="col-span-1 border-b border-white/5 flex items-center px-12 bg-[#0f0f12]">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-2xl">
            <img src="/mq/petitdejeuner.jpg" alt="Logo" className="object-contain" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Menu <span className="text-indigo-500">Digital</span>
          </h1>
        </div>
        <div className="ml-auto flex items-center gap-4 text-2xl font-bold text-slate-400">
           <Clock className="text-indigo-500" />
           {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </header>

      {/* --- DROITE (25%) : SIDEBAR INFO & QR --- */}
      <aside className="row-span-2 col-start-2 border-l border-white/5 bg-[#0f0f12] p-10 flex flex-col items-center justify-between text-center">
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[4px] text-indigo-400">Scanner & Commander</p>
            <div className="bg-white p-6 rounded-[40px] shadow-2xl shadow-indigo-500/10 inline-block">
               {/* Ici ton composant QRCode qui pointe vers le menu client */}
               <div className="w-40 h-40 bg-slate-100 rounded-2xl" /> 
            </div>
          </div>

          <div className="bg-white/5 p-8 rounded-[35px] border border-white/5 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">Accès WiFi Gratuit</p>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-medium">Réseau : <span className="text-white font-bold italic">BURGER_WIFI</span></p>
              <p className="text-xs text-slate-400 font-medium">Pass : <span className="text-white font-bold italic">resto2026</span></p>
            </div>
          </div>
        </div>

        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-loose">
          Suivez-nous sur Instagram<br/>
          <span className="text-white text-sm">@MonRestaurant_Officiel</span>
        </div>
      </aside>

      {/* --- MILIEU (CONTENU) : LA CUISINE --- */}
      <main className="p-12 overflow-hidden">
        <div className="grid grid-cols-2 gap-8 h-full">
          {tvProducts.map((product) => (
            <div key={product.id} className="relative group bg-white/5 border border-white/5 rounded-[45px] p-6 flex items-center gap-8 animate-in fade-in zoom-in duration-700">
              {/* Image avec Badge Promo si Featured */}
              <div className="relative w-44 h-44 shrink-0">
                <img src={getImageUrl(product.image)}  className="w-full h-full object-cover rounded-[35px] shadow-2xl" />
                {product.is_featured && (
                  <div className="absolute -top-3 -left-3 bg-amber-400 text-black font-black text-[10px] px-4 py-2 rounded-full shadow-xl rotate-[-10deg]">
                    TOP VENTE 🔥
                  </div>
                )}
              </div>

              {/* Infos Produit */}
              <div className="flex-1 space-y-2">
                <h2 className="text-3xl font-black tracking-tight leading-tight">{product.name}</h2>
                <p className="text-slate-400 text-sm font-medium line-clamp-2 leading-relaxed">
                  {product.short_description || "Une explosion de saveurs artisanales."}
                </p>
                <div className="flex items-center gap-4 pt-2">
                   <span className="text-4xl font-black text-indigo-400">{product.price}<small className="text-sm ml-1 uppercase">Mad</small></span>
                   {product.note && <span className="bg-white/10 text-[9px] px-3 py-1 rounded-full text-slate-300 font-bold italic tracking-wide">Chef's Note</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- BAS (13%) : FOOTER / MARQUEE --- */}
      <footer className="col-span-1 border-t border-white/5 bg-black flex items-center overflow-hidden">
        <div className="whitespace-nowrap flex items-center gap-20 animate-marquee">
          <p className="text-3xl font-black italic text-indigo-500 uppercase tracking-tighter">
            PROMO FLASH : -20% SUR TOUS LES DESSERTS JUSQU'À 18H ! 🍰
          </p>
          <p className="text-3xl font-black italic text-white uppercase tracking-tighter">
            BIENVENUE CHEZ NOUS - ENJOY YOUR MEAL - BON APPÉTIT ! 🍟
          </p>
          {/* Répéter pour l'effet de boucle infinie */}
          <p className="text-3xl font-black italic text-indigo-500 uppercase tracking-tighter">
            PROMO FLASH : -20% SUR TOUS LES DESSERTS JUSQU'À 18H ! 🍰
          </p>
        </div>
      </footer>
    </div>
  );
}