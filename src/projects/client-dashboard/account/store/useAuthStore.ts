import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile, Tenant, LoginResponse } from "@/src/types/accounts/account.types";
import Cookies from 'js-cookie';
import { useCatalogStore } from "@/src/projects/client-dashboard/catalog/store/catalog.store";
import api from "@/src/core/api/axios";

interface AuthState {
  user: UserProfile | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  handleLoginSuccess: (data: LoginResponse, rememberMe?: boolean) => void;
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

      handleLoginSuccess: (data: LoginResponse, rememberMe = false) => {
        // Durée d'expiration basée sur rememberMe
        const expiresDays = rememberMe ? 30 : 7; // 30 jours si "rester connecté", sinon 7 jours

        // 1. Stockage des Tokens
        Cookies.set('access_token', data.access, { expires: expiresDays, path: '/' });
        Cookies.set('refresh_token', data.refresh, { expires: expiresDays, path: '/' });
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        // 2. Mise à jour immédiate des headers Axios pour éviter le délai du middleware
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
        if (data.tenant_id) {
          api.defaults.headers.common['X-Tenant-Id'] = data.tenant_id;
        } else {
          delete api.defaults.headers.common['X-Tenant-Id'];
        }

        // 3. Mise à jour du State Global
        set({ 
          isAuthenticated: true,
          user: {
            id: data.user_id,
            email: "", // Sera complété par le getMe()
            first_name: data.first_name || "Utilisateur",
            last_name: data.last_name || "",
            avatar: null,
            is_active: data.is_active,
            is_verified: data.is_verified,
            is_staff: Boolean(data.is_staff),
            is_superuser: Boolean(data.is_superuser),
          },
          tenant: data.tenant_id ? {
            id: data.tenant_id,
            name: data.tenant_name || "",
            city: data.tenant_city || "",
            logo: null,
            type: data.tenant_type || "restaurant",
            slug: data.tenant_slug || "",
            role: data.role || null,
            status: data.tenant_status || null,
            subscription_pack: data.subscription_pack || null,
            subscription_offer: data.subscription_offer || null,
            coupon_code: data.coupon_code || null,
            registration_date: data.registration_date || null,
            primary_color: data.primary_color || null,
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
        
        // Reset des autres stores
        useCatalogStore.getState().resetCatalog();
        
        set({ user: null, tenant: null, isAuthenticated: false, isLoading: false });

        if (typeof window !== 'undefined') {
          window.location.href = "/account/login";
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        tenant: state.tenant
      }), 
    }
  )
);