import api from '@/src/core/api/axios';
import {  TVInitResponse, HeartbeatResponse } from '@/src/types/tvapp/tvapp.type';
import { TVDeviceInfo } from '@/src/types/tvstream/tvstream';
 


export const tvService = {
  // ÉTAPE 2 : Envoyer les 6 chiffres et récupérer le screen_id
  initialize: async (pairingCode: string, deviceInfo: TVDeviceInfo): Promise<TVInitResponse> => {
    const response = await api.post(`/screens/tv/init`, {
      pairing_code: pairingCode,
      technical_info: deviceInfo
    });
    return response.data;
  },

  // ÉTAPE 3 : Polling pour récupérer le Token final
  checkAuthStatus: async (screenId: string) => {
    const response = await api.get(`/screens/tv/check-auth/${screenId}`);
    return response.data; // Retourne { is_paired, access_token, ... }
  },

  // ÉTAPE PERMANENTE : Le Heartbeat (toutes les 30s)
  sendHeartbeat: async (token: string, uptimeSeconds: number): Promise<HeartbeatResponse> => {
    const response = await api.post(`/screens/tv/heartbeat`, 
      { uptime_increment: uptimeSeconds },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  },

  // LOGS : Envoyer une preuve de diffusion
  logActivity: async (token: string, activityData: any) => {
    return await api.post(`/screens/log/log-activity`, activityData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};