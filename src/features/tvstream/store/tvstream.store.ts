import { create } from 'zustand';
import { Screen } from '@/src/types/tvstream/tvstream';
import { tvStreamService } from '../services/tvstream.service';

interface TvStreamState {
  screens: Screen[];
  isLoading: boolean;
  error: string | null;
  
  loadScreens: () => Promise<void>;
  addScreen: (name: string) => Promise<void>;
  updateScreen: (id: string, data: any) => Promise<void>;
}

export const useTvStreamStore = create<TvStreamState>((set, get) => ({
  screens: [],
  isLoading: false,
  error: null,

  loadScreens: async () => {
    set({ isLoading: true });
    try {
      const screens = await tvStreamService.fetchScreens();
      set({ screens, isLoading: false });
    } catch (err) {
      set({ error: "Erreur lors du chargement des écrans", isLoading: false });
    }
  },

  addScreen: async (name: string) => {
    const newScreen = await tvStreamService.createScreen({ name });
    set({ screens: [...get().screens, newScreen] });
  },

  updateScreen: async (id: string, data: any) => {
    const updated = await tvStreamService.updateConfig(id, data);
    set({
      screens: get().screens.map(s => s.id === id ? updated : s)
    });
  }
}));