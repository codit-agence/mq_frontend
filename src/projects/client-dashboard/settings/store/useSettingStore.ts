import { create } from 'zustand';
import { TenantSettingsData } from "@/src/types/settings/settings.type";
import { tenantService } from "../services/tenant.services";
import toast from 'react-hot-toast';
interface SettingsState {
  activeTab: 'identity' | 'design' | 'business';
  formData: Partial<TenantSettingsData>;
  isLoading: boolean;
  setActiveTab: (tab: 'identity' | 'design' | 'business') => void;
  setField: (key: keyof TenantSettingsData, value: any) => void;
  setNestedField: (group: 'business' | 'display', key: string, value: any) => void;
  fetchSettings: (tenantId?: string) => Promise<void>;
  saveAll: (tenantId?: string) => Promise<void>;
}
export const useSettingsStore = create<SettingsState>((set, get) => ({
  activeTab: 'identity',
  formData: {},
  isLoading: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setField: (key, value) => set((state) => ({
    formData: { ...state.formData, [key]: value }
  })),

  setNestedField: (group, key, value) => set((state) => ({
    formData: {
      ...state.formData,
      [group]: {
        ...((state.formData[group] as object) || {}),
        [key]: value
      }
    }
  })),

  fetchSettings: async (tenantId?: string) => {
    set({ isLoading: true });
    try {
      const data = await tenantService.getMyTenant(tenantId);
      set({ formData: data });
    } catch (err) {
      console.error("Fetch settings error:", err);
      toast.error("Impossible de charger la configuration du tenant");
    } finally {
      set({ isLoading: false });
    }
  },
  saveAll: async (tenantId?: string) => {
  const { formData } = get();
  set({ isLoading: true });

  const finalData = new FormData();

  finalData.append('tenant', JSON.stringify({
    name: formData.name,
    public_landing_url: formData.public_landing_url,
    qr_is_active: formData.qr_is_active,
    city: formData.city,
    country: formData.country,
    business_type: formData.business_type,
  }));

  if (formData.business) {
    const { id, created_at, logo, cover_image, ...restBusiness } = formData.business as any;
    finalData.append('business', JSON.stringify(restBusiness));

    if (logo instanceof File) {
      finalData.append('logo', logo);
    }

    if (cover_image instanceof File) {
      finalData.append('cover', cover_image);
    }
  }

  if (formData.display) {
    const { is_rtl, ...restDisplay } = formData.display as any;
    finalData.append('display', JSON.stringify(restDisplay));
  }

  try {
    const updated = await tenantService.updateTenant(finalData, tenantId);
    set({ formData: updated });
    toast.success("Configuration mise à jour !");
  } catch (err) {
    console.error("Save Error:", err);
    toast.error("Erreur lors de la sauvegarde");
  } finally {
    set({ isLoading: false });
  }
}

}));
