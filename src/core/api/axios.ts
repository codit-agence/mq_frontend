import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. INTERCEPTEUR DE REQUÊTE : Injecter le Token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get("access_token") || localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token.replace(/"/g, '')}`;
    }
    
    // 2. Injection du Tenant ID (Ajout)
    // On récupère le tenant_id depuis le localStorage (car Zustand persist l'écrit là)
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
        const parsed = JSON.parse(authStorage);
        const tenantId = parsed.state.tenant?.id;
        if (tenantId) {
            config.headers['X-Tenant-Id'] = tenantId; // On l'envoie au backend
        }
    }
  }
  return config;
}, (error) => Promise.reject(error));

// 2. INTERCEPTEUR DE RÉPONSE : Gérer l'expiration (401)
api.interceptors.response.use(
  (response) => response, // Si tout va bien, on renvoie la réponse
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // On marque la requête pour ne pas boucler à l'infini

      try {
        const refreshToken = Cookies.get("refresh_token") || localStorage.getItem("refresh_token");
        
        if (!refreshToken) throw new Error("No refresh token available");

        // On appelle l'endpoint de refresh (utilise axios direct pour éviter l'intercepteur de 'api')
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh/`, {
          refresh: refreshToken.replace(/"/g, ''),
        });

        // On stocke le nouveau access_token
        Cookies.set("access_token", data.access, { expires: 7, path: '/' });
        localStorage.setItem("access_token", data.access);

        // On met à jour le header de la requête originale et on la relance
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Si le refresh échoue (ex: refresh_token expiré), on déconnecte tout
        console.error("Session expirée, redirection login...");
        Cookies.remove("access_token", { path: '/' });
        Cookies.remove("refresh_token", { path: '/' });
        localStorage.clear();
        
        if (typeof window !== "undefined") {
          window.location.href = "/account/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;