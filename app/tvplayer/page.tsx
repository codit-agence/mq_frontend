"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader2, VolumeX } from "lucide-react";
import { useDisplayStore } from "@/src/features/player/store/player.store";
import StandardTemplate from "@/src/features/player/components/template/StandardTemplate";
import FullPromoTemplate from "@/src/features/player/components/template/FullPromoTemplate";
import BrandedTemplate from "@/src/features/player/components/template/BrandedTemplate";
// import FullPromoTemplate from "./templates/FullPromoTemplate"; // Tes futurs templates

export default function TVPlayer() {
  const { manifest, currentProductIndex, isLoading, startAutoPlay } = useDisplayStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const cleanup = startAutoPlay();
    return () => cleanup();
  }, [startAutoPlay]);

  const handleEnableSound = () => {
    setIsMuted(false);
    if (audioRef.current) audioRef.current.muted = false;
  };

  if (isLoading && !manifest) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const currentProduct = manifest?.products[currentProductIndex];
// --- LOGIQUE DE CHOIX DU TEMPLATE ---
const renderSelectedTemplate = () => {
  // Sécurité : si pas de produit ou pas de manifest, on ne rend rien
  if (!manifest || !currentProduct) return null;

  switch (manifest.template_name) {
    case "full_promo":
      return <FullPromoTemplate manifest={manifest} currentProduct={currentProduct} />;
    
    case "branded":
      return (
        <BrandedTemplate 
          manifest={manifest} 
          currentProduct={currentProduct} 
          tenant={manifest.tenant} 
        />
      );

    case "standard":
    default:
      return <StandardTemplate manifest={manifest} currentProduct={currentProduct} />;
  }
};
  return (
    <div 
      className="h-screen w-screen bg-slate-950 text-white overflow-hidden relative cursor-none"
      onClick={handleEnableSound}
    >
      {/* AUDIO GLOBAL */}
      {manifest?.audio_url && (
        <audio ref={audioRef} src={manifest.audio_url} loop muted={isMuted} autoPlay />
      )}

      {isMuted && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full text-xs text-slate-400">
          <VolumeX size={14} /> Mode Silencieux
        </div>
      )}

      {/* AFFICHAGE DU TEMPLATE CHOISI */}
      {renderSelectedTemplate()}
    </div>
  );
}