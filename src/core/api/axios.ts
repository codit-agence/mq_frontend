import axios, { AxiosHeaders } from "axios";
import Cookies from "js-cookie";
import { getApiBaseUrl } from "@/src/core/config/public-env";
import { clearAuthStorage } from "@/src/projects/client-dashboard/account/auth-storage";

const SESSION_HEADER_EXCLUDED_PATHS = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/onboarding",
  "/auth/forgot-password",
  "/auth/reset-password-confirm",
  "/auth/refresh",
]);

function normalizeRequestPath(url?: string) {
  if (!url) {
    return "";
  }

  const rawPath = url.startsWith("http://") || url.startsWith("https://")
    ? new URL(url).pathname
    : url.split("?")[0] || "";

  return rawPath.replace(/^\/api(?=\/)/, "").replace(/\/+$/, "") || "/";
}

/** Cockpit staff : /internal/* (Ninja AdminAuth). Ne doit pas recevoir X-Tenant-ID du contexte client. */
function isInternalStaffApiPath(url?: string) {
  const p = normalizeRequestPath(url);
  return p === "/internal" || p.startsWith("/internal/");
}

/** TV physique : Bearer = jeton d'écran uniquement — pas de refresh JWT dashboard ni X-Tenant-ID. */
function isTvScreenApiPath(url?: string) {
  const p = normalizeRequestPath(url);
  return p.startsWith("/screens/tv/");
}

function shouldAttachSessionHeaders(url?: string) {
  return !SESSION_HEADER_EXCLUDED_PATHS.has(normalizeRequestPath(url));
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const includeSessionHeaders = shouldAttachSessionHeaders(config.url);

    // 1. Gestion du Token d'accès
    const token = Cookies.get("access_token") || localStorage.getItem("access_token");
    const headers = AxiosHeaders.from(config.headers);
    const hasAuthorizationHeader = headers.has("Authorization");

    // Ne pas écraser un Authorization déjà passé explicitement
    // (ex: token d'écran TV pour /screens/tv/heartbeat).
    if (includeSessionHeaders && token && !hasAuthorizationHeader && !isTvScreenApiPath(config.url)) {
      const cleanToken = token.replace(/"/g, '');
      headers.set("Authorization", `Bearer ${cleanToken}`);
    }
    
    // 2. Gestion du Tenant ID (Multi-tenant) — pas sur /internal/… ni /screens/tv/… (token écran)
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage && !isInternalStaffApiPath(config.url) && !isTvScreenApiPath(config.url)) {
      try {
        const parsed = JSON.parse(authStorage);
        const tenantId = parsed.state.tenant?.id;
        const hasTenantHeader = headers.has("X-Tenant-ID");

        // Do not override tenant explicitly provided by per-request headers.
        if (includeSessionHeaders && tenantId && !hasTenantHeader) {
          headers.set("X-Tenant-ID", tenantId);
        }
      } catch (e) {
        console.error("Erreur lecture auth-storage", e);
      }
    }

    config.headers = headers;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Les routes TV utilisent le jeton d'écran, pas le JWT utilisateur : ne pas refresh ni rediriger login.
      if (isTvScreenApiPath(originalRequest.url)) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get("refresh_token") || localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {
          refresh: refreshToken.replace(/"/g, ''),
        });

        Cookies.set("access_token", data.access, { expires: 7, path: '/' });
        localStorage.setItem("access_token", data.access);

        const headers = AxiosHeaders.from(originalRequest.headers);
        headers.set("Authorization", `Bearer ${data.access}`);
        originalRequest.headers = headers;
        return api(originalRequest);
        
      } catch (refreshError) {
        clearAuthStorage();
        Cookies.remove("access_token", { path: '/' });
        Cookies.remove("refresh_token", { path: '/' });
        if (typeof window !== "undefined") {
          window.location.href = "/account/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
