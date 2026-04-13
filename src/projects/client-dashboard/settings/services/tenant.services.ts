import api from "@/src/core/api/axios";
import { TenantSettingsData } from "@/src/types/settings/settings.type";

const buildTenantHeaders = (tenantId?: string) => {
  if (!tenantId) return {};
  return { 'X-Tenant-ID': tenantId };
};

export const tenantService = {
  // GET /setting/me
  getMyTenant: async (tenantId?: string): Promise<TenantSettingsData> => {
    const { data } = await api.get('/tenants/setting/me', {
      headers: buildTenantHeaders(tenantId),
    });
    return data;
  },

  // POST /setting/update (FormData pour les images)
  updateTenant: async (formData: FormData, tenantId?: string): Promise<TenantSettingsData> => {
    const { data } = await api.post('/tenants/setting/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...buildTenantHeaders(tenantId),
      },
    });
    return data;
  },
};
