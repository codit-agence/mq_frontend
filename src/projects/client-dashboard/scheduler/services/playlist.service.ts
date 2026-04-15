import api from "@/src/core/api/axios";

export type PlaylistPlayMode = "repeat" | "shuffle";

export interface PlaylistTimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  category: string;
  track_type: string;
  play_mode: PlaylistPlayMode;
  repeat_count: number;
  notes?: string;
}

export interface PlaylistConfigPayload {
  name: string;
  active_day: number;
  plan: {
    version: 2;
    days: Record<string, PlaylistTimeSlot[]>;
  };
}

export interface PlaylistConfigResponse extends PlaylistConfigPayload {
  id: string | null;
}

function withTenantHeader(tenantId?: string | null) {
  return tenantId ? { headers: { "X-Tenant-ID": tenantId } } : undefined;
}

export const PlaylistService = {
  getConfig: async (tenantId?: string | null): Promise<PlaylistConfigResponse> => {
    const res = await api.get<PlaylistConfigResponse>(
      "/manifest/playlist-config",
      withTenantHeader(tenantId)
    );
    return res.data;
  },

  saveConfig: async (
    payload: PlaylistConfigPayload,
    tenantId?: string | null
  ): Promise<PlaylistConfigResponse> => {
    const res = await api.put<PlaylistConfigResponse>(
      "/manifest/playlist-config",
      payload,
      withTenantHeader(tenantId)
    );
    return res.data;
  },
};
