// src/features/tenant/useTenantData.ts
import { useEffect } from "react";
import { useTenantStore } from "@/src/projects/client-dashboard/settings/store/useTenantStore";

export const useTenantData = (tenantId?: string) => {
  const tenant = useTenantStore((state) => state.tenant);
  const loading = useTenantStore((state) => state.isLoading);
  const fetchTenant = useTenantStore((state) => state.fetchTenant);

  useEffect(() => {
    fetchTenant(tenantId);
  }, [fetchTenant, tenantId]);

  return { tenant, loading };
};