"use client";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { Wifi, QrCode } from "lucide-react";
import { TemplateProps } from "@/src/types/players/player.type";


export default function BrandedTemplate({ manifest, currentProduct, tenant }: TemplateProps) {
  
  // 1. Sécurité : Si les données ne sont pas encore là, on affiche un état vide propre
  if (!currentProduct || !tenant) {
    return <div className="h-screen w-screen bg-[#0f1115]" />; 
  }

  return (
    <div className="h-screen w-screen bg-[#0f1115] text-white overflow-hidden flex flex-col font-sans">
      
      {/* --- HEADER (10%) --- */}
      <header className="h-[10vh] w-full bg-white text-black flex items-center justify-between px-[4vw] shadow-2xl z-50">
        <div className="flex items-center gap-6">
          {/* Utilisation du chaînage optionnel pour le logo */}
          <img 
            src={getImageUrl(tenant?.logo || "")} 
            className="h-[6vh] w-auto object-contain" 
            alt="Logo" 
          />
          <div className="h-[4vh] w-[2px] bg-gray-200" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">
            {tenant?.name || "Établissement"}
          </h2>
        </div>
      </header>

      {/* --- MIDDLE SECTION --- */}
      <div className="flex-1 flex w-full overflow-hidden">
        
        {/* ZONE PRODUIT (80% de largeur) */}
        <main className="relative flex-1 flex items-center p-[4vw]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentProduct.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="grid grid-cols-12 w-full items-center gap-12"
            >
              {/* Image Produit */}
              <div className="col-span-6 flex justify-center relative">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full scale-125" />
                <img 
                  src={getImageUrl(currentProduct.image)} 
                  className="max-h-[50vh] w-auto object-contain drop-shadow-2xl z-10" 
                  alt={currentProduct.name}
                />
              </div>

              {/* Info Produit */}
              <div className="col-span-6 space-y-6">
                <span className="bg-indigo-600 text-white px-4 py-1 rounded-lg text-sm font-black uppercase tracking-widest">
                   {currentProduct.category_name || manifest.category_name}
                </span>
                <h1 className="text-[5.5vw] font-black leading-none uppercase tracking-tighter">
                  {currentProduct.name}
                </h1>
                <p className="text-xl text-gray-400 font-medium max-w-md border-l-4 border-indigo-500 pl-6">
                  {currentProduct.description}
                </p>
                <div className="text-[8vw] font-black text-white italic flex items-baseline gap-2">
                  {currentProduct.price} <span className="text-3xl not-italic text-indigo-400">DH</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* SIDEBAR DROITE (20% de largeur) */}
        <aside className="w-[20vw] bg-black/30 border-l border-white/5 flex flex-col items-center justify-center p-8 gap-12 text-center">
          
          {/* QR CODE SECTION */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-3xl shadow-xl inline-block">
               <QrCode size={120} className="text-black" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Scanner pour commander</p>
          </div>

          {/* WIFI SECTION */}
          <div className="bg-white/5 p-6 rounded-[2rem] w-full border border-white/10">
            <Wifi size={32} className="mx-auto mb-4 text-indigo-500" />
            <h4 className="text-[0.6vw] font-black uppercase text-gray-500 mb-1">Accès WiFi Gratuit</h4>
            {/* Fallbacks pour éviter les erreurs si les champs WiFi sont vides dans la DB */}
            <div className="text-[1vw] font-bold truncate">{tenant?.wifi_name || "Qimo_Guest"}</div>
            <div className="text-[0.8vw] font-mono text-indigo-300 mt-2">{tenant?.wifi_password || "12345678"}</div>
          </div>

        </aside>
      </div>

      {/* --- FOOTER (10%) --- */}
      <footer className="h-[10vh] w-full bg-indigo-700 flex items-center overflow-hidden border-t-4 border-indigo-500">
        <div className="bg-black h-full flex items-center px-8 z-20 shadow-2xl">
          <span className="font-black italic text-xl uppercase text-white whitespace-nowrap">OFFRES DU JOUR :</span>
        </div>
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 items-center pl-10"
        >
          <span className="text-2xl font-bold uppercase tracking-tighter">
             🔥 -20% sur tous les menus Burgers le Vendredi • 🥤 Une boisson offerte pour l'achat d'un grand Tacos • 🚀 Livraison gratuite via l'App Qimo •
          </span>
          <span className="text-2xl font-bold uppercase tracking-tighter">
             🔥 -20% sur tous les menus Burgers le Vendredi • 🥤 Une boisson offerte pour l'achat d'un grand Tacos • 🚀 Livraison gratuite via l'App Qimo •
          </span>
        </motion.div>
      </footer>
    </div>
  );
}