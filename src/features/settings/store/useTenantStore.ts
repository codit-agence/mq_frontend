import { Tenant } from '@/src/types/settings/settings.type';
import { create } from 'zustand';
import { tenantService } from '../services/tenant.services';

interface TenantState {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
  fetchTenant: () => Promise<void>;
  updateTenant: (formData: FormData) => Promise<void>;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenant: null,
  isLoading: false,
  error: null,

  fetchTenant: async () => {
    set({ isLoading: true });
    try {
      const data = await tenantService.getMyTenant();
      set({ tenant: data, isLoading: false });
    } catch (err) {
      set({ error: "Erreur lors du chargement", isLoading: false });
    }
  },

  updateTenant: async (formData: FormData) => {
    set({ isLoading: true });
    try {
      const updated = await tenantService.updateTenant(formData);
      set({ tenant: updated, isLoading: false });
    } catch (err) {
      set({ error: "Erreur lors de la mise à jour", isLoading: false });
    }
  },
}));