"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader2, VolumeX } from "lucide-react";
import { usePlayerStore } from "../../store/players.store";
import BrandedTemplate from "../template/BrandedTemplate";
import FullPromoTemplate from "../template/FullPromoTemplate";
import StandardTemplate from "../template/StandardTemplate";


export default function TVPlayer() {
  const { manifest, updateManifest } = usePlayerStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 1. Synchronisation du Manifest (Polling toutes les 30s pour les prix/pub)
  useEffect(() => {
    const interval = setInterval(() => {
      updateManifest();
    }, 30000);
    return () => clearInterval(interval);
  }, [updateManifest]);

  // 2. Logique de Rotation des Produits (Le Carousel)
  useEffect(() => {
    if (!manifest || manifest.products.length === 0) return;

    const duration = (manifest.slot_duration || 10) * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % manifest.products.length);
    }, duration);

    return () => clearInterval(timer);
  }, [manifest]);

  // Activation du son au premier clic
  const handleEnableSound = () => {
    setIsMuted(false);
    if (audioRef.current) audioRef.current.muted = false;
  };

  if (!manifest || manifest.products.length === 0) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-slate-500 font-medium">Chargement du catalogue...</p>
      </div>
    );
  }

  const currentProduct = manifest.products[currentIndex];

  // --- LOGIQUE DE SÉLECTION DU TEMPLATE ---
  const renderTemplate = () => {
    const props = {
      manifest,
      currentProduct,
      tenant: manifest.tenant
    };

    switch (manifest.template_name) {
      case "branded":
        return <BrandedTemplate {...props} />;
      case "full_promo":
        return <FullPromoTemplate {...props} />;
      default:
        return <StandardTemplate {...props} />;
    }
  };

  return (
    <div 
      className="h-screen w-screen bg-black text-white overflow-hidden relative cursor-none"
      onClick={handleEnableSound}
    >
      {/* AUDIO ENGINE */}
      {manifest.audio_url && (
        <audio 
          ref={audioRef} 
          src={manifest.audio_url} 
          loop 
          autoPlay 
          muted={isMuted} 
        />
      )}

      {/* INDICATEUR MUTE (Discret) */}
      {isMuted && manifest.audio_url && (
        <div className="absolute bottom-6 right-6 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-[10px] uppercase tracking-widest text-slate-400 border border-white/10 animate-pulse">
          <VolumeX size={12} /> Cliquer pour le son
        </div>
      )}

      {/* AFFICHAGE DU TEMPLATE */}
      {renderTemplate()}
    </div>
  );
}