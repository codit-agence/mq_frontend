import api from '@/src/core/api/axios';
import { Screen, ScreenCreateInput, ScreenUpdateInput, TenantScreenSummary } from '@/src/types/tvstream/tvstream';

const buildTenantHeaders = (tenantId?: string) => {
  if (!tenantId) return {};
  return { 'X-Tenant-ID': tenantId };
};

export const tvStreamService = {
  // Liste des écrans du Tenant
  fetchScreens: async (tenantId?: string): Promise<Screen[]> => {
    const response = await api.get('/screens/dashboard/', {
      headers: buildTenantHeaders(tenantId),
    });
    return response.data;
  },

  // Création d'un nouvel emplacement (Génère le code 6 chiffres)
createScreen: async (data: ScreenCreateInput, tenantId?: string): Promise<Screen> => {
  const response = await api.post('/screens/dashboard/', data, {
    headers: buildTenantHeaders(tenantId),
  });
  // On s'assure que si le backend oublie le code, on renvoie une string vide et pas undefined
  return {
    ...response.data,
    pairing_code: response.data.pairing_code || "",
    id: response.data.id || ""
  };
},

  // Validation des 4 chiffres vus sur la TV
verifySecurityCode: async (screenId: string, code: string, tenantId?: string) => {
  // Vérifie bien que la clé correspond au schéma Python (ex: security_code)
  const response = await api.post(`/screens/dashboard/${screenId}/verify-security`, {
    security_code: code
  }, {
    headers: buildTenantHeaders(tenantId),
  });
  return response.data;
},

  // Mise à jour de la config (Template, Nom)
  updateConfig: async (screenId: string, data: ScreenUpdateInput, tenantId?: string): Promise<Screen> => {
    const response = await api.patch(`/screens/dashboard/${screenId}/config`, data, {
      headers: buildTenantHeaders(tenantId),
    });
    return response.data;
  },

  deleteScreen: async (screenId: string, tenantId?: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete(`/screens/dashboard/${screenId}`, {
        headers: buildTenantHeaders(tenantId),
      });
      return response.data;
    } catch (error: any) {
      // Fallback for servers expecting trailing slash.
      if (error?.response?.status === 404) {
        const response = await api.delete(`/screens/dashboard/${screenId}/`, {
          headers: buildTenantHeaders(tenantId),
        });
        return response.data;
      }
      throw error;
    }
  },

  fetchTenantSummary: async (tenantId?: string): Promise<TenantScreenSummary> => {
    const response = await api.get('/screens/dashboard/stats/summary', {
      headers: buildTenantHeaders(tenantId),
    });
    return response.data;
  },

  resetMovedAlert: async (screenId: string, tenantId?: string) => {
    const response = await api.post(
      `/screens/dashboard/${screenId}/reset-moved-alert`,
      {},
      { headers: buildTenantHeaders(tenantId) }
    );
    return response.data;
  },

  forceRefresh: async (screenId: string, tenantId?: string) => {
    const response = await api.post(
      `/screens/dashboard/${screenId}/force-refresh`,
      {},
      { headers: buildTenantHeaders(tenantId) }
    );
    return response.data;
  },

  resetPairing: async (screenId: string, tenantId?: string): Promise<Screen> => {
    const response = await api.post(
      `/screens/dashboard/${screenId}/reset-pairing`,
      {},
      { headers: buildTenantHeaders(tenantId) }
    );
    return response.data;
  },

  /**
   * Le téléphone appelle cet endpoint après avoir scanné le QR affiché sur la TV
   * (mode « Afficher QR »). Crée un écran + finalise l'appairage en une fois.
   */
  pairTvQr: async (
    sessionToken: string,
    screenName: string,
    tenantId?: string,
  ): Promise<{ status: string; screen_id: string; screen_name: string }> => {
    const response = await api.post(
      `/screens/dashboard/qr-pair/${encodeURIComponent(sessionToken)}`,
      null,
      { params: { name: screenName }, headers: buildTenantHeaders(tenantId) },
    );
    return response.data;
  },
};
