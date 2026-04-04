import api from '@/src/core/api/axios';
import { create } from 'zustand';

interface DisplayState {
  // Données pour la TV (Le Manifest)
  manifest: any | null;
  isLoadingManifest: boolean;
  
  // Données pour le Dashboard (Le CRUD)
  schedules: any[];
  isLoadingSchedules: boolean;

  // Actions
  fetchManifest: () => Promise<void>;
  fetchSchedules: () => Promise<void>;
  createSchedule: (data: any) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
}

export const useDisplayStore = create<DisplayState>((set, get) => ({
  manifest: null,
  isLoadingManifest: false,
  schedules: [],
  isLoadingSchedules: false,

  // 1. Récupérer ce qui doit être diffusé MAINTENANT (Pour la TV)
  fetchManifest: async () => {
    set({ isLoadingManifest: true });
    try {
      const res = await api.get('/api/manifest/active-manifest');
      set({ manifest: res.data, isLoadingManifest: false });
    } catch (error) {
      console.error("Erreur Manifest:", error);
      set({ isLoadingManifest: false });
    }
  },

  // 2. Récupérer la liste des plannings (Pour le Dashboard)
  fetchSchedules: async () => {
    set({ isLoadingSchedules: true });
    try {
      const res = await api.get('/api/schedules/schedule');
      set({ schedules: res.data, isLoadingSchedules: false });
    } catch (error) {
      set({ isLoadingSchedules: false });
    }
  },

  // 3. Créer un nouveau planning
  createSchedule: async (data) => {
    try {
      await api.post('/api/schedules/schedule', data);
      get().fetchSchedules(); // Rafraîchir la liste
    } catch (error) {
      console.error("Erreur création schedule:", error);
    }
  },

  // 4. Supprimer un planning
  deleteSchedule: async (id) => {
    try {
      await api.delete(`/api/schedules/schedule/${id}`);
      set((state) => ({
        schedules: state.schedules.filter((s) => s.id !== id),
      }));
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  },
}));