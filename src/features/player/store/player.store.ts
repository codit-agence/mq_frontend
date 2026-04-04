// src/features/scheduler/store/display.store.ts
import { create } from 'zustand';
import { DisplayService } from '@/src/features/player/service/player.service';

interface DisplayState {
  manifest: any | null;
  currentProductIndex: number;
  isLoading: boolean;
  fetchManifest: () => Promise<void>;
  startAutoPlay: () => () => void; // Retourne une fonction de nettoyage
}

export const useDisplayStore = create<DisplayState>((set, get) => ({
  manifest: null,
  currentProductIndex: 0,
  isLoading: false,

  fetchManifest: async () => {
    try {
      const data = await DisplayService.getActiveManifest();
      set({ manifest: data });
    } catch (error) {
      console.error("Erreur Manifest:", error);
    }
  },

  startAutoPlay: () => {
    // 1. Charger le manifest immédiatement au démarrage
    get().fetchManifest();

    // 2. Timer pour changer de produit toutes les X secondes (ex: 10s)
    const productTimer = setInterval(() => {
      const { manifest, currentProductIndex } = get();
      if (manifest?.products?.length > 0) {
        const nextIndex = (currentProductIndex + 1) % manifest.products.length;
        set({ currentProductIndex: nextIndex });
      }
    }, 10000);

    // 3. Timer pour rafraîchir le manifest complet (ex: toutes les 5 minutes)
    // Utile pour détecter si le restaurateur a changé le planning
    const manifestTimer = setInterval(() => {
      get().fetchManifest();
    }, 300000);

    // Nettoyage des intervals quand on quitte la page
    return () => {
      clearInterval(productTimer);
      clearInterval(manifestTimer);
    };
  }
}));