import api from "@/src/core/api/axios";

export interface InternalPlaylistStats {
  total_playlists: number;
  active_playlists: number;
  playlists_by_status: Array<{ status: string; count: number }>;
  total_items: number;
  items_by_type: Array<{ type: string; count: number }>;
}

export interface InternalPlaylistRow {
  id: string;
  code: string;
  name: string;
  description: string;
  tenant_id: string;
  tenant_name: string;
  status: "active" | "paused" | "archived";
  items_count: number;
  screens_count: number;
  duration_seconds: number;
  created_at: string;
  updated_at: string;
  scheduling_type: "continuous" | "time_based" | "date_range";
  scheduling_start?: string;
  scheduling_end?: string;
  playback_mode: "sequence" | "shuffle" | "loop";
  auto_advance: boolean;
  interval_seconds?: number;
}

export interface PlaylistItem {
  id: string;
  item_number: number;
  item_type: "image" | "video" | "html" | "template";
  content_id: string;
  content_file?: string;
  duration_seconds: number;
  transition_type: string;
  transition_duration_ms: number;
}

export interface InternalPlaylistUpdateInput {
  name?: string;
  description?: string;
  status?: "active" | "paused" | "archived";
  scheduling_type?: "continuous" | "time_based" | "date_range";
  scheduling_start?: string;
  scheduling_end?: string;
  playback_mode?: "sequence" | "shuffle" | "loop";
  auto_advance?: boolean;
  interval_seconds?: number;
}

export interface PlaylistItemCreateInput {
  item_type: "image" | "video" | "html" | "template";
  content_id: string;
  duration_seconds: number;
  transition_type: string;
  transition_duration_ms: number;
}

export interface InternalPlaylistFilterOptions {
  statuses: Array<{ value: string; label: string }>;
  item_types: Array<{ value: string; label: string }>;
  scheduling_types: Array<{ value: string; label: string }>;
  playback_modes: Array<{ value: string; label: string }>;
}

export const internalPlaylistsService = {
  getStats: async () => {
    const response = await api.get("/internal/admin/playlists/stats");
    return response.data as InternalPlaylistStats;
  },

  getPlaylists: async (filters?: {
    search?: string;
    status?: string;
    tenant_id?: string;
    scheduling_type?: string;
  }) => {
    const response = await api.get("/internal/admin/playlists", { params: filters });
    return response.data as { count: number; results: InternalPlaylistRow[] };
  },

  getPlaylist: async (playlistId: string) => {
    const response = await api.get(`/internal/admin/playlists/${playlistId}`);
    return response.data as InternalPlaylistRow & { items: PlaylistItem[] };
  },

  getFilterOptions: async () => {
    const response = await api.get("/internal/admin/playlists/filter-options");
    return response.data as InternalPlaylistFilterOptions;
  },

  createPlaylist: async (payload: {
    name: string;
    description: string;
    tenant_id: string;
    scheduling_type?: string;
    playback_mode?: string;
  }) => {
    const response = await api.post("/internal/admin/playlists", payload);
    return response.data as InternalPlaylistRow;
  },

  updatePlaylist: async (playlistId: string, payload: InternalPlaylistUpdateInput) => {
    const response = await api.patch(`/internal/admin/playlists/${playlistId}`, payload);
    return response.data as InternalPlaylistRow;
  },

  deletePlaylist: async (playlistId: string) => {
    const response = await api.delete(`/internal/admin/playlists/${playlistId}`);
    return response.data;
  },

  addPlaylistItem: async (playlistId: string, payload: PlaylistItemCreateInput) => {
    const response = await api.post(`/internal/admin/playlists/${playlistId}/items`, payload);
    return response.data as PlaylistItem;
  },

  removePlaylistItem: async (playlistId: string, itemId: string) => {
    const response = await api.delete(`/internal/admin/playlists/${playlistId}/items/${itemId}`);
    return response.data;
  },

  previewPlaylist: async (playlistId: string) => {
    const response = await api.post(`/internal/admin/playlists/${playlistId}/preview`);
    return response.data;
  },
};
