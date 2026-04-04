"use client";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { Star, Flame } from "lucide-react";
import { TemplateProps } from "@/src/types/players/player.type";

export default function FullPromoTemplate({ manifest, currentProduct }: TemplateProps) {
  // Sécurité pour éviter les crashs si currentProduct est undefined
  if (!currentProduct) return null;

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden relative flex items-center justify-center font-sans">
      
      {/* BACKGROUND: Soft Animated Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] bg-amber-600/20 blur-[120px] rounded-full"
        />
        <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-black to-transparent z-10" />
      </div>

      {/* MAIN CONTAINER (Safe Zone 8% padding) */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between p-[8vh]">
        
        {/* HEADER: Badge Dynamique */}
        <div className="w-full flex justify-center">
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-2xl shadow-xl"
          >
            <Flame className="w-6 h-6 text-orange-600" fill="currentColor" />
            <span className="font-black text-xl uppercase tracking-[0.3em]">
              {manifest?.label || "Suggestion du Chef"}
            </span>
          </motion.div>
        </div>

        {/* MIDDLE: Product & Info */}
        <div className="flex-1 grid grid-cols-2 gap-12 items-center">
          
          {/* Image avec Animation "Floating" */}
          <div className="flex justify-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct.id}
                initial={{ x: -100, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 100, opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="relative z-30"
              >
                <img
                  src={getImageUrl(currentProduct.image)}
                  className="max-h-[55vh] w-auto object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.9)]"
                  alt={currentProduct.name}
                />
              </motion.div>
            </AnimatePresence>
            {/* Halo derrière l'image */}
            <div className="absolute inset-0 bg-amber-500/10 blur-[100px] rounded-full scale-110" />
          </div>

          {/* Text Content */}
          <div className="flex flex-col space-y-6 text-left">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              key={`info-${currentProduct.id}`}
            >
              <h2 className="text-amber-500 font-bold text-2xl uppercase tracking-widest mb-2 flex items-center gap-2">
                <Star size={20} fill="currentColor" /> Exclusive Selection
              </h2>
              <h1 className="text-[6vw] font-black leading-[0.95] mb-6 uppercase italic">
                {currentProduct.name}
              </h1>
              <p className="text-2xl text-gray-400 font-medium leading-relaxed max-w-xl border-l-4 border-amber-600 pl-6">
                {currentProduct.description}
              </p>
            </motion.div>

            {/* PRICE TAG: Massive & Professional */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-baseline gap-4 pt-4"
            >
              <span className="text-[10vw] font-black text-white leading-none tracking-tighter shadow-black drop-shadow-2xl">
                {currentProduct.price}
              </span>
              <span className="text-5xl font-light text-amber-500 uppercase tracking-tighter">Dh</span>
            </motion.div>
          </div>
        </div>

        {/* FOOTER: Professional Branding */}
        <div className="w-full border-t border-white/10 pt-8 flex justify-between items-center text-gray-500 uppercase text-sm tracking-[0.2em] font-bold">
          <div>Qimo Digital Signage — TV Player</div>
          <div className="flex gap-8">
             <span>Live Refresh Active</span>
             <span className="text-amber-600">● {manifest?.category_name}</span>
          </div>
        </div>

      </div>

      {/* Glassmorphism Border Overlay */}
      <div className="absolute inset-0 border-[20px] border-white/5 pointer-events-none z-50" />
    </div>
  );
}