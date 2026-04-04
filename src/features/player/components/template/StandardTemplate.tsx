// src/features/player/templates/StandardTemplate.tsx
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/src/utils/helpers/getImageUrl";
import { Music, Wifi, Tag } from "lucide-react";
import {TemplateProps} from "@/src/types/schedule/schedule.type";

export default function StandardTemplate({ manifest, currentProduct }: TemplateProps) {
  return (
    <>
      {/* BACKGROUND */}
      <AnimatePresence mode="wait">
        <motion.img
          key={`bg-${currentProduct?.id}`}
          src={getImageUrl(currentProduct?.image)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 w-full h-full object-cover blur-2xl"
        />
      </AnimatePresence>

      {/* LAYOUT */}
      <main className="relative z-10 h-full grid grid-cols-12 gap-8 p-12">
        <div className="col-span-7 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentProduct?.id}
              src={getImageUrl(currentProduct?.image)}
              initial={{ x: -100, opacity: 0, scale: 0.8 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 100, opacity: 0, scale: 0.8 }}
              className="max-h-[80vh] rounded-[60px] shadow-2xl border-8 border-white/10"
            />
          </AnimatePresence>
        </div>

        <div className="col-span-5 flex flex-col justify-center space-y-8">
          <motion.div key={`info-${currentProduct?.id}`} className="space-y-4">
            <span className="px-6 py-2 bg-indigo-600 rounded-full text-sm font-black tracking-widest uppercase">
              {manifest?.category_name}
            </span>
            <h1 className="text-8xl font-black leading-tight">{currentProduct?.name}</h1>
            <p className="text-2xl text-slate-400 font-medium max-w-lg">{currentProduct?.description}</p>
          </motion.div>

          <div className="text-9xl font-black text-white italic">
            {currentProduct?.price}Dh
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="absolute bottom-0 w-full p-8 flex justify-between items-end bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-6 text-slate-400 text-sm font-bold">
          <div className="flex items-center gap-2"><Wifi size={18} /> WIFI: </div>
          <div className="flex items-center gap-2"><Music size={18} /> {manifest?.label}</div>
        </div>
      </footer>
    </>
  );
}