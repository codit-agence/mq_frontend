import api from "@/src/core/api/axios";
import { ITenant, CreateTenantPayload } from "./tenant.types";

export const tenantService = {
  create: async (data: CreateTenantPayload): Promise<ITenant> => {
    // URL basée sur ton api.add_router("/tenants", ...)
    const res = await api.post("tenants/create", data);
    return res.data;
  },
  
 getSettings: async (): Promise<ITenant> => {
    // 1. Essaie d'abord SANS le slash final si ton router n'est pas strict
    // 2. Vérifie bien que le préfixe est correct
    const res = await api.get("tenants/me"); 
    return res.data;
  }

};