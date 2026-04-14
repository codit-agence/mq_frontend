import api from "@/src/core/api/axios";

export interface InternalScreenStats {
  total_screens: number;
  online_screens: number;
  offline_screens: number;
  screens_by_status: Array<{ status: string; count: number }>;
  screens_by_resolution: Array<{ resolution: string; count: number }>;
}

export interface InternalScreenRow {
  id: string;
  code: string;
  name: string;
  tenant_id: string;
  tenant_name: string;
  status: "online" | "offline" | "error";
  resolution: string;
  last_heartbeat: string | null;
  ip_address: string;
  os_info: string;
  player_version: string;
  screen_group: string;
  location: string;
  brightness?: number;
  volume?: number;
  battery_level?: number;
  storage_free?: number;
  memory_available?: number;
  cpu_usage?: number;
  temperature?: number;
  error_count?: number;
  uptime_seconds?: number;
}

export interface InternalScreenUpdateInput {
  name?: string;
  status?: "online" | "offline" | "error";
  screen_group?: string;
  location?: string;
  brightness?: number;
  volume?: number;
}

export interface InternalScreenFilterOptions {
  statuses: Array<{ value: string; label: string }>;
  resolutions: Array<{ value: string; label: string }>;
  screen_groups: Array<{ value: string; label: string }>;
}

export const internalScreensService = {
  getStats: async () => {
    const response = await api.get("/internal/admin/screens/stats");
    return response.data as InternalScreenStats;
  },

  getScreens: async (filters?: {
    search?: string;
    status?: string;
    resolution?: string;
    screen_group?: string;
    tenant_id?: string;
  }) => {
    const response = await api.get("/internal/admin/screens", { params: filters });
    return response.data as { count: number; results: InternalScreenRow[] };
  },

  getScreen: async (screenId: string) => {
    const response = await api.get(`/internal/admin/screens/${screenId}`);
    return response.data as InternalScreenRow;
  },

  getFilterOptions: async () => {
    const response = await api.get("/internal/admin/screens/filter-options");
    return response.data as InternalScreenFilterOptions;
  },

  updateScreen: async (screenId: string, payload: InternalScreenUpdateInput) => {
    const response = await api.patch(`/internal/admin/screens/${screenId}`, payload);
    return response.data as InternalScreenRow;
  },

  rebootScreen: async (screenId: string) => {
    const response = await api.post(`/internal/admin/screens/${screenId}/reboot`);
    return response.data;
  },

  syncScreen: async (screenId: string) => {
    const response = await api.post(`/internal/admin/screens/${screenId}/sync`);
    return response.data;
  },

  clearStorageScreen: async (screenId: string) => {
    const response = await api.post(`/internal/admin/screens/${screenId}/clear-storage`);
    return response.data;
  },
};
