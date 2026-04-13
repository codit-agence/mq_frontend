import api from "@/src/core/api/axios";

export interface InternalOption {
  value: string;
  label: string;
}

export interface InternalTenantStats {
  tenants_total: number;
  tenants_by_status: Array<{ status: string; count: number }>;
  tenants_by_business_type: Array<{ business_type: string; count: number }>;
  tenants_by_pack: Array<{ subscription_pack: string; count: number }>;
  screens_total: number;
  screens_online: number;
  screens_moved_alert: number;
}

export interface InternalTenantRow {
  id: string;
  name: string;
  slug?: string;
  owner_email?: string;
  city: string;
  country: string;
  business_type: string;
  status: string;
  client_category: string;
  subscription_pack: string;
  subscription_offer?: string;
  payment_type: string;
  tenant_level: number;
  followed_by_type?: string;
  followed_by_name?: string;
  screen_count: number;
  online_screens: number;
  moved_alert_screens: number;
  commercial_name: string;
  technician_name: string;
  lead_source?: string;
  lead_source_detail?: string;
  coupon_code?: string;
}

export interface InternalTenantCreateInput {
  owner_email: string;
  name: string;
  slug?: string;
  city?: string;
  country?: string;
  business_type?: string;
  status?: string;
  client_category?: string;
  subscription_pack?: string;
  subscription_offer?: string;
  tenant_level?: number;
  payment_type?: string;
}

export interface InternalTenantUpdateInput {
  status?: string;
  client_category?: string;
  subscription_pack?: string;
  subscription_offer?: string;
  tenant_level?: number;
  payment_type?: string;
  followed_by_type?: string;
  followed_by_name?: string;
  technician_name?: string;
  commercial_name?: string;
  lead_source?: string;
  lead_source_detail?: string;
  coupon_code?: string;
}

export interface InternalScreenMapRow {
  screen_id: string;
  screen_name: string;
  tenant_id: string;
  tenant_name: string;
  is_online: boolean;
  last_ping: string | null;
  lat: number;
  lng: number;
  moved_alert: boolean;
}

export const internalTenantsService = {
  getOptions: async () => {
    const response = await api.get("/internal/admin/tenants/options");
    return response.data as {
      business_types: InternalOption[];
      statuses: InternalOption[];
      client_categories: InternalOption[];
      subscription_packs: InternalOption[];
      payment_types: InternalOption[];
      followed_by_types: InternalOption[];
      lead_sources: InternalOption[];
    };
  },

  getStats: async () => {
    const response = await api.get("/internal/admin/tenants/stats");
    return response.data as InternalTenantStats;
  },

  getTenants: async (filters?: {
    search?: string;
    business_type?: string;
    status?: string;
    client_category?: string;
    subscription_pack?: string;
  }) => {
    const response = await api.get("/internal/admin/tenants", {
      params: filters,
    });
    return response.data as { count: number; results: InternalTenantRow[] };
  },

  getScreensMap: async (onlineOnly = false) => {
    const response = await api.get("/internal/admin/screens/map", {
      params: { online_only: onlineOnly },
    });
    return response.data as { count: number; results: InternalScreenMapRow[] };
  },

  updateTenant: async (tenantId: string, payload: InternalTenantUpdateInput) => {
    const response = await api.patch(`/internal/admin/tenants/${tenantId}`, payload);
    return response.data as InternalTenantRow;
  },

  createTenant: async (payload: InternalTenantCreateInput) => {
    const response = await api.post("/internal/admin/tenants", payload);
    return response.data as InternalTenantRow;
  },
};
