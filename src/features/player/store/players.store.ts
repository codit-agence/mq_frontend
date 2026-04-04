import { create } from "zustand";
import { Manifest, TVSession } from "@/src/types/players/player.type";
import api from "@/src/core/api/axios";

interface PlayerState {
  session: TVSession | null;
  manifest: Manifest | null;
  isLoading: boolean;
  
  // Actions
  initSession: () => Promise<void>;
  updateManifest: () => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  session: null,
  manifest: null,
  isLoading: true,

  initSession: async () => {
    try {
      const savedToken = localStorage.getItem("tv_access_token");
      
      // On appelle /tv/init (Etape 1 du backend)
      const res = await api.post("/screens/tv/init", {
        device_info: { screen: `${window.innerWidth}x${window.innerHeight}` },
        access_token: savedToken
      });

      const session = res.data;
      set({ session, isLoading: false });

      if (session.is_paired && session.access_token) {
        localStorage.setItem("tv_access_token", session.access_token);
        get().updateManifest();
      }
    } catch (error) {
      console.error("Erreur Initialisation TV", error);
      set({ isLoading: false });
    }
  },

  updateManifest: async () => {
    const { session } = get();
    if (!session?.access_token) return;

    try {
      const res = await api.get(`/screens/tv/manifest/${session.id}`, {
        params: { token: session.access_token }
      });
      set({ manifest: res.data });
    } catch (error) {
      console.error("Erreur Manifest", error);
    }
  }
}));