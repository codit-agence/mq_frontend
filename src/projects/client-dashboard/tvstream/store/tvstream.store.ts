import { create } from 'zustand';
import { Screen } from '@/src/types/tvstream/tvstream';
import { tvStreamService } from '../services/tvstream.service';

interface TvStreamState {
  screens: Screen[];
  isLoading: boolean;
  error: string | null;
  
  loadScreens: (tenantId?: string) => Promise<void>;
  addScreen: (name: string, tenantId?: string) => Promise<void>;
  updateScreen: (id: string, data: any, tenantId?: string) => Promise<void>;
}

export const useTvStreamStore = create<TvStreamState>((set, get) => ({
  screens: [],
  isLoading: false,
  error: null,

  loadScreens: async (tenantId?: string) => {
    set({ isLoading: true });
    try {
      const screens = await tvStreamService.fetchScreens(tenantId);
      set({ screens, isLoading: false });
    } catch (err) {
      set({ error: "Erreur lors du chargement des écrans", isLoading: false });
    }
  },

  addScreen: async (name: string, tenantId?: string) => {
    const newScreen = await tvStreamService.createScreen({ name }, tenantId);
    set({ screens: [...get().screens, newScreen] });
  },

  updateScreen: async (id: string, data: any, tenantId?: string) => {
    const updated = await tvStreamService.updateConfig(id, data, tenantId);
    set({
      screens: get().screens.map(s => s.id === id ? updated : s)
    });
  }
}));