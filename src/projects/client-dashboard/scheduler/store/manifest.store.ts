import api from '@/src/core/api/axios';
import { create } from 'zustand';

interface ManifestState {
  manifest: any | null;
  isLoadingManifest: boolean;
  schedules: any[];
  isLoadingSchedules: boolean;
  fetchManifest: () => Promise<void>;
  fetchSchedules: () => Promise<void>;
  createSchedule: (data: any) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
}

export const useManifestStore = create<ManifestState>((set, get) => ({
  manifest: null,
  isLoadingManifest: false,
  schedules: [],
  isLoadingSchedules: false,

  fetchManifest: async () => {
    set({ isLoadingManifest: true });
    try {
      const res = await api.get('/api/manifest/active-manifest');
      set({ manifest: res.data, isLoadingManifest: false });
    } catch (error) {
      console.error('Erreur Manifest:', error);
      set({ isLoadingManifest: false });
    }
  },

  fetchSchedules: async () => {
    set({ isLoadingSchedules: true });
    try {
      const res = await api.get('/api/schedules/schedule');
      set({ schedules: res.data, isLoadingSchedules: false });
    } catch {
      set({ isLoadingSchedules: false });
    }
  },

  createSchedule: async (data) => {
    try {
      await api.post('/api/schedules/schedule', data);
      get().fetchSchedules();
    } catch (error) {
      console.error('Erreur création schedule:', error);
    }
  },

  deleteSchedule: async (id) => {
    try {
      await api.delete(`/api/schedules/schedule/${id}`);
      set((state) => ({
        schedules: state.schedules.filter((schedule) => schedule.id !== id),
      }));
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  },
}));