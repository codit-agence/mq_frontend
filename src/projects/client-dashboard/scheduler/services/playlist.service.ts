import api from "@/src/core/api/axios";

export interface PlaylistDayPlan {
  opening: string[];
  cruise: string[];
}

export interface PlaylistConfigPayload {
  name: string;
  active_day: number;
  plan: {
    days: Record<string, PlaylistDayPlan>;
    interrupt?: {
      mode?: string;
      crossfade_seconds?: number;
      listener?: string;
    };
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
