import { create } from 'zustand';
import { tvVisibilityService } from '../services/tv-visibility.service';
import { toast } from 'react-hot-toast';

interface DisplaySettings {
  logo_text: string;
  wifi_name: string;
  wifi_password: string;
  ticker_message: string;
}

interface SettingsState {
  settings: DisplaySettings;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: DisplaySettings) => Promise<void>;
}

export const useDisplaySettingsStore = create<SettingsState>((set) => ({
  settings: {
    logo_text: "",
    wifi_name: "",
    wifi_password: "",
    ticker_message: ""
  },
  loading: false,

  fetchSettings: async () => {
    try {
      const data = await tvVisibilityService.getLayoutSettings();
      set({ settings: data });
    } catch (err) { console.error("Erreur chargement settings"); }
  },

  updateSettings: async (newSettings) => {
    set({ loading: true });
    try {
      await tvVisibilityService.saveLayoutSettings(newSettings);
      set({ settings: newSettings });
      toast.success("Configuration mise à jour !");
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      set({ loading: false });
    }
  }
}));