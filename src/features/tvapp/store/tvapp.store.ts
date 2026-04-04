import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TVStore {
  accessToken: string | null;
  screenId: string | null;
  template: string;
  setAuth: (id: string, token: string) => void;
  setTemplate: (template: string) => void;
  logout: () => void;
}

export const useTVStore = create<TVStore>()(
  persist(
    (set) => ({
      accessToken: null,
      screenId: null,
      template: 'classic',

      setAuth: (id, token) => set({ screenId: id, accessToken: token }),
      setTemplate: (template) => set({ template }),
      logout: () => set({ accessToken: null, screenId: null }),
    }),
    { name: 'tv-storage' } // Sauvegarde auto dans le localStorage de la TV
  )
);