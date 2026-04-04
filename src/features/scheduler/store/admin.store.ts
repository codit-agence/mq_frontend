import { create } from 'zustand';
import { SchedulerService } from '../services/scheduler.service';
import { Schedule } from '@/src/types/schedule/schedule.type';

interface AdminScheduleState {
  schedules: Schedule[];
  isLoading: boolean; // <--- AJOUTER CECI
  isSaving: boolean;
  
  fetchSchedules: () => Promise<void>;
  saveSchedule: (data: any) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
}

export const useAdminScheduleStore = create<AdminScheduleState>((set) => ({
  schedules: [],
  isLoading: false, // Initialisation
  isSaving: false,

  fetchSchedules: async () => {
    set({ isLoading: true }); // Début du chargement
    try {
      const data = await SchedulerService.getSchedules();
      set({ schedules: data });
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
    } finally {
      set({ isLoading: false }); // Fin du chargement
    }
  }, 

  saveSchedule: async (data) => {
    set({ isSaving: true });
    try {
      await SchedulerService.createSchedule(data);
      // On rafraîchit la liste après l'ajout
      const updated = await SchedulerService.getSchedules();
      set({ schedules: updated });
    } finally {
      set({ isSaving: false });
    }
  },

  deleteSchedule: async (id) => {
    try {
      await SchedulerService.deleteSchedule(id);
      set((state) => ({ 
        schedules: state.schedules.filter(s => s.id !== id) 
      }));
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  }
}));