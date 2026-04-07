import api from "@/src/core/api/axios";
import { Tenant } from "@/src/types/settings/settings.type";

export const tenantService = {
  // GET /setting/me
  getMyTenant: async (): Promise<Tenant> => {
    const { data } = await api.get('/tenants/setting/me');
    return data;
  },

  // POST /setting/update (FormData pour les images)
  updateTenant: async (formData: FormData): Promise<Tenant> => {
    const { data } = await api.post('/tenants/setting/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};