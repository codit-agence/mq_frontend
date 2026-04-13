import { TenantSettingsData } from '@/src/types/settings/settings.type';
import { create } from 'zustand';
import { tenantService } from '../services/tenant.services';

interface TenantState {
  tenant: TenantSettingsData | null;
  isLoading: boolean;
  error: string | null;
  fetchTenant: (tenantId?: string) => Promise<void>;
  updateTenant: (formData: FormData, tenantId?: string) => Promise<void>;
}

export const useTenantStore = create<TenantState>((set) => ({
  tenant: null,
  isLoading: false,
  error: null,

  fetchTenant: async (tenantId?: string) => {
    set({ isLoading: true });
    try {
      const data = await tenantService.getMyTenant(tenantId);
      set({ tenant: data, error: null, isLoading: false });
    } catch (err) {
      set({ error: "Erreur lors du chargement", isLoading: false });
    }
  },

  updateTenant: async (formData: FormData, tenantId?: string) => {
    set({ isLoading: true });
    try {
      const updated = await tenantService.updateTenant(formData, tenantId);
      set({ tenant: updated, error: null, isLoading: false });
    } catch (err) {
      set({ error: "Erreur lors de la mise à jour", isLoading: false });
    }
  },
}));