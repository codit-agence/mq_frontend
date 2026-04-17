import api from "@/src/core/api/axios";
import { TVDeviceInfo } from "@/src/types/tvstream/tvstream";
import { HeartbeatResponse, TVCheckStatusResponse, TVInitResponse, TVManifest } from "./tv.types";

export interface TVHeartbeatPayload {
  uptime_seconds: number;
  latitude?: number;
  longitude?: number;
  gps_accuracy_m?: number;
  display_mode?: string;
  app_version?: string;
  location_status?: string;
  transport_mode?: "polling" | "websocket";
  runtime_snapshot?: Record<string, unknown>;
}

export const tvApi = {
  /**
   * Mode « Afficher QR » : la TV demande une session QR au backend (sans auth).
   * Le téléphone du gérant scanne le QR pour apparier la TV sans saisie manuelle.
   */
  qrSession: async (): Promise<{ session_token: string }> => {
    const response = await api.post("/screens/tv/qr-session");
    return response.data;
  },

  /**
   * La TV poll cet endpoint pour savoir si le gérant a confirmé via QR.
   */
  qrStatus: async (
    sessionToken: string,
  ): Promise<{ status: "pending" | "paired"; access_token?: string; screen_id?: string; screen_name?: string }> => {
    const response = await api.get(`/screens/tv/qr-status/${sessionToken}`);
    return response.data;
  },

  initialize: async (pairingCode: string, deviceInfo: TVDeviceInfo): Promise<TVInitResponse> => {
    const response = await api.post("/screens/tv/init", {
      pairing_code: pairingCode,
      technical_info: deviceInfo,
    });
    return response.data;
  },

  checkAuthStatus: async (screenId: string): Promise<TVCheckStatusResponse> => {
    const response = await api.get(`/screens/tv/check-auth/${screenId}`);
    return response.data;
  },

  sendHeartbeat: async (token: string, payload: TVHeartbeatPayload): Promise<HeartbeatResponse> => {
    const response = await api.post(
      "/screens/tv/heartbeat",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  getManifest: async (token: string): Promise<TVManifest> => {
    const response = await api.get("/screens/tv/manifest", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
