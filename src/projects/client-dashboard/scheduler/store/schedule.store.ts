import { create } from 'zustand';
import { SchedulerService } from '../services/scheduler.service';
import { CreateScheduleInput, Schedule } from "@/src/types/schedule/schedule.type";
import { toast } from 'react-hot-toast';

interface SchedulerState {
  schedules: Schedule[];
  isLoading: boolean;
  fetchSchedules: () => Promise<void>;
  createSchedule: (data: CreateScheduleInput) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
}


export const useSchedulerStore = create<SchedulerState>((set, get) => ({
  schedules: [],
  isLoading: false,

  fetchSchedules: async () => {
    set({ isLoading: true });
    try {
      const data = await SchedulerService.getSchedules();
      set({ schedules: data });
    } catch (error) {
      toast.error("Impossible de charger le planning");
    } finally {
      set({ isLoading: false });
    }
  },

  createSchedule: async (data) => {
    try {
      await SchedulerService.createSchedule(data);
      toast.success("Plage horaire ajoutée");
      await get().fetchSchedules(); // Rafraîchissement automatique
    } catch (error) {
      toast.error("Erreur lors de la création");
      throw error;
    }
  },

deleteSchedule: async (id: string) => {
  try {
    await SchedulerService.deleteSchedule(id);
    
    // Mise à jour de l'état local pour faire disparaître la ligne immédiatement
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id),
    }));
    
    toast.success("Plage horaire supprimée");
  } catch (error) {
    console.error("Erreur suppression:", error);
    toast.error("Erreur lors de la suppression");
  }
}
}));