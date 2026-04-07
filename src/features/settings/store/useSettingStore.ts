import { create } from 'zustand';
import { Tenant } from "@/src/types/settings/settings.type";
import { tenantService } from "../services/tenant.services";
import api from '@/src/core/api/axios';

interface SettingsState {
  activeTab: 'identity' | 'design' | 'business';
  formData: Partial<Tenant>; 
  isLoading: boolean; // Ajouté pour le feedback UI
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
    set({ isLoading: true });
    try {
      const response = await api.get('/tenants/setting/me'); // Remplace par ton endpoint de lecture
      set({ formData: response.data }); // On remplit le store avec les vraies données de la DB
    } catch (error) {
      console.error("Erreur lors du chargement des réglages", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setField: (key, value) => set((state) => ({
    formData: { ...state.formData, [key]: value }
  })),

  saveAll: async () => {
    const { formData } = get();
    if (Object.keys(formData).length === 0) return; // Ne rien faire si vide

    set({ isLoading: true });
    const finalData = new FormData();
    
    try {Object.entries(formData).forEach(([key, value]) => {
  if (value === undefined || value === null) return;

  // ✅ SOLUTION : Vérifier que c'est un objet ET non-nul AVANT 'instanceof'
  if (typeof value === 'object' && value !== null && value instanceof File) {
    finalData.append(key, value);
  } 
  else if (typeof value === 'boolean') {
    finalData.append(key, value ? 'true' : 'false');
  }
  // Si c'est un objet complexe (ex: display_settings) mais PAS un fichier
  else if (typeof value === 'object' && value !== null) {
    Object.entries(value).forEach(([subKey, subValue]) => {
      if (subValue !== undefined && subValue !== null) {
        finalData.append(subKey, String(subValue));
      }
    });
  }
  else {
    finalData.append(key, String(value));
  }
});
      
      await tenantService.updateTenant(finalData);
      set({ formData: {}, isLoading: false }); // Reset après succès
      alert("Configuration mise à jour !");
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
      set({ isLoading: false });
    }
  }
}));