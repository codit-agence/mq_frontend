import api from "@/src/core/api/axios";
import { CreateScheduleInput, Schedule } from "@/src/types/schedule/schedule.type";

export const SchedulerService = {
  // Liste tous les plannings
  getSchedules: async (): Promise<Schedule[]> => {
    const res = await api.get<Schedule[]>('/manifest/schedule');
    return res.data;
  },

  // Créer un planning
  createSchedule: async (data: CreateScheduleInput): Promise<{ id: string }> => {
    const res = await api.post<{ id: string }>('/manifest/schedule', data);
    return res.data;
  },

  // Supprimer un planning
  deleteSchedule: async (id: string): Promise<{ success: boolean }> => {
    const res = await api.delete<{ success: boolean }>(`/manifest/schedule/${id}`);
    return res.data;
  },

  // Mise à jour partielle (toggle is_active, etc.)
  patchSchedule: async (id: string, data: Partial<Schedule>): Promise<Schedule> => {
    const res = await api.patch<Schedule>(`/manifest/schedule/${id}`, data);
    return res.data;
  },
};