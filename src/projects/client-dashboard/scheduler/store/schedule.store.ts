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
  toggleSchedule: (id: string) => Promise<void>;
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
      set((state) => ({
        schedules: state.schedules.filter((s) => s.id !== id),
      }));
      toast.success("Plage horaire supprimée");
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast.error("Erreur lors de la suppression");
    }
  },

  toggleSchedule: async (id: string) => {
    const current = get().schedules.find((s) => s.id === id);
    if (!current) return;
    const newActive = !current.is_active;
    // Optimistic update
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, is_active: newActive } : s
      ),
    }));
    try {
      await SchedulerService.patchSchedule(id, { is_active: newActive });
      toast.success(newActive ? "Plage activée" : "Plage désactivée");
    } catch (error) {
      // Rollback on error
      set((state) => ({
        schedules: state.schedules.map((s) =>
          s.id === id ? { ...s, is_active: !newActive } : s
        ),
      }));
      toast.error("Erreur lors de la mise à jour");
    }
  },
}));