import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile, Tenant, LoginResponse } from "@/src/types/accounts/account.types";
import Cookies from 'js-cookie';
import { useCatalogStore } from "@/src/features/catalog/store/catalog.store";

interface AuthState {
  user: UserProfile | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  handleLoginSuccess: (data: LoginResponse) => void;
  setContext: (user: UserProfile, tenant: Tenant | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tenant: null,
      isAuthenticated: false,
      isLoading: false,

      handleLoginSuccess: (data: LoginResponse) => {
        // 1. Cookies & LocalStorage
        Cookies.set('access_token', data.access, { expires: 7, path: '/' });
        Cookies.set('refresh_token', data.refresh, { expires: 7, path: '/' }); // Corrigé ici

        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // 2. On peuple le state immédiatement
        set({ 
          isAuthenticated: true,
          user: {
            id: data.user_id,
            email: "", 
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            avatar: null
          },
          tenant: data.tenant_id ? {
            id: data.tenant_id,
            name: data.tenant_name || "",
            slug: "",
          } : null
        });
      },

      setContext: (user, tenant) => {
        set({ user, tenant, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        Cookies.remove('access_token', { path: '/' });
        Cookies.remove('refresh_token', { path: '/' });
        localStorage.clear();
        
        // Reset du store catalogue
        useCatalogStore.getState().resetCatalog();
        
        set({ user: null, tenant: null, isAuthenticated: false, isLoading: false });

        if (typeof window !== 'undefined') {
          window.location.href = "/account/login";
        }
      },
    }), // <--- C'EST CETTE FERMETURE QUI MANQUAIT (Fin du store)
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }), 
    }
  ) // <--- Fin du persist
);