import { create } from 'zustand';
import { Tenant } from "@/src/types/settings/settings.type";
import { tenantService } from "../services/tenant.services";

interface SettingsState {
  activeTab: 'identity' | 'design' | 'business';
  formData: Partial<Tenant>; 
  isLoading: boolean;
  setActiveTab: (tab: 'identity' | 'design' | 'business') => void;
  setField: (key: string, value: any) => void;
  fetchSettings: () => Promise<void>;
  saveAll: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  activeTab: 'identity',
  formData: {},
  isLoading: false,
  
  setActiveTab: (tab) => set({ activeTab: tab }),

  fetchSettings: async () => {
    // Si on a déjà des données, on évite le flash de chargement inutile
    if (get().isLoading) return;
    
    set({ isLoading: true });
    try {
      const data = await tenantService.getMyTenant();
      set({ formData: data });
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setField: (key, value) => set((state) => ({
    formData: { ...state.formData, [key]: value }
  })),

  saveAll: async () => {
    const { formData } = get();
    set({ isLoading: true });

    const finalData = new FormData();
    
    try {
      Object.entries(formData).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        // 1. Gestion des fichiers (Logo, etc.)
        if (value instanceof File) {
          finalData.append(key, value);
        } 
        
        // 2. Gestion de l'objet display_settings (Le JSONField)
        // CRITIQUE : On l'envoie comme une chaîne JSON pour que Django puisse le parser
        else if (key === 'display_settings' && typeof value === 'object') {
          finalData.append(key, JSON.stringify(value));
        }

        // 3. Gestion des booleens
        else if (typeof value === 'boolean') {
          finalData.append(key, value ? 'true' : 'false');
        }

        // 4. Reste des champs (strings, numbers)
        else {
          finalData.append(key, String(value));
        }
      });

      const updatedTenant = await tenantService.updateTenant(finalData);
      set({ formData: updatedTenant });
      alert("✅ Configuration enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      alert("❌ Erreur lors de la sauvegarde.");
    } finally {
      set({ isLoading: false });
    }
  }
}));