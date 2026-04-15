import api from "@/src/core/api/axios";

export interface TenantAccountSummary {
  tenant_id: string;
  name: string;
  slug: string;
  status: string;
  business_type: string;
  subscription_pack: string;
  subscription_offer: string;
  tenant_level: number;
  payment_type: string;
  commercial_name: string;
  technician_name: string;
  client_category: string;
}

export const tenantAccountService = {
  async getSummary(tenantId: string): Promise<TenantAccountSummary> {
    const response = await api.get<TenantAccountSummary>("/tenants/account/summary", {
      headers: { "X-Tenant-ID": tenantId },
    });
    return response.data;
  },
};
